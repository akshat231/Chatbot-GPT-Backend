const logger = require('../utilities/logger');
const { initializeMongo } = require('../databases/mongo');
const { initializeSupabase } = require('../databases/supabase');
const app = require('express')();

const initializeServices = async (options) => {
    const response = {};
    logger.info('Initializing services');
    // if (options && options.mongo) {
    //     logger.info('Initializing MongoDB service');
    //     await initializeMongo();
    // }

    if (options && options.supabase) {
        logger.info('Initializing Supabase service');
        await initializeSupabase();
    }

    response.app = app;
    logger.info('BoilerPlate Initialized')
    return response;
}

module.exports = {
    initializeServices
}