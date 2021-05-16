class GameContainer {

    constructor(canvas, { fps, speed = 1, debug = false}) {
      this.canvas = canvas
      this.ctx = canvas.getContext('2d')
      this.fps = fps
      this.speed = speed
      this.debug = debug
      this.game = new Game("game", this, 4)
    }

    async start () {
      return await Promise.all([
        this._logicLoop(),
        this._renderLoop()
      ])
    }
  
    async _renderLoop () {
      return await new Promise(_ => {
        setInterval(async () => {
          this._render()
        }, 1000/Math.min(this.fps, 300))
      })
    }
  
    _render () {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height) 

      this.game.render()
  
      if (this.debug) {
        this._renderDebug()
      }
    }
  
    _renderDebug () {
      this.ctx.font = `30px monospace`
      this.ctx.fillStyle = `red`
      this.ctx.fillText(`STATE: hello`, 0, 25)
    }
  
    async _logicLoop () {
      return await new Promise(resolve => {
        const loop = setInterval(async () => {
          /*if (this.state === GameState.FINISHED) {
            resolve(null)
            clearInterval(loop)
            return
          }*/
  
          this.tick()
        }, 1000/(300*this.speed))
      })
    }
  
    tick () {
      this.game.tick()
    }
  
    processInput (key) {
      if (key === 'tab') {
        this.debug = !this.debug
        return
      }
  
      // process input
      this.game.processInput(key)
    }
  
  }
