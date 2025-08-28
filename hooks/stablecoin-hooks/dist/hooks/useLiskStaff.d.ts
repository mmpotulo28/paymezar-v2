import { iStaffMember, iStaffAssignResponse, iStaffRemoveResponse } from "../types";
export interface iUseLiskStaff {
    staff: iStaffMember[];
    staffLoading: boolean;
    staffError: string | undefined;
    staffMessage: string | undefined;
    fetchStaff: (merchantId: string) => Promise<iStaffMember[]>;
    assignStaff: (merchantId: string, input: string) => Promise<iStaffAssignResponse | undefined>;
    assignStaffLoading: boolean;
    assignStaffError: string | undefined;
    assignStaffMessage: string | undefined;
    removeStaff: (merchantId: string, staffId: string) => Promise<iStaffRemoveResponse | undefined>;
    removeStaffLoading: boolean;
    removeStaffError: string | undefined;
    removeStaffMessage: string | undefined;
}
export declare function useLiskStaff({ apiKey }: {
    apiKey?: string;
}): iUseLiskStaff;
