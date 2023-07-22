class AI {
    constructor(depth, side) {
      this.depth = depth;
      this.side = side;
    }
    
    minimax(theBoard, depth, alpha, beta, pieceInd, squareInd) {
      let turn = theBoard.turn;
      
      if (depth === 0) {
        return [theBoard.evaluate(), pieceInd, squareInd];
      }
      
      if (turn === 1) {
        let maxScore = -100000;
        
        outer: for (let i = 0; i < theBoard.pieces.length; i++) {
          let piece = theBoard.pieces[i];
          
          if (piece.sideId === turn) {
            piece.detectMoves(theBoard);
            
            for (let j = 0; j < piece.moveSquares.length; j++) {
              let square = piece.moveSquares[j];
              let score = this.minimax(theBoard.getMoved(piece, square), depth - 1, alpha, beta, pieceInd, squareInd)[0];
              
              if (maxScore < score) {
                maxScore = score;
                pieceInd = i;
                squareInd = j;
              }
              
              if (alpha < score) {
                alpha = score;
              }
              
              if (alpha > beta) {
                break outer;
              }
            }
          }
        }
        
        return [maxScore, pieceInd, squareInd];
      } else if (turn === -1) {
        let minScore = 100000;
        
        outer: for (let i = 0; i < theBoard.pieces.length; i++) {
          let piece = theBoard.pieces[i];
          
          if (piece.sideId === turn) {
            piece.detectMoves(theBoard);
            
            for (let j = 0; j < piece.moveSquares.length; j++) {
              let square = piece.moveSquares[j];
              let score = this.minimax(theBoard.getMoved(piece, square), depth - 1, alpha, beta, pieceInd, squareInd)[0];
              
              if (minScore > score) {
                minScore = score;
                pieceInd = i;
                squareInd = j;
              }
              
              if (beta > score) {
                beta = score;
              }
              
              if (alpha > beta) {
                break outer;
              }
            }
          }
        }
        
        return [minScore, pieceInd, squareInd];
      }
      
      return [1.111, pieceInd, squareInd];
    }
    
    move(theBoard) {
      if (theBoard.turn === this.side) {
        let array = this.minimax(theBoard, this.depth, -100000, 100000, -1, -1);
        let piece = theBoard.pieces[Math.floor(array[1])];
        theBoard.deselect(piece, piece.moveSquares[Math.floor(array[2])]);
      }
    }
  }
  