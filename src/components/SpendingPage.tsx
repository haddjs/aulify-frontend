import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { categories } from "../constants/categories";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const monthlyData = [980, 1320, 870, 1100, 1450, 1240];

type Period = "week" | "month" | "year";

export default function SpendingPage() {
  const [period, setPeriod] = useState<Period>("month");
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const total = categories.reduce((s, c) => s + c.value, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p style={{ fontSize: 13, color: "#8b7aaa", fontWeight: 600 }}>
            July 2026
          </p>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 900,
              color: "#3d2f5e",
              margin: 0,
            }}
          >
            Spending Tracker
          </h1>
        </div>
        {/* Period toggle — moved inline for desktop */}
        <div
          className="hidden sm:flex clay-card p-1.5 gap-1"
          style={{ borderRadius: 24 }}
        >
          {(["week", "month", "year"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="py-2 px-4 border-none cursor-pointer transition-all duration-200"
              style={
                period === p
                  ? {
                      background:
                        "linear-gradient(135deg, #6c4fcf 0%, #8866e8 100%)",
                      borderRadius: 18,
                      boxShadow:
                        "0 4px 0 #4a30a0, 0 6px 14px rgba(80,50,180,0.3)",
                      color: "white",
                      fontWeight: 800,
                      fontSize: 13,
                      fontFamily: "'Nunito', sans-serif",
                    }
                  : {
                      background: "transparent",
                      borderRadius: 18,
                      color: "#8b7aaa",
                      fontWeight: 700,
                      fontSize: 13,
                      fontFamily: "'Nunito', sans-serif",
                    }
              }
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile period toggle */}
      <div
        className="flex sm:hidden clay-card p-1.5 gap-1 mb-5"
        style={{ borderRadius: 24 }}
      >
        {(["week", "month", "year"] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className="flex-1 py-2 border-none cursor-pointer transition-all duration-200"
            style={
              period === p
                ? {
                    background:
                      "linear-gradient(135deg, #6c4fcf 0%, #8866e8 100%)",
                    borderRadius: 18,
                    boxShadow: "0 4px 0 #4a30a0",
                    color: "white",
                    fontWeight: 800,
                    fontSize: 13,
                    fontFamily: "'Nunito', sans-serif",
                  }
                : {
                    background: "transparent",
                    borderRadius: 18,
                    color: "#8b7aaa",
                    fontWeight: 700,
                    fontSize: 13,
                    fontFamily: "'Nunito', sans-serif",
                  }
            }
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut chart card */}
        <div className="clay-card p-5 flex flex-col items-center gap-3">
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#8b7aaa",
              margin: 0,
            }}
          >
            Total Spending
          </h3>
          <div style={{ position: "relative", width: "100%", height: 260 }}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={categories}
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
                  {categories.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={entry.color}
                      style={{
                        filter:
                          activeIdx === index
                            ? `drop-shadow(0 4px 10px ${entry.shadow})`
                            : "none",
                        transform:
                          activeIdx === index ? "scale(1.05)" : "scale(1)",
                        transformOrigin: "center",
                        transition: "all 0.2s",
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`$${value}`, ""]}
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
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                pointerEvents: "none",
              }}
            >
              {activeIdx !== null ? (
                <>
                  <div style={{ fontSize: 28 }}>
                    {categories[activeIdx].emoji}
                  </div>
                  <div
                    style={{ fontSize: 18, fontWeight: 900, color: "#3d2f5e" }}
                  >
                    ${categories[activeIdx].value}
                  </div>
                  <div
                    style={{ fontSize: 11, color: "#8b7aaa", fontWeight: 600 }}
                  >
                    {((categories[activeIdx].value / total) * 100).toFixed(0)}%
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{ fontSize: 11, color: "#8b7aaa", fontWeight: 700 }}
                  >
                    Total
                  </div>
                  <div
                    style={{ fontSize: 24, fontWeight: 900, color: "#3d2f5e" }}
                  >
                    ${total}
                  </div>
                  <div
                    style={{ fontSize: 11, color: "#8b7aaa", fontWeight: 600 }}
                  >
                    this month
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 justify-center w-full">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="flex items-center gap-1.5 px-3 py-1.5"
                style={{
                  background: cat.color,
                  borderRadius: 20,
                  boxShadow: `0 3px 0 ${cat.shadow}`,
                }}
              >
                <span style={{ fontSize: 13 }}>{cat.emoji}</span>
                <span
                  style={{ fontSize: 11, fontWeight: 800, color: "#3d2f5e" }}
                >
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: category bars + trend */}
        <div className="flex flex-col gap-5">
          {/* Category breakdown */}
          <div>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "#3d2f5e",
                margin: "0 0 12px",
              }}
            >
              By Category
            </h3>
            <div className="flex flex-col gap-3">
              {[...categories]
                .sort((a, b) => b.value - a.value)
                .map((cat) => (
                  <div
                    key={cat.name}
                    className="clay-card px-4 py-3 flex items-center gap-3"
                  >
                    <div
                      style={{
                        background: cat.color,
                        borderRadius: 16,
                        width: 44,
                        height: 44,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                        flexShrink: 0,
                        boxShadow: `0 4px 0 ${cat.shadow}`,
                      }}
                    >
                      {cat.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 800,
                            color: "#3d2f5e",
                          }}
                        >
                          {cat.name}
                        </span>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 900,
                            color: "#3d2f5e",
                          }}
                        >
                          ${cat.value}
                        </span>
                      </div>
                      <div
                        style={{
                          height: 8,
                          background: "#f0eaf8",
                          borderRadius: 999,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${(cat.value / total) * 100}%`,
                            background: cat.color,
                            borderRadius: 999,
                            boxShadow: `0 2px 0 ${cat.shadow}`,
                            transition: "width 0.6s ease",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Monthly trend */}
          <div className="clay-card p-5">
            <h3
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "#3d2f5e",
                margin: "0 0 14px",
              }}
            >
              Monthly Trend
            </h3>
            <div className="flex items-end gap-2" style={{ height: 90 }}>
              {months.map((m, i) => {
                const max = Math.max(...monthlyData);
                const pct = (monthlyData[i] / max) * 100;
                const isLast = i === months.length - 1;
                return (
                  <div
                    key={m}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      style={{
                        width: "100%",
                        height: `${pct}%`,
                        minHeight: 12,
                        background: isLast
                          ? "linear-gradient(180deg, #8866e8, #6c4fcf)"
                          : "#e0d8ff",
                        borderRadius: "8px 8px 4px 4px",
                        boxShadow: isLast
                          ? "0 4px 0 #4a30a0"
                          : "0 3px 0 #c8b8f0",
                        transition: "height 0.4s ease",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: isLast ? "#6c4fcf" : "#8b7aaa",
                      }}
                    >
                      {m}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
