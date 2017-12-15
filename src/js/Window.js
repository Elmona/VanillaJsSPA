
class Window {
  constructor () {
    this.offset = []
    this.isDown = false
    this.box = document.querySelector('.chat')
    this.resize = document.querySelector('.resize')
    this.startY = 0
    this.startX = 0
    this.startHeight = 0
    this.startWidth = 0

    document.querySelector('.top').addEventListener('mousedown', (e) => {
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

module.exports = Window
