"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutvalidate = exports.Signupvalidate = exports.loginValidation = exports.validated = void 0;
const express_validator_1 = require("express-validator");
const validated = (validations) => {
    return async (req, res, next) => {
        try {
            // run all validations first
            await Promise.all(validations.map(v => v.run(req)));
            // then collect errors once
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    message: "Validation failed",
                    errors: errors.array(),
                });
            }
            next();
        }
        catch (err) {
            console.error("VALIDATION ERROR:", err);
            return res.status(500).json({
                message: "Validation middleware crashed",
            });
        }
    };
};
exports.validated = validated;
exports.loginValidation = [
    (0, express_validator_1.body)('email').trim().isEmail().withMessage('valid email is needed'),
    (0, express_validator_1.body)('password').trim().isLength({ min: 6 }).withMessage("password of 6 character is required")
];
exports.Signupvalidate = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('name is required'),
    ...exports.loginValidation
];
exports.logoutvalidate = [
    (0, express_validator_1.body)('name').isEmpty(),
    (0, express_validator_1.body)('email').trim().isEmail(),
    (0, express_validator_1.body)('password').trim().isLength({ min: 6 })
];
