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
    this.hydraConfig = hydraConfig;

    if (!this.hydraConfig.hydra.serviceName) {
      throw new Error('Config .hydra.serviceName is required to register Event Bus.');
    }
    if (!this.hydraConfig.hydra.eventBus.serviceName) {
      throw new Error('Config .hydra.eventBus.serviceName is required to register Event Bus.');
    }

    let serviceLabel = this.hydraConfig.hydra.serviceLabel;
    if (!serviceLabel) {

      this.hydraConfig.hydra.serviceLabel = 'default';

      this
        .hydra
        .sendToHealthLog('warning', `[${PLUGIN_ID}] No config .hydra.serviceLabel found use 'default' as label`);
    }

    this
      .hydra
      .sendToHealthLog('info', `[${PLUGIN_ID}] Event Bus initialized`);

    this.setupMessageListener();
  }

  registerEventBus(patterns) {
    this
      .hydra
      .sendMessage(this.constructUMFMessage('register', patterns));
  }

  unregisterEventBus(patterns) {
    this
      .hydra
      .sendMessage(this.constructUMFMessage('unregister', patterns));
  }

  constructUMFMessage(event, patterns) {
    return this.hydra.createUMFMessage({
      frm: `${this.hydraConfig.hydra.serviceName}:/`,
      to: `${this.hydraConfig.hydra.eventBus.serviceName}:/`,
      typ: 'event-bus',
      bdy: {
        type: event,
        serviceName: this.hydraConfig.hydra.serviceName,
        label: this.hydraConfig.hydra.serviceLabel,
        patterns: patterns
      }
    });
  }

  setupMessageListener() {
    this.hydra.on('message', (message) => {
      if (message.type != 'event-bus') return;

      this.hydra.sendToHealthLog('info', `[${PLUGIN_ID}] Event Bus message arrived for pattern: ${message.body.pattern}`);
    });
  }

  emitEvent(pattern, payload) {
    const msg = this.hydra.createUMFMessage({
      frm: `${this.hydraConfig.hydra.serviceName}:/`,
      to: `${this.hydraConfig.hydra.eventBus.serviceName}:/`,
      typ: 'event-bus',
      bdy: {
        type: 'event',
        pattern: pattern,
        payload: payload
      }
    });

    this
      .hydra
      .sendMessage(msg);
  }
}

module.exports = EventBusPlugin;
