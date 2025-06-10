import { equal } from "assert";
import { Prisma } from "../../../generated/prisma";
import { adminSearchableFields } from "./admin.constant";
import { formatQueryOptions } from "../../../utils/formatQueryOptions";
import prisma from "../../../utils/prisma";

const getAllAdminsFromDB = async (params: any, options: any) => {
    console.log("[LOG : admin.service -> getAllAdminsFromDB()] Called");
    console.log(
        "[LOG : admin.service -> getAllAdminsFromDB()] Params\n",
        params
    );

    const { searchTerm, ...filterTypes } = params;
    const { page, skip, limit, sortBy, sortOrder } =
        formatQueryOptions(options);

    console.log(
        "[LOG : admin.service -> getAllAdminsFromDB()] Search Term\n",
        searchTerm
    );

    console.log(
        "[LOG : admin.service -> getAllAdminsFromDB()] Filter Types\n",
        filterTypes
    );

    console.log("[LOG : admin.service -> getAllAdminsFromDB()] Options\n", {
        page,
        skip,
        limit,
        sortBy,
        sortOrder,
    });

    const andConditions: Prisma.AdminWhereInput[] = [];

    // Search using name and email.
    if (searchTerm) {
        andConditions.push({
            OR: adminSearchableFields.map((field) => ({
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
                [key]: {
                    equals: filterTypes[key],
                },
            })),
        });
    }

    const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };
    const result = await prisma.admin.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
    });
    return result;
};

export const AdminService = {
    getAllAdminsFromDB,
};
