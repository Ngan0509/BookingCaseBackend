import * as specialtyService from "../services/specialtyService"

const saveInfoSpecialty = async (req, res) => {
    try {
        let resp = await specialtyService.saveInfoSpecialty(req.body)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const getTopSpecialtyHome = async (req, res) => {
    let limit = req.query.limit
    if (!limit) limit = 8
    try {
        let resp = await specialtyService.getTopSpecialtyHome(+limit)
        return res.status(200).json(resp)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const getAllSpecialty = async (req, res) => {
    try {
        let resp = await specialtyService.getAllSpecialty()
        return res.status(200).json(resp)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const getDetailSpecialty = async (req, res) => {
    try {
        let resp = await specialtyService.getDetailSpecialty(req.query.specialtyId, req.query.location)
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
    saveInfoSpecialty, getTopSpecialtyHome, getAllSpecialty, getDetailSpecialty
}