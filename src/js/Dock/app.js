
const init = (div, wm) => {
  console.log('IIINNNIIIITTT')
  div.addEventListener('click', e => startApp(e, wm))
  // document.querySelector('.container').appendChild(div)
}

const startApp = (e, wm) => {
  wm.startApp(e.target.dataset.appname)
}

module.exports = init
