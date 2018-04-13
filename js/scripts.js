// Backend Logic
var matches;
var currentScore = 0;
var newScore = 0;
var coordArray = [];

function Gem(type) { //creates a gem object with a type and value
  this.type = type;
  this.pointVal = 50;
}

function Board() { // Constructs a board of empty arrays that gem objects can be pushed into
  this.board = [[], [], [], [], [], [], []];
}

Board.prototype.genGem = function(max) {  // Creates gems randomly and pushes them into a board
  var gem;
  for (var i = 0; i < this.board.length; i++) {
    for (var j = this.board[i].length; j < this.board.length; j++) {
      var number = Math.floor(Math.random() * (max + 1));
      if (number === 0) {
        gem = new Gem('blue');
      } else if (number === 1) {
        gem = new Gem('red');
      } else if (number === 2) {
        gem = new Gem('green');
      } else if (number === 3) {
        gem = new Gem('yellow');
      }
      this.board[i].push(gem);
    }
  }
};

Board.prototype.swapGems = function (coordArray) {  //Swaps the types and point values of gems selected using their coordinates in the board
  var gem1Type = this.board[coordArray[0]][coordArray[1]].type;
  var gem1Pts = this.board[coordArray[0]][coordArray[1]].pointVal;
  this.board[coordArray[0]][coordArray[1]].type = this.board[coordArray[2]][coordArray[3]].type;
  this.board[coordArray[2]][coordArray[3]].type = gem1Type;
  this.board[coordArray[0]][coordArray[1]].pointVal = this.board[coordArray[2]][coordArray[3]].pointVal;
  this.board[coordArray[2]][coordArray[3]].pointVal = gem1Pts;
};

Board.prototype.conditionA = function (i, j) { // checks to see if a gem matches the two gems below it
  if (this.board[i][j].type === this.board[i - 1][j].type && this.board[i][j].type === this.board[i - 2][j].type) {
    return true;
  } else {
    return false;
  }
};

Board.prototype.conditionB = function (i, j) { // checks to see if a gem matches the two gems 1 above and 1 below it
  if (this.board[i][j].type === this.board[i - 1][j].type && this.board[i][j].type === this.board[i + 1][j].type) {
    return true;
  } else {
    return false;
  }
};

Board.prototype.conditionC = function (i, j) { // checks to see if a gem matches the two gems above it
  if (this.board[i][j].type === this.board[i + 1][j].type && this.board[i][j].type === this.board[i + 2][j].type) {
    return true;
  } else {
    return false;
  }
};

Board.prototype.conditionD = function (i, j) { // checks to see if a gem matches the two gems to its left
  if (this.board[i][j].type === this.board[i][j - 1].type && this.board[i][j].type === this.board[i][j - 2].type) {
    return true;
  } else {
    return false;
  }
};

Board.prototype.conditionE = function (i, j) { //checks to see if a gem matches the two gems 1 to its left and 1 to its right
  if (this.board[i][j].type === this.board[i][j - 1].type && this.board[i][j].type === this.board[i][j + 1].type) {
    return true;
  } else {
    return false;
  }
};

Board.prototype.conditionF = function (i, j) { //checks to see if a gem matches the two gems to its right
  if (this.board[i][j].type === this.board[i][j + 1].type && this.board[i][j].type === this.board[i][j + 2].type) {
    return true;
  } else {
    return false;
  }
};

Board.prototype.match = function () { //Loops through board and checks conditions A-F and adds coordinates of matched cells to a set
  matches = new Set();
  var start = this.board.length-1;
  var match = false;
  for (var i = start; i >= 0; i--) {
    for (var j = start; j >= 0; j--) {
      if (i > 1 && i < start-1) {
        if (this.conditionA(i, j) || this.conditionB(i, j) || this.conditionC(i, j)) {
          matches.add(i + ',' + j);
          match = true;
        }
      }
      if (i === 1) {

        if (this.conditionB(i, j) || this.conditionC(i, j)) {
          matches.add(i + ',' + j);
          match = true;
        }
      }
      if (i === 0) {

        if (this.conditionC(i, j)) {
          matches.add(i + ',' + j);
          match = true;
        }
      }
      if (i === start - 1) {

        if (this.conditionA(i, j) || this.conditionB(i, j)) {
          matches.add(i + ',' + j);
          match = true;
        }
      }
      if (i === start) {
        if (this.conditionA(i, j)) {
          matches.add(i + ',' + j);
          match = true;
        }
      }
      if (j > 1 && j<start-1) {

        if (this.conditionD(i, j) || this.conditionE(i, j) || this.conditionF(i, j)) {
          matches.add(i + ',' + j);
          match = true;
        }
      }
      if (j === 1) {

        if (this.conditionE(i, j) || this.conditionF(i, j)) {
          matches.add(i + ',' + j);
          match = true;
        }
      }
      if (j === 0) {

        if (this.conditionF(i, j)) {
          matches.add(i + ',' + j);
          match = true;
        }
      }
      if (j === start - 1) {

        if (this.conditionD(i, j) || this.conditionE(i, j)) {
          matches.add(i + ',' + j);
          match = true;
        }
      }
      if (j === start) {
        if (this.conditionD(i, j)) {
          matches.add(i + ',' + j);
          match = true;
        }
      }
    }
  }
  return match;
};

Board.prototype.isValid = function (coordArray) { //checks to see if the gems selected cause a match (a valid move)
  var tempBoard = new Board();

  for (var i = 0; i < this.board.length; i++) {
    for (var j = 0; j < this.board.length; j++) {
      var type = this.board[i][j].type;
      tempBoard.board[i][j] = new Gem(type);
    }
  }
  tempBoard.swapGems(coordArray);
  return tempBoard.match();
};

Board.prototype.clearGems = function () { //changes any gems that match at least 3 in a row up or down into explosions and their point values to the score
  var thisBoard = this.board;
  matches.forEach(function(item) {
    var coordinates=item.split(',');
    newScore += thisBoard[parseInt(coordinates[0])][parseInt(coordinates[1])].pointVal;
    thisBoard[parseInt(coordinates[0])][parseInt(coordinates[1])] = 'burst';
  });
  this.board = thisBoard;
};

Board.prototype.removeBursts= function () { //clears exploded gems
  var thisBoard = this.board;
  matches.forEach(function(item) {
    var coordinates=item.split(',');
    thisBoard[parseInt(coordinates[0])].splice(parseInt(coordinates[1]),1);
  });
  this.board = thisBoard;
};

Board.prototype.checkBoard = function () { //checks to see if new matches were made when new gems were populated, then clears them and updates board as it goes with timeout
  if(this.match()) {
    this.clearGems();
    drawClear(this);
    this.removeBursts();
    this.genGem(3);
    drawNewGems(this);
    scoreTicker();
    setTimeout(this.checkBoard.bind(this), 200);
  }
};

Board.prototype.startBoard = function () { //sets up a randomly generated board and removes matches before displaying
  this.genGem(3);
  while (this.match()) {
    this.clearGems();
    this.removeBursts();
    this.genGem(3);
  }
  newScore = 0;
  currentScore = 0;
};
var green;
var blue;
var yellow;
var red;
var set;
function jewelSet() {
  if (set === "drwho") {
    green = "angel.png";
    blue = "tardis.png";
    yellow = "cyber.jpg";
    red = "dalek.png";
  }else if (set === "harry") {
    green = "slyth.png";
    blue = "raven.png";
    yellow = "huff.png";
    red = "gryff.gif";
  }else if (set === "zelda") {
    green = "rupee.png";
    blue = "octo.png";
    yellow = "trif.png";
    red = "heart.png";
  }else if (set === "mario") {
    green = "shell.png";
    blue = "flower.png";
    yellow = "star.png";
    red = "mush.png";
  } else {
    green = "green.svg";
    blue = "blue.svg";
    yellow = "yellow.svg";
    red = "red.svg";
  }
}
// User Interface Logic
function scoreTicker() {  //make score count up by 5 and animates DOM score using timeouts
  if(currentScore < newScore) {
    currentScore += 5;
    $('#game-score').text(currentScore);
    setTimeout(scoreTicker, 25);
  }
}

function drawHelper(board, i, j) { //draws gems into the html board
  var cellID = '#' + i + '-' + j;
  if (typeof(board.board[i][j]) === "undefined"){
    return;
  } else if(board.board[i][j] === "burst"){
    $(cellID).empty().append('<img src="img/burst.gif">');
  } else if (board.board[i][j].type === 'blue') {
    $(cellID).empty().append('<img src="img/'+ blue + '">');
  } else if (board.board[i][j].type === 'red') {
    $(cellID).empty().append('<img src="img/'+ red + '">');
  } else if (board.board[i][j].type === 'green') {
    $(cellID).empty().append('<img src="img/'+ green + '">');
  } else if (board.board[i][j].type === 'yellow') {
    $(cellID).empty().append('<img src="img/'+ yellow + '">');
  }
}

function drawClear(board) { // draws board and updates score with no timeout
  for (var i = 0; i < board.board.length; i++) {
    for (var j = 0; j < board.board.length; j++) {
      drawHelper(board, i, j);
    }
  }
  $('#game-score').text(scoreTicker());
}

function drawNewGems(board, i = -1, j = -1) { //draws board with timeouts to let things look like they're animated
  if (i === -1 && j === -1) {
    setTimeout(function() {
      drawNewGems(board, 0, 0);
    }, 700);
  } else if (i < board.board.length) {
    if (j < board.board.length){
      drawHelper(board, i, j);
      setTimeout(function() {
        drawNewGems(board, i, j+1);
      }, 200*(1/(j+1)));
    }
    drawNewGems(board, i+1, j);
  }
}

$(document).ready(function() {
  $('#instructions').modal('show');
  var newBoard = new Board();
  newBoard.startBoard();
  drawClear(newBoard);
  // gathers coordinates of clicked gems and pushes coordinates into an array
  $('.cell').click(function() {
    var userClick = $(this).attr('id');
    var gemCoords = userClick.split('-');
    var xCoord = parseInt(gemCoords[0]);
    var yCoord = parseInt(gemCoords[1]);
    // checks to see if user has selected a gem. It assigns a class of no-click to gems that aren't directly adjacent
    if (coordArray.length === 0) {
      coordArray.push(xCoord,yCoord);
      $('.cell').addClass('no-click');
      $(this).addClass('highlight');
      $('#bedazzle').addClass('no-click');
      $('#choose').addClass('no-click');
      $('[id='+ xCoord + '-' + (yCoord + 1) + ']').addClass('highlight').removeClass('no-click');
      $('[id='+ xCoord + '-' + (yCoord - 1) + ']').addClass('highlight').removeClass('no-click');
      $('[id='+ (xCoord + 1) + '-' + yCoord + ']').addClass('highlight').removeClass('no-click');
      $('[id='+ (xCoord - 1) + '-' + yCoord + ']').addClass('highlight').removeClass('no-click');
    } else {
      /* checks to see if there's a second click, and checks to see if move is valid. If so, it runs the match func and clears
      the appropriate gems */
      coordArray.push(xCoord,yCoord);
      if (newBoard.isValid(coordArray)) {
        newBoard.swapGems(coordArray);
        drawClear(newBoard);
        newBoard.checkBoard();
      } else {
        // nothing
      }
      // resets click functionality to board for next turn
      $('.cell').removeClass('highlight');
      setTimeout(function() {
        coordArray=[];
        $('.cell').removeClass('no-click');
        $('#bedazzle').removeClass('no-click');
        $('#choose').removeClass('no-click');
      }, 2000);
    }
  });

  $('#bedazzle').click(function(){
    newBoard = new Board();
    newBoard.startBoard();
    drawClear(newBoard);
    $('#game-score').text(currentScore);
  });
  $('.jewel').click(function(){
    $('.hidden').show();
    $('.jewels').hide();
    set = $(this).val();
    jewelSet();
    drawClear(newBoard);
  });
  $('#choose').click(function(){
    $('.hidden').hide();
    $('.jewels').show();
  });
});
