const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');
const ApiFeatures = require('../utils/ApiFeatures');

exports.deleteOne = model => 
        asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const document = await model.findByIdAndDelete(id);
        if(!document){
            return next(new ApiError(`Document with this id is not found`, 404));
        }
        res.status(204).send();
    });

exports.updateOne = model =>
    asyncHandler(async (req, res, next) => {
        const document = await model.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!document){
            return next(new ApiError(`Document with this id is not found`, 404));
        }
        res.status(200).json({data: document});
    });