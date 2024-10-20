import { IAction,IActionEmail,IActionApprove,IActionSchedule,IActionReward } from "../IAction";
import { ActionType } from "../enums/ActionType";

export class ActionFactory{
    static createAction(action:IAction):IAction{
        switch(action.actionType){
            case ActionType.EMAIL:
                return <IActionEmail>action;
            case ActionType.APPROVE:
                return <IActionApprove>action;
            case ActionType.SCHEDULE:
                return <IActionSchedule>action;
            case ActionType.REWARD:
                return <IActionReward>action;
            default:
                return action;
        }
    }
}

