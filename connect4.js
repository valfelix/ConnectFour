/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  const matrixArr = [];
  for (let x = 0; x < WIDTH; x++) { // array of rows
    matrixArr.push(null); // push empty item
  };
  for (let y = 0; y < HEIGHT; y++) { // array of cells
    board.push([...matrixArr]); // spread
  };
  return board;
};

/** makeHtmlBoard: make HTML table and row of column tops. */
// dynamically creates the HTML table
function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById("board"); // assign table from html

  // TODO: add comment for this code
  const top = document.createElement("tr"); // create top row for table
  top.setAttribute("id", "column-top"); // give top row attribute for css
  top.addEventListener("click", handleClick); // give the top row click event listener 

  for (let x = 0; x < WIDTH; x++) { // loop through row to make 7 cells per row
    const headCell = document.createElement("td"); 
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // TODO: add comment for this code
  for (let y = 0; y < HEIGHT; y++) { // loop through table to make 6 rows
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`); // id attribute according to position on table
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  return board.filter( (row) => row[x] === null).length - 1; 
  // filter array by finding rows with null that don't have a piece yet and decrease length by 1 to get last one to place piece there
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const pieceDiv = document.createElement("div"); // make a new div in dom
  pieceDiv.classList.add("piece"); // add piece as class to new div
  pieceDiv.classList.add(`p${currPlayer}`); // add class for whether the current player is 1 or 2, like p1 or p2

  const tableCell = document.getElementById(`${y}-${x}`); // get id attribute from cell position on table from js53
  tableCell.append(pieceDiv); // add a div inside the correct td cell in the HTML game board
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id; // index

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  // add a check for “is the entire board filled” [hint: the JS every method on arrays would be especially nice here!]
  const checkForTie = board.every( (row) => row.every( (col) => col !== null));
  if (checkForTie) {
    endGame("It's a tie!");
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1; // ternary function to switch players
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  // this rechecks the same area of the board by iterating through table to check for 4 cells
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]; // 4 in a row: moving to the right on x axis once each time
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]]; // 4 in a row: moving up on y axis once each time
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]]; // 4 in diagonal row: moving up on x axis and y axis each time
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]]; // 4 in diagonal row: moving down on x axis and y axis each time

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) { // check if one of the 4 conditions is met, if so return true
        return true;
      }
    }
  }
}

makeBoard(); // make board after all code has run
makeHtmlBoard();
