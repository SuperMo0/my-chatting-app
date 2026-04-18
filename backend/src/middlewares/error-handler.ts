import type { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    if (process.env.NODE_ENV === "production") {
        return res.status(503).json({ message: "Service unavailable" });
    }

    return res.status(500).json({
        stack: error?.stack,
    });
};

export default errorHandler;