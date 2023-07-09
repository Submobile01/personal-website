let rows;
let columns;
let sideL;
let blocks;
let skip = false;
let f;
let chu;
let yes;
let hua;
let bang;
let wow;
let ding;
let gameStage; //1-game, 2-gameOver, 3-youWon
let startTime;
let endTime;
let clickCount = 0;
let numMine;
let densMine = 0.33;
let flagCount;
let blockCount;
let buttonCount;
let bestTime;
let fireworks;

function setup() {
  createCanvas(800, 600);
  rows = 15;
  columns = 20;
  restart();
  chu = loadSound("chu.wav");
  yes = loadSound("yes.wav");
  hua = loadSound("hua.wav");
  bang = loadSound("bang.wav");
  wow = loadSound("wow.wav");
  ding = loadSound("ding.wav");
}

function draw() {
  if (gameStage === 1) {

  } else if (gameStage === 2) {
    //drawRestart();
    //drawAllMines();
  } else {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        blocks[i][j].drawIt();
      }
    }
    drawWinBoard();
    for (let i = 0; i < fireworks.length; i++) {
      if (fireworks[i].inBound()) {
        fireworks[i].drawIt();
      }
    }
  }
}

function mouseMoved() {

}

function mouseClicked() {

}

function mousePressed() {
  if (gameStage === 1) {
    const y = mouseY / sideL;
    const x = mouseX / sideL;
    const theBlock = blocks[y][x];
    if (mouseButton === LEFT) {
      buttonCount++;
      lightBlock(y, x, 3);
    } else if (mouseButton === RIGHT) {
      buttonCount++;
    }
    if (buttonCount === 2 && theBlock.getState() === 2) {
      lightAround(y, x, 3);
    }
  }
}
