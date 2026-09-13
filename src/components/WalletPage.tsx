import { useState } from "react";

interface Group {
  id: number;
  name: string;
  emoji: string;
  colorCls: string;
  goal: number;
  saved: number;
  members: { name: string; avatar: string; contributed: number }[];
  dueDate: string;
}

const groups: Group[] = [
  {
    id: 1,
    name: "Bali Trip ✈️",
    emoji: "🏝️",
    colorCls: "clay-card-mint",
    goal: 4000,
    saved: 2750,
    dueDate: "Aug 15, 2026",
    members: [
      { name: "Sarah", avatar: "👩🏻", contributed: 900 },
      { name: "James", avatar: "👨🏽", contributed: 850 },
      { name: "Mia", avatar: "👩🏼", contributed: 700 },
      { name: "Leo", avatar: "👨🏻", contributed: 300 },
    ],
  },
  {
    id: 2,
    name: "New PS6",
    emoji: "🎮",
    colorCls: "clay-card-lavender",
    goal: 600,
    saved: 420,
    dueDate: "Sep 1, 2026",
    members: [
      { name: "James", avatar: "👨🏽", contributed: 200 },
      { name: "Leo", avatar: "👨🏻", contributed: 220 },
    ],
  },
  {
    id: 3,
    name: "House Deposit",
    emoji: "🏡",
    colorCls: "clay-card-yellow",
    goal: 20000,
    saved: 8500,
    dueDate: "Dec 31, 2026",
    members: [
      { name: "Sarah", avatar: "👩🏻", contributed: 4500 },
      { name: "James", avatar: "👨🏽", contributed: 4000 },
    ],
  },
];

export default function WalletPage() {
  const [selected, setSelected] = useState<Group | null>(null);

  if (selected) {
    return <GroupDetail group={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p style={{ fontSize: 13, color: "#8b7aaa", fontWeight: 600 }}>
            Collaborative saving
          </p>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 900,
              color: "#3d2f5e",
              margin: 0,
            }}
          >
            Group Wallets
          </h1>
        </div>
        <button
          className="clay-btn flex items-center gap-1.5 px-5 py-3 border-none cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #6c4fcf 0%, #8866e8 100%)",
            color: "white",
            fontFamily: "'Nunito', sans-serif",
            fontSize: 14,
            fontWeight: 800,
          }}
        >
          ＋ New Group
        </button>
      </div>

      {/* Summary row */}
      <div
        className="clay-card-coral flex gap-0 mb-6 overflow-hidden"
        style={{ borderRadius: 28 }}
      >
        {[
          { label: "Total Goal", val: "$24,600" },
          { label: "Total Saved", val: "$11,670" },
          { label: "Active Groups", val: "3" },
          { label: "Members", val: "4" },
        ].map((s, i, arr) => (
          <div
            key={s.label}
            className="flex-1 text-center py-4 px-2"
            style={{
              borderRight:
                i < arr.length - 1 ? "1px solid rgba(0,0,0,0.08)" : "none",
            }}
          >
            <p
              style={{
                fontSize: 11,
                color: "#c05040",
                fontWeight: 700,
                margin: 0,
              }}
            >
              {s.label}
            </p>
            <p
              style={{
                fontSize: 20,
                fontWeight: 900,
                color: "#3d2f5e",
                margin: "4px 0 0",
              }}
            >
              {s.val}
            </p>
          </div>
        ))}
      </div>

      {/* Group grid — 1 col mobile, 2 cols tablet+, 3 cols desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {groups.map((group) => {
          const pct = Math.round((group.saved / group.goal) * 100);
          return (
            <button
              key={group.id}
              className={`${group.colorCls} flex flex-col gap-3 p-5 border-none cursor-pointer text-left w-full`}
              onClick={() => setSelected(group)}
              onPointerDown={(e) =>
                ((e.currentTarget as HTMLElement).style.transform =
                  "translateY(4px)")
              }
              onPointerUp={(e) =>
                ((e.currentTarget as HTMLElement).style.transform = "")
              }
              onPointerLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.transform = "")
              }
              style={{ transition: "transform 0.12s" }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      background: "rgba(255,255,255,0.6)",
                      borderRadius: 18,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 28,
                      boxShadow: "0 3px 0 rgba(0,0,0,0.1)",
                      flexShrink: 0,
                    }}
                  >
                    {group.emoji}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 15,
                        fontWeight: 900,
                        color: "#3d2f5e",
                        margin: 0,
                      }}
                    >
                      {group.name}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: "#6b5a8a",
                        fontWeight: 600,
                        margin: "2px 0 0",
                      }}
                    >
                      Due {group.dueDate}
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    background: "rgba(255,255,255,0.6)",
                    borderRadius: 12,
                    padding: "4px 10px",
                    fontSize: 13,
                    fontWeight: 800,
                    color: "#3d2f5e",
                    boxShadow: "0 3px 0 rgba(0,0,0,0.1)",
                    flexShrink: 0,
                  }}
                >
                  {pct}%
                </span>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between mb-1.5">
                  <span
                    style={{ fontSize: 12, color: "#6b5a8a", fontWeight: 700 }}
                  >
                    ${group.saved.toLocaleString()} saved
                  </span>
                  <span
                    style={{ fontSize: 12, color: "#6b5a8a", fontWeight: 700 }}
                  >
                    of ${group.goal.toLocaleString()}
                  </span>
                </div>
                <div
                  style={{
                    height: 10,
                    background: "rgba(255,255,255,0.5)",
                    borderRadius: 999,
                    overflow: "hidden",
                    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: "rgba(80,40,160,0.35)",
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>

              {/* Members row */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {group.members.slice(0, 4).map((m, i) => (
                    <div
                      key={m.name}
                      style={{
                        width: 30,
                        height: 30,
                        background: "rgba(255,255,255,0.8)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        marginLeft: i > 0 ? -8 : 0,
                        border: "2px solid rgba(255,255,255,0.9)",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      {m.avatar}
                    </div>
                  ))}
                </div>
                <span
                  style={{ fontSize: 12, color: "#6b5a8a", fontWeight: 600 }}
                >
                  {group.members.length} members
                </span>
                <span
                  style={{ marginLeft: "auto", fontSize: 18, color: "#6b5a8a" }}
                >
                  →
                </span>
              </div>
            </button>
          );
        })}

        {/* Add new group tile */}
        <button
          className="clay-card flex flex-col items-center justify-center gap-3 border-none cursor-pointer"
          style={{
            minHeight: 200,
            border: "2px dashed #d5c8ef",
            background: "transparent",
            boxShadow: "none",
            transition: "all 0.15s",
          }}
          onPointerEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background =
              "rgba(255,255,255,0.6)")
          }
          onPointerLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "transparent")
          }
        >
          <div
            style={{
              width: 52,
              height: 52,
              background: "#f0eaf8",
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              boxShadow: "0 4px 0 #d5c8ef",
            }}
          >
            +
          </div>
          <p
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: "#6c4fcf",
              margin: 0,
            }}
          >
            Create New Group
          </p>
          <p
            style={{
              fontSize: 12,
              color: "#8b7aaa",
              fontWeight: 600,
              margin: 0,
            }}
          >
            Save together with friends
          </p>
        </button>
      </div>
    </div>
  );
}

function GroupDetail({ group, onBack }: { group: Group; onBack: () => void }) {
  const pct = Math.round((group.saved / group.goal) * 100);
  const remaining = group.goal - group.saved;

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      {/* Back + Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="clay-card border-none cursor-pointer flex items-center justify-center"
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            fontSize: 18,
            padding: 0,
            flexShrink: 0,
          }}
        >
          ←
        </button>
        <div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: "#3d2f5e",
              margin: 0,
            }}
          >
            {group.name}
          </h1>
          <p
            style={{
              fontSize: 12,
              color: "#8b7aaa",
              fontWeight: 600,
              margin: 0,
            }}
          >
            Due {group.dueDate}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Left */}
        <div className="flex flex-col gap-5">
          {/* Hero card */}
          <div className={`${group.colorCls} p-6 flex flex-col gap-4`}>
            <div style={{ fontSize: 52, textAlign: "center" }}>
              {group.emoji}
            </div>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: 40,
                  fontWeight: 900,
                  color: "#3d2f5e",
                  margin: 0,
                }}
              >
                ${group.saved.toLocaleString()}
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "#6b5a8a",
                  fontWeight: 600,
                  margin: "4px 0 0",
                }}
              >
                of ${group.goal.toLocaleString()} goal
              </p>
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <span
                  style={{ fontSize: 12, color: "#6b5a8a", fontWeight: 700 }}
                >
                  {pct}% reached
                </span>
                <span
                  style={{ fontSize: 12, color: "#6b5a8a", fontWeight: 700 }}
                >
                  ${remaining.toLocaleString()} left
                </span>
              </div>
              <div
                style={{
                  height: 12,
                  background: "rgba(255,255,255,0.5)",
                  borderRadius: 999,
                  overflow: "hidden",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: "rgba(80,40,160,0.4)",
                    borderRadius: 999,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Contribute */}
          <button
            className="clay-btn border-none py-4 w-full"
            style={{
              background: "linear-gradient(135deg, #6c4fcf 0%, #8866e8 100%)",
              color: "white",
              fontFamily: "'Nunito', sans-serif",
              fontSize: 16,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            💸 Contribute to this Goal
          </button>

          {/* Invite */}
          <div
            className="clay-card flex items-center gap-3 p-4"
            style={{ border: "2px dashed #d5c8ef" }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                background: "#f0eaf8",
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              🔗
            </div>
            <div>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#6c4fcf",
                  margin: 0,
                }}
              >
                Invite a friend
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "#8b7aaa",
                  fontWeight: 600,
                  margin: "2px 0 0",
                }}
              >
                Share the link to collaborate
              </p>
            </div>
            <button
              style={{
                marginLeft: "auto",
                background: "#f0eaf8",
                border: "none",
                borderRadius: 14,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 800,
                color: "#6c4fcf",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              Copy
            </button>
          </div>
        </div>

        {/* Right — members */}
        <div className="flex flex-col gap-4">
          <h3
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: "#3d2f5e",
              margin: 0,
            }}
          >
            Members
          </h3>
          {group.members.map((m) => {
            const memberPct = Math.round((m.contributed / group.saved) * 100);
            return (
              <div
                key={m.name}
                className="clay-card flex items-center gap-3 px-4 py-3"
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    background: "#e0d8ff",
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                    flexShrink: 0,
                    boxShadow: "0 4px 0 #a090e0",
                  }}
                >
                  {m.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: "#3d2f5e",
                      }}
                    >
                      {m.name}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 900,
                        color: "#6c4fcf",
                      }}
                    >
                      ${m.contributed.toLocaleString()}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: "#f0eaf8",
                      borderRadius: 999,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${memberPct}%`,
                        background: "linear-gradient(90deg, #8866e8, #6c4fcf)",
                        borderRadius: 999,
                      }}
                    />
                  </div>
                  <span
                    style={{ fontSize: 11, color: "#8b7aaa", fontWeight: 600 }}
                  >
                    {memberPct}% of total saved
                  </span>
                </div>
              </div>
            );
          })}

          {/* Add member tile */}
          <div
            className="clay-card flex items-center gap-3 p-4"
            style={{
              border: "2px dashed #d5c8ef",
              background: "transparent",
              boxShadow: "none",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                background: "#f0eaf8",
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              ＋
            </div>
            <div>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#6c4fcf",
                  margin: 0,
                }}
              >
                Add member
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "#8b7aaa",
                  fontWeight: 600,
                  margin: "2px 0 0",
                }}
              >
                Invite to contribute
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
