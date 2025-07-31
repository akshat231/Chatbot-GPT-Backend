const { CronJob } = require('cron');
const config = require('config');
const logger = require('../utilities/logger');
const cronRepository = require('../repositories/cronRepository');


const deletePendingUsers = async () => {
    try {
        new CronJob(
            '0 * * * *', async () => {
                let deleteDate = new Date();
                deleteDate = new Date(deleteDate.getTime() - 6 * 60 * 60 * 1000);
                await cronRepository.deletePendingUsers(deleteDate)
                logger.info('Deleted all pending users in last 60 minutes')
            },
            null,
            true,
            'Asia/Kolkata'
        );
    } catch (error) {
        logger.error(`Error in deleting pending users from DB ${error}`);
        throw error;
    }
};

module.exports = {
    deletePendingUsers
}