const code = require('../../constants/code')
const secret = require('../../constants/secret')
const {db} = require('../../utils/admin')
const jwt = require('jsonwebtoken')
const loginService = async (req, res) => {
    const {email, password} = req.body
    if (!(email && password)) {
        return res.status(code.forbidden).json({
            code: code.forbidden,
            message: 'All input is required',
            data: null
        })
    }
    try {
        const querySnapshot = await db.collection('Logins').where('email','==',email).where('password','==',password).get()
        const list = querySnapshot.docs
        if (list.length) {
            const login = list[0]
            const token = jwt.sign(
                {id: login.id, ...login.data()},
                secret.appSecret,
                {expiresIn: '7d'}
            )
            return res.status(code.success).json({
                code: code.success,
                message: 'Login successfully',
                data: token
            })
        }
        return res.status(code.unauthorized).json({
            code: code.unauthorized,
            message: 'Invalid credentials',
            data: null
        })
    } catch(error) {
        return res.status(code.unauthorized).json({
            code: code.unauthorized,
            message: error,
            data: null
        })
    }
}
module.exports = loginService