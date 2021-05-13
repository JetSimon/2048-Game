class Game {
    constructor(name, gameContainer, gridSize) {
        this.name = name
        this.gameContainer = gameContainer
        this.canvas = gameContainer.canvas
        this.ctx = canvas.getContext('2d')
        this.grid = []
        this.previousGrid = []
        this.imageDict = {}

        for(let i = 2; i <= 2*8; i*=2)
        {
            this.imageDict[i.toString()] = document.getElementById(i.toString())
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

    shiftHorizontal(value, y, delta) {
      let newValue = value;

      if (delta == 1) {
        while(newValue < this.grid.length-1 && this.grid[y][newValue+delta] == null) {
          newValue+=delta
        }
      } else if (delta == -1) {
        while(newValue > 0 && this.grid[y][newValue+delta] == null) {
          newValue+=delta
        }
      }

      return newValue
    }

    shiftVertical(value, x, delta) {
      let newValue = value

      if (delta == 1) {
        while(newValue < this.grid.length-1 && this.grid[newValue+delta][x] == null) {
          newValue+=delta
        }
      } else if (delta == -1) {
        while(newValue > 0 && this.grid[newValue+delta][x] == null) {
          newValue+=delta
        }
      }

      return newValue
    }

    shift(dX, dY, merge) {
      this.previousGrid = this.grid.map(arr => arr.slice())
      
      let total = 0
      let counter = 0
      for (let aY = 0; aY < this.grid.length; aY++) {
        for (let aX = 0; aX < this.grid.length; aX++) {
          let y = aY;
          let x = aX;

          if (dX > 0) { // x = 0, x = length - 1 - 0
            x = this.grid.length - 1 - aX;
          }

          if (dY > 0) {
            y = this.grid.length - 1 - aY;
          }
          
          if (!this.grid[y][x]) continue

          let newX = this.shiftHorizontal(x, y, dX);
          let newY = this.shiftVertical(y, x, dY);

          if (newX != x || newY != y) {
            this.grid[newY][newX] = this.grid[y][x]
            this.grid[y][x] = null

            total++

            this.grid[newY][newX].setDest(newX, newY, () => {
              counter++
              console.log(counter, total)
              if (counter == total && merge) {
                this.merge(dX, dY)
             }
            })
          }
        }
      }
    }

    merge(dX, dY) {
      let counter = 0
      for (let aY = 0; aY < this.grid.length; aY++) {
        for (let aX = 0; aX < this.grid.length; aX++) {
          let y = aY;
          let x = aX;

          if (dX > 0) { // x = 0, x = length - 1 - 0
            x = this.grid.length - 1 - aX;
          }

          if (dY > 0) {
            y = this.grid.length - 1 - aY;
          }

          const newX = x + dX
          const newY = y + dY
          
          if (newX < 0 || newY < 0 || newX >= this.grid.length || newY >= this.grid.length || !this.grid[y][x]) continue

          let current = this.grid[y][x]
          let next = this.grid[newY][newX]

          if (next && current.val == next.val) {
            current.setDest(newX, newY, () => {
              this.grid[newY][newX].val *= 2
              this.grid[newY][newX].updateImage(this.imageDict)
              this.grid[y][x] = null
            })
          }
        }
      }

      this.shift(dX, dY, false)
    }

    processInput(key) {
      switch (key) {
        case "arrowdown":
          this.shift(0,1,true)
          break
        case "arrowup":
          this.shift(0,-1,true)
          break
        case "arrowleft":
          this.shift(-1,0,true)
          break;
        case "arrowright":
          this.shift(1,0,true)
        default:
          return
      }

      if(addNewTile(this.grid, this.imageDict) === false) {
          console.log("lose game")
      }
    }
}