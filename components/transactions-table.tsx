"use client";
import { iTransaction } from "@/types";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Chip,
	Tooltip,
} from "@heroui/react";
import type { ChipProps } from "@heroui/react";
import {
	Modal,
	ModalBody,
	ModalHeader,
	ModalFooter,
	useDisclosure,
	ModalContent,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { useCallback, useState } from "react";
import * as React from "react";
import { DeleteIcon, EyeIcon } from "lucide-react";
import { statusColorMap } from "@/lib/helpers";
import TransactionModal from "./modals/transaction-modal";

interface TransactionsTableProps {
	transactions: iTransaction[];
}

const columns = [
	{ name: "ID", uid: "id" },
	{ name: "USER", uid: "userId" },
	{ name: "TYPE", uid: "txType" },
	{ name: "METHOD", uid: "method" },
	{ name: "AMOUNT", uid: "value" },
	{ name: "STATUS", uid: "status" },
	{ name: "DATE", uid: "createdAt" },
	{ name: "ACTIONS", uid: "actions" },
];

export function TransactionsTable({ transactions }: TransactionsTableProps) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selected, setSelected] = useState<iTransaction | null>(null);

	const handleView = (tx: iTransaction) => {
		setSelected(tx);
		onOpen();
	};

	const renderCell = useCallback((tx: iTransaction, columnKey: React.Key) => {
		switch (columnKey) {
			case "id":
				return <span className="font-mono text-xs">{tx.id}</span>;
			case "userId":
				return <span className="font-mono text-xs">{tx.userId}</span>;
			case "txType":
				return <span className="text-xs">{tx.txType}</span>;
			case "method":
				return <span className="text-xs">{tx.method}</span>;
			case "value":
				return (
					<span className="font-mono text-xs font-bold">
						{tx.value.toLocaleString("en-ZA", {
							style: "currency",
							currency: tx.currency,
						})}
					</span>
				);
			case "status":
				return (
					<Chip
						className="capitalize"
						color={statusColorMap[tx.status] || "default"}
						size="sm"
						variant="flat">
						{tx.status}
					</Chip>
				);
			case "createdAt":
				return <span className="text-xs">{tx.createdAt.split("T")[0]}</span>;
			case "actions":
				return (
					<div className="relative flex items-center gap-2">
						<Tooltip content="Details">
							<Button
								size="sm"
								variant="flat"
								className="p-0"
								onPress={() => handleView(tx)}>
								<EyeIcon />
							</Button>
						</Tooltip>
						<Tooltip color="danger" content="Delete transaction">
							<span className="text-lg text-danger cursor-pointer active:opacity-50">
								<DeleteIcon />
							</span>
						</Tooltip>
					</div>
				);
			default:
				return null;
		}
	}, []);

	return (
		<>
			<Table aria-label="Transactions table" removeWrapper className="w-full">
				<TableHeader columns={columns}>
					{(column) => (
						<TableColumn
							key={column.uid}
							align={column.uid === "actions" ? "center" : "start"}>
							{column.name}
						</TableColumn>
					)}
				</TableHeader>
				<TableBody items={transactions} emptyContent={"No transactions found."}>
					{(item) => (
						<TableRow key={item.id}>
							{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
						</TableRow>
					)}
				</TableBody>
			</Table>
			<TransactionModal isOpen={isOpen} onClose={onClose} selected={selected} />
		</>
	);
}
