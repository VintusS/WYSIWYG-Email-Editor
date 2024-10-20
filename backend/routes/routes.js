const express = require('express');
const campaignRoutes = require('./campaign/campaignRoutes');
const conversationRoutes = require('./conversation/conversationRoutes');

const router = express.Router();
router.use('/campaign', campaignRoutes);
router.use('/conversation', conversationRoutes);

module.exports = router;