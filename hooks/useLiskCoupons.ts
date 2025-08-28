import { useCallback, useState } from "react";
import axios from "axios";
import { iCoupon, iCouponCreateRequest, iCouponUpdateRequest, iCouponResponse } from "@/types";
import { useCache } from "./useCache";
const API_BASE = process.env.NEXT_PUBLIC_LISK_API_BASE as string;

export function useCoupons({ apiKey }: { apiKey?: string }) {
	const { getCache, setCache } = useCache();

	const [coupons, setCoupons] = useState<iCoupon[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | undefined>(undefined);

	// Get all coupons
	const fetchCoupons = useCallback(async () => {
		setLoading(true);
		setError(undefined);
		const cacheKey = `coupons`;
		try {
			const cached = getCache(cacheKey);
			if (cached) {
				setCoupons(cached);
				setLoading(false);
				return;
			}

			const { data } = await axios.get<iCoupon[]>(`${API_BASE}/coupons`, {
				headers: { Authorization: apiKey },
			});
			setCoupons(data);
			setCache(cacheKey, data);
		} catch (err: any) {
			setError("Failed to fetch coupons.");
			console.error(err);
		} finally {
			setLoading(false);
		}
	}, [apiKey, getCache, setCache]);

	// Create a new coupon for a user
	const createCoupon = useCallback(
		async (userId: string, coupon: iCouponCreateRequest) => {
			setLoading(true);
			setError(undefined);
			try {
				const { data } = await axios.post<iCouponResponse>(
					`${API_BASE}/coupons/${encodeURIComponent(userId)}`,
					coupon,
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: apiKey,
						},
					},
				);
				await fetchCoupons();
				return data;
			} catch (err: any) {
				setError("Failed to create coupon.");
				console.error(err);
			} finally {
				setLoading(false);
			}
		},
		[apiKey, fetchCoupons],
	);

	// Claim a coupon for a user
	const claimCoupon = useCallback(
		async (userId: string, couponId: string) => {
			setLoading(true);
			setError(undefined);
			try {
				const { data } = await axios.patch<iCouponResponse>(
					`${API_BASE}/coupons/claim/${encodeURIComponent(userId)}`,
					{ couponId },
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: apiKey,
						},
					},
				);
				await fetchCoupons();
				return data;
			} catch (err: any) {
				setError("Failed to claim coupon.");
				console.error(err);
			} finally {
				setLoading(false);
			}
		},
		[apiKey, fetchCoupons],
	);

	// Update a coupon for a user
	const updateCoupon = useCallback(
		async (userId: string, couponId: string, coupon: iCouponUpdateRequest) => {
			setLoading(true);
			setError(undefined);
			try {
				const { data } = await axios.put<iCouponResponse>(
					`${API_BASE}/coupons/${encodeURIComponent(userId)}/${encodeURIComponent(couponId)}`,
					coupon,
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: apiKey,
						},
					},
				);
				await fetchCoupons();
				return data;
			} catch (err: any) {
				setError("Failed to update coupon.");
				console.error(err);
			} finally {
				setLoading(false);
			}
		},
		[apiKey, fetchCoupons],
	);

	// Delete a coupon for a user
	const deleteCoupon = useCallback(
		async (userId: string, couponId: string) => {
			setLoading(true);
			setError(undefined);
			try {
				await axios.delete(
					`${API_BASE}/coupons/${encodeURIComponent(userId)}/${encodeURIComponent(couponId)}`,
					{
						headers: {
							Authorization: apiKey,
						},
					},
				);
				await fetchCoupons();
			} catch (err: any) {
				setError("Failed to delete coupon.");
				console.error(err);
			} finally {
				setLoading(false);
			}
		},
		[apiKey, fetchCoupons],
	);

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
