import { ITrigger } from './ITrigger';
import { CampaignState } from './enums/CampaignState';
import { StepSelector } from './enums/StepSelector';
import { IAction } from './IAction';

export interface IStep{
    id:string;
    name:string;
    enabled:boolean;
    aliases: string[];
    triggers:ITrigger[];
    actions: IAction[]
    enabledOnStates?:CampaignState[];
    selectors?:StepSelector[];
}
