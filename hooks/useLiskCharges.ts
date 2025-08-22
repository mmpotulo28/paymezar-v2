import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useOrganization, useUser } from "@clerk/nextjs";
import useCache from "./useCache";
const API_BASE = process.env.NEXT_PUBLIC_LISK_API_BASE as string;

export interface ICharge {
	id: string;
	paymentId: string;
	amount: number;
	note?: string | undefined;
	status: "PENDING" | "COMPLETE";
	userId: string;
	createdAt: string;
	updatedAt: string;
}

export function useLiskCharges(mode: "user" | "organization" = "user") {
	const [charges, setCharges] = useState<ICharge[]>([]);
	const [chargesLoading, setChargesLoading] = useState(false);
	const [chargesError, setChargesError] = useState<string | undefined>(undefined);

	const [charge, setCharge] = useState<ICharge | undefined>(undefined);
	const [chargeLoading, setChargeLoading] = useState(false);
	const [chargeError, setChargeError] = useState<string | undefined>(undefined);

	const [createLoading, setCreateLoading] = useState(false);
	const [createError, setCreateError] = useState<string | undefined>(undefined);
	const [createdCharge, setCreatedCharge] = useState<ICharge | undefined>(undefined);

	const [updateLoading, setUpdateLoading] = useState(false);
	const [updateError, setUpdateError] = useState<string | undefined>(undefined);

	const [deleteLoading, setDeleteLoading] = useState(false);
	const [deleteError, setDeleteError] = useState<string | undefined>(undefined);
	const [deleteSuccess, setDeleteSuccess] = useState<string | undefined>(undefined);

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

			setApiKey(`Bearer ${key}` || undefined);
		};

		fetchApiKey();
	}, [user, organization, mode]);

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
		setCreateError(undefined);
		setCreatedCharge(undefined);
		try {
			const { data } = await axios.post<ICharge>(
				`${API_BASE}/charge/${userId}/create`,
				{ paymentId, amount, note },
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: apiKey,
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

		return undefined;
	};

	// Get all charges for a user
	const fetchCharges = useCallback(
		async (userId: string) => {
			setChargesLoading(true);
			setChargesError(undefined);
			const cacheKey = `user_charges_${userId}`;
			try {
				const cached = getCache(cacheKey);
				if (cached) {
					setCharges(cached);
					setChargesLoading(false);
					return cached;
				}

				const { data } = await axios.get<{ charges: ICharge[] }>(
					`${API_BASE}/charge/${userId}`,
					{ headers: { Authorization: apiKey } },
				);
				setCharges(data.charges || []);
				setCache(cacheKey, data.charges || []);
			} catch (err: any) {
				if (err?.response?.status === 400) setChargesError("Invalid parameter.");
				else if (err?.response?.status === 401) setChargesError("Unauthorized.");
				else setChargesError("Failed to fetch charges.");
			} finally {
				setChargesLoading(false);
			}
		},
		[apiKey],
	);

	// Get a specific charge by chargeId
	const fetchCharge = useCallback(
		async (chargeId: string) => {
			setChargeLoading(true);
			setChargeError(undefined);
			setCharge(undefined);
			try {
				const { data } = await axios.get<ICharge>(
					`${API_BASE}/retrieve-charge/${chargeId}`,
					{
						headers: { Authorization: apiKey },
					},
				);
				setCharge(data);
			} catch (err: any) {
				if (err?.response?.status === 400) setChargeError("Invalid parameters.");
				else if (err?.response?.status === 401) setChargeError("Unauthorized.");
				else if (err?.response?.status === 404) setChargeError("Charge not found.");
				else setChargeError("Failed to fetch charge.");
			} finally {
				setChargeLoading(false);
			}
		},
		[apiKey],
	);

	// Update a charge (note or status)
	const updateCharge = useCallback(
		async ({
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
			setUpdateError(undefined);
			try {
				const { data } = await axios.put<ICharge>(
					`${API_BASE}/charge/${userId}/${chargeId}/update`,
					{ note, status },
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: apiKey,
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

			return undefined;
		},
		[apiKey],
	);

	// Delete a charge
	const deleteCharge = useCallback(
		async ({ userId, chargeId }: { userId: string; chargeId: string }) => {
			setDeleteLoading(true);
			setDeleteError(undefined);
			setDeleteSuccess(undefined);
			try {
				const { data } = await axios.delete<{ message: string }>(
					`${API_BASE}/charge/${userId}/${chargeId}/delete`,
					{ headers: { Authorization: apiKey } },
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
		},
		[apiKey],
	);

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
