const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Report } = require('../models');
const validateSession = require('../middleware/validate-session');
const validateModerator = require('../middleware/validate-moderator');

router.get('/', validateModerator, async (req, res) => {
    try {
        const report = await Report.findOne({
            where: {
                status: 'unhandled'
            },
            include: 'review'
        })
        if(report === null){
            res.status(404).json({error: 'No Reports to Handle.'})
        }
        else {
            res.status(200).json({
                report: report
            })
        }
    }
    catch(e) {
        res.status(500).json({error: e});
    }
})

router.post('/', validateSession, async (req, res) => {
    const userId = req.user.id;
    const {
        reason,
        reviewId
    } = req.body.report;
    try {
        if(reviewId === undefined) throw err;
        const report = await Report.create({
            reason: reason,
            reviewId: reviewId,
            userId: userId
        })
        res.status(200).json({
            report: report
        })
    }
    catch(e) {
        res.status(500).json({
            error: e
        })
    }
})
router.put('/:id', validateModerator, async (req, res) => {
    const handledBy = req.user.id;
    const {
        id,
        status
    } = req.body.report;
    try {
        const report = await Report.findOne({
            where: {
                id: id
            }
        })
        report.status = status;
        report.handledBy = handledBy;
        await report.save();
    }
    catch(e) {
        res.status(500).json({
            error: e
        })
    }
})


module.exports = router;