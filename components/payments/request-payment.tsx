"use client";
import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { postApi } from "@/lib/helpers";
import { useSession } from "@/context/SessionManager";

// Dynamically import QRCodeCanvas for SSR safety
const QRCode = dynamic(() => import("qrcode.react").then((mod) => mod.QRCodeCanvas), {
	ssr: false,
});

export default function RequestPayment() {
	const [requestAmount, setRequestAmount] = useState("");
	const [qrVisible, setQrVisible] = useState(false);
	const [qrValue, setQrValue] = useState("");
	const { user } = useSession();
	const [requestLoading, setRequestLoading] = useState(false);

	const isInvalidRequestAmount = (amount: string) => {
		return !amount || isNaN(Number(amount)) || Number(amount) <= 0;
	};

	const handleRequestPayment = (e: React.FormEvent) => {
		e.preventDefault();
		if (isInvalidRequestAmount(requestAmount)) return;
		const payload = JSON.stringify({
			type: "paymezar-request",
			recipient: user?.paymentIdentifier,
			amount: Number(requestAmount),
			timestamp: Date.now(),
		});
		setQrValue(payload);
		setQrVisible(true);
		setRequestLoading(true);
		setTimeout(() => setRequestLoading(false), 5000);
	};

	return (
		<Card className="w-full max-w-2xl">
			<CardHeader className="text-xl font-bold">Request ZAR Stablecoin</CardHeader>
			<CardBody>
				{!qrVisible && (
					<form onSubmit={handleRequestPayment} className="flex flex-col gap-4">
						<Input
							label="Amount (ZAR)"
							type="number"
							value={requestAmount}
							onChange={(e) => setRequestAmount(e.target.value)}
							required
							min={1}
						/>
						<Button
							color="primary"
							type="submit"
							radius="sm"
							className="max-w-3xs mx-0">
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
							{requestLoading && <Loader2 className="animate-spin" size={18} />}
							<span>waiting for payment...</span>
						</div>
						<Button
							variant="flat"
							color="secondary"
							className="max-w-3xs mx-0"
							onPress={() => {
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
	);
}
