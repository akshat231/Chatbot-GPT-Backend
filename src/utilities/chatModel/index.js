const config = require('config');
const logger = require('../logger');
const { initChatModel } = require('langchain/chat_models/universal');

const initializeChatModel = async (modelName, modelProvider, apiKey, temperature) => {
    try {
        logger.info('Initializing chat model');
        const model = await initChatModel(modelName, {
            modelProvider,
            temperature,
            apiKey
        });
        return model;
    } catch (error) {
        throw error;
    }
};

module.exports = initializeChatModel