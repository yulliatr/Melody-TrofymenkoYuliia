import { Router } from 'express';
import songsController from '../controllers/songs.controller.js';

const router = Router();

router.get('/pool', songsController.getSongsPool);

export default router;
