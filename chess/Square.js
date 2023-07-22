class Square {
    constructor(x, y, size, colorset) {
      this.col = colorset[(x + y) % 2];
      this.x = x;
      this.y = y;
      this.size = size;
      this.coordinateName = String.fromCharCode(96 + x) + y;
      this.occupied = false;
      this.piece = new Piece(-100,x, y,-1);
      this.visioned = [0, 0];
      this.flipped = false;
    }
  
    drawIt() {
      stroke(200);
      fill(this.col);
      if (!this.flipped) {
        rect(boardSize - this.y * this.size, (this.x - 1) * this.size, this.size, this.size);
      } else {
        rect(boardSize - (9 - this.y) * this.size, (8 - this.x) * this.size, this.size, this.size);
      }
    }
  
    getVisioned(theBoard, side) {
      let count = 0;
      const pieces = theBoard.pieces;
      for (let i = 0; i < pieces.length; i++) {
        const piece = pieces[i];
        if (piece.sideId === side) {
          const vision = piece.detectVision(theBoard);
          for (let j = 0; j < vision.length; j++) {
            const square = vision[j];
            if (square.x === this.x && square.y === this.y) {
              count++;
              break;
            }
          }
        }
      }
      if (side === 1) this.visioned[0] = count;
      else this.visioned[1] = count;
      return count;
    }
  
    getValue() {
      const value = ((4.5 - Math.abs(4.5 - this.x)) + (4.5 - Math.abs(4.5 - this.y))) * 3;
      return value;
    }
  
    toString() {
      return this.coordinateName;
    }
  }
  