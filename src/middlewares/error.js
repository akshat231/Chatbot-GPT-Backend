const logger = require('../utilities/logger')
const apiResponse = require('../utilities/apiResponse')


module.exports = (err, req, res, next) => {
  logger.error(`Error occurred: ${err.message}`, { stack: err.stack });
  return apiResponse.error('Internal Server Error', 500, err.message || 'Internal Server Error').send(res);
};
