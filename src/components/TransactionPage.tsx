import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { createCategory } from "../api/categories";
import { useCategories } from "../hooks/useCategories";
import { useTransactions } from "../hooks/useTransactions";
import CategoryModal from "./CategoryModal";
import type { ModalType, TransactionData } from "./TransactionModal";
import TransactionModal from "./TransactionModal";

const COLORS = [
  { color: "#ffcdc1", shadow: "#f0a090" },
  { color: "#b8dcff", shadow: "#7ab8f0" },
  { color: "#d2c8fc", shadow: "#a090e0" },
  { color: "#feeab0", shadow: "#e0c870" },
  { color: "#d4f5e8", shadow: "#8ed5b5" },
  { color: "#ffd6ec", shadow: "#e0a0c8" },
  { color: "#c8f0ff", shadow: "#80c8e8" },
  { color: "#ffe0b8", shadow: "#e0b880" },
];

type Period = "week" | "month" | "year";
type ViewMode = "expense" | "income";

export default function TransactionPage() {
  const [period, setPeriod] = useState<Period>("month");
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [mode, setMode] = useState<ViewMode>("expense");

  // Modal states matching Homepage pattern
  const [modal, setModal] = useState<ModalType | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Data hooks
  const { transactions, addTransaction } = useTransactions();
  const { categories: rawCategories, addCategoryLocally } = useCategories();

  const now = new Date();
  const monthName = now.toLocaleDateString("id-ID", { month: "long" });
  const monthLabel = now.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  // Filter transactions by selected mode & period
  const filteredTransactions = transactions.filter((tx) => {
    if (tx.type !== mode) return false;
    if (!tx.transaction_date) return false;

    const [y, m, d] = tx.transaction_date.substring(0, 10).split("-").map(Number);
    const txDate = new Date(y, m - 1, d);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (period === "week") {
      const diffDays = (today.getTime() - txDate.getTime()) / (1000 * 3600 * 24);
      return diffDays >= -1 && diffDays <= 7;
    }
    if (period === "month") {
      return (
        txDate.getFullYear() === now.getFullYear() &&
        txDate.getMonth() === now.getMonth()
      );
    }
    if (period === "year") {
      return txDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  // Dynamic Category aggregate for donut chart
  const categorySpending = filteredTransactions.reduce(
    (acc, tx) => {
      const name = tx.category_name ?? "Uncategorized";
      acc[name] = (acc[name] ?? 0) + Number(tx.amount);
      return acc;
    },
    {} as Record<string, number>,
  );

  const chartCategories = Object.entries(categorySpending).map(
    ([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length].color,
      shadows: COLORS[index % COLORS.length].shadow,
    }),
  );

  const total = chartCategories.reduce((sum, c) => sum + c.value, 0);
  const sortedCategories = [...chartCategories].sort((a, b) => b.value - a.value);
  const topCategory = sortedCategories[0];

  // Dynamic Daily Average calculation
  const daysInPeriod =
    period === "week"
      ? 7
      : period === "year"
        ? 365
        : new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  const dailyAverage = total > 0 ? Math.round(total / daysInPeriod) : 0;
  const dailySubtext =
    period === "month"
      ? `${mode === "expense" ? "spent" : "earned"} per day in ${monthName}`
      : `per day this ${period}`;

  // Dynamic 6-month historical trend matching current mode (expense or income)
  const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const targetYear = d.getFullYear();
    const targetMonth = d.getMonth();
    const label = d.toLocaleDateString("id-ID", { month: "short" });

    const monthTotal = transactions
      .filter((tx) => {
        if (tx.type !== mode) return false;
        if (!tx.transaction_date) return false;
        const [y, m] = tx.transaction_date.substring(0, 7).split("-").map(Number);
        return y === targetYear && m - 1 === targetMonth;
      })
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

    return { month: label, total: monthTotal };
  });

  const maxMonthTotal = Math.max(...monthlyTrend.map((ms) => ms.total), 1);

  // Handlers for TransactionModal
  const handleSaveTransaction = async (data: TransactionData) => {
    try {
      await addTransaction(data);
      setModal(null);
    } catch (err) {
      console.error("Failed to create transaction:", err);
    }
  };

  const handleAddCategoryQuick = async ({
    name,
    type,
  }: {
    name: string;
    type: ModalType;
  }) => {
    const newCategory = await createCategory({ name, type });
    addCategoryLocally(newCategory);
    return newCategory;
  };

  // Handler for detailed CategoryModal
  const handleSaveDetailedCategory = async ({
    name,
    type,
  }: {
    name: string;
    type: "expense" | "income";
  }) => {
    const newCategory = await createCategory({ name, type });
    addCategoryLocally(newCategory);
    return newCategory;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-[13px] text-clay-muted font-semibold">
            {monthLabel}
          </p>
          <h1 className="text-[24px] sm:text-[28px] font-black text-clay-text m-0">
            {mode === "expense" ? "Spending Tracker" : "Income Tracker"}
          </h1>
        </div>

        <div className="flex items-center flex-wrap gap-3 self-end sm:self-auto">
          {/* Period toggle for desktop/tablet */}
          <div className="hidden sm:flex clay-card p-1.5 gap-1 rounded-3xl">
            {(["week", "month", "year"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`py-2 px-4 border-none cursor-pointer transition-all duration-200 font-['Nunito',sans-serif] text-[13px] rounded-[18px] ${
                  period === p
                    ? "bg-[linear-gradient(135deg,#6c4fcf_0%,#8866e8_100%)] shadow-[0_4px_0_#4a30a0,0_6px_14px_rgba(80,50,180,0.3)] text-white font-extrabold"
                    : "bg-transparent text-clay-muted font-bold"
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>

          {/* Action button: Detailed Category Modal */}
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="clay-card text-clay-text font-extrabold text-[13px] font-['Nunito',sans-serif] px-4 py-2.5 rounded-[18px] border-none cursor-pointer active:translate-y-0.5 hover:bg-[#ede8f8] flex items-center gap-1.5 shadow-[0_4px_0_#d5c8ef]"
          >
            <span>🏷️</span>
            <span>+ Category</span>
          </button>

          {/* Action button to open Transaction Modal */}
          <button
            onClick={() => setModal(mode)}
            className="bg-[linear-gradient(135deg,#6c4fcf_0%,#8866e8_100%)] text-white font-extrabold text-[13px] font-['Nunito',sans-serif] px-4 py-2.5 rounded-[18px] shadow-[0_4px_0_#4a30a0] border-none cursor-pointer active:translate-y-0.5"
          >
            + Add {mode === "expense" ? "Expense" : "Income"}
          </button>

          {/* Mode Switcher */}
          <div className="flex clay-card p-1.5 gap-1 rounded-3xl">
            <button
              onClick={() => setMode("expense")}
              className={`py-2 px-4 border-none cursor-pointer transition-all duration-200 font-['Nunito',sans-serif] text-[13px] rounded-[18px] font-extrabold ${
                mode === "expense"
                  ? "bg-[linear-gradient(135deg,#ff7660,#ff5a43)] text-white shadow-[0_4px_0_#d43f29]"
                  : "bg-transparent text-clay-muted"
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setMode("income")}
              className={`py-2 px-4 border-none cursor-pointer transition-all duration-200 font-['Nunito',sans-serif] text-[13px] rounded-[18px] font-extrabold ${
                mode === "income"
                  ? "bg-[linear-gradient(135deg,#1db070,#148a50)] text-white shadow-[0_4px_0_#0f683c]"
                  : "bg-transparent text-clay-muted"
              }`}
            >
              Income
            </button>
          </div>
        </div>
      </div>

      {/* Mobile period toggle & quick buttons */}
      <div className="flex sm:hidden flex-col gap-3 mb-5">
        <div className="flex clay-card p-1.5 gap-1 rounded-3xl">
          {(["week", "month", "year"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-2 border-none cursor-pointer transition-all duration-200 font-['Nunito',sans-serif] text-[13px] rounded-[18px] ${
                period === p
                  ? "bg-[linear-gradient(135deg,#6c4fcf_0%,#8866e8_100%)] shadow-[0_4px_0_#4a30a0] text-white font-extrabold"
                  : "bg-transparent text-clay-muted font-bold"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Optimized Desktop Grid Layout (12 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 Cols on desktop): Donut Chart & Highlights */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Donut chart card */}
          <div className="clay-card p-5 flex flex-col items-center gap-3">
            <div className="flex items-center justify-between w-full">
              <h3 className="text-[14px] font-bold text-clay-muted m-0">
                {mode === "expense" ? "Total Spending" : "Total Income"}
              </h3>
              <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-[#ede8f8] text-[#6c4fcf]">
                {period.toUpperCase()}
              </span>
            </div>

            {chartCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-65 gap-2 text-center w-full">
                <div className="w-16 h-16 rounded-full bg-[#f0eaf8] flex items-center justify-center text-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
                  {mode === "expense" ? "💸" : "💰"}
                </div>
                <p className="text-sm font-extrabold text-clay-text m-0">
                  No {mode === "expense" ? "expenses" : "income"} in this {period}
                </p>
                <p className="text-xs text-clay-muted font-semibold m-0">
                  Click below to record your first {mode === "expense" ? "expense" : "income"}
                </p>
                <button
                  onClick={() => setModal(mode)}
                  className="mt-2 px-4 py-2 rounded-xl bg-[linear-gradient(135deg,#6c4fcf_0%,#8866e8_100%)] text-white text-xs font-extrabold cursor-pointer shadow-[0_3px_0_#4a30a0] active:translate-y-0.5 border-none"
                >
                  + Add {mode === "expense" ? "Expense" : "Income"}
                </button>
              </div>
            ) : (
              <div className="relative w-full h-65">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={chartCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={72}
                      outerRadius={105}
                      paddingAngle={4}
                      dataKey="value"
                      onMouseEnter={(_, index) => setActiveIdx(index)}
                      onMouseLeave={() => setActiveIdx(null)}
                      stroke="none"
                    >
                      {chartCategories.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={entry.color}
                          className={`transition-all duration-200 cursor-pointer origin-center ${
                            activeIdx === index ? "scale-105" : "scale-100"
                          }`}
                          style={{
                            filter:
                              activeIdx === index
                                ? `drop-shadow(0 4px 10px ${entry.shadows})`
                                : "none",
                          }}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`,
                        "",
                      ]}
                      contentStyle={{
                        borderRadius: 16,
                        border: "none",
                        boxShadow: "0 8px 24px rgba(100,60,200,0.2)",
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: 700,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  {activeIdx !== null && chartCategories[activeIdx] ? (
                    <>
                      <div className="text-[18px] font-black text-clay-text">
                        Rp {chartCategories[activeIdx].value.toLocaleString("id-ID")}
                      </div>
                      <div className="text-[11px] text-clay-muted font-semibold">
                        {total > 0
                          ? ((chartCategories[activeIdx].value / total) * 100).toFixed(0)
                          : 0}
                        %
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-[11px] text-clay-muted font-bold">
                        {mode === "expense" ? "Total Spent" : "Total Earned"}
                      </div>
                      <div className="text-[24px] font-black text-clay-text">
                        Rp {total.toLocaleString("id-ID")}
                      </div>
                      <div className="text-[11px] text-clay-muted font-semibold">
                        this {period}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Legend */}
            {chartCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center w-full">
                {chartCategories.map((cat) => (
                  <div
                    key={cat.name}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-[20px]"
                    style={{
                      backgroundColor: cat.color,
                      boxShadow: `0 3px 0 ${cat.shadows}`,
                    }}
                  >
                    <span className="text-[11px] font-extrabold text-clay-text">
                      {cat.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stat Insights */}
          <div className="grid grid-cols-2 gap-4">
            <div className="clay-card p-4 flex flex-col justify-between">
              <span className="text-[12px] font-extrabold text-clay-muted">
                Top {mode === "expense" ? "Spending" : "Income"} Category
              </span>
              <div className="flex items-center gap-2 mt-2">
                {topCategory ? (
                  <div>
                    <div className="text-[14px] font-black text-clay-text">
                      {topCategory.name}
                    </div>
                    <div
                      className={`text-[12px] font-bold ${
                        mode === "expense" ? "text-[#e05050]" : "text-[#1db070]"
                      }`}
                    >
                      Rp {topCategory.value.toLocaleString("id-ID")}
                    </div>
                  </div>
                ) : (
                  <span className="text-[13px] font-bold text-clay-muted italic">
                    No data yet
                  </span>
                )}
              </div>
            </div>

            <div className="clay-card p-4 flex flex-col justify-between">
              <span className="text-[12px] font-extrabold text-clay-muted">
                Daily {mode === "expense" ? "Spending" : "Income"}
              </span>
              <div className="mt-2">
                <div className="text-[18px] font-black text-clay-text">
                  Rp {dailyAverage.toLocaleString("id-ID")}
                </div>
                <div className="text-[11px] font-semibold text-clay-muted">
                  {dailySubtext}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols on desktop): Breakdown & Trend */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Category breakdown */}
          <div className="clay-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-extrabold text-clay-text m-0">
                  By Category
                </h3>
                <span className="text-[12px] font-bold text-clay-muted">
                  ({chartCategories.length} {chartCategories.length === 1 ? "Category" : "Categories"})
                </span>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="clay-card px-3 py-1.5 border-none cursor-pointer flex items-center gap-1 text-[12px] font-extrabold text-[#6c4fcf] hover:bg-[#ede8f8] transition-all shadow-[0_2px_0_#d5c8ef] active:translate-y-0.5"
              >
                <span>＋</span> New Category
              </button>
            </div>

            {sortedCategories.length === 0 ? (
              <div className="py-8 text-center text-clay-muted text-[13px] font-semibold">
                No categories found for this period. Click "+ New Category" to create one.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {sortedCategories.map((cat) => (
                  <div
                    key={cat.name}
                    className="bg-[#fcfaff] border border-clay-bg rounded-[20px] px-4 py-3 flex items-center gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                  >
                    <div className="flex-1">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-[13px] font-extrabold text-clay-text">
                          {cat.name}
                        </span>
                        <span className="text-[13px] font-black text-clay-text">
                          Rp {cat.value.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="h-2 bg-clay-bg rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-600 ease-out"
                          style={{
                            width: `${total > 0 ? (cat.value / total) * 100 : 0}%`,
                            backgroundColor: cat.color,
                            boxShadow: `0 2px 0 ${cat.shadows}`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Monthly trend (Dynamic based on Expense / Income) */}
          <div className="clay-card p-5">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-[14px] font-extrabold text-clay-text m-0">
                {mode === "expense"
                  ? "Monthly Spending Trend"
                  : "Monthly Income Trend"}
              </h3>
              <span className="text-[11px] font-bold text-clay-muted">
                Last 6 months
              </span>
            </div>

            <div className="flex items-end gap-2.5 h-32 pt-4">
              {monthlyTrend.map((m, i) => {
                const pct = (m.total / maxMonthTotal) * 100;
                const isLast = i === monthlyTrend.length - 1;

                return (
                  <div
                    key={m.month}
                    className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative"
                  >
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 bg-white px-2 py-0.5 rounded-lg text-[10px] font-extrabold text-clay-text shadow-[0_2px_6px_rgba(0,0,0,0.1)] pointer-events-none whitespace-nowrap z-10">
                      Rp {m.total.toLocaleString("id-ID")}
                    </div>

                    <div
                      className={`w-full min-h-3 rounded-t-lg rounded-b-sm transition-all duration-400 ease-out cursor-pointer ${
                        isLast
                          ? mode === "expense"
                            ? "bg-[linear-gradient(180deg,#ff7660,#e05050)] shadow-[0_4px_0_#c03030]"
                            : "bg-[linear-gradient(180deg,#20c978,#148a50)] shadow-[0_4px_0_#0f683c]"
                          : mode === "expense"
                            ? "bg-[#ffd8ce] shadow-[0_3px_0_#f0a090] hover:bg-[#ffcdc1]"
                            : "bg-[#d4f5e8] shadow-[0_3px_0_#8ed5b5] hover:bg-[#c0eed9]"
                      }`}
                      style={{ height: `${Math.max(pct, 4)}%` }}
                    />
                    <span
                      className={`text-[10px] font-bold ${
                        isLast
                          ? mode === "expense"
                            ? "text-[#e05050]"
                            : "text-[#148a50]"
                          : "text-clay-muted"
                      }`}
                    >
                      {m.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Modal (for adding expense/income) */}
      {modal && (
        <TransactionModal
          type={modal}
          categories={rawCategories}
          onClose={() => setModal(null)}
          onSave={handleSaveTransaction}
          onAddCategory={handleAddCategoryQuick}
        />
      )}

      {/* Detailed Category Creation Modal */}
      {isCategoryModalOpen && (
        <CategoryModal
          initialType={mode}
          existingCategories={rawCategories}
          onClose={() => setIsCategoryModalOpen(false)}
          onSave={handleSaveDetailedCategory}
        />
      )}
    </div>
  );
}
