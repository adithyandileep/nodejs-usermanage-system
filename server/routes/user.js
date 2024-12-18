const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const user = require('../models/user');

/**
 * User Routes
 */
router.get('/', userController.homepage);
router.get('/about', userController.about);
router.get('/add', userController.addUser);
router.post('/add', userController.postUser);
router.get('view/:id', userController.viewUser);
router.get('/edit/:id', userController.editUser);
router.put('/edit/:id', userController.editPost);
router.delete('/edit/:id', userController.deleteUser);

router.post('/search', userController.searchUser);

module.exports = router;