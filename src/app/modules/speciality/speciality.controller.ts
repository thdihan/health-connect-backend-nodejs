import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { SpecialityService } from "./speciality.service";
import { UploadApiResponse } from "cloudinary";
import { uploadToCloud } from "../../middlewares/uploadToCloud";

const addSpeciality = catchAsync(async (req, res) => {
    console.log("[LOG : speciality.controller -> addSpeciality() ] Called");
    console.log(
        "[LOG : speciality.controller -> addSpeciality() ] file",
        req.file
    );
    console.log(
        "[LOG : speciality.controller -> addSpeciality() ] data",
        req.body
    );

    if (req.file) {
        const uploadedImage: UploadApiResponse | undefined =
            await uploadToCloud(req.file);
        req.body.icon = uploadedImage?.secure_url;
        console.log(
            "[LOG : speciality.controller -> addSpeciality() ] uploadedImage",
            uploadedImage
        );
    }
    const result = await SpecialityService.addSpeciality(req.body);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Speciality created successfully",
        data: result,
    });
});

const getSpecialities = catchAsync(async (req, res) => {
    const result = await SpecialityService.getSpecialities();

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Speciality fetched successfully",
        meta: result.meta,
        data: result.data,
    });
});

export const SpecialityController = {
    addSpeciality,
    getSpecialities,
};
