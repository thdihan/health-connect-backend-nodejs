import { Request, Response } from "express";
import { UserService } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
    console.log("[LOG : user.controller -> createAdmin() ] Called");

    console.log(
        "[LOG : user.controller -> createAdmin() ] Req Body\n",
        req.body
    );

    const result = await UserService.createAdminIntoDB(req.body);

    res.status(200).json({
        message: "Admin Created",
        result: result,
    });
};

export const UserController = {
    createAdmin,
};
