import { Router } from "express";
import {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    registerForEvent,
    cancelRegistrationFromEvent,
    getEventRegistrations,
    getEventAttendance
} from "../controllers/event.controller.js";
import { checkRole } from "../middlewares/checkRole.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validator } from "../middlewares/validator.middleware.js";
import { createEventValidator, updateEventValidator, eventRegistrationValidator } from "../validators/event.validator.js";
import { ROLES } from '../middlewares/checkRole.middleware.js';
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public routes
router.route("/")
    .get(getEvents);

router.route("/:id")
    .get(getEventById);

// Protected routes
router.use(verifyJWT);

// Club manager routes
router.route("/create-event")
    .post(
        verifyJWT,
        checkRole([ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.CLUB_MANAGER]),
        upload.fields([
            {
                name: "Image",
                maxCount: 1,
            }
        ]),
        createEventValidator,
        validator,
        createEvent
    );

router.route("/update-event/:id")
    .patch(checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.CLUB_MANAGER), updateEventValidator, validator, updateEvent)
    .delete(checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.CLUB_MANAGER), deleteEvent);

// Student routes
router.route("/:id/register")
    .post(verifyJWT, registerForEvent);

router.route("/:id/register")
    .delete(verifyJWT, cancelRegistrationFromEvent);

// Admin routes
router.route("/:id/registrations")
    .get(checkRole(ROLES.ADMIN, ROLES.SUPER_ADMIN), getEventRegistrations);

router.route("/:id/attendance")
    .get(checkRole(ROLES.ADMIN, ROLES.SUPER_ADMIN), getEventAttendance);

export default router;