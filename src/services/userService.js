const crypto = require('crypto');
const config = require('config');
require('dotenv').config();
const logger = require('../utilities/logger');
const userRepository = require('../repositories/userRepository');
const cryptoAlgorithm = process.env.CRYPTO_ALGORITHM || config.get('crypto.algorithm');
const cryptoKey = Buffer.from(process.env.CRYPTO_KEY || config.get('crypto.key'));
const iv = Buffer.from(process.env.CRYPTO_IV || config.get('crypto.iv'));
const { sendVerificationEmail } = require('signup-verifier');
const generateToken = require('../utilities/jwt')



const encrypt = (value) => {
    try {
        const cipher = crypto.createCipheriv(cryptoAlgorithm, cryptoKey, iv);
        logger.info('Encrypting value');
        const encrypted = cipher.update(value, 'utf8', 'hex') + cipher.final('hex');
        logger.info('Encrypted value');
        return encrypted;
    } catch (error) {
        throw error;
    }
};

const signup = async (user) => {
    try {
        logger.info('Validating if email already exist');
        const emailExist = await userRepository.emailExist(user.email);
        if (emailExist) {
            return { message: 'Email is already registered', data: { email: user.email }, statusCode: 409 }
        }
        logger.info('Generating OTP');
        const randomNumber = Math.floor(100000 + Math.random() * 900000).toString();
        const encryptedOTP = encrypt(randomNumber);
        logger.info('Saving email and OTP Hash and sending otp');
        logger.info('Generating Password Hash');
        const cipher = crypto.createCipheriv(cryptoAlgorithm, cryptoKey, iv);
        logger.info('Encrypting Password');
        const encryptedPassword = cipher.update(user.password, 'utf8', 'hex') + cipher.final('hex');
        const userObject = {
            email: user.email,
            password: encryptedPassword,
            username: user.username,
            otp: encryptedOTP
        }
        const signedUpUserId = await userRepository.saveEmailInPendingUsers(userObject);
        await sendVerificationEmail(
            {
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.ADMIN_EMAIL || config.get('adminInfo.email'),
                    pass: process.env.ADMIN_APP_PASSWORD || config.get('adminInfo.appPassword')
                }
            },
            user.email,
            randomNumber,
            'Verify your email'
        );
        const signedUpUser  = {
            id: signedUpUserId,
            email: user.email,
            username: user.username
        }
        const token = generateToken(signedUpUser);
        logger.info('User signed up successfully');
        return { message: 'User registered', data: { email: userObject.email, username: userObject.username, token } };
    } catch (error) {
        throw error;
    }
};

const verifyOtp = async (signedUpObject) => {
    try {
        const encryptedOTP = encrypt(signedUpObject.otp);
        const result = await userRepository.verifyOtp({ email: signedUpObject.email, encryptedOTP });
        if (result) {
            logger.info('OTP verified');
            await userRepository.saveUserData(result);
            await userRepository.deletePendingUser(signedUpObject.email);
            return { message: 'User successfully verified', data: { email: signedUpObject.email } }
        }
        logger.info('OTP failed, incrementing attempts')
        const getAttempts = await userRepository.getVerificationAttempts(signedUpObject.email);
        if (!getAttempts) {
            logger.info('Attempt not found in table')
            return { message: 'user not found', data: {email: signedUpObject.email}, statusCode: 404};
        }
        const newAttempts = getAttempts.attempt + 1;
        logger.info(`new attempt is: ${newAttempts}`);
        if (newAttempts >= 6) {
            await userRepository.deletePendingUser(signedUpObject.email);
            return { message: 'Too many attempts', data: { email: signedUpObject.email }, statusCode: 429 };
        }
        await userRepository.updateAttempts(signedUpObject.email, newAttempts);
        return { message: 'OTP Attempt failed', data: { email: signedUpObject.email }, statusCode: 400 };
    } catch (error) {
        throw error;
    }
};


const loginUser = async (user) => {
    try {
        const encryptedPassword = encrypt(user.password);
        const userObject = {
            email: user.email,
            password: encryptedPassword
        };
        const loggedInUser = await userRepository.loginUser(userObject);
        if (!loggedInUser) {
            logger.info('User not found in users table');
            return {message: 'user not found', data: {email: user.email}, statusCode: 404};
        }
        const tokenObject = {
            email: user.email,
            username: loggedInUser.username,
            id: loggedInUser.id
        }
        const jwtToken = generateToken(tokenObject)
        return {message: 'User successfully logged in', data: {email: user.email, username: loggedInUser.username, token: jwtToken}};
    } catch (error) {
        throw error;
    }
};


const regenerateOtp = async (email) => {
    try {
        logger.info('Checking Regeneration Threshhold time');
        const lastSentTime = await userRepository.getLastSentTime(email);
        if (!lastSentTime) {
            return { message: 'No previous OTP sent.', data: { email }, statusCode: 404 };
        }
        const now = new Date();
        const lastSent = new Date(lastSentTime.last_sent_at)
        if (now - lastSent < 60000) {
            return {
                message: 'You must wait at least 60 seconds between OTP requests.',
                data: { email },
                statusCode: 429
            };
        }
        logger.info('Generating OTP');
        const randomNumber = Math.floor(100000 + Math.random() * 900000).toString();
        const encrypted = encrypt(randomNumber);
        logger.info('Regenerated OTP Hash and sending otp');
        await userRepository.reSaveOTP(email, encrypted)
        await sendVerificationEmail(
            {
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.ADMIN_EMAIL || config.get('adminInfo.email'),
                    pass: process.env.ADMIN_APP_PASSWORD || config.get('adminInfo.appPassword')
                }
            },
            email,
            randomNumber,
            'Verify your email'
        );
        return {message: 'OTP sent', data: {email}};
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