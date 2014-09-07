/*
 * File: cantk_chart.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: wrap chart.js for mobile toolkit.
 * 
 * Copyright (c) 2011 - 2013  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIChartLegendItem() {
	return;
}

UIChartLegendItem.prototype = new UIElement();
UIChartLegendItem.prototype.isUIChartLegendItem = true;

UIChartLegendItem.prototype.initUIChartLegendItem = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_INPUT);

	return this;
}

UIChartLegendItem.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIChartLegendItem.prototype.drawText = function(canvas) {
}

UIChartLegendItem.prototype.paintSelfOnly = function(canvas) {
	if(this.h > this.w) {
		var size = Math.min(this.w, this.h);
		canvas.fillRect(0, 0, size, size);
	}
	else {
		var size = this.h - 8;
		canvas.fillStyle = this.style.fillColor;
		canvas.fillRect(4, 4, size, size);

		canvas.textAlign = "left";
		canvas.textBaseline = "middle";
		canvas.font = this.style.getFont();
		canvas.fillStyle = this.style.textColor;

		var x = size + 8;
		var y = this.h >> 1;
		canvas.fillText(this.text, x, y);
	}

	return;
}

function UIChartLegendItemCreator() {
	var args = ["ui-chart-legend-item", "ui-chart-legend-item", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIChartLegendItem();
		return g.initUIChartLegendItem(this.type, 200, 40);
	}
	
	return;
}

//////////////////////////////////////////////////////

function UIChartLegendCreator() {
	var args = ["ui-chart-legend", "ui-chart-legend", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIGrid();

		g.isUIChartLegend = true;
		g.initUIGrid(this.type, 5, 100, null);;
		g.shapeCanBeChild = function(shape) { 
			return shape.isUIChartLegendItem;
		}
		return g;
	}
	
	return;
}

//////////////////////////////////////////////////////

function UIChart() {
	return;
}

UIChart.prototype = new UIElement();
UIChart.prototype.isUIChart = true;

UIChart.prototype.initUIChart = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.setImage(CANTK_IMAGE_DEFAULT, null);
	this.images.display = CANTK_IMAGE_DISPLAY_CENTER;

	this.options = {};

	return this;
}

UIChart.prototype.setValue = function(data) {
	try {
		this.data = JSON.parse(data);
	}
	catch(e) {
		console.log("UIChart.prototype.setValue:" + e.message);
	}

	return;
}

UIChart.prototype.getValue = function() {
	var data = this.data ? this.data : this.getDefaultData();

	return data ? JSON.stringify(data, null, '\t') : "";
}

UIChart.prototype.getDefaultData = function() {
	var data = {
		labels : ["1","2","3"],
		datasets : [
			{
				fillColor : "rgba(151,187,205,0.5)",
				strokeColor : "rgba(151,187,205,1)",
				pointColor : "rgba(151,187,205,1)",
				pointStrokeColor : "#fff",
				data : [28,48,40]
			}
		]
	}

	return data;
}

UIChart.prototype.shapeCanBeChild = function(shape) {
	return shape.isUILabel || shape.isUIImage;
}

UIChart.prototype.getOptions = function() {
	return null;
}

UIChart.prototype.paintChart = function(ctx, data, options) {
	return;
}

UIChart.prototype.getData = function() {
	return this.data ? this.data : this.getDefaultData();
}

UIChart.prototype.paintSelfOnly = function(canvas) {
	var tcanvas = cantkGetTempCanvas(this.w, this.h);
	var ctx = tcanvas.getContext("2d");
	this.paintChart(ctx, this.getData(), this.getOptions());
	canvas.drawImage(tcanvas, 0, 0);

	return;
}

////////////////////////////////////////////////////////////////////////

function UIBarChart() {
	return;
}

UIBarChart.prototype = new UIChart();
UIBarChart.prototype.isUIBarChart = true;

UIBarChart.prototype.initUIBarChart = function(type) {
	return this.initUIChart(type, 200, 200);
}

UIBarChart.prototype.getCustomProp = function() {
	var content = '\
		<label class="description" for="fontsize">' + dappGetText("Font Size") + ':</label>\
		<input id="fontsize"  class="element text small" type="number" value="0"/> \
		<label class="description" for="textcolor">' + dappGetText("Text Color") + ':</label>\
		<input id="textcolor"  class="element text small" type="text" value="0"/> \
		<label class="description" for="scalelinecolor">' + dappGetText("Scale Line Color") + ':</label>\
		<input id="scalelinecolor"  class="element text small" type="text" value="0"/> \
		<label class="description" for="gridlinecolor">' + dappGetText("Grid Line Color") + ':</label>\
		<input id="gridlinecolor"  class="element text small" type="text" value="0"/> \
		<input id="showgridlines" class="checkbox_i"  type="checkbox" >' + dappGetText("Show Grid Lines") + '</input> \
		<label class="description" for="data">' + dappGetText("Data") + ':</label>\
		<textarea id="data"  rows="8" cols="60" type="text" value=""></textarea>';

	return content;
}

UIBarChart.prototype.loadCustomProp = function(form) {
	var chart = this;
	
	form.fontsize.value = this.style.fontSize;
	form.fontsize.onchange = function(e) {
		var fontSize = parseInt(this.value);
		chart.style.setFontSize(fontSize);
		return;
	}
	
	form.textcolor.value = this.style.textColor;
	form.textcolor.onchange = function(e) {
		chart.style.setTextColor(this.value);
		return;
	}
	
	form.scalelinecolor.value = this.style.lineColor;
	form.scalelinecolor.onchange = function(e) {
		chart.style.setLineColor(this.value);
		return;
	}
	
	form.gridlinecolor.value = this.style.fillColor;
	form.gridlinecolor.onchange = function(e) {
		chart.setFillColor(this.value);
		return;
	}
	
	form.showgridlines.checked = this.showGridLines;
	form.showgridlines.onchange = function(e) {
		chart.showGridLines = this.checked;
		return;
	}

	form.data.value = this.getValue();
	form.data.onchange = function(e) {
		chart.setValue(this.value);
		return;
	}

	return;
}

UIBarChart.prototype.getOptions = function() {
	this.options.scaleLineColor = this.style.lineColor;
	this.options.scaleFontSize = this.isIcon? 12 : this.style.fontSize;
	this.options.scaleFontColor = this.style.textColor;
	this.options.scaleGridLineColor = this.style.fillColor;
	this.options.scaleShowGridLines = this.isIcon? true : this.showGridLines;

	return this.options;
}

UIBarChart.prototype.paintChart = function(ctx, data, options) {
	var chart = null;
	if(this.type === "ui-bar-chart") {
		chart = new Chart(ctx).Bar(data, options);
	}
	else {
		chart = new Chart(ctx).Line(data, options);
	}
	delete chart;

	return;
}

function UIBarChartCreator(type) {
	var args = [type, "ui-bar-chart", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIBarChart();
		return g.initUIBarChart(this.type);
	}
	
	return;
}

////////////////////////////////////////////////////////////////////////
function UIRadarChart() {
	return;
}

UIRadarChart.prototype = new UIChart();
UIRadarChart.prototype.isUIRadarChart = true;

UIRadarChart.prototype.initUIRadarChart = function(type) {
	return this.initUIChart(type, 200, 200);
}

UIRadarChart.prototype.getCustomProp = function() {
	var content = '\
		<label class="description" for="fontsize">' + dappGetText("Font Size") + ':</label>\
		<input id="fontsize"  class="element text small" type="number" value="0"/> \
		<label class="description" for="textcolor">' + dappGetText("Text Color") + ':</label>\
		<input id="textcolor"  class="element text small" type="text" value="0"/> \
		<label class="description" for="scalelinecolor">' + dappGetText("Scale Line Color") + ':</label>\
		<input id="scalelinecolor"  class="element text small" type="text" value="0"/> \
		<label class="description" for="backdropcolor">' + dappGetText("Backdrop Color") + ':</label>\
		<input id="backdropcolor"  class="element text small" type="text" value="0"/> \
		<input id="showscalelabels" class="checkbox_i"  type="checkbox" >' + dappGetText("Show Scale Labels") + '</input> \
		<label class="description" for="data">' + dappGetText("Data") + ':</label>\
		<textarea id="data"  rows="8" cols="60" type="text" value=""></textarea>';

	return content;
}

UIRadarChart.prototype.loadCustomProp = function(form) {
	var chart = this;
	
	form.fontsize.value = this.style.fontSize;
	form.fontsize.onchange = function(e) {
		var fontSize = parseInt(this.value);
		chart.style.setFontSize(fontSize);
		return;
	}
	
	form.textcolor.value = this.style.textColor;
	form.textcolor.onchange = function(e) {
		chart.style.setTextColor(this.value);
		return;
	}
	
	form.scalelinecolor.value = this.style.lineColor;
	form.scalelinecolor.onchange = function(e) {
		chart.style.setLineColor(this.value);
		return;
	}
	
	form.backdropcolor.value = this.style.fillColor;
	form.backdropcolor.onchange = function(e) {
		chart.setFillColor(this.value);
		return;
	}
	
	form.showscalelabels.checked = this.showScaleLabels;
	form.showscalelabels.onchange = function(e) {
		chart.showScaleLabels = this.checked;
		return;
	}
	
	form.data.value = this.getValue();
	form.data.onchange = function(e) {
		chart.setValue(this.value);
		return;
	}

	return;
}

UIRadarChart.prototype.getOptions = function() {
	this.options.scaleLineColor = this.style.lineColor;
	this.options.scaleShowLabels = this.showScaleLabels;
	this.options.scaleFontSize = this.style.fontSize;
	this.options.pointLabelFontSize = this.options.scaleFontSize;
	this.options.scaleFontColor = this.style.textColor;
	this.options.scaleBackdropColor = this.style.fillColor;
	this.options.angleLineColor = this.options.scaleLineColor;

	if(this.isIcon) {
		this.options.scaleShowLabels = false;
		this.options.scaleFontSize = 8;
		this.options.pointLabelFontSize = 6;
	}

	return this.options;
}

UIRadarChart.prototype.paintChart = function(ctx, data, options) {
	var chart = new Chart(ctx).Radar(data, options);
	delete chart;

	return;
}

UIRadarChart.prototype.getDefaultData = function() {
	var data = {
		labels : ["1","2","3","4","5","6","7"],
		datasets : [
			{
				fillColor : "rgba(220,220,220,0.5)",
				strokeColor : "rgba(220,220,220,1)",
				pointColor : "rgba(220,220,220,1)",
				pointStrokeColor : "#fff",
				data : [65,59,90,81,56,55,40]
			},
			{
				fillColor : "rgba(151,187,205,0.5)",
				strokeColor : "rgba(151,187,205,1)",
				pointColor : "rgba(151,187,205,1)",
				pointStrokeColor : "#fff",
				data : [28,48,40,19,96,27,100]
			}
		]
	}
	return data;
}


function UIRadarChartCreator(type) {
	var args = [type, "ui-radar-chart", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIRadarChart();
		return g.initUIRadarChart(this.type);
	}
	
	return;
}

////////////////////////////////////////////////////////////////////////
function UIPolarAreaChart() {
	return;
}

UIPolarAreaChart.prototype = new UIChart();
UIPolarAreaChart.prototype.isUIPolarAreaChart = true;

UIPolarAreaChart.prototype.initUIPolarAreaChart = function(type) {
	return this.initUIChart(type, 200, 200);
}

UIPolarAreaChart.prototype.getCustomProp = function() {
	var content = '\
		<label class="description" for="fontsize">' + dappGetText("Font Size") + ':</label>\
		<input id="fontsize"  class="element text small" type="number" value="0"/> \
		<label class="description" for="textcolor">' + dappGetText("Text Color") + ':</label>\
		<input id="textcolor"  class="element text small" type="text" value="0"/> \
		<label class="description" for="scalelinecolor">' + dappGetText("Scale Line Color") + ':</label>\
		<input id="scalelinecolor"  class="element text small" type="text" value="0"/> \
		<label class="description" for="backdropcolor">' + dappGetText("Backdrop Color") + ':</label>\
		<input id="backdropcolor"  class="element text small" type="text" value="0"/> \
		<input id="showscalelabels" class="checkbox_i"  type="checkbox" >' + dappGetText("Show Scale Labels") + '</input> \
		<label class="description" for="data">' + dappGetText("Data") + ':</label>\
		<textarea id="data"  rows="8" cols="60" type="text" value=""></textarea>';

	return content;
}

UIPolarAreaChart.prototype.loadCustomProp = function(form) {
	var chart = this;
	
	form.fontsize.value = this.style.fontSize;
	form.fontsize.onchange = function(e) {
		var fontSize = parseInt(this.value);
		chart.style.setFontSize(fontSize);
		return;
	}
	
	form.textcolor.value = this.style.textColor;
	form.textcolor.onchange = function(e) {
		chart.style.setTextColor(this.value);
		return;
	}
	
	form.scalelinecolor.value = this.style.lineColor;
	form.scalelinecolor.onchange = function(e) {
		chart.style.setLineColor(this.value);
		return;
	}
	
	form.backdropcolor.value = this.style.fillColor;
	form.backdropcolor.onchange = function(e) {
		chart.setFillColor(this.value);
		return;
	}
	
	form.showscalelabels.checked = this.showScaleLabels;
	form.showscalelabels.onchange = function(e) {
		chart.showScaleLabels = this.checked;
		return;
	}
	
	form.data.value = this.getValue();
	form.data.onchange = function(e) {
		chart.setValue(this.value);
		return;
	}

	return;
}

UIPolarAreaChart.prototype.getOptions = function() {
	this.options.scaleLineColor = this.style.lineColor;
	this.options.scaleShowLabels = this.showScaleLabels;
	this.options.scaleFontSize = this.style.fontSize;
	this.options.pointLabelFontSize = this.options.scaleFontSize;
	this.options.scaleFontColor = this.style.textColor;
	this.options.scaleBackdropColor = this.style.fillColor;
	this.options.angleLineColor = this.options.scaleLineColor;

	if(this.isIcon) {
		this.options.scaleShowLabels = false;
		this.options.scaleFontSize = 8;
		this.options.pointLabelFontSize = 6;
	}

	return this.options;
}

UIPolarAreaChart.prototype.paintChart = function(ctx, data, options) {
	var chart = new Chart(ctx).PolarArea(data, options);
	delete chart;

	return;
}

UIPolarAreaChart.prototype.getDefaultData = function() {
var data = [
	{
		value : 30,
		color: "#D97041"
	},
	{
		value : 90,
		color: "#C7604C"
	},
	{
		value : 24,
		color: "#21323D"
	},
	{
		value : 58,
		color: "#9D9B7F"
	},
	{
		value : 82,
		color: "#7D4F6D"
	},
	{
		value : 8,
		color: "#584A5E"
	}
]
	return data;
}


function UIPolarAreaChartCreator(type) {
	var args = [type, "ui-polar-area-chart", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPolarAreaChart();
		return g.initUIPolarAreaChart(this.type);
	}
	
	return;
}

////////////////////////////////////////////////////////////////////////
function UIPieChart() {
	return;
}

UIPieChart.prototype = new UIChart();
UIPieChart.prototype.isUIPieChart = true;

UIPieChart.prototype.initUIPieChart = function(type) {
	return this.initUIChart(type, 200, 200);
}

UIPieChart.prototype.getCustomProp = function() {
	var content = '\
		<label class="description" for="fontsize">' + dappGetText("Font Size") + ':</label>\
		<input id="fontsize"  class="element text small" type="number" value="0"/> \
		<label class="description" for="textcolor">' + dappGetText("Text Color") + ':</label>\
		<input id="textcolor"  class="element text small" type="text" value="0"/> \
		<label class="description" for="scalelinecolor">' + dappGetText("Scale Line Color") + ':</label>\
		<input id="scalelinecolor"  class="element text small" type="text" value="0"/> \
		<label class="description" for="backdropcolor">' + dappGetText("Backdrop Color") + ':</label>\
		<input id="backdropcolor"  class="element text small" type="text" value="0"/> \
		<input id="showscalelabels" class="checkbox_i"  type="checkbox" >' + dappGetText("Show Scale Labels") + '</input> \
		<label class="description" for="data">' + dappGetText("Data") + ':</label>\
		<textarea id="data"  rows="8" cols="60" type="text" value=""></textarea>';

	return content;
}

UIPieChart.prototype.loadCustomProp = function(form) {
	var chart = this;
	
	form.fontsize.value = this.style.fontSize;
	form.fontsize.onchange = function(e) {
		var fontSize = parseInt(this.value);
		chart.style.setFontSize(fontSize);
		return;
	}
	
	form.textcolor.value = this.style.textColor;
	form.textcolor.onchange = function(e) {
		chart.style.setTextColor(this.value);
		return;
	}
	
	form.scalelinecolor.value = this.style.lineColor;
	form.scalelinecolor.onchange = function(e) {
		chart.style.setLineColor(this.value);
		return;
	}
	
	form.backdropcolor.value = this.style.fillColor;
	form.backdropcolor.onchange = function(e) {
		chart.setFillColor(this.value);
		return;
	}
	
	form.showscalelabels.checked = this.showScaleLabels;
	form.showscalelabels.onchange = function(e) {
		chart.showScaleLabels = this.checked;
		return;
	}
	
	form.data.value = this.getValue();
	form.data.onchange = function(e) {
		chart.setValue(this.value);
		return;
	}

	return;
}

UIPieChart.prototype.getOptions = function() {
	this.options.scaleLineColor = this.style.lineColor;
	this.options.scaleShowLabels = this.showScaleLabels;
	this.options.scaleFontSize = this.style.fontSize;
	this.options.pointLabelFontSize = this.options.scaleFontSize;
	this.options.scaleFontColor = this.style.textColor;
	this.options.scaleBackdropColor = this.style.fillColor;
	this.options.angleLineColor = this.options.scaleLineColor;

	if(this.isIcon) {
		this.options.scaleShowLabels = false;
		this.options.scaleFontSize = 8;
		this.options.pointLabelFontSize = 6;
	}

	return this.options;
}

UIPieChart.prototype.paintChart = function(ctx, data, options) {
	var chart = null;
	if(this.type === "ui-doughnut-chart") {
		chart = new Chart(ctx).Pie(data, options);
	}
	else {
		chart = new Chart(ctx).Doughnut(data, options);
	}
	delete chart;

	return;
}

UIPieChart.prototype.getDefaultData = function() {
	var data = [
		{
			value: 30,
			color:"#F38630"
		},
		{
			value : 50,
			color : "#E0E4CC"
		},
		{
			value : 100,
			color : "#69D2E7"
		}			
	];

	return data;
}


function UIPieChartCreator(type) {
	var args = [type, "ui-pie-chart", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPieChart();
		return g.initUIPieChart(this.type);
	}
	
	return;
}

var shapeFactory = ShapeFactoryGet();
shapeFactory.addShapeCreator(new UIBarChartCreator("ui-bar-chart"), C_UI_ELEMENTS);
shapeFactory.addShapeCreator(new UIBarChartCreator("ui-line-chart"), C_UI_ELEMENTS);
shapeFactory.addShapeCreator(new UIRadarChartCreator("ui-radar-chart"), C_UI_ELEMENTS);
shapeFactory.addShapeCreator(new UIPolarAreaChartCreator("ui-polar-area-chart"), C_UI_ELEMENTS);
shapeFactory.addShapeCreator(new UIPieChartCreator("ui-pie-chart"), C_UI_ELEMENTS);
shapeFactory.addShapeCreator(new UIPieChartCreator("ui-doughnut-chart"), C_UI_ELEMENTS);
shapeFactory.addShapeCreator(new UIChartLegendItemCreator(), C_UI_ELEMENTS);
shapeFactory.addShapeCreator(new UIChartLegendCreator(), C_UI_ELEMENTS);


