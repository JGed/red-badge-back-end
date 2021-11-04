const jwt = require('jsonwebtoken');
const { User }  = require('../models');

const validateModerator = (req, res, next) => {
    const token = req.headers.authorization;
    if (token === undefined) {
        return res.status(403).send({
            auth: false,
            message: 'No token provided',
        });
    } else {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (!err && decodedToken) {
                try {
                    const user = await User.findOne({
                        where: {
                            id: decodedToken.id,
                        },
                    });
                    if(!user) throw err;
                    if(user.role === 'moderator' || user.role === 'admin') {
                        req.user = user;
                        return next();
                    }
                    else {
                        throw err;
                    }
                } catch(err) {
                    next(err);
                }
            } else { 
                req.errors = err;
                return res.status(500).send({
                    message: 'Not Authorized'
                });
            }
        });
    }
}

export default validateModerator;