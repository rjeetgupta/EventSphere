import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/checkRole.middleware.js";
import { ROLES } from "../middlewares/checkRole.middleware.js";
import { validator } from "../middlewares/validator.middleware.js";
import { changePasswordValidator } from "../validators/user.validator.js";

import { 
    getUser, 
    changeCurrentPassword, 
    updateUserProfile, 
    getUserByClub,
} from "../controllers/user.controller.js";

const router = Router();

// Protected routes
router.use(verifyJWT);


// User profile routes
router.route("/profile")
    .get(getUser)
    .patch(updateUserProfile);

router.route("/change-password")
    .post(changePasswordValidator, validator, changeCurrentPassword);

// Club manager routes
router.route("/club/:clubId")
    .get(checkRole(ROLES.CLUB_MANAGER), getUserByClub);

export default router;