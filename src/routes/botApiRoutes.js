const express = require("express");
const router = express.Router();
const config = require("config");
const logger = require("../utilities/logger");
const ApiResponse = require("../utilities/apiResponse");
const botValidator = require("../validators/botValidator");
const botController = require("../controllers/botController");

router.post('/query', botValidator.queryValidator, async (req, res, next) => {
    try {
        const { botId, query } = req.body;
        logger.info(`Received query for botId: ${botId} with query: "${query}"`);
        const result = await botController.vectorSearch(botId, query);
        return ApiResponse.success(result).send(res);
    } catch (error) {
        logger.error(`Error in bot API route: ${error.message}`);
        next(error);
    }
});

router.post('/addContent', botValidator.contentValidator, async (req, res, next) => {
    try {
        const { botId, name, sources, botName } = req.body;
        logger.info(`Adding content for : ${botName}`);
        const result = await botController.addContent(botId, name, sources, botName);
        return ApiResponse.success(result).send(res);
    } catch (error) {
        logger.error(`Error in bot API route: ${error.message}`);
        next(error);
    }
});

router.get('/createBot', botValidator.createBotValidator, async (req, res, next) => {
    try {
        const { name } = req.query;
        const { username, email, id } = req.user;
        logger.info(`Creating bot with name: ${name}`);
        const result = await botController.createBot({ botName: name, username, email, userId: id });
        return ApiResponse.success(result).send(res);
    } catch (error) {
        logger.error(`Error in bot API route: ${error.message}`);
        next(error);
    }
});

router.post('/updateBot', botValidator.updateBotValidator, async (req, res, next) => {
    try {
        const { botId, name } = req.body;
        const { id } = req.user;
        logger.info(`Updating bot name to: ${name}`);
        const result = await botController.updateBot({ botId, botName: name, userId: id });
        return ApiResponse.success(result).send(res);
    } catch (error) {
        logger.error(`Error in bot API route: ${error.message}`);
        next(error);
    }
});


router.post('/updateBotConfig', botValidator.validateBotConfig, async (req, res, next) => {
    try {
        const { botId, modelName, modelProvider, apiKey, temperature, botName } = req.body;
        logger.info(`Updating Bot Config for bot: ${botName}`);
        const result = await botController.updateBotConfig({ botId, modelName, modelProvider, apiKey, temperature, botName });
        return ApiResponse.success(result).send(res);
    } catch (error) {
        logger.error(`Error in bot API route: ${error.message}`);
        next(error);
    }
});


router.post('/getBotConfig', botValidator.updateBotValidator, async (req, res, next) => {
    try {
        const { botId, name } = req.body;
        logger.info(`Fetching Bot Config for ${name}`);
        const result = await botController.getBotConfig(botId);
        return ApiResponse.success(result).send(res);
    } catch (error) {
        logger.error(`Error in bot API route: ${error.message}`);
        next(error);
    }
});

router.delete('/deleteBot', botValidator.updateBotValidator, async (req, res, next) => {
    try {
        const { botId, name } = req.body;
        const { id } = req.user;
        logger.info(`Deleting bot ${name}`);
        const result = await botController.deleteBot(botId, id);
        return ApiResponse.success(result).send(res);
    } catch (error) {
        logger.error(`Error in bot API route: ${error.message}`);
        next(error);
    }
});

router.get('/getBots', async (req, res, next) => {
    try {
        const { username, id } = req.user;
        logger.info(`Fetching bots for ${username}`);
        const result = await botController.getBots({ userId: id, username });
        return ApiResponse.success(result).send(res);
    } catch (error) {
        logger.error(`Error in bot API route: ${error.message}`);
        next(error);
    }
});

//Later on what to do

router.post('/getBot', botValidator.getBotValidator, async (req, res, next) => {
    try {
        const { botId, botName, page = 1, limit = 10 } = req.body;
        const { username } = req.user;
        logger.info(`Fetching bot ${botName} for user: ${username}`);
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const result = await botController.getBot({ botId, botName, pageNumber, limitNumber });
        return ApiResponse.success(result).send(res);
    } catch (error) {
        logger.error(`Error in bot API route: ${error.message}`);
        next(error);
    }
});

module.exports = router;