var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { useCallback, useState } from "react";
import axios from "axios";
import { useCache } from "../hooks/useCache";
var API_BASE = process.env.NEXT_PUBLIC_LISK_API_BASE;
/**
 * React hook for managing Lisk bank account operations and transactions.
 *
 * Provides functionality to:
 * - Create or update a user's bank account (`upsertBankAccount`)
 * - Fetch a user's bank account (`getBankAccount`)
 * - Delete a user's bank account (`deleteBankAccount`)
 * - Create a transaction (deposit or withdrawal) (`createTransaction`)
 * - Submit withdrawal requests (`withdraw`)
 * - Submit deposit requests (`deposit`)
 *
 * Handles loading, error, and success states for each operation.
 * Utilizes caching for bank account retrieval.
 *
 * @param apiKey - Optional API key for authentication.
 * @param user - The current user object.
 * @returns An object containing:
 * - `bankAccount`: The user's bank account information.
 * - `bankLoading`: Loading state for bank account operations.
 * - `bankError`: Error message for bank account operations.
 * - `bankMessage`: Success message for bank account operations.
 * - `upsertBankAccount`: Function to create or update a bank account.
 * - `getBankAccount`: Function to fetch a bank account.
 * - `deleteBankAccount`: Function to delete a bank account.
 * - `createTransaction`: Function to create a transaction.
 * - `withdraw`: Function to submit a withdrawal request.
 * - `withdrawError`: Error message for withdrawal operations.
 * - `withdrawLoading`: Loading state for withdrawal operations.
 * - `withdrawMessage`: Success message for withdrawal operations.
 * - `deposit`: Function to submit a deposit request.
 * - `depositError`: Error message for deposit operations.
 * - `depositLoading`: Loading state for deposit operations.
 * - `depositMessage`: Success message for deposit operations.
 */
export function useLiskBank(_a) {
    var _this = this;
    var apiKey = _a.apiKey, user = _a.user;
    var _b = useCache(), getCache = _b.getCache, setCache = _b.setCache;
    // bank account state
    var _c = useState(undefined), bankAccount = _c[0], setBankAccount = _c[1];
    var _d = useState(false), bankLoading = _d[0], setBankLoading = _d[1];
    var _e = useState(undefined), bankError = _e[0], setBankError = _e[1];
    var _f = useState(undefined), bankMessage = _f[0], setBankMessage = _f[1];
    // Withdrawal state
    var _g = useState(false), withdrawLoading = _g[0], setWithdrawLoading = _g[1];
    var _h = useState(null), withdrawMessage = _h[0], setWithdrawMessage = _h[1];
    var _j = useState(null), withdrawError = _j[0], setWithdrawError = _j[1];
    // Deposit state
    var _k = useState(false), depositLoading = _k[0], setDepositLoading = _k[1];
    var _l = useState(null), depositMessage = _l[0], setDepositMessage = _l[1];
    var _m = useState(null), depositError = _m[0], setDepositError = _m[1];
    var upsertBankAccount = useCallback(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var data, err_1;
        var _c, _d, _e;
        var userId = _b.userId, accountHolder = _b.accountHolder, accountNumber = _b.accountNumber, branchCode = _b.branchCode, bankName = _b.bankName;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    setBankLoading(true);
                    setBankError(undefined);
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 3, 4, 5]);
                    if (!apiKey)
                        throw new Error("API key is missing");
                    return [4 /*yield*/, axios.post("".concat(API_BASE, "/bank/").concat(encodeURIComponent(userId)), { accountHolder: accountHolder, accountNumber: accountNumber, branchCode: branchCode, bankName: bankName }, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: apiKey,
                            },
                        })];
                case 2:
                    data = (_f.sent()).data;
                    setBankAccount((_c = data.bankAccount) !== null && _c !== void 0 ? _c : undefined);
                    setBankMessage("Bank account created successfully");
                    return [2 /*return*/, data];
                case 3:
                    err_1 = _f.sent();
                    setBankError(((_e = (_d = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.message) || "Failed to upsert bank account");
                    return [3 /*break*/, 5];
                case 4:
                    setBankLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/, undefined];
            }
        });
    }); }, [apiKey]);
    var getBankAccount = useCallback(function (userId) { return __awaiter(_this, void 0, void 0, function () {
        var cacheKey, cached, data, err_2;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    setBankLoading(true);
                    setBankError(undefined);
                    cacheKey = "bank_account_".concat(userId);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, 4, 5]);
                    cached = getCache(cacheKey);
                    if (cached) {
                        setBankAccount(cached);
                        setBankLoading(false);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, axios.get("".concat(API_BASE, "/bank/").concat(encodeURIComponent(userId)), {
                            headers: {
                                Authorization: apiKey,
                            },
                        })];
                case 2:
                    data = (_d.sent()).data;
                    setBankAccount(data);
                    setCache(cacheKey, data);
                    return [2 /*return*/, data];
                case 3:
                    err_2 = _d.sent();
                    setBankError(((_b = (_a = err_2 === null || err_2 === void 0 ? void 0 : err_2.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) ||
                        (((_c = err_2 === null || err_2 === void 0 ? void 0 : err_2.response) === null || _c === void 0 ? void 0 : _c.status) === 404
                            ? "Bank account not found"
                            : "Failed to fetch bank account"));
                    return [3 /*break*/, 5];
                case 4:
                    setBankLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [apiKey, getCache, setCache]);
    var deleteBankAccount = useCallback(function (userId) { return __awaiter(_this, void 0, void 0, function () {
        var data, err_3;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    setBankLoading(true);
                    setBankError(undefined);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, axios.delete("".concat(API_BASE, "/bank/").concat(encodeURIComponent(userId)), {
                            headers: {
                                Authorization: apiKey,
                            },
                        })];
                case 2:
                    data = (_d.sent()).data;
                    setBankAccount(undefined);
                    setBankMessage("Bank account deleted successfully");
                    return [2 /*return*/, data];
                case 3:
                    err_3 = _d.sent();
                    setBankError(((_b = (_a = err_3 === null || err_3 === void 0 ? void 0 : err_3.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) ||
                        (((_c = err_3 === null || err_3 === void 0 ? void 0 : err_3.response) === null || _c === void 0 ? void 0 : _c.status) === 404
                            ? "Bank account not found"
                            : "Failed to delete bank account"));
                    return [3 /*break*/, 5];
                case 4:
                    setBankLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [apiKey]);
    var createTransaction = useCallback(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var data, err_4;
        var _c, _d;
        var userId = _b.userId, transactionType = _b.transactionType, transactionMethod = _b.transactionMethod, transactionCurrency = _b.transactionCurrency, transactionAmount = _b.transactionAmount, transactionNetwork = _b.transactionNetwork, transactionAddress = _b.transactionAddress;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    setBankLoading(true);
                    setBankError(undefined);
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, axios.post("".concat(API_BASE, "/create-transaction/").concat(encodeURIComponent(userId)), {
                            transactionType: transactionType,
                            transactionMethod: transactionMethod,
                            transactionCurrency: transactionCurrency,
                            transactionAmount: transactionAmount,
                            transactionNetwork: transactionNetwork,
                            transactionAddress: transactionAddress,
                        }, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: apiKey,
                            },
                        })];
                case 2:
                    data = (_e.sent()).data;
                    setBankMessage("Transaction created successfully");
                    return [2 /*return*/, data];
                case 3:
                    err_4 = _e.sent();
                    setBankError(((_d = (_c = err_4 === null || err_4 === void 0 ? void 0 : err_4.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) || "Failed to create transaction");
                    return [3 /*break*/, 5];
                case 4:
                    setBankLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [apiKey]);
    // Withdrawal
    var withdraw = useCallback(function (amount) { return __awaiter(_this, void 0, void 0, function () {
        var data, err_5;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setWithdrawLoading(true);
                    setWithdrawError(null);
                    if (!bankAccount || !user) {
                        setWithdrawError("Bank account or user not found");
                        setWithdrawLoading(false);
                        return [2 /*return*/];
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, createTransaction({
                            userId: (user === null || user === void 0 ? void 0 : user.id) || "",
                            transactionType: "withdraw",
                            transactionMethod: "bank",
                            transactionCurrency: "ZAR",
                            transactionAmount: Number(amount),
                            transactionNetwork: "lisk",
                            transactionAddress: bankAccount === null || bankAccount === void 0 ? void 0 : bankAccount.id,
                        })];
                case 2:
                    data = _c.sent();
                    setWithdrawMessage("Withdrawal request submitted successfully!");
                    return [2 /*return*/, data];
                case 3:
                    err_5 = _c.sent();
                    setWithdrawError(((_b = (_a = err_5 === null || err_5 === void 0 ? void 0 : err_5.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Failed to submit withdrawal.");
                    return [3 /*break*/, 5];
                case 4:
                    setWithdrawLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [bankAccount, createTransaction, user]);
    // deposit
    var deposit = useCallback(function (amount) { return __awaiter(_this, void 0, void 0, function () {
        var data, err_6;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setDepositLoading(true);
                    setDepositError(null);
                    if (!bankAccount || !user) {
                        setDepositError("Bank account or user not found");
                        setDepositLoading(false);
                        return [2 /*return*/];
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, createTransaction({
                            userId: (user === null || user === void 0 ? void 0 : user.id) || "",
                            transactionType: "deposit",
                            transactionMethod: "bank",
                            transactionCurrency: "ZAR",
                            transactionAmount: Number(amount),
                            transactionNetwork: "lisk",
                            transactionAddress: bankAccount.id,
                        })];
                case 2:
                    data = _c.sent();
                    setDepositMessage("Deposit request submitted successfully!");
                    return [2 /*return*/, data];
                case 3:
                    err_6 = _c.sent();
                    setDepositError(((_b = (_a = err_6 === null || err_6 === void 0 ? void 0 : err_6.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Failed to submit deposit.");
                    return [3 /*break*/, 5];
                case 4:
                    setDepositLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [bankAccount, createTransaction, user]);
    return {
        // bank account
        bankAccount: bankAccount,
        bankLoading: bankLoading,
        bankError: bankError,
        bankMessage: bankMessage,
        upsertBankAccount: upsertBankAccount,
        getBankAccount: getBankAccount,
        deleteBankAccount: deleteBankAccount,
        createTransaction: createTransaction,
        // withdrawal
        withdraw: withdraw,
        withdrawError: withdrawError,
        withdrawLoading: withdrawLoading,
        withdrawMessage: withdrawMessage,
        // deposit
        deposit: deposit,
        depositError: depositError,
        depositLoading: depositLoading,
        depositMessage: depositMessage,
    };
}
