"use client";
import { useState, useEffect, useCallback } from "react";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/react";
import { Button } from "@heroui/button";
import { AlertCircleIcon, CheckCircle2, Rocket } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useLiskUsers } from "@/hooks/useLiskUsers";
import { iUser } from "@/types";

export function LiskOnboarding() {
	const { user } = useUser();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [autoCreateCountdown, setAutoCreateCountdown] = useState(10);
	const { createUser, getUser, singleUser, errorUsers } = useLiskUsers();

	const handleCreateLiskAccount = useCallback(async () => {
		const isMissingUserInfo =
			!user?.id ||
			!user?.firstName ||
			!user?.lastName ||
			!user?.primaryEmailAddress?.emailAddress;

		if (isMissingUserInfo) {
			setError("Missing user information. Please try refreshing the page.");
			return;
		}

		setLoading(true);
		setError(null);
		try {
			// First, check if Lisk user already exists
			console.log("Checking if Lisk user already exists...");
			await getUser({ id: user.id });

			if (singleUser) {
				// User already exists in Lisk, just update Clerk metadata
				console.log("Lisk user already exists:", singleUser.id);

				await user.update({
					unsafeMetadata: {
						liskAccountCreated: true,
						paymentId: singleUser?.paymentIdentifier,
						paymentEnabled: singleUser?.enabledPay,
					},
				});

				setSuccess(true);
				setTimeout(() => {
					user.reload(); // Refresh to update user metadata
				}, 2000);

				return;
			}

			// User doesn't exist, create new one
			console.log("Creating new Lisk user...");
			await createUser({
				id: user.id,
				email: user.primaryEmailAddress?.emailAddress,
				firstName: user.firstName,
				lastName: user.lastName,
			});

			if (!errorUsers && singleUser) {
				// Update Clerk user metadata with Lisk account info
				await user.update({
					unsafeMetadata: {
						liskAccountCreated: true,
						paymentId: (singleUser as iUser)?.paymentIdentifier,
						paymentEnabled: (singleUser as iUser)?.enabledPay,
					},
				});

				setSuccess(true);
				setTimeout(() => {
					router.refresh(); // Refresh to update user metadata
				}, 2000);
			} else {
				setError(errorUsers || "Failed to create Lisk account");
			}
		} catch (err: any) {
			console.error("Lisk account creation error:", err);
			setError(err.message || "Failed to create Lisk account");
		} finally {
			setLoading(false);
		}
	}, [createUser, errorUsers, getUser, router, singleUser, user]);

	// Auto-create Lisk account after 10 seconds if not clicked
	useEffect(() => {
		const interval = setInterval(() => {
			setAutoCreateCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					handleCreateLiskAccount();
					return 0;
				}

				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [handleCreateLiskAccount]);

	const handleSkip = () => {
		// Mark onboarding as skipped and allow user to continue
		if (user) {
			user.update({
				unsafeMetadata: {
					liskOnboardingSkipped: true,
				},
			}).then(() => {
				router.refresh();
			});
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<Card className="w-full max-w-md shadow-2xl">
				<CardHeader className="text-center">
					<div className="flex flex-col items-center gap-3">
						<Rocket className="text-primary" size={48} />
						<h2 className="text-2xl font-bold">Welcome to PayMe-Zar!</h2>
						<p className="text-default-600 text-sm">
							Let&apos;s set up your blockchain account to enable ZAR stablecoin
							payments.
						</p>
					</div>
				</CardHeader>
				<CardBody>
					<div className="flex flex-col gap-4 items-center">
						<div className="w-full bg-default-50 border rounded-lg p-4 flex flex-col gap-2">
							<div>
								<span className="text-xs text-default-500">Name</span>
								<div className="font-medium text-sm">
									{user?.firstName} {user?.lastName}
								</div>
							</div>
							<div>
								<span className="text-xs text-default-500">Email</span>
								<div className="font-medium text-sm">
									{user?.primaryEmailAddress?.emailAddress}
								</div>
							</div>
							<div>
								<span className="text-xs text-default-500">User ID</span>
								<div className="font-mono text-xs text-default-400">{user?.id}</div>
							</div>
						</div>

						<div className="text-center">
							<h3 className="font-semibold mb-2">What we&apos;ll create for you:</h3>
							<ul className="text-sm text-default-600 space-y-1">
								<li>✓ Secure blockchain wallet</li>
								<li>✓ Unique payment identifier</li>
								<li>✓ ZAR stablecoin support</li>
							</ul>
						</div>

						{error && (
							<div className="flex items-center gap-2 text-red-600 text-sm w-full p-3 bg-red-50 rounded-lg border border-red-200">
								<AlertCircleIcon size={18} />
								<span>{error}</span>
							</div>
						)}

						{success && (
							<div className="flex items-center gap-2 text-green-600 text-sm w-full p-3 bg-green-50 rounded-lg border border-green-200">
								<CheckCircle2 size={18} />
								<span>Lisk account set up successfully!</span>
							</div>
						)}
					</div>
				</CardBody>
				<CardFooter className="flex flex-col gap-3">
					<Button
						className="w-full"
						color="primary"
						disabled={loading || success}
						isLoading={loading}
						size="lg"
						startContent={<Rocket size={18} />}
						onPress={handleCreateLiskAccount}>
						{success
							? "Account Ready!"
							: loading
								? "Setting up account..."
								: `Set Up Blockchain Account${autoCreateCountdown > 0 ? ` (${autoCreateCountdown})` : ""}`}
					</Button>

					{!loading && !success && (
						<Button className="w-full" size="sm" variant="ghost" onPress={handleSkip}>
							Skip for now
						</Button>
					)}

					<p className="text-xs text-default-500 text-center">
						This step is required to send and receive ZAR stablecoins on the blockchain.
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
