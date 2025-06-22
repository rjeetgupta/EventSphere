import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import User from '../models/user.model.js';
import Event from '../models/event.model.js';
import Club from '../models/club.model.js';
import { ApiError } from '../utils/ApiError.js';

const getAdminDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const activeEvents = await Event.countDocuments({ status: 'upcoming' });
  const completedEvents = await Event.countDocuments({ status: 'completed' });
  const totalClubs = await Club.countDocuments();

  const registrationAggregation = await Event.aggregate([
    {
      $group: {
        _id: null,
        totalRegistrations: { $sum: { $size: '$registeredUsers' } },
      },
    },
  ]);

  const totalRegistrations = registrationAggregation[0]?.totalRegistrations || 0;

  const stats = {
    totalUsers,
    activeEvents,
    completedEvents,
    totalClubs,
    totalRegistrations,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, stats, 'Admin dashboard stats fetched successfully'));
});

const getStudentDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const upcomingRegisteredEvents = await Event.countDocuments({
    status: 'upcoming',
    registeredUsers: userId,
  });

  const memberClubs = await Club.countDocuments({
    'members.user': userId,
  });

  const stats = {
    upcomingRegisteredEvents,
    memberClubs,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, stats, 'Student dashboard stats fetched successfully'));
});

const getClubDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find the club managed by the user
  const club = await Club.findOne({ manager: userId });
  if (!club) {
    throw new ApiError(404, 'Club not found for this manager');
  }

  const clubId = club._id;

  const totalEvents = await Event.countDocuments({ club: clubId });
  const activeEvents = await Event.countDocuments({ club: clubId, status: 'upcoming' });
  const totalMembers = club.members?.length || 0;

  const stats = {
    clubName: club.name,
    totalEvents,
    activeEvents,
    totalMembers,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, stats, 'Club dashboard stats fetched successfully'));
});

export { getAdminDashboardStats, getStudentDashboardStats, getClubDashboardStats }; 