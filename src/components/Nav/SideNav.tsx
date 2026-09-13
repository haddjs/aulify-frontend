import { NavLink } from "react-router-dom";

const items: { path: string; label: string; icon: string }[] = [
  { path: "/", label: "Home", icon: "🏠" },
  { path: "/transactions", label: "Spending", icon: "📊" },
];

export default function SideNav() {
  return (
    <aside className="flex flex-col justify-between gap-4 py-8 px-4 shrink-0 w-60 bg-transparent">
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 mb-8">
        <div className="w-10 h-10 rounded-[14px] flex items-center justify-center text-xl shadow-[0_5px_0_#4a30a0,0_8px_16px_rgba(80,50,180,0.3)] bg-[linear-gradient(135deg,#6c4fcf_0%,#8866e8_100%)]">
          A
        </div>
        <div>
          <h1 className="text-clay-text font-extrabold text-xl">Aulify</h1>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-2">
        <div>
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-6 px-4 py-3 border-none cursor-pointer transition-all duration-200 w-full text-left text-md rounded-[20px] font-['Nunito',sans-serif] ${
                  isActive
                    ? "bg-[linear-gradient(135deg,#6c4fcf_0%,#8866e8_100%)] shadow-[0_5px_0_#4a30a0,0_8px_20px_rgba(80,50,180,0.3)] text-white font-extrabold"
                    : "bg-transparent text-clay-muted font-bold"
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom profile */}
      <div className="mt-auto">
        <div className="clay-card flex items-center gap-3 p-3 rounded-[20px]">
          <div className="w-9.5 h-9.5 bg-[#e0d8ff] rounded-[14px] flex items-center justify-center text-xl shrink-0 shadow-[0_3px_0_#a090e0]">
            👩🏻
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-extrabold text-clay-text">
              Sarah Collins
            </div>
            <div className="text-[11px] text-clay-muted font-semibold truncate">
              sarah@email.com
            </div>
          </div>
          <span className="text-clay-muted text-[16px]">⚙️</span>
        </div>
      </div>
    </aside>
  );
}
