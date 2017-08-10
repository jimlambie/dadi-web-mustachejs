<img src="https://dadi.tech/assets/products/dadi-web-full.png" alt="DADI Web" height="65"/>

## Mustache.js engine interface

[![npm (scoped)](https://img.shields.io/npm/v/dadi-web-mustachejs.svg?maxAge=10800&style=flat-square)](https://www.npmjs.com/package/dadi-web-mustachejs)
[![coverage](https://img.shields.io/badge/coverage-69%25-yellow.svg?style=flat?style=flat-square)](https://github.com/jimlambie/dadi-web-mustachejs)
[![Build Status](https://travis-ci.org/jimlambie/dadi-web-mustachejs.svg?branch=master)](https://travis-ci.org/jimlambie/dadi-web-mustachejs)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

This module allows [Mustache.js](https://github.com/janl/mustache.js/) templates to be used with [DADI Web](https://github.com/dadi/web).

## Installation

- Add this module as a dependency:

   ```
   npm install dadi-web-mustachejs --save
   ```

- Include it in the `engines` array passed to Web:

   ```js
   require('@dadi/web')({
     engines: [
       require('dadi-web-mustachejs')
     ]
   })
   ```

## Configuration

The following configuration parameters can be added to the global Web config file, under `engines.mustache`.

### `paths`

Paths required by Mustache.

- Format: `Object`
- Default:
   ```
   {
     {
       helpers: 'workspace/utils/helpers'
     }
   }
   ```

## Partials

Partials must be registered with Mustache before they can be used in a template. This library takes care of the registration for you, simply supply the path to your partials in the configuration option `additionalTemplates`.

```
pages/
|_ partials/
|_ |_ common/
|_ |_ |_ header.mustache
|_ contact-info.mustache
|_ home.mustache
```

Partials are referenced by their relative path, minus the file extension. After loading the above hierarchy of templates and partials, to include `header.mustache` from the page `contact-info.mustache`, you would use the following syntax:

```mustache
{{> 'partials/common/header' }}
```

## Helpers

To use helpers supply the path to your helpers in the main Web configuration file:

```json
"engines": {
  "mustache": {
    "paths": {
      "helpers": "workspace/helpers"
    }
  }
}
```

Helpers can be individual JavaScript files within the specifed directory, or all in a single file.

*Example:*

```js
/*
 * Returns the full name and price of the supplied product
 * The function receives the current context
 * Usage: {{ renderProduct }}
 */
module.exports = function () {
  return `helper: ${this.name} - £${this.price}`
}
```

This function is now available in your templates, to be used as follows. The function receives the current context, in the following example it receives a `product` object with properties `name` and `price`.

```mustache
{{#products}}
  <li>{{renderProduct}}</li>
{{/products}}
```

## More information

Read more in the Mustache documentation at https://github.com/janl/mustache.js

## Something missing?

Open a pull request or raise an issue.