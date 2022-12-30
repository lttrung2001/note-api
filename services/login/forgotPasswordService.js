const code = require('../../constants/code')
const {db} = require('../../utils/admin')
const {transporter, hostEmail} = require('../../utils/mailer')
const forgotPassword = async (req, res) => {
    const {email} = req.body
    if (!email) {
        res.status(code.forbidden).json({
            code: code.forbidden,
            message: 'Email is required',
            data: null
        })
    }
    try {
        await db.collection('Logins').where('email','==',email).get().then((snapshot) => {
            const list = snapshot.docs
            if (list.length) {
                const randomNumber = Math.floor(Math.random()*1000000)
                const mailOptions = {
                    from: hostEmail,
                    to: list[0].get('email'),
                    subject: 'You have reset your password for NoteApp',
                    text: `New password is ${randomNumber}\nHaving a good experience with NoteApp <3`
                  };
                transporter.sendMail(mailOptions,(error, info) => {
                    if (error) {
                        res.status(code.bad_request).json({
                            code: code.bad_request,
                            message: error.message,
                            data: null
                        })
                    } else {
                        list[0].ref.update({password: randomNumber.toString()})
                        res.status(code.success).json({
                            code: code.success,
                            message: 'Reset password successfully',
                            data: null
                        })
                    }
                })
            } else {
                res.status(code.notfound).json({
                    code: code.notfound,
                    message: 'Email not found',
                    data: null
                })
            }
        })
    } catch (error) {
        res.status(code.bad_request).json({
            code: code.bad_request,
            message: error.message,
            data: null
        })
    }
}
module.exports = forgotPassword