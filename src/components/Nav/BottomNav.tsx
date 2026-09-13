import { NavLink } from "react-router-dom";

const items: { path: string; label: string; icon: string }[] = [
  { path: "/", label: "Home", icon: "🏠" },
  { path: "/transactions", label: "Spending", icon: "📊" },
  { path: "/wallet", label: "Group", icon: "👛" },
];

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 px-4 pb-5 pt-2 z-50">
      <div className="clay-card flex items-center justify-around px-4 py-3 mx-auto rounded-4xl max-w-107.5">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-5 py-2 transition-all duration-200 border-none cursor-pointer rounded-[20px] font-['Nunito',sans-serif] ${
                isActive
                  ? "bg-[linear-gradient(135deg,#6c4fcf_0%,#8866e8_100%)] shadow-[0_4px_0_#4a30a0,0_6px_14px_rgba(80,50,180,0.3)] text-white font-extrabold"
                  : "bg-transparent text-clay-muted font-bold"
              }`
            }
          >
            <span className="text-[22px]">{item.icon}</span>
            <span className="text-[11px]">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
