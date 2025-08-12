"use client";
import { AccountSettings } from "@/components/account/AccountSettings";
import { SettingsProvider } from "@/context/SettingsContext";

export default function SettingsPage() {
	return (
		<section className="flex flex-col items-center min-h-[70vh] py-8 gap-8 w-full">
			<SettingsProvider>
				<AccountSettings />
			</SettingsProvider>
		</section>
	);
}
