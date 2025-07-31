const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()
const config = require('config').get('database').get('supabase');
const logger = require('../../utilities/logger');

let supabaseInstance = null;



const initializeSupabase = async () => {
    try {
        const supabaseUrl = process.env.SUPABASE_URL || config.get('url');
        logger.info(`Connecting to Supabase at ${supabaseUrl}`);
        const anonKey = process.env.SUPABASE_ANON_KEY || config.get('anonKey');
        supabaseInstance = createClient(supabaseUrl, anonKey);
        logger.info('Supabase connection established successfully');
        return ;
    } catch (error) {
        logger.error(`Failed to connect to Supabase: ${error.message}`);
        throw error;
    }
};

const getSupabaseInstance = () => {
    if (!supabaseInstance) {
        throw new Error('Supabase not initialized. Call initializeSupabase() first.');
    }
    return supabaseInstance;
};

module.exports = {
    initializeSupabase,
    getSupabaseInstance
};