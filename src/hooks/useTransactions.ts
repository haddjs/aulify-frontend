import { useCallback, useEffect, useState } from "react";
import {
  createTransaction,
  getBalance,
  getTransaction,
} from "../api/transactions";
import type { TransactionData } from "../components/TransactionModal";

export interface Transaction {
  id: string;
  user_id: string;
  amount: number | string;
  type: "income" | "expense";
  category_id?: string | null;
  category_name?: string | null;
  note: string | null;
  transaction_date: string;
}

export interface Balance {
  total_income: number | string;
  total_expense: number | string;
  balance: number | string;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [txList, bal] = await Promise.all([getTransaction(), getBalance()]);

      setTransactions(txList);
      setBalance(bal);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addTransaction = async (data: TransactionData) => {
    const res = await createTransaction(data);
    await refresh();

    return res;
  };

  return {
    transactions,
    balance,
    loading,
    error,
    refresh,
    addTransaction,
  };
}
