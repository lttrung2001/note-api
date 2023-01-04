const code = require('../../constants/code')
const { admin, db } = require('../../utils/admin')
const { app } = require('../../utils/firebase')
const { getStorage, ref, uploadBytes } = require('firebase/storage')
const editNote = async (req, res) => {
    const id = req.query.id
    const { noteTitle, noteDescription } = req.body
    if (!(noteTitle || noteDescription || req.files)) {
        return res.status(code.bad_request).json({
            code: code.bad_request,
            message: 'At least 1 input required',
            data: null
        })
    } else if (!id) {
        return res.status(code.bad_request).json({
            code: code.bad_request,
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
            editAt: Date.now(),
            createAt: snapshot.get('createAt'),
            images: snapshot.get('images')
        }
        new Promise(async (resolve, reject) => {
            try {
                if (req.files) {
                    if (req.files.image) {
                        // Loop store images to cloud
                        const promiseArray = []
                        for (const element of [].concat(req.files.image)) {
                            // Set reference for image in cloud
                            storageRef = ref(storage, `images/${newNote.userId}/${docRef.id}/${Date.now().toString()}-${element.name}`)
                            promiseArray.push(
                                uploadImage(storageRef, element.data)
                            )
                        }
                        // Wait until all images uploaded
                        await Promise.all(promiseArray)
                    }
                }
                // Save note
                resolve(noteEdit)
            } catch (error) {
                reject(error)
            }
        }).then(async (result) => {
            await docRef.update(result)
            const docSnapshot = await docRef.get()
            const data = {
                id: docSnapshot.id,
                ...docSnapshot.data()
            }
            delete data.userId
            return res.status(code.success).json({
                code: code.success,
                message: 'Edit note successfully',
                data: data
            })
        }, (error) => {
            return res.status(code.internal_server_error).json({
                code: code.internal_server_error,
                message: 'Edit note failed because of uploading images failed',
                data: null
            })
        })
    } catch (error) {
        return res.status(code.internal_server_error).json({
            code: code.internal_server_error,
            message: "Edit note failed",
            data: null
        })
    }
}

const uploadImage = async (ref, data) => {
    await uploadBytes(ref, data, { contentType: 'image' })
    return getDownloadURL(ref)
}

module.exports = editNote