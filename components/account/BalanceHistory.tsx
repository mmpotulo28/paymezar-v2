"use client";
import { Card, CardHeader, CardBody } from "@heroui/react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip as RechartsTooltip,
	ResponsiveContainer,
	CartesianGrid,
	Legend,
} from "recharts";
import { useAccount } from "@/context/AccountContext";
import { useEffect, useMemo } from "react";
import { useUser } from "@clerk/nextjs";

export function BalanceHistory() {
	const { transactions, charges, fetchTransactions, fetchCharges } = useAccount();
	const { user } = useUser();

	// fetch on mount
	useEffect(() => {
		fetchTransactions(user?.id || "");
		fetchCharges(user?.id || "");
	}, [fetchTransactions, fetchCharges, user?.id]);

	// Transactions history trend: count per day
	const transactionsHistory = useMemo(() => {
		const daily: Record<string, number> = {};
		transactions.forEach((tx) => {
			const date = tx.createdAt.split("T")[0];
			daily[date] = (daily[date] || 0) + 1;
		});
		const dates = Object.keys(daily).sort();
		return dates.map((date) => ({
			date,
			count: daily[date],
		}));
	}, [transactions]);

	// Charges history trend: count per day
	const chargesHistory = useMemo(() => {
		const daily: Record<string, number> = {};
		charges?.forEach((charge) => {
			const date = charge.createdAt.split("T")[0];
			daily[date] = (daily[date] || 0) + 1;
		});
		const dates = Object.keys(daily).sort();
		return dates.map((date) => ({
			date,
			count: daily[date],
		}));
	}, [charges]);

	return (
		<Card className="w-full max-w-2xl shadow-lg border border-default-200">
			<CardHeader className="text-lg font-semibold flex flex-col gap-2">
				<span>Transactions & Charges History</span>
				<span className="text-xs text-default-500 font-normal">
					View your transaction and charge trends over time
				</span>
			</CardHeader>
			<CardBody>
				<div className="mb-8">
					<div className="text-lg font-semibold mb-2">Transactions History</div>
					<div className="w-full h-64">
						<ResponsiveContainer height="100%" width="100%">
							<LineChart data={transactionsHistory}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis allowDecimals={false} />
								<RechartsTooltip />
								<Legend />
								<Line
									dataKey="count"
									dot={{ r: 4 }}
									name="Transactions"
									stroke="#6366f1"
									strokeWidth={2}
									type="monotone"
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>
				<div>
					<div className="text-lg font-semibold mb-2">Charges History</div>
					<div className="w-full h-64">
						<ResponsiveContainer height="100%" width="100%">
							<LineChart data={chargesHistory}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis allowDecimals={false} />
								<RechartsTooltip />
								<Legend />
								<Line
									dataKey="count"
									dot={{ r: 4 }}
									name="Charges"
									stroke="#10b981"
									strokeWidth={2}
									type="monotone"
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>
			</CardBody>
		</Card>
	);
}
