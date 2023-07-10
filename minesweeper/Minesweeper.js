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
let densMine=0.23;
let flagCount;
let blockCount;
let buttonCount;
let bestTime;
let fireworks;
let remainingBlocks;




function setup() {
  gameCanvas = createCanvas(800, 600);
  gameCanvas.parent("canvas-container");
  // canvasDiv = document.getElementById("canvas-container");
  // if(canvasDiv) canvasDiv.appendChild(gameCanvas);
  rows = 15;
  columns = 20;
  remainingBlocks = document.getElementById("remaining-blocks");
  updateRemainingBlocks();
  const slider = document.getElementById("slider");
  const saveButton = document.getElementById("saveButton"); 
  if(slider) slider.addEventListener("input", ()=>{
    document.getElementById("sliderValue").innerHTML = "Mine density is <strong>" + slider.value + "%</strong> ";
  });
  if(saveButton) saveButton.addEventListener("click", function() {
    densMine = parseInt(slider.value)/100;
    // Update the game variable using the slider value
    restart();
    console.log("mine density is ", densMine);
  });
  
  restart();
  chu = loadSound("minesweeper/data/chu.wav");
  yes = loadSound("minesweeper/data/yes.wav");
  hua = loadSound("minesweeper/data/hua.wav");
  bang = loadSound("minesweeper/data/bang.wav");
  wow = loadSound("minesweeper/data/wow.wav");
  ding = loadSound("minesweeper/data/ding.wav");
  for (let element of document.getElementsByClassName("p5Canvas")) {
    element.addEventListener("contextmenu", (e) => e.preventDefault());
  }
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
    const y = Math.floor(mouseY / sideL);
    const x = Math.floor(mouseX / sideL);
    const theBlock = blocks[y][x];
    //console.log(theBlock.colorCode);
    if (mouseButton === LEFT) {
      buttonCount++;
      lightBlock(y, x, 3);
    } else if (mouseButton === RIGHT) {
      buttonCount++;
    }
    if ( theBlock.getState() === Block.REVEALEDSTATE) {
      lightAround(y, x, 3);
    }
  }
}
function mouseReleased() {
    // when playing
    if (gameStage === 1) {
      const y = Math.floor(mouseY / sideL);
      const x = Math.floor(mouseX / sideL);
      let theBlock = blocks[y][x];
      if (mouseButton === LEFT) {
        buttonCount--;
        lightBlock(y, x, 0);
      } else if (mouseButton === RIGHT) {
        buttonCount--;
      }
      if (theBlock.getState() === Block.REVEALEDSTATE && countFlags(y, x) === theBlock.getNumber()) {
        flipAround(y, x);
      } else if (theBlock.getState() === Block.REVEALEDSTATE) {
        lightAround(y, x, 0);
      }
  
      if (theBlock.getState() !== Block.REVEALEDSTATE) {
        if (mouseButton === LEFT) {
          // first click stuff
          // println(clickCount);
          if (clickCount === 0) {
            startTime = hour() * 3600 + minute() * 60 + second();
            while (blocks[y][x].getNumber() !== 0) {
              reGenBlocks();
              // println(blocks[y][x].getNumber());
            }
          }
          theBlock = blocks[y][x];
          clickCount++;
          activateBlock(y, x);
        } else if (mouseButton === RIGHT) {
          chu.play();
          if (theBlock.getState() === Block.FLAGSTATE) {
            theBlock.setState(Block.ORIGSTATE);
            flagCount--;
          } else {
            theBlock.setState(Block.FLAGSTATE);
            flagCount++;
          }
        }
        /*else if(mouseButton == CENTER){
          if(theBlock.getState() == 2) flipAround(y,x);
        }*/
        // theBlock.drawIt();
      }
      updateRemainingBlocks();
      if (blockCount === rows * columns - numMine) {
        yes.play();
        gameStage = 3;
        for (let i = 0; i < 8; i++) {
          let ranSign = 1;
          if (random(2) > 1) ranSign = -1;
          let xs = random(10) * ranSign;
          let ys = -6 - random(8);
          let rs = xs * 0.05;
          let re = 140 + floor(random(100));
          let gr = 100 + floor(random(90));
          let bl = 100 + floor(random(90));
          fireworks.push(new Firework(rs, xs, ys, re, gr, bl));
        }
        endTime = hour() * 3600 + minute() * 60 + second();
      }
    }
  
    // when gameOver
    if (gameStage === 2) {
      drawAllMines();
      drawRestart();
      if (
        mouseX > width * 0.45 &&
        mouseX < width * 0.55 &&
        mouseY > height * 0.56 &&
        mouseY < height * 0.66
      ) {
        restart();
      }
    }
    if (gameStage === 3) {
      if (
        mouseX > width * 0.45 &&
        mouseX < width * 0.55 &&
        mouseY > height * 0.56 &&
        mouseY < height * 0.66
      ) {
        restart();
      } else {
        hua.play();
      }
      for (let i = 0; i < 8; i++) {
        let ranSign = 1;
        if (random(2) > 1) ranSign = -1;
        let xs = random(10) * ranSign;
        let ys = -6 - random(8);
        let rs = xs * 0.05;
        let re = 140 + floor(random(100));
        let gr = 100 + floor(random(90));
        let bl = 100 + floor(random(90));
        fireworks.push(new Firework(rs, xs, ys, re, gr, bl));
      }
    }
    console.log(rows * columns - numMine - blockCount);
  }
  
  function genField(numMine) {
    let f = new Array(rows).fill(0).map(() => new Array(columns).fill(0));
    for (let i = 0; i < numMine; i++) {
      let ran = floor(Math.random() * rows * columns);
      let row = floor(ran / columns);
      let column = ran % columns;
      if (f[row][column] === 0) {
        f[row][column] = -1;
      } else {
        i--;
      }
    }
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        if (f[i][j] === -1) {
          blocks[i][j].number = -1;
          //blocks[i][j].state = 3;
        }
      }
    }
    getNumbers();
  }
  function getNumbers() {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        if (blocks[i][j].number !== -1) {
          // not left most
          if (i !== 0) {
            if (j !== 0) {
              if (blocks[i - 1][j - 1].number === -1) blocks[i][j].number++;
            }
            if (j !== columns - 1) {
              if (blocks[i - 1][j + 1].number === -1) blocks[i][j].number++;
            }
            if (blocks[i - 1][j].number === -1) blocks[i][j].number++;
          }
          // not right most
          if (i !== rows - 1) {
            if (j !== 0) {
              if (blocks[i + 1][j - 1].number === -1) blocks[i][j].number++;
            }
            if (j !== columns - 1) {
              if (blocks[i + 1][j + 1].number === -1) blocks[i][j].number++;
            }
            if (blocks[i + 1][j].number === -1) blocks[i][j].number++;
          }
          // neutral
          if (j !== 0) {
            if (blocks[i][j - 1].number === -1) blocks[i][j].number++;
          }
          if (j !== columns - 1) {
            if (blocks[i][j + 1].number === -1) blocks[i][j].number++;
          }
        }
        // if(blocks[i][j].number>=0) blocks[i][j].state = 2;(toTest)
      }
    }
  }
  
  function triggerZero(i, j) {
    if (blocks[i][j].getState() === ORIGSTATE || blocks[i][j].getState() === 3) {
      blocks[i][j].setState(Block.REVEALEDSTATE);
      blockCount++;
      // println(blockCount);
      if (blocks[i][j].getNumber() === 0) {
        if (i !== 0) {
          if (j !== 0) {
            triggerZero(i - 1, j - 1);
          }
          if (j !== columns - 1) {
            triggerZero(i - 1, j + 1);
          }
          triggerZero(i - 1, j);
        }
        // not right most
        if (i !== rows - 1) {
          if (j !== 0) {
            triggerZero(i + 1, j - 1);
          }
          if (j !== columns - 1) {
            triggerZero(i + 1, j + 1);
          }
          triggerZero(i + 1, j);
        }
        // neutral
        if (j !== 0) {
          triggerZero(i, j - 1);
        }
        if (j !== columns - 1) {
          triggerZero(i, j + 1);
        }
      }
      // println(1); (ToTest)
    }
  }
  
  function countFlags(i, j) {
    let count = 0;
    if (i !== 0) {
      if (j !== 0) {
        if (blocks[i - 1][j - 1].getState() === Block.FLAGSTATE) count++;
      }
      if (j !== columns - 1) {
        if (blocks[i - 1][j + 1].getState() === Block.FLAGSTATE) count++;
      }
      if (blocks[i - 1][j].getState() === Block.FLAGSTATE) count++;
    }
    // not right most
    if (i !== rows - 1) {
      if (j !== 0) {
        if (blocks[i + 1][j - 1].getState() === Block.FLAGSTATE) count++;
      }
      if (j !== columns - 1) {
        if (blocks[i + 1][j + 1].getState() === Block.FLAGSTATE) count++;
      }
      if (blocks[i + 1][j].getState() === Block.FLAGSTATE) count++;
    }
    // neutral
    if (j !== 0) {
      if (blocks[i][j - 1].getState() === Block.FLAGSTATE) count++;
    }
    if (j !== columns - 1) {
      if (blocks[i][j + 1].getState() === Block.FLAGSTATE) count++;
    }
    return count;
  }
  function flipAround(i, j) {
    if (i !== 0) {
      if (j !== 0) {
        activateBlock(i - 1, j - 1);
      }
      if (j !== columns - 1) {
        activateBlock(i - 1, j + 1);
      }
      activateBlock(i - 1, j);
    }
    // not right most
    if (i !== rows - 1) {
      if (j !== 0) {
        activateBlock(i + 1, j - 1);
      }
      if (j !== columns - 1) {
        activateBlock(i + 1, j + 1);
      }
      activateBlock(i + 1, j);
    }
    // neutral
    if (j !== 0) {
      activateBlock(i, j - 1);
    }
    if (j !== columns - 1) {
      activateBlock(i, j + 1);
    }
  }
  
  function lightAround(i, j, state) {
    if (i !== 0) {
      if (j !== 0) {
        lightBlock(i - 1, j - 1, state);
      }
      if (j !== columns - 1) {
        lightBlock(i - 1, j + 1, state);
      }
      lightBlock(i - 1, j, state);
    }
    // not right most
    if (i !== rows - 1) {
      if (j !== 0) {
        lightBlock(i + 1, j - 1, state);
      }
      if (j !== columns - 1) {
        lightBlock(i + 1, j + 1, state);
      }
      lightBlock(i + 1, j, state);
    }
    // neutral
    if (j !== 0) {
      lightBlock(i, j - 1, state);
    }
    if (j !== columns - 1) {
      lightBlock(i, j + 1, state);
    }
  }
  
  function drawAllMines() {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        let theBlock = blocks[i][j];
        if (theBlock.getNumber() === -1) {
          if (theBlock.getState() === Block.ORIGSTATE) {
            theBlock.setState(Block.REVEALEDSTATE);
          }
        } else {
          if (theBlock.getState() === Block.FLAGSTATE) theBlock.drawCross();
        }
      }
    }
    skip = false;
  }
  
  function activateBlock(i, j) {
    let theBlock = blocks[i][j];
    if (theBlock.getState() === Block.ORIGSTATE || theBlock.getState() === 3) {//?
      if (theBlock.getNumber() === -1) {
        gameStage = 2;
        bang.play();
        endTime = hour() * 3600 + minute() * 60 + second();
      } else if (blockCount === rows * columns - numMine) {
      } else if (theBlock.getNumber() === 0) {
        triggerZero(i, j);
        wow.play();
      } else {
        blockCount++;
        ding.play();
      }
      // println(blockCount);
      theBlock.setState(Block.REVEALEDSTATE);
    }
  }
  
  function lightBlock(i, j, state) {
    let theBlock = blocks[i][j];
    if (
      theBlock.getState() !== state &&
      theBlock.getState() !== Block.REVEALEDSTATE &&
      theBlock.getState() !== Block.FLAGSTATE
    ) {
      theBlock.setState(state);
    }
  }
  function drawRestart() {
    //the rectangle
    fill(130, 130, 210, 130);
    noStroke();
    rect(width / 3, height / 4, width / 3, height / 2, 55);
  
    //the words
    let bestTimeString;
    if (bestTime === undefined) bestTimeString = "--";
    else bestTimeString = bestTime + "";
    textFont("Arial", width / 36);
    fill(0);
    text("Time: " + "--", width * 0.35, height * 0.35);
    text("Best Time: " + bestTimeString, width * 0.35, height * 0.42);
  
    //restart Button
    fill(color(60));
    noStroke();
    rect(width * 0.45, height * 0.56, width / 10, height * 0.1);
    fill(160, 70, 70, 200);
    text("Restart", width * 0.46, height * 0.62);
  }
  
  function restart() {
    gameStage = 1;
    flagCount = 0;
    blockCount = 0;
    clickCount = 0;
    numMine = round(rows * columns * densMine);
    sideL = height / rows;
    blocks = new Array(rows);
    fireworks = [];
    background(0);
    //instantiate each Block
    for (let i = 0; i < rows; i++) {
      blocks[i] = new Array(columns);
      for (let j = 0; j < columns; j++) {
        blocks[i][j] = new Block(j, i, height / rows);
      }
    }
    //generate mines and numbers
    genField(numMine);
  
    //draw the initial
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        blocks[i][j].drawIt();
      }
    }
  }
  
  function reGenBlocks() {
    //instantiate each Block
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        blocks[i][j] = new Block(j, i, height / rows);
      }
    }
    //generate mines and numbers
    genField(numMine);
  }
  
  function drawWinBoard() {
    //the rectangle
    fill(color(130, 130, 210, 130));
    noStroke();
    rect(width / 3, height / 4, width / 3, height / 2, 55);
  
    //the words
    let bestTimeString;
    if(!bestTime) bestTime = 0;
    let thisTime = endTime - startTime;
    if (thisTime < bestTime || bestTime === 0) {
      bestTime = thisTime;
    }
  
    if (bestTime === 0) bestTimeString = "--";
    else bestTimeString = bestTime + "";
    textFont("Times New Roman",width / 48);
    text("Click Anywhere for more FUN", width * 0.38, height * 0.29);
    fill(44, 66, 132);
    textFont("Arial", int(width / 36.0));
    text("Time: " + thisTime, width * 0.35, height * 0.35);
    text("Best Time: " + bestTimeString, width * 0.35, height * 0.42);
  
    //restart Button
    fill(color(60, 200));
    noStroke();
    rect(width * 0.45, height * 0.56, width / 10, height * 0.1);
    fill(0);
    text("Restart", width * 0.46, height * 0.62);
  }
  
  function drawMenu() {
    background(200);
  }    

  function updateRemainingBlocks(){
    remBlocks =  rows * columns - numMine;
    if(blockCount) remBlocks -= blockCount;
    if(remainingBlocks) remainingBlocks.innerHTML = "Blocks Remaining: " + remBlocks  + " ";
  }