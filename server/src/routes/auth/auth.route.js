import { Router } from "express";
import { loginUser, logOutUser, refreshToken, registerUser } from "../../controllers/auth/auth.controller";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyUser, logOutUser);
router.route("refresh-token").post(refreshToken);

export default router;