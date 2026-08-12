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
          stroke="#83999F"
          fontSize={12.5}
          tickLine={false}
          axisLine={false}
        />
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
        <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={16}>
          {channelScores.map((c) => (
            <Cell key={c.key} fill={c.score >= 80 ? "#F5C451" : "#4DA3FF"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
