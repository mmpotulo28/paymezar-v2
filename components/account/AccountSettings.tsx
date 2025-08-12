import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Chip,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "@heroui/react";
import { Button } from "@heroui/button";
import { Sun, Moon, RefreshCcw, Link2, Shield } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useState } from "react";

export function AccountSettings() {
	const {
		theme,
		toggleTheme,
		cacheCleared,
		clearCache,
		socialConnected,
		connectSocial,
		gasEnabled,
		enableGas,
		gasError,
		twoFAEnabled,
		toggle2FA,
		resetPassword,
	} = useSettings();

	const [gasModalOpen, setGasModalOpen] = useState(false);
	const [gasLoading, setGasLoading] = useState(false);

	const handleEnableGas = async () => {
		setGasLoading(true);
		await enableGas();
		setGasLoading(false);
	};

	return (
		<Card className="w-full max-w-2xl mx-auto shadow-xl border border-default-200 bg-background rounded-xl p-2 sm:p-6">
			<CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 pb-2">
				<span className="text-xl font-bold tracking-tight text-default-900">
					Account Settings
				</span>
				<Chip
					color="primary"
					variant="flat"
					size="sm"
					className="self-start sm:self-center">
					Secure
				</Chip>
			</CardHeader>
			<CardBody className="flex flex-col gap-6">
				{/* Theme Toggle */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 p-4 rounded-lg bg-default-100">
					<div>
						<div className="text-xs text-default-500 font-medium mb-1">Theme</div>
						<div className="text-sm text-default-700">
							Switch between light and dark mode.
						</div>
					</div>
					<Button
						color="secondary"
						radius="full"
						startContent={theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
						variant="flat"
						onClick={toggleTheme}
						className="w-full sm:w-auto mt-2 sm:mt-0">
						{theme === "dark" ? "Light Mode" : "Dark Mode"}
					</Button>
				</div>
				{/* Cache Clearing */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 p-4 rounded-lg bg-default-100">
					<div>
						<div className="text-xs text-default-500 font-medium mb-1">Clear Cache</div>
						<div className="text-sm text-default-700">
							Remove local cache and refresh your session.
						</div>
					</div>
					<div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
						<Button
							color="warning"
							radius="full"
							startContent={<RefreshCcw size={18} />}
							variant="flat"
							onClick={clearCache}
							className="w-full sm:w-auto">
							Clear Cache
						</Button>
						{cacheCleared && (
							<Chip color="success" size="sm">
								Cleared!
							</Chip>
						)}
					</div>
				</div>
				{/* Social Account Connection */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 p-4 rounded-lg bg-default-100">
					<div>
						<div className="text-xs text-default-500 font-medium mb-1">
							Connect Social Account
						</div>
						<div className="text-sm text-default-700">
							Link your Google or Twitter account for easier login.
						</div>
					</div>
					<div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
						<Button
							color="primary"
							radius="full"
							startContent={<Link2 size={18} />}
							variant="flat"
							onClick={() => connectSocial("google")}
							className="w-full sm:w-auto">
							Connect
						</Button>
						{socialConnected && (
							<Chip color="success" size="sm">
								Connected!
							</Chip>
						)}
					</div>
				</div>
				{/* Enable Gas */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 p-4 rounded-lg bg-default-100">
					<div>
						<div className="text-xs text-default-500 font-medium mb-1">Enable Gas</div>
						<div className="text-sm text-default-700">
							Allocates a predefined amount of gas to the user linked with your
							account.
						</div>
					</div>
					<div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
						<Button
							color="success"
							radius="full"
							variant="flat"
							onClick={() => setGasModalOpen(true)}
							className="w-full sm:w-auto">
							Enable Gas
						</Button>
					</div>
				</div>
				{/* Gas Modal */}
				<Modal
					isOpen={gasModalOpen}
					size="sm"
					onClose={() => setGasModalOpen(false)}
					className="rounded-2xl shadow-2xl border border-default-200 bg-background">
					<ModalContent>
						{(onClose) => (
							<>
								<ModalHeader className="flex flex-col items-center gap-2 border-b pb-2">
									<span className="font-bold text-lg text-primary">
										Enable Gas Payment
									</span>
									<span className="text-xs text-default-500 text-center">
										Allocate blockchain gas for your account to enable payments.
									</span>
								</ModalHeader>
								<ModalBody className="flex flex-col gap-4 items-center py-6">
									{gasLoading && (
										<Chip
											color="primary"
											size="sm"
											className="w-full justify-center">
											Enabling gas...
										</Chip>
									)}
									{gasEnabled && (
										<Chip
											color="success"
											size="md"
											className="w-full justify-center">
											Gas allocated successfully!
										</Chip>
									)}
									{gasError && (
										<div className="w-full bg-red-50 border border-red-200 rounded-lg p-3 max-h-32 overflow-auto text-xs text-red-700 font-mono whitespace-pre-wrap break-words">
											<strong className="block mb-1 text-red-600">
												Error:
											</strong>
											{gasError}
										</div>
									)}
									{!gasLoading && !gasEnabled && !gasError && (
										<div className="text-default-600 text-sm text-center">
											Click below to enable gas payment for your account.
										</div>
									)}
								</ModalBody>
								<ModalFooter className="flex flex-col gap-2 border-t pt-4">
									{!gasEnabled && (
										<Button
											color="success"
											isLoading={gasLoading}
											onPress={handleEnableGas}
											className="w-full rounded-full font-semibold"
											disabled={gasLoading}>
											Enable Gas
										</Button>
									)}
									<Button
										color="secondary"
										variant="flat"
										onPress={onClose}
										className="w-full rounded-full">
										Close
									</Button>
								</ModalFooter>
							</>
						)}
					</ModalContent>
				</Modal>
			</CardBody>
			<CardFooter className="flex flex-col gap-4">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 border-t pt-4">
					<div>
						<div className="text-xs text-default-500 font-medium mb-1 flex items-center gap-1">
							<Shield size={14} /> Security
						</div>
						<div className="text-sm text-default-700">
							Manage your password and two-factor authentication.
						</div>
					</div>
					<div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
						<Button
							color="primary"
							size="sm"
							startContent={<Shield size={16} />}
							variant="flat"
							onClick={toggle2FA}
							className="w-full sm:w-auto">
							{twoFAEnabled ? "Disable 2FA" : "Enable 2FA"}
						</Button>
						<Button
							color="secondary"
							size="sm"
							variant="flat"
							onClick={resetPassword}
							className="w-full sm:w-auto">
							Reset Password
						</Button>
					</div>
				</div>
				{twoFAEnabled && (
					<div className="text-xs text-success-700 mt-2">
						Two-factor authentication is enabled for your account.
					</div>
				)}
			</CardFooter>
		</Card>
	);
}
