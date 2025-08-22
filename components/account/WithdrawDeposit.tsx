import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Chip, Tabs, Tab, Tooltip, Alert } from "@heroui/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Banknote, BanknoteArrowUp, Wallet, BanknoteArrowDown } from "lucide-react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

import { useAccount } from "@/context/AccountContext";
import { BANKS } from "@/lib/banks";
import { postApi } from "@/lib/helpers";

export function WithdrawDeposit() {
	const { user } = useUser();
	const {
		bankAccount,
		refreshBankAccount,
		bankLoading,
		balances,
		balancesLoading,
		refreshBalances,
	} = useAccount();
	const [tab, setTab] = useState<"withdraw" | "deposit">("withdraw");

	// Withdraw state
	const [withdrawAmount, setWithdrawAmount] = useState("");
	const [withdrawLoading, setWithdrawLoading] = useState(false);
	const [withdrawSuccess, setWithdrawSuccess] = useState<string | null>(null);
	const [withdrawError, setWithdrawError] = useState<string | null>(null);

	// Deposit state
	const [depositAmount, setDepositAmount] = useState("");
	const [depositLoading, setDepositLoading] = useState(false);
	const [depositSuccess, setDepositSuccess] = useState<string | null>(null);
	const [depositError, setDepositError] = useState<string | null>(null);

	useEffect(() => {
		if (!user) return;

		refreshBalances(user?.id || "");
		refreshBankAccount(user?.id || "");
	}, [refreshBalances, refreshBankAccount, user]);

	const userBalance =
		balances?.find((t) => t.name === "ZAR")?.balance ?? balances?.[0]?.balance ?? "0.00";

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
		if (!bankAccount) {
			setWithdrawError("Please select a bank account.");
			setWithdrawLoading(false);

			return;
		}
		if (!bankAccount) {
			setWithdrawError("Selected bank account not found.");
			setWithdrawLoading(false);

			return;
		}

		const result = await postApi(
			`https://seal-app-qp9cc.ondigitalocean.app/api/v1/withdraw/${encodeURIComponent(user.id)}`,
			{
				amount: Number(withdrawAmount),
				bankAccountId: bankAccount.id,
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
			await refreshBankAccount(user.id);
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
		if (!bankAccount) {
			setDepositError("Please select a bank account.");
			setDepositLoading(false);

			return;
		}

		if (!bankAccount) {
			setDepositError("Selected bank account not found.");
			setDepositLoading(false);

			return;
		}

		const result = await postApi(
			`https://seal-app-qp9cc.ondigitalocean.app/api/v1/deposit/${encodeURIComponent(user.id)}`,
			{
				amount: Number(depositAmount),
				bankAccountId: bankAccount.id,
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
			await refreshBankAccount(user.id);
		} else {
			setDepositError(result.message || "Failed to submit deposit.");
		}
		setDepositLoading(false);
	};

	return (
		<Card className="w-full max-w-2xl shadow-lg border border-default-200">
			<CardHeader className="flex flex-col gap-2">
				<div className="flex items-center gap-2">
					<Wallet className="text-primary" size={20} />
					<span className="text-lg font-semibold">Withdraw / Deposit</span>
				</div>
				<div className="flex items-center gap-3 mt-2">
					<span className="text-xs text-default-500 font-medium">Your ZAR Balance:</span>
					<Chip className="font-mono text-base px-3 py-1" color="primary" variant="flat">
						{balancesLoading ? "Loading..." : `${userBalance} ZAR`}
					</Chip>
				</div>

				{isTestnet && (
					<Alert
						color={"danger"}
						description={`Withdrawals and deposits are disabled on testnet.`}
						title={`Heads Up!`}
						variant="bordered"
					/>
				)}
			</CardHeader>
			<CardBody>
				<Tabs
					className="mb-4"
					color="secondary"
					selectedKey={tab}
					variant="solid"
					onSelectionChange={(key) => setTab(key as "withdraw" | "deposit")}>
					<Tab key="withdraw" title="Withdraw">
						<form className="flex flex-col gap-4" onSubmit={handleWithdraw}>
							<Input
								required
								endContent={
									<Tooltip content="Maximum: your available balance">
										<span className="text-xs text-default-400">
											Max: {userBalance} ZAR
										</span>
									</Tooltip>
								}
								label="Amount to Withdraw"
								min={1}
								startContent={<Banknote size={16} />}
								type="number"
								value={withdrawAmount}
								onChange={(e) => setWithdrawAmount(e.target.value)}
							/>
							<Input
								required
								description="Choose the bank account to withdraw from"
								disabled={bankLoading || !bankAccount}
								label="Select Bank Account"
								startContent={
									<Image
										alt={bankAccount?.bank || ""}
										height={32}
										src={
											BANKS.find(
												(b) =>
													b.name.toLowerCase() ===
													bankAccount?.bank.toLowerCase(),
											)?.icon || ""
										}
										width={32}
									/>
								}
								value={bankAccount?.bank}
							/>

							<Tooltip
								showArrow
								color="warning"
								content="Withdrawals are disabled on testnet"
								radius="sm">
								<Button
									className="w-full"
									color="primary"
									disabled={withdrawLoading || isTestnet}
									isLoading={withdrawLoading}
									radius="full"
									startContent={<BanknoteArrowDown size={16} />}
									type="submit">
									Withdraw
								</Button>
							</Tooltip>
							{withdrawSuccess && (
								<Chip
									className="w-full justify-center"
									color="success"
									variant="flat">
									{withdrawSuccess}
								</Chip>
							)}
							{withdrawError && (
								<Chip
									className="w-full justify-center"
									color="danger"
									variant="flat">
									{withdrawError}
								</Chip>
							)}
						</form>
					</Tab>
					<Tab key="deposit" title="Deposit">
						<form className="flex flex-col gap-4" onSubmit={handleDeposit}>
							<Input
								required
								label="Amount to Deposit"
								min={1}
								startContent={<Banknote size={16} />}
								type="number"
								value={depositAmount}
								onChange={(e) => setDepositAmount(e.target.value)}
							/>
							<Input
								required
								description="Choose the bank account to withdraw from"
								disabled={bankLoading || !bankAccount}
								label="Select Bank Account"
								startContent={
									<Image
										alt={bankAccount?.bank || ""}
										height={32}
										src={
											BANKS.find(
												(b) =>
													b.name.toLowerCase() ===
													bankAccount?.bank.toLowerCase(),
											)?.icon || ""
										}
										width={32}
									/>
								}
								value={bankAccount?.bank}
							/>
							<Tooltip
								showArrow
								color="warning"
								content="Deposits are disabled on testnet">
								<Button
									className="w-full"
									color="primary"
									disabled={depositLoading || isTestnet}
									isLoading={depositLoading}
									radius="full"
									startContent={<BanknoteArrowUp size={16} />}
									type="submit">
									Deposit
								</Button>
							</Tooltip>
							{depositSuccess && (
								<Chip
									className="w-full justify-center"
									color="success"
									variant="flat">
									{depositSuccess}
								</Chip>
							)}
							{depositError && (
								<Chip
									className="w-full justify-center"
									color="danger"
									variant="flat">
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
