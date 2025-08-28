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
 * Custom React hook for managing API tokens via the Lisk API.
 *
 * Provides functionality to fetch, create, update, and revoke API tokens,
 * with built-in caching and loading/error state management.
 *
 * @param apiKey - Optional API key used for authorization in requests.
 * @returns An object containing:
 * - `tokens`: Array of fetched API tokens.
 * - `apiTokenLoading`: Loading state for fetching tokens.
 * - `apiTokenError`: Error message for fetching tokens.
 * - `fetchTokens`: Function to fetch tokens from the API.
 * - `createToken`: Function to create a new API token.
 * - `createTokenLoading`: Loading state for creating a token.
 * - `createTokenError`: Error message for creating a token.
 * - `createdToken`: Response data for the created token.
 * - `updateToken`: Function to update an existing token's description.
 * - `updateTokenLoading`: Loading state for updating a token.
 * - `updateTokenError`: Error message for updating a token.
 * - `revokeToken`: Function to revoke an API token.
 * - `revokeTokenLoading`: Loading state for revoking a token.
 * - `revokeTokenError`: Error message for revoking a token.
 * - `revokeTokenSuccess`: Success message for revoking a token.
 */
export function useLiskApiTokens(_a) {
    var _this = this;
    var apiKey = _a.apiKey;
    var _b = useCache(), getCache = _b.getCache, setCache = _b.setCache;
    var _c = useState([]), tokens = _c[0], setTokens = _c[1];
    var _d = useState(false), apiTokenLoading = _d[0], setApiTokenLoading = _d[1];
    var _e = useState(undefined), apiTokenError = _e[0], setApiTokenError = _e[1];
    var _f = useState(undefined), apiTokenMessage = _f[0], setApiTokenMessage = _f[1];
    var _g = useState(false), createTokenLoading = _g[0], setCreateTokenLoading = _g[1];
    var _h = useState(undefined), createTokenError = _h[0], setCreateTokenError = _h[1];
    var _j = useState(undefined), createTokenMessage = _j[0], setCreateTokenMessage = _j[1];
    var _k = useState(undefined), createdToken = _k[0], setCreatedToken = _k[1];
    var _l = useState(false), updateTokenLoading = _l[0], setUpdateTokenLoading = _l[1];
    var _m = useState(undefined), updateTokenError = _m[0], setUpdateTokenError = _m[1];
    var _o = useState(undefined), updateTokenMessage = _o[0], setUpdateTokenMessage = _o[1];
    var _p = useState(false), revokeTokenLoading = _p[0], setRevokeTokenLoading = _p[1];
    var _q = useState(undefined), revokeTokenError = _q[0], setRevokeTokenError = _q[1];
    var _r = useState(undefined), revokeTokenMessage = _r[0], setRevokeTokenMessage = _r[1];
    var fetchTokens = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var cacheKey, cached, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cacheKey = "api_tokens";
                    setApiTokenLoading(true);
                    setApiTokenError(undefined);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    cached = getCache(cacheKey);
                    if (cached) {
                        setTokens(cached);
                        setApiTokenLoading(false);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, axios.get("".concat(API_BASE, "/tokens"), {
                            headers: {
                                Authorization: apiKey,
                            },
                        })];
                case 2:
                    data = (_a.sent()).data;
                    setTokens(data);
                    setCache(cacheKey, data);
                    setApiTokenMessage("Tokens fetched successfully.");
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    setApiTokenError("Failed to fetch tokens.");
                    console.error("Error fetching tokens:", err_1);
                    return [3 /*break*/, 5];
                case 4:
                    setApiTokenLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [apiKey, getCache, setCache]);
    var createToken = useCallback(function (description) { return __awaiter(_this, void 0, void 0, function () {
        var data, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setCreateTokenLoading(true);
                    setCreateTokenError(undefined);
                    setCreatedToken(undefined);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, axios.post("".concat(API_BASE, "/tokens"), { description: description }, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: apiKey,
                            },
                        })];
                case 2:
                    data = (_a.sent()).data;
                    setCreatedToken(data);
                    setCreateTokenMessage("Token created successfully.");
                    fetchTokens();
                    return [3 /*break*/, 5];
                case 3:
                    err_2 = _a.sent();
                    setCreateTokenError("Failed to create token.");
                    console.error("Error creating token:", err_2);
                    return [3 /*break*/, 5];
                case 4:
                    setCreateTokenLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [apiKey, fetchTokens]);
    var updateToken = useCallback(function (id, description) { return __awaiter(_this, void 0, void 0, function () {
        var err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpdateTokenLoading(true);
                    setUpdateTokenError(undefined);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, axios.patch("".concat(API_BASE, "/tokens/").concat(id), { description: description }, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: apiKey,
                            },
                        })];
                case 2:
                    _a.sent();
                    fetchTokens();
                    setUpdateTokenMessage("Token updated successfully.");
                    return [3 /*break*/, 5];
                case 3:
                    err_3 = _a.sent();
                    setUpdateTokenError("Failed to update token.");
                    console.error("Error updating token:", err_3);
                    return [3 /*break*/, 5];
                case 4:
                    setUpdateTokenLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [apiKey, fetchTokens]);
    var revokeToken = useCallback(function (id) { return __awaiter(_this, void 0, void 0, function () {
        var data, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setRevokeTokenLoading(true);
                    setRevokeTokenError(undefined);
                    setRevokeTokenMessage(undefined);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, axios.post("".concat(API_BASE, "/tokens/revoke"), { id: id }, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: apiKey,
                            },
                        })];
                case 2:
                    data = (_a.sent()).data;
                    setRevokeTokenMessage(data.message);
                    fetchTokens();
                    return [3 /*break*/, 5];
                case 3:
                    err_4 = _a.sent();
                    setRevokeTokenError("Failed to revoke token.");
                    console.error("Error revoking token:", err_4);
                    return [3 /*break*/, 5];
                case 4:
                    setRevokeTokenLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [apiKey, fetchTokens]);
    return {
        tokens: tokens,
        apiTokenLoading: apiTokenLoading,
        apiTokenError: apiTokenError,
        fetchTokens: fetchTokens,
        apiTokenMessage: apiTokenMessage,
        createToken: createToken,
        createTokenLoading: createTokenLoading,
        createTokenError: createTokenError,
        createdToken: createdToken,
        createTokenMessage: createTokenMessage,
        updateToken: updateToken,
        updateTokenLoading: updateTokenLoading,
        updateTokenError: updateTokenError,
        updateTokenMessage: updateTokenMessage,
        revokeToken: revokeToken,
        revokeTokenLoading: revokeTokenLoading,
        revokeTokenError: revokeTokenError,
        revokeTokenMessage: revokeTokenMessage,
    };
}
