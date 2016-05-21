//set constants for conditions to fill board spaces with
var SHIP = 0;
var HITSHIP = 1;
var HITNOTHING = -1;
// set win conditions
var HITSTOWIN = 24; //currently unused
var SINKSTOWIN = 5;
var TORPEDOLIMIT = 40;
// messages for hitting/missing ship
var HITMESSAGE = "You Hit a Ship!";
var MISSMESSAGE = "You Missed!";
//sink ships messages
var SUNKSHIPMESSAGE = "You Sunk a Ship!";
// messages for game starting/ending
var STARTMESSAGE = ": Sink " + SINKSTOWIN + " Ships to Win!";
var WINMESSAGE = ": Fleet Crippled!";
var LOSEMESSAGE = ": Out of Torpedoes!";
var boardSquareDimension = 10;
var lastCell;
// initialize board as empty array
var board;
// initialize counters for various in game items
var torpedoUse;
var hitCounter;
var sinkCounter = 0;
var shipCounter;
// check to see if the game is ended
var gameIsNotOver;

var torpedoType;
//counts cells that have been made
var cellCounter;
//game objective


function resetBoard(){
  $("#boardBody").empty();
  cellCounter = 0;
  for (var i=0; i<boardSquareDimension; i++) { //iterate row creation 10 times
    var newTableRow = $("#boardBody").append("<tr></tr>");// create table row and designate the row for appending
    for (var j=0; j<boardSquareDimension; j++) { //iterate cell creation 10 times
      newTableRow.append('<td class="boardCell" id="' + cellCounter + '"></td>');// create cell within designated row
      cellCounter++;
    }
  }
  lastCell = cellCounter-1;
  $(".boardCell").on("click", function(){
    torpedoSelector($(this).attr("id"));//calls fireTorpedo function on clicked cell
  });

  //reset jumbotron messages
  // get rid of cheat message
  $("#cheatSpan").text("Battleship");
  // get rid of win/loss message
  $("#gameOver").text(STARTMESSAGE);

  // initialize board as empty array
  board = [];
  // initialize torpedo counter
  torpedoUse = 0;
  $("#torpedoUse").text(TORPEDOLIMIT);
  for(var i=0; i<TORPEDOLIMIT; i++){//reset torpedo gauge
    $("#t"+i).removeClass();
    $("#t"+i).addClass("torpedoCell");
  }
  //reset torpedo type to normal
  torpedoType = "normal";
  // initialize js and html hit counter
  hitCounter = 0;
  $("#hitCounter").text(hitCounter);
  // initialize ship sunk counter
  sinkCounter = 0;
  $("#sinkCounter").text(sinkCounter);
  // check to see if the game is ended
  gameIsNotOver = true;
  $("#hitStatus").text("Sink Those Ships!");//blank out HTML hitStatus
  //place ships
  shipCounter = 0;//reset ship counter
  placeShip(5, false);
  placeShip(4, true);
  placeShip(4, false);
  placeShip(3, true);
  placeShip(3, false);
  placeShip(2, true);
  placeShip(2, false);
  placeShip(1, true);
  $("#shipCounter").text(shipCounter - sinkCounter);
}

function placeShip(length, horizontal){
  var location;
  if(horizontal === true){
    do {
      location = Math.floor(Math.random()*lastCell);
    }
    while(
      (board[location] === SHIP) || //new location if on a ship
      ((location%boardSquareDimension) > (boardSquareDimension-length)) || //new location if on an edge
      checkForShipHorizontal(location, length) //new location if on a ship
    )
    for(var i = 0; i<length; i++){
      board[location + i] = SHIP;
    }
  }
  else{
    // orient ship vertically
    do {
      location = Math.floor(Math.random()*lastCell);
    }
    while(
      (board[location] === SHIP) || //new location if on a ship
      ((location+length*boardSquareDimension) > (lastCell + boardSquareDimension)) || //new location if on the bottom edge
      checkForShipVertical(location, length) //new location if on a ship
    )
    for(var i = 0; i<length; i++){
      board[location + i*boardSquareDimension] = SHIP;
    }
  }
  shipCounter++;//increase number of ships
}

function checkForShipHorizontal(location, length){
  for(var i = 0; i < length; i++){
    if(board[location + i] === SHIP ||// verify no ship at location to be placed
      board[location + i + boardSquareDimension] === SHIP ||// verify no ship above location to be placed
      board[location + i - boardSquareDimension] === SHIP ||// verify no ship below location to be placed
      board[location + i - 1] === SHIP ||//verify no ship to the left of location to be placed
      board[location + i + 1] === SHIP){//verify no ship to the right of location to be placed
      return true;
    }
  }
  return false;
}

function checkForShipVertical(location, length){
  for(var i = 0; i < length; i++){
    if(board[location + i*boardSquareDimension] === SHIP ||// verify no ship at location to be placed
      board[location + i*boardSquareDimension - boardSquareDimension] ===SHIP ||// verify no ship above location to be placed
      board[location + i*boardSquareDimension + boardSquareDimension] ===SHIP ||// verify no ship below location to be placed
      board[location + i*boardSquareDimension - 1] === SHIP ||//verify no ship to the left of location to be placed
      board[location + i*boardSquareDimension + 1] === SHIP){//verify no ship to the right of location to be placed
      return true;
    }
  }
  return false;
}

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
}

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

      if(sinkCounter === SINKSTOWIN){// check for winner
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
    torpedoUse++; //increment torpedo use
    $("#torpedoUse").text(TORPEDOLIMIT - torpedoUse);//update torpedo use on html
    $("#t"+(TORPEDOLIMIT-torpedoUse)).addClass("spentTorpedo")

    //check for torpedo use
    if(torpedoUse === TORPEDOLIMIT && gameIsNotOver){//limits number of torpedos
      $("#gameOver").text(LOSEMESSAGE);
      showShips();
      gameIsNotOver = false;
    }//end torpedo use check

  };//end torpedo check
}//end fire torpedo function

// Takes -> String
// Integer -> Nothing
// Does: calls fireTorpedo function on multiple cells
function crossTorpedo(cellId){//changes cell color when clicked on
  //change ID string to integer
  var cellInt = parseInt(cellId);
  //only add torpedo if cell is unused
  if(board[cellInt]!=HITNOTHING && board[cellInt]!=HITSHIP && gameIsNotOver) {
    //call fire torpedo function in cross formation
    var stringIdUp = cellInt - boardSquareDimension;
    var stringIdDown = cellInt + boardSquareDimension;
    var stringIdLeft = cellInt - 1;
    var stringIdRight = cellInt + 1;

    fireTorpedo(cellInt);
    fireTorpedo(stringIdUp);
    fireTorpedo(stringIdDown);
    //prevent shot to the right if it wraps right
    if(stringIdRight%boardSquareDimension != 0){
      fireTorpedo(stringIdRight);
    }
    //prevent shot tot he left if it wraps left
    if(stringIdLeft%boardSquareDimension != lastCell%boardSquareDimension){
      fireTorpedo(stringIdLeft);
    }
  };//end torpedo check
}//end crossTorpedo function

//take nothing
//returns nothing
//shows all ships on the board
function showShips(){
  for (var i=0; i<(boardSquareDimension*boardSquareDimension); i++) {
    if(board[i]===SHIP) {
      checkLocation = i;
      $("#" + checkLocation).addClass("showShip");
    }
  }
}

function checkSunkShip(location){
  var index = location;//indicates location on ship
  var boardContents = board[index];//indicates when to stop loop
  var boardContentsSum = 0;//indicates number of hits
  var lengthCounter = 0;//indicates spots checked

  while(boardContents === SHIP || boardContents === HITSHIP){//counts number of hits and ship length to the right
    lengthCounter = lengthCounter + 1;
    boardContentsSum = boardContentsSum + boardContents
    index = index + 1;
    boardContents = board[index];
  }
  if(lengthCounter != boardContentsSum){//end loop if ship is not sunk
    return HITMESSAGE;//right
  }

  var index = location;//indicates location on ship
  var boardContents = board[index];//indicates when to stop loop

  while(boardContents === SHIP || boardContents === HITSHIP){//counts number of hits and ship length to the left
    lengthCounter = lengthCounter + 1;
    boardContentsSum = boardContentsSum + boardContents
    index = index - 1;
    boardContents = board[index];
  }
  if(lengthCounter != boardContentsSum){//end loop if ship is not sunk
    return HITMESSAGE;//left
  }

  var index = location;//indicates location on ship
  var boardContents = board[index];//indicates when to stop loop

  while(boardContents === SHIP || boardContents === HITSHIP){//counts number of hits and ship length above
    lengthCounter = lengthCounter + 1;
    boardContentsSum = boardContentsSum + boardContents
    index = index - boardSquareDimension;
    boardContents = board[index];
  }
  if(lengthCounter != boardContentsSum){//end loop if ship is not sunk
    return HITMESSAGE;//top
  }

  var index = location;//indicates location on ship
  var boardContents = board[index];//indicates when to stop loop

  while(boardContents === SHIP || boardContents === HITSHIP){//counts number of hits and ship length below
    lengthCounter = lengthCounter + 1;
    boardContentsSum = boardContentsSum + boardContents
    index = index + boardSquareDimension;
    boardContents = board[index];
  }
  if(lengthCounter != boardContentsSum){//end loop if ship is not sunk
    return HITMESSAGE;//bottom
  }
  //end evaluations after ship is sunk

  var index = location;
  var boardContents = board[index];

  while(boardContents === HITSHIP){//move to the right and color cells
    $("#"+index).addClass("sunkShip");
    index++;
    boardContents = board[index]
  }

  var index = location;
  var boardContents = board[index];

  while(boardContents === HITSHIP){//move to the left and color cells
    $("#"+index).addClass("sunkShip");
    index--;
    boardContents = board[index]
  }

  var index = location;
  var boardContents = board[index];

  while(boardContents === HITSHIP){//move up and color cells
    $("#"+index).addClass("sunkShip");
    index -= boardSquareDimension;
    boardContents = board[index]
  }

  var index = location;
  var boardContents = board[index];

  while(boardContents === HITSHIP){//move down and color cells
    $("#"+index).addClass("sunkShip");
    index += boardSquareDimension;
    boardContents = board[index]
  }

  sinkCounter++;//increase ships sunk
  //update HTML
  $("#sinkCounter").text(sinkCounter);
  $("#shipCounter").text(shipCounter - sinkCounter);
  return SUNKSHIPMESSAGE;
}

$(document).ready( function() {


  cellCounter = 0;
  for (var i=0; i<(TORPEDOLIMIT/2); i++){//create 2 column torpedo gauge
    var newTableRow = $("#torpedoGauge").append("<tr></tr>");
    for (var j=0; j<2; j++){
      newTableRow.append('<td id="t' + cellCounter + '"></td>');
      cellCounter++;
    }
  }
  for(var i=0; i<TORPEDOLIMIT; i++){//reset torpedo gauge
    $("#t"+i).removeClass();
    $("#t"+i).addClass("torpedoCell");
  }


  resetBoard();
  //give reset button functionality
  $("#resetButton").on("click", resetBoard);

  $("#fireRandom").on("click", function(){
    var randomShot;//variable to hold random location
    do{
      randomShot = Math.floor(Math.random()*lastCell).toString(); //get random location string
    }
    while(board[parseInt(randomShot)] === HITSHIP || board[parseInt(randomShot)] === HITNOTHING)//loop if space is alreay shot at
    torpedoSelector(randomShot);
  });

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
    $("#cheatSpan").text("You Cheated");
  });

  $("#refillButton").on("click", function(){
    torpedoUse = 0;
    $("#torpedoUse").text(TORPEDOLIMIT);
    for(var i=0; i<TORPEDOLIMIT; i++){//reset torpedo gauge
      $("#t"+i).removeClass();
      $("#t"+i).addClass("torpedoCell");
     $("#cheatSpan").text("You Cheated");
    }
  });

  $("#crossButton").on("click", function(){
    torpedoType = "cross";
  });

  $("#normalButton").on("click", function(){
    torpedoType = "normal";
  });

}); // end ready
