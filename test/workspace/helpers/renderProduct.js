/*
 * Returns the full name and price of the supplied product
 * The function receives the current context
 * Usage: {{ renderProduct }}
 */
module.exports = function () {
  return `helper: ${this.name} - £${this.price}`
}
