const OpenAI  = require('openai');
const logger = require('../logger');
require('dotenv').config();
const config = require('config');

const createEmbeddings = async (text, model) => {
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPEN_AI_API_KEY || config.get('openai.apiKey'),
        });
        logger.info(`Creating embeddings for text with model: ${model}`);
        if (!text || typeof text !== 'string') {
            throw new Error('Invalid input text for embeddings');
        }
        const embeddings = await openai.embeddings.create({
            model,
            input: text
        });
        return embeddings.data[0].embedding;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createEmbeddings
}