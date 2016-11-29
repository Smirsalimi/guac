var snakeCanvas = {
  canvasWidth: 800,
  canvasHeight: 600,
  pixelSize: 40,
  KEY_MAPPING: {
    39: "right",
    40: "down",
    37: "left",
    38: "up"
  },
  started: true,
  attrs: {},
  gameHeight: function() {
    return this.attrs.gameHeight || (this.attrs.gameHeight = this.canvasHeight / this.pixelSize);
  },
  gameWidth: function() {
    return this.attrs.gameWidth || (this.attrs.gameWidth = this.canvasWidth / this.pixelSize);
  },
  canvas: function() {
    if (snakeCanvas.context) { return snakeCanvas.context; }
    var canvas = document.getElementById("snake-game");
    snakeCanvas.context = canvas.getContext("2d");
    return snakeCanvas.context;
  },
  executeNTimesPerSecond: function(tickCallback, gameSpeed) {
    tickCallback();
    snakeCanvas.processID = setInterval(function() {
      tickCallback();
    }, 1000 / gameSpeed);
  },
  onArrowKey: function(callback) {
    document.addEventListener('keydown', function(e) {
      if (snakeCanvas.KEY_MAPPING[e.which]) {
        e.preventDefault();
        callback(snakeCanvas.KEY_MAPPING[e.which]);
      }
    });
  },
  endGame: function() {
    this.started = false
    clearInterval(snakeCanvas.processID);
  },
  draw: function(objects) {
    if (this.started) {
     snakeCanvas.clear();
     snakeCanvas.drawObjects(objects);
    }
  },
  clear: function() {
    snakeCanvas.canvas().clearRect(0, 0, snakeCanvas.canvasWidth, snakeCanvas.canvasHeight);
  },
  drawObjects: function(objects) {
    var ui = this;
    objects.forEach(function(object) {
      object.pixels.forEach(function(pixel) {
      	var translatedPixel = snakeCanvas.translatePixel(pixel);
        ui.canvas().drawImage(object.img, translatedPixel.left, translatedPixel.top);
      });
    });
  },
  drawPixel: function(color, pixel) {
    snakeCanvas.canvas().fillStyle = color;
    var translatedPixel = snakeCanvas.translatePixel(pixel);
    snakeCanvas.context.fillRect(translatedPixel.left, translatedPixel.top, snakeCanvas.pixelSize, snakeCanvas.pixelSize);
  },
  translatePixel: function(pixel) {
    return { left: ((this.gameWidth() + pixel.left) %  this.gameWidth()) * snakeCanvas.pixelSize,
             top: ((this.gameHeight() + pixel.top) % this.gameHeight()) * snakeCanvas.pixelSize }
  },
  gameBoundaries: function() {
    if (this.attrs.boundaries) { return this.attrs.boundaries; }
    this.attrs.boundaries = [];
    for (var top = -1; top <= snakeCanvas.gameHeight(); top++) {
      this.attrs.boundaries.push({ top: top, left: -1});
      this.attrs.boundaries.push({ top: top, left: this.gameWidth() + 1});
    }
    for (var left = -1; left <= snakeCanvas.gameWidth(); left++) {
      this.attrs.boundaries.push({ top: -1, left: left});
      this.attrs.boundaries.push({ top: this.gameHeight() + 1, left: left });
    }
    return this.attrs.boundaries;
  },
  detectCollisionBetween: function(objectA, objectB) {
    return objectA.some(function(pixelA) {
      return objectB.some(function(pixelB) {
        return pixelB.top === pixelA.top && pixelB.left === pixelA.left;
      });
    });
  },
  randomLocation: function() {
    return {
      top: Math.floor(Math.random()*snakeCanvas.gameHeight()),
      left: Math.floor(Math.random()*snakeCanvas.gameWidth()),
    }
  },
  flashMessage: function(message) {
    var canvas = document.getElementById("snake-game");
    var context = canvas.getContext('2d');
    context.font = '20pt Calibri';
    context.fillStyle = 'yellow';
    context.fillText(message, 275, 100);
  }
}
