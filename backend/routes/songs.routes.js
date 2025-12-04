const { Router } = require('express');
const router = Router();
const songsController = require('../controllers/songs.controller');

router.get('/pool', songsController.getSongsPool);

module.exports = router;
