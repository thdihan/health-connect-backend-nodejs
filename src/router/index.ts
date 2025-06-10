import express from "express";
import { UserRoute } from "../app/modules/user/user.route";
import { AdminRoutes } from "../app/modules/admin/admin.route";

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
];

routeList.forEach((item) => router.use(item.path, item.route));

export default router;
