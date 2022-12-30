const code = require('../../constants/code')
const {db} = require('../../utils/admin')

const changePasswordService = async (req, res) => {
    const {email, oldPassword, newPassword} = req.body
    if (!(email && oldPassword && newPassword)) {
        return res.status(code.forbidden).json({
            code: code.forbidden,
            message: 'All input is required',
            data: null
        })
    }
    try {
        const querySnapshot = await db.collection('Logins').where('email','==',email).get()
        const list = querySnapshot.docs
        if (list.length && list[0].get('password') === oldPassword) {
            const docRef = list[0].ref
            docRef.update({password: newPassword})
            const docSnapshot = docRef.get()
            const data = {
                id: docSnapshot.id,
                ... docSnapshot.data()
            }
            return res.status(code.success).json({
                code: code.success,
                message: 'Change password successfully',
                data: data
            })
            
        } else {
            return res.status(code.unauthorized).json({
                code: code.unauthorized,
                message: 'Invalid credentials',
                data: null
            })
        }
    } catch (error) {
        return res.status(code.bad_request).json({
            code: code.bad_request,
            message: error.message,
            data: null
        })
    }
}

module.exports = changePasswordService