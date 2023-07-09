class Block {
    constructor(x, y, l) {
      this.posX = x * l;
      this.posY = y * l;
      this.sideL = l;
      this.colorCode = false;
      this.state = 0; // 0-orig; 1-flag; 2-revealed(num/bomb)
      this.col = color(0, 255, 0);
      this.green = color(0, 255, 0);
      this.darkGreen = color(0, 230, 50);
      this.grey = color(140);
      this.white = color(240);
      this.red = color(255, 0, 0);
      this.number = 0; // surrounding mines(0-empty, -1-mine)
      this.f = createFont("Arial", 16, true);
    }
  
    drawIt() {
      noStroke();
      switch (this.state) {
        case 0:
          if (this.colorCode) this.col = this.green;
          else this.col = this.darkGreen;
          fill(this.col);
          rect(this.posX, this.posY, this.sideL, this.sideL);
          break;
        case 1:
          if (this.colorCode) this.col = this.green;
          else this.col = this.darkGreen;
          fill(this.col);
          rect(this.posX, this.posY, this.sideL, this.sideL);
          this.drawFlag();
          break;
        case 2:
          if (this.colorCode) this.col = this.white;
          else this.col = this.grey;
          fill(this.col);
          rect(this.posX, this.posY, this.sideL, this.sideL);
          if (this.number != -1) this.drawNumber();
          else {
            this.drawBomb();
          }
          break;
        case 3:
          if (this.colorCode) this.col = color(100, 255, 100);
          else this.col = color(20, 245, 20);
          fill(this.col);
          rect(this.posX, this.posY, this.sideL, this.sideL);
          break;
      }
    }
  
    drawNumber() {
      if (this.number != 0) {
        textFont(this.f, 20);
        fill(0);
        text(this.number, this.posX + this.sideL * 0.35, this.posY + this.sideL * 0.62);
      }
    }
  
    drawFlag() {
      fill(0);
      rect(this.posX + this.sideL / 3, this.posY + this.sideL / 6, 0.2, this.sideL * 2 / 3);
      fill(this.red);
      triangle(
        this.posX + this.sideL / 3, this.posY + this.sideL / 6,
        this.posX + this.sideL / 3, this.posY + this.sideL / 2,
        this.posX + this.sideL * 2 / 3, this.posY + this.sideL / 3
      );
    }
  
    drawBomb() {
      fill(color(0));
      circle(this.posX + this.sideL / 2, this.posY + this.sideL / 2, this.sideL * 0.4);
      line(this.posX + this.sideL * 0.6, this.posY + this.sideL / 3, this.posX + this.sideL * 0.8, this.posY + this.sideL / 8);
      this.drawSpark(this.posX + this.sideL * 0.8, this.posY + this.sideL / 8, this.sideL / 10);
    }
  
    drawSpark(cenX, cenY, size) {
      fill(this.red);
      triangle(cenX, cenY - size, cenX - 0.85 * size, cenY + 0.5 * size, cenX + 0.85 * size, cenY + 0.5 * size);
      triangle(cenX, cenY + size, cenX - 0.85 * size, cenY - 0.5 * size, cenX + 0.85 * size, cenY - 0.5 * size);
    }
  
    drawCross() {
      stroke(255);
      line(this.posX + this.sideL / 10, this.posY + this.sideL / 10, this.posX + this.sideL * 9 / 10, this.posY + this.sideL * 9 / 10);
      stroke(255);
      line(this.posX + this.sideL * 9 / 10, this.posY + this.sideL * 9 / 10, this.posX + this.sideL / 10, this.posY + this.sideL / 10);
    }
  
    setState(n) {
      this.state = n;
      this.drawIt();
    }
  
    setColor(r, g, b) {
      this.col = color(r, g, b);
    }
  
    setNumber(n) {
      this.number = n;
    }
  
    getState() {
      return this.state;
    }
  
    getNumber() {
      return this.number;
    }
  }
  