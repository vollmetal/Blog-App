const express = require('express')
const app = express()
const postRoutes = require('./routes/postRoutes')
const accountRoutes = require('./routes/accountRoutes')

global.session = require('express-session')

// initializing pg promise 
const pgp = require('pg-promise')() 

const bcryptjs = require('bcryptjs')

const mustacheExpress = require('mustache-express')
// setting up Express to use Mustache Express as template pages 
app.engine('mustache', mustacheExpress())
    // the pages are located in views directory
app.set('views', './views')
    // extension will be .mustache
app.set('view engine', 'mustache')

app.use(express.urlencoded())
app.use(express.static('public'))

app.use(session({
    secret: 'Super Seekret',
    resave: false,
    saveUninitialized: true
  }))

app.use('/posts', postRoutes)
app.use('/account', accountRoutes)

const connectionString = 'postgres://xyhjabts:sahlK6QMkJfqau6ekJgcNp_9YUpte-Ij@isilo.db.elephantsql.com/xyhjabts'

global.db = pgp(connectionString)

app.get('/', (req, res) => {
    let displayLogin = 'flex'
    let displayLogout = 'none'
    let blogPosts = []
    if(req.session) {
        console.log(req.session.user_Id)
        if(req.session.user_id) {
            displayLogin = 'none'
            displayLogout = 'flex'
        } else {
            displayLogin = 'flex'
            displayLogout = 'none'
        }
    }

    db.any('SELECT id, title, body FROM blog_posts WHERE is_published = True')
    .then(posts => {
        blogPosts = posts
        res.render('index', {posts: blogPosts, displayLogin: displayLogin, displayLogout: displayLogout})
    })
    
})



app.listen(2070, () => {
    console.log('Server start...')
})