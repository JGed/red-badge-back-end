const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const validateSession = require('../middleware/validate-session');
const { Game } = require('../models');
const cloudinary = require('cloudinary').v2;


router.get('/', (req, res) => {
    Game.findAll({
        where: {
            rating: {
                [Op.ne]: null
            }
        },
        order: [['rating', 'DESC']],
        limit: 16
    })
    .then(games => res.status(200).json({games: games}))
    .catch(e => res.status(500).json({ error: e }));
})

router.post('/', validateSession, (req, res) => {
    const {
        title,
        platform,
        genre,
    } = req.body.game;
    Game.create({
        title: title,
        platform: platform,
        genre: genre,
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
                genre: genre === 'role-playing (rpg)' ? 'rpg' : genre,
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
        const game = await Game.findOne({
            where: {
                id: id
            }
        });
        if(game === null) {
            res.status(404).json({
                error: 'Game does not exist.'
            })
        }
        const reviews = await game.getReviews();
        const canReview = reviews.find(review => review.userId === req.user.id) === undefined;
        res.status(200).json({
            game: game,
            reviews: reviews,
            canReview: canReview
        })
    }
    catch(e) {
        res.status(500).json({ error: e });
    }
})


/**
 *      Get Games by genre
 **/ 
router.get('/genre/:genre', validateSession, async (req, res) => {
    const genre = req.params.genre === 'role-playing (rpg)' ? 'rpg' : req.params.genre;
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
    const platform = req.params.platform;
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
    const title = req.params.title.replaceAll('%', ' ');
    try {
        const games = await Game.findAll({
            where: {
                title: {
                    [Op.iLike]: `${title}%`
                }
            }
        })
        res.status(200).json({ games: games })
    }
    catch(e) {
        res.status(500).json({ error: e });
    }
})

router.get("/photo/cloudsign", validateSession, async (req, res) => {
    try {
      const timestamp = Math.floor(new Date().getTime() / 1000).toString();
      const signature = cloudinary.utils.api_sign_request(
        { timestamp: timestamp, upload_preset: "vg-review-pic" },
        process.env.CLOUDINARY_SECRET
      );
  
      res.status(200).json({ signature, timestamp });
    } catch (err) {
      res.status(500).json({
        message: "failed to sign",
      });
    }
  });

module.exports = router;