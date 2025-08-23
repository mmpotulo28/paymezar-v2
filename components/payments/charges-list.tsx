"use client";
import {
	Card,
	CardHeader,
	CardBody,
	Chip,
	Button,
	Spinner,
	Snippet,
	addToast,
} from "@heroui/react";
import { RefreshCcw } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useAccount } from "@/context/AccountContext";
import { iCharge } from "@/types";

export function ChargesList({ className = "" }: { className?: string }) {
	const {
		charges,
		chargesLoading,
		chargesError,
		completeCharge,
		completeChargeError,
		completeChargeLoading,
		completeChargeMessage,
		fetchCharges,
		activateSubscription,
	} = useAccount();
	const { user } = useUser();

	// Pay for a charge and activate subscription
	const handlePayCharge = async (charge: iCharge) => {
		if (!user) return;

		addToast({
			title: "Payment in progress...",
			description: `Your payment is being processed for charge ${charge.id}.`,
			variant: "flat",
			color: "secondary",
			shouldShowTimeoutProgress: true,
		});

		console.log("completing charge", charge.id);

		await completeCharge({
			chargeId: charge.id,
			userId: user?.id,
			afterComplete: () => {
				addToast({
					title: "Payment successful!",
					description: "Your payment has been processed successfully.",
					variant: "flat",
					color: "success",
				});

				activateSubscription({
					chargeId: charge.id,
					userId: user?.id,
				});
			},
		});
	};

	return (
		<Card className={`w-full max-w-2xl ${className}`}>
			<CardHeader className="flex items-center justify-between">
				<span className="text-xl font-bold">Your Charges</span>
				<Button
					color="primary"
					isLoading={chargesLoading}
					size="sm"
					startContent={<RefreshCcw size={16} />}
					variant="flat"
					onPress={() => fetchCharges(user?.id || "")}>
					Refresh
				</Button>
			</CardHeader>

			<CardBody>
				{chargesLoading && (
					<div className="text-default-400 text-center py-4">
						<Spinner label="Fetching charges..." size="sm" />
					</div>
				)}
				{!chargesLoading && charges.length === 0 && (
					<div className="text-default-400 text-center py-4">No charges found.</div>
				)}
				<div className="flex flex-col gap-3">
					{charges?.map((charge) => (
						<div
							key={charge.id}
							className="flex lg:items-center items-start gap-2 lg:flex-row flex-col justify-between p-3 rounded-lg border border-default-200 bg-default-50">
							<div className="flex flex-col gap-1">
								<span className="font-mono text-xs text-default-600">
									<Snippet hideSymbol size="sm" variant="flat">
										{charge.id}
									</Snippet>
								</span>
								<span className="text-xs text-default-500">
									{charge.note || "-"}
								</span>
							</div>
							<span className="font-mono text-sm font-bold">{charge.amount} ZAR</span>
							<span className="text-xs text-default-500">
								{charge.createdAt.split("T")[0]}
							</span>
							<Chip
								color={
									charge.status === "COMPLETE"
										? "success"
										: charge.status === "PENDING"
											? "warning"
											: "default"
								}
								variant="flat">
								{charge.status}
							</Chip>
							{/* Pay button for pending charges */}
							{charge.status === "PENDING" && (
								<Button
									color="success"
									size="sm"
									isLoading={completeChargeLoading}
									disabled={!!completeChargeLoading}
									onPress={() => handlePayCharge(charge)}
									variant="solid"
									className="rounded-full">
									Pay
								</Button>
							)}
						</div>
					))}
					{/* Show payment error/success */}
					{chargesError && (
						<Chip className="w-full justify-center mt-2" color="danger" variant="flat">
							{chargesError}
						</Chip>
					)}
					{completeChargeError && (
						<Chip className="w-full justify-center mt-2" color="danger" variant="flat">
							{completeChargeError}
						</Chip>
					)}
					{completeChargeMessage && (
						<Chip className="w-full justify-center mt-2" color="success" variant="flat">
							{completeChargeMessage}
						</Chip>
					)}
				</div>
			</CardBody>
		</Card>
	);
}
