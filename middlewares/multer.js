const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    },
});

const fileFilterVideo = (req, file, cb) => {
    if (file.mimetype !== "video/mp4" && file.mimetype !== "video/webm") {
        return cb(new Error("Only video files (MP4 or WebM) are allowed!"), false);
    }
    cb(null, true);
};

const uploadVideo = multer({
    storage: storage,
    fileFilter: fileFilterVideo,
});

module.exports = uploadVideo;
