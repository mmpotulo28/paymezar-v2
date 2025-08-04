import { useState } from "react";
import { Card, CardHeader, CardBody, Chip } from "@heroui/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useSession } from "@/context/SessionManager";
import { redeemLZAR } from "@/lib/helpers";

export function RedeemLZAR() {
	const { user } = useSession();
	const [amount, setAmount] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [txId, setTxId] = useState<string | null>(null);

	const handleRedeem = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(null);
		setTxId(null);

		if (!user?.id) {
			setError("User not found.");
			setLoading(false);
			return;
		}
		if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
			setError("Please enter a valid amount.");
			setLoading(false);
			return;
		}

		const result = await redeemLZAR({
			userId: user.id,
			amount: Number(amount),
		});

		console.log("Redeem result", result);

		if (!result.error && result.data?.transactionId) {
			setSuccess("LZAR redeemed successfully!");
			setTxId(result.data.transactionId);
			setAmount("");
		} else {
			setError(result.message || "Failed to redeem LZAR.");
		}
		setLoading(false);
	};

	return (
		<Card className="w-full max-w-2xl shadow-lg border border-default-200">
			<CardHeader className="text-lg font-semibold">Redeem Test ZAR Tokens</CardHeader>
			<CardBody>
				<form className="flex flex-col gap-4" onSubmit={handleRedeem}>
					<Input
						label="Amount to Redeem"
						type="number"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						min={1}
						required
					/>
					<Button
						color="primary"
						type="submit"
						isLoading={loading}
						disabled={loading}
						className="w-full"
						radius="full">
						Redeem LZAR
					</Button>
					{success && (
						<Chip color="success" variant="flat" className="w-full justify-center">
							{success} {txId && <span>Transaction ID: {txId}</span>}
						</Chip>
					)}
					{error && (
						<Chip color="danger" variant="flat" className="w-full justify-center">
							{error}
						</Chip>
					)}
				</form>
			</CardBody>
		</Card>
	);
}
