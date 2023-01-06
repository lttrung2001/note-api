const code = require('../../constants/code')
const { admin, db } = require('../../utils/admin')
const { app } = require('../../utils/firebase')
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage')
const addNote = async (req, res) => {
    const note = JSON.parse(req.body.note)
    if (!(note.title || note.description || req.files)) {
        return res.status(code.bad_request).json({
            code: code.bad_request,
            message: 'At least 1 input required',
            data: null
        })
    }
    // Create note instance
    const newNote = {
        title: note.title,
        description: note.description,
        editAt: Date.now(),
        createAt: Date.now(),
        images: [],
        userId: req.login.id
    }
    // Get storage instance
    const storage = getStorage(app)
    let storageRef = null
    try {
        const docRef = db.collection('Notes').doc()
        // Note has files
        if (req.files) {
            // Files are images
            if (req.files.image) {
                // Loop to upload all images
                const promiseArray = []
                for (const element of [].concat(req.files.image)) {
                    // Set reference for image in cloud
                    storageRef = ref(storage, `images/${newNote.userId}/${docRef.id}/${Date.now().toString()}-${element.name}`)
                    promiseArray.push(
                        addImage(storageRef, storageRef.fullPath, element.data)
                    )
                }
                // Wait until all images uploaded
                newNote.images = (await Promise.all(promiseArray)).map(async (ref) => {
                    await getDownloadURL(ref)
                })
            }
        }
        // Save note
        await docRef.set(newNote)
        const docSnapshot = await docRef.get()
        const data = {
            id: docSnapshot.id,
            ...docSnapshot.data()
        }

        delete data.userId
        return res.status(code.success).json({
            code: code.success,
            message: 'Add note successfully',
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

const addImage = async (ref, fullPath, data) => {
    uploadBytes(ref, data, { contentType: 'image' })
    return fullPath
}

module.exports = addNote