const mongoose = require('mongoose');
const config = require('config').get('database').get('mongo');
const logger = require('../../utilities/logger');

const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: 'admin'
};

if (config.get('username') && config.get('password')) {
    connectionOptions.auth = {
        user: config.get('username'),
        password: config.get('password')
    };
}

const initializeMongo = async () => {
    try {
        await mongoose.connect(config.get('url'), connectionOptions);
        logger.info('Connected to MongoDB');
    } catch (error) {
        logger.error(`Failed to connect to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

process.on('SIGINT', async () => {
    await mongoose.disconnect();
    logger.info('MongoDB connection closed');
    process.exit(0);
});

module.exports = {
    initializeMongo
};