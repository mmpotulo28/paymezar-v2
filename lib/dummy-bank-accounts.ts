import { iBankAccount } from "@/types";
import { BANKS } from "./banks";

export const dummyBankAccounts: iBankAccount[] = [
	{
		id: "bank-1",
		userId: "user-1",
		accountHolder: "Jane Doe",
		accountNumber: "1234567890",
		branchCode: "250655",
		bank: "FNB",
		createdAt: "2025-07-01T09:00:00Z",
		updatedAt: "2025-07-30T10:00:00Z",
	},
	{
		id: "bank-2",
		userId: "user-1",
		accountHolder: "Jane Doe",
		accountNumber: "9876543210",
		branchCode: "632005",
		bank: "Standard Bank",
		createdAt: "2025-07-10T09:00:00Z",
		updatedAt: "2025-07-30T10:00:00Z",
	},
];
