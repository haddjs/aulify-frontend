import type { TransactionData } from "../components/TransactionModal";

export async function createTransaction(data: TransactionData) {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(`Failed to create transaction: ${res.status}`);

  return res.json();
}

export async function getTransaction() {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/transactions`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch transaction");

  return res.json();
}

export async function getBalance() {
  const res = await fetch(
    `${import.meta.env.VITE_BASE_URL}/transactions/balance`,
    {
      credentials: "include",
    },
  );

  if (!res.ok) throw new Error("Failed to fetch balance");
  return res.json();
}

export async function updateTransaction(
  id: string,
  data: Partial<TransactionData>,
) {
  const res = await fetch(
    `${import.meta.env.VITE_BASE_URL}/transactions/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    },
  );

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(
      errorBody?.message || `Failed to update transaction: ${res.status}`,
    );
  }

  return res.json();
}

