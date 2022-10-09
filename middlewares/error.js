const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err,req,res,next) => {
    console.log(err.stack.red);

    let error = {...err};
    error.message = err.message;

    // Mongoose bad ObjectId Error
    if(err.name == "CastError") {
        const message = `Resource not found with id ${err.value}`;
        error = new ErrorResponse(message,404);
    }

    // Mongoose duplicate key Error
    if(err.code == 1100) {
        const message = `Duplicate field value entered`;
        error = new ErrorResponse(message,400)
    }

    console.log(err.name,err.message);

    // Mongoose Validation Error
    if(err.name == "ValidationError") {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message,400);
    }

    res.status(error.status || 500).json({
        succes : false, error : error.message || "Server Error"
    })
}

module.exports = errorHandler;