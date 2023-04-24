const ErrorHandler = require("../utils/errorhandler")

module.exports = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";

    // suppose id hamne bahut choti daali h so cast error aaega
    // wrong mongodb id error
    if(err.name === "CastError") {
        const message = `Resource not found . Invalid ${err.path}`
        err = new ErrorHandler(message,400)
    }

    // mongoose duplicate key error
    if(err.code === 11000 || err.name === "MongoServerError") {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message,400);
    }

    // wrong jwt token
    if(err.name === "JsonWebTokenError") {
        const message = `Json Web Token is invalid , try aagain`
        err = new ErrorHandler(message,400)
    }

    // JWT expire error
    if(err.name === "TokeExpiredError") {
        const message = `Json Web Token is expired , try aagain`
        err = new ErrorHandler(message,400)
    }

    res.status(err.statusCode).json({
        success : false,
        message:err.stack
    })
}