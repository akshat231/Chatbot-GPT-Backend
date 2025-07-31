const config = require('config');
const logger = require('../utilities/logger');
const ApiResponse = require('../utilities/apiResponse')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || config.get('jwt.secret');


const protectRoute = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.info('Auth Header missing or malformed')
      return ApiResponse.error(
        'Authorization Token missing or malformed',
        401,
        {}
      ).send(res);
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    logger.info('Auth header verified successfully');
    req.user = decoded;
    next();
  }
  catch (error) {
    logger.error('Error occured in verifying auth header');
    return ApiResponse.error(
      'Invalid or expired token',
      401,
      {}
    ).send(res);
  }
}

module.exports = {
  protectRoute
}
