const { CallbackHandler } =  require("langfuse-langchain");
const config = require ('config');
require('dotenv').config();
 
// Initialize Langfuse callback handler
const langfuseHandler = new CallbackHandler({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY || config.get('langfuse.publicKey'),
  secretKey: process.env.LANGFUSE_SECRET_KEY|| config.get('langfuse.secretKey'),
  baseUrl: process.env.LANGFUSE_BASE_URL || config.get('langfuse.baseUrl')
});

module.exports = langfuseHandler;