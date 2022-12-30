const login = require('./loginService')
const register = require('./registerService')
const getAccessToken = require('./getAccessToken')
const changePassword = require('./changePasswordService')
const forgotPassword = require('./forgotPasswordService')

module.exports = {
    login,
    register,
    getAccessToken,
    changePassword,
    forgotPassword
}