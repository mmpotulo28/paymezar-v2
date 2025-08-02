"use client";
import { Card, CardHeader, CardBody, Chip } from "@heroui/react";
import { Button } from "@heroui/button";
import { iTransaction } from "@/types";
import { ChevronRight } from "lucide-react";

export interface Transaction {
	id: string;
	to?: string;
	from?: string;
	amount: number;
	status: string;
	date: string;
	direction: string; // "in" or "out"
}

export interface RecentTransactionsProps {
	transactions: iTransaction[];
	className?: string;
}

export function RecentTransactions({ transactions, className = "" }: RecentTransactionsProps) {
	// Convert iTransaction[] to Transaction[] for display
	const mapped: Transaction[] = transactions.map((tx) => {
		// For demo: treat txType 'deposit' as 'in', others as 'out'
		const direction: "in" | "out" = tx.txType === "deposit" ? "in" : "out";
		return {
			id: tx.id,
			to: direction === "out" ? tx.userId : undefined,
			from: direction === "in" ? tx.userId : undefined,
			amount: tx.value,
			status: tx.status,
			date: tx.createdAt.split("T")[0],
			direction,
		};
	});
	return (
		<Card className={`w-full max-w-2xl ${className}`}>
			<CardHeader className="flex items-center justify-between">
				<span className="text-xl font-bold">Recent Transactions</span>

				<Button
					href="/account/transactions"
					as="a"
					size="sm"
					color="primary"
					variant="light"
					radius="full">
					<span className="flex items-center gap-1 justify-center">
						View All <ChevronRight size={18} />
					</span>
				</Button>
			</CardHeader>
			<CardBody>
				<div className="flex flex-col gap-3">
					{transactions.length === 0 && (
						<div className="text-default-400 text-center py-4">
							No transactions found.
						</div>
					)}
					{mapped.map((tx) => (
						<div
							key={tx.id}
							className="flex items-center justify-between p-3 rounded-lg border border-default-200 bg-default-50">
							<div className="flex items-center gap-3">
								<Chip
									variant="light"
									color={tx.direction === "in" ? "success" : "primary"}>
									{tx.direction === "in" ? "Received" : "Sent"}
								</Chip>
								<span className="font-mono text-xs text-default-600">
									{tx.direction === "in" ? tx.from : tx.to}
								</span>
							</div>
							<span className="font-mono text-sm font-bold">
								{tx.direction === "in" ? "+" : "-"}
								{tx.amount} ZAR
							</span>
							<span className="text-xs text-default-500">{tx.date}</span>
							<Chip
								variant="flat"
								color={
									tx.status === "Completed"
										? "success"
										: tx.status === "Pending"
											? "warning"
											: "default"
								}>
								{tx.status}
							</Chip>
						</div>
					))}
				</div>
			</CardBody>
		</Card>
	);
}
