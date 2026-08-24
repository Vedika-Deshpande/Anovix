import pandas as pd
from sklearn.preprocessing import StandardScaler

def load_and_preprocess(path="data/creditcard.csv"):
    df = pd.read_csv(path)

    # Amount aur Time ko scale karo (V1-V28 already PCA-scaled hain)
    scaler = StandardScaler()
    df["scaled_amount"] = scaler.fit_transform(df["Amount"].values.reshape(-1, 1))
    df["scaled_time"] = scaler.fit_transform(df["Time"].values.reshape(-1, 1))

    df = df.drop(["Amount", "Time"], axis=1)

    # Features aur label alag karo
    X = df.drop("Class", axis=1)
    y = df["Class"]

    return X, y, scaler

if __name__ == "__main__":
    X, y, scaler = load_and_preprocess()
    print("Features shape:", X.shape)
    print("Fraud cases:", y.sum())