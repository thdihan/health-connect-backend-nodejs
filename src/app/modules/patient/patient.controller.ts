import { Request, Response } from "express";

import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { pick } from "lodash";
import { patientFilterableFields } from "./patient.constant";
import { PatientService } from "./patient.service";
import { sendResponse } from "../../utils/sendResponse";
import { paginationOptions } from "../../utils/formatQueryOptions";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, patientFilterableFields);
    const options = pick(req.query, paginationOptions);

    const result = await PatientService.getAllPatient(filters, options);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Patient retrieval successfully",
        meta: result.meta,
        data: result.data,
    });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PatientService.getByIdFromDB(id);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Patient retrieval successfully",
        data: result,
    });
});

export const PatientController = {
    getAllFromDB,
    getByIdFromDB,
};
