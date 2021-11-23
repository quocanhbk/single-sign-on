const express = require("express")
const morgan = require("morgan")
const app = express()
const axios = require("axios")
const engine = require("ejs-mate")
const session = require("express-session")

const isAuthenticated = require("./isAuthenticated")
const checkSSORedirect = require("./checkSSORedirect")

app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
    })
)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(morgan("dev"))
app.engine("ejs", engine)
app.set("views", __dirname + "/views")
app.set("view engine", "ejs")

app.use(checkSSORedirect())

app.get("/", (req, res, next) => {
    if (!req.session.user) {
        return res.render("login")
    }
    next()
})

app.get("/", (req, res) => {
    res.render("index", {
        name: req.session.user.name,
        sid: req.session.user.sid,
    })
})

app.get("/login", (req, res) => {
    const redirectURL = `${req.protocol}://${req.headers.host}${req.path}`
    return res.redirect(`http://localhost:3000/auth/login?serviceURL=${redirectURL}`)
})

app.get("/logout", (req, res) => {
    const redirectURL = `${req.protocol}://${req.headers.host}${req.path}`
    res.redirect(`http://localhost:3000/auth/logout?serviceURL=${redirectURL}`)
})

app.use((req, res, next) => {
    // catch 404 and forward to error handler
    const err = new Error("Resource Not Found")
    err.status = 404
    next(err)
})

app.use((err, req, res, next) => {
    const statusCode = err.status || 500
    let message = err.message || "Client: Internal Server Error"

    if (statusCode === 500) {
        message = "Client: Internal Server Error"
    }
    res.status(statusCode).json({ err })
})

app.listen(5000, () => {
    console.info(`sso-consumer listening on port ${5000}`)
})
