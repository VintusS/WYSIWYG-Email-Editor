const fs = require('fs');
const { controllerTriggerFilter } = require('../triggerFilter');

let isStep, isEmail, isSchedule, idMaxmind, isFAP, isRewardName, isRewardSlot, isShare, isFriendDefaultReward, isAdvocateDefaultReward, isLegacy, isFriendDefaultRewardLegacy, isAdvocateDefaultRewardLegacy, jsonData, jsonDataAll;
const legacyTypes = ['PURCHASE', 'REGISTER', 'PROMOTE', 'CLICK'];

function loadChain() {
    fs.readFile('./example.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON:', err);
            return;
        }
        jsonDataAll = JSON.parse(data);
        jsonData = jsonDataAll.steps;

        const transformedData = [];
        const firstLine = ['INPUT', 'SHAREABLE', 'REFERRED', 'REFERRED_BY_EVENT'];

        for (const rewardRule of jsonDataAll.incentive.reward_rules) {
            if (rewardRule && rewardRule.reward_slots) {
                isFriendDefaultRewardLegacy = rewardRule.reward_slots.find(slot => slot.indexOf('FRIEND_') === 0) ? "friend_earned_reward_email" : "";
                isAdvocateDefaultRewardLegacy = rewardRule.reward_slots.find(slot => slot.indexOf('ADVOCATE_') === 0) ? "advocate_earned_reward_email" : "";
            }
        }

        const controllers = jsonData.filter(controller => controller.type === "CONTROLLER");

        for (const controller of controllers) {
            if (controller.triggers) {
                for (const trigger of controller.triggers) {
                    if (trigger.trigger_phase === "MATCHING" && firstLine.indexOf(trigger.event_type) > -1) {
                        const hierarchy = buildHierarchy(controller.name, trigger.event_names);
                        if (hierarchy) {
                            transformedData.push(hierarchy);
                        }
                    }
                }
            }
        }

        fs.writeFile('output_hierarchy.json', JSON.stringify(transformedData, null, 2), (err) => {
            if (err) {
                console.error('Error writing JSON:', err);
                return;
            }
            console.log('Saved data in output_hierarchy_with_triggers.json');
        });
    });
}

function buildHierarchy(controllerName, eventName) {
    const controller = jsonData.find(controller => controller.name === controllerName);
    if (!controller) return null;



    const controllers = jsonData.filter(function (control) {
        return control.triggers.find(controllerTriggerFilter)
    });

    var hierarchy = {}
    if (controllers.length > 0) {
        hierarchy = {
            [controllerName]: {
                childs: controllers.map(controll => buildHierarchy(controll.name, eventName))
            },
            id: controller.controller_id,
            eventName: eventName
        };
    } else {
        hierarchy = {
            [controllerName]: {
                childs: {}
            },
            id: controller.controller_id,
            eventName: eventName
        };
    }
    return hierarchy;
}

loadChain();