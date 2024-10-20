const fs = require('fs');
const path = require('path');
const { getStepsForFlowSteps } = require('./flowStep');
const { findChildren, findeChildrenForController } = require('./findChildren');
const { get } = require('http');
const { type } = require('os');

const loadData = (fileName) => {
    const filePath = path.resolve(__dirname, fileName);
    if (!fs.existsSync(filePath)) {
        console.error('File not found:', filePath);
        return;
    }
    const campaignData = fs.readFileSync(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON:', err);
            return;
        }
        return data;
    });
    return JSON.parse(campaignData);
}

const getSteps = (jsonData) => {
    return jsonData.steps;
}

const getFlowSteps = (jsonData) => {
    return jsonData.flow_steps;
}

const getFirstOrderInSequenceFlowSteps = (flowSteps) => {
    let firstOrderFlowSteps = [];
    let currentSequence = 1;
    for (const flowStep of flowSteps) {
        if (flowStep.sequence === currentSequence) {
            firstOrderFlowSteps.push(flowStep);
        } else if (flowStep.sequence > currentSequence + 1) {
            firstOrderFlowSteps.push(flowStep);
            currentSequence = flowStep.sequence;
        }
    }
    return firstOrderFlowSteps;
}

const getFrontEndSteps = (steps) => {
    return steps.filter(step => step.type === "FRONTEND_CONTROLLER");
}

const getControllerSteps = (steps) => {
    return steps.filter(step => step.type === "CONTROLLER");
}

const getStepsMatchingType = (steps, type) => {
    return steps.filter(step => step.type === type);
}

const addChildrenForJourney = (journeySteps, allSteps) => {
    for (let i = 0; i < journeySteps.length; i++) {
        const journeyStep = journeySteps[i];
        journeyStep.children = findeChildrenForController(journeyStep, allSteps);
    }
}

const stepIsFirstOrder = (step) => {
    const firstLine = ['INPUT', 'SHAREABLE', 'REFERRED', 'REFERRED_BY_EVENT'];
    if (step.triggers) {
        for (const trigger of step.triggers) {
            if (trigger.trigger_phase === "MATCHING" && firstLine.indexOf(trigger.event_type) > -1) {
                return true;
            }
        }
    }
    return false;
}

const assignFirstOrderSteps = (steps) => {
    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        step.isFirstOrder = stepIsFirstOrder(step);
    }
    return steps;
}

const hierarchy = (campaignData, firstInSequenceOnly, frontEndStepsUsage) => {


    const ADVOCATE_JOURNEY = 'ADVOCATE';
    const FRIEND_JOURNEY = 'FRIEND';
    const MARKETING = 'MARKETING';

    const JOURNEYS = [ADVOCATE_JOURNEY, FRIEND_JOURNEY, MARKETING];

    const steps = assignFirstOrderSteps(getSteps(campaignData));
    const controllerSteps = getStepsMatchingType(steps, 'CONTROLLER');
    const frontEndSteps = getStepsMatchingType(steps, 'FRONTEND_CONTROLLER');

    const flowSteps = getFlowSteps(campaignData);
    const firstOrderFlowSteps = getFirstOrderInSequenceFlowSteps(flowSteps);
    let flowStepsToUse = firstInSequenceOnly
        ? firstOrderFlowSteps
        : flowSteps;


    let stepsToUse;

    if (frontEndStepsUsage === 'only') {
        stepsToUse = frontEndSteps;
    } else if (frontEndStepsUsage === 'include') {
        stepsToUse = frontEndSteps.concat(controllerSteps);
    } else {
        stepsToUse = controllerSteps;
    }


    const stepsForFlowSteps = getStepsForFlowSteps(flowStepsToUse, stepsToUse);

    const flowStepNames = Object.keys(stepsForFlowSteps);
    for (let i = 0; i < flowStepNames.length; i++) {
        const flowStepName = flowStepNames[i];

        for (let j = 0; j < JOURNEYS.length; j++) {
            const journey = JOURNEYS[j];
            const journeySteps = stepsForFlowSteps[flowStepName][journey];
            addChildrenForJourney(journeySteps, steps);
        }
    }

    let answer = [];
    for (let i = 0; i < flowStepNames.length; i++) {
        const flowStepName = flowStepNames[i];
        const answerObject={
            "name": flowStepName,
            "ADVOCATE": stepsForFlowSteps[flowStepName][ADVOCATE_JOURNEY],
            "FRIEND": stepsForFlowSteps[flowStepName][FRIEND_JOURNEY],
            "MARKETING": stepsForFlowSteps[flowStepName][MARKETING]
        }
        answer.push(answerObject);
    }

    return answer;
}

module.exports = { hierarchy };
