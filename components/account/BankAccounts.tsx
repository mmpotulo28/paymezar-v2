import { Card, CardHeader, CardBody, Chip, Select, SelectItem, Spinner } from "@heroui/react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Plus, Banknote, DeleteIcon, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { BANKS } from "@/lib/banks";
import { upsertBankAccount, deleteBankAccount } from "@/lib/helpers";
import { useSession } from "@/context/SessionManager";
import { useAccount } from "@/context/AccountContext";

export function BankAccounts() {
	const { user } = useSession();
	const { bankAccounts, loadingBankAccounts, refreshBankAccounts } = useAccount();
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

	const handleRefresh = async () => {
		setRefreshing(true);
		await refreshBankAccounts();
		setRefreshing(false);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleAddAccount = async (e: React.FormEvent) => {
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
			await refreshBankAccounts();
			setForm({ accountHolder: "", accountNumber: "", branchCode: "", bank: "" });
			setShowAdd(false);
			setSuccess("Bank account saved successfully!");
		} else {
			setError(result.message || "Failed to save bank account.");
		}
		setLoading(false);
	};

	const handleDeleteAccount = async (accountId: string) => {
		if (!user?.id) return;
		setLoading(true);
		setError(null);
		setSuccess(null);

		const result = await deleteBankAccount({ userId: user.id });

		if (!result.error) {
			await refreshBankAccounts();
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
						size="sm"
						variant="flat"
						color="primary"
						className="p-0 min-h-0 min-w-10"
						startContent={<Plus size={16} />}
						onPress={() => setShowAdd((v) => !v)}>
						{showAdd ? "Cancel" : ""}
					</Button>
					<Button
						size="sm"
						variant="flat"
						color="secondary"
						isLoading={refreshing}
						onPress={handleRefresh}
						startContent={<RefreshCcw size={16} />}>
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
						<Button
							color="primary"
							type="submit"
							className="w-full"
							radius="md"
							isLoading={loading}>
							Save Account
						</Button>
						{error && <div className="text-red-600 text-xs">{error}</div>}
						{success && <div className="text-green-600 text-xs">{success}</div>}
					</form>
				)}
				{loadingBankAccounts && (
					<div className="text-default-400 text-center py-4">
						<Spinner color="primary" label="Loading..." />
					</div>
				)}
				{!loadingBankAccounts && bankAccounts.length === 0 && (
					<div className="text-default-400 text-center py-4">No bank accounts found.</div>
				)}
				{bankAccounts.map((acc) => (
					<div
						key={acc.id}
						className="flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-default-100 py-2">
						<div className="flex items-center gap-3 flex-1">
							<img
								src={getBankIcon(acc.bank)}
								alt={acc.bank}
								className="w-8 h-8 object-contain rounded bg-white"
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
						<div className="flex flex-row items-center justify-around gap-2">
							<Chip color="default" variant="flat" className="text-xs">
								Added {acc.createdAt.split("T")[0]}
							</Chip>
							<Button
								size="sm"
								color="danger"
								variant="flat"
								onPress={() => handleDeleteAccount(acc.id)}
								disabled={loading}>
								<DeleteIcon size={16} />
							</Button>
						</div>
					</div>
				))}
			</CardBody>
		</Card>
	);
}
