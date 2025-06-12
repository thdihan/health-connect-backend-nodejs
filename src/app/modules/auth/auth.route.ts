import express from "express";
import { AuthController } from "./auth.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";

const router = express.Router();

router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refreshToken);
router.post(
    "/change-password",
    auth(
        UserRole.ADMIN,
        UserRole.SUPER_ADMIN,
        UserRole.DOCTOR,
        UserRole.PATIENT
    ),
    AuthController.passwordChange
);
router.post(
    "/reset-password",
    auth(
        UserRole.ADMIN,
        UserRole.SUPER_ADMIN,
        UserRole.DOCTOR,
        UserRole.PATIENT
    ),
    AuthController.resetPassword
);

export const AuthRoutes = router;
