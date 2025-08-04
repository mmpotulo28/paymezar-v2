"use client";
import { Card, CardHeader, CardBody, Button, Chip } from "@heroui/react";
import { Tabs, Tab } from "@heroui/tabs";
import { Input } from "@heroui/input";
import { useAccount } from "@/context/AccountContext";
import { useState } from "react";
import { RefreshCcw } from "lucide-react";
import TransactionModal from "@/components/modals/transaction-modal";
import { iTransaction } from "@/types";

export default function AccountTransactionsPage() {
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<string | null>(null);
	const { transactions, loadingTransactions, error, refreshTransactions } = useAccount();
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedTx, setSelectedTx] = useState<iTransaction | null>(null);

	// Filter transactions by search and status
	const filtered = transactions.filter((tx) => {
		const matchesSearch =
			search === "" ||
			tx.id.includes(search) ||
			tx.userId.includes(search) ||
			(tx.externalId && tx.externalId.includes(search));
		const matchesStatus = !status || tx.status === status;
		return matchesSearch && matchesStatus;
	});

	const handleView = (tx: iTransaction) => {
		setSelectedTx(tx);
		setModalOpen(true);
	};

	return (
		<section className="flex flex-col items-center min-h-[70vh] py-8 gap-8 w-full">
			<Card className="w-full max-w-2xl">
				<CardHeader className="text-xl font-bold flex items-center justify-between">
					<span>Manage Transactions</span>
					<Button
						type="button"
						color="secondary"
						variant="flat"
						onPress={refreshTransactions}
						disabled={loadingTransactions}
						startContent={
							<RefreshCcw
								size={16}
								className={loadingTransactions ? "animate-spin" : ""}
							/>
						}>
						{loadingTransactions ? "Refreshing..." : "Refresh"}
					</Button>
				</CardHeader>
				<CardBody className="flex flex-col gap-4">
					<div className="flex flex-col sm:flex-row gap-4">
						<Input
							placeholder="Search by ID, user, or external ref..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="flex-1"
							size="sm"
						/>
						<Tabs
							selectedKey={status || "all"}
							onSelectionChange={(key) =>
								setStatus(key === "all" ? null : String(key))
							}
							className="flex-1"
							variant="underlined">
							<Tab key="all" title="All" />
							<Tab key="Completed" title="Completed" />
							<Tab key="Pending" title="Pending" />
						</Tabs>
					</div>
					{loadingTransactions && (
						<div className="text-default-400 text-center py-4">Loading...</div>
					)}
					{error && <div className="text-red-600 text-center py-4">{error}</div>}
					<div className="flex flex-col gap-3 mt-2">
						{filtered.length === 0 && !loadingTransactions && (
							<div className="text-default-400 text-center py-4">
								No transactions found.
							</div>
						)}
						{filtered.map((tx) => (
							<button
								key={tx.id}
								type="button"
								onClick={() => handleView(tx)}
								className="w-full text-left rounded-xl border border-default-200 bg-default-50 hover:bg-default-100 transition flex flex-col sm:flex-row items-start justify-center gap-2 p-4 cursor-pointer">
								<div className="flex-1 flex flex-col gap-1">
									<div className="flex items-center gap-2">
										<span className="font-mono text-xs text-default-500 truncate max-w-[120px]">
											{tx.id}
										</span>
										<Chip
											variant="flat"
											color={
												tx.status === "Completed"
													? "success"
													: tx.status === "Pending"
														? "warning"
														: "default"
											}
											size="sm">
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
							</button>
						))}
					</div>
				</CardBody>
			</Card>
			<TransactionModal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				selected={selectedTx}
			/>
		</section>
	);
}
