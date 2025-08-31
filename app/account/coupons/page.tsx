"use client";
import { CouponsList } from "@/components/account/CouponsList";

export default function AccountCouponsPage() {
	return (
		<section className="flex flex-col items-center min-h-[70vh] py-8 gap-8 w-full">
			<CouponsList showAll />
		</section>
	);
}
