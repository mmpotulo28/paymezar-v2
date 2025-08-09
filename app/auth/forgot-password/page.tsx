"use client";
import { useState } from "react";
import { Card, CardBody, CardHeader, CardFooter, Chip } from "@heroui/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { AlertCircleIcon, Lock, Mail } from "lucide-react";

import { supabaseClient } from "@/lib/db";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(null);

		try {
			const { error, data } = await supabaseClient.auth.resetPasswordForEmail(email, {
				redirectTo: `${window.location.origin}/auth/reset-password`,
			});

			if (error) {
				setError(error.message || "Failed to send reset email.");
			} else {
				console.log("Reset email sent:", data);
				setSuccess("Password reset email sent! Please check your inbox.");
			}
		} catch (err: any) {
			setError(err.message || "Failed to send reset email.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-[80vh]">
			<Card className="w-full max-w-md shadow-xl border border-default-200">
				<CardHeader className="text-2xl font-bold text-center mb-2">
					Reset your password
				</CardHeader>
				<CardBody>
					<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
						<Input
							required
							autoComplete="email"
							label="Email"
							name="email"
							startContent={<Mail size={18} />}
							type="email"
							value={email}
							variant="bordered"
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Button
							className="w-full mt-2"
							color="primary"
							isLoading={loading}
							radius="full"
							startContent={<Lock size={18} />}
							type="submit">
							Send Reset Link
						</Button>
						{error && (
							<div className="flex items-center gap-2 text-red-600 text-sm">
								<AlertCircleIcon size={18} /> {error}
							</div>
						)}
						{success && <div className="text-green-600 text-center">{success}</div>}
					</form>
				</CardBody>
				<CardFooter className="flex flex-col gap-2 items-center">
					<span className="text-xs text-default-500">
						Remembered your password?{" "}
						<Link color="primary" href="/auth/sign-in">
							Sign in
						</Link>
					</span>
					<Chip className="mt-2" color="primary" variant="flat">
						Your information is always private & secure
					</Chip>
				</CardFooter>
			</Card>
		</div>
	);
}
