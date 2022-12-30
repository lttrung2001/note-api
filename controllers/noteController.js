const express = require('express')
const router = express.Router()
const notesService = require('../services/note')
const middleware = require('../middleware/middleware')

router.get('/get-notes', middleware.verifyAccessToken, async (req, res) => {
    return await notesService.getNotes(req, res)
})

router.get('/refresh-notes', middleware.verifyAccessToken, async (req, res) => {
    return await notesService.refreshNotes(req, res)
})

router.put('/add-note', middleware.verifyAccessToken, async (req, res) => {
    return await notesService.addNote(req, res)
})

router.post('/edit-note', middleware.verifyAccessToken, async (req, res)=> {
    return await notesService.editNote(req, res)
})

router.delete('/delete-note', middleware.verifyAccessToken, async (req, res)=>{
    return await notesService.deleteNote(req, res)
})

router.post('/upload-note-images', middleware.verifyAccessToken, async (req, res) => {
    return await notesService.uploadNoteImages(req, res)
})

module.exports = router