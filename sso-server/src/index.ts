import express from "express"
import morgan from "morgan"
import session from "express-session"
import router from "./router"
import { RequestWithSession } from "./types"
import path from "path"

const app = express()

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
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "..", "views"))

app.use("/auth", router)

app.get("/", (req: RequestWithSession, res) => {
    const sessionId = req.session.user
    if (!sessionId) {
        res.redirect("/auth/login")
    }
    res.render("index", {
        name: sessionId,
    })
})

// handle error
app.use((_, __, next) => {
    // catch 404 and forward to error handler
    const err = new Error("Resource Not Found")
    next(err)
})

app.use((err, req, res, next) => {
    const statusCode = err.status || 500
    let message = err.message || "Provider: Internal Server Error"

    if (statusCode === 500) {
        message = "Provider: Internal Server Error"
    }
    res.status(statusCode).json({ message })
})

const PORT = 3000

app.listen(PORT, () => {
    console.info(`sso-server listening on port ${PORT}`)
})
