const joi = require('joi');
const logger = require('../utilities/logger');
const apiResponse = require('../utilities/apiResponse');

const signupSchema = joi.object({
    email: joi.string().required().messages({
        'string.empty': 'Email is required',
        'any.required': 'Email is required'
    }),
    password: joi.string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).{8,}$'))
        .required()
        .messages({
            'string.empty': 'Password is required',
            'any.required': 'Password is required',
            'string.pattern.base': 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character'
        }),
    username: joi.string().required().messages({
        'string.empty': 'Username is required',
        'any.required': 'Username is required'
    }),

});
const otpSchema = joi.object({
    otp: joi.string().required().messages({
        'string.empty': 'Email is required',
        'any.required': 'Email is required'
    }),
});

const loginSchema = joi.object({
    email: joi.string().required().messages({
        'string.empty': 'Email is required',
        'any.required': 'Email is required'
    }),
    password: joi.string().required().messages({
        'string.empty': 'Password is required',
        'any.required': 'Password is required'
    }),
})

const signupValidator = async (req, res, next) => {
    try {
        const { error } = signupSchema.validate(req.body);
        if (error) {
            logger.error(`Validation error: ${error.message}`);
           return apiResponse.error('Validation error', 422, error.message).send(res);
        }
        next();
    } catch (error) {
        logger.error(`Validation error: ${error.message}`);
        return apiResponse.error('Internal Server Error', 500, error.message).send(res);
    }
};

const otpValidator = async (req, res, next) => {
    try {
        const { error } = otpSchema.validate(req.body);
        if (error) {
            logger.error(`Validation error: ${error.message}`);
           return apiResponse.error('Validation error', 422, error.message).send(res);
        }
        next();
    } catch (error) {
        logger.error(`Validation error: ${error.message}`);
        return apiResponse.error('Internal Server Error', 500, error.message).send(res);
    }
};


const loginValidator = (req, res, next) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) {
            logger.error(`Validation error: ${error.message}`);
           return apiResponse.error('Validation error', 422, error.message).send(res);
        }
        next();
    } catch (error) {
        logger.error(`Validation Error: ${error.message}`);
        return apiResponse.error('Internal Server Error', 500, error.message).send(res);
    }
};



module.exports = {
    signupValidator,
    otpValidator,
    loginValidator
}