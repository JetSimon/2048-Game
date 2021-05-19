class GameContainer {

    constructor(canvas, { fps, speed = 1, debug = false}) {
      this.canvas = canvas
      this.ctx = canvas.getContext('2d')
      this.fps = fps
      this.speed = speed
      this.debug = debug
      this.game = new Game("game", this, 4)
      this.touchX = null
      this.touchY = null

      document.getElementById("restart").addEventListener('click', () => {this.game.reset()}); 


      const buttons = document.getElementsByClassName("tileImage");
      for(var i=0; i < buttons.length; i++) {
          buttons[i].addEventListener('change',  this.game.updateImageDict(), true); 
      }
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

    processTouchInputDown(e) { 
      this.touchX = e.changedTouches[0].clientX
      this.touchY = e.changedTouches[0].clientY
      //console.log(this.touchX, this.touchY)
    }

    processTouchInputUp(e) { 
      const endX = e.changedTouches[0].clientX
      const endY = e.changedTouches[0].clientY

      const dx = endX - this.touchX 
      const dy = endY - this.touchY

      const hor = Math.abs(dx) > Math.abs(dy)

      if(hor) {
        this.game.processInput(dx > 0 ? "arrowright" : "arrowleft")
      }else { 
        this.game.processInput(dy > 0 ? "arrowdown" : "arrowup")
      }

      console.log(dx,dy)

    }
  
  }
