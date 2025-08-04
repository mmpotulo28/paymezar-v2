"use client";
import { Card, CardHeader, CardBody } from "@heroui/react";

export default function PrivacyPage() {
	return (
		<div className="min-h-[80vh] flex flex-col items-center py-12 px-4">
			<Card className="w-full max-w-3xl">
				<CardHeader className="flex flex-col items-center gap-2">
					<h1 className="text-3xl font-bold text-center">Privacy Policy</h1>
					<p className="text-default-500 text-center max-w-xl">
						Your privacy is important to us. This policy explains how PayMe-Zar
						collects, uses, and protects your information.
					</p>
				</CardHeader>
				<CardBody className="flex flex-col gap-6 text-default-700 text-base">
					<section>
						<h2 className="font-semibold mb-2">1. Information We Collect</h2>
						<ul className="list-disc ml-6">
							<li>Your name, email address, and contact details</li>
							<li>Bank account and payment information</li>
							<li>Usage data and device information</li>
						</ul>
					</section>
					<section>
						<h2 className="font-semibold mb-2">2. How We Use Your Information</h2>
						<ul className="list-disc ml-6">
							<li>To provide and improve our services</li>
							<li>To process payments and transactions</li>
							<li>To communicate with you about your account</li>
							<li>To comply with legal obligations</li>
						</ul>
					</section>
					<section>
						<h2 className="font-semibold mb-2">3. Data Security</h2>
						<p>
							We use bank-grade encryption and security best practices to protect your
							data. Access is restricted to authorized personnel only.
						</p>
					</section>
					<section>
						<h2 className="font-semibold mb-2">4. Sharing of Information</h2>
						<p>
							We do not sell or share your personal information with third parties
							except as required by law or to provide our services (e.g., payment
							processors).
						</p>
					</section>
					<section>
						<h2 className="font-semibold mb-2">5. Your Rights</h2>
						<p>
							You may access, update, or delete your personal information at any time
							by contacting support or using your account dashboard.
						</p>
					</section>
					<section>
						<h2 className="font-semibold mb-2">6. Changes to This Policy</h2>
						<p>
							We may update this policy from time to time. We will notify you of any
							significant changes via email or our website.
						</p>
					</section>
					<section>
						<h2 className="font-semibold mb-2">7. Contact Us</h2>
						<p>
							If you have any questions about this Privacy Policy, please contact us
							at{" "}
							<a
								href="mailto:support@paymezar.com"
								className="text-primary underline">
								support@paymezar.com
							</a>
							.
						</p>
					</section>
				</CardBody>
			</Card>
		</div>
	);
}
