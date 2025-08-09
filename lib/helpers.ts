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
): Promise<{
  error: boolean;
  message: string;
  data: T | null;
  status: number;
}> {
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
        error?.response?.data?.message ||
        error?.message ||
        "An unexpected error occurred",
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

/**
 * Creates a new API token for the authenticated user.
 */
export async function createApiToken(
  secretToken: string,
  description?: string,
) {
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
  id,
  email,
  firstName,
  lastName,
}: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}) {
  console.log("Creating Lisk account with data:", {
    id,
    email,
    firstName,
    lastName,
  });

  if (!id || !email || !firstName || !lastName) {
    return {
      error: true,
      message: "Missing required fields for Lisk account creation",
      data: null,
      status: 400,
    };
  }

  const userData = {
    id,
    email,
    firstName,
    lastName,
    imageUrl: "https://placehold.co/600x400",
    enabledPay: false,
    role: "CUSTOMER",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  console.log("Sending Lisk user data:", userData);

  const result = await postApi(
    "https://seal-app-qp9cc.ondigitalocean.app/api/v1/users",
    userData,
    {
      "Content-Type": "application/json",
      Authorization: process.env.NEXT_PUBLIC_LISK_API_KEY || "",
    },
  );

  console.log("Lisk account creation result:", result);

  return result;
}

/**
 * Fetches a Lisk user by id using the API key.
 * Returns { error, message, data, status }
 */
export async function getLiskUserById({ id }: { id: string }) {
  console.log("Fetching Lisk user by ID:", { id });
  try {
    const result = await postApi(
      `https://seal-app-qp9cc.ondigitalocean.app/api/v1/users/${id}`,
      {},
      {
        Authorization: process.env.NEXT_PUBLIC_LISK_API_KEY || "",
      },
      "GET",
    );

    // If the user is not found, that's not necessarily an error for our use case
    if (result.status === 404) {
      return {
        error: false,
        message: "User not found",
        data: null,
        status: 404,
      };
    }

    return result;
  } catch (error: any) {
    console.error("Error fetching Lisk user:", error);

    return {
      error: true,
      message: error.message || "Failed to fetch user",
      data: null,
      status: 500,
    };
  }
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

/**
 * Formats Clerk error messages into user-friendly text
 */
export function formatClerkError(error: any): string {
  if (!error) return "An unexpected error occurred";

  // Handle array of errors
  if (error.errors && Array.isArray(error.errors)) {
    const firstError = error.errors[0];

    if (!firstError) return "An unexpected error occurred";

    // Map common error codes to user-friendly messages
    const errorMap: Record<string, string> = {
      session_exists:
        "You are already signed in. Please sign out first if you want to create a new account.",
      form_identifier_exists: "An account with this email already exists.",
      form_username_exists: "This username is already taken.",
      form_phone_number_exists:
        "An account with this phone number already exists.",
      form_password_pwned:
        "This password has been found in a data breach. Please choose a different password.",
      form_password_too_common:
        "This password is too common. Please choose a more secure password.",
      form_identifier_not_found: "No account found with this email address.",
      form_password_incorrect: "Incorrect password. Please try again.",
      form_code_incorrect: "The verification code is incorrect.",
      verification_expired:
        "The verification code has expired. Please request a new one.",
      verification_failed: "Verification failed. Please try again.",
      too_many_requests: "Too many attempts. Please wait before trying again.",
      user_locked: "Your account has been locked. Please contact support.",
    };

    const userFriendlyMessage = errorMap[firstError.code];

    if (userFriendlyMessage) return userFriendlyMessage;

    // If no mapping found, use the error message
    return firstError.message || "An error occurred. Please try again.";
  }

  // Handle single error object
  if (error.code && typeof error.code === "string") {
    const errorMap: Record<string, string> = {
      session_exists:
        "You are already signed in. Please sign out first if you want to create a new account.",
      form_identifier_exists: "An account with this email already exists.",
      form_username_exists: "This username is already taken.",
      form_phone_number_exists:
        "An account with this phone number already exists.",
      form_password_pwned:
        "This password has been found in a data breach. Please choose a different password.",
      form_password_too_common:
        "This password is too common. Please choose a more secure password.",
      form_identifier_not_found: "No account found with this email address.",
      form_password_incorrect: "Incorrect password. Please try again.",
    };

    return (
      errorMap[error.code] ||
      error.message ||
      "An error occurred. Please try again."
    );
  }

  // Fallback to error message or generic message
  return error.message || "An unexpected error occurred";
}

/**
 * Checks if user needs Lisk onboarding
 */
export function needsLiskOnboarding(user: any): boolean {
  if (!user) return false;

  return (
    !user.unsafeMetadata?.liskAccountCreated &&
    !user.unsafeMetadata?.liskOnboardingSkipped
  );
}
