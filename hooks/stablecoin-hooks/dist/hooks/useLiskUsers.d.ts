import { iUser } from "../types";
export interface iUseLiskUsers {
    users: iUser[];
    loadingUsers: boolean;
    errorUsers: string | undefined;
    fetchUsers: () => Promise<iUser[]>;
    getUser: ({ id }: {
        id: string;
    }) => Promise<iUser | null>;
    createUser: (data: any) => Promise<iUser | null>;
    singleUser: iUser | null;
}
export declare const useLiskUsers: ({ apiKey }: {
    apiKey?: string;
}) => iUseLiskUsers;
