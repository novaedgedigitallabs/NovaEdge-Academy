// components/analytics/AnalyticsCharts.jsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart,
} from "recharts";

const chartTheme = {
  grid: "rgba(255,255,255,0.06)",
  axis: "rgba(255,255,255,0.35)",
  tooltipBg: "hsl(224 71% 6%)",
  tooltipBorder: "rgba(255,255,255,0.1)",
};

function CustomTooltip({ active, payload, label, prefix = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg border px-3 py-2 text-sm shadow-xl"
      style={{
        background: chartTheme.tooltipBg,
        borderColor: chartTheme.tooltipBorder,
      }}
    >
      <p className="text-muted-foreground text-xs mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-semibold" style={{ color: p.color }}>
          {prefix}
          {p.value?.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export function RevenueChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(263.4 70% 50.4%)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="hsl(263.4 70% 50.4%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3" />
        <XAxis
          dataKey="_id"
          tick={{ fill: chartTheme.axis, fontSize: 11 }}
          axisLine={{ stroke: chartTheme.grid }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: chartTheme.axis, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip prefix="₹" />} />
        <Area
          type="monotone"
          dataKey="total"
          stroke="hsl(263.4 70% 50.4%)"
          strokeWidth={2}
          fill="url(#revenueGrad)"
          name="Revenue"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function UsersChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <defs>
          <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(180 100% 45%)" stopOpacity={0.8} />
            <stop offset="100%" stopColor="hsl(180 100% 45%)" stopOpacity={0.3} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3" />
        <XAxis
          dataKey="_id"
          tick={{ fill: chartTheme.axis, fontSize: 11 }}
          axisLine={{ stroke: chartTheme.grid }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: chartTheme.axis, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="count"
          fill="url(#usersGrad)"
          name="New Users"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
