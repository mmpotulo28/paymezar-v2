"use client";
import { Card, CardBody, CardFooter, CardHeader, Chip } from "@heroui/react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Tabs, Tab } from "@heroui/tabs";
import { UserProfileCard } from "@/components/user-profile-card";
import { RecentTransactions } from "@/components/recent-transactions";
import { dummyTransactions as transactions } from "@/lib/dummy-transactions";
import { dummyUser } from "@/lib/dummy-user";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Sun, Moon, RefreshCcw, Link2, Download, FileText, Lock, Shield } from "lucide-react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip as RechartsTooltip,
	ResponsiveContainer,
	CartesianGrid,
	BarChart,
	Bar,
	Legend,
} from "recharts";

export default function AccountPage() {
	const { theme, setTheme } = useTheme();
	const [cacheCleared, setCacheCleared] = useState(false);
	const [socialConnected, setSocialConnected] = useState(false);
	const [gasEnabled, setGasEnabled] = useState(false);
	const [twoFAEnabled, setTwoFAEnabled] = useState(false);

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

	// Dummy data for charts
	const balanceHistory = [
		{ date: "2025-07-24", balance: 1000 },
		{ date: "2025-07-25", balance: 1800 },
		{ date: "2025-07-26", balance: 1500 },
		{ date: "2025-07-27", balance: 2000 },
		{ date: "2025-07-28", balance: 4000 },
		{ date: "2025-07-29", balance: 2800 },
		{ date: "2025-07-30", balance: 3500 },
	];
	const activityHistory = [
		{ date: "2025-07-24", count: 1 },
		{ date: "2025-07-25", count: 2 },
		{ date: "2025-07-26", count: 1 },
		{ date: "2025-07-27", count: 3 },
		{ date: "2025-07-28", count: 2 },
		{ date: "2025-07-29", count: 1 },
		{ date: "2025-07-30", count: 2 },
	];

	return (
		<section className="flex flex-col items-center min-h-[70vh] py-8 gap-8 w-full">
			{/* User Profile */}
			<UserProfileCard user={dummyUser} className="max-w-2xl w-full" />

			{/* Account Management Tabs */}
			<Tabs className="max-w-2xl w-full" variant="underlined">
				<Tab
					key="overview"
					className="w-full flex align-center justify-center max-w-2xl"
					title="Overview">
					<Card className="w-full max-w-2xl shadow-lg border border-default-200">
						<CardHeader className="text-lg font-semibold">Account Overview</CardHeader>
						<CardBody className="flex flex-col gap-6">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
								<div>
									<div className="text-xs text-default-500 font-medium mb-1">
										Wallet Address
									</div>
									<Input
										value={dummyUser.publicKey || "-"}
										readOnly
										size="sm"
										className="w-full"
									/>
								</div>
								<div>
									<div className="text-xs text-default-500 font-medium mb-1">
										Balance
									</div>
									<div className="text-2xl font-mono text-primary font-bold">
										N/A
									</div>
								</div>
								<div>
									<div className="text-xs text-default-500 font-medium mb-1">
										Email
									</div>
									<Input
										value={dummyUser.email}
										readOnly
										size="sm"
										className="w-full"
									/>
								</div>
								<div className="flex items-end">
									<Button
										color="primary"
										className="w-full"
										radius="full"
										href="/profile"
										as="a">
										Manage Profile
									</Button>
								</div>
							</div>
						</CardBody>
					</Card>
				</Tab>
				<Tab
					key="analytics"
					className="w-full flex align-center justify-center max-w-2xl"
					title="Analytics">
					<Card className="w-full max-w-2xl shadow-lg border border-default-200">
						<CardHeader className="text-lg font-semibold flex flex-col gap-2">
							<span>Balance History</span>
							<span className="text-xs text-default-500 font-normal">
								View your ZAR balance over time
							</span>
						</CardHeader>
						<CardBody>
							<div className="w-full h-64">
								<ResponsiveContainer width="100%" height="100%">
									<LineChart data={balanceHistory}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="date" />
										<YAxis />
										<RechartsTooltip />
										<Legend />
										<Line
											type="monotone"
											dataKey="balance"
											stroke="#6366f1"
											strokeWidth={2}
											dot={{ r: 4 }}
											name="Balance (ZAR)"
										/>
									</LineChart>
								</ResponsiveContainer>
							</div>
							<div className="mt-8">
								<div className="text-lg font-semibold mb-2">Activity History</div>
								<div className="w-full h-64">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart data={activityHistory}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="date" />
											<YAxis />
											<RechartsTooltip />
											<Legend />
											<Bar
												dataKey="count"
												fill="#10b981"
												name="Transactions"
												barSize={32}
											/>
										</BarChart>
									</ResponsiveContainer>
								</div>
							</div>
						</CardBody>
					</Card>
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
						<RecentTransactions
							transactions={transactions}
							className="max-w-2xl w-full"
						/>
					</div>
				</Tab>
				<Tab
					key="settings"
					className="w-full flex align-center justify-center max-w-2xl"
					title="Settings">
					<Card className="w-full max-w-2xl shadow-lg border border-default-200">
						<CardHeader className="text-lg font-semibold">Account Settings</CardHeader>
						<CardBody className="flex flex-col gap-6">
							{/* Theme Toggle */}
							<div className="flex items-center justify-between gap-4">
								<div>
									<div className="text-xs text-default-500 font-medium mb-1">
										Theme
									</div>
									<div className="text-sm text-default-700">
										Switch between light and dark mode.
									</div>
								</div>
								<Button
									variant="flat"
									radius="full"
									color="secondary"
									onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
									startContent={
										theme === "dark" ? <Sun size={18} /> : <Moon size={18} />
									}>
									{theme === "dark" ? "Light Mode" : "Dark Mode"}
								</Button>
							</div>
							{/* Cache Clearing */}
							<div className="flex items-center justify-between gap-4">
								<div>
									<div className="text-xs text-default-500 font-medium mb-1">
										Clear Cache
									</div>
									<div className="text-sm text-default-700">
										Remove local cache and refresh your session.
									</div>
								</div>
								<Button
									variant="flat"
									radius="full"
									color="warning"
									onClick={handleClearCache}
									startContent={<RefreshCcw size={18} />}>
									Clear Cache
								</Button>
								{cacheCleared && (
									<Chip color="success" size="sm" className="ml-2">
										Cleared!
									</Chip>
								)}
							</div>
							{/* Social Account Connection */}
							<div className="flex items-center justify-between gap-4">
								<div>
									<div className="text-xs text-default-500 font-medium mb-1">
										Connect Social Account
									</div>
									<div className="text-sm text-default-700">
										Link your Google or Twitter account for easier login.
									</div>
								</div>
								<Button
									variant="flat"
									radius="full"
									color="primary"
									onClick={handleConnectSocial}
									startContent={<Link2 size={18} />}>
									Connect
								</Button>
								{socialConnected && (
									<Chip color="success" size="sm" className="ml-2">
										Connected!
									</Chip>
								)}
							</div>
							{/* Enable Gas */}
							<div className="flex items-center justify-between gap-4">
								<div>
									<div className="text-xs text-default-500 font-medium mb-1">
										Enable gas
									</div>
									<div className="text-sm text-default-700">
										Allocates a predefined amount of gas to the user linked with
										your account.
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Button
										variant="flat"
										radius="full"
										color="success"
										onClick={handleEnableGas}>
										Enable gas
									</Button>
									{gasEnabled && (
										<Chip color="success" size="sm" className="ml-2">
											Gas allocated!
										</Chip>
									)}
								</div>
							</div>
						</CardBody>

						<CardFooter className="flex flex-col gap-4">
							<div className="flex items-center justify-between gap-4 border-t pt-4">
								<div>
									<div className="text-xs text-default-500 font-medium mb-1 flex items-center gap-1">
										<Lock size={14} /> Security
									</div>
									<div className="text-sm text-default-700">
										Manage your password and two-factor authentication.
									</div>
								</div>
								<div className="flex gap-2">
									<Button
										size="sm"
										variant="flat"
										color="primary"
										startContent={<Shield size={16} />}
										onPress={handleToggle2FA}>
										{twoFAEnabled ? "Disable 2FA" : "Enable 2FA"}
									</Button>
									<Button
										size="sm"
										variant="flat"
										color="secondary"
										onPress={handleResetPassword}>
										Reset Password
									</Button>
								</div>
							</div>
							{twoFAEnabled && (
								<div className="text-xs text-success-700 mt-2">
									Two-factor authentication is enabled for your account.
								</div>
							)}
						</CardFooter>
					</Card>
				</Tab>
			</Tabs>
		</section>
	);
}
