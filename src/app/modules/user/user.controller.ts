import { Request, RequestHandler, Response } from "express";
import { UserService } from "./user.service";
import { uploadToCloud } from "../../middlewares/uploadToCloud";
import { UploadApiResponse } from "cloudinary";
import { catchAsync } from "../../utils/catchAsync";
import { pick } from "../../utils/pick";
import { userFilterableFields, userSearchableFields } from "./user.constant";
import { paginationOptions } from "../../utils/formatQueryOptions";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createAdmin = async (req: Request, res: Response) => {
    console.log("[LOG : user.controller -> createAdmin() ] Called");
    console.log("[LOG : user.controller -> createAdmin() ] file", req.file);
    console.log("[LOG : user.controller -> createAdmin() ] data", req.body);

    if (req.file) {
        const uploadedImage: UploadApiResponse | undefined =
            await uploadToCloud(req.file);
        req.body.admin.profilePhoto = uploadedImage?.secure_url;
        console.log(
            "[LOG : user.controller -> createAdmin() ] uploadedImage",
            uploadedImage
        );
    }

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

const createDoctor = async (req: Request, res: Response) => {
    console.log("[LOG : user.controller -> createDoctor() ] Called");
    console.log("[LOG : user.controller -> createDoctor() ] file", req.file);
    console.log("[LOG : user.controller -> createDoctor() ] data", req.body);

    if (req.file) {
        const uploadedImage: UploadApiResponse | undefined =
            await uploadToCloud(req.file);
        req.body.doctor.profilePhoto = uploadedImage?.secure_url;
        console.log(
            "[LOG : user.controller -> createDoctor() ] uploadedImage",
            uploadedImage
        );
    }

    try {
        const result = await UserService.createDoctorIntoDB(req.body);

        res.status(200).json({
            success: true,
            message: "Doctor created successfully",
            result: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create doctor.",
            error: error,
        });
    }
};

const getAllUser: RequestHandler = catchAsync(async (req, res) => {
    const pickedQuery = pick(req.query, userFilterableFields);
    const options = pick(req.query, paginationOptions);
    console.log(
        "[LOG : user.controller -> getAllUser()] Picked Query\n",
        pickedQuery
    );

    const result = await UserService.getAllUsersFromDB(pickedQuery, options);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Admins fetched successfully",
        meta: result.meta,
        data: result.data,
    });
});

const changeUserStatus: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await UserService.changeUserStatus(id, req.body.status);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "User status changed successfully",
        data: result,
    });
});

export const UserController = {
    createAdmin,
    createDoctor,
    getAllUser,
    changeUserStatus,
};
