var DIRECTION_MAPPING = {
	"right": {dx:1, dy:0, opp:"left"},
	"left": {dx:-1, dy:0, opp:"right"},
	"up": {dx:0, dy:-1, opp:"down"},
	"down": {dx:0, dy:1, opp:"up"},	
}
var drawSnake = function(newSnake, applePixel) {

	var goblin = document.createElement("IMG");
	goblin.src = "goblin.png";
	var drawableSnake = { img: goblin, color: "green", pixels: newSnake };
	var apple = {img: goblin, pixels: [applePixel]}
	var drawableObjects = [drawableSnake, apple];
	var canvasDraw = function() {
		snakeCanvas.draw(drawableObjects);
	}

	if(goblin.complete) { 
   		canvasDraw()
	}else {
   		goblin.onload = canvasDraw();
	}
}

var moveSnake = function(currentSnake, direction) {
  var oldSegment = currentSnake[0];
  var newX = (snakeCanvas.gameWidth() + oldSegment.left + direction.dx) 
  				%  snakeCanvas.gameWidth();
  var newY = (snakeCanvas.gameHeight() + oldSegment.top + direction.dy) 
  				%  snakeCanvas.gameHeight();
  var newSegment = { top: newY, left: newX };
  if(snakeCanvas.detectCollisionBetween([newSegment], [appleLocation])){
  	eatApple();
  }

  currentSnake.unshift(newSegment);

  if(delay > 0){
  	delay -= 1;
  }
  else{
  	currentSnake.pop();
  }
}

var advanceGame = function() {
  moveSnake(snake, DIRECTION_MAPPING[snakeDirection]);
  drawSnake(snake, appleLocation);
}

var react = function(direction){
	if(DIRECTION_MAPPING[snakeDirection].opp != direction){
		snakeDirection = direction;
	}
}

var eatApple= function(){
	delay = 2;
	appleLocation = snakeCanvas.randomLocation();
}

document.addEventListener('keydown', function(e) {
      if (snakeCanvas.KEY_MAPPING[e.which]) {
        e.preventDefault();
        react(snakeCanvas.KEY_MAPPING[e.which]);
      }
    });

var snake = [{ top: 0, left: 4},{ top: 0, left: 3},{ top: 0, left: 2}, { top: 0, left: 1}, { top: 0, left: 0}];
var snakeDirection = "right";
var appleLocation = snakeCanvas.randomLocation();
var delay = 0;
snakeCanvas.executeNTimesPerSecond(advanceGame, 2);