# ChargeHQ Bosch Inverter Tool
A simple tool to read data from your Bosch Inverter and upload to ChargeHQ.

## Support
This script has been tested on the BPT-S 4.6 with Firmware Version 901_D_06_01, it might not be supported on other versions, please get in touch if it does not and I'll see if I can add support.

## Prerequisites
 - NodeJS - This application is created with NodeJS and therefore requires to be run on a system where this can be installed.
 - A PC, Server, Raspberry Pi or other computer which can run the above NodeJS, this will have to be powered up and connected to the internet and network 24/7.

## Installation
Clone this repository to a folder on you drive.  I will add a complete release bundle soon, but for now you have to build it yourself, but it is easy:

Clone:
```
git clone https://github.com/richastral/bosch-solar-chargehq.git
```

Install the dependencies:
```
cd [Installation Path]/bosch-solar-chargehq
npm install
```

Update the .env File:
```
cp .env.example .env
```

Update the details in the .env file, specifically:
 - BOSCH_IP_ADDRESS - This can be found on the display of your Bosch Inverter, or from within your router configuration.
 - CHARGE_HQ_API_KEY - Your API Key for Charge HQ account.  See below for details on how to get this.

Compile the TypeScript code:
```
npm run build
```

Run a test to see if the details you have entered are correct:
```
npm run dev
```

## Charge HQ API Key
You can get a free API Key for Charge HQ by doing the following:
 - Download the App on your phone or tablet, or log in via a web browser: https://app.chargehq.net/ (Save your username and password securely)
 - In the Web App (https://app.chargehq.net/) ONLY (this in not available in the smart device apps as yet):
 - - Log in using your credentials above.
 - - Navigate to My Equipment -> Solar / Battery Equipment -> Push API
 - - Copy your API Key which is generated.
 update the .env file with your API Key.
