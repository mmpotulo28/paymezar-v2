"use client";
import { Card, CardHeader, CardBody } from "@heroui/react";
import { Tabs, Tab } from "@heroui/tabs";
import { Input } from "@heroui/input";
import { TransactionsTable } from "@/components/transactions-table";
import { dummyTransactions } from "@/lib/dummy-transactions";
import { useState } from "react";

export default function AccountTransactionsPage() {
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<string | null>(null);

	// Filter transactions by search and status
	const filtered = dummyTransactions.filter((tx) => {
		const matchesSearch =
			search === "" ||
			tx.id.includes(search) ||
			tx.userId.includes(search) ||
			(tx.externalId && tx.externalId.includes(search));
		const matchesStatus = !status || tx.status === status;
		return matchesSearch && matchesStatus;
	});

	return (
		<section className="flex flex-col items-center min-h-[70vh] py-8 gap-8 w-full">
			<Card className="w-full max-w-[80vw]">
				<CardHeader className="text-xl font-bold">Manage Transactions</CardHeader>
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
					<TransactionsTable transactions={filtered} />
				</CardBody>
			</Card>
		</section>
	);
}
