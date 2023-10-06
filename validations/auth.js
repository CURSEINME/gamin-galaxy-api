import { body } from "express-validator"

export const registerValidation = [
  body("name").isLength({min: 4}),
  body("email").isEmail(),
  body("password").isLength({min: 6})
]