"use client";
import React, { useEffect, useState } from "react";
import {
	Card,
	CardHeader,
	CardBody,
	Button,
	Input,
	Select,
	SelectItem,
	Switch,
	Divider,
	Chip,
	Tooltip,
	Spinner,
} from "@heroui/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { PricingTable, useUser } from "@clerk/nextjs";
import jsonPackage from "@/package.json";
import {
	Bell,
	Database,
	Info,
	LogOut,
	MoonStar,
	Save,
	Server,
	Settings,
	Trash,
} from "lucide-react";

export default function SettingsPage() {
	const { theme, setTheme } = useTheme();
	const { user } = useUser();
	const [apiBase, setApiBase] = useState(process.env.NEXT_PUBLIC_API_BASE || "");
	const [apiToken, setApiToken] = useState<string>("");
	const [saving, setSaving] = useState(false);
	const [saveMsg, setSaveMsg] = useState<string | null>(null);
	const [clearMsg, setClearMsg] = useState<string | null>(null);
	const [logoutMsg, setLogoutMsg] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		if (user) {
			setApiToken((user.unsafeMetadata.apiToken as string) || "");
			setApiBase((process.env.NEXT_PUBLIC_LISK_API_BASE as string) || "");
		}
	}, [user]);

	const handleThemeChange = (val: string) => setTheme(val);

	const handleSaveEnv = async () => {
		setSaving(true);
		setSaveMsg(null);

		try {
			await user?.update({
				unsafeMetadata: {
					apiToken,
					onboarded: true,
				},
			});

			setSaveMsg("Settings saved! (Note: Environment changes require a restart)");
		} catch (error) {
			setSaveMsg("Failed to save onboarding info.");
		} finally {
			setTimeout(() => {
				setSaving(false);
				setSaveMsg(null);
			}, 1200);
		}
	};

	const handleClearLocalStorage = () => {
		// Remove any tokens/cookies if needed
		if (typeof window !== "undefined") {
			localStorage.clear();
			document.cookie = ""; // Clear cookies if needed
			sessionStorage.clear(); // Clear session storage
		}
		setClearMsg("Local storage cleared!");
		setTimeout(() => setClearMsg(null), 1500);
	};

	const handleLogout = () => {
		setLogoutMsg("You have been logged out.");
		if (typeof window !== "undefined") {
			localStorage.clear();
			document.cookie = ""; // Clear cookies if needed
			sessionStorage.clear(); // Clear session storage
		}
		setTimeout(() => {
			setLogoutMsg(null);
			router.push("/"); // Redirect to home or login
		}, 1200);
	};

	return (
		<div className="flex-1 overflow-auto lg:px-6 py-6 space-y-8">
			<h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
				<Settings />
				Settings
			</h1>

			<Card className="max-w-2xl mx-auto mb-8">
				<CardHeader>
					<div className="flex items-center gap-2">
						<MoonStar />
						<span className="font-semibold">Appearance</span>
					</div>
				</CardHeader>
				<CardBody>
					<div className="flex gap-4 items-center">
						<Select
							size="sm"
							label="Theme"
							value={theme}
							onChange={(e) => handleThemeChange(e.target.value)}
							className="max-w-xs">
							<SelectItem key="light">Light</SelectItem>
							<SelectItem key="dark">Dark</SelectItem>
							<SelectItem key="system">System</SelectItem>
						</Select>
						<Chip color="primary" variant="flat">
							Current: {theme}
						</Chip>
					</div>
				</CardBody>
			</Card>

			{/* <Card className="max-w-2xl mx-auto mb-8 shadow bg-background">
				<PricingTable forOrganizations />
			</Card> */}

			<Card className="max-w-2xl mx-auto mb-8">
				<CardHeader>
					<div className="flex items-center gap-2">
						<Server />
						<span className="font-semibold">API Configuration</span>
						<Tooltip content="These values are loaded from .env.local">
							<Info />
						</Tooltip>
					</div>
				</CardHeader>
				<CardBody>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleSaveEnv();
						}}
						className="space-y-4">
						<Input
							label="API Base URL"
							value={apiBase}
							onChange={(e) => setApiBase(e.target.value)}
							placeholder="https://your-api-base-url/api/v1"
							isRequired
							disabled
						/>
						<Input
							label="API Key"
							value={apiToken}
							onChange={(e) => setApiToken(e.target.value)}
							placeholder="Bearer ..."
							isRequired
							type="password"
						/>

						<Button
							color="primary"
							type="submit"
							isLoading={saving}
							isDisabled={true}
							startContent={<Save />}>
							{saving ? <Spinner size="sm" /> : "Save"}
						</Button>
						{saveMsg && <div className="text-success mt-2">{saveMsg}</div>}
					</form>
				</CardBody>
			</Card>

			<Card className="max-w-2xl mx-auto mb-8">
				<CardHeader>
					<div className="flex items-center gap-2">
						<Bell className="text-xl" />
						<span className="font-semibold">Notifications</span>
					</div>
				</CardHeader>
				<CardBody>
					<div className="flex gap-4 mg:items-center flex-col md:flex-row">
						<Switch defaultSelected>Enable desktop notifications</Switch>
						<Switch>Enable email notifications</Switch>
					</div>
					<div className="text-default-400 text-xs mt-2">
						Notification preferences are stored locally.
					</div>
				</CardBody>
			</Card>
			<Card className="max-w-2xl mx-auto mb-8">
				<CardHeader>
					<div className="flex items-center gap-2">
						<Database />
						<span className="font-semibold">Storage & Session</span>
					</div>
				</CardHeader>
				<CardBody>
					<div className="flex gap-4 items-center">
						<Button
							color="danger"
							variant="bordered"
							onPress={handleClearLocalStorage}
							startContent={<Trash />}>
							Clear Local Storage
						</Button>
						{clearMsg && <div className="text-success">{clearMsg}</div>}
						<Button
							color="danger"
							variant="bordered"
							onPress={handleLogout}
							startContent={<LogOut />}>
							Log Out
						</Button>
						{logoutMsg && <div className="text-success">{logoutMsg}</div>}
					</div>
					<div className="text-default-400 text-xs mt-2">
						Clearing local storage will remove cached data. Logging out will end your
						session.
					</div>
				</CardBody>
			</Card>

			<Card className="max-w-2xl mx-auto mb-8">
				<CardHeader>
					<div className="flex items-center gap-2">
						<Info className="text-xl" />
						<span className="font-semibold">About</span>
					</div>
				</CardHeader>
				<CardBody>
					<div className="space-y-2">
						<div>
							<b>Stable Coin Dashboard</b> &copy; 2024
						</div>
						<div>
							Version:{" "}
							<Chip color="default" variant="flat">
								v{jsonPackage.version}
							</Chip>
						</div>
						<div>
							For help, see{" "}
							<a href="/docs" className="text-primary underline">
								Documentation
							</a>
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
