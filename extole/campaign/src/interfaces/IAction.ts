import { IComponent } from "./IComponent";
import { IController } from "./IController";
import { ActionQuality } from "../enums/ActionQuality";
import { ActionType } from "../enums/ActionType";
import { JourneyNames } from "../enums/JourneyNames";
import { SendPolicy } from "../enums/SendPolicy";

export interface IAction{
    id:string;
    quality:ActionQuality;
    data?:any;
    enabled:boolean;
    components:IComponent[];
    actionType:ActionType;
}


export interface IActionSchedule extends IAction{
    actionType:ActionType.SCHEDULE;
    scheduleName:string;
    delays:number[];
    dates:string[];
    force:boolean;
}

export interface IActionEmail extends IAction{
    actionType:ActionType.EMAIL;
    zoneName:string;
}

export interface IActionApprove extends IAction {
    actionType: ActionType.APPROVE;
    legacyActionId: string | null;
    partnerEventId: string;
    eventType: string;
    force: boolean | null;
    note: string | null;
    causeType: string;
    pollingId: string | null;
    pollingName: string;
    rewardTags: string[];
    componentIds: string[];
}

export interface IActionReward extends IAction {
    rewardId: string;
}

export interface IActionData{
   actions:IAction[];
   aliases?:string[];
   data?:any;
   journeyNames?:JourneyNames[];
   sendPolicy?:SendPolicy;
   type?: string;
   controller?:IController;
}

