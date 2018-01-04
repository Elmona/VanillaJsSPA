const Ajax = require('./Ajax')

class WindowManager {
  constructor () {
    this.id = 0
    this.eventListeners = []
    this.zIndex = 0
    this.startX = 20
    this.startY = 20
    this.offsetY = 0
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
      this.setOpenOffset(div)

      const Code = require(`./${appName}/app`)
      const code = new Code(div)
      code.init()

      this.addZIndexFix(div, this.id)
      this.addCloseButton(div, this.id, code)
      this.addMoveWindow(div, this.id)
      this.addResizeWindow(div, this.id)

      // Put the new window at top of the others.
      div.style.zIndex = ++this.zIndex
    })
  }

  setOpenOffset (div) {
    if (((document.body.clientHeight - div.scrollHeight) - 100) < this.startX) {
      this.offsetY += 200
      this.startX = 20
      this.startY = this.offsetY
    } if ((document.body.clientWidth - div.scrollWidth) < this.startY) {
      this.startY = 20
      this.startX = 20
      this.offsetY = 20
    } else {
      this.startX += 20
      this.startY += 20
    }
    div.style.top = `${this.startX}px`
    div.style.left = `${this.startY}px`
  }

  startDock () {
    console.log('Starting dock!')
    let div = this.getTemplate('Dock')
    const dock = require('./Dock/app')
    this.container.appendChild(div)
    dock(div, this)
  }

  addZIndexFix (div, id) {
    // TODO: Fix bug when the zIndex reaches 2147483647 it won't work.
    div.addEventListener('mousedown', e => {
      div.style.zIndex = ++this.zIndex
    })
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

    let mouseup = () => { isDown = false }
    document.addEventListener('mouseup', mouseup)
    this.addEventListenerToGarbageCollector(id, mouseup, 'mouseup')

    let mousemove = e => {
      e.preventDefault()
      if (isDown) {
        div.style.left = `${(e.clientX + offset[0])}px`
        div.style.top = `${(e.clientY + offset[1])}px`
      }
    }

    document.addEventListener('mousemove', mousemove)
    this.addEventListenerToGarbageCollector(id, mousemove, 'mousemove')
  }

  addResizeWindow (div, id) {
    let startX = 0
    let startY = 0
    let startHeight = 0
    let startWidth = 0

    div.querySelector('.resize').addEventListener('mousedown', e => {
      e.preventDefault()
      startY = e.pageY
      startX = e.pageX
      startHeight = div.clientHeight
      startWidth = div.clientWidth
      document.addEventListener('mousemove', mouseMoveHandler)
      document.addEventListener('mouseup', mouseUpHandler)
    })

    const mouseMoveHandler = e => {
      e.preventDefault()
      let newHeight = startHeight + (e.pageY - startY)
      let newWidth = startWidth + (e.pageX - startX)
      if (startHeight < newHeight) div.style.height = `${newHeight}px`
      if (startWidth < newWidth) div.style.width = `${newWidth}px`
    }

    const mouseUpHandler = e => {
      e.preventDefault()
      document.removeEventListener('mousemove', mouseMoveHandler)
      document.removeEventListener('mouseup', mouseUpHandler)
    }
  }

  addCloseButton (div, id, obj) {
    div.querySelector('.closeButton').addEventListener('click', e => {
      // Check if my app have a close function then run it.
      if (typeof obj.close === 'function') {
        obj.close()
      }

      this.eventListeners
        .filter(x => x.id === id)
        .forEach(x => {
          document.removeEventListener(x.type, x.eventListener)
        })

      while (div.firstChild) {
        div.removeChild(div.firstChild)
      }
      div.remove()
      obj = null
    })
  }

  addEventListenerToGarbageCollector (id, eventListener, type) {
    this.eventListeners.push({
      id: id,
      eventListener: eventListener,
      type: type
    })
  }
}

module.exports = WindowManager
