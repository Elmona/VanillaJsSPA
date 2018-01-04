
class Memory {
  constructor (div) {
    this.div = div
    this.container = div.querySelector(`#memoryContainer`)
    this.templateDiv = div.querySelectorAll('template')[0].content.firstElementChild
    this.tiles = []
    this.turn1 = null
    this.turn2 = null
    this.imgTiles = `image/memory/0/`
    this.totalClicks = 0
    this.pair = 0
  }

  init (rows = 4, cols = 4) {
    this.cols = cols
    this.rows = rows
    this.getPictureArray(rows, cols)
    this.generateGame()
    this.selectTiles()
  }

  selectTiles () {
    this.div.querySelector('select').addEventListener('change', e => {
      this.imgTiles = `image/memory/${e.target.value}/`
      this.cleanBoard()
      this.generateGame()
      document.removeEventListener('click', this.clickHandler)
      this.pair = 0
      this.totalClicks = 0
    })
  }

  cleanBoard () {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild)
    }
  }

  generateGame () {
    let index = 0

    for (let cols = 0; cols < this.cols; cols++) {
      let div = document.createElement('div')
      div.setAttribute('class', 'MemoryRow')
      for (let rows = 0; rows < this.rows; rows++) {
        let a = document.importNode(this.templateDiv.firstElementChild, true)
        a.firstElementChild.setAttribute('data-brickNumber', index)
        a.firstElementChild.setAttribute('src', `${this.imgTiles}0.png`)
        div.appendChild(a)
        index++
      }
      this.container.appendChild(div)
    }

    this.clickHandler = this.container.addEventListener('click', e => {
      e.preventDefault()
      if (!e.target.classList.contains('MemoryRow')) {
        console.log(e.target)
        let img = e.target.nodeName === 'IMG' ? e.target : e.target.firstElementChild
        let index = parseInt(img.getAttribute('data-brickNumber'))
        this.turnBrick(this.tiles[index], index, img)
      }
    })
  }

  turnBrick (tile, index, img) {
    this.totalClicks++
    if (this.turn2) return

    img.src = `${this.imgTiles}${tile}.png`

    if (!this.turn1) {
      // First brick is clicked
      this.turn1 = img
    } else {
      // Second brick is clicked
      if (img === this.turn1) return

      this.turn2 = img
      if (this.turn1.src === this.turn2.src) {
        // Found a pair
        this.pair++
        window.setTimeout(() => {
          this.turn1.parentNode.classList.add('removed')
          this.turn2.parentNode.classList.add('removed')
          this.turn1 = null
          this.turn2 = null
          // Win condition
          if (this.pair === (this.rows * this.cols) / 2) {
            this.cleanBoard()
            let winText = document.createElement('h2')
            winText.textContent = 'Won, number of clicks ' + this.totalClicks
            this.container.appendChild(winText)
          }
        }, 250)
      } else {
        window.setTimeout(() => {
          this.turn1.src = `${this.imgTiles}0.png`
          this.turn2.src = `${this.imgTiles}0.png`
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
