import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

export function ConfirmModal({
	open,
	onClose,
	onConfirm,
	title,
	message,
	loading,
	confirmText = "Confirm",
	color = "primary",
}: {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	loading?: boolean;
	confirmText?: string;
	color?: "primary" | "danger" | "success";
}) {
	return (
		<Modal isOpen={open} onClose={onClose} className="max-w-sm mx-auto">
			<ModalContent>
				<ModalHeader>{title}</ModalHeader>
				<ModalBody>{message}</ModalBody>
				<ModalFooter>
					<Button variant="light" onPress={onClose}>
						Cancel
					</Button>
					<Button color={color} onPress={onConfirm} isLoading={loading}>
						{confirmText}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
