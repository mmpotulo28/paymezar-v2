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
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useCache } from "../hooks/useCache";
var API_BASE = process.env.NEXT_PUBLIC_LISK_API_BASE;
export function useLiskTransactions(_a) {
    var _this = this;
    var apiKey = _a.apiKey;
    var _b = useCache(), getCache = _b.getCache, setCache = _b.setCache;
    var _c = useState([]), transactions = _c[0], setTransactions = _c[1];
    var _d = useState(false), transactionsLoading = _d[0], setTransactionsLoading = _d[1];
    var _e = useState(undefined), transactionsError = _e[0], setTransactionsError = _e[1];
    var _f = useState(undefined), transactionsMessage = _f[0], setTransactionsMessage = _f[1];
    var _g = useState(undefined), transaction = _g[0], setTransaction = _g[1];
    var _h = useState(false), transactionLoading = _h[0], setTransactionLoading = _h[1];
    var _j = useState(undefined), transactionError = _j[0], setTransactionError = _j[1];
    var _k = useState(undefined), transactionMessage = _k[0], setTransactionMessage = _k[1];
    // reset all messages and errors after 3 seconds
    useEffect(function () {
        var timer = setTimeout(function () {
            setTransactionsError(undefined);
            setTransactionError(undefined);
        }, 3000);
        return function () { return clearTimeout(timer); };
    }, [transactionsError, transactionError]);
    var fetchTransactions = useCallback(function (userId) { return __awaiter(_this, void 0, void 0, function () {
        var cacheKey, cached, data, err_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setTransactionsLoading(true);
                    setTransactionsError(undefined);
                    setTransactionsMessage(undefined);
                    cacheKey = "user_transactions_".concat(userId);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    cached = getCache(cacheKey);
                    if (cached) {
                        setTransactions(cached);
                        setTransactionsLoading(false);
                        return [2 /*return*/, __spreadArray([], cached, true)];
                    }
                    return [4 /*yield*/, axios.get("".concat(API_BASE, "/").concat(userId, "/transactions"), { headers: { Authorization: apiKey } })];
                case 2:
                    data = (_c.sent()).data;
                    setTransactions(data.transactions || []);
                    if (data.transactions)
                        setCache(cacheKey, data.transactions);
                    setTransactionsMessage("Fetched transactions successfully.");
                    return [2 /*return*/, data.transactions || []];
                case 3:
                    err_1 = _c.sent();
                    if (((_a = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _a === void 0 ? void 0 : _a.status) === 400)
                        setTransactionsError("Invalid user ID.");
                    else if (((_b = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _b === void 0 ? void 0 : _b.status) === 401)
                        setTransactionsError("Unauthorized.");
                    else
                        setTransactionsError("Failed to fetch transactions.");
                    console.error(err_1);
                    return [3 /*break*/, 5];
                case 4:
                    setTransactionsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/, []];
            }
        });
    }); }, [apiKey, getCache, setCache]);
    var fetchSingleTransaction = useCallback(function (userId, transactionId) { return __awaiter(_this, void 0, void 0, function () {
        var cacheKey, data, err_2;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    setTransactionLoading(true);
                    setTransactionError(undefined);
                    setTransactionMessage(undefined);
                    cacheKey = "transaction_".concat(userId, "_").concat(transactionId);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, axios.get("".concat(API_BASE, "/").concat(userId, "/transactions/").concat(transactionId), { headers: { Authorization: apiKey } })];
                case 2:
                    data = (_d.sent()).data;
                    setTransaction(data);
                    setTransactionMessage("Fetched transaction successfully.");
                    if (data)
                        setCache(cacheKey, data);
                    return [2 /*return*/, data];
                case 3:
                    err_2 = _d.sent();
                    if (((_a = err_2 === null || err_2 === void 0 ? void 0 : err_2.response) === null || _a === void 0 ? void 0 : _a.status) === 400)
                        setTransactionError("Invalid parameters.");
                    else if (((_b = err_2 === null || err_2 === void 0 ? void 0 : err_2.response) === null || _b === void 0 ? void 0 : _b.status) === 401)
                        setTransactionError("Unauthorized.");
                    else if (((_c = err_2 === null || err_2 === void 0 ? void 0 : err_2.response) === null || _c === void 0 ? void 0 : _c.status) === 404)
                        setTransactionError("Transaction not found.");
                    else
                        setTransactionError("Failed to fetch transaction.");
                    console.error(err_2);
                    return [3 /*break*/, 5];
                case 4:
                    setTransactionLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [apiKey, setCache]);
    return {
        transactions: transactions,
        transactionsLoading: transactionsLoading,
        transactionsError: transactionsError,
        fetchTransactions: fetchTransactions,
        transactionsMessage: transactionsMessage,
        transaction: transaction,
        transactionLoading: transactionLoading,
        transactionError: transactionError,
        fetchSingleTransaction: fetchSingleTransaction,
        transactionMessage: transactionMessage,
    };
}
