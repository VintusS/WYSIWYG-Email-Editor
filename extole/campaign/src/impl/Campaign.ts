import { ICampaign } from "../ICampaign";
import { IStep } from "../IStep";
import { CampaignState } from "../enums/CampaignState";

export class Campaign implements ICampaign {
    id: string;
    name: string;
    description: string;
    updatedDate: string;
    startDate: string;
    state: CampaignState;
    steps: IStep[];
    constructor(data:any){
        this.id = data.campaign_id
        this.name = data.name
        this.description = data.description
        this.updatedDate = data.updated_date
        this.startDate = data.start_date
        this.state = data.state
        this.steps = data.steps
    }
}

