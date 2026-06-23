"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const ConnectToDb_1 = require("./Connection/ConnectToDb");
const PORT = process.env.PORT || 5000;
const serverset = async () => {
    await (0, ConnectToDb_1.connectToDb)();
    app_1.app.listen(PORT, () => {
        console.log(`server is running ${PORT}`);
    });
};
serverset();
exports.default = app_1.app; // ✅ Add this line for Vercel
