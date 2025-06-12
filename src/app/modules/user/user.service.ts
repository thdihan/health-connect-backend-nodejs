import { UserRole } from "../../../generated/prisma";
import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";

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

export const UserService = {
    createAdminIntoDB,
    createDoctorIntoDB,
};
