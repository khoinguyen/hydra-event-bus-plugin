# Event Bus for Hydra Micro-service

Provides the Event Bus for Hydra-based Micro-service.

## Installation

```javascript
$ npm install --save hydra-event-bus-plugin
```

## Setup

Setup `.use(new EventBusPlugin())` in your service to register the plugin, then you can use `hydra.eventBus` to access the plugin

```javascript
'use strict';

const version = require('./package.json').version;
const hydra = require('hydra');
let config = require('fwsp-config');

const HydraLogger = require('fwsp-logger').HydraLogger;
const EventBusPlugin = require('hydra-event-bus-plugin');
hydra.use(new HydraLogger());
hydra.use(new EventBusPlugin());

const Promise = require('bluebird');

config.init('./config/config.json')
  .then(() => {
    config.version = version;
    config.hydra.serviceVersion = version;
    /**
    * Initialize hydra
    */
    return hydra.init(config);
  })
  .then(() => hydra.registerService())
  .then(serviceInfo => {
    let logEntry = `Starting ${config.hydra.serviceName} (v.${config.version})`;
    hydra.sendToHealthLog('info', logEntry);

    // Register to event bus
    hydra.eventBus.on('profile:.*', (eventName, payload, umf) => {
      console.log(`Receive message for ${eventName} with payload: ${JSON.stringify(payload)}`)
    });
    
    Promise.delay(1000);
    
    // Emit to event bus
    hydra.eventBus.emit('profile:register', {author: 'Khoi Nguyen', repos: ['hydra-event-bus-service', 'hydra-event-bus-plugin']});
    
  })
  .catch(err => {
    console.log('Error initializing hydra', err);
  });
```

## Try it out

Open your terminal, clone and start `hydra-event-bus-service`

```
$ git clone https://github.com/khoinguyen/hydra-event-bus-service.git
$ cd hydra-event-bus-service
$ cp config/sample-config.json config/config.json
$ npm install
$ npm start
```

In another terminal, start your service.

## API Reference

* `.on(pattern: string, callback: function)` to register the callback to the pattern. The callback receive `eventName`, `payload` and `UMF message`
* `.off(pattern: string, callback: function)` to un-register the pattern. Please note, the pattern must be exactly as the pattern registered.
* `.emit(eventName: string, payload: object)` to emit the event to Event Bus.