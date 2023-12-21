# ChargeHQ Bosch Inverter Tool
A simple tool to read data from your Bosch Inverter and upload to ChargeHQ.

## Support
This script has been tested on the BPT-S 4.6 with Firmware Version 901_D_06_01, it might not be supported on other versions, please get in touch if it does not and I'll see if I can add support.

## Installation
Download the package and zip to a folder on you drive.  Note: this script has to be run loacall and your Inverter needs to be connected to your network.

Install the dependencies:
```
cd bosch-solar-chargehq
npm install
```

Update the .env File:
```
cp .env.example .env
```

Add the details in the .env file.

Compile the TypeScript code:
```
npm run build
```

Run a test to see if the details you have entered are correct:
```
npm run dev
```