
const InstaChat = require('./InstaChat')
const Window = require('./Window')
const Memory = require('./Memory')

const chatContainer = document.querySelector('#chatContainer')
let chat = new InstaChat(chatContainer)
chat.connect()

const window = new Window()

let memory = new Memory(4, 4, 'memoryContainer')
memory.generateGame()
