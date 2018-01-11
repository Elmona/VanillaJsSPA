/**
 * Module for Examination 3
 * Paint
 *
 * @author Emil Larsson
 * @version 1.0.0
 */

class Paint {
  constructor (div) {
    this.container = div
    this.canvas = div.querySelector('canvas')
    this.context = this.canvas.getContext('2d')
    this.paint = false
    this.line = []
    this.picture = []
    this.mouseX
    this.mouseY
  }

  init () {
    this.canvas.addEventListener('mousedown', e => {
      console.log(this.canvas)

      // let mouseX = e.clientX - this.container.offsetLeft
      // let mouseY = e.clientY - this.container.offsetTop - 80
      /*
      this.context.beginPath()
      this.context.arc(mouseX, mouseY + 18, 10, 0, 2 * Math.PI, true)
      this.picture.push({
        type: 'dot',
        x: mouseX,
        y: mouseY + 18
      })
      this.context.fill()
      */
      this.paint = true
    })

    this.canvas.addEventListener('mousemove', e => {
      if (this.paint) {
        this.mouse = e.clientX - this.container.offsetLeft
        this.mouseY = e.clientY - this.container.offsetTop - 100

        this.line.push({x: this.mouseX, y: this.mouseY})
        this.drawLine()
      }

      this.mouseX = e.clientX - this.container.offsetLeft
      this.mouseY = e.clientY - this.container.offsetTop - 100

      this.container.querySelector('h6').textContent = `x: ${this.mouseX} y: ${this.mouseY}`
    })

    this.canvas.addEventListener('mouseup', e => {
      this.paint = false
    })
  }

  drawLine () {
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height)
    this.context.strokeStyle = '#000'
    this.context.lineWidth = 10
    this.context.lineJoin = 'round'
    /*
    this.picture.forEach(x => {
      if (x.type === 'dot') {
        // console.log(x)
        this.context.beginPath()
        this.context.arc(x.x, x.y + 18, 10, 0, 2 * Math.PI, true)
        this.context.fill()
      }
    })
    */
    this.line.forEach((x, i) => {
      if (i > 0) {
        this.context.beginPath()
        let prevX = this.line[i - 1].x
        let prevY = this.line[i - 1].y
        this.context.moveTo(prevX, prevY)
        this.context.lineTo(x.x, x.y)
        this.context.closePath()
        this.context.stroke()
      }
    })
  }
}

module.exports = Paint
