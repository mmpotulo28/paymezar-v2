import { Card, CardHeader, CardBody } from "@heroui/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";

export function BalanceHistory() {
  const balanceHistory = [
    { date: "2025-07-24", balance: 1000 },
    { date: "2025-07-25", balance: 1800 },
    { date: "2025-07-26", balance: 1500 },
    { date: "2025-07-27", balance: 2000 },
    { date: "2025-07-28", balance: 4000 },
    { date: "2025-07-29", balance: 2800 },
    { date: "2025-07-30", balance: 3500 },
  ];
  const activityHistory = [
    { date: "2025-07-24", count: 1 },
    { date: "2025-07-25", count: 2 },
    { date: "2025-07-26", count: 1 },
    { date: "2025-07-27", count: 3 },
    { date: "2025-07-28", count: 2 },
    { date: "2025-07-29", count: 1 },
    { date: "2025-07-30", count: 2 },
  ];

  return (
    <Card className="w-full max-w-2xl shadow-lg border border-default-200">
      <CardHeader className="text-lg font-semibold flex flex-col gap-2">
        <span>Balance History</span>
        <span className="text-xs text-default-500 font-normal">
          View your ZAR balance over time
        </span>
      </CardHeader>
      <CardBody>
        <div className="w-full h-64">
          <ResponsiveContainer height="100%" width="100%">
            <LineChart data={balanceHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Line
                dataKey="balance"
                dot={{ r: 4 }}
                name="Balance (ZAR)"
                stroke="#6366f1"
                strokeWidth={2}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-8">
          <div className="text-lg font-semibold mb-2">Activity History</div>
          <div className="w-full h-64">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={activityHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar
                  barSize={32}
                  dataKey="count"
                  fill="#10b981"
                  name="Transactions"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
