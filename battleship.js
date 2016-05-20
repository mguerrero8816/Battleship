//set constants for conditions to fill board spaces with
var SHIP = 0;
var HITSHIP = 1;
var HITNOTHING = -1;
// set win conditions
var HITSTOWIN = 24; //currently unused
var SINKSTOWIN = 5;
// messages for hitting/missing ship
var HITMESSAGE = "You Hit a Ship!";
var MISSMESSAGE = "You Missed!";
// messages for game starting/ending
var STARTMESSAGE = ": Sink " + SINKSTOWIN + " Ships to Win!"
var WINMESSAGE = ": Fleet Crippled!";
var LOSEMESSAGE = ": Out of Torpedoes!";
//sink ships messages
var SUNKSHIPMESSAGE = "You Sunk a Ship!"
// initialize board as empty array
var board;
// initialize counters for various in game items
var torpedoUse;
var hitCounter;
var sinkCounter = 0;
var shipCounter = 0;
// check to see if the game is ended
var gameIsNotOver;

var TORPEDOLIMIT = 40;
//game objective


function resetBoard(){
  //reset jumbotron message
  // get rid of cheat message
  $("#cheatSpan").text("Battleship");
  // get rid of win/loss message
  $("#gameOver").text(STARTMESSAGE);

  // remove classes from html board
  for(var i = 0; i <10; i++){//remove from single digit IDs
    $("#0"+i).removeClass();
    $("#0"+i).addClass("boardCell");
  }
  for(var i = 10; i <100; i++){//remove from double digit IDs
    $("#"+i).removeClass();
    $("#"+i).addClass("boardCell");
  }

  // initialize board as empty array
  board = [];
  // initialize torpedo counter
  torpedoUse = 0;
  $("#torpedoUse").text(TORPEDOLIMIT);
  for(var i=0; i<TORPEDOLIMIT; i++){//reset torpedo gauge
    $("#t"+i).removeClass();
    $("#t"+i).addClass("torpedoCell");
  }
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
      location = Math.floor(Math.random()*99);
    }
    while(
      (board[location] === SHIP) || //new location if on a ship
      ((location%10) > (10-length)) || //new location if on an edge
      checkForShipHorizontal(location, length) //new location if on a ship
    )
    for(var i = 0; i<length; i++){
      board[location + i] = SHIP;
    }
  }
  if(horizontal === false){
    do {
      location = Math.floor(Math.random()*99);
    }
    while(
      (board[location] === SHIP) || //new location if on a ship
      ((location+length*10) > (109)) || //new location if on the bottom edge
      checkForShipVertical(location, length) //new location if on a ship
    )
    for(var i = 0; i<length; i++){
      board[location + i*10] = SHIP;
    }
  }
  shipCounter++;//increase number of ships
}

function checkForShipHorizontal(location, length){
  for(var i = 0; i < length; i++){
    if(board[location + i] === SHIP){// verify no ship at location to be placed
      return true;
    }
    if(board[location + i + 10] ===SHIP){// verify no ship above location to be placed
      return true;
    }
    if(board[location + i - 10] ===SHIP){// verify no ship below location to be placed
      return true;
    }
    if(board[location + i - 1] === SHIP){//verify no ship to the left of location to be placed
      return true;
    }
    if(board[location + i + 1] === SHIP){//verify no ship to the right of location to be placed
      return true;
    }
  }
  return false;
}

function checkForShipVertical(location, length){
  for(var i = 0; i < length; i++){
    if(board[location + i*10] === SHIP){// verify no ship at location to be placed
      return true;
    }
    if(board[location + i*10 - 10] ===SHIP){// verify no ship above location to be placed
      return true;
    }
    if(board[location + i*10 + 10] ===SHIP){// verify no ship below location to be placed
      return true;
    }
    if(board[location + i*10 - 1] === SHIP){//verify no ship to the left of location to be placed
      return true;
    }
    if(board[location + i*10 + 1] === SHIP){//verify no ship to the right of location to be placed
      return true;
    }
  }
  return false;
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

function showShips(){
  for (var i=0; i<=99; i++) {
    if(board[i]===SHIP) {
      if(i<=9){
        var checkLocation = "0" + i;
      }
      else{
        checkLocation = i;
      }
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
    index = index - 10;
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
    index = index + 10;
    boardContents = board[index];
  }
  if(lengthCounter != boardContentsSum){//end loop if ship is not sunk
    return HITMESSAGE;//bottom
  }
  //end evaluations after ship is sunk

  var index = location;
  var boardContents = board[index];

  while(boardContents === HITSHIP){//move to the right and color cells
    if(index < 9){
      $("#0"+index).addClass("sunkShip");
    }
    else{
      $("#"+index).addClass("sunkShip");
    }
    index = index + 1;
    boardContents = board[index]
  }

  var index = location;
  var boardContents = board[index];

  while(boardContents === HITSHIP){//move to the left and color cells
    if(index < 9){
      $("#0"+index).addClass("sunkShip");
    }
    else{
      $("#"+index).addClass("sunkShip");
    }
    index = index - 1;
    boardContents = board[index]
  }

  var index = location;
  var boardContents = board[index];

  while(boardContents === HITSHIP){//move up and color cells
    if(index < 9){
      $("#0"+index).addClass("sunkShip");
    }
    else{
      $("#"+index).addClass("sunkShip");
    }
    index = index - 10;
    boardContents = board[index]
  }

  var index = location;
  var boardContents = board[index];

  while(boardContents === HITSHIP){//move down and color cells
    if(index < 9){
      $("#0"+index).addClass("sunkShip");
    }
    else{
      $("#"+index).addClass("sunkShip");
    }
    index = index + 10;
    boardContents = board[index]
  }

  sinkCounter++;//increase ships sunk
  //update HTML
  $("#sinkCounter").text(sinkCounter);
  $("#shipCounter").text(shipCounter - sinkCounter);
  return SUNKSHIPMESSAGE;
}

$(document).ready( function() {

  for (var i=0; i<10; i++) { //iterate row creation 10 times
    var newTableRow = $("#boardBody").append("<tr></tr>");// create table row and designate the row for appending
    for (var j=0; j<10; j++) { //iterate cell creation 10 times
      newTableRow.append('<td id="' + i + j + '"></td>');// create cell within designated row
    }
  }

  var numberOfCells = 0;
  for (var i=0; i<(TORPEDOLIMIT/2); i++){//create 2 column torpedo gauge
    var newTableRow = $("#torpedoGauge").append("<tr></tr>");
    for (var j=0; j<2; j++){
      newTableRow.append('<td id="t' + numberOfCells + '"></td>');
      numberOfCells++;
    }
  }
  for(var i=0; i<TORPEDOLIMIT; i++){//reset torpedo gauge
    $("#t"+i).removeClass();
    $("#t"+i).addClass("torpedoCell");
  }


  resetBoard();

  $(".boardCell").on("click", function(){
    fireTorpedo($(this).attr("id"));//calls fireTorpedo function on clicked cell
  });
  //give reset button functionality
  $("#resetButton").on("click", resetBoard);

  $("#fireRandom").on("click", function(){
    var randomShot;//variable to hold random location
    do{
      randomShot = Math.floor(Math.random()*9).toString() + Math.floor(Math.random()*9); //get random 2 digit location string
    }
    while(board[parseInt(randomShot)] === HITSHIP || board[parseInt(randomShot)] === HITNOTHING)//loop if space is alreay shot at
    fireTorpedo(randomShot);
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
  })

}); // end ready
