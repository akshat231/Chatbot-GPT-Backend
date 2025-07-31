const express = require("express");
const router = express.Router();
const config = require("config");
const logger = require("../utilities/logger");
const ApiResponse = require("../utilities/apiResponse");
const docValidator = require("../validators/docValidator");
const docController = require("../controllers/docController");

router.delete('/deleteDoc', docValidator.deleteDocValidator, async (req, res, next) => {
    try {
        const { botId, docId, botName, docName } = req.body;
        logger.info(`Deleting document: ${docName} for bot ${botName}`);
        const result = await docController.deleteDoc(botId, docId);
        return ApiResponse.success(result).send(res);
    } catch (error) {
        logger.error(`Error in doc API route: ${error.message}`);
        next(error);
    }
});

module.exports = router;