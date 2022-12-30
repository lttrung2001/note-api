const express = require('express')
const router = express.Router()
const loginService = require('../services/login')
const middleware = require('../middleware/middleware')

router.post('/login', async (req, res) => {
    return await loginService.login(req, res)
})

router.post('/register', async (req, res) => {
    return await loginService.register(req, res)
})

router.get('/get-access-token', middleware.verifyLoginToken, async (req, res) => {
    return await loginService.getAccessToken(req, res)
})

router.post('/change-password', middleware.verifyAccessToken, async (req, res) => {
    return await loginService.changePassword(req, res)
})

router.post('/forgot-password', async (req, res) => {
    return await loginService.forgotPassword(req, res)
})

module.exports = router