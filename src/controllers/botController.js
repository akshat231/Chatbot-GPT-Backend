const logger = require('../utilities/logger');
const botService = require('../services/botService');

const vectorSearch = async (botId, query) => {
    try {
        logger.info(`Performing vector search for botId: ${botId} with query: "${query}"`);
        const results = await botService.vectorSearch({ botId, query });
        logger.info(`Vector search completed for botId: ${botId}. Found ${results.length} results.`);
        return { message: 'Query processed successfully', data: results };
    } catch (error) {
        throw error;

    }
};

const addContent = async (botId, name, sources, botName) => {
    try {
        const { rawText = [], urls = [], files = [] } = sources;

        for (const raw of rawText) {
            await addRawTextContent(botId, name, botName, raw);
        }

        for (const url of urls) {
            await addUrlContent(botId, name, botName, url);
        }

        for (const file of files) {
            await addFileContent(botId, name, botName, file);
        }
        return { message: 'Document Added Successfully', data: { name } }
    } catch (error) {
        throw error;
    }
};

const addRawTextContent = async (botId, name, botName, rawText) => {
    try {
        logger.info(`Adding raw text content for  ${botName}, name: ${name}`);
        const result = await botService.addRawTextContent({ botId, name, botName, rawText });
        logger.info(`Raw text content added successfully for ${botName}, name: ${name}`);
        return result;
    } catch (error) {
        throw error;

    }
};

const addUrlContent = async (botId, name, botName, urls) => {
    try {
        logger.info(`Adding URL content for: ${botName}, name: ${name}`);
        const result = await botService.addUrlContent({ botId, name, botName, urls });
        logger.info(`URL content added successfully for: ${botName}, name: ${name}`);
        return result;
    } catch (error) {
        throw error;
    }
};


const addFileContent = async (botId, name, botName, file) => {
    try {
        logger.info(`Adding file content for: ${botName}, name: ${name}`);
        const result = await botService.addFileContent({ botId, name, botName, file });
        logger.info(`File content added successfully for ${botName}, name: ${name}`);
        return result;
    } catch (error) {
        throw error;
    }
};

const createBot = async (bot) => {
    try {
        const result = await botService.createBot(bot.botName, bot.userId);
        logger.info(`Bot created successfully`);
        return result;
    } catch (error) {
        throw error;
    }
};

const updateBot = async (bot) => {
    try {
        const result = await botService.updateBot(bot);
        logger.info(`Bot updated successfully`);
        return result;
    } catch (error) {
        throw error;
    }
};

const deleteBot = async (botId, userId) => {
    try {
        const result = await botService.deleteBot(botId, userId);
        return result;
    } catch (error) {
        throw error;
    }
};

const getBots = async (user) => {
    try {
        const result = await botService.getBots(user.userId);
        logger.info(`Fetched ${result.length} bots for username: ${user.username}`);
        return result;
    } catch (error) {
        throw error;
    }
};

const getBot = async (bot) => {
    try {
        const result = await botService.getBot(bot);
        logger.info(`Fetched bot`);
        return result;
    } catch (error) {
        throw error;
    }
};

const updateBotConfig = async (botConfig) => {
    try {
        const result = await botService.updateBotConfig(botConfig);
        logger.info(`bot config of bot ${botConfig.botName} updated`);
        return result;
    } catch (error) {
        throw error;
    }
};


const getBotConfig = async (botId) => {
    try {
        const result = await botService.getBotConfig(botId);
        logger.info(`Fetched bot config`);
        return result;
    } catch (error) {
        throw error;
    }
};


module.exports = {
    vectorSearch,
    addContent,
    createBot,
    updateBot,
    deleteBot,
    getBots,
    getBot,
    updateBotConfig,
    getBotConfig
};