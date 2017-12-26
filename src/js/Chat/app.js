
const config = require('../config.json')

class Chat {
  constructor (div) {
    this.div = div
    this.nick = 'Emil'
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
    // Searching for commands
    let re = ''
    let chatMsg = {}
    chatMsg.username = 'Chat'

    re = /\/nick */
    if (re.exec(msg) !== null) {
      let nick = msg.replace(re, '')
      this.nick = nick
      chatMsg.data = `Changing nick to ${this.nick}`
      this.printMessage(chatMsg)
    } else {
      // Sending message
      let data = {}
      re = /\/r */
      if (re.exec(msg) !== null) {
        msg = msg.replace(re, '')
        msg = msg.replace(/([bcdfghjklmnpqrstvwxz])/gi, '$1o$1')
        data = {
          type: 'message',
          channel: '',
          data: msg,
          rovarsprak: true,
          username: this.nick,
          key: config.key
        }
      } else if (/\/e */.exec(msg) !== null) {
        msg = msg.replace(/\/e */, '')
        msg = this.encode(msg, '12345')
        data = {
          type: 'message',
          channel: '',
          data: msg,
          encrypted: true,
          username: this.nick,
          key: config.key
        }
      } else if (/\/a */.exec(msg) !== null) {
        msg = msg.replace(/\/a */, '')
        msg = this.encrypt(msg, 'wdg23baekl')
        data = {
          type: 'message',
          channel: 'random',
          data: msg,
          encrypter: true,
          username: this.nick,
          key: config.key
        }
      } else {
        data = {
          type: 'message',
          channel: '',
          data: msg,
          username: this.nick,
          key: config.key
        }
      }
      this.connect().then(() => {
        this.socket.send(JSON.stringify(data))
      })
    }
  }
  // Emil kryptering
  encode (msg, key) {
    let enc = ''
    for (let i = 0; i < msg.length; i++) {
      let a = msg.charCodeAt(i)
      let b = a ^ key
      enc += String.fromCharCode(b)
    }
    return enc
  }

  // Anton Scramble key
  scrambleKey (key) {
    if (typeof key === 'number') {
      return key * key
    }
    return Number.parseInt(
      Array.from(key.toString())
        .map((c, i) => c.charCodeAt(0) * i * i--)
        .reduce((x, y) => x + y, key.length),
      16
    )
  }

  // Anton Decrypt
  decrypt (str, key) {
    return str
      .split('r')
      .map(c => Number.parseInt(c, 16))
      .map(c => c / this.scrambleKey(key))
      .map(c => String.fromCharCode(c))
      .join('')
  }

  // Anton Encrypt
  encrypt (str, key) {
    return Array.from(str.toString())
      .map(c => c.charCodeAt(0))
      .map(c => c * this.scrambleKey(key))
      .map(c => c.toString(16))
      .join('r')
  }

  printMessage (msg) {
    console.log(msg)

    if (msg.rovarsprak === true) {
      msg.data = '(R) ' + msg.data.replace(/([bcdfghjklmnpqrstvwxz])o\1/gi, '$1')
    }

    if (msg.encrypted === true) {
      msg.data = '(E) ' + this.encode(msg.data, '12345')
    }

    if (msg.encrypter === true) {
      msg.data = '(A) ' + this.decrypt(msg.data, 'wdg23baekl')
    }

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
