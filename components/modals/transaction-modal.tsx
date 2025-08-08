import { statusColorMap } from "@/lib/helpers";
import { iTransaction } from "@/types";
import { useUser } from "@clerk/nextjs";
import {
	Button,
	Chip,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Snippet,
	Tooltip,
} from "@heroui/react";
import { EyeIcon, ArrowDownLeft, ArrowUpRight, Copy } from "lucide-react";

interface iTransactionModalProps {
	isOpen: boolean;
	onClose: () => void;
	selected: iTransaction | null;
}

const TransactionModal: React.FC<iTransactionModalProps> = ({ isOpen, onClose, selected }) => {
	const { user } = useUser();
	const isIncoming = selected && user ? selected.userId !== user.id : false;

	return (
		<Modal isOpen={isOpen} size="md" onClose={onClose}>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader>
							<div className="flex items-center gap-3">
								{isIncoming ? (
									<Tooltip content="Incoming">
										<ArrowDownLeft className="text-success" size={24} />
									</Tooltip>
								) : (
									<Tooltip content="Outgoing">
										<ArrowUpRight className="text-primary" size={24} />
									</Tooltip>
								)}
								<span className="text-lg font-bold">Transaction Details</span>
							</div>
						</ModalHeader>
						<ModalBody>
							{selected && (
								<div className="flex flex-col gap-6 p-2">
									{/* Amount and Direction */}
									<div className="flex flex-col items-center gap-2">
										<div
											className={`text-3xl font-mono font-bold ${
												isIncoming ? "text-success" : "text-primary"
											}`}>
											{isIncoming ? "+" : "-"}
											{selected.value.toLocaleString("en-ZA", {
												style: "currency",
												currency: "ZAR",
											})}
										</div>
										<Chip
											className="capitalize"
											color={statusColorMap[selected.status] || "default"}
											size="sm"
											variant="flat">
											{selected.status}
										</Chip>
										<span className="text-xs text-default-400">
											{selected.createdAt.split("T")[0]}
										</span>
									</div>
									{/* Details Grid */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div className="flex flex-col gap-1">
											<span className="text-xs text-default-500">
												Transaction ID
											</span>
											<Snippet
												className="overflow-x-auto scrollbar-hide"
												size="sm"
												variant="bordered"
												symbol="">
												{selected.id}
											</Snippet>
										</div>
										<div className="flex flex-col gap-1">
											<span className="text-xs text-default-500">User</span>
											<Snippet
												className="overflow-x-auto scrollbar-hide"
												size="sm"
												variant="bordered"
												symbol="">
												{selected.userId}
											</Snippet>
										</div>
										<div className="flex flex-col gap-1">
											<span className="text-xs text-default-500">
												External Ref
											</span>
											{selected.externalId ? (
												<Snippet
													className="overflow-x-auto scrollbar-hide"
													size="sm"
													variant="bordered"
													symbol="">
													{selected.externalId}
												</Snippet>
											) : (
												<span className="italic text-default-400 text-xs">
													-
												</span>
											)}
										</div>
										<div className="flex flex-col gap-1">
											<span className="text-xs text-default-500">Type</span>
											<span className="text-xs">{selected.txType}</span>
										</div>
										<div className="flex flex-col gap-1">
											<span className="text-xs text-default-500">Method</span>
											<span className="text-xs">{selected.method}</span>
										</div>
										<div className="flex flex-col gap-1">
											<span className="text-xs text-default-500">
												Currency
											</span>
											<span className="text-xs">{selected.currency}</span>
										</div>
									</div>
								</div>
							)}
						</ModalBody>
						<ModalFooter className="flex flex-col items-center gap-2">
							<span className="text-xs text-default-500 text-center">
								If you have any questions about this transaction, please contact
								support.
							</span>
							<Button color="secondary" variant="flat" onPress={onClose}>
								Close
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default TransactionModal;
