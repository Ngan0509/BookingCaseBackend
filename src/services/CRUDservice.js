import bcrypt from 'bcryptjs';
import db from '../models';
const salt = bcrypt.genSaltSync(10);

const createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password)
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
                address: data.address,
                gender: data.gender === "1" ? true : false,
                roleId: data.roleId,
            })
            resolve("ok create a new user succeed")
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

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                raw: true
            })
            resolve(users)
        } catch (error) {
            reject(error)
        }
    })
}

const getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true
            })
            if (user) {
                resolve(user)
            } else {
                resolve({})
            }
        } catch (error) {
            reject(error)
        }
    })
}

const updateUserData = (dataE) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: dataE.id }
            })
            if (user) {
                user.firstName = dataE.firstName
                user.lastName = dataE.lastName
                user.address = dataE.address

                await user.save()
            }
            resolve()
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
            })
            if (user) {
                await user.destroy()
            }
            resolve()
        } catch (error) {
            reject(error)
        }
    })
}

const getDetailUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
            })
            resolve(user)
        } catch (error) {
            reject(error)
        }
    })
}

export { createNewUser, getAllUser, getUserInfoById, updateUserData, deleteUserById, getDetailUserById }