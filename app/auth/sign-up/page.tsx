"use client";
import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, CardFooter, Chip } from "@heroui/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { AlertCircleIcon, ShieldCheck, Lock, CheckCircle2, UserPlus, KeyRound } from "lucide-react";
import Cookies from "js-cookie";
import { createLiskAccount, postApi } from "@/lib/helpers";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
	const [form, setForm] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [step, setStep] = useState<1 | 2>(1);
	const [userInfo, setUserInfo] = useState<{
		email: string;
		firstName: string;
		lastName: string;
		apiKey?: string;
		apiKeyRow?: any;
		liskId?: string;
	} | null>(null);
	const [liskLoading, setLiskLoading] = useState(false);
	const [liskError, setLiskError] = useState<string | null>(null);
	const [liskUser, setLiskUser] = useState<any>(null);
	const [autoCreateCountdown, setAutoCreateCountdown] = useState(5);
	const router = useRouter();

	// Auto-create Lisk account after 5 seconds if not clicked
	useEffect(() => {
		if (step === 2 && userInfo && !userInfo.liskId) {
			setAutoCreateCountdown(5);
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
		}
	}, [step, userInfo]);

	// Redirect to sign-in page after Lisk account creation and no errors
	const shouldRedirectToSignIn = step === 2 && !!userInfo?.liskId && !liskError && !liskLoading;

	useEffect(() => {
		if (shouldRedirectToSignIn) {
			const timeout = setTimeout(() => {
				router.push("/auth/sign-in");
			}, 1500);
			return () => clearTimeout(timeout);
		}
	}, [shouldRedirectToSignIn, router]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			const result = await postApi("/api/auth/sign-up", { user: form });
			if (!result.error && result.data?.user) {
				Cookies.set("paymezar_user", JSON.stringify(result.data.user), { expires: 7 });
				setUserInfo(result.data.user);
				setSuccess(true);
				setStep(2);
			} else {
				setError(result.message || "Sign up failed");
			}
		} catch (err: any) {
			setError(err.message || "Sign up failed");
		} finally {
			setLoading(false);
		}
	};

	const handleCreateLiskAccount = async () => {
		const isInvalid =
			!userInfo?.apiKey ||
			liskLoading ||
			userInfo.liskId ||
			!userInfo.email ||
			!userInfo.firstName ||
			!userInfo.lastName;
		if (isInvalid) return;

		setLiskLoading(true);
		setLiskError(null);
		try {
			const result = await createLiskAccount({
				apiKey: userInfo.apiKey || "",
				email: userInfo.email || "",
				firstName: userInfo.firstName || "",
				lastName: userInfo.lastName || "",
			});

			if (!result.error && result.data) {
				setLiskUser(result.data);
				const linkResult = await postApi("/api/auth/link-lisk-id", {
					apiKey: userInfo.apiKey,
					liskId: result.data.user.id,
				});
				const updatedUser = { ...userInfo, liskId: result.data.user.id };
				Cookies.set("paymezar_user", JSON.stringify(updatedUser), { expires: 7 });
				setUserInfo(updatedUser);
				if (linkResult.error) setLiskError(linkResult.message);
			} else {
				setLiskError(result.message || "Failed to create Lisk account");
			}
		} catch (err: any) {
			setLiskError(err.message || "Failed to create Lisk account");
		} finally {
			setLiskLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-[80vh] ">
			<Card className="w-full max-w-4xl flex flex-col md:flex-row shadow-xl border border-default-200 overflow-hidden">
				{/* Left: Illustration & Security Info */}
				<div className="hidden md:flex flex-col justify-between items-center bg-gradient-to-br from-primary-100 to-primary-50 p-8 w-1/2 min-h-[500px]">
					<div className="flex flex-col items-center gap-4">
						<ShieldCheck size={64} className="text-primary mb-2" />
						<h2 className="text-2xl font-bold text-primary text-center">
							Your Security is Our Priority
						</h2>
						<p className="text-default-600 text-center max-w-xs">
							All your data is encrypted and protected with industry-leading security.
							We never share your information with third parties.
						</p>
					</div>
					<div className="flex flex-col gap-3 mt-8 w-full">
						<div className="flex items-center gap-2">
							<Lock size={20} className="text-success" />
							<span className="text-sm text-default-700">256-bit SSL Encryption</span>
						</div>
						<div className="flex items-center gap-2">
							<CheckCircle2 size={20} className="text-success" />
							<span className="text-sm text-default-700">
								2FA & biometric login supported
							</span>
						</div>
						<div className="flex items-center gap-2">
							<KeyRound size={20} className="text-success" />
							<span className="text-sm text-default-700">
								Private keys never leave your device
							</span>
						</div>
					</div>
					<div className="flex flex-col items-center mt-8">
						<span className="text-xs text-default-400 mt-2">
							Trusted by thousands of users
						</span>
					</div>
				</div>
				{/* Right: Sign Up Form & Stepper */}
				<div className="flex-1 flex flex-col justify-center p-8 bg-background">
					{step === 1 && (
						<>
							<CardHeader className="text-2xl font-bold text-center mb-2">
								Create your account
							</CardHeader>
							<CardBody>
								<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
									<div className="flex gap-2">
										<Input
											label="First Name"
											name="firstName"
											value={form.firstName}
											onChange={handleChange}
											autoComplete="given-name"
											required
											variant="bordered"
											className="flex-1"
										/>
										<Input
											label="Last Name"
											name="lastName"
											value={form.lastName}
											onChange={handleChange}
											autoComplete="family-name"
											required
											variant="bordered"
											className="flex-1"
										/>
									</div>
									<Input
										label="Email"
										type="email"
										name="email"
										value={form.email}
										onChange={handleChange}
										autoComplete="email"
										required
										variant="bordered"
									/>
									<Input
										label="Password"
										type="password"
										name="password"
										value={form.password}
										onChange={handleChange}
										autoComplete="new-password"
										required
										variant="bordered"
									/>
									<Button
										color="primary"
										type="submit"
										isLoading={loading}
										className="w-full mt-2"
										radius="full"
										startContent={<UserPlus size={18} />}>
										Sign Up
									</Button>
									{error && (
										<div className="flex items-center gap-2 text-red-600 text-sm">
											<AlertCircleIcon size={18} /> {error}
										</div>
									)}
									{success && (
										<div className="text-green-600 text-center">
											Account created!
										</div>
									)}
								</form>
							</CardBody>
							<CardFooter className="flex flex-col gap-2 items-center">
								<span className="text-xs text-default-500">
									Already have an account?{" "}
									<Link href="/auth/sign-in" color="primary">
										Sign in
									</Link>
								</span>
								<Chip color="primary" variant="flat" className="mt-2">
									Your information is always private & secure
								</Chip>
							</CardFooter>
						</>
					)}
					{step === 2 && userInfo && (
						<>
							<CardHeader className="text-2xl font-bold text-center mb-2">
								Step 2: Create your Lisk Account
							</CardHeader>
							<CardBody>
								<div className="flex flex-col gap-4 items-center">
									<p className="text-default-700 text-center">
										Your PayMe-Zar account is ready! Now, let's create your Lisk
										blockchain account to enable ZAR stablecoin payments.
									</p>
									<div className="w-full max-w-xs bg-default-50 border rounded-lg p-4 flex flex-col gap-2">
										<div>
											<span className="text-xs text-default-500">Email</span>
											<div className="font-mono text-sm">
												{userInfo.email}
											</div>
										</div>
										<div>
											<span className="text-xs text-default-500">
												First Name
											</span>
											<div className="font-mono text-sm">
												{userInfo.firstName}
											</div>
										</div>
										<div>
											<span className="text-xs text-default-500">
												Last Name
											</span>
											<div className="font-mono text-sm">
												{userInfo.lastName}
											</div>
										</div>
										<div>
											<span className="text-xs text-default-500">
												API Key
											</span>
											<div className="font-mono text-xs break-all">
												{userInfo.apiKey || (
													<span className="italic text-default-400">
														Not generated
													</span>
												)}
											</div>
										</div>
										{userInfo.apiKeyRow && (
											<div>
												<span className="text-xs text-default-500">
													API Key Status
												</span>
												<div className="font-mono text-xs">
													{userInfo.apiKeyRow.status}
												</div>
											</div>
										)}
										{userInfo.liskId && (
											<div>
												<span className="text-xs text-default-500">
													Lisk ID
												</span>
												<div className="font-mono text-xs">
													{userInfo.liskId}
												</div>
											</div>
										)}
									</div>
									<Button
										color="primary"
										radius="full"
										className="w-full max-w-xs mt-4"
										onPress={handleCreateLiskAccount}
										isLoading={liskLoading}
										disabled={!!userInfo.liskId}>
										{userInfo.liskId
											? "Lisk Account Created"
											: liskLoading
												? "Creating Lisk Account..."
												: `Create Lisk Account${autoCreateCountdown > 0 ? ` (${autoCreateCountdown})` : ""}`}
									</Button>
									<Link showAnchorIcon href="/auth/sign-in" color="primary">
										Sign in
									</Link>
									{liskError && (
										<div className="text-red-600 text-xs text-center">
											{liskError}
										</div>
									)}
									{liskUser && (
										<div className="text-green-600 text-xs text-center">
											Lisk account created! ID: {liskUser.id}
										</div>
									)}
									<p className="text-xs text-default-500 text-center mt-2">
										This step is required to receive and send ZAR stablecoin on
										the Lisk blockchain.
									</p>
								</div>
							</CardBody>
						</>
					)}
				</div>
			</Card>
		</div>
	);
}
