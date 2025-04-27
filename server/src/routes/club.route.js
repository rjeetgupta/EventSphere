import { Router } from "express";
import { createClub, getClubDetails, updateClubDetails } from "../controllers/club.controller.js";

const router = Router();

router.route("/create-club").post(requireAuth, createClub);
router.route("/get-club-details/:id").get(validateObjectId, getClubDetails);
router.route("/update-club-details/:id").put(requireAuth, updateClubDetails);

export default router;