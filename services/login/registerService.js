const code = require('../../constants/code')
const {db} = require('../../utils/admin')
const registerService = async (req, res) => {
    const {email, password} = req.body
    if (!(email && password)) {
        return res.status(code.forbidden).json({
            code: code.forbidden,
            message: 'All input is required',
            data: null
        })
    }
    try {
        const querySnapshot = await db.collection('Logins').where('email','==',email).get()
        const list = snapshot.docs
        if (!list.length) {
            const docSnapshot = await (await db.collection('Logins').add({email: email, password: password})).get()
            const data = {
                id: docSnapshot.id,
                ...docSnapshot.data()
            }
            return res.status(code.success).json({
                code: code.success,
                message: 'Register successfully',
                data: data
            })
        } else {
            return res.status(code.conflict).json({
                code: code.conflict,
                message: 'Account exists',
                data: null
            })
        }
    } catch (error) {
        return res.status(code.unauthorized).json({
            code: code.unauthorized,
            message: error,
            data: null
        })
    }
}
module.exports = registerService