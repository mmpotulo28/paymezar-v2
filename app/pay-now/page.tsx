"use client";
import { useState, useEffect } from "react";
import axios from "axios";
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
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [responseMsg, setResponseMsg] = useState<string | null>(null);
	const [recipientInfo, setRecipientInfo] = useState<any>(null);

	const fetchRecipient = async (recipientId: string) => {
		try {
			const { data } = await axios.get(
				`https://seal-app-qp9cc.ondigitalocean.app/api/v1/recipient/${encodeURIComponent(recipientId)}`,
				{
					headers: {
						Authorization: "YOUR_SECRET_TOKEN", //TODO: Replace with real token in production
					},
				},
			);
			setRecipientInfo(data);
			return data;
		} catch (error: any) {
			setRecipientInfo(null);
			throw new Error(
				error?.response?.data?.message ||
					"Recipient not found or invalid recipient identifier.",
			);
		}
	};

	const handleTransfer = async () => {
		setLoading(true);
		setError(null);
		setResponseMsg(null);
		setRecipientInfo(null);
		try {
			// Fetch recipient info first
			await fetchRecipient(recipient);

			// Now send the transfer request (using axios)
			const res = await axios.post(
				"/api/transfer",
				{
					userId: dummyUser.id,
					transactionAmount: Number(amount),
					transactionRecipient: recipient,
					transactionNotes: note,
				},
				{
					headers: { "Content-Type": "application/json" },
				},
			);
			setResponseMsg(res.data.message || "Transfer executed successfully");
		} catch (err: any) {
			setError(err.message || "Transfer failed");
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await handleTransfer();
		setRecipient("");
		setAmount("");
		setNote("");
		setTimeout(() => {
			setResponseMsg(null);
			setError(null);
			setRecipientInfo(null);
		}, 3000);
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
				<Tab key="send" title="Send Payment" className="w-full flex flex-col items-center">
					<Card className="w-full max-w-2xl">
						<CardHeader className="text-xl font-bold">Send ZAR Stablecoin</CardHeader>
						<CardBody>
							<form onSubmit={handleSubmit} className="flex flex-col gap-4">
								<Input
									label="Recipient Identifier"
									value={recipient}
									onChange={(e) => setRecipient(e.target.value)}
									required
								/>
								{recipientInfo && (
									<div className="text-xs text-green-700 bg-green-50 rounded p-2">
										Recipient found:{" "}
										<span className="font-bold">
											{recipientInfo?.name || recipientInfo?.id}
										</span>
									</div>
								)}
								<Input
									label="Amount (ZAR)"
									type="number"
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									required
									min={1}
								/>
								<Input
									label="Note (optional)"
									value={note}
									onChange={(e) => setNote(e.target.value)}
								/>
								<Button
									color="primary"
									type="submit"
									radius="full"
									isLoading={loading}
									disabled={loading}>
									{loading ? "Processing..." : "Send Payment"}
								</Button>
								{responseMsg && (
									<div className="text-green-600 text-center">{responseMsg}</div>
								)}
								{error && <div className="text-red-600 text-center">{error}</div>}
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
				<Tab
					key="transactions"
					title="Recent Transactions"
					className="w-full flex align-center justify-center">
					<RecentTransactions transactions={dummyTransactions} />
				</Tab>
			</Tabs>
		</section>
	);
}
