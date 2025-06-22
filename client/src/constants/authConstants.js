// Authentication and Role Constants
export const ROLES = {
  SUPER_ADMIN: 'SuperAdmin',
  ADMIN: 'Admin',
  CLUB_MANAGER: 'ClubManager',
  STUDENT: 'Student'
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.ADMIN]: 'Admin',
  [ROLES.CLUB_MANAGER]: 'Club Manager',
  [ROLES.STUDENT]: 'Student'
};

// Role-based route paths
export const ROLE_ROUTES = {
  [ROLES.SUPER_ADMIN]: '/admin/dashboard',
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.CLUB_MANAGER]: '/club/dashboard',
  [ROLES.STUDENT]: '/dashboard'
}; 