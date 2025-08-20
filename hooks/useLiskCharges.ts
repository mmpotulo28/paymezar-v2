import { useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string;

export interface ICharge {
	id: string;
	paymentId: string;
	amount: number;
	note?: string | null;
	status: "PENDING" | "COMPLETE";
	userId: string;
	createdAt: string;
	updatedAt: string;
}

export function useLiskCharges() {
	const { user } = useUser();
	const [charges, setCharges] = useState<ICharge[]>([]);
	const [chargesLoading, setChargesLoading] = useState(false);
	const [chargesError, setChargesError] = useState<string | null>(null);

	const [charge, setCharge] = useState<ICharge | null>(null);
	const [chargeLoading, setChargeLoading] = useState(false);
	const [chargeError, setChargeError] = useState<string | null>(null);

	const [createLoading, setCreateLoading] = useState(false);
	const [createError, setCreateError] = useState<string | null>(null);
	const [createdCharge, setCreatedCharge] = useState<ICharge | null>(null);

	const [updateLoading, setUpdateLoading] = useState(false);
	const [updateError, setUpdateError] = useState<string | null>(null);

	const [deleteLoading, setDeleteLoading] = useState(false);
	const [deleteError, setDeleteError] = useState<string | null>(null);
	const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

	// Create a new charge
	const createCharge = async ({
		userId,
		paymentId,
		amount,
		note,
	}: {
		userId: string;
		paymentId: string;
		amount: number;
		note?: string;
	}) => {
		setCreateLoading(true);
		setCreateError(null);
		setCreatedCharge(null);
		try {
			const { data } = await axios.post<ICharge>(
				`${API_BASE}/charge/${userId}/create`,
				{ paymentId, amount, note },
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: (user?.unsafeMetadata.apiToken as string) || "",
					},
				},
			);
			setCreatedCharge(data);
			return data;
		} catch (err: any) {
			if (err?.response?.status === 400) setCreateError("Validation error.");
			else if (err?.response?.status === 401) setCreateError("Unauthorized.");
			else setCreateError("Failed to create charge.");
		} finally {
			setCreateLoading(false);
		}

		return null;
	};

	// Get all charges for a user
	const fetchCharges = async (userId: string) => {
		setChargesLoading(true);
		setChargesError(null);
		try {
			const { data } = await axios.get<{ charges: ICharge[] }>(
				`${API_BASE}/charge/${userId}`,
				{ headers: { Authorization: (user?.unsafeMetadata.apiToken as string) || "" } },
			);
			setCharges(data.charges || []);
		} catch (err: any) {
			if (err?.response?.status === 400) setChargesError("Invalid parameter.");
			else if (err?.response?.status === 401) setChargesError("Unauthorized.");
			else setChargesError("Failed to fetch charges.");
		} finally {
			setChargesLoading(false);
		}
	};

	// Get a specific charge by chargeId
	const fetchCharge = async (chargeId: string) => {
		setChargeLoading(true);
		setChargeError(null);
		setCharge(null);
		try {
			const { data } = await axios.get<ICharge>(`${API_BASE}/retrieve-charge/${chargeId}`, {
				headers: { Authorization: (user?.unsafeMetadata.apiToken as string) || "" },
			});
			setCharge(data);
		} catch (err: any) {
			if (err?.response?.status === 400) setChargeError("Invalid parameters.");
			else if (err?.response?.status === 401) setChargeError("Unauthorized.");
			else if (err?.response?.status === 404) setChargeError("Charge not found.");
			else setChargeError("Failed to fetch charge.");
		} finally {
			setChargeLoading(false);
		}
	};

	// Update a charge (note or status)
	const updateCharge = async ({
		userId,
		chargeId,
		note,
		status,
	}: {
		userId: string;
		chargeId: string;
		note?: string;
		status?: "PENDING" | "COMPLETE";
	}) => {
		setUpdateLoading(true);
		setUpdateError(null);
		try {
			const { data } = await axios.put<ICharge>(
				`${API_BASE}/charge/${userId}/${chargeId}/update`,
				{ note, status },
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: (user?.unsafeMetadata.apiToken as string) || "",
					},
				},
			);
			setCharge(data);
			return data;
		} catch (err: any) {
			if (err?.response?.status === 400) setUpdateError("Validation error.");
			else if (err?.response?.status === 401) setUpdateError("Unauthorized.");
			else if (err?.response?.status === 404) setUpdateError("Charge not found.");
			else setUpdateError("Failed to update charge.");
		} finally {
			setUpdateLoading(false);
		}

		return null;
	};

	// Delete a charge
	const deleteCharge = async ({ userId, chargeId }: { userId: string; chargeId: string }) => {
		setDeleteLoading(true);
		setDeleteError(null);
		setDeleteSuccess(null);
		try {
			const { data } = await axios.delete<{ message: string }>(
				`${API_BASE}/charge/${userId}/${chargeId}/delete`,
				{ headers: { Authorization: (user?.unsafeMetadata.apiToken as string) || "" } },
			);
			setDeleteSuccess(data.message || "Charge deleted");
			return data;
		} catch (err: any) {
			if (err?.response?.status === 400) setDeleteError("Invalid parameters.");
			else if (err?.response?.status === 401) setDeleteError("Unauthorized.");
			else setDeleteError("Failed to delete charge.");
		} finally {
			setDeleteLoading(false);
		}
	};

	return {
		charges,
		chargesLoading,
		chargesError,
		fetchCharges,

		charge,
		chargeLoading,
		chargeError,
		fetchCharge,

		createCharge,
		createLoading,
		createError,
		createdCharge,

		updateCharge,
		updateLoading,
		updateError,

		deleteCharge,
		deleteLoading,
		deleteError,
		deleteSuccess,
	};
}
