"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { competitors } from "@/lib/mock-data";

export function CompetitorBarChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={competitors} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis domain={[0, 100]} stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          cursor={{ fill: "rgba(237,236,242,0.04)" }}
          contentStyle={{
            background: "var(--surface-2)",
            border: "1px solid var(--line-2)",
            borderRadius: 10,
            color: "var(--fg)",
            fontSize: 13,
            backdropFilter: "blur(12px)",
          }}
        />
        <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={48}>
          {competitors.map((c) => (
            <Cell key={c.name} fill={c.isYou ? "var(--gold)" : "var(--miss)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
