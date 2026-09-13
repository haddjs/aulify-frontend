import { useState } from "react";
import { transactions } from "../constants/transactions";

export default function HomePage() {
  const [balanceVisible, setBalanceVisible] = useState(true);

  const balance = 4823.42;
  const income = 3500;
  const expenses = 1240.58;

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-clay-muted font-bold">Good morning 👋</p>
          <h1 className="text-md font-extrabold text-clay-text m-0">
            Sarah Collins
          </h1>
        </div>
        <div
          className="clay-card flex items-center justify-center w-12 h-12"
          style={{ borderRadius: 16 }}
        >
          <span className="text-md">🔔</span>
        </div>
      </div>

      {/* Main grid: single col on mobile, two cols on lg */}
      <div className="grid grid-cols-1 gap-6">
        {/* LEFT column */}
        <div className="flex flex-col gap-5">
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
                  $
                  {balance.toLocaleString("en-US", {
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
                    {balanceVisible ? `$${s.val.toLocaleString()}` : "••••"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Expense", emoji: "📤", cls: "clay-card-coral" },
              { label: "Income", emoji: "📥", cls: "clay-card-mint" },
              { label: "More", emoji: "⋯", cls: "clay-card-yellow" },
            ].map((action) => (
              <button
                key={action.label}
                className={`${action.cls} flex flex-col items-center justify-center gap-1 border-none cursor-pointer py-3.5 transition-all duration-150 active:translate-y-1`}
              >
                <span className="text-2xl">{action.emoji}</span>
                <span className="text-md font-bold text-clay-text">
                  {action.label}
                </span>
              </button>
            ))}
          </div>

          {/* Transactions — tablet shows 2 cols */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-clay-text m-0">
                Recent Transactions
              </h3>
              <span className="text-sm font-bold text-[#6c4fcf] cursor-pointer">
                See all →
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="clay-card flex items-center gap-3 px-4 py-3"
                >
                  <div
                    className="rounded-2xl w-11 h-11 flex items-center justify-center text-2xl shrink-0"
                    style={{
                      background: tx.color,
                    }}
                  >
                    {tx.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-extrabold text-clay-text m-0">
                      {tx.label}
                    </p>
                    <p className="text-sm text-clay-muted me-1 font-bold">
                      {tx.category}
                    </p>
                  </div>
                  <span
                    className={`${tx.amount > 0 ? `text-[#1db070]` : `text-[#e05050]`} text-md font-extrabold`}
                  >
                    {tx.amount > 0 ? "+" : ""}
                    {tx.amount.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
