'use strict';

const Promise = require('bluebird');
const HydraPlugin = require('hydra-plugin');
const mm = require('micromatch');
const PLUGIN_ID = 'event-bus';
class EventBusPlugin extends HydraPlugin {
  constructor() {
    super(PLUGIN_ID); // unique identifier for the plugin
  }

  setConfig(hydraConfig) {
    super.setConfig(hydraConfig);
    this.hydraConfig = hydraConfig;

    if (!this.hydraConfig.serviceName) {
      throw new Error('Config .hydra.serviceName is required to register Event Bus.');
    }
    if (!this.hydraConfig.plugins || !this.hydraConfig.plugins.eventBus || !this.hydraConfig.plugins.eventBus.serviceName) {
      throw new Error('Config .hydra.plugins.eventBus.serviceName is required to register Event Bus.');
    }

    let serviceLabel = this.hydraConfig.serviceLabel;
    if (!serviceLabel) {

      this.hydraConfig.serviceLabel = 'default';

      this
        .hydra
        .sendToHealthLog('warning', `[${PLUGIN_ID}] No config .hydra.serviceLabel found use 'default' as label`);
    }

    this.hydra.eventBus = this;
    
    this
      .hydra
      .sendToHealthLog('info', `[${PLUGIN_ID}] Event Bus initialized`);

    this.registry = {};
    this.setupMessageListener();
  }

  registerEventBus(patterns) {
    this
      .hydra
      .sendMessage(this.constructUMFMessage('register', patterns));
  }

  on(pattern, callback) {
    this.registerEventBus([pattern]);
    if (!this.registry[pattern]) {
      this.registry[pattern] = [];
    }

    this.registry[pattern].push(callback);
  }

  off(pattern, callback) {
    this.unregisterEventBus([pattern]);
    if (!this.registry[pattern]) {
      return;
    }

    const idx = this.registry[pattern].indexOf(callback);
    this.registry[pattern].splice(idx, 1);
  }

  unregisterEventBus(patterns) {
    this
      .hydra
      .sendMessage(this.constructUMFMessage('unregister', patterns));
  }

  constructUMFMessage(event, patterns) {
    return this.hydra.createUMFMessage({
      frm: `${this.hydraConfig.serviceName}:/`,
      to: `${this.hydraConfig.plugins.eventBus.serviceName}:/`,
      typ: 'event-bus',
      bdy: {
        type: event,
        serviceTag: `${this.hydraConfig.serviceName}:${this.hydraConfig.serviceLabel}`,
        patterns: patterns
      }
    });
  }

  setupMessageListener() {
    this.hydra.on('message', (message) => {
      if (message.typ != 'event-bus' && message.bdy.type != 'event') return;

      this.hydra.sendToHealthLog('info', `[${PLUGIN_ID}] Event Bus message arrived for pattern: ${message.bdy.eventName}`);
      const eventName = message.bdy.eventName;
      const payload   = message.bdy.payload

      const patterns = Object.keys(this.registry);

      for (let pattern of patterns) {
        if (mm.isMatch(eventName, pattern)) {
          for (let cb of this.registry[pattern]) {
            cb(eventName, payload, message);
          }
        }
      }
    });
  }

  emit(pattern, payload) {
    const msg = this.hydra.createUMFMessage({
      frm: `${this.hydraConfig.serviceName}:/`,
      to: `${this.hydraConfig.plugins.eventBus.serviceName}:/`,
      typ: 'event-bus',
      bdy: {
        type: 'event',
        eventName: pattern,
        payload: payload
      }
    });

    this
      .hydra
      .sendMessage(msg);
  }
}

module.exports = EventBusPlugin;
