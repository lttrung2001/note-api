const code = require('../../constants/code')
const { admin, db } = require('../../utils/admin')
const refreshNotes = async (req, res) => {
    const userId = req.login.id
    let page = Number(req.query.page)
    let limit = Number(req.query.limit)

    if (page < 0) {
        return res.status(code.bad_request).json({
            code: code.bad_request,
            message: 'Page number must be greater than or equals to 0',
            data: null
        })
    }

    if (limit <= 0) {
        return res.status(code.bad_request).json({
            code: code.bad_request,
            message: 'Limit must be greater than 0',
            data: null
        })
    }

    try {
        // Select note of userId
        const querySnap = db.collection('Notes')
            .where('userId', '==', userId)
        const lastPageIndex = Math.floor((await querySnap.get()).docs.length/limit)
        const resultSnap = querySnap
        .orderBy('editAt', 'desc')
        .orderBy('createAt','desc')
        .limit(limit*(page+1))
        .get()
        const hasNextPage = page < lastPageIndex
        const hasPrePage = page > 0
        const data = (await resultSnap).docs.map((doc) => ({
            id: doc.id,
            title: doc.get('title'),
            description: doc.get('description'),
            editAt: doc.get('editAt'),
            createAt: doc.get('createAt'),
            images: doc.get('images')
        }))
        return res.status(code.success).json({
            code: code.success,
            message: 'Get notes successfully',
            data: {
                hasNextPage: hasNextPage,
                hasPrePage: hasPrePage,
                data: data
            }
        })
    } catch (error) {
        return res.status(code.bad_request).json({
            code: code.bad_request,
            message: error.message,
            data: null
        })
    }
}
module.exports = refreshNotes