"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Input, Button, Avatar, Chip } from "@heroui/react";
import { UploadCloud, User, Mail, Phone } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Head from "next/head";

import UnAuthorizedContent from "@/components/UnAuthorizedContent";
import { siteConfig } from "@/config/site";
import axios from "axios";

export default function ProfilePage() {
	const { user } = useUser();
	const [form, setForm] = useState({
		firstName: user?.firstName || "",
		lastName: user?.lastName || "",
		email: user?.primaryEmailAddress?.emailAddress || "",
		phone: user?.primaryPhoneNumber?.phoneNumber || "",
		imageUrl: user?.imageUrl || "",
	});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [imageUploading, setImageUploading] = useState(false);

	useEffect(() => {
		if (user) {
			setForm({
				firstName: user.firstName || "",
				lastName: user.lastName || "",
				email: user?.primaryEmailAddress?.emailAddress || "",
				phone: user?.primaryPhoneNumber?.phoneNumber || "",
				imageUrl: user?.imageUrl || "",
			});
		}
	}, [user]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if (!file || !user?.id) return;
		setImageUploading(true);
		setError(null);
		setSuccess(null);
		try {
			const formData = new FormData();

			formData.append("file", file);
			formData.append("userId", user.id);

			const result = await axios.post("/api/account/image-upload", formData);

			if (result.status !== 200 && result.status !== 201)
				throw new Error(result.data?.message || "Failed to upload image");
			setForm((f) => ({ ...f, imageUrl: result.data.url }));
			setSuccess("Profile image uploaded!");
		} catch (err: any) {
			setError("Failed to upload image.");
			console.error(err);
		}
		setImageUploading(false);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(null);

		try {
			if (!user?.id) throw new Error("User not found.");

			const result = await axios.put(
				"/api/account/update-profile",
				{
					id: user.id,
					liskId: user.id,
					email: form.email,
					firstName: form.firstName,
					lastName: form.lastName,
					imageUrl: form.imageUrl,
					phone: form.phone,
				},
				{ headers: { "Content-Type": "application/json" } },
			);

			if (result.status !== 200 && result.status !== 201) {
				throw new Error(result.data?.message || "Failed to update profile.");
			}

			setSuccess("Profile updated successfully!");
			console.log("Profile update result:", result.data);
			// await refreshUser();
		} catch (err: any) {
			setError(err.message || "Failed to update profile.");
		}
		setLoading(false);
	};

	return (
		<>
			<Head>
				<title>Update Profile - {siteConfig.metadata.title.default}</title>
			</Head>
			<div className="flex items-center justify-center min-h-[80vh]">
				{!user && <UnAuthorizedContent />}
				{user && (
					<Card className="w-full max-w-lg shadow-xl border border-default-200">
						<CardHeader className="text-2xl font-bold text-center mb-2">
							Update Profile
						</CardHeader>
						<CardBody>
							<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
								<div className="flex flex-col items-center gap-2 mb-4">
									<Avatar
										className="ring-2 ring-primary-400"
										size="lg"
										src={form.imageUrl || undefined}
									/>
									<label className="flex items-center gap-2 cursor-pointer text-primary text-xs">
										<UploadCloud size={16} />
										<Input
											accept="image/*"
											className="hidden"
											disabled={imageUploading}
											type="file"
											onChange={handleImageChange}
										/>
										{imageUploading ? "Uploading..." : "Change Profile Image"}
									</label>
								</div>
								<div className="flex gap-2">
									<Input
										required
										autoComplete="given-name"
										label="First Name"
										name="firstName"
										startContent={<User size={16} />}
										value={form.firstName}
										onChange={handleChange}
									/>
									<Input
										required
										autoComplete="family-name"
										label="Last Name"
										name="lastName"
										startContent={<User size={16} />}
										value={form.lastName}
										onChange={handleChange}
									/>
								</div>
								<Input
									required
									autoComplete="email"
									label="Email"
									name="email"
									startContent={<Mail size={16} />}
									type="email"
									value={form.email}
									onChange={handleChange}
								/>
								<Input
									autoComplete="tel"
									label="Phone Number"
									name="phone"
									startContent={<Phone size={16} />}
									type="tel"
									value={form.phone}
									onChange={handleChange}
								/>
								<Button
									className="w-full mt-2"
									color="primary"
									isLoading={loading}
									radius="full"
									startContent={<User size={18} />}
									type="submit">
									Update Profile
								</Button>
								{error && (
									<Chip
										className="w-full justify-center"
										color="danger"
										variant="flat">
										{error}
									</Chip>
								)}
								{success && (
									<Chip
										className="w-full justify-center"
										color="success"
										variant="flat">
										{success}
									</Chip>
								)}
							</form>
						</CardBody>
						<CardFooter className="flex flex-col gap-2 items-center">
							<Chip className="mt-2" color="primary" variant="flat">
								Your information is always private & secure
							</Chip>
						</CardFooter>
					</Card>
				)}
			</div>
		</>
	);
}
