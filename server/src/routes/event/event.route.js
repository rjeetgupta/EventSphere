import { Router } from "express";
import { createEvent, getEventDetails, getEvents, updateEventDetails } from "../../controllers/event/event.controller";

const router = Router();

router.route("/create-event").post(requireAuth, createEvent);
router.route("/get-events").get(requireAuth, getEvents);
router.route("/get-event-details/:id").get(validateObjectId, getEventDetails);
router.route("update-event/:id").put(requireAuth, updateEventDetails);

export default router;