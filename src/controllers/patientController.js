import * as patientService from "../services/patientService"

const saveBookingOfPatient = async (req, res) => {
    try {
        let resp = await patientService.saveBookingOfPatient(req.body)
        console.log(resp)
        return res.status(200).json(resp)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const postBookingAppointment = async (req, res) => {
    try {
        let resp = await patientService.postBookingAppointment(req.body)
        console.log(resp)
        return res.status(200).json(resp)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

export {
    saveBookingOfPatient, postBookingAppointment
}