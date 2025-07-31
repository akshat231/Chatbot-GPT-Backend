const z = require('zod');

const queryResolveSchema = z.object({
    answer: z.string()
})

module.exports = {
    queryResolveSchema
};