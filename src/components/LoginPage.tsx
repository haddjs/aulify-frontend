import { useState } from "react";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-stretch font-['Nunito',sans-serif] bg-clay-bg">
      {/* Left decorative panel — desktop only */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden w-120 shrink-0 bg-[linear-gradient(145deg,#6c4fcf_0%,#9b6fef_55%,#b89af8_100%)]">
        {/* Floating clay blobs */}
        <div className="absolute -top-15 -left-15 w-65 h-65 bg-white/12 rounded-[60%_40%_55%_45%]" />
        <div className="absolute top-45 -right-20 w-55 h-55 bg-white/8 rounded-[45%_55%_40%_60%]" />
        <div className="absolute bottom-20 left-10 w-45 h-45 bg-white/10 rounded-[55%_45%_60%_40%]" />
        <div className="absolute -bottom-12.5 -right-7.5 w-60 h-60 bg-white/[0.07] rounded-[40%_60%_45%_55%]" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-white/25 rounded-[18px] flex items-center justify-center text-[24px] shadow-[0_6px_0_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.4)]">
            💜
          </div>
          <div>
            <div className="text-[20px] font-black text-white">Claypay</div>
            <div className="text-[12px] text-white/70 font-semibold">
              Money Manager
            </div>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <h2 className="text-[42px] font-black text-white leading-[1.15] mb-4">
            Your money,
            <br />
            your way 🎯
          </h2>
          <p className="text-[16px] text-white/75 font-semibold leading-[1.6]">
            Track spending, save together, and reach your goals — all in one
            beautiful app.
          </p>

          {/* Floating mini cards */}
          <div className="flex flex-col gap-3 mt-10">
            {[
              {
                emoji: "📊",
                label: "Smart spending insights",
                sub: "Know where every dollar goes",
              },
              {
                emoji: "👛",
                label: "Group savings goals",
                sub: "Save with friends & family",
              },
              {
                emoji: "🔒",
                label: "Bank-level security",
                sub: "256-bit encrypted & safe",
              },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-3 px-4 py-3 bg-white/18 rounded-[20px] backdrop-blur-md shadow-[0_4px_0_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.3)]"
              >
                <span className="text-[24px]">{f.emoji}</span>
                <div>
                  <div className="text-[13px] font-extrabold text-white">
                    {f.label}
                  </div>
                  <div className="text-[11px] text-white/65 font-semibold">
                    {f.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-[12px] text-white/50 font-semibold">
          © 2026 Claypay Inc.
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 relative overflow-hidden">
        {/* Background blobs for mobile/tablet */}
        <div className="absolute -top-20 -right-20 w-70 h-70 bg-[#b496f0]/18 rounded-[55%_45%_40%_60%] pointer-events-none" />
        <div className="absolute -bottom-15 -left-15 w-60 h-60 bg-[#c8f0dc]/22 rounded-[45%_55%_60%_40%] pointer-events-none" />

        <div className="w-full max-w-100 relative z-10">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-11 h-11 bg-[linear-gradient(135deg,#6c4fcf_0%,#8866e8_100%)] rounded-2xl flex items-center justify-center text-[22px] shadow-[0_5px_0_#4a30a0]">
              💜
            </div>
            <div>
              <div className="text-[18px] font-black text-clay-text">
                Claypay
              </div>
              <div className="text-[11px] text-clay-muted font-semibold">
                Money Manager
              </div>
            </div>
          </div>

          {/* Mode toggle */}
          <div className="clay-card flex p-1.5 gap-1 mb-8 rounded-3xl">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2.5 border-none cursor-pointer transition-all duration-200 rounded-[18px] text-[14px] font-['Nunito',sans-serif] ${
                  mode === m
                    ? "bg-[linear-gradient(135deg,#6c4fcf_0%,#8866e8_100%)] shadow-[0_4px_0_#4a30a0,0_6px_14px_rgba(80,50,180,0.3)] text-white font-extrabold"
                    : "bg-transparent text-clay-muted font-bold"
                }`}
              >
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-[28px] font-black text-clay-text mb-1">
              {mode === "login" ? "Welcome back 👋" : "Join Claypay 🎉"}
            </h1>
            <p className="text-[14px] text-clay-muted font-semibold">
              {mode === "login"
                ? "Sign in to manage your money smarter."
                : "Start tracking your spending today."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <ClayInput
                label="Full Name"
                type="text"
                placeholder="Sarah Collins"
                value={name}
                onChange={setName}
                emoji="👤"
              />
            )}

            <ClayInput
              label="Email Address"
              type="email"
              placeholder="sarah@email.com"
              value={email}
              onChange={setEmail}
              emoji="✉️"
            />

            <div>
              <label className="text-[13px] font-extrabold text-clay-text block mb-2">
                Password
              </label>
              <div className="clay-card flex items-center gap-3 px-4 rounded-[20px]">
                <span className="text-[18px] shrink-0">🔒</span>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder={
                    mode === "signup"
                      ? "Create a strong password"
                      : "Enter your password"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 border-none outline-none bg-transparent text-[14px] font-semibold text-clay-text font-['Nunito',sans-serif] py-3.5"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="border-none bg-none cursor-pointer text-[18px] shrink-0 p-0"
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {mode === "login" && (
              <div className="text-right -mt-2">
                <span className="text-[13px] font-bold text-[#6c4fcf] cursor-pointer">
                  Forgot password?
                </span>
              </div>
            )}

            {mode === "signup" && (
              <div className="flex items-start gap-3 p-3 bg-clay-bg rounded-2xl">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-0.5 accent-[#6c4fcf] w-4 h-4 shrink-0"
                />
                <label
                  htmlFor="terms"
                  className="text-[12px] text-clay-muted font-semibold leading-normal"
                >
                  I agree to the{" "}
                  <span className="text-[#6c4fcf] font-bold">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-[#6c4fcf] font-bold">
                    Privacy Policy
                  </span>
                </label>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className={`clay-btn border-none w-full mt-1 text-white font-['Nunito',sans-serif] text-[16px] font-black py-3.75 transition-all duration-200 flex items-center justify-center gap-2 ${
                loading
                  ? "bg-[#c0b0e8] cursor-not-allowed shadow-[0_3px_0_#9080c0]"
                  : "bg-[linear-gradient(135deg,#6c4fcf_0%,#8866e8_100%)] cursor-pointer shadow-[0_5px_0_#4a30a0,0_8px_20px_rgba(80,50,180,0.3)]"
              }`}
            >
              {loading ? (
                <>
                  <LoadingSpinner />{" "}
                  {mode === "login" ? "Signing in…" : "Creating account…"}
                </>
              ) : mode === "login" ? (
                "Sign In →"
              ) : (
                "Create Account →"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#e0d8ef]" />
            <span className="text-[12px] text-clay-muted font-bold">
              or continue with
            </span>
            <div className="flex-1 h-px bg-[#e0d8ef]" />
          </div>

          {/* Social buttons */}
          <div className="flex gap-3">
            {[
              { label: "Google", emoji: "🌐" },
              { label: "Apple", emoji: "🍎" },
            ].map((s) => (
              <button
                key={s.label}
                className="clay-card flex-1 flex items-center justify-center gap-2 py-3 border-none cursor-pointer rounded-[20px] font-['Nunito',sans-serif] text-[14px] font-extrabold text-clay-text active:translate-y-1"
              >
                <a
                  href={`${import.meta.env.VITE_BASE_URL}/auth/google`}
                  className="flex items-center gap-2 text-inherit no-underline"
                >
                  <span className="text-[20px]">{s.emoji}</span>
                  {s.label}
                </a>
              </button>
            ))}
          </div>

          {/* Footer switch */}
          <p className="text-center mt-7 text-[13px] text-clay-muted font-semibold">
            {mode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <span
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-[#6c4fcf] font-extrabold cursor-pointer"
            >
              {mode === "login" ? "Sign up free" : "Sign in"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

function ClayInput({
  label,
  type,
  placeholder,
  value,
  onChange,
  emoji,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  emoji: string;
}) {
  return (
    <div>
      <label className="text-[13px] font-extrabold text-clay-text block mb-2">
        {label}
      </label>
      <div className="clay-card flex items-center gap-3 px-4 rounded-[20px]">
        <span className="text-[18px] shrink-0">{emoji}</span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 border-none outline-none bg-transparent text-[14px] font-semibold text-clay-text font-['Nunito',sans-serif] py-3.5"
        />
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className="animate-spin"
    >
      <circle
        cx="9"
        cy="9"
        r="7"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="2.5"
      />
      <path
        d="M9 2a7 7 0 0 1 7 7"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
