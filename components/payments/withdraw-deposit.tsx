import { useEffect, useState } from "react";
import {
	Card,
	CardHeader,
	CardBody,
	Chip,
	Tabs,
	Tab,
	Tooltip,
	Alert,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Input,
	Divider,
} from "@heroui/react";
import {
	Banknote,
	BanknoteArrowUp,
	Wallet,
	BanknoteArrowDown,
	ShieldCheck,
	CreditCard,
	Loader2,
	Lock,
	ThumbsUp,
} from "lucide-react";
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
	const [showWithdrawModal, setShowWithdrawModal] = useState(false);
	const [showDepositModal, setShowDepositModal] = useState(false);
	const [verifying, setVerifying] = useState(false);
	const [verifyError, setVerifyError] = useState<string | null>(null);

	const [pendingWithdraw, setPendingWithdraw] = useState<string>("");
	const [pendingDeposit, setPendingDeposit] = useState<string>("");

	const isTestnet = true;

	useEffect(() => {
		if (!user) return;

		fetchBalances(user?.id || "");
		getBankAccount(user?.id || "");
	}, [fetchBalances, getBankAccount, user]);

	const handleWithdraw = async (e: React.FormEvent) => {
		e.preventDefault();
		setPendingWithdraw(withdrawAmount);
		setShowWithdrawModal(true);
	};

	const handleDeposit = async (e: React.FormEvent) => {
		e.preventDefault();
		setPendingDeposit(depositAmount);
		setShowDepositModal(true);
	};

	const simulateBankVerification = async () => {
		setVerifying(true);
		setVerifyError(null);
		return new Promise<boolean>((resolve) => {
			setTimeout(() => {
				// Simulate random success/failure
				const success = Math.random() > 0.15;
				setVerifying(false);
				if (!success) setVerifyError("Bank verification failed. Please try again.");
				resolve(success);
			}, 1500);
		});
	};

	const confirmWithdraw = async () => {
		const verified = await simulateBankVerification();
		if (verified) {
			await withdraw(pendingWithdraw);
			setShowWithdrawModal(false);
			setPendingWithdraw("");
		}
	};

	const confirmDeposit = async () => {
		const verified = await simulateBankVerification();
		if (verified) {
			await deposit(pendingDeposit);
			setShowDepositModal(false);
			setPendingDeposit("");
		}
	};

	const getBankIcon = () => {
		const bank = BANKS.find((b) => b.name.toLowerCase() === bankAccount?.bank?.toLowerCase());
		return bank?.icon || "";
	};

	const BankInfo = () => (
		<div className="flex items-center gap-3 mb-2">
			<Image
				src={getBankIcon()}
				alt={bankAccount?.bank || "Bank"}
				width={48}
				height={48}
				className="rounded-full border border-default-200 bg-white"
			/>
			<div>
				<div className="font-semibold text-base">{bankAccount?.bank}</div>
				<div className="text-xs text-default-500">
					Acc: {bankAccount?.accountNumber} <br />
					Holder: {bankAccount?.accountHolder}
				</div>
			</div>
		</div>
	);

	const SecureIllustration = () => (
		<div className="flex flex-col items-center gap-2 my-0">
			<ShieldCheck size={48} className="text-primary drop-shadow-lg" />
			<span className="text-sm text-default-500 font-medium">3D Secure Verification</span>
		</div>
	);

	const TrustIcons = () => (
		<div className="flex items-center gap-4 justify-center my-2">
			<ShieldCheck size={28} className="text-primary drop-shadow" />
			<Lock size={28} className="text-success drop-shadow" />
			<CreditCard size={32} className="text-default-400" />
			<ThumbsUp size={28} className="text-warning drop-shadow" />
		</div>
	);

	const TermsAndConditions = () => (
		<div className="bg-default-100 rounded-lg p-3 mt-0 text-xs text-default-500 border border-default-200">
			<strong>Terms & Conditions:</strong>
			<ul className="list-disc ml-4 mt-1">
				<li>All transactions are simulated for testnet purposes only.</li>
				<li>Your bank details are securely processed and never stored.</li>
				<li>
					Withdrawals and deposits are subject to verification and may be declined if
					details do not match.
				</li>
				<li>
					By confirming, you agree to our{" "}
					<a href="/terms" className="text-primary underline">
						platform terms
					</a>{" "}
					and privacy policy.
				</li>
			</ul>
		</div>
	);

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
						color={"warning"}
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
								content="Withdrawals are enabled for testnet with verification"
								radius="sm">
								<Button
									className="w-full"
									color="primary"
									disabled={withdrawLoading}
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
						<Modal
							isOpen={showWithdrawModal}
							onClose={() => setShowWithdrawModal(false)}>
							<ModalContent>
								{(onClose) => (
									<>
										<ModalHeader>
											<div className="flex items-center gap-2">
												<BanknoteArrowDown
													className="text-primary"
													size={24}
												/>
												<span className="font-bold text-lg">
													Withdraw - Bank Verification
												</span>
											</div>
										</ModalHeader>
										<ModalBody>
											<BankInfo />
											<Divider className="my-2" />
											<div className="flex items-center gap-2 mb-2">
												<span className="font-semibold text-default-600">
													Amount:
												</span>
												<Chip
													color="primary"
													variant="flat"
													className="font-mono text-lg">
													{pendingWithdraw} ZAR
												</Chip>
											</div>
											<SecureIllustration />
											<TrustIcons />
											<div className="flex flex-col items-center gap-2 mt-2">
												{verifying && (
													<div className="flex items-center gap-2">
														<Loader2
															size={20}
															className="animate-spin text-primary"
														/>
														<span className="text-default-500">
															Verifying bank details...
														</span>
													</div>
												)}
												{verifyError && (
													<Alert color="danger" variant="flat">
														{verifyError}
													</Alert>
												)}
											</div>
											<TermsAndConditions />
										</ModalBody>
										<ModalFooter>
											<Button
												color="primary"
												isLoading={verifying || withdrawLoading}
												disabled={verifying || withdrawLoading}
												onPress={confirmWithdraw}
												startContent={<ShieldCheck size={16} />}>
												Confirm Withdraw
											</Button>
											<Button
												color="secondary"
												variant="flat"
												onPress={onClose}
												disabled={verifying}>
												Cancel
											</Button>
										</ModalFooter>
									</>
								)}
							</ModalContent>
						</Modal>
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
								content="Deposits are enabled for testnet with verification">
								<Button
									className="w-full"
									color="primary"
									disabled={depositLoading}
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
						<Modal isOpen={showDepositModal} onClose={() => setShowDepositModal(false)}>
							<ModalContent>
								{(onClose) => (
									<>
										<ModalHeader>
											<div className="flex items-center gap-2">
												<BanknoteArrowUp
													className="text-primary"
													size={24}
												/>
												<span className="font-bold text-lg">
													Deposit - Bank Verification
												</span>
											</div>
										</ModalHeader>
										<ModalBody>
											<BankInfo />
											<Divider className="my-2" />
											<div className="flex items-center gap-2 mb-2">
												<span className="font-semibold text-default-600">
													Amount:
												</span>
												<Chip
													color="primary"
													variant="flat"
													className="font-mono text-lg">
													{pendingDeposit} ZAR
												</Chip>
											</div>
											<SecureIllustration />
											<TrustIcons />
											<div className="flex flex-col items-center gap-2 mt-2">
												{verifying && (
													<div className="flex items-center gap-2">
														<Loader2
															size={20}
															className="animate-spin text-primary"
														/>
														<span className="text-default-500">
															Verifying bank details...
														</span>
													</div>
												)}
												{verifyError && (
													<Alert color="danger" variant="flat">
														{verifyError}
													</Alert>
												)}
											</div>
											<TermsAndConditions />
										</ModalBody>
										<ModalFooter>
											<Button
												color="primary"
												isLoading={verifying || depositLoading}
												disabled={verifying || depositLoading}
												onPress={confirmDeposit}
												startContent={<ShieldCheck size={16} />}>
												Confirm Deposit
											</Button>
											<Button
												color="secondary"
												variant="flat"
												onPress={onClose}
												disabled={verifying}>
												Cancel
											</Button>
										</ModalFooter>
									</>
								)}
							</ModalContent>
						</Modal>
					</Tab>
				</Tabs>
			</CardBody>
		</Card>
	);
}
