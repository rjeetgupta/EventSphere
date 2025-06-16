import { Router } from "express";
import { 
    createSuperAdmin, 
    createAdmin, 
    loginAdmin, 
    logoutAdmin,
    assignClubManager 
} from "../controllers/admin.controller.js";
import { 
    registerValidator, 
    loginValidator, 
    createAdminValidator 
} from "../validators/auth.validator.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/checkRole.middleware.js";
import { ROLES } from "../middlewares/checkRole.middleware.js";
import { validator } from "../middlewares/validator.middleware.js";

const router = Router();

// Admin routes
router.route("/create-super-admin").post(createSuperAdmin);

router.route("/create-admin").post(verifyJWT, checkRole(ROLES.SUPER_ADMIN), createAdminValidator, validator, createAdmin);

router.route("/login-admin").post(loginValidator, validator, loginAdmin);

router.route("/logout-admin").post(verifyJWT, logoutAdmin);
router.route("/assign-club-manager").post(verifyJWT, checkRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]), assignClubManager);

export default router; 