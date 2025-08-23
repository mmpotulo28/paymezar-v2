"use client";
import { useEffect, useRef, useState } from "react";
import { Card, CardBody, CardHeader, CardFooter, addToast } from "@heroui/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { AlertCircleIcon, QrCode as QrCodeIcon } from "lucide-react";
import { useUser } from "@clerk/nextjs";

import QrCodeScanner from "@/components/qr-code-scanner";
import { useAccount } from "@/context/AccountContext";

export default function SendPayment() {
	const [recipient, setRecipient] = useState("");
	const [amount, setAmount] = useState("");
	const [note, setNote] = useState("");
	const [recipientInfo, setRecipientInfo] = useState<any>(null);
	const [scanModalOpen, setScanModalOpen] = useState(false);
	const { user } = useUser();
	const formRef = useRef<HTMLFormElement>(null);
	const [error, setError] = useState<string | null>(null);

	const { makeTransfer, transferMessage, transferError, transferLoading } = useAccount();

	useEffect(() => {
		if (transferMessage) {
			addToast({
				title: "Success",
				description: transferMessage,
				variant: "bordered",
				color: "success",
			});
		}
		if (transferError) {
			addToast({
				title: "Error",
				description: transferError,
				variant: "bordered",
				color: "danger",
			});
		}
	}, [transferMessage, transferError]);

	const handleTransfer = async () => {
		if (!recipient || !amount) return;
		if (!user?.id) return;

		const transferData = {
			userId: user?.id,
			transactionAmount: Number(amount),
			transactionRecipient: recipient,
			transactionNotes: note,
		};

		await makeTransfer(transferData);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		await handleTransfer();

		setRecipient("");
		setAmount("");
		setNote("");

		setTimeout(() => {
			setRecipientInfo(null);
		}, 3000);
	};

	const handleScan = (data: any) => {
		if (data) {
			try {
				const payload = JSON.parse(data);
				const isPayMezarRequest = payload.type === "paymezar-request";
				const hasRecipient = !!payload.recipient;
				const hasAmount = !!payload.amount;
				const hasNote = !!payload.note;

				const isValidPayMezarRequest = () =>
					isPayMezarRequest && hasRecipient && hasAmount && hasNote;

				if (isValidPayMezarRequest()) {
					setRecipient(payload.recipient);
					setAmount(String(payload.amount));
					setNote(payload.note);
					setScanModalOpen(false);

					// delay for 2 seconds the auto submit
					setTimeout(() => {
						formRef.current?.dispatchEvent(new Event("submit", { cancelable: true }));
					}, 2000);
				} else {
					setError("QR code does not contain a valid PayMe-Zar payment request.");
				}
			} catch (e) {
				setError("Scanned QR code is not valid JSON or not a PayMe-Zar QR.");
				console.error("QR Scan Error:", e);
			}
		}
	};

	return (
		<Card className="w-full max-w-2xl">
			<CardHeader className="text-xl font-bold flex items-center justify-between">
				<span>Send ZAR coin</span>
				<Button
					color="secondary"
					radius="full"
					startContent={<QrCodeIcon size={18} />}
					type="button"
					variant="flat"
					onPress={() => setScanModalOpen(true)}>
					Scan QR
				</Button>
			</CardHeader>
			<CardBody>
				<form ref={formRef} className="flex flex-col gap-4" onSubmit={handleSubmit}>
					<Input
						required
						label="Recipient Identifier"
						value={recipient}
						onChange={(e) => setRecipient(e.target.value)}
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
						required
						label="Amount (ZAR)"
						min={1}
						type="number"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
					/>
					<Input
						label="Note (optional)"
						value={note}
						onChange={(e) => setNote(e.target.value)}
					/>
					<Button
						className="max-w-3xs mx-0"
						color="primary"
						disabled={transferLoading}
						isLoading={transferLoading}
						radius="sm"
						type="submit">
						{transferLoading ? "Processing..." : "Send Payment"}
					</Button>
					{transferMessage && (
						<div className="text-green-600 text-center">{transferMessage}</div>
					)}
					{transferError && (
						<div className="text-red-600 text-center">{transferError}</div>
					)}
					{error && <div className="text-red-500 text-center">{error}</div>}
				</form>
			</CardBody>
			<CardFooter className="flex items-center justify-end">
				<span className="text-xs text-default-500 flex items-center gap-1">
					<AlertCircleIcon className="text-danger" size={16} /> Be cautious when sending
					payments. Always verify recipient details.
				</span>
			</CardFooter>
			{scanModalOpen && (
				<QrCodeScanner
					scanModalOpen={scanModalOpen}
					onClose={() => setScanModalOpen(false)}
					onScan={handleScan}
				/>
			)}
		</Card>
	);
}
