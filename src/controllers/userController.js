const logger = require('../utilities/logger');
const userService = require('../services/userService');


const signup = async (user) => {
    try {
        logger.info(`Processing Email: ${user.email}`);
        const results = await userService.signup(user);
        logger.info(`email processed: ${user.email}`);
        return results;
    } catch (error) {
        throw error;
    }
};

const verifyOtp = async (signedUpObject) => {
    try {
        const results = await userService.verifyOtp(signedUpObject);
        logger.info(`otp processed: ${signedUpObject.otp} for email ${signedUpObject.email}`);
        return results;
    } catch (error) {
        throw error;
    }
};

const loginUser = async (user) => {
    try {
        logger.info(`Logging email: ${user.email}`);
        const results = await userService.loginUser(user);
        logger.info(`user logged in  ${user.email}`);
        return results;
    } catch (error) {
        throw error;
    }
};

const regenerateOtp = async (email) => {
    try {
        logger.info(`Regenerating OTP`);
        const results = await userService.regenerateOtp(email);
        logger.info(`OTP regenerated: ${email}`);
        return results;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    signup,
    verifyOtp,
    loginUser,
    regenerateOtp
}