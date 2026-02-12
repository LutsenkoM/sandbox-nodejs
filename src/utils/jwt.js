"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = signToken;
exports.verifyToken = verifyToken;
var jwt = require("jsonwebtoken");
var env_1 = require("../config/env");
function signToken(userId, email) {
    return jwt.sign({ sub: userId, email: email }, env_1.env.JWT_SECRET, { expiresIn: env_1.env.JWT_EXPIRES_IN });
}
function verifyToken(token) {
    return jwt.verify(token, env_1.env.JWT_SECRET);
}
