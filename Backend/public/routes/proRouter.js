const express = require('express');
const router = express.Router();
const multer = require('multer');
const proController = require('../api/proController');

// multer 설정 (파일을 C:/proimage에 저장)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'C:/proimage'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage: storage });

// 교수 회원가입 (자격증 파일 업로드 포함)
router.post('/pro', upload.single('certificate'), proController.register);

module.exports = router;
