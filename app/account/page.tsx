// "use client";
import { UserProfileCard } from "@/components/user-profile-card";
import { Suspense } from "react";
import AccountTabs from "./account-tabs";

export default function AccountPage() {
	return (
		<section className="flex flex-col items-center min-h-[70vh] py-8 gap-8 w-full">
			{/* User Profile */}
			<Suspense fallback={<div>Loading profile card...</div>}>
				<UserProfileCard className="max-w-2xl w-full" />
			</Suspense>

			{/* Account Management Tabs */}
			<Suspense fallback={<div>Loading account tabs...</div>}>
				<AccountTabs />
			</Suspense>
		</section>
	);
}
