"use client";
import { useAccount } from "@/context/AccountContext";
import { Card, CardHeader, CardBody, Chip, Button, Spinner, Alert } from "@heroui/react";
import { RefreshCcw } from "lucide-react";

export function SubscriptionsList() {
	const { subscriptions, loadingSubscriptions, refreshSubscriptions, subscriptionError } =
		useAccount();
	return (
		<Card className="w-full max-w-2xl">
			<CardHeader className="flex items-center justify-between">
				<span className="text-xl font-bold">Subscriptions</span>
				<Button
					size="sm"
					variant="flat"
					color="primary"
					isLoading={loadingSubscriptions}
					onPress={refreshSubscriptions}
					startContent={<RefreshCcw size={16} />}>
					Refresh
				</Button>
			</CardHeader>
			<CardBody>
				{loadingSubscriptions && (
					<div className="text-default-400 text-center py-4">
						<Spinner size="sm" label="Fetching subscriptions..." />
					</div>
				)}
				{!loadingSubscriptions && subscriptions.length === 0 && !subscriptionError && (
					<div className="text-default-400 text-center py-4">No subscriptions found.</div>
				)}
				{subscriptionError && (
					<Alert
						color="danger"
						variant="bordered"
						title="Error fetching subscriptions!"
						description={subscriptionError}
					/>
				)}
				<div className="flex flex-col gap-3">
					{subscriptions.map((sub) => (
						<div
							key={sub.id}
							className="flex items-center justify-between p-3 rounded-lg border border-default-200 bg-default-50">
							<div className="flex flex-col gap-1">
								<span className="font-mono text-xs text-default-600">
									{sub.plan}
								</span>
								<span className="text-xs text-default-500">
									Status: {sub.status}
								</span>
							</div>
							<span className="font-mono text-sm font-bold">{sub.period}</span>
							<span className="text-xs text-default-500">
								{sub.started_at?.split("T")[0] || "-"}
							</span>
							<Chip
								variant="flat"
								color={
									sub.status === "active"
										? "success"
										: sub.status === "cancelled"
											? "danger"
											: "default"
								}>
								{sub.status}
							</Chip>
						</div>
					))}
				</div>
			</CardBody>
		</Card>
	);
}
