import { Response } from "express"
import { accounts, allowedOrigins } from "../constant"
import { encodedId } from "../helper"
import { sessionUser, storeApplicationInCache } from "../session"
import { RequestWithSession } from "../types"

export const getLogin = (req: RequestWithSession, res: Response) => {
    // The req.query will have the redirect url where we need to redirect after successful
    // login and with sso token.
    // This can also be used to verify the origin from where the request has came in
    // for the redirection
    const serviceURL = (req.query.serviceURL as string) || null
    // * if serviceURL is available but it is not allowed, reponse with http 400
    if (serviceURL !== null) {
        const url = new URL(serviceURL)
        if (!allowedOrigins.includes(url.origin)) {
            return res.status(400).json({ message: "You are not allowed to access the sso-server" })
        }
    }

    // * if there are user but no serviceURL, redirect to home page
    if (!!req.session.user && serviceURL === null) {
        return res.redirect("/")
    }

    // * if there are user and serviceURL, redirect to serviceURL
    if (!!req.session.user && serviceURL !== null) {
        const url = new URL(serviceURL)
        const intrmid = encodedId()
        storeApplicationInCache(url.origin, req.session.user, intrmid)
        return res.redirect(`${serviceURL}?ssoToken=${intrmid}`)
    }
    // * if there are no user, and no service URL, return the login page
    return res.render("login", {
        title: "SSO-Server | Login",
    })
}

export const postLogin = (req: RequestWithSession, res: Response) => {
    // do the validation with email and password
    // but the goal is not to do the same in this right now,
    // like checking with Datebase and all, we are skiping these section
    const { email, password } = req.body
    if (!(accounts[email] && password === accounts[email].password)) {
        res.status(404).json({ message: "Invalid email and password" })
    }

    // else redirect
    const serviceURL = req.query.serviceURL as string

    // generate random id
    const id = encodedId()
    req.session.user = id

    // store user in session
    sessionUser[id] = email

    if (!serviceURL) {
        res.redirect("/")
    } else {
        const url = new URL(serviceURL)
        const intrmid = encodedId()
        storeApplicationInCache(url.origin, id, intrmid)
        res.redirect(`${serviceURL}?ssoToken=${intrmid}`)
    }
}

export const getLogout = (req: RequestWithSession, res: Response) => {
    const serviceURL = (req.query.serviceURL as string) || ""
    const url = new URL(serviceURL)
    if (!!req.session.user) {
        req.session.destroy()
    }
    res.redirect(url.origin)
}
