const { createEmbeddings } = require('../utilities/embeddings');
const { splitText } = require('../utilities/chunking');
const logger = require('../utilities/logger');
const { getSupabaseInstance } = require('../databases/supabase');

const ingestText = async ({ botId, documentId, botName, rawText }) => {
    try {
        const supabase = getSupabaseInstance();
        logger.info(`Ingesting text for ${botName}`);

        // Split the text into chunks
        const chunks = await splitText(rawText);
        logger.info(`Text split into ${chunks.length} chunks`);

        // Create embeddings for each chunk
        const embeddingsPromises = chunks.map(async (chunk) => {
            const embedding = await createEmbeddings(chunk.pageContent, 'text-embedding-3-small');
            return {
                ...chunk,
                embedding
            };
        });

        const chunksWithEmbeddings = await Promise.all(embeddingsPromises);
        logger.info(`Created embeddings for ${chunksWithEmbeddings.length} chunks`);

        const entries = chunksWithEmbeddings.map((content, i) => ({
            bot_id: botId,
            document_id: documentId,
            content: content.pageContent,
            embedding: content.embedding
        }));
        const { error } = await supabase
            .from("chunks")
            .insert(entries);
        if (error) throw new Error("Failed to insert embeddings: " + error.message);
        logger.info(`Successfully ingested ${entries.length} chunks for botId: ${botId}, documentId: ${documentId}`);
        return;
    } catch (error) {
        throw error;
    }
};


module.exports = {
    ingestText
};