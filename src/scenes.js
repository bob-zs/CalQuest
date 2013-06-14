var player
var exitLoc = {x: 5, y: 5} //Keeps track on where the player last exited on the map (used to determine where he should appear on the next map)
var volume = {sound_vol: 1.0, music_vol: 1.0}
var special_eff = true
var lastMap

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

function generateWorld() {
	Crafty.e("2D, DOM, Image").image('assets/images/sprites/grassField.png')
	
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

var setUpScenes = function(){
	//loading scene
	Crafty.scene("loading", function() {
			
        Crafty.load(["assets/images/titleScreen/background.png", 
        			"assets/images/titleScreen/title.png",
        			"assets/images/titleScreen/newGame.png",
        			"assets/images/titleScreen/newGameHover.png",
        			"assets/images/titleScreen/loadGame.png",
        			"assets/images/titleScreen/loadGameHover.png",
        			"assets/images/sprites/crafty-sprite.png",
        			"assets/images/sprites/doorwaySprite.png",
        			"assets/images/sprites/grassField.png",
        			"assets/images/loadGameScreen/backToMain.png",
        			"assets/images/loadGameScreen/backToMainSelect.png",
        			"assets/images/loadGameScreen/scroll.png",
        			"assets/images/loadGameScreen/slot1.png",
        			"assets/images/loadGameScreen/slot1select.png",
        			"assets/images/loadGameScreen/slot2.png",
        			"assets/images/loadGameScreen/slot2select.png",
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
        	.attr({w: 100, h: 20, x: (canvasWidth-100)/2, y: (canvasHeight-20)/2}) //x=(canvasWidth-this._w)/2, y=(canvasHeight-this._h)/2
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
    		
    	var settings = Crafty.e("2D, DOM, Mouse, Image, Persist")
    		.image("assets/images/titleScreen/settings.png")
    		.attr({x: 800, y: 10, z:4})
    		.bind("MouseOver", function(){
    			settings.image("assets/images/titleScreen/settingsHover.png");
    		})
    		.bind("MouseOut", function(){
    			settings.image("assets/images/titleScreen/settings.png");
    		})
    		.bind("Click", function(){
    			load_scene('settings', 40)
    		})
    		
    	var mute = Crafty.e("2D, DOM, Mouse, Image, Persist")
    		.attr({x: 740, y: 10, z:4})
    		.bind("Click", function(){
    			if (Crafty.audio.toggleMute())
    				mute.image("assets/images/titleScreen/unmute.png")
    			else
    				mute.image("assets/images/titleScreen/mute.png")
    		})
    	if (Crafty.audio.muted)
    		mute.image("assets/images/titleScreen/unmute.png")
    	else
    		mute.image("assets/images/titleScreen/mute.png")
	});
	
	Crafty.scene("loadGameScreen", function (){
		 // Load game window image
		Crafty.e("2D, DOM, Image").image("assets/images/loadGameScreen/scroll.png")
			.attr({x: 250, y: 25})
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
	
	Crafty.scene("settings", function() {
		if (!!player){
			player.attr({alpha:0.0});
			exitLoc = player.at();
			var backToGame = Crafty.e("2D, DOM, Image, Mouse")
				.image("assets/images/settingsScreen/backToGame.png")
				.attr({x: 10, y: 10})
				.bind("MouseOver", function(){
					backToGame.image("assets/images/settingsScreen/backToGameSelect.png")
				})
				.bind("MouseOut", function(){
					backToGame.image("assets/images/settingsScreen/backToGame.png")
				})
				.bind("Click", function(){
					load_scene(lastMap, 40)
				})
		}
		else{
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
		}
		
		Crafty.e('2D, DOM, Image').image("assets/images/loadGameScreen/scroll.png")
			.attr({x:250, y:25})

		var soundFrontBar = Crafty.e('Bar')
    		.attr({x:412,y:300,w:volume.sound_vol*200, h:20, z:2})
    		.color("black")
    	Crafty.e('Bar')
    		.attr({x:407,y:295,w:210, h:30, z:1})
    		.color("white")
			.resolve(soundFrontBar, volume, false)

    	var musicFrontBar = Crafty.e('Bar')
    		.attr({x:412,y:400,w:volume.music_vol*200, h:20,z:2})
    		.color("black")
    	Crafty.e('Bar')
    		.attr({x:407,y:395,w:210, h:30, z:1})
    		.color("white")
    		.resolve(musicFrontBar, volume, true)
    		
    	Crafty.e('2D, DOM, Image, Mouse')
    		.image('assets/images/settingsScreen/uncheck.png')
    		.attr({x:407, y:500, z:1})
    		.bind('Click',function(){
    			if(special_eff){
    				this.image('assets/images/settingsScreen/check.png');
    				special_eff=false;
    			}else{
    				this.image('assets/images/settingsScreen/uncheck.png');
    				special_eff=true;
    			}
    		})
    });
	
	//main scene
	Crafty.scene("main" , function(){
		lastMap = "main";
		generateWorld(); //this.occupied = generateWorld(); Change: OCCUPIED
		if (!player){
        	player = Crafty.e("PlayerCharacter").at(5, 5).bind('KeyDown', function(e){
			if (this.isDown('ESC'))
				load_scene('titleScreen', 40)
			});
		}
        else{
        	player.at(exitLoc.x, exitLoc.y).attr({alpha:1.0})

        }
        Crafty.e("Door").at(7, 2).setID("nextRoom");
        Crafty.e("Door").at(2, 8).setID("nextRoom");
	});
	
	Crafty.scene("nextRoom", function(){
		lastMap = "nextRoom";
		generateWorld(); //this.occupied = generateWorld(); Change: OCCUPIED
		player.at(exitLoc.x, exitLoc.y).attr({alpha:1.0})
		Crafty.e("Door").at(5, 5).setID("main");
        Crafty.e("Door").at(3, 2).setID("main");
	});
}