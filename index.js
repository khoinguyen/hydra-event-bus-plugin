'use strict';

const Promise = require('bluebird');
const HydraPlugin = require('hydra-plugin');

const PLUGIN_ID = 'event-bus';
class EventBusPlugin extends HydraPlugin {
  constructor() {
    super(PLUGIN_ID); // unique identifier for the plugin
  }

  setConfig(hydraConfig) {
    super.setConfig(hydraConfig);
    
    this.hydra.sendToHealthLog('info', `[${PLUGIN_ID}] Event Bus initialized`);
  }
}

module.exports = EventBusPlugin;
