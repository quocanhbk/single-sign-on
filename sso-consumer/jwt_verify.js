const jwt = require("jsonwebtoken")

const ISSUER = "simple-sso"
const verifyJwtToken = token =>
    new Promise((resolve, reject) => {
        jwt.verify(token, "hexagon", { issuer: ISSUER }, (err, decoded) => {
            if (err) return reject(err)
            return resolve(decoded)
        })
    })
module.exports = Object.assign({}, { verifyJwtToken })
