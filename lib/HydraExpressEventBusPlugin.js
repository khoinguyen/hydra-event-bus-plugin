'use strict';

const HydraExpressPlugin = require('hydra-express-plugin');
const EventBusPlugin = require('./EventBusPlugin');
class HydraExpressEventBusPlugin extends HydraExpressPlugin {

  constructor() {
    super();
    this._eventBus = EventBusPlugin();
  }

  setConfig(config) {
    super.setConfig(config);
    this._eventBus.setConfig(config.hydra);
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

module.exports = HydraExpressEventBusPlugin;
