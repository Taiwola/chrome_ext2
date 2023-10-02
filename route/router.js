const express = require('express');

const router = express.Router();

const uploadVideo = require('../middlewares/multer');

const video = uploadVideo.single('video');

const { upload, transcribe, generateId, getVideo, getAllVideo } = require('../controller/controller');

router.post("/upload/:id", video, upload);
router.get("/video/:id", getVideo);
router.get('/generate', generateId);
router.get("/transcribe/:id", transcribe);
router.get("video", getAllVideo);


module.exports = router;