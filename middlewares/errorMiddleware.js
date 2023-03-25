const globalError = (err, req, res ,next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    
    if(process.env.NODE_ENV === 'development'){
        sendErrorForDev(err, res);
    } else {
        sendErrorForProduction(err, res);
    }
};

const sendErrorForDev = (err, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        msg: err.message,
        stack: err.stack
    });
};

const sendErrorForProduction = (err, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        msg: err.message,
    });
};

module.exports = globalError;