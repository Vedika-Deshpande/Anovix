import joblib
from sklearn.ensemble import IsolationForest
from sklearn.model_selection import train_test_split
from app.ml.preprocess import load_and_preprocess

def train_model():
    X, y, scaler = load_and_preprocess()

    # Train-test split (stratify taaki fraud ratio dono mein maintain rahe)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Isolation Forest — unsupervised anomaly detection
    # contamination = expected fraud ratio dataset mein
    model = IsolationForest(
        n_estimators=200,
        contamination=0.0017,   # ~0.17% fraud rate (dataset ke hisaab se)
        random_state=42,
        n_jobs=-1
    )

    model.fit(X_train)

    # Model aur scaler save karo
    joblib.dump(model, "app/models/isolation_forest.pkl")
    joblib.dump(scaler, "app/models/scaler.pkl")
    joblib.dump(list(X.columns), "app/models/feature_columns.pkl")

    print("Model trained and saved successfully!")
    print("Training samples:", X_train.shape[0])
    print("Test samples:", X_test.shape[0])

    return model, X_test, y_test

if __name__ == "__main__":
    train_model()