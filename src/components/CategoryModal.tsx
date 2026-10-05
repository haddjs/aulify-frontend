import { useEffect, useState } from "react";
import type { Category } from "../hooks/useCategories";

export type CategoryType = "expense" | "income";

interface Props {
  initialType?: CategoryType;
  existingCategories?: Category[];
  onClose: () => void;
  onSave: (category: {
    name: string;
    type: CategoryType;
  }) => Promise<Category>;
}

const EXPENSE_EMOJIS = [
  { emoji: "🍔", label: "Food" },
  { emoji: "🛒", label: "Groceries" },
  { emoji: "☕", label: "Coffee" },
  { emoji: "🚗", label: "Transport" },
  { emoji: "🏠", label: "Housing" },
  { emoji: "💡", label: "Bills" },
  { emoji: "🛍️", label: "Shopping" },
  { emoji: "🎮", label: "Gaming" },
  { emoji: "🎬", label: "Entertainment" },
  { emoji: "💊", label: "Health" },
  { emoji: "🏋️", label: "Fitness" },
  { emoji: "✈️", label: "Travel" },
  { emoji: "📚", label: "Education" },
  { emoji: "🐾", label: "Pets" },
  { emoji: "🎁", label: "Gifts" },
  { emoji: "👕", label: "Clothing" },
];

const INCOME_EMOJIS = [
  { emoji: "💼", label: "Salary" },
  { emoji: "💻", label: "Freelance" },
  { emoji: "📈", label: "Investments" },
  { emoji: "🏢", label: "Business" },
  { emoji: "💰", label: "Dividends" },
  { emoji: "🎁", label: "Bonus" },
  { emoji: "🏷️", label: "Cashback" },
  { emoji: "🤝", label: "Referral" },
  { emoji: "🏦", label: "Interest" },
  { emoji: "💵", label: "Allowance" },
  { emoji: "🪙", label: "Crypto" },
  { emoji: "🏆", label: "Prize" },
];

export default function CategoryModal({
  initialType = "expense",
  existingCategories = [],
  onClose,
  onSave,
}: Props) {
  const [type, setType] = useState<CategoryType>(initialType);
  const [name, setName] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState(
    initialType === "expense" ? "🍔" : "💼",
  );
  const [includeEmojiInName, setIncludeEmojiInName] = useState(true);
  const [note, setNote] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isExpense = type === "expense";
  const emojiList = isExpense ? EXPENSE_EMOJIS : INCOME_EMOJIS;

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  // Update default emoji if type changes and user hasn't explicitly customized name
  const handleTypeChange = (newType: CategoryType) => {
    setType(newType);
    setError(null);
    if (newType === "expense") {
      setSelectedEmoji("🍔");
    } else {
      setSelectedEmoji("💼");
    }
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 260);
  };

  // Formatted category name with or without emoji
  const finalCategoryName = (
    includeEmojiInName && selectedEmoji ? `${selectedEmoji} ${name.trim()}` : name.trim()
  ).slice(0, 32);

  // Check if category name already exists in current type
  const isDuplicate = existingCategories.some(
    (c) =>
      c.type === type &&
      c.name.trim().toLowerCase() === finalCategoryName.trim().toLowerCase(),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError("Please enter a category name");
      return;
    }

    if (isDuplicate) {
      setError(`A ${type} category named "${finalCategoryName}" already exists`);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSave({
        name: finalCategoryName,
        type,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center transition-all duration-260 ease-out ${
        visible
          ? "bg-clay-text/35 backdrop-blur-xs"
          : "bg-transparent backdrop-blur-none"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-125 max-h-[92vh] overflow-y-auto bg-[#f8f4ff] rounded-t-4xl sm:rounded-4xl shadow-[0_-8px_40px_rgba(100,60,200,0.2)] pb-8 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-[#d5c8ef] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-3 pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center text-[22px] ${
                isExpense
                  ? "bg-[#ffd8ce] shadow-[0_5px_0_#f0a090]"
                  : "bg-[#d4f5e8] shadow-[0_5px_0_#8ed5b5]"
              }`}
            >
              🏷️
            </div>
            <div>
              <div className="text-[20px] font-black text-clay-text">
                New Category
              </div>
              <div className="text-[12px] text-clay-muted font-semibold">
                Organize your {isExpense ? "expenses" : "income"} in detail
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-9 h-9 bg-[#ede8f8] border-none rounded-xl text-[18px] cursor-pointer flex items-center justify-center shadow-[0_3px_0_#d5c8ef] active:translate-y-0.5"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 flex flex-col gap-4">
          {/* Type Switcher */}
          <div>
            <label className="text-[13px] font-extrabold text-clay-text block mb-2">
              Category Type
            </label>
            <div className="clay-card p-1.5 flex gap-2 rounded-2xl">
              <button
                type="button"
                onClick={() => handleTypeChange("expense")}
                className={`flex-1 py-2.5 px-4 border-none cursor-pointer rounded-xl font-['Nunito',sans-serif] text-[13px] font-extrabold transition-all duration-200 flex items-center justify-center gap-2 ${
                  isExpense
                    ? "bg-[linear-gradient(135deg,#ff7660,#ff5a43)] text-white shadow-[0_4px_0_#d43f29]"
                    : "bg-transparent text-clay-muted"
                }`}
              >
                <span>📤</span> Expense
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange("income")}
                className={`flex-1 py-2.5 px-4 border-none cursor-pointer rounded-xl font-['Nunito',sans-serif] text-[13px] font-extrabold transition-all duration-200 flex items-center justify-center gap-2 ${
                  !isExpense
                    ? "bg-[linear-gradient(135deg,#1db070,#148a50)] text-white shadow-[0_4px_0_#0f683c]"
                    : "bg-transparent text-clay-muted"
                }`}
              >
                <span>📥</span> Income
              </button>
            </div>
          </div>

          {/* Category Icon / Emoji Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[13px] font-extrabold text-clay-text">
                Category Icon
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-[12px] font-bold text-clay-muted">
                <input
                  type="checkbox"
                  checked={includeEmojiInName}
                  onChange={(e) => setIncludeEmojiInName(e.target.checked)}
                  className="accent-[#6c4fcf] rounded"
                />
                Include icon in name
              </label>
            </div>

            <div className="bg-white rounded-2xl p-3 shadow-[0_4px_0_#d5c8ef,inset_0_1px_0_rgba(255,255,255,0.9)]">
              <div className="grid grid-cols-8 gap-2">
                {emojiList.map((item) => (
                  <button
                    key={item.emoji}
                    type="button"
                    onClick={() => {
                      setSelectedEmoji(item.emoji);
                      if (!name) setName(item.label);
                    }}
                    title={item.label}
                    className={`h-9 w-full rounded-xl border-none cursor-pointer text-[18px] flex items-center justify-center transition-all ${
                      selectedEmoji === item.emoji
                        ? "bg-[#ede8f8] scale-110 shadow-[0_2px_0_#8866e8] ring-2 ring-[#8866e8]"
                        : "bg-transparent hover:bg-[#f6f2fd] active:scale-95"
                    }`}
                  >
                    {item.emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Name Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[13px] font-extrabold text-clay-text">
                Category Name
              </label>
              <span className="text-[11px] font-bold text-clay-muted">
                {finalCategoryName.length}/32
              </span>
            </div>
            <div className="bg-white rounded-2xl px-4 py-1.5 shadow-[0_6px_0_#d5c8ef,0_10px_20px_rgba(139,100,200,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] flex items-center gap-3">
              <span className="text-[20px] select-none">{selectedEmoji}</span>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                maxLength={28}
                placeholder={isExpense ? "e.g. Groceries, Streaming" : "e.g. Salary, Consulting"}
                required
                className="flex-1 border-none outline-none bg-transparent text-[14px] font-extrabold text-clay-text font-['Nunito',sans-serif] py-2.5"
              />
            </div>
          </div>

          {/* Target Note / Description (Optional) */}
          <div>
            <label className="text-[13px] font-extrabold text-clay-text block mb-1.5">
              Monthly Budget Guideline / Note{" "}
              <span className="text-[#b0a0cc] font-semibold">(optional)</span>
            </label>
            <div className="bg-white rounded-2xl px-4 py-2 shadow-[0_6px_0_#d5c8ef,0_10px_20px_rgba(139,100,200,0.1),inset_0_1px_0_rgba(255,255,255,0.9)]">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Max budget Rp 1.500.000 / month"
                className="w-full border-none outline-none bg-transparent text-[13px] font-semibold text-clay-text font-['Nunito',sans-serif]"
              />
            </div>
          </div>

          {/* Live Preview Card */}
          <div>
            <div className="text-[12px] font-extrabold text-clay-muted mb-2">
              PREVIEW
            </div>
            <div className="clay-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-[20px] ${
                    isExpense
                      ? "bg-[#ffd8ce] shadow-[0_3px_0_#f0a090]"
                      : "bg-[#d4f5e8] shadow-[0_3px_0_#8ed5b5]"
                  }`}
                >
                  {selectedEmoji}
                </div>
                <div>
                  <div className="text-[14px] font-black text-clay-text">
                    {finalCategoryName || "Category Name"}
                  </div>
                  <div className="text-[11px] font-semibold text-clay-muted">
                    {note || (isExpense ? "Expense Category" : "Income Category")}
                  </div>
                </div>
              </div>
              <span
                className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${
                  isExpense
                    ? "bg-[#ffd8ce] text-[#c03030]"
                    : "bg-[#d4f5e8] text-[#148a50]"
                }`}
              >
                {isExpense ? "Expense" : "Income"}
              </span>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-[#ffe0d8] border border-[#f0a090] rounded-xl text-[12px] font-extrabold text-[#c03030] flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-[linear-gradient(135deg,#6c4fcf_0%,#8866e8_100%)] text-white border-none rounded-[20px] py-3.5 text-[15px] font-black font-['Nunito',sans-serif] cursor-pointer shadow-[0_5px_0_#4a30a0,0_8px_20px_rgba(80,50,180,0.3)] mt-2 transition-all duration-150 active:translate-y-0.75 active:shadow-[0_2px_0_#4a30a0] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Category…" : `Create ${isExpense ? "Expense" : "Income"} Category →`}
          </button>
        </form>
      </div>
    </div>
  );
}
