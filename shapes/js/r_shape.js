/*
 * File: r_shape.js
 * Brief: Base class of all rectangle shapes.
 * Web Site: http://www.drawapp8.com
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2011 - 2013  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function RShape() {
	return;
}

RShape.selectMarkColor = "Orange";
RShape.setSelectMarkColor = function(color) {
	RShape.selectMarkColor = color;

	return;
}

RShape.prototype = new Shape();

RShape.prototype.MIN_SIZE = 10;
RShape.prototype.isRect = true;

RShape.prototype.initRShape = function(x, y, w, h, type) {
	this.initShape(x, y, w, h, type);

	this.opacity = 1;
	this.hMargin = 0;
	this.vMargin = 0;
	this.rotation = 0;
	this.image = null;
	this.imageUrl = "";
	this.lastPosition = {x:0, y:0};
	this.pointerDownPosition = {x:0, y:0};
	this.defWidth = 200;
	this.defHeight = 60;
	this.pointerDown = false;
	this.enable = true;
	this.visible = true;
	this.events = {};
	this.pivotX = 0.5;
	this.pivotY = 0.5;

	if(w === 0 || h === 0) {
		this.w = this.MIN_SIZE;
		this.h = this.MIN_SIZE;	
		this.setState(Shape.STAT_CREATING_0);
	}

	return;
}

RShape.prototype.onPointerDown = function(point) {
	this.pointerDownPosition.x = point.x;
	this.pointerDownPosition.y = point.y;
	this.postRedraw();

	if(this.onPointerDownCreating(point)) {
		return true;
	}

	return this.onPointerDownNormal(point);
}

RShape.prototype.onPointerMove = function(point) {
	if(this.isLocked()) {
		return false;
	}

	if(this.onPointerMoveCreating(point)) {
		return true;
	}

	return this.onPointerMoveNormal(point);
}

RShape.prototype.onPointerUp = function(point) {
	var ret = false;	

	if(this.onPointerUpCreating(point)) {
		ret = true;
	}
	else {
		ret = this.onPointerUpNormal(point);
	}
	this.pointerDown = false;
	this.postRedraw();

	return ret;
}

RShape.prototype.onPointerDownCreating = function(point) {
	if(this.state === Shape.STAT_CREATING_0) {
		this.state = Shape.STAT_CREATING_1;
		this.move(point.x, point.y);
		this.lastPosition.x = point.x;
		this.lastPosition.y = point.y;
		this.postRedraw();
		this.pointerDown = true;

		return true;
	}

	return false;
}

RShape.prototype.onPointerUpCreating = function(point) {
	if(this.state !== Shape.STAT_NORMAL) {
		var dx = point.x - this.lastPosition.x;
		var dy = point.y - this.lastPosition.y;
		
		if(this.isClicked() || !this.pointerDown) {
			this.resize(this.defWidth, this.defHeight);
		}
		else {
			this.resizeDelta(dx, dy);
		}

		this.state = Shape.STAT_NORMAL;
		this.setSelected(true);
		this.postRedraw();
	}

	return false;
}

RShape.prototype.onPointerMoveCreating = function(point) {
	if(this.state === Shape.STAT_CREATING_0) {
		this.move(point.x, point.y);
		
		this.lastPosition.x = point.x;
		this.lastPosition.y = point.y;
		this.postRedraw();
		
		return true;
	}		
	else if(this.state === Shape.STAT_CREATING_1) {
		var w = point.x - this.view.pointerDownPosition.x;
		var h = point.y - this.view.pointerDownPosition.y;

		this.resize(w, h);
		
		this.lastPosition.x = point.x;
		this.lastPosition.y = point.y;
		this.postRedraw();
		
		return true;
	}

	return false;
}


RShape.prototype.onPointerDownNormal = function(point) {
	this.hitTestResult = this.hitTest(point);

	if(!this.hitTestResult) {
		return false;
	}
	
	this.pointerDown = true;
	this.setSelected(true);
	this.lastPosition.x = point.x;
	this.lastPosition.y = point.y;
	this.handlePointerEvent(point, 1);

	return true;
}

RShape.prototype.onPointerMoveNormal = function(point) {
	if(this.hitTestResult) {
		this.handlePointerEvent(point, 0);
		return true;
	}

	return false;
}

RShape.prototype.onPointerUpNormal = function(point) {
	if(this.hitTestResult) {
		this.handlePointerEvent(point, -1);
		this.hitTestResult = Shape.HIT_TEST_NONE;

		return true;
	}

	return false;
}

RShape.prototype.fixSize = function() {
	if(this.w < this.MIN_SIZE) {
		this.w = this.MIN_SIZE;
	}

	if(this.h < this.MIN_SIZE) {
		this.h = this.MIN_SIZE;
	}

	if(this.wMin && this.w < this.wMin) {
		this.w = this.wMin;
	}
	
	if(this.wMax && this.w > this.wMax) {
		this.w = this.wMax;
	}
	
	if(this.hMax && this.h > this.hMax) {
		this.h = this.hMax;
	}
	
	if(this.hMin && this.h < this.hMin) {
		this.h = this.hMin;
	}

	if(this.whRadio) {
		if(this.whRadio > 1) {
			this.h = Math.floor(this.w / this.whRadio);
		}
		else {
			this.w = Math.floor(this.h * this.whRadio);
		}
	}
	
	if(this.parentShape) {	
		this.parentShape.fixChildSize(this);
	}

	return;
}

RShape.prototype.fixChildSize = function(child) {
	var maxW = this.w;
	var maxH = this.h;
	if((child.x + child.w) > maxW) {
		child.w = maxW - child.x;
	}

	if((child.y + child.h) > maxH) {
		child.h = maxH - child.y;
	}

	return;
}

RShape.prototype.setDefSize= function(w, h) {
	this.defWidth = w;
	this.defHeight = h;

	this.w = w;
	this.h = h;

	return this;
}

RShape.prototype.setSizeLimit = function(wMin, hMin, wMax, hMax, whRadio) {
	this.wMin = wMin;
	this.wMax = wMax;
	this.hMin = hMin;
	this.hMax = hMax;
	this.whRadio = whRadio;

	return this;
}

RShape.prototype.resizeDelta =function(dw, dh) {
	this.resize(this.w + dw, this.h + dh);

	return;
}

RShape.prototype.setPosition = function(x, y) {
	this.x = Math.round(x);
	this.y = Math.round(y);

	return this;
}

RShape.prototype.setSize = function(w, h) {
	this.w = Math.max(Math.floor(w), 2);
	this.h = Math.max(Math.floor(h), 2);

	return this;
}

RShape.prototype.resize = function(w, h) {
	if(this.w !== w || this.h !== h) {
		this.realResize(w, h);
	}

	return;
}

RShape.prototype.realResize=function(w, h) {
	w = Math.max(Math.floor(w), 2);
	h = Math.max(Math.floor(h), 2);

	if(this.w != w || this.h != h) {
		this.w = w;
		this.h = h;
		this.textNeedRelayout = true;

		if(!this.isIcon) {
			this.onSized();
			this.fixSize();
		}
	}

	return;
}

RShape.prototype.translate = function(canvas) {
	canvas.translate(this.x, this.y);

	return;
}

RShape.prototype.setPivot = function(x, y) {
	this.pivotX = x;
	this.pivotY = y;

	return this;
}

RShape.prototype.applyTransform = function(canvas) {
	if(!canvas.animating && canvas.globalAlpha !== this.opacity) {
		canvas.globalAlpha =  this.opacity;
	}
	else {
		canvas.globalAlpha *=  this.opacity;
	}

	if(this.offsetX) {
		canvas.translate(this.offsetX, 0);
	}

	if(this.offsetY) {
		canvas.translate(0, this.offsetY);
	}

	var scaleX = this.getScaleX();
	var scaleY = this.getScaleY();
	var scale = scaleX !== 1 || scaleY !== 1;

	if(this.rotation || scale) {
		var px = Math.round(this.w * this.pivotX);
		var py = Math.round(this.h * this.pivotY);

		canvas.translate(px, py);
		if(scale) {
			canvas.scale(scaleX, scaleY);
		}
		
		if(this.rotation) {
			canvas.rotate(this.rotation);
		}
		canvas.translate(-px, -py);
	}

	return;
}

RShape.prototype.isPointIn = function(canvas, point) {
	return isPointInRect(point, this);
}

RShape.prototype.getMoreSelectMark = function(type, point) {
	return false;
}

RShape.prototype.getRotateSelectMark = function(type, point) {
	if(type === Shape.HIT_TEST_ROTATION) {
		point.x = this.w >> 1;
		point.y = -50;

		return true;
	}

	return false;
}

RShape.prototype.drawRotateSelectMark = function(canvas, point, hightlight) {
	var r = hightlight ? 15 : 10;
	canvas.arc(point.x, point.y, r, 0, Math.PI * 2);
	canvas.moveTo(point.x, point.y+r);
	canvas.lineTo(point.x, 0);

	return;
}

RShape.prototype.getNearPoint = function(i) {
	var x = this.getX();
	var y = this.getY();
	var w = this.getWidth();
	var h = this.getHeight();
	var p = {x:0, y:0};

	switch(i) {
		case 0: {
			p.x = x;
			p.y = y;
			break;
		}
		case 1: {
			p.x = x + w/2;
			p.y = y;
			break;
		}
		case 2: {
			p.x = x + w;
			p.y = y;
			break;
		}
		case 3: {
			p.x = x + w;
			p.y = y + h/2;
			break;
		}
		case 4: {
			p.x = x + w;
			p.y = y + h;
			break;
		}
		case 5: {
			p.x = x + w/2;
			p.y = y + h;
			break;
		}
		case 6: {
			p.x = x;
			p.y = y + h;
			break;
		}
		case 7: {
			p.x = x;
			p.y = y + h/2;
			break;
		}
		case 8: {
			p.x = x + w/2;
			p.y = y + h/2;
			break;
		}
		default: {
			if(w > h) {
				switch(i) {
					case 9: {
						p.x = x + w/4;
						p.y = y;
						break;
					}
					case 10: {
						p.x = x + 3*w/4;
						p.y = y;
						break;
					}
					case 11: {
						p.x = x + w/4;
						p.y = y + h;
						break;
					}
					case 12: {
						p.x = x + 3*w/4;
						p.y = y + h;
						break;
					}
					default: {
						return null;
					}
				}
			}
			else {
				return null;
			}
		}
	}

	return p;
}

RShape.prototype.getSelectMarkMobile = function(type, point) {
	var ret = true;
	switch(type) {
		case Shape.HIT_TEST_TL: {
			point.x = 0;
			point.y = 0;
			break;
		}
		case Shape.HIT_TEST_TR: {
			point.x = this.w;
			point.y = 0;
			break;
		}
		case Shape.HIT_TEST_BL: {
			point.x = 0;
			point.y = this.h;
			break;
		}
		case Shape.HIT_TEST_BR: {
			point.x = this.w;
			point.y = this.h;
			break;
		}
		default: {
			ret = this.getMoreSelectMark(type, point);
		}
	}

	return ret;
}

RShape.prototype.getSelectMarkPC = function(type, point) {
	var ret = true;
	switch(type) {
		case Shape.HIT_TEST_TL: {
			point.x = 0;
			point.y = 0;
			break;
		}
		case Shape.HIT_TEST_TM: {
			point.x = this.w >> 1;
			point.y = 0;
			break;
		}
		case Shape.HIT_TEST_TR: {
			point.x = this.w;
			point.y = 0;
			break;
		}
		case Shape.HIT_TEST_ML: {
			point.x = 0;
			point.y = this.h >> 1;
			break;
		}
		case Shape.HIT_TEST_MR: {
			point.x = this.w;
			point.y = this.h >> 1;
			break;
		}
		case Shape.HIT_TEST_BL: {
			point.x = 0;
			point.y = this.h;
			break;
		}
		case Shape.HIT_TEST_BM: {
			point.x = this.w >> 1;
			point.y = this.h;
			break;
		}
		case Shape.HIT_TEST_BR: {
			point.x = this.w;
			point.y = this.h;
			break;
		}
		case Shape.HIT_TEST_ROTATION: {
			point.x = this.w >> 1;
			point.y = this.h - 100;
			break;
		}
		default: {
			ret = this.getMoreSelectMark(type, point);
		}
	}
	
	return ret;
}

RShape.prototype.getSelectMark = function(type, point) {
	if(isMobile()) {
		return this.getSelectMarkMobile(type, point);
	}
	else {
		return this.getSelectMarkPC(type, point);
	}
}


RShape.prototype.drawImage = function(canvas) {
	return;
}

RShape.prototype.paintShape = function(canvas) {
	canvas.rect(0, 0, this.w, this.h);		

	return;
}

RShape.prototype.setTextNeedRelayout = function(value) {
	this.textNeedRelayout = value;

	return this;
}

RShape.prototype.layoutText = function(canvas) {
	if(!this.textNeedRelayout || this.textType === Shape.TEXT_NONE) {
		return;
	}

	canvas.font = this.style.getFont();
	var vMargin = this.vMargin ? this.vMargin : 10;
	
	var w = this.w - 2 * vMargin;
	if(w > 0) {
		this.lines = layoutText(canvas, this.style.fontSize, this.getLocaleText(this.text), w);
	}
	else {
		this.lines = [];
	}

	this.textNeedRelayout = false;

	return;
}

RShape.prototype.drawTextUnderLine = function(canvas, textX, textY, text) {
	var x = 0;
	var y = 0;
	var h = 0;
	var w = 0;
	if(!this.style.textU) {
		return;
	}
	
	w = canvas.measureText(text).width;
	if(this.textBaseline === "middle") {
		h = this.style.fontSize/2;
		if(this.textAlign === "center") {
			x = textX - w/2;
		}
		else if(this.textAlign === "left") {
			x = textX ;
		}
		else {
			x = textX - w;
		}
	}
	else if(this.textBaseline === "top") {
		h = this.style.fontSize;
		if(this.textAlign === "center") {
			x = textX - w/2;
		}
		else if(this.textAlign === "left") {
			x = textX ;
		}
		else {
			x = textX - w;
		}
	}
	else {
		if(this.textAlign === "center") {
			x = textX - w/2;
		}
		else if(this.textAlign === "left") {
			x = textX ;
		}
		else {
			x = textX - w;
		}
	}

	y = textY + h;

	canvas.moveTo(x, y);
	canvas.lineTo(x+ w, y);
	canvas.lineWidth = 1;
	canvas.stroke();

	return;
}

RShape.prototype.needDrawTextTips = function() {
	return true;
}

RShape.prototype.setInputTips = function(inputTips) {
	this.inputTips = inputTips;

	return this;
}

RShape.prototype.getTextTipsPosition = function() {
	var pos = {};

	pos.x = this.getWidth() >> 1;
	pos.y = this.getHeight() >> 1;
	pos.textAlign = "center";
	pos.textBaseline = "middle";

	return pos;
}

RShape.prototype.drawTextTips = function(canvas) {
	if(this.text || this.isIcon || this.w < 120 || this.h < 20 || this.editing) {
		return;
	}

	var pos = this.getTextTipsPosition();

	var x = pos.x;
	var y = pos.y;

	canvas.textAlign = pos.textAlign;
	canvas.textBaseline = pos.textBaseline;

	canvas.font = this.style.getFont();
	canvas.fillStyle = "#E0E0E0";	
	if(this.inputTips) {
		canvas.fillText(this.getLocaleInputTips(this.inputTips), x, y, this.getWidth());
	}
	else {
		if(this.needDrawTextTips() && this.selected && !isMobile()) {
			canvas.fillText(dappGetText("double click to edit text."), x, y, this.getWidth());
		}
	}

	return;
}

RShape.prototype.getOneLineText = function(canvas, text) {
	var line = "";
	var w = this.getWidth(true);

	if(canvas.measureText(text).width <= w) {
		return text;
	}

	for(var i = 0; i < text.length; i++) {
		var str = text[i];
		w = w - canvas.measureText(str).width;
		if(w < 0) {
			break;
		}
	
		line = line + str;
	}

	return line;
}

RShape.prototype.setMargin = function(vMargin, hMargin) {
	this.vMargin = Math.floor(Math.min(vMargin, 0.5 * this.w));
	this.hMargin = Math.floor(Math.min(hMargin, 0.5 * this.h));

	return this;
}

RShape.prototype.getVMargin = function() {
	return this.vMargin ? this.vMargin : 0;
}

RShape.prototype.getHMargin = function() {
	return this.hMargin ? this.hMargin : 0;
}

RShape.prototype.getWidth = function(withoutMargin) {
	if(withoutMargin) {
		return this.w - 2 * this.getHMargin();
	}
	else {
		return this.w;
	}
}

RShape.prototype.getHeight = function(withoutMargin) {
	if(withoutMargin) {
		return this.h - 2 * this.getVMargin();
	}
	else {
		return this.h;
	}
}

RShape.prototype.drawText = function(canvas) {
	this.defaultDrawText(canvas);

	return;
}

RShape.prototype.prepareStyle = function(canvas) {
	var style = this.style;
	canvas.lineWidth = style.lineWidth;			
	canvas.strokeStyle = style.lineColor;
	canvas.fillStyle = style.fillColor;

	return;
}

RShape.prototype.resetStyle = function(canvas) {
	canvas.shadowOffsetX = 0;
	canvas.shadowOffsetY = 0;
	canvas.shadowBlur    = 0;
	canvas.fillStyle = "White";
	canvas.beginPath();

	return;
}

RShape.prototype.strokeFill = function(canvas) {
	if(this.style.enableShadow || isOldIE()) {
		if(canvas.lineWidth >= 1) {
			if(!this.isStrokeColorTransparent()) {
				canvas.stroke();	
			}
		}

		if(!this.isFillColorTransparent()) {
			canvas.fill();
		}
	}
	else {
		if(!this.isFillColorTransparent()) {
			canvas.fill();	
		}

		if(canvas.lineWidth >= 1) {
			if(!this.isStrokeColorTransparent()) {
				canvas.stroke();	
			}
		}
	}

	return;
}

RShape.prototype.drawSizeTips = function(canvas) {
	var text = Math.abs(this.w) + " x " + Math.abs(this.h);
	canvas.font = "14px serif";
	canvas.textAlign = "center";
	canvas.textBaseline = "bottom";
	canvas.fillStyle = this.style.textColor;

	if(this.rotation) {
		text += " x r" + Math.round(this.rotation * 180/Math.PI);
	}

	canvas.beginPath();
	canvas.fillText(text, this.w/2, 0, this.w);
	canvas.fill();

	return;
}

RShape.prototype.drawSelectMark = function(canvas, type, point, hightlight) {
	canvas.beginPath();
	if(type === Shape.HIT_TEST_ROTATION) {
		this.drawRotateSelectMark(canvas, point, hightlight);
	}
	else {
		this.createSelectedMark(canvas, point.x, point.y, hightlight);
	}
	canvas.stroke();

	return;
}

RShape.prototype.drawSelectMarks = function(canvas) {
	canvas.save();
	canvas.beginPath();
	
	if(this.selected && !this.hideSelectMark) {
		var lineWidth = Math.floor(2/this.getRealScale());

		canvas.beginPath();
		canvas.rect(0, 0, this.w, this.h);		
		canvas.closePath();		
		
		canvas.lineWidth = lineWidth;			
		canvas.fillStyle = this.style.fillColor;
		canvas.strokeStyle = RShape.selectMarkColor;
		canvas.stroke();	
		
		for(var type = Shape.HIT_TEST_NONE + 1; 
			type < Shape.HIT_TEST_MAX; type++) {
			if(this.getSelectMark(type, this.selectMarkPoint)) {
				this.drawSelectMark(canvas, type, this.selectMarkPoint, type === this.hitTestResult);
			}
		}
		canvas.beginPath();
	}

	canvas.restore();
	
	return;
}

RShape.prototype.paintSelf = function(canvas) {
	canvas.save();
	this.translate(canvas);

	canvas.save();
	canvas.beginPath();

	this.prepareStyle(canvas);
	this.applyTransform(canvas);
	this.paintShape(canvas);
	canvas.closePath();			
	this.strokeFill(canvas);

	canvas.restore();
	this.resetStyle(canvas);

	this.drawImage(canvas);

	if(this.drawText && this.textType !== Shape.TEXT_NONE) {
		this.drawText(canvas);
		this.drawTextTips(canvas);
	}

	if(this.hitTestResult !== Shape.HIT_TEST_NONE || this.state !== Shape.STAT_NORMAL) {
		this.drawSizeTips(canvas);
	}
		
	this.drawSelectMarks(canvas);
	canvas.restore();
	
	return;
}

RShape.prototype.hitTest = function(point) {
	var ret = Shape.HIT_TEST_NONE;
	var canvas = this.view.getCanvas2D();
	
	canvas.save();
	this.translate(canvas);	
	this.applyTransform(canvas);

	if(this.selected) {
		for(var type = Shape.HIT_TEST_NONE + 1; 
			type < Shape.HIT_TEST_MAX; type++) {
			var smp = this.selectMarkPoint;
			if(this.getSelectMark(type, smp)) {
				if(this.isInSelectedMark(canvas, 
					smp.x, smp.y, point)) {
					canvas.restore();
					return type;
				}				
			}
		}
		
		if(this.isPointIn(canvas, point)) {
			ret = Shape.HIT_TEST_MM;
		}
	}
	else if(this.isPointIn(canvas, point)) {
		ret = Shape.HIT_TEST_MM;
	}
	
	canvas.restore();

	return ret;
}

RShape.prototype.isLocked = function() {
	return this.locked;
}

RShape.prototype.lock = function() {
	this.locked = true;

	return this;
}

RShape.prototype.unlock = function() {
	this.locked = false;

	return this;
}

RShape.prototype.execMoveResize = function(x, y, w, h) {
	if(window.MoveResizeCommand) {
		this.exec(new MoveResizeCommand(this, x, y, w, h));	
	}
	else {
		if(x || x === 0) {
			this.x = x;
		}
		if(y || y === 0) {
			this.y = y;
		}
		if(w || w === 0) {
			this.w = w;
		}
		if(h || h === 0) {
			this.h = h;
		}
	}

	return;
}

RShape.prototype.handlePointerEvent = function(point, type) {
	if(type === C_EVT_POINTER_DOWN) {
		this.saveX = this.x;
		this.saveY = this.y;
		this.saveW = this.w;
		this.saveH = this.h;
		this.saveRotation = this.rotation;

		return;
	}
	
	var saveW = this.saveW;
	var saveH = this.saveH;
	var dx = point.x - this.pointerDownPosition.x;
	var dy = point.y - this.pointerDownPosition.y;
	
	var newDx = 0;
	var newDy = 0;
	var newW = saveW;
	var newH = saveH;
	switch(this.hitTestResult) {
		case Shape.HIT_TEST_TL: {
			newDx = dx;
			newDy = dy;
			newW = saveW - dx;
			newH = saveH - dy;
			break;
		}
		case Shape.HIT_TEST_TM: {
			newDy = dy;
			newH = saveH - dy;			
			break;
		}			
		case Shape.HIT_TEST_TR: {
			newDx = 0;
			newDy = dy;
			newW = saveW + dx;
			newH = saveH - dy;			
			break;
		}
		case Shape.HIT_TEST_ML: {
			newDx = dx;
			newW = saveW - dx;		
			break;
		}			
		case Shape.HIT_TEST_MR: {
			newW = saveW  + dx;				
			break;
		}				
		case Shape.HIT_TEST_BL: {
			newDx = dx;
			newW = saveW - dx;
			newH = saveH + dy;			
			break;
		}
		case Shape.HIT_TEST_BM: {
			newH = saveH + dy;			
			break;
		}			
		case Shape.HIT_TEST_BR: {
			newW = saveW + dx;
			newH = saveH + dy;			
			break;
		}			
		case Shape.HIT_TEST_MOVE: 
		case Shape.HIT_TEST_MM: {		
			newDx = dx;
			newDy = dy;
			break;
		}
		case Shape.HIT_TEST_ROTATION: {
			var cx = (this.w >> 1) + this.x;
			var cy = (this.h >> 1) + this.y;
			var angle = Math.lineAngle({x:cx, y:cy}, point) + Math.PI * 0.5;

			if(angle > Math.PI * 2) {
				angle = angle - Math.PI * 2;
			}
			this.setRotation(angle);

			if(type === C_EVT_POINTER_UP) {
				var rotation = this.rotation;
				this.rotation = this.saveRotation;
				this.exec(AttributeCommand.create(this, "rotation", null, rotation));
			}
			break;
		}
		default:break;
	}	
	
	if(type === C_EVT_POINTER_UP) {

		if(this.x !== this.saveX || this.y !== this.saveY) {
			var x = this.x;
			var y = this.y;
			this.x = this.saveX;
			this.y = this.saveY;
			
			if(this.isUserMovable()) {
				this.execMoveResize(x, y);
				this.onUserMoved();
			}
		}
		
		if(this.w !== saveW || this.h !== saveH) {
			var w = this.w;
			var h = this.h;
			this.w = saveW;
			this.h = saveH;
	
			if(this.isUserResizable()) {
				this.execMoveResize(null, null, w, h);			
				this.onUserResized();
			}
		}
	}
	else {
		if(newDx || newDy) {
			if(this.isUserMovable()) {
				this.setPosition(this.saveX + newDx, this.saveY + newDy);
			}

			this.onMoving();
		}
		
		if(saveW !== newW || saveH !== newH) {
			if(this.isUserResizable()) {
				this.setSize(newW, newH);
			}
		}
	}
	
	if(this.hitTestResult === Shape.HIT_TEST_HANDLE) {
		dx = point.x - this.lastPosition.x;
		dy = point.y - this.lastPosition.y;
		this.moveHandle(dx, dy);
	}
	
	this.postRedraw();
	
	this.lastPosition.x = point.x;
	this.lastPosition.y = point.y;

	return true;
}

RShape.prototype.onKeyDown = function(code) {
	return;
}

RShape.prototype.onKeyUp = function(code) {
	return;
}		

RShape.prototype.toJsonMore = function(o) {
	return;
}

RShape.prototype.toJson = function() {
	var o = {};
	o.type = "";
	o.name = "";

	for(var key in this) {
		var value = this[key];
		var type = typeof value;

		if(key === "isRect" || key === "isContainer") {
			continue;
		}

		if(type === "function" || type === "object" || type === "undefined") {
			continue;
		}

		if(type === "number" || type === "string" || type === "boolean") {
			o[key] = value;
		}
	}
	
	delete o.mode;
	delete o.state;
	delete o.MIN_SIZE;
	delete o.selected;
	delete o.animating;
	delete o.pointerDown;
	delete o.saveX;
	delete o.saveY;
	delete o.saveW;
	delete o.saveH;
	delete o.saveRotation;
	delete o.hignlighted;
	delete o.textNeedRelayout;
	delete o.openPending;
	delete o.pointerDownTime;
	delete o.hitTestResult;
	delete o.pointerDownPosition;
	delete o.defWidth;
	delete o.defHeight;
	delete o.userMovable;
	delete o.userResizable;
	delete o.textX;
	delete o.textY;
	delete o.textAlign;
	delete o.textTitle;
	delete o.vAlign;
	delete o.hAlign;
	delete o.editing;
	delete o.textBaseline;
	delete o.selectedTime;
	delete o.animating;
	delete o.clipW;
	delete o.clipH;
	delete o.fixResolution;
	delete o.forcePortrait;
	delete o.forceLandscape;
	delete o.resLoadDone;
	delete o.saveDx;
	delete o.saveDy;
	delete o.initWindowIndex;
	delete o.timerID;

	if(!o.textType) {
		delete o.vTextAlign;
		delete o.hTextAlign;
	}
	delete o.textType;

	if(!o.vMargin) {
		delete o.vMargin;
	}
	
	if(!o.hMargin) {
		delete o.hMargin;
	}

	if(!o.rotation) {
		delete o.rotation;
	}

	if(o.opacity === 1) {
		delete o.opacity;
	}

	delete o.scale;
	delete o.scaleX;
	delete o.scaleY;
	delete o.needRelayout;
	delete o.rectSelectable;

	if(o.rotate == 0) {
		delete o.rotate;
	}

	if(!o.imageUrl) {
		delete o.imageUrl;
	}
	
	if(o.offset) {
		o.offset = 0;
	}

	o.x = Math.floor(this.x);
	o.y = Math.floor(this.y);
	o.w = Math.floor(this.w);
	o.h = Math.floor(this.h);
	
	o.style = this.style.toJson();
	delete o.style.arrowSize;
	delete o.style.lineStyle;
	delete o.style.firstArrowType;
	delete o.style.secondArrowType;

	if(this.handle) {
		o.handle = this.handle;
	}

	if(this.settings) {
		o.settings = this.settings;
	}

	if(this.propertySheetDesc) {
		o.propertySheetDesc = this.propertySheetDesc;
	}

	this.toJsonMore(o)

	return o;
}

RShape.prototype.fromJsonMore = function(js) {
	return;
}

RShape.prototype.onFromJsonDone = function() {
}

RShape.prototype.fromJson = function(js) {
	this.isUnpacking = true;

	for(var key in js) {
		var value = js[key];
		var type = typeof value;
		if(type === "function" || type === "object" || type === "undefined") {
			continue;
		}

		if(type === "number" || type === "string" || type === "boolean") {
			this[key] = value;
		}
	}

	if(this.vAlign) {
		this.vTextAlign = this.vAlign;
		delete this.vAlign;
	}

	if(this.hAlign) {
		this.hTextAlign = this.hAlign;
		delete this.hAlign;
	}

	if(js.vMargin === undefined) {
		this.vMargin = 0;
	}
	
	if(js.hMargin === undefined) {
		this.hMargin = 0;
	}
	
	if(js.rotation === undefined) {
		this.rotation = 0;
	}
	
	if(js.opacity === undefined) {
		this.opacity = 1;
	}
	
	if(js.scaleX === undefined) {
		this.scaleX = 1;
	}
	if(js.scaleX === undefined) {
		this.scaleX = 1;
	}

	this.fromJsonMore(js);
	
	if(js.style) {
		this.style.fromJson(js.style);
	}

	if(js.propertySheetDesc) {
		this.propertySheetDesc = js.propertySheetDesc;
	}

	if(js.handle) {
		this.handle = js.handle;
	}

	if(js.settings) {
		this.settings = js.settings;
	}

	/*for comptable purpose*/
	if(js.dx != undefined) {
		this.x = js.dx;
	}
	if(js.dy != undefined) {
		this.y = js.dy;
	}

	this.setText(this.text);
	this.textNeedRelayout = true;
	this.state = Shape.STAT_NORMAL;
	delete this.isUnpacking;

	this.onFromJsonDone(js);

	return;
}

RShape.prototype.setImage = function(value) {
	if(value === this.imageUrl) {
		return;
	}

	this.imageUrl = value;
	this.image = new WImage(value);
	
	return this;
}


RShape.prototype.asIcon = function() {
	this.resize(36, 36);

	if(!this.isIcon) {
		this.setStyle(Shape.getIconShapeStyle());
	}

	this.isIcon = true;

	return;
}	

RShape.prototype.showProperty = function() {
	var app = this.getApp();
	if(app) {
		app.showRShapePropertyDialog(this);
	}

	return;
}
	
RShape.prototype.getMoveDeltaX = function() {
	return this.view ? this.view.getMoveDeltaX() : 0; 
}

RShape.prototype.getMoveDeltaY = function() {
	return this.view ? this.view.getMoveDeltaY() : 0;
}

RShape.prototype.getMoveAbsDeltaX = function() {
	return this.view ? this.view.getMoveAbsDeltaX() : 0;
}

RShape.prototype.getMoveAbsDeltaY = function() {
	return this.view ? this.view.getMoveAbsDeltaY() : 0;
}

RShape.prototype.setRoundRadius = function(roundRadius) {
	this.roundRadius = roundRadius;

	return this;
}

RShape.prototype.setFillColor = function(fillColor) {
	this.style.setFillColor(fillColor);

	return this;
}

RShape.prototype.setLineColor = function(lineColor) {
	this.style.setLineColor(lineColor);

	return this;
}

RShape.prototype.setTextColor = function(textColor) {
	this.style.setTextColor(textColor);

	return this;
}

RShape.prototype.getFillColor = function() {
	return this.style.fillColor;
}

RShape.prototype.getLineColor = function() {
	return this.style.lineColor;
}

RShape.prototype.getTextColor = function() {
	return this.style.textColor;
}

function RShapeInit(g, type) {
	var x = 0;
	var y = 0;
	var w = 0;
	var h = 0;

	g.initRShape(x, y, w, h, type);
	g.setSize(40, 40);
	g.setText("");

	return g;
}

