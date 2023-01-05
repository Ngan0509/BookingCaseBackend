import db from "../models/index"
import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);


const handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExist = await checkUserEmail(email)
            if (isExist) {
                let user = await db.User.findOne({
                    where: { email: email },
                    raw: true
                })
                if (user) {
                    let checkPass = bcrypt.compareSync(password, user.password)
                    if (checkPass) {
                        console.log(user)
                        userData = {
                            errCode: 0,
                            errMessage: "Ok",
                            user: {
                                id: user.id,
                                email: user.email,
                                roleId: user.roleId,
                                firstName: user.firstName,
                                lastName: user.lastName
                            }
                        }
                    } else {
                        userData = {
                            errCode: 3,
                            errMessage: "Wrong password",
                        }
                    }
                } else {
                    userData = {
                        errCode: 2,
                        errMessage: "User is not found!"
                    }
                }
            } else {
                userData = {
                    errCode: 4,
                    errMessage: "Your email is not exist in our system, please try other email"
                }
            }
            resolve(userData)
        } catch (error) {
            reject(error)
        }
    })
}

const checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (error) {
            reject(error)
        }
    })
}

const getAllUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = ""
            if (userId === "All") {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (userId && userId !== "All") {
                users = await db.User.findOne({
                    attributes: {
                        exclude: ['password']
                    },
                    where: { id: userId }
                })
            }
            resolve(users)
        } catch (error) {
            reject(error)
        }
    })
}

const createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isExist = await checkUserEmail(data.email)
            if (isExist) {
                resolve({
                    errCode: 1,
                    errMessage: "your email is exist, please try other email"
                })
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password)
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phoneNumber: data.phoneNumber,
                    address: data.address,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar
                })
            }
            resolve({
                errCode: 0,
                errMessage: "Create new user is success"
            })

        } catch (error) {
            reject(error)
        }
    })
}

const hashUserPassword = (password) => {
    return new Promise((resolve, reject) => {
        try {
            let hashPassword = bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        } catch (error) {
            reject(error)
        }
    })
}

const deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: false
            })
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: "user is not found"
                })
            }
            await user.destroy()
            resolve({
                errCode: 0,
                errMessage: "Delete succeed!"
            })
        } catch (error) {
            reject(error)
        }
    })
}

const updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataId = data.id
            if (!dataId || !data.gender || !data.roleId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters"
                })
            }
            let user = await db.User.findOne({
                where: { id: dataId },
                raw: false
            })

            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: "User is not found"
                })
            }
            user.firstName = data.firstName
            user.lastName = data.lastName
            user.address = data.address
            user.phoneNumber = data.phoneNumber
            user.gender = data.gender
            user.roleId = data.roleId
            if (user.positionId) {
                user.positionId = data.positionId
            }
            if (user.image) {
                user.image = data.avatar
            }
            await user.save()
            resolve({
                errCode: 0,
                errMessage: "Update data is succeed!"
            })
        } catch (error) {
            reject(error)
        }
    })
}

const getAllCode = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: "Mising requied parameters",
                    data: []
                })
            }
            let data = await db.Allcode.findAll({
                where: { type: typeInput }
            })
            resolve({
                errCode: 0,
                errMessage: `Get all code of ${typeInput} succeed!`,
                data: data
            })
        } catch (error) {
            reject(error)
        }
    })
}

export { handleUserLogin, getAllUser, createNewUser, deleteUserById, updateUser, getAllCode }