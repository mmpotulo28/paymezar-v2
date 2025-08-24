"use client";
import { Card, CardHeader, CardBody, Chip, Button } from "@heroui/react";
import { Link } from "@heroui/react";
import { useAccount } from "@/context/AccountContext";
import { useState } from "react";

export interface RecentTransactionsProps {
	className?: string;
}

export function RecentTransactions({ className = "" }: RecentTransactionsProps) {
	const { transactions } = useAccount();
	const PAGE_SIZE = 3;
	const [page, setPage] = useState(1);

	const totalPages = Math.ceil(transactions.length / PAGE_SIZE);
	const paginatedTxs = transactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

	return (
		<Card className={`w-full max-w-2xl ${className}`}>
			<CardHeader className="flex items-center justify-between">
				<span className="text-xl font-bold">Recent Transactions</span>
				<Link isBlock showAnchorIcon href="/account/transactions" size="sm">
					View All
				</Link>
			</CardHeader>
			<CardBody>
				<div className="flex flex-col gap-3">
					{transactions.length === 0 && (
						<div className="text-default-400 text-center py-4">
							No transactions found.
						</div>
					)}
					{paginatedTxs.map((tx) => (
						<div
							key={tx.id}
							className="w-full text-left rounded-xl border border-default-200 bg-default-50 hover:bg-default-100 transition flex flex-col sm:flex-row items-start justify-center gap-2 p-4 cursor-pointer">
							<div className="flex-1 flex flex-col gap-1">
								<div className="flex items-center gap-2">
									<span className="font-mono text-xs text-default-500 truncate max-w-[120px]">
										{tx.id}
									</span>
									<Chip
										color={
											tx.status === "Completed"
												? "success"
												: tx.status === "Pending"
													? "warning"
													: "default"
										}
										size="sm"
										variant="flat">
										{tx.status}
									</Chip>
								</div>
								<span className="text-xs text-default-400">
									{tx.createdAt.split("T")[0]}
								</span>
								<span className="text-xs text-default-600">
									Type: {tx.txType} | Method: {tx.method}
								</span>
								{tx.externalId && (
									<span className="text-xs text-default-400">
										External Ref: {tx.externalId}
									</span>
								)}
							</div>
							<div className="flex md:flex-col sm:flex-row md:items-end sm:items-start gap-1 min-w-[90px]">
								<span className="font-mono text-base font-bold text-primary">
									{tx.value.toLocaleString("en-ZA", {
										style: "currency",
										currency: "ZAR",
									})}
								</span>
								<span className="text-xs text-default-500">{tx.currency}</span>
							</div>
						</div>
					))}
				</div>
				{/* Pagination controls */}
				{totalPages > 1 && (
					<div className="flex justify-center items-center gap-2 mt-4">
						<Button
							size="sm"
							variant="flat"
							disabled={page === 1}
							onPress={() => setPage(page - 1)}>
							Prev
						</Button>
						<span className="text-xs">
							Page {page} of {totalPages}
						</span>
						<Button
							size="sm"
							variant="flat"
							disabled={page === totalPages}
							onPress={() => setPage(page + 1)}>
							Next
						</Button>
					</div>
				)}
			</CardBody>
		</Card>
	);
}
