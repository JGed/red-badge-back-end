const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Review } = require('../models');
const validateSession = require('../middleware/validate-session');

router.get('/', validateSession, (req, res) => {
    Review.findAll()
    .then(data => console.log(data));
})

router.post('/', validateSession, async (req, res) => {
    const userId = req.user.id;
    const { 
        text, 
        rating,
        gameId
    } = req.body.review
    try {
        const existingReview = await Review.findOne({
            where: {
                userId: id
            }
        })
        if(existingReview !== null) {
            res.status(409).json({
                message: 'User has already reviewed game'
            })
        }
        else {
            const newReview = await Review.create({
                userId: id,
                gameId: gameId,
                text: text,
                rating: rating
            })
            res.status(200).json({
                review: newReview
            })
        }
    }
    catch(e) {
        res.status(500).json({
            error: e
        })
    }
})

router.put('/id/:reviewId', validateSession, async (req, res) => {
    const userId = req.user.id;
    const {
        text,
        rating,
    } = req.body.review;
    const reviewId = req.params.reviewId;
    try {
        const updatedRecipe = await Review.update({ text: text, rating: rating}, {
            where: {
                id: reviewId,
                userId: userId
            }
        })
        res.status(200).json({
            recipe: updatedRecipe
        })
    }
    catch(e) {
        res.status(500).json({error: e})
    }
})

// user delete endpoint
router.delete('/id/:reviewId', validateSession, (req, res) => {
    const userId = req.user.id;
    const reviewId = req.params.reviewId;
    Review.destroy({
        where: {
            id: reviewId,
            userId: userId
        }
    })
    .then(() => res.status(200).json({
        message: 'Review Deleted'
    }))
    .catch(e => res.status(500).json({
        error: e
    }))
})


module.exports = router;