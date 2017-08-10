/*
 * Returns the full name and price of the supplied product
 * Usage: {{ renderProduct product }}
 */
module.exports = function () {
  return `helper: ${this.name} - £${this.price}`
}
