import { Router } from "express";
import { createClub, getClub, getClubDetails, updateClubDetails } from "../../controllers/club/club.controller";

const router = Router();

router.route("/create-club").post(requireAuth, createClub);
router.route("/get-club").get(getClub);
router.route("/get-club-details/:id").get(validateObjectId, getClubDetails);
router.route("/update-club-details/:id").put(requireAuth, updateClubDetails);

export default router;