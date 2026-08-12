"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { trend } from "@/lib/mock-data";

export function TrendChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="week"
          stroke="#83999F"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[0, 100]}
          stroke="#83999F"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "#15303D",
            border: "1px solid rgba(234,241,244,0.16)",
            borderRadius: 10,
            color: "#EAF1F4",
            fontSize: 13,
          }}
          labelStyle={{ color: "#83999F" }}
        />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#4DA3FF"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "#4DA3FF" }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
