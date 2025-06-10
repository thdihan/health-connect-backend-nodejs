import { Request, Response } from "express";
import { AdminService } from "./admin.service";

const getAllAdmins = async (req: Request, res: Response) => {
    try {
        const result = await AdminService.getAllAdminsFromDB(req.query);

        res.status(200).json({
            success: true,
            message: "Admin fetched successfully",
            data: result,
        });
    } catch (error) {
        res.status(200).json({
            success: true,
            message: "Failed to fetch admin.",
            error: error,
        });
    }
};

export const AdminController = {
    getAllAdmins,
};
