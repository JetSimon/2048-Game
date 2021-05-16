function gridsAreSame(g1, g2) {
    for(let y = 0; y < g1.length; y++) {
        for(let x = 0; x < g1.length; x++) {
            if (g1[y][x] != g2[y][x]) {
                return false
            }
        }
    }

    return true
}

function drawGridLines(ctx, grid) {
    let isDark = false
    for (let y = 0; y < grid.length; y++) { 
        isDark = !isDark
        for (let x = 0; x < grid.length; x++) {

            const sideLength = canvas.width / grid.length

            let yPos = y * sideLength
            let xPos = x * sideLength
            
            ctx.beginPath()
            ctx.fillStyle = isDark ? 'lightgray' : 'aliceblue'
            isDark = !isDark
            ctx.rect(xPos, yPos, sideLength, sideLength)
            ctx.fill()

        }
    }

    //Commented this out because no lines looks cleaner, but keeping squares. Should update function name :s
    /*for (let y = 0; y < grid.length+1; y++) {   
        let pos = y * ((canvas.width / grid.length))
        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, canvas.height);
        ctx.stroke();  
    }
    
    for (let x = 0; x < grid.length+1; x++) {   
        let pos = x * ((canvas.height / grid.length))
        ctx.beginPath();
        ctx.moveTo(0,pos);
        ctx.lineTo(canvas.height, pos);
        ctx.stroke();     
    }*/
}

function findClearSpot(grid) {
    let seen = new Set()
    for(let y = 0; y < grid.length; y++) {
        for(let x = 0; x < grid.length; x++) {
            let x
            let y
            do {
                y = Math.floor(Math.random() * grid.length)
                x = Math.floor(Math.random() * grid.length)
                seen.add(grid.length*y+x)
                
                if(seen.size >= grid.length * grid.length) {
                    console.log(seen.size)
                    return [false, false]
                }
                
            }while(grid[y][x])
            return [y,x]
        }
    }
}

function lerp (start, end, amt){
    return (1-amt)*start+amt*end
}

function isClose(one, two, radius) {
  max = Math.abs(Math.max(one, two))
  min = Math.abs(Math.min(one, two))

  return max - min <= radius
}

function addNewTile(grid, imageDict) {
    let [y, x] = findClearSpot(grid)

    if(y === false || x === false) return false;
    grid[y][x] = new Tile(imageDict)
    grid[y][x].setPos(x, y)
}
