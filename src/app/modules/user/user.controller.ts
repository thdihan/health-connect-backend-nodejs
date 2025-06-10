import { Request, Response } from "express";
import { UserService } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
    console.log("[LOG : user.controller -> createAdmin() ] Called");

    console.log(
        "[LOG : user.controller -> createAdmin() ] Req Body\n",
        req.body
    );

    try {
        const result = await UserService.createAdminIntoDB(req.body);

        res.status(200).json({
            success: true,
            message: "Admin created successfully",
            result: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create admin.",
            error: error,
        });
    }
};

export const UserController = {
    createAdmin,
};
