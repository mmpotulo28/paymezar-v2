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

	const scannerRef = useRef<Html5QrcodeScanner | null>(null);
	const [code, setCode] = useState<string>("");

	useEffect(() => {
		const onScanSuccess = (decodedText: string, decodedResult: Html5QrcodeResult): void => {
			console.log(`Code matched = ${decodedText}`, decodedResult);
			setCode(decodedText);
			onScan(decodedText);
			scannerRef.current?.pause();
			setScanError(null);
		};

		const onScanFailure = (error: string): void => {
			const ignoredErrors = [
				"QR code parse error, error = NotFoundException: No MultiFormat Readers were able to detect the code.",
				"QR code parse error, error = No barcode or QR code detected.",
			];
			if (ignoredErrors.includes(error)) return; // Avoid duplicate errors
			console.error(`Code scan error = ${error}`);
			setScanError(error);
		};

		if (scannerRef.current) {
			scannerRef.current.clear();
		}

		scannerRef.current = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);
		scannerRef.current?.render(onScanSuccess, onScanFailure);

		return () => {
			scannerRef.current?.clear();
		};
	}, []);

	return (
		<Modal isOpen={scanModalOpen} onClose={onClose} size="sm">
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
										<div id="reader" style={{ width: "300px" }}></div>
										<div>{code && <p>Scanned code: {code}</p>}</div>
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
