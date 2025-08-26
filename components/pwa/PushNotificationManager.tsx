"use client";

import { useState, useEffect } from "react";
import { subscribeUser, unsubscribeUser, sendNotification } from "@/app/actions";

import { Card, CardHeader, CardBody, Button, Input, Chip } from "@heroui/react";

function urlBase64ToUint8Array(base64String: string) {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

export function PushNotificationManager() {
	const [isSupported, setIsSupported] = useState(false);
	const [subscription, setSubscription] = useState<PushSubscription | null>(null);
	const [message, setMessage] = useState("");
	const [status, setStatus] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if ("serviceWorker" in navigator && "PushManager" in window) {
			setIsSupported(true);
			registerServiceWorker();
		}
	}, []);

	async function registerServiceWorker() {
		try {
			const registration = await navigator.serviceWorker.register("/sw.js", {
				scope: "/",
				updateViaCache: "none",
			});
			const sub = await registration.pushManager.getSubscription();
			setSubscription(sub);
		} catch {
			setStatus("Failed to register service worker.");
		}
	}

	async function subscribeToPush() {
		setLoading(true);
		setStatus(null);
		try {
			const registration = await navigator.serviceWorker.ready;
			const sub = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(
					process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
				),
			});
			setSubscription(sub);
			const serializedSub = JSON.parse(JSON.stringify(sub));
			await subscribeUser(serializedSub);
			setStatus("Subscribed successfully!");
		} catch {
			setStatus("Failed to subscribe.");
		}
		setLoading(false);
	}

	async function unsubscribeFromPush() {
		setLoading(true);
		setStatus(null);
		try {
			await subscription?.unsubscribe();
			setSubscription(null);
			await unsubscribeUser();
			setStatus("Unsubscribed successfully.");
		} catch {
			setStatus("Failed to unsubscribe.");
		}
		setLoading(false);
	}

	async function sendTestNotification() {
		setLoading(true);
		setStatus(null);
		try {
			if (subscription) {
				const result = await sendNotification(message);
				if (result.success) {
					setStatus("Notification sent!");
				} else {
					setStatus(result.error || "Failed to send notification.");
				}
				setMessage("");
			}
		} catch {
			setStatus("Failed to send notification.");
		}
		setLoading(false);
	}

	if (!isSupported) {
		return (
			<Card className="max-w-2xl mx-auto mb-8">
				<CardHeader>
					<Chip color="danger" variant="flat">
						Push Notifications
					</Chip>
				</CardHeader>
				<CardBody>
					<p className="text-danger">
						Push notifications are not supported in this browser.
					</p>
				</CardBody>
			</Card>
		);
	}

	return (
		<Card className="max-w-2xl mx-auto mb-8">
			<CardHeader>
				<Chip color="primary" variant="flat">
					Push Notifications
				</Chip>
			</CardHeader>
			<CardBody>
				{status && <div className="mb-2 text-xs text-default-600">{status}</div>}
				{subscription ? (
					<div>
						<p className="mb-2 text-default-700">
							You are subscribed to push notifications.
						</p>
						<Button
							color="danger"
							variant="bordered"
							onClick={unsubscribeFromPush}
							disabled={loading}
							className="mb-2">
							{loading ? "Unsubscribing..." : "Unsubscribe"}
						</Button>
						<Input
							label="Notification message"
							placeholder="Enter notification message"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							className="mb-2"
							disabled={loading}
						/>
						<Button
							color="primary"
							onClick={sendTestNotification}
							disabled={loading || !message}>
							{loading ? "Sending..." : "Send Test Notification"}
						</Button>
					</div>
				) : (
					<div>
						<p className="mb-2 text-default-700">
							You are not subscribed to push notifications.
						</p>
						<Button color="primary" onClick={subscribeToPush} disabled={loading}>
							{loading ? "Subscribing..." : "Subscribe"}
						</Button>
					</div>
				)}
			</CardBody>
		</Card>
	);
}
