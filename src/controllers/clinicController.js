import * as clinicService from "../services/clinicService"

const saveInfoClinic = async (req, res) => {
    try {
        let resp = await clinicService.saveInfoClinic(req.body)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const getTopClinicHome = async (req, res) => {
    let limit = req.query.limit
    if (!limit) limit = 8
    try {
        let resp = await clinicService.getTopClinicHome(+limit)
        return res.status(200).json(resp)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const getAllClinic = async (req, res) => {
    try {
        let resp = await clinicService.getAllClinic()
        return res.status(200).json(resp)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const getDetailClinic = async (req, res) => {
    try {
        let resp = await clinicService.getDetailClinic(req.query.clinicId, req.query.location)
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
    saveInfoClinic, getTopClinicHome, getAllClinic, getDetailClinic
}