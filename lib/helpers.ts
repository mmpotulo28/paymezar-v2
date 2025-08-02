import { ChipProps } from "@heroui/react";
import axios from "axios";

export const statusColorMap: Record<string, ChipProps["color"]> = {
	Completed: "success",
	Pending: "warning",
	Failed: "danger",
};

/**
 * Creates a new API token for the authenticated user.
 * @param {string} secretToken - Your existing secret token for authentication.
 * @param {string} [description] - Optional human-friendly token description.
 * @returns {Promise<{ id: string; token: string }>} The new API token object.
 * @throws Error if the request fails.
 */
export async function createApiToken(secretToken: string, description?: string) {
	const options = {
		method: "POST",
		url: "https://seal-app-qp9cc.ondigitalocean.app/api/v1/tokens",
		headers: {
			"Content-Type": "application/json",
			Authorization: secretToken,
		},
		data: description ? { description } : {},
	};

	try {
		const { data } = await axios.request(options);
		return data as { id: string; token: string };
	} catch (error: any) {
		throw new Error(error?.response?.data?.message || "Failed to create API token");
	}
}
