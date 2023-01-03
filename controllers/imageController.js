const express = require('express')
const router = express.Router()
const imageService = require('../services/image')
const middleware = require('../middleware/middleware')

router.delete('image/delete-image', middleware.verifyAccessToken, async (req, res) => {
    return imageService.deleteImage(req, res)
})

module.exports = router