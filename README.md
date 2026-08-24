Anovix — AI-Powered Financial Fraud Detection System

Team MarshalX | All India Hackathon (AIH) 2026

Making digital finance safer, one transaction at a time.

🔍 Overview

Anovix is a real-time, explainable fraud detection platform that analyzes transaction patterns, flags suspicious activity instantly, and explains why a transaction was flagged — not just that it was.

India processes 22–23 billion UPI transactions monthly, and traditional rule-based fraud systems fail to catch evolving fraud patterns while generating too many false positives. Anovix solves this with a machine learning model backed by explainable AI, so financial institutions can trust — and act on — every alert.

✨ Key Features
Real-time anomaly detection — every transaction analyzed the moment it happens
AI-powered risk scoring — Isolation Forest model trained on real-world fraud patterns, scoring each transaction 0–100
Explainable AI (XAI) — SHAP-based breakdown of the top reasons behind every flag (no black-box decisions)
Natural-language summaries — Groq API converts technical SHAP output into plain-English explanations
Location intelligence — flags transactions occurring far from a user's usual location (Geopy distance calculation)
Device mismatch detection — flags transactions from an unrecognized device
Transaction history — every analyzed transaction is stored and retrievable via API
Live Fraud Playground (planned) — a frontend interface where users can submit their own transactions and see detection happen in real time
🏗️ Tech Stack
Layer	Technology
Frontend	React.js, Vite, Tailwind CSS, Recharts
Backend	FastAPI (Python)
Database	PostgreSQL (Supabase)
Machine Learning	Scikit-learn (Isolation Forest), Pandas
Explainability	SHAP (SHapley Additive Explanations)
Location Intelligence	Geopy
AI Layer	Groq API (natural-language fraud summaries)
Deployment	Vercel (Frontend) + Render (Backend)
📁 Project Structure
Anovix/
├── backend/
│   ├── app/
│   │   ├── main.py                # FastAPI app entrypoint
│   │   ├── db.py                  # Supabase client setup
│   │   ├── schemas.py             # Pydantic request models
│   │   ├── models/                # Saved ML model artifacts (.pkl)
│   │   ├── routers/
│   │   │   └── transactions.py    # /transaction and /transactions endpoints
│   │   └── ml/
│   │       ├── preprocess.py      # Dataset loading + preprocessing
│   │       ├── train.py           # Model training script
│   │       └── predict.py         # Prediction, SHAP explanation, Groq summary, location/device risk
│   ├── data/
│   │   └── creditcard.csv         # Training dataset
│   ├── requirements.txt
│   └── .env                       # Environment variables (not committed)
└── frontend/                      # React + Vite frontend (in progress)
⚙️ Setup Instructions
1. Clone the repository
bash
git clone <repo-url>
cd Anovix/backend
2. Create and activate a virtual environment
bash
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # macOS/Linux
3. Install dependencies
bash
pip install -r requirements.txt
4. Configure environment variables

Create a .env file in the backend/ folder:

SUPABASE_URL=your-supabase-project-url
SUPABASE_KEY=your-supabase-anon-key
GROQ_API_KEY=your-groq-api-key
5. Set up the database

In Supabase, create a transactions table with the following columns:

Column	Type
id	uuid (primary key)
user_id	text
amount	numeric
location	text
latitude	float8
longitude	float8
device_id	text
timestamp	timestamptz
risk_score	float8
is_flagged	boolean
explanation	jsonb
6. Train the model
bash
python -m app.ml.train

This generates isolation_forest.pkl, scaler.pkl, and feature_columns.pkl inside app/models/.

7. Run the API server
bash
uvicorn app.main:app --reload

The API will be available at http://127.0.0.1:8000, with interactive docs at http://127.0.0.1:8000/docs.

📡 API Endpoints
POST /transaction

Analyzes a single transaction and returns a risk score, explanation, and natural-language summary.

Request body:

json
{
  "Time": 4462,
  "Amount": 239.93,
  "V1": -1.5,
  "...": "...V2 through V28...",
  "home_latitude": 19.0760,
  "home_longitude": 72.8777,
  "current_latitude": 28.7041,
  "current_longitude": 77.1025,
  "known_device_id": "device_abc123",
  "current_device_id": "device_xyz999"
}

Response:

json
{
  "is_fraud": false,
  "risk_score": 70.47,
  "explanation": [
    {"feature": "V12", "impact": -0.7638},
    {"feature": "V14", "impact": -0.562},
    {"feature": "V10", "impact": -0.4865}
  ],
  "summary": "The transaction's low-risk indicators suggest it is likely legitimate.",
  "location_risk": {"distance_km": 1149.61, "unfamiliar_location": true},
  "device_risk": {"device_mismatch": true}
}
GET /transactions?limit=20

Returns the most recent analyzed transactions, ordered by timestamp.

🧠 How It Works
Data ingestion — incoming transaction data is received via the API in real time
Model inference — an Isolation Forest model compares the transaction against learned historical patterns
Risk scoring — the model's anomaly score is converted into a 0–100 risk score
Explainability — SHAP identifies the top contributing features behind the decision
Natural-language summary — the Groq API converts SHAP output into a plain-English explanation
Contextual risk factors — location distance and device mismatch checks adjust the final risk score
Storage — the full result is saved to Supabase for historical tracking and dashboard display
📊 Dataset

Trained on the Kaggle Credit Card Fraud Detection dataset — 284,807 transactions, 492 of which are fraudulent (~0.17%), with anonymized PCA-transformed features (V1–V28) alongside Time and Amount.

👥 Team MarshalX
Vedika Deshpande — Team Lead, UI/UX Design & Frontend
Hrudaya Gorwadkar — Backend Development: FastAPI, ML model (Isolation Forest), SHAP explainability, Groq AI integration, location & device intelligence
Gargi Pathak — Database Design & Setup (Supabase)
🎯 Roadmap
 Core ML pipeline (Isolation Forest + SHAP)
 Groq-powered natural-language explanations
 Location intelligence
 Device mismatch detection
 Supabase persistence
 Frontend dashboard + Live Fraud Playground
 Deployment (Vercel + Render)