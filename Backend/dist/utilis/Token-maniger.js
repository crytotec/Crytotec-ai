import jwt from "jsonwebtoken";
export const createToken = (id, email, expiresIn) => {
    const payload = { id, email };
    const Token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn
    });
    return Token;
};
//# sourceMappingURL=Token-maniger.js.map