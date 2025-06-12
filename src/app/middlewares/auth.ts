import { NextFunction, Request, Response } from "express";
import { JwtHelper } from "../utils/jwtHelper";
import config from "../config";
import { Secret } from "jsonwebtoken";
import ApiError from "../errors/ApiError";
import httpStatus from "http-status";

export const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;

            if (!token) {
                throw new ApiError(
                    httpStatus.UNAUTHORIZED,
                    "You are not authorized!!!"
                );
            }

            const decodedData = JwtHelper.verifyToken(
                token,
                config.jwt.secret as Secret
            );

            if (roles.length && !roles.includes(decodedData.role)) {
                throw new ApiError(
                    httpStatus.FORBIDDEN,
                    "You are forbidden for this api!!!"
                );
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
