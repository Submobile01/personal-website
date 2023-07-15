class Piece {
    constructor(side, x, y, pieceID) {
      this.image;
      this.side = '';
      this.sideId = side;
      this.name = '';
      this.posX = x;
      this.posY = y;
      this.id = pieceID;
      this.material;
      this.value;
      this.selected = false;
      this.real = true;
      this.moved = false;
      this.justMoved = false;
      this.flipped = false;
      this.castling = 0;
      this.enpassant = false;
      this.promoY = 0;
      this.squares = []; //placeholder
      this.moveSquares = []; //moves
      this.visionSquares = []; //visions
      this.image = loadImage(this.side + this.name + ".png");
      this.selected = false;
      this.real = true;
      this.setMaterial();
    }
    
    cloneSelf() {
      return new Piece(this.sideId, this.posX, this.posY, this.id);
    }
    
    drawIt() {
      if (!this.selected) {
        if (!this.flipped) {
          image(this.image, (this.posX - 1) * squareSize, boardSize - this.posY * squareSize, squareSize, squareSize);
        } else {
          image(this.image, (8 - this.posX) * squareSize, boardSize - (9 - this.posY) * squareSize, squareSize, squareSize);
        }
      } else {
        image(this.image, mouseX - squareSize / 2, mouseY - squareSize / 2, squareSize, squareSize);
      }
    }
    
    setPos(x, y) {
      this.posX = x;
      this.posY = y;
    }
    
    setPos(square) {
      this.posX = square.x;
      this.posY = square.y;
    }
    
    setPieceName(id) {
      switch (id) {
        case ROOK:
          this.name = "Rook";
          break;
        case KNIGHT:
          this.name = "Knight";
          break;
        case BISHOP:
          this.name = "Bishop";
          break;
        case QUEEN:
          this.name = "Queen";
          break;
        case KING:
          this.name = "King";
          break;
        case PAWN:
          this.name = "Pawn";
          break;
        default:
          this.name = "None";
          break;
      }
    }
    
    checkLegal(theBoard, square) {
      if (this.sideId === theBoard.turn) {
        if (this.id === KING && this.castle(theBoard).contains(square)) {
          this.castling = square.x - this.posX;
          return true;
        }
        this.detectMoves(theBoard);
        if (this.moveSquares.includes(square)) return true;
        /*if (this.id === PAWN) {
          if (this.pawnPush(theBoard).contains(square)) return true;
          //if(
        }*/
      }
      return false;
    }
  
  threatened(theBoard) {
    for (let i = 0; i < theBoard.pieces.length; i++) {
      let piece = theBoard.pieces[i];
      if (piece.sideId !== this.sideId) {
        if (piece.detectVision(theBoard).includes(theBoard.squares[this.posY][this.posX])) return true;
      }
    }
    return false;
  }
  
  setSquaresVision(theBoard) {
    this.detectVision(theBoard);
    let ind = -1;
    if (this.sideId === 1) ind = 0;
    else if (this.sideId === -1) ind = 1;
    for (let i = 0; i < this.visionSquares.length; i++) {
      let square = this.visionSquares[i];
      square.visioned[ind] += 1;
    }
  }
  
  detectMoves(board) {
    this.squares = [];
    this.moveSquares = [];
    switch (this.id) {
      case ROOK:
        this.moveSquares = this.rookMoves(board, 1, 1);
        break;
      case KNIGHT:
        this.moveSquares = this.knightMoves(board);
        break;
      case BISHOP:
        this.moveSquares = this.bishopMoves(board, 1, 1);
        break;
      case QUEEN:
        this.moveSquares = this.queenMoves(board);
        break;
      case KING:
        this.moveSquares = this.kingMoves(board);
        this.moveSquares.push(...this.castle(board));
        break;
      case PAWN:
        this.moveSquares = this.pawnMoves(board);
        this.moveSquares.push(...this.pawnPush(board));
        break;
      default:
        //return false;
    }
    return this.moveSquares;
  }
  
  detectVision(board) {
    this.visionSquares = [];
    switch (this.id) {
      case ROOK:
        this.visionSquares = this.rookVision(board, 1, 1);
        break;
      case KNIGHT:
        this.visionSquares = this.knightVision(board);
        break;
      case BISHOP:
        this.visionSquares = this.bishopVision(board, 1, 1);
        break;
      case QUEEN:
        this.visionSquares = this.queenVision(board);
        break;
      case KING:
        this.visionSquares = this.kingVision(board);
        break;
      case PAWN:
        this.visionSquares = this.pawnVision(board);
        break;
      default:
        //return false;
    }
    return this.visionSquares;
  }
  rookMoves(theBoard, counter, direction) {
    let squares = [];
    //left
    if (direction === 1) {
      let square = theBoard.squares[this.posY][this.posX - counter];
      if (this.posX - counter < 1 || this.posX - counter > 8) { //when out of border
        counter = 1;
        direction++;
      } else if (square.occupied) {
        if (square.piece.sideId === this.sideId);
        else squares.push(square);
        counter = 1;
        direction++;
      } else {
        squares.push(square);
        this.rookMoves(theBoard, counter + 1, direction);
      }
    }
    //right
    if (direction === 2) {
      let square = theBoard.squares[this.posY][this.posX + counter];
      if (this.posX + counter < 1 || this.posX + counter > 8) { //when out of border
        counter = 1;
        direction++;
      } else if (square.occupied) {
        if (square.piece.sideId === this.sideId);
        else squares.push(square);
        counter = 1;
        direction++;
      } else {
        squares.push(square);
        this.rookMoves(theBoard, counter + 1, direction);
      }
    }
    //up
    if (direction === 3) {
      let square = theBoard.squares[this.posY + counter][this.posX];
      if (this.posY + counter < 1 || this.posY + counter > 8) { //when out of border
        counter = 1;
        direction++;
      } else if (square.occupied) {
        if (square.piece.sideId === this.sideId);
        else squares.push(square);
        counter = 1;
        direction++;
      } else {
        squares.push(square);
        this.rookMoves(theBoard, counter + 1, direction);
      }
    }
    //down
    if (direction === 4) {
      let square = theBoard.squares[this.posY - counter][this.posX];
      if (this.posY - counter < 1 || this.posY - counter > 8) { //when out of border
        counter = 1;
        direction++;
      } else if (square.occupied) {
        if (square.piece.sideId === this.sideId);
        else squares.push(square);
        counter = 1;
        direction++;
      } else {
        squares.push(square);
        this.rookMoves(theBoard, counter + 1, direction);
      }
    }
  
    return squares;
  }
  bishopMoves(theBoard, counter, direction) {
    let squares = [];
    //left up
    if (direction === 1) {
      let square = theBoard.squares[this.posY + counter][this.posX - counter];
      if (this.posX - counter < 1 || this.posX - counter > 8 || this.posY + counter < 1 || this.posY + counter > 8) { //when out of border
        counter = 1;
        direction++;
      } else if (square.occupied) {
        if (square.piece.sideId === this.sideId);
        else squares.push(square);
        counter = 1;
        direction++;
      } else {
        squares.push(square);
        this.bishopMoves(theBoard, counter + 1, direction);
      }
    }
    //right up
    if (direction === 2) {
      let square = theBoard.squares[this.posY + counter][this.posX + counter];
      if (this.posX + counter < 1 || this.posX + counter > 8 || this.posY + counter < 1 || this.posY + counter > 8) { //when out of border
        counter = 1;
        direction++;
      } else if (square.occupied) {
        if (square.piece.sideId === this.sideId);
        else squares.push(square);
        counter = 1;
        direction++;
      } else {
        squares.push(square);
        this.bishopMoves(theBoard, counter + 1, direction);
      }
    }
    //left down
    if (direction === 3) {
      let square = theBoard.squares[this.posY - counter][this.posX - counter];
      if (this.posX - counter < 1 || this.posX - counter > 8 || this.posY - counter < 1 || this.posY - counter > 8) { //when out of border
        counter = 1;
        direction++;
      } else if (square.occupied) {
        if (square.piece.sideId === this.sideId);
        else squares.push(square);
        counter = 1;
        direction++;
      } else {
        squares.push(square);
        this.bishopMoves(theBoard, counter + 1, direction);
      }
    }
    //right down
    if (direction === 4) {
      let square = theBoard.squares[this.posY - counter][this.posX + counter];
      if (this.posX + counter < 1 || this.posX + counter > 8 || this.posY - counter < 1 || this.posY - counter > 8) { //when out of border
        counter = 1;
        direction++;
      } else if (square.occupied) {
        if (square.piece.sideId === this.sideId);
        else squares.push(square);
        counter = 1;
        direction++;
      } else {
        squares.push(square);
        this.bishopMoves(theBoard, counter + 1, direction);
      }
    }
  
    return squares;
  }
  queenMoves(theBoard) {
    let squares = [];
    squares.push(...this.rookMoves(theBoard, 1, 1));
    squares.push(...this.bishopMoves(theBoard, 1, 1));
    return squares;
  }
  
  knightMoves(theBoard) {
    let squares = [];
    //from left slightly up clockwise
    if (this.onBoard(this.posY + 1, this.posX - 2)) {
      let square = theBoard.squares[this.posY + 1][this.posX - 2];
      if (square.occupied) {
        if (square.piece.sideId === this.sideId);
        else squares.push(square);
      } else squares.push(square);
    }
    if (this.onBoard(this.posY + 2, this.posX - 1)) {
      let square = theBoard.squares[this.posY + 2][this.posX - 1];
      if (square.occupied) {
        if (square.piece.sideId === this.sideId);
        else squares.push(square);
      } else squares.push(square);
    }
    if (this.onBoard(this.posY + 2, this.posX + 1)) {
      let square = theBoard.squares[this.posY + 2][this.posX + 1];
      if (square.occupied) {
        if (square.piece.sideId === this.sideId);
        else squares.push(square);
      } else squares.push(square);
    }
    if (this.onBoard(this.posY + 1, this.posX + 2)) {
      let square = theBoard.squares[this.posY + 1][this.posX + 2];
      if (square.occupied) {
        if (square.piece.sideId === this.sideId);
        else squares.push(square);
      } else squares.push(square);
    }
    if (this.onBoard(this.posY - 1, this.posX + 2)) {
      let square = theBoard.squares[this.posY - 1][this.posX + 2];
      if (square.occupied) {
        if (square.piece.sideId === this.sideId);
        else squares.push(square);
      } else squares.push(square);
    }
    if (this.onBoard(this.posY - 2, this.posX + 1)) {
      let square = theBoard.squares[this.posY - 2][this.posX + 1];
      if (square.occupied) {
        if (square.piece.sideId === this.sideId);
        else squares.push(square);
      } else squares.push(square);
    }
    if (this.onBoard(this.posY - 2, this.posX - 1)) {
      let square = theBoard.squares[this.posY - 2][this.posX - 1];
      if (square.occupied) {
        if (square.piece.sideId === this.sideId);
        else squares.push(square);
      } else squares.push(square);
    }
    if (this.onBoard(this.posY - 1, this.posX - 2)) {
      let square = theBoard.squares[this.posY - 1][this.posX - 2];
      if (square.occupied) {
        if (square.piece.sideId === this.sideId);
        else squares.push(square);
      } else squares.push(square);
    }
    return squares;
  }
  kingMoves(theBoard) {
    let squares = [];
    let square;
    //from left up clockwise
    if (this.onBoard(this.posY + 1, this.posX - 1)) {
      square = theBoard.squares[this.posY + 1][this.posX - 1];
      if (square.occupied) {
        if (square.piece.sideId === this.sideId);
        else squares.push(square);
      } else squares.push(square);
    }
    if (this.onBoard(this.posY + 1, this.posX)) {
      square = theBoard.squares[this.posY + 1][this.posX];
      if (square.occupied) {
        if (square.piece.sideId === this.sideId);
        else squares.push(square);
      } else squares.push(square);
    }
    if (this.onBoard(this.posY + 1, this.posX + 1)) {
      square = theBoard.squares[this.posY + 1][this.posX + 1];
      if (square.occupied) {
        if (square.piece.sideId === this.sideId);
        else squares.push(square);
      } else squares.push(square);
    }
    if (this.onBoard(this.posY, this.posX + 1)) {
      square = theBoard.squares[this.posY][this.posX + 1];
      if (square.occupied) {
        if (square.piece.sideId === this.sideId);
        else squares.push(square);
      } else squares.push(square);
    }
    if (this.onBoard(this.posY - 1, this.posX + 1)) {
      square = theBoard.squares[this.posY - 1][this.posX + 1];
      if (square.occupied) {
        if (square.piece.sideId === this.sideId);
        else squares.push(square);
      } else squares.push(square);
    }
    if (this.onBoard(this.posY - 1, this.posX)) {
      square = theBoard.squares[this.posY - 1][this.posX];
      if (square.occupied) {
        if (square.piece.sideId === this.sideId);
        else squares.push(square);
      } else squares.push(square);
    }
    if (this.onBoard(this.posY - 1, this.posX - 1)) {
      square = theBoard.squares[this.posY - 1][this.posX - 1];
      if (square.occupied) {
        if (square.piece.sideId === this.sideId);
        else squares.push(square);
      } else squares.push(square);
    }
    if (this.onBoard(this.posY, this.posX - 1)) {
      square = theBoard.squares[this.posY][this.posX - 1];
      if (square.occupied) {
        if (square.piece.sideId === this.sideId);
        else squares.push(square);
      } else squares.push(square);
    }
    return squares;
  }
  pawnMoves(theBoard) {
    let squares = [];
    let square;
    if (this.onBoard(this.posY + this.sideId, this.posX + 1)) {
      square = theBoard.squares[this.posY + this.sideId][this.posX + 1];
      if (square.occupied && square.piece.sideId !== this.sideId) squares.push(square); //need to add en passant
    }
    if (this.onBoard(this.posY + this.sideId, this.posX - 1)) {
      square = theBoard.squares[this.posY + this.sideId][this.posX - 1];
      if (square.occupied && square.piece.sideId !== this.sideId) squares.push(square); //need to add en passant
    }
    squares.push(...this.pawnEnPassant(theBoard));
    return squares;
  }
  
  pawnPush(theBoard) {
    let squares = [];
    let square;
    if (this.onBoard(this.posY + this.sideId, this.posX)) { //push once
      square = theBoard.squares[this.posY + this.sideId][this.posX];
      if (!square.occupied) {
        squares.push(square);
      }
    }
    if (this.onBoard(this.posY + this.sideId * 2, this.posX)) { //push twice
      square = theBoard.squares[this.posY + this.sideId * 2][this.posX];
      if ((this.sideId === 1 && this.posY === 2) || (this.sideId === -1 && this.posY === 7)) {
        if (!square.occupied) squares.push(square);
      }
    }
    return squares;
  }
  
  pawnEnPassant(theBoard) {
    let squares = [];
    let square;
    if (this.onBoard(this.posY + this.sideId, this.posX + 1)) {
      square = theBoard.squares[this.posY][this.posX + 1];
      if (square.occupied && square.piece.justMoved && square.piece.sideId !== this.sideId) {
        if (this.posY === 4 || this.posY === 5) {
          squares.push(theBoard.squares[this.posY + this.sideId][this.posX + 1]);
          this.enpassant = true;
        }
      }
    }
    if (this.onBoard(this.posY + this.sideId, this.posX - 1)) {
      square = theBoard.squares[this.posY][this.posX - 1];
      if (square.occupied && square.piece.justMoved && square.piece.sideId !== this.sideId) {
        if (this.posY === 4 || this.posY === 5) {
          squares.push(theBoard.squares[this.posY + this.sideId][this.posX - 1]);
          this.enpassant = true;
        }
      }
    }
    return squares;
  }
  
  castle(theBoard) {
    let squares = [];
    let square1, square2;
    //short castle
    if (this.onBoard(this.posY, this.posX + 2)) {
      square2 = theBoard.squares[this.posY][this.posX + 2];
      square1 = theBoard.squares[this.posY][this.posX + 1];
      if (!this.moved && !theBoard.squares[this.posY][8].piece.moved)
        if (!square1.occupied && !square2.occupied) {
          if (square1.getVisioned(theBoard, this.sideId * -1) === 0 && square2.getVisioned(theBoard, this.sideId * -1) === 0)
            squares.push(square2);
        }
    }
    //long castle
    if (this.onBoard(this.posY, this.posX - 2)) {
      square2 = theBoard.squares[this.posY][this.posX - 2];
      square1 = theBoard.squares[this.posY][this.posX - 1];
      if (!this.moved && !theBoard.squares[this.posY][1].piece.moved)
        if (!square1.occupied && !square2.occupied) {
          if (square1.getVisioned(theBoard, this.sideId * -1) === 0 && square2.getVisioned(theBoard, this.sideId * -1) === 0)
            squares.push(square2);
        }
    }
    return squares;
  }
  
  getCastleRook(theBoard) {
    let y = this.posY;
    let x = 0;
    if (this.castling === 2) x = 8;
    else if (this.castling === -2) x = 1;
    for (let i = 0; i < theBoard.pieces.length; i++) {
      let piece = theBoard.pieces[i];
      if (piece.posX === x && piece.posY === y) return piece;
    }
    return null;
  }
  rookVision(theBoard, counter, direction) {
    if (direction === 1) { // left
      let square = theBoard.squares[posY][posX - counter];
      if (posX - counter < 1 || posX - counter > 8) { // when out of border
        counter = 1;
        direction++;
      } else if (square.occupied) {
        visionSquares.push(square);
        counter = 1;
        direction++;
      } else {
        visionSquares.push(square);
        rookVision(theBoard, counter + 1, direction);
      }
    }
    if (direction === 2) { // right
      let square = theBoard.squares[posY][posX + counter];
      if (posX + counter < 1 || posX + counter > 8) { // when out of border
        counter = 1;
        direction++;
      } else if (square.occupied) {
        visionSquares.push(square);
        counter = 1;
        direction++;
      } else {
        visionSquares.push(square);
        rookVision(theBoard, counter + 1, direction);
      }
    }
    if (direction === 3) { // up
      let square = theBoard.squares[posY + counter][posX];
      if (posY + counter < 1 || posY + counter > 8) { // when out of border
        counter = 1;
        direction++;
      } else if (square.occupied) {
        visionSquares.push(square);
        counter = 1;
        direction++;
      } else {
        visionSquares.push(square);
        rookVision(theBoard, counter + 1, direction);
      }
    }
    if (direction === 4) { // down
      let square = theBoard.squares[posY - counter][posX];
      if (posY - counter < 1 || posY - counter > 8) { // when out of border
        counter = 1;
        direction++;
      } else if (square.occupied) {
        visionSquares.push(square);
        counter = 1;
        direction++;
      } else {
        visionSquares.push(square);
        rookVision(theBoard, counter + 1, direction);
      }
    }
  
    return visionSquares;
  }

  
    bishopVision(theBoard, counter, direction) {
      if (direction === 1) { // left up
        let square = theBoard.squares[posY + counter][posX - counter];
        if (posX - counter < 1 || posX - counter > 8 || posY + counter < 1 || posY + counter > 8) {
          counter = 1;
          direction++;
        } else if (square.occupied) {
          visionSquares.push(square);
          counter = 1;
          direction++;
        } else {
          visionSquares.push(square);
          this.bishopVision(theBoard, counter + 1, direction);
        }
      }
      if (direction === 2) { // right up
        let square = theBoard.squares[posY + counter][posX + counter];
        if (posX + counter < 1 || posX + counter > 8 || posY + counter < 1 || posY + counter > 8) {
          counter = 1;
          direction++;
        } else if (square.occupied) {
          visionSquares.push(square);
          counter = 1;
          direction++;
        } else {
          visionSquares.push(square);
          this.bishopVision(theBoard, counter + 1, direction);
        }
      }
      if (direction === 3) { // left down
        let square = theBoard.squares[posY - counter][posX - counter];
        if (posX - counter < 1 || posX - counter > 8 || posY - counter < 1 || posY - counter > 8) {
          counter = 1;
          direction++;
        } else if (square.occupied) {
          visionSquares.push(square);
          counter = 1;
          direction++;
        } else {
          visionSquares.push(square);
          this.bishopVision(theBoard, counter + 1, direction);
        }
      }
      if (direction === 4) { // right down
        let square = theBoard.squares[posY - counter][posX + counter];
        if (posX + counter < 1 || posX + counter > 8 || posY - counter < 1 || posY - counter > 8) {
          counter = 1;
          direction++;
        } else if (square.occupied) {
          visionSquares.push(square);
          counter = 1;
          direction++;
        } else {
          visionSquares.push(square);
          this.bishopVision(theBoard, counter + 1, direction);
        }
      }
  
      return visionSquares;
    }
  
    queenVision(theBoard) {
      this.rookVision(theBoard, 1, 1);
      this.bishopVision(theBoard, 1, 1);
      return visionSquares;
    }
  
    knightVision(theBoard) {
        let square;
        
        // From left slightly up clockwise
        if (this.onBoard(posY + 1, posX - 2)) {
            square = theBoard.squares[posY + 1][posX - 2];
            if (square.occupied) {
            //if (square.piece.side != this.side);
            //else 
            visionSquares.push(square);
            } else {
            visionSquares.push(square);
            }
        }
        if (this.onBoard(posY + 2, posX - 1)) {
            square = theBoard.squares[posY + 2][posX - 1];
            if (square.occupied) {
            //if (square.piece.side != this.side);
            //else 
            visionSquares.push(square);
            } else {
            visionSquares.push(square);
            }
        }
        if (this.onBoard(posY + 2, posX + 1)) {
            square = theBoard.squares[posY + 2][posX + 1];
            if (square.occupied) {
            //if (square.piece.side != this.side);
            //else 
            visionSquares.push(square);
            } else {
            visionSquares.push(square);
            }
        }
        if (this.onBoard(posY + 1, posX + 2)) {
            square = theBoard.squares[posY + 1][posX + 2];
            if (square.occupied) {
            //if (square.piece.side != this.side);
            //else 
            visionSquares.push(square);
            } else {
            visionSquares.push(square);
            }
        }
        if (this.onBoard(posY - 1, posX + 2)) {
            square = theBoard.squares[posY - 1][posX + 2];
            if (square.occupied) {
            //if (square.piece.side != this.side);
            //else 
            visionSquares.push(square);
            } else {
            visionSquares.push(square);
            }
        }
        if (this.onBoard(posY - 2, posX + 1)) {
            square = theBoard.squares[posY - 2][posX + 1];
            if (square.occupied) {
            //if (square.piece.side != this.side);
            //else 
            visionSquares.push(square);
            } else {
            visionSquares.push(square);
            }
        }
        if (this.onBoard(posY - 2, posX - 1)) {
            square = theBoard.squares[posY - 2][posX - 1];
            if (square.occupied) {
            //if (square.piece.side != this.side);
            //else 
            visionSquares.push(square);
            } else {
            visionSquares.push(square);
            }
        }
        if (this.onBoard(posY - 1, posX - 2)) {
            square = theBoard.squares[posY - 1][posX - 2];
            if (square.occupied) {
            //if (square.piece.side != this.side);
            //else 
            visionSquares.push(square);
            } else {
            visionSquares.push(square);
            }
        }
        
        return visionSquares;
    }
    kingVision(theBoard) {
        let square;
      
        // From left up clockwise
        if (this.onBoard(posY + 1, posX - 1)) {
          square = theBoard.squares[posY + 1][posX - 1];
          if (square.occupied) {
            //if (square.piece.side != this.side);
            //else 
            visionSquares.push(square);
          } else {
            visionSquares.push(square);
          }
        }
        if (this.onBoard(posY + 1, posX)) {
          square = theBoard.squares[posY + 1][posX];
          if (square.occupied) {
            //if (square.piece.side != this.side);
            //else 
            visionSquares.push(square);
          } else {
            visionSquares.push(square);
          }
        }
        if (this.onBoard(posY + 1, posX + 1)) {
          square = theBoard.squares[posY + 1][posX + 1];
          if (square.occupied) {
            //if (square.piece.side != this.side);
            //else 
            visionSquares.push(square);
          } else {
            visionSquares.push(square);
          }
        }
        if (this.onBoard(posY, posX + 1)) {
          square = theBoard.squares[posY][posX + 1];
          if (square.occupied) {
            //if (square.piece.side != this.side);
            //else 
            visionSquares.push(square);
          } else {
            visionSquares.push(square);
          }
        }
        if (this.onBoard(posY - 1, posX + 1)) {
          square = theBoard.squares[posY - 1][posX + 1];
          if (square.occupied) {
            //if (square.piece.side != this.side);
            //else 
            visionSquares.push(square);
          } else {
            visionSquares.push(square);
          }
        }
        if (this.onBoard(posY - 1, posX)) {
          square = theBoard.squares[posY - 1][posX];
          if (square.occupied) {
            //if (square.piece.side != this.side);
            //else 
            visionSquares.push(square);
          } else {
            visionSquares.push(square);
          }
        }
        if (this.onBoard(posY - 1, posX - 1)) {
          square = theBoard.squares[posY - 1][posX - 1];
          if (square.occupied) {
            //if (square.piece.side != this.side);
            //else 
            visionSquares.push(square);
          } else {
            visionSquares.push(square);
          }
        }
        if (this.onBoard(posY, posX - 1)) {
          square = theBoard.squares[posY][posX - 1];
          if (square.occupied) {
            //if (square.piece.side != this.side);
            //else 
            visionSquares.push(square);
          } else {
            visionSquares.push(square);
          }
        }
      
        return visionSquares;
      }
      
      pawnVision(theBoard) {
        let square;
      
        if (this.onBoard(posY + sideId, posX + 1)) {
          square = theBoard.squares[posY + sideId][posX + 1];
          //if (square.occupied && square.piece.sideId == this.sideId) squares.add(square);
          //else if (!square.occupied) 
          visionSquares.push(square);
        }
        if (this.onBoard(posY + sideId, posX - 1)) {
          square = theBoard.squares[posY + sideId][posX - 1];
          //if (square.occupied && square.piece.sideId == this.sideId) squares.add(square);
          //else if (!square.occupied) 
          visionSquares.push(square);
        }
      
        return visionSquares;
      }
      promoting(square) {
        if (id === PAWN) {
          if ((sideId === -1 && square.y === 1) || (sideId === 1 && square.y === 8)) {
            return true;
          }
        }
        return false;
      }
      
      moveToSquare(theBoard, square) {
        // Remove piece from original square
        square = theBoard.squares[square.y][square.x];
        theBoard.squares[posY][posX].piece = new Piece(posX, posY);
        theBoard.squares[posY][posX].occupied = false;
        selected = false;
        // Set internal position
        setPos(square);
        // Take pieces
        if (square.occupied) {
          theBoard.pieces.splice(theBoard.pieces.indexOf(square.piece), 1);
        }
        square.occupied = true;
        if (enpassant) {
          theBoard.pieces.splice(theBoard.pieces.indexOf(theBoard.squares[square.y - sideId][square.x].piece), 1);
          theBoard.squares[square.y - sideId][square.x].piece = new Piece(square.y - sideId, square.x);
        }
        for (let i = 0; i < theBoard.pieces.length; i++) {
          theBoard.pieces[i].justMoved = false;
          theBoard.pieces[i].enpassant = false;
        }
        //if(theBoard.mated()!=0) start = false;
        square.piece = this; // Add piece to square
        moved = true;
        justMoved = true;
        // Alternate turn
        theBoard.turn *= -1;
      }
      
      setMaterial() {
        switch (id) {
          case ROOK:
            material = 500;
            break;
          case KNIGHT:
            material = 320;
            break;
          case BISHOP:
            material = 330;
            break;
          case QUEEN:
            material = 900;
            break;
          case KING:
            material = 20000;
            break;
          case PAWN:
            material = 100;
            break;
          default:
            material = 0;
            break;
        }
      }
      setValue(theBoard) {
        let posMat;
        value = sideId * material;
        switch (id) {
          case ROOK:
            posMat = [
              [0, 0, 0, 0, 0, 0, 0, 0],
              [5, 10, 10, 10, 10, 10, 10, 5],
              [-5, 0, 0, 0, 0, 0, 0, -5],
              [-5, 0, 0, 0, 0, 0, 0, -5],
              [-5, 0, 0, 0, 0, 0, 0, -5],
              [-5, 0, 0, 0, 0, 0, 0, -5],
              [-5, 0, 0, 0, 0, 0, 0, -5],
              [0, 0, 0, 5, 0, 5, 0, 0]
            ];
            if (sideId === 1) {
              value += sideId * posMat[8 - posY][8 - posX];
            } else {
              value += sideId * posMat[posY - 1][posX - 1];
            }
            break;
          case KNIGHT:
            posMat = [
              [-50, -40, -30, -30, -30, -30, -40, -50],
              [-40, -20, 0, 0, 0, 0, -20, -40],
              [-30, 0, 10, 15, 15, 10, 0, -30],
              [-30, 5, 15, 20, 20, 15, 5, -30],
              [-30, 0, 15, 20, 20, 15, 0, -30],
              [-30, 5, 10, 15, 15, 10, 5, -30],
              [-40, -20, 0, 5, 5, 0, -20, -40],
              [-50, -40, -30, -30, -30, -30, -40, -50]
            ];
            value += sideId * posMat[posY - 1][posX - 1];
            break;
          case BISHOP:
            posMat = [
              [-20, -10, -10, -10, -10, -10, -10, -20],
              [-10, 0, 0, 0, 0, 0, 0, -10],
              [-10, 0, 5, 10, 10, 5, 0, -10],
              [-10, 5, 5, 10, 10, 5, 5, -10],
              [-10, 0, 10, 10, 10, 10, 0, -10],
              [-10, 10, 10, 10, 10, 10, 10, -10],
              [-10, 5, 0, 0, 0, 0, 5, -10],
              [-20, -10, -10, -10, -10, -10, -10, -20]
            ];
            value += sideId * posMat[posY - 1][posX - 1];
            break;
          case QUEEN:
            posMat = [
              [-20, -10, -10, -5, -5, -10, -10, -20],
              [-10, 0, 0, 0, 0, 0, 0, -10],
              [-10, 0, 5, 5, 5, 5, 0, -10],
              [-5, 0, 5, 5, 5, 5, 0, -5],
              [0, 0, 5, 5, 5, 5, 0, -5],
              [-10, 5, 5, 5, 5, 5, 0, -10],
              [-10, 0, 5, 0, 0, 0, 0, -10],
              [-20, -10, -10, -5, -5, -10, -10, -20]
            ];
            value += sideId * posMat[posY - 1][posX - 1];
            break;
          case KING:
            if (theBoard.materialCount(sideId * -1) > 21500) {
              posMat = [
                [-30, -40, -40, -50, -50, -40, -40, -30],
                [-30, -40, -40, -50, -50, -40, -40, -30],
                [-30, -40, -40, -50, -50, -40, -40, -30],
                [-30, -40, -40, -50, -50, -40, -40, -30],
                [-20, -30, -30, -40, -40, -30, -30, -20],
                [-10, -20, -20, -20, -20, -20, -20, -10],
                [20, 20, 0, 0, 0, 0, 20, 20],
                [20, 30, 20, 0, 0, 10, 40, 20]
              ];
            } else {
              posMat = [
                [-50, -40, -30, -20, -20, -30, -40, -50],
                [-30, -20, -10, 0, 0, -10, -20, -30],
                [-30, -10, 20, 30, 30, 20, -10, -30],
                [-30, -10, 30, 40, 40, 30, -10, -30],
                [-30, -10, 30, 40, 40, 30, -10, -30],
                [-30, -10, 20, 30, 30, 20, -10, -30],
                [-30, -30, 0, 0, 0, 0, -30, -30],
                [-50, -30, -30, -30, -30, -30, -30, -50]
              ];
            }
            if (sideId === 1) {
              value += sideId * posMat[8 - posY][8 - posX];
            } else {
              value += sideId * posMat[posY - 1][posX - 1];
            }
            break;
          case PAWN:
            posMat = [
              [0, 0, 0, 0, 0, 0, 0, 0],
              [50, 50, 50, 50, 50, 50, 50, 50],
              [10, 10, 20, 30, 30, 20, 10, 10],
              [5, 5, 10, 25, 25, 10, 5, 5],
              [0, 0, 0, 20, 20, 0, 0, 0],
              [5, -5, -10, 0, 0, -10, -5, 5],
              [5, 10, 10, -20, -20, 10, 10, 5],
              [0, 0, 0, 0, 0, 0, 0, 0]
            ];
            if (sideId === 1) {
              value += sideId * posMat[8 - posY][8 - posY];
            } else {
              value += sideId * posMat[posY - 1][posX - 1];
            }
            break;
          default:
            break;
        }
      }
      diminishValue(theBoard) {
        const v = theBoard.squares[posY][posX].visioned;
        const visioned = v[0] - v[1];
        if (visioned === 0) {
          // Do nothing
        } else if (visioned === -1) {
          if (sideId === 1) {
            value /= 2;
          } else {
            value *= 1.2;
          }
        } else if (visioned === 1) {
          if (sideId === -1) {
            value /= 2;
          } else {
            value *= 1.2;
          }
        } else if (visioned <= -2) {
          if (sideId === 1) {
            value /= 4;
          } else {
            value *= 1.34;
          }
        } else if (visioned >= 2) {
          if (sideId === -1) {
            value /= 4;
          } else {
            value *= 1.34;
          }
        }
      }
      
      onBoard(y, x) {
        return !(x < 1 || x > 8 || y < 1 || y > 8);
      }
      
      toString() {
        return side + " " + name + " at " + board.squares[posY][posX];
      }
    }                          
                    