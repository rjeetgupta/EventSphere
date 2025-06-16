import { Router } from "express";
import { 
    registerUser, 
    loginUser, 
    logoutUser,
    refreshAccessToken,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validator } from "../middlewares/validator.middleware.js";
import { 
    registerValidator, 
    loginValidator, 
} from "../validators/auth.validator.js";

const router = Router();

// Public routes

router.route("/register").post(registerValidator, validator, registerUser);
router.route("/login").post(loginValidator, validator, loginUser);
router.route("/refresh-token").post(refreshAccessToken)
router.route("/logout").post(verifyJWT, logoutUser);

export default router;