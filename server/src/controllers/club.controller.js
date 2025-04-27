import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Club from "../models/club.model.js"
import { clubValidator } from "../validations/clubValidation.js";


const createClub = asyncHandler(async (req, res) => {
    const { clubName, description } = req.body;

    clubValidator(req.body);

    const club = await Club.findOne({ clubName })

    if (club) {
        throw new ApiError(400, "Club already exists")
    }

    const newClub = await Club.create({
        clubName,
        description
    })

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                newClub,
                "Club created successfully",
            )
        )
});


const getClubDetails = asyncHandler(async (req, res) => {
    const { clubName } = req.body;

    clubValidator(req.body);

    const club = await Club.findOne({ clubName })

    if (!club) {
        throw new ApiError(400, "Club not found")
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                club,
                "Club details fetched successfully",
            )
        )
});

const updateClubDetails = asyncHandler(async (req, res) => {
    const { clubName, description } = req.body;

    clubValidator(req.body);

    const club = await Club.findOneAndUpdate(
        { clubName },
        {
            $set: {
                clubName: clubName,
                description: description
            }
        },
        {
            new: true
        }
    )

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                club,
                "Club details updated successfully",
            )
        )
});


export {
    createClub,
    getClubDetails,
    updateClubDetails,
}