const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { Op } = require('sequelize');
const validateAdmin = require('../middleware/validate-admin');
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
            passwordHash: bcrypt.hashSync(password, 13),
            role: username === 'admin' ? 'admin' : 'user'
        })
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 24
        })
        res.status(200).json({
            sessionToken: token,
            role: newUser.role
        })
    }
    catch(e) {
        res.status(500).json({
            error: e
        })
    }
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body.user;
    try {
        const user = await User.findOne({
            where: {
                username: username
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
                        role: user.role
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

router.get('/', validateAdmin, (req, res) => {
    User.findAll({
        attributes: ['id', 'username', 'offences'],
        where: {
            role: {
                [OP.or]: ['user', 'moderator']
            }
        },
        order: ['offences', 'DESC']
    })
    .then(users => res.status(200).json({
        users: users
    }))
    .catch(e => res.status(500).json({ error: e }))
})

router.delete('/:id', validateAdmin, (req, res) => {
    const id = req.params.id;
    User.destroy({
        where: {
            id: id
        }
    })
    .then(() => res.status(200).json({message: 'User Deleted'}))
    .catch(err => res.status(500).json({error: err}));
})
module.exports = router;