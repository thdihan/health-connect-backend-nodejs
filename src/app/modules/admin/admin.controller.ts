import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import { pick } from "../../../utils/pick";
import { adminFilterableFields } from "./admin.constant";
import { paginationOptions } from "../../../utils/formatQueryOptions";

const getAllAdmins = async (req: Request, res: Response) => {
    const pickedQuery = pick(req.query, adminFilterableFields);
    const options = pick(req.query, paginationOptions);
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
            message: "Admins fetched successfully",
            meta: result.meta,
            data: result.data,
        });
    } catch (error) {
        res.status(200).json({
            success: true,
            message: "Failed to fetch admin.",
            error: error,
        });
    }
};

const getAdminById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await AdminService.getAdminByIdFromDB(id);
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

const updateAdminById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await AdminService.updateAdminByIdIntoDB(id, req.body);
        res.status(200).json({
            success: true,
            message: "Admin updated successfully",
            data: result,
        });
    } catch (error) {
        res.status(200).json({
            success: true,
            message: "Failed to update admin.",
            error: error,
        });
    }
};

const deleteAdmin = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await AdminService.deleteAdminFromDB(id);
        res.status(200).json({
            success: true,
            message: "Admin deleted successfully",
            data: result,
        });
    } catch (error) {
        res.status(200).json({
            success: true,
            message: "Failed to delete admin.",
            error: error,
        });
    }
};

export const AdminController = {
    getAllAdmins,
    getAdminById,
    updateAdminById,
    deleteAdmin,
};
