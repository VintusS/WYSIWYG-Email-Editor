const path = require('path');
const express = require('express');
const fs = require('fs');
const { OPENAI_CLIENT } = require('../../global');
const { initializeCampaignConversation } = require('../../src/campaign/initialize');
const { createCampaign } = require('../../src/campaign/createCampaign');
const { validateCampaignData } = require('../../src/campaign/validateCampaignData');

const router = express.Router();

// POST /create
router.post('/create', async (req, res) => {
    let campaignData;
    if (req.body === undefined || req.body['campaignData'] === undefined) {
        try {
            const filePath = path.join(__dirname, '../../res/defaultCampaignData.json');
            const campaignJson = fs.readFileSync(filePath);
            campaignData = JSON.parse(campaignJson);
        } catch (e) {
            console.error(e);
            return res.status(500).send('Error reading campaign data file');
        }
    } else {
        campaignData = req.body.campaignData;
    }

    let validationResult;
    try {
        validationResult = validateCampaignData(campaignData);
        if (!validationResult.isValid) {
            return res.status(400).send(validationResult.errors);
        }
    } catch (e) {
        console.error(e);
        return res.status(500).send('Error validating campaign data');
    }

    let result;
    try {
        result = await createCampaign(campaignData, OPENAI_CLIENT);
    } catch (e) {
        console.error(e);
        return res.status(500).send('Error creating campaign');
    }

    return res.status(201).send(result);
});

// GET /campaign/:campaignId
router.get('/:campaignId', (req, res) => {
    const campaignId = req.params.campaignId;
    const url = `https://my.extole.com/api/v2/campaigns/${campaignId}/details`;
    const authorization = req.headers.authorization;

    if (authorization === undefined) {
        return res.status(403).send('Missing authorization header');
    }

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
            res.status(500).send('Error fetching campaign details');
        });
});

// PUT /campaign/:campaignId
router.put('/:campaignId', (req, res) => {
    const campaignId = req.params.campaignId;
    const url = `https://my.extole.com/api/v2/campaigns/${campaignId}/update`;
    const authorization = req.headers.authorization;

    if (authorization === undefined) {
        return res.status(403).send('Missing authorization header');
    }

    const options = {
        method: 'PUT',
        headers: {
            'Authorization': authorization,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    };

    fetch(url, options)
        .then(response => response.json())
        .then(data => res.send(data))
        .catch(err => {
            console.error(err);
            res.status(500).send('Error updating campaign');
        });
});

// DELETE /campaign/:campaignId
router.delete('/:campaignId', (req, res) => {
    const campaignId = req.params.campaignId;
    const url = `https://my.extole.com/api/v2/campaigns/${campaignId}/delete`;
    const authorization = req.headers.authorization;

    if (authorization === undefined) {
        return res.status(403).send('Missing authorization header');
    }

    const options = {
        method: 'DELETE',
        headers: {
            'Authorization': authorization
        }
    };

    fetch(url, options)
        .then(response => response.json())
        .then(data => res.send(data))
        .catch(err => {
            console.error(err);
            res.status(500).send('Error deleting campaign');
        });
});

// PATCH /campaign/:campaignId
router.patch('/:campaignId', (req, res) => {
    const campaignId = req.params.campaignId;
    const url = `https://my.extole.com/api/v2/campaigns/${campaignId}/partial-update`;
    const authorization = req.headers.authorization;

    if (authorization === undefined) {
        return res.status(403).send('Missing authorization header');
    }

    const options = {
        method: 'PATCH',
        headers: {
            'Authorization': authorization,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    };

    fetch(url, options)
        .then(response => response.json())
        .then(data => res.send(data))
        .catch(err => {
            console.error(err);
            res.status(500).send('Error performing partial update on campaign');
        });
});

module.exports = router;
