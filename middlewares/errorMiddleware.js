const sendErrorForDev = (err, res) => (
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        msg: err.message,
        stack: err.stack
    })
);

const sendErrorForProduction = (err, res) => (
    res.status(err.statusCode).json({
        status: err.status,
        msg: err.message,
    })
);
    

const globalError = (err, req, res ,next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    
    if(process.env.NODE_ENV === 'development'){
        sendErrorForDev(err, res);
    } else {
        sendErrorForProduction(err, res);
    }
};

module.exports = globalError;