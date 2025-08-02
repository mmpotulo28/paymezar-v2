import { iUser } from "@/types";
import { ChipProps } from "@heroui/react";
import axios from "axios";
import Cookies from "js-cookie";

export const statusColorMap: Record<string, ChipProps["color"]> = {
	Completed: "success",
	Pending: "warning",
	Failed: "danger",
};

/**
 * Makes a POST request to the given URL with the provided data and headers.
 * Returns a consistent object: { error, message, data, status }
 */
export async function postApi<T = any>(
	url: string,
	data: any,
	headers: Record<string, string> = {},
	method: "POST" | "PUT" | "DELETE" | "GET" = "POST",
): Promise<{ error: boolean; message: string; data: T | null; status: number }> {
	try {
		const response = await axios.request({
			url,
			method,
			headers,
			data: method === "GET" ? undefined : data,
		});
		console.log("API Response:", response.data);
		return {
			error: false,
			message: response.data?.message || "Success",
			data: response.data,
			status: response.status,
		};
	} catch (error: any) {
		console.error("API Error:", error);
		return {
			error: true,
			message:
				error?.response?.data?.message || error?.message || "An unexpected error occurred",
			data: null,
			status: error?.response?.status || 500,
		};
	}
}

/**
 * Creates a new API token for the authenticated user.
 */
export async function createApiToken(secretToken: string, description?: string) {
	return await postApi<{ id: string; token: string }>(
		"https://seal-app-qp9cc.ondigitalocean.app/api/v1/tokens",
		description ? { description } : {},
		{
			"Content-Type": "application/json",
			Authorization: secretToken,
		},
	);
}

/**
 * Creates a Lisk user account using the stablecoin API.
 */
export async function createLiskAccount({
	email,
	firstName,
	lastName,
}: {
	email: string;
	firstName: string;
	lastName: string;
}) {
	const userData = {
		email,
		firstName,
		lastName,
		imageUrl: "https://placehold.co/600x400",
		enabledPay: false,
		role: "CUSTOMER",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};

	return await postApi("https://seal-app-qp9cc.ondigitalocean.app/api/v1/users", userData, {
		"Content-Type": "application/json",
		Authorization: process.env.NEXT_PUBLIC_LISK_API_KEY || "",
	});
}

/**
 * Fetches a Lisk user by liskId using the API key.
 * Returns { error, message, data, status }
 */
export async function getLiskUserById({ liskId }: { liskId: string }) {
	console.log("Fetching Lisk user by ID::", { liskId });
	return await postApi(
		`https://seal-app-qp9cc.ondigitalocean.app/api/v1/users/${liskId}`,
		{},
		{
			Authorization: process.env.NEXT_PUBLIC_LISK_API_KEY || "",
		},
		"GET",
	);
}

/**
 * Fetches and caches user balance for 1 minute using cookie-based cache.
 */
export async function getUserBalance({ userId }: { userId: string }) {
	console.log("Fetching user balance", { userId });

	const cookieKey = `paymezar_balance_${userId}`;
	const cached = Cookies.get(cookieKey);

	if (cached) {
		try {
			const parsed = JSON.parse(cached);
			const now = Date.now();
			if (parsed.timestamp && now - parsed.timestamp < 60 * 1000) {
				return {
					error: false,
					message: "Balance fetched from cookie cache",
					data: { tokens: parsed.tokens },
					status: 200,
				};
			}
		} catch {
			console.error("Failed to parse cached user balance:", cached);
		}
	}

	const options = {
		method: "GET",
		url: `https://seal-app-qp9cc.ondigitalocean.app/api/v1/${userId}/balance`,
	};

	const result = await postApi(
		options.url,
		{},
		{
			Authorization: process.env.NEXT_PUBLIC_LISK_API_KEY || "",
		},
		"GET",
	);

	if (!result.error && result.data?.tokens) {
		Cookies.set(
			cookieKey,
			JSON.stringify({
				tokens: result.data.tokens,
				timestamp: Date.now(),
			}),
			{ expires: 1 / 1440 }, // 1 minute
		);
	}

	return result;
}

/**
 * Redeem LZAR tokens for a user.
 * @param userId - The user's ID.
 * @param amount - The amount to redeem.
 * @returns {Promise<{ error, message, data, status }>}
 */
interface RedeemLZARParams {
	userId: string;
	amount: number;
}

interface RedeemLZARResponse {
	error: boolean;
	message: string;
	data: {
		transactionId?: string | null;
	} | null;
	status: number;
}

export async function redeemLZAR({
	userId,
	amount,
}: RedeemLZARParams): Promise<RedeemLZARResponse> {
	console.log("Redeeming LZAR", { userId, amount });
	return await postApi(
		"https://seal-app-qp9cc.ondigitalocean.app/api/v1/redeem",
		{ userId, amount },
		{
			"Content-Type": "application/json",
			Authorization: process.env.NEXT_PUBLIC_LISK_API_KEY || "",
		},
		"POST",
	);
}

/**
 * Upsert (create or update) a user's bank account.
 */
export async function upsertBankAccount({
	userId,
	accountHolder,
	accountNumber,
	branchCode,
	bankName,
}: {
	userId: string;
	accountHolder: string;
	accountNumber: string;
	branchCode: string;
	bankName: string;
}) {
	return await postApi(
		`https://seal-app-qp9cc.ondigitalocean.app/api/v1/bank/${encodeURIComponent(userId)}`,
		{
			accountHolder,
			accountNumber,
			branchCode,
			bankName,
		},
		{
			"Content-Type": "application/json",
			Authorization: process.env.NEXT_PUBLIC_LISK_API_KEY || "",
		},
		"POST",
	);
}

/**
 * Fetches the bank account details for a user.
 */
export async function getBankAccounts({ userId }: { userId: string }) {
	return await postApi(
		`https://seal-app-qp9cc.ondigitalocean.app/api/v1/bank/${encodeURIComponent(userId)}`,
		{},
		{
			Authorization: process.env.NEXT_PUBLIC_LISK_API_KEY || "",
		},
		"GET",
	);
}

/**
 * Deletes the bank account for a user.
 */
export async function deleteBankAccount({ userId }: { userId: string }) {
	return await postApi(
		`https://seal-app-qp9cc.ondigitalocean.app/api/v1/bank/${encodeURIComponent(userId)}`,
		{},
		{
			Authorization: process.env.NEXT_PUBLIC_LISK_API_KEY || "",
		},
		"DELETE",
	);
}
