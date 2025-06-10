import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import { pick } from "../../../utils/pick";
import { adminFilterableFields } from "./admin.constant";
import { paginationOptions } from "../../../utils/formatQueryOptions";
import { sendResponse } from "../../../utils/sendResponse";
import httpStatus from "http-status";

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

        sendResponse(res, {
            status: httpStatus.OK,
            success: true,
            message: "Admins fetched successfully",
            meta: result.meta,
            data: result.data,
        });
    } catch (error) {
        sendResponse(res, {
            status: httpStatus.NOT_FOUND,
            success: false,
            message: "Failed to fetch admin.",
            error: error,
        });
    }
};

const getAdminById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await AdminService.getAdminByIdFromDB(id);
        sendResponse(res, {
            status: httpStatus.OK,
            success: true,
            message: "Admin fetched successfully",
            data: result,
        });
    } catch (error) {
        sendResponse(res, {
            status: httpStatus.NOT_FOUND,
            success: false,
            message: "Failed to fetch admin.",
            error: error,
        });
    }
};

const updateAdminById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await AdminService.updateAdminByIdIntoDB(id, req.body);
        sendResponse(res, {
            status: httpStatus.OK,
            success: true,
            message: "Admin updated successfully",
            data: result,
        });
    } catch (error) {
        sendResponse(res, {
            status: httpStatus.NOT_FOUND,
            success: false,
            message: "Failed to update admin.",
            error: error,
        });
    }
};

const deleteAdmin = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await AdminService.deleteAdminFromDB(id);
        sendResponse(res, {
            status: httpStatus.OK,
            success: true,
            message: "Admin deleted successfully",
            data: result,
        });
    } catch (error) {
        sendResponse(res, {
            status: httpStatus.NOT_FOUND,
            success: false,
            message: "Failed to delete admin.",
            error: error,
        });
    }
};

const softDeleteAdmin = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await AdminService.softDeleteAdminFromDB(id);
        sendResponse(res, {
            status: httpStatus.OK,
            success: true,
            message: "Admin deleted successfully",
            data: result,
        });
    } catch (error) {
        sendResponse(res, {
            status: httpStatus.NOT_FOUND,
            success: false,
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
    softDeleteAdmin,
};
