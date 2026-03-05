const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const upload = require('../middleware/upload');

// Public route
router.post('/register', upload.single('resume'), registrationController.registerStudent);

// Admin routes (should ideally be protected by auth middleware)
router.get('/all', registrationController.getAllRegistrations);
router.get('/export', registrationController.exportToExcel);

module.exports = router;
