const express = require('express')
const postRouter = express.Router()

postRouter.get('/make-post', (req, res) => {
    res.render('make-post')
})

postRouter.post('/make-post', (req, res) => {
    const title = req.body.postTitle
    const body = req.body.postBody

    db.none(`INSERT INTO blog_posts(title, body, is_published) VALUES ('${title}', '${body}', True)`)
    .then(() => {
        res.redirect('/')
    }).catch (error => {
        console.log(error)
    })

})

postRouter.get('/update-post/:postID', (req, res) => {
    db.one(`SELECT id, title, body FROM blog_posts WHERE id = ${req.params.postID}`)
    .then(post => {
        res.render('update-post', {post: post})
    })

})

postRouter.post('/update-post/:postID', (req, res) => {
    db.none((`UPDATE blog_posts SET body = '${req.body.postBody}', updated_at = current_timestamp WHERE id = ${req.params.postID}`))
    res.redirect('/')
})

postRouter.post('/delete-post/:postID', (req, res) => {
    db.none((`DELETE FROM blog_posts WHERE id = ${req.params.postID}`))
    res.redirect('/')
})

module.exports = postRouter