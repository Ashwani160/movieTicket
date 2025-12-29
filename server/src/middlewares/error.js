import { config } from "dotenv";
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";

// Use standard integer codes for robustness (400 for Mongoose validation errors, 500 for others)
const BAD_REQUEST = 400;
const INTERNAL_SERVER_ERROR = 500;
const INTERNAL_SERVER_ERROR_MESSAGE = 'Internal Server Error';
const BAD_REQUEST_MESSAGE = 'Bad Request';

const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode =
            error.statusCode || (error instanceof mongoose.Error ? BAD_REQUEST : INTERNAL_SERVER_ERROR);
            
        // Provide default message if error object doesn't have one
        const message = error.message || (statusCode === BAD_REQUEST ? BAD_REQUEST_MESSAGE : INTERNAL_SERVER_ERROR_MESSAGE);

        error = new ApiError(statusCode, message, false, err.stack);
    }
    next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    
    // In production, hide stack trace and ensure a generic 500 status/message for non-operational errors
    if (config.env === 'production' && !err.isOperational) {
        statusCode = INTERNAL_SERVER_ERROR;
        message = INTERNAL_SERVER_ERROR_MESSAGE;
    }

    res.locals.errorMessage = err.message;

    const response = {
        code: statusCode,
        message,
        // Only include stack trace in development environment
        ...(config.env === 'development' && { stack: err.stack }), 
    };

    // Note: The original logger import was missing, assuming you have a logger defined elsewhere.
    // if (config.env === 'development') { logger.error(err); }

    // Use the correctly resolved statusCode
    res.status(statusCode).send(response);
};

export { errorHandler, errorConverter };
