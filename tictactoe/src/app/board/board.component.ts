import { Component, OnInit } from "@angular/core";
//SMART COMPONENT (CHANGES STATE)
@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"]
})
export class BoardComponent implements OnInit {
  squares: any[];
  xIsNext: boolean;
  winner: string;

  constructor() {}

  //FOR SETUP
  ngOnInit() {
    this.newGame();
  }

  //ASSIGN VARS
  newGame() {
    this.squares = Array(9).fill(null);
    this.winner = null;
    this.xIsNext = true;
  }

  //COMPUTE PROPS BASED ON DATA
  //START WITH THE MAIN DATA

  //WHO MAKES THE FIRST MOVE?
  get player() {
    return this.xIsNext ? `X` : `O`;
  }

  //FIND METHOD FOR USER CLICK MOVE
  makeMove(idx: number) {
    //CHECK INDEX OF CLICKED IN ARR
    if (!this.squares[idx]) {
      this.squares.splice(idx, 1, this.player);
      this.xIsNext = !this.xIsNext;
    }
    this.winner = this.calculateWinner();
  }

  calculateWinner() {
    //WINNER BOARD PLACEMENTS
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 4, 8],
      [2, 4, 6],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8]
    ];

    //IF XXX OR OOO IN A ROW, DECIDE WINNER
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];

      if (
        this.squares[a] &&
        this.squares[a] === this.squares[b] &&
        this.squares[a] === this.squares[c]
      ) {
        return this.squares[a];
      }
    }
    return null;
  }
}
