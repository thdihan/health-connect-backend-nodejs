import { Prisma, UserRole, UserStatus } from "../../../generated/prisma";
import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";
import {
    formatQueryOptions,
    TQueryOptions,
} from "../../utils/formatQueryOptions";
import { userSearchableFields } from "./user.constant";

const createAdminIntoDB = async (data: any) => {
    console.log("[LOG : user.service -> createAdminIntoDB()] Called");
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userData = {
        email: data.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN,
    };
    const adminData = {
        ...data.admin,
    };

    const result = await prisma.$transaction(async (client) => {
        const createdUser = await client.user.create({
            data: userData,
        });

        const createdAdmin = await client.admin.create({
            data: adminData,
        });

        return createdAdmin;
    });

    return result;
};

const createDoctorIntoDB = async (data: any) => {
    console.log("[LOG : user.service -> createDoctorIntoDB()] Called");
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userData = {
        email: data.doctor.email,
        password: hashedPassword,
        role: UserRole.DOCTOR,
    };
    const doctorData = {
        ...data.doctor,
    };

    const result = await prisma.$transaction(async (client) => {
        const createdUser = await client.user.create({
            data: userData,
        });

        const createdDoctor = await client.doctor.create({
            data: doctorData,
        });

        return createdDoctor;
    });

    return result;
};

const getAllUsersFromDB = async (params: any, options: TQueryOptions) => {
    console.log("[LOG : user.service -> getAllUsersFromDB()] Called");
    console.log("[LOG : user.service -> getAllUsersFromDB()] Params\n", params);

    const { searchTerm, ...filterTypes } = params;
    const { page, skip, limit, sortBy, sortOrder } =
        formatQueryOptions(options);

    console.log(
        "[LOG : user.service -> getAllUsersFromDB()] Search Term\n",
        searchTerm
    );

    console.log(
        "[LOG : user.service -> getAllUsersFromDB()] Filter Types\n",
        filterTypes
    );

    console.log("[LOG : user.service -> getAllUsersFromDB()] Options\n", {
        page,
        skip,
        limit,
        sortBy,
        sortOrder,
    });

    const andConditions: Prisma.UserWhereInput[] = [];

    // Search with email.
    if (searchTerm) {
        andConditions.push({
            OR: userSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }

    // Filter based on equals of field
    if (Object.keys(filterTypes).length > 0) {
        andConditions.push({
            AND: Object.keys(filterTypes).map((key) => ({
                [key as keyof typeof filterTypes]: {
                    equals: filterTypes[key as keyof typeof filterTypes],
                },
            })),
        });
    }

    const whereConditions: Prisma.UserWhereInput = { AND: andConditions };
    const result = await prisma.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
            id: true,
            email: true,
            role: true,
            needPasswordChange: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            admin: true,
            doctor: true,
        },
    });

    const total = await prisma.user.count({
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

const changeUserStatus = async (id: string, status: UserStatus) => {
    await prisma.user.findUniqueOrThrow({
        where: {
            id,
        },
    });

    const result = await prisma.user.update({
        where: {
            id,
        },
        data: {
            status,
        },
    });

    return result;
};

export const UserService = {
    createAdminIntoDB,
    createDoctorIntoDB,
    getAllUsersFromDB,
    changeUserStatus,
};
