import * as doctorService from "../services/doctorService"

const getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit
    if (!limit) limit = 8
    try {
        let resp = await doctorService.getTopDoctorHome(+limit)
        return res.status(200).json(resp)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const getAllDoctors = async (req, res) => {
    try {
        let resp = await doctorService.getAllDoctors()
        return res.status(200).json(resp)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const saveInfoDoctor = async (req, res) => {
    try {
        let resp = await doctorService.saveInfoDoctor(req.body)
        return res.status(200).json(resp)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const getDetailDoctor = async (req, res) => {
    try {
        let resp = await doctorService.getDetailDoctor(req.query.doctorId)
        return res.status(200).json(resp)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const saveScheduleDoctor = async (req, res) => {
    try {
        let resp = await doctorService.saveScheduleDoctor(req.body)
        return res.status(200).json(resp)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const getScheduleByDate = async (req, res) => {
    try {
        let resp = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date)
        return res.status(200).json(resp)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const deleteDateOld = async (req, res) => {
    try {
        let resp = await doctorService.deleteDateOld()
        return res.status(200).json(resp)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const getAddressInfoDoctor = async (req, res) => {
    try {
        let resp = await doctorService.getAddressInfoDoctor(req.query.doctorId)
        return res.status(200).json(resp)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const getProfileDoctor = async (req, res) => {
    try {
        let resp = await doctorService.getProfileDoctor(req.query.doctorId)
        return res.status(200).json(resp)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const getListPatientForDoctor = async (req, res) => {
    try {
        let resp = await doctorService.getListPatientForDoctor(req.query.doctorId, req.query.date)
        return res.status(200).json(resp)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const sendRemedy = async (req, res) => {
    try {
        let resp = await doctorService.sendRemedy(req.body)
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
    getTopDoctorHome, getAllDoctors, saveInfoDoctor,
    getDetailDoctor, saveScheduleDoctor, getScheduleByDate, deleteDateOld,
    getAddressInfoDoctor, getProfileDoctor, getListPatientForDoctor, sendRemedy
}