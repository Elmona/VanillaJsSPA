const Ajax = require('./Ajax')

class WindowManager {
  constructor () {
    this.id = 0
    this.startX = 20
    this.startY = 20
    this.container = document.querySelector('.container')
  }

  getTemplate (appName) {
    let div = document.createElement('div')
    div.setAttribute('class', appName)
    Ajax({
      method: 'GET',
      url: `/js/${appName}/template.html`
    }).then(data => {
      div.innerHTML = data
    }).catch(e => {
      console.log(e)
    })
    return div
  }

  startApp (appName) {
    console.log(`Starting: ${appName}`)
    Ajax({
      method: 'GET',
      url: `/js/${appName}/template.html`
    }).then(data => {
      this.id++
      let div = document.createElement('div')
      div.setAttribute('class', appName)
      div.setAttribute('id', `id${this.id}`)
      div.innerHTML = data
      this.container.appendChild(div)
      const Code = require(`./${appName}/app`)
      const code = new Code(div)
      code.init()
      this.addCloseButton(div, this.id)
      this.addMoveWindow(div, this.id)
    })
  }

  startDock () {
    console.log('Starting dock!')
    let div = this.getTemplate('Dock')
    const dock = require('./Dock/app')
    this.container.appendChild(div)
    dock(div, this)
  }

  addMoveWindow (div, id) {
    let offset = []
    let isDown = false
    div.querySelector('.top').addEventListener('mousedown', e => {
      isDown = true
      offset = [
        div.offsetLeft - e.clientX,
        div.offsetTop - e.clientY
      ]
    })

    document.addEventListener('mouseup', () => { isDown = false })

    document.addEventListener('mousemove', e => {
      e.preventDefault()
      if (isDown) {
        div.style.left = `${(e.clientX + offset[0])}px`
        div.style.top = `${(e.clientY + offset[1])}px`
      }
    })
  }
  addCloseButton (div, id) {
    div.querySelector('.closeButton').addEventListener('click', e => {
      let div = document.querySelector(`#id${id}`)
      while (div.firstChild) {
        div.removeChild(div.firstChild)
      }
      div.remove()
    })
  }
}
/*
class Window {
  constructor () {
    this.id = `#id${id}`
    this.offset = []
    this.isDown = false
    this.box = document.querySelector(`${this.id}`)
    this.resize = document.querySelector(`${this.id} .resize`)
    this.startY = 0
    this.startX = 0
    this.startHeight = 0
    this.startWidth = 0
    document.querySelector(`${this.id} .top`).addEventListener('mousedown', (e) => {
      this.isDown = true
      this.offset = [
        this.box.offsetLeft - e.clientX,
        this.box.offsetTop - e.clientY
      ]
    })

    document.addEventListener('mouseup', () => { this.isDown = false })

    document.addEventListener('mousemove', e => {
      e.preventDefault()
      if (this.isDown) {
        this.box.style.left = `${(e.clientX + this.offset[0])}px`
        this.box.style.top = `${(e.clientY + this.offset[1])}px`
      }
    })

    this.resize.addEventListener('mousedown', e => {
      e.preventDefault()
      this.startY = e.pageY
      this.startX = e.pageX
      this.startHeight = this.box.clientHeight
      this.startWidth = this.box.clientWidth
      document.addEventListener('mousemove', mouseMoveHandler)
      document.addEventListener('mouseup', mouseUpHandler)
    })

    const mouseMoveHandler = e => {
      e.preventDefault()
      this.box.style.height = `${this.startHeight + (e.pageY - this.startY)}px`
      this.box.style.width = `${this.startWidth + (e.pageX - this.startX)}px`
    }

    const mouseUpHandler = e => {
      e.preventDefault()
      document.removeEventListener('mousemove', mouseMoveHandler)
      document.removeEventListener('mouseup', mouseUpHandler)
    }
  }
}
*/
module.exports = WindowManager
