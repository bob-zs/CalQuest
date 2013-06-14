var setUpComponents = function(){
	
	Crafty.c('Bar',{
	    init: function(){
	        this.requires('2D, DOM, Color, Tween')
	    },
	
	    resolve: function(object, volume, music){
	    	this.requires('Mouse')
	        this.bind('Click', function(e){
	        	if (music){
		            if (this._w + this._x - 5 < e.realX){
		            	volume.music_vol = 1.0
		            	object.tween({w: 200}, 20);
		            } else if (this._x + 5 > e.realX){
		            	volume.music_vol = 1.0
		            	object.tween({w: 0}, 20);
		            } else {
		                volume.music_vol = (e.realX-(this._x+10))/200
		                object.tween({w: e.realX - (this._x + 5)}, 20);
		            }
		            Crafty.audio.play("background", -1, change, true)
	            }
	            else {
	            	if (this._w + this._x - 5 < e.realX){
		            	volume.sound_vol = 1.0
		            	object.tween({w: 200}, 20);
		            } else if (this._x + 5 > e.realX){
		            	volume.sound_vol = 1.0
		            	object.tween({w: 0}, 20);
		            } else {
		                volume.sound_vol = (e.realX-(this._x+10))/200
		                object.tween({w: e.realX - (this._x + 5)}, 20);
		            }
	            }
	        })
	    }
	})

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
}