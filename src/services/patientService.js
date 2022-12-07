import db from "../models"
import * as emailService from "./emailService"
import { v4 as uuidv4 } from 'uuid';
require('dotenv').config()

const buildURLEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result
}

const saveBookingOfPatient = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.email || !data.doctorId || !data.date || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            }

            let token = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

            await emailService.sendSimpleEmail({
                recieverEmail: data.email,
                doctorName: data.doctorName,
                time: data.timeString,
                patientName: `${data.lastName} ${data.firstName}`,
                reason: data.reason,
                lang: data.lang,
                redirect: buildURLEmail(data.doctorId, token)
            })

            let [user, created] = await db.User.findOrCreate({
                where: { email: data.email },
                defaults: {
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    roleId: 'R3',
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender
                }
            });

            if (user) {
                await db.Booking.findOrCreate({
                    where: { patientId: user.id },
                    defaults: {
                        statusId: 'S1',
                        doctorId: data.doctorId,
                        patientId: user.id,
                        date: data.date,
                        timeType: data.timeType,
                        token: token
                    }
                })
            }
            resolve({
                errCode: 0,
                errMessage: "Save success!!!"
            })
        } catch (error) {
            reject(error)
        }
    })
}

const postBookingAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            }

            let appointment = await db.Booking.findOne({
                where: {
                    token: data.token,
                    doctorId: data.doctorId,
                    statusId: 'S1'
                },
                raw: false
            })

            if (appointment) {
                appointment.statusId = 'S2'
                await appointment.save()

                resolve({
                    errCode: 0,
                    errMessage: "update appointment is succeed!!"
                })
            } else {
                resolve({
                    errCode: 2,
                    errMessage: "appointment is not found!!"
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

export {
    saveBookingOfPatient, postBookingAppointment
}