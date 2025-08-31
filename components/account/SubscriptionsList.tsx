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
	Divider,
	CardFooter,
} from "@heroui/react";
import { RefreshCcw, Star, Calendar, Zap, XCircle, Repeat } from "lucide-react";
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
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{subscriptions.map((sub) => (
						<Card
							key={sub.id}
							className="flex flex-col justify-between border border-default-200 shadow-sm rounded-xl p-4 bg-default-50">
							<CardHeader className="flex items-center gap-2 mb-2 p-0">
								{sub.plan === "business" && (
									<Star className="text-warning" size={20} />
								)}
								{sub.plan === "pro" && <Zap className="text-primary" size={20} />}
								{sub.plan === "starter" && (
									<Repeat className="text-success" size={20} />
								)}
								<span className="font-bold text-lg capitalize">{sub.plan}</span>
								<Chip
									color={
										sub.status === "active"
											? "success"
											: sub.status === "canceled"
												? "danger"
												: "warning"
									}
									variant="flat"
									className="ml-2">
									{sub.status}
								</Chip>
								<span className="text-xs text-success ml-2">Free Plan</span>
							</CardHeader>
							<Divider className="my-2" />
							<CardBody className="flex flex-col gap-2 mb-2">
								<div className="flex items-center gap-2 text-xs text-default-500">
									<Calendar size={14} />
									<span>
										Started:{" "}
										{sub.started_at ? sub.started_at.split("T")[0] : "-"}
									</span>
									{sub.ended_at && (
										<>
											<span>|</span>
											<span>
												Ended:{" "}
												{sub.ended_at ? sub.ended_at.split("T")[0] : "-"}
											</span>
										</>
									)}
								</div>
								<div className="flex items-center gap-2 text-xs text-default-500">
									<span>Period:</span>
									<Chip color="secondary" variant="flat" size="sm">
										{sub.period}
									</Chip>
									<span>Price:</span>
									<Chip color="primary" variant="flat" size="sm">
										{sub.planDetails?.price[sub.period] || "N/A"} ZAR
									</Chip>
								</div>
							</CardBody>
							<Divider className="my-2" />
							<CardFooter className="flex flex-row gap-2 p-0 justify-start">
								<Button
									size="sm"
									color="danger"
									variant="flat"
									isLoading={cancelingId === sub.id}
									disabled={cancelingId === sub.id}
									startContent={<XCircle size={16} />}
									onPress={() => openCancelConfirmModal(sub)}>
									Cancel
								</Button>
								<Button
									size="sm"
									color="secondary"
									variant="flat"
									isLoading={changingId === sub.id}
									disabled={changingId === sub.id}
									startContent={<Repeat size={16} />}
									onPress={() => openChangeModal(sub)}>
									Change Plan
								</Button>
							</CardFooter>
						</Card>
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
