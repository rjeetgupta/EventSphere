import { Router } from 'express';
import {
    createResource,
    getClubResources,
    updateResource,
    deleteResource,
    trackDownload
} from '../controllers/clubResource.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/checkRole.middleware.js';
import { ROLES } from '../middlewares/checkRole.middleware.js';

const router = Router();

// Create resource (club manager and core members)
router.post('/:clubId/resources', verifyJWT, checkRole([ROLES.CLUB_MANAGER, ROLES.CORE_MEMBER]), createResource);

// Get club resources (accessible by club members)
router.get('/:clubId/resources', verifyJWT, getClubResources);

// Update resource (resource uploader, club manager, or core members)
router.patch('/resources/:resourceId', verifyJWT, updateResource);

// Delete resource (resource uploader, club manager, or core members)
router.delete('/resources/:resourceId', verifyJWT, deleteResource);

// Track resource download (accessible by authorized users)
router.post('/resources/:resourceId/download', verifyJWT, trackDownload);

export default router; 