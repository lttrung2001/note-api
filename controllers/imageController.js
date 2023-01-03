const express = require('express')
const router = express.Router()
const imageService = require('../services/image')
const middleware = require('../middleware/middleware')

router.delete('/delete-image', middleware.verifyAccessToken, async (req, res) => {
    return await imageService.deleteImageService(req, res)
})

module.exports = router