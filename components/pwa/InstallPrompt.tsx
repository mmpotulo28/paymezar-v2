"use client";
import { useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalHeader, ModalFooter, ModalContent } from "@heroui/react";
import dynamic from "next/dynamic";
import { Download, PlusSquare, Share } from "lucide-react";

// Dynamically import QRCodeCanvas for SSR safety
const QRCode = dynamic(() => import("qrcode.react").then((mod) => mod.QRCodeCanvas), {
	ssr: false,
});

export function InstallPrompt() {
	const [isIOS, setIsIOS] = useState(false);
	const [isStandalone, setIsStandalone] = useState(false);
	const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
	const [showButton, setShowButton] = useState(false);
	const [open, setOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream);
		setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
		setIsMobile(
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent,
			),
		);

		const handler = (e: any) => {
			e.preventDefault();
			setDeferredPrompt(e);
			setShowButton(true);
		};
		window.addEventListener("beforeinstallprompt", handler);

		// Show popup after 5 seconds
		const timer = setTimeout(() => {
			if (!isStandalone) setOpen(true);
		}, 5000);

		return () => {
			window.removeEventListener("beforeinstallprompt", handler);
			clearTimeout(timer);
		};
	}, [isStandalone]);

	const handleInstallClick = async () => {
		if (deferredPrompt) {
			deferredPrompt.prompt();
			await deferredPrompt.userChoice;
			setDeferredPrompt(null);
			setShowButton(false);
			setOpen(false);
		}
	};

	const handleClose = () => setOpen(false);

	if (isStandalone || !open) {
		return null;
	}

	const currentUrl =
		typeof window !== "undefined"
			? `${window.location.href}?utm_source=pwa&utm_medium=install_prompt`
			: "https://paymezar.mpotulo.com?utm_source=pwa&utm_medium=install_prompt";

	return (
		<Modal isOpen={open} onClose={handleClose} size="sm" backdrop="blur">
			<ModalContent>
				<ModalHeader>
					<span className="flex flex-row gap-4 w-fit bg-secondary-400 rounded-4xl items-center	px-4 py-1 text-md">
						Install App <Download size="16" />
					</span>
				</ModalHeader>
				<ModalBody>
					<p className="mb-2">
						Install this app to your Mobile Phone for a faster, fullscreen experience.
					</p>
					{showButton && !isIOS && isMobile && (
						<Button color="primary" onClick={handleInstallClick} className="mb-2">
							Add to Home Screen
						</Button>
					)}
					{isIOS && (
						<div className="mt-2 text-default-700">
							<p>
								On iOS, tap the <b>Share</b>{" "}
								<span role="img" aria-label="share icon">
									<Share />
								</span>{" "}
								button and then <b>Add to Home Screen</b>{" "}
								<span role="img" aria-label="plus icon">
									<PlusSquare />
								</span>
								.
							</p>
						</div>
					)}
					{/* Show QR code if on desktop */}
					{!isMobile && (
						<div className="flex flex-col items-center gap-2 mt-4">
							<span className="text-sm text-default-700 font-semibold">
								Open this page on your mobile device
							</span>
							<div className="bg-white p-3 rounded-lg border">
								<QRCode size={140} value={currentUrl} />
							</div>
							<span className="text-xs text-default-400">
								Scan with your phone camera to open
							</span>
						</div>
					)}
				</ModalBody>
				<ModalFooter>
					<Button color="default" variant="light" onClick={handleClose}>
						Maybe later
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
