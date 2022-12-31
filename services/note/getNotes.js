const code = require('../../constants/code')
const { admin, db } = require('../../utils/admin')
const getNotes = async (req, res) => {
    const userId = req.login.id
    let page = Number(req.query.page)
    let limit = Number(req.query.limit)

    if (page < 0) {
        return res.status(code.bad_request).json({
            code: code.bad_request,
            message: 'Page for pagination must be equals or greater than 0',
            data: null
        })
    } else if (limit <= 0) {
        return res.status(code.bad_request).json({
            code: code.bad_request,
            message: 'Limit must be greater than 0',
            data: null
        })
    }

    try {
        // Select note of userId
        const query = db.collection('Notes')
            .where('userId', '==', userId)

        const lastPageIndex = Math.floor((await query.get()).docs.length/limit)

        // Paging
        const querySnapshot = await query
            .orderBy('editAt','desc')
            .orderBy('createAt','desc')
            .offset(page*limit)
            .limit(limit)
            .get()

        const hasNextPage = page < lastPageIndex
        const hasPrePage = page > 0

        if (page <= lastPageIndex) {
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                title: doc.get('title'),
                description: doc.get('description'),
                editAt: doc.get('editAt'),
                createAt: doc.get('createAt'),  
                // images: doc.get('images')
                images: []
            }))
            return res.status(code.success).json({
                code: code.success,
                message: 'Get notes successfully',
                data: {
                    data: data,
                    hasNextPage: hasNextPage,
                    hasPrePage: hasPrePage
                }
            })
        } else {
            return res.status(code.notfound).json({
                code: code.notfound,
                message: 'No more notes to load',
                data: {
                    data: null,
                    hasNextPage: hasNextPage,
                    hasPrePage: hasPrePage
                }
            })
        }
    } catch (error) {
        return res.status(code.notfound).json({
            code: code.notfound,
            message: "Get notes failed",
            data: null
        })
    }
}
module.exports = getNotes