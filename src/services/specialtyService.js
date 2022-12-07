import db from "../models"

const saveInfoSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.nameVi
                || !data.nameEn
                || !data.descriptionHTML
                || !data.descriptionMarkdown
                || !data.imageBase64) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters"
                })
            }

            if (!data.hasOldData) {
                await db.Specialty.create({
                    nameVi: data.nameVi,
                    nameEn: data.nameEn,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                    image: data.imageBase64
                })
            } else {
                let specialty = await db.Specialty.findOne({
                    where: { id: data.specialtyId },
                    raw: false
                })
                console.log(specialty)
                if (!specialty) {
                    resolve({
                        errCode: 2,
                        errMessage: "specialty is not found in database"
                    })
                } else {
                    specialty.descriptionHTML = data.descriptionHTML
                    specialty.descriptionMarkdown = data.descriptionMarkdown
                    specialty.image = data.imageBase64
                    specialty.nameVi = data.nameVi
                    specialty.nameEn = data.nameEn

                    await specialty.save()
                }
            }


            resolve({
                errCode: 0,
                errMessage: "Save info specialty succeed!"
            })
        } catch (error) {
            reject(error)
        }
    })
}

const getTopSpecialtyHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let specialties = await db.Specialty.findAll({
                limit: limitInput,
                order: [['createdAt', 'ASC']],

            })

            resolve({
                errCode: 0,
                data: specialties
            })
        } catch (error) {
            reject(error)
        }
    })
}

const getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let specialties = await db.Specialty.findAll({
                attributes: {
                    exclude: ['image', 'descriptionHTML', 'descriptionMarkdown']
                },
            })

            resolve({
                errCode: 0,
                data: specialties
            })
        } catch (error) {
            reject(error)
        }
    })
}

const getDetailSpecialty = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                let specialty = await db.Specialty.findOne({
                    where: { id: inputId },
                })
                if (!specialty) {
                    resolve({
                        errCode: 2,
                        errMessage: "Specialty is not found in database",
                        specialty: {}
                    })
                } else {
                    let doctorSpecialty = []
                    if (location === "ALL") {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: { specialtyId: inputId },
                            attributes: ['doctorId', 'provinceId'],
                        })
                    } else if (location && location !== "ALL") {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: inputId,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId'],
                        })
                    }
                    specialty.doctorSpecialty = doctorSpecialty
                    if (specialty.image) {
                        specialty.image = new Buffer(specialty.image, "base64").toString('binary')
                    }
                    resolve({
                        errCode: 0,
                        errMessage: "Ok",
                        specialty
                    })
                }

            }
        } catch (error) {
            reject(error)
        }
    })
}

export {
    saveInfoSpecialty, getTopSpecialtyHome, getAllSpecialty, getDetailSpecialty
}