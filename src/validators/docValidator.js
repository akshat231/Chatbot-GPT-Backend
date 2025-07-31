const joi = require('joi');
const logger = require('../utilities/logger');
const ApiResponse = require('../utilities/apiResponse');


const deleteDocSchema = joi.object({
    botId: joi.string().required().messages({
        'string.empty': 'Bot ID is required',
        'any.required': 'Bot ID is required'
    }),
    docId: joi.string().required().messages({
        'string.empty': 'Document ID is required',
        'any.required': 'Document ID is required'
    }),
    botName: joi.string().optional().messages({
        'string.empty': 'Bot name cannot be empty',
        'any.required': 'Bot name is required'
    }),
    docName: joi.string().optional().messages({
        'string.empty': 'Document name cannot be empty',
        'any.required': 'Document name is required'
    })
});


const deleteDocValidator = (req, res, next) => {
    try {
        const { error } = deleteDocSchema.validate(req.body);
        if (error) {
            logger.error(`Validation error: ${error.message}`);
            return ApiResponse.error('Validation error', 422, error.message).send(res);
        }
        next();
    } catch (error) {
        logger.error(`Validation error: ${error.message}`);
        return ApiResponse.error('Internal Server Error', 500, error.message).send(res);
        
    }
};

module.exports = {
    deleteDocValidator
};