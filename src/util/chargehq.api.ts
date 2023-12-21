import axios from 'axios';
import { SiteMeterPush } from '../model/site-meter.model';

export interface ChargeHQResponseExtended {
    success: boolean
    message: string
}

export class ChargeHQAPI {

    constructor(private url: string, private apiKey: string) {

    }

    // https://chargehq.net/kb/push-api
    async sendRequest(payload: SiteMeterPush): Promise<ChargeHQResponseExtended>{
        payload.apiKey = this.apiKey;
        try {
            const { data } = await axios.post(this.url + '/push-solar-data', payload);

            return data;
        } catch (err) {
            return {
                success: false,
                message: err as string
            }
        }
    }
}