const code = require('../constants/code')
const secret = require('../constants/secret')
const jwt = require('jsonwebtoken')
const middleware = {
    verifyLoginToken: (req, res, next) => {
        try {
            const authorization = req.headers.authorization
            const token = authorization.split(' ')[1]
            if (!token) {
                return res.status(code.forbidden).json({
                    code: code.forbidden,
                    message: 'Token is required for authentication',
                    data: null
                })
            }
            const decoded = jwt.verify(token, secret.appSecret)
            req.login = decoded
        } catch (error) {
            return res.status(code.unauthorized).json({
                code: code.unauthorized,
                message: 'Invalid token',
                data: null
            })
        }
        return next()
    },

    verifyAccessToken: (req, res, next) => {
        try {
            const authorization = req.headers.authorization
            const token = authorization.split(' ')[1]
            if (!token) {
                return res.status(code.forbidden).json({
                    code: code.forbidden,
                    message: 'Token is required for authentication',
                    data: null
                })
            }
            const decoded = jwt.verify(token, secret.appSecret)
            req.login = decoded
        } catch (error) {
            return res.status(code.unauthorized).json({
                code: code.unauthorized,
                message: 'Invalid token',
                data: null
            })
        }
        return next()
    }
}
module.exports = middleware