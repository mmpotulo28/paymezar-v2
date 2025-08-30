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
import { useLiskCoupons, iUseLiskCoupons } from "@mmpotulo/stablecoin-hooks";

interface AccountContextProps
	extends iUseLiskBalances,
		iUseBusiness,
		iUseLiskTransactions,
		iUseLiskStaff,
		iUseSubscriptions,
		iUseLiskBank,
		iUseLiskCharges,
		iUseLiskTransfer,
		iUseLiskUsers,
		iUseLiskCoupons {}

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
}: {
	children: ReactNode;
	mode?: "user" | "organization";
}) {
	const { user } = useUser();
	const apiKey = process.env.NEXT_PUBLIC_LISK_API_KEY;
	const { fetchCoupons, createCoupon } = useLiskCoupons({ apiKey });
	const { transactions, fetchTransactions } = useLiskTransactions({ apiKey });
	const { fetchBalances } = useLiskBalances({ apiKey });
	const { getBankAccount } = useLiskBank({ apiKey, user });
	const { fetchCharges } = useLiskCharges({ apiKey, user });
	const { fetchSubscriptions } = useSubscriptions({ apiKey, user });
	const { fetchUsers } = useLiskUsers({ apiKey });

	const [initialTxCount, setInitialTxCount] = React.useState<number | null>(null);

	useEffect(() => {
		if (user?.id) {
			fetchTransactions(user.id).then(() => {
				setInitialTxCount(transactions.length);
			});
			fetchCoupons();
		}
	}, [fetchCoupons, fetchTransactions, transactions.length, user?.id]);

	useEffect(() => {
		const hasInitialTxCount = initialTxCount !== null;
		const hasEnoughTransactions =
			hasInitialTxCount && transactions.length >= (initialTxCount as number) * 5;
		const hasUserId = !!user?.id;

		if (hasInitialTxCount && hasEnoughTransactions && hasUserId) {
			// Only create coupon once per 5x increase
			createCoupon(user?.id, {
				title: "Super Transactor!",
				imageUrl: null,
				description: "Congrats! You transacted 5x more than when you joined.",
				code: `SUPER-${user?.id}-${Date.now()}`,
				ref: user?.id,
				validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week
				maxCoupons: 1,
				availableCoupons: 1,
			});
			setInitialTxCount(transactions.length); // reset baseline
		}
	}, [transactions.length, initialTxCount, user?.id, createCoupon]);

	// fetch everything initially
	useEffect(() => {
		if (!user) return;
		fetchBalances(user?.id);
		getBankAccount(user?.id);
		fetchCharges(user?.id);
		fetchSubscriptions(user?.id);
		fetchTransactions(user?.id);
		fetchUsers();
		fetchCoupons();
	}, [
		fetchTransactions,
		fetchBalances,
		getBankAccount,
		fetchCharges,
		fetchSubscriptions,
		fetchUsers,
		user,
		fetchCoupons,
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
				...useLiskCoupons({ apiKey }),
			}}>
			{children}
		</AccountContext.Provider>
	);
}
