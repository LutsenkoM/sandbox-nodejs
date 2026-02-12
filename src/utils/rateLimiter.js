"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRateLimit = checkRateLimit;
exports.resetRateLimit = resetRateLimit;
var store = new Map();
function checkRateLimit(key, maxAttempts, windowMs) {
    var now = Date.now();
    var entry = store.get(key);
    if (!entry || now > entry.resetAt) {
        store.set(key, { count: 1, resetAt: now + windowMs });
        return true;
    }
    if (entry.count >= maxAttempts) {
        return false;
    }
    entry.count++;
    return true;
}
function resetRateLimit(key) {
    store.delete(key);
}
// Cleanup old entries every 10 minutes
setInterval(function () {
    var now = Date.now();
    for (var _i = 0, _a = store.entries(); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], entry = _b[1];
        if (now > entry.resetAt) {
            store.delete(key);
        }
    }
}, 10 * 60 * 1000);
