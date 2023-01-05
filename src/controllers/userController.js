import * as userService from "../services/userService"
const handleLogin = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            errMessage: "Mising inputs parameter"
        })
    }
    let userData = await userService.handleUserLogin(email, password)
    return res.status(200).json({
        ...userData
    })
}

const handleGetAllUser = async (req, res) => {
    let userId = req.query.id
    if (!userId) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Mising inputs parameter",
            users: []
        })
    }
    let users = await userService.getAllUser(userId)
    return res.status(200).json({
        errCode: 0,
        errMessage: "Get All User Success",
        users
    })
}

const handleCreateNewUser = async (req, res) => {
    let data = req.body
    let message = await userService.createNewUser(data)
    return res.status(200).json(message)
}

const handleDeleteNewUser = async (req, res) => {
    let userId = req.query.id
    if (!userId) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing parameters"
        })
    }
    let message = await userService.deleteUserById(userId)
    return res.status(200).json(message)
}

const handleEditNewUser = async (req, res) => {
    let data = req.body
    let message = await userService.updateUser(data)
    return res.status(200).json(message)
}

const handleGetAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCode(req.query.type)
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

export {
    handleLogin, handleGetAllUser, handleCreateNewUser, handleDeleteNewUser, handleEditNewUser,
    handleGetAllCode
}