import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const login = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);

    res.cookie("refreshToken", result.refreshToken, {
        secure: false,
        httpOnly: true,
    });

    console.log("[LOG : auth.controller -> login()] Result\n", result);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Logged in successfully",
        data: {
            accessToken: result.accessToken,
            needPasswordChange: result.needPasswordChange,
        },
    });
});
const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    const result = await AuthService.refreshToken(refreshToken);

    console.log("[LOG : auth.controller -> login()] Result\n", result);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Logged in successfully",
        data: result,
    });
});

export const AuthController = {
    login,
    refreshToken,
};
