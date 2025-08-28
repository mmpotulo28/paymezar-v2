import { AxiosResponse } from "axios";
import { iCharge } from "../types";
export interface iUseLiskCharges {
    charges: iCharge[];
    chargesLoading: boolean;
    chargesError: string | undefined;
    chargesMessage: string | undefined;
    fetchCharges: (userId: string) => Promise<iCharge[] | void>;
    charge: iCharge | undefined;
    getCharge: (chargeId: string) => Promise<iCharge | void>;
    getChargeLoading: boolean;
    getChargeError: string | undefined;
    getChargeMessage: string | undefined;
    deleteCharge: ({ userId, chargeId, }: {
        userId: string;
        chargeId: string;
    }) => Promise<{
        message: string;
    } | void>;
    deleteChargeLoading: boolean;
    deleteChargeError: string | undefined;
    deleteChargeMessage: string | undefined;
    createCharge: (data: {
        userId: string;
        paymentId: string;
        amount: number;
        note?: string;
    }) => Promise<iCharge | void>;
    createChargeLoading: boolean;
    createChargeError: string | undefined;
    createChargeMessage: string | undefined;
    updateCharge: (data: {
        userId: string;
        chargeId: string;
        note?: string;
        status?: "PENDING" | "COMPLETE";
    }) => Promise<iCharge | void>;
    updateChargeLoading: boolean;
    updateChargeError: string | undefined;
    updateChargeMessage: string | undefined;
    completeCharge: ({ userId, chargeId, afterComplete, }: {
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
/**
 * Custom React hook for managing Lisk charges for a user.
 *
 * Provides functions to create, fetch, update, delete, and complete charges,
 * as well as state for loading, errors, and charge data.
 *
 * @param apiKey - Optional API key for authorization.
 * @param user - The user object for whom charges are managed.
 * @returns An object containing:
 * - `charges`: Array of charges for the user.
 * - `chargesLoading`: Loading state for charge operations.
 * - `chargesError`: Error message for charge operations.
 * - `fetchCharges`: Function to fetch all charges for a user.
 * - `charge`: The currently selected charge.
 * - `getCharge`: Function to fetch a specific charge by ID.
 * - `createCharge`: Function to create a new charge.
 * - `updateCharge`: Function to update an existing charge.
 * - `deleteCharge`: Function to delete a charge.
 * - `completeCharge`: Function to complete a charge (transfer and update status).
 * - `completeChargeError`: Error message for completing a charge.
 * - `completeChargeMessage`: Success message for completing a charge.
 * - `completeChargeLoading`: Loading state for completing a charge.
 */
export declare function useLiskCharges({ apiKey, user }: {
    apiKey?: string;
    user: any;
}): iUseLiskCharges;
