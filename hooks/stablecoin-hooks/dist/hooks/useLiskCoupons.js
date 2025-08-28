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
export function useCoupons(_a) {
    var _this = this;
    var apiKey = _a.apiKey;
    var _b = useCache(), getCache = _b.getCache, setCache = _b.setCache;
    var _c = useState([]), coupons = _c[0], setCoupons = _c[1];
    var _d = useState(false), loading = _d[0], setLoading = _d[1];
    var _e = useState(undefined), error = _e[0], setError = _e[1];
    // Get all coupons
    var fetchCoupons = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var cacheKey, cached, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(undefined);
                    cacheKey = "coupons";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    cached = getCache(cacheKey);
                    if (cached) {
                        setCoupons(cached);
                        setLoading(false);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, axios.get("".concat(API_BASE, "/coupons"), {
                            headers: { Authorization: apiKey },
                        })];
                case 2:
                    data = (_a.sent()).data;
                    setCoupons(data);
                    setCache(cacheKey, data);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    setError("Failed to fetch coupons.");
                    console.error(err_1);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [apiKey, getCache, setCache]);
    // Create a new coupon for a user
    var createCoupon = useCallback(function (userId, coupon) { return __awaiter(_this, void 0, void 0, function () {
        var data, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(undefined);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, axios.post("".concat(API_BASE, "/coupons/").concat(encodeURIComponent(userId)), coupon, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: apiKey,
                            },
                        })];
                case 2:
                    data = (_a.sent()).data;
                    return [4 /*yield*/, fetchCoupons()];
                case 3:
                    _a.sent();
                    return [2 /*return*/, data];
                case 4:
                    err_2 = _a.sent();
                    setError("Failed to create coupon.");
                    console.error(err_2);
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [apiKey, fetchCoupons]);
    // Claim a coupon for a user
    var claimCoupon = useCallback(function (userId, couponId) { return __awaiter(_this, void 0, void 0, function () {
        var data, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(undefined);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, axios.patch("".concat(API_BASE, "/coupons/claim/").concat(encodeURIComponent(userId)), { couponId: couponId }, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: apiKey,
                            },
                        })];
                case 2:
                    data = (_a.sent()).data;
                    return [4 /*yield*/, fetchCoupons()];
                case 3:
                    _a.sent();
                    return [2 /*return*/, data];
                case 4:
                    err_3 = _a.sent();
                    setError("Failed to claim coupon.");
                    console.error(err_3);
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [apiKey, fetchCoupons]);
    // Update a coupon for a user
    var updateCoupon = useCallback(function (userId, couponId, coupon) { return __awaiter(_this, void 0, void 0, function () {
        var data, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(undefined);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, axios.put("".concat(API_BASE, "/coupons/").concat(encodeURIComponent(userId), "/").concat(encodeURIComponent(couponId)), coupon, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: apiKey,
                            },
                        })];
                case 2:
                    data = (_a.sent()).data;
                    return [4 /*yield*/, fetchCoupons()];
                case 3:
                    _a.sent();
                    return [2 /*return*/, data];
                case 4:
                    err_4 = _a.sent();
                    setError("Failed to update coupon.");
                    console.error(err_4);
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [apiKey, fetchCoupons]);
    // Delete a coupon for a user
    var deleteCoupon = useCallback(function (userId, couponId) { return __awaiter(_this, void 0, void 0, function () {
        var err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(undefined);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, axios.delete("".concat(API_BASE, "/coupons/").concat(encodeURIComponent(userId), "/").concat(encodeURIComponent(couponId)), {
                            headers: {
                                Authorization: apiKey,
                            },
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fetchCoupons()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    err_5 = _a.sent();
                    setError("Failed to delete coupon.");
                    console.error(err_5);
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [apiKey, fetchCoupons]);
    return {
        coupons: coupons,
        loading: loading,
        error: error,
        fetchCoupons: fetchCoupons,
        createCoupon: createCoupon,
        claimCoupon: claimCoupon,
        updateCoupon: updateCoupon,
        deleteCoupon: deleteCoupon,
    };
}
