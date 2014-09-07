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

	this.scale = 1;
	this.opacity = 1;
	this.hMargin = 0;
	this.vMargin = 0;
	this.rotation = 0;
	this.saveWidth = 0;
	this.saveHeight = 0;
	this.image = null;
	this.imageUrl = "";
	this.rect = new Rect(0, 0, w, h);
	this.lastPosition = new Point(0, 0);
	this.pointerDownPosition = new Point(0, 0);
	this.defWidth = 200;
	this.defHeight = 60;
	this.pointerDown = false;
	this.enable = true;
	this.visible = true;
	this.events = {};

	if(w === 0 || h === 0) {
		this.w = this.MIN_SIZE;
		this.h = this.MIN_SIZE;	
		this.setState(C_STAT_CREATING_0);

		this.onPointerDown = function(point) {
			this.pointerDownPosition.x = point.x;
			this.pointerDownPosition.y = point.y;
			this.postRedraw();

			if(this.onPointerDownCreating(point)) {
				return true;
			}

			return this.onPointerDownNormal(point);
		}
	
		this.onPointerMove = function(point) {
			if(this.onPointerMoveCreating(point)) {
				return true;
			}

			return this.onPointerMoveNormal(point);
		}

		this.onPointerUp = function(point) {
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
	}

	return;
}

RShape.prototype.onPointerDownCreating = function(point) {
	if(this.state === C_STAT_CREATING_0) {
		this.state = C_STAT_CREATING_1;
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
	if(this.state !== C_STAT_NORMAL) {
		var dx = point.x - this.lastPosition.x;
		var dy = point.y - this.lastPosition.y;
		
		if(this.isClicked() || !this.pointerDown) {
			this.resize(this.defWidth, this.defHeight);
		}
		else {
			this.resizeDelta(dx, dy);
		}

		this.state = C_STAT_NORMAL;
		this.setSelected(true);
		this.afterCreated();		
		this.postRedraw();
	}

	return false;
}

RShape.prototype.onPointerMoveCreating = function(point) {
	if(this.state === C_STAT_CREATING_0) {
		this.move(point.x, point.y);
		
		this.lastPosition.x = point.x;
		this.lastPosition.y = point.y;
		this.postRedraw();
		
		return true;
	}		
	else if(this.state === C_STAT_CREATING_1) {
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
		this.hitTestResult = C_HIT_TEST_NONE;

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

	return;
}

RShape.prototype.setSizeLimit = function(wMin, hMin, wMax, hMax, whRadio) {
	this.wMin = wMin;
	this.wMax = wMax;
	this.hMin = hMin;
	this.hMax = hMax;
	this.whRadio = whRadio;

	return;
}

RShape.prototype.resizeDelta =function(dw, dh) {
	this.resize(this.w + dw, this.h + dh);

	return;
}

RShape.prototype.setPosition = function(x, y) {
	this.x = x;
	this.y = y;

	return;
}

RShape.prototype.setSize = function(w, h) {
	this.w = Math.floor(w);
	this.h = Math.floor(h);

	return;
}

RShape.prototype.resize = function(w, h) {
	if(this.w !== w || this.h !== h) {
		this.realResize(w, h);
	}

	return;
}

RShape.prototype.realResize=function(w, h) {
	w = Math.floor(w);
	h = Math.floor(h);

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

RShape.prototype.applyTransform = function(canvas) {
	var hw = this.w >> 1;
	var hh = this.h >> 1;
	
	canvas.globalAlpha =  this.opacity;

	if(this.offsetX) {
		canvas.translate(this.offsetX, 0);
	}

	if(this.offsetY) {
		canvas.translate(0, this.offsetY);
	}
	
	canvas.translate(hw, hh);
	if(this.scale) {
		canvas.scale(this.scale, this.scale);
	}
	
	if(this.rotation) {
		canvas.rotate(this.rotation);
	}
	canvas.translate(-hw, -hh);


	return;
}

RShape.prototype.isPointIn = function(canvas, point) {
	if(canvas) {
		canvas.beginPath();
		canvas.rect(0, 0, this.w, this.h);

		return canvas.isPointInPath(point.x, point.y);
	}
	else {
		return isPointInRect(point, this);
	}
}

RShape.prototype.getMoreSelectMark = function(type, point) {
	return false;
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
		case C_HIT_TEST_TL: {
			point.x = 0;
			point.y = 0;
			break;
		}
		case C_HIT_TEST_TR: {
			point.x = this.w;
			point.y = 0;
			break;
		}
		case C_HIT_TEST_BL: {
			point.x = 0;
			point.y = this.h;
			break;
		}
		case C_HIT_TEST_BR: {
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
		case C_HIT_TEST_TL: {
			point.x = 0;
			point.y = 0;
			break;
		}
		case C_HIT_TEST_TM: {
			point.x = this.w/2;
			point.y = 0;
			break;
		}
		case C_HIT_TEST_TR: {
			point.x = this.w;
			point.y = 0;
			break;
		}
		case C_HIT_TEST_ML: {
			point.x = 0;
			point.y = this.h/2;
			break;
		}
		case C_HIT_TEST_MR: {
			point.x = this.w;
			point.y = this.h/2;
			break;
		}
		case C_HIT_TEST_BL: {
			point.x = 0;
			point.y = this.h;
			break;
		}
		case C_HIT_TEST_BM: {
			point.x = this.w/2;
			point.y = this.h;
			break;
		}
		case C_HIT_TEST_BR: {
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

	return;
}

RShape.prototype.layoutText = function(canvas) {
	if(!this.textNeedRelayout || this.textType === C_SHAPE_TEXT_NONE) {
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

	return;
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

	return;
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
	if(style.enableGradient) {
		canvas.fillStyle = style.getGradFillStyle(canvas, 0, 0, this.w, this.h);
	}
	else {
		canvas.fillStyle = style.fillColor;
	}

	if(style.enableShadow) {
		canvas.shadowColor   = style.shadow.color;
		canvas.shadowOffsetX = style.shadow.x;
		canvas.shadowOffsetY = style.shadow.y
		canvas.shadowBlur    = style.shadow.blur;
	}
	else {
		canvas.shadowOffsetX = 0;
		canvas.shadowOffsetY = 0;
		canvas.shadowBlur    = 0;
	}

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
	
	canvas.beginPath();
	canvas.fillText(text, this.w/2, 0, this.w);
	canvas.fill();

	return;
}

RShape.prototype.drawSelectMarks = function(canvas) {
	canvas.save();
	this.applyTransform(canvas);
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
		
		canvas.beginPath();
		canvas.lineWidth = lineWidth;
		
		for(var type = C_HIT_TEST_NONE + 1; 
			type < C_HIT_TEST_MAX; type++) {
			if(this.getSelectMark(type, this.selectMarkPoint)) {
				this.createSelectedMark(canvas, this.selectMarkPoint.x, this.selectMarkPoint.y, type == this.hitTestResult);
			}
		}
		canvas.closePath();
		canvas.stroke();
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

	if(this.drawText && this.textType !== C_SHAPE_TEXT_NONE) {
		this.drawText(canvas);
		this.drawTextTips(canvas);
	}

	if(this.hitTestResult !== C_HIT_TEST_NONE || this.state !== C_STAT_NORMAL) {
		this.drawSizeTips(canvas);
	}
		
	this.drawSelectMarks(canvas);
	canvas.restore();
	
	return;
}

RShape.prototype.hitTest = function(point) {
	var ret = C_HIT_TEST_NONE;
	var canvas = this.view.getCanvas2D();
	
	canvas.save();
	this.translate(canvas);	
	this.applyTransform(canvas);

	if(this.selected) {
		for(var type = C_HIT_TEST_NONE + 1; 
			type < C_HIT_TEST_MAX; type++) {
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
			ret = C_HIT_TEST_MM;
		}
	}
	else if(this.isPointIn(canvas, point)) {
		ret = C_HIT_TEST_MM;
	}
	
	canvas.restore();

	return ret;
}

RShape.prototype.lockPosition = function(isPositionLocked) {
	this.userMovable = !isPositionLocked;
	this.isPositionLocked = isPositionLocked;

	return;
}

RShape.prototype.execMoveResize = function(x, y, w, h) {
	this.exec(new MoveResizeCommand(this, x, y, w, h));	

	return;
}

RShape.prototype.handlePointerEvent = function(point, type) {
	if(type === C_EVT_POINTER_DOWN) {
		this.saveDx = this.x;
		this.saveDy = this.y;
		this.saveWidth = this.w;
		this.saveHeight = this.h;
		
		return;
	}
	
	var dx = point.x - this.lastPosition.x;
	var dy = point.y - this.lastPosition.y;
	var tdx = dx;
	var tdy = dy;
	
	var new_dx = 0;
	var new_dy = 0;
	var new_w = this.w;
	var new_h = this.h;
	
	switch(this.hitTestResult) {
		case C_HIT_TEST_TL: {
			new_dx = tdx;
			new_dy = tdy;
			new_w = this.w - tdx;
			new_h = this.h - tdy;
			
			break;
		}
		case C_HIT_TEST_TM: {
			new_dy = tdy;
			new_h = this.h - tdy;			
			break;
		}			
		case C_HIT_TEST_TR: {
			new_dx = 0;
			new_dy = tdy;
			new_w = this.w + tdx;
			new_h = this.h - tdy;			
			break;
		}
		case C_HIT_TEST_ML: {
			new_dx = tdx;
			new_w = this.w - tdx;		
			break;
		}			
		case C_HIT_TEST_MR: {
			new_w = this.w  + tdx;				
			break;
		}				
		case C_HIT_TEST_BL: {
			new_dx = tdx;
			new_w = this.w - tdx;
			new_h = this.h + tdy;			
			break;
		}
		case C_HIT_TEST_BM: {
			new_h = this.h + tdy;			
			break;
		}			
		case C_HIT_TEST_BR: {
			new_w = this.w + tdx;
			new_h = this.h + tdy;			
			break;
		}			
		case C_HIT_TEST_MM: {		
			new_dx = tdx;
			new_dy = tdy;
			break;
		}
		default:break;
	}	
	
	if(type === C_EVT_POINTER_UP) {

		if(this.x !== this.saveDx || this.y !== this.saveDy) {
			var dx = this.x;
			var dy = this.y;
			this.x = this.saveDx;
			this.y = this.saveDy;
			
			if(this.isUserMovable()) {
				this.execMoveResize(dx, dy);
			}
		}
		
		if(this.w !== this.saveWidth || this.h !== this.saveHeight) {
			var w = this.w;
			var h = this.h;
			this.w = this.saveWidth;
			this.h = this.saveHeight;
	
			if(this.isUserResizable()) {
				this.execMoveResize(null, null, w, h);			
				this.onUserResized();
			}
		}
		this.hitTestResult = C_HIT_TEST_NONE;
	}
	else {
		if(new_dx || new_dy) {
			if(this.isUserMovable()) {
				this.setPosition(this.x + new_dx, this.y + new_dy);
			}

			this.onMoving();
		}
		
		if(this.w !== new_w || this.h !== new_h) {
			if(this.isUserResizable()) {
				this.setSize(new_w, new_h);
			}
		}
	}
	
	if(this.hitTestResult === C_HIT_TEST_HANDLE) {
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
	var o = new Object();
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
	delete o.saveDx;
	delete o.saveDy;
	delete o.MIN_SIZE;
	delete o.selected;
	delete o.animating;
	delete o.pointerDown;
	delete o.saveWidth;
	delete o.saveHeight;
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

	if(o.enable) {
		delete o.enable;
	}
	
	if(o.visible) {
		delete o.visible;
	}

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

	if(o.scale === 1) {
		delete o.scale;
	}

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
	
	if(js.scale === undefined) {
		this.scale = 1;
	}

	this.fromJsonMore(js);
	
	if(js.style) {
		this.style.fromJson(js.style);
	}

	if(js.handle) {
		this.handle = js.handle;
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
	this.state = C_STAT_NORMAL;
	delete this.isUnpacking;

	this.onFromJsonDone();

	return;
}

RShape.prototype.setImage = function(value) {
	if(value === this.imageUrl) {
		return;
	}

	this.imageUrl = value;
	this.image = new CanTkImage(value);
	
	return;
}


RShape.prototype.asIcon = function() {
	this.resize(36, 36);

	if(!this.isIcon) {
		this.setStyle(getIconShapeStyle());
	}

	this.isIcon = true;

	return;
}	

RShape.prototype.showProperty = function() {
	showGeneralPropertyDialog(this, this.textType, true, false);

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

	return;
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

