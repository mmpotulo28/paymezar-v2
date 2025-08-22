import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useOrganization, useUser } from "@clerk/nextjs";
import { iCoupon, iCouponCreateRequest, iCouponUpdateRequest, iCouponResponse } from "@/types";
import useCache from "./useCache";
const API_BASE = process.env.NEXT_PUBLIC_LISK_API_BASE as string;

export function useCoupons(mode: "user" | "organization" = "user") {
	const [coupons, setCoupons] = useState<iCoupon[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | undefined>(undefined);

	const { user } = useUser();
	const { organization } = useOrganization();
	const { getCache, setCache } = useCache();
	const [apiKey, setApiKey] = useState<string | undefined>(undefined);

	useEffect(() => {
		// Fetch API key from cookies
		const fetchApiKey = () => {
			const key = (
				mode === "user"
					? user?.unsafeMetadata.apiToken
					: organization?.publicMetadata.apiToken
			) as string;

			setApiKey(`Bearer ${key}`);
		};

		fetchApiKey();
	}, [user, organization, mode]);

	// Get all coupons
	const fetchCoupons = useCallback(async () => {
		setLoading(true);
		setError(undefined);
		const cacheKey = `coupons_${mode}`;
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
		} finally {
			setLoading(false);
		}
	}, [apiKey]);

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
			} finally {
				setLoading(false);
			}
		},
		[apiKey],
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
			} finally {
				setLoading(false);
			}
		},
		[apiKey],
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
			} finally {
				setLoading(false);
			}
		},
		[apiKey],
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
			} finally {
				setLoading(false);
			}
		},
		[apiKey],
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
