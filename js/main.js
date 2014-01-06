function Shape(x, y, w, h, fill) {
	this.x = x || 0;
	this.y = y || 0;
	this.w = w || 1;
	this.h = h || 1;
	this.fill = fill || '#AAAAAA';
}

Shape.prototype.draw = function(ctx) {
	ctx.fillStyle = this.fill;
	ctx.fillRect(this.x, this.y, this.w, this.h);
}

function CanvasState(canvas) {

	this.canvas = canvas;
	this.width = canvas.width;
	this.height = canvas.height;
	this.ctx = canvas.getContext('2d');
	// This complicates things a little but but fixes mouse co-ordinate problems
	// when there's a border or padding. See getMouse for more detail
	var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
	if (document.defaultView && document.defaultView.getComputedStyle) {
		this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
		this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
		this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
		this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
	}
	// Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
	// They will mess up mouse coordinates and this fixes that
	var html = document.body.parentNode;
	this.htmlTop = html.offsetTop;
	this.htmlLeft = html.offsetLeft;

	this.valid = false;
	this.shapes = [];
	this.dragging = false;

	this.selection = null;
	this.dragoffx = 0;
	this.dragoffy = 0;

	var	myState = this;
	canvas.addEventListener('selectstart', function(e) {
		e.preventDefault();
		return false;
	});

	canvas.addEventListener('mousedown', function(e){
		var mouse = myState.getMouse(e);

		var mx = mouse.x;
		var my = mouse.y;
		var shapes = myState.shapes;
		var l = shapes.length;
		for (var i = l-1; i>=0; i--) {
			if (shapes[i].contains(mx, my)) {
				var mySel = shapes[i];

				myState.dragoffy = mx - mySel.x;
				myState.dragoffy = my - mySel.y;
				myState.dragging = true;
				myState.selection = mySel;
				myState.valid = false;
				return;
			}
		}

		if (myState.selection) {
			myState.selection = null;
			myState.valid = false;
		}
	}, true);

	canvas.addEventListener('mousemove', function(e){
		if (myState.dragging) {
			var mouse = myState.getMouse(e);

			myState.selection.x = mouse.x - myState.dragoffx;
			myState.selection.y = mouse.y - myState.dragoffy;
			myState.valid = false;

		}
	}, true);

	canvas.addEventListener('mouseup', function(e) {
		myState.dragging = false;
	}, true);

	canvas.addEventListener('dblclick', function(e) {
		var mouse = myState.getMouse(e);
		myState.addShape(new Shape(mouse.x-10, mouse.y-10, 20, 20, 'rgb(0,255,0,.6)'));
	});

	 // **** Options! ****
 
	this.selectionColor = '#CC0000';
	this.selectionWidth = 2;  
	this.interval = 30;
	setInterval(function() { myState.draw(); }, myState.interval);
}

CanvasState.prototype.draw = function() {
	if (!this.valid) {
		var ctx = this.ctx;
		var shapes = this.shapes;
		this.clear();

		var l = shapes.length;
		for (i = 0; i < l; i++){
			var shape = shapes[i];
			if (shape.x > this.width || shape.y > this.height || shape.x + shape.w < 0 || shape.y + shape.h < 0)
				continue;
			shapes[i].draw(ctx);
		}

		if (this.selection != null) {
			ctx.strokeStyle = this.selectionColor;
			ctx.lineWidth	= this.selectionWidth;
			var mySel = this.selection;
			ctx.strokeRect(mySel.x,mySel.y,mySel.w,mySel.h);
		}
	}

	this.valid = true;
}

CanvasState.prototype.getMouse = function(e) {
	var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
	if (element.offsetParent != undefined) {
		do {
			offsetX += element.offsetLeft;
			offsetY += element.offsetTop;
		} while ((element = element.offsetParent));
	}

	mx = e.pageX - offsetX;
	my = e.pageY - offsetY;
	return {x: mx, y:my};
}

CanvasState.prototype.addShape = function(shape) {
	this.shapes.push(shape);
	this.valid = false;
}

CanvasState.prototype.clear = function() {
	this.ctx.clearRect(0, 0, this.width, this.heigh);
}

CanvasState.prototype.contains = function() {
	return  (this.x <= mx) && (this.x + this.w >= mx) &&
          (this.y <= my) && (this.y + this.h >= my);
}

var s = new CanvasState(document.getElementById('canvas'));
var foo = new Shape(40,40,50,50);
s.addShape(foo);
alert(foo.x);
// s.addShape(new Shape(40,40,50,50)); // The default is gray
// s.addShape(new Shape(60,140,40,60, 'lightskyblue'));
// // Lets make some partially transparent
// s.addShape(new Shape(80,150,60,30, 'rgba(127, 255, 212, .5)'));
// s.addShape(new Shape(125,80,30,80, 'rgba(245, 222, 179, .7)'));