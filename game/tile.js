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
        this.callback = null;
    }

    updateImage(imageDict) {
        this.image.src = imageDict[this.val.toString()].src
    }

    setPos(x, y) {
        this.x = x
        this.y = y
    }

    setDest(x, y, callback) {
        this.destX = x;
        this.destY = y;
        this.callback = callback;
    }
    

    tick() {
        if (this.destX != null && this.destY != null) {
          this.x = lerp(this.x, this.destX, 0.1)
          this.y = lerp(this.y, this.destY, 0.1)

          let canBecome = Math.abs(this.x - this.destX) + Math.abs(this.y - this.destY) < 0.1

          if (this.destX != null && this.destY != null && canBecome) {
              this.x = this.destX
              this.y = this.destY
              this.destX = null
              this.destY = null
              //console.log("CALL ME BACK")
              if (this.callback) {
                this.callback()
              }
          }
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