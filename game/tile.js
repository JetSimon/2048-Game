const TILE_SPACING = 0.95
const WHITESPACE = 1 - TILE_SPACING
const INITIAL_SIZE = 0.5;
const POP_DURATION = 100


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

        this.sizeMul = INITIAL_SIZE;
    }

    updateImage(imageDict) {
        this.image.src = imageDict[this.val.toString()].src
    }

    setPos(x, y) {
        this.x = x
        this.y = y
        this.originX = x
        this.originY = y
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

    change(val) {
      this.val = val
      this.sizeMul = 0.5
    }

    isFinishedMoving() {
      const {speed, movementStart} = {...this}
      const timeDiff = Math.min(speed, new Date().getTime() - movementStart)
      const percentageComplete = (100/speed*timeDiff)/100

      return percentageComplete == 1
    }
    
    tick() {
        if (this.isMoving()) {
          const {destX, destY, speed, x, y, originX, originY, movementStart} = {...this}
          const timeDiff = Math.min(speed, new Date().getTime() - movementStart)
          const percentageComplete = (100/speed*timeDiff)/100 // number w/ range 0 -> 1 which shows how far anim should be

          this.x = originX - (originX - destX)*percentageComplete
          this.y = originY - (originY - destY)*percentageComplete
        }
    }

    render(canvas, ctx, gridSize) {
        if (!this.sideLength) {
            this.sideLength = canvas.width / gridSize
        }

        this.sizeMul = Math.min(1, this.sizeMul)
        if(this.sizeMul < 1) {
          this.sizeMul += 0.1;
        }
        this.sizeMul = Math.min(1, this.sizeMul)

        const sideLength = this.sideLength;
        const spacing = (sideLength * WHITESPACE / 2) + (sideLength - this.sizeMul * sideLength) / 2

        let x = this.x * sideLength + spacing
        let y = this.y * sideLength + spacing

        ctx.drawImage(this.image,
            0,0,
            this.image.width, this.image.height,   
            x, y,     // Place the result at x,y in the canvas,
            sideLength * TILE_SPACING * this.sizeMul, sideLength * TILE_SPACING * this.sizeMul); // With as width / height: 100 * 100 (scale)

        ctx.font = `${sideLength * 0.5}px monospace`
        ctx.fillStyle = `white`
        ctx.textAlign = "center"

        if(this.sizeMul >= 1) ctx.fillText(this.val, x + sideLength/2, y  + sideLength/1.75)
    }

    toString() {
      return this.val
    }
}