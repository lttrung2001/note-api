const nodemailer = require('nodemailer')
const hostEmail = 'lt.trung2001@gmail.com'
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lt.trung2001@gmail.com',
        pass: 'sjrzolzufmnckfiv'
    }
})

module.exports = {transporter, hostEmail}