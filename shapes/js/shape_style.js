
var C_LINE_STYLE_0 = (255 << 8) | 0;
var C_LINE_STYLE_1 = (2 << 8) | 4;
var C_LINE_STYLE_2 = (4 << 8) | 4;
var C_LINE_STYLE_3 = (8 << 8) | 8;
var C_LINE_STYLE_4 = (10 << 8) | 10;

function resetShapeStyle(style) {
	style.lineStyle = 0xFF00;
	style.lineWidth = 2;
	style.lineColor = "Orange";
	style.fillColor = "White";
	style.textColor = "Blue";
	style.fontSize = 24;
	style.fontFamily = "sans";
	style.arrowSize = 12;
	style.firstArrowType = 0;
	style.secondArrowType = 0;
	style.textB = 0;
	style.textI = 0;
	style.textU = 0;
	style.enableShadow = false;
	style.shadow = {x: 0, y: 0, blur: 8, color:"Black"};
	style.enableGradient = false;
	style.listener = null;
	
	return style;
}

function createShapeStyle() {
	var style = new ShapeStyle();

	return resetShapeStyle(style);
}

function ShapeStyle() {
}
	
ShapeStyle.prototype.getFont = function() {
	var font = "";
	
	if(this.textI) {
		font = "italic  "
	}
	
	if(this.textB) {
		font = font + "bold "
	}
	
	font = font + this.fontSize + "pt " + this.fontFamily;

	return font;
}

ShapeStyle.prototype.setListener = function(obj) {
	this.listener = obj;
	
	return;
}

ShapeStyle.prototype.notify = function() {
	if(this.listener) {
		this.listener.setNewStyle(this);
	}
	
	return;
}
ShapeStyle.prototype.setLineStyle=function(value) {
	this.lineStyle = value;

	return;
}

ShapeStyle.prototype.setLineWidth=function(value) {
	this.lineWidth = value > 0 ? value : 1;

	return;
}

ShapeStyle.prototype.setLineColor=function(value) {
	this.lineColor = value;

	return;
}

ShapeStyle.prototype.setFillColor=function(value) {
	if("string" != typeof value) {
		this.fillColor = value;
		this.enableGradient = true;
	}
	else {
		if(value.length > 12 && value.indexOf("rgb") < 0) {
			try {
				this.fillColor = JSON.parse(value);
				this.enableGradient = true;
			}catch(e) {
				console.log(e.message);
			}
		}
		else {
			this.fillColor = value;
		}
	}

	return;
}

ShapeStyle.prototype.setTextColor=function(value) {
	this.textColor = value;

	return;
}

ShapeStyle.prototype.setFontSize=function(value) {
	var fontSize = Math.max(value, 6);

	this.fontSize = fontSize;

	return;
}

ShapeStyle.prototype.setFontFamily =function(fontFamily) {
	this.fontFamily = fontFamily ? fontFamily : "serif";

	return;
}

ShapeStyle.prototype.setFirstArrowType=function(value) {
	this.firstArrowType = value;

	return;
}

ShapeStyle.prototype.setSecondArrowType=function(value) {
	this.secondArrowType = value;

	return;
}

ShapeStyle.prototype.setArrowSize=function(value) {
	this.arrowSize = value;

	return;
}

ShapeStyle.prototype.setTextB=function(value) {
	this.textB = value;

	return;
}

ShapeStyle.prototype.setTextU=function(value) {
	this.textU = value;

	return;
}

ShapeStyle.prototype.setTextI=function(value) {
	this.textI = value;

	return;
}

ShapeStyle.prototype.setShadow = function(enable, shadow) {
	this.enableShadow = enable;
	this.shadow = shadow;

	return;
}

ShapeStyle.prototype.getStrokeStyle = function(canvas) {
	var strokeStyle = this.strokeColor;

	return strokeStyle;
}

ShapeStyle.prototype.getGradFillStyle = function(canvas, x, y, w, h) {
	var color = this.fillColor;

	if(!color) {
		return "White";
	}

	if(typeof color === "string") {
		return color;
	}

	var x0 = x;
	var y0 = y;
	var x1 = x + (color.x1 < 0 ? w : color.x1);
	var y1 = y + (color.y1 < 0 ? h : color.y1);

	if(isNaN(x1) || isNaN(y1) || isNaN(x0) || isNaN(y0)) {
		return this.fillColor;
	}

	var gradientStyle = canvas.createLinearGradient(x0, y0, x1, y1);

	try {
		for(var i = 0; i < color.data.length; i++) {
			var data = color.data[i];
			gradientStyle.addColorStop(data.o, data.c);
		}
	}
	catch(e) {
		this.enableGradient = false;
		this.fillColor = "White";
		console.log(e.message);

		return "White";
	}

	return gradientStyle;
}

ShapeStyle.prototype.copy = function(other) {
	var js = other.toJson();

	this.fromJson(js);

	return ;
}

ShapeStyle.prototype.toJson = function() {
	var o = new Object();

	for(var key in this) {
		var value = this[key];
		var type = typeof value;
		if(type === "function" || type === "object" || type === "undefined") {
			continue;
		}

		if(type === "number" || type === "string" || type === "boolean") {
			o[key] = value;
		}
	}
	
	if(this.enableShadow) {
		o.shadow = this.shadow;
	}
	else {
		delete o.enableShadow;
	}

	if(this.enableGradient) {
		o.fillColor = this.fillColor;
	}
	else {
		delete o.enableGradient;
	}

	if(!this.textI) {
		delete o.textI;
	}
	
	if(!this.textU) {
		delete o.textU;
	}
	
	if(!this.textB) {
		delete o.textB;
	}

	delete o.textAlignment;

	return o;
}

ShapeStyle.prototype.fromJson = function(js) {
	resetShapeStyle(this);

	if(js.ls) {
		//old version compatable
		this.lineStyle = js.ls;
		this.lineWidth = js.lw;
		this.lineColor = js.lc;
		this.fillColor = js.fc;
		this.textColor = js.tc;
		this.fontSize = js.fs;
		this.fontFamily = (js.fm != undefined) ? js.fm : "serif";
		this.arrowSize = js.as;
		this.firstArrowType = js.fat;
		this.secondArrowType = js.sat;
		this.textB = js.b;
		this.textI = js.i;
		this.textU = js.u;	
		this.enableShadow = js.es;
	}
	else {
		for(var key in js) {
			var value = js[key];
			var type = typeof value;
			if(type === "function" || type === "undefined") {
				continue;
			}

			this[key] = value;
		}
	}

	if(this.enableShadow) {
		this.shadow = js.shadow;

		if(!this.shadow) {
			this.enableShadow = false;
		}
	}
	
	if(this.enableGradient) {
		this.setFillColor(this.fillColor);
	}
	
	return;
}

ShapeStyle.prototype.dup = function() {
	var other = new ShapeStyle();
	
	other.copy(this);
	
	return other;
}

ShapeStyle.prototype.equalTo = function(style) {
	var thisJson = JSON.stringify(this.toJson());
	var otherJson = JSON.stringify(style.toJson());

	return thisJson === otherJson;
}

var gShapeStyle = null;

function DefaultShapeStyleGet() {
	if(gShapeStyle) {
		return gShapeStyle;
	}
	
	gShapeStyle = createShapeStyle();
	
	return gShapeStyle;
}

function saveDefaultShapeStyle() {
	var style = DefaultShapeStyleGet();
	var js = style.toJson();
	
	localStorage.style = JSON.stringify(js);

	return;
}

function loadDefaultShapeStyle() {
	var ret = false;
	var style = DefaultShapeStyleGet();
	
	if(localStorage.style) {
		var js = JSON.parse(localStorage.style);
		style.fromJson(js);
		ret = true;
	}
	
	return ret;
}

var gIconShapeStyle = null;
function getIconShapeStyle() {
	if(!gIconShapeStyle) {
		gIconShapeStyle = createShapeStyle();
		gIconShapeStyle.setLineWidth(1);
		gIconShapeStyle.setFontSize(8);
		gIconShapeStyle.setLineColor("Black");
		gIconShapeStyle.setFillColor("White");
		gIconShapeStyle.setTextColor("Black");
	}

	return gIconShapeStyle;
}

