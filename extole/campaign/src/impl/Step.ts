import type { IStep } from '../IStep';
import type { IAction } from '../IAction';
import type { ITrigger } from '../ITrigger';
import type { CampaignState } from '../enums/CampaignState';
import type { StepSelector } from '../enums/StepSelector';
import { Trigger } from './Trigger'; 
import { ActionFactory } from './Action';


export class Step implements IStep {
    id: string;
    name: string;
    enabled: boolean;
    aliases: string[];
    triggers: ITrigger[];
    actions: IAction[];
    enabledOnStates?: CampaignState[];
    selectors?: StepSelector[];

    constructor(step: IStep) {
        this.id = step.id;
        this.name = step.name;
        this.enabled = step.enabled;
        this.aliases = step.aliases;
        this.triggers = this.initializeTriggers(step);
        this.actions = this.initializeActions(step);
        this.enabledOnStates = step.enabledOnStates;
        this.selectors = step.selectors;
    }

    initializeActions(step: IStep): IAction[] {
        return step.actions.map((action: any) => ActionFactory.createAction(action));
    }

    initializeTriggers(step: IStep): ITrigger[] {
        return step.triggers.map((trigger: any) => new Trigger(trigger));
    }
}
