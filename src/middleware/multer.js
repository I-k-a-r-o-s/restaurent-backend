import multer from "multer";

/**
 * Multer configuration for file upload handling
 * Uses diskStorage which stores files temporarily before uploading to cloud storage
 * single("image") allows uploading one image file at a time
 */
const upload = multer({ storage: multer.diskStorage({}) });

export default upload;
