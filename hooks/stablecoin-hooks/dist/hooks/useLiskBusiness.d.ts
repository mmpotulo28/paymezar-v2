import { iMintStableCoinsResponse, iPendingTx, iPendingTxResponse, iUserTokenBalance } from "../types";
export interface iUseBusiness {
    float: iUserTokenBalance[];
    loadingFloat: boolean;
    floatError: string | undefined;
    fetchFloat: () => Promise<iUserTokenBalance[]>;
    gasLoading: boolean;
    gasSuccess: string | undefined;
    gasError: string | undefined;
    enableBusinessGas: () => Promise<void>;
    enableUserGas: (userId: string) => Promise<void>;
    mintForm: {
        transactionAmount: string;
        transactionRecipient: string;
        transactionNotes: string;
    };
    mintLoading: boolean;
    mintSuccess: string | undefined;
    mintError: string | undefined;
    setMintForm: React.Dispatch<React.SetStateAction<{
        transactionAmount: string;
        transactionRecipient: string;
        transactionNotes: string;
    }>>;
    mintStableCoins: () => Promise<iMintStableCoinsResponse | undefined>;
    pendingTx: iPendingTx[];
    pendingLoading: boolean;
    pendingError: string | undefined;
    fetchPendingTx: () => Promise<iPendingTxResponse>;
    userGasLoading: boolean;
    userGasSuccess: string | undefined;
    userGasError: string | undefined;
}
export declare function useLiskBusiness({ apiKey }: {
    apiKey?: string;
}): iUseBusiness;
