import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { iStaffMember, iStaffAssignResponse, iStaffRemoveResponse } from "../types"; // changed from "@/types"
import { useCache } from "../hooks/useCache";
const API_BASE = process.env.NEXT_PUBLIC_LISK_API_BASE as string;

export interface iUseLiskStaff {
	staff: iStaffMember[];
	staffLoading: boolean;
	staffError: string | undefined;
	actionMsg: string | undefined;
	fetchStaff: (merchantId: string) => Promise<iStaffMember[]>;
	assignStaff: (merchantId: string, input: string) => Promise<iStaffAssignResponse | undefined>;
	removeStaff: (merchantId: string, staffId: string) => Promise<iStaffRemoveResponse | undefined>;
	setActionMsg: (msg: string | undefined) => void;
}

export function useLiskStaff({ apiKey }: { apiKey?: string }): iUseLiskStaff {
	const [staff, setStaff] = useState<iStaffMember[]>([]);
	const [staffLoading, setStaffLoading] = useState(false);
	const [staffError, setStaffError] = useState<string | undefined>(undefined);
	const [actionMsg, setActionMsg] = useState<string | undefined>(undefined);

	const { getCache, setCache } = useCache();

	// reset all messages and errors after 3 seconds
	useEffect(() => {
		const timer = setTimeout(() => {
			setStaffError(undefined);
			setActionMsg(undefined);
		}, 3000);

		return () => clearTimeout(timer);
	}, [staffError, actionMsg]);

	const fetchStaff = useCallback(
		async (merchantId: string) => {
			setStaffLoading(true);
			setStaffError(undefined);
			const cacheKey = `staff_list_${merchantId}`;
			try {
				const cached = getCache(cacheKey);
				if (cached) {
					setStaff(cached);
					setStaffLoading(false);
					return cached;
				}

				const { data } = await axios.get<iStaffMember[]>(
					`${API_BASE}/staff/${encodeURIComponent(merchantId)}`,
					{ headers: { Authorization: apiKey } },
				);
				setStaff(data);
				setCache(cacheKey, data);
				return data;
			} catch (err: any) {
				setStaffError(`Failed to fetch staff (${err.message || "Unknown error"}).`);
			} finally {
				setStaffLoading(false);
			}

			return [];
		},
		[apiKey, getCache, setCache],
	);

	const assignStaff = useCallback(
		async (merchantId: string, input: string) => {
			setStaffLoading(true);
			setStaffError(undefined);
			setActionMsg(undefined);
			try {
				const { data } = await axios.post<iStaffAssignResponse>(
					`${API_BASE}/staff/${encodeURIComponent(merchantId)}`,
					{ input },
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: apiKey,
						},
					},
				);
				setActionMsg(
					data.success ? "Staff assigned successfully." : "Failed to assign staff.",
				);
				await fetchStaff(merchantId);
				return data;
			} catch (err: any) {
				setStaffError(err.response?.data?.message || "Failed to assign staff.");
			} finally {
				setStaffLoading(false);
			}
		},
		[apiKey, fetchStaff],
	);

	const removeStaff = useCallback(
		async (merchantId: string, staffId: string) => {
			setStaffLoading(true);
			setStaffError(undefined);
			setActionMsg(undefined);
			try {
				const { data } = await axios.delete<iStaffRemoveResponse>(
					`${API_BASE}/staff/${encodeURIComponent(merchantId)}/${encodeURIComponent(staffId)}`,
					{
						headers: {
							Authorization: apiKey,
						},
					},
				);
				setActionMsg(
					data.success ? "Staff removed successfully." : "Failed to remove staff.",
				);
				await fetchStaff(merchantId);
				return data;
			} catch (err: any) {
				setStaffError("Failed to remove staff.");
				console.error(err);
			} finally {
				setStaffLoading(false);
			}
		},
		[apiKey, fetchStaff],
	);

	return {
		staff,
		staffLoading,
		staffError,
		actionMsg,
		fetchStaff,
		assignStaff,
		removeStaff,
		setActionMsg,
	};
}
