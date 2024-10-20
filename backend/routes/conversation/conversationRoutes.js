const express = require('express');
const { OPENAI_CLIENT } = require('../../global');
const { getThreadById } = require('../../src/conversations/threads');
const messagesRoutes = require('./messages/messagesRoutes');

const router = express.Router();

router.get('/:threadId', async (req, res) => {
    const threadId = req.params.threadId;

    if (!threadId) {
        return res.status(400).send('threadId is required');
    }

    try {
        const thread = await getThreadById(threadId, OPENAI_CLIENT);
        return res.send(thread);
    } catch (e) {
        if (e.status === 404) {
            return res.status(404).send('Thread not found');
        }
        return res.status(500).send('Error getting thread');
    }
});

// Nested route for messages
router.use('/:threadId/messages', (req, res, next) => {
    req.threadId = req.params.threadId;
    next();
}, messagesRoutes);

module.exports = router;
