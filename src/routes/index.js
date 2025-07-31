const express = require('express');
const { protectRoute } = require('../middlewares/auth')
const router = express.Router();

const botApiRoute = require('./botApiRoutes');
const docApiRouter = require('./docApiRoute');
const userApiRouter = require('./userApiRoute');

router.use('/bot', protectRoute, botApiRoute);

router.use('/doc', protectRoute, docApiRouter);

router.use('/user', userApiRouter);

module.exports = router;