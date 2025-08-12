"use client";
import { Card, CardHeader, CardBody, Chip, Button, Spinner, Snippet } from "@heroui/react";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

import { postApi } from "@/lib/helpers";
import { useAccount } from "@/context/AccountContext";
import { iCharge } from "@/types";

export function ChargesList({ className = "" }: { className?: string }) {
	const { charges, loadingCharges, refreshCharges, subscriptions, refreshSubscriptions } =
		useAccount();
	const { user } = useUser();
	const [payLoading, setPayLoading] = useState<string | null>(null);
	const [payError, setPayError] = useState<string | null>(null);
	const [paySuccess, setPaySuccess] = useState<string | null>(null);

	// Pay for a charge and activate subscription
	const handlePayCharge = async (charge: iCharge) => {
		setPayLoading(charge.id);
		setPayError(null);
		setPaySuccess(null);

		try {
			// 1. Do the transfer using the correct endpoint
			const transferRes = await axios.request({
				method: "POST",
				url: `https://seal-app-qp9cc.ondigitalocean.app/api/v1/transfer/${encodeURIComponent(user?.id || "")}`,
				headers: {
					"Content-Type": "application/json",
					Authorization: process.env.NEXT_PUBLIC_LISK_API_KEY || "",
				},
				data: {
					transactionAmount: charge.amount,
					transactionRecipient: "Z9P0szKGhYC3vHM3AdeL",
					transactionNotes: charge.note || "",
				},
			});

			if (!transferRes.data || transferRes.status !== 200) {
				throw new Error(transferRes.data?.message || "Transfer failed");
			}

			// 2. Update charge status to COMPLETE after payment
			await axios.request({
				method: "PUT",
				url: `https://seal-app-qp9cc.ondigitalocean.app/api/v1/charge/${encodeURIComponent(user?.id || "")}/${encodeURIComponent(charge.id)}/update`,
				headers: {
					"Content-Type": "application/json",
					Authorization: process.env.NEXT_PUBLIC_LISK_API_KEY || "",
				},
				data: { status: "COMPLETE" },
			});

			setPaySuccess("Payment successful!");

			// 3. Find related subscription and update status to active
			const relatedSub = subscriptions.find(
				(sub) => sub.charge_id === charge.id && sub.status === "pending",
			);
			if (relatedSub) {
				await postApi(
					`/api/subscription/update-status`,
					{
						subscriptionId: relatedSub.id,
						status: "active",
					},
					{ "Content-Type": "application/json" },
					"PUT",
				);
				await refreshSubscriptions();
			} else {
				setPayError("No related subscription found for this charge.");
			}

			await refreshCharges();
		} catch (err: any) {
			setPayError(err.message || "Payment failed");
		}
		setPayLoading(null);
		setTimeout(() => {
			setPayError(null);
			setPaySuccess(null);
		}, 3000);
	};

	return (
		<Card className={`w-full max-w-2xl ${className}`}>
			<CardHeader className="flex items-center justify-between">
				<span className="text-xl font-bold">Your Charges</span>
				<Button
					color="primary"
					isLoading={loadingCharges}
					size="sm"
					startContent={<RefreshCcw size={16} />}
					variant="flat"
					onClick={refreshCharges}>
					Refresh
				</Button>
			</CardHeader>

			<CardBody>
				{loadingCharges && (
					<div className="text-default-400 text-center py-4">
						<Spinner label="Fetching charges..." size="sm" />
					</div>
				)}
				{!loadingCharges && charges.length === 0 && (
					<div className="text-default-400 text-center py-4">No charges found.</div>
				)}
				<div className="flex flex-col gap-3">
					{charges.map((charge) => (
						<div
							key={charge.id}
							className="flex lg:items-center items-start gap-2 lg:flex-row flex-col justify-between p-3 rounded-lg border border-default-200 bg-default-50">
							<div className="flex flex-col gap-1">
								<span className="font-mono text-xs text-default-600">
									<Snippet hideSymbol size="sm" variant="flat">
										{charge.paymentId}
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
									charge.status === "COMPLETED"
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
									isLoading={payLoading === charge.id}
									disabled={!!payLoading}
									onPress={() => handlePayCharge(charge)}
									variant="solid"
									className="rounded-full">
									Pay
								</Button>
							)}
						</div>
					))}
					{/* Show payment error/success */}
					{payError && (
						<Chip className="w-full justify-center mt-2" color="danger" variant="flat">
							{payError}
						</Chip>
					)}
					{paySuccess && (
						<Chip className="w-full justify-center mt-2" color="success" variant="flat">
							{paySuccess}
						</Chip>
					)}
				</div>
			</CardBody>
		</Card>
	);
}
