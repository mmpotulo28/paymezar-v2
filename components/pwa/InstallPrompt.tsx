"use client";
import { useEffect, useState } from "react";
import {
	Chip,
	Button,
	Modal,
	ModalBody,
	ModalHeader,
	ModalFooter,
	ModalContent,
} from "@heroui/react";

export function InstallPrompt() {
	const [isIOS, setIsIOS] = useState(false);
	const [isStandalone, setIsStandalone] = useState(false);
	const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
	const [showButton, setShowButton] = useState(false);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream);
		setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

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

	return (
		<Modal isOpen={open} onClose={handleClose} size="sm" backdrop="blur">
			<ModalContent>
				<ModalHeader>
					<Chip color="warning" variant="flat">
						Install App
					</Chip>
				</ModalHeader>
				<ModalBody>
					<p className="mb-2">
						Install this app to your home screen for a faster, fullscreen experience.
					</p>
					{showButton && !isIOS && (
						<Button color="primary" onClick={handleInstallClick} className="mb-2">
							Add to Home Screen
						</Button>
					)}
					{isIOS && (
						<div className="mt-2 text-default-700">
							<p>
								On iOS, tap the <b>Share</b>{" "}
								<span role="img" aria-label="share icon">
									⎋
								</span>{" "}
								button and then <b>Add to Home Screen</b>{" "}
								<span role="img" aria-label="plus icon">
									➕
								</span>
								.
							</p>
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
