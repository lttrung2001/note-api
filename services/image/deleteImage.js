const code = require('../../constants/code')
const { admin, db } = require('../../utils/admin')
const { app } = require('../../utils/firebase')
const { getStorage, ref, deleteObject } = require('firebase/storage')

const deleteImage = async (req, res) => {
    const imageUrl = req.query.url
    const noteId = req.query.noteId

    const storage = getStorage(app)
    const imageRef = ref(storage, imageUrl)

    try {
        await deleteObject(imageRef)
        const docRef = db.collection('Notes').doc(noteId)
        const docSnapshot = await docRef.get()
        const imagesAfterRemove = docSnapshot.get('images').filter(image => image !== imageUrl)
        await docRef.update({
            images: imagesAfterRemove
        })

        res.status(code.success).json({
            code: code.success,
            message: "Delete image successfully",
            data: imageUrl
        })
    } catch (error) {
        res.status(code.internal_server_error).json({
            code: code.internal_server_error,
            message: "Delete image failed",
            data: null
        })
    }
}

module.exports = deleteImage