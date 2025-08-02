"use client";
import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Tabs, Tab } from "@heroui/tabs";
import { UserProfileCard } from "@/components/user-profile-card";
import { RecentTransactions } from "@/components/recent-transactions";
import { dummyTransactions as transactions } from "@/lib/dummy-transactions";
import { dummyUser } from "@/lib/dummy-user";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Sun, Moon, RefreshCcw, Link2 } from "lucide-react";

export default function AccountPage() {
	const { theme, setTheme } = useTheme();
	const [cacheCleared, setCacheCleared] = useState(false);
	const [socialConnected, setSocialConnected] = useState(false);
	const [gasEnabled, setGasEnabled] = useState(false);

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

	return (
		<section className="flex flex-col items-center min-h-[70vh] py-8 gap-8 w-full">
			{/* User Profile */}
			<UserProfileCard user={dummyUser} className="max-w-2xl w-full" />

			{/* Account Management Tabs */}
			<Tabs className="max-w-2xl w-full" variant="underlined">
				<Tab
					key="overview"
					className="w-full flex align-center justify-center"
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
					key="transactions"
					title="Transactions"
					className="w-full flex align-center justify-center">
					<RecentTransactions transactions={transactions} className="max-w-2xl w-full" />
				</Tab>
				<Tab
					key="settings"
					className="w-full flex align-center justify-center"
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
					</Card>
				</Tab>
			</Tabs>
		</section>
	);
}
