"use client";
import { useState } from "react";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { AlertCircleIcon, QrCode as QrCodeIcon } from "lucide-react";
import QrCodeScanner from "@/components/qr-code-scanner";
import { useSession } from "@/context/SessionManager";
import { postApi } from "@/lib/helpers";

export default function SendPayment() {
	const [recipient, setRecipient] = useState("");
	const [amount, setAmount] = useState("");
	const [note, setNote] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [responseMsg, setResponseMsg] = useState<string | null>(null);
	const [recipientInfo, setRecipientInfo] = useState<any>(null);
	const [scanModalOpen, setScanModalOpen] = useState(false);

	const { user, accessToken } = useSession();

	const fetchRecipient = async (recipientId: string) => {
		try {
			const result = await postApi(
				`https://seal-app-qp9cc.ondigitalocean.app/api/v1/recipient/${encodeURIComponent(recipientId)}`,
				{},
				{
					Authorization: process.env.NEXT_PUBLIC_LISK_API_KEY || "",
				},
				"GET",
			);
			if (!result.error) {
				setRecipientInfo(result.data);
				return result.data;
			} else {
				setRecipientInfo(null);
				throw new Error(
					result.message || "Recipient not found or invalid recipient identifier.",
				);
			}
		} catch (error: any) {
			setRecipientInfo(null);
			throw new Error(
				error.message || "Recipient not found or invalid recipient identifier.",
			);
		}
	};

	const handleTransfer = async () => {
		setLoading(true);
		setError(null);
		setResponseMsg(null);
		setRecipientInfo(null);
		try {
			await fetchRecipient(recipient);

			if (!user?.id) throw new Error("You must be logged in to send payments.");

			const res = await postApi(
				`https://seal-app-qp9cc.ondigitalocean.app/api/v1/transfer/${encodeURIComponent(user.id)}`,
				{
					transactionAmount: Number(amount),
					transactionRecipient: recipient,
					transactionNotes: note,
				},
				{
					"Content-Type": "application/json",
					Authorization: process.env.NEXT_PUBLIC_LISK_API_KEY || "",
				},
				"POST",
			);

			if (!res.error) {
				setResponseMsg(res.message || "Transfer executed successfully");
			} else {
				throw new Error(res.message || "Transfer failed");
			}
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

	const handleScan = (data: any) => {
		if (data) {
			try {
				const payload = JSON.parse(data);
				const isPayMezarRequest = payload.type === "paymezar-request";
				const hasRecipient = !!payload.recipient;
				const hasAmount = !!payload.amount;
				const isValidPayMezarRequest = () => isPayMezarRequest && hasRecipient && hasAmount;
				if (isValidPayMezarRequest()) {
					setRecipient(payload.recipient);
					setAmount(String(payload.amount));
					setScanModalOpen(false);
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
						radius="sm"
						isLoading={loading}
						disabled={loading}
						className="max-w-3xs mx-0">
						{loading ? "Processing..." : "Send Payment"}
					</Button>
					{responseMsg && <div className="text-green-600 text-center">{responseMsg}</div>}
					{error && <div className="text-red-600 text-center">{error}</div>}
				</form>
			</CardBody>
			<CardFooter className="flex items-center justify-end">
				<span className="text-xs text-default-500 flex items-center gap-1">
					<AlertCircleIcon size={16} className="text-danger" /> Be cautious when sending
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
