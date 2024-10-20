const express = require('express');
const { OPENAI_CLIENT } = require('../../../global');
const { getMessagesInThread, addMessageToThread } = require('../../../src/messages/messages');
const router = express.Router();

router.get('/', async (req, res) => {
    if (!req.threadId) {
        return res.status(400).send('threadId is required');
    }
    const threadId = req.threadId;
    let messages;
    try {
        messages = await getMessagesInThread(threadId, OPENAI_CLIENT);
    } catch (e) {
        if (e.status === 404) {
            console.log(e);
            return res.status(404).send('Thread not found');
        }
        return res.status(500).send('Error getting thread messages');
    }
    return res.send(messages);
});

router.post('/', async (req, res) => {
    if (!req.threadId) {
        return res.status(400).send('threadId is required');
    }
    if (!req.body || !req.body['message']) {
        return res.status(400).send('message is required in the request body');
    }
    const threadId = req.threadId;
    const message = req.body['message'];
    let messages;
    try {
        messages = await addMessageToThread(threadId, message, OPENAI_CLIENT);
    } catch (e) {
        console.log(e);
        return res.status(500).send('Error adding message to thread');
    }
    return res.status(200).send({ success: true, messages: messages });
});


module.exports = router;