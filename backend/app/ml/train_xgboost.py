import joblib
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, classification_report
from app.ml.preprocess import load_and_preprocess


def train_xgboost_model():
    X, y, scaler = load_and_preprocess()

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # XGBoost — supervised classification
    model = xgb.XGBClassifier(
        n_estimators=200,
        max_depth=5,
        learning_rate=0.1,
        scale_pos_weight=(y_train == 0).sum() / (y_train == 1).sum(),
        eval_metric="auc",
        random_state=42,
    )

    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]

    roc_auc = roc_auc_score(y_test, y_pred_proba)

    print("=" * 50)
    print("XGBoost Model Evaluation")
    print("=" * 50)
    print(f"ROC-AUC Score: {roc_auc:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    joblib.dump(model, "app/models/xgboost_model.pkl")
    joblib.dump(list(X.columns), "app/models/xgboost_feature_columns.pkl")

    print("\nModel saved successfully as xgboost_model.pkl")

    return model, roc_auc


if __name__ == "__main__":
    train_xgboost_model()