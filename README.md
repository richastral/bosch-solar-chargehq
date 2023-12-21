# ChargeHQ Bosch Inverter Tool
A simple NodeJS script take solar data from a local Bosch Inverter and push it to the ChargeHQ API.

The Bosch Inverters, at least the one I have do not have good connectivity and therefore the ChargeHQ app cannot support them.

This script is designed to run on your local network and retrieve the necessary solar data and upload to ChargeHQ, allowing you to configure you EV to charge at peak times.

## Prerequisites
 - A Bosch Inverter connected to your local network.  This script has been tested on the **BPT-S 4.6** with Firmware Version **901_D_06_01**, it might not be supported on other versions, please get in touch if it does not and I'll see if I can add support.
 - NodeJS - This application is created with NodeJS and therefore requires to be run on a system where this can be installed.
 - A PC, Server, Raspberry Pi or other computer which can run the above NodeJS, this will have to be powered up and connected to the internet and network 24/7.

## Installation
Clone this repository to a folder on you drive.  I will add a complete release bundle soon, but for now you have to build it yourself, but it is easy:

Clone Repository:
```
git clone https://github.com/richastral/bosch-solar-chargehq.git
```

Install the dependencies:
```
cd [Installation Path]/bosch-solar-chargehq
npm install
```

Update the `.env` File:
```
cp .env.example .env
```

Update the details in the `.env` file, specifically:
 - BOSCH_IP_ADDRESS - This can be found on the display of your Bosch Inverter, or from within your router configuration.
 - CHARGE_HQ_API_KEY - Your API Key for ChargeHQ account.  See below for details on how to get this.

Run a test to see if the details you have entered are correct:
```
npm run dev
```

## Running Live
Ensure that you compile the TypeScript code before you proceed:
```
npm run build
```

You can run this app in 2 ways:
1) From a cron job (or other scheduler) to polls and upload at a specific interval.
2) A Standalone NodeJS App which polls and uploads at a specific interval.

### Running as a CRON Job
Running as a CRON job means that you will run the script on an interval and the script will end as normal and not be running in the background.

It is the responsibility of the operating system to kick off the script again at the required interval.

When running the script as CRON, you just need to call the script with no parameters:
```
node .\dist\index.js
```

Adding the script to crontab can be different depending on your distribution / operating system.  But the following information should help you.

Firstly, find the location of your NodeJS binary:
```
which node
```

Store this path.

Then edit crontab Jobs:
```
crontab -e
```


Add a new Job by creating a new line like the followng:
```
*/2 * * * * cd /home/path/to/bosch-solar-chargehq && /path/to/node dist/index.js
```

Save.

### Running as Standalone
Running as standalone means that the script is always running.  Where this can be useful when having a server, this can also be unreliable because if there is an outage or the script fails for some reason, the script could stop and therefore cease to continue uploading.

However, if you wish to run in this mode you can do the following:

Ensure the `.env` configuration has the correct polling frequency:
```
POLL_FREQUENCY=15
```

Run the script in Standalone Mode:
```
node .\dist\index.js --standalone=true
```
or:
```
node .\dist\index.js --s=true
```

## ChargeHQ API Key
You can get a free API Key for ChargeHQ by doing the following:
 - Download the App on your phone or tablet, or log in via a web browser: https://app.chargehq.net/ (Save your username and password securely)
 - In the Web App https://app.chargehq.net/ (Note: This in not available in the smart device apps as yet):
    - Log in using your credentials above.
    - Navigate to My Equipment -> Solar / Battery Equipment -> Push API.
    - Copy your API Key which is generated.
 update the `.env` file with your API Key.

## Environment Configurations
The following configuration variables can be set in the `.env` file:
|Setting|Type|Description|
|---|---|---|
|BOSCH_IP_ADDRESS|String / IP Address|The IP Address of your Bosch Inverter.  This can be found on the display of your Bosch Inverter, or from within your router configuration.|
|CHARGE_HQ_API_URL|String|The API URL for ChargeHQ API, this should not change and should be set to: https://api.chargehq.net/api/public|
|CHARGE_HQ_API_KEY|String|The API Key for ChargeHQ, see above for instructions on how to register for an API key.|
|POLL_FREQUENCY|Integer|The number of minutes to poll and upload data if the script is run as a standalone NodeJS App.

## Command Line Arguments
The following command line arguments are excepted:
|Argument|Type|Description|
|---|---|---|
|--standalone or --s|Boolean|Set to `true` to run in standalone mode.  With this mode the application controls the polling of data.  This is not a recommended solution as the application is always running.  Any other value than `true` is classed as a `false` value.|

## Proposed Future Enhancements
The following are some update that I may or may not add going forward:
 - Command line argument for polling interval when using standalone mode.
 - Full instructions to set up on a micro device like Raspberry Pi.
 - Front-end like dashboard to view data (the Bosch one is terrible).
 - Stronger error checking.
 - Encryption of `.env` config params.  This is low priority as this should always be run locally.