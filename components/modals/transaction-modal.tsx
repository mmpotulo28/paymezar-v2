import { statusColorMap } from "@/lib/helpers";
import { iTransaction } from "@/types";
import {
	Button,
	Chip,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import { EyeIcon } from "lucide-react";

interface iTransactionModalProps {
	isOpen: boolean;
	onClose: () => void;
	selected: iTransaction | null;
}

const TransactionModal: React.FC<iTransactionModalProps> = ({ isOpen, onClose, selected }) => {
	return (
		<Modal isOpen={isOpen} size={"sm"} onClose={onClose}>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader>
							<div className="flex items-center gap-3">
								<EyeIcon className="text-primary" size={24} />
								<span className="text-lg font-bold">Transaction Details</span>
							</div>
						</ModalHeader>
						<ModalBody>
							{selected && (
								<div className="flex flex-col gap-4 p-2">
									<div className="grid grid-cols-2 gap-4">
										<div className="text-xs text-default-500">
											Transaction ID
										</div>
										<div className="font-mono text-xs break-all">
											{selected.id}
										</div>
										<div className="text-xs text-default-500">User</div>
										<div className="font-mono text-xs">{selected.userId}</div>
										<div className="text-xs text-default-500">External Ref</div>
										<div className="font-mono text-xs">
											{selected.externalId || (
												<span className="italic text-default-400">-</span>
											)}
										</div>
										<div className="text-xs text-default-500">Type</div>
										<div className="text-xs">{selected.txType}</div>
										<div className="text-xs text-default-500">Method</div>
										<div className="text-xs">{selected.method}</div>
										<div className="text-xs text-default-500">Currency</div>
										<div className="text-xs">{selected.currency}</div>
										<div className="text-xs text-default-500">Status</div>
										<div>
											<Chip
												className="capitalize"
												color={statusColorMap[selected.status] || "default"}
												size="sm"
												variant="flat">
												{selected.status}
											</Chip>
										</div>
										<div className="text-xs text-default-500">Date</div>
										<div className="text-xs">
											{selected.createdAt.split("T")[0]}
										</div>
									</div>
									<div className="flex flex-col gap-1 mt-2">
										<div className="text-xs text-default-500">Amount</div>
										<div className="text-2xl font-mono font-bold text-primary">
											{selected.value.toLocaleString("en-ZA", {
												style: "currency",
												currency: selected.currency,
											})}
										</div>
									</div>
								</div>
							)}
						</ModalBody>
						<ModalFooter>
							<span className="text-xs text-default-500">
								if you have any questions about this transaction, please contact
								support.
							</span>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default TransactionModal;
