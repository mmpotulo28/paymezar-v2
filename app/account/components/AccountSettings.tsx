import { Card, CardHeader, CardBody, CardFooter, Chip } from "@heroui/react";
import { Button } from "@heroui/button";
import { Sun, Moon, RefreshCcw, Link2, Shield } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

export function AccountSettings() {
	const { theme, setTheme } = useTheme();
	const [cacheCleared, setCacheCleared] = useState(false);
	const [socialConnected, setSocialConnected] = useState(false);
	const [gasEnabled, setGasEnabled] = useState(false);
	const [twoFAEnabled, setTwoFAEnabled] = useState(false);

	const handleClearCache = () => {
		setCacheCleared(true);
		setTimeout(() => setCacheCleared(false), 1500);
	};

	const handleConnectSocial = () => {
		setSocialConnected(true);
		setTimeout(() => setSocialConnected(false), 1500);
	};

	const handleEnableGas = () => {
		setGasEnabled(true);
		setTimeout(() => setGasEnabled(false), 1500);
	};

	const handleResetPassword = () => {
		alert("Password reset link sent to your email.");
	};

	const handleToggle2FA = () => {
		setTwoFAEnabled((v) => !v);
	};

	return (
		<Card className="w-full max-w-2xl shadow-lg border border-default-200">
			<CardHeader className="text-lg font-semibold">Account Settings</CardHeader>
			<CardBody className="flex flex-col gap-6">
				{/* Theme Toggle */}
				<div className="flex items-center justify-between gap-4">
					<div>
						<div className="text-xs text-default-500 font-medium mb-1">Theme</div>
						<div className="text-sm text-default-700">
							Switch between light and dark mode.
						</div>
					</div>
					<Button
						variant="flat"
						radius="full"
						color="secondary"
						onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
						startContent={theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}>
						{theme === "dark" ? "Light Mode" : "Dark Mode"}
					</Button>
				</div>
				{/* Cache Clearing */}
				<div className="flex items-center justify-between gap-4">
					<div>
						<div className="text-xs text-default-500 font-medium mb-1">Clear Cache</div>
						<div className="text-sm text-default-700">
							Remove local cache and refresh your session.
						</div>
					</div>
					<Button
						variant="flat"
						radius="full"
						color="warning"
						onClick={handleClearCache}
						startContent={<RefreshCcw size={18} />}>
						Clear Cache
					</Button>
					{cacheCleared && (
						<Chip color="success" size="sm" className="ml-2">
							Cleared!
						</Chip>
					)}
				</div>
				{/* Social Account Connection */}
				<div className="flex items-center justify-between gap-4">
					<div>
						<div className="text-xs text-default-500 font-medium mb-1">
							Connect Social Account
						</div>
						<div className="text-sm text-default-700">
							Link your Google or Twitter account for easier login.
						</div>
					</div>
					<Button
						variant="flat"
						radius="full"
						color="primary"
						onClick={handleConnectSocial}
						startContent={<Link2 size={18} />}>
						Connect
					</Button>
					{socialConnected && (
						<Chip color="success" size="sm" className="ml-2">
							Connected!
						</Chip>
					)}
				</div>
				{/* Enable Gas */}
				<div className="flex items-center justify-between gap-4">
					<div>
						<div className="text-xs text-default-500 font-medium mb-1">Enable gas</div>
						<div className="text-sm text-default-700">
							Allocates a predefined amount of gas to the user linked with your
							account.
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Button
							variant="flat"
							radius="full"
							color="success"
							onClick={handleEnableGas}>
							Enable gas
						</Button>
						{gasEnabled && (
							<Chip color="success" size="sm" className="ml-2">
								Gas allocated!
							</Chip>
						)}
					</div>
				</div>
			</CardBody>

			<CardFooter className="flex flex-col gap-4">
				<div className="flex items-center justify-between gap-4 border-t pt-4">
					<div>
						<div className="text-xs text-default-500 font-medium mb-1 flex items-center gap-1">
							<Shield size={14} /> Security
						</div>
						<div className="text-sm text-default-700">
							Manage your password and two-factor authentication.
						</div>
					</div>
					<div className="flex gap-2">
						<Button
							size="sm"
							variant="flat"
							color="primary"
							startContent={<Shield size={16} />}
							onClick={handleToggle2FA}>
							{twoFAEnabled ? "Disable 2FA" : "Enable 2FA"}
						</Button>
						<Button
							size="sm"
							variant="flat"
							color="secondary"
							onClick={handleResetPassword}>
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
