import { Router } from "express";
import { getUser, getUserByClub, updateUserProfile } from "../../controllers/user/user.controller";

const router = Router();

router.route("/current-user").get(verifyUser, getUser);
router.route("/update-profile").post(verifyUser, updateUserProfile);
router.route("/get-user-by-club").get(verifyAdmin, getUserByClub);

export default router;