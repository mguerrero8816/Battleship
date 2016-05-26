//set constants for conditions to fill board spaces with
var SHIP = 0;
var HITSHIP = 1;
var HITNOTHING = -1;
// set game conditions
//var HITSTOWIN = 24; //currently unused
// sink ships to win
var SINKSHIPSTOWIN = 5;
// limit number of torpedoes player can use
var TORPEDOLIMIT = 40;
// set dimensions of the board
var BOARDHEIGHTANDWIDTH = 10;

// MESSAGES FOR JUMBOTRON
// title of page
var PAGETITLE = "Battleship";
// replace title if cheats are used
var CHEATMESSAGE = "Cheated";
// messages for game starting/ending
var STARTMESSAGE = ": Sink " + SINKSHIPSTOWIN + " Ships to Win!";
var WINMESSAGE = ": Fleet Crippled!";
var LOSEMESSAGE = ": Out of Torpedoes!";

// MESSAGES FROM CAPTAIN(BELOW BOARD)
// captains starting message
var CAPTAINSGREETING = "Sink Those Ships!";
// messages for hitting/missing ship
var HITMESSAGE = "You Hit a Ship!";
var MISSMESSAGE = "You Missed!";
//sink ships messages
var SUNKSHIPMESSAGE = "You Sunk a Ship!";

// declare other variables to be used
// declare variable to fill with total number of cells on board
var totalCellsOnBoard;
// declare variable to be used as JS board
var board;
// initialize counters for various in game items
var torpedoesUsed;
var hitCounter;
var shipsSunk;
var shipsPlaced;
// check to see if the game is ended
var gameIsNotOver;

var torpedoType; // can be "normal", "cross", or "seeker"


function resetBoard(){
  // create HTML board
  createGameBoard(BOARDHEIGHTANDWIDTH);
  // create empty JS board
  board = [];
  // create HTML torpedoGauge
  createTorpedoGauge();
  //reset jumbotron messages
  // get rid of possible cheat message
  $("#cheatSpan").text(PAGETITLE);
  // get rid of win/loss message
  $("#gameOver").text(STARTMESSAGE);
  // initialize js and html hit counter
  hitCounter = 0;
  $("#hitCounter").text(hitCounter);
  // initialize ship sunk counter
  shipsSunk = 0;
  $("#shipsSunk").text(shipsSunk);
  // set game to not ended
  gameIsNotOver = true;
  //reset the captains message
  $("#hitStatus").text(CAPTAINSGREETING);
  //place ships
  shipsPlaced = 0;//reset ship counter
  placeShip(5, false);
  placeShip(4, true);
  placeShip(4, false);
  placeShip(3, true);
  placeShip(3, false);
  placeShip(2, true);
  placeShip(2, false);
  placeShip(1, true);
  $("#shipsPlaced").text(shipsPlaced - shipsSunk);
};

function createGameBoard(heightAndWidth){
  //remove any existing game board
  $("#boardBody").empty();
  totalCellsOnBoard = 0;
  //create game board
  for (var i=0; i<heightAndWidth; i++) { //iterate row creation 10 times
    var newTableRow = $("#boardBody").append("<tr></tr>");// create table row and designate the row for appending
    for (var j=0; j<heightAndWidth; j++) { //iterate cell creation 10 times
      newTableRow.append('<td class="boardCell" id="' + totalCellsOnBoard + '"></td>');// create cell within designated row
      totalCellsOnBoard++;//increment number of cells as cells are added to table
    }
  }
  //turn on click listeners for all cells of the game board
  $(".boardCell").on("click", function(){
    torpedoSelector($(this).attr("id"));//calls fireTorpedo function on clicked cell
  });
};

function changeLimits(){
  if(parseInt($("#inputSize").val()) > 9){
    BOARDHEIGHTANDWIDTH = parseInt($("#inputSize").val());
    $("#inputSize").val("");
  };
  if(parseInt($("#inputLimit").val()) > 0){
    TORPEDOLIMIT = parseInt($("#inputLimit").val());
    $("#inputLimit").val("");
  }
  resetBoard();
}

function createTorpedoGauge(){
  // initialize torpedo counter
  torpedoesUsed = 0;
  $("#torpedoesUsed").text(TORPEDOLIMIT);
  // set torpedo type to normal
  torpedoType = "normal";
  //remove any existing torpedo gauge
  $("#torpedoGauge").empty();
  var cellCountTracker = 0;//tracks current cell created on torpedo gauge
  for (var i=0; i<(TORPEDOLIMIT/2); i++){//create 2 column torpedo gauge
    var newTableRow = $("#torpedoGauge").append("<tr></tr>");
    for (var j=0; j<2; j++){
      if(cellCountTracker < TORPEDOLIMIT){
        newTableRow.append('<td class="torpedoCell" id="t' + cellCountTracker + '"></td>');
        cellCountTracker++;
      }
    }
  }
};

//purpose fire different torpedo types
//returns nothing
//takes string
function torpedoSelector(cellId){
  if(torpedoType === "normal"){
    fireTorpedo(cellId);
  }
  if(torpedoType === "cross"){
    crossTorpedo(cellId);
  }
};

function fireTorpedo(cellId){//changes cell color when clicked on
  var cellInt = parseInt(cellId);//change ID string to integer
  if(board[cellInt]!=HITNOTHING && board[cellInt]!=HITSHIP && gameIsNotOver) {//only add torpedo if cell is unused

    // update javascript board
    if(board[cellInt]===SHIP){//check for ship presence
      board[cellInt] = HITSHIP;//add hit to JS board
      $("#"+cellId).addClass("showShip")//adds hit to HTML board
      $("#hitStatus").text(checkSunkShip(cellInt))//update HTML hitStatus
      hitCounter++;//increment ships hit
      $("#hitCounter").text(hitCounter);//update ships hit on html

      if(shipsSunk === SINKSHIPSTOWIN){// check for winner
        $("#gameOver").text(WINMESSAGE);
        showShips();
        gameIsNotOver = false;
      }//end winner check
    }//end ship check
    else{
      board[cellInt] = HITNOTHING;//add miss to JS board
      $("#hitStatus").text(MISSMESSAGE)//update HTML hitStatus
    }

    $("#"+cellId).addClass("hitByTorpedo")//add used cell to HTML board
    torpedoesUsed++; //increment torpedo use
    $("#torpedoesUsed").text(TORPEDOLIMIT - torpedoesUsed);//update torpedo use on html
    $("#t"+(TORPEDOLIMIT-torpedoesUsed)).addClass("spentTorpedo")

    //check for torpedo use
    if(torpedoesUsed === TORPEDOLIMIT && gameIsNotOver){//limits number of torpedos
      $("#gameOver").text(LOSEMESSAGE);
      showShips();
      gameIsNotOver = false;
    }//end torpedo use check

  };//end torpedo check
}//end fire torpedo function

function fireRandom(){
  var randomShot;//variable to hold random location
  do{
    randomShot = "" + Math.floor(Math.random()*totalCellsOnBoard); //get random location string
  }
  while(board[parseInt(randomShot)] === HITSHIP || board[parseInt(randomShot)] === HITNOTHING)//loop if space is alreay shot at
  torpedoSelector(randomShot);
}

// Takes -> String
// returns -> Nothing
// Does: calls fireTorpedo function on multiple cells
function crossTorpedo(cellId){//changes cell color when clicked on
  //change ID string to integer
  var cellInt = parseInt(cellId);
  //only add torpedo if cell is unused
  if(board[cellInt]!=HITNOTHING && board[cellInt]!=HITSHIP && gameIsNotOver) {
    //call fire torpedo function in cross formation
    var stringIdUp = cellInt - BOARDHEIGHTANDWIDTH;
    var stringIdDown = cellInt + BOARDHEIGHTANDWIDTH;
    var stringIdLeft = cellInt - 1;
    var stringIdRight = cellInt + 1;

    fireTorpedo(cellInt);
    fireTorpedo(stringIdUp);
    fireTorpedo(stringIdDown);
    //prevent shot to the right if it wraps right
    if(stringIdRight%BOARDHEIGHTANDWIDTH != 0){
      fireTorpedo(stringIdRight);
    }
    //prevent shot tot he left if it wraps left
    if(stringIdLeft%BOARDHEIGHTANDWIDTH != (totalCellsOnBoard - 1)%BOARDHEIGHTANDWIDTH){
      fireTorpedo(stringIdLeft);
    }
  };//end torpedo check
}//end crossTorpedo function

function placeShip(length, isHorizontal){
  var location;
  if(isHorizontal === true){
    do {
      location = Math.floor(Math.random()*totalCellsOnBoard);
    }
    while(
      (board[location] === SHIP) || //new location if on a ship
      ((location%BOARDHEIGHTANDWIDTH) > (BOARDHEIGHTANDWIDTH-length)) || //new location if on an edge
      checkForShipHorizontal(location, length) //new location if on a ship
    )
    for(var i = 0; i<length; i++){
      board[location + i] = SHIP;
    }
  }
  else{
    // orient ship vertically
    do {
      location = Math.floor(Math.random()*totalCellsOnBoard);
    }
    while(
      (board[location] === SHIP) || //new location if on a ship
      ((location+length*BOARDHEIGHTANDWIDTH) > (totalCellsOnBoard - 1 + BOARDHEIGHTANDWIDTH)) || //new location if on the bottom edge
      checkForShipVertical(location, length) //new location if on a ship
    )
    for(var i = 0; i<length; i++){
      board[location + i*BOARDHEIGHTANDWIDTH] = SHIP;
    }
  }
  shipsPlaced++;//increase number of ships
}

function checkForShipHorizontal(location, length){
  for(var i = 0; i < length; i++){
    if(board[location + i] === SHIP ||// verify no ship at location to be placed
      board[location + i + BOARDHEIGHTANDWIDTH] === SHIP ||// verify no ship above location to be placed
      board[location + i - BOARDHEIGHTANDWIDTH] === SHIP ||// verify no ship below location to be placed
      board[location + i - 1] === SHIP ||//verify no ship to the left of location to be placed
      board[location + i + 1] === SHIP){//verify no ship to the right of location to be placed
      return true;
    }
  }
  return false;
}

function checkForShipVertical(location, length){
  for(var i = 0; i < length; i++){
    if(board[location + i*BOARDHEIGHTANDWIDTH] === SHIP ||// verify no ship at location to be placed
      board[location + i*BOARDHEIGHTANDWIDTH - BOARDHEIGHTANDWIDTH] ===SHIP ||// verify no ship above location to be placed
      board[location + i*BOARDHEIGHTANDWIDTH + BOARDHEIGHTANDWIDTH] ===SHIP ||// verify no ship below location to be placed
      board[location + i*BOARDHEIGHTANDWIDTH - 1] === SHIP ||//verify no ship to the left of location to be placed
      board[location + i*BOARDHEIGHTANDWIDTH + 1] === SHIP){//verify no ship to the right of location to be placed
      return true;
    }
  }
  return false;
}

//take nothing
//returns nothing
//shows all ships on the board
function showShips(){
  for (var i=0; i<(BOARDHEIGHTANDWIDTH*BOARDHEIGHTANDWIDTH); i++) {
    if(board[i]===SHIP) {
      checkLocation = i;
      $("#" + checkLocation).addClass("showShip");
    }
  }
}

function checkSunkShip(location){
  var horizontalLength = 0;//counts size of ship checked
  var verticalLength = 0;

  var rightIndex = 1;
  var leftIndex = -1;
  var topIndex = -BOARDHEIGHTANDWIDTH;
  var bottomIndex = BOARDHEIGHTANDWIDTH;
  //check all sides of the initial hit for damage
  //keep checking as long as damage is visible
  //ignores initial hit
  do {
    // increment indices and length counter if location on board is a damaged ship
    if(board[location + rightIndex]===HITSHIP){
      rightIndex++;
      horizontalLength++;
    }
    if(board[location + leftIndex]===HITSHIP){
      leftIndex--;
      horizontalLength++;
    }
    if(board[location + topIndex]===HITSHIP){
      topIndex -= BOARDHEIGHTANDWIDTH;
      verticalLength++;
    }
    if(board[location + bottomIndex]===HITSHIP){
      bottomIndex += BOARDHEIGHTANDWIDTH;
      verticalLength++;
    }
    //fall out of loop if index sees undamaged ship
    if(board[location + rightIndex] === SHIP || //check right
      board[location + leftIndex] === SHIP || //check left
      board[location + topIndex] === SHIP || //check top
      board[location + bottomIndex] === SHIP //check bottom
    ){
      return HITMESSAGE;
    };
  } while(
    board[location+rightIndex] === HITSHIP || //check right side
    board[location+leftIndex] === HITSHIP ||
    board[location+topIndex] === HITSHIP ||
    board[location+bottomIndex] === HITSHIP
  );
  //if the loop is passed, cells can be colored and counters changed

  //if single length ship is hit color the hit cell
  if(verticalLength === 0 && horizontalLength === 0){
    $("#"+location).addClass("sunkShip");
  };
  //color cells in a direction based on the orientation of the ship
  //color cells vertically if verticalLength is greater than 0
  if(verticalLength > 0){
    for(var i = 0; i <= verticalLength; i++){
      $("#"+(location + topIndex + BOARDHEIGHTANDWIDTH + BOARDHEIGHTANDWIDTH*i)).addClass("sunkShip");
    }
  }
  if(horizontalLength > 0){
    for(var i = 0; i <= horizontalLength; i++){
      $("#"+(location + leftIndex + 1 + i)).addClass("sunkShip");
    }
  }

  shipsSunk++;//increase number of ships sunk
  //update HTML
  $("#shipsSunk").text(shipsSunk);
  $("#shipsPlaced").text(shipsPlaced - shipsSunk);
  return SUNKSHIPMESSAGE;
}

$(document).ready( function() {
  //reset board when page loads
  resetBoard();
  //link resetButton HTML button to resetBoard function
  $("#resetButton").on("click", resetBoard);

  $("#defaultButton").on("click", function(){
    BOARDHEIGHTANDWIDTH = 10;
    TORPEDOLIMIT = 40;
    resetBoard();
  })

  $("#changeButton").on("click", changeLimits);

  $("#fireRandom").on("click", fireRandom);

  $("#caribbeanButton").on("click", function(){
    $("#themeSwitcher").attr("href", "caribbean.css");
  });

  $("#classicButton").on("click", function(){
    $("#themeSwitcher").attr("href", "classic.css");
  });

  $("#spaceButton").on("click", function(){
    $("#themeSwitcher").attr("href", "space.css");
  });

  $("#showButton").on("click", function(){
    showShips();
    $("#cheatSpan").text(CHEATMESSAGE);
  });

  $("#refillButton").on("click", function(){
    createTorpedoGauge();
    $("#cheatSpan").text(CHEATMESSAGE);
  });

  $("#crossButton").on("click", function(){
    torpedoType = "cross";
  });

  $("#normalButton").on("click", function(){
    torpedoType = "normal";
  });
}); // end ready
