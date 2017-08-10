'use strict'

const objectPath = require('object-path')

const CONFIG_PROPERTIES = {
  engines: {
    mustache: {
      paths: {
        helpers: 'test/workspace/helpers'
      }
    }
  }
}

const Config = function () {
  this.reset()
}

Config.prototype.get = function (path) {
  return objectPath.get(this.config, path)
}

Config.prototype.reset = function () {
  this.config = JSON.parse(JSON.stringify(CONFIG_PROPERTIES))
}

Config.prototype.set = function (path, value) {
  return objectPath.set(this.config, path, value)
}

module.exports = new Config()
