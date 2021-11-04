const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Report } = require('../models');


router.get('/', (req, res) => {
    Report.findAll()
    .then(data => console.log(data));
})


module.exports = router;