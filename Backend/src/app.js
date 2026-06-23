"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = require("./Routes/index");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)({
    origin: ["https://crytotec-ai.vercel.app", "http://localhost:5173"],
    credentials: true
}));
exports.app.use(express_1.default.json());
exports.app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
exports.app.use((0, morgan_1.default)("dev"));
exports.app.get('/', (req, res) => {
    res.send('working at port 5000');
});
exports.app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});
exports.app.use('/api/v1', index_1.AllRouter);
