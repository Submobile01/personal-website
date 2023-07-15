const boardSize = 800;
const squareSize = boardSize / 8;
const WHITE = 1;
const BLACK = -1;
const ROOK = 20;
const KNIGHT = 21;
const BISHOP = 22;
const QUEEN = 23;
const KING = 24;
const PAWN = 25;
let board;
let selectedPiece = new Piece(0, 0);
let ai;
let ai2;
let evalBar;
let start;

function setup() {
  createCanvas(800, 800);
  board = new Board();
  ai = new AI(2, -1);
  //ai2 = new AI(3, 1);
  //background(128, 233, 83);
}

function draw() {
  board.drawBoard();
  if (start) {
    ai.move(board);
    //ai2.move(board);
  }
  //println("turn is " + board.turn);
}

function mousePressed() {
  if (mouseButton === LEFT) {
    start = true;
    board.select();
    /*for(int i=0; i<board.pieces.size(); i++){
      Piece piece = board.pieces.get(i);
      piece.setSquaresVision(board);//dont forget there's no clear for square vision
      //piece.setValue();
    }*/
    let square = board.getSquare();
    println("move squares: " + square.piece.detectMoves(board));
    println("vision squares: " + square.piece.detectVision(board));
    println("piece value: " + square.piece.value);
    println("square controlled: " + square.visioned[0] + " and " + square.visioned[1]);
    //println(board.getSquare());
  } else { // remove piece for test
    board.pieces.splice(board.pieces.indexOf(board.getSquare().piece), 1);
    board.getSquare().piece = new Piece(0, 0);
    board.getSquare().occupied = false;
  }
}

function mouseReleased() {
  if (mouseButton === LEFT) {
    board.deselect();

    //print(board.turn);
  }
}

function keyPressed() {
  if (key === 'r') {
    board.flip();
  }
  if (key === 'e') {
    board.evaluate();
    println(-1 + " material count: " + board.materialCount(-1));
    println("eval: " + board.score);
  }
}
