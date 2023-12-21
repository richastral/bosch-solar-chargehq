import { GridVoltageAndCurrent, StringVoltageAndCurrent } from "./model/bosch.model";
import { SiteMeterPush } from "./model/site-meter.model";
import { BoschAPI } from "./util/bosch.api";
import { ChargeHQAPI } from "./util/chargehq.api";
import * as yargs from 'yargs'
require('dotenv').config()

console.log('ChargeHQ Bosch Inverter Tool');
console.log('----------------------------');

interface Args {
    standalone?: boolean
}

let args = yargs
    .usage('$0 <cmd> [args]')
    .option('standalone', {
        alias: 's',
        description: "Set to true if the tool should poll for data in a standalone manner (not recommended)",
        type: "boolean"
    }).argv;

const comArgs = args as Args;
if (comArgs.standalone) {
    console.log('Running in Standalone Mode');

    const interval = parseInt(process.env.POLL_FREQUENCY as string);
    console.log(`Polling every ${interval} minutes...`);
    setInterval(function() {
        main()
            .then(v => console.log(`Pausing for the next ${interval} minutes reading and upload...`))
            .catch(err => console.error(err));
    }, interval * 60 * 1000);
} else {
    console.log('Running in Single Mode');
    main();
}

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