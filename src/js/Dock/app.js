/**
 * Module for Examination 3
 * Dock
 *
 * @author Emil Larsson
 * @version 1.0.0
 */

/**
*  init - Add EventListener to start apps.
*
*  @param {Element} div - Reference to the div element.
*  @param {Object} wm - Reference to WindowManager object
*/
const init = (div, wm) => {
  div.addEventListener('click', e => startApp(e, wm))
}

/**
*  startApp - EventListener to start apps.
*
*  @param {Element} div - Reference to the div element.
*  @param {Object} wm - Reference to WindowManager object
*/
const startApp = (e, wm) => {
  wm.startApp(e.target.dataset.appname)
}

module.exports = init
