"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
var zod_1 = require("zod");
var envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().default('3000'),
    DATABASE_URL: zod_1.z.string().min(1),
    JWT_SECRET: zod_1.z.string().min(32),
    JWT_EXPIRES_IN: zod_1.z.string().default('30m'),
    SUPERADMIN_EMAIL: zod_1.z.string().email(),
    SUPERADMIN_PASSWORD: zod_1.z.string().min(8),
    FRONTEND_ORIGIN: zod_1.z.string().url().default('http://localhost:5173'),
    BCRYPT_ROUNDS: zod_1.z.string().default('12'),
});
function validateEnv() {
    try {
        return envSchema.parse(process.env);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            var missing = error.errors.map(function (e) { return e.path.join('.'); }).join(', ');
            throw new Error("Missing or invalid environment variables: ".concat(missing));
        }
        throw error;
    }
}
exports.env = validateEnv();
