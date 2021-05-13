// this file is responsible for bootstrapping game logic

// run this in closure to not pollute global scope
(async () => {
    // grab the canvas element 
    const handle = document.getElementById('canvas')
  
    // game options
    const options = {
      fps: 60
    }
  
    // init game with handle
    const container = new GameContainer(handle, options)
  
    // add input handler forward
    document.body.addEventListener('keydown', (event) => { event.preventDefault(); container.processInput(event.key.toLowerCase()) })
    document.body.addEventListener('touchstart', (_) => { event.preventDefault(); container.processInput(' ') })
  
    // start game
    await container.start()
  })()