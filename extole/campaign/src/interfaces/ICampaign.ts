import {IStep} from './IStep';
import { CampaignState } from './enums/CampaignState';

export interface ICampaign{
    id:string;
    name:string;
    description:string;
    updatedDate:string;
    startDate:string;
    state:CampaignState;
    steps:IStep[];   
}
