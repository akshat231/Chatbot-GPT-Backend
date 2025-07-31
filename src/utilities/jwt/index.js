const config = require('config');
const logger = require('../logger');
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || config.get('jwt.secret');

const generateToken = (user) => {
    try {
        logger.info(`Signing in jwt token for user: ${user.username} and email: ${user.email}`)
        return jwt.sign(
            {
                id: user.id,
                email: user.email,
                username: user.username,
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
    } catch (error) {
        throw error;
    }
};

module.exports = generateToken;
