import db from "../models"

const saveInfoClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.nameVi || !data.nameEn || !data.address || !data.descriptionHTML || !data.descriptionMarkdown || !data.imageBase64) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters"
                })
            }

            if (!data.hasOldData) {
                await db.Clinic.create({
                    nameVi: data.nameVi,
                    nameEn: data.nameEn,
                    address: data.address,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                    image: data.imageBase64
                })
            } else {
                let clinic = await db.Clinic.findOne({
                    where: { id: data.clinicId },
                    raw: false
                })
                console.log(clinic)
                if (!clinic) {
                    resolve({
                        errCode: 2,
                        errMessage: "clinic is not found in database"
                    })
                } else {
                    clinic.descriptionHTML = data.descriptionHTML
                    clinic.descriptionMarkdown = data.descriptionMarkdown
                    clinic.image = data.imageBase64
                    clinic.nameVi = data.nameVi
                    clinic.nameEn = data.nameEn
                    clinic.address = data.address

                    await clinic.save()
                }
            }


            resolve({
                errCode: 0,
                errMessage: "Save info clinic succeed!"
            })
        } catch (error) {
            reject(error)
        }
    })
}

const getTopClinicHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let clinics = await db.Clinic.findAll({
                limit: limitInput,
                order: [['createdAt', 'ASC']],

            })

            resolve({
                errCode: 0,
                data: clinics
            })
        } catch (error) {
            reject(error)
        }
    })
}

const getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let clinics = await db.Clinic.findAll({
                attributes: {
                    exclude: ['image', 'descriptionHTML', 'descriptionMarkdown']
                },
            })

            resolve({
                errCode: 0,
                data: clinics
            })
        } catch (error) {
            reject(error)
        }
    })
}

const getDetailClinic = (inputId, location) => {

    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                let clinic = await db.Clinic.findOne({
                    where: { id: inputId },

                })
                if (!clinic) {
                    resolve({
                        errCode: 2,
                        errMessage: "clinic is not found in database",
                        clinic: {}
                    })
                } else {
                    let doctorClinic = []
                    if (location === "ALL") {
                        doctorClinic = await db.Doctor_Infor.findAll({
                            where: { clinicId: inputId },
                            attributes: ['doctorId', 'provinceId'],
                        })
                    } else if (location && location !== "ALL") {
                        doctorClinic = await db.Doctor_Infor.findAll({
                            where: {
                                clinicId: inputId,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId'],
                        })
                    }
                    clinic.doctorClinic = doctorClinic
                    if (clinic.image) {
                        clinic.image = new Buffer(clinic.image, "base64").toString('binary')
                    }
                    resolve({
                        errCode: 0,
                        errMessage: "Ok",
                        clinic
                    })
                }

            }
        } catch (error) {
            reject(error)
        }
    })
}

export {
    saveInfoClinic, getTopClinicHome, getAllClinic, getDetailClinic
}