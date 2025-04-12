import { body } from "express-validator";

export const changePasswordValidator = () => {
    return [
        body("oldPassword")
            .trim()
            .notEmpty().withMessage("Old password is required"),
        body("newPassword")
            .trim()
            .isStrongPassword({
                minLength: 5,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1
            })
            .withMessage("Password must contain above 8 chars with 1 uppercase, 1 lowercase, and 1 number"),
    ]
}