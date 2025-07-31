const queryResolvePrompt = `
You are a helpful AI assistant.

Answer the question below using ONLY the following context:

Context:
"""
{CONTEXT}

"""

Question: {QUESTION}
`

module.exports = queryResolvePrompt;