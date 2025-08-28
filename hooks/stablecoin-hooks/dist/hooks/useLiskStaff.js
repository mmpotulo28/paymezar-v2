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
import { useCache } from "./useCache";
var API_BASE = process.env.NEXT_PUBLIC_LISK_API_BASE;
export function useLiskStaff(_a) {
    var _this = this;
    var apiKey = _a.apiKey;
    var _b = useCache(), getCache = _b.getCache, setCache = _b.setCache;
    // fetchStaff states
    var _c = useState([]), staff = _c[0], setStaff = _c[1];
    var _d = useState(false), staffLoading = _d[0], setStaffLoading = _d[1];
    var _e = useState(undefined), staffError = _e[0], setStaffError = _e[1];
    var _f = useState(undefined), staffMessage = _f[0], setStaffMessage = _f[1];
    // assignStaff states
    var _g = useState(false), assignStaffLoading = _g[0], setAssignStaffLoading = _g[1];
    var _h = useState(undefined), assignStaffError = _h[0], setAssignStaffError = _h[1];
    var _j = useState(undefined), assignStaffMessage = _j[0], setAssignStaffMessage = _j[1];
    // removeStaff states
    var _k = useState(false), removeStaffLoading = _k[0], setRemoveStaffLoading = _k[1];
    var _l = useState(undefined), removeStaffError = _l[0], setRemoveStaffError = _l[1];
    var _m = useState(undefined), removeStaffMessage = _m[0], setRemoveStaffMessage = _m[1];
    // reset assign/remove states after 3 seconds
    useEffect(function () {
        var timer = setTimeout(function () {
            setAssignStaffError(undefined);
            setAssignStaffMessage(undefined);
            setRemoveStaffError(undefined);
            setRemoveStaffMessage(undefined);
        }, 3000);
        return function () { return clearTimeout(timer); };
    }, [assignStaffError, assignStaffMessage, removeStaffError, removeStaffMessage]);
    var fetchStaff = useCallback(function (merchantId) { return __awaiter(_this, void 0, void 0, function () {
        var cacheKey, cached, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setStaffLoading(true);
                    setStaffError(undefined);
                    setStaffMessage(undefined);
                    cacheKey = "staff_list_".concat(merchantId);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    cached = getCache(cacheKey);
                    if (cached) {
                        setStaff(cached);
                        setStaffLoading(false);
                        setStaffMessage("Fetched staff from cache.");
                        return [2 /*return*/, cached];
                    }
                    return [4 /*yield*/, axios.get("".concat(API_BASE, "/staff/").concat(encodeURIComponent(merchantId)), { headers: { Authorization: apiKey } })];
                case 2:
                    data = (_a.sent()).data;
                    setStaff(data);
                    setCache(cacheKey, data);
                    setStaffMessage("Fetched staff successfully.");
                    return [2 /*return*/, data];
                case 3:
                    err_1 = _a.sent();
                    setStaffError("Failed to fetch staff (".concat(err_1.message || "Unknown error", ")."));
                    return [3 /*break*/, 5];
                case 4:
                    setStaffLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/, []];
            }
        });
    }); }, [apiKey, getCache, setCache]);
    var assignStaff = useCallback(function (merchantId, input) { return __awaiter(_this, void 0, void 0, function () {
        var data, err_2;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setAssignStaffLoading(true);
                    setAssignStaffError(undefined);
                    setAssignStaffMessage(undefined);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, axios.post("".concat(API_BASE, "/staff/").concat(encodeURIComponent(merchantId)), { input: input }, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: apiKey,
                            },
                        })];
                case 2:
                    data = (_c.sent()).data;
                    setAssignStaffMessage(data.success ? "Staff assigned successfully." : "Failed to assign staff.");
                    return [4 /*yield*/, fetchStaff(merchantId)];
                case 3:
                    _c.sent();
                    return [2 /*return*/, data];
                case 4:
                    err_2 = _c.sent();
                    setAssignStaffError(((_b = (_a = err_2.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Failed to assign staff.");
                    return [3 /*break*/, 6];
                case 5:
                    setAssignStaffLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [apiKey, fetchStaff]);
    var removeStaff = useCallback(function (merchantId, staffId) { return __awaiter(_this, void 0, void 0, function () {
        var data, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setRemoveStaffLoading(true);
                    setRemoveStaffError(undefined);
                    setRemoveStaffMessage(undefined);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, axios.delete("".concat(API_BASE, "/staff/").concat(encodeURIComponent(merchantId), "/").concat(encodeURIComponent(staffId)), {
                            headers: {
                                Authorization: apiKey,
                            },
                        })];
                case 2:
                    data = (_a.sent()).data;
                    setRemoveStaffMessage(data.success ? "Staff removed successfully." : "Failed to remove staff.");
                    return [4 /*yield*/, fetchStaff(merchantId)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, data];
                case 4:
                    err_3 = _a.sent();
                    setRemoveStaffError("Failed to remove staff.");
                    console.error(err_3);
                    return [3 /*break*/, 6];
                case 5:
                    setRemoveStaffLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [apiKey, fetchStaff]);
    return {
        staff: staff,
        staffLoading: staffLoading,
        staffError: staffError,
        staffMessage: staffMessage,
        fetchStaff: fetchStaff,
        assignStaff: assignStaff,
        assignStaffLoading: assignStaffLoading,
        assignStaffError: assignStaffError,
        assignStaffMessage: assignStaffMessage,
        removeStaff: removeStaff,
        removeStaffLoading: removeStaffLoading,
        removeStaffError: removeStaffError,
        removeStaffMessage: removeStaffMessage,
    };
}
