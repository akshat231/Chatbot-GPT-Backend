const logger = require('../utilities/logger');
const { createEmbeddings } = require('../utilities/embeddings');
const botRepository = require('../repositories/botRepository');
const aiService = require('./aiService');
const { ingestText } = require('../repositories/ingestText');
const cheerio = require('cheerio');
const axios = require('axios');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');



const vectorSearch = async ({ botId, query }) => {
    try {
        const getBotConfig = await botRepository.getBotConfig(botId);
        if (!getBotConfig) {
            logger.error(`Bot config not found for botId: ${botId}`);
            return { message: 'Bot config not found', data: {}, statusCode: 404 };
        }
        const queryEmbedding = await createEmbeddings(query, 'text-embedding-3-small');
        const { model_name: modelName, model_provider: modelProvider, api_key: apiKey, temperature } = getBotConfig;
        logger.info(`Performing vector search for query: "${query}"`);
        const topKResults = await botRepository.getTopKResults(botId, queryEmbedding);
        logger.info(`Vector search completed. Found ${topKResults.length} results.`);
        if (topKResults.length === 0) {
            logger.info(`No results found for query: "${query}"`);
            return { message: 'No Relevant result found', data: {}, statusCode: 404 };
        }
        const queryResult = await aiService.queryAnswer(topKResults, query, modelName, modelProvider, apiKey, temperature);
        await botRepository.updateQueryLogs(botId, query, queryResult, topKResults)
        return { message: 'Query is answered', data: { queryResult } };
    } catch (error) {
        throw error;

    }
};

const addRawTextContent = async ({ botId, name, botName, rawText }) => {
    try {
        const documentId = await botRepository.addDocumentToCollection(botId, name, 'uploaded');
        await ingestText({ botId, documentId, botName, rawText })
        logger.info(`Raw text content added successfully for botId: ${botId}, name: ${name}`);
        return;
    } catch (error) {
        throw error;

    }
};

const addUrlContent = async ({ botId, name, botName, url }) => {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const rawText = $('body').text();
        const documentId = await botRepository.addDocumentToCollection(botId, name, url);
        await ingestText({ botId, documentId, botName, rawText });
        logger.info(`URL content added successfully for ${botName}, name: ${name}`);
        return;
    } catch (error) {
        throw error;
    }
};


const addFileContent = async ({ botId, name, botName, file }) => {
    try {
        const documentId = await botRepository.addDocumentToCollection(botId, name, file);
        let ext = '';
        if (file.toLowerCase().endsWith(".pdf")) {
            logger.info('This is a PDF file');
            ext = 'pdf';
        }
        else if (file.toLowerCase().endsWith(".txt")) {
            logger.info('This is a TXT file');
            ext = 'txt';
        } else if (file.toLowerCase().endsWith(".docx")) {
            logger.info('This is a DOCX file');
            ext = 'docx';
        } else {
            throw new Error(`Unsupported file type: ${file}`);
        }
        const response = await axios.get(file, { responseType: 'arraybuffer' });
        const data = response.data;
        if (ext === 'pdf') {
            const pdf = await pdfParse(data);
            await ingestText({ botId, documentId, rawText: pdf.text });
        } else if (ext === 'txt') {
            await ingestText({ botId, documentId, rawText: data.toString('utf-8') });
        } else if (ext === 'docx') {
            const result = await mammoth.extractRawText({ buffer: data });
            await ingestText({ botId, documentId, botName, rawText: result.value });
        } else {
            throw new Error(`Unsupported file extension: ${ext}`);
        }
        return;
    } catch (error) {
        throw error;
    }
};

const createBot = async (name, userId) => {
    try {
        const bot = await botRepository.createBot(name, userId);
        const botId = bot.id;
        await botRepository.setDefaultBotConfig(botId)
        return { message: 'Bot Created Successfully', data: { name: name } };
    } catch (error) {
        throw error;
    }
};

const updateBot = async (bot) => {
    try {
        await botRepository.updateBot(bot);
        return { message: 'Bot is updated successfully', data: { botName: bot.botName } };
    } catch (error) {
        throw error;
    }
};

const deleteBot = async (botId, userId) => {
    try {
        await botRepository.deleteBot(botId, userId);
        return { message: 'Bot deleted successfully', data: {} };
    } catch (error) {
        throw error;
    }
};

const getBots = async (userId) => {
    try {
        const userBots = await botRepository.getBots(userId);
        const botData = userBots.map((element) => {
            return {
                botId: element.id,
                botName: element.name
            }
        });
        return { message: 'Bots retrieved successfully', data: { bots: botData } }
    } catch (error) {
        throw error;
    }
};

const getBot = async (bot) => {
    try {
        const getBotDocuments = await botRepository.getBotDocuments(bot.botId, bot.pageNumber, bot.limitNumber);
        const documentData = getBotDocuments.map((element) => {
            return {
                documentId: element.id,
                name: element.name,
                source: element.source
            }
        });
        return { message: 'Bot retrieved successfully', data: { documentData, page: bot.pageNumber, limit: bot.limitNumber } };
    } catch (error) {
        throw error;
    }
};


const updateBotConfig = async (botConfig) => {
    try {
        // ADD LOGIC TO VALIDATE API KEY :TODO
        await botRepository.updateBotConfig(botConfig);
        return { message: 'Bot updated', data: { botName: botConfig.botName } };
    } catch (error) {
        throw error;
    }
};

const getBotConfig = async (botId) => {
    try {
        const botConfig = await botRepository.getBotConfig(botId);
        if (!botConfig) {
            return { message: 'Bot config not found', data: {}, statusCode: 404 };
        }
        return { message: 'Bot config retrieved successfully', data: { botConfig } };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    vectorSearch,
    addRawTextContent,
    addUrlContent,
    addFileContent,
    createBot,
    updateBot,
    deleteBot,
    getBots,
    getBot,
    updateBotConfig,
    getBotConfig
}