"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectToDb = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URL);
        console.log('connect successful to db');
    }
    catch (error) {
        console.log(error, 'connectionn fail');
    }
};
exports.connectToDb = connectToDb;
