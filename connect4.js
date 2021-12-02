/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let start_again = false;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
let is_board_full = false;
let is_column_full = false;
const game_player_div = document.querySelector("#game_player")
const player_h3 = document.createElement("h3")

function randomRGB() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`
}
const letters = document.querySelectorAll('.letter');
const intervalId = setInterval(function () {
  for (let letter of letters) {
    letter.style.color = randomRGB();
  }
}, 1000);



function show_player(currPlayer){

  game_player_div.innerText = ""
   
  if(currPlayer === 1){
    game_player_div.classList.remove("currentplayer_p2")
    game_player_div.classList.add("currentplayer_p1")
    player_h3.innerText = `Player ${currPlayer}'s turn!`
    game_player_div.appendChild(player_h3)
  }
  else{
    game_player_div.classList.remove("currentplayer_p1")
    game_player_div.classList.add("currentplayer_p2")
    player_h3.innerText = `Player ${currPlayer}'s turn!`
    game_player_div.appendChild(player_h3)
  }
  

}





/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  for(let y=0;y<HEIGHT;y++){
    board[y] = []
    for (let x=0;x<WIDTH ;x++){
        
        board[y].push(null);
      }}
      console.log(board);
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  
  game_player_div.classList.add("currentplayer_p1")
  player_h3.innerText = `Player ${currPlayer} starts the game!`
  game_player_div.appendChild(player_h3)
  
  const htmlBoard = document.getElementById("board")
  // TODO: add comment for this code
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // TODO: add comment for this code
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }




}

/** findSpotForCol: given column x, return top empty y (null if filled) */
// y - row, x - column
function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
    for(let y=HEIGHT-1;y>=0;y--){
      let this_cell = board[y][x]
      if(this_cell === null)
        {
          is_column_full = false;
          return y;
          
        }
      else{
        is_column_full = true;
        continue;
      }
    }
    if(is_column_full){
      return null;
    }
  
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const target_cell = document.getElementById(`${y}-${x}`);
  let colored_div = document.createElement("div")
  colored_div.classList.add("piece")
  
  if(currPlayer === 1){
    colored_div.classList.add("p1")
   
  }
  else{
    colored_div.classList.add("p2")
   
  }
  target_cell.append(colored_div);

  
  console.log(colored_div);
  console.log(board)


}

/** endGame: announce game end */

function endGame(msg) {
  confirm(msg)
  
  if(confirm("Would you like to play again?")){
    location.reload();
    
  }
  return


  // TODO: pop up alert message
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;
  console.log(x)

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
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
  for(let y=0;y<HEIGHT;y++){
    let row_check = board[y].every((val) => {return val !== null })
    console.log(row_check)
    if(row_check){
      is_board_full = true;
      continue;
    }
    else{
      is_board_full = false;
      break;
    }
}
  if(is_board_full === true){
    endGame("THE GAME IS TIED!");
  }
  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2: 1;
  show_player(currPlayer)
  console.log(currPlayer)
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

  for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {
      var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
