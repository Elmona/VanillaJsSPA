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
    this.cursor = div.querySelector('#cursor')
    this.paint = false
    this.picture = []
    this.mouseX = 0
    this.mouseY = 0
    this.yOffset = 110
    this.brushSize = 50
    this.color = '#000'
    this.id = 0
  }

  init () {
    this.container.querySelector('#testButton').addEventListener('click', e => {
      console.log(this.picture)
    })
    this.container.querySelector('.PaintColor').addEventListener('change', e => {
      this.color = e.target.value
    })

    this.container.querySelector('.PaintRange').addEventListener('change', e => {
      this.brushSize = e.target.value
    })

    this.cursor.addEventListener('mousedown', e => {
      this.mouseX = e.clientX - this.container.offsetLeft
      this.mouseY = e.clientY - this.container.offsetTop - this.yOffset

      // A dot the size of the brush
      this.context.beginPath()
      this.context.fillStyle = this.color
      this.context.arc(this.mouseX, this.mouseY, this.brushSize / 2, 0, 2 * Math.PI, true)
      this.context.fill()

      this.picture.push({
        id: ++this.id,
        brushSize: this.brushSize,
        color: this.color,
        line: [{
          x: this.mouseX,
          y: this.mouseY
        }]
      })
      this.paint = true
    })

    this.canvas.addEventListener('mousemove', e => {
      this.mouseX = e.clientX - this.container.offsetLeft
      this.mouseY = e.clientY - this.container.offsetTop - this.yOffset

      // Change pointer
      // console.log(this.cursor)
      this.cursor.style.left = this.mouseX + 'px'
      this.cursor.style.top = this.mouseY + this.yOffset + 'px'

      if (this.paint) {
        let x = this.picture.filter(x => x.id === this.id)
        x[0].line.push({x: this.mouseX, y: this.mouseY})

        this.drawPicture()
      }
      this.container.querySelector('h6').textContent = `x: ${this.pad(this.mouseX)} y: ${this.pad(this.mouseY)}`
    })

    this.cursor.addEventListener('mouseup', e => {
      this.paint = false
    })
  }

  drawPicture () {
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height)
    this.picture.forEach(x => {
      this.context.strokeStyle = x.color
      this.context.fillStyle = x.color
      this.context.lineWidth = x.brushSize
      this.context.lineJoin = 'round'

      if (x.line.length === 1) {
        this.context.beginPath()
        this.context.arc(x.line[0].x, x.line[0].y, x.brushSize / 2, 0, 2 * Math.PI, true)
        this.context.fill()
      } else {
        x.line.forEach((l, i) => {
          if (i > 0) {
            this.context.beginPath()
            let prevX = x.line[i - 1].x
            let prevY = x.line[i - 1].y
            this.context.moveTo(prevX, prevY)
            this.context.lineTo(l.x, l.y)
            this.context.closePath()
            this.context.stroke()
          }
        })
      }
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
}

module.exports = Paint
