import { z } from "zod";

const addSpeciality = z.object({
    title: z.string({
        required_error: "Title is required!",
    }),
});

export const SpecialityValidation = {
    addSpeciality,
};
