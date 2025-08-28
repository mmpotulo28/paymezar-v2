import { iStaffMember, iStaffAssignResponse, iStaffRemoveResponse } from "../types";
export interface iUseStaff {
    staff: iStaffMember[];
    staffLoading: boolean;
    staffError: string | undefined;
    actionMsg: string | undefined;
    fetchStaff: (merchantId: string) => Promise<iStaffMember[]>;
    assignStaff: (merchantId: string, input: string) => Promise<iStaffAssignResponse | undefined>;
    removeStaff: (merchantId: string, staffId: string) => Promise<iStaffRemoveResponse | undefined>;
    setActionMsg: (msg: string | undefined) => void;
}
export declare function useStaff({ apiKey }: {
    apiKey?: string;
}): {
    staff: iStaffMember[];
    staffLoading: boolean;
    staffError: string | undefined;
    actionMsg: string | undefined;
    fetchStaff: (merchantId: string) => Promise<any>;
    assignStaff: (merchantId: string, input: string) => Promise<iStaffAssignResponse | undefined>;
    removeStaff: (merchantId: string, staffId: string) => Promise<iStaffRemoveResponse | undefined>;
    setActionMsg: import("react").Dispatch<import("react").SetStateAction<string | undefined>>;
};
