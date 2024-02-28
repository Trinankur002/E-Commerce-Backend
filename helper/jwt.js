const expressJwt = require('express-jwt')
require('dotenv/config')

function authJwt() {
    const secret = process.env.JWT_TOKEN
    const api = process.env.API_URL
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked : isRevoked,
    }).unless({
        path: [
            `${api}/user/login`,
            `${api}/user/signup`,
            { url: `${api}/products`, methods: ['GET'] },
            { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTONS'] },
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
        ]
    })
}

async function isRevoked(req, payload, done){
    if (!payload.isAdmin) { done(null, true) }
    done()
}
module.exports = authJwt
