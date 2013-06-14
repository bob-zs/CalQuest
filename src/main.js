var canvasWidth = 1024
var canvasHeight = 768
var tileWidth = 64
var tileHeight = 64
var numHorizontalTiles = canvasWidth/tileWidth
var numVerticalTiles = canvasHeight/tileHeight

Game = {
	start: function() {
		Crafty.init(canvasWidth, canvasHeight);
		setUpComponents();
    	setUpScenes();
		Crafty.scene("loading");
	}
}
