const code = require('../../constants/code')
const { admin, db } = require('../../utils/admin')
const { app } = require('../../utils/firebase')
const { getStorage, ref, deleteObject } = require('firebase/storage')

const deleteImage = async (req, res) => {
    console.log(req.query)
    const imageUrl = req.query.url
    const noteId = req.query.noteId

    if (imageUrl == null || noteId == null) {
        return res.status(code.bad_request).json({
            code: code.bad_request,
            message: 'At least 1 argument is required',
            data: null
        })
    }

    const storage = getStorage(app)
    const imageRef = ref(storage, imageUrl)

    try {
        deleteObject(imageRef)
        const docRef = db.collection('Notes').doc(noteId)
        const docSnapshot = await docRef.get()
        const imagesAfterRemove = docSnapshot.get('images').filter(image => image !== imageUrl)
        docRef.update({
            images: imagesAfterRemove
        })

        return res.status(code.success).json({
            code: code.success,
            message: "Delete image successfully",
            data: imageUrl
        })
    } catch (error) {
        return res.status(code.internal_server_error).json({
            code: code.internal_server_error,
            message: "Delete image failed",
            data: null
        })
    }
}

module.exports = deleteImage