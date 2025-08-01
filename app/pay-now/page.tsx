"use client";
import { useState } from "react";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Badge } from "@heroui/badge";
import { Tabs, Tab } from "@heroui/tabs";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { HeartFilledIcon } from "@/components/icons";

import { UserProfileCard } from "@/components/user-profile-card";
import { RecentTransactions } from "@/components/recent-transactions";
import { dummyTransactions } from "@/lib/dummy-transactions";
import { dummyUser } from "@/lib/dummy-user";

export default function PayNowPage() {
	// Use dummyUser from lib
	const [recipient, setRecipient] = useState("");
	const [amount, setAmount] = useState("");
	const [note, setNote] = useState("");
	const [success, setSuccess] = useState(false);
	const [tab, setTab] = useState("send");
	// Use dummyTransactions from lib

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setSuccess(true);
		setRecipient("");
		setAmount("");
		setNote("");
		setTimeout(() => setSuccess(false), 2000);
	};

	return (
		<section className="flex flex-col items-center justify-center min-h-[70vh] py-8 gap-8 w-full">
			{/* User summary card */}
			<UserProfileCard user={dummyUser} className="max-w-2xl" />

			{/* Tabs for Send/Transactions */}
			<Tabs
				selectedKey={tab}
				onSelectionChange={(key) => setTab(String(key))}
				className="w-full max-w-2xl">
				<Tab key="send" title="Send Payment" className="w-full">
					<Card className="w-full">
						<CardHeader className="text-xl font-bold">Send ZAR Stablecoin</CardHeader>
						<CardBody>
							<form onSubmit={handleSubmit} className="flex flex-col gap-4">
								<Input
									label="Recipient Address"
									value={recipient}
									onChange={(e) => setRecipient(e.target.value)}
									required
								/>
								<Input
									label="Amount (ZAR)"
									type="number"
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									required
								/>
								<Input
									label="Note (optional)"
									value={note}
									onChange={(e) => setNote(e.target.value)}
								/>
								<Button color="primary" type="submit" radius="full">
									Send Payment
								</Button>
								{success && (
									<div className="text-green-600 text-center">
										Payment sent! (dummy)
									</div>
								)}
							</form>
						</CardBody>
						<CardFooter className="flex items-center justify-end">
							<span className="text-xs text-default-500 flex items-center gap-1">
								<HeartFilledIcon size={16} className="text-danger" /> Powered by
								Lisk & HeroUI
							</span>
						</CardFooter>
					</Card>
				</Tab>
				<Tab key="transactions" title="Recent Transactions" className="w-full">
					<RecentTransactions transactions={dummyTransactions} />
				</Tab>
			</Tabs>
		</section>
	);
}
