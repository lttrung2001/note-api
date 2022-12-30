const code = require('../../constants/code')
const { admin, db } = require('../../utils/admin')
const deleteNote = async (req, res) => {
    const id = req.query.id
    if (!id) {
        return res.status(code.forbidden).json({
            code: code.forbidden,
            message: 'Id is required',
            data: null
        })
    }
    try {
        const doc = db.collection('Notes').doc(id)
        const snapshot = await doc.get()
        const data = {
            id: snapshot.id,
            ... snapshot.data()
        }
        delete data.userId
        await doc.delete()
        return res.status(code.success).json({
            code: code.success,
            message: 'Delete note successfully',
            data: data
        })
    } catch (error) {
        return res.status(code.bad_request).json({
            code: code.bad_request,
            message: 'Delete note failed',
            data: null
        })
    }
}
module.exports = deleteNote