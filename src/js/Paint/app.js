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
    this.mouseX = 0
    this.mouseY = 0
    this.yOffset = 110
    this.brushSize = 5
    this.color = '#000'
  }

  init () {
    this.container.querySelector('.PaintColor').addEventListener('change', e => {
      this.color = e.target.value
    })
    this.container.querySelector('.PaintRange').addEventListener('change', e => {
      this.brushSize = e.target.value
    })
    this.canvas.addEventListener('mousedown', e => {
      this.mouseX = e.clientX - this.container.offsetLeft
      this.mouseY = e.clientY - this.container.offsetTop - this.yOffset
      this.picture.push({
        x: this.mouseX,
        y: this.mouseY
      })
      this.paint = true
    })

    this.canvas.addEventListener('mousemove', e => {
      this.mouseX = e.clientX - this.container.offsetLeft
      this.mouseY = e.clientY - this.container.offsetTop - this.yOffset

      if (this.paint) {
        this.line.push({x: this.mouseX, y: this.mouseY})
        this.drawLine()
      }

      this.container.querySelector('h6').textContent = `x: ${this.pad(this.mouseX)} y: ${this.pad(this.mouseY)}`
    })

    this.canvas.addEventListener('mouseup', e => {
      this.paint = false
    })
  }

  pad (num) {
    if (num < 10) {
      return '00' + num
    } else if (num < 100) {
      return '0' + num
    } else {
      return num
    }
  }

  drawLine () {
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height)
    this.context.strokeStyle = this.color
    this.context.lineWidth = this.brushSize
    this.context.lineJoin = 'round'

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
