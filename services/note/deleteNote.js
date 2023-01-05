const code = require('../../constants/code')
const { admin, db } = require('../../utils/admin')
const { getStorage, ref, listAll, deleteObject } = require("firebase/storage")
const deleteNote = async (req, res) => {
    const id = req.query.id // note id
    if (!id) {
        return res.status(code.bad_request).json({
            code: code.bad_request,
            message: 'Id is required',
            data: null
        })
    }
    try {
        const doc = db.collection('Notes').doc(id)
        const storage = getStorage();

        // Create a reference under which you want to list
        const listRef = ref(storage, `images/${req.login.id}/${id}`);

        // Find all the prefixes and items.
        listAll(listRef)
        .then(async (res) => {
            const promiseArray = []
            res.items.forEach((itemRef) => {
                promiseArray.push(deleteObject(itemRef))
            });
            await Promise.all(promiseArray)
        })

        const snapshot = await doc.get()
        const data = {
            id: snapshot.id,
            ... snapshot.data()
        }
        delete data.userId
        doc.delete()

        return res.status(code.success).json({
            code: code.success,
            message: 'Delete note successfully',
            data: data
        })
    } catch (error) {
        return res.status(code.internal_server_error).json({
            code: code.internal_server_error,
            message: error.message,
            data: null
        })
    }
}
module.exports = deleteNote