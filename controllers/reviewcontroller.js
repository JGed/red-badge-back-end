const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Review } = require('../models');
const validateSession = require('../middleware/validate-session');


router.get('/user/', validateSession, async (req, res) => {
    const userId = req.user.id;
    try {
        const reviews = await Review.findAll({
            where: {
                userId: userId
            },
            include: 'game'
        })
        res.status(200).json({reviews: reviews})
    }
    catch(e) {
        res.status(500).json({error: e});
    }
})

router.post('/', validateSession, async (req, res) => {
    const userId = req.user.id;
    const { 
        text, 
        title,
        rating,
        gameId
    } = req.body.review
    try {
        const existingReview = await Review.findOne({
            where: {
                userId: userId, 
                gameId: gameId
            }
        })
        if(existingReview !== null) {
            res.status(409).json({
                message: 'User has already reviewed game'
            })
        }
        else {
            const newReview = await Review.create({
                userId: userId,
                gameId: gameId,
                text: text,
                title: title,
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

router.get('/id/:reviewId', validateSession, async (req, res) => {
    const reviewId = req.params.reviewId;
    try {
        const review = await Review.findOne({
            where: {
                id: reviewId
            },
            include: 'game'
        })
        if(review === null){
            res.status(404).json({error: 'Review does not exist.'});
        }
        else {
            res.status(200).json({review: review})
        }
    }
    catch(error) {

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