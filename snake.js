var DIRECTION_MAPPING = {
	"right": {dx:1, dy:0, opp:"left"},
	"left": {dx:-1, dy:0, opp:"right"},
	"up": {dx:0, dy:-1, opp:"down"},
	"down": {dx:0, dy:1, opp:"up"}	
}

var images = new Object();

var drawSnake = function(newSnake, applePixel) {


	var drawableSnake = { img: images, pixels: newSnake };
	var apple = {img: images, pixels: [applePixel]}
	var drawableObjects = [drawableSnake, apple];
  snakeCanvas.draw(drawableObjects);
	
}

var init = function(){

  //right
  var goblin = document.createElement("IMG");
  goblin.src = "images/goblin.png";
  //up
  var goblinu = document.createElement("IMG");
  goblinu.src = "images/goblin-up.png";
  //down
  var goblind = document.createElement("IMG");
  goblind.src = "images/goblin-down.png";
  //left
  var goblinl = document.createElement("IMG");
  goblinl.src = "images/goblin-left.png";

  var guac = document.createElement("IMG");
  guac.src = "images/guac.png";

  images["right"] = goblinl;
  images["left"] = goblin;
  images["down"] = goblinu;
  images["up"] = goblind;
  images["guac"] = guac;

  var imagesLoaded = 0;

  var waitforload = function(images){
    imagesLoaded++;
    if(imagesLoaded == Object.keys(images).length){
      snakeCanvas.executeNTimesPerSecond(advanceGame, 2);
    }
  }

  Object.keys(images).forEach(function(image){
    if(!image.complete){
      image.onload = waitforload(images);
    } else {
      imagesLoaded++;
    }
  });

}

var moveSnake = function(currentSnake, direction) {
  var oldSegment = currentSnake[0];
  var newX = (snakeCanvas.gameWidth() + oldSegment.left + direction.dx) 
  				%  snakeCanvas.gameWidth();
  var newY = (snakeCanvas.gameHeight() + oldSegment.top + direction.dy) 
  				%  snakeCanvas.gameHeight();
  var newSegment = { top: newY, left: newX , imageName: direction.opp};
  if(snakeCanvas.detectCollisionBetween([newSegment], [appleLocation])){
  	eatApple();
  }

  currentSnake.unshift(newSegment);
	snakeCanvas.addPixel(newSegment);
  if(delay > 0){
  	delay -= 1;
  }
  else{
  	snakeCanvas.removePixel(currentSnake.pop());
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

var snakeDirection = "right";
var snake = [{ top: 0, left: 4, imageName: "left"},
             { top: 0, left: 3, imageName: "left"},
             { top: 0, left: 2, imageName: "left"},
             { top: 0, left: 1, imageName: "left"},
             { top: 0, left: 0, imageName: "left"}];
var appleLocation = snakeCanvas.randomLocation();
var delay = 0;

