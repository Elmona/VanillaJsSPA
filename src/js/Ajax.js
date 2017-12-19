/**
 * Module for ajax calls using promises and XMLHttpRequest
 *
 * @author Emil Larsson
 * @version 1.0.0
 */
'use strict'

/**
 * Make and XMLHttpRequest and return the data as an promise.
 *
 * @param {Object} config
 * @param {string} config.method - GET or POST
 * @param {string} config.url - The url to make the request to.
 * @param {Object} config.data - An object to send.
 * @resolve {Promise<object>} - Return object
 * @reject {Promise<object>} - Return object
 */
module.exports = (config) => {
  return new Promise((resolve, reject) => {
    let req = new window.XMLHttpRequest()

    req.addEventListener('load', () => {
      if (req.status >= 400) {
        reject(JSON.parse(req.responseText))
      } else {
        resolve(req.responseText)
      }
    })

    req.open(config.method, config.url)

    if (config.method === 'POST') {
      req.setRequestHeader('Content-Type', 'application/json')
      req.send(JSON.stringify(config.data))
    } else {
      req.send()
    }
  })
}
