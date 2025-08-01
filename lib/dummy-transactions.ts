import { iTransaction } from "@/types";

export const dummyTransactions: iTransaction[] = [
	{
		id: "1",
		userId: "user-1",
		externalId: null,
		txType: "transfer",
		method: "wallet",
		currency: "ZAR",
		value: 500,
		status: "Completed",
		createdAt: "2025-07-30T10:00:00Z",
	},
	{
		id: "2",
		userId: "user-1",
		externalId: null,
		txType: "transfer",
		method: "wallet",
		currency: "ZAR",
		value: 1200,
		status: "Pending",
		createdAt: "2025-07-29T15:30:00Z",
	},
	{
		id: "3",
		userId: "user-2",
		externalId: "ext-123",
		txType: "deposit",
		method: "bank",
		currency: "ZAR",
		value: 2000,
		status: "Completed",
		createdAt: "2025-07-28T09:15:00Z",
	},
];
