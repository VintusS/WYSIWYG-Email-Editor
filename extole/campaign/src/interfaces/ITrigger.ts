import {IEvent} from './IEvent.ts';
import {IComponent} from './IComponent.ts';

export interface ITrigger{
    id:string;
    phase:string;
    name:string;
    description?:string;
    enabled:boolean;
    negated:boolean;
    invertMappingState?:boolean;
    events?:IEvent[];
    triggerType:string;
    components?:IComponent[];
}

