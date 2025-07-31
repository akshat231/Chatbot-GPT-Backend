const logger = require('./utilities/logger');
const bodyParser = require('body-parser');
const config = require('config').get('server');
const { initializeServices } = require('./startup');
const middleware = require('./middlewares');
const apiRouter = require('./routes');
const errorHandler = require('./middlewares/error')
require('dotenv').config();
const cronService = require('./services/cronService');

const createApp = async () => {
  logger.info('Starting App');
  const { app } = await initializeServices({
    mongo: false,
    supabase: true
  })
  app.use(middleware);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/api', apiRouter);
  app.use(errorHandler);
  const server = app.listen(process.env.PORT || config.get('port'), ()=> {
    logger.info(`Server running on port ${process.env.PORT || config.get('port')}`);
  })
};

createApp().catch((err) => {logger.error(`Error while starting app: ${err}`)
  process.exit(1);
});
