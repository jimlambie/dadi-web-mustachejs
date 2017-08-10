'use strict'

const fs = require('fs')
const path = require('path')

const PATHS = {
  engine: path.join(__dirname, '/../../index'),
  workspace: path.join(__dirname, '/../workspace')
}

const ADDITIONAL_TEMPLATES = {
  'partials/footer': path.join(PATHS.workspace, 'pages/partials/footer.mustache'),
  'partials/header': path.join(PATHS.workspace, 'pages/partials/header.mustache')
}

const PAGES = {
  products: fs.readFileSync(path.join(PATHS.workspace, 'pages/products.mustache'), 'utf8'),
  'products-with-helpers': fs.readFileSync(path.join(PATHS.workspace, 'pages/products-with-helpers.mustache'), 'utf8')
}

module.exports.additionalTemplates = ADDITIONAL_TEMPLATES
module.exports.pages = PAGES
module.exports.paths = PATHS
