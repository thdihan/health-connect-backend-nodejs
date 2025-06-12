import { Request, Response } from "express";
import { UserService } from "./user.service";
import { uploadToCloud } from "../../middlewares/uploadToCloud";
import { UploadApiResponse } from "cloudinary";

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

export const UserController = {
    createAdmin,
};
