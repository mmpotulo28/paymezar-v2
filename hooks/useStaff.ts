import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useOrganization, useUser } from "@clerk/nextjs";
import { iStaffMember, iStaffAssignResponse, iStaffRemoveResponse } from "@/types";
import useCache from "./useCache";
const API_BASE = process.env.NEXT_PUBLIC_LISK_API_BASE as string;

export interface iUseStaff {
	staff: iStaffMember[];
	loading: boolean;
	error: string | undefined;
	actionMsg: string | undefined;
	fetchStaff: (merchantId: string) => Promise<iStaffMember[]>;
	assignStaff: (merchantId: string, input: string) => Promise<iStaffAssignResponse | undefined>;
	removeStaff: (merchantId: string, staffId: string) => Promise<iStaffRemoveResponse | undefined>;
	setActionMsg: (msg: string | undefined) => void;
}

export function useStaff(mode: "user" | "organization" = "user") {
	const [staff, setStaff] = useState<iStaffMember[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | undefined>(undefined);
	const [actionMsg, setActionMsg] = useState<string | undefined>(undefined);

	const { user } = useUser();
	const { organization } = useOrganization();
	const { getCache, setCache } = useCache();
	const [apiKey, setApiKey] = useState<string | undefined>(undefined);

	useEffect(() => {
		// Fetch API key
		const fetchApiKey = () => {
			const key = (
				mode === "user"
					? user?.unsafeMetadata.apiToken
					: organization?.publicMetadata.apiToken
			) as string;

			setApiKey(`Bearer ${key}` || undefined);
		};

		fetchApiKey();
	}, [user, organization, mode]);

	const fetchStaff = useCallback(
		async (merchantId: string) => {
			setLoading(true);
			setError(undefined);
			const cacheKey = `staff_list_${merchantId}`;
			try {
				const cached = getCache(cacheKey);
				if (cached) {
					setStaff(cached);
					setLoading(false);
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
				setError(`Failed to fetch staff (${err.message || "Unknown error"}).`);
			} finally {
				setLoading(false);
			}

			return [];
		},
		[apiKey],
	);

	const assignStaff = useCallback(
		async (merchantId: string, input: string) => {
			setLoading(true);
			setError(undefined);
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
				setError(err.response?.data?.message || "Failed to assign staff.");
			} finally {
				setLoading(false);
			}
		},
		[apiKey],
	);

	const removeStaff = useCallback(
		async (merchantId: string, staffId: string) => {
			setLoading(true);
			setError(undefined);
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
				setError("Failed to remove staff.");
			} finally {
				setLoading(false);
			}
		},
		[apiKey],
	);

	return {
		staff,
		loading,
		error,
		actionMsg,
		fetchStaff,
		assignStaff,
		removeStaff,
		setActionMsg,
	};
}
