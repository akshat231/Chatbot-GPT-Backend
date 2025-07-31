const logger = require('./utilities/logger');
const bodyParser = require('body-parser');
const config = require('config').get('server');
const { initializeServices } = require('./startup');
const middleware = require('./middlewares');
const apiRouter = require('./routes');
const errorHandler = require('./middlewares/error')
const cors = require('cors');
require('dotenv').config();
const cronService = require('./services/cronService');




const allowedOrigins = [
  process.env.REQUEST_ORIGIN || '*'
];

const allowedMethods = config.get('cors.methods')
const allowedHeaders = config.get('cors.allowedHeaders');

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: allowedMethods,
  allowedHeaders: allowedHeaders
};



const createApp = async () => {
  logger.info('Starting App');
  const { app } = await initializeServices({
    supabase: true
  })
  app.use(cors(corsOptions));
  app.use(middleware);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/api', apiRouter);
  app.use(errorHandler);



const server = app.listen(
  process.env.PORT || config.get('port'),
  process.env.HOST || 'localhost',
  () => {
    logger.info(`Server running on http://${process.env.HOST || 'localhost'}:${process.env.PORT || config.get('port')}`);
  }
);

};

createApp().catch((err) => {logger.error(`Error while starting app: ${err}`)
  process.exit(1);
});
