const OpenAI = require('openai');
const dotenv = require('dotenv');
dotenv.config();

const CAMPAIGN_ASSISTANT_ID = "asst_MKKjRevZpimlZ7CofqYkR7dN";
const CONTROLLER_ASSISTANT_ID = "asst_8Nj5K5ntPjmg770b6LP5b36u";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_CLIENT = new OpenAI(OPENAI_API_KEY);
const PORT = 3000;

module.exports = {
    OPENAI_CLIENT,
    PORT,
    CAMPAIGN_ASSISTANT_ID,
    CONTROLLER_ASSISTANT_ID
};