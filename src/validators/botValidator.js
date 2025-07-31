const joi = require('joi');
const logger = require('../utilities/logger');
const apiResponse = require('../utilities/apiResponse');

const querySchema = joi.object({
    botId: joi.string().required().messages({
        'string.empty': 'Bot ID is required',
        'any.required': 'Bot ID is required'
    }),
    query: joi.string().required().messages({
        'string.empty': 'Query is required',
        'any.required': 'Query is required'
    })
});

const addContentSchema = joi.object({
    botId: joi.string().required().messages({
        'string.empty': 'Bot ID is required',
        'any.required': 'Bot ID is required'
    }),
    name: joi.string().required().messages({
        'string.empty': 'Name is required',
        'any.required': 'Name is required'
    }),
    botName: joi.string().required().messages({
        'string.empty': 'Name is required',
        'any.required': 'Name is required'
    }),
    sources: joi.object({
        rawText: joi.array().items(joi.string()).required().messages({
            'array.base': 'Raw text must be an array'
        }),
        urls: joi.array().items(joi.string().uri()).required().messages({
            'array.base': 'URLs must be an array of valid URLs'
        }),
        files: joi.array().items(joi.any()).required().messages({
            'array.base': 'Files must be an array'
        })
    }).required().messages({
        'object.base': 'Sources must be an object',
        'any.required': 'Sources is required'
    })
});


const createBotSchema = joi.object({
    name: joi.string().required().messages({
        'string.empty': 'Bot name is required',
        'any.required': 'Bot name is required'
    })
})

const updateBotSchema = joi.object({
    botId: joi.string().required().messages({
        'string.empty': 'Bot ID is required',
        'any.required': 'Bot ID is required'
    }),
    name: joi.string().required().messages({
        'string.empty': 'Bot name is required',
        'any.required': 'Bot name is required'
    })
});

const getBotValidatorSchema = joi.object({
    botId: joi.string().required().messages({
        'string.empty': 'Bot ID is required',
        'any.required': 'Bot ID is required'
    }),
    botName: joi.string().required().messages({
        'string.empty': 'Bot ID is required',
        'any.required': 'Bot ID is required'
    }),
    page: joi.number().integer().min(1).default(1).messages({
        'number.base': 'Page must be a number',
        'number.integer': 'Page must be an integer',
        'number.min': 'Page must be at least 1'
    }),
    limit: joi.number().integer().min(1).max(100).default(10).messages({
        'number.base': 'Limit must be a number',
        'number.integer': 'Limit must be an integer',
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit cannot exceed 100'
    })
})

const botConfigSchema = joi.object({
    botId: joi.string().required().messages({
        'string.empty': 'Bot ID is required',
        'any.required': 'Bot ID is required'
    }),
    modelName: joi.string().required().messages({
        'string.empty': 'modelName is required',
        'any.required': 'modelName is required'
    }),
    modelProvider: joi.string().required().messages({
        'string.empty': 'modelProvider is required',
        'any.required': 'modelProvider is required'
    }),
    apiKey: joi.string().required().messages({
        'string.empty': 'apiKey is required',
        'any.required': 'apiKey is required'
    }),
    botName: joi.string().required().messages({
        'string.empty': 'botName is required',
        'any.required': 'botName is required'
    }),
    temperature: joi.number().required().messages({
        'string.empty': 'temperature is required',
        'any.required': 'temperature is required'
    })
});



const queryValidator = (req, res, next) => {
    try {
        const { error } = querySchema.validate(req.body);
        if (error) {
            logger.error(`Validation error: ${error.message}`);
            return apiResponse.error('Validation error', 422, error.message).send(res);;
        }
        next();
    } catch (error) {
        logger.error(`Validation error: ${error.message}`);
        return apiResponse.error('Internal Server Error', 500, error.message).send(res);
    }
};

const contentValidator = (req, res, next) => {
    try {
        const { error } = addContentSchema.validate(req.body);
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

const createBotValidator = (req, res, next) => {
    try {
        const { error } = createBotSchema.validate(req.query);
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

const updateBotValidator = (req, res, next) => {
    try {
        const { error } = updateBotSchema.validate(req.body);
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

const getBotValidator = (req, res, next) => {
    try {
        const { error } = getBotValidatorSchema.validate(req.body);
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


const validateBotConfig = (req, res, next) => {
    try {
        const { error } = botConfigSchema.validate(req.body);
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


module.exports = {
    queryValidator,
    contentValidator,
    createBotValidator,
    updateBotValidator,
    getBotValidator,
    validateBotConfig
}