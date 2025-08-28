import { iStaffMember, iStaffAssignResponse, iStaffRemoveResponse } from "../types";
export interface iUseLiskStaff {
    staff: iStaffMember[];
    staffLoading: boolean;
    staffError: string | undefined;
    actionMsg: string | undefined;
    fetchStaff: (merchantId: string) => Promise<iStaffMember[]>;
    assignStaff: (merchantId: string, input: string) => Promise<iStaffAssignResponse | undefined>;
    removeStaff: (merchantId: string, staffId: string) => Promise<iStaffRemoveResponse | undefined>;
    setActionMsg: (msg: string | undefined) => void;
}
export declare function useLiskStaff({ apiKey }: {
    apiKey?: string;
}): iUseLiskStaff;
