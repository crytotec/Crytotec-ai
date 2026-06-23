"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ai = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const genai_1 = require("@google/genai");
exports.ai = new genai_1.GoogleGenAI({
    apiKey: process.env.GEMINI_KEY
});
