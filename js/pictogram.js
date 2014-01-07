// application controller
var App = {

	// Pictogram collection
	picto: [],

	addNewPictogram: function() {
		console.log('add new pictogram');
		
		// create new Id
		var chartId = this.generateChartId();
		document.getElementById('chartId').innerHTML = chartId;

	},

	createChart: function() {
		console.log('create chart');
		this.initData();
	},

	updateChart: function() {
		console.log('update chart');
		var chartId = this.getFormId();
		this.picto[chartId].refresh();
		
		var chartId = this.getFormId();
		var picto = new Pictogram(chartId, App.getFormName(), App.getFormData());
		
		console.log(chartId+' composed ');
		this.picto[chartId] = picto;
		this.picto[chartId].render();
	},

	getFormData: function() {
		// Real data
		
		var formData1 = document.getElementsByClassName('form');
		var data = [];
		for (i = 0; i< formData1.length; i++) {
			console.log(formData1[i].getElementsByClassName('itemId')[0].value);
			console.log(formData1[i].getElementsByClassName('icon')[0].value);
			console.log(formData1[i].getElementsByClassName('name')[0].value);
			console.log(formData1[i].getElementsByClassName('amount')[0].value);
			console.log(formData1[i].getElementsByClassName('color')[0].value);
			var singleData = {
				id: formData1[i].getElementsByClassName('itemId')[0].value, 
				icon: formData1[i].getElementsByClassName('icon')[0].value, 
				dataname: formData1[i].getElementsByClassName('name')[0].value, 
				amount: formData1[i].getElementsByClassName('amount')[0].value, 
				color: formData1[i].getElementsByClassName('color')[0].value
			};
			data.push(singleData);
		}
		
		// For dummy data
		var formData = [
			{id: 1, icon: 'facebook', dataname: 'Facebook User', amount: 7, color: 'red'},
			{id: 2, icon: 'twitter', dataname: 'Twitter User', amount: 4, color: 'blue'},
			{id: 3, icon: 'linkedin', dataname: 'LinkedIn User', amount: 5, color: 'yellow'},
			{id: 4, icon: 'pinterest', dataname: 'Pinteres User', amount: 8, color: 'red'},
		];

		return data;
	},

	// get chart name from current form
	getFormName: function() {
		var name = document.getElementById('chartName').value;	
		return name;
	},

	// get chartId from form
	getFormId: function() {
		var chartId = document.getElementById('chartId');
		return chartId.innerHTML;
	},

	// data initialization
	initData: function() {
		console.log('get chat data');
			
		// create Pictogram instance
		var chartId = this.getFormId();
		this.createPictogramDiv(chartId);
		var picto = new Pictogram(chartId, App.getFormName(), App.getFormData());
		
		console.log(chartId+' composed ');
		this.picto[chartId] = picto;
		this.picto[chartId].render();

	},

	// generate random character for chartId
	generateChartId: function() {
		return Math.random().toString(36).slice(2);
	},

	createPictogramDiv: function(chartId) {
		var svgContainer = document.getElementById('svg-container');
		var chartDiv = document.createElement('div');
		chartDiv.setAttribute('id', chartId);
		chartDiv.setAttribute('class', 'pictogram');
		chartDiv.style.height = '300px';
		chartDiv.style.width = '300px';
		chartDiv.style.padding = '10px';

		var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
		svg.setAttribute('height', '100%');
		svg.setAttribute('width', '100%');
		svg.setAttribute('version', '1.1');
		svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
		svg.style.overflow = 'hidden';
		svg.style.position = 'relative';
		svg.style.left = '-0.5px';
		svg.setAttribute('viewBox', '0 0 225 300');
		svg.setAttribute('preserveAspectRatio', 'xMinYMin meet');

		console.log('create pictogram div '+svg);
		chartDiv.appendChild(svg);
		svgContainer.appendChild(chartDiv);
	}

};

// Pictogram class
function Pictogram(id, name, data) {
	this.name = name;
	this.pictId = id;
	this.data = data;
	// this.Pictogram = []; // Collection of pictogram
	console.log('Pictogram '+name+' created with data : '+ this.data);
}

// clear svgs object from canvas
Pictogram.prototype.refresh = function() {
	var svg = document.getElementById(this.pictId).getElementsByTagName('svg')['0'];
	while (svg.firstChild) {
		svg.removeChild(svg.firstChild);
	}
}

// update chart data
Pictogram.prototype.updateData = function(data) {
	this.data = data;
}

// reder chart to view
Pictogram.prototype.render = function() {
	var text = '';
	for (i = 0; i < this.data.length; i++) {
		
		// Set default indentation between text line
		var y = (20 * i) + 15;

		// svg holder
		var svg = document.getElementById(this.pictId).getElementsByTagName('svg')['0'];

		// create new group
		var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');

		// set text
		var txt = document.createTextNode(this.data[i].dataname);
		var textSvg = document.createElementNS("http://www.w3.org/2000/svg", 'text');
		textSvg.setAttribute('x', 0);
		textSvg.setAttribute('y', y);
		textSvg.setAttribute('fill', 'blue');
		// append text to text tag
		textSvg.appendChild(txt);

		// icon
		for (j = 0; j < this.data[i].amount; j++) {
			var x1 = 100 + (20 * j);
			var y1 = y - 15;
			// create new icon
			var rect = iconRect(x1, y1, this.data[i].color);
			
			// append icon to group
			g.appendChild(rect);
		}
		// console.log(this.data[i].amount);

		// append text to group
		g.appendChild(textSvg);

		// append group to main svg
		svg.appendChild(g);

		console.log(g)
		// console.log(svg);
		text += '<g><text x="0" y="'+y+'" fill="blue" > '+this.data[i].dataname+' </text></g>';
	}
	// console.log(text);

	// console.log(text);
	console.log('render to browser');
}

// Icon 
// Rect Icon
function iconRect(x, y, color) {
	var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
	rect.setAttribute('x', x);
	rect.setAttribute('y', y);
	rect.setAttribute('width', 16);
	rect.setAttribute('height', 16);
	rect.style.fill = color;
	return rect;
}

// End of Icon

// Testing dragable
!function(win, doc, nav) {
	win.onload = function(){
	 tzdragg.drag('pictogram1');
	 
	 }
	var $id = function(el){
	
			return document.getElementById(el); // To make the code simpler by shortening document.getElementById - [http://bit.ly/QS3wE8]
	
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
	
		tzdragg = function(){ // To make the code cooler. TZDragg. Cool name!
	
			return {
	
				// Here we start of with the main functions
	
				startMoving : function(evt, elid){ // The function that sets up the div coordinates to make it move. Executed on the onmousedown event on the div.
	
					evt = evt || win.event;
	
					is_element_having_set_coordinates(elid);
	
					var posX = evt.clientX, // The x-coordinate of the mouse pointer position on the screen
	
						posY = evt.clientY, // The y-coordinate of the mouse pointer position on the screen
	
						a = $id(elid),// Points to the div element
	
						divTop = a.style.top, // We need the initial position of the div so that we can determine its final position on dragging
	
						divLeft = a.style.left; // We need the initial position of the div so that we can determine its final position on dragging
	
					divTop = divTop.replace('px',''); // Just so that we can perform calculations on the variable.
	
					divLeft = divLeft.replace('px',''); // Just so that we can perform calculations on the variable.
	
					var diffX = posX - divLeft,	// We keep this value so that we can calculate the final position of the element
	
						diffY = posY - divTop;	// We keep this value so that we can calculate the final position of the element
	
					document.onmousemove = function(evt){ // Whenever the mouse moves, this function is execulted
	
						evt = evt || win.event;
	
						var posX = evt.clientX,	// Mouse x-coordinate
	
							posY = evt.clientY,	// Mouse y-coordinate
	
							aX = posX - diffX,	// The final x-coordinate of the element
	
							aY = posY - diffY;	// The final y-coordinate of the element
	
						tzdragg.move(elid,aX,aY); // Function to assign the style rules to the element
	
					}
	
				},
	
				stopMoving : function(){ // This function gets executed when the user leaves the div alone. Changed the value of the onmousemove attribute.
	
					document.onmousemove = function(){}
	
				},
	
				move : function(divid, xpos, ypos){ // Function to assign the style rules to the element
	
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
	
								tzdragg.startMoving(event, this.id);
	
							}
	
							$id(elb).onmouseup = function(){
	
								tzdragg.stopMoving(event, this.id);
	
							}
	
						}
	
					}
	
				}
	
			}
	
		}();
}(window, document, navigator);