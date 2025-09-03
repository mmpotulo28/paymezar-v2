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
import { useState, useMemo, useEffect } from "react";

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

	const [filter, setFilter] = useState<"all" | "pending" | "complete">("all");
	const [page, setPage] = useState(1);
	const PAGE_SIZE = 5;

	useEffect(() => {
		if (!user?.id) return;
		fetchCharges(user?.id);
	}, [fetchCharges, user?.id]);

	// show errors in toast when they occur
	useEffect(() => {
		if (completeChargeError) {
			addToast({
				title: "Payment failed",
				description: completeChargeError,
				variant: "flat",
				color: "danger",
			});
		}
	}, [completeChargeError]);

	// show success messages in toast when they occur
	useEffect(() => {
		if (completeChargeMessage) {
			addToast({
				title: "Payment successful!",
				description: completeChargeMessage,
				variant: "flat",
				color: "success",
			});
		}
	}, [completeChargeMessage]);

	// Filter, sort, and paginate charges
	const filteredSortedCharges = useMemo(() => {
		let filtered = charges;
		if (filter === "pending") {
			filtered = charges.filter((c) => c.status === "PENDING");
		} else if (filter === "complete") {
			filtered = charges.filter((c) => c.status === "COMPLETE");
		}
		// Sort by createdAt, newest first
		const sorted = [...filtered].sort(
			(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		);
		return sorted;
	}, [charges, filter]);

	const totalPages = Math.ceil(filteredSortedCharges.length / PAGE_SIZE);
	const paginatedCharges = filteredSortedCharges.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

	const handleFilterChange = (newFilter: "all" | "pending" | "complete") => {
		setFilter(newFilter);
		setPage(1);
	};

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	// Pay for a charge and activate subscription
	const handlePayCharge = async (charge: iCharge) => {
		if (!user) return;

		addToast({
			title: "Payment in progress...",
			description: `Your payment is being processed`,
			variant: "flat",
			color: "default",
			shouldShowTimeoutProgress: true,
			size: "sm",
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
					onPress={() => fetchCharges(user?.id || "", true)}>
					Refresh
				</Button>
			</CardHeader>

			<CardBody>
				{/* Filter controls */}
				<div className="flex gap-2 mb-4">
					<Button
						size="sm"
						variant={filter === "all" ? "solid" : "flat"}
						color="default"
						onPress={() => handleFilterChange("all")}>
						All
					</Button>
					<Button
						size="sm"
						variant={filter === "pending" ? "solid" : "flat"}
						color="warning"
						onPress={() => handleFilterChange("pending")}>
						Pending
					</Button>
					<Button
						size="sm"
						variant={filter === "complete" ? "solid" : "flat"}
						color="success"
						onPress={() => handleFilterChange("complete")}>
						Complete
					</Button>
				</div>
				{chargesLoading && (
					<div className="text-default-400 text-center py-4">
						<Spinner label="Fetching charges..." size="sm" />
					</div>
				)}
				{!chargesLoading && paginatedCharges.length === 0 && (
					<div className="text-default-400 text-center py-4">No charges found.</div>
				)}
				<div className="flex flex-col gap-3">
					{paginatedCharges.map((charge) => (
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
				{/* Pagination controls */}
				{totalPages > 1 && (
					<div className="flex justify-center items-center gap-2 mt-4">
						<Button
							size="sm"
							variant="flat"
							disabled={page === 1}
							onPress={() => handlePageChange(page - 1)}>
							Prev
						</Button>
						<span className="text-xs">
							Page {page} of {totalPages}
						</span>
						<Button
							size="sm"
							variant="flat"
							disabled={page === totalPages}
							onPress={() => handlePageChange(page + 1)}>
							Next
						</Button>
					</div>
				)}
			</CardBody>
		</Card>
	);
}
