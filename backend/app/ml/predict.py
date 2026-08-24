import os
from dotenv import load_dotenv
from groq import Groq
from geopy.distance import geodesic
import joblib
import shap
import pandas as pd
import numpy as np

load_dotenv()
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

model = joblib.load("app/models/isolation_forest.pkl")
scaler = joblib.load("app/models/scaler.pkl")
feature_columns = joblib.load("app/models/feature_columns.pkl")


def predict_transaction(transaction: dict):
    df = pd.DataFrame([transaction])
    df["scaled_amount"] = scaler.transform(df["Amount"].values.reshape(-1, 1))
    df["scaled_time"] = scaler.transform(df["Time"].values.reshape(-1, 1))
    df = df.drop(["Amount", "Time"], axis=1)
    df = df[feature_columns]

    prediction = model.predict(df)[0]
    score = model.decision_function(df)[0]

    risk_score = round((1 - (score + 0.5)) * 100, 2)
    risk_score = max(0, min(100, risk_score))
    is_fraud = prediction == -1

    return {"is_fraud": bool(is_fraud), "risk_score": risk_score}


def explain_transaction(transaction: dict):
    df = pd.DataFrame([transaction])
    df["scaled_amount"] = scaler.transform(df["Amount"].values.reshape(-1, 1))
    df["scaled_time"] = scaler.transform(df["Time"].values.reshape(-1, 1))
    df = df.drop(["Amount", "Time"], axis=1)
    df = df[feature_columns]

    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(df)

    feature_impact = list(zip(feature_columns, shap_values[0]))
    feature_impact.sort(key=lambda x: abs(x[1]), reverse=True)
    top_reasons = feature_impact[:3]

    explanation = []
    for f, v in top_reasons:
        explanation.append({"feature": f, "impact": round(float(v), 4)})

    return explanation


def generate_summary(explanation, risk_score, is_fraud, language="English"):
    reasons_list = []
    for item in explanation:
        f = item["feature"]
        v = str(item["impact"])
        reasons_list.append(f + " (impact: " + v + ")")

    reasons_text = ", ".join(reasons_list)
    status_word = "suspicious" if is_fraud else "normal"

    line1 = "A transaction was analyzed by a fraud detection system."
    line2 = "Risk score: " + str(risk_score) + "/100."
    line3 = "Flagged as fraud: " + str(is_fraud) + "."
    line4 = "Top factors: " + reasons_text + "."
    line5 = "Write ONE short sentence (max 25 words) in " + language + "."
    line6 = "Explain why this transaction looks " + status_word + "."
    line7 = "Do not mention feature codes like V12 or V14. Respond only in " + language + "."

    prompt = line1 + " " + line2 + " " + line3 + " " + line4
    prompt = prompt + " " + line5 + " " + line6 + " " + line7

    response = groq_client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500,
    )
    return response.choices[0].message.content.strip()


def check_location_risk(home_lat, home_lon, current_lat, current_lon):
    if None in [home_lat, home_lon, current_lat, current_lon]:
        return {"distance_km": None, "unfamiliar_location": False}

    home = (home_lat, home_lon)
    current = (current_lat, current_lon)
    distance = geodesic(home, current).km

    unfamiliar = distance > 100

    return {"distance_km": round(distance, 2), "unfamiliar_location": unfamiliar}


def check_device_risk(known_device_id, current_device_id):
    if known_device_id is None or current_device_id is None:
        return {"device_mismatch": False}

    mismatch = known_device_id != current_device_id
    return {"device_mismatch": mismatch}


if __name__ == "__main__":
    sample = pd.read_csv("data/creditcard.csv").iloc[5].to_dict()

    result = predict_transaction(sample)
    print("Sample transaction result:", result)
    print("Actual label (0=genuine, 1=fraud):", sample["Class"])

    explanation = explain_transaction(sample)
    print("Top reasons:", explanation)

    summary_en = generate_summary(explanation, result["risk_score"], result["is_fraud"], language="English")
    print("Summary (English):", summary_en)

    summary_hi = generate_summary(explanation, result["risk_score"], result["is_fraud"], language="Hindi")
    print("Summary (Hindi):", summary_hi)

    location_result = check_location_risk(19.0760, 72.8777, 28.7041, 77.1025)
    print("Location risk (Mumbai to Delhi):", location_result)

    device_result = check_device_risk("device_abc123", "device_xyz999")
    print("Device risk (different devices):", device_result)