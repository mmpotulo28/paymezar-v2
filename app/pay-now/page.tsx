// "use client";
import { Suspense } from "react";
import { UserProfileCard } from "@/components/user-profile-card";
import PayTabs from "./pay-tabs";

export default function PayNowPage() {
	return (
		<section className="flex flex-col items-center justify-start min-h-[70vh] py-8 gap-8 w-full h-full">
			<Suspense fallback={<div>Loading user profile...</div>}>
				<UserProfileCard className="max-w-2xl" />
			</Suspense>

			{/* Payment Tabs */}
			<Suspense fallback={<div>Loading payment tabs...</div>}>
				<PayTabs />
			</Suspense>
		</section>
	);
}
