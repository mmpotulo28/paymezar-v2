import { useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { iStaffMember, iStaffAssignResponse, iStaffRemoveResponse } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string;

export function useStaff() {
	const { user } = useUser();
	const [staff, setStaff] = useState<iStaffMember[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [actionMsg, setActionMsg] = useState<string | null>(null);

	const fetchStaff = async (merchantId: string) => {
		setLoading(true);
		setError(null);
		try {
			const { data } = await axios.get<iStaffMember[]>(
				`${API_BASE}/staff/${encodeURIComponent(merchantId)}`,
				{ headers: { Authorization: (user?.unsafeMetadata.apiToken as string) || "" } },
			);
			setStaff(data);
		} catch (err: any) {
			setError(`Failed to fetch staff (${err.message || "Unknown error"}).`);
		} finally {
			setLoading(false);
		}
	};

	const assignStaff = async (merchantId: string, input: string) => {
		setLoading(true);
		setError(null);
		setActionMsg(null);
		try {
			const { data } = await axios.post<iStaffAssignResponse>(
				`${API_BASE}/staff/${encodeURIComponent(merchantId)}`,
				{ input },
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: (user?.unsafeMetadata.apiToken as string) || "",
					},
				},
			);
			setActionMsg(data.success ? "Staff assigned successfully." : "Failed to assign staff.");
			await fetchStaff(merchantId);
			return data;
		} catch (err: any) {
			setError(err.response?.data?.message || "Failed to assign staff.");
		} finally {
			setLoading(false);
		}
	};

	const removeStaff = async (merchantId: string, staffId: string) => {
		setLoading(true);
		setError(null);
		setActionMsg(null);
		try {
			const { data } = await axios.delete<iStaffRemoveResponse>(
				`${API_BASE}/staff/${encodeURIComponent(merchantId)}/${encodeURIComponent(staffId)}`,
				{
					headers: {
						Authorization: (user?.unsafeMetadata.apiToken as string) || "",
					},
				},
			);
			setActionMsg(data.success ? "Staff removed successfully." : "Failed to remove staff.");
			await fetchStaff(merchantId);
			return data;
		} catch (err: any) {
			setError("Failed to remove staff.");
		} finally {
			setLoading(false);
		}
	};

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
