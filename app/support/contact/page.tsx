"use client";
import React, { Suspense } from "react";

import { ContactForm } from "./components/contact-form";
import { ContactInfo } from "./components/contact-info";

export default function ContactPage() {
	const handleSubmit = async (formData: FormData) => {
		// Simulate API call
		return new Promise((resolve) => {
			setTimeout(() => {
				console.log("Form submitted:", Object.fromEntries(formData));
				resolve(true);
			}, 1000);
		});
	};

	return (
		<div className="min-h-screen p-4">
			<div className="mx-auto max-w-7xl">
				<div className="mb-12 text-center">
					<h1 className="mb-4 text-4xl font-bold">Contact Us</h1>
					<p className="text-default-500 mx-auto max-w-2xl">
						Have questions? We&apos;d love to hear from you. Send us a message and
						we&apos;ll respond as soon as possible.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
					<div className="order-2 md:order-1">
						<ContactInfo />
					</div>
					<div className="order-1 md:order-2">
						<Suspense fallback={<div>Loading form...</div>}>
							<ContactForm onSubmit={handleSubmit} />
						</Suspense>
					</div>
				</div>
			</div>
		</div>
	);
}
