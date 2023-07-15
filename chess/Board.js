class Board {
    constructor() {
      this.colorset = []; // 0 light, 1 dark 
      this.size = boardSize;
      this.squares = [];
      this.pieces = [];
      this.turn = 1;
      this.eval = 0;
      this.flipped = false;
      
      this.colorset[0] = color(88, 170, 88);
      this.colorset[1] = color(240, 255, 240);
      
      this.setupSquares();
      this.setStandardPositions();
    }
    
    drawBoard() {
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          if (i === 0 || i === 10 || j === 0 || j === 10) continue;
          this.squares[i][j].drawIt();
        }
      }
      
      for (let i = 0; i < this.pieces.length; i++) {
        this.pieces[i].drawIt();
      }
    }
    
    flip() {
      for (let i = 1; i < 9; i++) {
        for (let j = 1; j < 9; j++) {
          this.squares[i][j].flipped = !this.squares[i][j].flipped;
        }
      }
      
      for (let i = 0; i < this.pieces.length; i++) {
        this.pieces[i].flipped = !this.pieces[i].flipped;
      }
      
      this.flipped = !this.flipped;
    }
    
    setupSquares() {
      for (let i = 0; i < 10; i++) {
        this.squares[i] = [];
        for (let j = 0; j < 10; j++) {
          this.squares[i][j] = new Square(i, j, size / 8, this.colorset);
        }
      }
    }
    
    getCoordinate() {
      let x = 1 + mouseX / (this.size / 8);
      let y = 8 - mouseY / (this.size / 8);
      
      if (!this.flipped) {
        return [x, y];
      } else {
        return [9 - x, 9 - y];
      }
    }
    
    getSquare() {
      let x = 1 + mouseX / (this.size / 8);
      let y = 8 - mouseY / (this.size / 8);
      
      if (!this.flipped) {
        return this.squares[y][x];
      } else {
        return this.squares[9 - y][9 - x];
      }
    }
    
    setStandardPositions() {
      for (let i = 20; i < 23; i++) {
        // normal pieces
        // white
        this.pieces.push(new Piece(1, i - 19, 1, i));
        this.pieces.push(new Piece(1, 9 - (i - 19), 1, i));
        // black
        this.pieces.push(new Piece(-1, i - 19, 8, i));
        this.pieces.push(new Piece(-1, 9 - (i - 19), 8, i));
      }
      
      // queen and king
      // white
      this.pieces.push(new Piece(1, 23 - 19, 1, QUEEN));
      this.pieces.push(new Piece(1, 24 - 19, 1, KING));
      // black
      this.pieces.push(new Piece(-1, 23 - 19, 8, QUEEN));
      this.pieces.push(new Piece(-1, 24 - 19, 8, KING));
      
      // pawns
      // white
      for (let i = 1; i < 9; i++) {
        this.pieces.push(new Piece(1, i, 2, PAWN));
      }
      // black
      for (let i = 1; i < 9; i++) {
        this.pieces.push(new Piece(-1, i, 7, PAWN));
      }
      
      this.fillSquares();
      
      // set turn to white
      this.turn = 1;
    }
  
    clonePieces() {
        let newPieces = [];
        for (let i = 0; i < this.pieces.length; i++) {
        newPieces.push(this.pieces[i].cloneSelf());
        }
        return newPieces;
    }
    
    checked() {
        for (let i = 0; i < this.pieces.length; i++) {
        let piece = this.pieces[i];
        if (piece.id === KING && piece.sideId !== this.turn) {
            return piece.threatened(this);
        }
        }
        return false;
    }
    
    checked(side) {
        for (let i = 0; i < this.pieces.length; i++) {
        let piece = this.pieces[i];
        if (piece.id === KING && piece.sideId === this.turn) {
            return piece.threatened(this);
        }
        }
        return false;
    }
    
    mated() {
        for (let i = 0; i < this.pieces.length; i++) {
        let piece = this.pieces[i];
        if (piece.sideId === this.turn) {
            piece.detectMoves(this);
            for (let j = 0; j < piece.moveSquares.length; j++) {
            let square = piece.moveSquares[j];
            if (!this.getMoved(piece, square).checked()) {
                return 0;
            }
            }
        }
        }
        if (this.checked(1)) {
        return 1;
        } else {
        return 2;
        }
    }
    
    select() {
        let square = this.getSquare();
        if (square.occupied) {
        square.piece.selected = true;
        selectedPiece = square.piece;
        }
    }
    
    deselect() {
        let square = this.getSquare();
        if (selectedPiece.real) {
        if (selectedPiece.checkLegal(board, square) && !this.getMoved(selectedPiece, square).checked()) {
            if (selectedPiece.promoting(square)) {
            this.pieces.splice(this.pieces.indexOf(selectedPiece), 1);
            selectedPiece = new Piece(selectedPiece.sideId, selectedPiece.posX, selectedPiece.posY, QUEEN);
            this.pieces.push(selectedPiece);
            }
            selectedPiece.moveToSquare(this, square);
            if (selectedPiece.castling === 2 || selectedPiece.castling === -2) {
            let rook = selectedPiece.getCastleRook(this);
            rook.moveToSquare(this, squares[selectedPiece.posY][selectedPiece.posX - selectedPiece.castling / 2]);
            this.turn *= -1;
            selectedPiece.castling = 0;
            }
            selectedPiece = new Piece(0, 0);
        } else {
            selectedPiece.selected = false;
            selectedPiece = new Piece(0, 0);
        }
        let mated = this.mated();
        println("checkmate: " + (mated === 1));
        println("stalemate: " + (mated === 2));
        }
    }
    deselect(selectedPiece, square) {
        if (selectedPiece.real) {
        if (selectedPiece.id === KING) {
            if (selectedPiece.castle(this).contains(square)) {
            selectedPiece.castling = square.x - selectedPiece.posX;
            }
        }
        
        if (selectedPiece.promoting(square)) {
            this.pieces.splice(this.pieces.indexOf(selectedPiece), 1);
            selectedPiece = new Piece(selectedPiece.sideId, selectedPiece.posX, selectedPiece.posY, QUEEN);
            this.pieces.push(selectedPiece);
        }
        
        selectedPiece.moveToSquare(this, square);
        
        if (selectedPiece.castling === 2 || selectedPiece.castling === -2) {
            let rook = selectedPiece.getCastleRook(this);
            rook.moveToSquare(this, squares[selectedPiece.posY][selectedPiece.posX - selectedPiece.castling / 2]);
            this.turn *= -1;
            selectedPiece.castling = 0;
        }
        
        //selectedPiece = new Piece(0, 0);
        else {
            //selectedPiece.selected = false;
            //selectedPiece = new Piece(0, 0);
        }
        
        //int mated = mated();
        //println("checkmate: " + (mated == 1));
        //println("stalemate: " + (mated == 2));
        }
    }
    
    fillSquares() {
        for (let i = 0; i < this.pieces.length; i++) {
        let piece = this.pieces[i];
        let posX = piece.posX;
        let posY = piece.posY;
        this.squares[posY][posX].piece = piece;
        this.squares[posY][posX].occupied = true;
        }
    }
    
    getMoved(piece, toSquare) {
        let newBoard = new Board(this.clonePieces());
        newBoard.turn = this.turn;
        let ind = pieces.indexOf(piece);
        newBoard.deselect(newBoard.pieces[ind], toSquare);
        return newBoard;
    }
    
    evaluate() {
        this.eval = 0;
        
        // simple stuff
        for (let i = 0; i < this.pieces.length; i++) {
        let piece = this.pieces[i];
        piece.setValue(this);
        this.eval += piece.value;
        }
        
        return this.eval;
    }
    
    materialCount(side) {
        let count = 0;
        for (let i = 0; i < this.pieces.length; i++) {
        let piece = this.pieces[i];
        if (piece.sideId === side) {
            count += piece.material;
        }
        }
        return count;
    }
}
      