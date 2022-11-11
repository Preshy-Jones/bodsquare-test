"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const config = require("../config");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "../.env") });
module.exports = {
    generateJWTToken,
};
function generateJWTToken(payload, secret, expireDuration) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            jwt.sign(Object.assign({}, payload), secret, { expiresIn: expireDuration }, (err, token) => {
                if (err) {
                    reject(err);
                }
                resolve(token);
            });
        });
    });
}
