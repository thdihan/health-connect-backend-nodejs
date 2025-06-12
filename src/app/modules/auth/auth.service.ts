import prisma from "../../utils/prisma";

import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JwtHelper } from "../../utils/jwtHelper";
import { UserService } from "../user/user.service";
import { UserStatus } from "../../../generated/prisma";
import config from "../../config";

const login = async (payload: { email: string; password: string }) => {
    console.log("[LOG : auth.service -> login()] Called");
    console.log("[LOG : auth.service -> login()] Payload\n", payload);

    const result = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE,
        },
    });

    console.log("[LOG : auth.service -> login()] Result\n", result);

    const isCorrectPassword: boolean = await bcrypt.compare(
        payload.password,
        result.password
    );

    if (!isCorrectPassword) throw new Error("Password incorrect");

    const accessToken = JwtHelper.generateToken(
        {
            email: result.email,
            role: result.role,
        },
        config.jwt.secret as string,
        config.jwt.expires_in as string
    );

    const refreshToken = JwtHelper.generateToken(
        {
            email: result.email,
            role: result.role,
        },
        config.jwt.refresh_token_secret as string,
        config.jwt.refresh_token_expires_in as string
    );
    return {
        accessToken,
        needPasswordChange: result.needPasswordChange,
        refreshToken,
    };
};

const refreshToken = async (token: string) => {
    console.log("[LOG : auth.service -> refreshToken()] Called");
    console.log("[LOG : auth.service -> refreshToken()] Token\n", token);

    const decodedData = JwtHelper.verifyToken(token, "efgghh");

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData?.email,
            status: UserStatus.ACTIVE,
        },
    });

    const accessToken = JwtHelper.generateToken(
        {
            email: userData.email,
            role: userData.role,
        },
        config.jwt.secret as string,
        config.jwt.expires_in as string
    );
    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange,
    };
};

export const AuthService = {
    login,
    refreshToken,
};
