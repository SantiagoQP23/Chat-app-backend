"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comprobarJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const comprobarJWT = (token = '') => {
    try {
        const { uid } = jsonwebtoken_1.default.verify(token, process.env.SECRETORPRIVATEKEY);
        return [true, uid];
    }
    catch (error) {
        return [false, null];
    }
};
exports.comprobarJWT = comprobarJWT;
//# sourceMappingURL=jwt.js.map