import express from "express";
import * as homeController from "../controllers/homeController"

let router = express.Router();

const initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage)
    router.get("/crud", homeController.getCRUD)
    router.post("/post-crud", homeController.postCRUD)
    router.get("/get-crud", homeController.displayGetCRUD)
    router.get("/edit-crud", homeController.getEditCRUD)

    router.post("/update-crud", homeController.updateCRUD)
    router.get("/delete-crud", homeController.deleteCRUD)
    router.get("/detail-crud", homeController.getDetailCRUD)

    router.get("/about", homeController.getAboutPage)

    return app.use("/", router)
}

export default initWebRoutes 