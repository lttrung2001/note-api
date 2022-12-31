const code = require('../../constants/code')
const secret = require('../../constants/secret')
const jwt = require('jsonwebtoken')
const getAccessToken = async (req, res) => {
    const authoriztion = req.headers.authorization
    const token = authoriztion.split(' ')[1]
    if (!token) {
        return res.status(code.bad_request).json({
            code: code.bad_request,
            message: 'Token is required for authentication',
            data: null
        })
    }
    try {
        const decoded = jwt.verify(token, secret.appSecret)
        const accessToken = jwt.sign(
            {id: decoded.id, email: decoded.email},
            secret.appSecret,
            {expiresIn: '1h'}
        )
        return res.status(code.success).json({
            code: code.success,
            message: 'Get access token successfully',
            data: accessToken
        })
    } catch (error) {
        return res.status(code.bad_request).json({
            code: code.bad_request,
            message: 'Invalid token',
            data: null
        })
    }
}
module.exports = getAccessToken