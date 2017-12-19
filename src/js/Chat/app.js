
const config = require('../config.json')

class Chat {
  constructor (div) {
    this.div = div
    this.messages = []
  }
  init () {
    console.log('Init chat')
    this.div.addEventListener('keypress', e => {
      if (e.keyCode === 13) {
        this.sendMessage(e.target.value)
        e.target.value = ''
        e.preventDefault()
      }
    })
    this.connect()
  }

  connect () {
    return new Promise((resolve, reject) => {
      if (this.socket && this.socket.readyState === 1) {
        resolve()
        return
      }

      console.log(`Connecting to chat server at ${config.address}`)

      try {
        this.socket = new window.WebSocket(config.address)
      } catch (e) {
        reject(e)
      }

      this.socket.addEventListener('open', () => {
        let data = {username: 'Server', data: 'Connected.'}
        this.printMessage(data)
        resolve()
      })

      this.socket.addEventListener('onerror', e => {
        let data = {username: 'Server', data: e}
        this.printMessage(data)
      })

      this.socket.addEventListener('message', e => {
        let msg = JSON.parse(e.data)
        if (msg.type === 'message') {
          this.printMessage(msg)
        }
      })
    })
  }

  sendMessage (msg) {
    let data = {
      type: 'message',
      data: msg,
      username: 'Emil',
      key: config.key
    }
    this.connect().then(() => {
      this.socket.send(JSON.stringify(data))
    })
  }

  printMessage (msg) {
    let messages = this.div.querySelectorAll('.messages')[0]
    let template = this.div.querySelectorAll('template')[0]
    let messageDiv = document.importNode(template.content, true)

    messageDiv.querySelectorAll('.text')[0].textContent = msg.data
    messageDiv.querySelectorAll('.author')[0].textContent = `${this.getTime()} ${msg.username}: `
    console.log(`${msg.username}:${msg.data}`)
    this.div.querySelectorAll('.messages')[0].appendChild(messageDiv)

    // Scroll to bottom of chat window
    messages.scrollTop = messages.scrollHeight
  }

  getTime () {
    let date = new Date()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    if (hours < 10) hours = `0${hours}`
    if (minutes < 10) minutes = `0${minutes}`
    return `[${hours}:${minutes}]`
  }
}

module.exports = Chat
