import { useEffect, useRef, useState } from "react";
import { type Category } from "../hooks/useCategories";

export type ModalType = "income" | "expense";

export interface TransactionData {
  type: ModalType;
  categoryId: string;
  date: string;
  note?: string | null;
  amount: number;
}

interface Props {
  type: ModalType;
  categories: Category[];
  onClose: () => void;
  onSave: (data: TransactionData) => void;
  onAddCategory?: (category: {
    name: string;
    type: ModalType;
  }) => Promise<Category>;
}

export default function TransactionModal({
  type,
  categories,
  onClose,
  onSave,
  onAddCategory,
}: Props) {
  // Form State
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState("");
  const [visible, setVisible] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryText, setNewCategoryText] = useState("");
  const [addCategoryError, setAddCategoryError] = useState<string | null>(null);

  const newCategoryInputRef = useRef<HTMLInputElement>(null);

  // Filter dynamic categories matching current modal type
  const availableCategories = categories.filter((c) => c.type === type);
  const isExpense = type === "expense";

  // Dynamic styling variables
  const accentLightBg = isExpense ? "bg-[#ffd8ce]" : "bg-[#d4f5e8]";
  const accentShadow = isExpense
    ? "shadow-[0_5px_0_#f0a090]"
    : "shadow-[0_5px_0_#8ed5b5]";
  const amountBoxShadow = isExpense
    ? "shadow-[0_6px_0_#f0a090,0_10px_20px_rgba(0,0,0,0.06)]"
    : "shadow-[0_6px_0_#8ed5b5,0_10px_20px_rgba(0,0,0,0.06)]";
  const accentTextColor = isExpense ? "text-[#c03030]" : "text-[#148a50]";

  // Entry animation trigger
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  // Auto-focus category input when toggled open
  useEffect(() => {
    if (addingCategory) {
      newCategoryInputRef.current?.focus();
    }
  }, [addingCategory]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 260);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !amount) return;

    onSave({
      type,
      categoryId,
      date,
      note: note.trim() || null,
      amount: Number(amount),
    });

    handleClose();
  };

  const handleStartAddCategory = () => {
    setAddingCategory(true);
  };

  const handleCancelCategory = () => {
    setAddingCategory(false);
    setNewCategoryText("");
  };

  const handleConfirmCategory = async () => {
    const trimmed = newCategoryText.trim();
    if (!trimmed || !onAddCategory) return;

    try {
      const newCategory = await onAddCategory({ name: trimmed, type });
      setCategoryId(newCategory.id);
      setNewCategoryText("");
      setAddingCategory(false);
      setAddCategoryError(null);
    } catch (err) {
      setAddCategoryError(
        err instanceof Error ? err.message : "Failed to add category",
      );
    }
  };

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-100 flex items-end justify-center transition-all duration-260 ease-out ${
        visible
          ? "bg-clay-text/35 backdrop-blur-xs"
          : "bg-transparent backdrop-blur-none"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-120 max-h-[92vh] overflow-y-auto bg-[#f8f4ff] rounded-t-4xl shadow-[0_-8px_40px_rgba(100,60,200,0.2)] pb-8 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-[#d5c8ef] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-3 pb-5">
          <div className="flex items-center gap-3">
            <div
              className={`w-11.5 h-11.5 ${accentLightBg} rounded-2xl flex items-center justify-center text-[24px] ${accentShadow}`}
            >
              {isExpense ? "📤" : "📥"}
            </div>
            <div>
              <div className="text-[20px] font-black text-clay-text">
                Add {isExpense ? "Expense" : "Income"}
              </div>
              <div className="text-[12px] text-clay-muted font-semibold">
                {isExpense ? "Record what you spent" : "Record what you earned"}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-9 h-9 bg-[#ede8f8] border-none rounded-xl text-[18px] cursor-pointer flex items-center justify-center shadow-[0_3px_0_#d5c8ef]"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="px-6 flex flex-col gap-4">
          {/* Amount input */}
          <div
            className={`${accentLightBg} rounded-3xl p-5 ${amountBoxShadow}`}
          >
            <div
              className={`text-[12px] font-extrabold ${accentTextColor} mb-2`}
            >
              AMOUNT
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[32px] font-black ${accentTextColor}`}>
                Rp
              </span>
              <input
                type="number"
                min="1"
                step="any"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className={`flex-1 border-none outline-none bg-transparent text-[36px] font-black ${accentTextColor} font-['Nunito',sans-serif] w-full`}
              />
            </div>
          </div>

          {/* Dynamic Categories */}
          <div>
            <div className="text-[13px] font-extrabold text-clay-text">
              Category
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableCategories.length === 0 ? (
                <p className="text-xs text-clay-muted italic">
                  No {type} categories found.
                </p>
              ) : (
                availableCategories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategoryId(c.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-[20px] border-none cursor-pointer font-['Nunito',sans-serif] text-[12px] font-extrabold transition-all duration-150 ${
                      categoryId === c.id
                        ? "bg-[linear-gradient(135deg,#6c4fcf,#8866e8)] text-white shadow-[0_4px_0_#4a30a0]"
                        : "bg-[#ede8f8] text-clay-text shadow-[0_3px_0_#d5c8ef]"
                    }`}
                  >
                    {c.name}
                  </button>
                ))
              )}

              {addingCategory ? (
                <div className="flex items-center gap-1 py-[7px] pr-[10px] pl-[14px] rounded-[20px] bg-white border-2 border-[#8866e8] shadow-[0_4px_0_#a090e0,0_6px_16px_rgba(108,79,207,0.2)] animate-[chipExpand_0.18s_cubic-bezier(0.34,1.56,0.64,1)]">
                  <style>{`
                    @keyframes chipExpand {
                      from { transform: scale(0.7); opacity: 0; }
                      to   { transform: scale(1);   opacity: 1; }
                    }
                  `}</style>
                  <input
                    ref={newCategoryInputRef}
                    type="text"
                    value={newCategoryText}
                    onChange={(e) => setNewCategoryText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleConfirmCategory();
                      }
                      if (e.key === "Escape") handleCancelCategory();
                    }}
                    placeholder="Category name…"
                    maxLength={20}
                    className="border-none outline-none bg-transparent text-[12px] font-extrabold text-[#3d2f5e] font-['Nunito',sans-serif] w-[120px] min-w-0"
                  />
                  {/* Confirm */}
                  <button
                    type="button"
                    onClick={handleConfirmCategory}
                    title="Add"
                    className="w-[22px] h-[22px] rounded-full border-none bg-[linear-gradient(135deg,#6c4fcf,#8866e8)] text-white text-[12px] font-black cursor-pointer flex items-center justify-center shrink-0 shadow-[0_2px_0_#4a30a0]"
                  >
                    ✓
                  </button>
                  {/* Cancel */}
                  <button
                    type="button"
                    onClick={handleCancelCategory}
                    title="Cancel"
                    className="w-[22px] h-[22px] rounded-full border-none bg-[#ede8f8] text-[#8b7aaa] text-[11px] font-black cursor-pointer flex items-center justify-center shrink-0 shadow-[0_2px_0_#d5c8ef]"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleStartAddCategory}
                  className="flex items-center gap-[5px] px-[14px] py-[7px] rounded-[20px] border-2 border-dashed border-[#c4b4e8] bg-transparent cursor-pointer font-['Nunito',sans-serif] text-[12px] font-extrabold text-[#8866e8] transition-all duration-[180ms] shadow-none hover:bg-[#ede8f8] hover:border-[#8866e8] active:scale-[0.94]"
                >
                  <span className="text-[14px] leading-none">＋</span>
                  Add Category
                </button>
              )}
            </div>
            {addCategoryError && (
              <p className="text-[11px] text-[#c03030] font-bold mt-1">
                {addCategoryError}
              </p>
            )}
          </div>

          {/* Date Picker */}
          <ModalField label="Date" emoji="📅">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="flex-1 border-none outline-none bg-transparent text-[14px] font-semibold text-clay-text font-['Nunito',sans-serif] py-3.5 w-full scheme-light"
            />
          </ModalField>

          {/* Optional Note */}
          <div>
            <div className="text-[13px] font-extrabold text-clay-text">
              Note{" "}
              <span className="text-[#b0a0cc] font-semibold">(optional)</span>
            </div>
            <div className="bg-white rounded-[20px] px-4 py-1 shadow-[0_6px_0_#d5c8ef,0_10px_20px_rgba(139,100,200,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] mt-2">
              <div className="flex items-start gap-2.5 pt-3">
                <span className="text-[18px] mt-0.5 shrink-0">📝</span>
                <textarea
                  placeholder="Add a note…"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  className="flex-1 border-none outline-none bg-transparent text-[14px] font-semibold text-clay-text font-['Nunito',sans-serif] resize-none pb-3"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-[linear-gradient(135deg,#6c4fcf_0%,#8866e8_100%)] text-white border-none rounded-[20px] py-3.75 text-[16px] font-black font-['Nunito',sans-serif] cursor-pointer shadow-[0_5px_0_#4a30a0,0_8px_20px_rgba(80,50,180,0.3)] mt-1 transition-all duration-150 active:translate-y-0.75 active:shadow-[0_2px_0_#4a30a0]"
          >
            Save {isExpense ? "Expense" : "Income"} →
          </button>
        </form>
      </div>
    </div>
  );
}

function ModalField({
  label,
  emoji,
  children,
}: {
  label: string;
  emoji: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[13px] font-extrabold text-clay-text mb-2">
        {label}
      </div>
      <div className="bg-white rounded-[20px] px-4 shadow-[0_6px_0_#d5c8ef,0_10px_20px_rgba(139,100,200,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] flex items-center gap-2.5">
        <span className="text-[18px] shrink-0">{emoji}</span>
        {children}
      </div>
    </div>
  );
}
