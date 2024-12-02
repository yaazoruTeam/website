import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.log('i in error handler 1233333');
    
    console.error('Error:', err.message);
    const status = err.status || 500;
    const message = err.message || 'Internal server error';

    res.status(status).json({
        error: {
            status,
            message,
        },
    });
}

export{
    errorHandler
}