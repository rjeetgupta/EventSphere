import { Router } from "express";
import {
    createClub,
    getClubDetails,
    updateClubDetails,
    getAllClubs
} from "../controllers/club.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validator } from "../middlewares/validator.middleware.js";
import { checkRole } from "../middlewares/checkRole.middleware.js";
import { ROLES } from "../middlewares/checkRole.middleware.js";
import { createClubValidator, updateClubValidator } from "../validators/club.validator.js";

// import { validateObjectId } from "../middlewares/validator.middleware.js";

const router = Router();

// Public routes
router.route("/")
    .get(getAllClubs);

// Protected routes
router.use(verifyJWT);

// Club creation routes (admin, super-admin, and club manager)
router.route("/create-club")
    .post(
        checkRole([ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.CLUB_MANAGER]), 
        createClubValidator, 
        validator, 
        createClub
    );

// Club details and update routes
router.route("/:id")
    .get(getClubDetails);

router.route("/update-club/:id")
    .patch(checkRole([ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.CLUB_MANAGER]), updateClubValidator, validator, updateClubDetails);

export default router;