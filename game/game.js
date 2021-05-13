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
      this.ghosts.forEach(tile => tile.tick())
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

        for (let i in this.ghosts) {
          this.ghosts[i].render(this.canvas, this.ctx, this.grid.length)
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
      let refresh = true
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

            refresh = false

            total++

            this.grid[newY][newX].setDest(newX, newY, () => {
              counter++
              if (counter === total) {
                if (merge) {
                  console.log('global merge attempt')
                  this.merge(dX, dY)
                }
                this.addTile()
              }
            })
          
          }
        }
      }

      if (refresh) {
        if (merge) {
          this.merge(dX, dY)
          this.addTile()
        }
      }
    }

    merge(dX, dY) {
      let counter = 0
      let total = 0
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

          if (next && current.val === next.val) {
            total++

            this.ghosts.push(current)

            current.setDest(newX, newY, () => {
              this.ghosts.splice(this.ghosts.indexOf(current), 1);
              next.val *= 2
              next.updateImage(this.imageDict)
              this.shift(dX, dY, false)
            })

            this.grid[y][x] = null
          }
        }
      }
    }

    addTile() {
      if(addNewTile(this.grid, this.imageDict) === false) {
        console.log("lose game")
      }
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
    }
}