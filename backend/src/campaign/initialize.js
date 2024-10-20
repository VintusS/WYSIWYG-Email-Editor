const { promptAboutIterable, promptAndRunOnNewThread } = require('../shared/prompts');
const { OPENAI_CLIENT, CAMPAIGN_ASSISTANT_ID, CONTROLLER_ASSISTANT_ID } = require('../../global');

const initializeCampaignConversation = async (campaignData, openaiClient) => {
    console.log("Initializing campaign conversation");
    const steps = campaignData['steps'];
    const stepsAnswers = await promptAboutIterable(steps, CONTROLLER_ASSISTANT_ID, openaiClient);
    console.log("Done prompting for steps");
    let stepsPrompt = "This are explanations of all steps/controllers in this campaign. Give me a summary and logic of the campaign and the flow of it.\n";
    for (let i = 0; i < stepsAnswers.length; i++) {
        stepsPrompt += stepsAnswers[i] + "\n";
    }
    console.log("Prompting for campaign summary and logic");
    let campaignResponse = await promptAndRunOnNewThread(stepsPrompt, CAMPAIGN_ASSISTANT_ID, openaiClient);
    return campaignResponse;
}

module.exports = { initializeCampaignConversation };