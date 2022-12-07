import express from "express";
import * as userController from "../controllers/userController"
import * as doctorController from "../controllers/doctorController"
import * as patientController from "../controllers/patientController"
import * as specialtyController from "../controllers/specialtyController"
import * as clinicController from "../controllers/clinicController"

let router = express.Router();

const initApiRoutes = (app) => {
    router.post("/api/login", userController.handleLogin)
    router.get("/api/get-all-user", userController.handleGetAllUser)
    router.post("/api/create-new-user", userController.handleCreateNewUser)
    router.put("/api/edit-user", userController.handleEditNewUser)
    router.delete("/api/delete-user", userController.handleDeleteNewUser)

    router.get("/api/get-all-code", userController.handleGetAllCode)

    router.get("/api/top-doctor-home", doctorController.getTopDoctorHome)
    router.get("/api/get-all-doctors", doctorController.getAllDoctors)

    router.post("/api/save-info-doctor", doctorController.saveInfoDoctor)
    router.get("/api/get-detail-doctor", doctorController.getDetailDoctor)

    router.post("/api/bulk-schedule-doctor", doctorController.saveScheduleDoctor)
    router.get("/api/get-schedule-by-date", doctorController.getScheduleByDate)

    router.get("/api/get-address-info-doctor", doctorController.getAddressInfoDoctor)
    router.get("/api/get-profile-doctor", doctorController.getProfileDoctor)

    router.get("/api/get-list-patient", doctorController.getListPatientForDoctor)
    router.post("/api/send-remedy", doctorController.sendRemedy)

    router.post("/api/save-booking-patient", patientController.saveBookingOfPatient)
    router.post("/api/verify-booking-appointment", patientController.postBookingAppointment)

    router.post("/api/save-info-specialty", specialtyController.saveInfoSpecialty)
    router.get("/api/top-specialty-home", specialtyController.getTopSpecialtyHome)

    router.get("/api/get-all-specialty", specialtyController.getAllSpecialty)
    router.get("/api/get-detail-specialty", specialtyController.getDetailSpecialty)

    router.post("/api/save-info-clinic", clinicController.saveInfoClinic)
    router.get("/api/top-clinic-home", clinicController.getTopClinicHome)

    router.get("/api/get-all-clinic", clinicController.getAllClinic)
    router.get("/api/get-detail-clinic", clinicController.getDetailClinic)

    return app.use("/", router)
}

export default initApiRoutes