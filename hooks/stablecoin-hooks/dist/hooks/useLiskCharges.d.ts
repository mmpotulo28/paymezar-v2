import { AxiosResponse } from "axios";
import { iCharge } from "../types";
export interface iUseLiskCharges {
    charges: iCharge[];
    charge: iCharge | undefined;
    chargesLoading: boolean;
    chargesError: string | undefined;
    fetchCharges: (userId: string) => Promise<iCharge[] | void>;
    getCharge: (chargeId: string) => Promise<iCharge | void>;
    deleteCharge: ({ userId, chargeId, }: {
        userId: string;
        chargeId: string;
    }) => Promise<{
        message: string;
    } | void>;
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
export declare function useLiskCharges({ apiKey, user }: {
    apiKey?: string;
    user: any;
}): iUseLiskCharges;
