import { GridVoltageAndCurrent, StringVoltageAndCurrent } from "./model/bosch.model";
import { SiteMeterPush } from "./model/site-meter.model";
import { BoschAPI } from "./util/bosch.api";
import { ChargeHQAPI } from "./util/chargehq.api";
require('dotenv').config()

console.log('ChargeHQ Bosch Inverter Tool');
console.log('----------------------------');

async function main() {
    const boschAPI = new BoschAPI(process.env.BOSCH_IP_ADDRESS as string);
    const chargeHQAPI = new ChargeHQAPI(process.env.CHARGE_HQ_API_URL as string, process.env.CHARGE_HQ_API_KEY as string);

    const inverterInfo = await boschAPI.getInverterInfo();
    console.log('Name: ', inverterInfo.deviceName);
    console.log('Model: ', inverterInfo.model);
    console.log('Firmware Version: ', inverterInfo.firmware);
    console.log('Serial Number: ', inverterInfo.serialNumber);
    console.log('Nominal Power (KW/h): ', inverterInfo.nominalPower);
    console.log('Number of DC Strings: ', inverterInfo.numberOfStringInputs);

    const timeConfig = await boschAPI.getTimeConfig();

    const networkInfo = await boschAPI.getNetworkInfo();
    console.log('IP Address: ', networkInfo.ipAddress);

    const yieldData = await boschAPI.getYieldStatus();
    console.log('Daily Yeild (Kw/h): ', yieldData.yieldDaily);

    const stringData = await boschAPI.getStringVoltageAndCurrent();
    console.log('Current Yeild (Kw/h): ', calculateCurrentKw(stringData));

    const gridData = await boschAPI.getGridVoltageAndCurrent();
    console.log('Current Grid (Kw/h): ', calculateGridFeedIn(gridData));

    const solarValues: SiteMeterPush = {
        siteMeters: {
            net_import_kw: calculateGridFeedIn(gridData),
            production_kw: calculateCurrentKw(stringData)
        }
    }

    const sendResult = await chargeHQAPI.sendRequest(solarValues);
    if (!sendResult.success) {
        console.log('[ERROR] Unable to send values to ChargeHQ: ', sendResult.message);
    } {
        console.log('[SUCCESS] Successfully sent values to ChargeHQ');
    }

    // const nowTimeStamp = timeConfig.utcTimestamp;

    // const currentDate = new Date((nowTimeStamp + (timeConfig.utcOffset * 60)) * 1000); // Use Offset from API

    // /**
    //  * This is only for testing at night when no data is available.
    //  */
    // currentDate.setHours(currentDate.getHours() - 24);
    // console.log('Current Time (-24h Test): ', currentDate);
    // /**
    //  * End
    //  */

    // // Start date
    // const startDate = new Date(currentDate.getTime());
    // setTimeValues(startDate, 0, 0, 0, 0);
    // // startDate.setHours(0);
    // // startDate.setMinutes(0);
    // // startDate.setSeconds(0);
    // // startDate.setMilliseconds(0);
    
    // const toDate = new Date(currentDate.getTime());
    // setTimeValues(toDate, 23, 59, 59, 999);
    // // toDate.setHours(23);
    // // toDate.setMinutes(59);
    // // toDate.setSeconds(59);
    // // toDate.setMilliseconds(999);
    
    // console.log('Start:');
    // console.log(startDate);
    // console.log(startDate.getTime());
    
    // console.log('End:');
    // console.log(toDate);
    // console.log(toDate.getTime());

    // const acLogData = await boschAPI.getLogAcPower(startDate.getTime(), toDate.getTime());
    // console.log('Log Data (AC) Count: ', acLogData.array.length);
    // console.log('Log Data (AC): ', acLogData);
}
main();

function setTimeValues(sourceDate: Date, hours: number, minutes: number, seconds: number, millis: number): void {
    sourceDate.setHours(hours);
    sourceDate.setMinutes(minutes);
    sourceDate.setSeconds(seconds);
    sourceDate.setMilliseconds(millis);
}

function calculateCurrentKw(stringData: StringVoltageAndCurrent): number {
    let stringAKw = 0;
    let stringBKw = 0;
    let stringCKw = 0;
    let stringDKw = 0;
    if (stringData.uStringA > 0) {
        stringAKw = stringData.uStringA * stringData.iStringA;
    }

    if (stringData.uStringB > 0) {
        stringBKw = stringData.uStringB * stringData.iStringB;
    }

    if (stringData.uStringC > 0) {
        stringCKw = stringData.uStringC * stringData.iStringC;
    }

    if (stringData.uStringD > 0) {
        stringDKw = stringData.uStringD * stringData.iStringD;
    }

    return kwToWatt(stringAKw + stringBKw + stringCKw + stringDKw);
}

function calculateGridFeedIn(gridData: GridVoltageAndCurrent) {
    let gridFeedW = 0;

    if (gridData.uGridL1 > 0) {
        gridFeedW += gridData.uGridL1 * gridData.iGridL1;
    }

    if (gridData.uGridL2 > 0) {
        gridFeedW += gridData.uGridL2 * gridData.iGridL2;
    }

    if (gridData.uGridL3 > 0) {
        gridFeedW += gridData.uGridL3 * gridData.iGridL3;
    }

    return kwToWatt(gridFeedW);
}

// Function here only to make it easy to do the divisor.
function kwToWatt(kw: number): number {
    return kw / 1000;
}

async function sendSolarData(): Promise<void> {

}