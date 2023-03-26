class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
        this.findQuery = {};
    }

    filter() {
        const queryStringObj = { ...this.queryString };
        const excludesFields = ["page", "sort", "limit", "fields", "keyword"];
        excludesFields.forEach((field) => delete queryStringObj[field]);
        let queryStr = JSON.stringify(queryStringObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    
        this.findQuery = JSON.parse(queryStr);
    
        return this;
    }
    
    search(model){
        if (this.queryString.keyword) {
            if (model === "Product") {
                this.findQuery.$or = [
                    {
                        title: {
                            $regex: this.queryString.keyword,
                            $options: "i",
                        },
                    },
                    {
                        description: {
                            $regex: this.queryString.keyword,
                            $options: "i",
                        },
                    },
                ];
            } else {
                this.findQuery.name = {
                    $regex: this.queryString.keyword,
                    $options: "i",
                };
            }
        }
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        } else {
            this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.select(fields);
        } else {
            this.mongooseQuery = this.mongooseQuery.select("-__v");
        }
        return this;
    }

    pagination(docCount) {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 50;
        const skip = (page - 1) * limit;
        const endIndex = page * limit;

        const pagination = {};
        pagination.limit = limit;
        pagination.numberOfPages = Math.ceil(docCount / limit);
        pagination.currentPage = page;
        if (endIndex < docCount) {
            pagination.next = page + 1;
        }
        if (skip > 0) {
            pagination.prev = page - 1;
        }

        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        this.paginationResult = pagination;
        return this;
    }

    mongooseQueryExec(){
        this.mongooseQuery = this.mongooseQuery.find(this.findQuery);
        return this;
    }
}

module.exports = ApiFeatures;
