class Memory {
  constructor (rows, cols, container) {
    this.container = document.querySelector(`#${container}`)
    this.templateDiv = document.querySelectorAll('#memoryContainer template')[0].content.firstElementChild
    this.tiles = []
    this.turn1 = null
    this.turn2 = null
    this.getPictureArray(rows, cols)
  }

  generateGame () {
    this.tiles.forEach((tile, index) => {
      let a = document.importNode(this.templateDiv.firstElementChild, true)
      a.firstElementChild.setAttribute('data-brickNumber', index)
      this.container.appendChild(a)
    })
    document.querySelector('#memoryContainer').addEventListener('click', e => {
      e.preventDefault()
      let img = e.target.nodeName === 'IMG' ? e.target : e.target.firstElementChild
      let index = parseInt(img.getAttribute('data-brickNumber'))
      this.turnBrick(this.tiles[index], index, img)
    })
  }

  turnBrick (tile, index, img) {
    if (this.turn2) return

    img.src = `image/memory/${tile}.png`

    if (!this.turn1) {
      // First brick is clicked
      this.turn1 = img
    } else {
      // Second brick is clicked
      if (img === this.turn1) return

      this.turn2 = img
      if (this.turn1.src === this.turn2.src) {
        // Found a pair
        window.setTimeout(() => {
          this.turn1.parentNode.classList.add('removed')
          this.turn2.parentNode.classList.add('removed')
          this.turn1 = null
          this.turn2 = null
        }, 250)
      } else {
        window.setTimeout(() => {
          this.turn1.src = 'image/memory/0.png'
          this.turn2.src = 'image/memory/0.png'
          this.turn1 = null
          this.turn2 = null
        }, 600)
      }
    }
  }
  getPictureArray (rows, cols) {
    for (let i = 1; i <= (rows * cols) / 2; i++) {
      this.tiles.push(i)
      this.tiles.push(i)
    }

    for (let i = this.tiles.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1))
      let temp = this.tiles[i]
      this.tiles[i] = this.tiles[j]
      this.tiles[j] = temp
    }
  }
}

module.exports = Memory
