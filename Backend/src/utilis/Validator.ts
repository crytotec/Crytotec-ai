import { Request,Response, NextFunction } from "express";
import { body, ValidationChain, validationResult } from "express-validator";




export const validated = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // run all validations first
      await Promise.all(validations.map(v => v.run(req)));

      // then collect errors once
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      next();
    } catch (err) {
      console.error("VALIDATION ERROR:", err);
      return res.status(500).json({
        message: "Validation middleware crashed",
      });
    }
  };
};

export const loginValidation=[
  body('email').trim().isEmail().withMessage('valid email is needed'),
    body('password').trim().isLength({min: 6}).withMessage("password of 6 character is required")
]
export const Signupvalidate = [
    body('name').notEmpty().withMessage('name is required'),
    ...loginValidation
]


export const logoutvalidate = [
    body('name').isEmpty(),
     body('email').trim().isEmail(),
    body('password').trim().isLength({min: 6})
]