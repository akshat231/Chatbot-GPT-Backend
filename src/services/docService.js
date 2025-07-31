const logger = require('../utilities/logger');
const docRepository = require('../repositories/docRepository');


const deleteDoc = async ({ botId, docId }) => {
    try {
        const result = await docRepository.deleteDoc({ botId, docId });
        logger.info(`Deleted document with ID: ${docId} for botId: ${botId}`);
       return { message: 'Document deleted successfully', data: {} };
    } catch (error) {
        logger.error(`Error deleting document with ID: ${docId} for botId: ${botId} - ${error.message}`);
        throw error;
    }
};

module.exports = {
    deleteDoc
};