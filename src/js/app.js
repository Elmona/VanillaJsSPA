
const InstaChat = require('./InstaChat')
const Window = require('./Window')

const chatContainer = document.querySelector('#chatContainer')
let chat = new InstaChat(chatContainer)

const window = new Window()

chat.connect()
