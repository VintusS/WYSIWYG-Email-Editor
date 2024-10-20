const { getThreadById } = require('../conversations/threads');
const { runExistingThread } = require('../runs/runs');
const { CAMPAIGN_ASSISTANT_ID } = require('../../global');

class Message {
    constructor(role, content) {
        this.role = role;
        this.content = content;
    }
}


const getMessagesInThread = async (threadId, openaiClient) => {
    const messages = await openaiClient.beta.threads.messages.list(threadId);
    const messagesData = messages.body.data;
    let messagesContent = [];
    for (let i = 0; i < messagesData.length; i++) {
        messagesContent.push(new Message(messagesData[i].role, messagesData[i].content[0].text.value));
    }
    return messagesContent.reverse();
}


const addMessageToThread = async (threadId, message, openaiClient) => {
    const newMessage = await openaiClient.beta.threads.messages.create(threadId, {
        role: 'user',
        content: message
    });
    await runExistingThread(openaiClient, CAMPAIGN_ASSISTANT_ID, threadId);
    const messages = await getMessagesInThread(threadId, openaiClient);
    return messages;
}

module.exports = { getMessagesInThread, addMessageToThread };