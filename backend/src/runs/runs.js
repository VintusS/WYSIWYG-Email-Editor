const { getThreadById } = require('../conversations/threads');


const createThreadAndRun = async (openai, assistantId, prompt) => {
    const run = await openai.beta.threads.createAndRun(
        {
            assistant_id: assistantId,
            thread: {
                messages: [
                    {
                        role: "user", content: prompt
                    }
                ]
            }
        }
    );
    return run;
}


const runExistingThread = async (openai, assistantId, threadId) => {
    let run;
    try {
        run = await openai.beta.threads.runs.create(
            threadId,
            { assistant_id: assistantId }
        );
    } catch (e) {
        console.error("Error creating run:", e);
        return null;
    }
    const runId = run.id;
    console.log("Successfully created run with id: " + runId
        + " on thread id: " + threadId);
    let runRetrieval;
    try {
        runRetrieval = await retrieveRun(openai, threadId, runId);
    }
    catch (e) {
        console.error("Error retrieving run:", e);
        return null;
    }
    const threadMessages = await openai.beta.threads.messages.list(threadId);
    const answer = threadMessages.data[0].content[0].text.value;
    const thread = await getThreadById(threadId, openai);
    return {
        answer: answer,
        thread: thread
    };
}

const retrieveRunWithInterval = async (openai, threadId, runId, timeInterval) => {
    await new Promise(resolve => setTimeout(resolve, timeInterval));
    let runRetrieval = await openai.beta.threads.runs.retrieve(threadId, runId);
    return runRetrieval;
}

const retrieveRun = async (openai, threadId, runId, fetchInterval, errorFetchInterval, retryInterval) => {
    let runRetrieval = await openai.beta.threads.runs.retrieve(threadId, runId);

    while (runRetrieval.status !== "completed") {
        try {
            runRetrieval = await retrieveRunWithInterval(openai, threadId, runId, fetchInterval || 100);
        }
        catch (e) {
            console.error("Error retrieving run:", e);
            runRetrieval = await retrieveRunWithInterval(openai, threadId, runId, errorFetchInterval || 3000);
            console.log("Retrying polling run status for run id: " + runId
                + " on thread id: " + threadId
                + " with status: " + runRetrieval.status);
        }
        if (runRetrieval.status === "failed") {
            throw new Error("Run failed for run id: " + runId
                + " on thread id: " + threadId
                + " with error: " + runRetrieval.last_error
                + ". Retrying in " + retryInterval + " seconds.");
        }
    }
    console.log("Run completed for run id: " + runId + " on thread id: " + threadId);
    return runRetrieval;
}


module.exports = { createThreadAndRun, runExistingThread, retrieveRun };