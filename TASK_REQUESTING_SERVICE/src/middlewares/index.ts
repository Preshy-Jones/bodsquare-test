const config = require("../config");
// const logger = require("../logger");
import { Request, Response, NextFunction } from "express";

export const NotFoundHandler = (req: Request, res: Response) => {
  return res.status(404).send({
    status: "error",
    message: "endpoint not found",
  });
};

export const ErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }
  switch (err.name) {
    case "ServiceError":
      return res.status(400).send({
        status: "error",
        code: "400",
        message: err.message,
      });
    case "ConflictError":
      return res.status(409).send({
        status: "error",
        code: "409",
        message: err.message,
      });
    case "NotFoundError":
      return res.status(404).send({
        status: "error",
        code: "404",
        message: err.message,
      });
    case "ValidationError":
      return res.status(422).send({
        status: "error",
        code: "422",
        message: err.message,
        errors: err.errors,
      });
    case "AuthenticationError":
      return res.status(401).send({
        status: "error",
        code: "401",
        message: err.message,
      });
    case "AuthorizationError":
      return res.status(403).send({
        status: "error",
        code: "403",
        message: err.message,
      });
    default:
      // logger.error(err);
      return res.status(500).send({
        status: "error",
        code: "500",
        message: "an error occurred",
        ...(config.env.isProduction
          ? {}
          : { error: err.message || err.toString() }),
      });
  }
};
