const code = require('../../constants/code')
const { admin, db } = require('../../utils/admin')
const { app } = require('../../utils/firebase')
const { getStorage, ref, deleteObject, getDownloadURL } = require('firebase/storage')

const deleteImage = async (req, res) => {
    const imageUrl = decodeURIComponent(req.query.url)
    const noteId = req.query.noteId

    if (imageUrl == null || noteId == null || imageUrl === '' || noteId === '') {
        return res.status(code.bad_request).json({
            code: code.bad_request,
            message: 'All input are required',
            data: null
        })
    }

    const storage = getStorage(app)
    const imageRef = ref(storage, imageUrl)

    try {
        const docRef = db.collection('Notes').doc(noteId)
        let docSnapshot = await docRef.get()
        const imagesAfterRemove = docSnapshot.get('images').filter((image) => {image !== imageUrl})
        await Promise.all([
            deleteObject(imageRef),
            docRef.update({
                images: imagesAfterRemove
            })
        ])

        return res.status(code.success).json({
            code: code.success,
            message: "Delete image successfully",
            data: imageUrl
        })
    } catch (error) {
        return res.status(code.internal_server_error).json({
            code: code.internal_server_error,
            message: error.message,
            data: null
        })
    }
}

module.exports = deleteImage