"use client";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useCache } from "../hooks/useCache";
var API_BASE = process.env.NEXT_PUBLIC_LISK_API_BASE;
/**
 * Custom React hook for managing Lisk business operations, including:
 * - Fetching float (token) balances
 * - Enabling gas for business and users
 * - Minting stablecoins
 * - Fetching pending transactions
 * - Managing loading, success, and error states for each operation
 * - Caching results to optimize API calls
 *
 * @param apiKey - Optional API key for authentication with backend services.
 * @returns An object containing state variables, loading/error indicators, and functions for:
 *   - float: Array of user token balances
 *   - loadingFloat: Loading state for float balances
 *   - floatError: Error message for float balance fetch
 *   - fetchFloat: Function to fetch float balances
 *   - gasLoading, gasSuccess, gasError: States for enabling business gas
 *   - enableBusinessGas: Function to enable business gas
 *   - userGasLoading, userGasSuccess, userGasError: States for enabling user gas
 *   - enableUserGas: Function to enable gas for a specific user
 *   - mintForm: Form state for minting stablecoins
 *   - setMintForm: Setter for mintForm
 *   - mintLoading, mintSuccess, mintError: States for minting stablecoins
 *   - mintStableCoins: Function to mint stablecoins
 *   - pendingTx: Array of pending transactions
 *   - pendingLoading, pendingError: States for fetching pending transactions
 *   - fetchPendingTx: Function to fetch paginated pending transactions
 *
 * @remarks
 * This hook is intended for use in business-related components that interact with the Lisk stablecoin backend.
 * It handles API communication, caching, and state management for common business operations.
 */
export function useLiskBusiness(_a) {
    var _this = this;
    var apiKey = _a.apiKey;
    var _b = useState([]), float = _b[0], setFloat = _b[1];
    var _c = useState(false), loadingFloat = _c[0], setLoadingFloat = _c[1];
    var _d = useState(undefined), floatError = _d[0], setFloatError = _d[1];
    var _e = useCache(), getCache = _e.getCache, setCache = _e.setCache;
    var _f = useState(false), gasLoading = _f[0], setGasLoading = _f[1];
    var _g = useState(undefined), gasSuccess = _g[0], setGasSuccess = _g[1];
    var _h = useState(undefined), gasError = _h[0], setGasError = _h[1];
    var _j = useState({
        transactionAmount: "",
        transactionRecipient: "",
        transactionNotes: "",
    }), mintForm = _j[0], setMintForm = _j[1];
    var _k = useState(false), mintLoading = _k[0], setMintLoading = _k[1];
    var _l = useState(undefined), mintSuccess = _l[0], setMintSuccess = _l[1];
    var _m = useState(undefined), mintError = _m[0], setMintError = _m[1];
    var _o = useState([]), pendingTx = _o[0], setPendingTx = _o[1];
    var _p = useState(false), pendingLoading = _p[0], setPendingLoading = _p[1];
    var _q = useState(undefined), pendingError = _q[0], setPendingError = _q[1];
    var _r = useState(false), userGasLoading = _r[0], setUserGasLoading = _r[1];
    var _s = useState(undefined), userGasSuccess = _s[0], setUserGasSuccess = _s[1];
    var _t = useState(undefined), userGasError = _t[0], setUserGasError = _t[1];
    // Fetch float balances
    var fetchFloat = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var cacheKey, cached, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoadingFloat(true);
                    setFloatError(undefined);
                    if (apiKey)
                        return [2 /*return*/];
                    cacheKey = "float_balances";
                    cached = getCache(cacheKey);
                    if (cached) {
                        setFloat(cached);
                        setLoadingFloat(false);
                        return [2 /*return*/, cached];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, axios.get("".concat(API_BASE, "/float"), {
                            headers: { Authorization: apiKey },
                        })];
                case 2:
                    data = (_a.sent()).data;
                    setFloat(data.tokens || []);
                    setCache(cacheKey, data.tokens || []);
                    return [2 /*return*/, data.tokens || []];
                case 3:
                    err_1 = _a.sent();
                    setFloatError("Failed to fetch token balances.");
                    console.error("Failed to fetch token balances:", err_1);
                    return [3 /*break*/, 5];
                case 4:
                    setLoadingFloat(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/, []];
            }
        });
    }); }, [apiKey, getCache, setCache]);
    // Enable gas
    var enableBusinessGas = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var data, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setGasLoading(true);
                    setGasSuccess(undefined);
                    setGasError(undefined);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, axios.post("".concat(API_BASE, "/enable-gas"), {}, { headers: { Authorization: apiKey } })];
                case 2:
                    data = (_a.sent()).data;
                    setGasSuccess("Gas allocation successful.");
                    return [2 /*return*/, data];
                case 3:
                    err_2 = _a.sent();
                    setGasError("Failed to enable gas.");
                    console.error("Failed to enable gas:", err_2);
                    return [3 /*break*/, 5];
                case 4:
                    setGasLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [apiKey]);
    // Enable gas for a user
    var enableUserGas = useCallback(function (userId) { return __awaiter(_this, void 0, void 0, function () {
        var err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUserGasLoading(true);
                    setUserGasSuccess(undefined);
                    setUserGasError(undefined);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, axios.post("".concat(API_BASE, "/activate-pay/").concat(userId), {}, { headers: { Authorization: apiKey } })];
                case 2:
                    _a.sent();
                    setUserGasSuccess("Gas payment activated successfully for user.");
                    return [3 /*break*/, 5];
                case 3:
                    err_3 = _a.sent();
                    setUserGasError("Failed to activate gas payment for user.");
                    console.error("Failed to activate gas payment for user:", err_3);
                    return [3 /*break*/, 5];
                case 4:
                    setUserGasLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [apiKey]);
    // Mint stableCoins
    var mintStableCoins = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var data, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setMintLoading(true);
                    setMintSuccess(undefined);
                    setMintError(undefined);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, axios.post("".concat(API_BASE, "/mint"), {
                            transactionAmount: Number(mintForm.transactionAmount),
                            transactionRecipient: mintForm.transactionRecipient,
                            transactionNotes: mintForm.transactionNotes,
                        }, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: apiKey,
                            },
                        })];
                case 2:
                    data = (_a.sent()).data;
                    setMintSuccess(data.message || "Mint operation successful.");
                    setMintForm({ transactionAmount: "", transactionRecipient: "", transactionNotes: "" });
                    fetchFloat();
                    return [2 /*return*/, data];
                case 3:
                    err_4 = _a.sent();
                    setMintError("Failed to mint tokens.");
                    console.error(err_4);
                    return [3 /*break*/, 5];
                case 4:
                    setMintLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [
        apiKey,
        fetchFloat,
        mintForm.transactionAmount,
        mintForm.transactionNotes,
        mintForm.transactionRecipient,
    ]);
    // Fetch paginated pending transactions
    var fetchPendingTx = useCallback(function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(_this, __spreadArray([], args_1, true), void 0, function (page, pageSize) {
            var cacheKey, cached, data, err_5;
            if (page === void 0) { page = 1; }
            if (pageSize === void 0) { pageSize = 10; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setPendingLoading(true);
                        setPendingError(undefined);
                        if (apiKey)
                            return [2 /*return*/];
                        cacheKey = "pending_tx";
                        cached = getCache(cacheKey);
                        if (cached) {
                            setPendingTx(cached);
                            setPendingLoading(false);
                            return [2 /*return*/, cached];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, axios.get("".concat(API_BASE, "/transactions/pending?page=").concat(page, "&pageSize=").concat(pageSize), {
                                headers: { Authorization: apiKey },
                            })];
                    case 2:
                        data = (_a.sent()).data;
                        setPendingTx(data.transactions);
                        setCache(cacheKey, data);
                        return [2 /*return*/, data];
                    case 3:
                        err_5 = _a.sent();
                        setPendingError("Failed to fetch pending transactions.");
                        console.error("Failed to fetch pending transactions:", err_5);
                        return [3 /*break*/, 5];
                    case 4:
                        setPendingLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/, []];
                }
            });
        });
    }, [apiKey, getCache, setCache]);
    useEffect(function () {
        fetchFloat();
        fetchPendingTx(1, 10);
    }, [fetchFloat, fetchPendingTx]);
    return {
        float: float,
        loadingFloat: loadingFloat,
        floatError: floatError,
        fetchFloat: fetchFloat,
        gasLoading: gasLoading,
        gasSuccess: gasSuccess,
        gasError: gasError,
        enableBusinessGas: enableBusinessGas,
        userGasLoading: userGasLoading,
        userGasSuccess: userGasSuccess,
        userGasError: userGasError,
        enableUserGas: enableUserGas,
        mintForm: mintForm,
        setMintForm: setMintForm,
        mintLoading: mintLoading,
        mintSuccess: mintSuccess,
        mintError: mintError,
        mintStableCoins: mintStableCoins,
        pendingTx: pendingTx,
        pendingLoading: pendingLoading,
        pendingError: pendingError,
        fetchPendingTx: fetchPendingTx,
    };
}
