var win = window;
var doc = document;
var nav = navigator;
win.onload = function(){
	myDrag.drag('afwty126');
}
var $id = function(el){
	return document.getElementById(el);
},

is_element_having_set_coordinates = function(el){
	var a = $id(el),
		b = a.style.position;

	if (!b || b != 'absolute'){
		$id(el).style.position = 'absolute';
		var posX = $id(el).offsetTop + 'px',
			posY = $id(el).offsetLeft + 'px';
		$id(el).style.top = posX;
		$id(el).style.left = posY;
	}

},

myDrag = function(){
	return {
		startMoving : function(evt, elid){ 

			console.log('click' + elid);
			evt = evt || win.event;
			is_element_having_set_coordinates(elid);
			var posX = evt.clientX, // The x-coordinate of the mouse pointer position on the screen
				posY = evt.clientY, // The y-coordinate of the mouse pointer position on the screen
				a = $id(elid),// Points to the div element

				divTop = a.style.top, // initial position of the div s
				divLeft = a.style.left; 

			divTop = divTop.replace('px',''); 
			divLeft = divLeft.replace('px',''); 
			var diffX = posX - divLeft,	
				diffY = posY - divTop;	
			document.onmousemove = function(evt){ 
				evt = evt || win.event;
				var posX = evt.clientX,	// Mouse x-coordinate
					posY = evt.clientY,	// Mouse y-coordinate
					aX = posX - diffX,	// The final x-coordinate of the element
					aY = posY - diffY;	// The final y-coordinate of the element
				myDrag.move(elid,aX,aY); // Function to assign the style rules to the element
			}
		},

		stopMoving : function(){ // Changed the value of the onmousemove attribute.
			document.onmousemove = function(){}
		},

		move : function(divid, xpos, ypos){ //  assign the style rules to the element
			var a = $id(divid);
			$id(divid).style.left = xpos + 'px';
			$id(divid).style.top = ypos + 'px';
		},

		drag: function(el){
			var ela = el.replace(new RegExp(' ', 'g'), '');
			ela = ela.split(',');

			for (var i = 0; i<ela.length; i++){
				var elb = ela[i];
				if ($id(elb)){
					$id(elb).className += ' tz-dragging';
					$id(elb).onmousedown = function(){
						myDrag.startMoving(event, this.id);
					}

					$id(elb).onmouseup = function(){
						myDrag.stopMoving(event, this.id);
					}
				}
			}
		}
	}
}();