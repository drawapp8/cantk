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

RShape.prototype = new Shape();

RShape.prototype.MIN_SIZE = 10;
RShape.prototype.isRect = true;

RShape.prototype.getX = function() {
	if(this.anchor) {
		return this._x;
	}
	else {
		return this._left;
	}
}

RShape.prototype.getY = function() {
	if(this.anchor) {
		return this._y;
	}
	else {
		return this._top;
	}
}

RShape.prototype.setX = function(x) {
	return this.setPosition(x, this.y);
}

RShape.prototype.setY = function(y) {
	return this.setPosition(this.x, y);
}

RShape.prototype.getLeft = function() {
	return this._left;
}

RShape.prototype.getTop = function() {
	return this._top;
}

RShape.prototype.setLeft = function(left) {
	this._left = left;

	return this;
}

RShape.prototype.setTop = function(top) {
	this._top = top;
	
	return this;
}

RShape.prototype.setLeftTop = function(left, top) {
	this._left = left;
	this._top = top;

	return this;
}

RShape.prototype.setPivot = function(x, y) {
	this.pivotX = x;
	this.pivotY = y;

	return this;
}

RShape.prototype.getPivot = function() {
	return {x:this.pivotX, y:this.pivotY};
}

RShape.prototype.onPositionChanged = function() {
}

RShape.prototype.getAnchorX = function() {
	return this.getAnchor().x;
}

RShape.prototype.getAnchorY = function() {
	return this.getAnchor().y;
}

RShape.prototype.setAnchorX = function(x) {
	return this.setAnchor(x, this.getAnchorY());
}

RShape.prototype.setAnchorY = function(y) {
	return this.setAnchor(this.getAnchorX(), y);
}

RShape.prototype.setAnchor = function(x, y) {
	var anchor = this.getAnchor();

	anchor.x = x;
	anchor.y = y;

	this.pivotX = x;
	this.pivotY = y;

	this._x = this._left + (this.w * x);
	this._y = this._top + (this.h * y);

	return this;
}

RShape.prototype.getAnchor = function() {
	if(!this.anchor) {
		this.anchor = {x:0, y:0};
		this._x = this._left;
		this._y = this._top;
	}

	return this.anchor;
}

RShape.prototype.getPosition = function() {
	var p = {};

	if(!this.anchor) {
		p.x = this._left;
		p.y = this._top;
	}
	else {
		p.x = this._x;
		p.y = this._y;
	}

	return p;
}

RShape.prototype.setPosition = function(x, y) {
	var changed = (this._x !== x || this._y !== y);

	this._x = x;
	this._y = y;

	if(this.anchor) {
		var left = this._x - this.w * this.anchor.x;
		var top  = this._y - this.h * this.anchor.y;
		this.setLeftTop(left, top);
	}
	else {
		this.setLeftTop(this._x, this._y);
	}

	if(changed) {
		this.onPositionChanged();
	}

	return this;
}

RShape.prototype.realResize = RShape.prototype.setSize = function(w, h) {
	if(this.w !== w || this.h !== h) {
		var ww = Math.max(Math.round(w), 4);
		var hh = Math.max(Math.round(h), 4);

		if(this.anchor) {
			this._left = this._x - ww * this.anchor.x;
			this._top = this._y - hh * this.anchor.y;
		}
		this.w = ww;
		this.h = hh;

		this.textNeedRelayout = true;
	}
	
	return this;
}


RShape.prototype.initRShape = function(x, y, w, h, type) {
	this.initShape(x, y, w, h, type);

	this.w = w;
	this.h = w;
	this.opacity = 1;
	this.hMargin = 0;
	this.vMargin = 0;
	this.rotation = 0;
	this.defWidth = w;
	this.defHeight = w;
	this.enable = true;
	this.visible = true;
	this.events = {};
	this.pivotX = 0.5;
	this.pivotY = 0.5;
	this.text = "";
	this.pointerDown = false;
	this.lastPosition = {x:0, y:0};
	this.pointerDownPosition = {x:0, y:0};
	this.setScale(1, 1);
	if(w === 0 || h === 0) {
		this.w = this.MIN_SIZE;
		this.h = this.MIN_SIZE;	
		this.setState(Shape.STAT_CREATING_0);
	}

	return;
}

RShape.prototype.onPointerDown = function(point) {
	if(!this.enable && !this.isInDesignMode()) {
		console.log(this.name + " is disable, ignore pointer events.");
		return;
	}

	this.pointerDownPosition.x = point.x;
	this.pointerDownPosition.y = point.y;
	this.postRedraw();

	return this.onPointerDownNormal(point);
}

RShape.prototype.onPointerMove = function(point) {
	if(!this.enable && !this.isInDesignMode()) {
		console.log("Ignore pointer event because this.enable is false.");
		return;
	}

	if(this.isLocked()) {
		return false;
	}

	return this.onPointerMoveNormal(point);
}

RShape.prototype.onPointerUp = function(point) {
	if(!this.enable && !this.isInDesignMode()) {
		console.log("Ignore pointer event because this.enable is false.");
		return;
	}

	var ret = this.onPointerUpNormal(point);
	this.pointerDown = false;
	this.postRedraw();

	return ret;
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

RShape.prototype.resizeDelta = function(dw, dh) {
	this.resize(this.w + dw, this.h + dh);

	return;
}

RShape.prototype.resize = function(w, h) {
	if(this.w !== w || this.h !== h) {
		this.setSize(w, h);

		if(!this.isIcon) {
			this.onSized();
			this.fixSize();
		}
	}

	return this;
}

RShape.prototype.translate = function(canvas) {
	canvas.translate(this._left, this._top);

	return;
}

RShape.prototype.setClipRect = function(x, y, w, h) {
	if(arguments.length > 3) {
		var r = {};
		r.x = x;
		r.y = y;
		r.w = w;
		r.h = h;
		this.clipInfo = r;
	}
	else {
		this.clipInfo = null;
	}

	return this;
}

RShape.prototype.setClipCircle = function(x, y, r) {
	if(arguments.length > 2) {
		circle = {};
		circle.x = x;
		circle.y = y;
		circle.r = r;
		this.clipInfo = circle;
	}
	else {
		this.clipInfo = null;
	}

	return this;
}

RShape.prototype.onClip = function(canvas) {
	if(this.clipInfo) {
		var info = this.clipInfo;

		canvas.beginPath();
		if(info.r) {
			canvas.arc(info.x, info.y, info.r, 0, Math.PI * 2);
		}
		else {
			canvas.rect(info.x, info.y, info.w, info.h);
		}
		canvas.clip();
		canvas.beginPath();
	}
}

RShape.prototype.applyScale = function(canvas) {
	var scaleX = this.getScaleX();
	var scaleY = this.getScaleY();

	var px = this.w * this.pivotX;
	var py = this.h * this.pivotY;
	canvas.translate(px, py);
	canvas.scale(scaleX, scaleY);
	canvas.translate(-px, -py);
}

RShape.prototype.applyRotation = function(canvas) {
	if(Math.abs(this.rotation) > 0.0001) {
		var px = this.w * this.pivotX;
		var py = this.h * this.pivotY
		canvas.translate(px, py);
		canvas.rotate(this.rotation);
		canvas.translate(-px, -py);
	}
}

RShape.prototype.applyTransform = function(canvas) {
	canvas.globalAlpha *=  this.opacity;

	if(this.offsetX) {
		canvas.translate(this.offsetX, 0);
	}

	if(this.offsetY) {
		canvas.translate(0, this.offsetY);
	}

	this.applyRotation(canvas);
	this.applyScale(canvas);

	return;
}

RShape.prototype.isPointIn = function(canvas, point) {
	return isPointInRect(point, this);
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

RShape.prototype.setWidth = function(width) {
	return this.setSize(width, this.h);
}

RShape.prototype.setHeight = function(height) {
	return this.setSize(this.w, height);
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

RShape.prototype.paintSelf = function(canvas) {
	return;
}

RShape.prototype.getCanvasContext2D = function() {
	return this.view.getCanvas2D();
}

RShape.prototype.getHitTestCanavs = function() {
	var canvas = this.view.getCanvas2D();
	if(CantkRT.isCantkRTCordova()) {
		return canvas.getCanvasRenderingContext2D("2d");
	}
	else {
		return canvas;
	}
}

RShape.prototype.hitTest = function(point) {
	var ret = Shape.HIT_TEST_NONE;

	if(!this.enable && !this.isInDesignMode()) {
		return ret;
	}

	var me = this;
	var canvas = this.getHitTestCanavs();

	function applyTransform(canvas) {
		me.translate(canvas);
		me.applyTransform(canvas);
	}
	
	if(this.isPointInMatrix({x: 0, y: 0, w: this.w, h: this.h}, point, applyTransform)) {
		ret = Shape.HIT_TEST_MM;
	}

	return ret;
}

//lock is used only in IDE
RShape.prototype.isLocked = function() {
	return false;
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
			this.setLeft(x);
		}
		if(y || y === 0) {
			this.setTop(y);
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

RShape.prototype.onUserMoving = function() {
}

RShape.prototype.onUserResizing = function() {
}

RShape.prototype.onUserRotating = function() {
}

RShape.prototype.handlePointerEvent = function(point, type) {
	if(type === Shape.EVT_POINTER_DOWN) {
		this.saveLeft = this.getLeft();
		this.saveTop = this.getTop();;
		this.saveW = this.w;
		this.saveH = this.h;
		this.saveRotation = this.rotation;

		return;
	}
	
	var saveW = this.saveW;
	var saveH = this.saveH;
	var dx = point.x - this.pointerDownPosition.x;
	var dy = point.y - this.pointerDownPosition.y;
	
	var newDLeft = 0;
	var newDTop = 0;
	var newW = saveW;
	var newH = saveH;
	switch(this.hitTestResult) {
		case Shape.HIT_TEST_TL: {
			newDLeft = dx;
			newDTop = dy;
			newW = saveW - dx;
			newH = saveH - dy;
			break;
		}
		case Shape.HIT_TEST_TM: {
			newDTop = dy;
			newH = saveH - dy;	
			break;
		}			
		case Shape.HIT_TEST_TR: {
			newDLeft = 0;
			newDTop = dy;
			newW = saveW + dx;
			newH = saveH - dy;
			break;
		}
		case Shape.HIT_TEST_ML: {
			newDLeft = dx;
			newW = saveW - dx;		
			break;
		}			
		case Shape.HIT_TEST_MR: {
			newW = saveW  + dx;				
			break;
		}				
		case Shape.HIT_TEST_BL: {
			newDLeft = dx;
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
			newDLeft = dx;
			newDTop = dy;
			break;
		}
		case Shape.HIT_TEST_ROTATION: {
			var cx = (this.w >> 1) + this.getLeft();
			var cy = (this.h >> 1) + this.getTop();
			var angle = Math.lineAngle({x:cx, y:cy}, point) + Math.PI * 0.5;

			if(angle > Math.PI * 2) {
				angle = angle - Math.PI * 2;
			}
			this.setRotation(angle);
			this.onUserRotating();
			if(type === Shape.EVT_POINTER_UP) {
				var rotation = this.rotation;
				this.rotation = this.saveRotation;
				this.exec(AttributeCommand.create(this, "rotation", null, rotation));
			}
			break;
		}
		default:break;
	}	
	
	if(type === Shape.EVT_POINTER_UP) {
		if(!this.isUserMovable()) {
			this.setLeftTop(this.saveLeft, this.saveTop);
		}

		if(!this.isUserResizable()) {
			this.w = saveW;
			this.h = saveH;
		}
		
		var w = this.w;
		var h = this.h;
		var left = this.getLeft();
		var top = this.getTop();

		if(left !== this.saveLeft || top !== this.saveTop || w !== saveW || h !== saveH) {
			this.w = saveW;
			this.h = saveH;
			this.setLeftTop(this.saveLeft, this.saveTop);

			left = (left === this.saveLeft) ? null : Math.round(left);
			top = (top === this.saveTop) ? null : Math.round(top);
			w = (w === saveW) ? null : Math.round(w);
			h = (h === saveH) ? null : Math.round(h);

			this.execMoveResize(left, top, w, h);
			this.onUserMoved();
			this.onUserResized();
		}
	}
	else {
		if(newDLeft || newDTop) {
			if(this.isUserMovable()) {
				this.setLeftTop(Math.round(this.saveLeft + newDLeft), Math.round(this.saveTop + newDTop));
				this.onUserMoving();
			}
		}
		
		if(saveW !== newW || saveH !== newH) {
			if(this.isUserResizable()) {
				this.w = Math.max(Math.round(newW), this.MIN_SIZE);
				this.h = Math.max(Math.round(newH), this.MIN_SIZE);

				this.onUserResizing();
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

RShape.prototype.toJson = function() {
	var o = {};

	return this.doToJson(o);
}

RShape.saveProps =  ["type", "name", "uid", "z", "w", "h", "pivotX", "pivotY", "rotation", "opacity", "hMargin", "vMargin", "scaleX", "scaleY", "spacer", "roundRadius", "runtimeVisible", "enable", "visible", "text", "iconVMargin", "iconHMargin", "locked"];

RShape.prototype.propsToJson = function(o, props) {
	var n = props.length;
	for(var i = 0; i < n; i++) {
		var key = props[i];
		var value = this[key];
		if(value !== undefined) {
			o[key] = value;
		}
	}

	return this;
}

RShape.prototype.propsFromJson = function(js, props) {
	var n = props.length;
	for(var i = 0; i < n; i++) {
		var key = props[i];
		var value = js[key];
		if(value !== undefined) {
			this[key] = value;
		}
	}

	return this;
}

RShape.prototype.doToJson = function(o) {
	this.propsToJson(o, RShape.saveProps);

	o.x = this.left;
	o.y = this.top;
	o.style = this.style.toJson();
	
	return o;
}

RShape.prototype.onFromJsonDone = function(js) {
}

RShape.prototype.fromJson = function(js) {
	this.isUnpacking = true;
	this.doFromJson(js);
	this.onFromJsonDone(js);
	this.isUnpacking = false;

	return this;
}

RShape.prototype.doFromJson = function(js) {
	this.textNeedRelayout = true;
	this.state = Shape.STAT_NORMAL;
	this.propsFromJson(js, RShape.saveProps);

	if(js.x !== undefined) {
		this.left = js.x;
	}
	if(js.y !== undefined) {
		this.top = js.y;
	}

    if(js.docURL !== undefined && js.docURL.length > 0) {
        this.docURL = js.docURL;
    }

	this.setText(js.text);
	this.setEnable(js.enable);
	this.setVisible(js.visible !== false);
	this.style.fromJson(js.style);

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
	this.setSize(36, 36);

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

Object.defineProperty(RShape.prototype, "x", {
	get: function () {
		return this.getX();
	},
	set: function (value) {
		this.setX(value);
	},
	enumerable: true,
	configurable: true
});

Object.defineProperty(RShape.prototype, "y", {
	get: function () {
		return this.getY();
	},
	set: function (value) {
		this.setY(value);
	},
	enumerable: true,
	configurable: true
});

Object.defineProperty(RShape.prototype, "left", {
	get: function () {
		return this.getLeft();
	},
	set: function (value) {
		this.setLeft(value);
	},
	enumerable: true,
	configurable: true
});

Object.defineProperty(RShape.prototype, "top", {
	get: function () {
		return this.getTop();
	},
	set: function (value) {
		this.setTop(value);
	},
	enumerable: true,
	configurable: true
});

Object.defineProperty(RShape.prototype, "width", {
	get: function () {
		return this.getWidth();
	},
	set: function (value) {
		this.setWidth(value);
	},
	enumerable: true,
	configurable: true
});

Object.defineProperty(RShape.prototype, "height", {
	get: function () {
		return this.getHeight();
	},
	set: function (value) {
		this.setHeight(value);
	},
	enumerable: true,
	configurable: true
});

Object.defineProperty(RShape.prototype, "anchorX", {
	get: function () {
		return this.getAnchorX();
	},
	set: function (value) {
		this.setAnchorX(value);
	},
	enumerable: true,
	configurable: true
});

Object.defineProperty(RShape.prototype, "anchorY", {
	get: function () {
		return this.getAnchorY();
	},
	set: function (value) {
		this.setAnchorY(value);
	},
	enumerable: true,
	configurable: true
});


function RShapeInit(g, type) {
	g.initRShape(0, 0, 40, 40, type);

	return g;
}

