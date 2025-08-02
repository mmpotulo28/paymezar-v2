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
import { Loader2 } from "lucide-react";
import { QrCode as QrCodeIcon } from "lucide-react";
import { Modal, ModalBody, ModalContent, ModalHeader, ModalFooter } from "@heroui/react";
import { useDisclosure } from "@heroui/modal";
import dynamic from "next/dynamic";
import type { FC } from "react";

// Fix: import named export QRCode instead of default
const QRCode = dynamic(
	() => import("qrcode.react").then((mod) => mod.QRCodeCanvas as unknown as FC<any>),
	{ ssr: false },
);

import { UserProfileCard } from "@/components/user-profile-card";
import { RecentTransactions } from "@/components/recent-transactions";
import { dummyTransactions } from "@/lib/dummy-transactions";
import { dummyUser } from "@/lib/dummy-user";
import QrCodeScanner from "@/components/qr-code-scanner";

// Dynamically import QRCode to avoid SSR issues
// const QRCode = dynamic(() => import("qrcode.react"), { ssr: false });

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
	const [requestAmount, setRequestAmount] = useState("");
	const [qrVisible, setQrVisible] = useState(false);
	const [qrValue, setQrValue] = useState("");
	const [requestLoading, setRequestLoading] = useState(false);
	const [scanModalOpen, setScanModalOpen] = useState(false);
	const [scanError, setScanError] = useState<string | null>(null);
	const [qrReaderKey, setQrReaderKey] = useState(0); // Add a key to force remount

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

	const isInvalidRequestAmount = (amount: string) => {
		return !amount || isNaN(Number(amount)) || Number(amount) <= 0;
	};

	const handleRequestPayment = (e: React.FormEvent) => {
		e.preventDefault();
		if (isInvalidRequestAmount(requestAmount)) return;
		const payload = JSON.stringify({
			type: "paymezar-request",
			recipient: dummyUser.paymentIdentifier,
			amount: Number(requestAmount),
			timestamp: Date.now(),
		});
		setQrValue(payload);
		setQrVisible(true);
		setRequestLoading(true);
		// Simulate waiting for payment (demo)
		setTimeout(() => setRequestLoading(false), 5000);
	};

	const handleScan = (data: any) => {
		if (data) {
			try {
				const payload = JSON.parse(data);
				if (payload.type === "paymezar-request" && payload.recipient && payload.amount) {
					setRecipient(payload.recipient);
					setAmount(String(payload.amount));
					setScanModalOpen(false);
					setScanError(null);
				} else {
					setScanError("QR code does not contain a valid PayMe-Zar payment request.");
				}
			} catch (e) {
				setScanError("Scanned QR code is not valid JSON or not a PayMe-Zar QR.");
			}
		}
	};

	const handleScanError = (err: any) => {
		console.log(err);
		if (!err) return;
		if (typeof err === "string") {
			setScanError(err);
		} else if (err?.name === "NotAllowedError") {
			setScanError(
				"Camera access was denied. Please allow camera permissions in your browser settings.",
			);
		} else if (err?.name === "NotFoundError") {
			setScanError(
				"No camera device found. Please connect a camera or use a device with a camera.",
			);
		} else if (err?.name === "NotReadableError") {
			setScanError(
				"Camera is already in use by another application. Please close other apps using the camera.",
			);
		} else if (err?.name === "OverconstrainedError") {
			setScanError(
				"No camera matches the required constraints. Try switching cameras or check your device settings.",
			);
		} else if (err?.message) {
			setScanError(`Camera error: ${err.message}`);
		} else {
			setScanError(
				"An unknown error occurred while scanning. Please ensure your device has a working camera and try again.",
			);
		}
	};

	// Reset scan error and force QRReader unmount/remount when modal is closed/opened
	useEffect(() => {
		if (!scanModalOpen) {
			setScanError(null);
			// Force QRReader to unmount and release camera
			setQrReaderKey((k) => k + 1);
		}
	}, [scanModalOpen]);

	return (
		<section className="flex flex-col items-center justify-center min-h-[70vh] py-8 gap-8 w-full">
			{/* User summary card */}
			<UserProfileCard user={dummyUser} className="max-w-2xl" />

			{/* Tabs for Send/Request/Transactions */}
			<Tabs
				selectedKey={tab}
				onSelectionChange={(key) => setTab(String(key))}
				className="w-full max-w-2xl">
				<Tab key="send" title="Send Payment" className="w-full flex flex-col items-center">
					<Card className="w-full max-w-2xl">
						<CardHeader className="text-xl font-bold flex items-center justify-between">
							<span>Send ZAR Stablecoin</span>
							<Button
								variant="flat"
								color="secondary"
								radius="full"
								startContent={<QrCodeIcon size={18} />}
								onClick={() => setScanModalOpen(true)}
								type="button">
								Scan QR
							</Button>
						</CardHeader>
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
					{/* QR Scan Modal */}
					{scanModalOpen && (
						<QrCodeScanner
							scanModalOpen={scanModalOpen}
							onClose={() => setScanModalOpen(false)}
							onScan={(data) => {
								setScanModalOpen(false);
								handleScan(data);
							}}
						/>
					)}
				</Tab>
				<Tab
					key="request"
					title="Request Payment"
					className="w-full flex flex-col items-center">
					<Card className="w-full max-w-2xl">
						<CardHeader className="text-xl font-bold">
							Request ZAR Stablecoin
						</CardHeader>
						<CardBody>
							{!qrVisible && (
								<form
									onSubmit={handleRequestPayment}
									className="flex flex-col gap-4">
									<Input
										label="Amount (ZAR)"
										type="number"
										value={requestAmount}
										onChange={(e) => setRequestAmount(e.target.value)}
										required
										min={1}
									/>
									<Button color="primary" type="submit" radius="full">
										Generate QR Code
									</Button>
								</form>
							)}
							{qrVisible && (
								<div className="flex flex-col items-center gap-4 py-4">
									<span className="font-semibold text-default-700">
										Scan to pay{" "}
										{Number(requestAmount).toLocaleString("en-ZA", {
											style: "currency",
											currency: "ZAR",
										})}
									</span>
									<div className="bg-white p-4 rounded-lg border">
										<QRCode value={qrValue} size={180} />
									</div>
									<div className="flex items-center gap-2 text-primary">
										{requestLoading && (
											<Loader2 className="animate-spin" size={18} />
										)}
										<span>waiting for payment...</span>
									</div>
									<Button
										variant="flat"
										color="secondary"
										onClick={() => {
											setQrVisible(false);
											setRequestAmount("");
											setRequestLoading(false);
										}}>
										New Request
									</Button>
								</div>
							)}
						</CardBody>
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
