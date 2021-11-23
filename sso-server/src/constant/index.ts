import { encodedId } from "../helper"

export const accounts = {
    "quocanhbk17@gmail.com": {
        password: "quocanh1",
        userId: encodedId(),
        appPolicy: {
            sso_consumer: { name: "La Quoc Anh", sid: "1710465" },
        },
    },
    "daotronghuan@gmail.com": {
        password: "tronghuan",
        userId: encodedId(),
        appPolicy: {
            sso_consumer: { name: "Dao Trong Huan", sid: "1511191" },
        },
    },
}

export const allowedOrigins = ["http://localhost:5000"]

export const originAppName = {
    "http://localhost:5000": "sso_consumer",
}

export const appTokenDB = {
    sso_consumer: "l1Q7zkOL59cRqWBkQ12ZiGVW2DBL",
}
