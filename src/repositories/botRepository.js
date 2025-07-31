const logger = require('../utilities/logger');
const { getSupabaseInstance } = require('../databases/supabase');
const tus = require('tus-js-client')
const config = require('config');
require('dotenv').config();


const getBotConfig = async (botId) => {
    try {
        const supabase = getSupabaseInstance();
        logger.info(`Fetching bot configuration for botId: ${botId}`);
        const { data, error } = await supabase
            .from('bot_config')
            .select('model_name, model_provider, api_key, temperature')
            .eq('bot_id', botId)
            .single();
        if (error) {
            logger.error(`Error fetching bot config: ${error.message}`);
            throw error;
        }
        logger.info(`Successfully fetched bot config for botId: ${botId}`);
        return data;
    } catch (error) {
        throw error;
    }
};

const getTopKResults = async (botId, queryEmbedding, limit = 10) => {
    try {
        const supabase = getSupabaseInstance();
        logger.info(`Fetching top ${limit} results`);
        const { data, error } = await supabase
            .rpc('get_similar_chunks', {
                bot_id_id: botId,
                query_embedding: queryEmbedding,
                limit_val: limit
            });
        if (error) {
            logger.error(`Error fetching top K results: ${error.message}`);
            throw new Error(`Failed to fetch top K results: ${error.message}`);
        }
        return data;
    } catch (error) {
        throw error;

    }
};


const updateQueryLogs = async (botId, query, queryResult, topKResults) => {
    try {
        const supabase = getSupabaseInstance();
        logger.info(`Updating query logs for botId: ${botId}`);
        const { error } = await supabase
            .from('query_logs')
            .insert({
                bot_id: botId,
                question: query,
                answer: queryResult,
                matched_chunk_ids: topKResults.map(result => result.id),
                created_at: new Date().toISOString()
            });

        if (error) {
            logger.error(`Error updating query logs: ${error.message}`);
            throw new Error(`Failed to update query logs: ${error.message}`);
        }

        logger.info(`Successfully updated query logs for botId: ${botId}`);
        return;
    } catch (error) {
        throw error;
    }
};


const addDocumentToCollection = async (botId, name, source) => {
    try {
        const supabase = getSupabaseInstance();
        const { data, error } = await supabase
            .from('documents')
            .insert({
                bot_id: botId,
                name,
                source,
                created_at: new Date().toISOString()
            })
            .select('id')
            .single()
        if (error) {
            logger.error(`Error adding document to collection: ${error.message}`);
            throw new Error(`Failed to add document to collection: ${error.message}`);
        }
        logger.info('Successfully added document to collection');
        return data.id;
    } catch (error) {
        throw error;
    }
};

const uploadFile = async (file, filePath) => {
    try {
        const supabase = getSupabaseInstance();
        const { data: { session } } = await supabase.auth.getSession();
        const projectId = process.env.SUPABASE_PROJECT_ID || config.get('database.supabase.projectId');
        const bucketName = process.env.SUPABASE_DOCUMENT_UPLOAD_BUCKET || config.get('database.supabase.documentStorageBucket');
        return new Promise((resolve, reject) => {
            var upload = new tus.Upload(file, {
                endpoint: `https://${projectId}.supabase.co/storage/v1/upload/resumable`,
                retryDelays: [0, 3000, 5000, 10000, 20000],
                headers: {
                    authorization: `Bearer ${session.access_token}`,
                    'x-upsert': 'false', // optionally set upsert to true to overwrite existing files
                },
                uploadDataDuringCreation: true,
                removeFingerprintOnSuccess: true, // Important if you want to allow re-uploading the same file https://github.com/tus/tus-js-client/blob/main/docs/api.md#removefingerprintonsuccess
                metadata: {
                    bucketName,
                    objectName: filePath,
                    contentType: mimetype,
                    cacheControl: 3600,
                },
                chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
                onError: function (error) {
                    logger.error('Failed because: ' + error)
                    reject(error)
                },
                onProgress: function (bytesUploaded, bytesTotal) {
                    var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
                    logger.info(bytesUploaded, bytesTotal, percentage + '%')
                },
                onSuccess: function () {
                    logger.info('Download %s from %s', upload.file.name, upload.url)
                    resolve()
                },
            })
            // Check if there are any previous uploads to continue.
            return upload.findPreviousUploads().then(function (previousUploads) {
                // Found previous uploads so we select the first one.
                if (previousUploads.length) {
                    upload.resumeFromPreviousUpload(previousUploads[0])
                }
                // Start the upload
                upload.start()
            })
        })
    } catch (error) {
        throw error;
    }
};

const createBot = async (name, userId) => {
    try {
        const supabase = getSupabaseInstance();
        const { data, error } = await supabase
            .from('bots')
            .insert({
                user_id: userId,
                name,
                created_at: new Date().toISOString()
            })
            .select()
            .single();
        if (error) {
            logger.error(`Error creating bot: ${error.message}`);
            throw new Error(`Failed to create bot: ${error.message}`);
        }
        return data;
    } catch (error) {
        throw error;
    }
};

const updateBot = async (bot) => {
    try {
        const supabase = getSupabaseInstance();
        const { error } = await supabase
            .from('bots')
            .update({ name: bot.botName })
            .eq('id', bot.botId)
            .eq('user_id', bot.userId)
        if (error) {
            logger.error(`Error updating bot: ${error.message}`);
            throw new Error(`Failed to update bot: ${error.message}`);
        }
        return;
    } catch (error) {
        throw error;
    }
};

const deleteBot = async (botId, userId) => {
    try {
        const supabase = getSupabaseInstance();
        const { error } = await supabase
            .from('bots')
            .delete()
            .eq('id', botId)
            .eq('user_id', userId);
        if (error) {
            logger.error(`Error deleting bot: ${error.message}`);
            throw new Error(`Failed to delete bot: ${error.message}`);
        }
        return;
    } catch (error) {
        throw error;
    }
};

const getBots = async (userId) => {
    try {
        const supabase = getSupabaseInstance();
        logger.info(`Fetching bots for userId: ${userId}`);
        const { data, error } = await supabase
            .from('bots')
            .select('id, name')
            .eq('user_id', userId);

        if (error) {
            logger.error(`Error fetching bots: ${error.message}`);
            throw new Error(`Failed to fetch bots: ${error.message}`);
        }
        return data;
    } catch (error) {
        throw error;
    }
};

const getBotDocuments = async (botId, page, limit) => {
    try {
        const supabase = getSupabaseInstance();
        logger.info(`Fetching bot with ID: ${botId}`);
        const offset = (page - 1) * limit;
        const { data, error } = await supabase
            .from('documents')
            .select('*')
            .eq('bot_id', botId)
            .range(offset, offset + 10 - 1);
        if (error) {
            logger.error(`Error fetching bot: ${error.message}`);
            throw new Error(`Failed to fetch bot: ${error.message}`);
        }
        logger.info(`Successfully fetched bot with ID: ${botId}`);
        return data;
    } catch (error) {
        throw error;
    }
};


const setDefaultBotConfig = async (botId) => {
    try {
        const modelName = config.get('llm.openai.modelName');
        const modelProvider = config.get('llm.openai.modelProvider');
        const apiKey = process.env.OPEN_AI_API_KEY || config.get('llm.openai.apiKey');
        const temperature = config.get('llm.openai.temperature');
        const supabase = getSupabaseInstance();
        const { error } = await supabase
            .from('bot_config')
            .insert({
                bot_id: botId,
                model_name: modelName,
                model_provider: modelProvider,
                api_key: apiKey,
                temperature: temperature
            })
        if (error) {
            logger.error(`Error storing default bot config: ${error.message}`);
            throw new Error(`Failed to store bot config: ${error.message}`);
        }
    } catch (error) {
        throw error;
    }
};


const updateBotConfig = async (botConfig) => {
    try {
        const supabase = getSupabaseInstance();
        const { error } = await supabase
            .from('bot_config')
            .update({
                model_name: botConfig.modelName,
                model_provider: botConfig.modelProvider,
                api_key: botConfig.apiKey,
                temperature: botConfig.temperature,
                created_at: new Date()
            })
            .eq('bot_id', botConfig.botId);
        if (error) {
            logger.error(`Error updating bot config: ${error.message}`);
            throw new Error(`Failed to update bot config: ${error.message}`);
        }
        return;
    } catch (error) {
        throw error
    }
};


module.exports = {
    getBotConfig,
    getTopKResults,
    updateQueryLogs,
    addDocumentToCollection,
    uploadFile,
    createBot,
    updateBot,
    deleteBot,
    getBots,
    getBotDocuments,
    setDefaultBotConfig,
    updateBotConfig
};