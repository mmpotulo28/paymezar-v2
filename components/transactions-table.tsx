"use client";
import { iTransaction } from "@/types";
import { Chip, Tooltip, Button } from "@heroui/react";
import { EyeIcon } from "lucide-react";
import { useDisclosure } from "@heroui/modal";
import { useState } from "react";
import TransactionModal from "./modals/transaction-modal";
import { statusColorMap } from "@/lib/helpers";

interface TransactionsTableProps {
	transactions: iTransaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selected, setSelected] = useState<iTransaction | null>(null);

	const handleView = (tx: iTransaction) => {
		setSelected(tx);
		onOpen();
	};

	return (
		<>
			<div className="flex flex-col gap-3">
				{transactions.length === 0 && (
					<div className="text-default-400 text-center py-4">No transactions found.</div>
				)}
				{transactions.map((tx) => (
					<div
						key={tx.id}
						className="rounded-xl border border-default-200 bg-default-50 hover:bg-default-100 transition flex flex-col sm:flex-row items-start sm:items-center gap-2 p-4">
						<div className="flex-1 flex flex-col gap-1">
							<div className="flex items-center gap-2">
								<span className="font-mono text-xs text-default-500 truncate max-w-[120px]">
									{tx.id}
								</span>
								<Chip
									variant="flat"
									color={statusColorMap[tx.status] || "default"}
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
						<div className="flex flex-col items-end gap-1 min-w-[90px]">
							<span className="font-mono text-base font-bold text-primary">
								{tx.value.toLocaleString("en-ZA", {
									style: "currency",
									currency: "ZAR",
								})}
							</span>
							<span className="text-xs text-default-500">{tx.currency}</span>
						</div>
						<div className="flex items-center gap-2">
							<Tooltip content="Details">
								<Button
									size="sm"
									variant="flat"
									className="p-0"
									onPress={() => handleView(tx)}>
									<EyeIcon />
								</Button>
							</Tooltip>
						</div>
					</div>
				))}
			</div>
			<TransactionModal isOpen={isOpen} onClose={onClose} selected={selected} />
		</>
	);
}
