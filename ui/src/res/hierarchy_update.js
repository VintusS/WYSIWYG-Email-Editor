const fs = require('fs');

let isStep, isEmail, isSchedule, idMaxmind, isFAP, isRewardName, isRewardSlot, isShare, isFriendDefaultReward, isAdvocateDefaultReward, isLegacy, isFriendDefaultRewardLegacy, isAdvocateDefaultRewardLegacy, jsonData, jsonDataAll;
const legacyTypes = ['PURCHASE', 'REGISTER', 'PROMOTE', 'CLICK'];

function loadChain() {
    fs.readFile('./example.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Eroare la citirea fișierului JSON:', err);
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

        // Salvăm ierarhia într-un fișier JSON
        fs.writeFile('output_hierarchy.json', JSON.stringify(transformedData, null, 2), (err) => {
            if (err) {
                console.error('Eroare la scrierea fișierului JSON:', err);
                return;
            }
            console.log('Datele au fost salvate cu succes în output_hierarchy_with_triggers.json');
        });
    });
}

function buildHierarchy(controllerName, eventName) {
    const controller = jsonData.find(controller => controller.name === controllerName);
    if (!controller) return null;

    isStep = [controller.name]
    controller.aliases.forEach(alias => isStep.push(alias));
    isEmail = controller.actions && controller.actions.find(action => action.action_type == "EMAIL") ? controller.actions.find(action => action.action_type == "EMAIL").zone_name : "";
    isSchedule = controller.actions && controller.actions.find(action => action.action_type == "SCHEDULE") ? controller.actions.find(action => action.action_type == "SCHEDULE").schedule_name : "";
    isSchedule = isSchedule && controller.triggers.find(trigg => trigg.trigger_type == "EVENT" && trigg.event_type == "SCHEDULED" && trigg.trigger_phase == "MATCHING" && trigg.event_names.toString().indexOf(isSchedule) > -1) ? "" : isSchedule;
    isFAP = controller.actions && controller.actions.find(action => action.action_type == "FIRE_AS_PERSON") ? controller.actions.find(action => action.action_type == "FIRE_AS_PERSON").event_name : "";
    isRewardName = controller.actions && controller.actions.find(action => action.action_type == "EARN_REWARD") ? controller.actions.find(action => action.action_type == "EARN_REWARD").reward_name : "";
    isRewardSlot = controller.actions && controller.actions.find(action => action.action_type == "EARN_REWARD") ? controller.actions.find(action => action.action_type == "EARN_REWARD").tags[0] : "";
    isFriendDefaultReward = isRewardSlot && isRewardSlot.indexOf('FRIEND_') == 0 ? "friend_earned_reward_email": "";
    isAdvocateDefaultReward = isRewardSlot && isRewardSlot.indexOf('ADVOCATE_') == 0 ? "advocate_earned_reward_email": "";
    isShare = controller.actions && controller.actions.find(action => action.action_type == "SHARE_EVENT") ? "SHARE" : "";
    idMaxmind = controller.actions && controller.actions.find(action => action.action_type == "DATA_INTELLIGENCE") ? controller.actions.find(action => action.action_type == "DATA_INTELLIGENCE").event_name : "";
    isLegacy = controller.actions && controller.actions.find(action => action.action_type == "INCENTIVIZE") ? controller.actions.find(action => action.action_type == "INCENTIVIZE").incentivize_action_type : "";

    const controllers = jsonData.filter(function(control){
        return control.triggers.find(controllerFriggerFilter)
    });
    
    var hierarchy = {}
        if (controllers.length > 0){
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
    
function controllerFriggerFilter(trigger) {
    if (isStep && trigger.trigger_type === "EVENT" && trigger.event_type === "STEP" && trigger.trigger_phase === "MATCHING" && findCommonElements(trigger.event_names, isStep)) {
        return true;
    }
    else if (isEmail && trigger.trigger_type === "EVENT" && trigger.event_type === "MESSAGE" && trigger.trigger_phase === "MATCHING" && trigger.event_names.includes(isEmail)) {
        return true;
    }
    else if (isSchedule && trigger.trigger_type === "EVENT" && trigger.event_type === "SCHEDULED" && trigger.trigger_phase === "MATCHING" && trigger.event_names.includes(isSchedule)) {
        return true;
    }
    else if (isFAP && trigger.trigger_type === "EVENT" && trigger.event_type === "INTERNAL" && trigger.trigger_phase === "MATCHING" && trigger.event_names.includes(isFAP)) {
        return true;
    }
    else if (idMaxmind && trigger.trigger_type === "DATA_INTELLIGENCE_EVENT" && trigger.trigger_phase === "MATCHING" && trigger.event_name === idMaxmind) {
        return true;
    }
    else if (isRewardName && trigger.trigger_type === "REWARD_EVENT" && trigger.trigger_phase === "MATCHING" && trigger.event_names.includes(isRewardName)) {
        return true;
    }
    else if (isRewardSlot && trigger.trigger_type === "REWARD_EVENT" && trigger.trigger_phase === "MATCHING" && trigger.tags.includes(isRewardSlot)) {
        return true;
    }
    else if (isFriendDefaultReward && trigger.event_type === "MESSAGE" && trigger.trigger_phase === "MATCHING" && trigger.event_names.includes(isFriendDefaultReward)) {
        return true;
    }
    else if (isAdvocateDefaultReward && trigger.event_type === "MESSAGE" && trigger.trigger_phase === "MATCHING" && trigger.event_names.includes(isAdvocateDefaultReward)) {
        return true;
    }
    else if (isShare && trigger.trigger_phase === "MATCHING" && (trigger.event_type === isShare || trigger.trigger_name === isShare)) {
        return true;
    }
    else if (isFriendDefaultRewardLegacy && isLegacy && legacyTypes.includes(isLegacy) && trigger.event_type === "MESSAGE" && trigger.trigger_phase === "MATCHING" && trigger.event_names.includes(isFriendDefaultRewardLegacy)) {
        return true;
    }
    else if (isAdvocateDefaultRewardLegacy && isLegacy && legacyTypes.includes(isLegacy) && trigger.event_type === "MESSAGE" && trigger.trigger_phase === "MATCHING" && trigger.event_names.includes(isAdvocateDefaultRewardLegacy)) {
        return true;
    }
    return false;
}

function findCommonElements(arr1, arr2) {
    return arr1.some(item => arr2.includes(item));
}

loadChain();