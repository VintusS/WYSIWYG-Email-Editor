const { getStepProperties } = require('./rules');
const { controllerTriggerFilter } = require('./triggerFilter');

const findChildren = (steps) => {
    for (const step of steps) {
        const children = findeChildrenForController(step, steps);
        step.children = children;
        // console.log(children);
    }
    return steps;
}

const findeChildrenForController = (step, steps) => {
    let children = [];
    const properties = getStepProperties(step);
    const propertyNames = Object.keys(properties);
    for (const propertyName of propertyNames) {
        // console.log("Checking property: " + propertyName);
        const propertyValue = properties[propertyName];
        for (const otherStep of steps) {
            if (step.name === otherStep.name) {
                continue;
            }
            // console.log("Checking other step: " + otherStep.name);
            const otherStepTriggers = otherStep.triggers;
            for (const trigger of otherStepTriggers) {
                if (controllerTriggerFilter(trigger, propertyValue, propertyName)) {
                    children.push(otherStep.name);
                }
            }
        }
    }
    return children;
}

module.exports = { findChildren, findeChildrenForController };