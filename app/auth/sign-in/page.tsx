"use client";
import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, CardFooter, Chip, Alert } from "@heroui/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { AlertCircleIcon, ShieldCheck, Lock, CheckCircle2, LogIn, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSignIn, useUser } from "@clerk/nextjs";

export default function SignInPage() {
	const [form, setForm] = useState({
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const router = useRouter();
	const { signIn } = useSignIn();
	const { user } = useUser();

	useEffect(() => {
		// If already authenticated, redirect to account page
		if (user) {
			router.replace("/account");
		}
	}, [user, router]);

	useEffect(() => {
		// Check for success messages from sign-up
		const params = new URLSearchParams(window.location.search);
		const messageParam = params.get("message");
		if (messageParam === "account-created") {
			setMessage("Account created successfully! Please sign in to continue.");
		} else if (messageParam === "email-verified") {
			setMessage("Email verified successfully! Please sign in to continue.");
		}
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(false);

		if (!form.email || !form.password) {
			setError("Email and password are required");
			setLoading(false);
			return;
		}

		if (!signIn) {
			setError("Sign in is not available");
			setLoading(false);
			return;
		}

		try {
			const result = await signIn.create({
				identifier: form.email,
				password: form.password,
			});

			if (result.status === "complete") {
				setSuccess(true);
				// Get redirect URL from query params
				const params = new URLSearchParams(window.location.search);
				const redirect = params.get("redirect");

				setTimeout(() => {
					if (redirect) {
						router.replace(decodeURIComponent(redirect));
					} else {
						router.replace("/account");
					}
				}, 500);
			} else if (result.status === "needs_second_factor") {
				setError("Two-factor authentication required. Please complete 2FA setup.");
			} else if (result.status === "needs_identifier") {
				setError("Please provide a valid email address.");
			} else if (result.status === "abandoned") {
				setError("Sign in session was abandoned. Please try again.");
			} else if (result.status === "needs_first_factor") {
				setError("Please complete the sign-in process.");
			} else {
				setError("Sign in failed. Please check your credentials and try again.");
			}
		} catch (err: any) {
			setSuccess(false);
			console.error("Sign in error", err);

			// Handle specific Clerk errors
			if (err.errors && Array.isArray(err.errors)) {
				const errorMessages = err.errors.map((error: any) => {
					if (error.code === "session_exists") {
						return "You are already signed in.";
					}
					if (error.code === "form_identifier_not_found") {
						return "No account found with this email address.";
					}
					if (error.code === "form_password_incorrect") {
						return "Incorrect password. Please try again.";
					}
					if (error.code === "too_many_requests") {
						return "Too many sign in attempts. Please wait before trying again.";
					}
					if (error.code === "user_locked") {
						return "Your account has been locked. Please contact support.";
					}
					return error.message || "Sign in failed.";
				});
				setError(errorMessages[0]);

				// If session exists, redirect to account page
				if (err.errors[0]?.code === "session_exists") {
					setTimeout(() => {
						router.push("/account");
					}, 2000);
				}
			} else {
				setError(err.message || "Sign in failed");
			}
		} finally {
			setLoading(false);
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
				{/* Right: Sign In Form */}
				<div className="flex-1 flex flex-col justify-center p-8 bg-background">
					<CardHeader className="text-2xl font-bold text-center mb-2">
						Sign in to your account
					</CardHeader>
					<CardBody>
						{message && (
							<Alert
								className="mb-4"
								color="success"
								variant="flat"
								title="Success!"
								description={message}
							/>
						)}
						<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
								autoComplete="current-password"
								required
								variant="bordered"
							/>
							<Button
								color="primary"
								type="submit"
								isLoading={loading}
								className="w-full mt-2"
								radius="full"
								startContent={<LogIn size={18} />}>
								Sign In
							</Button>
							{error && (
								<div className="flex items-center gap-2 text-red-600 text-sm">
									<AlertCircleIcon size={18} /> {error}
								</div>
							)}
							{success && (
								<div className="text-green-600 text-center">Welcome back!</div>
							)}
						</form>
						<div className="flex justify-end mt-2">
							<Link href="/auth/forgot-password" color="primary" className="text-xs">
								Forgot password?
							</Link>
						</div>
					</CardBody>
					<CardFooter className="flex flex-col gap-2 items-center">
						<span className="text-xs text-default-500">
							Don't have an account?{" "}
							<Link href="/auth/sign-up" color="primary">
								Sign up
							</Link>
						</span>
						<Chip color="primary" variant="flat" className="mt-2">
							Your information is always private & secure
						</Chip>
					</CardFooter>
				</div>
			</Card>
		</div>
	);
}
