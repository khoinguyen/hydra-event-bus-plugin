'use strict';

const HydraExpressPlugin = require('hydra-express-plugin');
const EventBusPlugin = require('./EventBusPlugin');
const PLUGIN_ID = 'event-bus';
class HydraExpressEventBusPlugin extends HydraExpressPlugin {

  constructor() {
    super(PLUGIN_ID);
    this._eventBus = new EventBusPlugin(PLUGIN_ID);
  }

  setHydraExpress(hydraExpress) {
    super.setHydraExpress(hydraExpress);
    this._eventBus.setHydra(hydraExpress.getHydra());
    this.hydra.eventBus = this;
    this.hydraExpress.eventBus = this;
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
