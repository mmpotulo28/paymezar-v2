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
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useCache } from "../hooks/useCache";
var API_BASE = process.env.NEXT_PUBLIC_LISK_API_BASE;
export function useLiskTransfer(_a) {
    var _this = this;
    var apiKey = _a.apiKey;
    var _b = useCache(), getCache = _b.getCache, setCache = _b.setCache;
    var _c = useState(undefined), recipient = _c[0], setRecipient = _c[1];
    var _d = useState(false), recipientLoading = _d[0], setRecipientLoading = _d[1];
    var _e = useState(undefined), recipientError = _e[0], setRecipientError = _e[1];
    var _f = useState(undefined), recipientMessage = _f[0], setRecipientMessage = _f[1];
    var _g = useState(false), transferLoading = _g[0], setTransferLoading = _g[1];
    var _h = useState(undefined), transferMessage = _h[0], setTransferMessage = _h[1];
    var _j = useState(undefined), transferError = _j[0], setTransferError = _j[1];
    var _k = useState(false), batchTransferLoading = _k[0], setBatchTransferLoading = _k[1];
    var _l = useState(undefined), batchTransferMessage = _l[0], setBatchTransferMessage = _l[1];
    var _m = useState(undefined), batchTransferError = _m[0], setBatchTransferError = _m[1];
    // reset all messages and errors after 3 seconds
    useEffect(function () {
        var timer = setTimeout(function () {
            setRecipientError(undefined);
            setRecipient(undefined);
        }, 3000);
        return function () { return clearTimeout(timer); };
    }, [recipientError]);
    // Fetch recipient details by payment identifier or email
    var fetchRecipient = useCallback(function (id) { return __awaiter(_this, void 0, void 0, function () {
        var cacheKey, cached, data, err_1;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    setRecipientLoading(true);
                    setRecipientError(undefined);
                    setRecipientMessage(undefined);
                    setRecipient(undefined);
                    cacheKey = "recipient_".concat(id);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, 4, 5]);
                    cached = getCache(cacheKey);
                    if (cached) {
                        setRecipient(cached);
                        setRecipientLoading(false);
                        return [2 /*return*/, cached];
                    }
                    return [4 /*yield*/, axios.get("".concat(API_BASE, "/recipient/").concat(id), {
                            headers: { Authorization: apiKey },
                        })];
                case 2:
                    data = (_d.sent()).data;
                    setRecipient(data);
                    setCache(cacheKey, data);
                    setRecipientMessage("Fetched recipient successfully.");
                    return [2 /*return*/, data];
                case 3:
                    err_1 = _d.sent();
                    if (((_a = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
                        setRecipientError("Recipient not found.");
                    }
                    else if (((_b = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _b === void 0 ? void 0 : _b.status) === 400) {
                        setRecipientError("Invalid identifier provided.");
                    }
                    else if (((_c = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _c === void 0 ? void 0 : _c.status) === 401) {
                        setRecipientError("Unauthorized.");
                    }
                    else {
                        setRecipientError("Failed to fetch recipient.");
                    }
                    return [3 /*break*/, 5];
                case 4:
                    setRecipientLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [apiKey, getCache, setCache]);
    // Single transfer
    var makeTransfer = useCallback(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var data, err_2;
        var _c, _d;
        var userId = _b.userId, transactionAmount = _b.transactionAmount, transactionRecipient = _b.transactionRecipient, transactionNotes = _b.transactionNotes;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    setTransferLoading(true);
                    setTransferMessage(undefined);
                    setTransferError(undefined);
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, axios.post("".concat(API_BASE, "/transfer/").concat(userId), {
                            transactionAmount: transactionAmount,
                            transactionRecipient: transactionRecipient,
                            transactionNotes: transactionNotes,
                        }, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: apiKey,
                            },
                        })];
                case 2:
                    data = (_e.sent()).data;
                    setTransferMessage(data.message || "Transfer executed successfully.");
                    return [2 /*return*/, data];
                case 3:
                    err_2 = _e.sent();
                    if (((_c = err_2 === null || err_2 === void 0 ? void 0 : err_2.response) === null || _c === void 0 ? void 0 : _c.status) === 400) {
                        setTransferError("Invalid input or validation error.");
                    }
                    else if (((_d = err_2 === null || err_2 === void 0 ? void 0 : err_2.response) === null || _d === void 0 ? void 0 : _d.status) === 401) {
                        setTransferError("Unauthorized.");
                    }
                    else {
                        setTransferError("Failed to execute transfer.");
                    }
                    return [3 /*break*/, 5];
                case 4:
                    setTransferLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [apiKey]);
    // Batch transfer
    var makeBatchTransfer = useCallback(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var data, err_3;
        var _c, _d;
        var userId = _b.userId, payments = _b.payments, transactionNotes = _b.transactionNotes;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    setBatchTransferLoading(true);
                    setBatchTransferMessage(undefined);
                    setBatchTransferError(undefined);
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, axios.post("".concat(API_BASE, "/transfer/batch/").concat(userId), {
                            payments: payments,
                            transactionNotes: transactionNotes,
                        }, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: apiKey,
                            },
                        })];
                case 2:
                    data = (_e.sent()).data;
                    setBatchTransferMessage(data.message || "Batch transfer executed successfully.");
                    return [2 /*return*/, data];
                case 3:
                    err_3 = _e.sent();
                    if (((_c = err_3 === null || err_3 === void 0 ? void 0 : err_3.response) === null || _c === void 0 ? void 0 : _c.status) === 400) {
                        setBatchTransferError("Invalid input or validation error.");
                    }
                    else if (((_d = err_3 === null || err_3 === void 0 ? void 0 : err_3.response) === null || _d === void 0 ? void 0 : _d.status) === 401) {
                        setBatchTransferError("Unauthorized.");
                    }
                    else {
                        setBatchTransferError("Failed to execute batch transfer.");
                    }
                    return [3 /*break*/, 5];
                case 4:
                    setBatchTransferLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [apiKey]);
    return {
        // recipient
        recipient: recipient,
        recipientLoading: recipientLoading,
        recipientError: recipientError,
        fetchRecipient: fetchRecipient,
        recipientMessage: recipientMessage,
        // single transfer
        transferLoading: transferLoading,
        transferMessage: transferMessage,
        transferError: transferError,
        makeTransfer: makeTransfer,
        // batch transfer
        batchTransferLoading: batchTransferLoading,
        batchTransferMessage: batchTransferMessage,
        batchTransferError: batchTransferError,
        makeBatchTransfer: makeBatchTransfer,
    };
}
