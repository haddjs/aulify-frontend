import { useState } from "react";
import { createCategory } from "../api/categories";
import { useAuth } from "../context/AuthContext";
import { useCategories } from "../hooks/useCategories";
import { useTransactions } from "../hooks/useTransactions";
import type { TransactionData } from "./TransactionModal";
import TransactionModal, { type ModalType } from "./TransactionModal";

export default function HomePage() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [modal, setModal] = useState<ModalType | null>(null);
  const { categories, addCategoryLocally } = useCategories();
  const { user, logout } = useAuth();
  const {
    transactions,
    balance: balanceData,
    addTransaction,
  } = useTransactions();

  const balance = Number(balanceData?.balance ?? 0);
  const income = Number(balanceData?.total_income ?? 0);
  const expenses = Number(balanceData?.total_expense ?? 0);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  async function handleAddCategory({
    name,
    type,
  }: {
    name: string;
    type: ModalType;
  }) {
    try {
      const newCategory = await createCategory({ name, type });

      addCategoryLocally(newCategory);

      return newCategory;
    } catch (err) {
      console.error("Failed to add category:", err);
      throw err;
    }
  }

  async function handleSaveTransaction(data: TransactionData) {
    try {
      await addTransaction(data);

      setModal(null);
    } catch (err) {
      console.error("Failed to create transaction:", err);
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-clay-muted font-bold">{greeting} 👋</p>
          <h1 className="text-md font-extrabold text-clay-text m-0">
            {user?.name ?? "User"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={logout}
            title="Log out"
            className="md:hidden clay-card flex items-center justify-center w-11 h-11 border-none cursor-pointer text-clay-muted hover:text-[#e05050] active:translate-y-0.5"
            style={{ borderRadius: 16 }}
          >
            <span className="text-md">🚪</span>
          </button>
          <div
            className="clay-card flex items-center justify-center w-11 h-11"
            style={{ borderRadius: 16 }}
          >
            <span className="text-md">🔔</span>
          </div>
        </div>
      </div>

      {/* Main grid: single col on mobile, two cols on lg */}
      <div className="grid grid-cols-1 gap-6">
        {/* LEFT column */}
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
          {/* Balance Card */}
          <div className="clay-card-purple flex flex-col gap-3 p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#ffffffb3]">
                Total Balance
              </span>
              <button
                onClick={() => setBalanceVisible((v) => !v)}
                className="bg-white/25 border-none rounded-xl px-3 py-2 cursor-pointer font-bold text-white text-xs"
              >
                {balanceVisible ? "👁 Hide" : "👁‍🗨 Show"}
              </button>
            </div>

            <div className="min-h-13">
              {balanceVisible ? (
                <h2 className="font-extrabold text-4xl text-white m-0 tracking-[-1px]">
                  Rp{" "}
                  {balance.toLocaleString("id-ID", {
                    minimumFractionDigits: 2,
                  })}
                </h2>
              ) : (
                <h2 className="font-extrabold text-4xl text-white m-0 tracking-[4px]">
                  ••••••
                </h2>
              )}
            </div>

            <div className="flex gap-4 mt-1">
              {[
                { label: "↑ Income", val: income },
                { label: "↓ Expenses", val: expenses },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white/25 rounded-2xl px-4 py-2.5 flex-1"
                >
                  <p className="text-xs text-white/50 font-bold m-0">
                    {s.label}
                  </p>
                  <p className="text-xl text-white font-extrabold mt-1">
                    {balanceVisible ? `Rp ${s.val.toLocaleString()}` : "••••"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="grid grid-cols-1 gap-10">
              {[
                {
                  label: "Expense",
                  emoji: "📤",
                  cls: "clay-card-coral",
                  modal: "expense" as ModalType,
                },
                {
                  label: "Income",
                  emoji: "📥",
                  cls: "clay-card-mint",
                  modal: "income" as ModalType,
                },
              ].map((action) => (
                <button
                  key={action.label}
                  className={`${action.cls} flex flex-col items-center justify-center gap-1 border-none cursor-pointer py-3.5 transition-all duration-150 active:translate-y-1`}
                  onClick={() => setModal(action.modal)}
                >
                  <span className="text-2xl">{action.emoji}</span>
                  <span className="text-md font-bold text-clay-text">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Transactions — tablet shows 2 cols */}
        </div>
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-clay-text m-0">
              Recent Transactions
            </h3>
            <a
              href="/transactions"
              className="text-sm font-bold text-[#6c4fcf] cursor-pointer"
            >
              See all →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
            {transactions.slice(0, 6).map((tx) => {
              const isIncome = tx.type === "income";
              return (
                <div
                  key={tx.id}
                  className="clay-card flex items-center gap-3 px-4 py-3"
                >
                  <div className="flex-1">
                    <p className="text-sm font-extrabold text-clay-text m-0">
                      {tx.category_name ?? "Uncategorized"}
                    </p>
                    <p className="text-sm text-clay-muted me-1 font-bold">
                      {tx.note}
                    </p>
                  </div>
                  <span
                    className={`${isIncome ? `text-[#1db070]` : `text-[#e05050]`} text-md font-extrabold`}
                  >
                    {isIncome ? "+" : "-"}
                    {" Rp "}
                    {Number(tx.amount).toLocaleString("id-ID")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {modal && (
        <TransactionModal
          type={modal}
          categories={categories}
          onClose={() => setModal(null)}
          onSave={handleSaveTransaction}
          onAddCategory={handleAddCategory}
        />
      )}
    </div>
  );
}
