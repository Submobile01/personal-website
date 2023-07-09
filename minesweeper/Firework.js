class Firework {
    constructor(rs, xs, ys, r, gr, b) {
      this.cenX = 400;
      this.cenY = 200;
      this.size = 30;
      this.angle = 0;
      this.rSpeed = rs;
      this.xSpeed = xs;
      this.ySpeed = ys;
      this.gravity = -0.44;
      this.col = color(r, gr, b);
    }
  
    drawIt() {
      let halfH = this.size / 2;
      let halfW = this.size / 5;
      noStroke();
      fill(this.col);
      quad(
        this.cenX - halfH * sin(this.angle), this.cenY + halfH * cos(this.angle),
        this.cenX - halfW * cos(this.angle), this.cenY - halfW * sin(this.angle),
        this.cenX + halfH * sin(this.angle), this.cenY - halfH * cos(this.angle),
        this.cenX + halfW * cos(this.angle), this.cenY + halfW * sin(this.angle)
      );
      quad(
        this.cenX - halfH * sin(this.angle + PI / 3), this.cenY + halfH * cos(this.angle + PI / 3),
        this.cenX - halfW * cos(this.angle + PI / 3), this.cenY - halfW * sin(this.angle + PI / 3),
        this.cenX + halfH * sin(this.angle + PI / 3), this.cenY - halfH * cos(this.angle + PI / 3),
        this.cenX + halfW * cos(this.angle + PI / 3), this.cenY + halfW * sin(this.angle + PI / 3)
      );
      quad(
        this.cenX - halfH * sin(this.angle + (2 * PI) / 3), this.cenY + halfH * cos(this.angle + (2 * PI) / 3),
        this.cenX - halfW * cos(this.angle + (2 * PI) / 3), this.cenY - halfW * sin(this.angle + (2 * PI) / 3),
        this.cenX + halfH * sin(this.angle + (2 * PI) / 3), this.cenY - halfH * cos(this.angle + (2 * PI) / 3),
        this.cenX + halfW * cos(this.angle + (2 * PI) / 3), this.cenY + halfW * sin(this.angle + (2 * PI) / 3)
      );
      this.cenX += this.xSpeed;
      this.cenY += this.ySpeed;
      this.ySpeed -= this.gravity;
      this.angle += this.rSpeed;
    }
  
    inBound() {
      if (this.cenY > height || this.cenX < 0 || this.cenX > width) return false;
      return true;
    }
  }
  function mouseReleased() {
    // when playing
    if (gameStage === 1) {
      const y = mouseY / sideL;
      const x = mouseX / sideL;
      let theBlock = blocks[y][x];
      if (mouseButton === LEFT) {
        buttonCount--;
        lightBlock(y, x, 0);
      } else if (mouseButton === RIGHT) {
        buttonCount--;
      }
      if (buttonCount === 1 && theBlock.getState() === 2 && countFlags(y, x) === theBlock.getNumber()) {
        flipAround(y, x);
      } else if (buttonCount === 1 && theBlock.getState() === 2) {
        lightAround(y, x, 0);
      }
  
      if (theBlock.getState() !== 2) {
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
          if (theBlock.getState() === 1) {
            theBlock.setState(0);
            flagCount--;
          } else {
            theBlock.setState(1);
            flagCount++;
          }
        }
        /*else if(mouseButton == CENTER){
          if(theBlock.getState() == 2) flipAround(y,x);
        }*/
        // theBlock.drawIt();
      }
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
    if (blocks[i][j].getState() === 0 || blocks[i][j].getState() === 3) {
      blocks[i][j].setState(2);
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
        if (blocks[i - 1][j - 1].getState() === 1) count++;
      }
      if (j !== columns - 1) {
        if (blocks[i - 1][j + 1].getState() === 1) count++;
      }
      if (blocks[i - 1][j].getState() === 1) count++;
    }
    // not right most
    if (i !== rows - 1) {
      if (j !== 0) {
        if (blocks[i + 1][j - 1].getState() === 1) count++;
      }
      if (j !== columns - 1) {
        if (blocks[i + 1][j + 1].getState() === 1) count++;
      }
      if (blocks[i + 1][j].getState() === 1) count++;
    }
    // neutral
    if (j !== 0) {
      if (blocks[i][j - 1].getState() === 1) count++;
    }
    if (j !== columns - 1) {
      if (blocks[i][j + 1].getState() === 1) count++;
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
          if (theBlock.getState() === 0) {
            theBlock.setState(2);
          }
        } else {
          if (theBlock.getState() === 1) theBlock.drawCross();
        }
      }
    }
    skip = false;
  }
  
  function activateBlock(i, j) {
    let theBlock = blocks[i][j];
    if (theBlock.getState() === 0 || theBlock.getState() === 3) {
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
      theBlock.setState(2);
    }
  }
  
  function lightBlock(i, j, state) {
    let theBlock = blocks[i][j];
    if (
      theBlock.getState() !== state &&
      theBlock.getState() !== 2 &&
      theBlock.getState() !== 1
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
    if (bestTime === 0) bestTimeString = "--";
    else bestTimeString = bestTime + "";
    f = createFont("Arial", width / 16, true);
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
    let thisTime = endTime - startTime;
    if (thisTime < bestTime || bestTime === 0) {
      bestTime = thisTime;
    }
  
    if (bestTime === 0) bestTimeString = "--";
    else bestTimeString = bestTime + "";
    f = createFont("Times New Roman", width / 48, true);
    fill(40);
    textFont(f);
    text("Click Anywhere for more FUN", width * 0.38, height * 0.29);
    f = createFont("Arial", int(width / 36.0), true);
    fill(44, 66, 132);
    textFont(f);
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