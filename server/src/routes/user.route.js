import { Router } from "express";
import { changeCurrentPassword, getUser, getUserByClub, updateUserProfile } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { changePasswordValidator } from "../validations/passwordValidator.js";
import { userRegistrationValidator } from "../validations/authValidator.js";
import { validator } from "../middlewares/validator.middleware.js";

const router = Router();

router.route("/current-user").get(verifyJWT, getUser);
router.route("/change-current-password")
    .post(changePasswordValidator(), validator, verifyJWT, changeCurrentPassword);
router.route("/user-profile-update")
    .post(userRegistrationValidator(), validator, verifyJWT, updateUserProfile);
router.route("/get-user-by-club").get(verifyJWT, getUserByClub);

export default router;