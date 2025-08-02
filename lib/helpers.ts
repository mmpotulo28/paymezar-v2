import { ChipProps } from "@heroui/react";
import axios from "axios";

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
		const response = await axios({
			url,
			method,
			headers,
			data,
		});
		console.log("API Response:", response.data);
		return {
			error: false,
			message: response.data?.message || "Success",
			data: response.data,
			status: response.status,
		};
	} catch (error: any) {
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
	apiKey,
	email,
	firstName,
	lastName,
}: {
	apiKey: string;
	email: string;
	firstName: string;
	lastName: string;
}) {
	return await postApi(
		"https://seal-app-qp9cc.ondigitalocean.app/api/v1/users",
		{ email, firstName, lastName },
		{
			"Content-Type": "application/json",
			Authorization: process.env.NEXT_PUBLIC_LISK_API_KEY || "",
		},
	);
}

/**
 * Fetches a Lisk user by liskId using the API key.
 * Returns { error, message, data, status }
 */
export async function getLiskUserById({ apiKey, liskId }: { apiKey: string; liskId: string }) {
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
