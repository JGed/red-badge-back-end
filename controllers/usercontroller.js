const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { Op } = require('sequelize');

router.get('/', (req, res) => {
    User.findAll()
    .then(data => console.log(data));
})

router.post('/register', async (req, res) => {
    const { email, username, password } = req.body.user;
    try {
        existingUsers = await User.findAll({
            where: {
                [Op.or]: [
                    {username: username},
                    {email: email}
                ]
            }
        })
        if(existingUsers.length > 0) {
            let emailMessage, usernameMessage;
            for(u of existingUsers) {
                if(u.email === email) {
                    emailMessage = `${email} already registered.`
                }
                if(u.username === username) {
                    usernameMessage = `${username} already registered.`
                }
            }
            res.status(409).json({
                emailMessage: emailMessage,
                usernameMessage: usernameMessage
            })
        }

    }
    catch(e) {
        res.status(500).json({
            error: e
        })
        return;
    }
    try {
        const newUser = await User.create({
            email: email,
            username: username,
            passwordHash: bcrypt.hashSync(password, 13)
        })
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 24
        })
        res.status(200).json({
            sessionToken: token
        })
    }
    catch(e) {
        res.status(500).json({
            error: e
        })
    }
})


router.post('/login', async (req, res) => {
    const { email, password } = req.body.user;
    try {
        const user = await User.findOne({
            where: {
                email: email
            }
        })
        if(user !== null) {
            bcrypt.compare(password, user.passwordHash, (err, matches) => {
                if(!err && matches) {
                    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                        expiresIn: 60 * 60 * 24
                    })
                    res.status(200).json({
                        sessionToken: token,
                        auth: user.role
                    })
                }
                else {
                    res.status(409).json({
                        passwordMessage: 'Incorrect password.'
                    })
                }
            })
        }
        else {
            res.status(409).json({
                emailMessage: 'Email not registered.'
            })
        }
    }
    catch(e) {
        res.status(500).json({
            error: e
        })
    }
})

module.exports = router;