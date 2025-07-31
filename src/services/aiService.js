const logger = require('../utilities/logger');
const langfuseHandler = require('../utilities/langfuse');
const { PromptTemplate } = require("@langchain/core/prompts");
const initializeChatModel= require('../utilities/chatModel')
const prompts = require('../prompts');
const outputSchemas = require('../outputSchema');


const modelInvoke = async (prompt, chatModel, inputObject = {}, outputSchema = {}) => {
    try {
        const promptTemplate = new PromptTemplate({
            template: prompt,
            inputVariables: Object.keys(inputObject),
        });
        const fullPrompt = await promptTemplate.format(inputObject);
        logger.info(`Invoking model with prompt: ${fullPrompt}`);
        logger.info("modelInvoke::service");
        const modelResponse = await chatModel.withStructuredOutput(outputSchema).invoke(
            fullPrompt,
            {
                callbacks: [langfuseHandler],
            }
        );
        logger.info('Model response:', { modelResponse });
        return modelResponse;
    } catch (error) {
        throw error;
    }
};


const queryAnswer = async (results, query, modelName, modelProvider, apiKey, temperature) => {
    try {
        logger.info(`Formulazing Answer using TopK Results`);
        const chatModel = await initializeChatModel(modelName, modelProvider, apiKey, temperature);
        logger.info(`Chat model initialized: ${modelName} from ${modelProvider}`);
        const promptInput = {
            QUESTION: query,
            CONTEXT: results.map((result) => result.content).join('\n\n')
        };
        const response = await modelInvoke(prompts.queryResolvePrompt, chatModel, promptInput, outputSchemas.queryResolveSchema);
        return response.answer;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    queryAnswer
};