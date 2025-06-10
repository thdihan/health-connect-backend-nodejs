import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

const getAllAdminsFromDB = async (params: any) => {
    console.log("[LOG : admin.service -> getAllAdminsFromDB()] Called");
    console.log(
        "[LOG : admin.service -> getAllAdminsFromDB()] Params\n",
        params
    );

    // Search using name and email.
    const searchTerm = params.searchTerm || "";
    console.log(
        "[LOG : admin.service -> getAllAdminsFromDB()] Search Term\n",
        searchTerm
    );

    const result = await prisma.admin.findMany({
        where: {
            OR: [
                {
                    name: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    email: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
            ],
        },
    });
    return result;
};

export const AdminService = {
    getAllAdminsFromDB,
};
