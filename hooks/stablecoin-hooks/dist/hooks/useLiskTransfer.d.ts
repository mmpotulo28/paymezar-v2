export interface iUseLiskTransfer {
    recipient: any;
    recipientLoading: boolean;
    recipientError: string | undefined;
    fetchRecipient: (id: string) => Promise<any>;
    transferLoading: boolean;
    transferMessage: string | undefined;
    transferError: string | undefined;
    makeTransfer: ({ userId, transactionAmount, transactionRecipient, transactionNotes, }: {
        userId: string;
        transactionAmount: number;
        transactionRecipient: string;
        transactionNotes?: string;
    }) => Promise<void>;
    batchTransferLoading: boolean;
    batchTransferMessage: string | undefined;
    batchTransferError: string | undefined;
    makeBatchTransfer: ({ userId, payments, transactionNotes, }: {
        userId: string;
        payments: {
            recipient: string;
            amount: number;
        }[];
        transactionNotes?: string;
    }) => Promise<void>;
}
export declare function useLiskTransfer({ apiKey }: {
    apiKey?: string;
}): iUseLiskTransfer;
