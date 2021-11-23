import { accounts, originAppName } from "./constant"

// It can be useful for variuos audit purpose
export const sessionUser = {}
export const sessionApp = {}

// these token are for the validation purpose
export const intrmTokenCache = {}

export const fillIntrmTokenCache = (origin, id, intrmToken) => {
    intrmTokenCache[intrmToken] = [id, originAppName[origin]]
}

export const storeApplicationInCache = (origin, id, intrmToken) => {
    if (sessionApp[id] == null) {
        sessionApp[id] = {
            [originAppName[origin]]: true,
        }
        fillIntrmTokenCache(origin, id, intrmToken)
    } else {
        sessionApp[id][originAppName[origin]] = true
        fillIntrmTokenCache(origin, id, intrmToken)
    }
}

export const generatePayload = (ssoToken: string) => {
    const globalSessionToken = intrmTokenCache[ssoToken][0]
    const appName = intrmTokenCache[ssoToken][1]
    const userEmail = sessionUser[globalSessionToken]
    const user = accounts[userEmail]
    const appPolicy = user.appPolicy[appName]
    const email = appPolicy.shareEmail === true ? userEmail : undefined
    const payload = {
        ...appPolicy,
        email,
        shareEmail: undefined,
        uid: user.userId,
        globalSessionID: globalSessionToken,
    }
    return payload
}
