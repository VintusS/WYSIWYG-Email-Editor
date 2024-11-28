const getThreadById = async (threadId, openaiClient) => {
    const thread = await openaiClient.beta.threads.retrieve(threadId);
    return thread;
}

module.exports = { getThreadById };