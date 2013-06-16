var player
var exitLoc = {x: 5, y: 5} //Keeps track on where the player last exited on the map (used to determine where he should appear on the next map)
var volume = {sound_vol: 1.0, music_vol: 1.0}
var special_eff = true
var paused = false
var scroll

//scene transition function
function load_scene(scene, duration) {
	Crafty.e("2D, DOM, Tween, Color")
		.attr({alpha:0.0, x:0, y:0, z: 10, w:canvasWidth, h:canvasHeight})
		.color("#000")
		.tween({alpha: 1.0}, duration)
		.bind("TweenEnd", function() {
			Crafty.scene(scene);
			Crafty.e("2D, DOM, Tween, Color")
				.attr({alpha:1.0, x:0, y:0, z: 10, w:canvasWidth, h:canvasHeight})
			    .color("#000")
			    .tween({alpha: 0.0}, duration*2);
		});
		if (!!scroll)
			scroll.attr({alpha: 0, z:5}).removeComponent("Mouse")
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
			
        Crafty.load(["assets/images/scroll.png",
                	"assets/images/back.png",
        			"assets/images/backHover.png",
        			"assets/images/titleScreen/background.png", 
        			"assets/images/titleScreen/title.png",
        			"assets/images/titleScreen/newGame.png",
        			"assets/images/titleScreen/newGameHover.png",
        			"assets/images/titleScreen/loadGame.png",
        			"assets/images/titleScreen/loadGameHover.png",
        			"assets/images/pauseScreen/settings.png",
        			"assets/images/pauseScreen/settingsHover.png",
        			"assets/images/pauseScreen/backToGame.png",
        			"assets/images/pauseScreen/backToGameHover.png",
        			"assets/images/pauseScreen/saveGame.png",
        			"assets/images/pauseScreen/saveGameHover.png",
        			"assets/images/pauseScreen/quitGame.png",
        			"assets/images/pauseScreen/quitGameHover.png",
        			"assets/images/settingsScreen/mute.png",
        			"assets/images/settingsScreen/unmute.png",
        			"assets/images/settingsScreen/check.png",
        			"assets/images/settingsScreen/uncheck.png",
        			"assets/images/loadGameScreen/backToMain.png",
        			"assets/images/loadGameScreen/backToMainSelect.png",
        			"assets/images/loadGameScreen/slot1.png",
        			"assets/images/loadGameScreen/slot1select.png",
        			"assets/images/loadGameScreen/slot2.png",
        			"assets/images/loadGameScreen/slot2select.png",
        			"assets/images/sprites/crafty-sprite.png",
        			"assets/images/sprites/doorwaySprite.png",
        			"assets/images/sprites/grassField.png",
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
        	.attr({w: 400, h: 100, x: (canvasWidth-400)/2, y: (canvasHeight-100)/2}) //x=(canvasWidth-this._w)/2, y=(canvasHeight-this._h)/2
            .text("Loading")
            .textFont({size: '50px'})
            .css({"text-align": "center"});
	});
	
	// titleScreen scene
	Crafty.scene("titleScreen", function(){
    	Crafty.background("url('assets/images/titleScreen/background.png')")
		
		scroll = Crafty.e("2D, DOM, Image, Persist")
	    			.image("assets/images/scroll.png")
	    			.attr({x: 150, y: 25, z:5, alpha:0})
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
    			scroll.attr({alpha: 1.0}).addComponent("Mouse")
	    		Crafty.e("2D, DOM, Text, NewGame")
					.attr({x: 410, y: 200, w: 500, z:5})
					.text("New Game")
					.textFont({size: "45px", weight: "bold"})
					.textColor("#7B4A12", 0.9)
					.unselectable()
	    		var slot1 = Crafty.e("2D, DOM, Image, Mouse, NewGame")
					.image("assets/images/loadGameScreen/slot1.png")
					.attr({x: 355, y: 350, z:5})
					.bind("MouseOver", function(){
						slot1.image("assets/images/loadGameScreen/slot1select.png")
					})
					.bind("MouseOut", function(){
						slot1.image("assets/images/loadGameScreen/slot1.png")
					})
					.bind("Click", function(){
						console.log('Overwrite slot 1')
						load_scene("main", 40)
					})
				// Memory Slot 2
				var slot2 = Crafty.e("2D, DOM, Image, Mouse, NewGame")
					.image("assets/images/loadGameScreen/slot2.png")
					.attr({x: 355, y: 450, z:5}) 
					.bind("MouseOver", function(){
						slot2.image("assets/images/loadGameScreen/slot2select.png")
					})
					.bind("MouseOut", function(){
						slot2.image("assets/images/loadGameScreen/slot2.png")
					})
					.bind("Click", function(){
						console.log('Overwrite slot 2')
						load_scene("main", 40)
					})
				var back = Crafty.e("2D, DOM, Mouse, Image, NewGame")
		    		.image("assets/images/back.png")
		    		.attr({x: 400, y: 550, z:5})
		    		.bind("MouseOver", function(){
		    			back.image("assets/images/backHover.png");
		    		})
		    		.bind("MouseOut", function(){
		    			back.image("assets/images/back.png");
		    		})
		    		.bind("Click", function(){
		    			Crafty('NewGame').destroy()
		    			scroll.attr({alpha: 0}).removeComponent("Mouse")
	    			})
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
		    	scroll.attr({alpha: 1.0}).addComponent("Mouse")
				// text on load window game
				Crafty.e("2D, DOM, Text, Load")
					.attr({x: 410, y: 200, w: 500, z:5})
					.text("Load Game")
					.textFont({size: "45px", weight: "bold"})
					.textColor("#7B4A12", 0.9)
					.unselectable()
				// Memory Slot 1
				var slot1 = Crafty.e("2D, DOM, Image, Mouse, Load")
					.image("assets/images/loadGameScreen/slot1.png")
					.attr({x: 355, y: 350, z:5}) 
					.bind("MouseOver", function(){
						slot1.image("assets/images/loadGameScreen/slot1select.png")
					})
					.bind("MouseOut", function(){
						slot1.image("assets/images/loadGameScreen/slot1.png")
					})
					.bind("Click", function(){
						alert('Load slot 1')
						//Crafty.storage.load("slot1")
					})
				// Memory Slot 2
				var slot2 = Crafty.e("2D, DOM, Image, Mouse, Load")
					.image("assets/images/loadGameScreen/slot2.png")
					.attr({x: 355, y: 450, z:5}) 
					.bind("MouseOver", function(){
						slot2.image("assets/images/loadGameScreen/slot2select.png")
					})
					.bind("MouseOut", function(){
						slot2.image("assets/images/loadGameScreen/slot2.png")
					})
					.bind("Click", function(){
						alert('Load slot 2')
						//Crafty.storage.load("slot2")
					})
				// Back to Main Menu Button
				var back = Crafty.e("2D, DOM, Mouse, Image, Load")
		    		.image("assets/images/back.png")
		    		.attr({x: 400, y: 550, z:5})
		    		.bind("MouseOver", function(){
		    			back.image("assets/images/backHover.png");
		    		})
		    		.bind("MouseOut", function(){
		    			back.image("assets/images/back.png");
		    		})
		    		.bind("Click", function(){
		    			Crafty('Load').destroy()
		    			scroll.attr({alpha: 0}).removeComponent("Mouse")
		    		})
    		})
    		
    	var settings = Crafty.e("2D, DOM, Mouse, Image")
    		.image("assets/images/pauseScreen/settings.png")
    		.attr({x: 350, y: 700})
    		.bind("MouseOver", function(){
    			settings.image("assets/images/pauseScreen/settingsHover.png");
    		})
    		.bind("MouseOut", function(){
    			settings.image("assets/images/pauseScreen/settings.png");
    		})
    		.bind("Click", function(){
    			scroll.attr({alpha: 1.0}).addComponent("Mouse")
				Crafty.e("2D, DOM, Text, Settings")
					.attr({x: 410, y: 200, w: 500, z:5})
					.text("Settings")
					.textFont({size: "45px", weight: "bold"})
					.textColor("#7B4A12", 0.9)
					.unselectable()
	    		Crafty.e('2D, DOM, Text, Settings')
    				.attr({w: 100, h: 50, x:400, y:250, z:5})
    				.text("Sound")
    				.textFont({size: '30px'})
    			var soundFrontBar = Crafty.e('Bar, Settings')
		    		.attr({x:405,y:300,w:volume.sound_vol*200, h:20, z:6})
		    		.color("black")
		    	var soundBackBar = Crafty.e('Bar, Settings')
		    		.attr({x:400,y:295,w:210, h:30, z:5})
		    		.color("white")
					.resolve(soundFrontBar, volume, false)
				
				Crafty.e('2D, DOM, Text, Settings')
    				.attr({w: 100, h: 50, x:400, y:350, z:5})
    				.text("Music")
    				.textFont({size: '30px'})
		    	var musicFrontBar = Crafty.e('Bar, Settings')
		    		.attr({x:405,y:400,w:volume.music_vol*200, h:20,z:6})
		    		.color("black")
		    	var musicBackBar = Crafty.e('Bar, Settings')
		    		.attr({x:400,y:395,w:210, h:30, z:5})
		    		.color("white")
		    		.resolve(musicFrontBar, volume, true)
    			
    			var mute = Crafty.e("2D, DOM, Mouse, Image, Settings")
		    		.attr({x: 400, y: 450, z:6})
		    		.bind("Click", function(){
		    			if (Crafty.audio.toggleMute())
		    				mute.image("assets/images/settingsScreen/unmute.png")
		    			else
		    				mute.image("assets/images/settingsScreen/mute.png")
		    		})
		    	if (Crafty.audio.muted)
		    		mute.image("assets/images/settingsScreen/unmute.png")
		    	else
		    		mute.image("assets/images/settingsScreen/mute.png")
    			
    			Crafty.e('2D, DOM, Text, Settings')
    				.attr({w: 200, h: 50, x:400, y:520, z:5})
    				.text("Special Effects: ")
    				.textFont({size: '26px'})
		    	var special_eff_box = Crafty.e('2D, DOM, Image, Mouse, Settings')
		    		.attr({x:580, y:520, z:5})
		    		.bind('Click',function(){
		    			if(special_eff){
		    				this.image('assets/images/settingsScreen/uncheck.png');
		    				special_eff=false;
		    			}else{
		    				this.image('assets/images/settingsScreen/check.png');
		    				special_eff=true;
		    			}
		    		})
		    	if (special_eff)
		    		special_eff_box.image('assets/images/settingsScreen/check.png')
		    	else 
					special_eff_box.image('assets/images/settingsScreen/uncheck.png')
				
				var back = Crafty.e("2D, DOM, Mouse, Image, Settings")
		    		.image("assets/images/back.png")
		    		.attr({x: 400, y: 600, z:5})
		    		.bind("MouseOver", function(){
		    			back.image("assets/images/backHover.png");
		    		})
		    		.bind("MouseOut", function(){
		    			back.image("assets/images/back.png");
		    		})
		    		.bind("Click", function(){
		    			Crafty('Settings').destroy()
		    			scroll.attr({alpha: 0}).removeComponent("Mouse") 
	    			})
    		})
	});
	    
    var pause = function() {
    	paused = true;
    	player.stop().fourway(0);
	    var shade = Crafty.e('2D, DOM, Color, Mouse, Pause')
	    				.attr({w: canvasWidth, h: canvasHeight, z: 3, alpha: 0.5})
	    				.color("black")
	    scroll.attr({alpha: 1.0}).addComponent("Mouse")
    	var settings = Crafty.e("2D, DOM, Mouse, Image, Pause")
    		.image("assets/images/pauseScreen/settings.png")
    		.attr({x: 400, y: 300, z:5})
    		.bind("MouseOver", function(){
    			settings.image("assets/images/pauseScreen/settingsHover.png");
    		})
    		.bind("MouseOut", function(){
    			settings.image("assets/images/pauseScreen/settings.png");
    		})
    		.bind("Click", function(){
    			scroll.attr({z: 6})
	    		Crafty.e("2D, DOM, Text, Pause, Settings")
					.attr({x: 410, y: 200, w: 500, z:6})
					.text("Settings")
					.textFont({size: "45px", weight: "bold"})
					.textColor("#7B4A12", 0.9)
					.unselectable()
	    		Crafty.e('2D, DOM, Text, Pause, Settings')
    				.attr({w: 100, h: 50, x:400, y:250, z:6})
    				.text("Sound")
    				.textFont({size: '30px'})
    			var soundFrontBar = Crafty.e('Bar, Pause, Settings')
		    		.attr({x:405,y:300,w:volume.sound_vol*200, h:20, z:7})
		    		.color("black")
		    	var soundBackBar = Crafty.e('Bar, Pause, Settings')
		    		.attr({x:400,y:295,w:210, h:30, z:6})
		    		.color("white")
					.resolve(soundFrontBar, volume, false)
				
				Crafty.e('2D, DOM, Text, Pause, Settings')
    				.attr({w: 100, h: 50, x:400, y:350, z:6})
    				.text("Music")
    				.textFont({size: '30px'})
		    	var musicFrontBar = Crafty.e('Bar, Pause, Settings')
		    		.attr({x:405,y:400,w:volume.music_vol*200, h:20,z:7})
		    		.color("black")
		    	var musicBackBar = Crafty.e('Bar, Pause, Settings')
		    		.attr({x:400,y:395,w:210, h:30, z:6})
		    		.color("white")
		    		.resolve(musicFrontBar, volume, true)
    			
    			var mute = Crafty.e("2D, DOM, Mouse, Image, Pause, Settings")
		    		.attr({x: 400, y: 450, z:6})
		    		.bind("Click", function(){
		    			if (Crafty.audio.toggleMute())
		    				mute.image("assets/images/settingsScreen/unmute.png")
		    			else
		    				mute.image("assets/images/settingsScreen/mute.png")
		    		})
		    	if (Crafty.audio.muted)
		    		mute.image("assets/images/settingsScreen/unmute.png")
		    	else
		    		mute.image("assets/images/settingsScreen/mute.png")
    			
    			Crafty.e('2D, DOM, Text, Pause, Settings')
    				.attr({w: 200, h: 50, x:400, y:520, z:6})
    				.text("Special Effects: ")
    				.textFont({size: '26px'})
		    	var special_eff_box = Crafty.e('2D, DOM, Image, Mouse, Pause, Settings')
		    		.attr({x:580, y:520, z:6})
		    		.bind('Click',function(){
		    			if(special_eff){
		    				this.image('assets/images/settingsScreen/uncheck.png');
		    				special_eff=false;
		    			}else{
		    				this.image('assets/images/settingsScreen/check.png');
		    				special_eff=true;
		    			}
		    		})
		    	if (special_eff)
		    		special_eff_box.image('assets/images/settingsScreen/check.png')
		    	else 
					special_eff_box.image('assets/images/settingsScreen/uncheck.png')
				
				var back = Crafty.e("2D, DOM, Mouse, Image, Pause, Settings")
		    		.image("assets/images/back.png")
		    		.attr({x: 400, y: 600, z:6})
		    		.bind("MouseOver", function(){
		    			back.image("assets/images/backHover.png");
		    		})
		    		.bind("MouseOut", function(){
		    			back.image("assets/images/back.png");
		    		})
		    		.bind("Click", function(){
		    			Crafty('Settings').destroy()
		    			scroll.attr({z: 5})
	    			})
    		})
    	var backToGame = Crafty.e("2D, DOM, Mouse, Image, Pause")
    		.image("assets/images/pauseScreen/backToGame.png")
    		.attr({x: 400, y: 200, z:5})
    		.bind("MouseOver", function(){
    			backToGame.image("assets/images/pauseScreen/backToGameHover.png");
    		})
    		.bind("MouseOut", function(){
    			backToGame.image("assets/images/pauseScreen/backToGame.png");
    		})
    		.bind("Click", function(){
    			paused = false
    			player.fourway(3)
    			Crafty('Pause').destroy()
    			scroll.attr({alpha: 0}).removeComponent("Mouse")
    		})
    	var saveGame = Crafty.e("2D, DOM, Mouse, Image, Pause")
    		.image("assets/images/pauseScreen/saveGame.png")
    		.attr({x: 400, y: 400, z:5})
    		.bind("MouseOver", function(){
    			saveGame.image("assets/images/pauseScreen/saveGameHover.png");
    		})
    		.bind("MouseOut", function(){
    			saveGame.image("assets/images/pauseScreen/saveGame.png");
    		})
    		.bind("Click", function(){
    			scroll.attr({z: 6})
	    		Crafty.e("2D, DOM, Text, Pause, Save")
					.attr({x: 410, y: 200, w: 500, z:6})
					.text("Save Game")
					.textFont({size: "45px", weight: "bold"})
					.textColor("#7B4A12", 0.9)
					.unselectable()
	    		var slot1 = Crafty.e("2D, DOM, Image, Mouse, Pause, Save")
					.image("assets/images/loadGameScreen/slot1.png")
					.attr({x: 355, y: 350, z:6}) 
					.bind("MouseOver", function(){
						slot1.image("assets/images/loadGameScreen/slot1select.png")
					})
					.bind("MouseOut", function(){
						slot1.image("assets/images/loadGameScreen/slot1.png")
					})
					.bind("Click", function(){
						alert('Save slot 1')
						//Crafty.storage.save("slot1")
					})
				// Memory Slot 2
				var slot2 = Crafty.e("2D, DOM, Image, Mouse, Pause, Save")
					.image("assets/images/loadGameScreen/slot2.png")
					.attr({x: 355, y: 450, z:6}) 
					.bind("MouseOver", function(){
						slot2.image("assets/images/loadGameScreen/slot2select.png")
					})
					.bind("MouseOut", function(){
						slot2.image("assets/images/loadGameScreen/slot2.png")
					})
					.bind("Click", function(){
						alert('Save slot 2')
						//Crafty.storage.save("slot2")
					})
				var back = Crafty.e("2D, DOM, Mouse, Image, Pause, Save")
		    		.image("assets/images/back.png")
		    		.attr({x: 400, y: 550, z:6})
		    		.bind("MouseOver", function(){
		    			back.image("assets/images/backHover.png");
		    		})
		    		.bind("MouseOut", function(){
		    			back.image("assets/images/back.png");
		    		})
		    		.bind("Click", function(){
		    			Crafty('Save').destroy()
		    			scroll.attr({z: 5})
	    			})
    		})
    	var quitGame = Crafty.e("2D, DOM, Mouse, Image, Pause")
    		.image("assets/images/pauseScreen/quitGame.png")
    		.attr({x: 400, y: 500, z:5})
    		.bind("MouseOver", function(){
    			quitGame.image("assets/images/pauseScreen/quitGameHover.png");
    		})
    		.bind("MouseOut", function(){
    			quitGame.image("assets/images/pauseScreen/quitGame.png");
    		})
    		.bind("Click", function(){
    			scroll.attr({z: 6})
	    		var confirm = Crafty.e("2D, DOM, Text, Pause, Quit")
	    			.attr({w: 400, h:100, x: (canvasWidth-400)/2, y: 250, z:6})
	    			.text("y' sure?")
	    			.textFont({size: '40px'})
	    			.css({"text-align": "center"});
	    		var yes = Crafty.e("2D, DOM, Image, Mouse, Pause, Quit")
					.image("assets/images/loadGameScreen/slot1.png")
					.attr({x: 355, y: 350, z:6})
					.bind("MouseOver", function(){
						yes.image("assets/images/loadGameScreen/slot1select.png")
					})
					.bind("MouseOut", function(){
						yes.image("assets/images/loadGameScreen/slot1.png")
					})
					.bind("Click", function(){
						if (!!player){
							player.destroy();
							player = null
						}
						load_scene("titleScreen", 40)
					})
				var no = Crafty.e("2D, DOM, Image, Mouse, Pause, Quit")
					.image("assets/images/loadGameScreen/slot2.png")
					.attr({x: 355, y: 450, z:6})
					.bind("MouseOver", function(){
						no.image("assets/images/loadGameScreen/slot2select.png")
					})
					.bind("MouseOut", function(){
						no.image("assets/images/loadGameScreen/slot2.png")
					})
					.bind("Click", function(){
						Crafty('Quit').destroy()
						scroll.attr({z: 5})
					})
    		})
    }
	
	//main scene
	Crafty.scene("main" , function(){
		generateWorld(); //this.occupied = generateWorld(); Change: OCCUPIED
		if (!player){
        	player = Crafty.e("PlayerCharacter").at(5, 5).bind('KeyDown', function(e){
				if (e.key == Crafty.keys['ESC']){
					if (paused){
						paused = false
						player.fourway(3)
    					Crafty('Pause').destroy()
    					scroll.attr({alpha: 0}).removeComponent("Mouse")
    				}
					else
						pause();
				}
			});
		}
        else{
        	player.at(exitLoc.x, exitLoc.y)
        }
        Crafty.e("Door").at(7, 2).setID("nextRoom");
        Crafty.e("Door").at(2, 8).setID("nextRoom");
	});
	
	Crafty.scene("nextRoom", function(){
		generateWorld(); //this.occupied = generateWorld(); Change: OCCUPIED
		player.at(exitLoc.x, exitLoc.y)
		Crafty.e("Door").at(5, 5).setID("main");
        Crafty.e("Door").at(3, 2).setID("main");
	});

}