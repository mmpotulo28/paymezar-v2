"use client";
import { useState } from "react";
import { Card, CardBody, CardHeader, CardFooter, Chip } from "@heroui/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { AlertCircleIcon, ShieldCheck, Lock, CheckCircle2, LogIn, KeyRound } from "lucide-react";
import { postApi } from "@/lib/helpers";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionManager";

export default function SignInPage() {
	const [form, setForm] = useState({
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const router = useRouter();
	const { setUser } = useSession();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(false);

		try {
			const result = await postApi("/api/auth/sign-in", form);
			if (!result.error) {
				setUser(result.data.user);

				// delay for 3 seconds to show success message
				console.log("User signed in successfully", result.data.user);
				setSuccess(true);
				router.push("/account");
			} else {
				console.error("Sign in failed", result.message);
				setError(result.message || "Sign in failed");
				setSuccess(false);
			}
		} catch (err: any) {
			setSuccess(false);
			console.error("Sign in error", err);
			setError(err.message || "Sign in failed");
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
