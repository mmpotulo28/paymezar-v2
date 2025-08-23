import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Chip, Tabs, Tab, Tooltip, Alert } from "@heroui/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Banknote, BanknoteArrowUp, Wallet, BanknoteArrowDown } from "lucide-react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useAccount } from "@/context/AccountContext";
import { BANKS } from "@/lib/banks";

export function WithdrawDeposit() {
	const { user } = useUser();
	const {
		bankAccount,
		getBankAccount,
		bankLoading,
		bankError,
		balances,
		balancesLoading,
		fetchBalances,
		balancesError,

		// withdraw
		withdraw,
		withdrawError,
		withdrawMessage,
		withdrawLoading,

		// deposit
		deposit,
		depositError,
		depositMessage,
		depositLoading,
	} = useAccount();
	const [withdrawAmount, setWithdrawAmount] = useState<string>("");
	const [depositAmount, setDepositAmount] = useState<string>("");
	const isTestnet = true;

	useEffect(() => {
		if (!user) return;

		fetchBalances(user?.id || "");
		getBankAccount(user?.id || "");
	}, [fetchBalances, getBankAccount, user]);

	const handleWithdraw = async (e: React.FormEvent) => {
		e.preventDefault();
		await withdraw(withdrawAmount);
	};

	const handleDeposit = async (e: React.FormEvent) => {
		e.preventDefault();

		await deposit(depositAmount);
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
						{balancesLoading ? "Loading..." : `${balances[0]?.balance} ZAR`}
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

				{withdrawError && (
					<Alert
						color={"danger"}
						description={withdrawError}
						title={`Error!`}
						variant="bordered"
					/>
				)}

				{depositError && (
					<Alert
						color={"danger"}
						description={depositError}
						title={`Error!`}
						variant="bordered"
					/>
				)}

				{bankError && (
					<Alert
						color={"danger"}
						description={bankError}
						title={`Error!`}
						variant="bordered"
					/>
				)}

				{balancesError && (
					<Alert
						color={"danger"}
						description={balancesError}
						title={`Error!`}
						variant="bordered"
					/>
				)}
			</CardHeader>
			<CardBody>
				<Tabs className="mb-4" color="secondary" variant="solid">
					<Tab key="withdraw" title="Withdraw">
						<form className="flex flex-col gap-4" onSubmit={handleWithdraw}>
							<Input
								required
								endContent={
									<Tooltip content="Maximum: your available balance">
										<span className="text-xs text-default-400">
											Max: {balances[0]?.balance} ZAR
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
							{withdrawMessage && (
								<Chip
									className="w-full justify-center"
									color="success"
									variant="flat">
									{withdrawMessage}
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
							{depositMessage && (
								<Chip
									className="w-full justify-center"
									color="success"
									variant="flat">
									{depositMessage}
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
