import express from "express";
import { UserRoute } from "../app/modules/user/user.route";

const router = express.Router();

const routeList = [
    {
        path: "/user",
        route: UserRoute,
    },
];

routeList.forEach((item) => router.use(item.path, item.route));

export default router;
