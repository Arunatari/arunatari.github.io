var drawLayers = { };

function createGameState()
{
	return {
		bag: [ ],
		currTime: 0,
		dx: 0,
		dy: 0,
		gravity: 0,
		level: 1,
		linesCleared: 0,
		lockStart: null,
		placed: Array(10).fill(0).map(() => Array(24).fill(null)),
		swapped: false
	};
}

function createKeymap()
{
	var moveLeft = () => { moveActive(-1, 0); gameState.immLockTime = 0; };
	var moveRight = () => { moveActive(1, 0); gameState.immLockTime = 0; };
	var rotateCW = () => { rotateActive(1); gameState.immLockTime = 0; };
	return {
		held: { },
		isDown: x => !!keymap.keys[x],
		keys: { },
		on:
		{
			" ": () => dropActive(),
			a: moveLeft,
			d: moveRight,
			e: rotateCW,
			q: () => { rotateActive(-1); gameState.immLockTime = 0; },
			w: () => swapActive(),
			ArrowUp: rotateCW,
			ArrowLeft: moveLeft,
			ArrowRight: moveRight
		}
	};
}

var gameState = createGameState();
var keymap = createKeymap();

var mainKicks =
[
	[ [0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2] ],
	[ [0, 0], [1, 0], [1, -1], [0, 2], [1, 2] ],
	[ [0, 0], [1, 0], [1, 1], [0, -2], [1, -2] ],
	[ [0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2] ],
];

var polyominos =
[
	{
		name: "Z",
		size: 3,
		color: "#FF0000",
		rotations:
		[
			[[ 1, 1, 0 ],
			 [ 0, 1, 1 ],
			 [ 0, 0, 0 ]],
			[[ 0, 0, 1 ],
			 [ 0, 1, 1 ],
			 [ 0, 1, 0 ]],
			[[ 0, 0, 0 ],
			 [ 1, 1, 0 ],
			 [ 0, 1, 1 ]],
			[[ 0, 1, 0 ],
			 [ 1, 1, 0 ],
			 [ 1, 0, 0 ]]
		],
		kicks: mainKicks
	},
	{
		name: "L",
		size: 3,
		color: "#FFBA00",
		rotations:
		[
			[[ 0, 0, 1 ],
			 [ 1, 1, 1 ],
			 [ 0, 0, 0 ]],
			[[ 0, 1, 0 ],
			 [ 0, 1, 0 ],
			 [ 0, 1, 1 ]],
			[[ 0, 0, 0 ],
			 [ 1, 1, 1 ],
			 [ 1, 0, 0 ]],
			[[ 1, 1, 0 ],
			 [ 0, 1, 0 ],
			 [ 0, 1, 0 ]]
		],
		kicks: mainKicks
	},
	{
		name: "O",
		size: 2,
		color: "#FFFF00",
		rotations:
		[
			[[ 1, 1 ],
			 [ 1, 1 ]],
			[[ 1, 1 ],
			 [ 1, 1 ]],
			[[ 1, 1 ],
			 [ 1, 1 ]],
			[[ 1, 1 ],
			 [ 1, 1 ]]
		],
		kicks:
		[
			[ [0, 0] ],
			[ [0, 0] ],
			[ [0, 0] ],
			[ [0, 0] ],
		]
	},
	{
		name: "S",
		size: 3,
		color: "#00FF00",
		rotations:
		[
			[[ 0, 1, 1 ],
			 [ 1, 1, 0 ],
			 [ 0, 0, 0 ]],
			[[ 0, 1, 0 ],
			 [ 0, 1, 1 ],
			 [ 0, 0, 1 ]],
			[[ 0, 0, 0 ],
			 [ 0, 1, 1 ],
			 [ 1, 1, 0 ]],
			[[ 1, 0, 0 ],
			 [ 1, 1, 0 ],
			 [ 0, 1, 0 ]]
		],
		kicks: mainKicks
	},
	{
		name: "I",
		size: 4,
		color: "#00FFFF",
		rotations:
		[
			[[ 0, 0, 0, 0 ],
			 [ 1, 1, 1, 1 ],
			 [ 0, 0, 0, 0 ],
			 [ 0, 0, 0, 0 ]],
			[[ 0, 0, 1, 0 ],
			 [ 0, 0, 1, 0 ],
			 [ 0, 0, 1, 0 ],
			 [ 0, 0, 1, 0 ]],
			[[ 0, 0, 0, 0 ],
			 [ 0, 0, 0, 0 ],
			 [ 1, 1, 1, 1 ],
			 [ 0, 0, 0, 0 ]],
			[[ 0, 1, 0, 0 ],
			 [ 0, 1, 0, 0 ],
			 [ 0, 1, 0, 0 ],
			 [ 0, 1, 0, 0 ]]
		],
		kicks:
		[
			[ [0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2] ],
			[ [0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1] ],
			[ [0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2] ],
			[ [0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1] ]
		]
	},
	{
		name: "J",
		size: 3,
		color: "#0000FF",
		rotations:
		[
			[[ 1, 0, 0 ],
			 [ 1, 1, 1 ],
			 [ 0, 0, 0 ]],
			[[ 0, 1, 1 ],
			 [ 0, 1, 0 ],
			 [ 0, 1, 0 ]],
			[[ 0, 0, 0 ],
			 [ 1, 1, 1 ],
			 [ 0, 0, 1 ]],
			[[ 0, 1, 0 ],
			 [ 0, 1, 0 ],
			 [ 1, 1, 0 ]]
		],
		kicks: mainKicks
	},
	{
		name: "T",
		size: 3,
		color: "#BA00FF",
		rotations:
		[
			[[ 0, 1, 0 ],
			 [ 1, 1, 1 ],
			 [ 0, 0, 0 ]],
			[[ 0, 1, 0 ],
			 [ 0, 1, 1 ],
			 [ 0, 1, 0 ]],
			[[ 0, 0, 0 ],
			 [ 1, 1, 1 ],
			 [ 0, 1, 0 ]],
			[[ 0, 1, 0 ],
			 [ 1, 1, 0 ],
			 [ 0, 1, 0 ]]
		],
		kicks: mainKicks,
		canTspin: 1
	}
];

function init()
{
	var display = document.getElementById("Main2");
	display.focus();
	display.addEventListener("keydown", onKeyDown, true);
	display.addEventListener("keyup", x => { keymap.keys[x.key] = 0; keymap.held[x.key] = undefined; }, true);
	display.addEventListener("keypress", x => { if (x.key != "F5") x.preventDefault(); }, true);
	drawLayers[0] = document.getElementById("Main0").getContext("2d");
	drawLayers[1] = document.getElementById("Main1").getContext("2d");
	drawLayers[2] = document.getElementById("Main2").getContext("2d");
	lockActive();
	drawActive();
	logic(0);
}

function logic(time)
{
	var dt = (time - gameState.currTime) / 1000;
	gameState.currTime = time;
	var dx = gameState.dx;
	var dy = gameState.dy;
	gameState.dx = 0;
	gameState.dy = 0;
	var held = keymap.held;
	if (keymap.isDown("ArrowLeft") && time - held.ArrowLeft > 500 || keymap.isDown("a") && time - held.a > 500)
			dx -= 1;
	if (keymap.isDown("ArrowRight") && time - held.ArrowRight > 500 || keymap.isDown("d") && time - held.d > 500)
		dx += 1;
	gameState.gravity += dt * getGravity(gameState.level);
	var g = Math.floor(gameState.gravity);
	gameState.gravity -= g;
	if (keymap.isDown("ArrowDown") || keymap.isDown("s"))
		dy += 1;
	if (dx != 0 && moveActive(dx, 0) || dy != 0 && moveActive(0, dy))
		gameState.immLockTime = 0;
	if (g != 0)
	{
		var addTime = false;
		for (var i = 0; i < g; i++)
			if (!moveActive(0, 1))
			{
				addTime = true;
				break;
			}
	}
	else
		addTime = gameState.lockTime != undefined;
	if (addTime)
	{
		if (gameState.lockTime == undefined)
		{
			gameState.lockTime = 0;
			gameState.immLockTime = 0;
		}
		else
		{
			gameState.lockTime += dt;
			gameState.immLockTime += dt;
		}
		if (g != 0 && (gameState.lockTime > 2 || gameState.immLockTime > 0.5))
			dropActive();
	}
	else
		gameState.lockTime = undefined;
	window.requestAnimationFrame(logic);
}

function onKeyDown(x)
{
	if (x.key == "F5" || x.repeat)
		return;
	x.preventDefault();
	keymap.keys[x.key] = 1;
	keymap.held[x.key] = gameState.currTime;
	if (typeof(keymap.on[x.key]) == "function")
		keymap.on[x.key]();
}

function clearLines()
{
	var shift = 0;
	for (var y = 23; y >= 0; y--)
	{
		var empty = 0;
		for (var x = 0; x < 10; x++)
		{
			if (gameState.placed[x][y] == null)
				empty++;
			gameState.placed[x][y + shift] = gameState.placed[x][y];
		}
		if (empty == 0)
			shift++;
	}
	for (var y = 0; y < shift; y++)
		for (var x = 0; x < 10; x++)
			gameState.placed[x][y] = null;
	gameState.linesCleared += shift;
	gameState.level = Math.floor(gameState.linesCleared / 10) + 1;
	drawPlaced();
}

function getGravity(level)
{
	if (level <= 2)
		return level;
	else if (level <= 5)
		return level * 2 - 2;
	else if (level <= 9)
		return level * 3 - 7;
	else if (level <= 14)
		return level * 4 - 16;
	else
		return level * 5 - 30;
}

function drawPlaced()
{
	drawLayers[0].clearRect(0, 0, 320, 640);
	gameState.placed.forEach((x, i) => x.forEach((y, j) => { if (y == null) return; drawLayers[0].fillStyle = y; drawLayers[0].fillRect(i * 32, (j - 4) * 32, 32, 32); }));
}

function clearActive()
{
	var active = gameState.active;
	var size = active.shape.size * 32;
	drawLayers[1].clearRect(active.x * 32, (active.y - 4) * 32, size, size);
	var y = active.y;
	while (moveActive(0, 1, 1)) { }
	drawLayers[1].clearRect(active.x * 32, (active.y - 4) * 32, size, size);
	active.y = y;
}

function drawActive()
{
	var active = gameState.active;
	var shape = active.shape;
	drawShape(shape, active.x, active.y, active.rotation);
	var y = active.y;
	while (moveActive(0, 1, 1)) { }
	drawShape(shape, active.x, active.y, active.rotation, "40");
	active.y = y;
}

function drawShape(s, x, y, r, t)
{
	if (typeof(t) == "undefined")
		t = "";
	drawLayers[1].fillStyle = s.color + t;
	s.rotations[r].forEach((a, i) => a.forEach((b, j) => { if (b) drawLayers[1].fillRect((x + j) * 32, (y + i - 4) * 32, 32, 32); }));
}

function dropActive()
{
	clearActive();
	while (moveActive(0, 1, 1)) { }
	lockActive();
	clearLines();
	gameState.lockTime = undefined;
	gameState.immLockTime = 0;
	gameState.gravity = 0;
	gameState.swapped = false;
	drawActive();
}

function lockActive()
{
	if (typeof(gameState.active) != "undefined")
	{
		var active = gameState.active;
		var shape = active.shape;
		var size = shape.size;
		var tilemap = shape.rotations[active.rotation];
		for (var i = 0; i < size; i++)
			for (var j = 0; j < size; j++)
				if (tilemap[j][i])
					gameState.placed[active.x + i][active.y + j] = shape.color;
		drawPlaced();
		clearActive();
	}
	else
		gameState.active = new Piece(polyominos[0]);
	while (gameState.bag.length < 7)
		gameState.bag = gameState.bag.concat(polyominos.shuffle());
	gameState.active.setShape(gameState.bag.shift());
	for (var i = 0; i < 5; i++)
		document.getElementById("Next" + i).src = "./Display " + gameState.bag[i].name + ".png";
}

function moveActive(dx, dy, suppressRedraw)
{
	if (!suppressRedraw)
		clearActive();
	var active = gameState.active;
	var moved = active.shift(dx, dy);
	if (!suppressRedraw)
		drawActive();
	return moved;
}

function rotateActive(rot)
{
	if (rot == 0)
		return;
	clearActive();
	var active = gameState.active;
	var rotated = 0;
	if (rot > 0)
		rotated = active.rotateCW();
	else if (rot < 0)
		rotated = active.rotateCCW();
	drawLayers[1].fillStyle = active.shape.color;
	drawActive();
	return rotated;
}

function swapActive()
{
	if (gameState.swapped)
		return;
	clearActive();
	gameState.swapped = true;
	var held = gameState.held;
	gameState.held = gameState.active;
	gameState.active = held;
	if (gameState.active == undefined)
		lockActive();
	else
	{
		gameState.active.rotation = 0;
		gameState.active.setPosition();
	}
	drawActive();
	document.getElementById("HeldPiece").src = "./Display " + gameState.held.shape.name + ".png";
}

function Piece(shape) { this.setShape(shape); }
Piece.prototype.setShape = function(x) { this.shape = x; this.rotation = 0; this.setPosition(); }

Piece.prototype.setPosition = function(x, y)
{
	if (typeof(x) == "undefined")
	{
		var shape = this.shape;
		var rot = this.rotation;
		var size = shape.size;
		var emptyRows = 0;
		var isEmpty = 1;
		for (var y = size - 1; y >= 0; y--)
		{
			for (var x = 0; x < size; x++)
			{
				if (shape.rotations[rot][y][x])
				{
					isEmpty = 0;
					break;
				}
			}
			if (!isEmpty)
				break;
			emptyRows++;
		}
		this.x = ~~((10 - size) / 2);
		this.y = 4 - size + emptyRows;
	}
	else if (typeof(x) == "number") { this.x = x | 0; this.y = y | 0; }
	else { this.x = x[0] | 0; this.y = x[0] | 0; }
}

Piece.prototype.shift = function(dx, dy, b)
{
	if (!this.testPosition(this.x + dx, this.y + dy, this.rotation, b))
		return 0;
	this.x += dx;
	this.y += dy;
	return 1;
}

Piece.prototype.rotateCW = function(b)
{
	var newRot = (this.rotation + 1) % 4;
	return this.testRotation(newRot, this.shape.kicks[this.rotation], 1, b);
}

Piece.prototype.rotateCCW = function(b)
{
	var newRot = (this.rotation + 3) % 4;
	return this.testRotation(newRot, this.shape.kicks[newRot], -1, b);
}

Piece.prototype.testPosition = function(x, y, r, b)
{
	if (typeof(x) == "undefined")
		x = this.x;
	if (typeof(y) == "undefined")
		y = this.y;
	if (typeof(r) == "undefined")
		r = this.rotation;
	if (typeof(b) == "undefined")
		b = gameState.placed;
	var shape = this.shape;
	var size = shape.size;
	var tilemap = shape.rotations[r];
	for (var i = 0; i < size; i++)
		for (var j = 0; j < size; j++)
		{
			if (!tilemap[j][i])
				continue;
			var u = x + i;
			var v = y + j;
			if (u < 0 || u >= 10 || v < 0 || v >= 24 || b[u][v])
				return 0;
		}
	return 1;
}

Piece.prototype.testRotation = function(r, k, s, b)
{
	if (typeof(b) == "undefined")
		b = gameState.placed;
	k = k.map(x => x.map(y => y * s));
	var kick = k.find(x => this.testPosition(this.x + x[0], this.y - x[1], r, b));
	if (kick == undefined)
		return 0;
	this.x += kick[0];
	this.y -= kick[1];
	this.rotation = r;
	return 1;
}

Array.prototype.shuffle = function()
{
	var a = this.map(x => x);
	var l = this.length;
	for (var i = 0; i < l; i++)
	{
		var j = Math.floor(Math.random() * (l - i)) + i;
		var t = a[i];
		a[i] = a[j];
		a[j] = t;
	}
	return a;
}

init();