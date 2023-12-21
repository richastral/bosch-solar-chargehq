// bosch Inverter Models

export interface StateHash {
    stateHash: number
}

export interface AuthState {
    userLevel: number
    passwd: string
    sessionId: number
    authRetAck: number
    authRetCode: number
}

export interface TimeConfig {
    enableNtp: boolean
    utcOffset: number
    utcTimestamp: number
    activeDST: boolean
    ntpServer1: string
    ntpServer2: string
    ntpServer3: string
}

export interface Language {
    language: string
}

export interface InverterInfo {
    deviceName: string
    serialNumber: string
    model: string
    nominalPower: number
    numberOfStringInputs: number
    firmware: string
}

export interface CommissioningState {
    mode: number
    step1: boolean
    step2: boolean
    step3: boolean
    step4: boolean
    step5: boolean
    step6: boolean
}

export interface InverterStatus {
    workMode: number
    remoteReduction: number
    hasInfo: boolean
    hasError: boolean
    hasWarning: boolean
}

export interface NetworkInfo {
    macAddress: string
    ipAddress: string
    subnetMask: string
    gateway: string
    dns1: string
    dns2: string
    dhcpActive: string
}

export interface DcPower {
    powerA: number
    powerB: number
    powerC: number
    powerD: number
}

export interface AcPower {
    status: number
    target: number
    powerL1: number
    powerL2: number
    powerL3: number
}

export interface YieldStatus {
    yieldDaily: number
    yieldTotal: number
    yieldYearly: number
}

export interface ConnectionState {
    internetConnection: boolean
    numberExtSensor: number
    gridControlLight: boolean
    numberOfInverters: number
}

export interface StringVoltageAndCurrent {
    uStringA: number
    iStringA: number
    uStringB: number
    iStringB: number
    uStringC: number
    iStringC: number
    uStringD: number
    iStringD: number
}

export interface GridVoltageAndCurrent {
    iGridL1: number
    uGridL1: number
    iGridL2: number
    uGridL2: number
    iGridL3: number
    uGridL3: number
}

export interface CountryAndRule {
    country: string
    rule: string
}

export interface LogData {
    array: LogValue[]
    arrayState: number
}

export interface LogValue {
    timestamp: number
    value: number
}

export interface APIError {
    ack: number
}