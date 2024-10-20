const { createThreadAndRun, retrieveRun } = require('../runs/runs');

const promptAboutIterable = async (iterableData, assistantId, openaiClient, batchSize) => {
    const promises = [];
    batchSize = batchSize || 10;
    console.log("Starting initialization of campaign with " + iterableData.length + " steps"
        + " and batch size of " + batchSize);

    for (let i = 0; i < iterableData.length; i += batchSize) {
        const batch = iterableData.slice(i, i + batchSize);
        const prompt = JSON.stringify(batch);
        promises.push(promptAndRunOnNewThread(prompt, assistantId, openaiClient));
        console.log("Prompted for batch " + i + " to " + (i + batchSize));

        if ((i + batchSize) % 20 === 0) {
            console.log("Waiting for 2 seconds before next batch");
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        console.log("Continuing to next batch. Remaining: " + (iterableData.length - i - batchSize));
    }
    
    const results = await Promise.all(promises);
    
    const answers = results.map(result => result.answer);

    return answers;
};


const promptAndRunOnNewThread = async (prompt, assistantId, openai, retryInterval) => {
    let run;
    try {
        run = await createThreadAndRun(openai, assistantId, prompt);
    } catch (e) {
        console.error("Error creating and running thread:", e);
        await new Promise(resolve => setTimeout(resolve, retryInterval || 5000));
        return promptAndRunOnNewThread(prompt, assistantId, openai);
    }

    const runId = run.id;
    const threadId = run.thread_id;
    console.log("Successfully created run with id: " + runId
        + " on thread id: " + threadId);
    let runRetrieval;
    try {
        runRetrieval = await retrieveRun(openai, threadId, runId);
    } catch (e) {
        console.error("Error retrieving run:", e);
        await new Promise(resolve => setTimeout(resolve, retryInterval || 5000));
        return promptAndRunOnNewThread(prompt, assistantId, openai);
    }
    const threadMessages = await openai.beta.threads.messages.list(threadId);
    const answer = threadMessages.data[0].content[0].text.value;
    const thread = await openai.beta.threads.retrieve(threadId);
    return {
        answer: answer,
        thread: thread
    };
}



module.exports = {
    promptAboutIterable,
    promptAndRunOnNewThread
};