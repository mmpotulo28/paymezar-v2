import { Card, CardHeader, CardBody, Chip, Select, SelectItem } from "@heroui/react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Plus, Banknote } from "lucide-react";
import { useState } from "react";
import { dummyBankAccounts } from "@/lib/dummy-bank-accounts";
import { iBankAccount } from "@/types";
import { BANKS } from "@/lib/banks";

export function BankAccounts() {
	const [accounts, setAccounts] = useState<iBankAccount[]>(dummyBankAccounts);
	const [showAdd, setShowAdd] = useState(false);
	const [form, setForm] = useState<
		Omit<iBankAccount, "id" | "userId" | "createdAt" | "updatedAt">
	>({
		accountHolder: "",
		accountNumber: "",
		branchCode: "",
		bank: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleAddAccount = (e: React.FormEvent) => {
		e.preventDefault();
		const newAccount: iBankAccount = {
			id: `bank-${Date.now()}`,
			userId: "user-1",
			accountHolder: form.accountHolder,
			accountNumber: form.accountNumber,
			branchCode: form.branchCode,
			bank: form.bank,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		setAccounts((prev) => [...prev, newAccount]);
		setForm({ accountHolder: "", accountNumber: "", branchCode: "", bank: "" });
		setShowAdd(false);
	};

	const getBankIcon = (bankName: string) => {
		const bank = BANKS.find((b) => b.name.toLowerCase() === bankName.toLowerCase());
		return bank?.icon || "/banks/bank.svg";
	};

	return (
		<Card className="w-full max-w-2xl shadow-lg border border-default-200">
			<CardHeader className="text-lg font-semibold flex items-center justify-between">
				<span className="flex items-center gap-2">
					<Banknote size={18} /> Bank Accounts
				</span>
				<Button
					size="sm"
					variant="flat"
					color="primary"
					startContent={<Plus size={16} />}
					onClick={() => setShowAdd((v) => !v)}>
					{showAdd ? "Cancel" : "Add"}
				</Button>
			</CardHeader>
			<CardBody className="flex flex-col gap-6">
				{showAdd && (
					<form
						className="grid lg:grid-cols-2 sm:grid-cols-1 gap-3 mb-4"
						onSubmit={handleAddAccount}>
						<Input
							label="Account Holder"
							name="accountHolder"
							value={form.accountHolder}
							onChange={handleChange}
							required
						/>
						<Input
							label="Account Number"
							name="accountNumber"
							value={form.accountNumber}
							onChange={handleChange}
							required
						/>
						<Input
							label="Branch Code"
							name="branchCode"
							value={form.branchCode}
							onChange={handleChange}
							required
						/>
						<div>
							<Select
								className="max-w-xs"
								items={BANKS.map((bank) => ({
									key: bank.name,
									icon: bank.icon,
									Label: bank.name,
								}))}
								onChange={(item) => setForm({ ...form, bank: item.target.value })}
								label="Select a Bank"
								placeholder="Select a bank">
								{(bank) => <SelectItem>{bank.Label}</SelectItem>}
							</Select>
						</div>
						<Button color="primary" type="submit" className="w-full" radius="md">
							Save Account
						</Button>
					</form>
				)}
				{accounts.length === 0 && (
					<div className="text-default-400 text-center py-4">No bank accounts found.</div>
				)}
				{accounts.map((acc) => (
					<div
						key={acc.id}
						className="flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-default-100 py-2">
						<div className="flex items-center gap-3 flex-1">
							<img
								src={getBankIcon(acc.bank)}
								alt={acc.bank}
								className="w-8 h-8 object-contain rounded bg-white border"
								style={{ minWidth: 32, minHeight: 32 }}
							/>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-default-700">
									{acc.accountHolder}
								</span>
								<span className="text-xs text-default-500">
									{acc.bank} • {acc.accountNumber} • Branch: {acc.branchCode}
								</span>
							</div>
						</div>
						<Chip color="primary" variant="flat" className="text-xs">
							Added {acc.createdAt.split("T")[0]}
						</Chip>
					</div>
				))}
			</CardBody>
		</Card>
	);
}
