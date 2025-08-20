import { useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import {
	iCoupon,
	iCouponCreateRequest,
	iCouponUpdateRequest,
	iCouponClaimRequest,
	iCouponResponse,
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string;

export function useCoupons() {
	const { user } = useUser();
	const [coupons, setCoupons] = useState<iCoupon[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Get all coupons
	const fetchCoupons = async () => {
		setLoading(true);
		setError(null);
		try {
			const { data } = await axios.get<iCoupon[]>(`${API_BASE}/coupons`, {
				headers: { Authorization: (user?.unsafeMetadata.apiToken as string) || "" },
			});
			setCoupons(data);
		} catch (err: any) {
			setError("Failed to fetch coupons.");
		} finally {
			setLoading(false);
		}
	};

	// Create a new coupon for a user
	const createCoupon = async (userId: string, coupon: iCouponCreateRequest) => {
		setLoading(true);
		setError(null);
		try {
			const { data } = await axios.post<iCouponResponse>(
				`${API_BASE}/coupons/${encodeURIComponent(userId)}`,
				coupon,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: (user?.unsafeMetadata.apiToken as string) || "",
					},
				},
			);
			await fetchCoupons();
			return data;
		} catch (err: any) {
			setError("Failed to create coupon.");
		} finally {
			setLoading(false);
		}
	};

	// Claim a coupon for a user
	const claimCoupon = async (userId: string, couponId: string) => {
		setLoading(true);
		setError(null);
		try {
			const { data } = await axios.patch<iCouponResponse>(
				`${API_BASE}/coupons/claim/${encodeURIComponent(userId)}`,
				{ couponId },
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: (user?.unsafeMetadata.apiToken as string) || "",
					},
				},
			);
			await fetchCoupons();
			return data;
		} catch (err: any) {
			setError("Failed to claim coupon.");
		} finally {
			setLoading(false);
		}
	};

	// Update a coupon for a user
	const updateCoupon = async (userId: string, couponId: string, coupon: iCouponUpdateRequest) => {
		setLoading(true);
		setError(null);
		try {
			const { data } = await axios.put<iCouponResponse>(
				`${API_BASE}/coupons/${encodeURIComponent(userId)}/${encodeURIComponent(couponId)}`,
				coupon,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: (user?.unsafeMetadata.apiToken as string) || "",
					},
				},
			);
			await fetchCoupons();
			return data;
		} catch (err: any) {
			setError("Failed to update coupon.");
		} finally {
			setLoading(false);
		}
	};

	// Delete a coupon for a user
	const deleteCoupon = async (userId: string, couponId: string) => {
		setLoading(true);
		setError(null);
		try {
			await axios.delete(
				`${API_BASE}/coupons/${encodeURIComponent(userId)}/${encodeURIComponent(couponId)}`,
				{
					headers: {
						Authorization: (user?.unsafeMetadata.apiToken as string) || "",
					},
				},
			);
			await fetchCoupons();
		} catch (err: any) {
			setError("Failed to delete coupon.");
		} finally {
			setLoading(false);
		}
	};

	return {
		coupons,
		loading,
		error,
		fetchCoupons,
		createCoupon,
		claimCoupon,
		updateCoupon,
		deleteCoupon,
	};
}
