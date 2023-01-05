import db from "../models"
import * as emailService from "./emailService"
require('dotenv').config()
import _ from 'lodash'

const getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                where: { roleId: 'R2' },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true
            })

            resolve({
                errCode: 0,
                data: users
            })
        } catch (error) {
            reject(error)
        }
    })
}

const getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                attributes: {
                    exclude: ['password', 'image']
                },
                where: { roleId: 'R2' },
                raw: true
            })

            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (error) {
            reject(error)
        }
    })
}

const saveInfoDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                if (!inputData.hasOldData) {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
                    })
                } else {
                    let doctor = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })
                    if (!doctor) {
                        resolve({
                            errCode: 2,
                            errMessage: "Doctor is not found in database"
                        })
                    } else {
                        doctor.contentHTML = inputData.contentHTML
                        doctor.contentMarkdown = inputData.contentMarkdown
                        doctor.description = inputData.description

                        await doctor.save()
                    }
                }

                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: { doctorId: inputData.doctorId },
                    raw: false
                })

                if (doctorInfor) {
                    //edit
                    doctorInfor.doctorId = inputData.doctorId
                    doctorInfor.specialtyId = inputData.specialtyId
                    doctorInfor.clinicId = inputData.clinicId
                    doctorInfor.priceId = inputData.priceId
                    doctorInfor.paymentId = inputData.paymentId
                    doctorInfor.provinceId = inputData.provinceId
                    doctorInfor.addressClinic = inputData.addressClinic
                    doctorInfor.nameClinic = inputData.nameClinic
                    doctorInfor.note = inputData.note

                    await doctorInfor.save()
                } else {
                    //create
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId,
                        priceId: inputData.priceId,
                        paymentId: inputData.paymentId,
                        provinceId: inputData.provinceId,
                        addressClinic: inputData.addressClinic,
                        nameClinic: inputData.nameClinic,
                        note: inputData.note,
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save info doctor is success'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const getDetailDoctor = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                let doctor = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown'] },

                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['doctorId', 'id']
                            },

                            include: [
                                { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                            ]

                        }
                    ],
                    raw: false,
                    nest: true
                })
                if (!doctor) {
                    resolve({
                        errCode: 2,
                        errMessage: "Doctor is not found in database"
                    })
                } else {
                    if (doctor.image) {
                        doctor.image = new Buffer(doctor.image, "base64").toString('binary')
                    }
                    resolve({
                        errCode: 0,
                        errMessage: "Ok",
                        doctor
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE
const saveScheduleDoctor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { arrSchedule, doctorId, date, hasOldData } = data;
            if (!arrSchedule || !doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters"
                })
            }

            if (arrSchedule && arrSchedule.length > 0) {
                let arrResult = arrSchedule.map(item => ({
                    ...item,
                    maxNumber: MAX_NUMBER_SCHEDULE
                }))

                if (hasOldData) {
                    let schedules = await db.Schedule.findAll({
                        where: {
                            doctorId,
                            date
                        },
                        raw: false
                    })
                    if (schedules && schedules.length > 0) {
                        await schedules.forEach(schedule => {
                            schedule.destroy();
                        })
                    }
                }
                await db.Schedule.bulkCreate(arrResult)

                //     let existing = await db.Schedule.findAll({
                //         where: {
                //             doctorId: data.doctorId,
                //             date: data.date
                //         },
                //         attributes: ['doctorId', 'date', 'maxNumber', 'timeType']
                //     })


                //     let toCreate = _.differenceWith(arrSchedule, existing, (a, b) => {
                //         return a.timeType === b.timeType && +a.date === +b.date
                //     })

                //     if (toCreate && toCreate.length > 0) {
                //         await db.Schedule.bulkCreate(toCreate)
                //     }

                //     console.log("........", toCreate)
            }
            resolve({
                errCode: 0,
                errMessage: "Save schedule success"
            })

        } catch (error) {
            reject(error)
        }
    })
}

const getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters"
                })
            } else {
                let schedule = await db.Schedule.findAll({
                    where: {
                        doctorId,
                        date
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },

                    ],
                    raw: false,
                    nest: true
                })
                if (!schedule) {
                    resolve({
                        errCode: 2,
                        errMessage: "Schedule is not found",
                        schedule: []
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: "Get Schedule is success",
                    data: schedule
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const deleteDateOld = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let currentDate = new Date().setHours(0, 0, 0, 0);
            let schedulesOld = await db.Schedule.findAll({
                raw: false
            })
            let result = schedulesOld.filter(item => +item.date < currentDate);
            if (result && result.length > 0) {
                await result.forEach(item => {
                    item.destroy()
                })
                resolve({
                    errCode: 0,
                    errMessage: "Delete schedule old is success",
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const getAddressInfoDoctor = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: { doctorId: inputId },
                    attributes: {
                        exclude: ['doctorId', 'id']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true
                })

                if (!doctorInfor) {
                    resolve({
                        errCode: 2,
                        errMessage: "DoctorInfo is not found in database"
                    })
                } else {
                    resolve({
                        errCode: 0,
                        errMessage: "Ok",
                        doctorInfor
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

const getProfileDoctor = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                let doctor = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Markdown, attributes: ['description', 'contentHTML']
                        },

                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['doctorId', 'id']
                            },

                            include: [
                                { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                            ]

                        }
                    ],
                    raw: false,
                    nest: true
                })
                if (!doctor) {
                    resolve({
                        errCode: 2,
                        errMessage: "Doctor is not found in database"
                    })
                } else {
                    if (doctor.image) {
                        doctor.image = new Buffer(doctor.image, "base64").toString('binary')
                    }
                    resolve({
                        errCode: 0,
                        errMessage: "Ok",
                        doctor
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

const getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            }

            let patientBooking = await db.Booking.findAll({
                where: {
                    statusId: 'S2',
                    doctorId: doctorId,
                    date: date
                },
                include: [
                    {
                        model: db.User,
                        as: 'patientData',
                        attributes: ['email', 'firstName', 'lastName', 'gender', 'phoneNumber', 'address'],
                        include: [
                            { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                        ]
                    },
                    { model: db.Allcode, as: 'timeTypeBookingData', attributes: ['valueEn', 'valueVi'] },


                ],
                raw: false,
                nest: true
            })
            resolve({
                errCode: 0,
                errMessage: "Ok",
                patientBooking
            })
        } catch (error) {
            reject(error)
        }
    })
}

const sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.patientId || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters"
                })
            }

            let appointment = await db.Booking.findOne({
                where: {
                    doctorId: data.doctorId,
                    patientId: data.patientId,
                    timeType: data.timeType,
                    statusId: 'S2'
                },
                raw: false
            })

            if (appointment) {
                appointment.statusId = 'S3'
                await appointment.save()
            }

            await emailService.sendRemedyEmail(data)

            resolve({
                errCode: 0,
                errMessage: "Send remery success"
            })

        } catch (error) {
            reject(error)
        }
    })
}

export {
    getTopDoctorHome, getAllDoctors, saveInfoDoctor,
    getDetailDoctor, saveScheduleDoctor, getScheduleByDate, deleteDateOld, getAddressInfoDoctor,
    getProfileDoctor, getListPatientForDoctor, sendRemedy
}