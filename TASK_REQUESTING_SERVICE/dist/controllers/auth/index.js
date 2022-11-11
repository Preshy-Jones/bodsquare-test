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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../../models/User"));
const { generateJWTToken } = require("../../utils");
const { ServiceError, ValidationError, ConflictError, AuthenticationError, } = require("../../errors");
const config = require("../../config");
module.exports.register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, password2 } = req.body;
    let errors = [];
    try {
        if (!name || !email || !password || !password2) {
            //throw new ServiceError("please fill in all fields");
            errors.push({ message: "please fill in all fields" });
        }
        if (password !== password2) {
            //throw new ServiceError("passwords do not match");
            errors.push({ message: "passwords do not match" });
        }
        if (password.length < 6) {
            //throw new ServiceError("password should be at least 6 characters");
            errors.push({ message: "password should be at least 6 characters" });
        }
        console.log("hello");
        if (errors.length > 0) {
            throw new ValidationError(errors);
        }
        const user = yield User_1.default.findOne({ email: email });
        if (user) {
            // errors.push({ message: "Email is already registered" });
            throw new ConflictError("Email is already registered");
        }
        else {
            const newUser = new User_1.default({
                name,
                email,
                password,
            });
            console.log(newUser);
            // res.send('hello')
            //Hash Passoword
            bcryptjs_1.default.genSalt(10, (err, salt) => bcryptjs_1.default.hash(newUser.password, salt, (err, hash) => {
                if (err)
                    throw err;
                //set password to hashed password
                newUser.password = hash;
                // res.send(newUser);
                //save user
                newUser
                    .save()
                    .then((user) => {
                    res.json({ status: "success", data: newUser });
                })
                    .catch((err) => {
                    throw new ServiceError(err);
                    console.log(err);
                });
            }));
        }
    }
    catch (error) {
        next(error);
    }
    //
    //        res.send('pass')
});
module.exports.login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ email: email });
        if (!user) {
            // return res
            //   .status(401)
            //   .send({ success: false, message: "that email is not registered" });
            throw new ValidationError([{ message: "This email is not registered" }]);
        }
        let passwordCorrect = false;
        //match password
        if (!bcryptjs_1.default.compareSync(password, user.password)) {
            // return res
            //   .status(401)
            //   .send({ success: false, message: "password incorrect " });
            throw new ValidationError([{ message: "Password incorrect" }]);
        }
        const payload = {
            id: user.id,
            email: user.email,
        };
        const token = yield generateJWTToken(payload, process.env.JWT_SECRET, "1800s");
        const refreshToken = yield generateJWTToken(payload, process.env.REFRESH_TOKEN_SECRET, "2d");
        user.refreshToken = refreshToken;
        const result = yield user.save();
        // Creates Secure Cookie with refresh token
        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            // secure: true,
            // sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.status(200).send({
            success: true,
            message: "Logged in successfully",
            user: {
                name: user.name,
                id: user._id,
                email: user.email,
            },
            accessToken: token,
        });
    }
    catch (error) {
        next(error);
    }
});
module.exports.logout = (req, res, next) => { };
module.exports.handleRefreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookies = req.cookies;
        console.log("hello");
        console.log(cookies);
        if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
            throw new AuthenticationError("No refresh token found");
        const refreshToken = cookies.jwt;
        const foundUser = yield User_1.default.findOne({ refreshToken }).exec();
        // console.log(foundUser);
        if (!foundUser)
            return res.sendStatus(403); //Forbidden
        // evaluate jwt
        //    console.log(process.env.REFRESH_TOKEN_SECRET);
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            console.log(decoded);
            console.log(foundUser);
            if (err || foundUser.email !== decoded.email)
                return res.sendStatus(403);
            const payload = {
                id: foundUser._id,
                email: foundUser.email,
            };
            const accessToken = jsonwebtoken_1.default.sign(Object.assign({}, payload), process.env.JWT_SECRET, {
                expiresIn: "20s",
            });
            res.json({ accessToken });
        });
    }
    catch (error) {
        next(error);
    }
});
