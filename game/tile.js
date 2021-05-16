const TILE_SPACING = 0.95
const WHITESPACE = 1 - TILE_SPACING

class Tile {
    
    constructor(imageDict) {
        //Make tile either a 2 or 4
        this.val = Math.round((Math.floor(Math.random() * 2) + 1) * 2)

        //Set initial image for tile
        this.image = new Image()
        this.updateImage(imageDict)

        //Not the same as x, y in the grid
        this.x = null
        this.y = null
        this.destX = null
        this.destY = null
    }

    updateImage(imageDict) {
        this.image.src = imageDict[this.val.toString()].src
    }

    setPos(x, y) {
        this.x = x
        this.y = y
    }

    move(x, y, speed) {
      console.log("moving", this.val, x, y)
        this.destX = x;
        this.destY = y;
        this.speed = speed;
        this.movementStart = new Date().getTime()
    }

    isMoving() {
      return this.destX != null && this.destY != null
    }

    stop() {
      this.destX = null
      this.destY = null
    }

    isFinishedMoving() {
      if (this.isMoving) {
        return isClose(this.x, this.destX, 0.05) && isClose(this.y, this.destY, 0.05)
      }

      const {destX, destY, speed, x, y, movementStart} = {...this}
      const timeDiff = Math.min(speed, new Date().getTime() - movementStart)
      const percentageComplete = (100/speed*timeDiff)/100

      return percentageComplete == 1
    }
    
    tick() {
        if (this.isMoving()) {
          const {destX, destY, speed, x, y, movementStart} = {...this}
          const timeDiff = Math.min(speed, new Date().getTime() - movementStart)
          const percentageComplete = (100/speed*timeDiff)/100 // number w/ range 0 -> 1 which shows how far anim should be
          
          this.x = x - (x - destX)*percentageComplete
          this.y = y - (y - destY)*percentageComplete
        }
    }

    render(canvas, ctx, gridSize) {
        if (!this.sideLength) {
            this.sideLength = canvas.width / gridSize
        }

        const sideLength = this.sideLength

        let x = this.x * sideLength + sideLength * WHITESPACE / 2 
        let y = this.y * sideLength + sideLength * WHITESPACE / 2

        ctx.drawImage(this.image,
            this.image.width/2,this.image.height/2,
            sideLength, sideLength,   
            x, y,     // Place the result at 0, 0 in the canvas,
            sideLength * TILE_SPACING, sideLength * TILE_SPACING); // With as width / height: 100 * 100 (scale)

        ctx.font = `${sideLength * 0.5}px monospace`
        ctx.fillStyle = `white`
        ctx.textAlign = "center"
        ctx.fillText(this.val.toString(), x + sideLength/2, y  + sideLength/1.75)
    }

    canCombineWith(tile)
    {
        return this.val == tile.val
    }

    toString() {
      return this.val
    }
}