const multer = require("multer");

const ApiError = require("../utils/ApiError");

const multerOptions = _ => {
    const multerStorage = multer.memoryStorage();

    const multerFilter = function (req, file, cb) {
        if (file.mimetype.startsWith("image")) {
            cb(null, true);
        } else {
            cb(new ApiError("Only images allowed"), false);
        }
    };

    const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
    return upload;
}

exports.uploadSingleImg = fieldName => multerOptions().single(fieldName);

exports.uploadListOfImgs = arrayOfFields => multerOptions().fields(arrayOfFields);