import { Router } from "express";
import { getUser, getUserByClub, updateUserProfile } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/current-user").get(verifyJWT, getUser);
router.route("/update-profile").post(verifyJWT, updateUserProfile);
router.route("/get-user-by-club").get(verifyJWT, getUserByClub);

export default router;