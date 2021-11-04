const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateSession = require('../middleware/validate-session');
const { Game } = require('../models');


router.get('/', (req, res) => {
    Game.findAll()
    .then(data => console.log(data));
})

router.post('/', validateSession, (req, res) => {
    const {
        title,
        platform
    } = req.body.game;
    Game.create({
        title: title,
        platform: platform
    })
    .then(game => res.status(200).json({ game: game }))
    .catch(e => res.status(500).json({ error: e }))
})

/**
 *      Update Game by id 
 **/ 
router.put('/id/:id', validateSession, async (req, res) => {

    const id = req.params.id;
    const {
        title, 
        platform,
        genre,
        releaseDate
    } = req.body.game;

    try {
        const game = await Game.findByPk(id);
        if(game === null) {
            res.status(404).json({ error: 'Game does not exist.'})
        }
        else {
            game.set({
                title: title,
                genre: genre,
                platform: platform,
                releaseDate: releaseDate
            })
            await game.save();
            res.status(200).json({ game: game })
        }
    }
    catch(e) {
        res.status(500).json({ error: e });
    }
})

/**
 *      Get Game by id 
 **/ 
router.get('/id/:id', validateSession, async (req, res) => {
    const id = req.params.id;
    try {
        const game = await Game.findByPk(id);
        if(game === null) {
            res.status(404).json({
                error: 'Game does not exist.'
            })
        }
    }
    catch(e) {
        res.status(500).json({ error: e });
    }
})


/**
 *      Get Games by genre
 **/ 
router.get('/genre/:genre', validateSession, async (req, res) => {
    const genre = req.params.genre;
    try {
        const games = await Game.findAll({
            where: {
                genre: genre
            }
        })
        res.status(200).json({ games: games })
    }
    catch(e) {
        res.status(500).json({ error: e });
    }
})

/**
 *      Get Games by platform 
 **/ 
router.get('/platform/:platform', validateSession, async (req, res) => {
    const genre = req.params.genre;
    try {
        const games = await Game.findAll({
            where: {
                platform: platform
            }
        })
        res.status(200).json({ games: games })
    }
    catch(e) {
        res.status(500).json({ error: e });
    }
})

/**
 *      Get Games by title
 **/ 
router.get('/title/:title', validateSession, async (req, res) => {
    const title = req.params.title;
    try {
        const games = await Game.findAll({
            where: {
                title: title
            }
        })
        res.status(200).json({ games: games })
    }
    catch(e) {
        res.status(500).json({ error: e });
    }
})



module.exports = router;