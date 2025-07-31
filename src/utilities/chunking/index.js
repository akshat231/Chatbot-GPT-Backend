const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const logger = require('../logger');


const splitText = async (text, chunkSize = 800, chunkOverlap = 200) => {
    try {
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize,
            chunkOverlap
        });
        const chunks = await textSplitter.createDocuments([text]);
        logger.info(`Text split into ${chunks.length} chunks with size ${chunkSize} and overlap ${chunkOverlap}`);
        return chunks;
    } catch (error) {
        logger.error(`Error splitting text: ${error.message}`);
        throw error;
        
    }
};

module.exports = {
    splitText   
};