
const config = require('../config.json')

class Chat {
  constructor (div) {
    this.div = div
  }

  init () {
    this.sendMessageEventListener = this.div.addEventListener('keypress', e => {
      if (e.keyCode === 13) {
        this.sendMessage(e.target.value)
        e.target.value = ''
        e.preventDefault()
      }
    })
    if (window.localStorage.getItem('nick') === null) {
      this.nickNotSet = true
      this.printWelcomeMessage()
    } else {
      this.nick = window.localStorage.getItem('nick')
      this.connect()
    }
  }

  close () {
    this.socket.close()
    document.removeEventListener('keypress', this.sendMessageEventListener)
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

  printHelp () {
    let messages = this.div.querySelectorAll('.messages')[0]
    let template = this.div.querySelectorAll('template')[0]
    let messageDiv = document.importNode(template.content, true)

    messageDiv.querySelectorAll('.author')[0].textContent = ``
    messageDiv.querySelectorAll('.text')[0].innerHTML =
    `
    <hr>
    <p>You can use this commands in the chatt</p><br>
    <p>/help Show this dialog</p>
    <p>/nick NICK To change nickname</p>
    <p>/r MSG use 'Rövarspråk'</p>
    <p>/e MSG use Encryption</p>
    <p>/a MSG use Anton encryption</p>
    <hr>
    `
    messages.appendChild(messageDiv)
  }

  printWelcomeMessage () {
    let messages = this.div.querySelectorAll('.messages')[0]
    let template = this.div.querySelectorAll('template')[0]
    let messageDiv = document.importNode(template.content, true)

    messageDiv.querySelectorAll('.author')[0].textContent = ``
    messageDiv.querySelectorAll('.text')[0].innerHTML =
    `
    <hr>
    <p>Welcome to the LNU chat</p><br>
    <p>Enter your nickname and press enter to start chatting</p>
    <p>/help for help dialog</p>
    <hr>
    `
    messages.appendChild(messageDiv)
  }

  sendMessage (msg) {
    // Searching for commands
    let chatMsg = {username: 'Chat'}
    if (this.nickNotSet === true) {
      window.localStorage.setItem('nick', msg)
      this.nickNotSet = false
      this.nick = msg
      this.connect()
    } else if (/\/help */.exec(msg) !== null) {
      this.printHelp()
    } else if (/\/nick */.exec(msg) !== null) {
      let nick = msg.replace(/\/nick */, '')
      this.nick = nick
      window.localStorage.setItem('nick', nick)
      chatMsg.data = `Changing nick to ${this.nick}`
      this.printMessage(chatMsg)
    } else {
      // Sending message
      let data = {}
      if (/\/r */.exec(msg) !== null) {
        msg = msg.replace(/\/r */, '')
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
    messages.appendChild(messageDiv)

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
