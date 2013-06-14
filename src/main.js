var canvasWidth = 1024
var canvasHeight = 768
var tileWidth = 64
var tileHeight = 64
var numHorizontalTiles = canvasWidth/tileWidth
var numVerticalTiles = canvasHeight/tileHeight
var exitLoc = {x: 5, y: 5}
var player

Game = {
	start: function() {
		Crafty.init(canvasWidth, canvasHeight);
    	
    	//scene transition function
		function load_scene(scene, duration) {
		    Crafty.e("2D, DOM, Tween, Color")
		        .attr({alpha:0.0, x:0, y:0, z: 5, w:canvasWidth, h:canvasHeight})
		        .color("#000")
		        .tween({alpha: 1.0}, duration)
		        .bind("TweenEnd", function() {
		            Crafty.scene(scene);
		            Crafty.e("2D, DOM, Tween, Color")
		                .attr({alpha:1.0, x:0, y:0, z: 5, w:canvasWidth, h:canvasHeight})
		                .color("#000")
		                .tween({alpha: 0.0}, duration*2);
		        });
		}
    	
		//loading scene
		Crafty.scene("loading", function() {
   				
	        Crafty.load(["assets/images/titleScreen.png", 
	        			"assets/images/title.png",
	        			"assets/images/newGame.png",
	        			"assets/images/newGameHover.png",
	        			"assets/images/loadGame.png",
	        			"assets/images/loadGameHover.png",
	        			"assets/images/crafty-sprite.png",
	        			"assets/images/doorwaySprite.png",
	        			"assets/sounds/doorSound.mp3",
	        			"assets/sounds/doorSound.ogg",
	        			"assets/sounds/background.mp3",
	        			"assets/sounds/background.ogg"],
	        	function() {
	        		Crafty.sprite(tileWidth, "assets/images/sprites/crafty-sprite.png", {
			        	grass1: [0,0],
			        	grass2: [1,0],
			        	grass3: [2,0],
			        	grass4: [3,0],
			        	flower: [0,1],
			        	bush1: [0,2],
			        	bush2: [1,2],
			        	player: [0,3]
			    	});
			    	Crafty.sprite(tileWidth, "assets/images/sprites/doorwaySprite.png", {
			        	doorway: [0,0]
	    			});
	    			Crafty.audio.add({
						background: ["assets/sounds/background.mp3",
									"assets/sounds/background.ogg"],
						doorSound: ["assets/sounds/doorSound.mp3",
									"assets/sounds/doorSound.ogg"]
					});
					Crafty.audio.play("background", -1)
	            	load_scene("titleScreen", 40)
	        	});
	        
	        Crafty.background("#000");
	        Crafty.e("2D, DOM, Text")
	        	.attr({w: 100, h: 20, x: 400, y: 290}) //x=(canvasWidth-this._w)/2, y=(canvasHeight-this._h)/2
	            .text("Loading")
	            .css({"text-align": "center"});
   		});
		
		// titleScreen scene
		Crafty.scene("titleScreen", function(){
	    	Crafty.background("url('assets/images/titleScreen/background.png')")

	    	var title = Crafty.e("2D, DOM, Image")
	    		.image("assets/images/titleScreen/title.png")
	    		.attr({x: 180, y: 150}) //x=(canvasWidth-this._w)/2
	    	
	    	var newGame = Crafty.e("2D, DOM, Mouse, Image")
	    		.image("assets/images/titleScreen/newGame.png")
	    		.attr({x: 350, y: 500}) // x=(canvasWidth-this._w)/2
	    		.bind("MouseOver", function(){
	    			newGame.image("assets/images/titleScreen/newGameHover.png");
	    		})
	    		.bind("MouseOut", function(){
	    			newGame.image("assets/images/titleScreen/newGame.png");
	    		})
	    		.bind("Click", function(){
	    			load_scene("main", 40);
	    		})
	    		
	    	var loadGame = Crafty.e("2D, DOM, Mouse, Image")
	    		.image("assets/images/titleScreen/loadGame.png")
	    		.attr({x: 350, y: 600}) // x=(canvasWidth-this._w)/2
	    		.bind("MouseOver", function(){
	    			loadGame.image("assets/images/titleScreen/loadGameHover.png");
	    		})
	    		.bind("MouseOut", function(){
	    			loadGame.image("assets/images/titleScreen/loadGame.png");
	    		})
	    		.bind("Click", function(){
	    			load_scene('loadGameScreen', 40)
	    		})
		});
		
		Crafty.scene("loadGameScreen", function (){
			 // Load game window image
			Crafty.e("2D, DOM, Image").image("assets/images/loadGameScreen/scroll.png")
				.attr({x: 250, y: 25, w: 20, h: 20})
			// text on load window game
			Crafty.e("2D, DOM, Text")
				.attr({x: 410, y: 200, w: 500})
				.text("Load Game")
				.textFont({size: "45px", weight: "bold"})
				.textColor("#7B4A12", 0.9)
				.unselectable()
			// Memory Slot 1
			var slot1 = Crafty.e("2D, DOM, Image, Mouse, Tween")
				.image("assets/images/loadGameScreen/slot1.png")
				.attr({x: 355, y: 350}) 
				.bind("MouseOver", function(){
					slot1.image("assets/images/loadGameScreen/slot1select.png")
				})
				.bind("MouseOut", function(){
					slot1.image("assets/images/loadGameScreen/slot1.png")
				})
				.bind("Click", function(){
					Crafty.storage.load("slot1")
				})
			// Memory Slot 2
			var slot2 = Crafty.e("2D, DOM, Image, Mouse")
				.image("assets/images/loadGameScreen/slot2.png")
				.attr({x: 355, y: 450}) 
				.bind("MouseOver", function(){
					slot2.image("assets/images/loadGameScreen/slot2select.png")
				})
				.bind("MouseOut", function(){
					slot2.image("assets/images/loadGameScreen/slot2.png")
				})
				.bind("Click", function(){
					Crafty.storage.load("slot1")
				})
			// Back to Main Menu Button
			var backToMain = Crafty.e("2D, DOM, Image, Mouse")
				.image("assets/images/loadGameScreen/backToMain.png")
				.attr({x: 10, y: 10}) 
				.bind("MouseOver", function(){
					backToMain.image("assets/images/loadGameScreen/backToMainSelect.png")
				})
				.bind("MouseOut", function(){
					backToMain.image("assets/images/loadGameScreen/backToMain.png")
				})
				.bind("Click", function(){
					load_scene("titleScreen", 40)
				})
		});
			    
	    Crafty.c('Grid', {
			init: function() {
				this.attr({w: tileWidth, h: tileHeight})
			},
			 
			// Locate this entity at the given position on the grid
			at: function(x, y) {
				if (x === undefined && y === undefined) {
					return {x: this.x/tileWidth, y: this.y/tileHeight}
				} else {
					this.attr({ x: x * tileWidth, y: y * tileHeight});
					return this;
				}
			}
		});
		
		Crafty.c('Actor', {
			init: function() {
				this.requires('2D, DOM, Grid');
			}
		});
		
		Crafty.c('Exit', {
			init: function() {
				this.requires('Actor');
			},
			setID: function(ID) {
				this.ID = ID;
			}
		});
		
		Crafty.c('Door', {
			init: function() {
				this.requires('Exit, doorway, SpriteAnimation').animate("phase", 0, 0, 2);
				this.animate("phase", 80, -1)
			},
			setID: function(ID) {
				this.ID = ID;
				return this;
			}
		});
		
		Crafty.c('Flower', {
			init: function() {
				this.requires('Actor, flower, SpriteAnimation').animate("wind", 0, 1, 3);
				this.animate("wind", 80, -1)
			}
		});
		
		Crafty.c('PlayerCharacter', {
			init: function() {
				this.requires('Actor, Fourway, player, SpriteAnimation, Collision, Persist')
				.fourway(3)
				.stopOnSolids()
				.exitOnDoors()
				.attr({z: 3})
				.animate('PlayerMovingUp', 3, 3, 5)
				.animate('PlayerMovingRight', 9, 3, 11)
				.animate('PlayerMovingDown', 0, 3, 2)
				.animate('PlayerMovingLeft', 6, 3, 8);
	 			
	 			var animation_speed = 15;
				this.bind('NewDirection', function(data) {
					this.stop();
					if (data.x > 0) {
						this.animate('PlayerMovingRight', animation_speed, -1);
					} else if (data.x < 0) {
						this.animate('PlayerMovingLeft', animation_speed, -1);
					} else if (data.y > 0) {
						this.animate('PlayerMovingDown', animation_speed, -1);
					} else if (data.y < 0) {
						this.animate('PlayerMovingUp', animation_speed, -1);
					}
				});
			},
 
			stopOnSolids: function() {
				this.onHit('Solid', this.stopMovement);
				return this;
			},
			 
			stopMovement: function(ent) {
				if (this._movement){
					for (var i=0; i<ent.length; i++){
						var obj = ent[i].obj;
						var up = (!obj.contains(this._x, this._y, 2, 0)) && (!obj.contains(this._x+this._w-2, this._y, 2, 0));
						var down = (!obj.contains(this._x, this._y+this._h, 2, 0)) && (!obj.contains(this._x+this._w-2, this._y+this._h, 2, 0));
		 				var left = (!obj.contains(this._x, this._y, 0, 2)) && (!obj.contains(this._x, this._y+this._h-2, 0, 2));
						var right = (!obj.contains(this._x+this._w, this._y, 0, 2)) && (!obj.contains(this._x+this._w, this._y+this._h-2, 0, 2));
						if ((this._movement.y > 0 && !down) || (this._movement.y < 0 && !up)){
							this.y -= (this._movement.y*1.1);
						}
						if ((this._movement.x > 0 && !right) || (this._movement.x < 0 && !left)){
							this.x -= (this._movement.x*1.1);
						}
					}
				}
			},
			
			exitOnDoors: function(){
				this.onHit('Door', function(ent){
					var door = ent[0].obj;
					if (door.contains(this._x+(this._w/2)-5, this._y+(this._h/2)-5, 10, 10)){
						Crafty.audio.play("doorSound");
						exitLoc = door.at();
						load_scene(door.ID, 40);
					}
				});
				return this;
			}
		});

		function generateWorld() {
			/* 
			this.occupied = new Array(numHorizontalTiles);
			for (var i = 0; i < numHorizontalTiles; i++) {
				this.occupied[i] = new Array(numVerticalTiles);
				for (var j = 0; j < numVerticalTiles; j++) {
					this.occupied[i][j] = false;
				}
			}
			Change: OCCUPIED
			*/
			Crafty.background("url('assets/images/sprites/grassField.png')")
			
	        for(var i = 0; i < numHorizontalTiles; i++) {
	            for(var j = 0; j < numVerticalTiles; j++) {
                	if(i > 0 && i < (numHorizontalTiles-1) && j > 0 && j < (numVerticalTiles-1) && Crafty.math.randomInt(0, 50) > 49) {
	                    Crafty.e("Flower").at(i, j);
	                }
	            }
	        }
	        
	        for(var i = 0; i < numHorizontalTiles; i++) {
	            Crafty.e("Actor, Solid, bush"+Crafty.math.randomInt(1,2))
	                .at(i, 0)
	            Crafty.e("Actor, Solid, bush"+Crafty.math.randomInt(1,2))
	                .at(i, numVerticalTiles-1)
	            // this.occupied[i, 0] = this.occupied[i, numVerticalTiles-1] = true; Change: OCCUPIED
	        }
	        
	        for(var i = 1; i < numVerticalTiles-1; i++) {
	            Crafty.e("Actor, Solid, bush"+Crafty.math.randomInt(1,2))
	                .at(0, i)
	            Crafty.e("Actor, Solid, bush"+Crafty.math.randomInt(1,2))
	                .at(numHorizontalTiles-1, i)
	            // this.occupied[0, i] = this.occupied[numHorizontalTiles-1, i] = true; Change: OCCUPIED
	        }
	        
	        // return this.occupied; Change: OCCUPIED
	    }
		
		//main scene
		Crafty.scene("main" , function(){
    		generateWorld(); //this.occupied = generateWorld(); Change: OCCUPIED
    		if (!player)
	        	player = Crafty.e("PlayerCharacter").at(5, 5);
	        else
	        	player.at(exitLoc.x, exitLoc.y);
	        Crafty.e("Door").at(7, 2).setID("nextRoom");
	        Crafty.e("Door").at(2, 8).setID("nextRoom");
		});
		
		Crafty.scene("nextRoom", function(){
			generateWorld(); //this.occupied = generateWorld(); Change: OCCUPIED
			player.at(exitLoc.x, exitLoc.y);
			Crafty.e("Door").at(5, 5).setID("main");
	        Crafty.e("Door").at(3, 2).setID("main");
		});
		
		Crafty.scene("loading");
		
	}
}
