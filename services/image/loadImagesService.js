const code = require('../../constants/code')
const { admin, db } = require('../../utils/admin')
const { app } = require('../../utils/firebase')
const { getStorage, ref, getDownloadURL } = require('firebase/storage')

const loadImages = async (req, res) => {
    const noteId = req.query.noteId

    if (noteId == null || noteId === '') {
        return res.status(code.bad_request).json({
            code: code.bad_request,
            message: 'At least 1 argument is required',
            data: null
        })
    }

    const storage = getStorage(app)
    try {
        const docRef = db.collection('Notes').doc(noteId)
        const docSnapshot = await docRef.get()
        const images = docSnapshot.get('images')
        const promiseArray = []
        images.forEach(element => {
            promiseArray.push(getAccessURL(storage, element))
        });
        const result = await Promise.all(promiseArray)
        return res.status(code.success).json({
            code: code.success,
            message: "Get images successfully",
            data: result
        })
    } catch (error) {
        return res.status(code.internal_server_error).json({
            code: code.internal_server_error,
            message: error.message,
            data: null
        })
    }
}

const getAccessURL = async (storage, fullPath) => {
    const imageRef = ref(storage, fullPath)
    return getDownloadURL(imageRef)
}

module.exports = loadImages