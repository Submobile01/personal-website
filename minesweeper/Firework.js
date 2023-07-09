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
  