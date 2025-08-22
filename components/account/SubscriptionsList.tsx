"use client";
import { Card, CardHeader, CardBody, Chip, Button, Spinner, Alert } from "@heroui/react";
import { RefreshCcw } from "lucide-react";

import { useAccount } from "@/context/AccountContext";
import { useUser } from "@clerk/nextjs";

export function SubscriptionsList() {
	const { subscriptions, subscriptionLoading, refreshSubscriptions, subscriptionError } =
		useAccount();
	const { user } = useUser();

	return (
		<Card className="w-full max-w-2xl">
			<CardHeader className="flex items-center justify-between">
				<span className="text-xl font-bold">Subscriptions</span>
				<Button
					color="primary"
					isLoading={subscriptionLoading}
					size="sm"
					startContent={<RefreshCcw size={16} />}
					variant="flat"
					onPress={() => refreshSubscriptions(user?.id || "")}>
					Refresh
				</Button>
			</CardHeader>
			<CardBody>
				{subscriptionLoading && (
					<div className="text-default-400 text-center py-4">
						<Spinner label="Fetching subscriptions..." size="sm" />
					</div>
				)}
				{!subscriptionLoading && subscriptions.length === 0 && !subscriptionError && (
					<div className="text-default-400 text-center py-4">No subscriptions found.</div>
				)}
				{subscriptionError && (
					<Alert
						color="danger"
						description={subscriptionError}
						title="Error fetching subscriptions!"
						variant="bordered"
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
							<div className="flex flex-col gap-1">
								<span className="font-mono text-xs text-default-600">
									{sub.planDetails?.price[sub.period] || "N/A"} {"ZAR"}
								</span>
								<span className="text-xs text-default-500">
									Period: {sub.period}
								</span>
							</div>
							<span className="text-xs text-default-500">
								{sub.started_at?.split("T")[0] || "-"}
							</span>
							<Chip
								color={
									sub.status === "active"
										? "success"
										: sub.status === "canceled"
											? "danger"
											: "default"
								}
								variant="flat">
								{sub.status}
							</Chip>
						</div>
					))}
				</div>
			</CardBody>
		</Card>
	);
}
