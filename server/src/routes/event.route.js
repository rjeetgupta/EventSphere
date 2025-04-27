import { Router } from "express";
import { createEvent, getEventDetails, getEvents, updateEventDetails, deleteEvent, cancelRegistration } from "../controllers/event.controller.js";
import { checkRole } from "../middlewares/checkRole.middleware.js";
import verifyJWT from "../middlewares/verifyJWT.middleware.js";
const router = Router();

router.route("/create-event").post([verifyJWT, checkRole(["admin", "club"])], createEvent);
router.route("/get-events").get(requireAuth, getEvents);
router.route("/get-event-details/:id").get(validateObjectId, getEventDetails);
router.route("update-event/:id").put([verifyJWT, checkRole(["admin", "club"])], updateEventDetails);
router.route("/delete-event/:id").delete([verifyJWT, checkRole(["admin", "club"])], deleteEvent);
router.route("/cancel-registration/:id").delete(verifyJWT, cancelRegistration);

export default router;