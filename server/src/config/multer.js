import multer from "multer";
import path from "path";
import fs from "fs";

const profilesDir = path.resolve("uploads/profiles");

fs.mkdirSync(profilesDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, profilesDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const baseName = path
            .basename(file.originalname, ext)
            .replace(/[^a-zA-Z0-9_-]/g, "-")
            .toLowerCase();

        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${baseName}-${uniqueSuffix}${ext}`);
    },
});

function fileFilter(req, file, cb) {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error("Only JPG, PNG, WEBP, and GIF images are allowed"));
    }

    cb(null, true);
}

const uploadProfileImage = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

export default uploadProfileImage;