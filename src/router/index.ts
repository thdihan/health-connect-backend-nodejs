import express from "express";
import { UserRoute } from "../app/modules/user/user.route";
import { AdminRoutes } from "../app/modules/admin/admin.route";
import { AuthRoutes } from "../app/modules/auth/auth.route";

const router = express.Router();

const routeList = [
    {
        path: "/user",
        route: UserRoute,
    },
    {
        path: "/admin",
        route: AdminRoutes,
    },
    {
        path: "/auth",
        route: AuthRoutes,
    },
];

routeList.forEach((item) => router.use(item.path, item.route));

export default router;
