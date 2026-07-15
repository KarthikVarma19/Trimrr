import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const TEAL = "oklch(0.755 0.115 173)";
const MUTED = "oklch(0.71 0.014 80)";

export default function Location({ stats = [] }) {
  const cityCount = stats.reduce((acc, item) => {
    const city = item.city || "Unknown";
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});

  const cities = Object.entries(cityCount).map(([city, count]) => ({
    city,
    count,
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={cities.slice(0, 5)}>
          <CartesianGrid stroke="oklch(0.97 0.01 85 / 8%)" vertical={false} />
          <XAxis
            dataKey="city"
            stroke={MUTED}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke={MUTED}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: "oklch(0.205 0.009 75)",
              border: "1px solid oklch(0.97 0.01 85 / 10%)",
              borderRadius: 8,
              color: "oklch(0.945 0.008 85)",
            }}
            cursor={{ stroke: MUTED, strokeDasharray: 4 }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke={TEAL}
            strokeWidth={2}
            dot={{ fill: TEAL, r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
