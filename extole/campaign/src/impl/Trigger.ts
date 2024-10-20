import { IComponent } from "../IComponent";
import { IEvent } from "../IEvent";
import { ITrigger } from "../ITrigger";

export class Trigger implements ITrigger {
    id: string;
    phase: string;
    name: string;
    description?: string;
    enabled: boolean;
    negated: boolean;
    invertMappingState?: boolean;
    events?: IEvent[];
    triggerType: string;
    components?: IComponent[];
    constructor(trigger: ITrigger) {
        this.id = trigger.id;
        this.phase = trigger.phase;
        this.name = trigger.name;
        this.description = trigger.description;
        this.enabled = trigger.enabled;
        this.negated = trigger.negated;
        this.invertMappingState = trigger.invertMappingState;
        this.events = trigger.events;
        this.triggerType = trigger.triggerType;
        this.components = trigger.components;
    }
}