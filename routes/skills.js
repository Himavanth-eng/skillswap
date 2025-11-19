
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const skillController = require('../controllers/skillController');
const { isLoggedIn } = require('../utils/authMiddleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, path.join('public','uploads')); },
  filename: function (req, file, cb) { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage });

router.get('/', skillController.list);
router.get('/add', isLoggedIn, skillController.showAdd);
router.post('/add', isLoggedIn, upload.single('image'), skillController.create);
router.get('/:id', skillController.details);
 

module.exports = router;