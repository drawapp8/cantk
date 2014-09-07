/*
 * File:   ui-led-digits.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  LED Digits 
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UILedDigits() {
	return;
}

UILedDigits.prototype = new UIElement();
UILedDigits.prototype.isUILedDigits = true;

UILedDigits.prototype.initUILedDigits = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_NONE);

	return this;
}

UILedDigits.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UILedDigits.prototype.setText = function(text) {
	this.text = "";

	text = this.toText(text); 
	for(var i = 0; i < text.length; i++) {
		var c = text[i];

		switch(c) {
			case '.':
			case ':':
			case '0':
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
			case 'E':
			case 'F':
			case 'F': {
				this.text = this.text + c;
			}
			default:break;
		}
	}

	return;
}

UILedDigits.prototype.drawBarVL = function(canvas, w, h) {
	canvas.beginPath();
	canvas.moveTo(0, 0);
	canvas.lineTo(0, h);
	canvas.lineTo(w, h-w);
	canvas.lineTo(w, w);
	canvas.lineTo(0, 0);

	return;
}

UILedDigits.prototype.drawBarVR = function(canvas, w, h) {
	canvas.beginPath();
	canvas.moveTo(w, 0);
	canvas.lineTo(w, h);
	canvas.lineTo(0, h-w);
	canvas.lineTo(0, w);
	canvas.lineTo(w, 0);

	return;
}

UILedDigits.prototype.drawBarHT = function(canvas, w, h) {
	canvas.beginPath();
	canvas.moveTo(0, 0);
	canvas.lineTo(w, 0);
	canvas.lineTo(w-h, h);
	canvas.lineTo(h, h);
	canvas.lineTo(0, 0);

	return;
}

UILedDigits.prototype.drawBarHM = function(canvas, w, h) {
	canvas.beginPath();
	var space = Math.round(h/3);
	w = w - 2 * space;
	canvas.translate(space, 0);
	canvas.moveTo(0, h/2);
	canvas.lineTo(h/2, 0);
	canvas.lineTo(w-h/2, 0);
	canvas.lineTo(w, h/2);
	canvas.lineTo(w-h/2, h);
	canvas.lineTo(h/2, h);
	canvas.lineTo(0, h/2);
	canvas.translate(-space, 0);

	return;
}
UILedDigits.prototype.drawBarHB = function(canvas, w, h) {
	canvas.beginPath();
	canvas.moveTo(0, h);
	canvas.lineTo(w, h);
	canvas.lineTo(w-h, 0);
	canvas.lineTo(h, 0);
	canvas.lineTo(0, h);

	return;
}

UILedDigits.prototype.drawBar = function(canvas, w, h) {
	if(w < h) {
		this.drawBarV(canvas, w, h);
	}
	else {
		this.drawBarH(canvas, w, h);
	}

	return;
}

UILedDigits.prototype.drawDot = function(canvas, w, h, dot) {
	var size = (w/4 + h/8)/2;

	if(dot === ".") {
		canvas.fillRect((w-size)/2, 0.75*h - size/2, size, size);
	}
	else if(dot = ":") {
		canvas.fillRect((w-size)/2, 0.25*h - size/2, size, size);
		canvas.fillRect((w-size)/2, 0.75*h - size/2, size, size);
	}

	return;
}

UILedDigits.prototype.map = {
	"0":0x7d,
	"1":0x60,
	"2":0x37,
	"3":0x67,
	"4":0x6a,
	"5":0x4f,
	"6":0x5f,
	"7":0x61,
	"8":0x7f,
	"9":0x6f,
	"E":0x1f,
	"F":0x1b,
	"H":0x7a
};

UILedDigits.prototype.fillBar = function(canvas, light) {
	if(light) {
		canvas.fillStyle = this.style.textColor;
		canvas.fill();
	}
	else {
		canvas.lineWidth = 1;
		canvas.strokeStyle = this.style.lineColor;
		canvas.stroke();
	}

	return;
}

UILedDigits.prototype.drawDigit = function(canvas, w, h, digit) {
	var hBarHeight = Math.max(3, Math.round(h/10));
	var vBarWidht = Math.max(3, Math.round(w/10));
	var size = Math.round((vBarWidht + hBarHeight)/2);

	var space = 1;
	var hBarWidth = w - 2 * space;
	var vBarHeight = Math.floor(h/2 - 2 * space);
	var mask = this.map[digit];

	canvas.translate(space, 0);
	this.drawBarHT(canvas, hBarWidth, size);
	canvas.translate(-space, 0);
	this.fillBar(canvas, mask & 0x01);

	var yOffset = Math.floor((h-hBarHeight)/2);
	canvas.translate(space, yOffset);
	this.drawBarHM(canvas, hBarWidth, size);
	canvas.translate(-space, -yOffset);
	this.fillBar(canvas, (mask >> 1) & 0x01);

	var yOffset = h-hBarHeight;
	canvas.translate(space, yOffset);
	this.drawBarHB(canvas, hBarWidth, size);
	canvas.translate(-space, -yOffset);
	this.fillBar(canvas, (mask >> 2) & 0x01);

	canvas.translate(0, space);
	this.drawBarVL(canvas, size, vBarHeight);
	canvas.translate(0, -space);
	this.fillBar(canvas, (mask >> 3) & 0x01);

	var yOffset = Math.round(2*space + (h-hBarHeight)/2)+space;
	canvas.translate(0, yOffset);
	this.drawBarVL(canvas, size, vBarHeight);
	canvas.translate(0, -yOffset);
	this.fillBar(canvas, (mask >> 4) & 0x01);

	canvas.translate((w-size), space);
	this.drawBarVR(canvas, size, vBarHeight);
	canvas.translate(-(w-size), -space);
	this.fillBar(canvas, (mask >> 5) & 0x01);

	canvas.translate((w-size), yOffset);
	this.drawBarVR(canvas, size, vBarHeight);
	canvas.translate(-(w-size), -yOffset);
	this.fillBar(canvas, (mask >> 6) & 0x01);
	
	return;
}

UILedDigits.prototype.drawDigits = function(canvas) {
	var dots = 0;
	var text = this.text
	var n = text.length;

	if(!n) {
		return;
	}

	for(var i = 0; i < n; i++) {
		var d = text[i];
		if(d === "." || d === ":") {
			dots = dots + 1;
		}
	}

	var space = this.w/n * 0.2;
	var w = this.w/n - space;
	var h = this.h;

	canvas.save();
	canvas.translate(w/4 * dots, 0);
	for(var i = 0; i < n; i++) {
		var d = text[i];
		if(d === "." || d === ":") {
			this.drawDot(canvas, w/2, h, text[i]);
			canvas.translate(w/2+space, 0);
		}
		else {
			this.drawDigit(canvas, w, h, text[i]);
			canvas.translate(w+space, 0);
		}
	}
	canvas.restore();

	return;
}

UILedDigits.prototype.paintSelfOnly = function(canvas) {
	if(!this.isFillColorTransparent()) {
		canvas.fillStyle = this.style.fillColor;
		canvas.fillRect(0, 0, this.w, this.h);
	}

	canvas.fillStyle = this.style.lineColor;
	this.drawDigits(canvas);

	return;
}

function UILedDigitsCreator(w, h) {
	var args = ["ui-led-digits", "ui-led-digits", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UILedDigits();
		return g.initUILedDigits(this.type, w, h);
	}
	
	return;
}

