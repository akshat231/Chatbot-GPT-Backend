const logger = require('../utilities/logger');
const docService = require('../services/docService');


const deleteDoc = async (botId, docId) => {
    try {
        const result = await docService.deleteDoc({ botId, docId });
         return result;
    } catch (error) {
        logger.error(`Error deleting document with ID: ${docId} for botId: ${botId} - ${error.message}`);
        throw error;
    }
};

module.exports = {
    deleteDoc
};