"use client";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Tabs, Tab } from "@heroui/tabs";
import { UserProfileCard } from "@/components/user-profile-card";
import { RecentTransactions } from "@/components/recent-transactions";
import { dummyTransactions as transactions } from "@/lib/dummy-transactions";
import { dummyUser } from "@/lib/dummy-user";

// const user = {
// 	name: "Jane Doe",
// 	email: "jane.doe@email.com",
// 	address: "0x1234...abcd",
// 	balance: 12500.75,
// 	avatar: "https://i.pravatar.cc/150?img=5",
// };

export default function AccountPage() {
	return (
		<section className="flex flex-col items-center min-h-[70vh] py-8 gap-8 w-full">
			{/* User Profile */}
			<UserProfileCard user={dummyUser} className="max-w-2xl" />

			{/* Account Management Tabs */}
			<Tabs className=" max-w-2xl w-full" variant="underlined">
				<Tab key="overview" className="w-full" title="Overview">
					<Card className="min-w-full">
						<CardHeader className="text-lg font-semibold">Account Overview</CardHeader>
						<CardBody className="flex flex-col gap-4">
							<div className="flex flex-col sm:flex-row gap-4">
								<div className="flex-1">
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
								<div className="flex-1">
									<div className="text-xs text-default-500 font-medium mb-1">
										Balance
									</div>
									<div className="text-2xl font-mono text-primary font-bold">
										{/* Balance not in dummyUser, add if needed */}
										N/A
									</div>
								</div>
							</div>
							<div className="flex flex-col sm:flex-row gap-4">
								<div className="flex-1">
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
								<div className="flex-1 flex items-end">
									<Button color="primary" className="w-full" radius="full">
										Manage Profile
									</Button>
								</div>
							</div>
						</CardBody>
					</Card>
				</Tab>
				<Tab key="transactions" title="Transactions">
					<RecentTransactions transactions={transactions} />
				</Tab>
				<Tab key="settings" className="w-full" title="Settings">
					<Card className="w-full">
						<CardHeader className="text-lg font-semibold">Account Settings</CardHeader>
						<CardBody className="flex flex-col gap-4">
							<div className="flex flex-col gap-3">
								<div className="text-xs text-default-500 font-medium">
									Change Email
								</div>
								<Input placeholder="Enter new email" size="sm" className="w-full" />
								<Button color="default" radius="md" className="w-full">
									Update Email
								</Button>
							</div>
							<div className="flex flex-col gap-3 mt-4">
								<div className="text-xs text-default-500 font-medium">
									Change Password
								</div>
								<Input
									placeholder="Current password"
									type="password"
									size="sm"
									className="w-full"
								/>
								<Input
									placeholder="New password"
									type="password"
									size="sm"
									className="w-full"
								/>
								<Button color="default" radius="md" className="w-full">
									Update Password
								</Button>
							</div>
							<div className="flex flex-col gap-2 mt-4">
								<div className="text-xs text-default-500 font-medium">
									Danger Zone
								</div>
								<Button color="danger" radius="md" className="w-full">
									Delete Account
								</Button>
							</div>
						</CardBody>
					</Card>
				</Tab>
			</Tabs>
		</section>
	);
}
