const url = require("url")
const axios = require("axios")
const { verifyJwtToken } = require("./jwt_verify")

const ssoServerURL = "http://localhost:3000/auth/verifytoken"

const ssoRedirect = () => {
    return async function (req, res, next) {
        // check if the req has the queryParameter as ssoToken
        // and who is the referer.
        const ssoToken = req.query.ssoToken || null
        // if client have sso token
        if (ssoToken !== null) {
            try {
                const response = await axios.get(`${ssoServerURL}?ssoToken=${ssoToken}`, {
                    headers: {
                        Authorization: "Bearer l1Q7zkOL59cRqWBkQ12ZiGVW2DBL",
                    },
                })
                const { token } = response.data
                const decoded = await verifyJwtToken(token)
                // now that we have the decoded jwt, use the,
                // global-session-id as the session id so that
                // the logout can be implemented with the global session.
                req.session.user = decoded
            } catch (err) {
                return next(err)
            }

            return res.redirect("/")
        }

        return next()
    }
}

module.exports = ssoRedirect
