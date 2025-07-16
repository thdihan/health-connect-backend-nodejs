import { Patient, Prisma } from "../../../generated/prisma";
import {
    formatQueryOptions,
    TQueryOptions,
} from "../../utils/formatQueryOptions";
import prisma from "../../utils/prisma";
import { patientSearchableFields } from "./patient.constant";
import { TFilterParams } from "./patient.interface";

const getAllPatient = async (params: TFilterParams, options: TQueryOptions) => {
    console.log("[LOG : patient.service -> getAllPatient()] Called");
    console.log("[LOG : patient.service -> getAllPatient()] Params\n", params);

    const { searchTerm, ...filterTypes } = params;
    const { page, skip, limit, sortBy, sortOrder } =
        formatQueryOptions(options);

    console.log(
        "[LOG : patient.service -> getAllPatient()] Search Term\n",
        searchTerm
    );

    console.log(
        "[LOG : patient.service -> getAllPatient()] Filter Types\n",
        filterTypes
    );

    console.log("[LOG : patient.service -> getAllPatient()] Options\n", {
        page,
        skip,
        limit,
        sortBy,
        sortOrder,
    });

    const andConditions: Prisma.PatientWhereInput[] = [];
    // Search using name and email.
    if (searchTerm) {
        andConditions.push({
            OR: patientSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }

    if (Object.keys(filterTypes).length > 0) {
        andConditions.push({
            AND: Object.keys(filterTypes).map((key) => ({
                [key as keyof typeof filterTypes]: {
                    equals: filterTypes[key as keyof typeof filterTypes],
                },
            })),
        });
    }

    andConditions.push({
        isDeleted: false,
    });

    const whereConditions: Prisma.PatientWhereInput = { AND: andConditions };

    const result = await prisma.patient.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },

        include: {
            MedicalReport: true,
            patientHealthData: true,
        },
    });

    const total = await prisma.patient.count({
        where: whereConditions,
    });

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};

const getByIdFromDB = async (id: string): Promise<Patient | null> => {
    const result = await prisma.patient.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            MedicalReport: true,
            patientHealthData: true,
        },
    });
    return result;
};

const updatePatient = async (
    id: string,
    payload: any
): Promise<Patient | null> => {
    console.log("[LOG : patient.service -> updatePatient()] Called");
    console.log("[LOG : patient.service -> updatePatient()] Id", id);
    console.log("[LOG : patient.service -> updatePatient()] Payload", payload);

    const { patientHealthData, medicalReport, ...patientData } = payload;

    console.log(
        "[LOG : patient.service -> updatePatient()] patientHealthData",
        patientHealthData
    );
    console.log(
        "[LOG : patient.service -> updatePatient()] medicalReport",
        medicalReport
    );

    await prisma.patient.findUniqueOrThrow({
        where: {
            id,
        },
    });

    const result = await prisma.$transaction(async (client) => {
        // Create Patient health data
        if (patientHealthData) {
            await client.patientHealthData.upsert({
                where: {
                    patientId: id,
                },
                update: patientHealthData,
                create: { patientId: id, ...patientHealthData },
            });
        }

        // Create medical report
        if (medicalReport) {
            await client.medicalReport.create({
                data: { patientId: id, ...medicalReport },
            });
        }

        // Update Patient
        const updatedPatient = await prisma.patient.update({
            where: {
                id: id,
            },
            data: patientData,
            include: {
                MedicalReport: true,
                patientHealthData: true,
            },
        });
        return updatedPatient;
    });

    const updatedPatient = await prisma.patient.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            MedicalReport: true,
            patientHealthData: true,
        },
    });

    return updatedPatient;
};

export const PatientService = {
    getAllPatient,
    getByIdFromDB,
    updatePatient,
};
