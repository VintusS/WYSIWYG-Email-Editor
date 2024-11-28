function triggerMatches(trigger, triggerType, eventType, triggerPhase, eventNamesInclude) {
    return (!triggerType || trigger.trigger_type === triggerType)
        && (!eventType || trigger.event_type === eventType)
        && (!triggerPhase || trigger.trigger_phase === triggerPhase)
        && (!eventNamesInclude || trigger.event_names.includes(eventNamesInclude));
}

const hasCommonElements = (arr1, arr2) => {
    if (!arr1 || !arr2) return false;
    let answer = false;
    try{
        answer = arr1.some(item => arr2.includes(item));
    } catch(e){
        console.log("Array 1: " + arr1);
        console.log("Array 2: " + JSON.stringify(arr2));
        throw e;
    }
    return answer;
};


const triggerMatchesStep = (trigger, step) => {
    return (step
        && triggerMatches(trigger, "EVENT", "STEP", "MATCHING")
        && hasCommonElements(trigger.event_names, step))
}

const triggerMatchesEmail = (trigger, email) => {
    return (email
        && triggerMatches(trigger, "EVENT", "MESSAGE", "MATCHING", email))
}

const triggerMatchesSchedule = (trigger, schedule) => {
    return (schedule
        && triggerMatches(trigger, "EVENT", "SCHEDULED", "MATCHING", schedule))
}

const triggerMatchesFAP = (trigger, fap) => {
    return (fap
        && triggerMatches(trigger, "EVENT", "INTERNAL", "MATCHING", fap))
}

const triggerMatchesIsMaxmind = (trigger, isMaxmind) => {
    return (isMaxmind
        && triggerMatches(trigger, "DATA_INTELLIGENCE_EVENT", null, "MATCHING", isMaxmind))
}

const triggerMatchesRewardName = (trigger, rewardName) => {
    return (rewardName
        && triggerMatches(trigger, "REWARD_EVENT", null, "MATCHING", rewardName))
}

const triggerMatchesRewardSlot = (trigger, rewardSlot) => {
    return (rewardSlot
        && triggerMatches(trigger, "REWARD_EVENT", null, "MATCHING", rewardSlot))
}

const triggerMatchesFriendDefaultReward = (trigger, friendDefaultReward) => {
    return (friendDefaultReward
        && triggerMatches(trigger, "EVENT", "MESSAGE", "MATCHING", friendDefaultReward))
}

const triggerMatchesAdvocateDefaultReward = (trigger, advocateDefaultReward) => {
    return (advocateDefaultReward
        && triggerMatches(trigger, "EVENT", "MESSAGE", "MATCHING", advocateDefaultReward))
}

const triggerMatchesShare = (trigger, share) => {
    return (share
        && trigger.trigger_phase === "MATCHING"
        && (trigger.event_type === share
            || trigger.trigger_name === share
            && trigger.trigger_type === share
            || trigger.trigger_name === "SCORE"
            && trigger.trigger_type === "SCORE"
            && trigger.cause_event_name === "extole.share"))
}

const triggerMatchesFriendDefaultRewardLegacy = (trigger, friendDefaultRewardLegacy) => {
    return (friendDefaultRewardLegacy
        && triggerMatches(trigger, "EVENT", "MESSAGE", "MATCHING", friendDefaultRewardLegacy))
}

const triggerMatchesAdvocateDefaultRewardLegacy = (trigger, advocateDefaultRewardLegacy) => {
    return (advocateDefaultRewardLegacy
        && triggerMatches(trigger, "EVENT", "MESSAGE", "MATCHING", advocateDefaultRewardLegacy))
}

const triggerMatchesLegacy = (trigger, legacy) => {
    const legacyTypes = ['PURCHASE', 'REGISTER', 'PROMOTE', 'CLICK'];
    return (legacy
        && triggerMatches(trigger, "EVENT", "MESSAGE", "MATCHING", legacy)
        && legacyTypes.includes(legacy))
}

const triggerFilter = (trigger, controller, filterFunction) => {
    return filterFunction(trigger, controller);
}


const controllerTriggerFilter = (trigger, currentPropertyValue, currentPropertyName) => {
    const filters = {
        step: triggerMatchesStep,
        email: triggerMatchesEmail,
        schedule: triggerMatchesSchedule,
        fap: triggerMatchesFAP,
        maxmind: triggerMatchesIsMaxmind,
        rewardName: triggerMatchesRewardName,
        rewardSlot: triggerMatchesRewardSlot,
        friendDefaultReward: triggerMatchesFriendDefaultReward,
        advocateDefaultReward: triggerMatchesAdvocateDefaultReward,
        share: triggerMatchesShare,
        friendDefaultRewardLegacy: triggerMatchesFriendDefaultRewardLegacy,
        advocateDefaultRewardLegacy: triggerMatchesAdvocateDefaultRewardLegacy,
        legacy: triggerMatchesLegacy
    };
    let answer = false;
    try{
        answer = triggerFilter(trigger, currentPropertyValue, filters[currentPropertyName]);
    }
    catch(e){
        // console.error("Error checking filter: ", e);
        console.log(currentPropertyName);
        console.log(filters[currentPropertyName]);
        throw e;
    }
    return answer;
}

module.exports = {
    controllerTriggerFilter
};
