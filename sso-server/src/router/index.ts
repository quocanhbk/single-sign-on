import express from "express"
import { getLogin, postLogin, verifySsoToken, getLogout } from "../controller"

const router = express.Router()

router.get("/", (_, res) => {
    res.redirect("/auth/login")
})

router.get("/login", getLogin)

router.post("/login", postLogin)

router.get("/logout", getLogout)

router.get("/verifytoken", verifySsoToken)

export default router
