import { randomUUID } from "crypto";
import mongoose from "mongoose";
const chatAiSchema = new mongoose.Schema({
    id: {
        type: String,
        default: randomUUID
    },
    role: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    chatAi: [chatAiSchema]
});
export default mongoose.model("User", userSchema);
//# sourceMappingURL=userModel.js.map