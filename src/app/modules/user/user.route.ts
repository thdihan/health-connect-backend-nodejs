import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import { JwtHelper } from "../../utils/jwtHelper";
import { Secret } from "jsonwebtoken";
import config from "../../config";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";
import { upload } from "../../middlewares/fileUpload";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";

const router = express.Router();

router.post(
    "/",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    upload.single("file"),
    (req, res) => {
        req.body = UserValidation.userRegistration.parse(
            JSON.parse(req.body.data)
        );
        return UserController.createAdmin(req, res);
    }
);

export const UserRoute = router;
