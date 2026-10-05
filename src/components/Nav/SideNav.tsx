import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const items: { path: string; label: string; icon: string }[] = [
  { path: "/", label: "Home", icon: "🏠" },
  { path: "/transactions", label: "Spending", icon: "📊" },
  { path: "/wallet", label: "Wallet", icon: "👛" },
];

export default function SideNav() {
  const { user, logout } = useAuth();
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <aside className="sticky top-0 h-screen w-64 flex flex-col justify-between p-5 bg-white/40 backdrop-blur-md border-r border-[#e0d8ef]/60 shrink-0 font-['Nunito',sans-serif]">
      {/* Top: Logo & Navigation */}
      <div className="flex flex-col gap-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2 pt-2">
          <div className="w-11 h-11 rounded-[16px] flex items-center justify-center text-2xl shadow-[0_5px_0_#4a30a0,0_8px_16px_rgba(80,50,180,0.3)] bg-[linear-gradient(135deg,#6c4fcf_0%,#8866e8_100%)] text-white font-black select-none">
            A
          </div>
          <div>
            <h1 className="text-clay-text font-black text-xl m-0 leading-tight">
              Aulify
            </h1>
            <p className="text-[11px] text-clay-muted font-bold m-0">
              Money Manager
            </p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col gap-2 mt-1">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 border-none cursor-pointer transition-all duration-200 text-[14px] rounded-[20px] font-extrabold ${
                  isActive
                    ? "bg-[linear-gradient(135deg,#6c4fcf_0%,#8866e8_100%)] shadow-[0_4px_0_#4a30a0,0_8px_18px_rgba(80,50,180,0.25)] text-white"
                    : "bg-transparent text-clay-muted hover:bg-white/60 hover:text-clay-text active:scale-[0.98]"
                }`
              }
            >
              <span className="text-[20px]">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Very Bottom: User's Profile Info pinned at bottom of viewport */}
      <div className="mt-auto pt-4 border-t border-[#e0d8ef]/50">
        <div className="clay-card flex items-center gap-3 p-3 rounded-[22px] transition-all hover:shadow-[0_10px_0_#d5c8ef,0_14px_28px_rgba(139,100,200,0.2)]">
          <div className="w-10 h-10 rounded-[14px] bg-[linear-gradient(135deg,#d2c8fc_0%,#b89af8_100%)] flex items-center justify-center text-[15px] font-black text-[#4a30a0] shrink-0 shadow-[0_3px_0_#a090e0]">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-black text-clay-text truncate">
              {user?.name ?? "User"}
            </div>
            <div className="text-[11px] text-clay-muted font-semibold truncate">
              {user?.email ?? "Signed in"}
            </div>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="w-8 h-8 rounded-xl border-none bg-[#f5f0ff] hover:bg-[#ffe5e5] text-clay-muted hover:text-[#e05050] cursor-pointer flex items-center justify-center transition-all shadow-[0_2px_0_#d5c8ef] active:translate-y-0.5 shrink-0"
          >
            <span className="text-[13px]">🚪</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
