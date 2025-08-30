"use client";
import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import {
	iUseBusiness,
	iUseLiskBalances,
	iUseLiskBank,
	iUseLiskCharges,
	iUseLiskStaff,
	iUseLiskTransactions,
	iUseLiskTransfer,
	iUseLiskUsers,
	useLiskBalances,
	useLiskBank,
	useLiskBusiness,
	useLiskCharges,
	useLiskStaff,
	useLiskTransactions,
	useLiskTransfer,
	useLiskUsers,
} from "@mmpotulo/stablecoin-hooks";
import useSubscriptions, { iUseSubscriptions } from "@/hooks/useSubscriptions";

interface AccountContextProps
	extends iUseLiskBalances,
		iUseBusiness,
		iUseLiskTransactions,
		iUseLiskStaff,
		iUseSubscriptions,
		iUseLiskBank,
		iUseLiskCharges,
		iUseLiskTransfer,
		iUseLiskUsers {}

const AccountContext = createContext<AccountContextProps | undefined>(undefined);
const apiKey = process.env.NEXT_PUBLIC_LISK_API_KEY;

export function useAccount(): AccountContextProps {
	const context = useContext(AccountContext);
	if (!context) {
		throw new Error("useAccount must be used within an AccountProvider");
	}
	return context;
}

export function AccountProvider({
	children,
}: {
	children: ReactNode;
	mode?: "user" | "organization";
}) {
	const { user } = useUser();

	const { fetchTransactions } = useLiskTransactions({ apiKey });
	const { fetchBalances } = useLiskBalances({ apiKey });
	const { getBankAccount } = useLiskBank({ apiKey, user });
	const { fetchCharges } = useLiskCharges({ apiKey, user });
	const { fetchSubscriptions } = useSubscriptions({ apiKey, user });
	const fetchUsers = useLiskUsers({ apiKey }).fetchUsers;

	useEffect(() => {
		if (!user) return;
		fetchBalances(user?.id);
		getBankAccount(user?.id);
		fetchCharges(user?.id);
		fetchSubscriptions(user?.id);
		fetchTransactions(user?.id);
		fetchUsers();
	}, [
		fetchTransactions,
		fetchBalances,
		getBankAccount,
		fetchCharges,
		fetchSubscriptions,
		fetchUsers,
		user,
	]);

	return (
		<AccountContext.Provider
			value={{
				...useLiskBalances({ apiKey }),
				...useLiskTransactions({ apiKey }),
				...useLiskBank({ apiKey, user }),
				...useLiskCharges({ apiKey, user }),
				...useSubscriptions({ apiKey, user }),
				...useLiskBusiness({ apiKey }),
				...useLiskStaff({ apiKey }),
				...useLiskTransfer({ apiKey }),
				...useLiskUsers({ apiKey }),
			}}>
			{children}
		</AccountContext.Provider>
	);
}
