import express from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";
import { DoctorController } from "./doctor.controller";

const router = express.Router();

router.get(
    "/",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    DoctorController.getAllDoctor
);

export const DoctorRoutes = router;
