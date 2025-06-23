import express from "express";
import { SpecialityController } from "./speciality.controller";
import { upload } from "../../middlewares/fileUpload";
import { SpecialityValidation } from "./speciality.validation";

const router = express.Router();

router.post("/", upload.single("file"), (req, res, next) => {
    req.body = SpecialityValidation.addSpeciality.parse(
        JSON.parse(req.body.data)
    );
    return SpecialityController.addSpeciality(req, res, next);
});

router.get("/", SpecialityController.getSpecialities);
export const SpecialityRoutes = router;
