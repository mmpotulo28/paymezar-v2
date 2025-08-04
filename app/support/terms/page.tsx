"use client";
import { Card, CardHeader, CardBody } from "@heroui/react";

export default function TermsPage() {
	return (
		<div className="min-h-[80vh] flex flex-col items-center py-12 px-4">
			<Card className="w-full max-w-3xl">
				<CardHeader className="flex flex-col items-center gap-2">
					<h1 className="text-3xl font-bold text-center">Terms & Conditions</h1>
					<p className="text-default-500 text-center max-w-xl">
						These terms govern your use of PayMe-Zar. Please read them carefully.
					</p>
				</CardHeader>
				<CardBody className="flex flex-col gap-6 text-default-700 text-base">
					<section>
						<h2 className="font-semibold mb-2">1. Acceptance of Terms</h2>
						<p>
							By using PayMe-Zar, you agree to these terms and our privacy policy. If
							you do not agree, please do not use our services.
						</p>
					</section>
					<section>
						<h2 className="font-semibold mb-2">2. Eligibility</h2>
						<p>
							You must be at least 18 years old and reside in South Africa to use
							PayMe-Zar.
						</p>
					</section>
					<section>
						<h2 className="font-semibold mb-2">3. Account Security</h2>
						<p>
							You are responsible for maintaining the confidentiality of your account
							credentials and for all activities under your account.
						</p>
					</section>
					<section>
						<h2 className="font-semibold mb-2">4. Prohibited Activities</h2>
						<ul className="list-disc ml-6">
							<li>Illegal transactions or money laundering</li>
							<li>Fraudulent or abusive behavior</li>
							<li>Violating any applicable laws or regulations</li>
						</ul>
					</section>
					<section>
						<h2 className="font-semibold mb-2">5. Fees & Payments</h2>
						<p>
							All fees are clearly stated on our Pricing page. You are responsible for
							any applicable fees and taxes.
						</p>
					</section>
					<section>
						<h2 className="font-semibold mb-2">6. Termination</h2>
						<p>
							We reserve the right to suspend or terminate your account for violation
							of these terms or for suspicious activity.
						</p>
					</section>
					<section>
						<h2 className="font-semibold mb-2">7. Limitation of Liability</h2>
						<p>
							PayMe-Zar is not liable for any indirect, incidental, or consequential
							damages arising from your use of the service.
						</p>
					</section>
					<section>
						<h2 className="font-semibold mb-2">8. Changes to Terms</h2>
						<p>
							We may update these terms at any time. Continued use of PayMe-Zar after
							changes means you accept the new terms.
						</p>
					</section>
					<section>
						<h2 className="font-semibold mb-2">9. Contact</h2>
						<p>
							For questions about these terms, contact us at{" "}
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
