import multer from "multer";
import path from "path";

// storage configuration
const storage = multer.memoryStorage();

// file filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("only jpeg,jpg,png,pdf files are allowed"));
    }
}

const upload = multer({
    storage,
    fileFilter
});

export default upload;
