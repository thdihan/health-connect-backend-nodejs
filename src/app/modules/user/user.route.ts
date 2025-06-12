import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import { JwtHelper } from "../../utils/jwtHelper";
import { Secret } from "jsonwebtoken";
import config from "../../config";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";

const router = express.Router();

router.post(
    "/",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    UserController.createAdmin
);

export const UserRoute = router;
