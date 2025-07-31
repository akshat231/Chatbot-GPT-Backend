const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const logger = require('../utilities/logger')

const router = express();

// Middlewares
router.use(cors(config.get('cors')));
router.use(helmet());
router.use(morgan('combined', {
  stream: {
    write: (message) => logger.http(message.trim())  
  }
}));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

module.exports = router;