const logger = require('../utilities/logger');
const { getSupabaseInstance } = require('../databases/supabase');

const deleteDoc = async ({ botId, docId }) => {
    try {
        const supabase = getSupabaseInstance();
        const { error } = await supabase
            .from('documents')
            .delete()
            .eq('bot_id', botId)
            .eq('id', docId);

        if (error) {
            logger.error(`Error deleting document with ID: ${docId} for botId: ${botId} - ${error.message}`);
            throw new Error(error.message);
        }

        logger.info(`Deleted document with ID: ${docId} for botId: ${botId}`);
        return;
    } catch (error) {
        logger.error(`Error in deleteDoc: ${error.message}`);
        throw error;
    }
};

module.exports = {
    deleteDoc
};