const logger = require('../utilities/logger');
const { getSupabaseInstance } = require('../databases/supabase');

const deletePendingUsers = async (deleteDate) => {
    try {
        const supabase = getSupabaseInstance();
        logger.info('Deleting all pending users of last 60 minutes');
        const { error } = await supabase
            .from('email_verifications')
            .delete()
            .lte('created_at', deleteDate);

        if (error) {
            logger.error(`Error in deleting pending users ${error}`);
            throw error;
        }
        return;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    deletePendingUsers
};
