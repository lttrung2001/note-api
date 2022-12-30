const code = require('../../constants/code')
const { admin, db } = require('../../utils/admin')
const { app } = require('../../utils/firebase')
const { getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject } = require('firebase/storage')
const editNote = async (req, res) => {
    const id = req.query.id
    const { noteTitle, noteDescription } = req.body
    if (!(noteTitle || noteDescription || req.files)) {
        return res.status(code.forbidden).json({
            code: code.forbidden,
            message: 'At least 1 input required',
            data: null
        })
    } else if (!id) {
        return res.status(code.forbidden).json({
            code: code.forbidden,
            message: 'Id is required',
            data: null
        })
    }
    const storage = getStorage(app)
    let storageRef = null
    try {
        const docRef = db.collection('Notes').doc(id)
        const snapshot = await docRef.get()
        const noteEdit = {
            title: noteTitle,
            description: noteDescription,
            createAt: snapshot.get('createAt'),
            editAt: Date.now(),
            images: snapshot.get('images')
        }
        new Promise(async (resolve, reject) => {
            try {
                if (req.files) {
                    if (req.files.image) {
                        // Loop store images to cloud
                        for (const element of [].concat(req.files.image)) {
                            // Set reference for image in cloud
                            storageRef = ref(storage, `images/${snapshot.get('userId')}-${docRef.id}-${Date.now().toString()}-${element.name}`)
                            // Add url to note
                            noteEdit.images.push(storageRef.bucket)
                            // Upload image
                            uploadBytes(storageRef, element.data, {
                                contentType: 'image'
                            })
                        }
                    }
                }
                // Save note
                docRef.update(noteEdit)
                resolve(noteEdit)
            } catch (error) {
                reject(error)
            }
        }).then(async (result) => {
            await docRef.update(result).then(async () => {
                await docRef.get().then((snapshot) => {
                    const data = {
                        id: snapshot.id,
                        ...snapshot.data()
                    }
                    delete data.userId
                    return res.status(code.success).json({
                        code: code.success,
                        message: 'Edit note successfully',
                        data: data
                    })
                })
            })
        }, (error) => {
            console.log(error)
            return res.status(code.bad_request).json({
                code: code.bad_request,
                message: 'Edit note failed because of uploading images failed',
                data: null
            })
        })
    } catch (error) {
        console.log(error)
        return res.status(code.bad_request).json({
            code: code.bad_request,
            message: error.message,
            data: null
        })
    }
}
module.exports = editNote