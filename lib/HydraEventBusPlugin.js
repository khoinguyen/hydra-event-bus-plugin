'use strict';

const HydraPlugin = require('hydra-plugin');
const EventBusPlugin = require('./EventBusPlugin');
class HydraEventBusPlugin extends HydraPlugin {

  constructor() {
    super();
    this._eventBus = EventBusPlugin();
  }

  setConfig(config) {
    super.setConfig(config);
    this._eventBus.setConfig(config);
  }

  registerEventBus(patterns) {
    this._eventBus.registerEventBus(patterns);
  }

  on(pattern, callback) {
    this._eventBus.on(pattern, callback);
  }

  off(pattern, callback) {
    this._eventBus.off(pattern, callback);
  }

  unregisterEventBus(patterns) {
    this._eventBus.unregisterEventBus(patterns);
  }

  emit(pattern, payload) {
    this._eventBus.emit(pattern, payload);
  }
}

module.exports = HydraEventBusPlugin;
