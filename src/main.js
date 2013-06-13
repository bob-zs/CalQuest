var canvasWidth = 900;
var canvasHeight = 600;
var tileWidth = 60;
var tileHeight = 60;
var numHorizontalTiles = canvasWidth/tileWidth;
var numVerticalTiles = canvasHeight/tileHeight;

Game = {
	start: function() {
		
		Crafty.init(canvasWidth, canvasHeight);
		Crafty.sprite(60, "images/crafty-sprite.png", {
        	grass1: [0,0],
        	grass2: [1,0],
        	grass3: [2,0],
        	grass4: [3,0],
        	flower: [0,1],
        	bush1: [0,2],
        	bush2: [1,2],
        	player: [0,3]
    	});
    	
		//loading scene
		Crafty.scene("loading", function() {
	        Crafty.load(["images/crafty-sprite.png", 
	        			"images/titleScreen.png", 
	        			"images/newGame.png",
	        			"images/newGameHover.png",
	        			"images/loadGame.png",
	        			"images/loadGameHover.png"],
	        	function() {
	            	Crafty.scene("titleScreen");
	        });
	        
	        Crafty.background("#000");
	        Crafty.e("2D, DOM, Text")
	        	.attr({w: 100, h: 20, x: 350, y: 290}) //x=(canvasWidth-this._w)/2, y=(canvasHeight-this._h)/2
	            .text("Loading")
	            .css({"text-align": "center"});
   		});
		
		// titleScreen scene
		Crafty.scene("titleScreen", function(){
	    	Crafty.e("2D, DOM, Image").image("images/titleScreen.png")	
	    	
	    	var title = Crafty.e("2D, DOM, Image, Tween")
	    		.image("images/title.png")
	    		.attr({alpha: 0.0, x: 108, y: 50}) //x=(canvasWidth-this._w)/2
	    		.tween({alpha: 1.0}, 100);
	    	
	    	var newGame = Crafty.e("2D, DOM, Mouse, Image, Tween")
	    		.image("images/newGame.png")
	    		.attr({alpha: 0.0, x: 277, y: 400}) // x=(canvasWidth-this._w)/2
	    		.tween({alpha: 1.0}, 100)
	    		.bind("MouseOver", function(){
	    			newGame.image("images/newGameHover.png");
	    		})
	    		.bind("MouseOut", function(){
	    			newGame.image("images/newGame.png");
	    		})
	    		.bind("Click", function(){
	    			Crafty.scene("main");
	    		})
	    		
	    	var loadGame = Crafty.e("2D, DOM, Mouse, Image, Tween")
	    		.image("images/loadGame.png")
	    		.attr({alpha: 0.0, x: 277, y: 500}) // x=(canvasWidth-this._w)/2
	    		.tween({alpha: 1.0}, 100)
	    		.bind("MouseOver", function(){
	    			loadGame.image("images/loadGameHover.png");
	    		})
	    		.bind("MouseOut", function(){
	    			loadGame.image("images/loadGame.png");
	    		})
	    		.bind("Click", function(){
	    			alert("load game scene");
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
			},
		});
		
		Crafty.c('PlayerCharacter', {
			init: function() {
				this.requires('Actor, Fourway, player, SpriteAnimation, Collision')
				.fourway(3)
				.stopOnSolids()
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
			}
		});

		function generateWorld() {
			this.occupied = new Array(numHorizontalTiles);
			for (var i = 0; i < numHorizontalTiles; i++) {
				this.occupied[i] = new Array(numVerticalTiles);
				for (var j = 0; j < numVerticalTiles; j++) {
					this.occupied[i][j] = false;
				}
			}
	        //generate the grass along the x-axis
	        for(var i = 0; i < numHorizontalTiles; i++) {
	            //generate the grass along the y-axis
	            for(var j = 0; j < numVerticalTiles; j++) {
	                Crafty.e("Actor, grass"+Crafty.math.randomInt(1, 4)).at(i, j)
	                
	                //1/50 chance of drawing a flower and only not within the bushes
	                if(i > 0 && i < (numHorizontalTiles-1) && j > 0 && j < (numVerticalTiles-1) && Crafty.math.randomInt(0, 50) > 49) {
	                    Crafty.e("Actor, flower, SpriteAnimation")
	                        .at(i, j)
	                        .animate("wind", 0, 1, 3)
	                        .animate("wind", 80, -1);
	                }
	            }
	        }
	        
	        //create the bushes along the x-axis which will form the boundaries
	        for(var i = 0; i < numHorizontalTiles; i++) {
	            Crafty.e("Actor, Solid, bush"+Crafty.math.randomInt(1,2))
	                .at(i, 0)
	            Crafty.e("Actor, Solid, bush"+Crafty.math.randomInt(1,2))
	                .at(i, numVerticalTiles-1)
	            this.occupied[i, 0] = this.occupied[i, numVerticalTiles-1] = true;
	        }
	        
	        //create the bushes along the y-axis
	        //we need to start one more and one less to not overlap the previous bushes
	        for(var i = 1; i < numVerticalTiles-1; i++) {
	            Crafty.e("Actor, Solid, bush"+Crafty.math.randomInt(1,2))
	                .at(0, i)
	            Crafty.e("Actor, Solid, bush"+Crafty.math.randomInt(1,2))
	                .at(numHorizontalTiles-1, i)
	            this.occupied[0, i] = this.occupied[numHorizontalTiles-1, i] = true;
	        }
	        
	        return this.occupied;
	    }

		//main scene
		Crafty.scene("main" , function(){
    		this.occupied = generateWorld();
	        var player = Crafty.e("PlayerCharacter")
	        	.at(5,5)
		});
		
		Crafty.scene("loading");
		
	}
}
