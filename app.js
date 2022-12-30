const express = require('express')
const app = express()
const controllers = require('./controllers')
const fileUpload = require('express-fileupload')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(fileUpload({
  limits: {
      fileSize: 1024*1024*5 // 5MB
  },
  abortOnLimit: true
}));
app.use('/', controllers.loginController)
app.use('/', controllers.noteController)

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is listening on port: ${process.env.PORT || 3000}`)
})