const TILE_ANIMATION_DELAY = 150
class Game {

    constructor(name, gameContainer, gridSize) {
        this.name = name
        this.gameContainer = gameContainer
        this.canvas = gameContainer.canvas
        this.ctx = canvas.getContext('2d')
        this.grid = []
        this.previousGrid = []
        this.imageDict = {}
        this.ghosts = []
        this.locked = false
        this.score = 0
        this.bestScore = 0
        this.gridSize = gridSize //Replace this once we allow user to enter custom grid size

        this.updateImageDict()

        for(let y = 0; y < gridSize; y++) {
            this.grid.push([])
            for(let x = 0; x < gridSize; x++) {
                this.grid[y].push(null)
            }
        }

        for(let i = 0; i < 2; i++) {
            let [y, x] = findClearSpot(this.grid)
            const tile = this.grid[y][x] = new Tile(this.imageDict)
            tile.setPos(x, y)
        }
    }

    reset () {
      const gridSize = this.gridSize
      this.grid = []
      this.previousGrid = []
      this.ghosts = []
      this.score = 0
      document.getElementById('score').innerText = this.score

      for(let y = 0; y < gridSize; y++) {
        this.grid.push([])
        for(let x = 0; x < gridSize; x++) {
            this.grid[y].push(null)
        }
      }

      for(let i = 0; i < 2; i++) {
        let [y, x] = findClearSpot(this.grid)
        const tile = this.grid[y][x] = new Tile(this.imageDict)
        tile.setPos(x, y)
      }

    }
    
    tick () {
      this.grid.forEach(arr => arr.filter(tile => tile).forEach(tile => tile.tick()))
      const toUpdate = []
      let score = 0
      for (let y = 0; y < this.grid.length; y++) {
        for (let x = 0; x < this.grid.length; x++) {
          const tile = this.grid[y][x]
          if (!tile) continue

          if (tile.isMoving() && tile.isFinishedMoving()) {
            const {destX, destY} = {...tile}

            tile.stop()
            tile.setPos(destX, destY)
            toUpdate.push({x, y, tile})

            if (tile.queuedVal > 0) {
              tile.change(tile.queuedVal)
              tile.queuedVal = 0

              score += tile.val

              tile.updateImage(this.imageDict)
            }
          }
        }
      }

      toUpdate.forEach(update => {
        const { x, y, tile } = update
        if (this.grid[y][x] === tile) {
          this.grid[y][x] = null
        }

        if (!tile.merged) {
          this.grid[tile.y][tile.x] = tile 
        }
      })

      if (score > 0) {
        this.score += score
        document.getElementById('score').innerText = this.score
        document.getElementById('score').innerText = this.score
        const change = document.getElementById('change');
        change.innerText = `+${score}`
        change.classList.remove('popped')
        void change.offsetWidth
        change.classList.add('popped')

        if(this.score > this.bestScore)
        {
          this.bestScore = this.score
          document.getElementById('best').innerText = this.bestScore
        }
      }
    }

    render () {
        drawGridLines(this.ctx, this.grid)

        this.grid.flat().filter(tile => tile).sort((a, b) => a.merged - b.merged).forEach(tile => tile.render(this.canvas, this.ctx, this.grid.length))
     }

    shift(dX, dY) {
      let moved = false
      const cloned = this.grid.map(arr => arr.slice())

      for (let y = 0; y < this.grid.length; y++) {
        for (let x = 0; x < this.grid.length; x++) {
          let [posX, posY] = [dX > 0 ? this.grid.length - 1 - x: x , dY > 0 ? this.grid.length - 1 - y : y]

          let tile = this.grid[posY][posX]
          if (!tile) continue

          let [destX, destY] = [posX, posY]
          
          if (dX !== 0) {
            while (destX + dX >= 0 && destX + dX < this.grid.length && cloned[y][destX + dX] === null) {
              destX += dX
            }
          }

          if (dY !== 0) {
            while (destY + dY >= 0 && destY + dY < this.grid.length && cloned[destY + dY][x] === null) {
              destY += dY
            }
          }

          // if this is true, that means the shift couldnt make it all the way to the edge
          // and was obstructed by another tile
          if ((dX !== 0 && destX + dX >= 0 && destX + dX < this.grid.length) || (dY !== 0 && destY + dY >= 0 && destY + dY < this.grid.length)) {
            // now we will check if the adjacent tile has the same value
            const adjacent = cloned[destY + dY][destX + dX]

            if (canCombineWith(tile, adjacent)) {
              moved = true
              // now we will attempt merge
              adjacent.queuedVal = adjacent.val * 2
              adjacent.queuedRef = tile
              tile.merged = true
              tile.move(destX + dX, destY + dY, TILE_ANIMATION_DELAY)
              cloned[posY][posX] = null
              continue
            }
          }
          
            if (destX != x || destY != y) {
              moved = true
            }
            tile.move(destX, destY, TILE_ANIMATION_DELAY)
            cloned[posY][posX] = null
            cloned[destY][destX] = tile
         
        }
      }

      this.locked = moved
      if(moved) {
        setTimeout(() => this.addTile(), 250)
      }
      
    }

    addTile() {
      this.locked = false
      if(addNewTile(this.grid, this.imageDict) === false) {
        console.log("lose game")
      }
    }

    processInput(key) {
      if (this.locked || this.grid.flat().filter(tile => tile && tile.isMoving() && !tile.isFinishedMoving()).length > 0) {
        return
      }

      switch (key) {
        case "arrowdown":
          this.shift(0,1)
          break
        case "arrowup":
          this.shift(0,-1)
          break
        case "arrowleft":
          this.shift(-1,0)
          break;
        case "arrowright":
          this.shift(1,0)
        default:
          return
      }
    }

    updateImageDict() {
      for(let i = 1; i <= 12; i++)
      {
            const key = 2**i;
            this.imageDict[key.toString()] = document.getElementById(key.toString())
      }
    }
}