"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { competitors } from "@/lib/mock-data";

export function CompetitorBarChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={competitors} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis dataKey="name" stroke="#83999F" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis domain={[0, 100]} stroke="#83999F" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          cursor={{ fill: "rgba(234,241,244,0.04)" }}
          contentStyle={{
            background: "#15303D",
            border: "1px solid rgba(234,241,244,0.16)",
            borderRadius: 10,
            color: "#EAF1F4",
            fontSize: 13,
          }}
        />
        <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={48}>
          {competitors.map((c) => (
            <Cell key={c.name} fill={c.isYou ? "#F5C451" : "#587883"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
