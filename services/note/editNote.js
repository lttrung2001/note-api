const code = require('../../constants/code')
const { admin, db } = require('../../utils/admin')
const { app } = require('../../utils/firebase')
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage')
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
    const docRef = db.collection('Notes').doc(id)
    const snapshot = await docRef.get()
    const noteEdit = {
        title: noteTitle,
        description: noteDescription,
        editAt: Date.now(),
        createAt: snapshot.get('createAt'),
        images: snapshot.get('images')
    }
    try {
        if (req.files) {
            if (req.files.image) {
                // Loop store images to cloud
                const promiseArray = []
                for (const element of [].concat(req.files.image)) {
                    // Set reference for image in cloud
                    storageRef = ref(storage, `images/${req.login.id}/${docRef.id}/${Date.now().toString()}-${element.name}`)
                    promiseArray.push(
                        uploadImage(storageRef, element.data)
                    )
                }
                // Wait until all images uploaded
                noteEdit.images = noteEdit.images.concat((await Promise.all(promiseArray)).map(async (ref) => {
                    await getDownloadURL(ref)
                })) 
            }
        }
        // Save note
        await docRef.update(noteEdit)
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
    } catch (error) {
        return res.status(code.internal_server_error).json({
            code: code.internal_server_error,
            message: error.message,
            data: null
        })
    }
}

const uploadImage = async (ref, data) => {
    uploadBytes(ref, data, { contentType: 'image' })
    return ref.storageRef.fullPath
}

module.exports = editNote