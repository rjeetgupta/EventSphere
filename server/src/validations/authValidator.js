import { body } from "express-validator";

const userRegistrationValidator = () => {
  return [
    body("name")
      .trim()
      .notEmpty().withMessage('Name is required'),

    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Must be a valid email'),

    body('password')
      .isStrongPassword({
        minLength: 5,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1
      })
      .withMessage('Password must contain above 8 chars with 1 uppercase, 1 lowercase, and 1 number'),
  ]
}


const userLoginValidator = () => {
  return [
    body('email')
    .isEmail().withMessage('Must be a valid email')
    .normalizeEmail(),
    body('password')
      .isStrongPassword({
        minLength: 5,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1
      })
      .withMessage('Password must contain 8+ chars with 1 uppercase, 1 lowercase, and 1 number')
  ]
}



export {
  userRegistrationValidator,
  userLoginValidator,
}