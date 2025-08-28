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
import { useLiskTransfer } from "./useLiskTransfer";
var API_BASE = process.env.NEXT_PUBLIC_LISK_API_BASE;
export function useLiskCharges(_a) {
    var _this = this;
    var apiKey = _a.apiKey, user = _a.user;
    var _b = useCache(), getCache = _b.getCache, setCache = _b.setCache;
    var _c = useLiskTransfer({ apiKey: apiKey }), makeTransfer = _c.makeTransfer, transferError = _c.transferError;
    var _d = useState([]), charges = _d[0], setCharges = _d[1];
    var _e = useState(false), chargesLoading = _e[0], setChargesLoading = _e[1];
    var _f = useState(undefined), chargesError = _f[0], setChargesError = _f[1];
    var _g = useState(undefined), charge = _g[0], setCharge = _g[1];
    // complete charge
    var _h = useState(false), completeChargeLoading = _h[0], setCompleteChargeLoading = _h[1];
    var _j = useState(undefined), completeChargeError = _j[0], setCompleteChargeError = _j[1];
    var _k = useState(undefined), completeChargeMessage = _k[0], setCompleteChargeMessage = _k[1];
    // reset all messages and errors after 3 seconds
    useEffect(function () {
        var timer = setTimeout(function () {
            setChargesError(undefined);
            setCharge(undefined);
        }, 3000);
        return function () { return clearTimeout(timer); };
    }, [chargesError, charge]);
    // Create a new charge
    var createCharge = function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var data, err_1;
        var _c, _d;
        var userId = _b.userId, paymentId = _b.paymentId, amount = _b.amount, note = _b.note;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    setChargesLoading(true);
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, axios.post("".concat(API_BASE, "/charge/").concat(userId, "/create"), { paymentId: paymentId, amount: amount, note: note }, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: apiKey,
                            },
                        })];
                case 2:
                    data = (_e.sent()).data;
                    setCharge(data);
                    return [2 /*return*/, data];
                case 3:
                    err_1 = _e.sent();
                    if (((_c = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _c === void 0 ? void 0 : _c.status) === 400)
                        setChargesError("Validation error.");
                    else if (((_d = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _d === void 0 ? void 0 : _d.status) === 401)
                        setChargesError("Unauthorized.");
                    else
                        setChargesError("Failed to create charge.");
                    return [3 /*break*/, 5];
                case 4:
                    setChargesLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/, undefined];
            }
        });
    }); };
    // Get all charges for a user
    var fetchCharges = useCallback(function (userId) { return __awaiter(_this, void 0, void 0, function () {
        var cacheKey, cached, data, err_2;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setChargesLoading(true);
                    setChargesError(undefined);
                    cacheKey = "user_charges_".concat(userId);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    cached = getCache(cacheKey);
                    if (cached) {
                        setCharges(cached);
                        setChargesLoading(false);
                        return [2 /*return*/, cached];
                    }
                    console.log("fetching charges", apiKey);
                    return [4 /*yield*/, axios.get("".concat(API_BASE, "/charge/").concat(userId), { headers: { Authorization: apiKey } })];
                case 2:
                    data = (_c.sent()).data;
                    setCharges(data.charges || []);
                    setCache(cacheKey, data.charges || []);
                    return [3 /*break*/, 5];
                case 3:
                    err_2 = _c.sent();
                    if (((_a = err_2 === null || err_2 === void 0 ? void 0 : err_2.response) === null || _a === void 0 ? void 0 : _a.status) === 400)
                        setChargesError("Invalid parameter.");
                    else if (((_b = err_2 === null || err_2 === void 0 ? void 0 : err_2.response) === null || _b === void 0 ? void 0 : _b.status) === 401)
                        setChargesError("Unauthorized.");
                    else
                        setChargesError("Failed to fetch charges.");
                    return [3 /*break*/, 5];
                case 4:
                    setChargesLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [apiKey, getCache, setCache]);
    // Get a specific charge by chargeId
    var getCharge = useCallback(function (chargeId) { return __awaiter(_this, void 0, void 0, function () {
        var data, err_3;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    setChargesLoading(true);
                    setChargesError(undefined);
                    setCharge(undefined);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, axios.get("".concat(API_BASE, "/retrieve-charge/").concat(chargeId), {
                            headers: { Authorization: apiKey },
                        })];
                case 2:
                    data = (_d.sent()).data;
                    console.log("Charge data:", data.charge);
                    setCharge(data.charge);
                    return [3 /*break*/, 5];
                case 3:
                    err_3 = _d.sent();
                    if (((_a = err_3 === null || err_3 === void 0 ? void 0 : err_3.response) === null || _a === void 0 ? void 0 : _a.status) === 400)
                        setChargesError("Invalid parameters.");
                    else if (((_b = err_3 === null || err_3 === void 0 ? void 0 : err_3.response) === null || _b === void 0 ? void 0 : _b.status) === 401)
                        setChargesError("Unauthorized.");
                    else if (((_c = err_3 === null || err_3 === void 0 ? void 0 : err_3.response) === null || _c === void 0 ? void 0 : _c.status) === 404)
                        setChargesError("Charge not found.");
                    else
                        setChargesError("Failed to fetch charge.");
                    return [3 /*break*/, 5];
                case 4:
                    setChargesLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/, undefined];
            }
        });
    }); }, [apiKey]);
    // Update a charge (note or status)
    var updateCharge = useCallback(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var data, err_4;
        var _c, _d, _e;
        var userId = _b.userId, chargeId = _b.chargeId, note = _b.note, status = _b.status;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    setChargesLoading(true);
                    setChargesError(undefined);
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, axios.put("".concat(API_BASE, "/charge/").concat(userId, "/").concat(chargeId, "/update"), { note: note, status: status }, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: apiKey,
                            },
                        })];
                case 2:
                    data = (_f.sent()).data;
                    setCharge(data);
                    return [2 /*return*/, data];
                case 3:
                    err_4 = _f.sent();
                    if (((_c = err_4 === null || err_4 === void 0 ? void 0 : err_4.response) === null || _c === void 0 ? void 0 : _c.status) === 400)
                        setChargesError("Validation error.");
                    else if (((_d = err_4 === null || err_4 === void 0 ? void 0 : err_4.response) === null || _d === void 0 ? void 0 : _d.status) === 401)
                        setChargesError("Unauthorized.");
                    else if (((_e = err_4 === null || err_4 === void 0 ? void 0 : err_4.response) === null || _e === void 0 ? void 0 : _e.status) === 404)
                        setChargesError("Charge not found.");
                    else
                        setChargesError("Failed to update charge.");
                    return [3 /*break*/, 5];
                case 4:
                    setChargesLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/, undefined];
            }
        });
    }); }, [apiKey]);
    // Delete a charge
    var deleteCharge = useCallback(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var data, err_5;
        var _c, _d;
        var userId = _b.userId, chargeId = _b.chargeId;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    setChargesLoading(true);
                    setChargesError(undefined);
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, axios.delete("".concat(API_BASE, "/charge/").concat(userId, "/").concat(chargeId, "/delete"), { headers: { Authorization: apiKey } })];
                case 2:
                    data = (_e.sent()).data;
                    return [2 /*return*/, data];
                case 3:
                    err_5 = _e.sent();
                    if (((_c = err_5 === null || err_5 === void 0 ? void 0 : err_5.response) === null || _c === void 0 ? void 0 : _c.status) === 400)
                        setChargesError("Invalid parameters.");
                    else if (((_d = err_5 === null || err_5 === void 0 ? void 0 : err_5.response) === null || _d === void 0 ? void 0 : _d.status) === 401)
                        setChargesError("Unauthorized.");
                    else
                        setChargesError("Failed to delete charge.");
                    return [3 /*break*/, 5];
                case 4:
                    setChargesLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [apiKey]);
    // complete a charge
    var completeCharge = useCallback(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var updateRes, err_6;
        var _c, _d;
        var userId = _b.userId, chargeId = _b.chargeId, afterComplete = _b.afterComplete;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    setCompleteChargeLoading(true);
                    setCompleteChargeError(undefined);
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 5, 6, 7]);
                    // request the charge first
                    return [4 /*yield*/, getCharge(chargeId)];
                case 2:
                    // request the charge first
                    _e.sent();
                    if (!charge)
                        throw new Error("Charge not found");
                    // 1. Do the transfer using the correct endpoint
                    console.log("Transferring charge", charge, userId);
                    return [4 /*yield*/, makeTransfer({
                            userId: userId,
                            transactionAmount: charge.amount || 0,
                            transactionNotes: charge.note || "",
                            transactionRecipient: charge.paymentId || "",
                        })];
                case 3:
                    _e.sent();
                    console.log("Transfer response:", transferError);
                    if (transferError) {
                        throw new Error(transferError || "Transfer failed");
                    }
                    // 2. Update the charge status to complete
                    console.log("Updating charge status to COMPLETE", charge.id);
                    return [4 /*yield*/, axios.request({
                            method: "PUT",
                            url: "https://seal-app-qp9cc.ondigitalocean.app/api/v1/charge/".concat(encodeURIComponent((user === null || user === void 0 ? void 0 : user.id) || ""), "/").concat(encodeURIComponent(charge.id), "/update"),
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: apiKey,
                            },
                            data: { status: "COMPLETE" },
                        })];
                case 4:
                    updateRes = _e.sent();
                    // 3. Perform any additional actions after completing the charge
                    console.log("now performing function after complete", updateRes.data);
                    afterComplete === null || afterComplete === void 0 ? void 0 : afterComplete();
                    setCompleteChargeMessage("Payment successful!");
                    return [3 /*break*/, 7];
                case 5:
                    err_6 = _e.sent();
                    if (((_c = err_6 === null || err_6 === void 0 ? void 0 : err_6.response) === null || _c === void 0 ? void 0 : _c.status) === 400)
                        setCompleteChargeError("Invalid parameters.");
                    else if (((_d = err_6 === null || err_6 === void 0 ? void 0 : err_6.response) === null || _d === void 0 ? void 0 : _d.status) === 401)
                        setCompleteChargeError("Unauthorized.");
                    else
                        setCompleteChargeError("Failed to complete charge.");
                    console.error("Failed to complete charge:", err_6);
                    return [3 /*break*/, 7];
                case 6:
                    setCompleteChargeLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); }, [apiKey, charge, getCharge, makeTransfer, transferError, user === null || user === void 0 ? void 0 : user.id]);
    return {
        charges: charges,
        chargesLoading: chargesLoading,
        chargesError: chargesError,
        fetchCharges: fetchCharges,
        charge: charge,
        getCharge: getCharge,
        createCharge: createCharge,
        updateCharge: updateCharge,
        deleteCharge: deleteCharge,
        // complete charge
        completeCharge: completeCharge,
        completeChargeError: completeChargeError,
        completeChargeMessage: completeChargeMessage,
        completeChargeLoading: completeChargeLoading,
    };
}
