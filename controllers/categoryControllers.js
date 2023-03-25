const CategoryModel = require('../models/categoryModel');

exports.addCategory = (req, res) => {
    const name = req.body.name;
    console.log(name);

    const newCategory = new CategoryModel({name});
    newCategory
        .save()
        .then( doc => res.json(doc))
        .catch(err => res.json(err));
}