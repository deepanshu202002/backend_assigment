const express = require('express');
const router = express.Router();
const multer = require('multer');
const quizController = require('./quizController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/uploadTestData', upload.single('file'), quizController.uploadTestData);
router.post('/startTest', quizController.startTest);
router.get('/getQuestion/:questionId', quizController.getQuestion);
router.post('/redirectUser', quizController.redirectUser);
router.post('/storeUserTestResult', quizController.storeUserTestResult);
router.get('/getResult/:userId/:testDateTime', quizController.getResult);
router.get('/getAllTestResults/:page', quizController.getAllTestResults);

module.exports = router;
