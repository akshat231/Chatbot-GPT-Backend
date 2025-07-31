const express = require("express");
const router = express.Router();
const config = require("config");
const logger = require("../utilities/logger");
const ApiResponse = require("../utilities/apiResponse");
const userValidator = require("../validators/userValidator");
const userController = require("../controllers/userController");
const { protectRoute } = require('../middlewares/auth')

router.post('/signup', userValidator.signupValidator, async (req, res, next) => {
    try {
        const { email, password, username } = req.body;
        logger.info(`Signing up for email ${email}`);
        const result = await userController.signup({email, password, username});
        return ApiResponse.success(result).send(res);
    } catch (error) {
        logger.error(`Error in user API route: ${error.message}`);
        next(error);
    }
});

router.post('/verify', protectRoute, userValidator.otpValidator, async (req, res, next) => {
    try {
        const { email, username } = req.user;
        const { otp } = req.body;
        logger.info(`Verifying OTP ${otp} for email ${email}`);
        const result = await userController.verifyOtp({email, otp, username});
        return ApiResponse.success(result).send(res);
    } catch (error) {
        logger.error(`Error in user API route: ${error.message}`);
        next(error);
    }
});

router.post('/login', userValidator.loginValidator, async (req, res, next) => {
    try {
        const { email, password } = req.body;
        logger.info(`Logging in for user email: ${email}`);
        const result = await userController.loginUser({ email, password });
        return ApiResponse.success(result).send(res);
    } catch (error) {
        logger.error(`Error in User API route: ${error.message}`);
        next(error);
    }
});

router.get('/regenerateOtp', protectRoute, async (req, res, next) => {
    try {
        const { email } = req.user;
        logger.info(`Regenerating OTP for email ${email}`);
        const result = await userController.regenerateOtp(email);
        return ApiResponse.success(result).send(res);
    } catch (error) {
        logger.error(`Error in User API route: ${error.message}`);
        next(error);
    }
});

module.exports = router