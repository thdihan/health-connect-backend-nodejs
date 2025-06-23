import prisma from "../../utils/prisma";

const addSpeciality = async (payload: any) => {
    console.log("[LOG : speciality.service -> addSpeciality()] Called");

    const result = await prisma.specialties.create({
        data: payload,
    });

    return result;
};

const getSpecialities = async () => {
    const result = await prisma.specialties.findMany();

    const total = await prisma.user.count();

    return {
        meta: {
            total,
        },
        data: result,
    };
};

export const SpecialityService = {
    addSpeciality,
    getSpecialities,
};
