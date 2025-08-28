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
    // fetchUsers states
    var _d = useState(false), fetchUsersLoading = _d[0], setFetchUsersLoading = _d[1];
    var _e = useState(undefined), fetchUsersError = _e[0], setFetchUsersError = _e[1];
    var _f = useState(undefined), fetchUsersMessage = _f[0], setFetchUsersMessage = _f[1];
    // getUser states
    var _g = useState(false), getUserLoading = _g[0], setGetUserLoading = _g[1];
    var _h = useState(undefined), getUserError = _h[0], setGetUserError = _h[1];
    var _j = useState(undefined), getUserMessage = _j[0], setGetUserMessage = _j[1];
    // createUser states
    var _k = useState(false), createUserLoading = _k[0], setCreateUserLoading = _k[1];
    var _l = useState(undefined), createUserError = _l[0], setCreateUserError = _l[1];
    var _m = useState(undefined), createUserMessage = _m[0], setCreateUserMessage = _m[1];
    // updateUser states
    var _o = useState(false), updateUserLoading = _o[0], setUpdateUserLoading = _o[1];
    var _p = useState(undefined), updateUserError = _p[0], setUpdateUserError = _p[1];
    var _q = useState(undefined), updateUserMessage = _q[0], setUpdateUserMessage = _q[1];
    // deleteUser states
    var _r = useState(false), deleteUserLoading = _r[0], setDeleteUserLoading = _r[1];
    var _s = useState(undefined), deleteUserError = _s[0], setDeleteUserError = _s[1];
    var _t = useState(undefined), deleteUserMessage = _t[0], setDeleteUserMessage = _t[1];
    var _u = useState(null), singleUser = _u[0], setSingleUser = _u[1];
    // reset all messages and errors after 3 seconds
    useEffect(function () {
        var timer = setTimeout(function () {
            setFetchUsersError(undefined);
            setFetchUsersMessage(undefined);
            setGetUserError(undefined);
            setGetUserMessage(undefined);
            setCreateUserError(undefined);
            setCreateUserMessage(undefined);
            setUpdateUserError(undefined);
            setUpdateUserMessage(undefined);
            setDeleteUserError(undefined);
            setDeleteUserMessage(undefined);
        }, 3000);
        return function () { return clearTimeout(timer); };
    }, [
        fetchUsersError,
        fetchUsersMessage,
        getUserError,
        getUserMessage,
        createUserError,
        createUserMessage,
        updateUserError,
        updateUserMessage,
        deleteUserError,
        deleteUserMessage,
    ]);
    var fetchUsers = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var cacheKey, cached, data, err_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setFetchUsersLoading(true);
                    setFetchUsersError(undefined);
                    setFetchUsersMessage(undefined);
                    cacheKey = "users_list";
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    cached = getCache(cacheKey);
                    if (cached) {
                        setUsers(cached);
                        setFetchUsersLoading(false);
                        setFetchUsersMessage("Fetched users from cache.");
                        return [2 /*return*/, cached];
                    }
                    return [4 /*yield*/, axios.get("".concat(API_BASE, "/users"), {
                            headers: { Authorization: apiKey },
                        })];
                case 2:
                    data = (_c.sent()).data;
                    setUsers(data.users || []);
                    setCache(cacheKey, data.users || []);
                    setFetchUsersMessage("Fetched users successfully.");
                    return [2 /*return*/, data.users || []];
                case 3:
                    err_1 = _c.sent();
                    setFetchUsersError(((_b = (_a = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Failed to fetch users");
                    return [3 /*break*/, 5];
                case 4:
                    setFetchUsersLoading(false);
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
                    setGetUserLoading(true);
                    setGetUserError(undefined);
                    setGetUserMessage(undefined);
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, 4, 5]);
                    existing = users.find(function (u) { return u.id === id; });
                    if (existing) {
                        setSingleUser(existing);
                        setGetUserMessage("User found in list.");
                        return [2 /*return*/, existing];
                    }
                    cached = getCache("single_user");
                    if (cached) {
                        setSingleUser(cached);
                        setGetUserMessage("User found in cache.");
                        return [2 /*return*/, cached];
                    }
                    return [4 /*yield*/, axios.get("".concat(API_BASE, "/users/").concat(id), {
                            headers: { Authorization: apiKey },
                        })];
                case 2:
                    data = (_e.sent()).data;
                    setSingleUser(data.user);
                    setGetUserMessage("Fetched user successfully.");
                    return [2 /*return*/, data.user];
                case 3:
                    err_2 = _e.sent();
                    setGetUserError(((_d = (_c = err_2 === null || err_2 === void 0 ? void 0 : err_2.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) || "Failed to fetch user");
                    return [3 /*break*/, 5];
                case 4:
                    setGetUserLoading(false);
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
                    setCreateUserLoading(true);
                    setCreateUserError(undefined);
                    setCreateUserMessage(undefined);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, axios.post("".concat(API_BASE, "/users"), data, {
                            headers: { Authorization: apiKey },
                        })];
                case 2:
                    response = (_c.sent()).data;
                    setSingleUser(response);
                    setCreateUserMessage("User created successfully.");
                    return [4 /*yield*/, fetchUsers()];
                case 3:
                    _c.sent();
                    return [2 /*return*/, response];
                case 4:
                    err_3 = _c.sent();
                    setCreateUserError(((_b = (_a = err_3 === null || err_3 === void 0 ? void 0 : err_3.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Failed to create user");
                    return [3 /*break*/, 6];
                case 5:
                    setCreateUserLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/, null];
            }
        });
    }); }, [apiKey, fetchUsers]);
    var updateUser = useCallback(function (id, data) { return __awaiter(void 0, void 0, void 0, function () {
        var updatedUser, err_4;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    setUpdateUserLoading(true);
                    setUpdateUserError(undefined);
                    setUpdateUserMessage(undefined);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, axios.put("".concat(API_BASE, "/users/").concat(encodeURIComponent(id)), data, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: apiKey,
                            },
                        })];
                case 2:
                    updatedUser = (_d.sent()).data;
                    setSingleUser(updatedUser);
                    setUpdateUserMessage("User updated successfully.");
                    return [4 /*yield*/, fetchUsers()];
                case 3:
                    _d.sent();
                    return [2 /*return*/, updatedUser];
                case 4:
                    err_4 = _d.sent();
                    if (((_a = err_4 === null || err_4 === void 0 ? void 0 : err_4.response) === null || _a === void 0 ? void 0 : _a.status) === 400)
                        setUpdateUserError("Validation error.");
                    else if (((_b = err_4 === null || err_4 === void 0 ? void 0 : err_4.response) === null || _b === void 0 ? void 0 : _b.status) === 401)
                        setUpdateUserError("Unauthorized.");
                    else if (((_c = err_4 === null || err_4 === void 0 ? void 0 : err_4.response) === null || _c === void 0 ? void 0 : _c.status) === 404)
                        setUpdateUserError("User not found.");
                    else
                        setUpdateUserError("Failed to update user.");
                    return [3 /*break*/, 6];
                case 5:
                    setUpdateUserLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/, null];
            }
        });
    }); }, [apiKey, fetchUsers]);
    var deleteUser = useCallback(function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_5;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    setDeleteUserLoading(true);
                    setDeleteUserError(undefined);
                    setDeleteUserMessage(undefined);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, axios.delete("".concat(API_BASE, "/users/").concat(encodeURIComponent(id)), {
                            headers: {
                                Authorization: apiKey,
                            },
                        })];
                case 2:
                    data = (_d.sent()).data;
                    setDeleteUserMessage(data.message || "User deleted.");
                    return [4 /*yield*/, fetchUsers()];
                case 3:
                    _d.sent();
                    return [2 /*return*/, data];
                case 4:
                    err_5 = _d.sent();
                    if (((_a = err_5 === null || err_5 === void 0 ? void 0 : err_5.response) === null || _a === void 0 ? void 0 : _a.status) === 400)
                        setDeleteUserError("Invalid ID parameter.");
                    else if (((_b = err_5 === null || err_5 === void 0 ? void 0 : err_5.response) === null || _b === void 0 ? void 0 : _b.status) === 401)
                        setDeleteUserError("Unauthorized.");
                    else if (((_c = err_5 === null || err_5 === void 0 ? void 0 : err_5.response) === null || _c === void 0 ? void 0 : _c.status) === 404)
                        setDeleteUserError("User not found.");
                    else
                        setDeleteUserError("Failed to delete user.");
                    return [3 /*break*/, 6];
                case 5:
                    setDeleteUserLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/, null];
            }
        });
    }); }, [apiKey, fetchUsers]);
    return {
        users: users,
        fetchUsersLoading: fetchUsersLoading,
        fetchUsersError: fetchUsersError,
        fetchUsersMessage: fetchUsersMessage,
        fetchUsers: fetchUsers,
        getUser: getUser,
        getUserLoading: getUserLoading,
        getUserError: getUserError,
        getUserMessage: getUserMessage,
        createUser: createUser,
        createUserLoading: createUserLoading,
        createUserError: createUserError,
        createUserMessage: createUserMessage,
        updateUser: updateUser,
        updateUserLoading: updateUserLoading,
        updateUserError: updateUserError,
        updateUserMessage: updateUserMessage,
        deleteUser: deleteUser,
        deleteUserLoading: deleteUserLoading,
        deleteUserError: deleteUserError,
        deleteUserMessage: deleteUserMessage,
        singleUser: singleUser,
    };
};
