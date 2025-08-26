import { useCallback, useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useCache } from "./useCache";
import { iCharge } from "@/types";
import { useLiskTransfer } from "./useLiskTransfer";
const API_BASE = process.env.NEXT_PUBLIC_LISK_API_BASE as string;

export interface iUseLiskCharges {
	charges: iCharge[];
	charge: iCharge | undefined;
	chargesLoading: boolean;
	chargesError: string | undefined;
	fetchCharges: (userId: string) => Promise<iCharge[] | void>;
	getCharge: (chargeId: string) => Promise<iCharge | void>;
	deleteCharge: ({
		userId,
		chargeId,
	}: {
		userId: string;
		chargeId: string;
	}) => Promise<{ message: string } | void>;
	createCharge: (data: {
		userId: string;
		paymentId: string;
		amount: number;
		note?: string;
	}) => Promise<iCharge | void>;
	updateCharge: (data: {
		userId: string;
		chargeId: string;
		note?: string;
		status?: "PENDING" | "COMPLETE";
	}) => Promise<iCharge | void>;

	// complete charge
	completeCharge: ({
		userId,
		chargeId,
		afterComplete,
	}: {
		userId: string;
		chargeId: string;
		afterComplete: () => void;
	}) => Promise<{
		updateRes: AxiosResponse<any, any>;
		transferRes: AxiosResponse<any, any>;
		message?: string;
	} | void>;
	completeChargeLoading: boolean;
	completeChargeError: string | undefined;
	completeChargeMessage: string | undefined;
}

export function useLiskCharges(mode: "user" | "organization" = "user"): iUseLiskCharges {
	const [charges, setCharges] = useState<iCharge[]>([]);
	const [chargesLoading, setChargesLoading] = useState(false);
	const [chargesError, setChargesError] = useState<string | undefined>(undefined);

	const [charge, setCharge] = useState<iCharge | undefined>(undefined);

	// complete charge
	const [completeChargeLoading, setCompleteChargeLoading] = useState(false);
	const [completeChargeError, setCompleteChargeError] = useState<string | undefined>(undefined);
	const [completeChargeMessage, setCompleteChargeMessage] = useState<string | undefined>(
		undefined,
	);

	const { user } = useUser();
	const { organization } = useOrganization();
	const { getCache, setCache } = useCache();
	const { makeTransfer, transferError } = useLiskTransfer();
	const [apiKey, setApiKey] = useState<string | undefined>(undefined);

	useEffect(() => {
		// Fetch API key from cookies
		const fetchApiKey = () => {
			const key = (
				mode === "user"
					? process.env.NEXT_PUBLIC_LISK_API_KEY
					: organization?.publicMetadata.apiToken
			) as string;

			console.log(`fetching api key for user: ${user?.id} in mode: ${mode}`);
			setApiKey(`Bearer ${key}`);
		};

		fetchApiKey();
	}, [user, organization, mode]);

	// reset all messages and errors after 3 seconds
	useEffect(() => {
		const timer = setTimeout(() => {
			setChargesError(undefined);
			setCharge(undefined);
		}, 3000);

		return () => clearTimeout(timer);
	}, [chargesError, charge]);

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
		setChargesLoading(true);
		try {
			const { data } = await axios.post<iCharge>(
				`${API_BASE}/charge/${userId}/create`,
				{ paymentId, amount, note },
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
			if (err?.response?.status === 400) setChargesError("Validation error.");
			else if (err?.response?.status === 401) setChargesError("Unauthorized.");
			else setChargesError("Failed to create charge.");
		} finally {
			setChargesLoading(false);
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

				console.log("fetching charges", apiKey);
				const { data } = await axios.get<{ charges: iCharge[] }>(
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
		[apiKey, getCache, setCache],
	);

	// Get a specific charge by chargeId
	const getCharge = useCallback(
		async (chargeId: string) => {
			setChargesLoading(true);
			setChargesError(undefined);
			setCharge(undefined);
			try {
				const { data } = await axios.get<{ charge: iCharge }>(
					`${API_BASE}/retrieve-charge/${chargeId}`,
					{
						headers: { Authorization: apiKey },
					},
				);

				console.log("Charge data:", data.charge);
				setCharge(data.charge);
			} catch (err: any) {
				if (err?.response?.status === 400) setChargesError("Invalid parameters.");
				else if (err?.response?.status === 401) setChargesError("Unauthorized.");
				else if (err?.response?.status === 404) setChargesError("Charge not found.");
				else setChargesError("Failed to fetch charge.");
			} finally {
				setChargesLoading(false);
			}

			return undefined;
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
			setChargesLoading(true);
			setChargesError(undefined);
			try {
				const { data } = await axios.put<iCharge>(
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
				if (err?.response?.status === 400) setChargesError("Validation error.");
				else if (err?.response?.status === 401) setChargesError("Unauthorized.");
				else if (err?.response?.status === 404) setChargesError("Charge not found.");
				else setChargesError("Failed to update charge.");
			} finally {
				setChargesLoading(false);
			}

			return undefined;
		},
		[apiKey],
	);

	// Delete a charge
	const deleteCharge = useCallback(
		async ({ userId, chargeId }: { userId: string; chargeId: string }) => {
			setChargesLoading(true);
			setChargesError(undefined);
			try {
				const { data } = await axios.delete<{ message: string }>(
					`${API_BASE}/charge/${userId}/${chargeId}/delete`,
					{ headers: { Authorization: apiKey } },
				);
				return data;
			} catch (err: any) {
				if (err?.response?.status === 400) setChargesError("Invalid parameters.");
				else if (err?.response?.status === 401) setChargesError("Unauthorized.");
				else setChargesError("Failed to delete charge.");
			} finally {
				setChargesLoading(false);
			}
		},
		[apiKey],
	);

	// complete a charge
	const completeCharge = useCallback(
		async ({
			userId,
			chargeId,
			afterComplete,
		}: {
			userId: string;
			chargeId: string;
			afterComplete: () => void;
		}) => {
			setCompleteChargeLoading(true);
			setCompleteChargeError(undefined);
			try {
				// request the charge first
				await getCharge(chargeId);
				if (!charge) throw new Error("Charge not found");

				// 1. Do the transfer using the correct endpoint
				console.log("Transferring charge", charge, userId);
				await makeTransfer({
					userId,
					transactionAmount: charge.amount || 0,
					transactionNotes: charge.note || "",
					transactionRecipient: charge.paymentId || "",
				});

				console.log("Transfer response:", transferError);

				if (transferError) {
					throw new Error(transferError || "Transfer failed");
				}

				// 2. Update the charge status to complete
				console.log("Updating charge status to COMPLETE", charge.id);
				const updateRes = await axios.request({
					method: "PUT",
					url: `https://seal-app-qp9cc.ondigitalocean.app/api/v1/charge/${encodeURIComponent(user?.id || "")}/${encodeURIComponent(charge.id)}/update`,
					headers: {
						"Content-Type": "application/json",
						Authorization: apiKey,
					},
					data: { status: "COMPLETE" },
				});

				// 3. Perform any additional actions after completing the charge
				console.log("now performing function after complete", updateRes.data);
				afterComplete?.();

				setCompleteChargeMessage("Payment successful!");
			} catch (err: any) {
				if (err?.response?.status === 400) setCompleteChargeError("Invalid parameters.");
				else if (err?.response?.status === 401) setCompleteChargeError("Unauthorized.");
				else setCompleteChargeError("Failed to complete charge.");
				console.error("Failed to complete charge:", err);
			} finally {
				setCompleteChargeLoading(false);
			}
		},
		[apiKey, charge, getCharge, makeTransfer, transferError, user?.id],
	);

	return {
		charges,
		chargesLoading,
		chargesError,
		fetchCharges,
		charge,
		getCharge,
		createCharge,
		updateCharge,
		deleteCharge,

		// complete charge
		completeCharge,
		completeChargeError,
		completeChargeMessage,
		completeChargeLoading,
	};
}
