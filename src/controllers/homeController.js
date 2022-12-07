import db from "../models/index"
import * as CRUDservice from "../services/CRUDservice"
const getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll()

        res.render("homePage.ejs", { data: JSON.stringify(data) })
    } catch (e) {
        console.log(e)
    }
}

const getAboutPage = (req, res) => {
    res.render("test/aboutPage.ejs")
}

const getCRUD = (req, res) => {
    return res.render("CRUD.ejs")
}

const postCRUD = async (req, res) => {
    let message = await CRUDservice.createNewUser(req.body)
    console.log(message)
    return res.redirect('/get-crud')
}

const displayGetCRUD = async (req, res) => {
    let data = await CRUDservice.getAllUser()
    return res.render('displayCRUD.ejs', { dataUser: data })
}

const getEditCRUD = async (req, res) => {
    let userId = req.query.id
    if (userId) {
        let userData = await CRUDservice.getUserInfoById(userId)
        res.render("editCRUD.ejs", { user: userData })
    } else {
        res.send("User not found")
    }
}

const updateCRUD = async (req, res) => {
    let dataEditUser = req.body
    await CRUDservice.updateUserData(dataEditUser)
    return res.redirect("/get-crud")
}

const deleteCRUD = async (req, res) => {
    let userId = req.query.id
    if (userId) {
        await CRUDservice.deleteUserById(userId)
        return res.redirect("/get-crud")
    } else {
        res.send("User not found")
    }
    // return res.redirect("/get-crud")
}

const getDetailCRUD = async (req, res) => {
    let userId = req.query.id
    if (userId) {
        let dataUser = await CRUDservice.getDetailUserById(userId)
        return res.send(JSON.stringify(dataUser))
    }
}

export { getHomePage, getAboutPage, getCRUD, postCRUD, displayGetCRUD, getEditCRUD, updateCRUD, deleteCRUD, getDetailCRUD }