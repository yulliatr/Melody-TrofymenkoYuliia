const { Router } = require('express');
const router = Router();
const userController = require('../controllers/user.controller');

router.patch('/:id', userController.updateUser);

module.exports = router;
