const code = require('../../constants/code')
const { admin, db } = require('../../utils/admin')
const { app } = require('../../utils/firebase')
const { getStorage, ref, getDownloadURL } = require('firebase/storage')
const getNoteDetail = async (req, res) => {
    const noteId = req.query.id
    if (!noteId) {
        res.status(code.bad_request).json({
            code: code.bad_request,
            message: 'Id is required',
            data: null
        })
    }
    try {
        const docSnapshot = await db.collection('Notes').doc(noteId).get()
        const data = {
            id: docSnapshot.id,
            ...docSnapshot.data()
        }

        delete data.userId
        res.status(code.success).json({
            code: code.success,
            message: "Get note detail successfully",
            data: data
        })
    } catch (error) {
        res.status(code.internal_server_error).json({
            code: code.internal_server_error,
            message: "Get note detail failed",
            data: null
        })
    }
}

module.exports = getNoteDetail