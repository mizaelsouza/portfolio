const multer = require("multer");
const aws = require("aws-sdk");
const crypto = require("crypto");
const path = require("path");
const multerS3 = require("multer-s3");
const storageType = {
    local: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, "..", "..", "temp", "upload"));
        },

        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(new Error("Error: FileName invalaido", err));
                file.key = `${hash.toString("hex")}-${file.originalname}`;
                cb(null, file.key);
            });
        },
    }),

    s3: multerS3({
        s3: new aws.S3(),
        bucket: "saci-web-upload",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: "public-read",
        key: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(new Error("Error: FileName invalaido", err));
                const fileName = `${hash.toString("hex")}-${file.originalname}`;
                cb(null, fileName);
            });
        },
    }),
};

module.exports = {
    dest: path.resolve(__dirname, "..", "..", "temp", "upload"),
    storage: storageType[process.env.STORAGE_TYPE],

    limits: {
        fileSize: 2 * 1024 * 1024,
    },

    fileFilter: (req, file, cb) => {
        const formatosValidos = ["image/jpeg", "image/pjpeg", "image/png"];
        if (formatosValidos.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Formato invalido."));
        }
    },
};
