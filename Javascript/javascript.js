"use strict";

var game_area;
var selectedCanvas;

var handRadius = 10;

function startGame() {
	game_area = new gameArea();
	selectedCanvas = game_area;
}

// --- Events listeners --- //
window.addEventListener('keydown', function(e) {
	selectedCanvas.keyDown(e);
})
window.addEventListener('keyup', function(e) {
	selectedCanvas.keyUp(e);
})
window.addEventListener('mousedown', function(e) {
	if (e.button == 0) {
		selectedCanvas.lMouseDown(e);
	}
})
window.addEventListener('mouseup', function(e) {
	if (e.button == 0) {
		selectedCanvas.lMouseUp(e);
	}
})
window.addEventListener('mousemove', function(e) {
	selectedCanvas.mousemove(e);
})

//---------------------- gameArea --------------------------\\

function gameArea() {
	this.canvas = document.createElement("canvas");
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.xOffset = 0;
	this.yOffset = 0;
	document.body.insertBefore(this.canvas, document.body.childNodes[0]);
	this.interval = setInterval(this.update.bind(this), 20);
	this.context = this.canvas.getContext("2d");
	this.pressed = {'KeyW' : false, 'KeyA' : false, 'KeyS' : false, 'KeyD' : false, 'KeyF': false, 'lMBDown' = false};
	this.pickedItem = false;
	this.attacked = false;
	this.objects = [new player (200, 200), new item(50, 100), new item(50, 100), new item(50, 100), new item(50, 100), new ak47(400, 300), new um9(600, 600)];
	this.player = new player(Math.floor(this.canvas.width/2), Math.floor(this.canvas.height/2));
}

gameArea.prototype.clear = function() {
	this.context.clearRect(this.xOffset, this.yOffset, this.canvas.width, this.canvas.height);
}

gameArea.prototype.update = function() {
	this.clear();
	
	if (this.player.isAlive()) {
		// Character movement
		var delta_x = 0;
		var delta_y = 0;
		if (this.pressed['KeyA']) {
			delta_x -= 1;
		}
		if (this.pressed['KeyW']) {
			delta_y -= 1;
		}
		if (this.pressed['KeyD']) {
			delta_x += 1;
		}
		if (this.pressed['KeyS']) {
			delta_y += 1;
		}
		var pSpeed = this.player.getSpeed();
		delta_x *= pSpeed;
		delta_y *= pSpeed;
		this.player.move(delta_x,delta_y);
		this.moveScreenBy(delta_x,delta_y);
		if (!this.attacked) {
			if (this.lMBDown) {
				this.player.attack();
				this.attacked = true;
			}
		} else {
			if (!this.lMBDown) {
				this.attacked = false;
			}
		}
		
		// Shows pickup ui if near any item and pick it up if 'F' is pressed
		var itemInRange = false; 
		for(i = 0; i < this.items.length; i++) {
			var body = this.player.getBody();
			if (this.items[i].inRange(body.x, body.y)) {
				if (this.pressed['KeyF'] && !this.pickedItem) {
					// Player picks the weapon
					if (this.items[i] instanceof weapon) {
						var droppedweapon = this.player.pickWeapon(this.items.splice(i,1)[0]);
						this.items.push(droppedweapon);
					// Puts the item into the player's inventory
					} else {
						var itemPick = this.items.splice(i,1)[0];
						this.player.pickItem(itemPick);
					}
					this.pickedItem = true;
				} else {
					if (!this.pressed['KeyF'] && this.pickedItem) {
						this.pickedItem = false;
					}
					document.getElementById("pick-item").innerHTML = this.items[i].getName();
					document.getElementById("ui-lower").style.display = "block";
					itemInRange = true;
				}
			break;
			}
		}
		if (itemInRange) {
			document.getElementById("ui-lower").style.display = "block";
		} else if (document.getElementById("ui-lower").style.display == "block") {
			document.getElementById("ui-lower").style.display = "none";
		}
		
		this.player.update();
	}
	for(var i = 0; i < this.objects.length; i++) {
		this.objects[i].update(this.context);
	}
}

//Change fists to create a "zone" between both fists and check for intersection instead
gameArea.prototype.checkPlayerHit = function(fist, damage) {
	var pBody = this.player.getBody();
	for (var i = 1; i < this.players.length; i++) {
		var body = this.players[i].getBody();
		if (circleCircleIntersection(fist.x + pBody.x, fist.y + pBody.y, handRadius, body.x, body.y, body.r)) {
			this.players[i].takeDamage(damage);
			this.objects.push(new bloodstain(fist.x + pBody.x, fist.y + pBody.y));
			return true;
		}
	}
	return false;
}

gameArea.prototype.moveScreenBy = function(x,y) {
	this.xOffset += x;
	this.yOffset += y;
	this.context.translate(-x,-y);
}

gameArea.prototype.keyUp = function(e) {
	this.pressed[e.code] = false;
}
gameArea.prototype.keyDown = function(e) {
	this.pressed[e.code] = true;
}
gameArea.prototype.lMouseDown = function(e) {
	this.pressed['lMBDown'] = true;
}
gameArea.prototype.lMouseUp = function(e) {
	this.pressed['lMBDown'] = false;
}

gameArea.prototype.mousemove = function(e) {
	player.changeDir(Math.atan2(Math.floor(game_area.canvas.width/2) - e.pageX, Math.floor(game_area.canvas.height/2) - e.pageY) * (180 / Math.PI));
}

//------------- Objects for gameArea ---------------\\

function game_object(components) {
	this.components = [components];
}

game_object.prototype.update = function () {
	//-- Virtual function --//
}

bloodstain.prototype = Object.create(game_object.prototype);
function bloodstain(x,y) {
	game_object.call(new img());
}

tree.prototype = Object.create(game_object.prototype);
function tree(x,y) {
	game_object.call(new circle(Math.floor((Math.rand()*10 + 10)), fillColor = "rgb(255,255,255)", lineWidth = 1, stroke = true, strokeColor = "rgb(139,69,19)");
}

barrel.prototype = Object.create(game_object.prototype);
function barrel(x,y) {
}

//------------- Shapes -----------------------\\

function component(x,y) {
	this.x = x;
	this.y = y;
}

component.prototype.getX = function () {
	return this.x;
}

component.prototype.getY = function () {
	return this.y;
}

shape.prototype = Object.create(component.prototype);
function shape(fillColor, lineWidth, stroke, strokeColor, angle = 0, rotCenterpoint = [0,0]) {
	this.fillColor = fillColor;
	this.lineWidth = lineWidth;
	this.stroke = stroke;
	this.strokeColor = strokeColor;
	this.angle = angle;
	this.rotCenterpoint = rotCenterpoint;
}

circle.prototype = Object.create(shape.prototype);
function circle(radius, fillColor = "rgb(255,255,255)", lineWidth = 1 stroke = false, strokeColor = null) {
	this.radius = radius;
}

circle.prototype.circleIntersection = function(circle) {
	return Math.pow((this.x - circle.getX()),2) + Math.pow((this.y - circle.getY()),2) <= Math.pow((this.radius + circle.getRadius()),2);
}

circle.prototype.getRadius = function () {
	return this.radius;
}

circle.prototype.update(ctx) {
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
	ctx.lineWidth = this.lineWidth;
	ctx.fillStyle = this.fillColor;
	ctx.fill();
	if (this.stroke) {
		ctx.strokeStyle = this.strokeColor;
		ctx.stroke();
	}
}

rectangle.prototype = Object.create(shape.prototype);
function rectangle() {
	this.width = width;
	this.height = height;
}

rectangle.prototype.draw = function(ctx, x, y, width, height, fillColor, angle = 0, centerpoint = {x : 0, y : 0}, stroke = false, strokeColor = "black", lineWidth = 1) {
	if (angle != 0) {
		ctx.save();
		ctx.translate(centerpoint.x, centerpoint.y);
		if (angle < 0) {
			ctx.rotate((angle + ((Math.abs(angle) - 90) * 2)) * Math.PI/180);
		} else
		{
			ctx.rotate((angle - ((Math.abs(angle) - 90) * 2)) * Math.PI/180);
		}
	}
	ctx.beginPath();
	ctx.lineWidth = lineWidth;
	ctx.fillStyle = fillColor;
	if (angle != 0) {
		ctx.rect(-width/2, -height + (centerpoint.y - y), width, height); 
	} else {
		ctx.rect(x, y, width, height); 
	}
	ctx.fill();
	if (stroke) {
		ctx.strokeStyle = strokeColor;
		ctx.stroke();
	}
	if (angle != 0) {
		ctx.restore();
	}
}

img.prototype = Object.create(shape.prototype);
function img() {
	
}

img.prototype.draw() {
	ctx.drawImage(img, x, y);
}

//------------ Player constructor ------------\\

player.prototype = Object.create(game_object.prototype);
function player(x, y) {
	game_object.call(new circle( x:x, y:y, r:30, rgb:"rgb(244, 217, 66)" );
	this.inventory = [];
	this.weapons = [new fists(x, y, 0)];
	this.ammo = [];
	this.health = 100;
	this.speed = 15;
}

//Draws body and player's weapon
player.prototype.update = function(ctx) {
	for (var i = 0; i < this.weapons.length; i++) {
		this.weapons[i].update(ctx);
	}
}
player.prototype.changeDir = function(angle) {
	this.weapons[0].changeAngle(angle);
}
// Picks weapon and drops his old if he had one
player.prototype.pickWeapon = function(weapon) {
	var droppedWeapon = this.weapons[0];
	droppedWeapon.drop();
	weapon.move(this.body.x, this.body.y);
	weapon.pickup();
	this.weapons[0] = weapon;
	document.getElementById("ui-weapon").innerHTML = weapon.getName();
	return droppedWeapon;
}
// Puts passed item into player's inventory
player.prototype.pickItem = function(item) {
	this.inventory.push(item);
	var itemDiv = document.createElement("div");
	var itemName = document.createTextNode(item.getName());
	itemDiv.appendChild(itemName);
	document.getElementById("ui-inventory").appendChild(itemDiv);
}
// Changes the player's x, y coordinates
player.prototype.move = function(delta_x, delta_y) {
	this.body.x += delta_x;
	this.body.y += delta_y;
	this.weapons[0].move(this.body.x, this.body.y);
}
player.prototype.getBody = function() {
	return this.body;
}

player.prototype.attack = function() {
	this.weapons[0].attack();
}

player.prototype.takeDamage = function(damage) {
	this.health -= damage;
}

player.prototype.isAlive = function() {
	return (this.health > 0);
}

player.prototype.getSpeed = function() {
	return this.speed;
}


//------------ item constructor + inheritance --------------\\

item.prototype = Object.create(game_object.prototype);
function item(x, y, name="item") {
	this.x = x;
	this.y = y;
	this.name = name;
}

item.prototype.update = function(ctx) {
	drawCircle(ctx, this.x, this.y, 20, "rgb(255, 255, 255)", true);
}
// Checks if the passed x,y values are in range of the item (to be picked up)
item.prototype.inRange = function(x,y) {
	var maxRange = 50;
	return ((Math.abs(x - this.x) < maxRange) && (Math.abs(y - this.y) < maxRange));
}
// Returns the name of the item
item.prototype.getName = function () {
	return this.name;
}

weapon.prototype = Object.create(item.prototype);
function weapon(x, y, damage, name, cooldown, angle = 0, picked = false, lHO = null, rHO = null) {
	item.call(this,x,y,name);
	this.lHO = lHO;
	this.rHO = rHO;
	this.damage = damage;
	this.frameCdLeft = 0;
	this.frameCd = cooldown;
	this.picked = picked;
	this.wShape = [];
	this.angle = 0;
	
	this.changeAngle(angle);
}

weapon.prototype.update = function (ctx) {
	for (var i = 0; i < this.wShape.length; i++) {
		drawRect(ctx, this.x + this.wShape[i].x, this.y + this.wShape[i].y, this.wShape[i].width, this.wShape[i].height, this.wShape[i].fillColor, this.angle, {x : this.x, y : this.y}, this.wShape[i].stroke, this.wShape[i].strokeColor, this.wShape[i].lineWidth);
	}
	drawCircle(ctx, this.x + this.lHO.x, this.y + this.lHO.y, handRadius, "rgb(244, 217, 66)", true, "black", 3);
	drawCircle(ctx, this.x + this.rHO.x, this.y + this.rHO.y, handRadius, "rgb(244, 217, 66)", true, "black", 3);
}

weapon.prototype.changeAngle = function (angle) {
	var radAngle = (this.angle - angle) * (Math.PI / 180);
	var x = this.lHO.x * Math.cos(radAngle) - this.lHO.y * Math.sin(radAngle);
	var y = this.lHO.y * Math.cos(radAngle) + this.lHO.x * Math.sin(radAngle);
	this.lHO.x = x;
	this.lHO.y = y;
	x = this.rHO.x * Math.cos(radAngle) - this.rHO.y * Math.sin(radAngle);
	y = this.rHO.y * Math.cos(radAngle) + this.rHO.x * Math.sin(radAngle);	
	this.rHO.x = x;
	this.rHO.y = y;
	this.angle = angle;
	while(this.angle > 360) {
		this.angle -= 360;
	}
}
weapon.prototype.tryCd = function () {
	if (this.frameCdLeft == 0) {
		this.frameCdLeft = this.frameCd;
		return true;
	}
	return false;
}

weapon.prototype.move = function(x,y) {
	this.x = x;
	this.y = y;
}

weapon.prototype.drop = function() {
	this.picked = true;
}

weapon.prototype.pickup = function() {
	this.picked = false;
}

//---------------------- Individual weapons ------------------- \\

fists.prototype = Object.create(weapon.prototype);
function fists(x, y, angle = 0, picked = true) {
	weapon.call(this,x,y,15,"Fists",17,angle,picked,
	{x : -24, y : -23}, 
	{x : 24, y : -23} );
	this.lPunch = false;
	this.rPunch = false;
	this.hit = false;
}

fists.prototype.update = function(ctx) {
	if (this.frameCdLeft > 0) {
		var radAngle = (this.angle) * (Math.PI / 180);
		if (this.rPunch) {
			if (this.frameCdLeft > 11) {
				this.rHO.x += - 4 * Math.cos(radAngle) - 5 * Math.sin(radAngle);
				this.rHO.y -= 5 * Math.cos(radAngle) - 4 * Math.sin(radAngle);
			} else if (this.frameCdLeft > 5) {
				this.rHO.x -= - 4 * Math.cos(radAngle) - 5 * Math.sin(radAngle);
				this.rHO.y += 5 * Math.cos(radAngle) - 4 * Math.sin(radAngle);
			}
		} else if (this.lPunch) {
			if (this.frameCdLeft > 11) {
				this.lHO.x += 4 * Math.cos(radAngle) - 5 * Math.sin(radAngle);
				this.lHO.y -= 5 * Math.cos(radAngle) + 4 * Math.sin(radAngle);
			} else if (this.frameCdLeft > 5) {
				this.lHO.x -= 4 * Math.cos(radAngle) - 5 * Math.sin(radAngle);
				this.lHO.y += 5 * Math.cos(radAngle) + 4 * Math.sin(radAngle);
			}
		}
		if (!this.hit) {
			if (selectedCanvas.checkPlayerHit(this.rPunch ? this.rHO : this.lHO, this.damage)) {
				this.hit = true;
			}
		}
		this.frameCdLeft -= 1;
	} else {
		this.lPunch = false;
		this.rPunch = false;
		this.hit = false;
	}
	weapon.prototype.update.call(this,ctx);
}

fists.prototype.attack = function() {
	if (this.tryCd()) {
		if (Math.floor(Math.random() * 2 + 1) == 1) {
			this.rPunch = true;
		} else {
			this.lPunch = true;
		}
	}
}


ak47.prototype = Object.create(weapon.prototype);
function ak47(x, y, angle = 0, picked) {
	weapon.call(this,x,y,10,"AK-47",4,angle,picked,
	{x : -8, y : -50},
	{x : 0, y : -15} );
	
	this.wShape.push({x : -6, y : -20, width : 12, height : -60, fillColor : "black", stroke : true, strokeColor: "black", lineWidth : 1});
}

ak47.prototype.attack = function() {
}


um9.prototype = Object.create(weapon.prototype);
function um9(x, y, angle = 0, picked) {
	weapon.call(this,x,y,10,"UM9",4,angle,picked,
	{x : -8, y : -50},
	{x : 0, y : -15} );

	this.wShape.push({x : -8, y : -20, width : 16, height : -60, fillColor : "black", stroke : true, strokeColor: "black", lineWidth : 1});
}

um9.prototype.attack = function() {
}



