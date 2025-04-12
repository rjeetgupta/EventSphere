import { Router } from "express";
import { loginUser, logOutUser, refreshAccessToken, registerUser } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validator } from "../middlewares/validator.middleware.js";
import { userRegistrationValidator, userLoginValidator } from "../validations/authValidator.js";

const router = Router();

// Factory Pattern
router.route("/register")
    .post(userRegistrationValidator(), validator, registerUser);
router.route("/login")
    .post(userLoginValidator(), validator, loginUser);
router.route("/logout").post(verifyJWT, logOutUser);
router.route("/refresh-token").post(refreshAccessToken);

export default router;