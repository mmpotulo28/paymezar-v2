"use client";
import React, { createContext, useContext, useEffect, ReactNode, useState } from "react";
import { useOrganization, useUser } from "@clerk/nextjs";
import {
	iUseLiskTransactions,
	useLiskTransactions,
} from "@/hooks/stablecoin-hooks/hooks/useLiskTransactions";
import { iUseLiskBank, useLiskBank } from "@/hooks/stablecoin-hooks/hooks/useLiskBank";
import { iUseLiskCharges, useLiskCharges } from "@/hooks/stablecoin-hooks/hooks/useLiskCharges";
import useSubscriptions, { iUseSubscriptions } from "@/hooks/useSubscriptions";
import { iUseLiskBalances, useLiskBalances } from "@/hooks/stablecoin-hooks/hooks/useLiskBalances";
import { iUseBusiness, useLiskBusiness } from "@/hooks/stablecoin-hooks/hooks/useLiskBusiness";
import { iUseLiskStaff, useLiskStaff } from "@/hooks/stablecoin-hooks/hooks/useLiskStaff";
import { iUseLiskTransfer, useLiskTransfer } from "@/hooks/stablecoin-hooks/hooks/useLiskTransfer";
import { iUseLiskUsers, useLiskUsers } from "@/hooks/stablecoin-hooks/hooks/useLiskUsers";

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

export function useAccount(): AccountContextProps {
	const context = useContext(AccountContext);
	if (!context) {
		throw new Error("useAccount must be used within an AccountProvider");
	}
	return context;
}

export function AccountProvider({
	children,
	mode = "user",
}: {
	children: ReactNode;
	mode?: "user" | "organization";
}) {
	const { user } = useUser();
	const { organization } = useOrganization();
	const [apiKey, setApiKey] = useState<string | undefined>(undefined);

	useEffect(() => {
		// Fetch API key
		const fetchApiKey = () => {
			const key = (
				mode === "user"
					? process.env.NEXT_PUBLIC_LISK_API_KEY
					: organization?.publicMetadata.apiToken
			) as string;

			console.log(`fetching api key for user: ${user?.id} in mode: ${mode}`);
			setApiKey(`Bearer ${key}`);
		};

		fetchApiKey();
	}, [user, organization, mode]);

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
