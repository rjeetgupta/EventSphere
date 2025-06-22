import { ROLES, ROLE_ROUTES } from '@/constants/authConstants';

/**
 * Get the redirect path based on user role
 * @param {string} role - User's role
 * @returns {string} Redirect path
 */
export const getRoleBasedRedirect = (role) => {
  return ROLE_ROUTES[role] || ROLE_ROUTES[ROLES.STUDENT];
};

/**
 * Check if user can create events
 * @param {string} role - User's role
 * @returns {boolean}
 */
export const canCreateEvents = (role) => {
  return [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.CLUB_MANAGER].includes(role);
};

/**
 * Check if user can manage users
 * @param {string} role - User's role
 * @returns {boolean}
 */
export const canManageUsers = (role) => {
  return [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(role);
};

/**
 * Check if user can manage clubs
 * @param {string} role - User's role
 * @returns {boolean}
 */
export const canManageClubs = (role) => {
  return [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(role);
};

/**
 * Check if user can manage events
 * @param {string} role - User's role
 * @returns {boolean}
 */
export const canManageEvents = (role) => {
  return [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.CLUB_MANAGER].includes(role);
}; 