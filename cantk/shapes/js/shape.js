/*
 * File: shape.js
 * Brief: Base class of all shapes.
 * Web Site: http://www.drawapp8.com
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016  Holaverse Inc.
 * 
 */

function Shape() {
	return;
}

Shape.MODE_EDITING = 0;
Shape.MODE_RUNNING = 1;
Shape.MODE_PREVIEW = 2;

Shape.HIT_TEST_NONE = 0;
Shape.HIT_TEST_TL = 1;
Shape.HIT_TEST_TM = 2;
Shape.HIT_TEST_TR = 3;
Shape.HIT_TEST_ML = 4;
Shape.HIT_TEST_MR = 5;
Shape.HIT_TEST_BL = 6;
Shape.HIT_TEST_BM = 7;
Shape.HIT_TEST_BR = 8;
Shape.HIT_TEST_HANDLE = 9;
Shape.HIT_TEST_WORKAREA = 10;
Shape.HIT_TEST_ROTATION = 11;
Shape.HIT_TEST_MOVE = 12;
Shape.HIT_TEST_MAX = 13;
Shape.HIT_TEST_MM = -1;

Shape.ALIGN_LEFT = 1;
Shape.ALIGN_RIGHT = 2;
Shape.ALIGN_TOP = 3;
Shape.ALIGN_BOTTOM = 4;
Shape.ALIGN_CENTER = 5;
Shape.ALIGN_MIDDLE = 6;
Shape.ALIGN_TO_SAME_WIDTH = 7;
Shape.ALIGN_TO_SAME_HEIGHT = 8;
Shape.ALIGN_DIST_VER = 9;
Shape.ALIGN_DIST_HOR = 10;

Shape.STAT_CREATING_0 = 0;
Shape.STAT_CREATING_1 = 1;
Shape.STAT_CREATING_2 = 2;
Shape.STAT_NORMAL = 3;

Shape.TEXT_NONE = 0;
Shape.TEXT_INPUT = 1;
Shape.TEXT_TEXTAREA = 2;

Shape.EVT_POINTER_DOWN = 1;
Shape.EVT_POINTER_MOVE = 0;
Shape.EVT_POINTER_UP = -1;

Shape.prototype.initPanelShape = function() {
    return;
}

Shape.prototype.initIconShape = function() {
   return;
}

Shape.prototype.setNearRange = function(nearRange) {
	this.nearRange = nearRange;

	return this;
}

Shape.prototype.getNearRange = function() {
	return this.nearRange ? this.nearRange : 20;	
}

Shape.prototype.findNear = function(point) {
	return null;
}

Shape.prototype.getCreatingShape = function() {
	return this.view ? this.view.getCreatingShape() : null;
}

Shape.prototype.getTextCookie = function(point) {
	return 0;
}

Shape.isTransparentColor = function(color) {
	return !color || color === "rgba(0,0,0,0)";
}

Shape.prototype.isFillColorTransparent = function() {
	return Shape.isTransparentColor(this.style.fillColor);
}

Shape.prototype.isStrokeColorTransparent = function() {
	return Shape.isTransparentColor(this.style.lineColor);
}

Shape.prototype.isTextColorTransparent = function() {
	return Shape.isTransparentColor(this.style.textColor);
}

Shape.prototype.setParent = function(parentShape) {
	this.parentShape = parentShape;
	return this;
}

Shape.prototype.getParent = function(name) {
	if(name) {
		for(var iter = this.parentShape; iter != null; iter = iter.parentShape) {
			if(iter.name === name || iter.type === name) {
				return iter;
			}
		}
	}

	return name ? null : this.parentShape;
}

Shape.prototype.textEditable = function(point) {
	return true;
}

Shape.prototype.setInputType = function(inputType) {
	this.inputType = inputType;

	return this;
}

Shape.prototype.editText = function(point) {
	return;
}

Shape.prototype.exec = function(cmd) {
	if(this.app) {
		this.app.exec(cmd);
	}
	else {
		cmd.doit();
		delete cmd;
	}

	return;
}

Shape.prototype.setTextTitle = function(textTitle) {
	this.textTitle = textTitle;

	return this;
}
	
Shape.prototype.initShape = function(x, y, w, h, type) {
	this.w = w;
	this.h = h;
	this._x = x;
	this._y = y;
	this._left = x;
	this._top = y;
	this.type = type;
	this.text = "";
	this.app = null;
	this.view = null;
	this.rotation = 0;
	this.scaleX = 1;
	this.scaleY = 1;
	this.selected = false;
	this.parentShape = null;
	this.pointerDown = false;	
	this.userMovable = true;
	this.userResizable = true;
	this.state = Shape.STAT_NORMAL;
	this.lastPosition = {x:0, y:0};
	this.selectMarkPoint = {x:0, y:0};
	this.textType = Shape.TEXT_INPUT;
	this.setDefaultStyle();
	this.setTextAlignV("middle");
	this.setTextAlignH("center");
	this.hitTestResult = Shape.HIT_TEST_NONE;

	return;
}

Shape.prototype.setDefaultStyle = function() {
	this.style = new ShapeStyle();
	this.setStyle(Shape.getDefaultStyle());

	return this;
}

Shape.prototype.setState = function(state) {
	this.state = state;
	
	return this;
}

Shape.prototype.setTextType= function(textType) {
	this.textType = textType;
	
	return this;
}

Shape.prototype.isSelected = function() {
	return this.selected;
}

Shape.prototype.userRemovable = function() {
	return true;
}

Shape.prototype.intersectWithRect = function(rect) {
	var ret = false;
	var x = this.getX();
	var y = this.getY();
	var w = this.getWidth();
	var h = this.getHeight();

	var p1 = {x:x, y:y};
	var p2 = {x:x+w, y:y+h};
	var p3 = {x:x+w, y:y};
	var p4 = {x:x, y:y+h};

	return isPointInRect(p1, rect) || isPointInRect(p2, rect) 
		|| isPointInRect(p3, rect) || isPointInRect(p4, rect);
}


Shape.prototype.isThisInRect = function(rect) {
	var ret = false;
	var x = this.getX();
	var y = this.getY();
	var w = this.getWidth();
	var h = this.getHeight();
	
	if((x >= rect.x && x < (rect.x + rect.w))
		&& (y >= rect.y && y < (rect.y + rect.h))) {
		ret = true;
	}
	
	return ret;
}

Shape.prototype.isClicked = function() {
	if(this.view) {
		return this.view.isClicked();
	}

	return false;
}

Shape.prototype.isAltDown = function() {
	if(this.view) {
		return this.view.isAltDown();
	}

	return false;
}

Shape.prototype.isCtrlDown = function() {
	if(this.view) {
		return this.view.isCtrlDown();
	}

	return false;
}

Shape.prototype.onMoving = function() {
}

Shape.prototype.onMoved = function() {

}

Shape.prototype.onSized = function() {

}

Shape.prototype.onUserMoved = function(x, y) {

}

Shape.prototype.onUserResized = function() {

}

Shape.prototype.fixChildPosition = function(child) {
	var maxW = this.w;
	var maxH = this.h;
	var dx = child.left >= 0 ? child.left : 0;
	var dy = child.top >= 0 ? child.top : 0;

	if((dx + child.w) > maxW) {
		dx = maxW - child.w; 
	}

	if((dy + child.h) > maxH) {
		dy = maxH - child.h;
	}

	child.left = dx;
	child.top = dy;

	return;
}

Shape.prototype.fixPosition = function() {
	if(!this.parentShape) {
		return;
	}

	this.parentShape.fixChildPosition(this);

	return;
}

Shape.prototype.move = function(x, y) {
	if(this.left !== x || this.top !== y) {
		this.setLeftTop(x, y);

		if(!this.isIcon) {
			this.fixPosition();
			this.onMoved();
		}
	}

	return this;
}

Shape.prototype.moveDelta = function(dx, dy) {
	return this.move(this.left + dx, this.top + dy);
}

Shape.prototype.getWidth = function() {
	return this.w;
}

Shape.prototype.getHeight = function() {
	return this.h;
}

Shape.prototype.getPositionInScreen = function() {
	var pv = {x:0, y:0};
	var scale = this.getRealScale();
	var p = this.getPositionInView();
	
	if(this.view) {
		pv = this.view.getAbsPosition();
	}

	p.x = pv.x + p.x * scale;
	p.y = pv.y + p.y * scale;

	return p;
}

Shape.prototype.getRealScale = function() {
	return this.view ? this.view.getScale() : 1;
}

Shape.prototype.getAbsPosition = function() {
	var p = this.getPositionInView();

	if(this.view) {
		var pv = this.view.getAbsPosition();
		p.x = p.x + pv.x;
		p.y = p.y + pv.y;
	}

	return p;
}

Shape.prototype.getPositionInView = function() {
	var x = this.getX();
	var y = this.getY();
	var point = {x:0, y:0};
	var iter = this.parentShape;

	while(iter != null) {
		x += iter.left;
		y += iter.top;
		iter = iter.parentShape;
	}

	point.x = x;
	point.y = y;

	return point;
}


Shape.prototype.getXinView = function() {
	var x = this.getPositionInView().x; 

	return x;
}

Shape.prototype.getYinView = function() {
	var y = this.getPositionInView().y; 

	return y;
}

Shape.prototype.getX = function() {
	return this.x;
}

Shape.prototype.getY = function() {
	return this.y;
}

Shape.prototype.setX = function(x) {
	this.x = x;

	return this;
}

Shape.prototype.setY = function(y) {
	this.y = y;
	
	return this;
}

Shape.prototype.align = function(type, value) {
	return;
}

Shape.prototype.setRotatable = function(rotatable) {
	this.rotatable = rotatable;
	
	return this;
}

Shape.prototype.setScaleX = function(scaleX) {
	this.scaleX = scaleX;

	return this;
}

Shape.prototype.setScaleY = function(scaleY) {
	this.scaleY = scaleY;

	return this;
}

Shape.prototype.getScale = Shape.prototype.getScaleX = function() {
	return this.scaleX !== undefined ? this.scaleX : this.scale;
}

Shape.prototype.getScaleY = function() {
	return this.scaleY !== undefined ? this.scaleY : this.scale;
}

Shape.prototype.setScale = function(scaleX, scaleY) {
	this.scaleX = scaleX;
	this.scaleY = scaleY !== undefined ? scaleY : scaleX;

	return this;
}

Shape.prototype.getRotation = function() {
	return this.rotation;
}

Shape.prototype.setRotation = function(rotation) {
	this.rotation = rotation;
	
	return this;
}

Shape.prototype.getOpacity = function() {
	return this.opacity;
}

Shape.prototype.setOpacity = function(opacity) {
	this.opacity = Math.max(0, opacity);
	this.opacity = Math.min(1, this.opacity);

	return this;
}

Shape.prototype.setStyle = function(style) {
	this.style.copy(style);
	this.textNeedRelayout = true;
	
	return this;
}

Shape.prototype.getStyle = function() {
	return this.style;
}

Shape.prototype.setName = function(name) {
	this.name = name;

	return this;
}

Shape.prototype.getName = function() {
	return this.name;
}

Shape.prototype.getLocaleText = function(text) {
	return text;
}

Shape.prototype.getLocaleInputTips = function(text) {
	return dappGetText(text);
}
	
Shape.prototype.setNeedRelayoutText = function() {
	this.textNeedRelayout = true;

	return this;
}	

Shape.prototype.setTextAlignH = function(hTextAlign) {
	this.hTextAlign = hTextAlign;

	return this;
}

Shape.prototype.setTextAlignV = function(vTextAlign) {
	this.vTextAlign = vTextAlign;

	return this;
}

Shape.prototype.getTextAlignH = function() {
	var hTextAlign = this.hTextAlign ? this.hTextAlign : "left";

	return hTextAlign;
}

Shape.prototype.getTextAlignV = function() {
	var vTextAlign = this.vTextAlign ? this.vTextAlign : "top";

	return vTextAlign;
}

Shape.prototype.toText = function(value) {
	if(value !== null && value != undefined) {
		return value + "";
	}
	else {
		return "";
	}
}

Shape.prototype.setText = function(text) {
	this.text = this.toText(text);
	this.textNeedRelayout = true;
	
	return this;
}

Shape.prototype.setText2 = function(text) {
	this.text2 = text;
	
	return this;
}

Shape.prototype.setText3 = function(text) {
	this.text3 = text;
	
	return this;
}

Shape.prototype.getText = function() {
	return this.text;
}

Shape.prototype.getApp = function() {
	return this.app;
}

Shape.prototype.getView = function() {
	return this.view;
}

Shape.prototype.setApp = function(app) {
	this.app = app;
	
	return this;
}

Shape.prototype.setView = function(view) {
	this.view = view;
	
	return this;
}

Shape.prototype.redrawSelf = function() {
	if(this.view) {
		var scale = this.getRealScale();
		var p = this.getPositionInView();
		var rect = {x: p.x*scale, y:p.y*scale, w:this.w*scale, h:this.h*scale};

		this.view.redraw(rect);
	}
	
	return;
}

Shape.prototype.postRedraw = function(rect) {
	if(this.view) {
		this.view.postRedraw(rect);
	}
	
	return;
}

Shape.prototype.beforePropertyChanged = function() {
	return;
}

Shape.prototype.afterPropertyChanged = function() {
	return;
}

Shape.prototype.showProperty = function() {
	return;
}

Shape.prototype.setSelectedMarkSize = function(selectedMarkSize) {
	this.selectedMarkSize = selectedMarkSize;

	return;
}

Shape.prototype.paint = function(canvas) {
	this.paintSelf(canvas);

	if(this.near) {
		var p = this.near.point;
		var r = this.getNearRange();

		canvas.beginPath();
		canvas.arc(p.x, p.y, 4, 0, Math.PI * 2);
		canvas.fillStyle = "Red";
		canvas.fill();

		canvas.beginPath();
		canvas.lineWidth = 2;
		canvas.arc(p.x, p.y, r, 0, Math.PI * 2);
		canvas.strokeStyle = "Black";
		canvas.stroke();
	}

	return;
}

Shape.prototype.paintSelf = function(canvas) {
	return;
}

Shape.prototype.setSelected = function(selected) {
	if(selected) {
		this.selectedTime = Date.now();
	}

	if(this.selected === selected) {
		return;
	}

	this.selected = selected;
	if(this.view && this.view.onShapeSelected) {
		this.view.onShapeSelected(this);
	}

	return;
}

Shape.prototype.isVisible = function() {
	return true;
}

Shape.prototype.findNearPoint = function(rect) {
	var p = null;

	for(var i = 0; i < 100; i++) {
		p = this.getNearPoint(i);

		if(!p) {
			break;
		}
		
		if(isPointInRect(p, rect)) {
			var near = {shape:this};
			near.nearPointIndex = i;
			near.point = {x:p.x, y:p.y};

			return near;
		}
	}

	return null;
}

Shape.prototype.dup = function() {
	var g = ShapeFactoryGet().createShape(this.type, C_CREATE_FOR_PROGRAM);

	g.fromJson(this.toJson());
	g.state = Shape.STAT_NORMAL;

	return g;
}


Shape.prototype.hitTest = function(point) {
	return Shape.HIT_TEST_NONE;
}

Shape.prototype.showProperty = function() {
	return;
}

Shape.prototype.onLongPress = function(point) {
	return;
}

Shape.prototype.onGesture = function(gesture) {
}

Shape.prototype.onDoubleClick = function(point) {
	return true;
}

Shape.prototype.onPointerDown = function(point) {
	this.pointerDown = true;
	this.hitTestResult = this.hitTest(point);

	if(!this.hitTestResult) {
		return false;
	}
	
	this.setSelected(true);
	this.lastPosition.x = point.x;
	this.lastPosition.y = point.y;
	this.handlePointerEvent(point, Shape.EVT_POINTER_DOWN);
	
	return true;
}

Shape.prototype.handlePointerEvent = function(point, evt) {
	return false;
}

Shape.prototype.onPointerMove = function(point) {
	if(this.hitTestResult) {
		this.handlePointerEvent(point, Shape.EVT_POINTER_MOVE);
		return true;
	}
	
	return false;
}

Shape.prototype.onPointerUp = function(point) {
	if(this.hitTestResult) {
		this.handlePointerEvent(point, Shape.EVT_POINTER_UP);
		this.hitTestResult = Shape.HIT_TEST_NONE;
		
		return true;
	}
	this.pointerDown = false;
	
	return false;
}

Shape.prototype.onKeyDown = function(code) {
	console.log("onKeyUp Widget: code=" + code)
	return;
}

Shape.prototype.onKeyUp = function(code) {
	console.log("onKeyUp Widget: code=" + code)
	return;
}

Shape.prototype.canBeComponent = function() {
	return false;
}

Shape.prototype.shouldShowContextMenu = function() {
	return true;
}

Shape.prototype.toJson = function() {
	return null;
}

Shape.prototype.fromJson = function(js) {
	return this;
}

Shape.prototype.afterApplyFormat = function() {
	return;
}

Shape.prototype.applyFormat = function(js) {
	if(!js) {
		return;
	}

	for(var key in js) {
		var value = js[key];
		var type = typeof value;
		if(type === "function" || type === "object" || type === "undefined") {
			continue;
		}

		if(key == "type") {
			continue;
		}

		if(type === "number" || type === "string" || type === "boolean") {
			this[key] = value;
		}
	}

	if(js.images) {
		for(var key in js.images) {
			var value = js.images[key];
			
			if(key === "display") {
				this.images[key] = value;
			}
			else {
				var src = value.getImageSrc();
				this.setImage(key, src);
			}
		}
	}

	if(js.style) {
		this.style.fromJson(js.style);
	}
	
	if(js.animations) {
		this.animations = JSON.parse(js.animations);
		this.defaultAnimationName = js.defaultAnimationName;
	}

	this.afterApplyFormat();
	this.textNeedRelayout = true;

	return;
}

Shape.prototype.setUserMovable = function(value) {
	this.userMovable = value;

	return this;
}

Shape.prototype.setUserResizable = function(value) {
	this.userResizable = value;

	return this;
}

Shape.prototype.isUserMovable = function() {
	return this.userMovable && !this.isLocked();
}

Shape.prototype.isUserResizable = function() {
	return this.userResizable;
}

function splitText(text) {
	text = text.replaceAll("\r\n", "\n");
	text = text.replaceAll("\r", "\n");

	return text.split("\n--\n");
}

Shape.onRestacked = function(shapes, shape) {
}

function restackShapeInArray(shapes, offset) {
	var n = 0;
	var pos = 0;
	var s = null;
	var new_pos = 0;
	var selectedShape = null;

	for(var i = 0; i < shapes.length; i++) {
		s = shapes[i];
		if(s.selected) {
			n++;
			if(!selectedShape) {
				selectedShape = s;
				pos = i;
			}
		}
	}

	if(n > 1 || !selectedShape) {
		return;
	}

	new_pos = pos + offset;
	if(new_pos < 0 || new_pos >= shapes.length) {
		return;
	}

	shapes[pos] = shapes[new_pos];
	shapes[new_pos] = selectedShape;
	Shape.onRestacked(shapes, selectedShape);

	return;
}

function getParentShapeOfShape(shape, view) {
	var p = shape.parentShape ? shape.parentShape : shape.container;

	if(!p) {
		p = view;
	}

	return p;
}

function getParentShapeOfShapes(shapes) {
	if(!shapes || shapes.length === 0) {
		return null;
	}

	var firstShape = shapes[0];
	var parentShape = firstShape.parentShape;

	for(var i = 0; i < shapes.length; i++) {
		var shape = shapes[i];

		if(shape.parentShape != parentShape) {
			return null;
		}
	}

	return parentShape ? parentShape : firstShape.view;
}

Shape.prototype.getTextColor = function(canvas) {
	return this.style.textColor;
}

Shape.prototype.getBgColor = function(canvas) {
	return this.style.fillColor;
}

Shape.prototype.getLineColor = function(canvas) {
	return this.style.lineColor;
}

Shape.prototype.defaultDrawText = function(canvas) {
	var width = this.getWidth(true);
	var text = this.getLocaleText(this.text);

	if(!text || this.editing) {
		return;
	}
	
	canvas.save();
	canvas.beginPath();
	canvas.lineWidth = 1;
	canvas.font = this.style.getFont();
	canvas.fillStyle = this.getTextColor();
	canvas.strokeStyle = this.getLineColor();

	var lines = text.split(/\n/);
	if(lines.length < 2) {
		if(this.singleLineMode || canvas.measureText(text).width < 1.2 * width) {
			this.draw1LText(canvas);
		}
		else {
			this.drawMLText(canvas);
		}
	}
	else {
		this.drawMLText(canvas);
	}
	canvas.restore();

	return;
}

Shape.prototype.draw1LText = function(canvas, drawAll) {
	var text = this.getLocaleText(this.text);

	if(!text || this.editing) {
		return;
	}

    if(!this.lines){
        this.layoutText(canvas);
    }
	
    if(!this.lines) {
		return;
	}
    text = this.lines[0];

	var x = 0;
	var y = 0;
	var hMargin = this.hMargin;
	var width = this.getWidth(true);
	var hTextAlign = this.getTextAlignH();
	var vTextAlign = this.getTextAlignV();
	var textU = this.style.textU;
	var fontSize = this.style.fontSize;
	var textWidth = canvas.measureText(text).width;

	var lx = 0;
	var ly = 0;
	var lw = Math.min(textWidth, width);

	switch(vTextAlign) {
		case "middle": {
			y = this.h >> 1;
			canvas.textBaseline = "middle";
			if(textU) {
				ly = Math.floor(y + fontSize * 0.8);
			}
			break;
		}
		case "bottom": {
			y = this.h - this.vMargin;
			canvas.textBaseline = "bottom";
			if(textU) {
				ly = y;
			}
			break;
		}
		default: {
			y = this.vMargin;
			canvas.textBaseline = "top";
			if(textU) {
				ly = Math.floor(y + fontSize * 1.5);
			}
			break;
		}
	}

	switch(hTextAlign) {
		case "center": {
			x = this.w >> 1;
			canvas.textAlign = "center";
			if(textU) {
				lx = Math.max((this.w - textWidth) >> 1, 0);
			}
			break;
		}
		case "right": {
			x = this.w - this.hMargin;
			canvas.textAlign = "right";
			if(textU) {
				lx = Math.max((this.w - textWidth - hMargin), 0);
			}
			break;
		}
		default: {
			x = this.hMargin;
			canvas.textAlign = "left";
			if(textU) {
				lx = x;
			}
			break;
		}
	}
	
	if(textU) {
		canvas.moveTo(lx, ly);
		canvas.lineTo(lx + lw, ly);
		canvas.stroke();
	}

	canvas.fillText(text, x, y, width);
	
	return textWidth;
}

Shape.prototype.drawMLText = function(canvas, drawAll) {
	if(!this.lines){
        this.layoutText(canvas);
    }

	if(!this.lines) {
		return;
	}

	var x = 0;
	var y = 0;
	var lx = 0;
	var ly = 0;
	var lw = 0;
	var vMargin = this.vMargin;
	var hMargin = this.hMargin;
	var width = this.getWidth(true);
	var hTextAlign = this.getTextAlignH();
	var vTextAlign = this.getTextAlignV();

	var textU = this.style.textU;
	var fontSize = this.style.fontSize;
	var textLineHeight = this.getTextLineHeight();
	var textHeight = this.getTextHeight();

	canvas.textBaseline = "top";
	switch(vTextAlign) {
		case "middle": {
			y = (this.h - textHeight) >> 1;
			break;
		}
		case "bottom": {
			y = this.h - textHeight - vMargin;
			break;
		}
		default: {
			y = vMargin;
			break;
		}
	}

	y = y < 0 ? 0: y;

	for(var i = 0; i < this.lines.length; i++) {
		var str = this.lines[i];
		if(!str || str == " ") {
			y += fontSize;
			continue;
		}
		
		if((y + textLineHeight) >= this.h && !drawAll) {
			break;
		}

		var textWidth = canvas.measureText(str).width;

		lw = Math.min(textWidth, width);
		ly = Math.floor(y + (fontSize + textLineHeight)/2);

		switch(hTextAlign) {
			case "center": {
				x = this.w >> 1;
				canvas.textAlign = "center";
				if(textU) {
					lx = Math.max((this.w - textWidth) >> 1, 0);
				}
				break;
			}
			case "right": {
				x = this.w - hMargin;
				canvas.textAlign = "right";
				if(textU) {
					lx = Math.max((this.w - textWidth - hMargin), 0);
				}
				break;
			}
			default: {
				x = hMargin;
				canvas.textAlign = "left";
				if(textU) {
					lx = x;
				}
				break;
			}
		}

		if(textU) {
			canvas.moveTo(lx, ly);
			canvas.lineTo(lx + lw, ly);
			canvas.stroke();
		}
		canvas.fillText(str, x, y, width);

		y += textLineHeight;
	}

	return;
}

Shape.prototype.getTextHeight = function() {
	var h = 0;
	var fontSize = this.style.fontSize;
	var lineHeight = this.getTextLineHeight();

	if(!this.text || !this.lines) {
		return lineHeight;
	}

	for(var i = 0; i < this.lines.length; i++) {
		var str = this.lines[i];
		if(!str || str == " ") {
			h += fontSize;
		}
		else {
			h += lineHeight;
		}
	}

	return h;
}

Shape.prototype.getTextLineHeight = function() {
	return Math.floor(this.style.fontSize * 1.5);
}

Shape.prototype.setTextShadow = function(textShadow) {
	this.textShadow = textShadow;

	return this;
}

Shape.prototype.isValid = function() {
	return !this.isInvalid;
}

Shape.prototype.canCopy = function() {
	return true;
}

Shape.prototype.onDestroy = function() {
}

Shape.prototype.onRemoved = function(parent) {
}

Shape.prototype.detachFromParent = function() {
}

Shape.prototype.destroy = function() {
	this.detachFromParent();

	if(this.container) {
		this.container = null;
	}

	this.app = null;
	this.view = null;

	if(this.children) {
		this.children.clear(true);
		this.children = null;
	}

	if(this.images) {
		this.images = null;
	}

	if(this.events) {
		this.events = null;
	}

	if(this.style) {
		this.style = null;
	}

	this.onDestroy();
	this.isInvalid = true;
	this.jsonData = null;

	return;
}

Shape.prototype.isInDesignMode = function() {
	return false;
}

Shape.iconShapeStyle = null;
Shape.getIconShapeStyle = function() {
	if(!Shape.iconShapeStyle) {
		Shape.iconShapeStyle = ShapeStyle.create();
		Shape.iconShapeStyle.setLineWidth(1);
		Shape.iconShapeStyle.setFontSize(8);
		Shape.iconShapeStyle.setLineColor("Black");
		Shape.iconShapeStyle.setFillColor("White");
		Shape.iconShapeStyle.setTextColor("Black");
	}

	return Shape.iconShapeStyle;
}

Shape.defaultStyle = null;
Shape.getDefaultStyle = function() {
	if(!Shape.defaultStyle) {	
		Shape.defaultStyle = ShapeStyle.create();
	}

	return Shape.defaultStyle;
}

