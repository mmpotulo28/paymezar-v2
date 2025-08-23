"use client";
import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { iUseLiskTransactions, useLiskTransactions } from "@/hooks/useLiskTransactions";
import { iUseLiskBank, useLiskBank } from "@/hooks/useLiskBank";
import { iUseLiskCharges, useLiskCharges } from "@/hooks/useLiskCharges";
import useSubscriptions, { iUseSubscriptions } from "@/hooks/useSubscriptions";
import { iUseLiskBalances, useLiskBalances } from "@/hooks/useLiskBalances";
import { iUseBusiness, useLiskBusiness } from "@/hooks/useLiskBusiness";
import { iUseStaff, useStaff } from "@/hooks/useStaff";
import { iUseLiskTransfer, useLiskTransfer } from "@/hooks/useLiskTransfer";
import { iUseLiskUsers, useLiskUsers } from "@/hooks/useLiskUsers";

interface AccountContextProps
	extends iUseLiskBalances,
		iUseBusiness,
		iUseLiskTransactions,
		iUseStaff,
		iUseSubscriptions,
		iUseLiskBank,
		iUseLiskCharges,
		iUseLiskTransfer,
		iUseLiskUsers {}

const AccountContext = createContext<AccountContextProps | undefined>(undefined);

export function useAccount(): AccountContextProps {
	const context = useContext(AccountContext);
	if (!context) {
		throw new Error("useAccount must be used within an AccountProvider");
	}
	return context;
}

export function AccountProvider({ children }: { children: ReactNode }) {
	const { user } = useUser();
	const { fetchTransactions } = useLiskTransactions();
	const { fetchBalances } = useLiskBalances();
	const { getBankAccount } = useLiskBank();
	const { fetchCharges } = useLiskCharges();
	const { fetchSubscriptions } = useSubscriptions();
	const fetchUsers = useLiskUsers().fetchUsers;

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
				...useLiskBalances(),
				...useLiskTransactions(),
				...useLiskBank(),
				...useLiskCharges(),
				...useSubscriptions(),
				...useLiskBusiness(),
				...useStaff(),
				...useLiskTransfer(),
				...useLiskUsers(),
			}}>
			{children}
		</AccountContext.Provider>
	);
}
