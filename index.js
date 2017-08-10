const fs = require('fs')
const path = require('path')

const ENGINE = {
  config: {
    paths: {
      doc: 'Paths required by Mustache',
      format: Object,
      default: {
        helpers: 'workspace/utils/helpers'
      }
    }
  },
  extensions: ['.mustache'],
  handle: 'mustache'
}

module.exports = () => {
  const debug = require('debug')('web:templates:mustache')
  const libHelpers = require(path.join(__dirname, 'lib/helpers'))
  const mustache = require('mustache')
  const requireDir = require('require-dir')

  const EngineMustache = function (options) {
    debug('Starting Mustache.js engine...')

    // additionalTemplates is passed by DADI Web: it is an array of absolute
    // paths to any templates found with an extension supported by this engine
    // that haven't already been loaded due to not having a JSON schema
    // file (i.e. they are not pages)
    this.additionalTemplates = options.additionalTemplates
    this.config = options.config
    this.helpers = options.helpers
    this.pagesPath = options.pagesPath
    this.templates = {}
  }

  /**
   * Returns the engine core module.
   *
   * @return {function} The engine core module.
   */
  EngineMustache.prototype.getCore = function () {
    return mustache
  }

  /**
    * Returns information about the engine.
    *
    * @return {object} An object containing the engine name and version.
    */
  EngineMustache.prototype.getInfo = function () {
    return {
      engine: ENGINE.handle,
      version: undefined
    }
  }

  /**
    * Initialises the engine.
    *
    * @return {Promise} A Promise that resolves when the engine is fully loaded.
    */
  EngineMustache.prototype.initialise = function () {
    const paths = this.config.get('engines.mustache.paths')
    const helpersPath = path.resolve(paths.helpers)

    if (paths && paths.helpers) {
      const helperPath = path.join(process.cwd(), paths.helpers)
      this.helperFunctions = requireDir(helperPath, { recurse: true, camelcase: true })
    }

    return this._requireDirectory(helpersPath).then(helpers => {
      debug('helpers loaded %o', helpers)
      return this._loadPartials()
    }).then(partials => {
      debug('partials loaded %o', partials)
      debug('Mustache initialised')
    })
  }

  /**
   * Registers the template with markup.
   *
   * @return {Promise} A Promise that resolves with the loaded data.
   */
  EngineMustache.prototype.register = function (name, data, path) {
    this.templates[name] = data
  }

  /**
   * Registers the template with markup.
   *
   * @return {Promise} A Promise that resolves with the loaded data.
   */
  EngineMustache.prototype.registerPartial = function (name, data, path) {
    this.partials = this.partials || {}
    this.partials[name] = data
  }

  /**
    * Renders a template.
    *
    * @param {string} name The name of the template.
    * @param {string} data The template content.
    * @param {object} locals The variables to add to the context.
    * @param {object} options Additional render options.
    *
    * @return {Promise} A Promise that resolves with the render result.
    */
  EngineMustache.prototype.render = function (name, data, locals, options) {
    if (this.helperFunctions) {
      Object.assign(locals, this.helperFunctions)
    }

    return Promise.resolve(mustache.render(this.templates[name], locals, this.partials))
  }

  /**
  * Loads any additional templates.
  *
  * @return {Promise} The names of the partials loaded.
  */
  EngineMustache.prototype._loadPartials = function () {
    return libHelpers.readFiles(this.additionalTemplates, {
      callback: file => {
        return new Promise((resolve, reject) => {
          fs.readFile(file, 'utf8', (err, data) => {
            if (err) return reject(err)

            const extension = path.extname(file)
            const templateName = path.relative(this.pagesPath, file)
              .slice(0, -extension.length)

            this.registerPartial(templateName, data)

            resolve(templateName)
          })
        })
      }
    })
  }

  /**
    * Requires all JS files within a directory.
    *
    * @param {string} directory The full path to the directory.
    */
  EngineMustache.prototype._requireDirectory = function (directory) {
    if (!directory) {
      return Promise.resolve([])
    }

    return libHelpers.readDirectory(directory, {
      extensions: ['.js'],
      recursive: true
    }).then(files => {
      files.forEach(file => {
        require(path.resolve(file))
      })

      return files
    })
  }

  return EngineMustache
}

module.exports.metadata = ENGINE
