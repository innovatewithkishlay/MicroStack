const express = require('express');
const fileController = require('../controllers/file.controller');
const protect = require('../middlewares/auth.middleware');
const upload = require('../services/storage.service');

const router = express.Router();

router.post('/upload', protect, upload.single('file'), fileController.uploadFile);
router.get('/:id', fileController.getFile);

module.exports = router;
