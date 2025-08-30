"use client";
import {
	Card,
	CardHeader,
	CardBody,
	Chip,
	Button,
	Spinner,
	Alert,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "@heroui/react";
import { RefreshCcw } from "lucide-react";
import { useAccount } from "@/context/AccountContext";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { ChangePlanModal } from "./ChangePlanModal";
import { iSubscription } from "@/types";

export function SubscriptionsList() {
	const {
		subscriptions,
		subscriptionLoading,
		fetchSubscriptions,
		subscriptionError,
		cancelSubscription,
		changeSubscriptionPlan,
		subscriptionMessage,
	} = useAccount();
	const { user } = useUser();
	const [changingId, setChangingId] = useState<string | null>(null);
	const [cancelingId, setCancelingId] = useState<string | null>(null);
	const [selectedSub, setSelectedSub] = useState<iSubscription | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [cancelConfirmModal, setCancelConfirmModal] = useState(false);

	// fetch on mount
	useEffect(() => {
		fetchSubscriptions(user?.id || "");
	}, [fetchSubscriptions, user?.id]);

	const handleCancel = async (sub: iSubscription) => {
		setCancelingId(sub.id);
		await cancelSubscription(sub.id);
		setCancelingId(null);
		setCancelConfirmModal(false);
	};

	const openCancelConfirmModal = (sub: iSubscription) => {
		setSelectedSub(sub);
		setCancelConfirmModal(true);
	};

	const closeCancelConfirmModal = () => {
		setSelectedSub(null);
		setCancelConfirmModal(false);
	};

	const openChangeModal = (sub: iSubscription) => {
		console.log("Opening change modal for subscription:", sub);
		setSelectedSub(sub);
		setShowModal(true);
	};

	const closeChangeModal = () => {
		setSelectedSub(null);
		setShowModal(false);
	};

	const handleConfirmChange = async (newPlan: string, newPeriod: "monthly" | "yearly") => {
		if (selectedSub) {
			setChangingId(selectedSub.id);
			await changeSubscriptionPlan({
				subscriptionId: selectedSub.id,
				newPlan,
				newPeriod,
			});
			setChangingId(null);
			closeChangeModal();
		}
	};

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
					onPress={() => fetchSubscriptions(user?.id || "")}>
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
				{subscriptionMessage && (
					<Alert
						color="success"
						description={subscriptionMessage}
						title="Success"
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
							{/* Cancel/Change Plan buttons */}
							{sub.plan === "starter" ? (
								<span className="text-xs text-success ml-2">Free Plan</span>
							) : (
								<div className="flex gap-2 ml-2">
									<Button
										size="sm"
										color="danger"
										variant="flat"
										isLoading={cancelingId === sub.id}
										disabled={cancelingId === sub.id}
										onPress={() => openCancelConfirmModal(sub)}>
										Cancel
									</Button>
									<Button
										size="sm"
										color="secondary"
										variant="flat"
										isLoading={changingId === sub.id}
										disabled={changingId === sub.id}
										onPress={() => openChangeModal(sub)}>
										Change Plan
									</Button>
								</div>
							)}
						</div>
					))}
				</div>
				<ChangePlanModal
					showModal={showModal}
					onClose={closeChangeModal}
					subscription={selectedSub}
					onConfirm={handleConfirmChange}
					isLoading={changingId === selectedSub?.id}
				/>
				<Modal isOpen={cancelConfirmModal} onClose={closeCancelConfirmModal}>
					<ModalContent>
						{(onClose) => (
							<>
								<ModalHeader>
									<span className="font-bold text-lg">Cancel Subscription</span>
								</ModalHeader>
								<ModalBody>
									<p>
										Are you sure you want to cancel your subscription
										{selectedSub
											? ` (${selectedSub.plan}, ${selectedSub.period})`
											: ""}
										? This action cannot be undone.
									</p>
								</ModalBody>
								<ModalFooter>
									<Button
										color="danger"
										isLoading={cancelingId === selectedSub?.id}
										disabled={cancelingId === selectedSub?.id}
										onPress={() => selectedSub && handleCancel(selectedSub)}>
										Yes, Cancel
									</Button>
									<Button color="secondary" variant="flat" onPress={onClose}>
										No, Keep
									</Button>
								</ModalFooter>
							</>
						)}
					</ModalContent>
				</Modal>
			</CardBody>
		</Card>
	);
}
