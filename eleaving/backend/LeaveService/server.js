const express = require('express')
const bodyParser = require('body-parser')
const Eureka = require('eureka-js-client').Eureka;

// Constants
const PORT = process.env.PORT || 3004
const HOST = '0.0.0.0';
const app = express();

// parse application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));

// Configuration
const client = new Eureka({
    // application instance information
    instance: {
        app: 'leave-service',
        hostName: '35.240.188.199',
        ipAddr: '127.0.0.1',
        statusPageUrl: 'http://localhost:' + PORT,
        vipAddress: 'leave-service',
        port: {
            $: PORT,
            '@enabled': 'true',
        },
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
        registerWithEureka: true,
        fetchRegistry: true,
        leaseRenewalIntervalInSeconds: 1,
        leaseExpirationDurationInSeconds: 2
    },
    eureka: {
        // Eureka server
        host: '35.240.188.199',
        port: 8761,
        servicePath: '/eureka/apps/',
    },
});

client.logger.level('debug');
client.start((error) => {
    console.log(error || '[Leave Service] Eureka client Started!');
});

const leaveController = require('./src/controller/LeaveController')
app.use("/", leaveController);

app.listen(PORT, HOST);
console.log(`Leave Service Running on http://${HOST}:${PORT}`);

module.exports = app