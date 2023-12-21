import { APIError, AcPower, AuthState, CommissioningState, ConnectionState, CountryAndRule, DcPower, GridVoltageAndCurrent, InverterInfo, InverterStatus, Language, LogData, LogValue, NetworkInfo, StateHash, StringVoltageAndCurrent, TimeConfig, YieldStatus } from "../model/bosch.model";

import axios from 'axios';

export class BoschAPI {

    constructor(private ipAddress: string) {
        
    }

    private async callPVIGetRequest<T>(rName: string): Promise<T> {
        const { data } = await axios.get('http://' + this.ipAddress + '/pvi', {
            params: {
                "rName": rName
            }
        });
        return data as T;
    }

    private async callPVIGetRequestWithPayload<T>(rName: string, payload:any): Promise<T> {
        console.log('Payload: ', payload);
        const { data } = await axios.get('http://' + this.ipAddress + '/pvi', {
            params: {
                "rName": rName
            },
            "data": payload
        });
        return data as T;
    }

    async getYieldStatus(): Promise<YieldStatus> {
        return this.callPVIGetRequest<YieldStatus>('YieldStatus');
    }

    async getStateHash(): Promise<StateHash> {
        return this.callPVIGetRequest<StateHash>('StateHash');
    }

    async getAuthState(): Promise<AuthState> {
        return this.callPVIGetRequest<AuthState>('AuthState');
    }

    async getTimeConfig(): Promise<TimeConfig> {
        return this.callPVIGetRequest<TimeConfig>('TimeConfig');
    }

    async getLanguage(): Promise<Language> {
        return this.callPVIGetRequest<Language>('Language');
    }

    async getInverterInfo(): Promise<InverterInfo> {
        return this.callPVIGetRequest<InverterInfo>('InverterInfo');
    }

    async getCommissioningState(): Promise<CommissioningState> {
        return this.callPVIGetRequest<CommissioningState>('CommissioningState');
    }

    async getInverterStatus(): Promise<InverterStatus> {
        return this.callPVIGetRequest<InverterStatus>('InverterStatus');
    }

    async getNetworkInfo(): Promise<NetworkInfo> {
        return this.callPVIGetRequest<NetworkInfo>('NetworkInfo');
    }

    async getDcPower(): Promise<DcPower> {
        return this.callPVIGetRequest<DcPower>('DcPower');
    }

    async getAcPower(): Promise<AcPower> {
        return this.callPVIGetRequest<AcPower>('AcPower');
    }

    async getConnectionState(): Promise<ConnectionState> {
        return this.callPVIGetRequest<ConnectionState>('ConnectionState');
    }

    async getStringVoltageAndCurrent(): Promise<StringVoltageAndCurrent> {
        return this.callPVIGetRequest<StringVoltageAndCurrent>('StringVoltageAndCurrent');
    }

    async getGridVoltageAndCurrent(): Promise<GridVoltageAndCurrent> {
        return this.callPVIGetRequest<GridVoltageAndCurrent>('GridVoltageAndCurrent');
    }

    async getCountryAndRule(): Promise<CountryAndRule> {
        return this.callPVIGetRequest<CountryAndRule>('CountryAndRule');
    }

    // Gets with payload
    async getLogAcPower(startDate: number, endDate: number): Promise<LogData> {
        const startVal = startDate / 1000;
        const endVal = endDate / 1000;
        console.log('Start: ', startVal);
        console.log('End: ', endVal);
        return this.callPVIGetRequestWithPayload<LogData>('LogAcPower', {
            "timestampBegin": startVal,
            "timestampEnd": endVal,
            "resolution": 0
        });
    }
}