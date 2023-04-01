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
        const updated = await model.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!updated){
            return next(new ApiError(`Document with this id is not found`, 404));
        }
        res.status(200).json({data: updated});
    });

exports.createOne = model =>
    asyncHandler(async (req, res) => {
        const newDocument = await model.create(req.body);
        res.status(201).json({data: newDocument});
    });

exports.getOne = model =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const doc = await model.findById(id);
        if(!doc){
            return next(new ApiError(`Document with this id is not found`, 404));
        }
        res.status(200).json({data: doc});
    });

exports.getAll = (model, modelName='') => 
    asyncHandler(async (req, res, next) => {
        let filter = {};
        if(req.filterObj){
            filter = req.filterObj;
        }
        const docCount = await model.countDocuments();
        const apiFeatures = new ApiFeatures(model.find(filter), req.query)
            .pagination(docCount)
            .filter()
            .search(modelName)
            .limitFields()
            .sort()
            .mongooseQueryExec();
    
        const { mongooseQuery, paginationResult } = apiFeatures;
        const docs = await mongooseQuery;
    
        res.status(200).json({
            results: docs.length,
            paginationResult,
            data: docs
        })
    });