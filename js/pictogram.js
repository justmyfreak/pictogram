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