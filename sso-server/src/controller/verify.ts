import { Response } from "express"
import { appTokenDB } from "../constant"
import { generatePayload, intrmTokenCache, sessionApp } from "../session"
import { RequestWithSession } from "../types"
import jwt from "jsonwebtoken"

const re = /(\S+)\s+(\S+)/
const ISSUER = "simple-sso"

const parseAuthHeader = (hdrValue?: string) => {
    if (typeof hdrValue !== "string") {
        return null
    }
    const matches = hdrValue.match(re)
    return matches && { scheme: matches[1], value: matches[2] }
}

const getAppToken = (request: RequestWithSession) => {
    let token: string | null = null
    if (request.headers.authorization) {
        const authParams = parseAuthHeader(request.headers.authorization)
        if (authParams && "bearer" === authParams.scheme.toLowerCase()) {
            token = authParams.value
        }
    }
    return token
}

const genJwtToken = payload =>
    new Promise((resolve, reject) => {
        // some of the libraries and libraries written in other language,
        // expect base64 encoded secrets, so sign using the base64 to make
        // jwt useable across all platform and langauage.
        jwt.sign(
            { ...payload },
            "hexagon",
            {
                issuer: ISSUER,
            },
            (err, token) => {
                if (err) return reject(err)
                return resolve(token)
            }
        )
    })

export const verifySsoToken = async (req: RequestWithSession, res: Response) => {
    //
    const appToken = getAppToken(req)
    const ssoToken = req.query.ssoToken as string
    // if the application token is not present or ssoToken request is invalid
    // if the ssoToken is not present in the cache some is
    // smart.
    if (appToken == null || ssoToken == null || intrmTokenCache[ssoToken] == null) {
        return res.status(400).json({ message: "badRequest" })
    }

    // if the appToken is present and check if it's valid for the application
    const appName = intrmTokenCache[ssoToken][1]
    const globalSessionToken = intrmTokenCache[ssoToken][0]

    // If the appToken is not equal to token given during the sso app registraion or later stage than invalid
    if (appToken !== appTokenDB[appName] || sessionApp[globalSessionToken][appName] !== true) {
        return res.status(403).json({ message: "Unauthorized" })
    }
    // checking if the token passed has been generated
    const payload = generatePayload(ssoToken)

    const token = await genJwtToken(payload)
    // delete the itremCache key for no futher use,
    delete intrmTokenCache[ssoToken]
    return res.status(200).json({ token })
}
