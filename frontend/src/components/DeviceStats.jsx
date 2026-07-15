import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

// Teal-led palette matching the app's --chart-* tokens.
const COLORS = [
  "oklch(0.755 0.115 173)",
  "oklch(0.78 0.125 75)",
  "oklch(0.68 0.1 220)",
  "oklch(0.7 0.14 35)",
  "oklch(0.62 0.08 300)",
];

export default function DeviceStats({ stats }) {
  const deviceCount = stats.reduce((acc, item) => {
    const device = item.device || "Unknown";
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {});

  const result = Object.keys(deviceCount).map((device) => ({
    device,
    count: deviceCount[device],
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={result}
            labelLine={false}
            label={({ device, percent }) =>
              `${device}: ${(percent * 100).toFixed(0)}%`
            }
            dataKey="count"
            stroke="none"
          >
            {result.map((entry, index) => (
              <Cell key={entry.device} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
