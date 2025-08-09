"use client";
import { useEffect } from "react";
import { Card } from "@heroui/react";
import { ShieldCheck, Lock, CheckCircle2, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { SignUp, useUser } from "@clerk/nextjs";

export default function SignUpPage() {
	const router = useRouter();
	const { user } = useUser();

	// If already authenticated, redirect to account page
	useEffect(() => {
		if (user) {
			router.replace("/account");
		}
	}, [user, router]);

	return (
		<div className="flex items-center justify-center min-h-[80vh] ">
			<Card className="w-full max-w-4xl flex flex-col md:flex-row shadow-xl border border-default-200 overflow-hidden">
				{/* Left: Illustration & Security Info */}
				<div className="hidden md:flex flex-col justify-between items-center bg-gradient-to-br from-primary-100 to-primary-50 p-8 w-1/2 min-h-[500px]">
					<div className="flex flex-col items-center gap-4">
						<ShieldCheck className="text-primary mb-2" size={64} />
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
							<Lock className="text-success" size={20} />
							<span className="text-sm text-default-700">256-bit SSL Encryption</span>
						</div>
						<div className="flex items-center gap-2">
							<CheckCircle2 className="text-success" size={20} />
							<span className="text-sm text-default-700">
								2FA & biometric login supported
							</span>
						</div>
						<div className="flex items-center gap-2">
							<KeyRound className="text-success" size={20} />
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
					<SignUp oauthFlow="popup" />
				</div>
			</Card>
		</div>
	);
}
