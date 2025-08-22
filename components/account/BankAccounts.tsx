import {
	Card,
	CardHeader,
	CardBody,
	Chip,
	Select,
	SelectItem,
	Spinner,
	Alert,
} from "@heroui/react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Plus, Banknote, DeleteIcon, RefreshCcw } from "lucide-react";
import { useCallback, useState } from "react";
import { useUser } from "@clerk/nextjs";

import { BANKS } from "@/lib/banks";
import { upsertBankAccount, deleteBankAccount } from "@/lib/helpers";
import { useAccount } from "@/context/AccountContext";
import Image from "next/image";

export function BankAccounts() {
	const { user } = useUser();
	const { bankAccount, bankLoading, refreshBankAccount, bankError } = useAccount();
	const [showAdd, setShowAdd] = useState(false);
	const [form, setForm] = useState<{
		accountHolder: string;
		accountNumber: string;
		branchCode: string;
		bank: string;
	}>({
		accountHolder: "",
		accountNumber: "",
		branchCode: "",
		bank: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [refreshing, setRefreshing] = useState(false);

	const handleRefresh = useCallback(async () => {
		setRefreshing(true);
		await refreshBankAccount(user?.id || "");
		setRefreshing(false);
	}, [refreshBankAccount, user]);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
			setForm({ ...form, [e.target.name]: e.target.value });
		},
		[form],
	);

	const handleAddAccount = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			setLoading(true);
			setError(null);
			setSuccess(null);

			if (!user?.id) {
				setError("User not found.");
				setLoading(false);

				return;
			}

			const { accountHolder, accountNumber, branchCode, bank } = form;

			const result = await upsertBankAccount({
				userId: user.id,
				accountHolder,
				accountNumber,
				branchCode,
				bankName: bank,
			});

			if (!result.error && result.data?.bankAccount) {
				await refreshBankAccount(user?.id || "");
				setForm({
					accountHolder: "",
					accountNumber: "",
					branchCode: "",
					bank: "",
				});
				setShowAdd(false);
				setSuccess("Bank account saved successfully!");
			} else {
				setError(result.message || "Failed to save bank account.");
			}
			setLoading(false);
		},
		[form, user, refreshBankAccount],
	);

	const handleDeleteAccount = async () => {
		if (!user?.id) return;
		setLoading(true);
		setError(null);
		setSuccess(null);

		const result = await deleteBankAccount({ userId: user.id });

		if (!result.error) {
			await refreshBankAccount(user?.id || "");
			setSuccess("Bank account deleted successfully!");
		} else {
			setError(result.message || "Failed to delete bank account.");
		}
		setLoading(false);
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
				<div className="flex gap-2">
					<Button
						className="p-0 min-h-0 min-w-10"
						color="primary"
						disabled={loading || !user}
						size="sm"
						startContent={<Plus size={16} />}
						variant="flat"
						onPress={() => setShowAdd((v) => !v)}>
						{showAdd ? "Cancel" : ""}
					</Button>
					<Button
						color="secondary"
						disabled={loading}
						isLoading={refreshing}
						size="sm"
						startContent={<RefreshCcw size={16} />}
						variant="flat"
						onPress={handleRefresh}>
						Refresh
					</Button>
				</div>
			</CardHeader>
			<CardBody className="flex flex-col gap-6">
				{showAdd && (
					<form
						className="grid lg:grid-cols-2 sm:grid-cols-1 gap-3 mb-4"
						onSubmit={handleAddAccount}>
						<Input
							required
							label="Account Holder"
							name="accountHolder"
							value={form.accountHolder}
							onChange={handleChange}
						/>
						<Input
							required
							label="Account Number"
							name="accountNumber"
							value={form.accountNumber}
							onChange={handleChange}
						/>
						<Input
							required
							label="Branch Code"
							name="branchCode"
							value={form.branchCode}
							onChange={handleChange}
						/>
						<div>
							<Select
								className="max-w-xs"
								items={BANKS.map((bank) => ({
									key: bank.name,
									icon: bank.icon,
									Label: bank.name,
								}))}
								label="Select a Bank"
								placeholder="Select a bank"
								onChange={(item) => setForm({ ...form, bank: item.target.value })}>
								{(bank) => <SelectItem>{bank.Label}</SelectItem>}
							</Select>
						</div>
						<Button
							className="w-full"
							color="primary"
							disabled={loading || !user}
							isLoading={loading}
							radius="md"
							type="submit">
							Save Account
						</Button>
						{error && <div className="text-red-600 text-xs">{error}</div>}
						{success && <div className="text-green-600 text-xs">{success}</div>}
					</form>
				)}
				{bankLoading && (
					<div className="text-default-400 text-center py-4">
						<Spinner color="primary" label="Loading..." />
					</div>
				)}

				{bankError && (
					<Alert color="danger" variant="bordered">
						{bankError}
					</Alert>
				)}

				{!bankLoading && !bankAccount && !bankError && (
					<div className="text-default-400 text-center py-4">No bank accounts found.</div>
				)}
				{bankAccount && (
					<div
						key={bankAccount.id}
						className="flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-default-100 py-2">
						<div className="flex items-center gap-3 flex-1">
							<Image
								alt={bankAccount.bank}
								className="w-8 h-8 object-contain rounded bg-white"
								src={getBankIcon(bankAccount.bank)}
								width={32}
								height={32}
							/>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-default-700">
									{bankAccount.accountHolder}
								</span>
								<span className="text-xs text-default-500">
									{bankAccount.bank} • {bankAccount.accountNumber} • Branch:{" "}
									{bankAccount.branchCode}
								</span>
							</div>
						</div>
						<div className="flex flex-row items-center justify-around gap-2">
							<Chip className="text-xs" color="default" variant="flat">
								Added {bankAccount.createdAt.split("T")[0]}
							</Chip>
							<Button
								color="danger"
								disabled={loading || !user}
								size="sm"
								variant="flat"
								onPress={() => handleDeleteAccount()}>
								<DeleteIcon size={16} />
							</Button>
						</div>
					</div>
				)}
			</CardBody>
		</Card>
	);
}
