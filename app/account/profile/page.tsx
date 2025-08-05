"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Input, Button, Avatar, Chip } from "@heroui/react";
import { useSession } from "@/context/SessionManager";
import { UploadCloud, User, Mail, Phone } from "lucide-react";
import { postApi } from "@/lib/helpers";

export default function ProfilePage() {
	const { user, setSession } = useSession();
	const [form, setForm] = useState({
		firstName: user?.firstName || "",
		lastName: user?.lastName || "",
		email: user?.email || "",
		phone: "",
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
				email: user.email || "",
				phone: user.phone || "",
				imageUrl: user.imageUrl || "",
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

			// Use postApi for consistency
			const result = await postApi("/api/account/image-upload", formData, {}, "POST");
			if (result.error || !result.data?.url)
				throw new Error(result.message || "Failed to upload image");
			setForm((f) => ({ ...f, imageUrl: result.data.url }));
			setSuccess("Profile image uploaded!");
		} catch (err: any) {
			setError("Failed to upload image.");
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

			const result = await postApi(
				"/api/account/update-profile",
				{
					id: user.supabaseId || user.id,
					liskId: user.id,
					email: form.email,
					firstName: form.firstName,
					lastName: form.lastName,
					imageUrl: form.imageUrl,
					phone: form.phone,
				},
				{ "Content-Type": "application/json" },
				"PUT",
			);

			if (result.error) {
				throw new Error(result.message || "Failed to update profile.");
			}

			setSuccess("Profile updated successfully!");
			console.log("Profile update result:", result.data);
			// await refreshUser();
			setSession(result.data.user);
		} catch (err: any) {
			setError(err.message || "Failed to update profile.");
		}
		setLoading(false);
	};

	return (
		<div className="flex items-center justify-center min-h-[80vh]">
			<Card className="w-full max-w-lg shadow-xl border border-default-200">
				<CardHeader className="text-2xl font-bold text-center mb-2">
					Update Profile
				</CardHeader>
				<CardBody>
					<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
						<div className="flex flex-col items-center gap-2 mb-4">
							<Avatar
								src={form.imageUrl || undefined}
								size="lg"
								className="ring-2 ring-primary-400"
							/>
							<label className="flex items-center gap-2 cursor-pointer text-primary text-xs">
								<UploadCloud size={16} />
								<Input
									type="file"
									accept="image/*"
									className="hidden"
									onChange={handleImageChange}
									disabled={imageUploading}
								/>
								{imageUploading ? "Uploading..." : "Change Profile Image"}
							</label>
						</div>
						<div className="flex gap-2">
							<Input
								label="First Name"
								name="firstName"
								value={form.firstName}
								onChange={handleChange}
								autoComplete="given-name"
								required
								startContent={<User size={16} />}
							/>
							<Input
								label="Last Name"
								name="lastName"
								value={form.lastName}
								onChange={handleChange}
								autoComplete="family-name"
								required
								startContent={<User size={16} />}
							/>
						</div>
						<Input
							label="Email"
							type="email"
							name="email"
							value={form.email}
							onChange={handleChange}
							autoComplete="email"
							required
							startContent={<Mail size={16} />}
						/>
						<Input
							label="Phone Number"
							type="tel"
							name="phone"
							value={form.phone}
							onChange={handleChange}
							autoComplete="tel"
							startContent={<Phone size={16} />}
						/>
						<Button
							color="primary"
							type="submit"
							isLoading={loading}
							className="w-full mt-2"
							radius="full"
							startContent={<User size={18} />}>
							Update Profile
						</Button>
						{error && (
							<Chip color="danger" variant="flat" className="w-full justify-center">
								{error}
							</Chip>
						)}
						{success && (
							<Chip color="success" variant="flat" className="w-full justify-center">
								{success}
							</Chip>
						)}
					</form>
				</CardBody>
				<CardFooter className="flex flex-col gap-2 items-center">
					<Chip color="primary" variant="flat" className="mt-2">
						Your information is always private & secure
					</Chip>
				</CardFooter>
			</Card>
		</div>
	);
}
