const stepName = (step) => {
    return [step.name];
}

const stepAliases = (step, stepNames) => {
    let names = stepNames;
    for (let i = 0; i < step.aliases.length; i++) {
        names.push(step.aliases[i]);
    }
    return names;
}

const emailName = (actions) => {
    const emailAction = actions.find(action => action.action_type == "EMAIL");
    return emailAction
        ? emailAction.zone_name
        : false;
}

const scheduleName = (actions, controller) => {
    const scheduleAction = actions.find(action => action.action_type == "SCHEDULE");

    let isSchedule = scheduleAction
        ? scheduleAction.schedule_name
        : false;

    isSchedule = (isSchedule
        && controller.triggers.find(trigg =>
            trigg.trigger_type == "EVENT"
            && trigg.event_type == "SCHEDULED"
            && trigg.trigger_phase == "MATCHING"
            && trigg.event_names.toString().indexOf(isSchedule) > -1))
        ? false
        : isSchedule;
    return isSchedule;
}


const isFireAsPerson = (actions) => {
    const fapAction = actions.find(action => action.action_type == "FIRE_AS_PERSON");
    return fapAction
        ? fapAction.event_name
        : false;
}


const rewardName = (actions) => {
    const rewardAction = actions.find(action => action.action_type == "EARN_REWARD");
    return rewardAction
        ? rewardAction.reward_name
        : false;
}

const rewardSlot = (actions) => {
    const rewardAction = actions.find(action => action.action_type == "EARN_REWARD");
    return rewardAction
        ? rewardAction.tags[0]
        : false;
}

const friendDefaultReward = (rewardSlot) => {
    return rewardSlot && rewardSlot.indexOf('FRIEND_') == 0
        ? "friend_earned_reward_email"
        : false;
}

const advocateDefaultReward = (rewardSlot) => {
    return rewardSlot && rewardSlot.indexOf('ADVOCATE_') == 0
        ? "advocate_earned_reward_email"
        : false;
}

const isShare = (actions) => {
    return actions.find(action => action.action_type == "SHARE_EVENT")
        ? "SHARE"
        : false;
}

const isMaxmind = (actions) => {
    const maxmindAction = actions.find(action => action.action_type == "DATA_INTELLIGENCE");
    return maxmindAction
        ? maxmindAction.event_name
        : false;
}

const isLegacy = (actions) => {
    const legacyAction = actions.find(action => action.action_type == "INCENTIVIZE");
    return legacyAction
        ? legacyAction.incentivize_action_type
        : false;
}

const friendDefaultRewardLegacy = (rewardSlot) => {
    return rewardSlot && rewardSlot.indexOf('FRIEND_') == 0
        ? "friend_earned_reward_email"
        : false;
}

const advocateDefaultRewardLegacy = (rewardSlot) => {
    return rewardSlot && rewardSlot.indexOf('ADVOCATE_') == 0
        ? "advocate_earned_reward_email"
        : false;
}

const getStepProperties = (step) => {
    return {
        step: stepAliases(step, stepName(step)),
        email: emailName(step.actions),
        schedule: scheduleName(step.actions, step),
        fap: isFireAsPerson(step.actions),
        rewardName: rewardName(step.actions),
        rewardSlot: rewardSlot(step.actions),
        friendDefaultReward: friendDefaultReward(rewardSlot(step.actions)),
        friendDefaultRewardLegacy: friendDefaultRewardLegacy(rewardSlot(step.actions)),
        advocateDefaultReward: advocateDefaultReward(rewardSlot(step.actions)),
        advocateDefaultRewardLegacy: advocateDefaultRewardLegacy(rewardSlot(step.actions)),
        share: isShare(step.actions),
        maxmind: isMaxmind(step.actions),
        legacy: isLegacy(step.actions)
    }
}


module.exports = { getStepProperties }