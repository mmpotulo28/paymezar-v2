import { useState } from "react";
import {
	Card,
	CardHeader,
	CardBody,
	Chip,
	Select,
	SelectItem,
	Tabs,
	Tab,
	Tooltip,
	Alert,
} from "@heroui/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Banknote, BanknoteArrowUp, Landmark, Wallet, BanknoteArrowDown } from "lucide-react";
import { useAccount } from "@/context/AccountContext";
import { BANKS } from "@/lib/banks";
import { postApi } from "@/lib/helpers";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

export function WithdrawDeposit() {
	const { user } = useUser();
	const { bankAccounts, refreshBankAccounts, loadingBankAccounts, balance, loadingBalance } =
		useAccount();
	const [tab, setTab] = useState<"withdraw" | "deposit">("withdraw");

	// Withdraw state
	const [withdrawAmount, setWithdrawAmount] = useState("");
	const [selectedBankId, setSelectedBankId] = useState<string>("");
	const [withdrawLoading, setWithdrawLoading] = useState(false);
	const [withdrawSuccess, setWithdrawSuccess] = useState<string | null>(null);
	const [withdrawError, setWithdrawError] = useState<string | null>(null);

	// Deposit state
	const [depositAmount, setDepositAmount] = useState("");
	const [depositLoading, setDepositLoading] = useState(false);
	const [depositSuccess, setDepositSuccess] = useState<string | null>(null);
	const [depositError, setDepositError] = useState<string | null>(null);

	const userBalance =
		balance?.tokens?.find((t) => t.name === "ZAR")?.balance ??
		balance?.tokens?.[0]?.balance ??
		"0.00";

	const isTestnet = true; // Set to true to disable deposit/withdraw on testnet

	const handleWithdraw = async (e: React.FormEvent) => {
		e.preventDefault();
		setWithdrawLoading(true);
		setWithdrawError(null);
		setWithdrawSuccess(null);

		if (!user?.id) {
			setWithdrawError("User not found.");
			setWithdrawLoading(false);
			return;
		}
		if (!withdrawAmount || isNaN(Number(withdrawAmount)) || Number(withdrawAmount) <= 0) {
			setWithdrawError("Please enter a valid amount.");
			setWithdrawLoading(false);
			return;
		}
		if (!selectedBankId) {
			setWithdrawError("Please select a bank account.");
			setWithdrawLoading(false);
			return;
		}

		const bank = bankAccounts.find((b) => b.id === selectedBankId);
		if (!bank) {
			setWithdrawError("Selected bank account not found.");
			setWithdrawLoading(false);
			return;
		}

		const result = await postApi(
			`https://seal-app-qp9cc.ondigitalocean.app/api/v1/withdraw/${encodeURIComponent(user.id)}`,
			{
				amount: Number(withdrawAmount),
				bankAccountId: bank.id,
			},
			{
				"Content-Type": "application/json",
				Authorization: process.env.NEXT_PUBLIC_LISK_API_KEY || "",
			},
			"POST",
		);

		if (!result.error) {
			setWithdrawSuccess("Withdrawal request submitted successfully!");
			setWithdrawAmount("");
			setSelectedBankId("");
			await refreshBankAccounts();
		} else {
			setWithdrawError(result.message || "Failed to submit withdrawal.");
		}
		setWithdrawLoading(false);
	};

	const handleDeposit = async (e: React.FormEvent) => {
		e.preventDefault();
		setDepositLoading(true);
		setDepositError(null);
		setDepositSuccess(null);

		if (!user?.id) {
			setDepositError("User not found.");
			setDepositLoading(false);
			return;
		}
		const isValidAmount =
			!depositAmount || isNaN(Number(depositAmount)) || Number(depositAmount) <= 0;
		if (isValidAmount) {
			setDepositError("Please enter a valid amount.");
			setDepositLoading(false);
			return;
		}
		if (!selectedBankId) {
			setDepositError("Please select a bank account.");
			setDepositLoading(false);
			return;
		}

		const bank = bankAccounts.find((b) => b.id === selectedBankId);
		if (!bank) {
			setDepositError("Selected bank account not found.");
			setDepositLoading(false);
			return;
		}

		const result = await postApi(
			`https://seal-app-qp9cc.ondigitalocean.app/api/v1/deposit/${encodeURIComponent(user.id)}`,
			{
				amount: Number(depositAmount),
				bankAccountId: bank.id,
			},
			{
				"Content-Type": "application/json",
				Authorization: process.env.NEXT_PUBLIC_LISK_API_KEY || "",
			},
			"POST",
		);

		if (!result.error) {
			setDepositSuccess("Deposit request submitted successfully!");
			setDepositAmount("");
			setSelectedBankId("");
			await refreshBankAccounts();
		} else {
			setDepositError(result.message || "Failed to submit deposit.");
		}
		setDepositLoading(false);
	};

	return (
		<Card className="w-full max-w-2xl shadow-lg border border-default-200">
			<CardHeader className="flex flex-col gap-2">
				<div className="flex items-center gap-2">
					<Wallet size={20} className="text-primary" />
					<span className="text-lg font-semibold">Withdraw / Deposit</span>
				</div>
				<div className="flex items-center gap-3 mt-2">
					<span className="text-xs text-default-500 font-medium">Your ZAR Balance:</span>
					<Chip color="primary" variant="flat" className="font-mono text-base px-3 py-1">
						{loadingBalance ? "Loading..." : `${userBalance} ZAR`}
					</Chip>
				</div>

				{isTestnet && (
					<Alert
						color={"danger"}
						variant="bordered"
						title={`Heads Up!`}
						description={`Withdrawals and deposits are disabled on testnet.`}
					/>
				)}
			</CardHeader>
			<CardBody>
				<Tabs
					selectedKey={tab}
					onSelectionChange={(key) => setTab(key as "withdraw" | "deposit")}
					variant="solid"
					color="secondary"
					className="mb-4">
					<Tab key="withdraw" title="Withdraw">
						<form className="flex flex-col gap-4" onSubmit={handleWithdraw}>
							<Input
								label="Amount to Withdraw"
								type="number"
								value={withdrawAmount}
								onChange={(e) => setWithdrawAmount(e.target.value)}
								startContent={<Banknote size={16} />}
								min={1}
								required
								endContent={
									<Tooltip content="Maximum: your available balance">
										<span className="text-xs text-default-400">
											Max: {userBalance} ZAR
										</span>
									</Tooltip>
								}
							/>
							<Select
								label="Select Bank Account"
								value={selectedBankId}
								onChange={(e) => setSelectedBankId(e.target.value)}
								description="Choose the bank account to withdraw from"
								required
								startContent={<Landmark size={16} />}
								disabled={loadingBankAccounts || bankAccounts.length === 0}>
								{bankAccounts.map((bank) => (
									<SelectItem
										startContent={
											<Image
												src={
													BANKS.find((b) => b.name === bank.bank)?.icon ||
													""
												}
												alt={bank.bank}
												width={16}
												height={16}
											/>
										}
										description={bank.bank}
										textValue={bank.accountNumber}
										key={bank.id}>
										{bank.accountHolder} - ({bank.accountNumber})
									</SelectItem>
								))}
							</Select>
							<Tooltip
								radius="sm"
								showArrow
								color="warning"
								content="Withdrawals are disabled on testnet">
								<Button
									color="primary"
									type="submit"
									isLoading={withdrawLoading}
									disabled={withdrawLoading || isTestnet}
									className="w-full"
									startContent={<BanknoteArrowDown size={16} />}
									radius="full">
									Withdraw
								</Button>
							</Tooltip>
							{withdrawSuccess && (
								<Chip
									color="success"
									variant="flat"
									className="w-full justify-center">
									{withdrawSuccess}
								</Chip>
							)}
							{withdrawError && (
								<Chip
									color="danger"
									variant="flat"
									className="w-full justify-center">
									{withdrawError}
								</Chip>
							)}
						</form>
					</Tab>
					<Tab key="deposit" title="Deposit">
						<form className="flex flex-col gap-4" onSubmit={handleDeposit}>
							<Input
								label="Amount to Deposit"
								type="number"
								value={depositAmount}
								onChange={(e) => setDepositAmount(e.target.value)}
								min={1}
								required
								startContent={<Banknote size={16} />}
							/>
							<Select
								label="Select Bank Account"
								value={selectedBankId}
								onChange={(e) => setSelectedBankId(e.target.value)}
								required
								description="Choose the bank account to deposit into"
								startContent={<Landmark size={16} />}
								disabled={loadingBankAccounts || bankAccounts.length === 0}>
								{bankAccounts.map((bank) => (
									<SelectItem
										description={bank.bank}
										textValue={bank.accountNumber}
										key={bank.id}>
										{bank.accountHolder} - ({bank.accountNumber})
									</SelectItem>
								))}
							</Select>
							<Tooltip
								showArrow
								color="warning"
								content="Deposits are disabled on testnet">
								<Button
									color="primary"
									type="submit"
									isLoading={depositLoading}
									disabled={depositLoading || isTestnet}
									className="w-full"
									radius="full"
									startContent={<BanknoteArrowUp size={16} />}>
									Deposit
								</Button>
							</Tooltip>
							{depositSuccess && (
								<Chip
									color="success"
									variant="flat"
									className="w-full justify-center">
									{depositSuccess}
								</Chip>
							)}
							{depositError && (
								<Chip
									color="danger"
									variant="flat"
									className="w-full justify-center">
									{depositError}
								</Chip>
							)}
						</form>
					</Tab>
				</Tabs>
			</CardBody>
		</Card>
	);
}
