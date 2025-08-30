"use client";
import { Card, CardHeader, CardBody, Button, Chip, Spinner } from "@heroui/react";
import { useAccount } from "@/context/AccountContext";
import CouponCard from "./CouponCard";
import { useEffect } from "react";
import { RefreshCcw } from "lucide-react";

export function CouponsList() {
	const {
		coupons,
		couponsLoading,
		couponsError,
		claimCouponMessage,
		deleteCouponMessage,
		fetchCoupons,
	} = useAccount();

	// fetch on mount
	useEffect(() => {
		fetchCoupons();
	}, [fetchCoupons]);

	return (
		<Card className="w-full max-w-2xl">
			<CardHeader className="flex items-center justify-between">
				<span className="text-xl font-bold">Your Coupons</span>
				<Button
					color="primary"
					isLoading={couponsLoading}
					size="sm"
					variant="flat"
					startContent={<RefreshCcw size={16} />}
					onPress={() => fetchCoupons(true)}>
					Refresh
				</Button>
			</CardHeader>
			<CardBody>
				{couponsLoading && <Spinner label="Loading coupons..." />}
				{couponsError && (
					<Chip color="danger" variant="flat">
						{couponsError}
					</Chip>
				)}
				{coupons.length === 0 && !couponsLoading && (
					<div className="text-default-400 text-center py-4">No coupons found.</div>
				)}
				<div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
					{coupons.map((coupon) => (
						<CouponCard key={coupon.id} coupon={coupon} />
					))}
					{claimCouponMessage && (
						<Chip color="success" variant="flat">
							{claimCouponMessage}
						</Chip>
					)}
					{deleteCouponMessage && (
						<Chip color="success" variant="flat">
							{deleteCouponMessage}
						</Chip>
					)}
				</div>
			</CardBody>
		</Card>
	);
}
