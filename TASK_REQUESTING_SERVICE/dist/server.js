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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("./middlewares/logger");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const middlewares_1 = require("./middlewares");
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
dotenv_1.default.config({ path: path_1.default.join(__dirname, ".env") });
app.use(logger_1.logger);
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365,
    },
}));
app.use(passport_1.default.initialize());
require("./middlewares/passport");
app.use(passport_1.default.session());
app.use("/", require("./routes/index"));
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });
const port = process.env.PORT || 8008;
app.use(middlewares_1.NotFoundHandler);
app.use(middlewares_1.ErrorHandler);
const mongooseConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(process.env.DB_CONNECT);
    try {
        yield mongoose_1.default.connect(process.env.DB_CONNECT, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false,
        });
        console.log("connected to mongodb");
    }
    catch (error) {
        console.log(error);
    }
});
mongooseConnect();
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
