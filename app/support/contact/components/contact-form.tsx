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
			console.error(err);
		}
	};

	return (
		<div className="w-full">
			{submitted && (
				<Alert
					className="mb-4"
					color="success"
					description="Thank you for your message. We'll get back to you soon."
					title="Message Sent!"
				/>
			)}
			{error && <Alert className="mb-4" color="danger" description={error} title="Error" />}
			<Form
				className="flex flex-col gap-4"
				validationBehavior="native"
				onSubmit={handleSubmit}>
				<Input
					isRequired
					label="Name"
					name="name"
					placeholder="Enter your name"
					variant="bordered"
				/>
				<Input
					isRequired
					label="Email"
					name="email"
					placeholder="Enter your email"
					type="email"
					variant="bordered"
				/>
				<Input
					label="Phone"
					name="phone"
					placeholder="Enter your phone number"
					type="tel"
					variant="bordered"
				/>
				<Textarea
					isRequired
					label="Message"
					minRows={4}
					name="message"
					placeholder="How can we help you?"
					variant="bordered"
				/>
				<Button color="primary" size="lg" type="submit">
					Send Message
				</Button>
			</Form>
		</div>
	);
}
