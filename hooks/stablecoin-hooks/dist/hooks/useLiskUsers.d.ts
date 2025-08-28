import { iUser } from "../types";
export interface iUseLiskUsers {
    users: iUser[];
    fetchUsersLoading: boolean;
    fetchUsersError: string | undefined;
    fetchUsersMessage: string | undefined;
    fetchUsers: () => Promise<iUser[]>;
    getUser: ({ id }: {
        id: string;
    }) => Promise<iUser | null>;
    getUserLoading: boolean;
    getUserError: string | undefined;
    getUserMessage: string | undefined;
    createUser: (data: iUser) => Promise<iUser | null>;
    createUserLoading: boolean;
    createUserError: string | undefined;
    createUserMessage: string | undefined;
    updateUser: (id: string, data: Partial<iUser>) => Promise<iUser | null>;
    updateUserLoading: boolean;
    updateUserError: string | undefined;
    updateUserMessage: string | undefined;
    deleteUser: (id: string) => Promise<{
        message: string;
    } | null>;
    deleteUserLoading: boolean;
    deleteUserError: string | undefined;
    deleteUserMessage: string | undefined;
    singleUser: iUser | null;
}
export declare const useLiskUsers: ({ apiKey }: {
    apiKey?: string;
}) => iUseLiskUsers;
