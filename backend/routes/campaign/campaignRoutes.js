const path = require('path');
const express = require('express');
const fs = require('fs');
const { OPENAI_CLIENT } = require('../../global');
const { initializeCampaignConversation } = require('../../src/campaign/initialize');
const { hierarchy } = require('../../src/campaign/hierarchy/hierarchy');

const router = express.Router();

router.post('/', async (req, res) => {
    let campaignData;
    if (req.body === undefined || req.body['campaignData'] === undefined) {
        try {
            const filePath = path.join(__dirname, '../../res/testData.json');
            const campaignJson = fs.readFileSync(filePath);
            campaignData = JSON.parse(campaignJson);
        } catch (e) {
            console.error(e);
            return res.status(500).send('Error reading test data file');
        }
    } else {
        campaignData = req.body.campaignData;
    }
    let result;
    try {
        result = await initializeCampaignConversation(campaignData, OPENAI_CLIENT);
    } catch (e) {
        console.error(e);
        return res.status(500).send('Error initializing campaign');
    }
    return res.status(200).send(result);
});


router.get('/:campaignId/hierarchy', (req, res) => {
    let campaignData;
    const url = "https://my.extole.com/api/v2/campaigns/" + req.params.campaignId + "/built";
    const authorization = req.headers.authorization;
    if (authorization === undefined) {
        return res.status(403).send('Missing authorization header');
    }
    const options = {
        headers: {
            'Authorization': authorization
        }
    };
    const firstInSequenceOnly = req.query['first-in-sequence-only'] === 'true';
    const frontEndStepsUsage = req.query['front-end-steps']

    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            campaignData = data;
            return hierarchy(campaignData, firstInSequenceOnly, frontEndStepsUsage);
        })
        .then(result => res.send(result))
        .catch(err => {
            console.error(err);
            res.status(500).send('Error initializing campaign');
        });
});


router.get('/hierarchy', (req, res) => {
    let campaignData;
    if (req.body === undefined || req.body['campaignData'] === undefined) {
        try {
            const filePath = path.join(__dirname, '../../res/testData.json');
            const campaignJson = fs.readFileSync(filePath);
            campaignData = JSON.parse(campaignJson);
        } catch (e) {
            console.error(e);
            return res.status(500).send('Error reading test data file');
        }
    } else {
        campaignData = req.body.campaignData;
    }
    let result;
    try {
        result = hierarchy(campaignData);
    } catch (e) {
        console.error(e);
        return res.status(500).send('Error getting campaign hierarchy');
    }
    return res.status(200).send(result);
});


router.get('/:campaignId', (req, res) => {
    const url = "https://my.extole.com/api/v2/campaigns/" + req.params.campaignId + "/built"
    const authorization = req.headers.authorization;
    const options = {
        headers: {
            'Authorization': authorization
        }
    };
    fetch(url, options)
        .then(response => response.json())
        .then(data => res.send(data))
        .catch(err => {
            console.error(err);
            res.status(500).send('Error fetching campaign data');
        });
});

router.post('/:campaignId', (req, res) => {
    let campaignData;
    const url = "https://my.extole.com/api/v2/campaigns/" + req.params.campaignId + "/built"
    const authorization = req.headers.authorization;
    const options = {
        headers: {
            'Authorization': authorization
        }
    };
    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            campaignData = data;
            return initializeCampaignConversation(campaignData, OPENAI_CLIENT);
        })
        .then(result => res.send(result))
        .catch(err => {
            console.error(err);
            res.status(500).send('Error initializing campaign');
        });
});





module.exports = router;
