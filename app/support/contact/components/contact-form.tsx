"use	client";
import { Alert, Button, Form, Input, Textarea } from "@heroui/react";
import React from "react";

interface ContactFormProps {
	onSubmit: (data: FormData) => void;
}

export function ContactForm({ onSubmit }: ContactFormProps) {
	const [submitted, setSubmitted] = React.useState(false);
	const [error, setError] = React.useState("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		try {
			await onSubmit(formData);
			setSubmitted(true);
			setError("");
			(e.target as HTMLFormElement).reset();
		} catch (err) {
			setError("Failed to send message. Please try again.");
		}
	};

	return (
		<div className="w-full">
			{submitted && (
				<Alert
					className="mb-4"
					color="success"
					title="Message Sent!"
					description="Thank you for your message. We'll get back to you soon."
				/>
			)}
			{error && <Alert className="mb-4" color="danger" title="Error" description={error} />}
			<Form
				className="flex flex-col gap-4"
				validationBehavior="native"
				onSubmit={handleSubmit}>
				<Input
					isRequired
					label="Name"
					placeholder="Enter your name"
					name="name"
					variant="bordered"
				/>
				<Input
					isRequired
					type="email"
					label="Email"
					placeholder="Enter your email"
					name="email"
					variant="bordered"
				/>
				<Input
					label="Phone"
					placeholder="Enter your phone number"
					name="phone"
					type="tel"
					variant="bordered"
				/>
				<Textarea
					isRequired
					label="Message"
					placeholder="How can we help you?"
					name="message"
					variant="bordered"
					minRows={4}
				/>
				<Button type="submit" color="primary" size="lg">
					Send Message
				</Button>
			</Form>
		</div>
	);
}
