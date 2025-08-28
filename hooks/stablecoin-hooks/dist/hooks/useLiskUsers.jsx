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
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useCache } from "../hooks/useCache";
// Use environment variables
var API_BASE = process.env.NEXT_PUBLIC_LISK_API_BASE;
export var useLiskUsers = function (_a) {
    var apiKey = _a.apiKey;
    var _b = useCache(), getCache = _b.getCache, setCache = _b.setCache;
    var _c = useState([]), users = _c[0], setUsers = _c[1];
    var _d = useState(false), loadingUsers = _d[0], setLoadingUsers = _d[1];
    var _e = useState(undefined), errorUsers = _e[0], setErrorUsers = _e[1];
    var _f = useState(null), singleUser = _f[0], setSingleUser = _f[1];
    // reset all messages and errors after 3 seconds
    useEffect(function () {
        var timer = setTimeout(function () {
            setErrorUsers(undefined);
        }, 3000);
        return function () { return clearTimeout(timer); };
    }, [errorUsers]);
    var fetchUsers = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var cacheKey, cached, data, err_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setLoadingUsers(true);
                    setErrorUsers(undefined);
                    cacheKey = "users_list";
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    cached = getCache(cacheKey);
                    if (cached) {
                        setUsers(cached);
                        setLoadingUsers(false);
                        return [2 /*return*/, cached];
                    }
                    return [4 /*yield*/, axios.get("".concat(API_BASE, "/users"), {
                            headers: { Authorization: apiKey },
                        })];
                case 2:
                    data = (_c.sent()).data;
                    setUsers(data.users || []);
                    setCache(cacheKey, data.users || []);
                    return [2 /*return*/, data.users || []];
                case 3:
                    err_1 = _c.sent();
                    setErrorUsers(((_b = (_a = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Failed to fetch users");
                    return [3 /*break*/, 5];
                case 4:
                    setLoadingUsers(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/, []];
            }
        });
    }); }, [apiKey, getCache, setCache]);
    var getUser = useCallback(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var existing, cached, data, err_2;
        var _c, _d;
        var id = _b.id;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    setLoadingUsers(true);
                    setErrorUsers(undefined);
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, 4, 5]);
                    existing = users.find(function (u) { return u.id === id; });
                    if (existing) {
                        setSingleUser(existing);
                        return [2 /*return*/, existing];
                    }
                    cached = getCache("single_user");
                    if (cached) {
                        setSingleUser(cached);
                        return [2 /*return*/, cached];
                    }
                    return [4 /*yield*/, axios.get("".concat(API_BASE, "/users/").concat(id), {
                            headers: { Authorization: apiKey },
                        })];
                case 2:
                    data = (_e.sent()).data;
                    return [2 /*return*/, data.user];
                case 3:
                    err_2 = _e.sent();
                    setErrorUsers(((_d = (_c = err_2 === null || err_2 === void 0 ? void 0 : err_2.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) || "Failed to fetch user");
                    return [3 /*break*/, 5];
                case 4:
                    setLoadingUsers(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/, null];
            }
        });
    }); }, [apiKey, getCache, users]);
    var createUser = useCallback(function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var response, err_3;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setLoadingUsers(true);
                    setErrorUsers(undefined);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, axios.post("".concat(API_BASE, "/users"), data, {
                            headers: { Authorization: apiKey },
                        })];
                case 2:
                    response = (_c.sent()).data;
                    setSingleUser(response);
                    return [4 /*yield*/, fetchUsers()];
                case 3:
                    _c.sent();
                    return [2 /*return*/, response];
                case 4:
                    err_3 = _c.sent();
                    setErrorUsers(((_b = (_a = err_3 === null || err_3 === void 0 ? void 0 : err_3.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Failed to create user");
                    return [3 /*break*/, 6];
                case 5:
                    setLoadingUsers(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/, null];
            }
        });
    }); }, [apiKey, fetchUsers]);
    return {
        users: users,
        loadingUsers: loadingUsers,
        errorUsers: errorUsers,
        fetchUsers: fetchUsers,
        createUser: createUser,
        getUser: getUser,
        singleUser: singleUser,
    };
};
