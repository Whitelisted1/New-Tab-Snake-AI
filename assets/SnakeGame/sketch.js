// var blocksX = 160;
// var blocksY = 80;
var blocksX = 40;
// var blocksX = 16;
var blocksY = 20;

let maxBlocks = 1000;
// var blocksY = 8;
let blockSize;
let xOffset = 0;
let yOffset = 0;

let s;
let noDieMode = true;
let pause = false;

let speedMultiplier = 1;
let hc;
let outlineLength = 3;

let previousHeadPositions = [];


function setBlocks() {
    let testBlockSize = 1;
    while (true) {
        if (floor(canvas.width / testBlockSize) * floor(canvas.height / testBlockSize) < maxBlocks) {
            blockSize = testBlockSize;
            blocksX = floor(canvas.width / blockSize) - floor(canvas.width / blockSize) % 2;
            blocksY = floor(canvas.height / blockSize) - floor(canvas.height / blockSize) % 2;
            return;
        } else {
            testBlockSize++;
        }
    }
}
function setup() {
    window.canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    window.canvas.style('z-index', 1);
    setBlocks();
    blockSize = min(width / blocksX, height / blocksY);
    outlineLength = blockSize / 15;
    xOffset = (width - blockSize * blocksX) / 2.0;
    yOffset = (height - blockSize * blocksY) / 2.0;
    
    setTimeout(() => {
        s = new window.Snake();
        
        hc = new HamiltonianCycle(blocksX, blocksY);
        s.resetOnHamiltonian(hc.cycle);
        frameRate(30);
    }, 200);
}

// setTimeout(() => {


function resize(){
    resizeCanvas(windowWidth-18, windowHeight);
    blockSize = min(width / blocksX, height / blocksY);
    outlineLength = blockSize / 15;
    xOffset = (width - blockSize * blocksX) / 2.0;
    yOffset = (height - blockSize * blocksY) / 2.0;
    
    setup();
    window.ShowSearchBar();
}

var doit;
function windowResized() {
    clearTimeout(doit);
    doit = setTimeout(resize, 300);
}

function pauseUpdateColor() {
    background(20, 20, 20); // Background Color ( BEHIND window.Snake )
    
    fill(20, 20, 20);
    noStroke();
    
    fill(20, 20, 20); // Background Color ( BEHIND window.Snake BACKGROUND COLOR )
    rect(0, 0, width, yOffset);
    rect(0, 0, xOffset, height);
    rect(width, height, -width, -yOffset);
    rect(width, height, -xOffset, -height);
    
    translate(xOffset, yOffset);
    
    s.show();
}

function draw() {
    if (!pause && s != undefined) {
        background(20, 20, 20); // Background Color ( BEHIND window.Snake )
        
        textAlign(CENTER, CENTER);
        fill(20, 20, 20);
        noStroke();
        textSize(100);
        if (canvas.width > 700) {
            
            
            let newImageWidth = document.width;
            let widthRatio = document.height / document.width;
            
            let newImageHeight = widthRatio;
            newImageWidth *= 0.6;
            
            fill(20, 230);
            rect(canvas.width / 2 - newImageWidth / 2, canvas.height / 2 - newImageHeight / 2, newImageWidth, newImageHeight)
        }
        
        fill(20); // Border Color
        rect(0, 0, width, yOffset);
        rect(0, 0, xOffset, height);
        rect(width, height, -width, -yOffset);
        rect(width, height, -xOffset, -height);
        if (canvas.width > 700) {
            push();
            fill(255, 30);
            stroke(255, 80);
            noStroke();
            textSize(blockSize*0.4);
            textAlign(LEFT, CENTER);
            pop();
        }
        push();
        translate(xOffset, yOffset);
        
        fill(0);
        s.show();
        // hc.show();
        for (let i = 0; i < speedMultiplier; i++) {
            s.update();
            
        }
        pop();
        
        
    }
}


function keyPressed() {
    switch (keyCode) {
        // case UP_ARROW:
        //     s.velX = 0;
        //     s.velY = -1;
        //     pause = false;
        //     frameRate(30);
        //     break;
        // case DOWN_ARROW:
        //     s.velX = 0;
        //     s.velY = 1;
        //     pause = false;
        //     frameRate(10);
        //     break;
        // case LEFT_ARROW:
        //     if(pause) pause=false;
        //     else pause = true;
        
    }
    // switch (key) {
        //     case ' ':
        //         speedMultiplier = 10;
        //         break;
        
        // }
        
    }
    
    function keyReleased() {
        // switch (key) {
            //     case ' ':
            //         speedMultiplier = 1;
            // }
        }
        

// }, 1000);