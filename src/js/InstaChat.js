const config = require('./config.json')

class InstaChat {
  constructor (container) {
    this.socket = null
    let template = document.querySelector('#chat')

    this.chatDiv = document.importNode(template.content.firstElementChild, true)
    this.messages = []
    this.chatDiv.addEventListener('keypress', e => {
      if (e.keyCode === 13) {
        this.sendMessage(e.target.value)
        e.target.value = ''
        e.preventDefault()
      }
    })

    container.appendChild(this.chatDiv)
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
        resolve()
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
    this.connect()
      .then(() => {
        this.socket.send(JSON.stringify(data))
      })
  }

  printMessage (msg) {
    let template = this.chatDiv.querySelectorAll('template')[0]
    let messageDiv = document.importNode(template.content, true)

    messageDiv.querySelectorAll('.text')[0].textContent = msg.data
    messageDiv.querySelectorAll('.author')[0].textContent = msg.username
    console.log(`${msg.username}:${msg.data}`)
    this.chatDiv.querySelectorAll('.messages')[0].appendChild(messageDiv)
  }
}

module.exports = InstaChat
