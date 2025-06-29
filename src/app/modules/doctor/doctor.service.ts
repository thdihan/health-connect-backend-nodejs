import { Prisma, UserStatus } from "../../../generated/prisma";
import {
    formatQueryOptions,
    TQueryOptions,
} from "../../utils/formatQueryOptions";
import prisma from "../../utils/prisma";
import { doctorSearchableFields } from "./doctor.constant";
import { TFilterParams } from "./doctor.interface";

const getAllDoctor = async (params: TFilterParams, options: TQueryOptions) => {
    console.log("[LOG : doctor.service -> getAllDoctor()] Called");
    console.log("[LOG : doctor.service -> getAllDoctor()] Params\n", params);

    const { searchTerm, ...filterTypes } = params;
    const { page, skip, limit, sortBy, sortOrder } =
        formatQueryOptions(options);

    console.log(
        "[LOG : doctor.service -> getAllDoctor()] Search Term\n",
        searchTerm
    );

    console.log(
        "[LOG : doctor.service -> getAllDoctor()] Filter Types\n",
        filterTypes
    );

    console.log("[LOG : doctor.service -> getAllDoctor()] Options\n", {
        page,
        skip,
        limit,
        sortBy,
        sortOrder,
    });

    const andConditions: Prisma.DoctorWhereInput[] = [];
    // Search using name and email.
    if (searchTerm) {
        andConditions.push({
            OR: doctorSearchableFields.map((field) => ({
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

    const whereConditions: Prisma.DoctorWhereInput = { AND: andConditions };

    const result = await prisma.doctor.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });

    const total = await prisma.doctor.count({
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

const getDoctorById = async (doctorId: string) => {
    const result = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: doctorId,
            isDeleted: false,
        },
    });

    return result;
};

const deleteDoctor = async (doctorId: string) => {
    const result = await prisma.$transaction(async (client) => {
        const deletedDoctor = await client.doctor.delete({
            where: {
                id: doctorId,
            },
        });

        await client.user.delete({
            where: {
                email: deletedDoctor.email,
            },
        });

        return deletedDoctor;
    });

    return result;
};

const softDeleteDoctor = async (doctorId: string) => {
    const result = await prisma.$transaction(async (client) => {
        const deletedDoctor = await client.doctor.update({
            where: {
                id: doctorId,
                isDeleted: false,
            },
            data: {
                isDeleted: true,
            },
        });

        await client.user.update({
            where: {
                email: deletedDoctor.email,
            },
            data: {
                status: UserStatus.DELETED,
            },
        });

        return deletedDoctor;
    });

    return result;
};

export const DoctorService = {
    getAllDoctor,
    deleteDoctor,
    softDeleteDoctor,
    getDoctorById,
};
