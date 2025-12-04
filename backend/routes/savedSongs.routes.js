const { Router } = require('express');
const router = Router();
const savedSongsController = require('../controllers/savedSongs.controller');

router.post('/', savedSongsController.saveSong);

router.get('/', savedSongsController.getSavedSongs);

router.delete('/:id', savedSongsController.deleteSong);

module.exports = router;
