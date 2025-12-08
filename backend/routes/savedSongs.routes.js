import { Router } from 'express';
import savedSongsController from '../controllers/savedSongs.controller.js';

const router = Router();

router.get('/', savedSongsController.getSavedSongs);
router.post('/', savedSongsController.saveSong);
router.delete('/:id', savedSongsController.deleteSong);

export default router;
