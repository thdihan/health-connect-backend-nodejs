import { RequestHandler } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { doctorFilterableFields } from "./doctor.constant";
import { pick } from "../../utils/pick";
import { paginationOptions } from "../../utils/formatQueryOptions";
import { DoctorService } from "./doctor.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const getAllDoctor: RequestHandler = catchAsync(async (req, res) => {
    const pickedQuery = pick(req.query, doctorFilterableFields);
    const options = pick(req.query, paginationOptions);
    console.log(
        "[LOG : doctor.controller -> getAllDoctor()] Picked Query\n",
        pickedQuery
    );

    const result = await DoctorService.getAllDoctor(pickedQuery, options);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Doctor fetched successfully",
        meta: result.meta,
        data: result.data,
    });
});

export const DoctorController = {
    getAllDoctor,
};
