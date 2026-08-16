"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { channelScores } from "@/lib/mock-data";

export function ChannelBarChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={channelScores}
        layout="vertical"
        margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
      >
        <XAxis type="number" domain={[0, 100]} hide />
        <YAxis
          dataKey="channel"
          type="category"
          width={130}
          stroke="var(--muted)"
          fontSize={12.5}
          tickLine={false}
          axisLine={false}
        />
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
        <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={16}>
          {channelScores.map((c) => (
            <Cell key={c.key} fill={c.score >= 80 ? "var(--gold)" : "var(--signal)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
