// application controller
var App = {

	// Pictogram collection
	picto: [],

	addNewPictogram: function() {
		console.log('add new pictogram');
		
		// create new Id
		var chartId = this.generateChartId();
		document.getElementById('chartId').innerHTML = chartId;
		document.getElementById('createChart').style.display = '';
		document.getElementById('updateChart').style.display = 'none';
	},

	addNewRow: function() {
		var lastId = App.countRows();
		var formContainer = $id('form-container');
		formContainer.innerHTML += '<div class="form"><input type="hidden" class="itemId" value="'+lastId+'"><select class="icon" name="icon"><option value="rect">rect</option><option value="circle">circle</option><option value="ellipse">ellipse</option></select> <input placeholder="label" type="text" class="name" name="name" placholder="Name"> <input min="0" type="number" class="amount" name="amount"> <select class="color" name="color"><option value="red">red</option><option value="yellow">yellow</option><option value="blue">blue</option><option value="green">green</option></select></div>';
	},

	countRows: function() {
		var rowCount = document.getElementsByClassName('form');
		return rowCount.length;
	},

	createChart: function() {
		console.log('create chart');
		this.initData();
		document.getElementById('createChart').style.display = 'none';
		document.getElementById('updateChart').style.display = '';
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
			var singleData = {
				id: formData1[i].getElementsByClassName('itemId')[0].value, 
				icon: formData1[i].getElementsByClassName('icon')[0].value, 
				dataname: formData1[i].getElementsByClassName('name')[0].value, 
				amount: formData1[i].getElementsByClassName('amount')[0].value == '' ? 0 : formData1[i].getElementsByClassName('amount')[0].value, 
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
		// add drag event
		myDrag.drag(chartId);
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
	},

	bringToForm: function(chartId) {
		var picto = App.picto[chartId];
		document.getElementById('chartId').innerHTML = picto.pictId;
		document.getElementById('chartName').value = picto.name;
		for (i = 0; i < picto.data.length; i++) {
			var formData = document.getElementsByClassName('form');

			formData[i].getElementsByClassName('itemId')[0].value = picto.data[i].id;
			formData[i].getElementsByClassName('icon')[0].value = picto.data[i].icon; 
			formData[i].getElementsByClassName('name')[0].value = picto.data[i].dataname;
			formData[i].getElementsByClassName('amount')[0].value = picto.data[i].amount;
			formData[i].getElementsByClassName('color')[0].value = picto.data[i].color;
		}
	},

	// scale helper
	scale: function(actual, max) {
		var scaled = actual;
		if (max < 20) {
			scaled = actual;
		} else if ((max > 200) && (max <= 2000)) {
			scaled = actual / 100;
		} else if ((max <= 200) && (max > 20)) {
			scaled = actual / 10;
		} else {
			scaled = actual / (max / 20);
		}
		return scaled;
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
	var amountElem = []; // Temporary data for amount
	for (i = 0; i < this.data.length; i++) {
		amountElem.push(parseInt(this.data[i].amount));
	}
	var sortedElem = amountElem.sort(function(a,b){return b-a});
	for (i = 0; i < this.data.length; i++) {
		
		// Set default indentation between text line
		var y = (20 * i) + 15;

		// svg holder
		var svg = $id(this.pictId).getElementsByTagName('svg')['0'];

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
		for (j = 0; j < App.scale(this.data[i].amount, sortedElem[0]); j++) {
			var x1 = 100 + (20 * j);
			var y1 = y - 15;
			// create new icon
			if (this.data[i].icon == 'rect') {
				var newIcon = iconRect(x1, y1, this.data[i].color);			
			} else if (this.data[i].icon == 'circle') {
				var newIcon = iconCircle(x1, y1, this.data[i].color);
			} else if (this.data[i].icon == 'ellipse') {
				var newIcon = iconEllipse(x1, y1, this.data[i].color);
			}
			
			// append icon to group
			g.appendChild(newIcon);
		}

		// add new amount element that will be sorted
		// console.log(this.data[i].amount);

		// append text to group
		g.appendChild(textSvg);

		// append group to main svg
		svg.appendChild(g);

		// console.log(svg);
		text += '<g><text x="0" y="'+y+'" fill="blue" > '+this.data[i].dataname+' </text></g>';
	}
	// console.log(text);

	// get the largest amount and sort it descending
	if (App.scale(sortedElem[0], sortedElem[0]) >= 10) {
		console.log('should extend container');
		var additional 		= App.scale(sortedElem[0], sortedElem[0]) - 10;
		var divContainer 	= $id(this.pictId);
		var curentWidth 	= parseInt(divContainer.style.width);
		additional 			= additional * 20;
		var finalWidth 		= additional + 300;
		var finalWidthPx 	= finalWidth + 'px';
		// console.log('final'+finalWidth);
		
		divContainer.style.width = finalWidthPx;
		
	}
	// console.log(text);
	console.log('render to browser');
}

// Icon 
// Rect Icon
function iconRect(x, y, color) {
	y = y + 2;
	var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
	rect.setAttribute('x', x);
	rect.setAttribute('y', y);
	rect.setAttribute('width', 16);
	rect.setAttribute('height', 16);
	rect.style.fill = color;
	return rect;
}

function iconCircle(x, y, color) {
	var circ = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
	y = y + 10;
	x = x + 9;
	circ.setAttribute('cx', x);
	circ.setAttribute('cy', y);
	circ.setAttribute('r', '7');
	circ.setAttribute('stroke', 'black');
	circ.setAttribute('stroke-width', "1");
	circ.setAttribute('fill', color);
	return circ;
}

function iconEllipse(x, y, color) {
	y = y + 10;
	x = x + 9;
	var ellipse = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse');
	ellipse.setAttribute('cx', x);
	ellipse.setAttribute('cy', y);
	ellipse.setAttribute('rx', '7');
	ellipse.setAttribute('ry', '4');
	ellipse.setAttribute('fill', color);
	ellipse.setAttribute('stroke', 'black');
	ellipse.setAttribute('stroke-width', "1");
	return ellipse;
}

// End of Icon