export const BASE_URL = "https://anovix.onrender.com";

export async function analyzeTransaction(transactionData) {
  const response = await fetch(`${BASE_URL}/transaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transactionData),
  });

  if (!response.ok) {
    throw new Error("Failed to analyze transaction");
  }

  return response.json();
}

export async function getTransactions(limit = 20) {
  const response = await fetch(`${BASE_URL}/transactions?limit=${limit}`);
  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }
  return response.json();
}

export async function playgroundTransaction({ amount, location, time }) {
  const response = await fetch(`${BASE_URL}/playground-transaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount: Number(amount), location, time }),
  });

  if (!response.ok) {
    throw new Error("Failed to analyze transaction");
  }

  const data = await response.json();

  return {
    score: data.risk_score,
    isFraud: data.is_fraud,
    reasons: data.summary ? [data.summary] : [],
  };
}

export async function submitFeedback(transactionId, feedback) {
  const response = await fetch(`${BASE_URL}/transaction/${transactionId}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ feedback }),
  });
  if (!response.ok) {
    throw new Error("Failed to submit feedback");
  }
  return response.json();
}