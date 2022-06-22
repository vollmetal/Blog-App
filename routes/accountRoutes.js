const express = require('express')
const accountRouter = express.Router()
const bcryptjs = require('bcryptjs')

accountRouter.get('/register', (req, res) => {
    res.render('account/register')
})

accountRouter.get('/', (req, res) => {
    res.render('account/login')
})

accountRouter.post('/register', (req, res) => {
    const username = req.body.username
    const password = req.body.password

    db.oneOrNone('SELECT user_id FROM users WHERE username = $1', [username])
    .then(user => {
        if(user) {
            res.render('/register', {message: 'Account already exists with that username!'})
        } else {
            bcryptjs.genSalt(10)
            .then(salt => {
                bcryptjs.hash(password, salt)
                .then(saltedString => {
                    db.none('INSERT INTO users(username, password) VALUES ($1, $2)', [username, saltedString])
                    res.render('account/login', {message: 'Account has been created'})
                })
            })
        }
    })
})

accountRouter.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    console.log(req.session)

    db.oneOrNone('SELECT user_id, username, password FROM users WHERE username = $1', [username])
    .then(user => {
        console.log(user)
        if(user) {
            bcryptjs.compare(password, user.password)
            .then (result => {
                console.log(result)
                if(result) {
                    req.session.user_Id = user.user_id
                    
                    if(req.session)
                    {
                        
                        
                    }
                    res.redirect('/')
                }
                                
            })
        }
    })
})

module.exports = accountRouter