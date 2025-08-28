import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
var useCache = function (maxAge) {
    if (maxAge === void 0) { maxAge = 60000; }
    var _a = useState(false), cacheCleared = _a[0], setCacheCleared = _a[1];
    var _b = useState(null), cacheError = _b[0], setCacheError = _b[1];
    var _c = useState(null), cacheMessage = _c[0], setCacheMessage = _c[1];
    // clear cache error and message after 3 seconds
    useEffect(function () {
        if (cacheError) {
            var timer_1 = setTimeout(function () { return setCacheError(null); }, 3000);
            return function () { return clearTimeout(timer_1); };
        }
    }, [cacheError]);
    useEffect(function () {
        if (cacheMessage) {
            var timer_2 = setTimeout(function () { return setCacheMessage(null); }, 3000);
            return function () { return clearTimeout(timer_2); };
        }
    }, [cacheMessage]);
    var setCache = useCallback(function (key, value) {
        Cookies.set(key, JSON.stringify({ value: value, ts: Date.now() }), { expires: maxAge / 1000 }); // valid for max age
    }, [maxAge]);
    var getCache = useCallback(function (key) {
        var raw = Cookies.get(key);
        if (!raw)
            return undefined;
        try {
            var _a = JSON.parse(raw), value = _a.value, ts = _a.ts;
            if (Date.now() - ts < maxAge)
                return value; // valid for maxAge
        }
        catch (_b) {
            return undefined;
        }
        return undefined;
    }, [maxAge]);
    var clearCache = useCallback(function () {
        try {
            localStorage.clear();
            sessionStorage.clear();
            document.cookie.split(";").forEach(function (c) {
                document.cookie = c
                    .replace(/^ +/, "")
                    .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
            setCacheCleared(true);
            setTimeout(function () { return setCacheCleared(false); }, 1500);
        }
        catch (e) {
            setCacheCleared(false);
            console.error("Failed to clear cache:", e);
        }
    }, []);
    return { setCache: setCache, getCache: getCache, clearCache: clearCache, cacheCleared: cacheCleared, cacheError: cacheError, cacheMessage: cacheMessage };
};
export { useCache };
