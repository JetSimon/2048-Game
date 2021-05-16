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

        for(let i = 1; i <= 10; i++)
        {
            const key = 2**i;
            this.imageDict[key.toString()] = document.getElementById(key.toString())
        }

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
      for (let y = 0; y < this.grid.length; y++) {
        for (let x = 0; x < this.grid.length; x++) {
          const tile = this.grid[y][x]
          if (!tile) continue

          if (tile.isMoving() && tile.isFinishedMoving()) {
            const {destX, destY} = {...tile}

            tile.stop()
            tile.setPos(destX, destY)
            toUpdate.push({x, y, tile})
          }
        }
      }

      toUpdate.forEach(update => {
        const { x, y, tile } = update
        this.grid[y][x] = null
        this.grid[tile.y][tile.x] = tile
      })
    }

    render () {
        drawGridLines(this.ctx, this.grid)

        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid.length; x++) {
                const tile = this.grid[y][x]
                if (tile) {
                    tile.render(this.canvas, this.ctx, this.grid.length)
                }
            }
        }
     }

    shift(dX, dY) {
      const cloned = this.grid.map(arr => arr.slice())

      for (let y = 0; y < this.grid.length; y++) {
        for (let x = 0; x < this.grid.length; x++) {
          let [posX, posY] = [x, dY > 0 ? this.grid.length - 1 - y : y]

          let tile = this.grid[posY][posX]
          if (!tile) continue

          let [destX, destY] = [x, posY]
          
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

          //if (destX != x || destY != y) {
            tile.move(destX, destY, 100)
            cloned[y][x] = null
            cloned[destY][destX] = tile
          //}
        }
      }
    }

    merge(dX, dY) {
      
    }

    addTile() {
      if(addNewTile(this.grid, this.imageDict) === false) {
        console.log("lose game")
      }
    }

    processInput(key) {
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
}