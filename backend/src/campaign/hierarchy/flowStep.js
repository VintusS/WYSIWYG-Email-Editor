const getStepsForFlowSteps = (flowSteps, steps) => {
    let flowStepsMap = initializeFlowSteps(flowSteps);
    matchStepsToFlowSteps(steps, flowStepsMap);
    return flowStepsMap;
}

const initializeFlowSteps = (flowSteps) => {
    let map = {};
    for (const flowStep of flowSteps) {
        map[flowStep.step_name] = {
            "ADVOCATE": [],
            "FRIEND": [],
            "MARKETING": []
        }
    }
    return map;
}

const matchStepsToFlowSteps = (steps, flowSteps) => {
    const flowStepsNames = Object.keys(flowSteps);
    for (const step of steps) {
        const stepName = step.name;
        const stepAliases = step.aliases;
        const stepJourney = getStepJourney(step);
        if (flowStepsNames.includes(stepName)) {
            flowSteps[stepName][stepJourney].push(step);
        } else if (stepAliases.some(alias => flowStepsNames.includes(alias))) {
            const alias = stepAliases.find(alias => flowStepsNames.includes(alias));
            flowSteps[alias][stepJourney].push(step);
        }
    }
}

const getStepJourney = (step) => {
    return step.journey_names[0].toUpperCase();
}


module.exports = { getStepsForFlowSteps };