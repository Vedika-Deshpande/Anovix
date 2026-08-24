from fastapi import Depends
from app.routers.auth import require_role
from fastapi import APIRouter, File, UploadFile
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.schemas import TransactionInput
from app.ml.predict import predict_transaction, explain_transaction, generate_summary, check_location_risk, check_device_risk
from app.db import supabase
import csv
import io
import pandas as pd

router = APIRouter()


class FeedbackInput(BaseModel):
    feedback: str


@router.post("/transaction")
def analyze_transaction(transaction: TransactionInput):
    data = transaction.dict()

    ml_data = {k: v for k, v in data.items() if k not in [
        "home_latitude", "home_longitude", "current_latitude", "current_longitude",
        "known_device_id", "current_device_id", "merchant_id"
    ]}

    result = predict_transaction(ml_data)
    explanation = explain_transaction(ml_data)

    location_risk = check_location_risk(
        data.get("home_latitude"),
        data.get("home_longitude"),
        data.get("current_latitude"),
        data.get("current_longitude"),
    )

    device_risk = check_device_risk(
        data.get("known_device_id"),
        data.get("current_device_id"),
    )

    final_risk_score = result["risk_score"]
    if location_risk["unfamiliar_location"]:
        final_risk_score = min(100, final_risk_score + 20)
    if device_risk["device_mismatch"]:
        final_risk_score = min(100, final_risk_score + 15)

    summary = generate_summary(explanation, final_risk_score, result["is_fraud"], language="English")

    record = {
        "amount": data["Amount"],
        "risk_score": final_risk_score,
        "is_flagged": result["is_fraud"],
        "explanation": explanation,
        "latitude": data.get("current_latitude"),
        "longitude": data.get("current_longitude"),
        "device_id": data.get("current_device_id"),
        "merchant_id": data.get("merchant_id"),
    }
    insert_response = supabase.table("transactions").insert(record).execute()
    transaction_id = insert_response.data[0]["id"]

    return {
        "transaction_id": transaction_id,
        "is_fraud": result["is_fraud"],
        "risk_score": final_risk_score,
        "explanation": explanation,
        "summary": summary,
        "location_risk": location_risk,
        "device_risk": device_risk
    }


@router.get("/transactions")
def get_transactions(limit: int = 20):
    response = (
        supabase.table("transactions")
        .select("*")
        .order("timestamp", desc=True)
        .limit(limit)
        .execute()
    )
    return response.data


@router.get("/merchant-risk/{merchant_id}")
def get_merchant_risk(merchant_id: str, user=Depends(require_role(["merchant"]))):
    response = (
        supabase.table("transactions")
        .select("*")
        .eq("merchant_id", merchant_id)
        .eq("is_flagged", True)
        .execute()
    )

    flagged_count = len(response.data)
    is_high_risk = flagged_count >= 3

    return {
        "merchant_id": merchant_id,
        "flagged_transactions": flagged_count,
        "is_high_risk": is_high_risk
    }


@router.post("/transaction/{transaction_id}/feedback")
def submit_feedback(transaction_id: str, feedback_input: FeedbackInput):
    supabase.table("transactions").update(
        {"feedback": feedback_input.feedback}
    ).eq("id", transaction_id).execute()

    return {"transaction_id": transaction_id, "feedback": feedback_input.feedback, "status": "saved"}


@router.get("/report/flagged")
def download_flagged_report():
    response = (
        supabase.table("transactions")
        .select("*")
        .eq("is_flagged", True)
        .order("timestamp", desc=True)
        .execute()
    )

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Transaction ID", "Amount", "Risk Score", "Merchant ID", "Device ID", "Timestamp", "Feedback"])

    for row in response.data:
        writer.writerow([
            row.get("id"),
            row.get("amount"),
            row.get("risk_score"),
            row.get("merchant_id"),
            row.get("device_id"),
            row.get("timestamp"),
            row.get("feedback"),
        ])

    output.seek(0)
    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=flagged_transactions_report.csv"}
    )


@router.post("/batch-analyze")
async def batch_analyze(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))

    results = []
    flagged_count = 0

    for index, row in df.iterrows():
        transaction_dict = row.to_dict()

        ml_data = {}
        for key in ["Time", "Amount"] + [f"V{i}" for i in range(1, 29)]:
            ml_data[key] = transaction_dict.get(key)

        result = predict_transaction(ml_data)

        if result["is_fraud"]:
            flagged_count += 1

        results.append({
            "row_index": int(index),
            "amount": transaction_dict.get("Amount"),
            "is_fraud": result["is_fraud"],
            "risk_score": result["risk_score"]
        })

    return {
        "total_transactions": len(df),
        "flagged_transactions": flagged_count,
        "results": results
    }
class PlaygroundInput(BaseModel):
    amount: float
    location: str
    time: str  # format "HH:MM"


CITY_COORDINATES = {
    "mumbai": (19.0760, 72.8777),
    "delhi": (28.7041, 77.1025),
    "pune": (18.5204, 73.8567),
    "bangalore": (12.9716, 77.5946),
    "kolkata": (22.5726, 88.3639),
    "chennai": (13.0827, 80.2707),
    "hyderabad": (17.3850, 78.4867),
}


@router.post("/playground-transaction")
def playground_transaction(data: PlaygroundInput):
    import random

    hour = int(data.time.split(":")[0])
    time_seconds = hour * 3600

    ml_data = {"Time": time_seconds, "Amount": data.amount}
    for i in range(1, 29):
        ml_data[f"V{i}"] = random.uniform(-2, 2)

    if data.amount > 30000:
        ml_data["V14"] = -6.5
        ml_data["V12"] = -5.5
    if hour <= 5:
        ml_data["V11"] = 4.5

    result = predict_transaction(ml_data)
    explanation = explain_transaction(ml_data)

    home = CITY_COORDINATES.get("mumbai")
    current = CITY_COORDINATES.get(data.location.lower(), home)
    location_risk = check_location_risk(home[0], home[1], current[0], current[1])

    final_risk_score = result["risk_score"]
    if location_risk["unfamiliar_location"]:
        final_risk_score = min(100, final_risk_score + 20)

    summary = generate_summary(explanation, final_risk_score, result["is_fraud"], language="English")

    record = {
        "amount": data.amount,
        "risk_score": final_risk_score,
        "is_flagged": result["is_fraud"],
        "explanation": explanation,
        "location": data.location,
    }
    insert_response = supabase.table("transactions").insert(record).execute()
    transaction_id = insert_response.data[0]["id"]

    return {
        "transaction_id": transaction_id,
        "is_fraud": result["is_fraud"],
        "risk_score": final_risk_score,
        "explanation": explanation,
        "summary": summary,
        "location_risk": location_risk
    }
@router.get("/merchant/my-transactions")
def get_my_merchant_transactions(user=Depends(require_role(["merchant"]))):
    merchant_id = user.id
    response = (
        supabase.table("transactions")
        .select("*")
        .eq("merchant_id", merchant_id)
        .execute()
    )
    return response.data