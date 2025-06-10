import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import { pick } from "../../../utils/pick";
import {
    adminFilterableFields,
    adminPaginationOptions,
} from "./admin.constant";

const getAllAdmins = async (req: Request, res: Response) => {
    const pickedQuery = pick(req.query, adminFilterableFields);
    const options = pick(req.query, adminPaginationOptions);
    console.log(
        "[LOG : admin.controller -> getAllAdmins()] Picked Query\n",
        pickedQuery
    );
    try {
        const result = await AdminService.getAllAdminsFromDB(
            pickedQuery,
            options
        );

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
