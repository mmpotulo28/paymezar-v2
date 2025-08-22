import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { QrCodeIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeResult } from "html5-qrcode";

interface iQRScannerProps {
	scanModalOpen: boolean;
	onClose: () => void;
	onScan: (data: string) => void;
	scanDelay?: number;
	constraints?: MediaTrackConstraints;
	className?: string;
	containerStyle?: React.CSSProperties;
	videoContainerStyle?: React.CSSProperties;
	videoStyle?: React.CSSProperties;
}

const QrCodeScanner: React.FC<iQRScannerProps> = ({ scanModalOpen, onClose, onScan }) => {
	const [scanError, setScanError] = useState<string | null>(null);
	const lastErrorRef = useRef<string | null>(null);
	const scannerRef = useRef<Html5QrcodeScanner | null>(null);

	useEffect(() => {
		if (!scanModalOpen) {
			// Modal closed: clear scanner and errors
			scannerRef.current?.clear();
			scannerRef.current = null;
			setScanError(null);
			lastErrorRef.current = null;

			return;
		}

		// Modal opened: initialize scanner
		const onScanSuccess = (decodedText: string, decodedResult: Html5QrcodeResult): void => {
			console.log(`Code matched = ${decodedText}`, decodedResult);
			onScan(decodedText);
			scannerRef.current?.pause();
		};

		const onScanFailure = (error: string): void => {
			const ignoredErrors = [
				"QR code parse error, error = No barcode or QR code detected.",
				"QR code parse error, error = NotFoundException: No MultiFormat Readers were able to detect the code.",
			];

			if (ignoredErrors.some((msg) => error.includes(msg))) {
				return; // Ignore specific errors
			}
			if (lastErrorRef.current === error) {
				return; // Ignore repeated errors
			}
			lastErrorRef.current = error;
			setScanError(error);
			console.warn(`Scan error: ${error}`);
		};

		scannerRef.current = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);
		scannerRef.current.render(onScanSuccess, onScanFailure);

		return () => {
			// Cleanup: stop scanner and release camera
			if (scannerRef.current) {
				scannerRef.current.clear();
				scannerRef.current = null;
			}
		};
	}, [onScan, scanModalOpen]);

	return (
		<Modal isOpen={scanModalOpen} size="sm" onClose={onClose}>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader>
							<span className="flex items-center gap-2">
								<QrCodeIcon size={20} /> Scan Payment QR
							</span>
						</ModalHeader>
						<ModalBody>
							<div className={`flex flex-col items-center gap-3 `}>
								{scanModalOpen && (
									<div>
										<div id="reader" style={{ width: "300px" }} />
									</div>
								)}
								{scanError && (
									<div className="text-red-600 text-xs text-center border border-red-200 bg-red-50 rounded p-2 w-full">
										<strong>Scan Error:</strong> {scanError}
									</div>
								)}
								<div className="text-xs text-default-500">
									Point your camera at a PayMe-Zar payment QR code.
								</div>
							</div>
						</ModalBody>
						<ModalFooter>
							<Button
								color="secondary"
								variant="flat"
								onPress={() => {
									onClose();
									setScanError(null);
								}}>
								Close
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default QrCodeScanner;
