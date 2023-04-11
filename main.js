
let trianglePoints = []
let points = []
let ITERATIONS = 1
let DELAY = 1000
let INIT_FRAME_RATE = 60
let LERP_VAL_INCR = 1 / (INIT_FRAME_RATE * DELAY / 1000)
let IS_STARTED = false

let speedSlider
let sizeSlider

const startBtn = document.getElementById('start')
const clearBtn = document.getElementById('clear-points')
const pointsLabel = document.getElementById('points')
const fpsLabel = document.getElementById('framerate')


class AnimatedLine{
    constructor(){
        this.point1 = createVector(-100,-100)
        this.point2 = createVector(-100,-100)
        this.mid = createVector(-100,-100)
        this.previousPoint = createVector(-100,-100)
        this.lerpVal = 0
    }
    show(){
        stroke(222,1,1)
        strokeWeight(2)
        let lerpPos1 = p5.Vector.lerp(this.point1, this.mid, this.lerpVal)
        line(this.point1.x, this.point1.y, lerpPos1.x, lerpPos1.y)
        stroke(1,111,1)
        let lerpPos2 = p5.Vector.lerp(this.point2, this.mid, this.lerpVal)
        line(this.point2.x, this.point2.y, lerpPos2.x, lerpPos2.y)
        strokeWeight((sizeSlider.value()+20) * (1 - this.lerpVal))
        point(this.previousPoint.x, this.previousPoint.y)
        stroke(222,1,1)
        strokeWeight(20 * (1 - this.lerpVal))
        point(this.point1.x, this.point1.y)
        
        if(this.lerpVal<1) this.lerpVal += LERP_VAL_INCR
        if(this.lerpVal>=1) this.lerpVal = 1
    }    
}
let animatedLine 
function setup() {
    frameRate(INIT_FRAME_RATE)
    createCanvas(innerWidth, innerHeight);

    speedSlider = createSlider(1, 100, 1, 1);
    speedSlider.position(80, 20);
    speedSlider.style('width', '100px');
    speedSlider.input(updateSpeed);

    sizeSlider = createSlider(1, 40, 4, 1);
    sizeSlider.position(80, 50);
    sizeSlider.style('width', '100px');

    trianglePoints.push({x:window.innerWidth/2, y:70})
    trianglePoints.push({x:window.innerWidth/2 - 250, y:Math.min(window.innerHeight-150, 600)})
    trianglePoints.push({x:window.innerWidth/2 + 250, y:Math.min(window.innerHeight-150, 600)})
    points.push({x:window.innerWidth/2 + 40, y:Math.min(window.innerHeight-150, 600)- 40})
    animatedLine = new AnimatedLine()

}

function draw() {
    background(220);
    showTriangle()
    showPoints()
    if(IS_STARTED) animatedLine.show()
}

function addPoint(){
    index = getRandomVertexIndex()
    newPoint = {
        x: (trianglePoints[index].x + points.at(-1).x) / 2,
        y: (trianglePoints[index].y + points.at(-1).y) / 2
    }
    animatedLine.lerpVal = 0
    animatedLine.point1.x = trianglePoints[index].x
    animatedLine.point1.y = trianglePoints[index].y
    animatedLine.point2.x = points.at(-1).x
    animatedLine.point2.y = points.at(-1).y
    animatedLine.mid.x = newPoint.x
    animatedLine.mid.y = newPoint.y
    animatedLine.previousPoint.x = points.at(points.length-1).x
    animatedLine.previousPoint.y = points.at(points.length-1).y
    points.push(newPoint)
    updateStats()
}

function getRandomVertexIndex() {
    // generate a random integer between 0 and 2
    return Math.floor(Math.random() * 3);
  }

function showPoints(){
    strokeWeight(sizeSlider.value())
    stroke(1,111,1)
    let l
    if(points.length == 1) l = 1
    else l = points.length - 1
    for(let i=0; i<l ; i++){
        point(points[i].x, points[i].y)
    }
}
function showTriangle(){
    fill(255)
    noStroke()
    triangle(trianglePoints[0].x, trianglePoints[0].y, trianglePoints[1].x, trianglePoints[1].y, trianglePoints[2].x, trianglePoints[2].y, )
    strokeWeight(5)
    stroke(222,11,11)
    for(let i=0; i<trianglePoints.length; i++){
        point(trianglePoints[i].x, trianglePoints[i].y)
    }
}

function updateSpeed(){
    DELAY = 1000 / speedSlider.value()
    LERP_VAL_INCR = 1 / (frameRate() * DELAY / 1000)
    if(speedSlider.value() < 100) ITERATIONS = 1
    else ITERATIONS = 10
    if(IS_STARTED) startSimulation()
}

let intervalId
function startSimulation(){
    clearInterval(intervalId)
    intervalId = setInterval( () => {
        for(let i=0; i<ITERATIONS; i++){
            addPoint()
        }
    }, DELAY);
}
function stopSimulation(){
    clearInterval(intervalId)
}

function updateStats(){
    pointsLabel.innerHTML = "Points: "+points.length
    fpsLabel.innerHTML = "Framerate: "+ Math.round(frameRate())+"fps"
}

startBtn.addEventListener('click', ()=>{
    if(IS_STARTED) {
        IS_STARTED = false
        startBtn.innerHTML = "Start"
        stopSimulation()
    }else{
        IS_STARTED = true
        startBtn.innerHTML = "Stop"
        startSimulation()
    }
})
clearBtn.addEventListener('click', ()=>{
    let temp = points[0]
    points = []
    points.push(temp)
    updateSpeed()
    updateStats()
})