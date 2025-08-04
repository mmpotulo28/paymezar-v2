"use client";
import { Button } from "@heroui/button";
import { Tabs, Tab } from "@heroui/tabs";
import { UserProfileCard } from "@/components/user-profile-card";
import { RecentTransactions } from "@/components/recent-transactions";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Download, FileText } from "lucide-react";

import { useSession } from "@/context/SessionManager";
import { AccountOverview } from "@/components/account/AccountOverview";
import { AccountSettings } from "@/components/account/AccountSettings";
import { BalanceHistory } from "@/components/account/BalanceHistory";
import { BankAccounts } from "@/components/account/BankAccounts";
import { WithdrawDeposit } from "@/components/account/WithdrawDeposit";

export default function AccountPage() {
	const { theme, setTheme } = useTheme();
	const [cacheCleared, setCacheCleared] = useState(false);
	const [socialConnected, setSocialConnected] = useState(false);
	const [gasEnabled, setGasEnabled] = useState(false);
	const [twoFAEnabled, setTwoFAEnabled] = useState(false);
	const { user } = useSession();

	const handleClearCache = () => {
		// Simulate cache clearing
		setCacheCleared(true);
		setTimeout(() => setCacheCleared(false), 1500);
	};

	const handleConnectSocial = () => {
		// Simulate social account connection
		setSocialConnected(true);
		setTimeout(() => setSocialConnected(false), 1500);
	};

	const handleEnableGas = () => {
		// Simulate gas allocation
		setGasEnabled(true);
		setTimeout(() => setGasEnabled(false), 1500);
	};

	const handleExportTransactions = () => {
		// Simulate export
		alert("Transactions exported!");
	};

	const handleDownloadStatement = () => {
		// Simulate download
		alert("Statement downloaded!");
	};

	const handleResetPassword = () => {
		alert("Password reset link sent to your email.");
	};

	const handleToggle2FA = () => {
		setTwoFAEnabled((v) => !v);
	};

	return (
		<section className="flex flex-col items-center min-h-[70vh] py-8 gap-8 w-full">
			{/* User Profile */}
			{user && <UserProfileCard user={user} className="max-w-2xl w-full" />}

			{/* Account Management Tabs */}
			<Tabs className="max-w-2xl w-full" variant="underlined">
				<Tab
					key="overview"
					className="w-full flex align-center justify-center max-w-2xl"
					title="Overview">
					<AccountOverview />
				</Tab>
				<Tab
					key="analytics"
					className="w-full flex align-center justify-center max-w-2xl"
					title="Analytics">
					<BalanceHistory />
				</Tab>
				<Tab
					key="withdraw-deposit"
					className="w-full flex align-center justify-center max-w-2xl"
					title="Withdraw / Deposit">
					<WithdrawDeposit />
				</Tab>
				<Tab
					key="bank"
					className="w-full flex align-center justify-center max-w-2xl"
					title="Bank Accounts">
					<BankAccounts />
				</Tab>
				<Tab
					key="transactions"
					title="Transactions"
					className="w-full flex align-center justify-center max-w-2xl">
					<div className="flex flex-col gap-4 w-full">
						<div className="flex gap-2 justify-end">
							<Button
								size="sm"
								variant="flat"
								color="primary"
								startContent={<FileText size={16} />}
								onClick={handleExportTransactions}>
								Export Transactions
							</Button>
							<Button
								size="sm"
								variant="flat"
								color="secondary"
								startContent={<Download size={16} />}
								onClick={handleDownloadStatement}>
								Download Statement
							</Button>
						</div>
						<RecentTransactions className="max-w-2xl w-full" />
					</div>
				</Tab>
				<Tab
					key="settings"
					className="w-full flex align-center justify-center max-w-2xl"
					title="Settings">
					<AccountSettings />
				</Tab>
			</Tabs>
		</section>
	);
}
