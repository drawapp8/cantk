var gCantkBuildDate = "2016年 06月 30日 星期四 18:16:48 CST";console.log("cantk build date: " + gCantkBuildDate);
if(!window.CanTK) {
	window.CanTK = {};
}

window.CanTK.config = {
	logoImageSrc : null,
	progressBarBgSrc : null,
	progressBarFgSrc : null
};
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

/*
 * File: shape_style.js
 * Brief: shape style
 * Web Site: http://www.drawapp8.com
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016  Holaverse Inc.
 * 
 */
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
	
	font = font + this.fontSize + "pt \"" + this.fontFamily + "\"";

	return font;
}

ShapeStyle.prototype.setLineWidth = function(value) {
	this.lineWidth = value > 0 ? value : 1;

	return;
}

ShapeStyle.prototype.setLineColor = function(value) {
	this.lineColor = value;

	return;
}

ShapeStyle.prototype.setFillColor = function(value) {
	this.fillColor = value;

	return;
}

ShapeStyle.prototype.setTextColor = function(value) {
	this.textColor = value;

	return;
}

ShapeStyle.prototype.setFontSize = function(value) {
	var fontSize = Math.max(value, 6);

	this.fontSize = fontSize;

	return;
}

ShapeStyle.prototype.setFontFamily = function(fontFamily) {
	this.fontFamily = fontFamily ? fontFamily : "serif";

	return;
}

ShapeStyle.prototype.setTextB = function(value) {
	this.textB = value;

	return;
}

ShapeStyle.prototype.setTextU = function(value) {
	this.textU = value;

	return;
}

ShapeStyle.prototype.setTextI = function(value) {
	this.textI = value;

	return;
}

ShapeStyle.prototype.getStrokeStyle = function(canvas) {
	return this.strokeColor;
}

ShapeStyle.prototype.copy = function(other) {
	var js = other.toJson();

	this.fromJson(js);

	return ;
}

ShapeStyle.prototype.toJson = function() {
	var o = {};

	for(var key in this) {
		var value = this[key];
		if(typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
			o[key] = value;
		}
	}

	return o;
}

ShapeStyle.prototype.fromJson = function(js) {
	for(var key in js) {
		var value = js[key];
		if(key.length < 4) continue;
		if(typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
			this[key] = value;
		}
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

ShapeStyle.createFromJson = function(js) {
	var style = new ShapeStyle();

	style.fromJson(js);

	return style;
}

ShapeStyle.create = function() {
	return new ShapeStyle();
}

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

/*
 * File: shape_factory.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: register all built-in shapes.
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

var C_CREATE_FOR_USER = 0;
var C_CREATE_FOR_ICON = 1;
var C_CREATE_FOR_PROGRAM = 2;

function ShapeCreator(type, name, icon, visible) {
	this.type = type;
	this.icon = icon;
	this.name = name;
	this.visible = visible;

	this.isVisibleToUser = function() {
		return this.visible;
	}
	
	this.getID = function() {
		return this.type;
	}
	
	this.getIcon = function() {
		return this.icon;
	}
	
	this.getName = function() {
		return this.name;
	}

	this.createIconShape = function() {
		if(!this.iconShape) {
			this.iconShape = this.createShape(C_CREATE_FOR_ICON);
            this.iconShape.initIconShape();
		}
	
		return this.iconShape;
	}
	
	this.createShape = function(createReason) {
		return null;
	}
	
	return;
}

function ShapeFactory() {
	this.defaultCategory = null;
	this.recentUsed = [];
	this.creators = [];
	this.categories = {};
	this.categoryNames = [];
	this.diagramTypes = [];
	this.listeners = [];

	ShapeFactory.CATEGORY_RECENT_USED = "Recent Used";
	ShapeFactory.CATEGORY_USER_COMPONENTS = "User Component";
    ShapeFactory.CATEGORY_USER = "User";
    ShapeFactory.CATEGORY_GAME = "Game";
    ShapeFactory.CATEGORY_ORGANIZATION = "Organization";

	this.setDefaultCategory = function(defaultCategory) {
		this.defaultCategory = defaultCategory;

		return;
	}

	this.getDiagramTypes = function() {
		return this.diagramTypes;
	}

	this.addDiagramType = function(type, defaultCategory) {
		var obj = {name:type, defaultCategory:defaultCategory};

		this.diagramTypes.push(obj);

		return;
	}

	this.removeCategoryName = function(name) {
		this.categoryNames.remove(name);

		return;
	}

	this.removeShapeCreator = function(type, category) {
		var creator = this.find(type);
		var categoryCreators = this.categories[category];
		if(creator) {
			this.creators.remove(creator);
			if(categoryCreators) {
				categoryCreators.remove(creator);
				this.notifyChanged("remove", category, creator);
			}
		}

		return;
	}

	this.isPlacehodler = function(category) {
		return category === "---";
	}
	
	this.isUserComponents = function(category) {
		return category === ShapeFactory.CATEGORY_USER_COMPONENTS;
	}

	this.addPlaceholder = function() {
		this.categoryNames.push("---");

		return;
	}

	this.loadRecentUsedShapeCreators = function() {
		var str = WebStorage.get("recentUsed");
		var types = str ? JSON.parse(str) : [];

		for(var i = 0; i < types.length; i++) {
			var type = types[i];
			var creator = this.find(type);
			if(creator) {
				this.addShapeCreator(creator, ShapeFactory.CATEGORY_RECENT_USED);
				this.recentUsed.push(type);
			}
		}

		return;
	}

	this.addRecentUsedShapeCreator = function(type) {
		var creator = this.find(type);
		if(creator) {
			this.recentUsed.remove(type);
			this.recentUsed.push(type);

			if(this.recentUsed.length > 10) {
				this.recentUsed.shift();
			}
			WebStorage.set("recentUsed", JSON.stringify(this.recentUsed));

			this.addShapeCreator(creator, ShapeFactory.CATEGORY_RECENT_USED);
		}
	}

	this.addShapeCreator = function(creator, category) {
		this.notifyChanged("add", category, creator);

		if(category != ShapeFactory.CATEGORY_RECENT_USED) {
			this.creators.push(creator);
		}

		if(category) {
			if(!this.defaultCategory) {
				this.setDefaultCategory(category);
			}

			if(!this.categories[category]) {
				this.categories[category] = [];

				if(category == ShapeFactory.CATEGORY_RECENT_USED) {
					this.categoryNames.unshift(category);
				}
				else {
					this.categoryNames.push(category);
				}
			}
			
			this.categories[category].remove(creator);
			if(category == ShapeFactory.CATEGORY_RECENT_USED) {
				this.categories[category].unshift(creator);
			}
			else {
				this.categories[category].push(creator);
			}
		}
//		console.log("Register: category=" + category + " id=" + creator.getID());

		return;
	}

	this.getCategoryNames = function() {
		return this.categoryNames;
	}
	
	this.getDefaultCategory = function() {
		return this.categories[this.defaultCategory];
	}

	this.getByCategory = function(category) {
		return this.categories[category];
	}
	
	this.find = function(type) {
		for(var i = 0; i < this.creators.length; i++) {
			var c = this.creators[i];
			if(c.getID() === type) {
				return c;
			}
		}
		
		return null;
	}

	this.createShapeByUser = function(type, exactly) {
		return this.createShape(type, C_CREATE_FOR_USER, exactly);
	}
	
	this.createShapeByProgram = function(type, exactly) {
		return this.createShape(type, C_CREATE_FOR_PROGRAM, exactly);
	}

	this.createShape = function(type, createReason, exactly) {
		if(!type) {
			return null;
		}

		var c = this.find(type);
		if(c) {
			var s = c.createShape(createReason);
            if(createReason === C_CREATE_FOR_USER) {
                s.initPanelShape(); 
            }
            return s;
		}
		
		console.log("not found type " + type + ", create ui-unkown instead.");

		if(!exactly) {
			c = this.find("ui-unkown");
			if(c) {
				return c.createShape(createReason);
			}

			return null;
		}
	}

	this.addListener = function(func) {
		this.listeners.push(func);

		return this;
	}

	this.removeListener = function(func) {
		this.listeners.remove(func);

		return this;
	}
	
	this.notifyChanged = function(type, category, creator) {
		var listeners = this.listeners;
		for(var i = 0; i < listeners.length; i++) {
			var func = listeners[i];
			if(func) {
				func(type, category, creator);
			}
		}

		return;
	}

	return;
}

ShapeFactory.instance = null;

ShapeFactory.getInstance = function() {
	if(!ShapeFactory.instance) {
		ShapeFactory.instance = new ShapeFactory();
		setTimeout(function() {
			ShapeFactory.instance.loadRecentUsedShapeCreators();
		}, 2000);
	}

	return ShapeFactory.instance;
}


function ShapeFactoryGet() {
	return ShapeFactory.getInstance();
}

function dappSetDefaultCategory(name) {
	return ShapeFactory.getInstance().setDefaultCategory(name);
}

function cantkRegShapeCreator(creator, category) {
	return ShapeFactory.getInstance().addShapeCreator(creator, category);
}
/*
 * File: view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief: view
 * 
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

function TView() {
}

TView.prototype = new WWidget();

TView.prototype.init = function(parent, x, y, w, h) {
	WWidget.prototype.init.call(this, parent, x, y, w, h);

	this.scale = 1;
	this.wmRect = {};
	this.lastPointerPosition = {x:0, y:0};
	this.pointerDownPosition = {x:0, y:0};

	return this;
}

TView.prototype.setDoc = function(doc) {
	this.doc = doc;

	return this;
}

TView.prototype.loadJson = function(json) {
	return this.doc.loadJson(json);
}

TView.prototype.loadString = function(str) {
	return this.doc.loadString(str);
}

TView.prototype.loadURL = function(url) {
	return this.doc.loadURL(url);
}

TView.prototype.getDeviceConfig = function() {
	return this.doc.getDeviceConfig();
}

TView.prototype.getWindowManager = function() {
	return this.doc.getWindowManager();
}

TView.prototype.getCurrentWindow = function() {
	return this.doc.getCurrentWindow();
}

TView.prototype.getMetaInfo = TView.prototype.getMeta = function() {
	return this.doc.getMeta();
}

TView.prototype.getMoveDeltaX = function() {
	return this.moveDeltaX;
}

TView.prototype.getMoveDeltaY = function() {
	return this.moveDeltaY;
}

TView.prototype.getMoveAbsDeltaX = function() {
	return this.moveAbsDeltaX;
}

TView.prototype.getMoveAbsDeltaY = function() {
	return this.moveAbsDeltaY;
}

TView.prototype.updateLastPointerPoint = function(point, pointerDown) {
	if(pointerDown) {
		this.pointerDownPosition.x = point.x;
		this.pointerDownPosition.y = point.y;
	}

	this.moveDeltaX = point.x - this.lastPointerPosition.x;
	this.moveDeltaY = point.y - this.lastPointerPosition.y;
	this.moveAbsDeltaX = point.x - this.pointerDownPosition.x;
	this.moveAbsDeltaY = point.y - this.pointerDownPosition.y;
	this.lastPointerPosition.x = point.x;
	this.lastPointerPosition.y = point.y;

	return;
}

TView.prototype.autoScale = function() {
	var wm = this.getWindowManager();

	if(!wm) return;
	
	var scale = 1;
	var w = this.getWidth();
	var h = this.getHeight();
	
	if(wm.w < wm.h) {
		scale = h/(wm.h+100);
	}
	else {
		scale = w/(wm.w+100);
	}

	if(scale > 1) {
		scale = 1;
	}

	this.zoomTo(scale);

	return;
}

TView.prototype.getScale = function() {
	return this.scale;
}

TView.prototype.onScaled = function(scale) {
	return;
}

TView.prototype.zoomTo = TView.prototype.setScale = function(scale) {

	this.scale = Math.min(2, Math.max(0.5, Math.round(scale * 10)/10));
	this.onScaled(this.scale);

	return this;
}

TView.prototype.zoomIn = function() {
	return this.zoomTo(this.scale * 1.2);
}

TView.prototype.zoomOut = function() {
	return this.zoomTo(this.scale * 0.8);
}

TView.prototype.getWmRect = function() {
	var r = this.wmRect;
	var wm = this.getWindowManager();
	if(wm) {
		var w = this.getWidth();
		var h = this.getHeight();
		r.w = wm.w * this.scale;
		r.h = wm.h * this.scale;
		r.x = (w - r.w) >> 1;
		r.y = (h - r.h) >> 1;
	}
	else {
		r.x = 0;
		r.y = 0;
		r.w = 0;
		r.h = 0;
	}

	return r;
}

TView.prototype.paintSelf = function(canvas) {
	var w = this.getWidth();
	var h = this.getHeight();

	canvas.save();
	canvas.beginPath();
	canvas.rect(0, 0, w, h);
	canvas.clip();
	canvas.beginPath();	

	var wm = this.getWindowManager();
	if(wm) {
		var r = this.getWmRect();	
		canvas.translate(r.x, r.y);
		canvas.scale(this.scale, this.scale);
		wm.setLeftTop(0, 0);
		wm.paintSelf(canvas);
	}
	canvas.restore();

	return;
}

TView.prototype.translatePointToWm = function(point) {
	var r = this.getWmRect();
	var pos = this.translatePoint(point);
	var p = {x:pos.x-r.x, y:pos.y-r.y};
			
	p.x = p.x/this.scale;
	p.y = p.y/this.scale;

	return p;
}

TView.prototype.translatePointToView = function(point) {
    var p = {x:point.x, y:point.y};
    
    var wm = this.getWindowManager();
    p.x += wm.getX();
    p.y += wm.getY();

    return p;
}

TView.prototype.onDoubleClick = function(point) {
	this.updateLastPointerPoint(point, true);

	WWidget.prototype.onDoubleClick.call(this, point);
	if(!this.target) {
		var wm = this.getWindowManager();
		if(wm) {
			var p = this.translatePointToWm(point);

			wm.onDoubleClick(p);
		}
	}

	return;
}

TView.prototype.onPointerDown = function(point) {
	this.updateLastPointerPoint(point, true);

	WWidget.prototype.onPointerDown.call(this, point);
	if(!this.target) {
		var wm = this.getWindowManager();
		if(wm) {
			var p = this.translatePointToWm(point);

			wm.onPointerDown(p);
		}
	}

	return;
}

TView.prototype.onPointerMove = function(point) {
	this.updateLastPointerPoint(point);
	WWidget.prototype.onPointerMove.call(this, point);
	if(!this.target) {
		var wm = this.getWindowManager();
		if(wm) {
			var p = this.translatePointToWm(point);
			wm.onPointerMove(p);
		}
	}

	return;
}

TView.prototype.onPointerUp = function(point) {
	WWidget.prototype.onPointerUp.call(this, point);
	if(!this.target) {
		var wm = this.getWindowManager();
		if(wm) {
			var p = this.translatePointToWm(point);
			wm.onPointerUp(p);
		}
	}

	return;
}

TView.prototype.onKeyDown = function(code) {
	WWidget.prototype.onKeyDown.call(this, code);
	if(!this.target) {
		var wm = this.getWindowManager();
		if(wm) {
			wm.onKeyDown(code);
		}
	}

	return;
}

TView.prototype.onKeyUp = function(code) {
	WWidget.prototype.onKeyUp.call(this, code);
	if(!this.target) {
		var wm = this.getWindowManager();
		if(wm) {
			wm.onKeyUp(code);
		}
	}

	return;
}

TView.prototype.detectDeviceConfig = function() {
	return this.doc.detectDeviceConfig();
}
/*
 * File: document.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: document
 *
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 *
 */

function TDocument() {
}

TDocument.magic = "cantk";
TDocument.prototype.loadURL = function(url) {
	httpGetJSON(url, this.loadJson.bind(this));

	return this;
}

TDocument.prototype.loadString = function(str) {
	try {
		var json = JSON.parse(str);
		this.loadJson(json);
	}catch(e) {
		console.log("loadString:" + e.message);
	}

	return this;
}

TDocument.prototype.getEmptyDoc = function() {
	var doc = {};
	doc.version = 2;
	doc.magic = TDocument.magic;

	return doc;
}

TDocument.prototype.getLocales = function() {
	if(!this.doc.locales) {
		this.doc.locales = {
			"default":{},
			"en":{},
			"zh": {}
		};
	}

	return this.doc.locales;
}

TDocument.prototype.getAssetsConfig = function() {
	var meta = this.getMeta();

	return meta.assetsConfig || TDocument.getDefaultAssetsConfig();
}

TDocument.prototype.getAssetsConfigStr = function() {
	var config = this.getAssetsConfig();

	return JSON.stringify(config, null, "\t");
}

TDocument.prototype.setAssetsConfigStr = function(str) {
	try {
		var config = JSON.parse(str);
		this.setAssetsConfig(config);
	}catch(e) {
		console.log("setAssetsConfigStr:" + e.message);
	}

	return this;
}

TDocument.prototype.setAssetsConfig = function(config) {
	var meta = this.getMeta();
	meta.assetsConfig = config;

	return this;
}

TDocument.getDefaultAssetsConfig = function() {
	if(!TDocument.defaultAssetsConfig) {
		var c = {};
		c.assets = {};
		c.assets.sizes = ["1280x800", "480x800"];
		c.assets.densities = ["hdpi", "xhdpi"];
		c.assets.languages = ["en", "zh"]

		c.design = {};
		c.design.size = "480x800";
		c.design.density = "hdpi";
		c.design.language = "en";

		c.map = {}
		c.map.size = {
			"1280x720":"480x800",
			"480x800":"480x800"
		};
		c.map.density = {
			"ldpi":"hdpi",
			"mdpi":"hdpi",
			"xhdpi":"hdpi",
			"xxhdpi":"hdpi"
		};
		c.map.language = {
			"en":"en",
			"zh":"en"
		}

		TDocument.defaultAssetsConfig = c;
	}

	return TDocument.defaultAssetsConfig;
}

TDocument.prototype.setLocales = function(locales) {
	this.doc.locales = locales;

	return this;
}

TDocument.prototype.getMetaInfo = TDocument.prototype.getMeta = function() {
	return this.doc.meta;
}

TDocument.prototype.getDocID = function() {
	return this.doc.docid;
}

TDocument.prototype.getDeviceConfig = function() {
	return this.wm.deviceConfig;
}

TDocument.prototype.loadV1 = function(json) {
	if(!json.pages || !json.pages[0].shapes || !json.pages[0].shapes[0].children) {
		return this;
	}

	var doc = this.getEmptyDoc();
	doc.meta = json.meta;
	doc.docid = json.docid;

	var device = json.pages[0].shapes[0];
	function forEach(shape) {

		if(shape.type === "ui-window-manager") {
			doc.wm = shape;

			return;
		}

		if(shape.children) {
			var n = shape.children.length;
			for(var i = 0; i < n; i++) {
				var iter = shape.children[i];
				forEach(iter);
			}
		}
	}

	forEach(device);

	doc.deviceConfig = device.config;
	this.loadV2(doc);

	return ;
}

TDocument.prototype.createWindowManager = function(json) {
	var factory = ShapeFactory.getInstance();
	var wm = factory.createShapeByProgram(json.wm.type);

	wm.fromJson(json.wm);
	wm.deviceConfig = json.deviceConfig;

	return wm;
}

TDocument.prototype.onBeforeLoad = function(json) {
}

TDocument.prototype.loadV2 = function(json) {
	this.doc = json;

	this.onBeforeLoad(json);
	this.wm = this.createWindowManager(json);

	var meta = this.getMeta();
    if(meta && meta.general) {
        document.title = meta.general.appname;
    }
	if(meta && meta.extfonts) {
		ResLoader.loadFonts(meta.extfonts);
	}


    var keys = ["soundMusicAutoPlay", "soundMusicLoop", "soundMusicVolume",
        "soundMusicURLs", "soundEffectsEnalbe", "soundEffectVolume", "soundEffectURLs"];
    keys.forEach(function(it) {
        if(it in json.wm) {
            this.wm[it] = json.wm[it];
        }
    }, this);

    var wm = this.wm;
    if(meta && meta.soundConfig) {
        var keys = ["soundMusicAutoPlay", "soundMusicLoop", "soundMusicVolume", "soundMusicURLs", "soundEffectsEnalbe", "soundEffectVolume", "soundEffectURLs"];
        keys.forEach(function(key) {
            wm[key] = meta.soundConfig[key];
        })

        wm.setSoundMusicVolume(wm.soundMusicVolume);
        wm.setSoundEffectVolume(wm.soundEffectVolume);
    }

	this.onLoad();

	return;
}

TDocument.prototype.loadJson = function(json) {
	if(!json) return this;

	if(json.magic === "drawapps") {
		this.loadV1(json);
	}
	else if(json.magic === TDocument.magic) {
		this.loadV2(json);
	}
    else if(json.code === 302) {
        window.location.href = json.data;
    }
	else {
		console.log("invalid json");
	}

	return this;
}

TDocument.prototype.getWindowManager = function() {
	return this.wm;
}

TDocument.prototype.getCurrentWindow = function() {
	return this.wm ? this.wm.getCurrentWindow() : null;
}

TDocument.prototype.detectDeviceConfig = function() {
	if(this.detectedDeviceConfig) {
		return this.detectedDeviceConfig;
	}

	var deviceConfig = {version:4};

	if(isAndroid()) {
		deviceConfig.platform = "android";
	}
	else if(isIPhone () || isIPad()) {
		deviceConfig.platform = "iphone";
	}
	else if(isFirefoxOS()) {
		deviceConfig.platform = "firefox";
	}
	else if(isWinPhone()) {
		deviceConfig.platform = "winphone";
	}
	else if(isTizen()) {
		deviceConfig.platform = "tizen";
	}
	else {
		deviceConfig.platform = "android";
	}

	if(window.devicePixelRatio > 2.2) {
		deviceConfig.lcdDensity = "xxhdpi";
	}
	else if(window.devicePixelRatio > 1.5) {
		deviceConfig.lcdDensity = "xhdpi";
	}
	else if(window.devicePixelRatio > 1.1) {
		deviceConfig.lcdDensity = "hdpi";
	}
	else if(window.devicePixelRatio > 0.8) {
		deviceConfig.lcdDensity = "mdpi";
	}
	else if(!window.devicePixelRatio) {
		var minSize = Math.min(window.orgViewPort.width, window.orgViewPort.height);
		if(minSize > 600) {
			deviceConfig.lcdDensity = "xhdpi";
		}
		else {
			deviceConfig.lcdDensity = "hdpi";
		}
	}
	else {
		deviceConfig.lcdDensity = "ldpi";
	}

	if(isFirefoxOS()) {
		deviceConfig.lcdDensity = "mdpi";
	}

	if(!isMobile()) {
		deviceConfig.lcdDensity = "hdpi";
	}

	this.detectedDeviceConfig = deviceConfig;
//	console.log("deviceConfig.lcdDensity:" + deviceConfig.lcdDensity);
//	console.log("deviceConfig.platform:" + deviceConfig.platform);

	return deviceConfig;
}

/*
 * File: runtime_view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  runtime view 
 * 
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

function TRuntimeView() {
}

TRuntimeView.prototype = new TView();
TRuntimeView.prototype.init = function(parent, x, y, w, h, app) {
	this.app = app;
	this.type = "app-view";
	TView.prototype.init.call(this, parent, x, y, w, h);
	
	this.preview = app.preview;
	this.setDoc(new TRuntimeDocument());

	this.doc.onLoad = this.onLoad.bind(this);
	WWindowManager.onMultiTouch = this.onMultiTouch.bind(this);
	WWindowManager.instance.drawWindows = this.paintSelf.bind(this);

	return this;
}

TRuntimeView.prototype.onMultiTouch = function(action, points, event) {
	var wm = this.getWindowManager();
	if(wm) {
		wm.onMultiTouch(action, points, event);
	}
}

TRuntimeView.prototype.resizeForFixWidth = function(wm) {
	var vp = cantkGetViewPort();
	var scale = wm.w/vp.width;
	var w = wm.w;
	var h = vp.height * scale;

	var styleW = vp.width;
	var styleH = vp.height;

	this.app.resizeWin(w,  h);
	this.app.resizeCanvas(w, h, 0, 0, styleW, styleH);
	WWindowManager.setInputScale(scale, scale);
	wm.setSize(w, h);
	wm.relayout();
}

TRuntimeView.prototype.resizeForFixHeight = function(wm) {
	var vp = cantkGetViewPort();
	var scale = wm.h/vp.height;
	var h = wm.h;
	var w = vp.width * scale;

	var styleW = vp.width;
	var styleH = vp.height;

	this.app.resizeWin(w,  h);
	this.app.resizeCanvas(w, h, 0, 0, styleW, styleH);
	WWindowManager.setInputScale(scale, scale);
	wm.setSize(w, h);
	wm.relayout();
}

TRuntimeView.prototype.resizeForFixResolution = function(wm) {
	var vp = cantkGetViewPort();
	var scalex = wm.w/vp.width;
	var scaley = wm.h/vp.height;
	var scale = Math.max(scalex, scaley);
	var w = scale * vp.width;
	var h = scale * vp.height;
	var styleW = vp.width;
	var styleH = vp.height;
	var x = (w - wm.w) >> 1;
	var y = (h - wm.h) >> 1;

	wm.setLeftTop(x, y);
	this.app.resizeWin(w,  h);
	this.app.resizeCanvas(w, h, 0, 0, styleW, styleH);
	WWindowManager.setInputScale(scale, scale);
	wm.relayout();
}

TRuntimeView.prototype.translatePointToWm = function(point) {
	return point;
}

TRuntimeView.prototype.resizeForAuto = function(wm) {
	var vp = cantkGetViewPort();
	wm.setSize(vp.width, vp.height);
	wm.relayout();
}

TRuntimeView.prototype.adjustWMSizePositionPreview = function(wm) {
	var vp = cantkGetViewPort();
	var w = wm.w;
	var h = wm.h;
	var scale = Math.min(1, Math.min(vp.width/w, vp.height/h));
	var styleW = w * scale;
	var styleH = h * scale;

	var x = (vp.width - styleW) >> 1;
	var y = (vp.height - styleH) >> 1;

	wm.setLeftTop(0, 0);
	this.app.resizeWin(w, h);
	this.app.resizeCanvas(w, h, x, y, styleW, styleH);
	WWindowManager.setInputOffset(x, y);
	WWindowManager.setInputScale(1/scale, 1/scale);

	wm.relayout();
}

TRuntimeView.prototype.adjustWMSizePositionRun = function(wm) {
	var meta = this.getMeta();
	var general = meta.general;
	var orientation = general.orientation;

	wm.forcePortrait = false;
	wm.forceLandscape = false;
	var designWidth = this.designWidth;
	var designHeight = this.designHeight;

	if(orientation === "landscape" && designWidth > designHeight) {
		wm.forceLandscape = true;
	}
	else if(orientation === "portrait" && designHeight > designWidth) {
		wm.forcePortrait = true;
	}
	wm.screenScaleMode = general.screenscale; 
	
	wm.setLeftTop(0, 0);
	switch(wm.screenScaleMode) {
		case "fix-width": {
			this.resizeForFixWidth(wm);
			break;
		}
		case "fix-height": {
			this.resizeForFixHeight(wm);
			break;
		}
		case "fix-resolution": {
			this.resizeForFixResolution(wm);
			break;
		}
		default: {
			this.resizeForAuto(wm);
			break;
		}
	}

	return;
}

TRuntimeView.prototype.adjustWMSizePosition = function() {
	var wm = this.getWindowManager();

	if(this.preview) {
		return this.adjustWMSizePositionPreview(wm);
	}
	else {
		return this.adjustWMSizePositionRun(wm);
	}
}

TRuntimeView.prototype.onLoad = function() {
	var wm = this.getWindowManager();
	var meta = this.getMeta();

	if(meta.general.useWebGL) {
		WWindowManager.setCanvasContextName("2d-webgl");
	}

	//for preview current window
	if(window.cantkInitWindow !== undefined) {
		wm.setInitWindow(window.cantkInitWindow);
		console.log("window.cantkInitWindow:" + window.cantkInitWindow);
	}

    wm.setView(this);
    wm.setApp(this.app);
	wm.setMode(Shape.MODE_RUNNING, true);

	this.designWidth = wm.w;
	this.designHeight = wm.h;
	this.adjustWMSizePosition();
	this.run();
}

TRuntimeView.prototype.paintLoading = function(canvas) {
}

TRuntimeView.prototype.getViewScale = function() {
	return 1;
}

TRuntimeView.prototype.paintSelf = function(canvas) {
	var wm = this.getWindowManager();
	if(!wm) {
		this.paintLoading(canvas);

		return;
	}

	canvas.save();
	wm.paint(canvas);
	canvas.restore();

	var sx = wm.x;
	var sy = wm.y;
	var sw = wm.w;
	var sh = wm.h;
	var w = this.rect.w;
	var h = this.rect.h;

	canvas.beginPath();
	if(sy > 0) {
		canvas.rect(0, 0, w, sy);
	}
	if(sx > 0) {
		canvas.rect(0, 0, sx, h);
	}
	var r = sx + sw;
	var rw = w - r;
	if(rw > 0) {
		canvas.rect(r, 0, rw, h);
	}
	var b = sy + sh;
	var bh = h - b;
	if(bh > 0) {
		canvas.rect(0, b, w, bh);
	}

	if(sy > 0 || sx > 0 || rw > 0 || bh > 0) {
		canvas.fillStyle = wm.style.fillColor;
		canvas.fill();
	}

	return;
}

TRuntimeView.prototype.onGesture = function(gesture) {
	var curWin = wm.getCurrentWindow();

	curWin.onGesture(gesture);

	return;
}

TRuntimeView.prototype.getAppInfo = function() {
	var metaInfo = this.getMetaInfo();

	return metaInfo.general;
}

TRuntimeView.prototype.onLoadUserScriptsDone = function() {
	var appInfo = this.getAppInfo();
	HolaSDK.init(appInfo.appid, false);
	console.log("TRuntimeView.prototype.onLoadUserScriptsDone.");
}

TRuntimeView.prototype.loadUserScripts = function(meta) {
	if(meta) {
		var scripts = meta.extlibs;
		var force = window.location.href.indexOf("appid=preview") > 0;
		
		if(!scripts) {
			scripts = [];
		}

//		scripts.push(HolaSDK.getSDKURL());

        if(scripts.length > 0) {
            //make a sort
            var userLibs = [];
            var extLibs = [];
            scripts.forEach(function(script) {
                if(script.indexOf("read.php?") > 0 && script.indexOf("/libs/") > 0) {
                    var t = meta.docSavedTime ? meta.docSavedTime : Date.now();
                    userLibs.push(script + "&timestamp=" + t);
                } else {
                    extLibs.push(script);
                }
            });
            userLibs.sort();
            scripts = extLibs.concat(userLibs);
        }
		
        if(scripts) {
			var arr = [];
			for(var i = 0; i < scripts.length; i++) {
				var iter = scripts[i];
				if(iter.indexOf("res.wx.qq.com") >= 0 && !isWeiXin()) {
					console.log("not weixin browser skip weixin jssdk");
					continue;
				}
				arr.push(iter);
			}

			if(arr.length) {
				ResLoader.loadScriptsSync(arr, this.onLoadUserScriptsDone.bind(this));
			}
		}
	}

	return;
}

TRuntimeView.prototype.paintBackground = function(canvas) {
}

TRuntimeView.prototype.startRedrawTimer = function(fps) {
	var fps = fps || 60;
	var dt = 1000/fps;
	var wm = WWindowManager.getInstance();

	setInterval(wm.postRedraw.bind(wm), dt);

	return;
}

TRuntimeView.prototype.run = function() {
	var meta = this.getMeta();
	var wm = this.getWindowManager();
	var runtimeConfig = this.detectDeviceConfig();

	if(this.preview) {
		runtimeConfig.lcdDensity = wm.deviceConfig.lcdDensity;
	}

	wm.setDeviceConfig(runtimeConfig);

	this.modifyTitle(meta);
	this.loadUserScripts(meta);
	this.startRedrawTimer(meta.general.fps);

	wm.systemInit();
	wm.postRedraw();

	return;
}

TRuntimeView.prototype.modifyTitle = function(meta) {
	if(meta && meta.general) {
		var appname = meta.general.appname;

		document.title = appname;
		if(isIPhone() || isIPad()) {
			var tags = document.getElementsByTagName("title");
			if(tags && tags.length) {
				var title = tags[0];
				title.innerHTML = appname;
            }
		}
	}
}

TRuntimeView.create = function(parent, x, y, w, h, app) {
	var view = new TRuntimeView();
	return view.init(parent, x, y, w, h, app);
}

function dappGetText(text) {
	return text;
}

function dappIsEditorApp() {
	return false;
}

/*
 * File: runtime_document.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: runtime document 
 * 
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

function TRuntimeDocument() {
}

TRuntimeDocument.prototype = new TDocument();

TRuntimeDocument.prototype.updateAssetsMapRule = function(assetsConfig) {
	var key = null;
	var mapped = assetsConfig.mapped;
	var runtime = assetsConfig.runtime;
	var design = assetsConfig.design;

	var mapLanguage = assetsConfig.map.language;
	for(key in mapLanguage) {
		if(runtime.language.indexOf(key) >= 0) {
			mapped.language = mapLanguage[key];
			break;
		}
	}
	if(!mapped.language) {
		mapped.language = design.language;
	}

	var mapSize = assetsConfig.map.size;
	for(key  in mapSize) {
		if(key === runtime.size) {
			mapped.size = mapSize[key];
		}
	}
	if(!mapped.size) {
		mapped.size = design.size;
	}

	var mapDensity = assetsConfig.map.density;
	for(key  in mapDensity) {
		if(key === runtime.density) {
			mapped.density = mapDensity[key];
		}
	}
	if(!mapped.density) {
		mapped.density = design.density;
	}

	return this;
}

TRuntimeDocument.prototype.fixAssetsConfig = function(assetsConfig) {
	var runtime = {};
	var vp = cantkGetViewPort();
	var config = this.detectDeviceConfig();

	runtime.width = vp.width;
	runtime.height = vp.height;
	runtime.density = config.lcdDensity;
	runtime.language = Locales.getLang();
	runtime.size = runtime.width+"x"+runtime.height;

	assetsConfig.mapped = {};
	assetsConfig.runtime = runtime;

	this.updateAssetsMapRule(assetsConfig);

	return this;
}

TRuntimeDocument.prototype.createWindowManager = function(json) {
	var assetsConfig = this.getAssetsConfig();
	if(assetsConfig) {
		this.fixAssetsConfig(assetsConfig);
		ResLoader.setAssetsConfig(assetsConfig);
		ResLoader.mapImageURL = this.mapAssetURL.bind(this);
	}

	return TDocument.prototype.createWindowManager.call(this, json);
}

TRuntimeDocument.prototype.applyLocales = function(json) {
	var stringTable = null;
	var locales = json.locales;
	var name = Locales.getLang();

	if(!locales) return;

	for(var key in locales) {
		var keys = key.toLowerCase().split(";");
		for(var i = 0; i < keys.length; i++) {
			var iter = keys[i];
			if(iter === name || name.startWith(iter)) {
				stringTable = locales[key];
				console.log("Matched locale:" + name + " ==> " + key);
				break;
			}
		}
		if(stringTable) break;
	}

	if(!stringTable) {
		stringTable = locales["default"];
		if(stringTable) {
			console.log("Matched locale:" + name + " ==> default");
		}
	}

	if(stringTable) {
		webappSetLocaleStrings(stringTable);
	}

	return;
}

TRuntimeDocument.prototype.onBeforeLoad = function(json) {
	this.applyLocales(json);
}

TRuntimeDocument.prototype.mapAssetURL = function(url, assetsConfig) {
	if(!assetsConfig || !url || url.length > 1024) {
		return url;
	}

	var design = assetsConfig.design;
	var mapped = assetsConfig.mapped;
	
	if(design.language !== mapped.language && url.indexOf(design.language) >= 0) {
		url = url.replace(new RegExp(design.language, "g"), mapped.language);
	}

	if(design.density !== mapped.density && url.indexOf(design.density) >= 0) {
		url = url.replace(new RegExp(design.density, "g"), mapped.density);
	}

	if(design.size !== mapped.size && url.indexOf(design.size) >= 0) {
		url = url.replace(new RegExp(design.size, "g"), mapped.size);
	}

	return url;
}

/*
 * File: webapp.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  web app.
 * 
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

function TWebApp(preview) {
	document.body.style.overflow = "hidden";
	this.viewPort = cantkGetViewPort();

	this.preview = !!preview; 
	this.init(preview);

	return this;
}

TWebApp.prototype.prepareCanvas = function() {
	this.canvas	 = CantkRT.getMainCanvas();

	var canvas = this.canvas;
	var vp = cantkGetViewPort();
	var w = vp.width;
	var h = vp.height;
	CantkRT.resizeMainCanvas(w, h, w, w);

	this.manager = WWindowManager.create(this, this.canvas, this.canvas);

	return;
}

TWebApp.prototype.init = function() {
	this.prepareCanvas();
	var w = this.canvas.width;
	var h = this.canvas.height;

	var app = this;
	this.win = WWindow.create(this.manager, 0, 0, w, h);
	this.view = TRuntimeView.create(this.win, 0, 0, w, h, this);
	
	var view = this.view;
	this.win.paintBackground = function(canvas) {
	};
	
	this.win.onGesture = function(gesture) {
		return view.onGesture(gesture);
	};

	window.onresize = function() {
		setTimeout(app.onSizeChanged.bind(app), 50);
	}

	return;
}


TWebApp.prototype.resizeWin = function(w, h) {
	this.win.resize(w, h);
	this.view.resize(w, h);
}

TWebApp.prototype.resizeCanvas = function(w, h, x, y, styleW, styleH) {
	var canvas = this.canvas;

	CantkRT.moveMainCanvas(x, y);
	CantkRT.resizeMainCanvas(w, h, styleW, styleH);

	return;
}

TWebApp.prototype.onSizeChanged = function() {
	var viewPort = cantkGetViewPort();

	if(EditorElement.imeOpen) {
		console.log("EditorElement.imeOpen is true.");
		return;
	}

	if(viewPort.width === this.viewPort.width && viewPort.height === this.viewPort.height) {
		console.log("onSizeChanged: size is not changed.");
		return;
	}

	var w = viewPort.width;
	var h = viewPort.height;
	this.viewPort = viewPort;
	this.manager.resize(w, h);
	this.view.adjustWMSizePosition();
	UIElement.getMainCanvasScale(true);
}

TWebApp.prototype.exitApp = function() {
	if(isTizen()) {
		tizen.application.getCurrentApplication().exit();
	}
	else if(navigator.app) {
		navigator.app.exitApp();
	}
	console.log("exitApp");
	return;
}

TWebApp.prototype.runWithURL = function(url) {
	this.view.loadURL(url);
	return this;
}

TWebApp.prototype.runWithData = function(json) {
	if(typeof json === "string") {
		this.view.loadString(json);
	}
	else {
		this.view.loadJson(json);
	}
	return this;
}

window.webappRunWithURL = function(url) {
	var app = new TWebApp();
	
	return app.runWithURL(url);
}

window.webappRunWithData = function(json) {
	var app = new TWebApp();
	
	return app.runWithData(json);
}

window.webappPreviewWithURL = function(url) {
	var app = new TWebApp(true);
	
	return app.runWithURL(url);
}

window.webappPreviewWithData = function(json) {
	var app = new TWebApp(true);
	
	return app.runWithData(json);
}

window.webappGetText = webappGetText;
window.webappSetLocaleStrings = webappSetLocaleStrings;

window.webappSnapshot = function() {
	var canvas = CantkRT.getMainCanvas();
	var dataURL = canvas.toDataURL();
	
	var image = {};
	image.src = dataURL;
	image.width = canvas.width;
	image.height = canvas.height;

	return image;
}

function dupDeviceConfig(config) {
	var o = {};

	o.name = config.name;
	o.bg = config.bg
	o.platform = config.platform;
	o.version = config.version;
	o.lcdDensity = config.lcdDensity;
	o.width = config.width;
	o.height = config.height;
	o.screenX = config.screenX;
	o.screenY = config.screenY;
	o.screenW = config.screenW;
	o.screenH = config.screenH;
	o.hasMenuBar = config.hasMenuBar;

	return o;
}
	
function cantkDetectDeviceConfig() {
	var deviceConfig = {version:4};
		
	if(isAndroid()) {
		deviceConfig.platform = "android";
	}
	else if(isIPhone () || isIPad()) {
		deviceConfig.platform = "iphone";
	}
	else if(isFirefoxOS()) {
		deviceConfig.platform = "firefox";
	}
	else if(isWinPhone()) {
		deviceConfig.platform = "winphone";
	}
	else if(isTizen()) {
		deviceConfig.platform = "tizen";
	}
	else {
		deviceConfig.platform = "android";
	}

	if(window.devicePixelRatio > 2.2) {
		deviceConfig.lcdDensity = "xxhdpi";
	}
	else if(window.devicePixelRatio > 1.5) {
		deviceConfig.lcdDensity = "xhdpi";
	}
	else if(window.devicePixelRatio > 1.1) {
		deviceConfig.lcdDensity = "hdpi";
	}
	else if(window.devicePixelRatio > 0.8) {
		deviceConfig.lcdDensity = "mdpi";
	}
	else if(!window.devicePixelRatio) {
		var minSize = Math.min(window.orgViewPort.width, window.orgViewPort.height);
		if(minSize > 600) {
			deviceConfig.lcdDensity = "xhdpi";
		}
		else {
			deviceConfig.lcdDensity = "hdpi";
		}
	}
	else {
		deviceConfig.lcdDensity = "ldpi";
	}

	if(isFirefoxOS()) {
		deviceConfig.lcdDensity = "mdpi";
	}

	if(!isMobile()) {
		deviceConfig.lcdDensity = "hdpi";
	}

	console.log("deviceConfig.lcdDensity:" + deviceConfig.lcdDensity);
	console.log("deviceConfig.platform:" + deviceConfig.platform);

	return deviceConfig;
}

function isDeviceConfigEqual(c1, c2) {
	var s1 = JSON.stringify(c1);
	var s2 = JSON.stringify(c2);

	return s1 === s2;
}

function cantkPreloadImage(src) {
	var image = new WImage(src);

	return image;
}
	
var gTempCanvas = null;
function cantkGetTempCanvas(width, height) {
	if(!gTempCanvas) {
		gTempCanvas = document.createElement("canvas");

		gTempCanvas.type = "backend_canvas";
		gTempCanvas.width = width;
		gTempCanvas.height = height;
	}

	if(gTempCanvas) {
		if(gTempCanvas.width != width) {
			gTempCanvas.width = width;
		}

		if(gTempCanvas.height != height) {
			gTempCanvas.height = height;
		}
	}

	return gTempCanvas;
}

//////////////////////////////////////////////////////////////////////////}-{

var gApp8LocaleStrings = {
	'Loading...':'正在努力加载...'
};

function webappGetText(text) {
	var str = null;
	if(!text) {
		return "";
	}

	if(gApp8LocaleStrings) {
		str = gApp8LocaleStrings[text];
	}

	if(!str) {
		str = text;
//		console.log("\""+text+"\":" + "\"" +text+ "\",");
	}

	return str;
}

function webappSetLocaleStrings(strs) {
	gApp8LocaleStrings = strs;

	return;
}

/*
 * File: ui_animation.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: ui animation.
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

//////////////////////////////////////////////////

VelocityTracker.prototype.HISTORY_SIZE = 20;
VelocityTracker.prototype.HORIZON = 200 * 1000000;
VelocityTracker.prototype.MIN_DURATION = 10 * 1000000;

function Movement() {
	this.eventTime = 0;
	this.point = new Point(0, 0);

	this.getPoint = function() {
		return this.point;
	}

	return this;
}

function VelocityTracker() {
    this.clear();

    return this;
}

VelocityTracker.prototype.clear = function() {
    this.index = 0;
	
	var HISTORY_SIZE = this.HISTORY_SIZE;
    if(!this.movements) {
		this.movements = new Array();
		for(var i = 0; i < HISTORY_SIZE; i++) {
			this.movements.push(new Movement());
		}
    }

	for(var i = 0; i < HISTORY_SIZE; i++) {
		var iter = this.movements[i];
		iter.eventTime = 0;
		iter.point = {x:0, y:0};
	}

    return;
}

VelocityTracker.prototype.addMovement = function(eventTime, point) {
    if (++this.index == this.HISTORY_SIZE) {
        this.index = 0;
    }

    this.movements[this.index].eventTime = eventTime;
    this.movements[this.index].point = point;

    return;
}

VelocityTracker.prototype.getVelocity = function() {
	var velocity = {x:0, y:0};

	this.estimate();

	velocity.x = this.xVelocity;
	velocity.y = this.yVelocity;

	return velocity;
}

VelocityTracker.prototype.estimate = function() {
	var HORIZON = this.HORIZON;
	var MIN_DURATION = this.MIN_DURATION;
	var HISTORY_SIZE = this.HISTORY_SIZE;
    var newestMovement = this.movements[this.index];
    var minTime = newestMovement.eventTime - HORIZON;
    var oldestIndex = this.index;
    var numTouches = 1;

    do {
        var nextOldestIndex = (oldestIndex == 0 ? HISTORY_SIZE : oldestIndex) - 1;
        var nextOldestMovement = this.movements[nextOldestIndex];
        if (nextOldestMovement.eventTime < minTime) {
            break;
        }
        oldestIndex = nextOldestIndex;
    } while (++numTouches < HISTORY_SIZE);

    var accumVx = 0;
    var accumVy = 0;
    var index = oldestIndex;
    var samplesUsed = 0;
    var oldestMovement = this.movements[oldestIndex];
   	var oldestPosition = oldestMovement.getPoint();
    var lastDuration = 0;

    while (numTouches-- > 1) {
        if (++index == HISTORY_SIZE) {
            index = 0;
        }
        var movement = this.movements[index];
        var duration = movement.eventTime - oldestMovement.eventTime;

        if (duration >= MIN_DURATION) {
            var position = movement.getPoint();
            var scale = 1000000000.0 / duration; // one over time delta in seconds
            var vx = (position.x - oldestPosition.x) * scale;
            var vy = (position.y - oldestPosition.y) * scale;
            accumVx = (accumVx * lastDuration + vx * duration) / (duration + lastDuration);
            accumVy = (accumVy * lastDuration + vy * duration) / (duration + lastDuration);
            lastDuration = duration;
            samplesUsed += 1;
        }
    }

    // Report velocity.
    if (samplesUsed) {
		this.xVelocity = accumVx;
		this.yVelocity = accumVy;
    } else {
		this.xVelocity = 0;
		this.yVelocity = 0;
    }

    return true;
}

function testVelocityTracker() {
	var v = null;
	var vt = new VelocityTracker();
	function toNs(ms) {
		return ms * 1000000;
	}

	for(var i = 0; i < 20; i++) {
		vt.addMovement(toNs(10 * i), {x:10*i, y:10*i*i/2});
	}

	v = vt.getVelocity();

	console.log("xv: " + v.x + " yv: " + v.y);

	return;
}

//testVelocityTracker();

//////////////////////////////////////////////////////////////////////

/**
 * @class Interpolator 
 * 插值算法接口。它的基本功能就是将时间进度(0-1)变换成任务实际进度(0,1)，重而实现加速，减速，先加速再减速和回弹等效果。
 */
function Interpolator() {

/**
 * @method get 
 * 获取任务实际进度。
 * @param {Number} percent 时间进度(0-1)。
 * @return {Number} 返回任务实际进度。
 */
	this.get = function(percent) {
		return 0;
	}

	return this;
}

/**
 * @class Interpolator 
 * 插值算法接口。它的基本功能就是将时间进度(0-1)变换成任务实际进度(0,1)，重而实现加速，减速，先加速再减速和回弹等效果。
 */
function LinearInterpolator() {
	this.get = function(percent) {
		return percent;
	}

	return this;
}

/**
 * @method create 
 * 创建插值算法对象。
 * @param {String} name 插值算法的名称。
 * @return {Interpolator} 返回插值算法对象。
 *
 *     @example small frame
 *     //创建线形插值算法（l|linear):
 *     var interpolator = Interpolator.create('l');
 *     //创建回弹插值算法 (b|bounce)
 *     var interpolator = Interpolator.create('b');
 *     //创建加速插值算法 (a|accelerate)
 *     var interpolator = Interpolator.create('a');
 *     //创建先加速再加速插值算法(ad|accelerate-decelerate)
 *     var interpolator = Interpolator.create('ad');
 *     //创建减速插值算法(d|decelerate)
 *     var interpolator = Interpolator.create('d');
 */
Interpolator.create = function(name, args) { 
	return AnimationFactory.createInterpolator(name, args);	
}

function BounceInterpolator() {
	function bounce(percent) {
		return 8 * percent * percent;
	}

	this.get = function(percent) {
		percent *= 1.1226;
        if (percent < 0.3535) return bounce(percent);
        else if (percent < 0.7408) return bounce(percent - 0.54719) + 0.7;
        else if (percent < 0.9644) return bounce(percent - 0.8526) + 0.9;
        else return bounce(percent - 1.0435) + 0.95;
	}

	return this;
}

function AccelerateInterpolator() {
	this.get = function(percent) {
		return percent * percent;
	}

	return this;
}

function AccDecelerateInterpolator() {
	this.get = function(percent) {
		return ((Math.cos((percent + 1) * Math.PI) / 2.0) + 0.5);
	}

	return this;
}

function DecelerateInterpolator(factor) {
	this.factor = factor ? factor : 2;
	this.get = function(percent) {
		if(this.factor === 1) {
			return (1.0 - (1.0 - percent) * (1.0 - percent));
		}
		else {
			return (1.0 - Math.pow((1.0 - percent), 2 * this.factor));
		}
	}

	return this;
}

function SineAccelerateInterpolator() {
	this.get = function(percent) {
		return -Math.cos(percent * (Math.PI / 2)) + 1;
	}

	return this;
}

function SineAccDecelerateInterpolator() {
	this.get = function(percent) {
		return (-0.5 * (Math.cos(Math.PI * percent) - 1));
	}

	return this;
}

function SineDecelerateInterpolator() {
	this.get = function(percent) {
		return Math.sin(percent * (Math.PI / 2));
	}

	return this;
}

//////////////////////////////////////////////////////////////////////
function AnimationFactory() {
	this.createAnimation = function(name, duration) {
		UIElement.getMainCanvasScale(true);
		var defaultDuration = isIPhone() ? 400 : 600;
		duration = duration ? duration : defaultDuration;
		switch(name) {
			case "anim-forward": {
				var interpolator =  new DecelerateInterpolator();
				animation = new AnimationHTranslate(true);
				animation.toLeft();
				animation.init(duration, interpolator);
				break;
			}
			case "anim-backward": {
				var interpolator =  new DecelerateInterpolator();
				animation = new AnimationHTranslate(false);
				animation.toRight();
				animation.init(duration, interpolator);
				break;
			}
			case "anim-upward": {
				var interpolator =  new DecelerateInterpolator();
				animation = new AnimationVTranslate(true);
				animation.init(duration, interpolator);
				break;
			}
			case "anim-downward": {
				var interpolator =  new DecelerateInterpolator();
				animation = new AnimationVTranslate(false);
				animation.init(duration, interpolator);
				break;
			}
			case "anim-scale-show-win": {
				var interpolator =  new DecelerateInterpolator();
				animation = new AnimationScale(true);
				animation.setRange(0.9, 1.0);
				animation.init(duration, interpolator);
				break;
			}
			case "anim-scale-hide-win": {
				var interpolator =  new AccelerateInterpolator();
				animation = new AnimationScale(false);
				animation.setRange(1.0, 0.9);
				animation.init(duration, interpolator);
				break;
			}
			case "anim-scale-show-dialog": {
				duration = duration ? duration : 300;
				var interpolator =  new DecelerateInterpolator();
				animation = new AnimationScale(true);
				animation.setRange(0.9, 1.0);
				animation.init(duration, interpolator);
				break;
			}
			case "anim-scale-hide-dialog": {
				duration = duration ? duration : 300;
				var interpolator =  new AccelerateInterpolator();
				animation = new AnimationScale(false);
				animation.setRange(1.0, 0.9);
				animation.init(duration, interpolator);
				break;
			}
			case "anim-fade-in": {
				var interpolator =  new AccelerateInterpolator();
				animation = new AnimationAlpha(true);
				animation.setRange(0.1, 1.0);
				animation.init(800, interpolator);
				break;
			}
			case "anim-fade-out": {
				var interpolator =  new AccelerateInterpolator();
				animation = new AnimationAlpha(false);
				animation.setRange(1.0, 0.1);
				animation.init(300, interpolator);
				break;
			}
			case "anim-move-up": {
				var interpolator =  new DecelerateInterpolator();
				animation = new AnimationMove(true);
				animation.init(duration, interpolator);
				break;
			}
			case "anim-move-down": {
				var interpolator =  new AccelerateInterpolator();
				animation = new AnimationMove(false);
				animation.init(duration, interpolator);
				break;
			}
		}
		
		return animation;
	}

	return this;
}

AnimationFactory.createInterpolator = function(name, args) {
	switch(name) {
		case 'l': 
		case 'linear': {
			return new LinearInterpolator();
		}
		case 'b':
		case 'bounce': {
			return new BounceInterpolator();
		}
		case 'a':
		case 'accelerate': {
			return new AccelerateInterpolator();
		}
		case 'ad':
		case 'accelerate-decelerate': {
			return new AccDecelerateInterpolator();
		}
		case 'sa':
		case 'sine-accelerate': {
			return new SineAccelerateInterpolator();
		}
		case 'sd':
		case 'sine-decelerate': {
			return new SineDecelerateInterpolator();
		}
		case 'sad':
		case 'sine-accelerate-decelerate': {
			return new SineAccDecelerateInterpolator();
		}
		default: {
			return new DecelerateInterpolator();
		}
	}
}

AnimationFactory.create = function(name, duration) {
	if(!AnimationFactory.instance) {
		AnimationFactory.instance = new AnimationFactory();
	}

	return AnimationFactory.instance.createAnimation(name, duration);
}

Animation.getCanvas = function() {
    return UIElement.getMainCanvas();
}

function Animation(showWin) {
	this.scale = 1;
	this.visible = false;
	this.showWin = showWin;

	this.init = function(duration, interpolator) {
		this.duration = duration ? duration : 500;
		this.interpolator = interpolator;

		return;
	}

    this.setWins = function(oldWin, newWin) {
        this.oldWin = oldWin;
        this.newWin = newWin;
        this.wm = oldWin.getWindowManager();
    }

	this.setRectOfFront = function(x, y, w, h) {
		this.frontX = x;
		this.frontY = y;
		this.frontW = w;
		this.frontH = h;

		return;
	}

	this.setScale = function(scale) {
		this.scale = scale;

		return;
	}

	this.prepare = function(x, y, w, h, onFinish) {
		this.x = Math.round(x);
		this.y = Math.round(y);
		this.w = Math.round(w);
		this.h = Math.round(h);
		this.onFinish = onFinish;

		this.setRectOfFront(0, 0, w, h);

		this.show();

		return true;
	}

	this.show = function() {
		var w = this.w * this.scale;
		var h = this.h * this.scale;

		this.visible = true;
		this.canvasElement = Animation.getCanvas();

		return true;
	}

	this.hide = function() {
		this.visible = false;
		if(this.canvasElement && this.canvasElement.parentNode) {
			this.canvasElement = null;
		}

		return true;
	}

	this.getTimePercent = function() {
		var date = new Date();
		var elapsed = date.getTime() - this.startTime;

		return elapsed/this.duration;
	}

	this.getPercent = function(timePercent) {
		return this.interpolator.get(timePercent);	
	}

	this.step = function(percent) {
		/*Overwrite it*/
		return true;
	}
	
	this.beforeRun = function() {
		/*Optional Overwrite it*/
		return true;
	}
	
	this.afterRun = function() {
		/*Optional Overwrite it*/
		return true;
	}

	this.drawBackground = function(canvas) {
		return;
	}

	this.doStep = function(percent) {
		this.canvas.save();
		this.canvas.scale(this.scale, this.scale);
		this.step(percent);
		this.canvas.restore();

		return;
	}
	
	this.run = function() {
		var date = new Date();
		var animation = this;
		this.startTime = date.getTime();
		animation.isFirstStep = true;

		this.beforeRun();
		WWindowManager.getInstance().setPaintEnable(false); 
		this.wm.setEnable(false); 
		function animStep() {
			var percent = 0;
			var timePercent = animation.getTimePercent();

			if(timePercent < 1) {
				percent = animation.getPercent(timePercent);
				animation.doStep(percent);

				requestAnimationFrame(animStep);
			}
			else {
				animation.cleanup();
				animation.afterRun();
				WWindowManager.getInstance().setPaintEnable(true);
				console.log("Animation done.");
			}
			animation.isFirstStep = false;
		}
		
		animStep();

		return;
	}

	this.cleanup = function() {
		var animation = this;
		var onFinish = this.onFinish;

		setTimeout(function() {
			animation.hide();
		    animation.wm.setEnable(true); 
		}, 100);

		if(onFinish) {
			onFinish();
		}
	}

	this.hide();

	return this;
}

function setElementPosition(element, x, y) {
	var scale = UIElement.getMainCanvasScale();

	x = x/scale.x;
	y = y/scale.y;
	element.style.position = "absolute";
	element.style.left = Math.round(x) + "px";
	element.style.top = Math.round(y) + "px";
	element.style["opacity"] = 1.0;

	return;
}

function moveElement(element, x, y) {
	setElementPosition(element, x, y);

	return;
}

function alphaElement(element, opacity) {
	element.style["opacity"] = opacity;

	return;
}

function showElement(element) {
	element.style["opacity"] = 1;
}

function hideElement(element) {
	element.style["opacity"] = 0;
}

function scaleElement(element, scale, opacity, xOrigin, yOrigin) {
	var origin = (xOrigin && yOrigin) ? xOrigin + " " + yOrigin : "50% 50%";
	var transforms = ["transform", "-ms-transform", "-webkit-transform", "-o-transform", "-moz-transform"];

	element.style['transform-style'] = "preserve-3d";
	for(var i = 0; i < transforms.length; i++) {
		var trans = transforms[i];
		element.style[trans + "-origin"] = origin;
		element.style[trans] = "scale("+scale+")";
	}
	element.style["opacity"] = opacity;

	return;
}

function rotateElement(element, deg) {
	var origin = "50% 50%";
	var transforms = ["transform", "-ms-transform", "-webkit-transform", "-o-transform", "-moz-transform"];

	element.style['transform-style'] = "preserve-3d";
	for(var i = 0; i < transforms.length; i++) {
		var trans = transforms[i];
		element.style[trans + "-origin"] = origin;
		element.style[trans] = "rotate("+deg+"deg)";
	}

	return;
}

function AnimationVTranslate(showWin) {
	Animation.apply(this, arguments);

	this.beforeRun = function() {
		this.range = this.frontH;
		this.canvas = this.canvasElement.getContext("2d");

		return true;;
	}

	this.step = function(percent) {
 		var x = this.frontX;
		var y = this.frontY;
		var w = this.frontW;
		var dy = this.range * percent;
		var h = this.showWin ? dy : (this.range - dy);		
		var oy = this.showWin ? (this.frontY + this.range - dy) : (this.frontY + dy);

        var canvas = this.canvas;
        canvas.save();
        var wm = this.oldWin.getWindowManager();
        canvas.translate(wm.x, wm.y);
 
        if(this.showWin) {
            canvas.translate(0, oy - this.h);
            canvas.save();
        	canvas.clipRect(0, 0, this.w, this.h);
            this.oldWin.paintSelf(canvas);
            canvas.restore();

            canvas.translate(0, this.h);
            canvas.save();
        	canvas.clipRect(0, 0, this.w, this.h);
            this.newWin.paintSelf(canvas);
            canvas.restore();
        } else {
            canvas.translate(0, oy - this.h);
            canvas.save();
        	canvas.clipRect(0, 0, this.w, this.h);
            this.newWin.paintSelf(canvas);
            canvas.restore();
            
            canvas.translate(0, this.h);
            canvas.save();
        	canvas.clipRect(0, 0, this.w, this.h);
            this.oldWin.paintSelf(canvas);
            canvas.restore();
        }
        canvas.restore();
    
		return true;
	}
}

function AnimationHTranslate() {
	Animation.apply(this, arguments);
	
	this.leftToRight = true;

	this.beforeRun = function() {
		var range = this.newWin.w;
	
		this.range = range;

		this.start = range - this.range;
		this.canvas = this.canvasElement.getContext("2d");
	}

	this.toLeft = function() {
		this.leftToRight = true;

		return;
	}
	
	this.toRight = function() {
		this.leftToRight = false;

		return;
	}

	this.step = function(percent) {
		var ox = 0;
        if(this.leftToRight) {
			ox = this.start + this.range * percent;
		}
		else {
			ox = this.w - this.range * percent - this.start;
		}

		if(this.lastOffset === ox) {
			return true;
		}
        var canvas = this.canvas;
        canvas.save();
        var wm = this.oldWin.getWindowManager();
        canvas.translate(wm.x, wm.y);

        if(this.leftToRight) {
            canvas.translate(-ox, 0); 
            canvas.save();
        	canvas.clipRect(0, 0, this.w, this.h);
            this.oldWin.paintSelf(canvas);
			canvas.restore();

            canvas.translate(this.w, 0); 
            canvas.save();
        	canvas.clipRect(0, 0, this.w, this.h);
            this.newWin.paintSelf(canvas);
			canvas.restore();
        } else {
            canvas.translate(-ox, 0); 
            canvas.save();
        	canvas.clipRect(0, 0, this.w, this.h);
            this.newWin.paintSelf(canvas);
			canvas.restore();

            canvas.translate(this.w, 0); 
            canvas.save();
        	canvas.clipRect(0, 0, this.w, this.h);
            this.oldWin.paintSelf(canvas);
			canvas.restore();
        }
        canvas.restore();
		this.lastOffset = ox;
		return true;
	}
}

function AnimationScale() {
	Animation.apply(this, arguments);

	this.to = 1.0;
	this.from = 0;
	this.frontX = 0;
	this.frontY = 0;
	this.frontW = 0;
	this.frontH = 0;

	this.setRange = function(from, to) {
		this.to = to;
		this.from = from;

		return;
	}

	this.beforeRun = function() {
		this.canvas = this.canvasElement.getContext("2d");
	}

	this.step = function(percent) {
		var scale = this.from + percent * (this.to - this.from);
		var alpha = this.to > this.from ? percent : (1-percent);
		var canvas = this.canvas;
        var dx = (this.w >> 1);
        var dy = (this.h >> 1);
        
        canvas.save();
        var wm = this.oldWin.getWindowManager();
        canvas.translate(wm.x, wm.y);
        canvas.clipRect(0, 0, this.w, this.h);
        
        if(this.to > this.from) { 
            this.oldWin.paintSelf(canvas);

            canvas.globalAlpha = alpha; 
            canvas.translate(dx, dy);
            canvas.scale(scale, scale);
            canvas.translate(-dx, -dy);
            this.newWin.paintSelf(canvas);
        } else {
            this.newWin.paintSelf(canvas);

            canvas.globalAlpha = alpha; 
            canvas.translate(dx, dy);
            canvas.scale(scale, scale);
            canvas.translate(-dx, -dy);
            this.oldWin.paintSelf(canvas);
        }
        canvas.restore();
		//console.log("Step: " + percent + " alpha=" + alpha + " scale=" + scale);
		return true;
	}
}

function AnimationAlpha() {
	Animation.apply(this, arguments);

	this.to = 1.0;
	this.from = 0;
	this.frontX = 0;
	this.frontY = 0;
	this.frontW = 0;
	this.frontH = 0;

	this.setRange = function(from, to) {
		this.to = to;
		this.from = from;

		return;
	}

	this.beforeRun = function() {
		this.canvas = this.canvasElement.getContext("2d");
	}

	this.step = function(percent) {
		var alpha = this.from + percent * (this.to - this.from);

		var canvas = this.canvas;
		canvas.save();
        var wm = this.oldWin.getWindowManager();
        canvas.translate(wm.x, wm.y);
        canvas.clipRect(0, 0, this.w, this.h);
 
        if(this.to > this.from) {
            this.oldWin.paintSelf(canvas);
            canvas.globalAlpha = alpha;
            this.newWin.paintSelf(canvas);
        } else {
            this.newWin.paintSelf(canvas);
            canvas.globalAlpha = alpha;
            this.oldWin.paintSelf(canvas);
        }
        canvas.restore();
		return true;
	}
}

function AnimationMove(showWin) {
	Animation.apply(this, arguments);

	this.beforeRun = function() {
		this.range = this.frontH;
		this.canvas = this.canvasElement.getContext("2d");

		return true;;
	}

	this.step = function(percent) {
		var x = this.frontX;
		var y = this.frontY;
		var w = this.frontW;
		var dy = this.range * percent;
		var h = this.showWin ? dy : (this.range - dy);		
		var oy = this.showWin ? (this.frontY + this.range - dy) : (this.frontY + dy);
	
        var canvas = this.canvas;
        canvas.save();
        var wm = this.oldWin.getWindowManager();
        canvas.translate(wm.x, wm.y);
        canvas.clipRect(0, 0, this.w, this.h);
 
        if(showWin) {
            this.oldWin.paintSelf(canvas);
            canvas.translate(0, oy);
            this.newWin.paintSelf(canvas);
        } else {
            this.newWin.paintSelf(canvas);
            canvas.translate(0, oy);
            this.oldWin.paintSelf(canvas);
        }
        canvas.restore();    

		return true;
	}
}
/*
 * File: ui-element.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: UIElement
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIElement() {
	return;
}

UIElement.IMAGE_DISPLAY_CENTER = WImage.DISPLAY_CENTER;
UIElement.IMAGE_DISPLAY_TILE   = WImage.DISPLAY_TILE;
UIElement.IMAGE_DISPLAY_9PATCH = WImage.DISPLAY_9PATCH;
UIElement.IMAGE_DISPLAY_SCALE  = WImage.DISPLAY_SCALE;
UIElement.IMAGE_DISPLAY_AUTO = WImage.DISPLAY_AUTO;
UIElement.IMAGE_DISPLAY_DEFAULT = WImage.DISPLAY_DEFAULT;
UIElement.IMAGE_DISPLAY_SCALE_KEEP_RATIO  = WImage.DISPLAY_SCALE_KEEP_RATIO;
UIElement.IMAGE_DISPLAY_TILE_V = WImage.DISPLAY_TILE_V;
UIElement.IMAGE_DISPLAY_TILE_H = WImage.DISPLAY_TILE_H;
UIElement.IMAGE_DISPLAY_AUTO_SIZE_DOWN = WImage.DISPLAY_AUTO_SIZE_DOWN;
UIElement.IMAGE_DISPLAY_FIT_WIDTH = WImage.DISPLAY_FIT_WIDTH;
UIElement.IMAGE_DISPLAY_FIT_HEIGHT = WImage.DISPLAY_FIT_HEIGHT;
UIElement.IMAGE_DISPLAY_3PATCH_V = WImage.DISPLAY_3PATCH_V;
UIElement.IMAGE_DISPLAY_3PATCH_H = WImage.DISPLAY_3PATCH_H;

UIElement.HTEXT_ALIGNS = ["left", "center", "right"];
UIElement.VTEXT_ALIGNS = ["top", "middle", "bottom"];

UIElement.IMAGE_DISPLAY_NAMES = ["incenter", "tile", "9patch", "scale", "auto", "default", "scale(keep ratio)", "vtile", "htile", "auto-size-down", "fit-width","fit-height"];

UIElement.X_FIX_LEFT = 0;
UIElement.X_FIX_RIGHT = 1;
UIElement.X_SCALE = 2;
UIElement.X_CENTER_IN_PARENT = 3;
UIElement.X_LEFT_IN_PARENT	 = 4;
UIElement.X_RIGHT_IN_PARENT  = 5;
UIElement.X_AFTER_PREV       = 6;
//UIElement.X_LAYOUT_NAMES = ["fix_left", "fix_right", "scale", "center_in_parent", "left_in_parent", "right_in_parent", "after_prev"];
UIElement.X_LAYOUT_NAMES = ["fix_left", "fix_right", "scale", "center_in_parent", "left_in_parent", "right_in_parent"];

UIElement.Y_FIX_TOP = 0;
UIElement.Y_FIX_BOTTOM = 1;
UIElement.Y_SCALE = 2;
UIElement.Y_MIDDLE_IN_PARENT = 3;
UIElement.Y_TOP_IN_PARENT	 = 4;
UIElement.Y_BOTTOM_IN_PARENT = 5;
UIElement.Y_AFTER_PREV       = 6;
//UIElement.Y_LAYOUT_NAMES = ["fix_top", "fix_bottom", "scale", "middle_in_parent", "top_in_parent", "bottom_in_parent", "after_prev"];
UIElement.Y_LAYOUT_NAMES = ["fix_top", "fix_bottom", "scale", "middle_in_parent", "top_in_parent", "bottom_in_parent"];

UIElement.WIDTH_FIX = 0;
UIElement.WIDTH_SCALE = 1;
UIElement.WIDTH_FILL_PARENT = 2;
UIElement.WIDTH_FILL_AVAILABLE = 3;
UIElement.WIDTH_FILL_TO_PARENT_RIGHT = 4;

UIElement.HEIGHT_FIX = 0;
UIElement.HEIGHT_SCALE = 1;
UIElement.HEIGHT_FILL_PARENT = 2;
UIElement.HEIGHT_FILL_AVAILABLE = 3;
UIElement.HEIGHT_KEEP_RATIO_WITH_WIDTH = 4;
UIElement.HEIGHT_FILL_TO_PARENT_BOTTOM = 5;

UIElement.WIDTH_LAYOUT_NAMES = ["fix", "scale", "fill_parent"];
UIElement.HEIGHT_LAYOUT_NAMES = ["fix", "scale", "fill_parent"];
//UIElement.WIDTH_LAYOUT_NAMES = ["fix", "scale", "fill_parent", "fill_avaible", "fill_to_parent_right"];
//UIElement.HEIGHT_LAYOUT_NAMES = ["fix", "scale", "fill_parent", "fill_avaible", "keep_ratio_with_width", "fill_to_parent_bottom"];

UIElement.IMAGE_DEFAULT	   = "default_bg";
UIElement.IMAGE_MASK	   = "mask_fg";
UIElement.IMAGE_NORMAL	   = "normal_bg";
UIElement.IMAGE_NORMAL_BG  = "normal_bg";
UIElement.IMAGE_FOCUSED	   = "focused_bg";
UIElement.IMAGE_ACTIVE	   = "active_bg";
UIElement.IMAGE_POINTER_OVER = "pointer_over_bg";
UIElement.IMAGE_DISABLE	   = "disable_bg";
UIElement.IMAGE_DISABLE_FG = "disable_fg";
UIElement.IMAGE_NORMAL_FG  = "normal_fg";
UIElement.IMAGE_ACTIVE_FG  = "active_fg";
UIElement.IMAGE_CURRENT_PAGE_BG  = "current_page_bg";
UIElement.IMAGE_CURRENT_PAGE_FG  = "current_page_fg";
UIElement.IMAGE_NOT_CURRENT_PAGE_BG  = "not_current_page_bg";
UIElement.IMAGE_NOT_CURRENT_PAGE_FG  = "not_current_page_fg";
UIElement.IMAGE_ON_FG	   = "on_fg";
UIElement.IMAGE_OFF_FG	   = "off_fg";
UIElement.IMAGE_ON_BG	   = "on_bg";
UIElement.IMAGE_OFF_BG	   = "off_bg";
UIElement.IMAGE_CHECKED_BG	   = "checked_bg";
UIElement.IMAGE_UNCHECK_BG	   = "unchecked_bg";
UIElement.IMAGE_CHECKED_FG	   = "checked_fg";
UIElement.IMAGE_UNCHECK_FG	   = "unchecked_fg";
UIElement.IMAGE_ON_FOCUSED	   = "focused_on_bg";
UIElement.IMAGE_ON_ACTIVE	   = "active_on_bg";
UIElement.IMAGE_OFF_FOCUSED	   = "focused_off_bg";
UIElement.IMAGE_OFF_ACTIVE	   = "active_off_bg";
UIElement.IMAGE_NORMAL_DRAG    = "normal_drag";
UIElement.IMAGE_DELETE_ITEM    = "delete_item_icon";
UIElement.IMAGE_CHECKED_ITEM   = "checked_item_icon";
UIElement.IMAGE_POINT          = "point_img";
UIElement.IMAGE_POINT1         = "point1_img";
UIElement.IMAGE_POINT2         = "point2_img";
UIElement.IMAGE_POINT3         = "point3_img";
UIElement.IMAGE_POINT4         = "point4_img";
UIElement.IMAGE_TIPS1          = "tips_img_1";
UIElement.IMAGE_TIPS2          = "tips_img_2";
UIElement.IMAGE_TIPS3          = "tips_img_3";
UIElement.IMAGE_TIPS4          = "tips_img_4";
UIElement.IMAGE_TIPS5          = "tips_img_5";

UIElement.IMAGE_V_SCROLL_BAR_BG = "v-scroll-bar-bg";
UIElement.IMAGE_V_SCROLL_BAR_FG = "v-scroll-bar-fg";
UIElement.IMAGE_H_SCROLL_BAR_BG = "h-scroll-bar-bg";
UIElement.IMAGE_H_SCROLL_BAR_FG = "h-scroll-bar-fg";

UIElement.ITEM_BG_NORMAL  = "item_bg_normal";
UIElement.ITEM_BG_ACTIVE  = "item_bg_active";
UIElement.ITEM_BG_CURRENT_NORMAL = "item_bg_current_normal";
UIElement.ITEM_BG_CURRENT_ACTIVE = "item_bg_current_active";

UIElement.TEXT_ALIGN_CENTER = 0;
UIElement.TEXT_ALIGN_LEFT	= 0;
UIElement.TEXT_ALIGN_RIGHT = 0;
UIElement.TEXT_ALIGN_NAMES = ["center", "left", "right"];

UIElement.ORIGIN_UP = 1;
UIElement.ORIGIN_DOWN = 2;
UIElement.ORIGIN_LEFT = 3;
UIElement.ORIGIN_RIGHT = 4;
UIElement.ORIGIN_UP_LEFT = 5;
UIElement.ORIGIN_UP_RIGHT = 6;
UIElement.ORIGIN_DOWN_LEFT = 7;
UIElement.ORIGIN_DOWN_RIGHT = 8;
UIElement.ORIGIN_MIDDLE_CENTER = 9;

UIElement.STATE_STOP = 1;
UIElement.STATE_RUNNING = 2;
UIElement.STATE_PAUSED = 3;

UIElement.prototype = new RShape();
TEventTarget.apply(UIElement.prototype);

UIElement.Style = function() {
	this.lineWidth = 2;
	this.lineColor = "Orange";
	this.fillColor = "White";
	this.textColor = "Blue";
	this.fontSize = 24;

	return;
}

UIElement.Style.prototype = new ShapeStyle();

UIElement.prototype.isUIElement = true;
UIElement.prototype.hasChildren = true;
UIElement.prototype.isContainer = true;

UIElement.disableGetRelativePathOfURL = false;

UIElement.prototype.addResource = function(url) {
	if(!this.resources) {
		this.resources = [];
	}

	if(this.resources.indexOf(url) < 0) {
		this.resources.push(url);
	}

	return;
}

UIElement.prototype.setDefaultStyle = function() {
	this.style = new UIElement.Style();

	return;
}

UIElement.prototype.clone = function() {
	var obj = null;
	
	UIElement.disableGetRelativePathOfURL = true;
	obj = this.dup();
	UIElement.disableGetRelativePathOfURL = false;

	obj.setVisible(true);
	obj.xAttr = UIElement.X_FIX_LEFT;
	obj.yAttr = UIElement.Y_FIX_TOP;
	obj.widthAttr = UIElement.WIDTH_FIX;
	obj.heightAttr = UIElement.HEIGHT_FIX;
	obj.uid = UIElement.uidStart++;

	if(this.anchor) {
		obj.setAnchor(this.anchor.x, this.anchor.y);
	}

	return obj;
}

UIElement.prototype.getRelativePathOfURL = function(url) {
	if(UIElement.disableGetRelativePathOfURL || !url) {
		return url;
	}

	return url.toRelativeURL();
}

UIElement.prototype.setFreePosition = function(value) {
	this.freePosition = value;

	return;
}

UIElement.prototype.fixChildPosition = function(child) {
	return;
}

UIElement.prototype.setFreeSize = function(value) {
	this.freeSize = value;
	
	return;
}

UIElement.prototype.fixChildSize = function(child) {
	return;
}

UIElement.prototype.onInit = function() {
	this.callOnInitHandler();

	if(this.dataSourceUrl && this.dataSourceUrl.length > 5) {
		this.bindDataUrl(this.dataSourceUrl);
	}

	return;
}

UIElement.prototype.onDeinit = function() {
	if(this.animatingInfo) {
		this.stopAnimation(true);
	}

	return;
}

UIElement.prototype.onWindowOpen = function() {
	if(this.animations && this.defaultAnimationName) {
		var config = this.animations[this.defaultAnimationName];
		if(config) {
			this.animate(config);
		}
	}

	return;
}

UIElement.prototype.initChildren = function() {
	var children = this.children;
	var n = this.children.length;

	for(var i = 0; i < n; i++) {
		var iter = children[i];
		iter.init();
	}

	return;
}

UIElement.prototype.init = function() {
	try {
		this.onInit();
	}catch(e) {
		console.log("onInit Failed:" + e.message  + "\n" + e.stack);
	}
	this.initChildren();

	return;
}

UIElement.prototype.deinit = function() {
	var i = 0;
	var iter = null;
	var children = this.children;
	var n = this.children.length;

	for(i = 0; i < n; i++) {
		iter = children[i];
		iter.deinit();
	}
	
	this.onDeinit();

	return;
}

UIElement.prototype.onModeChanged = function() {
	return;
}

UIElement.prototype.userRemovable = function() {
	return this.isInDesignMode();
}

UIElement.prototype.postRedraw = function() {
	if(this.view) {
		this.view.postRedrawAll();
	}

	return this;
}

UIElement.prototype.requestRedraw = UIElement.prototype.postRedraw; 

UIElement.prototype.setMode = function(mode, recursive) {
	this.mode = mode;

	if(this.type !== "ui-menu-bar") {
		if(this.isInDesignMode()) {
			this.setVisible(true);
		}
	}

	if(recursive) {
		for(var i = 0; i < this.children.length; i++) {
			var child = this.children[i];
			if(child.isContainer) {
				child.setMode(mode, true);
			}
		}
	}
	this.onModeChanged();

	return this;
}

UIElement.prototype.calcChildrenRange = function() {
	return this.calcShapesRange(this.children);
}

UIElement.prototype.calcShapesRange = function(shapes) {
	var x = 0;
	var y = 0;
	var w = 0;
	var h = 0;

	var r = 0;
	var b = 0;
	var t = 10000;
	var l = 10000;
	var range = {};

	if(shapes.length > 0) {
		for(var i = 0; i < shapes.length; i++) {
			var iter = shapes[i];
			
			x = iter.getX();
			y = iter.getY();
			w = iter.getWidth();
			h = iter.getHeight();

			if(x < l) l = x;
			if(y < t) t = y;
			if((x + w) > r) r = x + w;
			if((y + h) > b) b = y + h;
		}

		range.l = l;
		range.r = r;
		range.t = t;
		range.b = b;
	}
	else {
		range.l = 0;
		range.r = 0;
		range.t = 0;
		range.b = 0;
	}

	return range;
}

UIElement.prototype.relayoutChildren = function() {
}

UIElement.prototype.onSized = function() {
	this.updateLayoutParams();

	return;
}

UIElement.prototype.findSelectedShapes = function(shapes) {
	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		if(child.selected) {
			shapes.push(child);
			continue;
		}
	
		if(child.isContainer) {
			child.findSelectedShapes(shapes);
		}
	}

	return;
}

UIElement.onSelected = function(shape) {
}

UIElement.prototype.onSelectChanged = function() {
	if(this.selected) {
		UIElement.onSelected(this);
	}

	return;
}

UIElement.prototype.setSelected = function(selected) {
	if(!selected) {
		for(var i = 0; i < this.children.length; i++) {
			var child = this.children[i];
			child.setSelected(false);
		}
	}
	
	if(selected) {
		this.selectedTime = Date.now();
	}

	if(this.selected === selected) {
		return;
	}

	this.targetShape = null;
	this.selected = selected;
	this.onSelectChanged();

	return;
}

UIElement.prototype.setPointerEventTarget = function(shape) {
	this.pointerEventTarget = shape;

	return;
}

UIElement.prototype.getPointerEventTarget = function() {
	return this.pointerEventTarget ? this.pointerEventTarget : this.targetShape;
}

UIElement.prototype.foreachImage = function(onVisit) {
	for(var key in this.images) {
		if(key !== "display") {
			var src = this.getImageSrcByType(key);
			onVisit(key, src);
		}
	}

	return;
}

UIElement.prototype.forEach = function(onVisit) {
	if(onVisit(this)) {
		return true;
	}

	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		iter.forEach(onVisit);
	}

	return false;
}

UIElement.prototype.getAllTabStopElements = function() {
	var arr = [];
	var win = this.getWindow();

	if(win) {
		win.forEach(function(el) {
			if(el.isUIButton || el.isUIEdit) {
				arr.push(el);
			}
		});
	}

	return arr;
}

UIElement.prototype.findNextTabStop = function() {
	var arr = this.getAllTabStopElements();
	if(!arr.length) {
		return;
	}

	var index = arr.indexOf(this);
	if(index >= 0 && (index + 1) < arr.length) {
		return arr[index+1];
	}
	else {
		return arr[0];
	}
}

UIElement.prototype.moveToNextStop = function() {
	var el = this.findNextTabStop();


	return;
}

UIElement.prototype.isPointerOverShape = function() {
	return this.parentShape && this.parentShape.pointerOverShape === this;
}

UIElement.prototype.setPointerOverShape = function(shape) {
	if(this.pointerOverShape !== shape) {
		if(this.pointerOverShape) {
			this.pointerOverShape.setPointerOverShape(null);
		}

		this.pointerOverShape = shape;
		this.postRedraw();
	}

	return;
}

UIElement.prototype.setTarget = function(shape) {
	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		if(child !== shape) {
			child.setSelected(false);
		}
	}

	this.targetShape = shape;
	this.selected = !shape;
	this.onSelectChanged();

	return this;
}

UIElement.prototype.getTarget = function() {
	return this.targetShape;
}

UIElement.prototype.initContainerShape = function(type) {
	this.children = new Array();

	RShapeInit(this, type);
	
	this.mode = Shape.MODE_EDITING;
	this.rectSelectable = true;

	return this;
}

UIElement.prototype.defaultDispatchPointerDownToChildren = function(p) {
	var targetShape = this.targetShape;
	if(targetShape && targetShape.isInDesignMode()) {
		var hitTestResult = this.hitTest(p);

		if(hitTestResult != Shape.HIT_TEST_MM && hitTestResult != Shape.HIT_TEST_NONE) {
			if(this.selected) {
				this.setTarget(null);
				return true;
			}
			if(this.targetShape.onPointerDown(p)) {
				return true;
			}
		}
	}

	var arr = this.children;
	var n = arr.length;

	for(var i = n; i > 0; i--) {
		var child = arr[i-1];
		if(child.visible && child.onPointerDown(p)) {
			this.setTarget(child);
			
			if(!child.shouldPropagatePointerEvent()) {
				return true;
			}
		}
	}

	return false;
}

UIElement.prototype.dispatchPointerDownToChildren = function(p) {
	return this.defaultDispatchPointerDownToChildren(p);
}

UIElement.prototype.onPointerDownEditing = function(point, beforeChild) {
	return;
}

UIElement.prototype.onPointerDownRunning = function(point, beforeChild) {
	if(!this.pointerDown) {
		return;
	}

	return this.callOnPointerDownHandler(point, beforeChild);
}

UIElement.prototype.onPointerMoveEditing = function(point, beforeChild) {
	return;
}

UIElement.prototype.onPointerMoveRunning = function(point, beforeChild) {
	return this.callOnPointerMoveHandler(point, beforeChild);
}

UIElement.prototype.onPointerUpEditing = function(point, beforeChild) {
	return;
}

UIElement.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(!this.pointerDown) {
		return;
	}

	return this.callOnPointerUpHandler(point, beforeChild);
}

UIElement.prototype.onDoubleClick = function(point) {
	if(this.targetShape) {
		var p = this.translatePoint(point);
		return this.targetShape.onDoubleClick(p);
	}
	else {
		return this.callOnDoubleClickHandler(point);
	}
}

UIElement.prototype.onGesture = function(gesture) {
	if(this.popupWindow) {
		return;
	}

	if(this.targetShape) {
		return this.targetShape.onGesture(gesture);
	}

	return;
}

UIElement.prototype.onLongPress = function(point) {
	if(!this.pointerDown) {
		return;
	}

	this.longPressed = true;
	this.callOnLongPressHandler(point);
	if(this.targetShape) {
		var p = this.translatePoint(point);
		return this.targetShape.onLongPress(p);
	}

	return;
}

UIElement.prototype.onClick = function(point, beforeChild) {
	if(beforeChild || !this.pointerDown) {
		return;
	}

	return this.callOnClickHandler(point);
}

UIElement.prototype.translatePoint = function(point) {
	var p = {x : (point.x - this.left), y : (point.y - this.top)};

	return p;
}

UIElement.prototype.setCanRectSelectable = function(rectSelectable, recursive) {
	this.rectSelectable = rectSelectable;

	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		child.setCanRectSelectable(rectSelectable, recursive);
	}

	return;
}

UIElement.prototype.canRectSelectable = function() {
	return this.isUIWindow || this.isUIPage;
}

UIElement.prototype.setDraggable = function(value) {
	if(this.draggable === value) {
		return;
	}

	this.draggable = value;

	if(value) {
		this.addEventNames(["onDragStart", "onDragging", "onDragEnd"]);
	}
	else {
		this.removeEventNames(["onDragStart", "onDragging", "onDragEnd"]);
	}

	return;
}

UIElement.prototype.onDragStart = function() {
	console.log("Drag Start");
	this.callOnDragStartHandler();
	return;
}

UIElement.prototype.onDragging = function() {
	console.log("Dragging");
	this.callOnDragingHandler();

	return;
}

UIElement.prototype.onDragEnd = function() {
	console.log("Drag End");
	this.callOnDragEndHandler();

	return;
}

UIElement.prototype.dragMove = function(dx, dy, point) {
	this.left = this.left + dx;
	this.top = this.top + dy;
	
	this.onDragging(point);

	return;
}

UIElement.prototype.handleDragMove = function(point) {
	var dx = this.getMoveDeltaX();
	var dy = this.getMoveDeltaY();

	if(!this.dragging) {
		var absdx = this.getMoveAbsDeltaX();
		var absdy = this.getMoveAbsDeltaY();
		if(Math.abs(absdx) > 5 || Math.abs(absdy) > 5) {
			this.dragging = true;
			this.onDragStart();
			dx = absdx;
			dy = absdy;
		}
	}

	if(this.dragging) {
		this.dragMove(dx, dy, point);
		if(this.parentShape) {
			this.parentShape.onChildDragging(this, point);
		}
	}

	return;
}

UIElement.prototype.onChildDragging = function(child, point) {

	return;
}

UIElement.prototype.onChildDragged = function(child, point) {
	this.sortChildren();
	this.relayoutChildren("default");

	return;
}

UIElement.prototype.handleDragUp = function(point) {
	this.onDragEnd();
	delete this.dragging;

	if(this.parentShape) {
		this.parentShape.onChildDragged(this, point);
	}

	return;
}

UIElement.prototype.animMove = function(x, y) {
	if(!this.dragging) {
		this.animate({x:x, y:y});
	}
	return;
}

UIElement.getIntFromConfig = function(config, name, defValue) {
	var value = config[name];

	if(!value && value !== 0) {
		return defValue;
	}
	
	if(typeof value === "string") {
		if(value[1] === '+' || value[1] === '-') {
			value = defValue + parseInt(value.substr(1));
		} else {
			value = parseInt(value);
		}
	}

	return value;
}

UIElement.prototype.stopAnimation = function(callOnDone) {
	if(!this.animatingInfo) {
		return this;
	}

	if(callOnDone) {
		this.stepAnimation({needRedraw:0}, Date.now() + 100000000);
	}
	this.animatingInfo = null;

	return this;
}


UIElement.prototype.animate = function(config, onAnimationDone, onAnimationStep, actionWhenBusy) {
	var me = this;
	var deferred = Deferred();
	var onAnimationStep = onAnimationStep || config.onStep;
	var onAnimationDone = onAnimationDone || config.onDone;

	this.doAnimate(config, function() {
		if(typeof onAnimationDone === 'function') {
			onAnimationDone.apply(me, arguments);
		}
		deferred.resolve();
	}, function() {
		if(typeof onAnimationStep === 'function') {
			return onAnimationStep.apply(me, arguments);
		}
		return true;
	}, actionWhenBusy);

	return deferred.promise;
}

UIElement.prototype.doAnimate = function(config, onAnimationDone, onAnimationStep, actionWhenBusy) {
	if(typeof config === "string") {
		config = this.animations[config];
	}

	if(!this.parentShape) {
		UIElement.logWarning("animate error - parentShape is null.");
		return false;
	}

	if(this.dragging) {
		UIElement.logWarning("animate error - busy.");
		return false;
	}

	var animatingInfo = this.animatingInfo;
	if(animatingInfo) {
		var busyAction = actionWhenBusy || config.actionWhenBusy || "replace";

		if(busyAction === "replace") {
			this.callOnAnimateDone(animatingInfo);
//			UIElement.logNotice("busy action - replace current animation.");
		}
		else if(busyAction === "append") {
			var c = 0;
			for(var iter = animatingInfo; iter; iter = iter.next) {
				if(iter === config) {
					UIElement.logWarning("animate error - already appended.");
					return false;
				}
			
				if(!iter.next || c > 30) {
					iter.next = config;
					break;
				}
				c++;
			}
			UIElement.logNotice("busy action - append animation.");
			return true;
		}
		else {
			UIElement.logWarning("animate error - busy.");
			return false;
		}
	}

	if(!config) {
		UIElement.logWarning("animate error - config is null.");
		return false;
	}

	var x = this.getX();
	var y = this.getY();
	var w = this.w;
	var h = this.h;

	var duration = config.duration || 800;
	var xStart = UIElement.getIntFromConfig(config, "xStart", x);
	var xEnd = UIElement.getIntFromConfig(config, "xEnd", x);
	var yStart = UIElement.getIntFromConfig(config, "yStart", y);
	var yEnd = UIElement.getIntFromConfig(config, "yEnd", y);

	var wStart = UIElement.getIntFromConfig(config, "wStart", w);
	var wEnd = UIElement.getIntFromConfig(config, "wEnd", w);
	var hStart = UIElement.getIntFromConfig(config, "hStart", h);
	var hEnd = UIElement.getIntFromConfig(config, "hEnd", h);

	var valueStart = config.valueStart || 0;
	var valueEnd   = config.valueEnd   || 0;

	var opacityStart = (config.opacityStart || config.opacityStart === 0) ? config.opacityStart : this.opacity;
	var opacityEnd = (config.opacityEnd || config.opacityEnd === 0) ? config.opacityEnd : this.opacity;
	var rotationStart = (config.rotationStart || config.rotationStart === 0) ? config.rotationStart : this.rotation;
	var rotationEnd = (config.rotationEnd || config.rotationEnd === 0) ? config.rotationEnd : this.rotation;
	var scaleXStart = (config.scaleXStart || config.scaleXStart === 0) ? config.scaleXStart : this.getScaleX();
	var scaleXEnd = (config.scaleXEnd || config.scaleXEnd === 0) ? config.scaleXEnd : this.getScaleX();
	var scaleYStart = (config.scaleYStart || config.scaleYStart === 0) ? config.scaleYStart : this.getScaleY();
	var scaleYEnd = (config.scaleYEnd || config.scaleYEnd === 0) ? config.scaleYEnd : this.getScaleY();

	if(config.scaleEnd !== undefined) {
		scaleXEnd = config.scaleEnd;
		scaleYEnd = config.scaleEnd;
	}

	if(config.scaleStart !== undefined) {
		scaleXStart = config.scaleStart;
		scaleYStart = config.scaleStart;
	}
	
	if(config.scale !== undefined) {
		scaleXEnd = config.scale;
		scaleYEnd = config.scale;
	}
	
	if(config.scaleX !== undefined) {
		scaleXEnd = config.scaleX;
	}
	
	if(config.scaleY !== undefined) {
		scaleYEnd = config.scaleY;
	}

	if(config.x !== undefined) {
		xEnd = config.x;	
	}
	
	if(config.y !== undefined) {
		yEnd = config.y;	
	}

	if(config.opacity !== undefined) {
		opacityEnd = config.opacity;
	}

	if(config.rotation !== undefined) {
		rotationEnd = config.rotation;
	}

	var onDone = onAnimationDone || config.onDone;
	var onStep = onAnimationStep || config.onStep;

	var xRange = xEnd - xStart;
	var yRange = yEnd - yStart;
	var scaleXRange = scaleXEnd - scaleXStart;
	var scaleYRange = scaleYEnd - scaleYStart;
	var opacityRange = opacityEnd - opacityStart;
	var rotationRange = rotationEnd - rotationStart;
	var valueRange = valueEnd - valueStart;

	var interpolator =  null;
	if(typeof config.interpolator === "string") {
		interpolator = AnimationFactory.createInterpolator(config.interpolator);
	}
	else {
		interpolator = config.interpolator ? config.interpolator : new DecelerateInterpolator();
	}

	if(!xRange) {
		this.setX(xStart);
		xEnd = xStart;
	}

	if(!yRange) {
		this.setY(yStart);
		yEnd = yStart;
	}

    if(!scaleXRange) {
        this.setScaleX(scaleXStart);
        scaleXEnd = scaleXStart;
    }

    if(!scaleYRange) {
        this.setScaleY(scaleYStart);
        scaleYEnd = scaleYStart;
    }

    if(!opacityRange && opacityStart) {
        this.setOpacity(opacityStart);
        opacityEnd = opacityStart;
    }

    if(!rotationRange) {
        this.setRotation(rotationStart);
        rotationEnd = rotationStart;
    }

	var c = {};

	c.xRange = xRange;
	c.yRange = yRange;
	c.scaleXRange = scaleXRange;
	c.scaleYRange = scaleYRange;
	c.opacityRange= opacityRange;
	c.rotationRange = rotationRange;
	c.valueRange = valueRange;
	
	c.wStart = wStart;
	c.hStart = hStart;
	c.xStart = xStart;
	c.yStart = yStart;
	c.scaleXStart = scaleXStart;
	c.scaleYStart = scaleYStart;
	c.opacityStart= opacityStart;
	c.rotationStart = rotationStart;
	c.valueStart = valueStart;

	c.startTime = Date.now();
	c.duration = duration;
	c.onDone = onDone;
	c.onStep = onStep;
	c.interpolator = interpolator;
	c.next = config.next;
	c.name = config.name;
	c.now = c.startTime;

	if(config.delay) {
		c.startTime += config.delay;
	}

	this.animatingInfo = c;
	this.postRedraw();

	return true;
}

UIElement.prototype.callOnAnimateDone = function(config) {
	this.animating = false;
	this.animatingInfo = null;

	var onDone = config.onDone;
	if(onDone) {
		onDone.call(this, config.name);
	}
	
	if(!this.parentShape) return false;

	this.callOnAnimateDoneHandler(config.name);

	if(!this.parentShape) return false;

	var next = config.next;

	if(next) {
		if(typeof next === "string") {
			if(!this.animations[next]) {
				return false;
			}
		}

		//this.animate(next, next.onDone || config.onDone || '', 
		//	next.onStep || config.onStep || '', next.actionWhenBusy || '');
		this.animate(next);

		return true;
	}

	return false;
}

UIElement.prototype.isAnimating = function() {
	return this.animatingInfo && this.parentShape;
}

UIElement.prototype.stepAnimation = function(canvas, now) {
	var c = this.animatingInfo;
	
	if(!c || !this.parentShape) return;

	c.now += canvas.timeStep;
	if(!now) {
		now = c.now;
	}
	
	canvas.needRedraw++;
	if(c.startTime > now) {
		return;
	}

	if(!this.visible) {
		this.visible = true;
	}

	var xRange = c.xRange;
	var yRange = c.yRange;
	var valueRange 	  = c.valueRange;
	var scaleXRange   = c.scaleXRange;
	var scaleYRange   = c.scaleYRange;
	var opacityRange  = c.opacityRange;
	var rotationRange = c.rotationRange;
	
	var wStart = c.wStart;
	var hStart = c.hStart;
	var xStart = c.xStart;
	var yStart = c.yStart;
	var scaleXStart   = c.scaleXStart;
	var scaleYStart   = c.scaleYStart;
	var opacityStart  = c.opacityStart;
	var rotationStart = c.rotationStart;
	var valueStart 	  = c.valueStart;

	var onStep = c.onStep;
	var duration = c.duration;
	var startTime = c.startTime;
	var interpolator = c.interpolator;

	var timePercent = (now - startTime)/duration;
	var percent = interpolator.get(timePercent);

	if(valueRange) {
		c.value = valueStart + percent * valueRange;
	}

	if(timePercent >= 1) {
		percent = 1;
	}

	if(xRange || yRange) {
		var x = Math.floor(xStart + percent * xRange);
		var y = Math.floor(yStart + percent * yRange);
		this.setPosition(x, y);
	}

	if(opacityRange) {
		this.opacity = opacityStart + percent * opacityRange;	
	}

	if(rotationRange) {
		this.setRotation(rotationStart + percent * rotationRange);
	}

	if(scaleXRange) {
		this.setScaleX(scaleXStart + percent * scaleXRange);
	}

	if(scaleYRange) {
		this.setScaleY(scaleYStart + percent * scaleYRange);
	}

	if(onStep && !onStep(this, timePercent, c)) {
		this.callOnAnimateDone(c);
		return;
	}

	if(percent < 1) {
		this.animating = true;
	}
	else {
		this.callOnAnimateDone(c);
	}

	return;
}

UIElement.prototype.isHitWorkArea = function() {
	return this.hitTestResult === Shape.HIT_TEST_MM && this.children.length > 1 && this.canRectSelectable();
}

UIElement.prototype.setPropagatePointerEvent = function(value) {
	this.propagatePointerEvent = value;

	return this;
}

UIElement.prototype.getPropagatePointerEvent = function() {
	return this.propagatePointerEvent;
}

UIElement.prototype.shouldPropagatePointerEvent = function() {
	return this.propagatePointerEvent 
		&& !this.isInDesignMode() 
		&& (!this.targetShape || this.targetShape.shouldPropagatePointerEvent());
}

UIElement.prototype.onPointerDownNormal = function(point) {
	var p = this.translatePoint(point);
	
	this.hitTestResult = this.hitTest(point);

	if(!this.hitTestResult) {
		if(this.isUIScrollView && !this.isInDesignMode()) {
			return false;
		}

		if(this.dispatchPointerDownToChildren(p)) {
			this.setPointerEventTarget(this.targetShape);
			return true;
		}
		return false;
	}

	this.pointerDown = true;
	this.pointerDownTime = Date.now();
	this.childrenRange = this.calcChildrenRange();

	if(this.isInDesignMode()) {
		this.onPointerDownEditing(point, true);
	}
	else if(this.enable) {
		this.onPointerDownRunning(p, true);
	}

	this.setPointerEventTarget(null);
	if(this.hitTestResult === Shape.HIT_TEST_MM || !this.selected) {
		if(this.dispatchPointerDownToChildren(p)) {
			if(this.isInDesignMode()) {
				this.onPointerDownEditing(point, false);
			}
			else if(this.enable) {
				this.onPointerDownRunning(p, false);
			}
			
			this.lastPosition.x = point.x;
			this.lastPosition.y = point.y;
			this.setPointerEventTarget(this.targetShape);

			return true;
		}
	}

	if(this.isHitWorkArea()) {
		this.hitTestResult = Shape.HIT_TEST_WORKAREA;
	}

	this.setTarget(null);
	this.setSelected(true);
	this.lastPosition.x = point.x;
	this.lastPosition.y = point.y;
	if(this.isInDesignMode()) {
		this.handlePointerEvent(point, 1);
	}
	
	if(this.isInDesignMode()) {
		this.onPointerDownEditing(point, false);
	}
	else if(this.enable) {
		this.onPointerDownRunning(p, false);
	}

	this.postRedraw();

	return true;
}

UIElement.prototype.getPointerPosition = function() {
	var win = this.getWindow();

	return win.lastPosition;
}

UIElement.prototype.onPointerMoveNormal = function(point) {
	if(!this.isInDesignMode() && !this.isUIWindowManager && !this.isUIWindow) {
		if(!this.win.pointerDown) {
			return;
		}
	}

	var p = this.translatePoint(point);
	if(this.draggable && this.pointerDown) {
		if(!this.isInDesignMode()) {
			this.handleDragMove(point);
			return;
		}
		else {
			delete this.dragging;
		}
	}

	if(this.hitTestResult) {
		if(this.isInDesignMode()) {
			this.onPointerMoveEditing(point, true);
		}
		else if(this.enable) {
			this.onPointerMoveRunning(p, true);
		}

		var target = this.getPointerEventTarget();
		if(target) {
			target.onPointerMove(p);
			if(this.isInDesignMode()) {
				this.onPointerMoveEditing(point, false);
			}
			else if(this.enable) {
				this.onPointerMoveRunning(p, false);
			}
		}
		else {
			if(this.isInDesignMode()) {
				this.onPointerMoveEditing(point, false);
				if(this.hitTestResult === Shape.HIT_TEST_WORKAREA && this.isUIWindow) {
					var p = {x:0, y:0};
					var w = point.x - this.pointerDownPosition.x;
					var h = point.y - this.pointerDownPosition.y;
					var x = this.pointerDownPosition.x - this.left;
					var y = this.pointerDownPosition.y - this.top;
					var r = {x:x, y:y, w:w, h:h};

					if(Math.abs(w) > 5 && Math.abs(h) > 5) {
						r = fixRect(r);
						this.setSelected(false);
						for(var i = this.children.length - 1; i >= 0; i--) {
							var iter = this.children[i];
							p.x = iter.left + iter.w/2;
							p.y = iter.top + iter.h/2;
							iter.setSelected(isPointInRect(p, r));
						}
					}
				}
				else {	
					this.handlePointerEvent(point, 0);
				}
			}
			else if(this.enable) {
				this.onPointerMoveRunning(p, false);
			}
		}

		this.lastPosition.x = point.x;
		this.lastPosition.y = point.y;

		return true;
	}
	else {
		var target = this.getPointerEventTarget();
		if(target) {
			target.onPointerMove(p);
		}

		if(target || this.isUIWindow) {
			if(this.isInDesignMode()) {
				this.onPointerMoveEditing(point, false);
			}
			else if(this.enable) {
				this.onPointerMoveRunning(p, true);
				this.onPointerMoveRunning(p, false);
			}
		}
	}
		
	this.lastPosition.x = point.x;
	this.lastPosition.y = point.y;

	return false;
}

UIElement.prototype.onPointerUpNormal = function(point) {
	if(this.hitTestResult) {
		var p = this.translatePoint(point);
		var isClick = this.isClicked();
		
		if(this.isInDesignMode()) {
			this.onPointerUpEditing(point, true);
		}
		else if(this.enable) {
			this.onPointerUpRunning(p, true);
		}

		if(isClick && this.enable) {
			this.onClick(p, true);
		}

		var target = this.getPointerEventTarget();
		if(target) {
			target.onPointerUp(p);
		}
		else {
			if(this.isInDesignMode()) {
				this.handlePointerEvent(point, -1);
			}
		}

		if(this.isInDesignMode()) {
			this.onPointerUpEditing(point, false);
		}
		else {
			if(this.dragging) {
				this.handleDragUp(point);
			}
			else if(this.enable) {
				this.onPointerUpRunning(p, false);
			}
		}

		if(isClick && this.enable) {
			this.onClick(p, false);
		}
		
		this.hitTestResult = Shape.HIT_TEST_NONE;

		if(this.longPressed) {
			this.longPressed = false;
		}

		if(this.isUIWindow) {
			UIElement.hScrollHandledBy = null;
			UIElement.vScrollHandledBy = null;
		}

		return true;
	}
	else {
		this.targetShape = null;

		if(!this.isInDesignMode() && this.enable) {
			this.onPointerUpRunning(p, false);
			if(isClick) {
				this.onClick(p, false);
			}
		}

		if(this.longPressed) {
			this.longPressed = false;
		}
		
		var target = this.getPointerEventTarget();
		if(target) {
			var p = this.translatePoint(point);
			target.onPointerUp(p);
		}

		if(this.isUIWindow) {
			UIElement.hScrollHandledBy = null;
			UIElement.vScrollHandledBy = null;
		}
	}

	return false;
}

UIElement.prototype.needDrawTextTips = function(point) {
	return this.isInDesignMode() && !this.children.length;	
}

UIElement.prototype.textEditable = function(point) {
	return this.isInDesignMode();	
}

UIElement.prototype.isClicked = function() {
	if(!this.view) {
		return false;
	}

	if(this.longPressed && this.events["onLongPress"]) {
		console.log("Long Pressed, Ignore Click Event.");
		return false;
	}

	return this.view.isClicked();
}


UIElement.prototype.onKeyDownRunning = function(code) {
	if(!this.handleKeyDown || this.mode === Shape.MODE_PREVIEW) {
		var sourceCode = this.events["onKeyDown"];
		if(sourceCode) {
			sourceCode = "this.handleKeyDown = function(code) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleKeyDown) {
		try {
			this.handleKeyDown(code);
		}catch(e) {
			console.log("this.handleKeyDown:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.onKeyDownEditing = function(code) {
}

UIElement.prototype.onKeyDown = function(code) {
	if(this.targetShape) {
		this.targetShape.onKeyDown(code);
	}

	if(this.isInDesignMode()) {
		this.onKeyDownEditing(code);
	}
	else {
		this.onKeyDownRunning(code);
	}

	return;
}

UIElement.prototype.onKeyUpRunning = function(code) {
	if(!this.handleKeyUp || this.mode === Shape.MODE_PREVIEW) {
		var sourceCode = this.events["onKeyUp"];
		if(sourceCode) {
			sourceCode = "this.handleKeyUp = function(code) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleKeyUp) {
		try {
			this.handleKeyUp(code);
		}catch(e) {
			console.log("this.handleKeyUp:" + e.message);
		}
	}else if(this.isUIWindow && code == KeyEvent.DOM_VK_BACK_BUTTON && !cantkIsEditorActive()) {
		console.log("Back Key Pressed On: " + this.name);
		if(this.isMainWindow()) {
			var app = this.getApp();
			var wm = this.getWindowManager();

			if(this.mode === Shape.MODE_RUNNING) {
				wm.systemExit();
				app.exitApp();
				console.log("Back Key Pressed, Exit App.");
			}
		}
		else {
			this.closeWindow(0);
			console.log("Back Key Pressed, Close Current Window.");
		}
	}

	return true;
}

UIElement.prototype.onKeyUpEditing = function(code) {
}

UIElement.prototype.onKeyUp = function(code) {
	if(code === KeyEvent.DOM_VK_BACK && this.isUIWindow) {
		this.closeWindow(0);

		return;
	}

	if(this.targetShape) {
		this.targetShape.onKeyUp(code);
	}

	if(this.isInDesignMode()) {
		this.onKeyUpEditing(code);
	}
	else {
		this.onKeyUpRunning(code);
	}

	return;
}

UIElement.prototype.afterSetView = function() {

	return true;
}

UIElement.prototype.setView = function(view) {
	this.view = view;

	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		child.setView(view);
	}

	this.afterSetView(view);

	return;
}

UIElement.prototype.setApp = function(app) {
	this.app = app;
	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		child.setApp(app);
	}

	return;
}

UIElement.prototype.shapeCanBeChild = function(shape) {
	return true;
}

UIElement.prototype.onAppendedInParent = function() {
	if(this._win) {
		delete this._win;
	}

}

UIElement.prototype.setParent = function(parentShape) {
	if(!parentShape) {
		this.detachNameFromParent();
	}

	this.parentShape = parentShape;

	return this;
}

Object.defineProperty(UIElement.prototype, "name", {
    set: function(name) {
        this.detachNameFromParent();
		this._name = name;
		this.attachNameToParent();
    },
    get: function() {
        return this._name;
    }
});

UIElement.prototype.setName = function(name) {
	if(this.name !== name) {
		this.name = name;
	}

	return this;
}

UIElement.prototype.detachFromParent = function() {
	var parent = this.getParent();
	if(parent) {
		if(parent.targetShape === this) {
			parent.targetShape = null;
		}
		if(parent.pointerEventTarget === this) {
			parent.pointerEventTarget = null;
		}

		this.detachNameFromParent();
	}

	this.parentShape = null;
}

UIElement.prototype.attachNameToParent = function() {
	var parent = this.getParent();
	if(parent) {
		if(!this.isInDesignMode()) {
			var name = this.name;
			if(parent[name] === undefined) {
				parent[name] = this;
			}else{
				UIElement.logWarning("skip duplicated name:" + name);
			}
		}
	}

	return this;
}

UIElement.prototype.detachNameFromParent = function() {
	var parent = this.getParent();
	if(parent) {
		if(!this.isInDesignMode()) {
			var name = this.name;
			var obj = parent[name];
			if(obj === this) {
				delete parent[name];
			}
		}
	}
	
	return this;
}

UIElement.prototype.afterChildAppended = function(shape) {
	if(this.isUILayout) {
		this.relayoutChildren();
	}

	return true;
}

UIElement.prototype.beforeAddShapeIntoChildren = function(shape) {
	return true;
}

UIElement.prototype.addShapeIntoChildren = function(shape, p) {
	var r = {x:0, y:0, w:0, h:0};
	for(var i = this.children.length - 1; i >= 0; i--) {
		var iter = this.children[i];

		if(iter === shape) continue;

		if(iter.isContainer && iter.visible) {
			r.x = iter.left;
			r.y = iter.top;
			r.w = iter.w;
			r.h = iter.h;

			if(isPointInRect(p, r)) {
				return iter.addShape(shape, true, p);
			}
		}
	}

	return false;
}

UIElement.prototype.addChildWithJson = function(jsShape, index) {
	var type = jsShape.type ? jsShape.type : jsShape.id;
	var shape = ShapeFactoryGet().createShape(type, C_CREATE_FOR_USER);

	if(shape) {
		shape.fromJson(jsShape);
		this.addShape(shape, false, null, index || shape.z);
		shape.setVisible(true);
		shape.attachNameToParent();
	}

	return shape;
}

UIElement.prototype.setAlwaysOnTop = function(value) {
	this.alwaysOnTop = value;

	return;
}

UIElement.onAddShape = function(shape, addByUser) {
}

UIElement.prototype.fixName = function() {
	var shape = this;
	var parentShape = this.getParent();

	if(!shape.name) {
		shape.name = shape.type;
	}

	var name = shape.name;
    
    if(!this.isInDesignMode()) {
        shape.name = shape.name + "_" + Date.now() + "_" + Math.round(Math.random() * 10000);
        return;
    }

    name = name.replaceAll("-", "_");
	var prefix = name;
    var split = name.lastIndexOf('_');
	var indStr = name.substring(split + 1);
    var i = Math.abs(parseInt(indStr));
    var index;   
 
	if(!isNaN(i)) {
		prefix = name.slice(0, split)
	    index = i;
    }
	else {
		index = 1;
	}

	for(var i = index; i < 1000; i++) {
		if(parentShape.find(name)) {
			if(prefix[prefix.length-1] === '_') {
				name = prefix + i; 
			}
			else {
				name = prefix +"_"+ i;
			}
		}
		else {
			break;
		}
	}

	shape.name = name;

	return this;
}


UIElement.prototype.addShape = function(shape, offsetIt, point, index) {
	if(!shape.isUIElement) {
		return false;
	}

	if(shape.parentShape) {
		UIElement.logWarning("child has a parent, cannot call addChild again.");
		return false;	
	}

	if(offsetIt) {
		shape.moveDelta(-this.left, -this.top);
	}

	if(this.beforeAddShapeIntoChildren(shape) && point) {
		var p = this.translatePoint(point);
		if(this.addShapeIntoChildren(shape, p)) {
			return true;
		}
		shape.setLeftTop(p.x, p.y);	
	}

	if(!this.shapeCanBeChild(shape)) {
		return false;
	}

	shape.setParent(this);
	shape.setView(this.view);
	shape.setApp(this.app);

	var children = this.children;
	var n = children.length;

	if(index === undefined) {
		if(n) {
			index = this.children[n-1].z + 1;
		}
		else {
			index = 0;	
		}
	}
	
	children.push(shape);
	shape.setZIndex(index);
	n = children.length;

	if(shape.isUIElement) {
		shape.setMode(this.mode, true);
		if(!this.isInDesignMode()) {
			shape.init();
		}
	}

	for(var i = 0; i < children.length; i++) {
		var iter = children[i];

		if(iter.alwaysOnTop) {
			children.remove(iter);
			children.push(iter);
			break;
		}
	}

	if(shape.isCreatingElement()) {
		shape.callOnBirthedHandler(true);
	}

	shape.onAppendedInParent();
	this.afterChildAppended(shape);
	UIElement.onAddShape(shape, offsetIt);

	return true;
}

UIElement.prototype.appendChild = function(shape) {
	var arr = this.children;
	var n = arr.length;
	
	if(shape.z === undefined) {
		shape.z = n;
	}

	if(!n) {
		arr.push(shape);
		return;
	}

	for(var i = n-1; i >= 0; i--) {
		var iter = arr[i];
		if(iter.z <= shape.z) {
			arr.splice(i+1, 0, shape);
			return;
		}
	}
	arr.splice(0, 0, shape);

	return;
}

UIElement.prototype.addShapeDirectly = function(shape) {
	if(!this.shapeCanBeChild(shape)) {
		return false;
	}

	this.setDisableRelayout(true);
	shape.setDisableRelayout(true);

	shape.setParent(this);
	shape.setView(this.view);
	shape.setApp(this.app);
	this.appendChild(shape);
	if(shape.isUIElement) {
		shape.mode = this.mode;
	}
	this.afterChildAppended(shape);
	shape.onAppendedInParent();

	this.setDisableRelayout(false);
	shape.setDisableRelayout(false);

	return true;
}

UIElement.prototype.addChild = function(child, zIndex) {
	if(this.addShape(child, false, null, zIndex || child.z)) {
		child.attachNameToParent();
		return child;
	}
	else {
		return null;
	}
}
	
UIElement.prototype.shapeCanBeRemove = function(shape) {
	return true;
}

UIElement.prototype.afterChildRemoved = function(shape) {
	return true;
}

UIElement.prototype.remove = function(destroyIt, sync) {
	var parentShape = this.getParent();

	if(parentShape) {
		parentShape.removeChild(this, destroyIt, sync);	
	}

	return this;
}

UIElement.prototype.removeAll = function() {
	var n = this.children.length;
	for(var i = 0; i < n; i++) {
		var iter = this.children[0];
		this.removeShape(iter);
	}

	return;
}

UIElement.prototype.removeChildren = function(destroyThem) {
	this.targetShape = null;
	this.pointerEventTarget = null;

	var n = this.children.length;
	for(var i = 0; i < n; i++) {
		var iter = this.children[i];

		if(iter.getParent() === this) {
			iter.onRemoved(this);
			iter.setParent(null);
			iter.setView(null);
			iter.setApp(null);
		}
	}

	if(destroyThem) {
		this.children.clear();
	}else{
		this.children.length = 0;
	}

	return this;
}

UIElement.prototype.removeChild = function(child, destroyIt, sync) {
	var me = this;

	if(child.animatingInfo) {
		UIElement.logWarning("removing animating element.");
	}

	if(sync) {
		this.removeShape(child, destroyIt);
	}
	else {
		child.removed = true;
		setTimeout(function() {
			me.removeShape(child, destroyIt);
			child = null;
			me = null;
		}, 0);
	}
	
	if(this.targetShape === child) {
		this.targetShape = null;
	}

	if(this.pointerEventTarget === child) {
		this.pointerEventTarget = null;
	}

	return this;
}

UIElement.onRemoveShape = function(parentShape, shape) {
}

UIElement.prototype.removeShape = function(shape, destroyIt) {
	if(!this.shapeCanBeRemove(shape) || !shape.parentShape) {
		return false;
	}

	if(shape.animatingInfo) {
		UIElement.logWarning("removing animating element.");
	}

	this.children.remove(shape);
	
	shape.callOnRemovedHandler();
	this.afterChildRemoved(shape);

	if(shape.getParent() === this) {
		shape.setParent(null);
		shape.setView(null);
		shape.setApp(null);
	}

	if(this.isUILayout) {
		this.relayoutChildren();
	}

	UIElement.onRemoveShape(this, shape);
	shape.onRemoved(this);

	if(destroyIt) {
		shape.destroy();
	}

	return;
}

UIElement.prototype.reparent = function(newParent, keepAbsPosition) {
	var parent = this.getParent();
	if(newParent === parent) {
		return;
	}

	if(!newParent || !parent) {
		return;
	}

	if(keepAbsPosition) {
		var parentPos = parent.getPositionInWindow();
		var newParentPos = newParent.getPositionInWindow();
		var dx = parentPos.x - newParentPos.x;
		var dy = parentPos.y - newParentPos.y;

		this.left += dx;
		this.top += dy;
	}

	parent.children.remove(this);
	newParent.addShapeDirectly(this);

	return;
}

UIElement.prototype.afterPropertyChanged = function() {
	if(this.parentShape) {
		this.parentShape.relayoutChildren();
	}
	else {
		this.relayout();
	}

	return;
}

UIElement.prototype.getIndexOfChild = function(child) {
	return this.children.indexOf(child);
}

UIElement.prototype.getIndex = function() {
	if(this.parentShape) {
		return this.parentShape.getIndexOfChild(this);
	}
	else {
		return -1;
	}
}

UIElement.prototype.getZIndex = function() {
	return this.z;
}

UIElement.prototype.onRestack = function() {
}

UIElement.prototype.setZIndex = function(index) {
	this.z = index;

	var parentShape = this.parentShape;
	if(parentShape) {
		var arr = parentShape.children;
		var n = arr.length;
		for(var i = 0; i < n; i++) {
			var iter = arr[i];
			if(iter.z === undefined) {
				iter.z = i;	
			}
		}

		arr.stableSort(function(a, b) {
			return a.z - b.z;
		});
	}

	this.onRestack();

	return this;
}

UIElement.prototype.findChildByType = function(type, recursive) {
	var i = 0;
	var s = null;
	var shape = null;
	var n = this.children.length;

	for(i = 0; i < n; i++) {
		shape = this.children[i];
		if(shape.type === type) {
			return shape;
		}
	}

	if(recursive) {
		for(i = 0; i < n; i++) {
			shape = this.children[i];
			s = shape.findChildByType(type, recursive);
			if(s) {
				return s;
			}
		}
	}

	return null;
}

UIElement.prototype.findChildByPath = function(names) {
	var name = names.shift();
	var child = this.findChildByName(name);

	if(names.length) {
		return child.findChildByPath(names);
	}

	return child;
}

UIElement.prototype.findChildByName = function(name, recursive) {
	var i = 0;
	var s = null;
	var shape = null;
	var n = this.children.length;

	for(i = 0; i < n; i++) {
		shape = this.children[i];
		if(shape.name === name) {
			return shape;
		}
	}

	if(recursive) {
		for(i = 0; i < n; i++) {
			shape = this.children[i];
			s = shape.findChildByName(name, recursive);
			if(s) {
				return s;
			}
		}
	}

	return null;
}

UIElement.prototype.find = function(name, recursive) {
	if(!name) {
		return this;
	}

	if(name.indexOf("/") >= 0) {
		var names = name.split("/");
		names.remove("");

		return this.findChildByPath(names);
	}
	else {
		return this.findChildByName(name, recursive);
	}
}

UIElement.prototype.setValueOf = function(name, value) {
	var child = this.findChildByName(name, true);
	
	return child ? child.setValue(value) : null;
}

UIElement.prototype.getValueOf = function(name) {
	var child = this.findChildByName(name, true);
	
	return child ? child.getValue() : null;
}

UIElement.prototype.beforePaintChild = function(child, canvas) {
	return;
}

UIElement.prototype.afterPaintChild = function(child, canvas) {
	return;
}

UIElement.prototype.paintTargetShape = function(canvas) {
	var targetShape = this.targetShape;
	if(targetShape && ((this.isUIList && this.isInDesignMode()) || this.isUIGrid)) {
		shape = targetShape;
		this.beforePaintChild(shape, canvas);
		shape.paintSelf(canvas);
		this.afterPaintChild(shape, canvas);
	}

	return;
}

UIElement.prototype.defaultPaintChildren = function(canvas) {
	canvas.save();
	canvas.beginPath();
	var shape = null;
	var n = this.children.length;
	for(var i = 0; i < n; i++) {
		shape = this.children[i];
		if(!shape) {
			continue;
		}

		if(shape.visible) {
			this.beforePaintChild(shape, canvas);
			shape.paintSelf(canvas);
			this.afterPaintChild(shape, canvas);
		}
		else if(shape.isAnimating()){
			shape.stepAnimation(canvas);
		}
	}
	
	this.paintTargetShape(canvas);

	canvas.restore();
	
	return;
}

UIElement.prototype.beforePaintChildren = function(canvas) {
	if(!this.rotateChildren && this.rotation) {
		var hw = this.w >> 1;
		var hh = this.h >> 1;
		canvas.translate(hw, hh);
		canvas.rotate(-this.rotation);
		canvas.translate(-hw, -hh);
	}

	return;
}

UIElement.prototype.afterPaintChildren = function(canvas) {
	return;
}

UIElement.prototype.paintChildren = function(canvas) {
	this.defaultPaintChildren(canvas);

	return;
}

UIElement.prototype.paintSelfOnly =function(canvas) {
	return;
}

UIElement.prototype.drawImageAtCenter = function(ctx, image, x, y, w, h, keepRatio) {

	if(image && image.width > 0) {
		var imageW = image.width;
		var imageH = image.height;

		if(keepRatio) {
			var scale = Math.min(1, Math.min(h/imageH, w/imageW));
			var dw = imageW * scale;
			var dh = imageH * scale;
			var dx = ((w - dw)>>1) + x;
			var dy = ((h - dh)>>1) + y;
			
			dx = Math.max(dx, x);
			dy = Math.max(dy, y);
		}
		else {
			dx = x;
			dy = y;
			dw = w;
			dh = h;
		}

		ctx.drawImage(image, 0, 0, imageW, imageH, dx, dy, dw, dh);
	}

	return;
}


UIElement.prototype.drawImage =function(canvas) {
	this.drawFgImage(canvas);

	return;
}

UIElement.prototype.drawFgImage =function(canvas) {
	return;
}

UIElement.prototype.getBgHtmlImage =function() {
	var image = this.getBgImage();

	return image ? image.getImage() : null;
}

UIElement.prototype.getBgImage =function() {
	var image = null;
	
	if(this.enable) {
		if(this.pointerDown && !this.isClicked()) {
			image = this.images.normal_bg;
		}
		else {
			if(this.pointerDown) {
				image = this.images.active_bg;
			}
			else {
				if(this.isPointerOverShape() && this.getHtmlImageByType(UIElement.IMAGE_POINTER_OVER)) {
					image = this.images.pointer_over_bg;
				}
				else if(this.isFocused()) {
					image = this.images.focused_bg;
				}
				else {
					image = this.images.normal_bg;
				}
			}
		}
	}
	else {
		image = this.images.disable_bg;
	}

	if(!image || !image.getImage()) {
		image = this.images.default_bg;
	}
	
	if(!image || !image.getImage()) {
		image = this.images.normal_bg;
	}

	if(!image || !image.getImage()) {
		return;
	}

//	image = image.getImage();

	return image;
}

UIElement.prototype.drawImageAt = function(canvas, image, display, x, y, dw, dh, srcRect) {
	UIElement.drawImageAt(canvas, image, display, x, y, dw, dh, srcRect);
}

UIElement.drawImageAt = function(canvas, image, display, x, y, dw, dh, srcRect) {
	return WImage.draw(canvas, image, display, x, y, dw, dh, srcRect);
}

UIElement.drawImageLine = function(canvas, image, display, p0, p1, srcRect) {
	var angle = Math.lineAngle(p0, p1);
	var distance = Math.round(Math.distanceBetween(p0, p1));

	canvas.save();
	canvas.translate(p0.x, p0.y);
	canvas.rotate(angle);
	canvas.translate(0, -image.height>> 1);
	UIElement.drawImageAt(canvas, image, display, 0, 0, distance, image.height, srcRect);
	canvas.restore();

	return;
}

UIElement.prototype.setImageScale = function(imageScaleX, imageScaleY) {
	this.imageScaleX = imageScaleX;
	this.imageScaleY = imageScaleY;
	this.images.display = UIElement.IMAGE_DISPLAY_SCALE;

	return this;
}

UIElement.prototype.drawBgImageScale =function(canvas, image, rect, sx, sy) {
	var w = this._w;
	var h = this._h;
	var hw = w >> 1;
	var hh = h >> 1;

	canvas.save();
	canvas.translate(hw, hh);
	canvas.scale(sx, sy);
	canvas.translate(-hw, -hh);

	WImage.draw(canvas, image, UIElement.IMAGE_DISPLAY_CENTER, 0, 0, w, h, rect);
	canvas.restore();
}

UIElement.prototype.drawBgImage =function(canvas) {
	var wImage = this.getBgImage();
		
	if(wImage) {
		var image = wImage.image;
		var srcRect = wImage.rect;
		var display = this.images.display;
		var scaleX = this.imageScaleX;
		var scaleY = this.imageScaleY;

		if((scaleX === 1 && scaleY === 1) || (!scaleX && !scaleY) || display !== UIElement.IMAGE_DISPLAY_SCALE) {
			WImage.draw(canvas, image, display, 0, 0, this.w, this.h, srcRect);
		}else{
			this.drawBgImageScale(canvas, image, srcRect, scaleX, scaleY);
		}
	}

	return;
}

UIElement.prototype.beforeDrawIcon = function(canvas) {
	return false;
}

UIElement.prototype.afterDrawIcon = function(canvas) {
	return false;
}

UIElement.prototype.prepareStyle = function(canvas) {
	var style = this.style;

	canvas.beginPath();
	if(canvas.lineWidth !== style.lineWidth) {
		canvas.lineWidth = style.lineWidth;	
	}

	if(canvas.strokeStyle != style.lineColor) {
		canvas.strokeStyle = style.lineColor;
	}
	
	if(canvas.fillStyle != style.fillColor) {
		canvas.fillStyle = style.fillColor;
	}

	return;
}

UIElement.prototype.updateTransform = function(canvas) {
	if(this.events["onUpdateTransform"] || this.hasEventListener("updatetransform")) {
		if(!this.isInDesignMode()) {
			this.callOnUpdateTransformHandler(canvas);
		}
	}
	
	return;
}

//
//Example:
//==========================================
//var config = {};
//config.rotationFrom = -0.2;
//config.rotationTo = 0.2;
//
//config.scaleFrom =  0.9;
//config.scaleTo = 1.1;
//
//config.opacityFrom =  0.1;
//config.opacityTo = 1.0;
//config.frequency = 0.5;
//
//var image = this.getWindow().findChildByName("ui-image", true);
//image.setHighlightConfig(config);
//

UIElement.prototype.saveTransform = function() {
	this.savedTransform = {};
	this.savedTransform.opacity = this.opacity;
	this.savedTransform.scale = this.scale;
	this.savedTransform.scaleX = this.scaleX;
	this.savedTransform.scaleY = this.scaleY;
	this.savedTransform.rotation = this.rotation;
	this.savedTransform.offsetX = this.offsetX;
	this.savedTransform.offsetY = this.offsetY;

	return;
}

UIElement.prototype.restoreTransform = function() {
	if(this.savedTransform) {
		this.opacity = this.savedTransform.opacity;
		this.scale = this.savedTransform.scale;
		this.scaleX = this.savedTransform.scaleX;
		this.scaleY = this.savedTransform.scaleY;
		this.rotation = this.savedTransform.rotation;
		this.offsetX = this.savedTransform.offsetX;
		this.offsetY = this.savedTransform.offsetY;
	}

	return;
}

UIElement.prototype.setHighlightConfig = function(highlightConfig) {
	if(highlightConfig) {
		//this.restoreTransform();
		var c = JSON.parse(JSON.stringify(highlightConfig));

		c.startTime = 0;
		this.saveTransform();
		this.removeHighlightConfig = false;
		this.highlightConfig = c;

		if(c.rotationFrom !== undefined && c.rotationTo !== undefined) {
			c.rotationRange = c.rotationTo - c.rotationFrom;
			c.rotationMiddle = (c.rotationTo + c.rotationFrom)/2;
		}
		else {
			c.rotationRange = 0;
		}

		if(c.opacityFrom !== undefined && c.opacityTo !== undefined) {
			c.opacityRange = c.opacityTo - c.opacityFrom;
			c.opacityMiddle = (c.opacityTo + c.opacityFrom)/2;
		}
		else {
			c.opacityRange = 0;
		}

		if(c.scaleFrom !== undefined && c.scaleTo !== undefined) {
			c.scaleRange = c.scaleTo - c.scaleFrom;
			c.scaleMiddle = (c.scaleTo + c.scaleFrom)/2;
		}
		else {
			c.scaleRange = 0;
		}

		if(c.scaleXFrom !== undefined && c.scaleXTo !== undefined) {
			c.scaleXRange = c.scaleXTo - c.scaleXFrom;
			c.scaleXMiddle = (c.scaleXTo + c.scaleXFrom)/2;
		}
		else {
			c.scaleXRange = 0;
		}

		if(c.scaleYFrom !== undefined && c.scaleYTo !== undefined) {
			c.scaleYRange = c.scaleYTo - c.scaleYFrom;
			c.scaleYMiddle = (c.scaleYTo + c.scaleYFrom)/2;
		}
		else {
			c.scaleYRange = 0;
		}

		if(c.offsetXFrom !== undefined && c.offsetXTo !== undefined) {
			c.offsetXRange = c.offsetXTo - c.offsetXFrom;
			c.offsetXMiddle = (c.offsetXTo + c.offsetXFrom)/2;
		}
		else {
			c.offsetXRange = 0;
		}

		if(c.offsetYFrom !== undefined && c.offsetYTo !== undefined) {
			c.offsetYRange = c.offsetYTo - c.offsetYFrom;
			c.offsetYMiddle = (c.offsetYTo + c.offsetYFrom)/2;
		}
		else {
			c.offsetYRange = 0;
		}
	}
	else {
		this.removeHighlightConfig = true;
	}

	return;
}

UIElement.prototype.updateHighlightTransform = function(canvas) {
	var paused = this.timeScaleIsZero() || (this.isInDesignMode() && this.disablePreview);

	if(this.highlightConfig && !paused) {
		var c = this.highlightConfig;
		
		if(c.paused) return;

		var me = this;
		var tOffset = 0;
		var random = c.random ? c.random/1000 : 0;	
		var frequency = c.frequency ? c.frequency : 4;

		if(c.startTime) {
			tOffset = (canvas.now - c.startTime)/1000;
		}
		else {
			c.startTime = Date.now();
		}
		tOffset += 1/(frequency*4) + random;
		var womiga = frequency * Math.PI * 2;
        var factor = this.scaleTime(Math.cos(womiga*tOffset) * 0.5);

		if(this.removeHighlightConfig && Math.abs(factor) < 0.1) {
			this.removeHighlightConfig = false;
			this.highlightConfig = null;
			this.restoreTransform();

			return;
		}

		if(c.rotationRange) {
			this.rotation = c.rotationMiddle + c.rotationRange * factor;
		}
		if(c.opacityRange) {
			this.opacity = c.opacityMiddle + c.opacityRange * factor;
		}
		if(c.scaleRange) {
			var scale = c.scaleMiddle + c.scaleRange * factor;
			this.scaleX = scale;
			this.scaleY = scale;
		}
		if(c.scaleXRange) {
			this.scaleX = c.scaleXMiddle + c.scaleXRange * factor;
		}
		if(c.scaleYRange) {
			this.scaleY = c.scaleYMiddle + c.scaleYRange * factor;
		}
		if(c.offsetXRange) {
			this.offsetX = c.offsetXMiddle + c.offsetXRange * factor;
		}
		if(c.offsetYRange) {
			this.offsetY = c.offsetYMiddle + c.offsetYRange * factor;
		}

		canvas.needRedraw++;
	}

	return;
}

UIElement.prototype.paintSelf = function(canvas) {
	this.stepAnimation(canvas);

	if(!this.visible) return;

	var animating = this.animating;

	canvas.save();
	this.translate(canvas);

	if(!animating) {
		this.updateTransform(canvas);
	}

	if(this.highlightConfig) {
		this.updateHighlightTransform(canvas);
	}
	
	this.applyTransform(canvas);
	this.onClip(canvas);

	canvas.save();

	var flipX = this.flipX ? -1 : 1;
	var flipY = this.flipY ? -1 : 1;
	if(flipX < 0 || flipY < 0) {
		canvas.save();
		
		var hw = this.w >> 1;
		var hh = this.h >> 1;
		canvas.translate(hw, hh);
		canvas.scale(flipX, flipY);
		canvas.translate(-hw, -hh);
	}

	if(this.beforePaint) {
		this.beforePaint(canvas);
	}
	this.drawBgImage(canvas);
	this.paintSelfOnly(canvas);
	this.drawImage(canvas);

	if(flipX < 0 || flipY < 0) {
		canvas.restore();
	}

	canvas.restore();

	if(this.children.length || this.isInDesignMode()) {
		canvas.save();
		if(animating) {
			canvas.animating++;
		}
		this.beforePaintChildren(canvas);
		this.paintChildren(canvas);
		this.afterPaintChildren(canvas);
		if(animating) {
			canvas.animating--;
		}
		canvas.restore();
	}

	if(this.drawText && this.textType !== Shape.TEXT_NONE) {
		this.drawText(canvas);
		this.drawTextTips(canvas);
	}

	if(this.afterPaint) {
		this.afterPaint(canvas);
	}

	canvas.restore();
	
	return;
}

UIElement.prototype.saveProps = [];
UIElement.prototype.urlProps = ["dataURL"];
UIElement.saveProps = ["xAttr", "yAttr", "widthAttr", "heightAttr", "xParam", "yParam", "widthParam", "heightParam", "sticky", "flipX", "flipY", "rotateChildren", "defaultAnimationName", "dataURL", "disablePreview", "dataSourceUrl", "imageScaleX", "imageScaleY", "propagatePointerEvent"];

UIElement.prototype.doToJsonCustom = function(o) {
	o.propertySheetDesc = this.propertySheetDesc;
	for(var key in o.propertySheetDesc) {
		var value = this[key];
		if(value !== undefined) {
			o[key] = value;
		}
	}

	return this;
}

UIElement.prototype.doToJson = function(o) {
	this.updateLayoutParams();

	RShape.prototype.doToJson.call(this, o);
	
	o.runtimeVisible = this.runtimeVisible;
	if(this.isUILoadingWindow) {
		o.isUILoadingWindow = true;
	}

	if(this.value !== undefined) {
		o.value = this.value;
	}

	this.propsToJson(o, this.saveProps);
	this.propsToJson(o, UIElement.saveProps);

    if(this.urlProps) {
        for(var i = 0; i < this.urlProps.length; i++) {
            var prop = this.urlProps[i];
            var url = o[prop];
            if(url) {
            	o[prop] = this.getRelativePathOfURL(url);
            }
        }
    }

	this.imagesToJson(o);
	o.events = this.events;
	
	if(this.animations) {
		o.animations = JSON.parse(JSON.stringify(this.animations));
	}
	
	if(this.handle) {
		o.handle = {};
		o.handle.x = this.handle.x;
		o.handle.y = this.handle.y;
	}

	if(this.settings) {
		o.settings = this.settings;
	}

	if(this.propertySheetDesc) {
		this.doToJsonCustom(o);
	}

	this.childrenToJson(o);

	return o;
}

UIElement.prototype.childToJson = function(child) {
	return child.toJson();
}

UIElement.prototype.childrenToJson = function(o) {
	var n = this.children.length;
	var children = this.children;
	
	o.children = [];
	for(var i = 0; i < n; i++) {
		var iter = children[i];
		o.children.push(this.childToJson(iter));
	}

	return this;
}

UIElement.prototype.childrenFromJson = function(js) {
	if(js.children) {
		var n = js.children.length;
		var factory = ShapeFactoryGet();
		this.children.clear(true);
		for(var i = 0; i < n; i++) {
			var jsShape = js.children[i];

			if(!jsShape) {
				console.log("Warning: child is null.");
				continue;
			}

			var type = jsShape.type ? jsShape.type : jsShape.id;
			var shape = factory.createShape(type, C_CREATE_FOR_USER);
			if(shape) {
				if(jsShape.z === undefined) {
					jsShape.z = i;
				}
				shape.z = jsShape.z;
				if(this.addShapeDirectly(shape)) {
					shape.fromJson(jsShape);
				}
			}
		}
	}

	this.targetShape = null;
	this.pointerEventTarget = null;

	return;
}

UIElement.prototype.doFromJsonCustom = function(js) {
	this.propertySheetDesc = js.propertySheetDesc;

	for(var key in js.propertySheetDesc) {
		var value = js[key];
		if(value !== undefined) {
			this[key] = value;
		}
	}
}

UIElement.prototype.doFromJson = function(js) {
	RShape.prototype.doFromJson.call(this, js);
	
	if(js.runtimeVisible === undefined) {
		this.runtimeVisible = true;
	}
	else {
		this.runtimeVisible = js.runtimeVisible;
	}

	if(js.isUILoadingWindow) {
		this.isUILoadingWindow = true;
	}

	this.propsFromJson(js, UIElement.saveProps);
	this.propsFromJson(js, this.saveProps);

    Object.keys(js.events).forEach(function(ev) {
        this.events[ev] = js.events[ev];
    }, this);
   
	this.imagesFromJson(js);

	if(js.animations) {
		this.animations = js.animations;
	} else if(this.animations) {
        delete this.animations;
    }

	if(js.handle) {
		this.handle = {};
		this.handle.x = js.handle.x;
		this.handle.y = js.handle.y;
	}

	if(js.settings) {
		this.settings = js.settings;
	}

	if(js.propertySheetDesc) {
		this.doFromJsonCustom(js);
	}
	
	if(js.value !== undefined) {
		this.value = js.value;
		this.setValue(this.getValue());
	}

	this.childrenFromJson(js);

	return this;
}
	
UIElement.prototype.afterApplyFormat = function() {
	if(this.parentShape) {
		this.parentShape.relayoutChildren();
	}
	else {
		this.relayout();
	}

	return;
}

UIElement.prototype.findChildByPoint = function(point, recursive, checkFunc) {
	var p = point;
	var n = this.children.length;

	for(var i = n; i > 0; i--) {
		var child = this.children[i-1];
		if(!child.visible) continue;

		if(child.hitTest(p)) {
			if(checkFunc && !checkFunc(child)) {
				continue;
			}

			if(recursive) {
				var tp = {};
				tp.x = p.x - child.left + (child.xOffset || 0);
				tp.y = p.y - child.top + (child.yOffset || 0);
				return child.findChildByPoint(tp, recursive, checkFunc);
			}
			else {
				return child;
			}
		}
		else {
			if(recursive) {
				var tp = {};
				tp.x = p.x - child.left + (child.xOffset || 0);
				tp.y = p.y - child.top + (child.yOffset || 0);
				var ret = child.findChildByPoint(tp, recursive, checkFunc);
				if(ret !== child) {
					return ret;
				}
			}
		}
	}

	return this;
}

UIElement.prototype.findShapeByPoint = UIElement.prototype.findChildByPoint;

UIElement.prototype.getChildren = function() {
	return this.children;
}

UIElement.prototype.getChildrenNr = function() {
	return this.children.length;
}

UIElement.prototype.getChild = function(index) {
	return (index < this.children.length && index >= 0) ? this.children[index] : null;
}

UIElement.prototype.canBindingData = function() {
	return (!this.isUIDevice && !this.isUIScreen && !this.isUIWindowManager && this.children.length > 0);
}

UIElement.prototype.onDataBindingTemplate = function(template) {
	//template.name = this.name;
	if(this.isUIImage) {
		var image = this.getImageByType(UIElement.IMAGE_DEFAULT);
		var src = image ? image.getImageSrc(): "";

		src = this.getRelativePathOfURL(src);

		template.image = src;
	}
	else {
		if(this.value !== undefined) {
			template.value = this.value;
		}
	}

	if(this.text || this.isUILabel) {
		template.text = this.text;
	}

	return template;
}

UIElement.prototype.getDataBindingTemplate = function() {
	var i = 0;
	var iter = null;
	var template = {};
	var children = this.children;
	var n = this.children.length;

	this.onDataBindingTemplate(template);

	if(n > 0) {
		template.children = [];

		for(i = 0; i < n; i++) {
			iter = children[i];
			if(!this.childIsBuiltin(iter)) {
				template.children.push(iter.getDataBindingTemplate());
			}
		}
	}

	return template;
}

UIElement.prototype.setUserData = function(userData) {
	this.userData = userData;

	return;
}

UIElement.prototype.getUserData = function() {
	return this.userData;
}

UIElement.prototype.onBindData = function(data) {
	var text = data.text;
	var image = data.image;
	var value = data.value;

	if(text !== undefined) {
		this.setText(text);
	}
	
	if(image !== undefined) {
		this.setImage(UIElement.IMAGE_DEFAULT, image);
	}

	if(value !== undefined) {
		this.setValue(value);
	}
	
	if(data.enable !== undefined) {
		this.setEnable(data.enable);
	}
	
	if(data.visible !== undefined) {
		this.setVisible(data.visible);
	}

	if(data.textColor) {
		this.style.setTextColor(data.textColor);
	}
	
	if(data.fillColor) {
		this.style.setFillColor(data.fillColor);
	}
	
	if(data.lineColor) {
		this.style.setLineColor(data.lineColor);
	}

	if(data.fontSize) {
		this.style.setFontSize(data.fontSize);
	}
	
	this.setUserData(data.userData);

	if(data.height) {
		this.h = data.height;
	}
	
	if(data.width) {
		this.w = data.width;
	}

	if(this.offset) {
		this.offset = 0;
	}

	var attrs = ["children", "text", "value", "image", "visible", "enable", "textColor", "fillColor", "lineColor", "fontSize", "userData"];
	for(var key in data) {
		if(attrs.indexOf(key) >= 0) continue;
		var value = data[key];
		var child = this.find(key, true);
		if(!child) continue;

		if(typeof value  === "object") {
			child.doBindData(value);
		}
		else {
			child.setValue(value);		
		}
	}

	return;
}

UIElement.prototype.moveMustBeLastItemToLast = function() {
	var last = null;
	var children = this.children;
	var n = this.children.length;
	
	for(var i = 0; i < n; i++) {
		var iter = children[i];
		if(iter.name === "ui-last") {
			last = iter;
			children[i] = children[n-1];
			children[n-1] = last;
			break;
		}
	}

	return;
}

UIElement.prototype.childIsBuiltin = function(child) {
	return false;
}

UIElement.makeImageURLToAbsOfJson = function(json) {
	if(!json) {
		return;
	}

	var images = json.images;
	var host = window.location.protocol + "//" + window.location.host + "/";

	for(var key in images) {
		var value = images[key];
		if(key !== "display") {
			if(value.indexOf("http://") < 0 && value.indexOf("https://") < 0) {
				value = host + value;
				images[key] = value;
			}
		}
	}

	if(!json.children) {
		return;
	}

	for(var i = 0; i < json.children.length; i++) {
		var iter = json.children[i];

		UIElement.makeImageURLToAbsOfJson(iter);
	}

	return;
}

UIElement.prototype.getTemplateChildJson = function() {
	if(!this.templateChildJson) {
		var child = this.getTemplateChild();
		this.templateChildJson = child ? child.toJson() : null;
		UIElement.makeImageURLToAbsOfJson(this.templateChildJson);

		if(this.templateChildJson) {
			delete this.templateChildJson.isTemplate;
		}
		else {
			console.log("No Template Child.");
		}
	}

	return this.templateChildJson;
}

UIElement.prototype.getTemplateChild = function() {
	if(!this.templateChild) {
		for(var i = 0; i < this.children.length; i++) {
			var iter = this.children[i];
			if(iter.isTemplate) {
				this.children.remove(iter);
				this.templateChild = iter;
				break;
			}
		}
		
		if(!this.templateChild) {
			this.templateChild = this.getLastUserChild();
		}
	}
	
	return this.templateChild;
}

UIElement.prototype.dupTemplateChild = function() {
	var child = this.getTemplateChild().clone();
	
	delete child.isTemplate;

	return child;
}

UIElement.prototype.dupChild = function(name, zIndex) {
	var child = this.findChildByName(name);

	if(child) {
		var shape = child.clone();

		if(isNaN(zIndex)) {
			zIndex = child.z + 1;
		}

		this.addShape(shape, false, null, zIndex);
		shape.fixName();

		return shape;
	}
	else {
		return null;
	}
}

UIElement.prototype.getLastUserChild = function() {
	var children = this.children;
	var n = this.children.length;

	if(n > 0) {
		for(var i = n-1; i >= 0; i--) {
			var iter = children[i];
			if(!this.childIsBuiltin(iter)) {
				return iter;
			}
		}
	}

	return null;
}

UIElement.prototype.countUserChildren = function() {
	var nr = 0;
	var children = this.children;
	var n = this.children.length;

	for(var i = 0; i < n; i++) {
		var iter = this.children[i];
		if(!this.childIsBuiltin(iter)) {
			nr = nr + 1;
		}
	}

	return nr;
}

UIElement.prototype.setDisableRelayout = function(disableRelayout) {
	this.disableRelayout = disableRelayout;

	return this;
}

UIElement.prototype.bindData = function(data, animHint, clearOldData) {
	var shape = this;
	
	shape.setDisableRelayout(true);
	shape.doBindData(data, clearOldData);	
	shape.setDisableRelayout(false);
	shape.relayoutChildren(animHint);
	console.log("bindData: done");

	shape.postRedraw();

	return this;
}

UIElement.prototype.doBindData = function(data, clearOldData) {
	var i = 0;
	var k = 0;
	var iter = null;
	var templateJson = (this.isUIList || this.isUIGrid) ? this.getTemplateChildJson() : null;
	
	this.onBindData(data);

	var children = this.children;
	var n = this.countUserChildren();
	if((n < 1 && !templateJson) || !data.children) {
		return;
	}

	var m = data.children.length;
	if((this.isUIList || this.isUIGrid)) {
		if(m > n) {
			templateJson.y = 0;
			templateJson.visible = true;
			for(i = n; i < m; i++) {
				this.addChildWithJson(templateJson);
			}
		}
		else if(m < n && clearOldData) {
			var arr = [];

			k = n - m;
			for(i = (this.children.length-1); i>= 0; i--) {
				var iter = this.children[i];
				if(!this.childIsBuiltin(iter) && !iter.isTemplate) {
					arr.push(iter);
				}
			}

			for(var i = 0; i < arr.length; i++) {
				var iter = arr[i];
				
				if(i === k) {
					break;
				}
				this.children.remove(iter);
				iter.setParent(null);
				iter.setApp(null);
				iter.setView(null);
			}
		}

		n = this.children.length;
	}
	else {
		n = this.children.length;
	}

	for(i = 0, k = 0; k < n & i < m; k++) {
		iter = children[k];
		if(!this.childIsBuiltin(iter)) {
			iter.doBindData(data.children[i]);
			i = i + 1;
		}
	}

	return;
}

UIElement.prototype.bindDataUrl = function(dataUrl, doConvert, onBindDone) {
	var rInfo = {};
	var shape = this;

	httpGetJSON(dataUrl, function(js) {
		if(doConvert) {
			js = doConvert(js);
		}

		if(js) {
			shape.bindData(js, "default", true);
		}

		if(onBindDone) {
			onBindDone(js);
		}
	});

	return;
}

///////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////

function UIElementCreator(type) {
	type = type ? type : "ui-element";

	var args = [type, "UI-Element", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new UIElement();

		return g.initUIElement(this.type);
	}
	
	return;
}

UIElement.prototype.sortChildren = function() {
	return;
}

UIElement.prototype.shouldShowContextMenu = function() {
	return this.isInDesignMode();
}

UIElement.prototype.setText = function(text, notify) {
	if(this.text != text) {
		this.text = this.toText(text);

		if(notify) {
			this.callOnChangedHandler(text);
		}

		this.textNeedRelayout = true;
	}

	this.postRedraw();

	return this;
}

UIElement.prototype.getValue = function() {
	return this.getText();
}

UIElement.prototype.setValue = function(value, notify, animation) {
	var me = this;
	var oldValue = this.getText() || 0;

	value = String(value);
	if(value == String(oldValue)) return this;
	if(!!animation && !isNaN(+value) && !isNaN(+oldValue)) {
		var fixLen = value.indexOf('.') > -1 ? (value.length - value.indexOf('.') - 1) : 0;

		this.animate({
			duration: 300,
			valueEnd: +value,
			valueStart: +oldValue,
			onStep: function(ui, timePercent, config) {
				me.setText(config.value.toFixed(fixLen));
				return true;
			},
			onDone: function(ui, aniName) {
				me.setText(value);
				console.debug('element setValue onDone');
			}
		});
	}
	else {
		this.setText(value);
	}

	return this;
}

UIElement.prototype.addValue = function(delta, notify, animation) {
	var oldValue = this.getValue();
	var colonIdx = String(oldValue).indexOf(':');

	if(colonIdx == -1) {
		oldValue = +oldValue;
		var value = (isNaN(oldValue) ? 0 : oldValue) + (isNaN(+delta) ? 0 : +delta);
		var lenOld   = getFixlen(String(oldValue));
		var lenDelta = getFixlen(String(delta));
		var lenValue = getFixlen(String(value));
		var length = lenOld > lenDelta ? lenOld : lenDelta;
			length = length > lenValue ? lenValue : length;

		function getFixlen(str) {
			return str.indexOf('.') > -1 ? (str.length - str.indexOf('.') - 1) : 0;
		}

		return this.setValue(value.toFixed(length), notify, animation);
	}
	else {
		var min   = +oldValue.substr(0, colonIdx);
		var sec   = +oldValue.substr(colonIdx+1, 2);
		var total = (isNaN(min) ? 0 : min*60) + (isNaN(sec) ? 0 : sec);
		var dst = total + delta>>0;
		if(isNaN(+delta) || dst < 0) {
			return this;
		}
		else {
			var min = Math.floor(dst/60);
			var sec = dst%60;
			min = min < 10 ? ('0' + min) : min;
			sec = sec < 10 ? ('0' + sec) : sec;
			return this.setValue(min + ':' + sec);
		}
	}
}

UIElement.prototype.getPositionInView = function() {
	var x = this.getX();
	var y = this.getY();
	var point = {x:0, y:0};
	var iter = this.parentShape;

	while(iter != null) {
		x += iter.getX();
		y += iter.getY();
		if(iter.isUIVScrollView) {
			y = y - iter.offset;
		}
		else if(iter.isUIHScrollView) {
			x = x - iter.offset;
		}
		else if(iter.isUIScene || iter.isUIScrollViewX) {
			x = x - iter.xOffset;
			y = y - iter.yOffset;
		}
		iter = iter.parentShape;
	}

	point.x = x;
	point.y = y;

	return point;
}

UIElement.prototype.getLocaleText = function(text) {
	var str = webappGetText(text);

	if(!str) {
		return text;
	}

	if(!this.locale) {
		this.locale = {text:str};
		this.needRelayout = true;
	}

	return str;
}

UIElement.prototype.getLocaleInputTips = function(text) {
	var str = webappGetText(text);

	return str ? str : text;
}

UIElement.prototype.setBgImage = function(src) {
	return this.setImage(UIElement.IMAGE_DEFAULT, src);
}

UIElement.prototype.onImageLoad = function() {
	this.postRedraw();
}

UIElement.prototype.getDefaultImageType = function() {
	return UIElement.IMAGE_DEFAULT;
}

UIElement.prototype.setImage = function(type, src) {
	var me = this;
	var n = arguments.length;
	if(n < 2) {
		src = type;
		type = this.getDefaultImageType();
	}
	else {
		type = type ? type : this.getDefaultImageType();
	}

	var image = null;
	if(src === null || src === undefined) {
		image = WImage.create(null); 
	}else if(typeof src === "object") {
		if(src.image) {
			image = src;
		}
		else {
			image = WImage.createWithImage(src); 
		}
	}else if(typeof src === "number" || src.length < 4) {
		image = this.images["option_image_" + src];
	}else {
		image = WImage.create(src, this.onImageLoad.bind(this));
	}

	this.images[type] = image;

	return this;
}

UIElement.prototype.getHtmlImageByType = function(type) {
	if(typeof type === "number") {
		type = "option_image_" + type;
	}
	
	var image = this.images[type];
	return image ? image.getImage() : null;
}

UIElement.prototype.getImageByType = function(type) {
	if(typeof type === "number") {
		type = "option_image_" + type;
	}
	
	return this.images[type];
}

UIElement.prototype.getImageSrcByType = function(type) {
	if(typeof type === "number") {
		type = "option_image_" + type;
	}

	var image = this.images[type];
	return image ? image.getImageSrc() : "";
}

UIElement.prototype.getImageTypes = function() {
	var names = [];
	
	for(var key in this.images) {
		var value = this.images[key];
		if(key != "display") {
			names.push(key);
		}
	}

	return names;
}

UIElement.prototype.addEventNames = function(eventNames) {
	if(eventNames) {
		for(var i = 0; i < eventNames.length; i++) {
			var eName = eventNames[i];
			if(!this.events[eName]) {
				this.events[eName] = null;
			}
		}
	}

	return this;
}

UIElement.prototype.removeEventNames = function(eventNames) {
	if(eventNames) {
		for(var i = 0; i < eventNames.length; i++) {
			var eName = eventNames[i];
			delete this.events[eName];
		}
	}

	return this;
}

UIElement.prototype.getEventNames = function() {
	var eventNames = [];

	for(var key in this.events) {
		eventNames.push(key);
	}

	return eventNames;
}

UIElement.uidStart = 10000 + Math.floor(Math.random() * 10000);
UIElement.prototype.initUIElement= function(type) {
	this.initContainerShape(type);

	this.enable = true;
	this.visible = true;
	this.opacity = 1;
	this.vMargin = 0;
	this.hMargin = 0;
	this.xAttr		= UIElement.X_FIX_LEFT;
	this.yAttr		= UIElement.Y_FIX_TOP;
	this.widthAttr	= UIElement.WIDTH_FIX;
	this.heightAttr = UIElement.HEIGHT_FIX;
	this.name = type;
	this.events = {};
	this.uid = UIElement.uidStart++;
	this.runtimeVisible = true;

	this.images  = {};
	this.images.display = UIElement.IMAGE_DISPLAY_9PATCH;
	this.addEventNames(["onClick"]);

	return this;
}

UIElement.prototype.updateLayoutParams = function() {
	var p = this.parentShape;

	if(!p) {
		return;
	}

	this.xParam = 1;
	this.yParam = 1;
	this.widthParam = 1;
	this.heightParam = 1;

	var wParent = p.getRelayoutWidth();
	var hParent = p.getRelayoutHeight();
	
	if(this.xAttr === UIElement.X_SCALE) {
		this.xParam = this.left/wParent;
	}
	else if(this.xAttr === UIElement.X_FIX_RIGHT) {
		this.xParam = wParent - (this.left + this.w);
	}
	
	if(this.yAttr === UIElement.Y_SCALE) {
		this.yParam = this.top/hParent;
	}
	else if(this.yAttr === UIElement.Y_FIX_BOTTOM) {
		this.yParam = hParent - (this.top + this.h);
	}

	if(this.widthAttr === UIElement.WIDTH_SCALE) {
		this.widthParam = this.w/wParent;
		this.widthScaleMin = this.w >> 1;
		this.widthScaleMax = this.w << 1;
	}

	if(this.heightAttr === UIElement.HEIGHT_SCALE) {
		this.heightParam = this.h/hParent;
		this.heightScaleMin = this.h >> 1;
		this.heightScaleMax = this.h << 1;
	}

	if(this.heightAttr === UIElement.HEIGHT_KEEP_RATIO_WITH_WIDTH) {
		this.heightParam = this.h/this.w;
	}

	return this;
}

UIElement.prototype.imagesToJson = function(o) {
	o.images = {};

	for(var key in this.images) {
		var value = this.images[key];
		if(key === "display") {
			o.images[key] = value;
		}
		else {
			var src = value.getImageSrc();
			src = this.getRelativePathOfURL(src);

			if(src) {
				o.images[key] = src;

				var sharpOffset = src.indexOf("#");
				if(sharpOffset > 0) {
					var realSrc = value.getRealImageSrc();
					realSrc = this.getRelativePathOfURL(realSrc);
				
					var url = src.substr(0, sharpOffset);	
					if(realSrc && realSrc.indexOf(src) < 0) {
						o.images["real-image-"+url] = decodeURI(realSrc);
					}
				}
			}
		}
	}

	return o;
}

UIElement.prototype.imagesFromJson = function(js) {
	if(js.images) {
		for(var key in js.images) {
			var value = js.images[key];
			if(key === "display") {
				this.images[key] = value;
			}
			else if(key.indexOf("real-image") !== 0) {
				this.setImage(key, value);
			}
		}
	}

	return;
}

UIElement.prototype.getEnable = function() {
	return this.enable;
}

UIElement.prototype.setEnable = function(enable) {
	this.enable = enable;

	return this;
}

UIElement.prototype.isEnable = function() {
	var iter = this;

	if(!this.isValid()) {
		return false;
	}

	while(iter != null) {
		if(!iter.enable) {
			return false;
		}

		iter = iter.parentShape;
	}

	return true;
}

UIElement.prototype.getVisible = function(visible) {
	return this.visible;
}

UIElement.prototype.setVisible = function(visible) {
	this.visible = visible;

	if(!visible) {
		if(this.animatingInfo) {
			UIElement.logWarning("hide animating element invisble.");
		}
	}

	return this;
}

UIElement.prototype.isVisible = function() {
	var iter = this;

	if(!this.isValid()) {
		return false;
	}

	while(iter != null) {
		if(!iter.visible) {
			return false;
		}

		iter = iter.parentShape;
	}

	return true;
}

UIElement.prototype.isFocused = function() {
	return this.parentShape && this.parentShape.targetShape == this;
}

UIElement.prototype.onShowHTML = function() {
	return;
}

UIElement.prototype.onHideHTML = function() {
	return;
}

UIElement.prototype.showHTML = function() {
	var i = 0;
	var n = this.children.length;

	for(i = 0; i < n; i++) {
		var child = this.children[i];
		child.showHTML();
	}

	this.onShowHTML();

	return;
}

UIElement.prototype.hideHTML = function() {
	var i = 0;
	var n = this.children.length;

	for(i = 0; i < n; i++) {
		var child = this.children[i];
		child.hideHTML();
	}

	this.onHideHTML();

	return;
}

UIElement.prototype.show = function() {
	return this.setVisible(true);
}

UIElement.prototype.hide = function() {
	return this.setVisible(false);
}

UIElement.prototype.beforeRelayout = function() {
}

UIElement.prototype.afterRelayout = function() {
}

UIElement.prototype.getPrevSibling = function() {
	if(!this.parentShape || this.parentShape.children.length < 2) {
		return null;
	}

	var i = 0;
	for(i = 0; i < this.parentShape.children.length; i++) {
		if(this.parentShape.children[i] === this) {
			break;
		}
	}

	return i > 0 ? this.parentShape.children[i-1] : null;
}

UIElement.prototype.setAutoScaleFontSize = function(value) {
	this.enableAutoScaleFontSize = value;

	return this;
}

UIElement.prototype.autoScaleFontSize = function(scale) {
	if(this.enableAutoScaleFontSize) {
		var fontSize = Math.round(this.style.fontSize * scale);
		
		fontSize = Math.min(fontSize, 36);
		fontSize = Math.max(fontSize, 12);
		this.style.setFontSize(fontSize);
	}

	return;
}


UIElement.prototype.getRelayoutWidth = function() {
	return this.getWidth();
}

UIElement.prototype.getRelayoutHeight = function() {
	return this.getHeight();
}

UIElement.prototype.relayout = function() {
	if(this.disableRelayout) {
		return;
	}
	
	var p = getParentShapeOfShape(this);
	if(!p || !p.isUIElement) {
		if(this.isInDesignMode()) {
			this.setUserMovable(true);
			this.setUserResizable(true);
		}
	}

	if(this.isUIDevice) {
		this.setUserResizable(false);
	}

	if(!p) {
		this.relayoutChildren();
		return;
	}

	var w = 0;
	var h = 0;
	var x = 0;
	var y = 0;
	var xAttr = this.xAttr;
	var yAttr = this.yAttr;
	var wParent = p.getRelayoutWidth();
	var hParent = p.getRelayoutHeight();
	var hMargin = p.getHMargin();
	var vMargin = p.getVMargin();
	var wParentClient = wParent - hMargin - hMargin;
	var hParentClient = hParent - vMargin - vMargin;

	var bottom = this.top + this.h;
	var right = this.left + this.w

	this.beforeRelayout();

	switch(this.widthAttr) {
		case UIElement.WIDTH_SCALE: {
			w = wParent * this.widthParam;
			if(this.widthScaleMin && w < this.widthScaleMin) {
				if(this.pointerDown) {
					this.widthScaleMin = w;
				}
				else {
					w = this.widthScaleMin;
				}
			}
			if(this.widthScaleMax && w > this.widthScaleMax) {
				if(this.pointerDown) {
					this.widthScaleMax = w;
				}
				else {
					w = this.widthScaleMax;
				}
			}

			break;
		}
		case UIElement.WIDTH_FILL_PARENT: {
			w = wParentClient;
			this.left = hMargin;
			xAttr = UIElement.X_FIX_LEFT;
			break;
		}
		default: {
			w = this.w;
			break;
		}
	}

	switch(this.heightAttr) {
		case UIElement.HEIGHT_SCALE: {
			h = hParent * this.heightParam;
			if(this.heightScaleMin && h < this.heightScaleMin) {
				if(this.pointerDown) {
					this.heightScaleMin = h;
				}
				else {
					h = this.heightScaleMin;
				}
			}
			if(this.heightScaleMax && h > this.heightScaleMax) {
				if(this.pointerDown) {
					this.heightScaleMax = h;
				}
				else {
					h = this.heightScaleMax;
				}
			}

			break;
		}
		case UIElement.HEIGHT_FILL_PARENT: {
			h = hParentClient;
			this.top = vMargin;
			yAttr = UIElement.Y_FIX_TOP;
			break;
		}
		default: {
			h = this.h;
			break;
		}
	}

	switch(xAttr) {
		case UIElement.X_SCALE: {
			x = wParent * this.xParam;
			break;
		}
		case UIElement.X_FIX_RIGHT: {
			x = wParent - this.xParam - this.w;
			break;
		}
		case UIElement.X_CENTER_IN_PARENT: {
			x = (wParent - w) >> 1;
			break;
		}
		case UIElement.X_LEFT_IN_PARENT: {
			x = hMargin;
			break;
		}
		case UIElement.X_RIGHT_IN_PARENT: {
			x = wParent - w - hMargin;
			break;
		}
		default: {
			x = this.left;
			break;
		}
	}
		
	switch(yAttr) {
		case UIElement.Y_SCALE: {
			y = hParent * this.yParam;
			break;
		}
		case UIElement.Y_FIX_BOTTOM: {
			y = hParent - this.yParam - this.h;
			break;
		}
		case UIElement.Y_MIDDLE_IN_PARENT: {
			y = (hParent - h) >> 1;
			break;
		}
		case UIElement.Y_TOP_IN_PARENT: {
			y = vMargin;
			break;
		}
		case UIElement.Y_BOTTOM_IN_PARENT: {
			y = hParent - h - vMargin;
			break;
		}
		default: {
			y = this.top;
			break;
		}
	}
	
	if(this.widthAttr === UIElement.WIDTH_FILL_TO_PARENT_RIGHT) {
		w = wParent - x  - hMargin;
	}
			
	if(this.heightAttr === UIElement.HEIGHT_FILL_TO_PARENT_BOTTOM) {
		h = hParent - y - vMargin;
	}
	
	if(this.heightAttr === UIElement.HEIGHT_KEEP_RATIO_WITH_WIDTH) {
		h = w * this.heightParam;	
	}

	var oldW = this.w;

	this.w	= Math.round(w);
	this.h	= Math.round(h);
	this.setLeftTop(x, y);

	if(p.isUIElement) {
		if(this.isInDesignMode()) {
			var win = this.getWindow();
			if(win && !win.isUIScene && !win.isUIDialog) {
				p.fixChildSize(this);
			}
		}
		p.fixChildPosition(this);
	}
	
	this.setSize(this.w, this.h);
	
	this.autoScaleFontSize(w/oldW);
	this.relayoutChildren();
	this.afterRelayout();
	this.setTextNeedRelayout(true);

	return;
}

UIElement.prototype.beforeRelayoutChild = function(shape) {
	return true;
}

UIElement.prototype.afterRelayoutChild = function(shape) {
	return true;
}

UIElement.prototype.relayoutChildren = function() {
	if(this.disableRelayout || !this.children) {
		return;
	}

	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		if(child.widthAttr === UIElement.WIDTH_FILL_AVAILABLE || child.heightAttr === UIElement.HEIGHT_FILL_AVAILABLE) {
			continue;
		}

		if(this.beforeRelayoutChild(child)) {
			child.relayout();
		}
		this.afterRelayoutChild(child);
	}
	
	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		if(!(child.widthAttr === UIElement.WIDTH_FILL_AVAILABLE || child.heightAttr === UIElement.HEIGHT_FILL_AVAILABLE)) {
			continue;
		}

		if(this.beforeRelayoutChild(child)) {
			child.relayout();
		}
		this.afterRelayoutChild(child);
	}

	return;
}

UIElement.prototype.getWindowManager = function() {
	return UIWindowManager.getInstance();
}

UIElement.prototype.getDevice = function() {
	var iter = this;

	while(iter != null && !iter.isUIDevice) {
		iter = iter.parentShape;
	}

	return iter;
}

UIElement.prototype.getDeviceConfig = function() {
	var windowManager = this.getWindowManager();
	if(windowManager) {
		return windowManager.getDeviceConfig();
	}

	return null;
}

UIElement.prototype.getTopWindow = function() {
	var wm = this.getWindowManager();

	return wm.getCurrentWindow();
}

UIElement.prototype.setAssetsLoadingWindow = function(name) {
	var wm = this.getWindowManager();
	if(wm) {
		wm.setAssetsLoadingWindow(name);
	}

	return this;
}

UIElement.prototype.isTopWindow = function() {
	var win = this.getWindow();

	return win === this.getTopWindow();
}

UIElement.prototype.getWindow = function() {
	var iter = this;

	while(iter != null && !iter.isUIWindow) {
		iter = iter.parentShape;
	}

	return iter;
}

UIElement.prototype.getPositionInWindow = function() {
	var p = this.getAbsLeftTop();
	var anchor = this.anchor;

	if(anchor) {
		p.x += anchor.x * this.w;
		p.y += anchor.y * this.h;
	}

	return p;
}

UIElement.prototype.getAbsLeftTop = function() {
	var iter = this;
	var x = iter.left;
	var y = iter.top;

	while(iter != null && !iter.isUIWindow) {
		iter = iter.parentShape;
		if(iter.isUIWindow) {
			break;
		}

		x = x + iter.left;
		y = y + iter.top;
	}

	return {x:x, y:y};
}

UIElement.prototype.localToGlobal = function(point) {
	var p = this.getAbsLeftTop();

	p.x += point.x;
	p.y += point.y;

	return p;
}

UIElement.prototype.globalToLocal = function(point) {
	var p = this.getAbsLeftTop();

	p.x = point.x - p.x;
	p.y = point.y - p.y;

	return p;
}

UIElement.prototype.getWindowNames = function() {
	var wm = this.getWindowManager();
	if(wm) {
		return wm.getWindowNames();
	}

	return [];
}

UIElement.prototype.openScene = function(name, initData) {
	var wm = this.getWindowManager();
	setTimeout(function() {
		wm.openWindow(name, null, true, initData);
	}, 0);
}

UIElement.prototype.isWindowOpen = function(name) {
	var wm = this.getWindowManager();
	var win = wm.find(name);

	return win && win.isOpen();
}

UIElement.prototype.openWindow = function(name, onClose, closeCurrent, initData, options) {
	var wm = this.getWindowManager();
	if(wm) {
		return wm.openWindow(name, onClose, closeCurrent, initData, options);
	}

	return false;
}

UIElement.prototype.closeAllWindows = function() {
	var wm = this.getWindowManager();
	if(wm) {
		wm.closeAll();
	}

	return;
}

UIElement.prototype.backToHomeWin = function() {
	var wm = this.getWindowManager();
	if(wm) {
		wm.backToHomeWin();
	}

	return;
}

UIElement.prototype.closeWindow = function(retInfo, syncClose) {
	var win = this.getWindow();
	var wm = this.getWindowManager();

	if(wm && win) {
		if(win.isOpen()) {
			return wm.closeWindow(win, retInfo, syncClose);
		}
		else {
			console.log("Current Window Is Not Open.");
		}
	}

	return false;
}

UIElement.prototype.canBeComponent = function() {
	return true;
}

UIElement.prototype.isCreatingElement = function() {
	if(this.view && this.view.creatingShape === this) {
		return true;
	}

	return false;
}

UIElement.prototype.onScaleForDensityDone = function(sizeScale, lcdDensity) {
}

UIElement.prototype.setNotScaleForDensity = function(notScaleForDensity) {
	this.notScaleForDensity = notScaleForDensity;

	return;
}

UIElement.prototype.scaleForDensity = function(sizeScale, lcdDensity, recuresive) {
	if(!sizeScale || sizeScale === 1 || this.notScaleForDensity) {
		return;
	}

	if(this.widthAttr === UIElement.WIDTH_FIX) {
		this.w = Math.floor(this.w * sizeScale);
	}

	if(this.heightAttr === UIElement.HEIGHT_FIX) {
		this.h = this.h * sizeScale;
		if(this.h < 36 && (this.isUIButton || this.isUIProgressBar || this.isUIColorTile || this.isUIColorButton
			|| this.isUIEdit || this.isUIRadioBox || this.isUICheckBox || this.isUIWaitBar || this.isUISwitch)) {
			this.h = 40;
		}

		if(this.h < 50 && (this.isUIToolBar || this.isUIButtonGroup)) {
			this.h = 50;
		}

		if(this.hMin > this.h) {
			this.hMin = this.h;
		}
	}

	var isCreating = this.isCreatingElement();
	if(!isCreating && this.yAttr === UIElement.Y_FIX_TOP) {
		this.top = Math.floor(this.top * sizeScale);
	}

	if(!isCreating && this.xAttr === UIElement.X_FIX_LEFT) {
		this.left = Math.floor(this.left * sizeScale);
	}

	this.style.setFontSize(Math.floor(this.style.fontSize * sizeScale));

	if(this.itemHeight > 20) {
		this.itemHeight = Math.floor(this.itemHeight * sizeScale);
	}

	if(this.roundRadius) {
		this.roundRadius = Math.floor(this.roundRadius * sizeScale);
	}

	this.vMargin = Math.floor(this.vMargin * sizeScale);
	this.hMargin = Math.floor(this.hMargin * sizeScale);

	if(this.buttonHeight > 40) {
		this.buttonHeight = Math.floor(this.buttonHeight * sizeScale);
	}
	
	this.left = Math.floor(this.left);
	this.top = Math.floor(this.top);
	this.w = Math.round(this.w);
	this.h = Math.round(this.h);

	if(recuresive) {
		for(var i = 0; i < this.children.length; i++) {
			var iter = this.children[i];
			iter.scaleForDensity(sizeScale, lcdDensity, true);
		}
	}

	if(this.isUIProgressBar) {
		var value = this.getValue();
		this.setValue(0);
		this.setValue(value);
	}

	this.onScaleForDensityDone(sizeScale, lcdDensity);

	return;
}

UIElement.prototype.onDeviceConfigChanged = function(oldConfig, newConfig) {
	return;
}

UIElement.prototype.fixImagePath = function(oldConfig, newConfig) {
	var oldVersion	= oldConfig.version;
	var oldPlatform = oldConfig.platform;
	var oldDensity	= oldConfig.lcdDensity;
	var newVersion	= newConfig.version;
	var newPlatform = newConfig.platform;
	var newDensity	= newConfig.lcdDensity;

	for(var key in this.images) {
		var value = this.images[key];
		if(key === "display") {
			continue;
		}
		
		var src = value.getImageSrc();
		if(src) {
//			src = src.replaceAll("/" + oldVersion + "/", "/" + newVersion + "/");
//			src = src.replaceAll("/" + oldPlatform + "/", "/" + newPlatform + "/");
			src = src.replaceAll("/" + oldDensity + "/", "/" + newDensity + "/");
			value.setImageSrc(src);
		}
	}

	return;
}

UIElement.prototype.scaleForCurrentDensity = function(value) {
	var config = this.getDeviceConfig();
	var lcdDensity = this.getDensitySizeByName(config ? config.lcdDensity : "hdpi");
	
	return value * (lcdDensity/160);
}

UIElement.prototype.getDensitySizeByName = function(density) {
	switch(density) {
		case "ldpi": {
			return 80;
		}
		case "mdpi": {
			return 160;
		}
		case "hdpi": {
			return 240;
		}
		case "xhdpi": {
			return 350;
		}
		case "xxhdpi": {
			return 450;
		}
		default: {
			console.log("not supported density: " + density);
		}
	}

	return 160;
}

UIElement.prototype.getSizeScale = function(oldDensity, newDensity) {
	var oldSize = this.getDensitySizeByName(oldDensity);
	var newSize = this.getDensitySizeByName(newDensity);

	var sizeScale = newSize/oldSize;

	return sizeScale;
}

UIElement.prototype.notifyDeviceConfigChanged = function(oldConfig, newConfig) {
	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		child.notifyDeviceConfigChanged(oldConfig, newConfig);
	}

	this.fixImagePath(oldConfig, newConfig);
	this.onDeviceConfigChanged(oldConfig, newConfig);
	
	return;
}

UIElement.prototype.addMovementForVelocityTracker = function() {
	if(this.velocityTracker) {
		var p = {};
		p.x = this.getMoveAbsDeltaX();
		p.y = this.getMoveAbsDeltaY();

		var timeNs = Date.now() * 1000000;
		this.velocityTracker.addMovement(timeNs, p);
		delete date;
	}

	return;
}

UIElement.prototype.isUserMovable = function() {
	return this.userMovable && !this.isLocked();
}

UIElement.prototype.isUserResizable = function() {
	return this.userResizable;
}

UIElement.prototype.getEditorRect = function() {
	var rect = {};
	rect.x = this.left;
	rect.y = this.top;
	rect.w = this.w;
	rect.h = this.h;

	return rect;
}


UIElement.funcs = [];
UIElement.setAnimTimer = function(func, deltaTime) {
	return UIElement.setTimeout(func, deltaTime);	
}

UIElement.setTimeout = function(func, deltaTime) {
	deltaTime = deltaTime ? Math.max(deltaTime, 16) : 16;

	func.deltaTime = deltaTime;
	func.time = Date.now() + deltaTime;
	UIElement.funcs.push(func);

	function executeTimers() {
		var funcs = UIElement.funcs;

		var now = Date.now();
		var n = funcs.length;
		UIElement.funcs = [];

		for(var i = 0; i < n; i++) {
			var iter = funcs[i];
			if(iter.time <= now) {
				if(iter()) {
					iter.time = now + iter.deltaTime;
					UIElement.funcs.push(iter);
				}
			}
			else {
				UIElement.funcs.push(iter);
			}
		}

		funcs = null;
		if(UIElement.funcs.length) {
			UIElement.animTimerID = requestAnimFrame(executeTimers);
		}
		else {
			UIElement.animTimerID = 0;
		}
	}

	if(!UIElement.animTimerID) {
		UIElement.animTimerID = requestAnimFrame(executeTimers, 16);
	}

	return;
}

UIElement.getMainCanvas = function() {
    return CantkRT.getMainCanvas();
}

UIElement.getMainCanvasScale = function(force) {
	return CantkRT.getMainCanvasScale();
}

UIElement.prototype.isFullscreenMode = function() {
	return cantkIsFullscreen();
}

UIElement.prototype.setFlipX = function(flipX) {
	this.flipX = flipX;

	return this;
}

UIElement.prototype.setFlipY = function(flipY) {
	this.flipY = flipY;

	return this;
}

UIElement.prototype.getFlipX = function() {
	return this.flipX;
}

UIElement.prototype.getFlipY = function() {
	return this.flipY;
}

UIElement.prototype.requestFullscreen = function(onDone) {
	if(!isMobile()) {
		if(onDone) {
			onDone(false);
		}
		console.log("UIElement.requestFullScreen Rejected(not mobile)");
	}
	else {
		if(!cantkRequestFullscreen(onDone)) {
			onDone(false);
		}
		console.log("UIElement.requestFullScreen");
	}

	return;
}

UIElement.prototype.pickFiles = function(contentType, onDone) {
	return showFileDialog(contentType, true, false, onDone);
}

UIElement.prototype.pickFile = function(contentType, onDone) {
	if(!window.FileReader) {
		return false;
	}

	showFileDialog(contentType, false, true, function(files) {
		var file = files[0];
		if (file) {
			var reader  = new FileReader();
			reader.readAsDataURL(file);
			reader.onloadend = function () {
				if(onDone) {
					onDone(file, reader.result);
				}
				reader = null;
			}
		}
	});

	return true;
}

UIElement.prototype.pickAudio = function(onDone) {
	return this.pickFile("audio/*", onDone);
}

UIElement.prototype.pickImage = function(onDone) {
	return this.pickFile("image/*", onDone);
}

UIElement.fixArtTextStyle = function(style) {
	style.fontSize = style.fontSize ? style.fontSize : 16;
	style.imageBorder = style.imageBorder? style.imageBorder: 10;
	style.textAlignH = style.textAlignH ? style.textAlignH : "left";
	style.startColor = style.startColor ? style.startColor : "Green";
	style.endColor = style.endColor ? style.endColor : "Green";
	style.lineWidth = style.lineWidth ? style.lineWidth : 0;
	style.lineColor = style.lineColor ? style.lineColor : "Black";
	style.shadowColor = style.shadowColor ? style.shadowColor : "Black";
	style.shadowBlur = style.shadowBlur ? style.shadowBlur : 0;
	style.shadowOffsetX = style.shadowOffsetX ? style.shadowOffsetX : 0;
	style.shadowOffsetY = style.shadowOffsetY ? style.shadowOffsetY : 0;
	
	return style;
}

UIElement.createArtTextImage = function(text, style, bgColor) {
	UIElement.fixArtTextStyle(style);

	if(!text) {
		return null;
	}

	var w = 300;
	var h = 80;
	var border = style.imageBorder;
	var fontSize = style.fontSize;
	var fontFamily = style.fontFamily;
	var textAlign = style.textAlignH;
	var monospace = style.monospace;
	var tcanvas = cantkGetTempCanvas(w, h);
	var ctx = tcanvas.getContext("2d");
	ctx.clearRect(0, 0, w, h);

	var x = w >> 1;
	var y = h >> 1;
	var fontStr = "";
	var n = text.length;
	if(style.textB) {
		fontStr += "Bold ";
	}

	if(style.textI) {
		fontStr += "Italic ";
	}

	fontStr += fontSize + "pt '" + fontFamily + "'";
	ctx.font = fontStr;
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";

	switch(textAlign) {
		case 'left': {
			x = border;
			ctx.textAlign = "left";
			break;
		}
		case 'right': {
			x = w-border;
			ctx.textAlign = "right";
			break;
		}
		default:break;
	}

	if(monospace) {
		var cw = 0;
		for(var i = 0; i < n; i++) {
			var c = text[i];
			var charW = ctx.measureText(c).width;
			if(charW > cw) {
				cw = charW;
			}
		}
		cw = cw + 4;
		w = n * cw;
	}
	else {
		var textW = ctx.measureText(text).width;
		w = textW + border * 2;
	}
	h = style.fontSize + 2*(Math.abs(style.shadowOffsetY) + style.shadowOffsetY + border);
	tcanvas.width = w;
	tcanvas.height = h;

	if(bgColor) {
		ctx.fillStyle = bgColor;
		ctx.fillRect(0, 0, w, h);
	}

	ctx.font = fontStr;
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";
	if(style.useTexture && style.texture) {
		var wimage = WImage.create(style.texture);
		var image = wimage.getImage();
		if(image) {
			var pattern = ctx.createPattern(image, "repeat");
			ctx.fillStyle = pattern;
		}
	}
	else {
		if(style.startColor != style.endColor) {
			var grd = ctx.createLinearGradient(0,0,0,h);
			if(style.horizonalGradient) {
				grd = ctx.createLinearGradient(0,0,w,0);
			}
			grd.addColorStop(0, style.startColor);
			grd.addColorStop(1, style.endColor);
			ctx.fillStyle = grd;
		}
		else {
			ctx.fillStyle = style.startColor;
		}
	}

	if(style.shadowBlur) {
		ctx.shadowOffsetX = style.shadowOffsetX;
		ctx.shadowOffsetY = style.shadowOffsetY;
		ctx.shadowBlur = style.shadowBlur;
		ctx.shadowColor = style.shadowColor;
	}

	x = w >> 1;
	y = h >> 1;
	ctx.lineWidth = style.lineWidth;
	ctx.strokeStyle = style.lineColor;

	if(monospace) {
		x = 0;
		var hcw = cw >> 1;
		var n = text.length;
		ctx.textAlign = "center";
		for(var i = 0; i < n; i++) {
			x = i * cw + hcw;
			var c = text[i];
			ctx.fillText(c, x, y);
			ctx.strokeText(c, x, y);
		}
	}
	else {
		ctx.fillText(text, x, y);
		if(ctx.lineWidth) {
			ctx.strokeText(text, x, y);
		}
	}

	var url = tcanvas.toDataURL();

	return url;
}

ShapeFactoryGet().addShapeCreator(new UIGroupCreator(200, 200, null));

UIElement.prototype.timeScaleIsZero = function() {
	return Math.abs(this.getTimeScale()) < 0.00001;
}

UIElement.prototype.getTimeScale = function() {
	return this.win.getTimeScale();
}

UIElement.prototype.scaleTime = function(t) {
	return this.win.getTimeScale() * t;
}

UIElement.prototype.setTimeScale = function(timeScale) {
	this.win.setTimeScale(timeScale);

	return this;
}

UIElement.prototype.getAppInfo = function() {
	var metaInfo = this.view.getMetaInfo();

	return metaInfo.general;
}

UIElement.logNotice = function(str) {
	console.log("%cNotice: " + str, "color: green; font-weight: bold");
}

UIElement.logWarning = function(str) {
	console.log("%cWarning: " + str, "color: red; font-weight: bold");
}

UIElement.logError = function(str, e) {
	console.log("%cWarning: " + str + "(" + e.message + ")\n" + e.stack, "color: red; font-weight: bold");
}

UIElement.prototype.isPointIn = function(canvas, point) {
	var ret = false;

	if(canvas) {
		canvas.beginPath();
		canvas.rect(0, 0, this.w, this.h);
		canvas.closePath();

		ret = canvas.isPointInPath(point.x, point.y);
	}
	else {
		ret = isPointInRect(point, this);	
	}

	return ret;
}

UIElement.prototype.pInPolygon = function(points, testx, testy) {
	var c = false;

	for (var i = 0, j = points.length-1; i < points.length; j = i++) {
		if (((points[i].y > testy) != (points[j].y > testy)) &&
			(testx < (points[j].x-points[i].x) * (testy-points[i].y) / (points[j].y-points[i].y) + points[i].x))
			c = !c;
	}

	return c;
}

UIElement.prototype.isPointInMatrix = function(rect, point, applyTransform) {
	var x = rect.x,
		y = rect.y,
		w = rect.w,
		h = rect.h,
		p1 = {x: x, 	y: y},
		p2 = {x: x+w, 	y: y},
		p3 = {x: x+w, 	y: y+h},
		p4 = {x: x, 	y: y+h},
		matrix = Matrix2D.identity;

	matrix.beginPath = function() {};
	matrix.clip = function() {};
	matrix.rect = function() {};
	matrix.arc  = function() {};

	try {
		applyTransform.call(this, matrix);
	}
	catch(e) {
		console.debug('applyTransform catch err', err);
	}

	var p11 = matrix.transformPoint(p1.x, p1.y),
		p21 = matrix.transformPoint(p2.x, p2.y),
		p31 = matrix.transformPoint(p3.x, p3.y),
		p41 = matrix.transformPoint(p4.x, p4.y),
		pps = [p11, p21, p31, p41];

	matrix.identity();

	return this.pInPolygon(pps, point.x, point.y);
}

UIElement.prototype.setImageDisplay = function(display) {
	this.images.display = display;

	return this;
}

UIElement.prototype.getPointerDeviceType = function() {
	return WEventsManager.getInstance().getPointerDeviceType();
}

function UIElementCreator(type) {
	var args = [type, "ui-element", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIElement();
		return g.initUIElement(this.type);
	}
	
	return;
}

UIElement.prototype.clearAssetsCache = function(check) {
	this.getWindowManager().clearAssetsCache(check);

	return this;
}

UIElement.prototype.loadAssets = function(winList, onLoadProgress, onDownloadProgress) {
	ResLoader.reset();
	this.getWindowManager().loadAssets(winList, onLoadProgress, onDownloadProgress);

	return this;
}

UIElement.prototype.createElement = function(type) {
	return ShapeFactoryGet().createShape(type, C_CREATE_FOR_PROGRAM);
}

ShapeFactoryGet().addShapeCreator(new UIElementCreator("ui-element"));

UIElement.audioAssets = ["soundURL"];
UIElement.imagesAssets = ["textureURL"];
UIElement.jsonAssets = ["textureJsonURL", "skeletonJsonURL", "soundURL", "dataURL"];

UIElement.assets = UIElement.audioAssets.concat(UIElement.jsonAssets, UIElement.imagesAssets);


/**
 * @class UIElement 
 * 所有组件的基类，它通常是一个矩形区域，有一定的外观形状，并能处理用户事件。
 */

/**
 * @property {String} type
 * 控件的类型名称。如按钮的类型为"ui-button"，请不要修改。
 */

/**
 * @property {String} name
 * 控件的名称。
 */

/**
 * @property {Array} animations 
 * 在Studio的动画编辑器中为控件添加的动画列表，通过动画名字可以获取对应的动画参数。
 *
 *     @example small frame
 *     var fadeIn = this.animations["fade-in"];
 *     console.log(JSON.stringify(fadeIn));
 *
 */

/**
 * @property {UIElement} win
 * 控件所在的窗口或场景。
 *
 *     @example small frame
 *     var ball = this.win.find("ball");
 *     ball.setPosition(100, 100);
 */
Object.defineProperty(UIElement.prototype, "win", {
	get: function () {
		if(!this._win) {
			this._win = this.getWindow();
		}

		return this._win;
	},
	set: function (value) {
		console.log("Warning: can not set window.");
	},
	enumerable: false,
	configurable: true
});

/**
 * @property {Number} x
 * 在父控件中的X坐标。
 */

/**
 * @property {Number} y
 * 在父控件中的Y坐标。
 */

/**
 * @property {Number} anchorX
 * 控件的X锚点。
 */

/**
 * @property {Number} anchorY
 * 控件的Y锚点。
 */

/**
 * @property {Number} width
 * 控件的宽度。
 */

/**
 * @property {Number} height 
 * 控件的高度。
 */

/**
 * @property {Number} scaleX 
 * 控件的X方向的缩放系数。
 */

/**
 * @property {Number} scaleY
 * 控件的Y方向的缩放系数。
 */

/**
 * @property {Number} rotation 
 * 控件的旋转角度(弧度)。
 */

/**
 * @property {Number} opacity
 * 控件的不透明度(0-1)。
 */

/**
 * @property {Boolean} flipX 
 * 控件是否X方向翻转。
 */

/**
 * @property {Boolean} flipY 
 * 控件是否Y方向翻转。
 */

/**
 * @property {Boolean} visible
 * 控件是否对用户可见。
 */

/**
 * @property {Boolean} enable 
 * 控件是否接受用户事件（对于刚体来说，同时会决定刚体是否参与物理世界的运行）。
 */

/**
 * @property {Boolean} pointerDown
 * 指针是否按下。
 */
//==============================================================================

/**
 * @method setPosition
 * 设置控件的位置。
 * @param {Number} x 在父控件上的X坐标。
 * @param {Number} y 在父控件上的Y坐标。
 * @return {UIElement} 返回控件本身。
 *
 * 示例：
 *
 *     @example small frame
 *     var ball = this.win.find("ball");
 *     ball.setPosition(100, 100);
 */

/**
 * @method setAnchor
 * 设置控件的锚点。
 * @param {Number} x 0到1表示从控件左边到右边的位置。比如0.5表示中间。
 * @param {Number} y 0到1表示从控件顶部到底部的位置。比如0.5表示中间。
 * @return {UIElement} 返回控件本身。
 *
 * 示例：把物体移动到场景的中间位置。
 *
 *     @example small frame
 *     var win = this.win;
 *     var ball = win.find("ball");
 *     ball.setAnchor(0.5, 0.5);
 *     ball.setPosition(win.width>>1, win.height>>1);
 */

/**
 * @method setPivot
 * 设置控件的旋转轴点(不适用于刚体)。
 * @param {Number} x 0到1表示从控件左边到右边的位置。比如0.5表示中间。
 * @param {Number} y 0到1表示从控件顶部到底部的位置。比如0.5表示中间。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method setName
 * 设置控件的名称。
 * @param {String} name 名称。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method setOpacity
 * 设置控件的不透明度。
 * @param {Number} opacity 透明度，取值范围(0~1)。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method forEach
 * 遍历所有子控件，callback返回true时停止遍历。
 * @param {Function} callback 函数原型 function(child) {}
 *
 */

/**
 * @method getTarget
 * 获取处理指针事件的子控件。通常用来判断玩家点击了哪个控件。
 * @return {UIElement} 处理指针事件的子控件。
 *
 */

/**
 * @method isWindowOpen 
 * @param {String} winName 窗口名称。
 * @return {Boolean} 指定窗口是否已经打开。
 *
 */

/**
 * @method getOpacity
 * 获取控件的不透明度。
 * @return {Number} 返回对象的不透明度。
 *
 */

/**
 * @method setValue
 * 设置控件的值，不同控件的值有不同的意义，如进度条的值时进度，按钮的值就是上面的文本。
 * @param {Number} value 新的值。
 * @param {Boolean} notify 是否触发onChanged事件。
 * @param {Boolean} animation 是否启用动画(只能用于数值的值)。
 * @return {UIElement} 返回控件本身。
 *
 * 示例：设置进度条的进度。
 *
 *     @example small frame
 *     var win = this.win;
 *     var progressbar = win.find("progressbar");
 *     progressbar.setValue(80, false, true);
 */

/**
 * @method getValue
 * 获取控件的值。
 * @return {Number} 返回对象的值。
 *
 */


/**
 * @method addValue 
 * 在当前的数值上加上一个增量(只能用于数值的值)。
 * @param {Number} delta 增量，可以为负数。
 * @param {Boolean} notify 是否触发onChanged事件。
 * @param {Boolean} animation 是否启用动画。
 * @return {UIElement} 返回控件本身。
 *
 * 示例：设置进度条的进度。
 *
 *     @example small frame
 *     var win = this.win;
 *     var progressbar = win.find("progressbar");
 *     progressbar.addValue(20, false, true);
 */

/**
 * @method setValueOf
 * 设置子控件的值。
 * @param {String} name 子控件的名字。
 * @param {Number} value 值。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method getValueOf
 * 获取子控件的值。
 * @param {String} name 子控件的名字。
 * @return {Number} 返回对象的值。
 *
 */

/**
 * @method setScale
 * 设置控件的缩放比例。
 * @param {Number} x x方向的缩放比例。
 * @param {Number} y y方向的缩放比例。
 * @return {UIElement} 返回控件本身。
 *
 * 注意：缩放比例不改变控件额实际大小和刚体碰撞检测的区域。
 */

/**
 * @method setScaleX
 * 设置控件x方向的缩放比例。
 * @param {Number} scale x方向的缩放比例。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method setScaleY
 * 设置控件y方向的缩放比例。
 * @param {Number} scale y方向的缩放比例。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method getScaleX
 * 获取控件x方向的缩放比例。
 * @return {Number} x方向的缩放比例。
 *
 */

/**
 * @method getScaleY
 * 获取控件y方向的缩放比例。
 * @return {Number} y方向的缩放比例。
 *
 */

/**
 * @method setSize
 * 设置控件的位置。
 * @param {Number} w 控件的宽度。
 * @param {Number} h 控件的高度。
 * @return {UIElement} 返回控件本身。
 *
 * 示例：
 *
 *     @example small frame
 *     var ball = this.win.find("ball");
 *     ball.setSize(100, 100);
 */

/**
 * @method setText
 * 设置控件的文本内容，如控件上的文字。
 * @param {String} text 文本内容
 * @param {Boolean} notify 是否触发onChanged事件。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method setAssetsLoadingWindow 
 * 指定资源加载窗口。对于大型游戏，在初始时只加载部分场景/窗口的资源，其它场景/窗口有两种方式加载：
 *
 * 1.在主场景打开后，调用loadAssets在后台预加载其它场景/窗口。
 *
 * 2.在打开某个场景/窗口时，自动加载对应的资源，此时可以用setAssetsLoadingWindow指定一个显示加载进度的窗口。
 *
 * 该窗口上需要有一个UIProgressBar(用于显示进度)和一个UILabel(用于显示状态)。
 *
 * @param {String} name 资源加载窗口的名称。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method getText
 * 获取控件的文本内容，如控件上的文字。
 * @return {String} 文本内容。
 */

/**
 * @method getParent
 * 获取控件的父控件。
 * @return {UIElement} 父控件。
 */

/**
 * @method find
 * 按名称查找子控件。
 * @param {String} name 子控件的名字。
 * @param {Boolean} recursive 是否递归查找。
 * @return {UIElement} 返回子控件。
 *
 *     @example small frame
 *     var ball = this.win.find("ball");
 *     ball.setPosition(100, 100);
 */

/**
 * @method findChildByPoint
 * 按点击位置查找子控件。
 * @param {Point} point 相对于当前控件左上角的坐标。
 * @param {Boolean} recursive 是否递归查找。
 * @param {Function} checkFunc 回调函数用于检查是否是需要的控件。
 * @return {UIElement} 如果找到子控件返回子控件，否者返回对象本身。
 *
 *     @example small frame
 *     var targetElement = this.findChildByPoint(point, true, function(child) {
 *         //Skip dragger self
 *         return child !== dragger;
 *     });
 */

/**
 * @method isAnimating
 * 判断animate是否完成。
 * @return {Boolean}
 */

/**
 * @method getPointerDeviceType
 * 获取指针输入设备的类型。
 * @return {String} "pointer"表示指针设备， "touch"表示触屏， "mouse"表示鼠标。
 */

/**
 * @method animate
 * 让控件动起来。
 * @param {AnimationConfig} config 动画配置信息或用动画编辑器创建的动画的名称。
 * @param {Function} onDone (可选) 完成时的回调函数。
 * @param {Function} onStep (可选) 每一步的回调函数。
 *
 * 让控件从x=100，移动到x=300：
 *
 *     @example small frame
 *     this.animate({xStart:100, xEnd:300});
 *
 * 让控件从当前位置移动到x=300：
 * 
 *     @example small frame
 *     this.animate({x:300});
 * 
 * 让控件在x=100和300之间往返运动：
 *     
 *     @example small frame
 *     var toLeft ={xStart:100, xEnd:300};
 *     var toRight = {xEnd:100, xStart:300}
 *     toLeft.next = toRight;
 *     toRight.next = toLeft;
 *     this.animate(toLeft);
 *
 * 完成时播放另外一个动画：
 *     
 *     @example small frame
 *     var me = this;
 *     var win = this.getWindow();
 *     var tree = win.find("tree");
 *     var config = {xStart:100, xEnd:300};
 *     config.onDone = function() {
 *         this.animate({xEnd:config.xStart, xStart:config.xEnd});
 *     }
 *     tree.animate(config);
 *
 * 如果需要从一个状态变化到另外一个状态，请用Start/End方式，如果从当前的状态变化到另外一个状态，直接指定它的值就行了。
 */

/**
 * @method stopAnimation
 * 停止animate开启的动画。
 * @param {Boolean} callOnDone 是否调用动画结束的回调函数。
 */

/**
 * @method postRedraw
 * 请求系统重画控件。
 * @param {Rect} rect 要求更新区域，一般为null。
 */

/**
 * @method addChildWithJson
 * 通过json数据创建一个控件，并作为子控件加入当前控件。(推荐使用dupChild来动态创建对象)。
 * @param {Object} json JSON数据
 * @param {Number} index zIndex
 * @return {UIElement} 返回子控件。
 * 
 *     @example small frame
 *     var win = this.getWindow();
 *     
 *     var json = {
 *         "type": "ui-button",
 *         "name": "ui-button2-general",
 *         "w": 200,
 *         "h": 69,
 *         "x": 209,
 *         "y": 155,
 *         "text": "ok",   
 *         "images": {
 *             "display": 2,
 *             "active_bg": "drawapp8/images/common/buttons/green_button_active.png",
 *             "normal_bg": "drawapp8/images/common/buttons/green_button.png",
 *             "disable_bg": "drawapp8/images/common/buttons/green_button.png"
 *         }
 *     }
 *     
 *     var button = win.addChildWithJson(json, 0);
 */

/**
 * @method addChild
 * 加入控件到当前控件中。配合clone函数使用。
 * @param {UIElement} child 要加入的控件。
 * @param {Number} index zIndex
 * @return {UIElement} 返回子控件。
 */

/**
 * @method clone
 * 克隆当前控件。clone的对象是游离的，需要调用addChild加入到某个控件中。
 * @return {UIElement} 返回新控件。
 */

/**
 * @method remove 
 * 移除从父控件中当前控件。
 * @param {Boolean} destroyIt 移除时是否销毁控件。如果后面还会把它加入其它控件就不要销毁，否则销毁。
 * @param {Boolean} syncExec 是否同步执行。如果在当前控件的事件中执行，请使用异步执行。
 */

/**
 * @method dupChild
 * 复制指定的子控件，并加入当前控件中。
 * @param {String} name 子控件的名称。
 * @param {Number} index 新控件的zIndex
 * @return {UIElement} 返回新控件。
 * 
 * 简单用法
 *
 *     @example small frame
 *     var newImage = this.dupChild("image");
 *     newImage.setPosition(10, 10);
 *
 *     复制子对象，然后移到其它控件中。
 *
 *     @example small frame
 *     var win = this.getWindow();
 *     
 *     var newImage = win.dupChild("image");
 *     newImage.remove(false, true);
 *     newImage.setPosition(0, 0);
 *     win.find("ball").addChild(newImage);
 */

/**
 * @method getWindow
 * 获取当前控件所在的窗口/场景。可以直接使用属性win代替。
 * 这是一个很常用的函数，你需要通过这个函数得到窗口对象，然后通过窗口的find函数去找窗口上的其它控件。
 * @return {UIWindow} 当前控件所在的窗口/场景。
 */

/**
 * @method getWindowManager
 * 获取窗口管理器。
 * @return {UIWindowManager} 窗口管理器。
 */

/**
 * @method getTopWindow
 * 获取当前最上层的窗口(普通窗口/对话框/场景)。
 * @return {UIWindow} 当前最上层的窗口。
 */

/**
 * @method openWindow 
 * 打开新窗口。目前有三种窗口：普通窗口，游戏场景和对话框。
 * @param {String} name 新窗口的名称。
 * @param {Function} onWindowClose onWindowClose(retInfo) (可选) 新窗口关闭时的回调函数。
 * @param {Boolean} closeCurrent (可选) 打开新窗口时是否关闭当前窗口。
 * @param {Object} initData (可选) 传递给新窗口的数据, 作为参数传递给新窗口的onOpen/onBeforeOpen事件。
 * @param {Object} options (可选) 其它参数。options.closeOldIfOpened 如果目标窗口已经打开，关闭它并重新打开。options.openNewIfOpened 如果目标窗口已经打开，打开新一个新窗口打开。
 *
 *     @example small frame
 *     this.openWindow("win-bonus",  function (retInfo) {console.log("window closed.");});
 */

/**
 * @method openScene
 * 本函数是对openWindow的包装。打开当前场景相当于重置当前场景，可以实现重玩的功能。
 * @param {String} name 新场景的名称。打开当前场景相当于重置当前场景，可以实现重玩的功能。
 * @param {Object} initData 传递给新窗口的数据, 作为参数传递给新窗口的onOpen/onBeforeOpen事件。
 */

/**
 * @method closeWindow
 * 关闭当前窗口。
 * @param {Object} retInfo 如果openWindow时指定了onWindowClose回调函数，retInfo会作为onWindowClose回调函数的参数。
 *
 *     @example small frame
 *     var retCode = 0;
 *     this.closeWindow(retCode);
 *
 */

/**
 * @method closeAllWindows 
 * 关闭所有打开的窗口。
 *
 */

/**
 * @method setFillColor
 * 设置控件的填充颜色。
 * @param {String} color 颜色。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method setLineColor
 * 设置控件的线条颜色。
 * @param {String} color 颜色。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method setTextColor
 * 设置控件的文本颜色。
 * @param {String} color 颜色。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method getFillColor
 * 获取控件的填充颜色。
 * @param {String} color 颜色。
 * @return {String} 颜色。
 */

/**
 * @method getLineColor
 * 获取控件的线条颜色。
 * @param {String} color 颜色。
 * @return {String} 颜色。
 */

/**
 * @method getTextColor
 * 获取控件的文本颜色。
 * @param {String} color 颜色。
 * @return {String} 颜色。
 */

/**
 * @method setImage
 * 设置控件的图片。
 * @param {String} type (可选, 缺省为背景图片)。不同的控件支持的type不一样，请参控具体的控件文档。
 * @param {Object} src 可以是图片的URL，Image对象，WImage对象或备用图片的索引。
 * @return {UIElement} 返回控件本身。
 *
 * 把图片1设置为当前的图片(请在IDE中预先设置控件的图片1)。
 *
 *     @example small frame
 *     this.win.find("image").setImage(1);
 *
 * 设置按钮的正常和指针按下的图片：
 *
 *     @example small frame
 *     this.setImage(UIElement.IMAGE_NORMAL, 0);
 *     this.setImage(UIElement.IMAGE_ACTIVE, 1);
 *
 */

/**
 * @method setImageScale
 * 设置图片按比例缩放显示。
 * @param {Number} imageScaleX 宽度缩放比例。
 * @param {Number} imageScaleY 高度缩放比例。
 *
 * 如果图片使用的缩放显示，你在程序中通过setSize调整大小后，或者为图片设置url之后，希望图片填充到控件大小，请按如下方式调用一下此方法。
 *
 *      @example small frame
 *      this.setImageScale(0, 0);
 */

/**
 * @method getImageByType
 * 获取控件的图片
 * @param {String} type 不同的控件支持的type不一样，请参控具体的控件文档。
 * @return {WImage} 图片
 *
 * 可以通过索引取到备用图片：
 *
 *     @example small frame
 *     var image = this.getImageByType(0);
 *
 */

/**
 * @method getImageSrcByType
 * 获取控件的图片
 * @param {String} type 不同的控件支持的type不一样，请参控具体的控件文档。
 * @return {String} 图片SRC
 * 可以通过索引取到备用图片：
 *
 *     @example small frame
 *     var src = this.getImageSrcByType(0);
 */

/**
 * @method setTimeScale
 * 设置时间缩放系数，让游戏时间变快或变慢。
 * @param {Number} timeScale 时间缩放系数，0暂停，(0-1)变慢，1正常，大于1表示变快。
 * @return {UIElement} 返回控件本身。
 *
 * 暂停游戏：
 *
 *     @example small frame
 *     this.setTimeScale(0);
 */

/**
 * @method playSoundEffect
 * 播放音效。请先放一个音效控件到场景中，在音效控件的特有属性中添加音频文件。
 * 建议使用代码产生器来产生播放音效的代码。
 * @param {String} name 音效文件名，不用包含路径。
 * @param {Function} onDone (可选) 播放音效完成后的回调函数。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method playSoundMusic
 * 播放背景音乐。请先放一个背景音乐控件到场景中，在背景音乐控件的特有属性中添加音频文件。
 * 建议使用代码产生器来产生播放背景音乐的代码。
 * @param {String} name 背景音乐文件名，不用包含路径。
 * @param {Function} onDone (可选) 播放背景音乐完成后的回调函数。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method stopSoundEffect
 * 停止播放音效。
 * @param {String} name (可选) 音效文件名，不用包含路径。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method stopSoundMusic
 * 停止播放背景音乐。
 * @param {String} name (可选) 音乐文件名，不用包含路径。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method setSoundEffectVolume
 * 设置音效的音量。
 * @param {Number} volume 音量，范围0到1。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method setSoundMusicVolume
 * 设置音乐的音量。
 * @param {Number} volume 音量，范围0到1。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method setSoundEnable
 * 开启/禁止播放音效和背景音乐。
 * @param {Boolean} value 开启/禁止播放音效和背景音乐。 
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method getSoundEnable
 * 获取处于音效和背景音乐是否开启的状态。
 * @return {Boolean} 音效和背景音乐是否开启。
 */

/**
 * @method getSoundMusicEnable
 * 获取背景音乐是否处于开启的状态。
 * @return {Boolean} 播放背景音乐是否开启。
 */

/**
 * @method getSoundEffectEnable
 * 获取音效是否处于开启的状态。
 * @return {Boolean} 播放音效是否开启。
 */

/**
 * @method getPointerPosition
 * 获取指针(Mouse/Touch)在窗口(场景)中的位置。
 * @return {Point} 指针(Mouse/Touch)的位置。 
 */

/**
 * @method setSoundEffectEnable
 * 开启/禁止播放音效。
 * @param {Boolean} value 开启/禁止播放音效。 
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method setSoundMusicEnable
 * 开启/禁止播放背景音乐。
 * @param {Boolean} value 开启/禁止播放背景音乐。 
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method getAppInfo
 * 获取游戏APP的信息
 * @return {Object} APP信息
 *
 * APP信息示例： 
 *
 *     @example small frame
 *     {
 *       "appid":"com.tangide.demo",
 *       "appversion":"1.0.0",
 *       "appname":"Demo",
 *       "appdesc":"Demo",
 *       "gapversion":"1.0",
 *       "screenscale":"fix-width",
 *       "orientation":"portrait",
 *       "developer":"Unkown <unkown@tangide.com>",
 *       "appIcon":"/drawapp8/images/appicons/96.png",
 *       "screenShot1":"",
 *       "screenShot2":"",
 *       "screenShot3":""
 *     }
 */

/**
 * @method getChild
 * 获取指定位置的子控件。
 * @param {Number} index 子控件的索引。
 * @return {UIElement} 返回子控件。
 */

/**
 * @method getChildrenNr
 * 获取子控件的个数。
 * @return {Number} 返回子控件的个数。
 */

/**
 * @method setClipCircle
 * 设置控件的圆形裁剪区域。
 * @param {Number} x
 * @param {Number} y
 * @param {Number} r
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method setClipRect
 * 设置控件的矩形裁剪区域。
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 * @return {UIElement} 返回控件本身。
 *
 * 任意形状裁剪请重载onClip：
 *
 *     @example small frame
 *     var el = this.getWindow().find("el");
 *     
 *     el.onClip = function(ctx2d) {
 *         ctx2d.beginPath();
 *         ctx2d.moveTo(0, 0);
 *         ctx2d.lineTo(100, 100);
 *         ctx2d.lineTo(100, 200);
 *         ctx2d.closePath();
 *         ctx2d.clip();
 *     }
 */

/**
 * @method setRotation
 * 设置控件的旋转角度。
 * @param {Number} rotation 旋转的角度，单位是弧度。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method setFlipX
 * 设置是否水平翻转。
 * @param {Boolean} flipX 是否水平翻转。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method setFlipY
 * 设置是否垂直翻转。
 * @param {Boolean} flipY 是否垂直翻转。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method getPositionInWindow
 * 返回控件在窗口里的位置。
 * @return {Point} 位置信息。
 *
 */

/**
 * @method localToGlobal
 * 把控件内的坐标转换成窗口内的坐标。
 * @param {Point} point 控件内的坐标。
 * @return {Point} 窗口内的坐标。 
 *
 */

/**
 * @method globalToLocal 
 * 把窗口内的坐标换成控件内的坐标。
 * @param {Point} point 窗口内的坐标。
 * @return {Point} 控件内的坐标。 
 *
 */

/**
 * @method getVisible
 * 控件是否可见。
 * @return {Boolean} 是否可见
 *
 */

/**
 * @method setVisible
 * 显示/隐藏控件。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method setAnchorX
 * 设置控件的横向锚点。
 * @param {Number} x （范围0-1）。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method setAnchorY
 * 设置控件的纵向锚点。
 * @param {Number} y （范围0-1）。
 * @return {UIElement} 返回控件本身
 *
 */

/**
 * @method relayout
 * 重新布局控件及子控件。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method relayoutChildren
 * 重新布局子控件。
 * @return {UIElement} 返回控件本身。
 *
 *     @example small frame
 *     this.relayoutChildren();
 */

/**
 * @method setDisableRelayout
 * @param {Boolean} value true禁止布局功能，false开启布局功能。
 * 禁止/开启布局功能。一般向布局控件中加入/删除子控件时会自动调用relayoutChildren，但是一下加入大量子控件时，每加一个就要调用一次relayoutChildren，这样可能有性能问题。此时可以先禁止布局功能，再添加控件，最后启用布局功能并调用relayoutChildren。
 * @return {UIElement} 返回控件本身。
 *
 *     @example small frame
 *     var n = 200;
 *     var gridView = this.win.find("grid-view-x");
 *     
 *     gridView.setDisableRelayout(true);
 *     for(var i = 0; i < n; i++) {
 *         gridView.dupChild("image");
 *     }
 *     gridView.setDisableRelayout(false).relayoutChildren();
 *     
 */


/**
 * @method removeChild
 * 删除指定的子控件，如果destroyIt为真，同时销毁它。
 * @param {UIElement} child 子控件对象。
 * @param {Boolean} destroyIt 是否同时销毁child对象。
 * @param {Boolean} sync 是否同步执行，缺省异步执行。
 * @return {UIElement} 返回控件本身。
 * 
 */

/**
 * @method removeChildren
 * 删除全部子控件。
 * @return {UIElement} 返回控件本身。
 * 
 */

/**
 * @method setEnable
 * 启用/禁用控件，不同的控件的表现有不同的意义，如UITimer被禁用时不触发onTimer事件，UIGSensor被禁用时不上报重力感应信息。
 * @param {Boolean} enable 是否启用控件。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method setZIndex
 * 设置控件在父控件中的位置序数。
 * @param {Number} z 位置序数。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method getZIndex
 * 获取控件在父控件中的位置序数。
 * @return {Number} 返回位置序数。
 *
 */

/**
 * @method pickImage 
 * 从当前系统中选择一张图片，返回file对象和DataURL。
 * @param {Function} onDone(file, dataURL) 选图成功后的回调函数。
 * @return {Boolean} 是否支持从本地读取图片。
 *
 * 选取图片:
 *
 *     @example small frame
 *     var image = this.getWindow().find("image");
 *     this.pickImage(function(name, url) {
 *         image.setValue(url);
 *         image.postRedraw();
 *     });
 *
 */

/**
 * @event onClick
 * 点击事件。事件处理函数返回true时事件终止传播(父控件不再处理)。
 * @param {Point} point 点击的位置。
 */

/**
 * @event onUpdateTransform
 * 绘制前事件。
 * @param {Object} canvas HTMLCanvasContext2d
 *
 * 实现按下时放大的效果：
 *
 *     @example small frame
 *     this.setScale(this.pointerDown ? 1.1 : 1);
 */

/**
 * @event onInit
 * 初始化事件。
 * 
 * 需要在自定义组件时添加，才会出现在IDE的事件列表中。
 *
 */

/**
 * @event onPointerDown
 * Pointer Down事件。在子控件处理前会触发一次，在子控件处理后会触发一次。
 * 
 * 需要在自定义组件时添加，才会出现在IDE的事件列表中。
 *
 * 事件处理函数返回true时本事件终止传播。
 *
 * @param {Point} point 位置。
 * @param {Boolean} beforeChild 为true表示本次触发是在子控件处理前，false表示本次触发是在子控件处理后。
 */

/**
 * @event onPointerMove
 * Pointer Move事件。在子控件处理前会触发一次，在子控件处理后会触发一次。
 * 
 * 需要在自定义组件时添加，才会出现在IDE的事件列表中。
 *
 * 事件处理函数返回true时本事件终止传播。
 *
 * @param {Point} point 位置。
 * @param {Boolean} beforeChild 为true表示本次触发是在子控件处理前，false表示本次触发是在子控件处理后。
 */

/**
 * @event onPointerUp
 * Pointer Up事件。在子控件处理前会触发一次，在子控件处理后会触发一次。
 * 
 * 需要在自定义组件时添加，才会出现在IDE的事件列表中。
 *
 * 事件处理函数返回true时本事件终止传播。
 *
 * @param {Point} point 位置。
 * @param {Boolean} beforeChild 为true表示本次触发是在子控件处理前，false表示本次触发是在子控件处理后。
 */


/**
 * @method beforePaint
 *
 * 本函数在控件绘制前执行(不能直接调用)，可以重载此函数实现一些特殊效果。
 * @param {Object} canvas2dCtx HTMLCanvasContext2D 
 *
 * 参考：[https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
 *
 *     @example small frame
 *     var ball = this.find("ball");
 *     
 *     ball.beforePaint = function(canvas2dCtx) {
 *         canvas2dCtx.beginPath();
 *         canvas2dCtx.moveTo(0, 0);
 *         canvas2dCtx.lineTo(this.w, this.h);
 *         canvas2dCtx.lineWidth = 2;
 *         canvas2dCtx.strokeStyle = "red";
 *         canvas2dCtx.stroke();
 *     }
 *     
 *
 */

/**
 * @method afterPaint
 *
 * 本函数在控件绘制后执行(不能直接调用)，可以重载此函数实现一些特殊效果。
 * @param {Object} canvas2dCtx HTMLCanvasContext2D 
 *
 * 参考：[https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
 *
 *     @example small frame
 *     var ball = this.find("ball");
 *     
 *     ball.afterPaint = function(canvas2dCtx) {
 *         canvas2dCtx.beginPath();
 *         canvas2dCtx.moveTo(0, this.h);
 *         canvas2dCtx.lineTo(this.w, 0);
 *         canvas2dCtx.lineWidth = 2;
 *         canvas2dCtx.strokeStyle = "red";
 *         canvas2dCtx.stroke();
 *     }
 *
 *
 */

/**
 * @method drawBgImage
 *
 * 本函数用于绘制控件的背景图片(不能直接调用)，可以重载此函数实现一些特殊效果。
 * @param {Object} canvas2dCtx HTMLCanvasContext2D 
 *
 * 参考：[https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
 * 如下面的代码放到onBeforeOpen中，实现动态背景效果。 
 *  
 *     @example small frame
 *      var win = this.win;
 *      win.bgOffsetX = 0;
 *      win.bgOffsetY = 0;
 *      win.bgInc = true;
 *      
 *      win.drawBgImage = function(canvas2dCtx) {
 *          var image = this.getBgImage();
 *          if(!image) return;
 *  
 *          var imageRect = image.getImageRect();
 *          var htmlImage = image.getImage();
 *  
 *          if (this.bgInc) {
 *              this.bgOffsetX++;
 *              if ((this.bgOffsetX + this.w) >= imageRect.w) {
 *                  this.bgInc = false;
 *              }
 *          } else {
 *              this.bgOffsetX--;
 *              if (this.bgOffsetX < 1) {
 *                  this.bgInc = true;
 *              }
 *          }
 *          this.bgOffsetY++;
 *          this.bgOffsetY = this.bgOffsetY % imageRect.h;
 *  
 *          var oy = imageRect.h - this.bgOffsetY;
 *          var rect = {
 *              x: this.bgOffsetX,
 *              y: this.bgOffsetY,
 *              w: this.w,
 *              h: this.h
 *          };
 *  
 *          rect.h = Math.min(this.h, oy);
 *          this.drawImageAt(canvas2dCtx, htmlImage, UIElement.IMAGE_DISPLAY_SCALE, 0, 0, this.w, rect.h, rect);
 *  
 *          if (oy < this.h) {
 *              rect.y = 0;
 *              rect.h = this.h - oy;
 *              this.drawImageAt(canvas2dCtx, htmlImage, UIElement.IMAGE_DISPLAY_SCALE, 0, oy, this.w, rect.h, rect);
 *          }
 *  
 *          return;
 *      }
 *
 *
 */

/**
 * @method createEvent
 * 
 * 创建事件。
 * @param {String} type 事件类型。
 * @return {Event} 返回事件对象。
 *      @example small frame
 *      //创建并分发一个自定义事件。
 *      var e = this.createEvent("customevent");
 *      e.num = Math.round(Math.random() * 1000);
 *      e.str = "abs";
 *      e.obj = {"key":"value"};
 *      this.dispatchEvent(e);
 */

/**
 * @method dispatchEvent
 *
 * 分发事件，如果你调用过这个对象的addEventListener方法监听了此事件类型，事件回调函数将会被调用。
 * @param {Event} event 事件对象。
 * @return {Boolean} 事件是否要继续分发。
 *
 *      @example small frame      
 *      //创建并分发一个自定义事件。
 *      var e = this.createEvent("customevent");
 *      e.num = Math.round(Math.random() * 1000);
 *      e.str = "abs";
 *      e.obj = {"key":"value"};
 *      this.dispatchEvent(e);
 *
 */

/**
 * @method hasEventListener
 *
 * 判断是否有对应事件的监听者。
 * @param {String} type 事件类型。
 * @return {Boolean} 是否有监听者。
 *
 */

/**
 * @method addEventListener
 *
 * 注册事件的回调函数。
 * @param {String} type 事件的类型。目前支持"animatedone","beforeopen","begincontact","postsolve","presolve","swipeleft","swiperight","swipeup","swipedown","changed","changing","becomezero","becomefull","click","doubleclick","close","timeout","dragend","dragging","dragstart","endcontact","focusin","focusout","init","keydown","keyup","load","moved","open","paint","pointerdown","pointermove","multitouch","pointerup","removed","scrolling","scrolldone","switchtoback","switchtofront","deviceorientation","updatetransform"，具体请查看控件支持的事件。
 * @param {Function} callback 回调函数。原型为callback(event)。callback中的this为对应的控件, event的成员变量与对应事件的参数一致。
 *
 *
 * 注意：回调函数返回true时终止后续回调函数的处理。
 *
 *     @example small frame
 *     function initDialog(win) {
 *         function onButtonClicked(event) {
 *             var button = event.target;
 *             this.closeWindow(1);
 *             console.log(button.name + " clicked at:" + JSON.stringify(event.point));
 *         }
 *         win.find("button").addEventListener("click", onButtonClicked);
 *         
 *         function onOpen(event) {
 *             console.log("dialog open:" + JSON.stringify(event.initData));
 *         }
 *         win.addEventListener("open", onOpen);
 *         
 *         function onClose(event) {
 *             console.log("dialog closed with:" + JSON.stringify(event.retInfo));
 *         }
 *         win.addEventListener("close", onClose);
 *     }
 *
 * addEventListener也可以用on代替，如：
 *
 *     @example small frame
 *         function onClose(event) {
 *             console.log("dialog closed with:" + JSON.stringify(event.retInfo));
 *         }
 *         win.on("close", onClose);
 *
 * 一个用户自定义事件的示例：
 *
 *      @example
 *      //在场景中有两个控件"label"、"button"。 "button"用于触发"customevent"事件，"label"监听"customevent"事件。
 *
 *      //1.在button的onClick事件中创建并分发事件。
 *      var e = this.createEvent("customevent");
 *      e.num = Math.round(Math.random() * 1000);
 *      e.str = "abs";
 *      e.obj = {"key":"value"};
 *      this.dispatchEvent(e);
 *
 *      //2.在场景的onOpen事件中为"label"注册监听"button"的"customevent"事件，提供事件回调函数。
 *      var me = this;
 *      var win = this.win;
 *      var label = win.find("label");
 *      var button = win.find("button");
 *      button.addEventListener("customevent", function(event) {
 *          var num = event.num;
 *          var str = event.str;
 *          var obj = event.obj;
 *          this.setText("Receive customevent\n" + "num:" + num + "\nstr:" + str + "\nobj:" + JSON.stringify(obj));
 *      }.bind(label));
 *
 */

/**
 * @method removeEventListener
 *
 * 注销事件的回调函数。
 * @param {String} type 事件的类型。参考addEventListener。
 * @param {Function} callback 回调函数。
 *
 *
 *     @example small frame
 *         button.addEventListener("click", onClick);
 *
 * removeEventListener也可以用off代替，如：
 *
 *     @example small frame
 *         button.off("click", onClick);
 */

/**
 * @method loadAssets
 * 加载指定场景的资源。在缺省资源加载窗口中，可以指定预先加载部分场景的资源，其它资源可以通过本函数在需要时加载。
 * @param {Array} scenesNameList 要加载资源的场景名称数组。
 * @param {Function} onProgress(percent, finished, total) 加载进度的回调函数。
 * @param {Function} onDownloadProgress(percent, finished, total) 下载进度的回调函数。
 * @return {UIElement} 返回控件本身。
 *
 *
 * 示例：
 *
 *     @example small frame
 *     var progressbar = this.win.findChildByType("ui-progressbar");
 *     function onProgress(percent, finished, total) {
 *         progressbar.setPercent(percent);
 *         console.log("finished=" + finished + " total=" + total);
 *     }
 *     this.loadAssets(["scene", "scene-1"], onProgress);
 *
 */

/**
 * @method clearAssetsCache
 *
 * @param {Function} check(url) (可选) 本函数对资源进行检查，返回false的资源的缓存将被清除。
 *
 *     @example small frame
 *     var progressbar = this.win.findChildByType("ui-progressbar");
 *     function onProgress(percent, finished, total) {
 *         progressbar.setPercent(percent);
 *         console.log("finished=" + finished + " total=" + total);
 *     }
 *     this.clearAssetsCache();
 *     this.loadAssets(["scene", "scene-1"], onProgress);
 */

/**
 * @method setImageDisplay
 *
 * 设置图片的显示方式。
 * @param {Number} display 显示方式:
 *
 * * UIElement.IMAGE_DISPLAY_DEFAULT 缺省显示
 * * UIElement.IMAGE_DISPLAY_CENTER 居中显示 
 * * UIElement.IMAGE_DISPLAY_TILE   平铺显示
 * * UIElement.IMAGE_DISPLAY_9PATCH 9宫格显示
 * * UIElement.IMAGE_DISPLAY_SCALE  缩放显示
 * * UIElement.IMAGE_DISPLAY_AUTO   自动缩放显示
 * * UIElement.IMAGE_DISPLAY_TILE_V 垂直平铺显示
 * * UIElement.IMAGE_DISPLAY_TILE_H 水平平铺显示
 * * UIElement.IMAGE_DISPLAY_AUTO_SIZE_DOWN 自动缩小显示
 * * UIElement.IMAGE_DISPLAY_FIT_WIDTH 适应宽度
 * * UIElement.IMAGE_DISPLAY_FIT_HEIGHT 适应高度
 *
 * @return {UIElement} 返回控件本身。
 *
 *     @example small frame
 *     this.setImageDisplay(UIElement.IMAGE_DISPLAY_9PATCH);
 */

/**
 * @method createElement
 *
 * 动态创建控件。这是最原始的创建控件的方法，你需要手工去设置控件的各种属性，推荐使用dupChild或clone+addChild来动态创建控件。
 *
 * 除非想运行时使用在线的资源，不要直接使用资源的URL，而是通过UIAssets加载资源，用assets.getAssetURL获取资源的URL，再设置到控件中，否者导出时无法导出相应的资源。
 *
 * @param {String} type 控件的类型。可以再Hola Studio中用右键生成组件，进入高级里查看控件的type。
 * @return {UIElement} 返回对应的控件。
 *
 *
 *     @example small frame
 *     var assets = this.find("assets");
 *     var image = this.createElement("ui-image").setValue(assets.getAssetURL("1.jpg")).setPosition(100, 200).setSize(200, 40);
 *     this.addChild(image);
 *
 *     var label = this.createElement("ui-label").setText("Hello").setPosition(100, 100).setSize(200, 40);
 *     label.style.setFontSize(16);
 *     label.style.setTextColor("Green");
 *     this.addChild(label);
 *
 */

/**
 * @method bindData
 *
 * 绑定数据。
 * @param {Object} data 数据。
 * @param {String} animHint 动画提示(仅适用于UIListView)。
 * @param {Boolean} clearOldData 是否清除老的数据(仅适用于UIListView)。
 *
 *
 * @return {UIElement} 返回控件本身。
 *
 * 按名称绑定
 *
 *     @example small frame
 *     var data = {"ui-name":"张三丰", "ui-gender":"男", "ui-age":"108"};
 *     this.getWindow().find("ui-list-view").bindData(data);
 *     
 * 按顺序绑定
 *
 *     @example small frame
 *     var data = {
 *         "children": [
 *     		{
 *     			"children": [
 *     				{"image": "/images/mimetypes/folder.png"},
 *     				{"text": "Folder"},
 *     				{}
 *     			]
 *     		},
 *     		{
 *     			"children": [
 *     				{"image": "/images/mimetypes/mimetype_img.png"},
 *     				{"text": "test.jpg"},
 *     				{}
 *     			]
 *     		},
 *     		{
 *     			"children": [
 *     				{"image": "/images/mimetypes/mimetype_sound.png"},
 *     				{"text": "music.mp3"},
 *     				{}
 *     			]
 *     		}
 *     	]
 *     }
 *     
 *     this.getWindow().find("ui-list-view").bindData(data, "default", true);
 */

/*
 * File:   ui-group.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Group
 * 
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIGroup
 * @extends UIElement
 * 分组控件。可以拖放分组控件来创建，也可以把几个控件组合起来。
 *
 * 可以在属性页中设置背景和边框的颜色，如果不需要背景和边框的颜色，把相应的颜色删除就行了。
 *
 */
function UIGroup() {
	return;
}

UIGroup.prototype = new UIElement();
UIGroup.prototype.isUIGroup = true;

UIGroup.prototype.initUIGroup = function(type, w, h, img) {
	this.initUIElement(type);	

	this.roundRadius = 5;
	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, img);
	this.setCanRectSelectable(false, false);
	this.addEventNames(["onInit"]);
	this.style.lineColor = "rgba(0,0,0,0)";
	this.style.fillColor = "rgba(0,0,0,0)";
	this.images.display = UIElement.IMAGE_DISPLAY_9PATCH;

	return this;
}

UIGroup.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUIDevice || shape.isUIScreen || shape.isUIStatusBar || shape.isUIWindow || shape.isUIListItem) {
		return false;
	}

	return true;
}

UIGroup.prototype.onPointerUpEditing = function(point, beforeChild) {

	return;
}

UIGroup.prototype.fixChildPosition = function(child) {
}

UIGroup.prototype.fixChildSize = function(child) {
}

UIGroup.prototype.paintSelfOnly =function(canvas) {
	var image = this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);

	if(!image) {
		canvas.beginPath();
		drawRoundRect(canvas, this.w, this.h, this.roundRadius);
		
		if(!this.isFillColorTransparent()) {
			canvas.fillStyle = this.style.fillColor;
			canvas.fill();
		}

		if(!this.isStrokeColorTransparent()) {
			canvas.lineWidth = this.style.lineWidth;
			canvas.strokeStyle = this.style.lineColor;
			canvas.stroke();	
		}
	}

	return;
}

UIGroup.prototype.onPositionChanged = function() {
	var children = this.children;
	var n = children.length;

	for(var i = 0; i < n; i++) {
		var iter = children[i];
		if(iter.isUIBody || iter.isUIGroup || iter.isUIEdge){
			iter.onPositionChanged();
		}
	}

	return;
}


function UIGroupCreator(w, h, img) {
	var args = ["ui-group", "ui-group", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIGroup();

		return g.initUIGroup(this.type, w, h, img);
	}
	
	return;
}

UIGroup.create = function() {
	var g = new UIGroup();
	
	g.initUIGroup("ui-group", 200, 200, null);
	g.state = Shape.STAT_NORMAL;

	return g;
}

/*
 * File:   ui-window.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Window
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIWindow
 * @extends UIElement
 * 窗口是普通窗口和对话框的基类。
 *
 */
function UIWindow() {
	return;
}

/**
 * @event onLoad 
 * 此事件在第一批资源加载完成时触发。发生在onSystemInit事件之后，onBeforeOpen事件之前。
 *
 * 注意：由于窗口并未打开，请不要使用界面上的控件。
 */

/**
 * @event onSystemInit
 * 系统初始化事件，UI数据加载完成，但其它资源尚未加载。
 *
 * 注意：由于窗口并未打开，请不要使用界面上的控件。
 */

/**
 * @event onBeforeOpen
 * 窗口已经创建，但是还没有显示出来。
 *
 * 注意：请不要在onBeforeOpen事件再打开另外一个窗口，否则可能出现不可预料的错误。
 *
 * @param {Object} initData 初始化参数，此参数是从openWindow方法传过来的。
 *
 */

/**
 * @event onOpen
 * 窗口打开事件。
 * @param {Object} initData 初始化参数，此参数是从openWindow方法传过来的。
 *
 * 打开窗口：
 *
 *     @example small frame
 *     var initData = "abcd";
 *     this.openWindow("win-test", function (retCode) {console.log("window closed.");}, false, initData);
 *
 * onOpen事件处理代码：
 *
 *     @example small frame
 *     console.log(initData);
 *
 */

/**
 * @event onClose
 * 窗口关闭。
 * @param {Object} retInfo 由closeWindow函数传递过来。
 *
 */

/**
 * @event onSwitchToBack
 * 打开新窗口，当前窗口切换到后台时，当前窗口触发本事件。
 *
 */

/**
 * @event onSwitchToFront
 * 关闭当前窗口，前一个窗口切换到前台时，前一个窗口触发本事件。
 */

/**
 * @event onSwipeLeft
 * 手势向左滑动事件。
 * @param {Point} start 起始点。
 * @param {Point} end 结束点。
 */

/**
 * @event onSwipeRight
 * 手势向右滑动事件。
 * @param {Point} start 起始点。
 * @param {Point} end 结束点。
 */

/**
 * @event onSwipeUp
 * 手势向上滑动事件。
 * @param {Point} start 起始点。
 * @param {Point} end 结束点。
 */

/**
 * @event onSwipeDown
 * 手势向下滑动事件。
 * @param {Point} start 起始点。
 * @param {Point} end 结束点。
 */


/**
 * @event onKeyDown
 * Key Down事件。
 * @param {Number} code 按键的代码。
 *
 * 代码影射表：
 *
 *     @example small frame
 *
 *     var KeyEvent = {
 *        DOM_VK_CANCEL: 3,
 *        DOM_VK_HELP: 6,
 *        DOM_VK_BACK_SPACE: 8,
 *        DOM_VK_TAB: 9,
 *        DOM_VK_CLEAR: 12,
 *        DOM_VK_RETURN: 13,
 *        DOM_VK_ENTER: 14,
 *        DOM_VK_SHIFT: 16,
 *        DOM_VK_CONTROL: 17,
 *        DOM_VK_ALT: 18,
 *        DOM_VK_PAUSE: 19,
 *        DOM_VK_CAPS_LOCK: 20,
 *        DOM_VK_ESCAPE: 27,
 *        DOM_VK_SPACE: 32,
 *        DOM_VK_PAGE_UP: 33,
 *        DOM_VK_PAGE_DOWN: 34,
 *        DOM_VK_END: 35,
 *        DOM_VK_HOME: 36,
 *        DOM_VK_LEFT: 37,
 *        DOM_VK_UP: 38,
 *        DOM_VK_RIGHT: 39,
 *        DOM_VK_DOWN: 40,
 *        DOM_VK_PRINTSCREEN: 44,
 *        DOM_VK_INSERT: 45,
 *        DOM_VK_DELETE: 46,
 *        DOM_VK_0: 48,
 *        DOM_VK_1: 49,
 *        DOM_VK_2: 50,
 *        DOM_VK_3: 51,
 *        DOM_VK_4: 52,
 *        DOM_VK_5: 53,
 *        DOM_VK_6: 54,
 *        DOM_VK_7: 55,
 *        DOM_VK_8: 56,
 *        DOM_VK_9: 57,
 *        DOM_VK_SEMICOLON: 59,
 *        DOM_VK_EQUALS: 61,
 *        DOM_VK_A: 65,
 *        DOM_VK_B: 66,
 *        DOM_VK_C: 67,
 *        DOM_VK_D: 68,
 *        DOM_VK_E: 69,
 *        DOM_VK_F: 70,
 *        DOM_VK_G: 71,
 *        DOM_VK_H: 72,
 *        DOM_VK_I: 73,
 *        DOM_VK_J: 74,
 *        DOM_VK_K: 75,
 *        DOM_VK_L: 76,
 *        DOM_VK_M: 77,
 *        DOM_VK_N: 78,
 *        DOM_VK_O: 79,
 *        DOM_VK_P: 80,
 *        DOM_VK_Q: 81,
 *        DOM_VK_R: 82,
 *        DOM_VK_S: 83,
 *        DOM_VK_T: 84,
 *        DOM_VK_U: 85,
 *        DOM_VK_V: 86,
 *        DOM_VK_W: 87,
 *        DOM_VK_X: 88,
 *        DOM_VK_Y: 89,
 *        DOM_VK_Z: 90,
 *        DOM_VK_CONTEXT_MENU: 93,
 *        DOM_VK_NUMPAD0: 96,
 *        DOM_VK_NUMPAD1: 97,
 *        DOM_VK_NUMPAD2: 98,
 *        DOM_VK_NUMPAD3: 99,
 *        DOM_VK_NUMPAD4: 100,
 *        DOM_VK_NUMPAD5: 101,
 *        DOM_VK_NUMPAD6: 102,
 *        DOM_VK_NUMPAD7: 103,
 *        DOM_VK_NUMPAD8: 104,
 *        DOM_VK_NUMPAD9: 105,
 *        DOM_VK_MULTIPLY: 106,
 *        DOM_VK_ADD: 107,
 *        DOM_VK_SEPARATOR: 108,
 *        DOM_VK_SUBTRACT: 109,
 *        DOM_VK_DECIMAL: 110,
 *        DOM_VK_DIVIDE: 111,
 *        DOM_VK_BACK_BUTTON: 115, 
 *        DOM_VK_MENU_BUTTON: 118, 
 *        DOM_VK_SEARCH_BUTTON: 120, 
 *        DOM_VK_F1: 112,
 *        DOM_VK_F2: 113,
 *        DOM_VK_F3: 114,
 *        DOM_VK_F4: 115,
 *        DOM_VK_F5: 116,
 *        DOM_VK_F6: 117,
 *        DOM_VK_F7: 118,
 *        DOM_VK_F8: 119,
 *        DOM_VK_F9: 120,
 *        DOM_VK_F10: 121,
 *        DOM_VK_F11: 122,
 *        DOM_VK_F12: 123,
 *        DOM_VK_F13: 124,
 *        DOM_VK_F14: 125,
 *        DOM_VK_F15: 126,
 *        DOM_VK_F16: 127,
 *        DOM_VK_F17: 128,
 *        DOM_VK_F18: 129,
 *        DOM_VK_F19: 130,
 *        DOM_VK_F20: 131,
 *        DOM_VK_F21: 132,
 *        DOM_VK_F22: 133,
 *        DOM_VK_F23: 134,
 *        DOM_VK_F24: 135,
 *        DOM_VK_NUM_LOCK: 144,
 *        DOM_VK_SCROLL_LOCK: 145,
 *        DOM_VK_COMMA: 188,
 *        DOM_VK_PERIOD: 190,
 *        DOM_VK_SLASH: 191,
 *        DOM_VK_BACK_QUOTE: 192,
 *        DOM_VK_OPEN_BRACKET: 219,
 *        DOM_VK_BACK_SLASH: 220,
 *        DOM_VK_CLOSE_BRACKET: 221,
 *        DOM_VK_QUOTE: 222,
 *        DOM_VK_META: 224,
 *        DOM_VK_BACK: 225
 *      }
 *
 * 用法示例：
 *
 *     @example small frame
 *     var win = this.getWindow();
 *     var image = win.find("image");
 *     switch (code) {
 *         case KeyEvent.DOM_VK_UP:
 *             image.y -= 5;
 *             break;
 *         case KeyEvent.DOM_VK_DOWN:
 *             image.y += 5;
 *             break;
 *         case KeyEvent.DOM_VK_LEFT:
 *             image.x -= 5;
 *             break;
 *         case KeyEvent.DOM_VK_RIGHT:
 *             image.x += 5;
 *             break;
 *         default:
 *             break;
 *     }
 */

/**
 * @event onKeyUp
 * Key Up事件。
 * @param {Number} code 按键的代码。
 */

/**
 * @event onMultiTouch
 * 多点触摸事件。
 * @param {String} action "touchstart", "touchmove", "touchend"
 * @param {Array} points 点的数组。坐标是根据Canvas的缩放比例转换过的，相对当前窗口的坐标。
 * @param {Object} event 原始Touch事件。
 */

UIWindow.serialNo = 0;
UIWindow.prototype = new UIElement();
UIWindow.prototype.isUIWindow = true;
UIWindow.prototype.saveProps = ["openAnimationDuration", "closeAnimationDuration", "animHint", "windowType",
"closeWhenPointerUpOutside", "refLinesV", "refLinesH", "windowNameToBeOpen", "preloadWindows", "isUILoadingWindowV2", "isUILoadingWindow", "sceneId"];

UIWindow.prototype.fromJson = function(json) {
	this.jsonData = json;
	this.name = json.name;

	if(json.isUILoadingWindow) {
		RShape.prototype.fromJson.call(this, json);
	}
	else {
        Object.keys(json.events).forEach(function(ev) {
            this.events[ev] = json.events[ev];
        }, this);
	}

	return this;
}

UIWindow.prototype.fromJsonNow = function(json) {
	RShape.prototype.fromJson.call(this, json);
	this.relayout();

	return this;
}

UIWindow.prototype.onGesture = function(gesture) {
	if(!this.isInDesignMode()) {
		this.callOnGestureHandler(gesture);
	}

	return;
}

UIWindow.prototype.onMultiTouch = function(action, points, event) {
	this.callOnMultiTouchHandler(action, points, event);
}

UIWindow.prototype.isMainWindow = function() {
	var wm = this.getWindowManager();
	var index = wm.history[0];
	var firstWin = wm.children[index];

	return firstWin === this;
}

UIWindow.prototype.getTimeScale = function() {
	return this.timeScale;
}

UIWindow.prototype.setTimeScale = function(timeScale) {
	this.timeScale = timeScale;

	return this;
}

UIWindow.prototype.initUIWindow = function(type, x, y, w, h, bg) {
	this.initUIElement(type);	

	this.timeScale = 1;
	this.setLeftTop(x, y);
	this.settings = {};
	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, bg);
	this.setName("window-" + UIWindow.serialNo++);

	if(!bg) {
		this.style.setFillColor("White");
	}

	this.addEventNames(["onSystemInit", "onLoad", "onOpen", "onBeforeOpen",
			"onClose", "onSwitchToBack", "onSwitchToFront", "onGesture", "onKeyDown", "onKeyUp"]);

	this.setAnimHint("htranslate");
	this.oldHitTest = this.hitTest;

	this.setImage("option_image_0", null);
	this.setImage("option_image_1", null);
	this.setImage("option_image_2", null);
	this.setImage("option_image_3", null);
	this.setImage("option_image_4", null);
	this.setImage("option_image_5", null);
	this.setImage("option_image_6", null);
	this.setImage("option_image_7", null);
	this.setImage("option_image_8", null);
	this.setImage("option_image_9", null);
	this.setImage("option_image_10", null);
	this.setImage("option_image_11", null);
	this.setImage("option_image_12", null);
	this.setImage("option_image_13", null);
	this.setImage("option_image_14", null);
	this.intervals = [];
	this.timeouts = [];

	return this;
}

UIWindow.prototype.setAnimHint = function(animHint) {
	this.animHint = animHint;

	return true;
}

UIWindow.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUIDevice || shape.isUIScreen || shape.isUIStatusBar || shape.isUIWindow) {
		return false;
	}

	return true;
}

UIWindow.prototype.onModeChanged = function() {
	if(this.isInDesignMode()) {
		this.popupWindow = null;
	}

	return;
}

UIWindow.prototype.removePopupWindow = function(popup) {
	if(this.popupWindow) {
		if(this.popupWindow === popup) {
			this.popupWindow = popup.popupWindow;
			if(this.popupWindow) {
				this.popupWindow.parentWindow = this;
			}

			popup.parentWindow = null;
			popup.popupWindow = null;

			return true;
		}

		return this.popupWindow.removePopupWindow(popup);
	}

	return false;
}

UIWindow.prototype.setPopupWindow = function(popup) {
	if(this === popup) {
		return false;
	}

	if(this.popupWindow) {
		return this.popupWindow.setPopupWindow(popup);
	}
	else {
		this.popupWindow = popup;
		if(popup) {
			popup.parentWindow = this;
		}
	}

	return true;
}

UIWindow.prototype.getPopupWindow =function() {
	if(this.popupWindow) {
		return this.popupWindow.getPopupWindow();
	}

	return this.isUIPopupWindow ? this : null;
}

UIWindow.prototype.isGrabElement = function(el) {
	return this.grabElement === el;
}

UIWindow.prototype.grab = function(el) {
	this.grabElement = el;

	return;
}

UIWindow.prototype.ungrab = function(el) {
	this.grabElement = null;

	return;
}

UIWindow.prototype.dispatchPointerDownToChildren = function(p) {
	if(this.grabElement) {
		this.grabElement.onPointerDown(p)
		this.setTarget(this.grabElement);
		return true;
	}
	
	return this.defaultDispatchPointerDownToChildren(p);
}

UIWindow.prototype.onPointerDownNormal = function(point) {
	this.pointerDownPosition.x = point.x;
	this.pointerDownPosition.y = point.y;

	if(this.popupWindow) {
		this.popupWindow.onPointerDownNormal(point)
		this.setTarget(this.popupWindow);
		this.pointerDown = false;

		if(!this.popupWindow || !this.popupWindow.shouldPropagatePointerEvent()) {
			return true;
		}
	}

	return UIElement.prototype.onPointerDownNormal.call(this, point);
}

UIWindow.prototype.onDoubleClick = function(point) {
	if(this.popupWindow) {
		this.popupWindow.onDoubleClick(point)
		if(!this.popupWindow || !this.popupWindow.shouldPropagatePointerEvent()) {
			return true;
		}
	}

	return UIElement.prototype.onDoubleClick.call(this, point);
}

UIWindow.prototype.onPointerMoveNormal = function(point) {
	if(this.popupWindow) {
		this.popupWindow.onPointerMoveNormal(point)
		if(!this.popupWindow || !this.popupWindow.shouldPropagatePointerEvent()) {
			return true;
		}
	}

	return UIElement.prototype.onPointerMoveNormal.call(this, point);
}

UIWindow.prototype.onPointerUpNormal = function(point) {
	if(this.popupWindow) {
		this.popupWindow.onPointerUpNormal(point)
		if(!this.popupWindow || !this.popupWindow.shouldPropagatePointerEvent()) {
			return true;
		}
	}

	if(!this.pointerDown) {
		return true;
	}

	if(!this.isInDesignMode() && this.enable) {
		var dx = this.lastPosition.x - this.pointerDownPosition.x;
		var dy = this.lastPosition.y - this.pointerDownPosition.y;
		var adx = Math.abs(dx);
		var ady = Math.abs(dy);
		var end = this.lastPosition;
		var start = this.pointerDownPosition;

		if(adx > 20 || ady > 20) {
			if((adx >> 1) > ady) {
				if(dx < 0) {
					this.callOnSwipeLeftHandler(start, end);
				}
				else {
					this.callOnSwipeRightHandler(start, end);
				}
			}
			if((ady >> 1) > adx) {
				if(dy < 0) {
					this.callOnSwipeUpHandler(start, end);
				}
				else {
					this.callOnSwipeDownHandler(start, end);
				}
			}
		}
	}

	return UIElement.prototype.onPointerUpNormal.call(this, point);
}

UIWindow.prototype.paintSelfOnly =function(canvas) {
	var opacity = this.opacity;
	if(opacity !== 1) {
		canvas.globalAlpha *= opacity;
	}

	this.clearBackground(canvas);
	this.drawBgImage(canvas);

	return;
}

UIWindow.prototype.beforePaintChildren = function(canvas) {
	canvas.globalAlpha = 1;
}

UIWindow.prototype.paintSelf = function(canvas) {
	var timeStep = canvas.timeStep;

	canvas.timeStep = this.scaleTime(timeStep);
	if(this.isInDesignMode()) {
		UIElement.prototype.paintSelf.call(this, canvas);
	}
	else {
		canvas.save();
		this.translate(canvas);
        this.updateTransform(canvas);
		this.paintSelfOnly(canvas);
		
		this.beforePaintChildren(canvas);
		this.paintChildren(canvas);
		this.afterPaintChildren(canvas);
		canvas.restore();
	}

	if(this.popupWindow && !this.popupWindow.closePending) {
		canvas.timeStep = this.popupWindow.scaleTime(timeStep);
		this.popupWindow.paintSelf(canvas);
	}
	canvas.timeStep = timeStep;

	return;
}

UIWindow.prototype.show = function() {
	this.setVisible(true);
	this.showHTML();

	return;
}

UIWindow.prototype.hide = function() {
	this.setVisible(false);
	this.hideHTML();
	cantkHideAllInput();

	return;
}

UIWindow.prototype.setCloseWhenPointerUpOutside = function(closeWhenPointerUpOutside) {
	if(closeWhenPointerUpOutside) {
		this.hitTest = function(point) {
			var ret = this.oldHitTest(point);
			if(!ret) {
				if(!this.isInDesignMode()) {
					ret = Shape.HIT_TEST_MM;
				}
			}

			return ret;
		}
	}
	else {
		this.hitTest = this.oldHitTest;
	}
	this.closeWhenPointerUpOutside = closeWhenPointerUpOutside;

	return;
}

UIWindow.prototype.isAnimationEnabled = function() {
	//if(CantkRT.isNative()) return false;

	return this.animHint && this.animHint !== "none";
}

UIWindow.prototype.getAnimationDuration = function(toShow) {
	return toShow ? this.openAnimationDuration : this.closeAnimationDuration;
}

UIWindow.prototype.getAnimationName = function(toShow) {
	var anim = "";
	switch(this.animHint) {
		case "fade": {
			anim = toShow ? "anim-fade-in" : "anim-fade-out";
			break;
		}
		case "scale": {
			if(this.isUIDialog) {
				anim = toShow ? "anim-scale-show-dialog" : "anim-scale-hide-dialog";
			}
			else {
				anim = toShow ? "anim-scale-show-win" : "anim-scale-hide-win";
			}
			break;
		}
		case "popup": {
			anim = toShow ? "anim-move-up" : "anim-move-down";
			break;
		}
		case "htranslate": {
			anim = toShow ? "anim-forward" : "anim-backward";
			break;
		}
		case "vtranslate": {
			anim = toShow ? "anim-upward" : "anim-downward";
			break;
		}
		default: {
			if(this.isUIDialog) {
				anim = toShow ? "anim-scale-show-dialog" : "anim-scale-hide-dialog";
			}
			else {
				if(isAndroid() || isFirefoxMobile()) {
					anim = toShow ? "anim-scale-show-win" : "anim-scale-hide-win";
				}
				else {
					anim = toShow ? "anim-forward" : "anim-backward";
				}
			}
			break;
		}
	}

	return anim;
}

UIWindow.prototype.isSplashWindow = function() {
	return this.isUINormalWindow && this.windowType === "splash";
}

UIWindow.prototype.getSupportedAnimations = function() {
	var animations = ["none", "default", "scale", "fade", "popup"];
	if(!this.isUIDialog) {
        animations = animations.concat(["htranslate", "vtranslate"]);
    }

	return animations;
}

UIWindow.prototype.clearBackground =function(canvas) {
	var display = this.images.display;
	var image = this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);

	if(image) {
		switch(display) {
			case UIElement.IMAGE_DISPLAY_TILE:
			case UIElement.IMAGE_DISPLAY_TILE_V:
			case UIElement.IMAGE_DISPLAY_TILE_H:
			case UIElement.IMAGE_DISPLAY_SCALE:
			case UIElement.IMAGE_DISPLAY_9PATCH:
			case UIElement.IMAGE_DISPLAY_SCALE_KEEP_RATIO: return;
			default:break;
		}

		if(image.width >= this.w && image.height >= this.h) {
			return;
		}
	}

	if(!this.isFillColorTransparent()) {
		canvas.beginPath();
        canvas.fillStyle = this.style.fillColor;
		canvas.fillRect(0, 0, this.w, this.h);
	}

	return;
}

UIWindow.prototype.defaultChildrenFromJson = UIElement.prototype.childrenFromJson;

UIWindow.prototype.loadChildren = function() {
	if(this.childrenJson) {
		this.defaultChildrenFromJson(this.childrenJson);
		delete this.childrenJson;
		delete this.pendingLoadChildren;
		console.log("Now To Load Children Of " + this.name);

		if(this.scaleInfo) {
			this.scaleForDensity(this.scaleInfo.sizeScale, this.scaleInfo.lcdDensity, true);
		}

		var wm = this.getWindowManager();
		var oldConfig = wm.oldConfig;
		var deviceConfig = wm.deviceConfig;

		if(oldConfig && deviceConfig) {
			this.notifyDeviceConfigChanged(oldConfig, deviceConfig);
		}

	}

	return;
}

UIWindow.prototype.childrenFromJson = function(js) {
	if(js.lazyLoad && !dappIsEditorApp()) {
		this.childrenJson = js;
		this.pendingLoadChildren = true;
		console.log("Delay To Load Children Of " + this.name);
	}
	else {
		delete this.pendingLoadChildren;
		this.defaultChildrenFromJson(js);	
	}

	return;
}

UIWindow.prototype.initStageOne = function() {
	this.callOnInitHandler();
	this.clearAllTimeouts();
	this.clearAllIntervals();
	this.enablePhysics = false;

	var win = this;
	this.forEach(function(iter) {
		if(iter.offset) {
			iter.offset = 0;
		}
		iter.visible = iter.runtimeVisible;

		if(iter.animatingInfo) {
			iter.animatingInfo = null;
			iter.animating = false;
		}

		if(iter.animations && iter.animations[iter.defaultAnimationName]) {
			console.log(iter.name + " has default animation, set it invisible initially.");
			iter.visible = false;
		}

		if(iter.isUIBody || iter.isUIEdge) {
			win.enablePhysics = true;
		}
	});

	return;
}

UIWindow.prototype.onInit = function() {
	this.initStageOne();

	return;
}

UIWindow.prototype.prepareForOpen = function() {
	if((!this.isUILoadingWindow || this.children.length < 1) && this.jsonData) {
		this.fromJsonNow(this.jsonData);
	}

	this.setMode(Shape.MODE_RUNNING, true);
	this.relayout();

	return this;
}

UIWindow.prototype.callOnBeforeOpen = function(initData) {
	this._open = true;
	var wm = this.getParent();
	if(wm && wm.hasEventListener("windowopen")) {
		var event = wm.createEvent("windowopen");
		event.win = this;
		wm.dispatchEvent(event);
	}

	this.show();
	this.init();
	return this.callOnBeforeOpenHandler(initData);
}

UIWindow.prototype.callOnOpen = function(initData) {
	delete this.openPending;
	this.getParent().pointerEventTarget = this;

	if(this.onOpen) {
		try {
			this.onOpen(initData);
		}catch(e) {
			console.log("onOpen" + e.message);
		}
	}

	this.callOnOpenHandler(initData);

	if(this.isSplashWindow()) {
		var win = this;
		var duration = win.duration ? win.duration : 3000;

		if(window.splashWinTimeID) {
			clearTimeout(window.splashWinTimeID);
			delete window.splashWinTimeID;
		}

		window.splashWinTimeID = setTimeout(function() {
			if(win.visible) {
				win.openWindow(null, null, true);
			}
		}, duration);
	}

	this.forEach(function(el) {
		el.onWindowOpen();
	});

	return true;
}

UIWindow.prototype.callOnClose = function(retInfo) {
	this._open = false;
    delete this.closePending;

	var wm = this.getParent();
	if(wm && wm.hasEventListener("windowclose")) {
		var event = wm.createEvent("windowclose");
		event.win = this;
		wm.dispatchEvent(event);
	}

	if(this.onClose) {
		try {
			this.onClose(retInfo);
		}
		catch(e) {
			console.log("onClose: " + e.message);
		}
	}
			
	this.callOnCloseHandler(retInfo);

	this.deinit();
	this.hide();

	if(this.destroyWhenClose) {
		this.getWindowManager().removeChild(this, true);
	}
	
	this.resetEvents();
	this.clearAllTimeouts();
	this.clearAllIntervals();

	var arr = this.children;
	for(var i = 0; i < arr.length; i++) {
		var iter = arr[i];
		iter.detachNameFromParent();
	}

	this.children = [];

	if(this.parentWindow) {
		this.parentWindow.popupWindow = this.popupWindow;
	}
	if(this.popupWindow) {
		this.popupWindow.parentWindow = this.parentWindow;
	}

	this.popupWindow = null;
	this.parentWindow = null;

	setTimeout(function() {
		arr.clear(true);
	}, 100);

	return true;
}

UIWindow.prototype.callOnSwitchToBack = function(topIsPopup) {
	this.callOnSwitchToBackHandler();
	if(!topIsPopup) {
		this.hide();
	}

	return true;
}

UIWindow.prototype.callOnSwitchToFront = function(topIsPopup) {
	if(this.isUINormalWindow && (this.w != this.parentShape.w || this.h != this.parentShape.h)) {
		this.relayout();
		console.log("WindowManager Size Changed, Relayout Current Window.");
	}

	this.show();
	this.callOnSwitchToFrontHandler();

	return true;
}

UIWindow.prototype.isOpen = function() {
	return !!this._open;
}

/**
 * @method setTimeout
 * 是对系统setTimeout的包装，保证窗口关闭时，定时器被销毁。
 * @param {Function} func 定时器回调函数。 
 * @param {Number} dt 时长(毫秒) 
 * @return {Number} 返回timerID
 *
 */
UIWindow.prototype.setTimeout = function(func, dt) {
	if(this.isInDesignMode()) {
		console.log("Can not UIWindow.prototype.setTimeout in edit mode.");
		return;
	}

	if(typeof(func) !== "function") {
		console.log("invalid func for UIWindow.prototype.setTimeout");
		return;
	}

	function callback() {
		this.timeouts.remove(id);
		func();
	}

	var id = window.setTimeout(callback.bind(this), dt);
	this.timeouts.push(id);

	return id;
}

/**
 * @method clearTimeout
 * 清除定时器。
 * @param {Number} id timerID
 *
 */
UIWindow.prototype.clearTimeout = function(id) {
	window.clearTimeout(id);
	this.timeouts.remove(id);
}

/**
 * @method setInterval
 * 是对系统setInterval的包装，保证窗口关闭时，定时器被销毁。
 * @param {Function} func 定时器回调函数。 
 * @param {Number} dt 时长(毫秒) 
 * @return {Number} 返回timerID
 *
 */
UIWindow.prototype.setInterval = function(func, dt) {
	if(this.isInDesignMode()) {
		console.log("Can not UIWindow.prototype.setInterval in edit mode.");
		return;
	}
	
	if(typeof(func) !== "function") {
		console.log("invalid func for UIWindow.prototype.setInterval");
		return;
	}

	function callback() {
		func();
	}

	var id = window.setInterval(callback.bind(this), dt);
	this.intervals.push(id);

	return id;
}

/**
 * @method clearInterval
 * 清除定时器。
 * @param {Number} id timerID
 *
 */
UIWindow.prototype.clearInterval = function(id) {
	window.clearInterval(id);
	this.intervals.remove(id);
}

UIWindow.prototype.clearAllIntervals = function() {
	var arr = this.intervals;
	for(var i = 0; i < arr.length; i++) {
		var id = arr[i];
		window.clearInterval(id);
	}
	this.intervals.length = 0;
}

UIWindow.prototype.clearAllTimeouts = function() {
	var arr = this.timeouts;
	for(var i = 0; i < arr.length; i++) {
		var id = arr[i];
		window.clearTimeout(id);
	}
	this.timeouts.length = 0;
}

UIWindow.prototype.loadInitAssets = function(bar, preloadWindows, label) {
	var win = this;

	function doLoadInitAssets(evt) {
		if(evt.percent > 99.9) {
			win.doLoadInitAssets(bar, preloadWindows, label);
			ResLoader.off(ResLoader.EVENT_ASSETS_LOAD_PROGRESS, doLoadInitAssets);
		}
	}

	if(ResLoader.isLoadCompleted()) {
		win.doLoadInitAssets(bar, preloadWindows, label);
	}else{
		ResLoader.on(ResLoader.EVENT_ASSETS_LOAD_PROGRESS, doLoadInitAssets);
	}
}

UIWindow.prototype.doLoadInitAssets = function(bar, preloadWindows, label) {
	var win = this;
	var wm = win.getParent();
	
	if(!bar) {
		bar = win.findChildByType("ui-progressbar");
	}
	
	if(!label) {
		label = win.findChildByType("ui-label");
	}
	
	if(!preloadWindows) {
		preloadWindows = win.preloadWindows;
	}
	
	function onLoadProgress(percent, loadedNr, totalNr) {
		if(label) {
			label.setText("Loading...");
		}

		if(bar) {
			bar.setPercent(percent, true);
		}
		
        var initWin = wm.getInitWindow();
		if(loadedNr >= totalNr && initWin != win) {
			wm.showInitWindow(win.windowNameToBeOpen);	
		}
		
		win.postRedraw();
	}

	function onDownloadProgress(percent, loadedNr, totalNr) {
		if(label) {
			if(percent >= 100) {
				label.setText("Loading...");
			}else{
				label.setText("Downloading...");
			}
		}

		if(bar) {
			if(percent >= 100) {
				if(AssetsDownloader.isAvailable()) {
					wm.loadAudios();
					wm.loadFonts();
				}

				bar.setPercent(0, true);
			}else {
				bar.setPercent(percent, true);
			}
		}
	}

	var winNamesArr = preloadWindows ? preloadWindows.split(",") : wm.getWindowNames(this);
	if(AssetsDownloader.isAvailable()) {
		winNamesArr.push("__audios__");
		winNamesArr.push("__fonts__");
	}else{
		wm.loadAudios();
		wm.loadFonts();
	}

	wm.loadAssets(winNamesArr, onLoadProgress, onDownloadProgress);

	this.loadInitAssets = function() {}

	return this;
}

UIWindow.prototype.relayout = function() {
	if(!this.getWindowManager().isDeviceDirectionOK()) {
		console.log("UIWindow.prototype.relayout Reject Relayout");
		return;
	}

	UIElement.prototype.relayout.call(this);

	return this;
}

ShapeFactoryGet().addShapeCreator(new UINormalWindowCreator(null));

//////////////////////////////////////////////////////////////////////}-{

/**
 * @class UINormalWindow
 * @extends UIWindow
 * 普通窗口是全屏的窗口。
 *
 */
function UINormalWindow() {
	return;
}

UINormalWindow.prototype = new UIWindow();
UINormalWindow.prototype.isUINormalWindow = true;

function UINormalWindowCreator(bg) {
	var args = ["ui-window", "ui-window", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UINormalWindow();
		
		g.initUIWindow(this.type, 0, 0, 100, 100, bg);
		g.widthAttr = UIElement.WIDTH_FILL_PARENT;
		g.heightAttr = UIElement.HEIGHT_FILL_PARENT;
		g.addEventNames(["onSwipeLeft", "onSwipeRight", "onSwipeUp", "onSwipeDown"]);

		return g;
	}
	
	return;
}

/*
 * File:   ui-dialog.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Dialog
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIDialog
 * @extends UIWindow
 * 通常用对话框提示信息和确认问题等。
 *
 */
function UIDialog() {
	return;
}

UIDialog.prototype = new UIWindow();
UIDialog.prototype.isUIDialog = true;
UIDialog.prototype.isUIPopupWindow = true;

UIDialog.prototype.fixChildSize = function(shape) {
	return;
}

UIDialog.prototype.fixChildPosition = function(shape) {
	return;
}

function UIDialogCreator(w, h, bg) {
	var args = ["ui-dialog", "ui-dialog", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIDialog();
		g.initUIWindow(this.type, 0, 0, w, h, bg);
		
		g.setMargin(8, 8);
		g.xAttr = UIElement.X_CENTER_IN_PARENT;
		g.yAttr = UIElement.Y_MIDDLE_IN_PARENT;
		g.images.display = UIElement.IMAGE_DISPLAY_SCALE;
		g.setAnimHint("scale");

		return g;
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIDialogCreator(600, 400, null));

/*
 * File:   ui-edit.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Single Line Editor
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIEdit
 * @extends UIElement
 * 单行编辑器。
 */

/**
 * @event onChanged
 * 文本变化时触发本事件。
 * @param {String} value 当前的文本。
 */

/**
 * @event onChanging
 * 文本正在变化时触发本事件。
 * @param {String} value 当前的文本。
 */

/**
 * @event onFocusIn
 * 得到输入焦点事件。
 */

/**
 * @event onFocusOut
 * 失去输入焦点事件。
 */
function UIEdit() {
	return;
}

UIEdit.prototype = new UIElement();
UIEdit.prototype.isUIEdit = true;

UIEdit.prototype.saveProps = ["leftMargin", "rightMargin", "inputType", "inputTips", "maxLength"];
UIEdit.prototype.initUIEdit = function(type, w, h, leftMargin, rightMargin, initText, bg, focusedBg) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setText(initText);
	this.leftMargin = leftMargin;
	this.rightMargin = rightMargin;
	this.setSizeLimit(60, 30, 1000, 80);
	this.setTextType(Shape.TEXT_INPUT);
	this.setImage(UIElement.IMAGE_DEFAULT, bg);
	this.setImage(UIElement.IMAGE_FOCUSED, focusedBg);
	this.setMargin(5, 5);
	this.setInputType("text");
	this.addEventNames(["onChanged", "onChanging", "onFocusIn", "onFocusOut"]);
	this.setTextAlignV("middle");
	this.setTextAlignH("left");
	this.maxLength = 1024;

	return this;
}

UIEdit.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUIButton) {
		return true;
	}

	return false;
}

UIEdit.prototype.textEditable = function(point) {
	return true;
}

UIEdit.prototype.getLocaleText = function(text) {
	if(text === " ") {
		return text;
	}

	if(this.inputType === "password" && text && text === this.text) {
		var str = "";
		var n = text.length;
		for(var i = 0; i < n; i++) {
			str = str + "*";
		}

		return str;
	}
	else {
		return text;
	}
}

UIEdit.prototype.drawText = function(canvas) {
	var y = this.h >> 1;
	var x = this.leftMargin;
	var text = this.getLocaleText(this.text);
	var width = this.w - x - this.rightMargin;
	var inputTips = this.inputTips;

	if((!text && !inputTips) || this.editing) {
		return;
	}
	
	canvas.save();
	canvas.font = this.style.getFont();
	if(text) {
		canvas.fillStyle = this.style.textColor;	
	}
	else {
		text = inputTips;
		canvas.fillStyle = "#E0E0E0";
	}

	canvas.beginPath();
	canvas.rect(0, 0, this.w - this.rightMargin, this.h);
	canvas.clip();

	canvas.textAlign = "left";
	canvas.textBaseline = "middle";
	canvas.fillText(text, x, y);

	canvas.restore();

	return;
}

UIEdit.prototype.isFocused = function() {
	return this.editing;
}

UIEdit.prototype.paintSelfOnly = function(canvas) {
	var image = this.getBgImage();

	if(image) {
		return;
	}

	canvas.beginPath();
	drawRoundRect(canvas, this.w, this.h, 8);
	canvas.fillStyle = this.style.fillColor;
	canvas.fill();
	canvas.strokeStyle = this.style.lineColor;
	canvas.lineWidth = this.isFocused() ? 4 : 2;
	canvas.stroke();

	return;
}

UIEdit.prototype.onClick = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}
	if(!this.isInDesignMode()) {
		this.editText();
	}

    return this.callOnClickHandler(point);
}

UIEdit.prototype.getWidth = function(withoutBorder) {
	var w = this.w;
	if(withoutBorder) {
		w = w - this.leftMargin - this.rightMargin;
	}

	return w;
}

UIEdit.prototype.getEditorRect = function() {
	var leftMargin = this.leftMargin || 0;
	var p = this.getPositionInView();
	var cp = CantkRT.getMainCanvasPosition();
	var vp = this.view.getAbsPosition();
	var scale = this.view.getViewScale();

	var canvasScale = UIElement.getMainCanvasScale();
	var x = (vp.x + (p.x + leftMargin) * scale)/canvasScale.x + cp.x;
	var y = (vp.y + p.y * scale)/canvasScale.y + cp.y;
	var w = (this.getWidth(true) * scale)/canvasScale.x;
	var h = (this.getHeight() * scale)/canvasScale.y;
	
	var rect = {x:x, y:y, w:w, h:h};
	if(this.isInDesignMode()) {
		var radtio = window.devicePixelRatio || 1;
		rect.x *= radtio;
		rect.y *= radtio;
		rect.w *= radtio;
		rect.h *= radtio;
	}

	return rect;
}

UIEdit.prototype.editText = function(point) {
	var me = this;
	if(this.textEditable(point)) {
		var shape = this;
		var text = this.getText();
		var rect = this.getEditorRect();
		var scale = this.getRealScale() / UIElement.getMainCanvasScale().y;
		var inputType = this.inputType ? this.inputType : "text";
		var fontSize = this.style.fontSize * scale;
		var editor = cantkShowInput(inputType, fontSize, text, rect.x, rect.y, rect.w, rect.h);

		shape.editing = true;
		editor.setTextColor(this.style.textColor);
		editor.showBorder(this.isInDesignMode());
        editor.show();

		function onChanged(text) {
			if(text !== shape.text) {
				shape.setText(text, true);
				shape.postRedraw();
			}
			else {
				shape.text = text;
			}
			
			editor.setOnChangedHandler(null);
	        editor.setOnChangeHandler(null);
			editor.hide();
			delete shape.editing;
			shape.callOnFocusOutHandler();

			return;
		}

		function onChange(text) {
			shape.callOnChangingHandler(text);
		}

		editor.setMaxLength(me.maxLength || 1024);
		editor.setOnChangedHandler(onChanged);
		editor.setOnChangeHandler(onChange);

		this.callOnFocusInHandler();
	}

	return;
}

UIEdit.prototype.drawTextTips = function(canvas) {
}

function UIEditCreator(w, h, leftMargin, rightMargin, bg, focusedBg) {
	var args = ["ui-edit", "ui-edit", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIEdit();
		return g.initUIEdit(this.type, w, h, leftMargin, rightMargin, dappGetText("Edit"), bg, focusedBg);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIEditCreator(120, 50, 12, 12, null, null));

/*
 * File:   ui-gauge.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Gauge
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */
function UIGauge() {
	return;
}

UIGauge.prototype = new UIElement();
UIGauge.prototype.isUIGauge = true;
UIGauge.IMAGE_POINTER = "pointer-image";

UIGauge.prototype.initUIGauge = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.addEventNames(["onInit"]);

	return this;
}

UIGauge.prototype.shapeCanBeChild = function(shape) {
	return shape.isUILedDigits || shape.isUILabel || shape.isUIGaugePointer;
}

UIGauge.prototype.afterChildAppended = function(shape) {
	var size = 20;
	var pointerNr = 0;

	if(shape.isUIGaugePointer) {
		shape.xAttr = UIElement.X_CENTER_IN_PARENT;
		shape.yAttr = UIElement.Y_MIDDLE_IN_PARENT;
	}

	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		if(!iter.isUIGaugePointer) {
			continue;
		}

		switch(pointerNr) {
			case 0: {
				size = 100;
				break;
			}
			case 1: {
				size = 70;
				break;
			}
			case 2: {
				size = 40;
				break;
			}
		}
		pointerNr = pointerNr + 1;

		iter.setSizeLimit(size, size, size, size, 1);
		iter.setSize(size, size);
	}

	this.setSizeLimit(100, 100, 1000, 1000, 1);

	return;
}

UIGauge.prototype.paintSelfOnly = function(canvas) {

	return;
}

function UIGaugeCreator() {
	var args = ["ui-gauge", "ui-gauge", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIGauge();
		return g.initUIGauge(this.type, 200, 200);
	}
	
	return;
}

///////////////////////////////////////////////////////////////////}-{

function UIGaugePointer() {
	return;
}

UIGaugePointer.prototype = new UIElement();
UIGaugePointer.prototype.isUIGaugePointer = true;

UIGaugePointer.prototype.saveProps = ["minAngle", "maxAngle", "minValue", "maxValue"];
UIGaugePointer.prototype.initUIGaugePointer = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIGauge.IMAGE_POINTER, null);
	
	this.value = 0;
	this.minAngle = 0;
	this.maxAngle = 360;
	this.minValue = 0;
	this.maxValue = 60;

	return this;
}

UIGaugePointer.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIGaugePointer.prototype.setText = function(text) {
	text = this.toText(text ? text : 0);
	try {
		this.setValue(parseInt(text));
	}catch(e) {
		console.log("UIGaugePointer.prototype.setText:" + e.message);
	}

	return this;
}

UIGaugePointer.prototype.getText = function() {
	return this.getValue() + "";
}

UIGaugePointer.prototype.setValue = function(value) {
	if(value >= this.minValue && value <= this.maxValue) {
		this.value = value;
	}
	else {
		console.log("UIGaugePointer.prototype.setValue: Out Of Range.");
	}

	return this;
}

UIGaugePointer.prototype.getValue = function() {
	return this.value;
}

UIGaugePointer.prototype.animSetValue = function(value, animHint) {
	return this.animSetValue(value, animHint);
}

UIGaugePointer.prototype.animateSetValue = function(value, animHint) {
	if(value < this.minValue) {
		value = this.minValue;
	}

	if(value > this.maxValue) {
		value = this.maxValue;
	}
	
	var pointer = this;
	var endValue = value;
	var startValue = this.getValue();
	var changeDelta = value - startValue;
	var changeAngle = Math.abs(changeDelta * (this.maxAngle - this.minAngle)/(this.maxValue - this.minValue));
	
	if(changeAngle < 5) {
		this.setValue(value);

		return;
	}

	var startTime = (new Date()).getTime();
	var duration = (animHint && animHint == "slow") ? 1000 : 500;

	function animStep() {
		var now = new Date();
		var percent = (now.getTime() - startTime)/duration;

		if(percent < 1) {
			var newValue = startValue + changeDelta * percent;	
			pointer.setValue(newValue);

			setTimeout(animStep, 10);
		}
		else {
			delete startTime;
			pointer.setValue(endValue);
		}

		delete now;
		pointer.postRedraw();
	}

	animStep();

	return;
}

UIGaugePointer.prototype.getAngle = function(canvas) {
	var rangeAngle = this.maxAngle - this.minAngle;
	var rangeValue = this.maxValue - this.minValue;
	var angle = (this.value/rangeValue) * rangeAngle + this.minAngle;

	angle = Math.PI * (angle / 180);

	return angle;
}

UIGaugePointer.prototype.paintSelfOnly = function(canvas) {
	var x = 0;
	var y = 0;
	var w = this.w;
	var h = this.h;
	var angle = this.getAngle();

	var image = this.getHtmlImageByType(UIGauge.IMAGE_POINTER);
	if(image && image.width) {
		var imageW = image.width;
		var imageH = image.height;

		canvas.translate(w/2, h/2);
		canvas.rotate(angle);
		canvas.translate(-w/2, -h/2);
		x = (w - imageW)/2;
		y = (h - imageH)/2;

		canvas.drawImage(image, x, y);
	}
	else {
		canvas.fillRect(0, 0, this.w, this.h);
	}

	return;
}

function UIGaugePointerCreator() {
	var args = ["ui-gauge-pointer", "ui-gauge-pointer", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIGaugePointer();
		return g.initUIGaugePointer(this.type, 20, 200);
	}
	
	return;
}
	
ShapeFactoryGet().addShapeCreator(new UIGaugePointerCreator());
ShapeFactoryGet().addShapeCreator(new UIGaugeCreator());

/*
 * File:   ui-html.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  HTML 
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIHtml
 * @extends UIElement
 * 主要用于在特殊情况下嵌入HTML代码。比如长按识别二维码，给HTML内容指定一张图片, 如：
 *
 *     @example small frame
 *
 *     <img src="http://studio.holaverse.cn/assets/controls/studio_qrcode.png" width="100%" height="100%" />
 *
 * 注意：CanTK Runtime不支持HTML，如果开发在runtime上运行的游戏，请不要使用本控件。
 *
 */
function UIHtml() {
	return;
}

UIHtml.prototype = new UIElement();
UIHtml.prototype.isUIHtml = true;

UIHtml.prototype.saveProps = ["htmlContent"];
UIHtml.prototype.initUIHtml = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);

	return this;
}

UIHtml.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIHtml.prototype.drawBgImage =function(canvas) {
	if(this.isInDesignMode() || this.isIcon) {
		var image = this.getBgImage();

		if(image) {
			var htmlImage = image.getImage();
			var srcRect = image.getImageRect();
			this.drawImageAt(canvas, htmlImage, this.images.display, 0, 0, this.w, this.h, srcRect);
		}
		else {
			canvas.beginPath();
			canvas.fillStyle = this.style.fillColor;
			canvas.fillRect(0, 0, this.w, this.h);
		}
	}

	return;
}

UIHtml.prototype.scaleElement = function(element, scaleX, scaleY, xOrigin, yOrigin) {
    var origin = (xOrigin && yOrigin) ? xOrigin + " " + yOrigin : "50% 50%";
    var transforms = ["transform", "-ms-transform", "-webkit-transform", "-o-transform", "-moz-transform"];

    element.style['transform-style'] = "preserve-3d";
    for(var i = 0; i < transforms.length; i++) {
        var trans = transforms[i];
        element.style[trans + "-origin"] = origin;
        element.style[trans] = "scale("+scaleX+","+scaleY+")";
    }

    return;
}

UIHtml.prototype.rotateElement = function(element, deg) {
    var origin = "50% 50%";
    var transforms = ["transform", "-ms-transform", "-webkit-transform", "-o-transform", "-moz-transform"];

    element.style['transform-style'] = "preserve-3d";
    for(var i = 0; i < transforms.length; i++) {
        var trans = transforms[i];
        element.style[trans + "-origin"] = origin;
        element.style[trans] = "rotate("+deg+"deg)";
    }

    return;
}

UIHtml.prototype.setRotation = function(rotation) {
	this.rotation = rotation;
	if(this.element) {
		this.rotateElement(this.element, (rotation * 180/Math.PI));
	}

	return this;
}

UIHtml.prototype.setOpacity = function(opacity) {
	this.opacity = opacity;
	if(this.element) {
 	   this.element.style["opacity"] = opacity;
	}

	return this;
}

UIHtml.prototype.setScale = function(scaleX, scaleY) {
	this.scaleX = scaleX;
	this.scaleY = scaleY;

	if(this.element) {
		this.scaleElement(this.element, scaleX, scaleY);
	}

	return this;
}

UIHtml.prototype.setScaleX = function(scaleX) {
	this.setScale(scaleX, this.scaleY);

	return this;
}

UIHtml.prototype.setScaleY = function(scaleY) {
	this.setScale(this.scaleX, scaleY);

	return this;
}

UIHtml.prototype.setVisible = function(value) {
	if(this.element) {
		this.element.style.display = value ? "block" : "none";
	}

	return this;
}

UIHtml.prototype.setPosition = function(x, y) {
	if(this.element) {
		this.element.style.left = x + "px";
		this.element.style.top = y + "px";
    }

	return this;
}

UIHtml.prototype.showHTMLElement = function() {
	var el = this.element;
	if(el) {
		var p = this.getPositionInView();
		var cp = CantkRT.getMainCanvasPosition();
		var vp = this.view.getAbsPosition();
		var scale = this.view.getViewScale();

		var canvasScale = UIElement.getMainCanvasScale();
		var x = (vp.x + p.x * scale)/canvasScale.x + cp.x;
		var y = (vp.y + p.y * scale)/canvasScale.y + cp.y;
		var w = (this.getWidth() * scale)/canvasScale.x;
		var h = (this.getHeight() * scale)/canvasScale.y;
		
		el.style.position = "absolute";
		el.style.left = x + "px";
		el.style.top = y + "px";
		el.style.width = w + "px";
		el.style.height = h + "px";
		el.style.visibility = 'visible';
		
		this.htmlVisible = true;
	}

	return;
}

UIHtml.prototype.createHTMLElement = function(name) {
	var element = null;
	if(!this.element) {
		element = document.createElement(name);
		element.id = this.type + this.name;
		document.body.appendChild(element);
		this.element = element;
	}

	return this.element;
}

UIHtml.prototype.beforeShowHTML = function() {
}

UIHtml.prototype.setScrollable = function(scrollable) {
	this.scrollable = scrollable;

	return;
}

UIHtml.prototype.onSetElementStyle = function() {
	var fontSize = Math.floor(this.scaleForCurrentDensity(14));

	this.element.style.fontSize = fontSize + "px";
	this.element.style.marginLeft = "0px";
	this.element.style.marginTop = "0px";
	this.element.style.marginBottom = "0px";
	this.element.style.marginRight = "0px";

	return;
}

UIHtml.prototype.onShowHTML = function() {
	this.reload();
}

UIHtml.prototype.reload = function() {
	if(!this.isInDesignMode()) {
		this.createHTMLElement("div");
		this.element.innerHTML = this.getHtmlContent();
		this.element.style.overflow = this.scrollable ? "scroll" : "hidden";
		this.element.style.zIndex = 5;
		this.element.style["-ms-touch-action"] = "auto";

		this.onSetElementStyle();

		this.beforeShowHTML();
		this.showHTMLElement();
	}

	return;
}

UIHtml.prototype.beforeHideHTML = function() {
}

UIHtml.prototype.onHideHTML = function() {
	this.htmlVisible = false;
	if(this.element) {
		this.beforeHideHTML();
		this.element.style.visibility = 'hidden';
	}

	return;
}

UIHtml.prototype.getValue = function() {
	return this.value;
}

UIHtml.prototype.setValue = function(value) {
	this.value = value;

	return this;
}

UIHtml.prototype.setHtmlContent = function(htmlContent) {
	this.htmlContent = htmlContent;

	if(this.element) {
		this.element.innerHTML = htmlContent;
	}

	return this;
}

UIHtml.prototype.getHtmlContent = function() {
	return this.htmlContent;
}

/**
 * @property {String} innerHTML
 * html content。
 *
 *     @example small frame
 *     this.win.find("html").innerHTML = "hello";
 */
Object.defineProperty(UIElement.prototype, "innerHTML", {
	get: function () {
		return this.getHtmlContent();
	},
	set: function (value) {
		this.setHtmlContent(value);
		this.reload();
	},
	enumerable: false,
	configurable: true
});

function UIHtmlCreator(w, h) {
	var args = ["ui-html", "ui-html", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIHtml();
		return g.initUIHtml(this.type, w, h);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIHtmlCreator());
/*
 * File:   ui-vedio.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Vedio 
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIVideo
 * @extends UIElement
 * 主要用于嵌入视频。运行时可以通过setValue设置视频的URL。
 *
 * 注意：CanTK Runtime不支持视频，如果开发在runtime上运行的游戏，请不要使用本控件。
 *
 *     @example small frame
 *     var video = win.find("ui-video-general")
 *     video.setValue("http://www.w3school.com.cn/i/movie.ogg");
 *     video.reload();
 */
function UIVideo() {
	return;
}

UIVideo.prototype = new UIHtml();
UIVideo.prototype.isUIVideo = true;

UIVideo.prototype.getHtmlContent = function() {
	var w = this.getWidth(true);
	var h = this.getHeight(true);
	var src = this.value ? this.value : "";
	var loop = this.loop ? 'loop="loop" ' : "";
	var autoPlay = this.autoPlay ? 'autoplay="true" ' : "";
	var showControls = this.showControls ? 'controls="controls" ' :"";

	var html = '<video width="'+w+'" height="'+h+'" preload="true" '+ showControls + loop + autoPlay + 'src="'+src+'"></video>';

	return html;
}

UIVideo.prototype.beforeHideHTML = function() {
	video = this.getVideoElement();
	if(video.src && !video.puased) {
		video.pause();
	}

	return;
}

UIVideo.prototype.getVideoElement = function() {
	if(this.element) {
		var video = this.element.getElementsByTagName("video");
		return video.length ? video[0] : null;
	}

	return null;
}

UIVideo.prototype.setShowControls = function(value) {
	this.showControls = value;

	return;
}

UIVideo.prototype.isShowControls = function() {
	return this.showControls;
}

UIVideo.prototype.setLoop = function(value) {
	this.loop = value;

	return;
}

UIVideo.prototype.isLoop = function() {
	return this.loop;
}

UIVideo.prototype.setAutoPlay = function(value) {
	this.autoPlay = value;

	return;
}

UIVideo.prototype.isAutoPlay = function() {
	return this.autoPlay;
}

UIVideo.prototype.initUIVideo = function(type) {
	this.initUIHtml(type, 400, 300);
	this.setValue("http://www.w3school.com.cn/i/movie.ogg");
	this.setImage(UIElement.IMAGE_DEFAULT, null);

	return this;
}

function UIVideoCreator() {
	var args = ["ui-video", "ui-video", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIVideo();
		return g.initUIVideo(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIVideoCreator());

/*
 * File:   ui-flash.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Flash 
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIFlash
 * @extends UIElement
 * 主要用于嵌入Flash。运行时可以通过setValue设置Flash的URL。
 *
 * 注意：CanTK Runtime不支持Flash，如果开发在runtime上运行的游戏，请不要使用本控件。
 *
 */
function UIFlash() {
	return;
}

UIFlash.prototype = new UIHtml();
UIFlash.prototype.isUIFlash = true;

UIFlash.prototype.getHtmlContent = function() {
	var w = this.getWidth(true);
	var h = this.getHeight(true);
	var src = this.value ? this.value : "";

	var html = '<object type="application/x-shockwave-flash" width="'+w+'" height="'+h+'"> <param name="movie" value="'+src+'" /> <param name="quality" value="high" /></object>';

	return html;
}

UIFlash.prototype.initUIFlash = function(type) {
	this.initUIHtml(type, 400, 300);
	this.setValue("test/5.swf");
	this.setImage(UIElement.IMAGE_DEFAULT, null);

	return this;
}

function UIFlashCreator() {
	var args = ["ui-flash", "ui-flash", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIFlash();
		return g.initUIFlash(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIFlashCreator());

/*
 * File:   ui-html-image.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Html Image
 * 
 * Copyright (c) 2015 Tangram HD Inc.
 * 
 */

function UIHtmlImage() {
	return;
}

UIHtmlImage.prototype = new UIHtml();
UIHtmlImage.prototype.isUIHtmlImage = true;

UIHtmlImage.prototype.getHtmlContent = function() {
	var scale = this.getRealScale();
	var w = Math.round(scale * this.w);
	var h = Math.round(scale * this.h);
	var src = this.getImageSrcByType(UIElement.IMAGE_DEFAULT); 
	var str = '<img src="' + src + '" width=' + w + ' height=' + h + '>';

	return str;
}

UIHtmlImage.prototype.initUIHtmlImage = function(type) {
	this.initUIHtml(type, 400, 300);
	this.setImage(UIElement.IMAGE_DEFAULT, null);

	return this;
}

function UIHtmlImageCreator() {
	var args = ["ui-html-image", "ui-html-image", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIHtmlImage();
		return g.initUIHtmlImage(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIHtmlImageCreator());

/*
 * File:   ui-image-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief: Image View 
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIImageView() {
	return;
}

UIImageView.prototype = new UIElement();
UIImageView.prototype.isUIImageView = true;

UIImageView.cachedImages = {};
UIImageView.IMAGE_STATE_PENDING = 0;
UIImageView.IMAGE_STATE_ERROR   = 1;
UIImageView.IMAGE_STATE_DONE    = 2;

imageViewInitCustomProp = function(me) {
}

imageThumbViewInitCustomProp = function(me) {
}

imageAnimationInitCustomProp = function(me) {
}

imageSlideViewInitCustomProp = function(me) {
}


UIImageView.prototype.doToJson = function(o) {
	UIElement.prototype.doToJson.call(this, o);
	o.userImages = this.getImages();

	return o;
}

UIImageView.prototype.doFromJson = function(js) {
	UIElement.prototype.doFromJson.call(this, js);

	this.cacheInvalid = true;

	if(js.userImages) {
		this.userImages = [];
		var arr = js.userImages.split("\n");

		var n = arr.length;
		for(var i = 0; i < n; i++) {
			var type = "image_" + (i+1);	
			var src = this.getImageSrcByType(type);
			if(src && src.length > 4) {
				this.userImages.push(src);
			}
		}
	}

	return;
}

UIImageView.prototype.initUIImageView = function(w, h) {
	this.setDefSize(w, h);
	this.userImages = [];
	
	this.onSized               = UIImageView.prototype.onSized;
	this.afterRelayout         = UIImageView.prototype.afterRelayout;
	this.setImages             = UIImageView.prototype.setImages;
	this.getImages             = UIImageView.prototype.getImages;
	this.setValue              = UIImageView.prototype.setValue;
	this.getValue              = UIImageView.prototype.getValue;
	this.ensureImages          = UIImageView.prototype.ensureImages;
	this.addUserImage          = UIImageView.prototype.addUserImage;
	this.doToJson              = UIImageView.prototype.doToJson;
	this.doFromJson            = UIImageView.prototype.doFromJson;
	this.onScaleForDensityDone = UIImageView.prototype.onScaleForDensityDone;

	imageViewInitCustomProp(this);

	return this;
}

UIImageView.createImage = function(src, onLoadDone) {
	var image = UIImageView.cachedImages[src];
	
	if(!image) {
		image = new Image();

		image.src = src;
		image.onLoadDoneListeners = [];

		function notifyImageLoadDone(image, result) {
			if(!image || !image.onLoadDoneListeners) {
				return;
			}

			for(var i = 0; i < image.onLoadDoneListeners.length; i++) {
				var onLoad = image.onLoadDoneListeners[i];
			
				onLoad(image, result);
			}

			image.onLoadDoneListeners.clear();

			return;
		}

		image.onload = function(e) {
			notifyImageLoadDone(this, true);
			this.loaded = true;
		}
		
		image.onabort = function(e) {
			notifyImageLoadDone(this, false);	
			this.failed = true;
			console.log("load " + this.src + " failed.");
		}
		
		image.onerror = function(e) {
			notifyImageLoadDone(this, false);	
			this.failed = true;
			console.log("load " + this.src + " failed.");
		}
	}
	else {
		console.log("Create Image From Cache: " + src);
	}

	if(onLoadDone) {
		if(image.loaded) {
			onLoadDone(image, true);
		}
		else if(image.failed) {
			onLoadDone(image, false);
		}
		else {
			image.onLoadDoneListeners.push(onLoadDone);
		}
	}

	return image;
}

UIImageView.drawImageAtCenter = function(ctx, image, x, y, w, h, keepRatio, clearColor) {
	if(clearColor) {
		ctx.fillStyle = clearColor;
		ctx.fillRect(x, y, w, h);
	}
	else {
		ctx.clearRect(x, y, w, h);
	}

	if(image && image.width > 0) {
		var dw = w;
		var dh = h;
		var sw = image.width;
		var sh = image.height;
		var imageW = image.width;
		var imageH = image.height;

		if(keepRatio) {
			var scaleX = dw/imageW;
			var scaleY = dh/imageH;
		
			if(scaleX < scaleY) {
				sw = Math.min(imageW, dw/scaleY);
			}
			else {
				sh = Math.min(imageH, dh/scaleX);
			}
		}

		ctx.drawImage(image, 0, 0, sw, sh, x, y, dw, dh);
	}

	return;
}

UIImageView.prototype.ensureImages = function() {
	if(!this.cacheInvalid) {
		return;
	}

	var imageview = this;
	function onLoadDone(image, result) {
		imageview.postRedraw();

		return;
	}

	this.cachedImages = [];
	for(var i = 0; i < this.userImages.length; i++) {
		var src = this.userImages[i];
		var image = UIImageView.createImage(src, onLoadDone);

		this.cachedImages.push(image);
	}

	delete this.cacheInvalid;

	return;
}

UIImageView.prototype.afterRelayout = function() {
	this.cacheInvalid = true;

	return;
}

UIImageView.prototype.onSized = function() {
	this.cacheInvalid = true;

	return;
}

UIImageView.prototype.onScaleForDensityDone = function() {
	this.cacheInvalid = true;

	return;
}

UIImageView.prototype.addUserImage = function(src) {
	this.cacheInvalid = true;
	this.userImages.push(src);

	var key = "image_" + this.userImages.length;

	this.setImage(key, src);

	return;
}

UIImageView.prototype.getCurrentImage = function() {
	return this.curentImage;
}

UIImageView.prototype.getValue = function() {
	var image = this.getCurrentImage();

	return image ? image.src : null;
}

UIImageView.prototype.setValue = function(value) {
	//TODO
	return this;
}

UIImageView.prototype.setImages = function(srcs) {
	var display = this.images.display;
	var arr = srcs.split("\n");

	this.userImages = [];
	this.images = {};
	this.images.display = display;

	for(var i = 0; i < arr.length; i++) {
		var iter = arr[i];
		if(iter) {
			this.addUserImage(iter);
		}
	}

	return;
}

UIImageView.prototype.getImages = function() {
	var srcs = "";
	var hostname = location.protocol + "//" + location.host + "/";

	for(var i = 0; i < this.userImages.length; i++) {
		var src = this.userImages[i];
		src = src.replace(hostname, "");
		srcs = srcs + src + "\n";	
	}

	return srcs;
}
/*
 * File:   ui-scrollview.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  ScrollView
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

function UIScrollView() {
	return this;
}

UIScrollView.prototype = new UIElement();
UIScrollView.prototype.isUIScrollView = true;

UIScrollView.prototype.afterChildAppended = function(shape) {
	shape.setCanRectSelectable(false, true);

	return true;
}

UIScrollView.prototype.initUIScrollView = function(type, border, bg) {
	this.initUIElement(type);	

	this.offset = 0;
	this.scrollBarOpacity = 0;
	this.setMargin(border, border);
	this.setSizeLimit(100, 100, 2000, 2000);
	this.setDefSize(300 + 2 * border, 300 + 2 * border);

	this.velocityTracker = new VelocityTracker();
	this.interpolator =  new DecelerateInterpolator(2);

	this.widthAttr = UIElement.WIDTH_FILL_PARENT; 
	this.heightAttr = UIElement.HEIGHT_FILL_PARENT;
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, bg);
	this.setScrollable("always");

	if(!bg) {
		this.style.setFillColor("#f0f0f0");
	}
	this.setCanRectSelectable(false, true);

	return this;
}

UIScrollView.prototype.setScrollable = function(scrollable) {
	this.scrollable = scrollable;

	return;
}

UIScrollView.prototype.fixChildSize = function(child) {
	if(child.widthAttr === UIElement.WIDTH_FILL_PARENT) {
		child.w = this.getWidth(true);
	}

	if(child.heightAttr === UIElement.HEIGHT_FILL_PARENT) {
		child.h = this.getHeight(true);
	}

	if(child.widthAttr === UIElement.WIDTH_FILL_PARENT && child.heightAttr === UIElement.HEIGHT_FILL_PARENT) {
		child.setUserMovable(false);
		child.setUserResizable(false);
	}

	return;
}

UIScrollView.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUIButton || shape.isUIGroup || shape.isUILabel || shape.isUIImage 
		|| shape.isUIList || shape.isUIGrid || shape.isUIProgressBar 
		|| shape.isUICheckBox || shape.isUIRadioBox || shape.isUIWaitBar 
		|| shape.isUIButtonGroup || shape.isUITips || shape.isUIGroup) {

		return true;
	}

	return false;
}

UIScrollView.prototype.onModeChanged = function() {
	this.offset = 0;

	return;
}

UIScrollView.prototype.scrollToEnd = function() {
	var range = this.getScrollRange();

	this.offset = range - this.h;

	return this;
}

UIScrollView.prototype.scrollTo = function(offset) {
	this.offset = Math.round(offset);
	
	return;
}

UIScrollView.prototype.scrollDelta = function(delta) {
	var offset = this.offset + delta;
	
	this.scrollTo(offset);

	return;
}

UIScrollView.prototype.scrollToPageDelta = function(pageOffset) {
	var pageIndex = Math.floor(this.offset/this.w) + pageOffset;
	
	this.scrollToPage(pageIndex);

	return;
}

UIScrollView.prototype.scrollToPage = function(pageIndex) {
	if(pageIndex < 0) {
		pageIndex = 0;
	}

	var offset = this.w * pageIndex;
	var distance = this.offset - offset;
	
	this.animScrollTo(distance, 300);

	return;
}

UIScrollView.prototype.onPointerDownRunning = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}
	this.velocityTracker.clear();

	return;
}

UIScrollView.prototype.onDrag = function(offset) {
	return;
}

UIScrollView.prototype.isScrollable = function() {
	if(this.scrollable === "always") {
		return true;
	}
	else if(this.scrollable === "never") {
		return false;
	}
	else {
		var range = this.getScrollRange();
		var pageSize = this.getPageSize();

		return range > pageSize;
	}
}

UIScrollView.prototype.onPointerMoveRunning = function(point, beforeChild) {
	if(beforeChild || !this.isScrollable()) {
		return;
	}

	this.scrollBarOpacity = 0;
	var delta = this.getScrollDelta(point);
	if(this.pointerDown && this.needScroll(point)) {
		this.scrollBarOpacity = 1.0;
		this.scrollDelta(-delta);
	}

	this.addMovementForVelocityTracker();
	this.onDrag(this.offset);

	return ;
}

UIScrollView.prototype.animScrollTo = function(distance, duration) {
	var scrollview = this;
	var date  = new Date();
	var startTime = date.getTime();
	var startOffset = this.offset;
	var endOffset = startOffset - distance;
	var range = this.getScrollRange();
	var pageSize = this.getPageSize();

	duration = duration < 400 ? 400 : duration;

	if(endOffset < 0) {
		duration = 600;
		distance = startOffset;
	}

	if(!this.isInDesignMode()) {
		if(endOffset > (range - pageSize)) {
			distance = startOffset - (range - pageSize);
		}
	}
	
	if(range <= pageSize) {
		endOffset = 0;
		distance = startOffset;
	}
	
	function scrollIt() {
		var now = new Date();
		var nowTime = now.getTime();
		var timePercent = (nowTime - startTime)/duration;
		var percent = scrollview.interpolator.get(timePercent);
		var offset = startOffset - distance * Math.min(percent, 1.0);

		if(timePercent < 1 && !scrollview.pointerDown) {
			setTimeout(scrollIt, 5);
			scrollview.scrollTo(offset);
			scrollview.scrollBarOpacity = 1 - percent;
		
		}
		else {
			var offset = startOffset - distance;
			scrollview.scrollBarOpacity = 0;
			scrollview.scrollTo(offset);
		}
		scrollview.postRedraw();

		return;
	}

	setTimeout(scrollIt, 5);

	return;
}

UIScrollView.prototype.whenScrollOutOfRange = function(offset) {
	return;
}

UIScrollView.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(beforeChild || !this.isScrollable()) {
		return;
	}

	var delta = this.getScrolledSize();

	if(!this.needScroll(point)) {
		this.scrollBarOpacity = 0;

		return;
	}

	var duration = 0;
	var distance = 0;
	var velocity = this.getVelocity();

	var a = this.getPageSize();
	var t = velocity/a;
	var d = 0.5 * a * t * t;

	distance = Math.abs(d);
	duration = 2*distance/velocity;

	distance = delta < 0 ? -distance : distance;
	duration = Math.abs(duration);

	if(duration > 3) {
		duration = 3;
	}

	var startOffset = this.offset;
	var endOffset = startOffset - distance;
	
	var offset = this.offset;
	var bottom = offset + this.h;
	var range = this.getScrollRange();
	if(offset < 0) {
		this.whenScrollOutOfRange(offset);
	}
	else if(bottom > range) {
		this.whenScrollOutOfRange(bottom-range);
	}

	this.animScrollTo(distance, duration * 1000);

	return true;
}

UIScrollView.prototype.paintSelfOnly =function(canvas) {

	return;
}

/*
 * File:   ui-h-scroll-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Horizonal ScrollView
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIHScrollView() {
	return;
}

UIHScrollView.prototype = new UIScrollView();
UIHScrollView.prototype.isUIHScrollView = true;

UIHScrollView.prototype.initUIHScrollView = function(type, border, bg) {
	this.initUIScrollView(type, border, bg);	
	this.setSizeLimit(100, 40, 2000, 2000);

	return this;
}

UIHScrollView.prototype.needScroll = function(point) {
	var dx = Math.abs(this.getMoveAbsDeltaX());
	var dy = Math.abs(this.getMoveAbsDeltaY());
	
	return (dx > 20 && dx > dy)  || (dx > 20 && !this.isInDesignMode());
}

UIHScrollView.prototype.getScrolledSize = function() {
	return Math.floor(this.getMoveAbsDeltaX()); 
}

UIHScrollView.prototype.getScrollDelta = function(point) {
	return Math.floor(this.getMoveDeltaX()); 
}

UIHScrollView.prototype.getVelocity = function() {
	return this.velocityTracker.getVelocity().x;
}

UIHScrollView.prototype.getPageSize = function() {
	return this.w;
}

UIHScrollView.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}
	
	if(this.isEventHandledByChild()) {
		return;
	}
	this.setEventHandled();

	var pageOffset = 0;
	var velocity = this.getVelocity();
	var delta = this.getScrolledSize();
	var absDelta = Math.abs(delta);

	if(absDelta > this.w/4 || velocity > this.w) {
		if(delta < 0) {
			pageOffset = 1;
		}
		else {
			pageOffset = -1;
		}
	}
	
	this.scrollToPageDelta(pageOffset);

	return true;
}

UIHScrollView.prototype.translatePoint = function(point) {
	var p = {x : (point.x - this.left + this.offset), y : (point.y - this.top)};

	return p;
}

UIHScrollView.prototype.getScrollRange = function() {
	var range = 0;
	var r = this.calcChildrenRange();

	range = r.r - r.l;
	if(range < this.w) {
		 range = this.w;
	}
	range = Math.ceil(range/this.w) * this.w;

	return range;
}

UIHScrollView.prototype.fixChildPosition = function(child) {
	if(child.widthAttr === UIElement.WIDTH_FILL_PARENT) {
		child.left = this.offset + this.hMargin;	
		child.widthAttr = UIElement.WIDTH_SCALE;
	}

	if(child.heightAttr === UIElement.HEIGHT_FILL_PARENT) {
		child.top = this.vMargin;
	}

	if(child.widthAttr === UIElement.WIDTH_FILL_PARENT && child.heightAttr === UIElement.HEIGHT_FILL_PARENT) {
		child.setUserMovable(false);
	}

	return;
}

UIHScrollView.prototype.paintChildren = function(canvas) {
	var shape = null;
	var leftClip = this.offset;
	var rightClip = this.offset + this.w;

	canvas.save();
	canvas.beginPath();
	canvas.rect(0, 0, this.w, this.h);
	canvas.closePath();
	canvas.clip();

	canvas.beginPath();
	canvas.translate(-this.offset, 0);

	for(var i = 0; i < this.children.length; i++) {
		shape = this.children[i];
		if(!shape.visible) {
			continue;
		}
		if((shape.left + shape.w) < leftClip || shape.left > rightClip) {
			continue;
		}
		
		this.beforePaintChild(shape, canvas);
		shape.paintSelf(canvas);
		this.afterPaintChild(shape, canvas);
	}
	
	this.paintTargetShape(canvas);
	
	canvas.restore();
	
	return;
}

function UIHScrollViewCreator(border, bg) {
	var args = ["ui-h-scroll-view", "ui-h-scroll-view", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIHScrollView();
		return g.initUIHScrollView(this.type, border, bg);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIHScrollViewCreator(0, null));

/*
 * File:   ui-v-scroll-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Vertical ScrollView
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIVScrollView() {
	return;
}

UIVScrollView.prototype = new UIScrollView();
UIVScrollView.prototype.isUIVScrollView = true;

UIVScrollView.prototype.initUIVScrollView = function(type, border, bg, scrollBarImg) {
	this.initUIScrollView(type, border, bg);	
	this.setSizeLimit(40, 100, 2000, 2000);
	this.setImage("scrollBarImg", scrollBarImg);
	this.rectSelectable = false;

	return this;
}


UIVScrollView.prototype.needScroll = function(point) {
	var dx = Math.abs(this.getMoveAbsDeltaX());
	var dy = Math.abs(this.getMoveAbsDeltaY());
	
	return (dy > 50 && dy > dx) || (dy > 50 && !this.isInDesignMode());
}

UIVScrollView.prototype.getScrolledSize = function() {
	return Math.floor(this.getMoveAbsDeltaY()); 
}

UIVScrollView.prototype.getScrollDelta = function(point) {
	return Math.floor(this.getMoveDeltaY());
}

UIVScrollView.prototype.getVelocity = function() {
	return this.velocityTracker.getVelocity().y;
}

UIVScrollView.prototype.getPageSize = function() {
	return this.h;
}

UIVScrollView.prototype.translatePoint = function(point) {
	var p = {x : (point.x - this.left), y : (point.y - this.top + this.offset)};

	return p;
}

UIVScrollView.prototype.getScrollRange = function() {
	var range = 0;
	var r = this.calcChildrenRange();

	range = r.b;
	if(range < this.h) {
		 range = this.h;
	}

	var n = (this.isInDesignMode()) ? this.h : 10;

	range = Math.ceil(range/n) * n;

	return range;
}

UIVScrollView.prototype.fixChildPosition = function(child) {
	if(child.widthAttr === UIElement.WIDTH_FILL_PARENT) {
		child.left = this.hMargin;
	}

	if(child.heightAttr === UIElement.HEIGHT_FILL_PARENT) {
		child.top = this.offset + this.vMargin;
		child.heightAttr = UIElement.HEIGHT_SCALE;
	}
	
	if(child.widthAttr === UIElement.WIDTH_FILL_PARENT && child.heightAttr === UIElement.HEIGHT_FILL_PARENT) {
		child.setUserMovable(false);
	}

	return;
}

UIVScrollView.prototype.paintChildren = function(canvas) {
	var shape = null;
	var upClip = this.offset;
	var downClip = this.offset + this.h;

	canvas.save();
	canvas.beginPath();
	canvas.rect(this.getHMargin(), this.getVMargin(), this.getWidth(true), this.getHeight(true));
	canvas.closePath();
	canvas.clip();

	canvas.beginPath();
	canvas.translate(0, -this.offset);

	for(var i = 0; i < this.children.length; i++) {
		shape = this.children[i];
		if(!shape.visible) {
			continue;
		}
		if((shape.top + shape.h) < upClip || shape.top > downClip) {
			continue;
		}

		this.beforePaintChild(shape, canvas);
		shape.paintSelf(canvas);
		this.afterPaintChild(shape, canvas);
	}
	
	this.paintTargetShape(canvas);

	canvas.restore();
	
	return;
}

UIVScrollView.prototype.afterPaintChildren = function(canvas) {
	this.drawScrollBar(canvas);

	return;
}

UIVScrollView.prototype.drawScrollBar = function(canvas) {
	var image = this.getHtmlImageByType("scrollBarImg");

	if(!this.scrollBarOpacity || !image) {
		return;
	}

	var range = this.getScrollRange();
	var x = this.w - image.width - 2;
	var w = image.width;
	var h = this.h * this.h/range;
	var y = (this.offset / range) * this.h;

	if((y + h) > this.h) {
		h = this.h - y;
		y = this.h - h;
	}
	
	if(y < 0) {
		h = h + y;
		y = 0;
	}

	canvas.save();
	canvas.globalAlpha = this.scrollBarOpacity;
	drawNinePatchEx(canvas, image, 0, 0, image.width, image.height, x, y, w, h);
	canvas.restore();

	return;
}

function UIVScrollViewCreator(border, bg, scrollBarImg) {
	var args = ["ui-v-scroll-view", "ui-v-scroll-view", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIVScrollView();
		return g.initUIVScrollView(this.type, border, bg, scrollBarImg);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIVScrollViewCreator(0, null, null));

/*
 * File:   ui-list-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  List View (Scrollable)
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIVScrollViewGeneral() {
	return;
}

UIVScrollViewGeneral.prototype = new UIVScrollView();
UIVScrollViewGeneral.prototype.isUIList = true;
UIVScrollViewGeneral.prototype.isUILayout = true;
UIVScrollViewGeneral.prototype.isUIVScrollViewGeneral = true;
UIVScrollViewGeneral.prototype.sortChildren = UIList.prototype.sortChildren;

UIVScrollViewGeneral.prototype.initUIVScrollViewGeneral = function(type) {
	this.initUIVScrollView(type, 0, null, null);	
	this.setTextType(Shape.TEXT_NONE);

	return this;
}

UIVScrollViewGeneral.prototype.relayoutChildren = function(animHint) {
	if(this.disableRelayout) {
		return;
	}
	var border = this.getVMargin();
	var n = this.children.length;
	
	var y = border;
	for(var i = 0; i < n; i++) {
		var child = this.children[i];
		if(!child.visible) {
			continue;
		}
		
		child.yAttr = UIElement.Y_FIX_TOP;
		child.heightAttr = UIElement.HEIGHT_FIX;
		child.relayout();
		child.top = y;
		
		y += child.h;
	}

	return;
}

UIVScrollViewGeneral.prototype.afterPaintChildren = function(canvas) {
	this.drawScrollBar(canvas);
	
	if(this.isInDesignMode()) {
		this.drawPageDownUp(canvas);
	}

	return;
}

function UIVScrollViewGeneralCreator() {
	var args = ["ui-g-scroll-view", "ui-g-scroll-view", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIVScrollViewGeneral();
		return g.initUIVScrollViewGeneral(this.type);
	}
	
	return;
}

/*
 * File:   ui-scroll-view-x.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Scroll View X 
 * 
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIScrollViewX
 * @extends UIElement
 * 滚动视图。使用时先设置虚拟高度和宽度，虚拟高度小于实际高度时，上下不滚动，虚拟宽度小于实际宽度时，左右不滚动。
 *
 * 在IDE中，拖动滚动视图是改变滚动视图的可视区，要拖动滚动视图本身请使用滚动视图下方的拖动手柄，或者使用方向键，或者直接修改它的坐标。
 *
 * 往滚动视图中添加子控件时，先将控件放到滚动视图的可视区，然后拖动到其它区域。
 */
function UIScrollViewX() {
	return;
}

UIScrollViewX.prototype = new UIElement();
UIScrollViewX.prototype.isUIScrollViewX = true;
UIScrollViewX.prototype.isUIScrollView = true;
UIScrollViewX.prototype.saveProps = ["virtualWidth", "virtualHeight", "showOutside", "maxAnimationDuration", "scrollBgImage"];

UIScrollViewX.prototype.initUIScrollViewX = function(type) {
	this.initUIElement(type);

	this.ox = 0;
	this.oy = 0;
	this.xDragLimit = 0.3;
	this.yDragLimit = 0.3;
	this.scrollBarOpacity = 0;
	this.maxAnimationDuration = 10000;
	this.velocityTracker = new VelocityTracker();
	this.interpolator =  new DecelerateInterpolator(2);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.setImage(UIElement.IMAGE_V_SCROLL_BAR_BG, null);
	this.setImage(UIElement.IMAGE_V_SCROLL_BAR_FG, null);
	this.setImage(UIElement.IMAGE_H_SCROLL_BAR_BG, null);
	this.setImage(UIElement.IMAGE_H_SCROLL_BAR_FG, null);
	this.setImage("option_image_0", null);
	this.setImage("option_image_1", null);
	this.setImage("option_image_2", null);
	this.addEventNames(["onScrolling", "onScrollDone"]);

	return this;
}

UIScrollViewX.prototype.shapeCanBeChild = UIGroup.prototype.shapeCanBeChild;

/**
 * @property {Number} virtualWidth 
 * 虚拟宽度。  
 */

/**
 * @property {Number} virtualHeight
 * 虚拟高度。  
 */

/**
 * @property {Number} xOffset 
 * X方向偏移量。  
 */

/**
 * @property {Number} yOffset 
 * X方向偏移量。  
 */

UIScrollViewX.prototype.setVirtualWidth = function(virtualWidth) {
	this.vw = virtualWidth;
	return this; 
}

UIScrollViewX.prototype.setVirtualHeight = function(virtualHeight) {
	this.vh = virtualHeight;
	return this;
}

UIScrollViewX.prototype.getVirtualWidth = function() {
	return Math.max(this.vw, this.w);
}

UIScrollViewX.prototype.getVirtualHeight = function() {
	return Math.max(this.vh, this.h);
}

UIScrollViewX.prototype.getXOffset = function() {
	return this.ox;
}

UIScrollViewX.prototype.getYOffset = function() {
	return this.oy;
}

UIScrollViewX.prototype.fixXOffset = function(xOffset) {
	return Math.min(Math.max(0, xOffset), this.getVirtualWidth()-this.w) >> 0;
}

UIScrollViewX.prototype.fixYOffset = function(yOffset) {
	return Math.min(Math.max(0, yOffset), this.getVirtualHeight()-this.h) >> 0;
}

UIScrollViewX.prototype.setXOffset = function(xOffset) {
	this.ox = this.fixXOffset(xOffset);

	return this;
}

UIScrollViewX.prototype.setYOffset = function(yOffset) {
	this.oy = this.fixYOffset(yOffset);

	return this;
}

UIScrollViewX.prototype.setDragLimit = function(xDragLimit, yDragLimit) {
	this.xDragLimit = xDragLimit;
	this.yDragLimit = yDragLimit;

	return this;
}

UIScrollViewX.prototype.setOffset = function(xOffset, yOffset, noCheck) {
	if(noCheck) {
		var factor = 0;
		var ox = xOffset >> 0;
		var oy = yOffset >> 0;
		var xDragLimit = this.xDragLimit > 1 ? this.xDragLimit : this.xDragLimit * this.w;
		var yDragLimit = this.yDragLimit > 1 ? this.yDragLimit : this.yDragLimit * this.h; 

		if(ox < -xDragLimit) {
			ox = -xDragLimit;
		}else if((this.vw - ox) < (this.w - xDragLimit)) {
			ox = Math.max(0, this.vw - (this.w - xDragLimit));
		}
	
		if(oy < -yDragLimit) {
			oy = -yDragLimit;
		}else if((this.vh - oy) < (this.h - yDragLimit)) {
			oy = Math.max(0, this.vh - (this.h - yDragLimit));
		}
		this.ox = ox;
		this.oy = oy;
	}else{
		this.setXOffset(xOffset);
		this.setYOffset(yOffset);
	}
	this.callOnScrollingHandler(this.ox, this.oy);

	return this;
}

Object.defineProperty(UIScrollViewX.prototype, "xOffset", {get:UIScrollViewX.prototype.getXOffset, set:UIScrollViewX.prototype.setXOffset});
Object.defineProperty(UIScrollViewX.prototype, "yOffset", {get:UIScrollViewX.prototype.getYOffset, set:UIScrollViewX.prototype.setYOffset});
Object.defineProperty(UIScrollViewX.prototype, "virtualWidth", 
	{get:UIScrollViewX.prototype.getVirtualWidth, set:UIScrollViewX.prototype.setVirtualWidth});
Object.defineProperty(UIScrollViewX.prototype, "virtualHeight", 
	{get:UIScrollViewX.prototype.getVirtualHeight, set:UIScrollViewX.prototype.setVirtualHeight});

UIScrollViewX.prototype.dragStart = function() {
	this.saveOX = this.ox;
	this.saveOY = this.oy;

	this.velocityTracker.clear();
}

UIScrollViewX.prototype.drag = function() {
	this.addMovementForVelocityTracker();
	var ox = this.saveOX - this.getMoveAbsDeltaX();
	var oy = this.saveOY - this.getMoveAbsDeltaY();

	if(this.getVirtualWidth() <= this.w) {
		ox = 0;
	}
	else if(!UIElement.hScrollHandledBy){
		UIElement.hScrollHandledBy = this;
	}

	if(UIElement.hScrollHandledBy !== this) {
		ox = 0;
	}

	if(this.getVirtualHeight() <= this.h) {
		oy = 0;
	}
	else if(!UIElement.vScrollHandledBy) {
		UIElement.vScrollHandledBy = this;
	}
	
	if(UIElement.vScrollHandledBy !== this) {
		oy = 0;
	}

	if(ox || oy) {
		this.setOffset(ox, oy, true);
	}

	return;
}

UIScrollViewX.prototype.getScrollDuration = function(velocity) {
    //t = 2*v / a 
    var duration = Math.max(Math.abs(velocity.x), Math.abs(velocity.y)) * 2 / 2;
    
    return Math.min(duration, this.maxAnimationDuration);
}

UIScrollViewX.prototype.dragEnd = function() {
	var velocity = this.velocityTracker.getVelocity();
   	
    var duration = this.getScrollDuration(velocity);

    if(!duration || duration < 10) {
		return;
	}

	var t = duration/1000;
	var vx = velocity.x;
	var vy = velocity.y;

	if(UIElement.hScrollHandledBy && UIElement.hScrollHandledBy !== this) {
		vx = 0;
	}
	if(UIElement.hScrollHandledBy && UIElement.vScrollHandledBy !== this) {
		vy = 0;
	}

	var xd = 0.5 * vx * t;
	var yd = 0.5 * vy * t;
	var xs = this.ox;
	var ys = this.oy;
	var xe = Math.min(Math.max(0, xs - xd), this.virtualWidth  - this.w);
	var ye = Math.min(Math.max(0, ys - yd), this.virtualHeight - this.h);

    var cross = this.ox < 0 || this.oy < 0 
        || this.ox + this.w > this.virtualWidth 
        || this.oy + this.h > this.virtualHeight;
	
    if(!cross && Math.abs(xd) < 10 && Math.abs(yd) < 10) {
		this.callOnScrollDoneHandler(this.ox, this.oy);
		return;
	}

	this.scrollTo(xe, ye, duration);

	return;
}

/**
 * @method scrollToPercent
 * 滚动到指定位置。
 * @param {Number} xOffsetPercent X方向偏移量百分比(0,100)。
 * @param {Number} yOffsetPercent Y方向偏移量百分比(0,100)。
 * @param {Number} duration 滚动时间(毫秒)。
 * @return {UIElement} 返回控件本身。
 */
UIScrollViewX.prototype.scrollToPercent = function(xOffsetPercent, yOffsetPercent, duration) {
	var xOffset = (this.virtualWidth - this.w) * (xOffsetPercent/100);
	var yOffset = (this.virtualHeight - this.h) * (yOffsetPercent/100);

	return this.scrollTo(xOffset, yOffset, duration);
}

/**
 * @event onScrolling
 * 滚动事件。
 * @param {Number} xOffset x偏移量。
 * @param {Number} yOffset y偏移量。
 */

/**
 * @event onScrollDone
 * 滚动完成事件。
 * @param {Number} xOffset x偏移量。
 * @param {Number} yOffset y偏移量。
 */

/**
 * @method scrollTo
 * 滚动到指定位置。
 * @param {Number} xOffset X方向偏移量。
 * @param {Number} yOffset Y方向偏移量。
 * @param {Number} duration 滚动时间(毫秒)。
 * @return {UIElement} 返回控件本身。
 */
UIScrollViewX.prototype.scrollTo = function(xOffset, yOffset, duration) {
	var xs = this.ox;
	var ys = this.oy;
	var xe = this.fixXOffset(xOffset);
	var ye = this.fixYOffset(yOffset);
	
	var xd = xe - xs;
	var yd = ye - ys;
	if(!duration || (!xd && !yd)) {
		this.setOffset(xOffset, yOffset);
		this.callOnScrollDoneHandler(this.ox, this.oy);

		return this;
	}

	var startTime = Date.now();
	function step(now) {
		var tPercent = (now - startTime)/duration;
		if(tPercent >= 1) {
			tPercent = 1;
			this.setStepScroll(null);
		}
		if(this.pointerDown) {
			this.setStepScroll(null);
		}

		var percent = this.interpolator.get(tPercent);
		var ox = xs + xd * percent;
		var oy = ys + yd * percent;
		this.setOffset(ox, oy, true);
		this.scrollBarOpacity = 1 - percent;

		if(tPercent >= 1) {
			this.callOnScrollDoneHandler(this.ox, this.oy);
		}
	}

	this.setStepScroll(step);

	return this;
}

UIScrollViewX.prototype.setStepScroll = function(stepScroll) {
	this.stepScroll = stepScroll;

	return this;
}

UIScrollViewX.prototype.stepAnimation = function(canvas, now) {
	UIElement.prototype.stepAnimation.call(this, canvas, now);
	if(this.stepScroll) {
		this.stepScroll(now || canvas.now || Date.now());
		this.postRedraw();
	}

	return this;
}

UIScrollViewX.prototype.isDraggable = function() {
	if(this.isInDesignMode()) {
		if(this.hitTestResult !== UIElement.HIT_TEST_MM) {
			return false;
		}

		return !this.getTarget() || this.view.isAltDown();
	}
	else {
		return true;
	}
}

UIScrollViewX.prototype.onPointerDownRunning = UIScrollViewX.prototype.onPointerDownEditing = function(point, beforeChild) {
	this.scrollBarOpacity = 1;
	if(!beforeChild && this.isDraggable()) {
		this.dragStart();
		return true;
	}
	return false;
}

UIScrollViewX.prototype.onPointerMoveRunning = UIScrollViewX.prototype.onPointerMoveEditing = function(point, beforeChild) {
	if(!beforeChild && this.pointerDown && this.isDraggable()){ 
		this.drag();
		return true;
	}
	return false;
}

UIScrollViewX.prototype.onPointerUpRunning = UIScrollViewX.prototype.onPointerUpEditing = function(point, beforeChild) {
	if(!beforeChild && this.pointerDown && this.isDraggable()) {
		this.dragEnd();
		return true;
	}
	this.scrollBarOpacity = 0;

	return false;
}

UIScrollViewX.prototype.translatePoint = function(point) {
	var p = {x : (point.x - this.left + this.xOffset), y : (point.y - this.top + this.yOffset)};

	return p;
}

UIScrollViewX.prototype.onClip = function(canvas) {
	if(this.showOutside && this.isInDesignMode()) {
		return this;
	}

	canvas.clipRect(0, 0, this.w, this.h);

	return this;
}

UIScrollViewX.prototype.isChildVisibleRecursive = function(child) {
	if(child.children && child.children.length) {
		return true;
	}

	return false;
}

UIScrollViewX.prototype.isChildVisible = function(canvas, child) {
	var l = this.ox;
	var r = l + this.w;
	var t = this.oy;
	var b = t + this.h;

	if(!child.visible) {
		return false;
	}
	
	if(this.showOutside && this.isInDesignMode()) {
		return true;
	}

	if(this.isChildVisibleRecursive(child)) {
		return true;
	}

	if((child.top + child.h) < t || child.top > b || (child.left + child.w) < l || child.left > r) {
		return false;
	}

	return true;
}

UIScrollViewX.prototype.paintChildren = function(canvas) {
	var l = this.ox;
	var t = this.oy;
	var children = this.children;
	var n = children.length;

	canvas.save();
	canvas.translate(-l, -t);
	for(var i = 0; i < n; i++) {
		var iter = this.children[i];
		if(this.isChildVisible(canvas, iter)) {
			this.beforePaintChild(iter, canvas);
			iter.paintSelf(canvas);
			this.afterPaintChild(iter, canvas);
		}
	}
	canvas.restore();
	this.drawScrollBar(canvas);
	
	return;
}

UIScrollViewX.prototype.dispatchPointerDownToChildren = function(p) {
	if(!this.hitTestResult && !this.showOutside) {
		return false;
	}

	if(this.isInDesignMode() && this.view.isAltDown()) {
		return false;
	}

	return this.defaultDispatchPointerDownToChildren(p);
}

function UIScrollViewXCreator() {
	var args = ["ui-scroll-view-x", "ui-scroll-view-x", null, true];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIScrollViewX();
		return g.initUIScrollViewX(this.type);
	}
	
	return;
}

UIScrollViewX.prototype.drawBgImageScroll = function(canvas, display, image, rect) {
	switch(display) {
		case WImage.DISPLAY_SCALE: {
			var scaleX = rect.w/this.virtualWidth;
			var scaleY = rect.h/this.virtualHeight;
			var sx = this.xOffset * scaleX;
			var sy = this.yOffset * scaleY;
			var sw = this.w * scaleX;
			var sh = this.h * scaleY;
		
			canvas.drawImage(image, sx, sy, sw, sh, 0, 0, this.w, this.h);
			break;
		}
		case WImage.DISPLAY_TILE: {
			var dx = Math.floor(this.xOffset/rect.w) * rect.w - this.xOffset;
			var dy = Math.floor(this.yOffset/rect.h) * rect.h - this.yOffset
			var dw = Math.ceil((this.w - dx)/rect.w) * rect.w;
			var dh = Math.ceil((this.h - dy)/rect.h) * rect.h;
			
			canvas.save();
			canvas.clipRect(0, 0, this.w, this.h);
			WImage.draw(canvas, image, display, dx, dy, dw, dh, rect);
			canvas.restore();
			break;
		}
		default:break;
	}

	return this;
}

UIScrollViewX.prototype.afterChildAppended = function(shape) {
	shape.xAttr		= UIElement.X_FIX_LEFT;
	shape.yAttr		= UIElement.Y_FIX_TOP;
	shape.widthAttr	= UIElement.WIDTH_FIX;
	shape.heightAttr= UIElement.HEIGHT_FIX;

	if(this.isUILayout) {
		this.relayoutChildren();
	}

	return true;
}

UIScrollViewX.prototype.drawBgImage = function(canvas) {
	if(this.scrollBgImage) {
		var wImage = this.getBgImage();
		if(wImage) {
			var image = wImage.getImage();
			var rect = wImage.getImageRect();
			if(image && rect) {
				this.drawBgImageScroll(canvas, this.images.display, image, rect);
			}
		}
	}
	else {
		UIElement.prototype.drawBgImage.call(this, canvas);
	}
}

UIScrollViewX.prototype.drawVScrollBar = function(canvas) {
	var x = 0;
	var y = 0;
	var w = 0;
	var h = 0;
	var rect = null;
	var image = null;
	
	var bg = this.getImageByType(UIElement.IMAGE_V_SCROLL_BAR_BG);
	var image = bg ? bg.getImage() : null;
	if(image) {
		rect = bg.getImageRect();
		w = rect.rw || rect.w;
		x = this.w - w;
		y = 0;
		h = this.h;

		this.drawImageAt(canvas, image, UIElement.IMAGE_DISPLAY_3PATCH_V, x, y, w, h);
	}

	var fg = this.getImageByType(UIElement.IMAGE_V_SCROLL_BAR_FG);
	var image = fg ? fg.getImage() : null;
	if(image) {
		rect = fg.getImageRect();
		w = rect.rw || rect.w;
		x = this.w - w;
		y = this.h * (this.yOffset/this.virtualHeight);
		h = this.h * (this.h/this.virtualHeight);
		if(y < 0) {
			h = Math.max(10, h + y);
			y = 0;
		}

		if((y + h) > this.h) {
			h = Math.max(10, this.h - y);
			y = this.h - h;
		}

		this.drawImageAt(canvas, image, UIElement.IMAGE_DISPLAY_3PATCH_V, x, y, w, h);
	}

	return;
}

UIScrollViewX.prototype.drawHScrollBar = function(canvas) {
	var x = 0;
	var y = 0;
	var w = 0;
	var h = 0;
	var rect = null;
	var image = null;
	
	var bg = this.getImageByType(UIElement.IMAGE_H_SCROLL_BAR_BG);
	var image = bg ? bg.getImage() : null;
	if(image) {
		rect = bg.getImageRect();
		x = 0;
		w = this.w;
		h = rect.rh || rect.h;
		y = this.h - h;

		this.drawImageAt(canvas, image, UIElement.IMAGE_DISPLAY_3PATCH_H, x, y, w, h);
	}

	var fg = this.getImageByType(UIElement.IMAGE_H_SCROLL_BAR_FG);
	var image = fg ? fg.getImage() : null;
	if(image) {
		rect = fg.getImageRect();
		h = rect.rh || rect.h;
		y = this.h - h;
		x = this.w * (this.xOffset/this.virtualWidth);
		w = this.w * (this.w/this.virtualWidth);
		if(x < 0) {
			w = Math.max(10, w + x);
			x = 0;
		}

		if((x + w) > this.w) {
			w = Math.max(10, this.w - x);
			x = this.w - w;
		}

		this.drawImageAt(canvas, image, UIElement.IMAGE_DISPLAY_3PATCH_H, x, y, w, h);
	}
}

UIScrollViewX.prototype.drawScrollBar = function(canvas) {
	if(this.scrollBarOpacity < 0.0001) {
		return this;
	}
	
	canvas.save();
	canvas.globalAlpha = this.scrollBarOpacity;
	if(this.w < this.virtualWidth) {
		this.drawHScrollBar(canvas);
	}
	
	if(this.h < this.virtualHeight) {
		this.drawVScrollBar(canvas);
	}
	canvas.restore();

	return this;
}

ShapeFactoryGet().addShapeCreator(new UIScrollViewXCreator());

/*
 * File:   ui-grid-view-x.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  GridView
 * 
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIGridViewX
 * @extends UIScrollViewX
 * 网格视图，里面的子控件按行列排列，每个子控件大小相同。可以水平滚动，也可以垂直滚动。
 * 
 * 设计时按住Alt可以拖动可视区，调节子控件的zIndex可以设置子控件的顺序。
 *
 */
function UIGridViewX() {
	return;
}

UIGridViewX.prototype = new UIScrollViewX();
UIGridViewX.prototype.isUILayout = true;
UIGridViewX.prototype.isUIGridViewX = true;
UIGridViewX.prototype.saveProps = UIScrollViewX.prototype.saveProps.concat(["cols","rows","isVertical"]);

UIGridViewX.prototype.initUIGridViewX = function(type) {
	this.initUIScrollViewX(type);	

	this.rows = 3;
	this.cols = 3;
	this.setMargin(0, 0);
	this.setDefSize(200, 200);

	return this;
}

/**
 * @method setVertical
 * 设置网格视图的滚动方向。
 * @param {Boolean} value true表示垂直滚动，false表示水平滚动。
 * @return {UIElement} 返回控件本身。
 *
 */
UIGridViewX.prototype.setVertical = function(value) {
	this.isVertical = value;
	this.relayoutChildren();

	return this;
}

/**
 * @method getVertical
 * 获取网格视图的滚动方向。
 * @return {Boolean} 滚动方向。true表示垂直滚动，false表示水平滚动。
 *
 */
UIGridViewX.prototype.getVertical = function() {
	return this.isVertical;
}

/**
 * @method setRows
 * 设置可视区行数，主要用于控制行高。对于水平滚动的网格视图，这个行数与实际行数一致，对于垂直滚动的网格视图，这个行数与实际行数无关。
 * @param {Number} value 行数。
 * @return {UIElement} 返回控件本身。
 *
 */
UIGridViewX.prototype.setRows = function(value) {
	this.rows = value;
	this.relayoutChildren();

	return this;
}

/**
 * @method getRows
 * 获取行数。
 * @return {Number} 返回行数。
 *
 */
UIGridViewX.prototype.getRows = function() {
	return this.rows;
}

/**
 * @method setCols
 * 设置可视区列数，主要用于控制列宽。对于垂直滚动的网格视图，这个列数与实际列数一致，对于水平滚动的网格视图，这个列数与实际列数无关。
 * @param {Number} value 列数。
 * @return {UIElement} 返回控件本身。
 *
 */
UIGridViewX.prototype.setCols = function(value) {
	this.cols = value;
	this.relayoutChildren();

	return this;
}

/**
 * @method getCols
 * 获取列数。
 * @return {Number} 返回列数。
 *
 */
UIGridViewX.prototype.getCols = function() {
	return this.cols;
}

UIGridViewX.prototype.shapeCanBeChild = UIGroup.prototype.shapeCanBeChild;

UIGridViewX.prototype.relayoutChildren = function(animHint) {
	if(this.disableRelayout) {
		return;
	}

	var cols = this.cols;
	var rows = this.rows;
	var iw = this.w/cols;
	var ih = this.h/rows;

	var r = 0;
	var c = 0;
	var arr = this.children;
	var n = arr.length;
	var spacer = this.spacer;
	var iws = iw + spacer;
	var ihs = ih + spacer;

	var vi = 0;
	for(var i = 0; i < n; i++) {
		var iter = arr[i];
		if(!iter.visible) {
			continue;
		}

		if(this.isVertical) {
			c = vi%cols;
			r = Math.floor(vi/cols);
		}
		else {
			r = vi%rows;
			c = Math.floor(vi/rows);
		}
		iter.left = c * iws;
		iter.top = r * ihs;
		iter.w = iw;
		iter.h = ih;
		iter.setUserMovable(false);
		iter.setUserResizable(false);

		vi++;
	}

	if(this.isVertical) {
		this.vw = this.w;
		this.vh = Math.ceil(n/this.cols) * ihs;
		if(this.isInDesignMode()) {
			this.vh += ihs;
		}
	}
	else {
		this.vh = this.h;
		this.vw = Math.ceil(n/this.rows) * iws;
		if(this.isInDesignMode()) {
			this.vw += iws;
		}
	}
    if(this.xOffset + this.w > this.vw) {
        this.xOffset = this.vw - this.w;
    }
    if(this.yOffset + this.h > this.vh) {
        this.yOffset = this.vh - this.h;
    }
	
    return;
}

UIGridViewX.prototype.isChildVisibleRecursive = function(child) {
	return false;
}

UIGridViewX.prototype.isDraggable = function() {
	if(this.isInDesignMode()) {
		if(this.hitTestResult !== Shape.HIT_TEST_MM) {
			return false;
		}

		var target = this.getTarget();
		return !target || !target.getTarget() || this.view.isAltDown();
	}
	else {
		return true;
	}
}

function UIGridViewXCreator(border) {
	var args = ["ui-grid-view-x", "ui-grid-view-x", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIGridViewX();
		return g.initUIGridViewX(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIGridViewXCreator());

/*
 * File:   ui-list-view-x.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  ListView
 * 
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIListViewX
 * @extends UIScrollViewX
 * 列表视图，可以水平滚动，也可以垂直滚动。
 *
 * 垂直的列表视图和只有一列垂直的网格视图相似，只是列表视图的单项itemSize为0时，里面的子控件可以具有不同的高度。
 * 水平的列表视图和只有一行水平的网格视图相似，只是列表视图的单项itemSize为0时，里面的子控件可以具有不同的宽度。
 * 
 * 设计时按住Alt可以拖动可视区，调节子控件的zIndex可以设置子控件的顺序。
 *
 */
function UIListViewX() {
	return;
}

UIListViewX.prototype = new UIScrollViewX();
UIListViewX.prototype.isUILayout = true;
UIListViewX.prototype.isUIListViewX = true;
UIListViewX.prototype.saveProps = UIScrollViewX.prototype.saveProps.concat(["cols","rows","isVertical", "itemSize"]);

UIListViewX.prototype.initUIListViewX = function(type) {
	this.initUIScrollViewX(type);	

	this.itemSize = 100;
	this.setMargin(0, 0);
	this.setDefSize(200, 200);

	return this;
}

/**
 * @method setVertical
 * 设置网格视图的滚动方向。
 * @param {Boolean} value true表示垂直滚动，false表示水平滚动。
 * @return {UIElement} 返回控件本身。
 *
 */
UIListViewX.prototype.setVertical = function(value) {
	this.isVertical = value;
	this.relayoutChildren();

	return this;
}

/**
 * @method getVertical
 * 获取网格视图的滚动方向。
 * @return {Boolean} 滚动方向。true表示垂直滚动，false表示水平滚动。
 *
 */
UIListViewX.prototype.getVertical = function() {
	return this.isVertical;
}

/**
 * @method setItemSize
 * 设置子控件的大小。
 *
 * 列表视图为垂直方向时，指单项的高度，0表示使用子控件原来的高度，否则使用指定的高度。
 *
 * 列表视图为水平方向时，指单项的宽度，0表示使用子控件原来的宽度，否则使用指定的宽度。
 *
 * @param {Number} value 设置子控件的大小。
 * @return {UIElement} 返回控件本身。
 *
 */
UIListViewX.prototype.setItemSize = function(value) {
	this.itemSize = value;
	this.relayoutChildren();

	return this;
}

/**
 * @method getItemSize
 * 
 * @return {UIElement} 返回单项的高度(垂直)或宽度(水平)。
 *
 */
UIListViewX.prototype.getItemSize = function() {
	return this.itemSize;
}

UIListViewX.prototype.shapeCanBeChild = UIGroup.prototype.shapeCanBeChild;
UIListViewX.prototype.relayoutChildren = function(animHint) {
	if(this.disableRelayout) {
		return;
	}

	var arr = this.children;
	var n = arr.length;
	var spacer = this.spacer || 0;
	var itemSize = this.itemSize;
	var x = 0;
	var y = 0;
	var w = this.w;
	var h = this.h;

	for(var i = 0; i < n; i++) {
		var iter = arr[i];
		if(!iter.visible) {
			continue;
		}

		if(this.isVertical) {
			iter.left = 0;
			iter.w = w;
			iter.h = itemSize || iter.h;
			iter.y = y;
			y += iter.h + spacer;
		}
		else {
			iter.top = 0;
			iter.h = h;
			iter.w = itemSize || iter.w;
			iter.x = x;
			x += iter.w + spacer;
		}
		iter.setUserMovable(false);
		iter.setUserResizable(false);
	}

	if(this.isVertical) {
		this.vw = this.w;
		this.vh = y;
		if(this.isInDesignMode()) {
			this.vh += itemSize || 80;
		}
	}
	else {
		this.vh = this.h;
		this.vw = x;
		if(this.isInDesignMode()) {
			this.vw += itemSize || 80;
		}
	}

	this.xOffset = 0;
	this.yOffset = 0;

	return;
}

UIListViewX.prototype.isChildVisibleRecursive = function(child) {
	return false;
}

UIListViewX.prototype.isDraggable = function() {
	if(this.isInDesignMode()) {
		if(this.hitTestResult !== Shape.HIT_TEST_MM) {
			return false;
		}

		var target = this.getTarget();
		return !target || !target.getTarget() || this.view.isAltDown();
	}
	else {
		return true;
	}
}

function UIListViewXCreator(border) {
	var args = ["ui-list-view-x", "ui-list-view-x", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIListViewX();
		return g.initUIListViewX(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIListViewXCreator());

/*
 * File:   ui-shortcut.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  ShortCut 
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIShortcut() {
	return;
}

UIShortcut.prototype = new UIElement();
UIShortcut.prototype.isUIShortcut = true;

UIShortcut.prototype.initUIShortcut = function(type) {
	this.initUIElement(type);	

	this.setText("#ABCDEFGHIJKLMNOPQRSTUVYWXYZ");
	this.setDefSize(200, 200);
	this.setMargin(5, 5);
	this.setTextType(Shape.TEXT_INPUT);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.addEventNames(["onChanged"]);

	return this;
}

UIShortcut.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIShortcut.prototype.drawText = function(canvas) {
	var text = this.text;
	var n = text.length;

	if(!n) {
		return;
	}

	canvas.textBaseline = "middle";
	canvas.textAlign = "center";
	canvas.font = this.style.getFont();

	var x = this.w >> 1;
	var y = this.vMargin;
	var w = this.getWidth(true);

	var ih = this.getHeight(true)/n;
	var ihh = ih >> 1;

	canvas.lineWidth = this.style.lineWidth;
	canvas.strokeStyle = this.style.lineColor;
	for(var i = 0; i < text.length; i++) {
		var c = text[i];

		if(this.currentItem === i) {
			canvas.rect(0, y, this.w, ih);
			if(this.pointerDown) {
				canvas.fillStyle = this.style.fillColor;
				canvas.fill();
			}
			
			canvas.stroke();
		}

		canvas.fillStyle = this.style.textColor;
		canvas.fillText(c, x, y + ihh);

		y += ih;
	}

	return;
}

UIShortcut.prototype.findItemByPoint = function(point) {
	var text = this.text;
	var vMargin = this.vMargin;
	var h = this.getHeight(true);
	var index = Math.floor(text.length * (point.y-vMargin)/h);

	return index;
}

UIShortcut.prototype.changeItemByPoint = function(point) {
	var text = this.text;
	var index = this.findItemByPoint(point);

	if(index >= 0 && index < text.length) {
		var value = text[index];

		if(this.currentItem != index) {
			this.callOnChangedHandler(value);
			this.currentItem = index;
		}
	}

	return;
}

UIShortcut.prototype.setValue = function(value) {
	var index = this.text.indexOf(value);
	if(index >= 0) {
		if(this.currentItem != index) {
			this.currentItem = index;
			this.callOnChangedHandler(value);
		}
	}

	return;
}

UIShortcut.prototype.getValue = function() {
	if(this.text && this.currentItem >= 0 && this.currentItem < this.text.length) {
		return this.text[this.currentItem];
	}
	else {
		return "";
	}
}

UIShortcut.prototype.onPointerDownRunning = function(point, beforeChild) {
	if(beforeChild || !this.text) {
		return;
	}

	this.changeItemByPoint(point);

	return;
}

UIShortcut.prototype.onPointerMoveRunning = function(point, beforeChild) {
	if(beforeChild || !this.text) {
		return;
	}

	if(this.pointerDown) {
		this.changeItemByPoint(point);
	}

	return;
}

function UIShortcutCreator() {
	var args = ["ui-shortcut", "ui-shortcut", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIShortcut();
		return g.initUIShortcut(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIShortcutCreator());

/*
 * File:   ui-scroll-text.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Scroll Text
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIScrollText() {
	return;
}

UIScrollText.prototype = new UIElement();
UIScrollText.prototype.isUIScrollText = true;

UIScrollText.prototype.initUIScrollText = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_TEXTAREA);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.addEventNames(["onScrollDone"]);

	return this;
}

UIScrollText.prototype.onModeChanged = function() {
	this.offsetX = 0;
	this.offsetY = 0;

	return;
}

UIScrollText.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIScrollText.prototype.getAnimationDuration = function() {
	return this.animationDuration ? this.animationDuration : 1000;
}

UIScrollText.prototype.setAnimationDuration = function(animationDuration) {
	this.animationDuration = animationDuration;

	return;
}

UIScrollText.prototype.getPauseDuration = function() {
	return this.pauseDuration ? this.pauseDuration : 0;
}

UIScrollText.prototype.setPauseDuration = function(pauseDuration) {
	this.pauseDuration = pauseDuration;

	return;
}

UIScrollText.prototype.startVScroll = function() {
	var scrolltext = this;
	var textHeight = this.getTextHeight();
	var lineHeight = this.getLineHeight(true);

	if(textHeight <= this.h) {
		return;
	}

	this.offsetX = 0;
	this.offsetY = 0;
	var startTime = 0;
	var startOffset = 0;
	var duration = this.getAnimationDuration();
	var pauseDuration = this.getPauseDuration();
	this.h = Math.floor(this.h/lineHeight) * lineHeight;

	var range = -this.h;
	var firstTime = true;
	var interpolator =  new DecelerateInterpolator();

	function animStep() {
		if(firstTime) {
			firstTime = false;
			startTime = (new Date()).getTime();
		}

		if(!scrolltext.isVisible()) {
			return;
		}
	
		var now = new Date();
		var timePercent = (now.getTime() - startTime)/duration;
		var percent = pauseDuration > 0 ? interpolator.get(timePercent) : timePercent;
		delete now;

		if(timePercent < 1) {
			scrolltext.offsetY = startOffset + range * percent;
			setTimeout(animStep, 10);
		}
		else {
			scrolltext.offsetY = startOffset + range;

			if(Math.abs(scrolltext.offsetY) < (textHeight-scrolltext.h)) {
				firstTime = true;

				startOffset = scrolltext.offsetY;
				setTimeout(animStep, pauseDuration);
			}
			else {
				delete interpolator;
				scrolltext.callOnScrollDoneHandler();
			}

			delete startTime;
		}

		delete now;
		scrolltext.postRedraw();
	}

	setTimeout(animStep, pauseDuration);

	return;
}

UIScrollText.prototype.startHScroll = function() {
	var scrolltext = this;
	var textWidth = this.textWidth;

	if(textWidth <= this.w) {
		return;
	}

	this.offsetX = 0;
	this.offsetY = 0;
	var startTime = 0;
	var startOffset = 0;
	var duration = this.getAnimationDuration();
	var pauseDuration = this.getPauseDuration();

	var range = -this.w;
	var firstTime = true;
	var interpolator =  new DecelerateInterpolator();

	function animStep() {
		if(firstTime) {
			firstTime = false;
			startTime = (new Date()).getTime();
		}

		if(!scrolltext.isVisible()) {
			return;
		}
	
		var now = new Date();
		var timePercent = (now.getTime() - startTime)/duration;
		var percent = pauseDuration > 0 ? interpolator.get(timePercent) : timePercent;

		if(timePercent < 1) {
			scrolltext.offsetX = startOffset + range * percent;
			setTimeout(animStep, 10);
		}
		else {
			scrolltext.offsetX = startOffset + range;

			if(Math.abs(scrolltext.offsetX) < (textWidth-scrolltext.w)) {
				firstTime = true;

				startOffset = scrolltext.offsetX;
				setTimeout(animStep, pauseDuration);
			}
			else {
				delete startTime;
				scrolltext.callOnScrollDoneHandler();
			}
		}

		delete now;
		scrolltext.postRedraw();
	}

	setTimeout(animStep, pauseDuration);

	return;
}

UIScrollText.prototype.startScroll = function() {
	if(!this.isVisible()) {
		return;
	}

	if(this.type === "ui-vscroll-text") {
		this.startVScroll();
	}
	else {
		this.startHScroll();
	}

	return;
}

UIScrollText.prototype.onInit = function() {
	this.offsetX = 0;
	this.offsetY = 0;

	var scrolltext = this;
	setTimeout(function() {
			scrolltext.startScroll();
		}, 1000);

	return;
}

UIScrollText.prototype.drawText = function(canvas) {
	var offsetX = this.offsetX ? this.offsetX : 0;
	var offsetY = this.offsetY ? this.offsetY : 0;

	canvas.save();
	canvas.rect(0, 0, this.w, this.h);
	canvas.clip();
	canvas.translate(offsetX, offsetY);
    canvas.beginPath();
    canvas.font = this.style.getFont();
    canvas.fillStyle = this.style.textColor;
    canvas.strokeStyle = this.style.lineColor;
    canvas.lineWidth = 1;

	if(this.type === "ui-vscroll-text") {
		this.drawMLText(canvas, false, true);
	}
	else {
		this.textWidth = this.draw1LText(canvas, true);
	}
	canvas.restore();

	return;
}

function UIScrollTextCreator(type, w, h) {
	var args = [type, type, null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIScrollText();
		
		return g.initUIScrollText(this.type, w, h);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIScrollTextCreator("ui-vscroll-text", 200, 200));
ShapeFactoryGet().addShapeCreator(new UIScrollTextCreator("ui-hscroll-text", 200, 50));

/*
 * File:   ui-list.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  List
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIList
 * @extends UIElement
 * 列表。每一行是一个UIListItem控件，UIListItem的高度可以固定也可以变化。
 *
 */
function UIList() {
	return;
}

UIList.prototype = new UIElement();
UIList.prototype.isUIList = true;
UIList.prototype.isUILayout = true;

UIList.prototype.saveProps = ["spacer", "itemHeightVariable", "itemDraggable", "itemHeight"];
UIList.prototype.initUIList = function(type, border, itemHeight, bg) {
	this.initUIElement(type);	

	this.setMargin(border, border);
	this.setSizeLimit(100, 100, 1000, 1000);
	this.setDefSize(400, itemHeight * 3 + 2 * border);

	this.spacer = 0;
	this.itemHeight = itemHeight;
	this.widthAttr = UIElement.WIDTH_FILL_PARENT; 
	this.setTextType(Shape.TEXT_INPUT);
	this.setImage(UIElement.IMAGE_DEFAULT, bg);
	this.rectSelectable = false;
	this.itemHeightVariable = false;
	this.addEventNames(["onInit"]);

	if(!bg) {
		this.style.setFillColor("White");
	}

	return this;
}

UIList.prototype.getItemHeight = function() {
	return this.itemHeight;
}

UIList.prototype.setItemHeight = function(itemHeight) {
	this.itemHeight = itemHeight;

	return;
}

UIList.prototype.shapeCanBeChild = function(shape) {
	if(!shape.isUIListItem) {
		return false;
	}

	return true;
}

UIList.prototype.childIsBuiltin = function(child) {
	return child.name === "ui-list-item-update-status" 
		|| child.name === "ui-list-item-update-tips"
		|| child.name === "ui-last"
		|| child.name.indexOf("prebuild") >= 0
		|| child.name.indexOf("builtin") >= 0;
}

UIList.FIRST_ITEM = -1;
UIList.LAST_ITEM =   1;
UIList.MIDDLE_ITEM = 0;
UIList.SINGLE_ITEM = 2;

UIList.prototype.fixListItemImage = function(item, position) {
	var images = item.images;
	for(var key in images) {
		var value = images[key];
		if(key != "display") {
			var src = value.getImageSrc();
			if(!src) {
				continue;
			}

			switch(position) {
				case UIList.FIRST_ITEM: {
					src = src.replace(/\.single\./, ".first.");
					src = src.replace(/\.middle\./, ".first.");
					src = src.replace(/\.last\./, ".first.");
					break;
				}
				case UIList.MIDDLE_ITEM: {
					src = src.replace(/\.single\./, ".middle.");
					src = src.replace(/\.first\./, ".middle.");
					src = src.replace(/\.last\./, ".middle.");
					break;
				}
				case UIList.LAST_ITEM: {
					src = src.replace(/\.single\./, ".last.");
					src = src.replace(/\.first\./, ".last.");
					src = src.replace(/\.middle\./, ".last.");
					break;
				}
				case UIList.SINGLE_ITEM: {
					src = src.replace(/\.first\./, ".single.");
					src = src.replace(/\.middle\./, ".single.");
					src = src.replace(/\.last\./, ".single.");
					break;
				}
			}

			value.setImageSrc(src);
		}
	}

	return;
}

UIList.prototype.relayoutChildren = function(animHint) {
	if(this.disableRelayout) {
		return;
	}

	var hMargin = this.getHMargin();
	var vMargin = this.getVMargin();

	var x = hMargin;
	var y = vMargin;
	var w = this.getWidth(true);
	var itemHeight = this.getItemHeight();
	var h = itemHeight;
	var itemHeightVariable = this.itemHeightVariable;

	var i = 0;
	var spacer = this.spacer;
	var n = this.children.length;
	var children = this.children;
	for(var k = 0; k < n; k++) {
		var child = children[k];

		var config = {};
		var animatable = false;
		
		if(child.removed || !child.visible) continue;

		if(itemHeightVariable || child.isHeightVariable()) {
			h = child.measureHeight(itemHeight);
		}
		else {
			h = itemHeight;
		}

		if(n === 1) {
			this.fixListItemImage(child, UIList.SINGLE_ITEM);
		}
		else if(i === 0) {
			this.fixListItemImage(child, UIList.FIRST_ITEM);	
		}
		else if(i === (n - 1)) {
			this.fixListItemImage(child, UIList.LAST_ITEM);	
		}
		else {
			this.fixListItemImage(child, UIList.MIDDLE_ITEM);	
		}

		if(this.h <= (y + vMargin + h)) {
			this.h = y + vMargin + h;
		}

		
		animatable =  (y < this.h) && (animHint || this.isInDesignMode());
		if(animatable) {
			child.setSize(w, h);
			config.xStart = child.left;
			config.yStart = child.top;
			config.wStart = child.w;
			config.hStart = child.h;
			config.xEnd = x;
			config.yEnd = y;
			config.wEnd = w;
			config.hEnd = h;

			config.delay = 10;
			config.duration = 500;
			config.element = child;
			config.onDone = function (name) {
				this.relayoutChildren();
			}
			
			child.animate(config);
		}
		else {
			child.move(x, y);
			child.setSize(w, h);
			child.relayoutChildren();
		}

		child.setUserMovable(true);
	
		child.widthAttr = UIElement.WIDTH_FILL_PARENT;
		if(child.heightAttr === UIElement.HEIGHT_FILL_PARENT) {
			child.heightAttr = UIElement.HEIGHT_FIX;
		}
		child.setUserResizable(itemHeightVariable || child.isHeightVariable());
		if(!this.isUIScrollView) {
			child.setDraggable(this.itemDraggable);
		}

		y += h + spacer;
		i++;
	}

	return;
}

UIList.prototype.beforePaintChildren = function(canvas) {
	canvas.beginPath();
	canvas.rect(0, 0, this.w, this.h);
	canvas.clip();
	canvas.beginPath();

	return;
}

UIList.prototype.afterPaintChildren = function(canvas) {
	return;
}

UIList.prototype.afterChildAppended = function(shape) {
	if(shape.view && this.isInDesignMode() && shape.isCreatingElement()) {
		this.sortChildren();
	}
	this.moveMustBeLastItemToLast();
	shape.setUserMovable(true);
	shape.setUserResizable(false);
	shape.setCanRectSelectable(false, true);
	shape.autoAdjustHeight = this.itemHeightVariable;
	shape.setDraggable(this.itemDraggable);
	this.relayoutChildren();

	return true;
}

UIList.prototype.sortChildren = function() {}

UIList.prototype.onKeyUpRunning = function(code) {
	var targetShapeIndex = 0;

	if(!this.children.length) {
		return;
	}

	switch(code) {
		case KeyEvent.DOM_VK_UP: {
			targetShapeIndex = this.children.indexOf(this.targetShape) - 1;
			break;
		}
		case KeyEvent.DOM_VK_DOWN: {
			targetShapeIndex = this.children.indexOf(this.targetShape) + 1;
			break;
		}
		default: {
			return;
		}
	}

	var n = this.children.length;
	targetShapeIndex = (targetShapeIndex + this.children.length)%n;
	var targetShape = this.children[targetShapeIndex];

	this.setTarget(targetShape);
	this.postRedraw();

	if(this.isUIListView) {
		if(this.offset > targetShape.top) {
			this.offset = targetShape.top;
		}

		if((this.offset + this.h) < (targetShape.top + targetShape.h)) {
			this.offset = targetShape.top - (this.h - targetShape.h);
		}
	}

	return;
}

UIList.prototype.onKeyDownRunning = function(code) {
}

UIList.prototype.getValue = function() {
	var ret = null;
	var n = this.children.length;
	if(n < 1) return ret;
	
	for(var i = 0; i < n; i++) {
		var iter = this.children[i];
		if(!iter.isUIListCheckableItem || !iter.value) continue;

		if(iter.isRadio) {
			return i;	
		}
		else {
			if(!ret) ret = [];
			ret.push(i);
		}
	}

	return ret;
}

UIList.prototype.setValue = function(value) {
	var arr = null;
	if(typeof value === "array") {
		arr = value;
	}
	else if(typeof value === "number") {
		arr = [value];
	}
	else {
		arr = [];
	}

	var n = this.children.length;
	for(var i = 0; i < n; i++) {
		var item = this.children[i];
		if(item.isUIListCheckableItem) {
			item.setValue(false);
		}
	}

	for(var i = 0; i < arr.length; i++) {
		var index = arr[i];
		if(index >= 0 && index < n) {
			var item = this.children[index];
			if(item.isUIListCheckableItem) {
				item.setChecked(true);
			}
		}
	}

	return this;
}

function UIListCreator(border, itemHeight, bg) {
	var args = ["ui-list", "ui-list", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIList();
		return g.initUIList(this.type, border, itemHeight, bg);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIListCreator(5, 114, null));

/*
 * File:   ui-list-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  List View (Scrollable)
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIListView
 * @extends UIList
 * 列表视图。和UIList一样，只是可以滚动。建议使用UIListViewX。
 *
 */
function UIListView() {
	return;
}

UIListView.prototype = new UIVScrollView();
UIListView.prototype.isUIList = true;
UIListView.prototype.isUILayout = true;
UIListView.prototype.isUIListView = true;
UIListView.prototype.setItemHeight = UIList.prototype.setItemHeight;
UIListView.prototype.sortChildren = UIList.prototype.sortChildren;
UIListView.prototype.initUIList = UIList.prototype.initUIList;
UIListView.prototype.shapeCanBeChild = UIList.prototype.shapeCanBeChild;
UIListView.prototype.paintSelfOnly = UIList.prototype.paintSelfOnly;
UIListView.prototype.fixListItemImage = function(item, position) {};
UIListView.prototype.afterChildAppended = UIList.prototype.afterChildAppended;
UIListView.prototype.childIsBuiltin = UIList.prototype.childIsBuiltin;
UIListView.prototype.onKeyUpRunning = UIList.prototype.onKeyUpRunning;
UIListView.prototype.onKeyDownRunning = UIList.prototype.onKeyDownRunning;
UIListView.prototype.getValue = UIList.prototype.getValue;
UIListView.prototype.setValue = UIList.prototype.setValue;

UIListView.UPDATE_STATUS_NONE = 0;
UIListView.UPDATE_STATUS_TIPS = 1;
UIListView.UPDATE_STATUS_SYNC = 2;

UIListView.prototype.saveProps = UIList.prototype.saveProps;
UIListView.prototype.beginUpdate = function() {
	this.updateStatus = UIListView.UPDATE_STATUS_SYNC;
	var statusItem = this.findChildByName("ui-list-item-update-status");
	if(statusItem) {
		var waitBox = statusItem.findChildByName("ui-wait-box");
		if(waitBox) {
			waitBox.show();
		}

		var loading = statusItem.findChildByName("ui-label-loading");
		if(loading) {
			loading.setText(dappGetText("Loading..."));
		}
	}

	return;
}

UIListView.prototype.drawBgImage = function(canvas) {
	canvas.beginPath();
	canvas.rect(0, 0, this.w, this.h);
	canvas.clip();
	canvas.beginPath();

	UIElement.prototype.drawBgImage.call(this, canvas);

	return this;
}

UIListView.prototype.endUpdate = function() {
	this.updateStatus = UIListView.UPDATE_STATUS_NONE;
	var statusItem = this.findChildByName("ui-list-item-update-status");
	if(statusItem) {
		this.setLastUpdateTime(new Date());
	}
	this.relayoutChildren(true);

	return;
}

UIListView.prototype.initUIListView = function(type, border, itemHeight, bg) {
	this.spacer = 0;
	this.initUIList(type, border, itemHeight, bg);
	this.initUIVScrollView(type, 0, bg, null);	
	this.updateStatus = UIListView.UPDATE_STATUS_NONE;
	this.addEventNames(["onUpdateData", "onScrollOutOfRange"]);
	this.setTextType(Shape.TEXT_INPUT);

	return this;
}

UIListView.prototype.onModeChanged = function() {
	this.offset = 0;
	this.updateStatus = UIListView.UPDATE_STATUS_NONE;

	return;
}

UIListView.prototype.updateDone = function() {
	var list = this;

	list.endUpdate();
	setTimeout(function() {
		if(list.parentShape) {
			list.relayoutChildren();
			list.postRedraw();
		}
	}, 1000);

	return;
}

UIListView.prototype.callOnUpdateData = function() {
	this.callOnUpdateDataHandler();

	this.beginUpdate();
	var listView = this;
	setTimeout(function() {
		if(listView.parentShape) {
			listView.updateDone();
		}
	}, 10000);

	return true;
}

UIListView.prototype.setLastUpdateTime = function(lastUpdateTime) {
	var tipsItem = this.findChildByName("ui-list-item-update-tips");

	if(tipsItem && lastUpdateTime) {
		var str = "";
		var now = new Date();
		
		if(now.getFullYear() === lastUpdateTime.getFullYear() 
			&& now.getDate() === lastUpdateTime.getDate()
			&& now.getMonth() === lastUpdateTime.getMonth()) {
			
			str = dappGetText("Today");
		}
		else {
			str = lastUpdateTime.getMonth() + "-" + lastUpdateTime.getDate();
		}

		str = str + " " + lastUpdateTime.getHours() + ":" + lastUpdateTime.getMinutes();

		var updateTime = tipsItem.findChildByName("ui-label-update-time");
		if(updateTime) {
			updateTime.setText(str);
		}
		
		var updateTime = tipsItem.findChildByName("ui-label-update-time");
		if(updateTime) {
			updateTime.setText(str);
		}
		
		var updateTimeTips = tipsItem.findChildByName("ui-label-update-time-tips");
		if(updateTimeTips) {
			updateTimeTips.setText(dappGetText("Last Update:"));
		}
	}

	return;
}

UIListView.prototype.onDrag = function(offset) {
	var tipsItem = this.findChildByName("ui-list-item-update-tips");

	if(tipsItem) {
		var indicator = tipsItem.findChildByName("ui-image");
		var tips = tipsItem.findChildByName("ui-label-tips");

		if(indicator) {
			
			if(offset < -115) {
				if(indicator.rotation === 0) {
					function animationRotate() {
						var angle = indicator.rotation + 0.2 * Math.PI;
						if(angle > Math.PI) {
							angle = Math.PI;
						}
						indicator.setRotation(angle);
						if(angle < Math.PI) {
							setTimeout(animationRotate, 50);
						}
						indicator.postRedraw();

						return;
					}
					
					animationRotate();
					if(tips) {
						tips.setText(dappGetText("Release To Update."));
					}
				}
			}
			else {
				indicator.setRotation(0);
				if(tips) {
					tips.setText(dappGetText("Pull To Update."));
				}
			}
		}
	}

	return;
}

UIListView.prototype.whenScrollOutOfRange = function(offset) {

	if(offset < -115) {
		this.callOnUpdateData();
		this.relayoutChildren();
	}

	this.callOnScrollOutOfRangeHandler(offset);

	return;
}

UIListView.prototype.relayoutChildren = function(animHint) {
	if(this.disableRelayout) {
		return;
	}

	var hMargin = this.getHMargin();
	var vMargin = this.getVMargin();

	var x = hMargin;
	var y = vMargin;
	var w = this.getWidth(true);
	var h = this.itemHeight;
	var itemHeightVariable = this.itemHeightVariable;
	var range = this.getScrollRange();
	var pageSize = this.getPageSize();
	var userMovable = true;

	
	var i = 0;
	var spacer = this.spacer || 0;
	var n = this.children.length;
	var children = this.children;
	for(var k = 0; k < n; k++) {
		var child = children[k];
		
		var config = {};
		var isBuiltin = false;
		if(child.removed || !child.visible) continue;
		
		if(itemHeightVariable || child.isHeightVariable()) {
			h = child.measureHeight(this.itemHeight);
		}
		else {
			h = this.itemHeight;
		}

		if(child.name === "ui-list-item-update-tips") {
			if(!this.isInDesignMode()) {
				child.move(x, -h);
				child.left = x;
				child.top = -h;
				child.w = w;
				child.h = h;
				child.setUserMovable(false);
				child.setUserResizable(false);
				child.setVisible(this.updateStatus !== UIListView.UPDATE_STATUS_TIPS);

				continue;
			}
			else {
				child.setVisible(true);
			}
			isBuiltin = true;
		}
		else if(child.name === "ui-list-item-update-status") {
			if(!this.isInDesignMode()) {
				if(this.updateStatus !== UIListView.UPDATE_STATUS_SYNC) {
					child.setVisible(false);
				}else {
					child.setVisible(true);
				}
			}
			else {
				child.setVisible(true);
			}
			isBuiltin = true;
		}
		
		if(!child.visible) {
			continue;
		}

		animatable =  child.isVisible() && !isBuiltin && (y < this.h) && (animHint || this.isInDesignMode());
		if(animatable && (x != child.left || y != child.top || w != child.w || h != child.h)) {
			child.setSize(w, h);

			config.xStart = child.left;
			config.yStart = child.top;
			config.wStart = child.w;
			config.hStart = child.h;
			config.xEnd = x;
			config.yEnd = y;
			config.wEnd = w;
			config.hEnd = h;

			config.delay = 10;
			config.duration = 1000;
			config.element = child;
			config.onDone = function (name) {
				this.relayoutChildren();
			}
			child.animate(config);
		}
		else {
			child.move(x, y);
			child.setSize(w, h);
			child.relayoutChildren();
		}

		child.widthAttr = UIElement.WIDTH_FILL_PARENT;
		if(child.heightAttr === UIElement.HEIGHT_FILL_PARENT) {
			child.heightAttr = UIElement.HEIGHT_FIX;
		}
		child.setUserMovable(userMovable);
		child.setUserResizable(itemHeightVariable || child.isHeightVariable());

		y += h + spacer;
		i++;
	}

	return;
}

UIListView.prototype.drawText = UIList.prototype.drawText;

UIListView.prototype.afterPaintChildren = function(canvas) {
	this.drawScrollBar(canvas);
	
	if(this.isInDesignMode()) {
		this.drawPageDownUp(canvas);
	}

	return;
}

function UIListViewCreator(border, itemHeight, bg) {
	var args = ["ui-list-view", "ui-list-view", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIListView();
		return g.initUIListView(this.type, border, itemHeight, bg);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIListViewCreator(5, 114, null));

/*
 * File:   ui-list-item.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  List Item
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIListItem
 * @extends UIElement
 * UIListItem是一个简单的容器，它是UIList/UIListView唯一能容纳的子控件。
 *
 */
function UIListItem() {
	return;
}

UIListItem.prototype = new UIElement();
UIListItem.prototype.isUIListItem = true;

UIListItem.prototype.saveProps = ["heightVariable", "slideToRemove", "isTemplate", "roundRadius"];
UIListItem.prototype.initUIListItem = function(type) {
	this.initUIElement(type);	

	this.roundRadius = 5;
	this.setDefSize(200, 120);
	this.setTextType(Shape.TEXT_NONE);
	this.widthAttr = UIElement.WIDTH_FILL_PARENT; 
	this.images.display = UIElement.IMAGE_DISPLAY_9PATCH;
	this.setImage(UIElement.IMAGE_FOCUSED, null);
	this.setImage(UIElement.IMAGE_ACTIVE, null);
	this.setImage(UIElement.IMAGE_NORMAL, null);
	this.setImage(UIElement.IMAGE_DISABLE, null);
	this.setImage(UIElement.IMAGE_POINTER_OVER, null);
	this.setImage(UIElement.IMAGE_DELETE_ITEM, null);
	this.addEventNames(["onLongPress", "onRemoved"]);

	return this;
}

UIListItem.prototype.dragMove = function(dx, dy) {
	this.top = this.top + dy;
	this.onDragging();

	return;
}

UIListItem.prototype.getDeleteItemIcon = function() {
	var image = this.getHtmlImageByType(UIElement.IMAGE_DELETE_ITEM);

	return image;
}

UIListItem.prototype.shapeCanBeChild = function(shape) {

	if(shape.isUIMenu || shape.isUIDevice || shape.isUIScreen || shape.isUIStatusBar 
		|| shape.isUIWindow || shape.isUIPageManager || shape.isUIPage || shape.isUIListItem) {
		return false;
	}

	return true;
}

UIListItem.prototype.onUserResized = function() {
	var list = this.parentShape;
	if(list) {
		list.relayoutChildren();
	}

	return;
}

UIListItem.prototype.setSlideToRemove = function(value) {
	this.slideToRemove = value;

	return this;
}

UIListItem.prototype.setHeightVariable = function(value) {
	this.heightVariable = value;
	
	return this;
}

UIListItem.prototype.isHeightVariable = function() {
	return this.heightVariable;
}

UIListItem.prototype.measureHeight = function(height) {
	return this.h;
}

UIListItem.prototype.ANIM_DRAW_LINE = 1;
UIListItem.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(beforeChild || !this.slideToRemove) {
		return;
	}

	var dx = this.getMoveAbsDeltaX();
	var dy = this.getMoveAbsDeltaY();
	
	if(Math.abs(dx) < this.w/2 || (Math.abs(dy) > this.h)) {
		return;
	}

	var item = this;
	var duration = 300;
	var startTime = (new Date()).getTime();
	
	item.animateState = this.ANIM_DRAW_LINE;
	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		iter.style.setTextColor("#C0C0C0");
	}

	function animStep() {
		var now = new Date();
		var percent = (now.getTime() - startTime)/duration;
	
		if(percent < 1) {
			item.animatePercent = percent;
			setTimeout(animStep, 10);
		}
		else {
			item.animatePercent = 1;

			setTimeout(function() {
				delete startTime;
				delete item.animatePercent;
				delete item.animateState;

				var parentShape = item.parentShape;
				parentShape.removeChild(item);
				parentShape.relayoutChildren("default");
				parentShape.postRedraw();
			}, 300);
		}

		delete now;
		item.postRedraw();
	}

	animStep();

	return;
}

UIListItem.prototype.getFillColor = function(canvas) {
	var fillColor;
	if(this.pointerDown) {
		var dy = Math.abs(this.getMoveAbsDeltaY());
		if(dy < 5) {
			var deltaTime = Date.now() - this.pointerDownTime;
			if(deltaTime < 50 && this.getParent().isUIListView) {
				fillColor = this.style.fillColor;
				this.postRedraw();
			}
			else {
				fillColor = this.style.textColor; 
			}
		}
		else {
			fillColor = this.style.fillColor;
		}
	}
	else if(this.isPointerOverShape()) {
		fillColor = this.style.overFillColor ? this.style.overFillColor : this.style.fillColor;
	}
	else if(this.isFocused()) {
		fillColor = this.style.focusedFillColor ? this.style.focusedFillColor : this.style.fillColor;
	}
	else {
		fillColor = this.style.fillColor;
	}

	return fillColor;
}

UIListItem.prototype.paintSelfOnly = function(canvas) {
	if(this.getBgHtmlImage()) {
		return;
	}

	var parentShape = this.parentShape;
	var fillColor = this.getFillColor();
	var lineColor = this.style.lineColor;
	var lineWidth = this.style.lineWidth;

	canvas.beginPath();
	if(!parentShape || parentShape.isUIListView || parentShape.isUIMenu) {
		if(!Shape.isTransparentColor(fillColor)) {
			canvas.fillStyle = fillColor;
			canvas.fillRect(0, 0, this.w, this.h);
		}

		if(!Shape.isTransparentColor(lineColor)) {
			canvas.moveTo(0, this.h);
			canvas.lineTo(this.w, this.h);
			canvas.lineWidth = lineWidth;
			canvas.strokeStyle = lineColor;
			canvas.stroke();
		}

		return;
	}

	var r = this.roundRadius;
	var isFirst = (this === parentShape.children[0]);
	var isLast  = (this === parentShape.children[parentShape.children.length-1]);
	if(isFirst && isLast) {
		drawRoundRect(canvas, this.w, this.h, r);
	}
	else if(isFirst) {
		drawRoundRect(canvas, this.w, this.h, r, RoundRect.TL | RoundRect.TR);
	}
	else if(isLast) {
		drawRoundRect(canvas, this.w, this.h, r, RoundRect.BL | RoundRect.BR);
	}
	else {
		canvas.rect(0, 0, this.w, this.h);
	}

	if(!Shape.isTransparentColor(fillColor)) {
		canvas.fillStyle = fillColor;
		canvas.fill();
	}
	
	if(!Shape.isTransparentColor(lineColor)) {
		canvas.lineWidth = lineWidth;
		canvas.strokeStyle = lineColor;
		canvas.stroke();
	}

	return;
}

UIListItem.prototype.afterPaintChildren = function(canvas) {
	if(!this.animateState) {
		return;
	}

	var image = this.getDeleteItemIcon();
	if(this.animateState === this.ANIM_DRAW_LINE && image && image.width > 0) {
		var margin = 20;
		var percent = this.animatePercent;
		var w = (this.w - margin ) * percent - image.width;

		if(w > margin) {
			canvas.lineWidth = 1;
			canvas.strokeStyle = "#D0D0D0";
			canvas.moveTo(margin, this.h/2);
			canvas.lineTo(w, this.h/2);
			canvas.stroke();

			if(percent > 0.9) {
				var y = (this.h - image.height)/2;
				var x = this.w - image.width - margin;

				canvas.drawImage(image, x, y);
			}
		}
	}

	return;
}

UIListItem.prototype.afterChildAppended = function(shape) {
	if(shape.isUIButton || shape.isUICheckBox) {
		this.setImage(UIElement.IMAGE_ACTIVE, this.getImageByType(UIElement.IMAGE_NORMAL).getImageSrc());
		this.setImage(UIElement.IMAGE_FOCUSED, this.getImageByType(UIElement.IMAGE_NORMAL).getImageSrc());
	}

	return true;
}

function UIListItemCreator() {
	var args = ["ui-list-item", "ui-list-item", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIListItem();
		g.initUIListItem(this.type);
	
		return g;
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIListItemCreator(null, null, null, null));

/*
 * File:   ui-list-checkable-item.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Checkable List Item 
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIListCheckableItem() {
	return;
}

UIListCheckableItem.prototype = new UIListItem();
UIListCheckableItem.prototype.isUIListCheckableItem = true;

UIListCheckableItem.prototype.initUIListCheckableItem = function(type) {
	this.initUIListItem(type);

	this.isUIListRadioBoxItem = (type === "ui-list-radiobox-item");
	this.isUIListCheckBoxItem = (type === "ui-list-checkbox-item");
	this.setImage(UIElement.IMAGE_CHECKED_FG, null);
	this.setImage(UIElement.IMAGE_UNCHECK_FG, null);
	this.addEventNames(["onChanged"]);

	return this;
}

UIListCheckableItem.prototype.getValue = function() {
	return this.value;
}

UIListCheckableItem.prototype.setValue = function(value) {
	if(this.value != value) {
		this.value = value;
		this.callOnChangedHandler(this.value);
	}

	return;
}

UIListCheckableItem.prototype.setChecked = function() {
	var parentShape = this.parentShape;
	if(parentShape) {
		for(var i = 0; i < parentShape.children.length; i++) {
			var shape = parentShape.children[i];
			if(shape.isUIListCheckableItem) {
				shape.setValue(false);
			}
		}
	}

	this.setValue(true);

	return;
}

UIListCheckableItem.prototype.setParent = function(parentShape) {
	this.parentShape = parentShape;

	if(this.value) {
		this.setChecked();
	}

	return;
}

UIListCheckableItem.prototype.onClick = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}

	if(this.isUIListRadioBoxItem) {
		this.setChecked();
	}
	else {
		this.setValue(!this.value);
	}

	return;
}

UIListCheckableItem.prototype.drawFgImage = function(canvas) {
	var image = this.getHtmlImageByType(this.value ? UIElement.IMAGE_CHECKED_FG : UIElement.IMAGE_UNCHECK_FG);

	if(image) {
		var x = this.w - image.width - 20;
		var y = (this.h - image.height)/2;

		canvas.drawImage(image, 0, 0, image.width, image.height, x, y, image.width, image.height);
	}

	return;
}

function UIListCheckBoxItemCreator() {
	var args = ["ui-list-checkbox-item", "ui-list-checkbox-item", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIListCheckableItem();
		g.initUIListCheckableItem(this.type);
		return g;
	}
	
	return;
}

function UIListRadioBoxItemCreator() {
	var args = ["ui-list-radiobox-item", "ui-list-radiobox-item", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIListCheckableItem();
		g.initUIListCheckableItem(this.type);
		return g;
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIListCheckBoxItemCreator());
ShapeFactoryGet().addShapeCreator(new UIListRadioBoxItemCreator());

/*
 * File:   ui-select.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Scrollable Select
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UISelect
 * @extends UIElement
 * 提供多个选项给用户，让用户选择其中一个。可以用getValue来获取用户选择的值。
 *
 */

/**
 * @event onChanged
 * 用户选择选项时触发本事件。
 * @param {String} value 当前的选项。
 */

function UISelect() {
	return;
}

UISelect.prototype = new UIElement();
UISelect.prototype.isUISelect = true;

UISelect.prototype.saveProps = ["visibleItems", "isVertical"];
UISelect.prototype.initUISelect = function(type, w, h) {
	this.initUIElement(type);
	
	this.offset = 0;
	this.options = [];
	this.visibleItems = 5;	
	this.setDefSize(w, h);
	this.isVertical = true;
	this.addEventNames(["onChanged"]);
	this.setTextType(UIElement.TEXT_TEXTAREA);
	this.setCanRectSelectable(false, true);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.images.display = UIElement.IMAGE_DISPLAY_9PATCH;

	return this;
}

UISelect.prototype.getItemSize = function() {
	var s = this.isVertical ? this.h : this.w;

	return Math.round(s/this.visibleItems);
}

UISelect.prototype.getVisibleItems = function() {
	return this.visibleItems;
}

UISelect.prototype.setVisibleItems = function(visibleItems) {
	if(visibleItems <= 3) {
		this.visibleItems = 3;
	}
	else {
		this.visibleItems = 5;
	}
}

UISelect.prototype.scrollTo = function(offsetEnd) {
	var itemSize = this.getItemSize();

	offsetEnd = Math.round(offsetEnd/itemSize) * itemSize;

	var me = this;
	var duration = 500;
	var offsetStart = this.offset;
	var range = offsetEnd - offsetStart;
	var startTime = (new Date()).getTime();
	var interpolator =  new DecelerateInterpolator();

	this.animating = true;
	function animStep() {
		var now = new Date();
		var timePercent = (now.getTime() - startTime)/duration;
		var percent = interpolator.get(timePercent);

		if(timePercent < 1) {
			me.setOffset(Math.floor(offsetStart + percent * range));
			setTimeout(animStep, 10);
		}
		else {
			me.setOffset(offsetStart + range, true);
			delete startTime;
			delete interpolator;
			delete me.animating;
		}

		delete now;
	}

	setTimeout(function() {
		animStep();
	}, 10);

	return;
}

UISelect.prototype.setOffset = function(offset, triggerOnChanged) {
	this.offset = offset;
	this.postRedraw();

	if(triggerOnChanged) {
		var value = this.getValue();
		this.callOnChangedHandler(value);
	}

	return;
}

UISelect.prototype.onPointerDownRunning = function(point, beforeChild) {
	if(beforeChild || this.animating) {
		return;
	}

	if(!this.velocityTracker) {
		this.velocityTracker = new VelocityTracker();
	}
	this.velocityTracker.clear();
	this.saveOffset = this.offset;

	return true;
}

UISelect.prototype.onPointerMoveRunning = function(point, beforeChild) {
	if(beforeChild || this.animating) {
		return;
	}
	
	this.addMovementForVelocityTracker();

	var delta = this.isVertical ? this.getMoveAbsDeltaY() : this.getMoveAbsDeltaX();
	this.setOffset(this.saveOffset + delta);

	return;
}

UISelect.prototype.getMaxOffset = function() {
	var n = Math.floor(0.5 * this.visibleItems);

	return n * this.getItemSize();
}

UISelect.prototype.getMinOffset = function() {
	var itemSize = this.getItemSize();

	var n = Math.round(0.5 * this.visibleItems);

	if(this.options.length <= n) {
		return 0;
	}
	else {
		return -(this.options.length-n)  * itemSize;
	}
}
	
UISelect.prototype.handleClicked = function(point) {
	var itemSize = this.getItemSize();
	var s = this.isVertical ? this.h : this.w;
	var m = Math.floor((s/2 - this.offset)/itemSize);
	var i = Math.floor(((this.isVertical ? point.y : point.x) - this.offset)/itemSize);

	var d = (i - m) * itemSize;
	var offset = this.offset-d;
	var minOffset = this.getMinOffset();
	var maxOffset = this.getMaxOffset();

	if(offset < minOffset) {
		offset = minOffset;
	}

	if(offset > maxOffset) {
		offset = maxOffset;
	}
	
	this.scrollTo(offset);

	return;
}

UISelect.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(beforeChild || this.animating) {
		return;
	}

	var v = this.velocityTracker.getVelocity();
	var velocity = this.isVertical ? v.y : v.x;
	var delta = this.isVertical ? this.getMoveAbsDeltaY() : this.getMoveAbsDeltaX();
	if((Date.now() - this.pointerDownTime) > 400) {
		velocity = 0;
	}

	var distance = delta + velocity/2;

	if(Math.abs(distance) < 10) {
		this.setOffset(this.saveOffset);
		this.handleClicked(point);

		return;
	}

	var minOffset = this.getMinOffset();
	var maxOffset = this.getMaxOffset();
	var offset = this.saveOffset + delta + velocity;

	if(offset < minOffset) {
		offset = minOffset;
	}

	if(offset > maxOffset) {
		offset = maxOffset;
	}

	this.scrollTo(offset);

	return;
}

UISelect.prototype.shapeCanBeChild = function(shape) {
	return false;
}
UISelect.prototype.createOptionsFromText = function(text) {
	if(text) {
		this.options = text.split("\n");
		this.options.remove("");
	}
	else {
		this.options = [];
	}
}


UISelect.prototype.setText =function(text) {
	text = this.toText(text);
    this.createOptionsFromText(text);
	this._text = text;

	return this;
}

/**
 * @method setOptions
 * 设置控件的可选项。
 * @param {Array} options 可选项(字符串数组)。
 * @return {UIElement} 返回控件本身。
 *
 *     @example small frame
 *     var selector = this.win.find("select");
 *     selector.setOptions(["one", "two", "three"]);
 *
 */
UISelect.prototype.setOptions =function(options) {
	this.options = options || [];
	this.text = this.options.join("\n");

	return this;
}

/**
 * @method getOptions
 * 获取可选项。
 * @return {Array} 返回可选项(字符串数组)。
 */
UISelect.prototype.getOptions = function() {
	return this.options;
}


UISelect.prototype.drawText = function(canvas) {
	return;
}

UISelect.prototype.drawImage = function(canvas) {
	var w = this.w;
	var h = this.h;
	var itemSize = this.getItemSize();

	canvas.clipRect(0, 0, w, h);
	this.drawBgImage(canvas);

	var n = this.options.length;
	this.style.setTextB(false);
	var normalFont = this.style.getFont();
	var normalTxtColor = this.style.textColor;
	
	this.style.setTextB(true);
	var highlightFont = this.style.getFont();
	var highlightTextColor = this.style.textColorHighlight;

	canvas.textAlign = "center";
	canvas.textBaseline = "middle";

	var m = 0;
	var o = 0;
	var offset = this.offset;
	var isVertical = this.isVertical;
	var y = isVertical ? 0 : h >> 1;
	var x = isVertical ? w >> 1 : 0;
	var yOffset = isVertical ? offset : 0;
	var xOffset = isVertical ? 0 : offset;

	canvas.translate(xOffset, yOffset);
	if(isVertical) {
		m = Math.floor((0.5 * h - yOffset)/itemSize);
	}
	else {
		m = Math.floor((0.5 * w - xOffset)/itemSize);
	}

	var b = 0;
	var r = 0;
	for(var i = 0; i < n; i++) {
		var text = this.options[i];

		if(isVertical) {
			y = i * itemSize;
			b = y + itemSize;

			o = -offset;
			if(b < o && y < o) {
				continue;
			}

			o = -(offset - h);
			if(b > o && y > o) {
				continue;
			}
			y = y + (itemSize >> 1);
		}
		else {
			x = i * itemSize;
			r = x + itemSize;
			o = -offset;
			if(r < o && x < o) {
				continue;
			}

			o = -(offset - w);
			if(r > o && x > o) {
				continue;
			}
			x = x + (itemSize >> 1);
		}

		if(m == i) {
			canvas.font = highlightFont;
			canvas.fillStyle = highlightTextColor;
		}
		else {
			canvas.font = normalFont;
			canvas.fillStyle = normalTxtColor;
		}

		canvas.fillText(text, x, y, w);
	}

	return;
}

UISelect.prototype.getValue = function() {
	var offset = this.offset;
	var itemSize = this.getItemSize();
	var s = this.isVertical ? this.h : this.w;
	var i = Math.floor((0.5 * s - offset)/itemSize);

	var value = (i < this.options.length) ? this.options[i] : "";

	return value;
}

UISelect.prototype.setValueByIndex = function(index, animate) {
	var i = index;
	var itemSize = this.getItemSize();

	if(i >= 0) {
		var offset = -(i - (this.getVisibleItems()>> 1)) * itemSize;

		if(animate) {
			this.scrollTo(offset);
		}
		else {
			this.setOffset(offset, true);
		}
	}

	return this;
}

UISelect.prototype.setValue = function(value, notify, animate) {
	var i = this.options.indexOf(value.toString());

	this.setValueByIndex(i, animate);
	if(notify) {
		this.callOnChangedHandler(this.getValue());
	}

	return this;
}

Object.defineProperty(UISelect.prototype, "text", {
    set: function(txt) {
        txt = this.toText(txt);
        this.createOptionsFromText(txt);
        this._text = txt;
    },
    get: function() {
        return this._text;
    }
});

function UISelectCreator(w, h) {
	var args = ["ui-select", "ui-select", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISelect();
		return g.initUISelect(this.type, w, h);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UISelectCreator("ui-select", 300, 50));

/*
 * File:   ui-image.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Image
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */


/**
 * @class UIImage
 * @extends UIElement
 * 用来显示一张图片。UIImage可以设置多张图片，但只有一张是当前显示的图片，其它图片是备用图片(目前为15张，可以增加)。可以用setValue把指定的备用图片设置为当前图片。
 *
 * 注意：getValue返回setValue设置的值，如果没有调用过setValue，getValue返回-1。
 *
 * 把第一张备用图片设置为当前图片(可以在UIImage的图片属性页中设置备用图片)：
 *
 *     @example small frame
 *     this.setImage(0);
 *
 * 或者：
 *
 *     @example small frame
 *     this.setValue(0);
 *
 */
function UIImage() {
	return;
}

UIImage.prototype = new UIElement();
UIImage.prototype.isUIImage = true;

UIImage.prototype.saveProps = ["keepSizeWithImage"];
UIImage.prototype.initUIImage = function(type, w, h, bg) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_INPUT);
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;
	this.setImage(UIElement.IMAGE_DEFAULT, bg);
	this.setImage("option_image_0", null);
	this.setImage("option_image_1", null);
	this.setImage("option_image_2", null);
	this.setImage("option_image_3", null);
	this.setImage("option_image_4", null);
	this.setImage("option_image_5", null);
	this.setImage("option_image_6", null);
	this.setImage("option_image_7", null);
	this.setImage("option_image_8", null);
	this.setImage("option_image_9", null);
	this.setImage("option_image_10", null);
	this.setImage("option_image_11", null);
	this.setImage("option_image_12", null);
	this.setImage("option_image_13", null);
	this.setImage("option_image_14", null);
	this.setCanRectSelectable(false, true);
	this.addEventNames(["onUpdateTransform"]);

	this.scaleX = 1;
	this.scaleY = 1;
	this.drawText = null;
	this.beforePaint = null;
	this.afterPaint = null;
	this.highlightConfig = null;

	return this;
}

UIImage.prototype.setValue = function(value) {
	this.v = value;
	return this.setImageSrc(value);
}

UIImage.prototype.getValue = function() {
	return (this.v !== undefined) ? this.v : -1;
}

UIImage.prototype.setImageSrc = function(value) {
	this.setImage(UIElement.IMAGE_DEFAULT, value);

	return this;
}

UIImage.prototype.getImageSrc = function(type) {
	return this.getImageSrcByType(type ? type : UIElement.IMAGE_DEFAULT);
}

UIImage.prototype.getHtmlImage = function(type) {
	return this.getHtmlImageByType(type ? type : UIElement.IMAGE_DEFAULT);
}

UIImage.prototype.getImageSrcRect = function() {
	var image = this.getImageByType(UIElement.IMAGE_DEFAULT);
	if(this.srcRect) {
		return this.srcRect;
	}
	else if(image) {
		return image.getImageRect();
	}
	else {
		return null;
	}
}

UIImage.prototype.setImageSrcRect = function(x, y, w, h) {
	this.srcRect = {};
	this.srcRect.x = x;
	this.srcRect.y = y;
	this.srcRect.w = w;
	this.srcRect.h = h;

	return;
}

UIImage.prototype.fitToImage = function() {
	var srcRect = this.getImageSrcRect();
	if(srcRect && srcRect.w && srcRect.h) {
		this.w = srcRect.rw || srcRect.w;
		this.h = srcRect.rh || srcRect.h;
	}

	return;
}

UIImage.prototype.fixChildSize = function() {
	return;
}

UIImage.prototype.shapeCanBeChild = UIGroup.prototype.shapeCanBeChild;

function UIImageCreator(type) {
	var args = [type, "ui-image", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIImage();
		return g.initUIImage(this.type, 200, 200, null);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIImageCreator("ui-image"));
ShapeFactoryGet().addShapeCreator(new UIImageCreator("ui-icon"));

//for compatible
UIImage.prototype.setBorderStyle = function(borderColor, borderWidth) {
	return;
}

UIImage.prototype.setClickedStyle = function(type, param) {

	return;
}

UIImage.prototype.getBgImage = function() {
	return this.images.default_bg;
}

UIImage.prototype.drawTextTips = function(canvas) {
}

UIImage.prototype.paintSelfFast = function(canvas) {
	var opacity = this.opacity;
	var px = this.w * this.pivotX;
	var py = this.h * this.pivotY;
	
	canvas.save();
	if(opacity !== 1) {
		canvas.globalAlpha *=  opacity;
	}

	canvas.translate(this._left, this._top);
	canvas.translate(px, py);
	canvas.scale(this.scaleX, this.scaleY);
	canvas.rotate(this.rotation);
	canvas.translate(-px, -py);

	this.drawBgImage(canvas);
	canvas.restore();
}

/*
 * File:   ui-label.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Label
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UILabel
 * @extends UIElement
 * 用来显示文字内容。
 *
 */

/**
 * @event onChanged
 * 文本变化时触发本事件。
 * @param {String} value 当前的文本。
 */
function UILabel() {
	return;
}

UILabel.prototype = new UIElement();
UILabel.prototype.isUILabel = true;

UILabel.prototype.saveProps = ["hTextAlign", "vTextAlign", "singleLineMode"];

UILabel.prototype.initUILabel = function(type) {
	this.initUIElement(type);	

	this.setText("");
	this.setDefSize(200, 200);
	this.setMargin(5, 5);
	this.setTextType(Shape.TEXT_TEXTAREA);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.addEventNames(["onChanged", "onUpdateTransform"]);


	return this;
}

/**
 * @method setTextAlign
 * 设置控件上文本水平对齐方式。
 * @param {String} textAlign 水平对齐方式。可选值有"left","center","right"。
 * @return {UIElement} 返回控件本身。
 */
UILabel.prototype.setTextAlign = function(textAlign) {
	this.hTextAlign = textAlign;

	return this;
}

/**
 * @method setTextBaseline
 * 设置控件上文本垂直对齐方式。
 * @param {String} textBaseline 垂直对齐方式。可选值有"top","middle","bottom"。
 * @return {UIElement} 返回控件本身。
 */
UILabel.prototype.setTextBaseline = function(textBaseline) {
	this.vTextAlign = textBaseline;

	return this;
}

/**
 * @method getTextAlign
 * 获取控件上文本水平对齐方式。
 * @return {String} 返回水平对齐方式。
 */
UILabel.prototype.getTextAlign = function() {
	return this.hTextAlign;
}

/**
 * @method getTextBaseline
 * 获取控件上文本垂直对齐方式。
 * @return {String} 返回垂直对齐方式。
 */
UILabel.prototype.getTextBaseline = function() {
	return this.vTextAlign;
}

UILabel.prototype.shapeCanBeChild = function(shape) {
	return shape.isUILabel || shape.isUIImage;
}

UILabel.prototype.setText = function(text) {
	this.text = this.toText(text);
	this.textNeedRelayout = true;
	this.callOnChangedHandler(text);
	this.postRedraw();

	return this;
}

UILabel.prototype.drawText = function(canvas) {
	this.layoutText(canvas);
	
	this.defaultDrawText(canvas);

	return;
}

UILabel.prototype.layoutText = function(canvas) {
	RShape.prototype.layoutText.call(this, canvas);
	
	if(this.singleLineMode && this.lines.length > 1) {
		this.lines.length = 1;
	}

	return this;
}

/**
 * @method setSingleLineMode
 * 设置文本为单行模式。
 * @param {Boolean} value true表示单行模式，false表示多行模式。
 * @return {UIElement} 返回控件本身。
 */
UILabel.prototype.setSingleLineMode = function(value) {
	this.singleLineMode = value;
	this.setTextNeedRelayout(true);

	return this;
}

/**
 * @method getSingleLineMode
 * 设置文本是否为单行模式。
 * @return {Boolean} true表示单行模式，false表示多行模式。
 */
UILabel.prototype.getSingleLineMode = function() {
	return this.singleLineMode;
}

/**
 * @method fitToTextContent
 * 让控件自动适应文本的高度。
 * @return {UIElement} 返回控件本身。
 */
UILabel.prototype.fitToTextContent = function() {
	if(!this.text) {
		this.w = 30;
		this.h = 30;

		return;
	}

	var canvas = this.getCanvasContext2D();
	this.layoutText(canvas);

	var n = this.lines.length;
	var w = this.w;
	var h = this.getTextHeight() + this.vMargin * 2;

	if(n === 1) {
		var str = this.lines[0];
		w = canvas.measureText(str).width + 2 * this.hMargin;
	}

	this.w = w;
	this.h = h;

	return this;
}

function UILabelCreator() {
	var args = ["ui-label", "ui-label", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UILabel();
		return g.initUILabel(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UILabelCreator());

/*
 * File:   ui-tips.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Tips
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UITips() {
	return;
}

UITips.prototype = new UILabel();
UITips.prototype.isUITips = true;

UITips.prototype.saveProps = ["clickable", "triangleSize", "hTextAlign", "vTextAlign"];
UITips.prototype.initUITips = function(type) {
	this.initUILabel(type);	

	this.roundRadius = 8;
	this.triangleSize = 16;
	this.setMargin(20, 20);
	this.setClickable(true);
	this.setDefSize(200, 200);
	this.setSizeLimit(40, 40);
	this.handle = {x:-20, y:-20};

	return this;
}

UITips.prototype.getMoreSelectMark = function(type, point) {
	if(type === Shape.HIT_TEST_HANDLE) {
		point.x = this.handle.x;
		point.y = this.handle.y;

		return true;
	}

	return false;
}

UITips.prototype.getPointer = function() {
	return this.handle;
}

UITips.prototype.moveHandle = function(dx, dy) {
	return this.setPointer(this.handle.x + dx, this.handle.y + dy);
}

UITips.prototype.setPointer = function(x, y) {
	this.handle.x = x;
	this.handle.y = y;

	return this;
}

UITips.prototype.setClickable = function(clickable) {
	this.clickable = clickable;

	return this;
}

UITips.prototype.fitToTextContent = function() {
	UILabel.prototype.fitToTextContent.call(this);
	var r = this.roundRadius;
	var triangleSize = this.triangleSize;

	var minSize = r + r + triangleSize;
	this.w = Math.max(this.w, minSize);
	this.h = Math.max(this.h, minSize);

	return this;
}

UITips.prototype.drawPath = function(canvas) {
	var x = 0;
	var y = 0;
	var r = this.roundRadius;
	var triangleSize = this.triangleSize;
	var px = this.handle.x;
	var py = this.handle.y;
	var hMargin = this.hMargin;
	var vMargin = this.vMargin;
	var minSize = r + r + triangleSize;
	this.w = Math.max(this.w, minSize);
	this.h = Math.max(this.h, minSize);

	var w = this.w;
	var h = this.h;
	var delta =  triangleSize >> 1;
	
	canvas.beginPath();
	function drawToRight() {
		canvas.lineTo(w-r, 0);
		canvas.arc(w-r, r, r, 1.5 * Math.PI, 2*Math.PI, false);
	}
	
	function drawToBottom() {
		canvas.lineTo(w, h-r);	
		canvas.arc(w-r, h-r, r, 0, 0.5*Math.PI, false);
	}

	function drawToLeft() {
		canvas.lineTo(r, h);	
		canvas.arc(r, h-r, r, 0.5*Math.PI, Math.PI, false);
	}

	function drawToTop() {
		canvas.lineTo(0, r);
		canvas.arc(r, r, r, Math.PI, 1.5*Math.PI, false);
	}

	function drawTLArc() {
		canvas.arc(r, r, r, Math.PI, 1.5*Math.PI, false);
	}

	function drawTRArc() {
		canvas.arc(w-r, r, r, 1.5 * Math.PI, 2*Math.PI, false);
	}

	function drawBLArc() {
		canvas.arc(r, h-r, r, 0.5*Math.PI, Math.PI, false);
	}

	function drawBRArc() {
		canvas.arc(w-r, h-r, r, 0, 0.5*Math.PI, false);
	}

	canvas.moveTo(px, py);
	if(px < r) {
		if(py < (r + delta)) {
			canvas.lineTo(r, 0);
			drawToRight();
			drawToBottom();
			drawToLeft();
			canvas.lineTo(0, r);
		}else if(py > (h-r-delta)) {
			canvas.lineTo(0, h-r);
			drawToTop();
			drawToRight();
			drawToBottom();
			canvas.lineTo(r, h);	
		}else {
			canvas.lineTo(0, py-delta);
			drawToTop();
			drawToRight();
			drawToBottom();
			drawToLeft();
			canvas.lineTo(0, py+delta);	
		}
	} else if(px < (w - r)) {
		if(py < r) {
			canvas.lineTo(px+delta, 0);
			drawToRight();
			drawToBottom();
			drawToLeft();
			drawToTop();
			canvas.lineTo(px-delta, 0);
		}
		else {
			canvas.lineTo(px-delta, h);
			drawToLeft();
			drawToTop();
			drawToRight();
			drawToBottom();
			canvas.lineTo(px+delta, h);
		}
	}else{
		if(py < (r + delta)) {
			canvas.lineTo(w, r);
			drawToBottom();
			drawToLeft();
			drawToTop();
			canvas.lineTo(w-r, 0);
		}else if(py > (h-r-delta)) {
			canvas.lineTo(w-r, h);
			drawToLeft();
			drawToTop();
			drawToRight();
			canvas.lineTo(w, h-r);	
		}else {
			canvas.lineTo(w, py+delta);
			drawToBottom();
			drawToLeft();
			drawToTop();
			drawToRight();
			canvas.lineTo(w, py-delta);	
		}
	}
	canvas.closePath();

	return;
}

UITips.prototype.paintSelfOnlyByColor = function(canvas) {
	this.drawPath(canvas);

	if(!this.isFillColorTransparent()) {
		canvas.fillStyle = this.style.fillColor;
		canvas.fill();
	}

	if(!this.isStrokeColorTransparent()) {
		canvas.strokeStyle = this.style.lineColor;
		canvas.lineWidth = (this.pointerDown && this.clickable) ? 4 : 2;
		canvas.stroke();
	}

	return;
}

UITips.prototype.paintSelfOnly =function(canvas) {
	var image = this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);

	if(!image) {
		this.paintSelfOnlyByColor(canvas);
	}

	return;
}

UITips.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIButton || shape.isUIGroup || shape.isUILabel || shape.isUIImage;
}

function UITipsCreator() {
	var args = ["ui-tips", "ui-tips", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UITips();
		return g.initUITips(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UITipsCreator());

/*
 * File:   ui-menu.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Menu
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIMenu
 * @extends UIElement
 * 菜单。菜单缺省时是隐藏的，只在特定情况才显示出来。菜单是一个容器，里面可以放按钮，列表项，文字和图片等控件。
 *
 * 菜单在显示或隐藏时，可以开启或关闭动画，动画可以是缺省的，也可以是自定义的。
 *
 * 对于自定义动画：显示动画名称必须是"show",隐藏动画名称必须是"hide"。
 *
 *     @example small frame
 *     this.win.find("menu").setVisible(true);
 */
function UIMenu() {
	return;
}

UIMenu.FREE_LAYOUT = 0;
UIMenu.ARC_LAYOUT = 1;
UIMenu.VLINEAR_LAYOUT = 2;
UIMenu.HLINEAR_LAYOUT = 3;

UIMenu.prototype = new UIElement();
UIMenu.prototype.isUIMenu = true;

UIMenu.prototype.saveProps = ["autoHideWhenClicked", "childrenAnimation", "enableShowAnimation", "enableHideAnimation", "spacer", "menuItemNr", "animDuration", "layoutType", "originPoint"];
UIMenu.prototype.initUIMenu = function(type) {
	this.initUIElement(type, null);

	this.spacer = 2;
	this.menuItemNr = 2;
	this.animDuration = 600;
	this.setTextType(Shape.TEXT_NONE);
	this.layoutType = UIMenu.FREE_LAYOUT;
	this.originPoint = UIElement.ORIGIN_RIGHT;
	this.setCanRectSelectable(false, false);
	this.enableHideAnimation = true;
	this.enableShowAnimation = true;

	return this;
}

UIMenu.prototype.relayoutChildrenHLL = function() {
	var n = this.children.length;
	var hMargin = this.getHMargin();
	var vMargin = this.getVMargin();

	var x = hMargin;
	var y = vMargin;
	var spacer = this.spacer;
	var w = this.getWidth(true);
	var h = this.getHeight(true);
	var originPoint = this.originPoint;
	
	var nr = Math.max(n, this.menuItemNr);
	var itemW = Math.round((w - spacer * (nr - 1))/nr);
	for(var i = 0; i < n; i++) {
		var iter = this.children[i];
		iter.h = h;
		iter.w = itemW;
		iter.left = x;
		iter.top = y;
		x += itemW + spacer;
		iter.relayoutChildren();
	}

	return this;
}

UIMenu.prototype.relayoutChildrenVLL = function() {
	var n = this.children.length;
	var hMargin = this.getHMargin();
	var vMargin = this.getVMargin();

	var x = hMargin;
	var y = vMargin;
	var spacer = this.spacer;
	var w = this.getWidth(true);
	var h = this.getHeight(true);
	var originPoint = this.originPoint;

	var nr = Math.max(n, this.menuItemNr);
	var itemH = Math.round((h - spacer * (nr - 1))/nr);
	for(var i = 0; i < n; i++) {
		var iter = this.children[i];
		iter.w = w;
		iter.h = itemH;
		iter.left = x;
		iter.top = y;
		y += itemH + spacer;
		iter.relayoutChildren();
	}

	return this;
}

UIMenu.prototype.getChildPositionOfArc = function(originInfo, r, index, n) {
	var p = {};
	var nr = originInfo.angleRange > (Math.PI * 1.9) ? n : n - 1;
	var angle = originInfo.angleStart + (originInfo.angleRange*index)/nr;

	p.x = originInfo.x + r * Math.cos(angle);
	p.y = originInfo.y + r * Math.sin(angle);

	return p;
}

UIMenu.prototype.relayoutChildrenARC = function() {
	var n = this.children.length;
	var originInfo = this.getOrigin();
	var r = originInfo.r;
	var w = this.w;
	var h = this.h;

	for(var i = 0; i < n; i++) {
		var iter = this.children[i];
		var p = this.getChildPositionOfArc(originInfo, r, i, n);
		iter.left = p.x - (iter.w >> 1);
		iter.top = p.y - (iter.h >> 1);
		iter.relayoutChildren();
	}

	return;
}

UIMenu.prototype.relayoutChildren = function() {
	var n = this.children.length;
	if(this.disableRelayout || !n) {
		return;
	}

	switch(this.layoutType) {
		case UIMenu.HLINEAR_LAYOUT: {
			this.relayoutChildrenHLL();
			break;
		}
		case UIMenu.VLINEAR_LAYOUT: {
			this.relayoutChildrenVLL();
			break;
		}
		case UIMenu.ARC_LAYOUT: {
			this.relayoutChildrenARC();
			break;
		}
		default: {
			for(var i = 0; i < n; i++) {
				this.children[i].relayout();
			}
			break;
		}
	}

	return;
}

UIMenu.prototype.prepareShowChildAnimation = function(child, origin) {
	var config = {};

	config.duration = this.animDuration;
	config.interpolator = "d";
	config.xStart = origin.x - (child.w >> 1);
	config.xEnd = child.left;
	config.yStart = origin.y - (child.h >> 1);
	config.yEnd = child.top;
	config.scaleXStart = 0;
	config.scaleXEnd = 1;
	config.scaleYStart = 0;
	config.scaleYEnd = 1;
	config.opacityStart = 0;
	config.opacityEnd = 1;
	config.rotationStart = 0;
	config.rotationEnd = 2 * Math.PI;

	return config;
}

UIMenu.prototype.prepareHideChildAnimation = function(child, origin) {
	var config = {};

	config.duration = this.animDuration;
	config.interpolator = "d";

	config.xStart = child.left;
	config.xEnd = origin.x - (child.w >> 1);
	config.yStart = child.top;
	config.yEnd = origin.y - (child.h >> 1);

	config.opacityStart = 1;
	config.opacityEnd = 0;
	config.scaleXStart = 1;
	config.scaleXEnd = 0;
	config.scaleYStart = 1;
	config.scaleYEnd = 0;
	config.rotationStart = Math.PI * 2;
	config.rotationEnd = 0;

	return config;
}

UIMenu.prototype.animateShowChildren = function() {
	var me = this;
	var n = this.children.length;
	var origin = this.getOrigin();

	this.busy = n;
	this.visible = true;
	for(var i = 0; i < n; i++) {
		var config = null;
		var iter = this.children[i];
		if(iter.animations) {
			config = iter.animations['show'];
		}
		if(!config) {
			config = this.prepareShowChildAnimation(iter, origin);
		}
		else {
			console.log("Use child show animation.");
		}

//		this.busy++;
		iter.animate(config, function() {
			me.busy--;
		});
	}

	return this;
}

UIMenu.prototype.animateHideChild = function(child, config) {
	var me = this;
	var x = child.left;
	var y = child.top;
	var w = child.w;
	var h = child.h;

//	this.busy++;
	child.animate(config, function() {
		child.left = x;
		child.top = y;
		child.w = w;
		child.h = h;
		
		child.opacity = 1;
		child.visible = false;

		me.busy--;
		if(!me.busy) {
			me.visible = false;
		}
	});

	return;
}

UIMenu.prototype.animateHideChildren = function() {
	var me = this;
	var n = this.children.length;
	var origin = this.getOrigin();

	this.busy = n;
	this.visible = true;
	for(var i = 0; i < n; i++) {
		var config = null;
		var iter = this.children[i];
		if(iter.animations) {
			config = iter.animations['hide'];
		}

		if(!config) {
			config = this.prepareHideChildAnimation(iter, origin);
		}
		else {
			console.log("Use child hide animation.");
		}

		this.animateHideChild(iter, config);
	}

	return this;
}

UIMenu.prototype.prepareShowAnimation = function() {
	var config = {};

	config.duration = this.animDuration;
	config.interpolator = "d";

	config.scaleXStart = 0.5;
	config.scaleXEnd = 1;
	config.scaleYStart = 0.5;
	config.scaleYEnd = 1;
	config.opacityStart = 0;
	config.opacityEnd = 1;

	return config;
}

UIMenu.prototype.prepareHideAnimation = function() {
	var config = {};

	config.duration = this.animDuration;
	config.interpolator = "a";
	config.scaleXStart = 1;
	config.scaleXEnd = 0.5;
	config.scaleYStart = 1;
	config.scaleYEnd = 0.5;
	config.opacityStart = 1;
	config.opacityEnd = 0;

	return config;
}

UIMenu.prototype.animateShowSelf = function() {
	var me = this;
	me.busy = true;
	var config = null;
	if(this.animations) {
		config = this.animations["show"];
	}

	if(!config) {
		config = this.prepareShowAnimation();
	}

	this.animate(config, function() {
		me.visible = true;
		me.busy = false;
	});
}

UIMenu.prototype.animateHideSelf = function() {
	var me = this;
	me.busy = true;
	this.visible = true;
	var config = null;
	if(this.animations) {
		config = this.animations["hide"];
	}

	if(!config) {
		config = this.prepareHideAnimation();
	}

	this.animate(config, function() {
		me.visible = false;
		me.busy = false;
	});

	return this;
}

UIMenu.prototype.show = function() {
	if(this.busy) return;
	if(this.autoHideWhenClicked) {
		this.getWindow().grab(this);
	}

	if(!this.enableShowAnimation) {
		this.visible = true;
		return;
	}

	if(this.childrenAnimation) {
		this.animateShowChildren();
	}
	else {
		this.animateShowSelf();
	}
}

UIMenu.prototype.hide = function() {
	if(this.busy) return;
	if(this.autoHideWhenClicked) {
		this.getWindow().ungrab(this);
	}
	
	if(!this.enableHideAnimation) {
		this.visible = false;
		return;
	}

	if(this.childrenAnimation) {
		return this.animateHideChildren();
	}
	else {
		return this.animateHideSelf();
	}
}

UIMenu.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}

	if(this.autoHideWhenClicked) {
		this.hide();
	}

	return;
}

UIMenu.prototype.setVisible = function(visible) {
	if(this.visible === visible || this.busy) {
		return this;
	}

	return visible ? this.show() : this.hide();
}

UIMenu.prototype.getOrigin = function() {
	var w = this.getWidth(true);
	var h = this.getHeight(true);
	var hMargin = this.hMargin;
	var vMargin = this.vMargin;

	var p = {x:hMargin, y:vMargin};

	switch(this.originPoint) {
		case UIElement.ORIGIN_UP: {
			p.x = this.w >> 1;
			p.angleRange = Math.PI;		
			p.angleStart = 0;
			p.r = w >> 1;
			break;
		}
		case UIElement.ORIGIN_DOWN: {
			p.x = this.w >> 1;
			p.y = this.h - vMargin;
			p.angleRange = Math.PI;		
			p.angleStart = Math.PI;
			p.r = w >> 1;
			break;
		}
		case UIElement.ORIGIN_LEFT: {
			p.x = hMargin;
			p.y = this.h >> 1;
			p.angleRange = Math.PI;		
			p.angleStart = - Math.PI * 0.5;
			p.r = h >> 1;
			break;
		}
		case UIElement.ORIGIN_RIGHT: {
			p.x = this.w - hMargin;
			p.y = this.h >> 1;
			p.angleRange = Math.PI;		
			p.angleStart = Math.PI * 0.5;
			p.r = h >> 1;
			break;
		}
		case UIElement.ORIGIN_UP_LEFT: {
			p.angleRange = Math.PI * 0.5;
			p.angleStart = 0;
			p.r = Math.min(w,h);

			break;
		}
		case UIElement.ORIGIN_UP_RIGHT: {
			p.x = this.w - hMargin;
			p.angleStart = 0.5 * Math.PI;
			p.angleRange = Math.PI * 0.5;
			p.r = Math.min(w,h);
			break;
		}
		case UIElement.ORIGIN_DOWN_LEFT: {
			p.x = hMargin;
			p.y = this.h - vMargin;
			p.angleStart = - 0.5 * Math.PI;
			p.angleRange = Math.PI * 0.5;
			p.r = Math.min(w,h);
			break;
		}
		case UIElement.ORIGIN_DOWN_RIGHT: {
			p.x = this.w - hMargin;
			p.y = this.h - vMargin;
			p.angleStart = Math.PI;
			p.angleRange = Math.PI * 0.5;
			p.r = Math.min(w,h);
			break;
		}
		case UIElement.ORIGIN_MIDDLE_CENTER: {
			p.x = this.w >> 1;
			p.y = this.h >> 1;
			p.angleStart = -0.5 * Math.PI;
			p.angleRange = Math.PI * 2;
			p.r = Math.min(w,h) >> 1;
			break;
		}
		default:break;
	}

	return p;
}

UIMenu.prototype.applyTransform = function(canvas) {
	if(this.isInDesignMode()) return;

	var origin = this.getOrigin();

	if(canvas.globalAlpha != this.opacity) {
		canvas.globalAlpha =  this.opacity;
	}

	if(this.offsetX) {
		canvas.translate(this.offsetX, 0);
	}

	if(this.offsetY) {
		canvas.translate(0, this.offsetY);
	}

	var scaleX = this.getScaleX();
	var scaleY = this.getScaleY();
	if(this.rotation || (scaleX && scaleX !== 1) || (scaleY && scaleY !== 1)) {
		var hw = origin.x;
		var hh = origin.y;

		canvas.translate(hw, hh);
		if(scaleX && scaleY) {
			canvas.scale(scaleX, scaleY);
		}
		
		if(this.rotation) {
			canvas.rotate(this.rotation);
		}
		canvas.translate(-hw, -hh);
	}

	return;
}


UIMenu.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIListItem || shape.isUIButton || shape.isUIImage;
}

function UIMenuCreator() {
	var args = ["ui-menu", "ui-menu", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIMenu();
		return g.initUIMenu(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIMenuCreator());

/*
 * File:   ui-page.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  TabPage
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIPage
 * @extends UIElement
 * 标签控件里的一个页面。
 *
 */
function UIPage() {
	return;
}

UIPage.prototype = new UIElement();
UIPage.prototype.isUIPage = true;

UIPage.prototype.initUIPage = function(type, bg) {
	this.initUIElement(type);	

	this.setDefSize(200, 200);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, bg);
	this.widthAttr = UIElement.WIDTH_FILL_PARENT;
	this.heightAttr = UIElement.HEIGHT_FILL_PARENT;

	if(!bg) {
		this.style.setFillColor("Gold");
	}

	return this;
}

UIPage.prototype.show = function() {
	this.setVisible(true);
	this.showHTML();

	return;
}

UIPage.prototype.hide = function() {
	this.setVisible(false);
	this.hideHTML();
	cantkHideAllInput();

	return;
}

UIPage.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUIDevice || shape.isUIScreen || shape.isUIStatusBar 
		|| shape.isUIWindow || shape.isUIPage) {
		return false;
	}

	if(shape.isUIPageIndicator && !this.isUIPageExt) {
		return false;
	}

	return true;
}

UIPage.prototype.paintSelfOnly =function(canvas) {
	var image = this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);

	if(!image && !this.isFillColorTransparent()) {
		canvas.beginPath();
		canvas.fillStyle = this.style.fillColor;
		canvas.fillRect(0, 0, this.w, this.h);
	}

	return;
}

function UIPageCreator(bg) {
	var args = ["ui-page", "ui-page", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPage();

		return g.initUIPage(this.type, bg);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIPageCreator(null));

/*
 * File:   ui-circle-layout.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Circle Layout
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UICircleLayout() {
	return;
}

UICircleLayout.prototype = new UIElement();
UICircleLayout.prototype.isUILayout = true;
UICircleLayout.prototype.isUICircleLayout = true;
UICircleLayout.O_CENTER = "c";
UICircleLayout.O_TOP_LEFT = "tl";
UICircleLayout.O_TOP_MIDDLE = "tm";
UICircleLayout.O_TOP_RIGHT = "tr";
UICircleLayout.O_LEFT_MIDDLE = "lm";
UICircleLayout.O_RIGHT_MIDDLE = "rm";
UICircleLayout.O_BOTTOM_LEFT = "bl";
UICircleLayout.O_BOTTOM_MIDDLE = "bm";
UICircleLayout.O_BOTTOM_RIGHT = "br";

UICircleLayout.prototype.initUICircleLayout = function(type, w, h, img) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, img);
	this.images.display = UIElement.IMAGE_DISPLAY_SCALE;
	this.setCanRectSelectable(false, false);
	this.addEventNames(["onInit"]);
	this.origin =  UICircleLayout.O_CENTER;
	this.setSizeLimit(120, 120, 1000, 1000, 1);

	return this;
}

UICircleLayout.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUIImage || shape.isUIButton) {
		return true;
	}

	return false;
}

UICircleLayout.prototype.paintSelfOnly = function(canvas) {
	if(this.isInDesignMode()) {
		canvas.lineWidth = this.style.lineWidth;

		switch(this.origin) {
			case UICircleLayout.O_CENTER: {
				var ox = this.w >> 1;
				var oy = this.h >> 1;
				var r = (this.w >> 1) - 30;
				var n = this.children.length ? this.children.length : 6;
				var angle = n > 1 ? (2 * Math.PI/(n-1)) : 0;

				canvas.beginPath();
				canvas.fillStyle = this.style.fillColor;
				canvas.strokeStyle = this.style.lineColor;
				canvas.arc(ox, oy, r, 0, Math.PI * 2);
				canvas.stroke();

				var deltaA = -0.5 * Math.PI;
				for(var i = 0; i < n; i++) {
					canvas.beginPath();

					if(i == 0) {
						canvas.arc(ox, oy, 10, 0, Math.PI * 2);
						canvas.stroke();
					}
					else {
						var a = angle * (i - 1) + deltaA;
						var x = ox + r * Math.cos(a);
						var y = oy + r * Math.sin(a);
						canvas.arc(x, y, 10, 0, Math.PI * 2);
						canvas.stroke();
					}
				}
				
				canvas.stroke();
				break;
			}
			default:break;
		}
	}

	return;
}


UICircleLayout.prototype.moveShapeToCenter = function(shape, x, y) {
	x = x - (shape.w >> 1);
	y = y - (shape.h >> 1);

	shape.move(x, y);

	return;
}

UICircleLayout.prototype.relayoutChildren = function() {
	if(this.disableRelayout) {
		return;
	}

	switch(this.origin) {
		case UICircleLayout.O_CENTER: {
			var ox = this.w >> 1;
			var oy = this.h >> 1;
			var r = (this.w >> 1) - 30;
			var n = this.children.length - 1;
			var angle = n > 0 ? (2 * Math.PI/n) : 0;

			var deltaA = -0.5 * Math.PI;
			for(var i = 0; i < this.children.length; i++) {
				var iter = this.children[i];
				if(i == 0) {
					this.moveShapeToCenter(iter, ox, oy);
				}
				else {
					var a = angle * (i - 1) + deltaA;
					var x = ox + r * Math.cos(a);
					var y = oy + r * Math.sin(a);
					this.moveShapeToCenter(iter, x, y);
				}
			}
			break;
		}
		default:break;
	}

	return;
}

UICircleLayout.prototype.afterChildAppended = function(shape) {
	shape.yAttr = UIElement.Y_FIX_TOP;
	shape.xAttr = UIElement.X_FIX_LEFT;
	shape.widthAttr = UIElement.WIDTH_SCALE;
	shape.heightAttr = UIElement.HEIGHT_SCALE;
	shape.setUserMovable(true);
	shape.setUserResizable(true);
	shape.setCanRectSelectable(false, true);
	this.relayoutChildren();

	return true;
}

function UICircleLayoutCreator(w, h, img) {
	var args = ["ui-circle-layout", "ui-circle-layout", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UICircleLayout();

		return g.initUICircleLayout(this.type, w, h, img);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UICircleLayoutCreator(400, 400));

/*
 * File:   ui-grid.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Grid
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIGrid
 * @extends UIElement
 * 网格容器，里面的子控件按行列排列，每个子控件大小相同。
 *
 */
function UIGrid() {
	return;
}

UIGrid.prototype = new UIElement();
UIGrid.prototype.isUIGrid = true;
UIGrid.prototype.isUILayout = true;

UIGrid.prototype.doToJson = function(o) {
	UIElement.prototype.doToJson.call(this, o);

	o.cols = this.cols;
	o.rows = this.rows;
	o.spacer = this.spacer;
	o.scrollDirection = this.scrollDirection;

	return o;
}

UIGrid.prototype.doFromJson = function(js) {
	UIElement.prototype.doFromJson.call(this, js);

	this.cols = js.cols;
	this.rows = js.rows;
	this.spacer = js.spacer;
	this.scrollDirection = js.scrollDirection;

	return js;
}

UIGrid.prototype.initUIGrid = function(type) {
	this.initUIElement(type);	

	this.spacer = 0;
	this.offset = 0;
	this.setMargin(0, 0);
	this.setDefSize(200, 200);

	this.rows = 3;
	this.cols = 3;
	this.checkable = false;
	this.rectSelectable = false;
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.setImage(UIElement.IMAGE_DELETE_ITEM, null);
	this.setImage(UIElement.IMAGE_CHECKED_ITEM, null);
	this.addEventNames(["onChildDragged", "onChildDragging", "onInit"]);

	return this;
}

/**
 * @method setRows
 * 设置行数。
 * @param {Number} value 行数。
 * @return {UIElement} 返回控件本身。
 *
 */
UIGrid.prototype.setRows = function(value) {
	this.rows = value;

	return this;
}

/**
 * @method getRows
 * 获取行数。
 * @return {Number} 返回行数。
 *
 */
UIGrid.prototype.getRows = function() {
	return this.rows;
}

/**
 * @method setCols
 * 设置列数。
 * @param {Number} value 列数。
 * @return {UIElement} 返回控件本身。
 *
 */
UIGrid.prototype.setCols = function(value) {
	this.cols = value;

	return this;
}

/**
 * @method getCols
 * 获取列数。
 * @return {Number} 返回列数。
 *
 */
UIGrid.prototype.getCols = function() {
	return this.cols;
}

/**
 * @method isCheckable
 * 检查是否进入勾选模式。
 * @return {Boolean} 是否进入勾选模式。
 *
 */
UIGrid.prototype.isCheckable = function(value) {
	return this.checkable;
}

/**
 * @method setCheckable
 * 设置是否进入勾选模式。进入勾选模式后可以勾选子控件。
 * (记得在IDE中设置网格的勾选子项的图标)
 * @param {Boolean} value 是否进入勾选模式。
 * @return {UIElement} 返回控件本身。
 *
 */
UIGrid.prototype.setCheckable = function(value) {
	this.checkable = value;

	return this;
}

/**
 * @method setChildChecked
 * 勾选指定的子控件。
 * @param {Number} index 子控件的索引。
 * @param {Boolean} checked 是否勾选。
 * @return {UIElement} 返回控件本身。
 *
 */
UIGrid.prototype.setChildChecked = function(index, checked) {
	if(index >= 0 && index < this.children.length) {
		this.children[index].checked = checked; 
	}

	return this;
}

/**
 * @method isChildChecked
 * 检查指定的子控件是否勾选。
 * @param {Number} index 子控件的索引。
 * @return {Boolean} 返回子控件是否勾选。
 *
 */
UIGrid.prototype.isChildChecked = function(index) {
	if(index < this.children.length) {
		return this.children[index].checked; 
	}

	return false;
}

/**
 * @method getChildByRowCol
 * 通过行列数获取对应的子控件。
 * @param {Number} row 行数。
 * @param {Number} col 列数。
 * @return {UIElement} 返回子控件。
 *
 */
UIGrid.prototype.getChildByRowCol = function(row, col) {
	var cols = this.getCols();
	var index = row * cols + col;

	if(index < this.children.length) {
		return this.children[index];
	}
	else {
		return null;
	}
}

/**
 * @method getChildRow
 * 获取指定子控件所在的行数。
 * @param {UIElement} child 子控件。
 * @return {Number} 返回行数。
 *
 */
UIGrid.prototype.getChildRow = function(child) {
	var cols = this.getCols();
	var index = this.children.indexOf(child);

	return Math.floor(index/cols);
}

/**
 * @method getChildCol
 * 获取指定子控件所在的列数。
 * @param {UIElement} child 子控件。
 * @return {Number} 返回列数。
 *
 */
UIGrid.prototype.getChildCol = function(child) {
	var cols = this.getCols();
	var index = this.children.indexOf(child);

	return index%cols;
}

/**
 * @method exchangeTwoChildren
 * 交换两个子控件的位置。
 * @param {Number} child1Index 子控件1的索引。
 * @param {Number} child2Index 子控件2的索引。
 * @param {Boolean} enableAnimation 是否启用动画。
 * @return {UIElement} 返回控件本身。
 *
 */
UIGrid.prototype.exchangeTwoChildren = function(child1Index, child2Index, enableAnimation) {
	var n = this.children.length;
	if(child1Index < 0 || child1Index >= n || child2Index < 0 || child2Index >= n) {
		return this;
	}

	var child = this.children[child1Index];
	this.children[child1Index] = this.children[child2Index];
	this.children[child2Index] = child;

	this.relayoutChildren(enableAnimation);

	return this;
}

UIGrid.prototype.shapeCanBeChild = UIGroup.prototype.shapeCanBeChild;

UIGrid.prototype.childIsBuiltin = function(child) {
	return child.name === "ui-last";
}

UIGrid.prototype.calcItemSize = function() {
	var w = this.getWidth(true);
	var h = this.getHeight(true);

	var iw = Math.floor(w/this.cols);
	var ih = Math.floor(h/this.rows);

	return {w:iw, h:ih, cols:this.cols, rows:this.rows};
}

UIGrid.prototype.sortChildren = function() {}

UIGrid.prototype.getChildIndexByPoint = function(point) {
	var border = this.getHMargin();
	var itemSize = this.calcItemSize();
	
	var spacer = this.spacer;
	var w = this.getWidth(true);
	var h = this.getHeight(true);
	var itemW = itemSize.w + spacer;
	var itemH = itemSize.h + spacer;
	var cols = Math.floor(w/itemW);
	var rows = Math.floor(h/itemH);

	var r = Math.floor((point.y - border)/itemSize.h);
	var c = Math.floor((point.x - border)/itemSize.w);

	var index = r * cols + c;

	return index;
}

UIGrid.prototype.onChildDragging = function(child, point) {
	var targetChildIndex = this.getChildIndexByPoint(point);
	var sourceChildIndex = this.getIndexOfChild(child);
	
	this.callOnChildDraggingHandler(sourceChildIndex, targetChildIndex);

	return;
}

UIGrid.prototype.onChildDragged = function(child, point) {
	var targetChildIndex = this.getChildIndexByPoint(point);
	var sourceChildIndex = this.getIndexOfChild(child);
	
	this.callOnChildDraggedHandler(sourceChildIndex, targetChildIndex);
	
	this.relayoutChildren("default");

	return;
}

UIGrid.prototype.relayoutChildren = function(animHint) {
	if(this.disableRelayout) {
		return;
	}

	var r = 0;
	var c = 0;
	var x = 0;
	var y = 0;
	var cols = this.cols;
	var rows = this.rows;
	var spacer = this.spacer;
	var w = this.getWidth(true);
	var h = this.getHeight(true);
	var iw = Math.floor((w - (cols-1)*spacer)/cols);
	var ih = Math.floor((h - (rows-1)*spacer)/rows);
	var itemW = iw + spacer;
	var itemH = ih + spacer;

	var vMargin = (this.h - rows * itemH) >> 1;
	var hMargin = (this.w - cols * itemW) >> 1;

	var i = 0;
	var n = this.children.length;
	var children = this.children;
	for(var k = 0; k < n; k++) {
		var child = children[k];
		child.z = k;
		if(child.removed || !child.visible) continue;

		r = Math.floor(i/cols);
		c = Math.floor(i%cols);
	
		x = hMargin + c * itemW;
		y = vMargin + r * itemH;

		child.setSize(iw, ih);
		if(animHint || this.isInDesignMode()) {
			child.animMove(x, y, animHint);
		}
		else {
			child.move(x, y);
		}

		child.xAttr = UIElement.X_FIX_LEFT;
		child.yAttr = UIElement.Y_FIX_TOP;
		child.widthAttr = UIElement.WIDTH_FIX;
		child.heightAttr = UIElement.HEIGHT_FIX;
		child.setUserMovable(true);
		child.setUserResizable(false);
		child.relayoutChildren();
		if(!this.isUIScrollView) {
			child.setDraggable(this.itemDraggable);
		}

		i++;
	}

	return;
}

UIGrid.prototype.afterChildAppended = function(shape) {
	if(this.isInDesignMode() && !this.disableRelayout) {
		this.sortChildren();
	}

	this.moveMustBeLastItemToLast();
	shape.setUserMovable(true);
	shape.setUserResizable(false);
	shape.setCanRectSelectable(false, true);
	shape.setDraggable(this.itemDraggable);

	shape.xAttr = UIElement.X_FIX_LEFT;
	shape.yAttr = UIElement.Y_FIX_TOP;
	shape.widthAttr = UIElement.WIDTH_FIX;
	shape.heightAttr = UIElement.HEIGHT_FIX;

	if(this.isInDesignMode() && !this.disableRelayout) {
		this.relayoutChildren();
	}

	return true;
}

UIGrid.prototype.triggerDeleteMode = function() {
	if(this.isInDesignMode()) {
		return;
	}

	this.deleteMode = !this.deleteMode;

	var grid = this;
	function redrawGrid() {
		grid.postRedraw();

		if(grid.deleteMode) {
			setTimeout(redrawGrid, 20);
		}
	}

	redrawGrid();

	return;
}

UIGrid.prototype.isInDeleteMode = function() {
	return this.deleteMode && !this.isInDesignMode();
}

UIGrid.prototype.beforePaintChild = function(child, canvas) {
	if(this.isInDeleteMode()) {
		canvas.save();
		var cx = child.left + child.w/2;
		var cy = child.top + child.h/2;
		var t = canvas.now/1000;
		var angle = 0.03 * Math.cos(20*t);

		canvas.translate(cx, cy);
		canvas.rotate(angle);
		canvas.translate(-cx, -cy);
	}

	return;
}

UIGrid.prototype.afterPaintChild = function(child, canvas) {
	if(this.isInDeleteMode()) {
		var wImage = this.getImageByType(UIElement.IMAGE_DELETE_ITEM);
		if(WImage.isValid(wImage)) {
			var image = wImage.getImage();
			var srcRect = wImage.getImageRect();
			var y = child.top + child.vMargin;
			var x = child.left + child.w - srcRect.w - child.hMargin;

			canvas.drawImage(image, x, y);
			WImage.draw(canvas, image, WImage.DISPLAY_CENTER, x, y, srcRect.w, srcRect.h, srcRect);
		}

		canvas.restore();

		return;
	}

	if(this.checkable) {
		if(child.checked) {
			var wImage = this.getImageByType(UIElement.IMAGE_CHECKED_ITEM);
			if(WImage.isValid(wImage)) {
				var image = wImage.getImage();
				var srcRect = wImage.getImageRect();
				WImage.draw(canvas, image, WImage.DISPLAY_AUTO_SIZE_DOWN, child.left, child.top, child.w, child.h, srcRect);
			}
		}
	}

	return;
}

function UIGridCreator(border) {
	var args = ["ui-grid", "ui-grid", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIGrid();
		return g.initUIGrid(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIGridCreator());

/*
 * File:   ui-grid-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Grid View(Scrollable)
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIGridView
 * @extends UIGrid
 * UIGridView和UIGrid类似，只是它可以垂直滚动。建议使用UIGridViewX。
 *
 */
function UIGridView() {
	return;
}

UIGridView.prototype = new UIVScrollView();
UIGridView.prototype.isUIGrid = true;
UIGridView.prototype.isUILayout= true;
UIGridView.prototype.isUIGridView = true;
UIGridView.prototype.doToJson = UIGrid.prototype.doToJson;
UIGridView.prototype.doFromJson = UIGrid.prototype.doFromJson;
UIGridView.prototype.sortChildren = UIGrid.prototype.sortChildren;
UIGridView.prototype.initUIGrid = UIGrid.prototype.initUIGrid;
UIGridView.prototype.shapeCanBeChild = UIGrid.prototype.shapeCanBeChild;
UIGridView.prototype.childIsBuiltin = UIGrid.prototype.childIsBuiltin;
UIGridView.prototype.paintSelfOnly = UIGrid.prototype.paintSelfOnly;
UIGridView.prototype.calcItemSize = UIGrid.prototype.calcItemSize;
UIGridView.prototype.relayoutChildren = UIGrid.prototype.relayoutChildren;
UIGridView.prototype.afterChildAppended = UIGrid.prototype.afterChildAppended;
UIGridView.prototype.isInDeleteMode = UIGrid.prototype.isInDeleteMode;
UIGridView.prototype.beforePaintChild = UIGrid.prototype.beforePaintChild;
UIGridView.prototype.afterPaintChild = UIGrid.prototype.afterPaintChild;
UIGridView.prototype.triggerDeleteMode = UIGrid.prototype.triggerDeleteMode;
UIGridView.prototype.setCheckable = UIGrid.prototype.setCheckable;
UIGridView.prototype.setChildChecked = UIGrid.prototype.setChildChecked;
UIGridView.prototype.isChildChecked = UIGrid.prototype.isChildChecked;

UIGridView.prototype.initUIGridView = function(type) {
	this.initUIGrid(type);
	this.initUIVScrollView(type, 0, null, null);	
	this.setImage(UIElement.IMAGE_DELETE_ITEM, null);
	this.setImage(UIElement.IMAGE_CHECKED_ITEM, null);

	return this;
}

UIGridView.prototype.onModeChanged = function() {
	this.offset = 0;

	return;
}

function UIGridViewCreator() {
	var args = ["ui-grid-view", "ui-grid-view", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIGridView();
		return g.initUIGridView(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIGridViewCreator());

/*
 * File:   ui-image.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Use image to present a value, such as sound volume/battery status.
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIImageValue
 * @extends UIElement
 * 用图片来表示数值。调用setValue来切换图片。
 */
function UIImageValue() {
	return;
}

UIImageValue.prototype = new UIImage();
UIImageValue.prototype.isUIImageValue = true;

UIImageValue.prototype.initUIImageValue = function(type, w, h) {
	this.initUIImage(type, w, h, null);	
	this.value = 0;

	return this;
}

UIImageValue.prototype.getImageSrcByValue = function(value) {
	var type = "option_image_" + value; 

	return this.getImageSrcByType(type);
}

UIImageValue.prototype.getValue = function() {
	return this.value;
}

UIImageValue.prototype.setValue = function(value) {
	var src = this.getImageSrcByValue(value);

	if(src) {
		this.value = value;
		this.setImage(UIElement.IMAGE_DEFAULT, src);
	}

	return this.value;
}

UIImageValue.prototype.inc = function() {
	var value = this.value + 1;

	return this.setValue(value);	
}

UIImageValue.prototype.dec = function() {
	var value = this.value - 1;

	return this.setValue(value);	
}

UIImageValue.prototype.getImages = function() {
	var str = "";
	for(var key in this.images) {
		var iter = this.images[key];
		if(key.indexOf("option_image_") >= 0 && iter && iter.src) {
			str += iter.src + "\n";
		}
	}

	return str;
}

UIImageValue.prototype.setImages = function(value) {
	var display = this.images.display;
	this.images = {};
	this.images.display = display;

	if(value) {
		var i = 0;
		var k = 0;
		var arr = value.split("\n");

		for(var i = 0; i < arr.length; i++) {
			var iter = arr[i];
			if(!iter) continue;

			if(iter.indexOf("/") === 0) {
				iter = iter.substr(1);
			}

			var name = "option_image_" + (k++);
			this.setImage(name, iter);
		}

		this.setValue(this.value);
	}
	
	return this;
}

UIImageValue.prototype.shapeCanBeChild = function(shape) {
	return false;
}


function UIImageValueCreator(w, h, defaultImage) {
	var args = ["ui-image-value", "ui-image-value", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIImageValue();
		return g.initUIImageValue(this.type, w, h, defaultImage);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIImageValueCreator(200, 200, null));
/*
 * File:   ui-image-thumb-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Thumb Image View 
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIImageThumbView() {
	return;
}

UIImageThumbView.prototype = new UIImageView();
UIImageThumbView.prototype.isUIImageThumbView = true;

UIImageThumbView.prototype.saveProps = ["keepRatio", "itemSize"];
UIImageThumbView.prototype.initUIImageThumbView = function(w, h) {
	this.userImages = [];
	this.imageProxies = [];

	this.itemSize = 0;
	this.setDefSize(w, h);
	this.initUIImageView(w, h);

	this.setItemSize = UIImageThumbView.prototype.setItemSize;
	this.getCacheCanvas        = UIImageThumbView.prototype.getCacheCanvas;
	this.getCacheCanvasContext = UIImageThumbView.prototype.getCacheCanvasContext;
	this.setValue              = UIImageThumbView.prototype.setValue;
	this.getCurrentImage       = UIImageThumbView.prototype.getCurrentImage;
	this.getCurrentImageSrc    = UIImageThumbView.prototype.getCurrentImageSrc;

	imageThumbViewInitCustomProp(this);
	this.errorImage = UIImageView.createImage("drawapp8/images/common/failed.png", null);
	this.loadingImage = UIImageView.createImage("drawapp8/images/common/loading.png", null);
	this.addEventNames(["onChanged"]);

	return this;
}

UIImageThumbView.prototype.setItemSize = function(itemSize) {
	this.itemSize = itemSize ? itemSize : 100;

	if(itemSize) {
		this.setSizeLimit(100, itemSize + 10, 2000, 2000);
	}

	return;
}

UIImageThumbView.prototype.setKeepRatio = function(keepRatio) {
	if(this.keepRatio != keepRatio) {
		this.cacheInvalid = true;
	}

	this.keepRatio = keepRatio;

	return;
}

UIImageThumbView.prototype.getCacheCanvasContext = function(w, h) {
	if(!this.cacheImagesCanvas) {
		canvas = document.createElement("canvas");
		canvas.width = w;
		canvas.height = h;

		this.cacheImagesCanvas = canvas;
	}

	if(canvas.width != w) {
		canvas.width = w;
	}

	if(canvas.height != h) {
		canvas.height = h;
	}

	var ctx = canvas.getContext("2d");

	ctx.clearRect(0, 0, w, h);

	return ctx;
}

UIImageThumbView.prototype.getCurrentImageSrc = function() {
	return this.currentImageProxy ? this.currentImageProxy.src : null;
}

UIImageThumbView.prototype.getCurrentImage = function() {
	return this.currentImageProxy ? this.currentImageProxy.image : null;
}

UIImageThumbView.prototype.setValue = function(src) {
	for(var i = 0; i < this.imageProxies.length; i++) {
		var iter = this.imageProxies[i];
		if(iter.src.indexOf(src) >= 0 || src.indexOf(iter.src) >= 0) {
			this.currentImageProxy = iter;
			return this;
		}
	}

	return this;
}

UIImageThumbView.createImageProxy = function(thumbview, src, loadingImage, errorImage, ctxToDraw, x, y, w, h) {
	var imageProxy = {};

	imageProxy.x = x;
	imageProxy.y = y;
	imageProxy.w = w;
	imageProxy.h = h;
	imageProxy.src = src;
	imageProxy.imageState = UIImageView.IMAGE_STATE_PENDING;

	function onLoadDone(image, result) {
		var keepRatio = thumbview.keepRatio;

		if(result) {
			imageProxy.imageState = UIImageView.IMAGE_STATE_DONE;
			UIImageView.drawImageAtCenter(ctxToDraw, image, imageProxy.x, imageProxy.y, imageProxy.w, imageProxy.h, keepRatio);
		}
		else {
			imageProxy.imageState = UIImageView.IMAGE_STATE_ERROR;
			UIImageView.drawImageAtCenter(ctxToDraw, errorImage, imageProxy.x, imageProxy.y, imageProxy.w, imageProxy.h, keepRatio);
		}

		console.log("onLoadDone: " + image.src);
		thumbview.postRedraw();	
	}

	imageProxy.image = UIImageView.createImage(src, onLoadDone);

	if(imageProxy.imageState === UIImageView.IMAGE_STATE_PENDING) {
		var keepRatio = thumbview.keepRatio;	
		UIImageView.drawImageAtCenter(ctxToDraw, loadingImage, imageProxy.x, imageProxy.y, imageProxy.w, imageProxy.h, keepRatio);
	}

	return imageProxy;
}

UIImageThumbView.prototype.createCacheCanvas = function() {
	
}

UIImageThumbView.prototype.getCacheCanvas = function() {
	if(this.cacheInvalid || !this.cacheImagesCanvas) {
		this.createCacheCanvas();
	}

	return this.cacheImagesCanvas;
}

/////////////////////////////////////////////////////////////////////////}-{

function UIImageThumbViewTape() {
	return;
}

UIImageThumbViewTape.prototype = new UIHScrollView();

UIImageThumbViewTape.prototype.isUIImageView = true;
UIImageThumbViewTape.prototype.isUIImageThumbView = true;
UIImageThumbViewTape.prototype.isUIImageThumbViewTape = true;

UIImageThumbViewTape.prototype.initUIImageView = UIImageView.prototype.initUIImageView;
UIImageThumbViewTape.prototype.initUIImageThumbView = UIImageThumbView.prototype.initUIImageThumbView;

UIImageThumbViewTape.prototype.onPointerUpRunning = UIScrollView.prototype.onPointerUpRunning;

UIImageThumbViewTape.prototype.initUIImageThumbViewTape = function(type, w, h) {
	this.initUIHScrollView(type, 10, null);	
	this.initUIImageThumbView (w, h);

	this.heightAttr = UIElement.HEIGHT_FIX;

	return this;
}

UIImageThumbViewTape.prototype.getSpaceBetweenImages = function() {
	return this.spaceBetweenImages ? this.spaceBetweenImages : 2;
}

UIImageThumbViewTape.prototype.createCacheCanvas = function() {
	var space = this.getSpaceBetweenImages();
	var w = this.w;
	var h = this.h;
	var size = (this.itemSize > 0 && this.itemSize < h) ? this.itemSize : h;

	var canvas = this.cacheImagesCanvas;
	var n = this.userImages.length;
	
	delete this.cacheInvalid;
	this.imageProxies.clear();
	this.currentImageProxy = null;

	if(!n) {
		return;
	}

	w = n * (size + space);

	var x = 0; 
	var y = Math.floor((h - size)/2);
	var errorImage = this.errorImage;
	var loadingImage = this.loadingImage;
	var ctx = this.getCacheCanvasContext(w, h);

	for(var i = 0; i < this.userImages.length; i++) {
		var src = this.userImages[i];
		
		var imageProxy = UIImageThumbView.createImageProxy(this, src, loadingImage, errorImage, ctx, x, y, size, size);
		this.imageProxies.push(imageProxy);
		
		x = x + size + space;
	}

	return;
}

UIImageThumbViewTape.prototype.getScrollRange = function() {
	var size = this.h;
	var space = this.getSpaceBetweenImages();
	var range = this.userImages.length * (size + space) + space;

	return range;
}

UIImageThumbViewTape.prototype.paintChildren = function(canvas) {
	return;
}

UIImageThumbViewTape.prototype.getCacheCanvasOffset = function() {
	var offset = Math.max(0, (this.w - this.cacheImagesCanvas.width)/2);

	return offset;
}

UIImageThumbViewTape.prototype.onClick = function(point, beforeChild) {
	if(!this.imageProxies || !this.imageProxies.length || beforeChild) {
		return;
	}

	this.currentImageProxy = null;
	var x = point.x - this.getCacheCanvasOffset();

	for(var i = 0; i < this.imageProxies.length; i++) {
		var iter = this.imageProxies[i];
		if(x >= iter.x && x < (iter.x + iter.w)) {
			this.currentImageProxy = iter;	
		}
	}
	
	this.callOnClickHandler(point);
	this.callOnChangedHandler(this.getCurrentImageSrc());

	return;
}

UIImageThumbViewTape.prototype.paintSelfOnly = function(canvas) {
	if(!this.userImages || !this.userImages.length || !this.getCacheCanvas()) {
		canvas.rect(0, 0, this.w, this.h);
		canvas.stroke();

		return;
	}

	var w = 0;
	var y = 0;
	var h = this.h;
	var selfW = this.w;
	var cacheCanvas = this.getCacheCanvas();
	var cacheCanvasOffset = this.getCacheCanvasOffset();
	var x = cacheCanvasOffset;

	canvas.rect(0, 0, this.w, this.h);
	canvas.clip();
	canvas.beginPath();

	if(this.offset >= 0) {
		if(x > this.offset) {
			x = x-this.offset;
			var w = cacheCanvas.width;
			canvas.drawImage(this.cacheImagesCanvas, 0, 0, w, h, x, y, w, h);
			cacheCanvasOffset = x;
		}
		else {
			var offset = this.offset - x; 
			var w = Math.min(selfW, cacheCanvas.width-offset);
			canvas.drawImage(this.cacheImagesCanvas, offset, 0, w, h, 0, y, w, h);
			cacheCanvasOffset = -offset;
		}
	}
	else {
		x = x-this.offset;
		var w = Math.min(selfW+this.offset, cacheCanvas.width);
		canvas.drawImage(this.cacheImagesCanvas, 0, 0, w, h, x, y, w, h);
		cacheCanvasOffset = x;
	}

	if(this.currentImageProxy) {
		x = cacheCanvasOffset + this.currentImageProxy.x;
		y = this.currentImageProxy.y;

		canvas.lineWidth = 3;
		canvas.rect(x, y, this.currentImageProxy.w, this.currentImageProxy.h);
		canvas.stroke();
	}

	return;
}

function UIImageThumbViewTapeCreator() {
	var args = ["ui-image-thumb-view-tape", "ui-image-thumb-view-tape", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIImageThumbViewTape();

		return g.initUIImageThumbViewTape(this.type, 300, 100);
	}
	
	return;
}

/////////////////////////////////////////////////////////////////////////}-{

function UIImageThumbViewGrid() {
	return;
}

UIImageThumbViewGrid.prototype = new UIHScrollView();

UIImageThumbViewGrid.prototype.isUIImageView = true;
UIImageThumbViewGrid.prototype.isUIImageThumbView = true;
UIImageThumbViewGrid.prototype.isUIImageThumbViewGrid = true;

UIImageThumbViewGrid.prototype.initUIImageView = UIImageView.prototype.initUIImageView;
UIImageThumbViewGrid.prototype.initUIImageThumbView = UIImageThumbView.prototype.initUIImageThumbView;

UIImageThumbViewGrid.prototype.onPointerUpRunning = UIScrollView.prototype.onPointerUpRunning;

UIImageThumbViewGrid.prototype.initUIImageThumbViewGrid = function(type, w, h) {
	this.initUIHScrollView(type, 10, null);	
	this.initUIImageThumbView (w, h);
	this.setSizeLimit(100, 40, 2000, 2000);

	this.rows = 4;
	this.cols = 3;
	this.pageNr = 1;
	this.itemSize = 100;

	return this;
}

UIImageThumbViewGrid.prototype.calcSize = function() {
	if(!this.userImages) {
		return;
	}

	if(this.isIcon) {
		this.cols = 3;
		this.rows = 4;
		this.pageNr = 1;

		return;
	}

	var n = this.userImages.length;
	var deviceConfig = this.getDeviceConfig();
	var density = deviceConfig ? deviceConfig.lcdDensity : "hdpi";
	var densityScale = this.getDensitySizeByName(density)/160;
	var w = this.w/densityScale;
	var h = this.h/densityScale;

	var cols = Math.round(w/this.itemSize);
	var rows = Math.round(h/this.itemSize);

	this.cols = cols;
	this.rows = rows;
	this.pageNr = Math.ceil(n/(rows*cols));

	return;
}

UIImageThumbViewGrid.prototype.getSpaceBetweenImages = function() {
	return this.spaceBetweenImages ? this.spaceBetweenImages : 2;
}

UIImageThumbViewGrid.prototype.createCacheCanvas = function() {
	var n = this.userImages.length;
	var space = this.getSpaceBetweenImages();

	delete this.cacheInvalid;
	this.imageProxies.clear();
	this.currentImageProxy = null;

	this.calcSize();

	if(!n) {
		return;
	}

	var x = 0;
	var y = 0;
	var k = 0;
	var h = this.h;
	var w = this.pageNr * this.w;
	var ctx = this.getCacheCanvasContext(w, h);
	var itemW = Math.floor((this.w-space)/this.cols) - space;
	var itemH = Math.floor((this.h-space)/this.rows) - space;

	var errorImage = this.errorImage;
	var loadingImage = this.loadingImage;

	for(var i = 0; i < this.pageNr; i++) {
		y = space;
		for(var r = 0; r < this.rows; r++) {
			x = i * this.w + space;
			for(var c = 0; c < this.cols; c++, k++) {
				if(k >= n) {
					break;
				}

				var src = this.userImages[k];
				var imageProxy = UIImageThumbView.createImageProxy(this, src, loadingImage, errorImage, ctx, x, y, itemW, itemH);

				this.imageProxies.push(imageProxy);

				x = x + itemW + space;
			}
			y = y + itemH + space;
		}
	}

	return;
}

UIImageThumbViewGrid.prototype.getScrollRange = function() {
	var range = this.pageNr * this.w;

	return range;
}

UIImageThumbViewGrid.prototype.paintChildren = function(canvas) {
	return;
}

UIImageThumbViewGrid.prototype.getCacheCanvasOffset = function() {
	return this.getSpaceBetweenImages();
}

UIImageThumbViewGrid.prototype.onClick = function(point, beforeChild) {
	if(!this.imageProxies || !this.imageProxies.length || beforeChild) {
		return;
	}

	var x = point.x;
	var y = point.y;
	var n = this.imageProxies.length;

	var page = Math.floor(x/this.w);
	var row = Math.floor(y*this.rows/this.h) ;
	var col = Math.floor((x%this.w) * this.cols/this.w);
	var i = page * this.rows * this.cols + row * this.cols + col;

	if(i < n) {
		this.currentImageProxy = this.imageProxies[i];
	}

	this.callOnClickHandler(point);
	this.callOnChangedHandler(this.getCurrentImageSrc());

	return this.callOnClickHandler(point);
}

UIImageThumbViewGrid.prototype.paintSelfOnly = function(canvas) {
	var space = this.getSpaceBetweenImages();
	if(!this.userImages || !this.userImages.length || !this.getCacheCanvas()) {
		canvas.rect(0, 0, this.w, this.h);
		canvas.stroke();

		return;
	}

	var w = 0;
	var selfW = this.w;
	var offset = this.offset;
	var cacheCanvas = this.getCacheCanvas();

	var h = cacheCanvas.height;
	var canvasWidth = cacheCanvas.width;

	if(offset >= 0) {
		var w = Math.min(selfW, canvasWidth-offset);
		canvas.drawImage(this.cacheImagesCanvas, offset, 0, w, h, 0, 0, w, h);
	}
	else {
		var w = Math.min(canvasWidth+offset, selfW);
		canvas.drawImage(this.cacheImagesCanvas, 0, 0, w, h, -offset, 0, w, h);
	}

	if(this.currentImageProxy) {
		y = this.currentImageProxy.y;
		x = this.currentImageProxy.x - offset;

		canvas.rect(x, y, this.currentImageProxy.w, this.currentImageProxy.h);
		canvas.lineWidth = 3;
		canvas.strokeStyle = this.style.lineColor;
		canvas.stroke();

	}

	return;
}

UIImageThumbViewGrid.prototype.saveProps = UIImageThumbView.prototype.saveProps;
UIImageThumbViewTape.prototype.saveProps = UIImageThumbView.prototype.saveProps;

function UIImageThumbViewGridCreator() {
	var args = ["ui-image-thumb-view-grid", "ui-image-thumb-view-grid", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIImageThumbViewGrid();

		return g.initUIImageThumbViewGrid(this.type, 300, 100);
	}
	
	return;
}
	
ShapeFactoryGet().addShapeCreator(new UIImageThumbViewTapeCreator());
ShapeFactoryGet().addShapeCreator(new UIImageThumbViewGridCreator());

/*
 * File:   ui-layout.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Layout
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2015  Holaverse Inc.
 * 
 */

function UILayout() {
	return;
}

UILayout.prototype = new UIElement();
UILayout.prototype.isUILayout = true;

UILayout.prototype.initUILayout = function(type, w, h) {
	this.initUIElement(type);	

	this.spacer = 10;
	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setCanRectSelectable(false, false);
	this.vLayout = (this.type === "ui-v-layout");
	this.addEventNames(["onInit"]);

	return this;
}

UILayout.prototype.relayoutChildren = function() {
	if(this.disableRelayout) {
		return;
	}

	var w = this.w;
	var h = this.h;
	var x = this.hMargin;
	var y = this.vMargin;
	var vLayout = this.vLayout;
	var spacer = this.spacer ? this.spacer : 0;

	var n = this.children.length;
	var children = this.children;
	for(var i = 0; i < n; i++) {
		var iter = children[i];

		if(!iter.isVisible()) {
			continue;
		}

		if(vLayout) {
			iter.top = y;
			iter.left = (w - iter.w) >> 1;

			if(iter.heightAttr === UIElement.HEIGHT_SCALE) {
				iter.h = iter.heightParam * h; 
			}
			y += iter.h + spacer;
		}
		else {
			iter.left = x;
			iter.top = (h - iter.h) >> 1;
			if(iter.widthAttr === UIElement.WIDTH_SCALE) {
				iter.w = iter.widthParam * w;
			}

			x += iter.w + spacer;
		}
		
		iter.relayoutChildren();
	}
	
	return;
}

function UILayoutCreator(type) {
	var args = [type, type, null, true];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UILayout();

		return g.initUILayout(this.type, 100, 100);
	}
	
	return;
}

UILayout.prototype.shapeCanBeChild = UIGroup.prototype.shapeCanBeChild;

ShapeFactoryGet().addShapeCreator(new UILayoutCreator("ui-v-layout"));
ShapeFactoryGet().addShapeCreator(new UILayoutCreator("ui-h-layout"));

/*
 * File:   ui-frames.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Frames
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIFrames
 * @extends UIElement
 * 用来管理多个子控件，但是只有一个显示出来。
 *
 */
function UIFrames() {
	return;
}

UIFrames.prototype = new UIElement();
UIFrames.prototype.isUIFrames = true;
UIFrames.prototype.saveProps = ["current"];

UIFrames.prototype.initUIFrames = function(type) {
	this.initUIElement(type);	

	this.current = 0;
	this.setDefSize(200, 200);
	this.setTextType(Shape.TEXT_NONE);
	this.widthAttr = UIElement.WIDTH_FILL_PARENT;
	this.addEventNames(["onChanged"]);

	return this;
}

UIFrames.preparseBackendCanvas = function(leftWin, RightWin) {
	var w = leftWin.w;
	var h = leftWin.h;
	var backendCanvas = Animation.getBackendCanvas(2 * w, h);
	var context = backendCanvas.getContext("2d");
	context.now = Date.now();
	context.timeStep = 0;
	context.clearRect(0, 0, 2*w, h);
	context.save();
	leftWin.paint(context);
	context.translate(w, 0);
	RightWin.paint(context);
	context.restore();

	return backendCanvas;
}

UIFrames.prototype.getStatusString = function() {
	var str = "";
	var current = this.current + 1;
	var n = this.children.length;
	var frame = this.getCurrentFrame();

	current = current <= n ? current : n;
	if(frame && frame.name) {
		str = frame.name + "(" + current + "/" + n + ")";
	}
	else {
		str = current + "/" + n;
	}

	return str;
}

/**
 * @method getCurrent
 * 获取当前显示的子控件的索引。
 * @return {Number} 当前显示的子控件的索引。
 *
 */
UIFrames.prototype.getCurrent = function() {
	return this.current;
}


/**
 * @method setCurrent
 * 设置当前显示的子控件。
 * @param {Number} current 当前显示的子控件的索引。
 * @return {UIElement} 返回控件本身。
 *
 */
UIFrames.prototype.setCurrent = function(current) {
	if(this.current !== current) {
		this.current = current;
		
		if(!this.isInDesignMode()) {
			this.callOnChangedHandler(current);
		}
	}

	return this;
}

UIFrames.prototype.getCurrentFrame = function() {
	if(this.children.length < 1) {
		return null;
	}

	if(this.current < 0 || !this.current) {
		this.current = 0;
	}

	if(this.current >= this.children.length) {
		this.current = this.children.length - 1;
	}

	return this.children[this.current];
}

UIFrames.prototype.fixChildSize = function(child) {
	return;
}

UIFrames.prototype.fixChildPosition = function(child) {
	var x = child.left;
	var y = child.top;
	var h = child.h;
	var w = child.w;

	if(child.freePosition) {
		return;
	}
	
	if(child.widthAttr === UIElement.WIDTH_FILL_PARENT) {
		x = this.getHMargin();
		w = this.getWidth(true);
	}

	if(child.heightAttr === UIElement.HEIGHT_FILL_PARENT) {
		y = this.getVMargin();
		h = this.getHeight(true);
	}
	
	child.left = x;
	child.top = y;
	child.h = h;
	child.w = w;

	return;
}

UIFrames.prototype.setTarget = function(shape) {
	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		if(!shape) {
			child.setSelected(false);
			continue;
		}

		if(child != shape && child != shape.popupWindow) {
			child.setSelected(false);
		}
	}

	this.targetShape = shape;
	this.selected = !shape;

	return;
}
UIFrames.prototype.dispatchPointerDownToChildren = function(p) {
	var child = null;

	if(this.children.length < 1) {
		return false;
	}

	child = this.getCurrentFrame();

	if(child.onPointerDown(p)) {
		this.setTarget(child);

		return true;
	}

	return false;
}

UIFrames.prototype.addShapeIntoChildren = function(shape, p) {
	var child = null;

	if(this.children.length < 1) {
		return false;
	}

	child = this.getCurrentFrame();

	return child.addShape(shape, true, p);
}

UIFrames.prototype.paintChildren = function(canvas) {
	var child = this.getCurrentFrame();
	
	if(child) {
		canvas.save();
		canvas.beginPath();
		child.paintSelf(canvas);
		canvas.restore();
	}
	
	return;
}

UIFrames.prototype.showNextFrame = function() {
	this.showFrame(this.current+1);
	this.relayoutChildren();

	return;
}

UIFrames.prototype.getFrame = function(index) {
	if(index < 0 || index >= this.children.length) {
		return null;
	}

	return this.children[index];
}

UIFrames.prototype.getFrameIndex = function(frame) {
	return this.getIndexOfChild(frame);
}

UIFrames.prototype.getFrames = function() {
	return this.children.length;
}

UIFrames.prototype.showPrevFrame = function() {
	this.showFrame(this.current-1);
	this.relayoutChildren();

	return;
}

UIFrames.prototype.showFrame = function(index) {
	var current = (index + this.children.length)%this.children.length;
	this.setCurrent(current);
	
	var currentFrame = this.children[this.current];
	if(currentFrame) {
		currentFrame.show(true);
	}

	return;
}

UIFrames.prototype.shapeCanBeChild = function(shape) {
	return true;
}

UIFrames.prototype.relayoutChildren = function() {

	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];

		iter.left = 0;
		iter.top = 0;
		iter.w = this.w;
		iter.h = this.h;
		iter.widthAttr = UIElement.WIDTH_FILL_PARENT;
		iter.heightAttr = UIElement.HEIGHT_FILL_PARENT;
		iter.relayoutChildren();
	}

	return;
}

UIFrames.prototype.afterChildAppended = function(shape) {
	this.current = this.children.length - 1;

	return;
}

UIFrames.prototype.onChildRemoved = function(shape) {
	return;
}

UIFrames.prototype.afterChildRemoved = function(shape) {
	if(this.children.length === 0) {
		this.current = 0;
	}
	else if(this.current >= this.children.length) {
		this.current--;
	}

	this.onChildRemoved(shape);

	return;
}

UIFrames.prototype.findChildByPoint = function(point, recursive) {
	var p = point;
	var curFrame = this.getCurrentFrame();

	if(curFrame) {
		var ret = curFrame.findChildByPoint(p, recursive);	
	    if(ret === curFrame && !curFrame.hitTest(p)) {
            return this;
        }
        return ret;
    }

	return this;
}


function UIFramesCreator() {
	var args = ["ui-frames", "ui-frames", null, 0];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIFrames();

		return g.initUIFrames(this.type);
	}
	
	return;
}
/*
 * File:   ui-check-box.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Check Box
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UICheckBox
 * @extends UIElement
 * 多选按钮。可以用setValue来勾选/去勾选，用getValue来判断是否勾选。
 *
 */

/**
 * @event onChanged
 * 勾选状态变化时触发本事件。
 * @param {Boolean} value true表示勾选，false表示未勾选。
 */
function UICheckBox() {
	return;
}

UICheckBox.prototype = new UIElement();
UICheckBox.prototype.isUICheckBox = true;

UICheckBox.prototype.initUICheckBox = function(type) {
	this.initUIElement(type);	

	this.setDefSize(100, 100);
	this.setTextType(Shape.TEXT_INPUT);
	this.images.display = UIElement.IMAGE_DISPLAY_SCALE;

	this.setImage(UIElement.IMAGE_CHECKED_FG, null);
	this.setImage(UIElement.IMAGE_UNCHECK_FG, null);

	this.addEventNames(["onChanged", "onUpdateTransform"]);
	this.value = false;

	return this;
}

UICheckBox.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIImage || shape.isUILabel;
}

UICheckBox.prototype.getValue = function() {
	return this.value;
}

UICheckBox.prototype.setValue = function(value, notify) {
	if(this.value != value) {
		this.value = value;
		if(notify) {
			this.callOnChangedHandler(this.value);
		}
	}

	return this;
}

UICheckBox.prototype.getBgImage = function() {
	return this.getImageByType(this.getValue() ? UIElement.IMAGE_CHECKED_FG : UIElement.IMAGE_UNCHECK_FG);
}

UICheckBox.prototype.getTextColor = function(canvas) {
	return this.getValue() ? this.style.textColorOn : this.style.textColor;
}

UICheckBox.prototype.onClick = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}
	
	this.setValue(!this.getValue(), true);
	this.callOnClickHandler(point);

	return;
}

function UICheckBoxCreator() {
	var args = ["ui-checkbox", "ui-checkbox", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UICheckBox();
		return g.initUICheckBox(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UICheckBoxCreator());

/*
 * File:   ui-switch.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Switch
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UISwitch() {
	return;
}

UISwitch.prototype = new UICheckBox();
UISwitch.prototype.isUISwitch = true;

UISwitch.prototype.initUISwitch = function(type, w, h, maskWidth, img) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;
	this.setImage(UIElement.IMAGE_DEFAULT, img);
	
	this.value = true;
	this.imageWidth = 412;
	this.maskWidth = maskWidth;
	this.offsetImage = maskWidth;
	this.addEventNames(["onChanged"]);
	this.interpolator =  new DecelerateInterpolator(2);

	return this;
}

UISwitch.prototype.updateImageSize = function(imageWidth) {
	this.imageWidth = imageWidth;
	this.maskWidth = Math.floor(imageWidth * 0.373786);

	if(!this.animating) {
		this.offsetImage = this.value ? this.maskWidth : (this.imageWidth - this.maskWidth);
	}

	return;
}

UISwitch.prototype.animateChange = function() {
	var switcher = this;
	var date  = new Date();
	var startTime = date.getTime();
	var startOffset = this.offsetImage;
	var endOffset = this.value ? this.maskWidth : (this.imageWidth - this.maskWidth);
	var range = endOffset - startOffset;
	this.animating = true;
	var duration = 500;
	function offsetIt() {
		var now = new Date();
		var nowTime = now.getTime();
		var timePercent = (nowTime - startTime)/duration;
		var percent = switcher.interpolator.get(timePercent);
		var offset = startOffset + range * percent;	

		if(timePercent < 1) {
			switcher.offsetImage = offset;
			setTimeout(offsetIt, 10);
		}
		else {
			switcher.offsetImage = endOffset;
			delete this.animating;
		}
		switcher.postRedraw();
		delete now;

		return;
	}
	
	setTimeout(offsetIt, 30);

	return;
}

UISwitch.prototype.onClick = function(point, beforeChild) {
	if(beforeChild || !this.isInDesignMode()) {
		return;
	}
	this.setValue(!this.value);

	return;
}

UISwitch.prototype.onPointerDownRunning = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}

	this.pointerDownPosition = point;

	return;
}

UISwitch.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}
	
	var dx = point.x - this.pointerDownPosition.x;
	if(Math.abs(dx) < 5) {
		this.setValue(!this.value);
	}
	else {
		this.setValue(dx > 0);
	}

	return;
}

UISwitch.prototype.setValue = function(value) {
	if(this.value != value) {
		this.value = value;
		this.callOnChangedHandler(this.value);
		this.animateChange();
	}

	return this;
}

UISwitch.prototype.drawBgImage =function(canvas) {
	return;
}

UISwitch.prototype.drawFgImage =function(canvas) {
	var image = this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);

	if(image) {
		this.updateImageSize(image.width);
		var h = image.height;
		var w = this.maskWidth;
		var dx = (this.w - w)/2;
		var dy = (this.h - h)/2;

		this.imageWidth = image.width;
		canvas.drawImage(image, this.offsetImage, 0, w, h, dx, dy, w, h);

		/*draw mask Image*/
		canvas.drawImage(image, 0, 0, w, h, dx, dy, w, h);
	}

	return;
}

function UISwitchCreator(w, h, maskWidth, img) {
	var args = ["ui-switch", "ui-switch", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISwitch();
		return g.initUISwitch(this.type, w, h, maskWidth, img);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UISwitchCreator(154, 54, 154, null));

/*
 * File:   ui-simple-html.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Simple HTML View
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UISimpleHTML() {
	return;
}

UISimpleHTML.prototype = new UIVScrollView();
UISimpleHTML.prototype.isUISimpleHTML = true;

UISimpleHTML.prototype.saveProps = ["scrollable"];
UISimpleHTML.prototype.initUISimpleHTML = function(type, initText, bg) {
	this.initUIVScrollView(type, 10, bg, null);	

	this.setText(initText);
	this.setDefSize(200, 200);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, bg);

	return this;
}

UISimpleHTML.prototype.extractHtmlElements = function(el, indexInParent) {
	var i = 0;
	var node = null;
	var simpleHtml = this;
	var tag = el.localName;
	var n = el.childNodes.length;
	var childNodes = el.childNodes;

	function createNode(type) {
		var newNode = {x:0, y:0};
		newNode.type = type;

		return newNode;
	}

	if(tag === "b") {
		this.bold = this.bold + 1;	
	}
	else if(tag === "i") {
		this.italic = this.italic + 1;	
	}
	else if(tag === "u") {
		this.underline = this.underline + 1;	
	}
	else if(tag === "a") {
		this.anchor = this.anchor + 1;	
	}
	else if(tag === "ol" || tag === "ul") {
		if(indexInParent > 0) {
			node = createNode("newline");
		}
	}
	else if(tag === "li") {
		node = createNode("text");
		if(el.parentNode.localName === "ol") {
			node.value = "    " + (indexInParent+1) + ". ";
		}
		else {
			node.value = "    o. ";
		}
		node.bold = true;
		node.color = "gray";
		node.fontStyle = "bold ";
	}

	var color = null;

	if(el.style && el.style.color) {
		color = el.style.color;
	}
	if(!color && el.getAttribute) {
		color = el.getAttribute("color");
	}
	if(!color && this.colors.length) {
		color = this.colors[this.colors.length - 1];
	}
	this.colors.push(color || "black");

	if(node) {
		node.tag = tag;
		this.elements.push(node);
		node = null;
	}

	for(var i = 0; i < n; i++) {
		var iter = childNodes[i];
		this.extractHtmlElements(iter, i);
	}
	
	if(tag === "img" && el.src) {
		var src = el.src;
		var image = new Image();
		
		image.onload = function (e) {
			node.imageLoaded = true;
			simpleHtml.textNeedRelayout = true;

			return;
		};
	
		image.onerror = function (e) {
			node.imageLoaded = false;
			if(src) {
				console.log("load " + src + " failed.");
			}
		};

		image.onabort = function (e) {
			node.imageLoaded = false;
			if(src) {
				console.log("load " + src + " failed(abort).");
			}
		};
		
		image.src = src;
		node = createNode("img");
		node.value = image;
		node.displayWidth = el.width;
		node.displayHeight = el.height;
	}
	else if(!n && el.textContent) {
		var str = el.textContent.replace(/(\t|\n|\r)+/g, '');		
		var text = str.replace(/ +/g, ' ');

		if(text) {
			node = createNode("text");
			node.value = text;
			node.bold = this.bold;
			node.italic = this.italic;
			node.underline = this.underline;
			node.anchor = this.anchor;
			node.fontStyle = "";
			if(this.colors.length) {
				node.color = this.colors[this.colors.length-1];
			}

			if(node.bold) {
				node.fontStyle = node.fontStyle + "bold ";
			}

			if(node.italic) {
				node.fontStyle = node.fontStyle + "italic ";
			}
		}
	}

	if(tag === "b") {
		this.bold = this.bold - 1;	
	}
	if(tag === "i") {
		this.italic = this.italic - 1;	
	}
	if(tag === "u") {
		this.underline = this.underline - 1;	
	}
	if(tag === "a") {
		node = createNode("a");
		node.href = el.href;
		this.anchor = this.anchor - 1;	
	}

	if(tag === "p" || (el.style != null && el.style.display === "block")) {
		node = createNode("newblock");
	}
	else if(tag === "li" || tag === "br" || tag === "hr" || tag === "dd") {
		node = createNode("newline");
	}

	this.colors.pop();

	if(node) {
		node.tag = tag;
		this.elements.push(node);
	}

	return;
}


UISimpleHTML.prototype.getNodeByPoint = function(point) {
	var i = 0;
	var x = point.x;
	var y = point.y;
	var node = null;
	var next = null;
	var rect = {};
	var n = this.elements.length;
	var elements = this.elements;
	
	for(i = 0; i < n; i++) {
		node = elements[i];
		next = ((i + 1) < n) ?  elements[i+1] : null;		
		
		if(y < node.y) {
			continue;
		}
		
		if(next && (y > next.y && node.y < next.y)) {
			continue;
		}

		if(node.type === "text") {
			var k = 0;
			var m = node.lines.length;

			rect.h = node.lineHeight;
			for(k = 0; k < m; k++) {
				rect.x = 0;
				rect.y = node.y + k * node.lineHeight;

				if(k === 0) {
					rect.x = node.x;
					rect.w = node.firstLineWidth;
				}
				else if((k + 1) === m) {
					rect.w = node.lastLineWidth;
				}
				else {
					rect.w = this.w;
				}

				if(isPointInRect(point, rect)) {
					return node;
				}
			}
		}
		else if(node.type === "img") {
			rect.x = node.x;
			rect.y = node.y;
			rect.w = node.w;
			rect.h = node.h;

			if(isPointInRect(point, rect)) {
				return node;
			}
		}
	}

	return node;
}

UISimpleHTML.prototype.layoutHtmlElements = function(canvas) {
	var i = 0;
	var offsetX = 0;
	var offsetY = 0;
	var node = null;
	var lineWidth = 0;
	var lineInfo = null;
	var n = this.elements.length;
	var elements = this.elements;
	var width = this.getWidth(true);
	var fontSize = this.style.fontSize;
	var textLayout = new TextLayout(canvas);
	var fontStr = fontSize + "pt " + this.style.fontFamily; 
	var lineGap = fontSize * 2;
	
	canvas.font = fontStr;

	for(i = 0; i < n; i++) {
		node = elements[i];
		
		if(node.type === "text") {
			node.lines = [];
			node.x = offsetX;
			node.y = offsetY;
			node.firstLineWidth = 0;
			canvas.font = node.fontStyle + fontStr;
			node.lineHeight = lineGap;
			textLayout.setText(node.value);

			while(true) {
				lineWidth = width - offsetX;
				
				if(textLayout.hasNext()) {
					lineInfo = textLayout.nextLine(lineWidth, fontSize);
					node.lines.push(lineInfo.text);
					if(node.lines.length === 1) {
						node.firstLineWidth = lineInfo.width;
					}

					if(textLayout.hasNext()) {
						offsetX = 0;
						offsetY = offsetY + lineGap;
					}
					else {
						offsetX = offsetX + lineInfo.width;
						node.lastLineWidth = lineInfo.width;
						break;
					}
				}
				else {
					break;
				}
			}
		}
		else if(node.type === "newline") {
			node.x = offsetX;
			node.y = offsetY; 
			
			offsetX = 0;
			offsetY = offsetY + lineGap;
		}
		else if(node.type === "newblock") {
			node.x = offsetX;
			node.y = offsetY; 
			
			offsetX = 0;
			offsetY = offsetY + lineGap * 1.5;
		}
		else if(node.type === "img") {
			if(node.imageLoaded) {
				var image = node.value;
				var ratio = image.height/image.width;
				var imageW = node.displayWidth ? node.displayWidth : image.width;
				var imageH = node.displayHeight ? node.displayHeight : image.height;

				node.y = offsetY + lineGap * 0.5;
				
				if(imageW < width) {
					node.w = imageW;
					node.x = Math.floor((width - imageW)/2);
					node.h = Math.floor(node.w * ratio);
				}
				else {
					node.x = 0;
					node.w = width;
					node.h = Math.floor(node.w * ratio);
				}
			
				offsetY = node.y + node.h;
				offsetY = offsetY + 0.5 * lineGap;
			}
			else {
				offsetY = offsetY + lineGap;
			}
			offsetX = 0;
		}

		this.scrollRange = offsetY;
	}

	return;
}

UISimpleHTML.prototype.getScrollRange = function() {
	return this.scrollRange ? this.scrollRange : this.h;	
}


UISimpleHTML.prototype.loadUrl = function(dataUrl, onLoadDone) {
	var rInfo = {};
	var shape = this;

	rInfo.method = "GET";
	rInfo.url = dataUrl;
	rInfo.headers = {"Cache-Control":"no-cache", "Pragma":"no-cache"};

	rInfo.onDone = function(result, xhr, respContent) {
		var success = (xhr.status === 200);
		if(xhr.status === 200) {
			var data = respContent;
			try {
				shape.setText(data);
				console.log("loadUrl: done");
			}
			catch(e) {
				success = false;
				console.log("loadUrl: failed" + e.message);
			}
		}
		
		if(onLoadDone) {
			onLoadDone(success);
		}

		return;
	}

	httpDoRequest(rInfo);

	return;
}

UISimpleHTML.prototype.setText = function(text) {
	this.text = this.toText(text);

	this.elements = [];
	var el = document.createElement("div");
	el.innerHTML = this.text;
	
	this.bold = 0;
	this.anchor = 0;
	this.italic = 0;
	this.underline = 0;
	this.strong = 0;
	this.colors = [];
	
	this.extractHtmlElements(el, 0);

	delete this.colors;
	delete this.anchor;
	delete this.bold;
	delete this.italic;
	delete this.underline;
	delete this.strong;

	this.textNeedRelayout = true;

	return;
}

UISimpleHTML.prototype.layoutHtml = function(canvas) {
	if(!this.textNeedRelayout) {
		return;
	}

	if(!this.text) {
		return;
	}

	this.layoutHtmlElements(canvas);

	this.textNeedRelayout = false;

	return;
}

UISimpleHTML.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UISimpleHTML.prototype.paintSelfOnly = function(canvas) {
	var i = 0;
	var x = 0;
	var y = 0;
	var b = 0;
	var h = this.h;
	var w = this.w;
	var node = null;
	var hMargin = this.hMargin;
	var width = this.getWidth(true);
	var fontSize = this.style.fontSize;	
	var lineGap = 2 * fontSize;
	var offsetX = this.hMargin;
	var offsetY = -this.offset + this.vMargin;
	var fontStr = fontSize + "pt " + this.style.fontFamily; 

	this.layoutHtml(canvas);

	canvas.save();
	canvas.rect(0, 0, w, h);
	canvas.clip();

	if(!this.isFillColorTransparent()) {
		canvas.fillStyle = this.style.fillColor;
		canvas.fill();
	}
	canvas.beginPath();

	canvas.font = fontStr;
	canvas.textAlign = "left";
	canvas.textBaseline = "top";
	canvas.fillStyle = this.style.textColor;	

	var n = this.elements.length;
	var elements = this.elements;

	for(i = 0; i < n; i++) {
		node = elements[i];
		if(node.type === "text" && node.lines && node.lines.length) {
			var size = node.lines.length;
			canvas.font = node.fontStyle + fontStr;
			
			if(node.color) {
				canvas.fillStyle = node.color;
			}
			else if(node.anchor) {
				canvas.fillStyle = "Blue";
			}
			else {
				canvas.fillStyle = this.style.textColor;	
			}

			for(k = 0; k < size; k++) {
				if(k === 0) {
					x = node.x;
					y = node.y;
				}
				else {
					x = 0;
					y = node.y + k * (lineGap);
				}

				x = x + offsetX;
				y = y + offsetY;
				b = y + fontSize;
				if(y < h && b >=0) {
					width = w - x - hMargin;
					canvas.fillText(node.lines[k], x, y, width);
				}
			}
		}
		else if(node.type === "img" && node.imageLoaded) {
			var image = node.value;
			var imageW = image.width;
			var imageH = image.height;

			x = node.x + offsetX;
			y = node.y + offsetY;
			
			b = y + node.h;
			if(y < h && b >=0) {
				canvas.drawImage(image, 0, 0, imageW, imageH, x, y, node.w, node.h);
			}
		}
	}
	canvas.restore();

	return;
}

function UISimpleHTMLCreator() {
	var args = ["ui-simple-html", "ui-simple-html", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISimpleHTML();
		var initDoc = 'Simpe HTML';

		return g.initUISimpleHTML(this.type, initDoc, null);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UISimpleHTMLCreator());

/*
 * File:   ui-html-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  HTML View
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIHtmlView() {
	return;
}

UIHtmlView.prototype = new UIHtml();
UIHtmlView.prototype.isUIHtmlView = true;

UIHtmlView.prototype.getHtmlContent = function() {
	var html = "<p>hello html view";
	var w = this.getWidth(true);
	var h = this.getHeight(true);
	var url = this.getUrl();
	var content = this.getValue();

	if(url) {
		html = '<iframe seamless="seamless" scrolling="yes" width="'+w+'" height="'+h+'" src="'+url+'"></iframe>';
	}
	else if(content) {
		html = content;
	}

	return html;
}

UIHtmlView.prototype.setText = function(text) {
	this.text = text;

	return;
}


UIHtmlView.prototype.getValue = function() {
	return this.text ? this.text : "";
}

UIHtmlView.prototype.setValue = function(text) {
	this.text = text;

	return;
}

UIHtmlView.prototype.getUrl = function() {
	return this.url ? this.url : "";
}

UIHtmlView.prototype.setUrl = function(url) {
	this.url = url;

	return;
}

UIHtmlView.prototype.paintSelfOnly = function(canvas) {
	if(!this.htmlVisible) {
		var x = this.w >> 1;
		var y = this.h >> 1;
		var str = dappGetText("HtmlView");
		canvas.textBaseline = "middle";
		canvas.textAlign = "center";
		canvas.font = this.style.getFont();
		canvas.fillStyle = this.style.textColor;
		canvas.fillText(str, x, y);
	}

	return;
}

UIHtmlView.prototype.initUIHtmlView = function(type) {
	this.initUIHtml(type, 400, 300);
	this.setValue("<p>hello html view");
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.setScrollable(true);

	return this;
}

function UIHtmlViewCreator() {
	var args = ["ui-html-view", "ui-html-view", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIHtmlView();
		return g.initUIHtmlView(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIHtmlViewCreator());


/*
 * File:   ui-button-group.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Button Group
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIButtonGroup() {
	return;
}

UIButtonGroup.prototype = new UIElement();
UIButtonGroup.prototype.isUIButtonGroup = true;

UIButtonGroup.prototype.initUIButtonGroup = function(type, border, buttonMaxWidth, bg) {
	this.initUIElement(type);	

	this.setMargin(border, border);
	this.setDefSize(300, 60);
	this.setSizeLimit(100, 40, 1000, 120);

	this.buttonMaxWidth = buttonMaxWidth;
	this.widthAttr = UIElement.WIDTH_FILL_PARENT; 
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, bg);
	this.rectSelectable = false;
	this.addEventNames(["onInit"]);

	if(!bg) {
		this.style.setFillColor("White");
	}

	return this;
}

UIButtonGroup.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUILabel || shape.isUIImage || shape.isUIButton || shape.isUIGroup || shape.isUIRadioBox || shape.isUICheckBox) {
		return true;
	}

	return false;
}

UIButtonGroup.prototype.paintSelfOnly =function(canvas) {
	var image = this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);

	if(!image && !this.isFillColorTransparent()) {
		canvas.beginPath();
		canvas.fillStyle = this.style.fillColor;
		canvas.fillRect(0, 0, this.w, this.h);
	}

	return;
}

UIButtonGroup.prototype.relayoutChildren = function() {
	var hMargin = this.getHMargin();
	var vMargin = this.getVMargin();
	var n = this.children.length;

	if(n === 0 || this.disableRelayout) {
		return;
	}

	var x = hMargin;
	var y = vMargin;

	var h = this.h - 2 * vMargin;
	var maxWidth = this.buttonMaxWidth;
	var defaultWidth = Math.floor((this.w - 2 * hMargin)/n);
	var w = Math.min(defaultWidth, maxWidth);

	for(var i = 0; i < n; i++) {
		var child = this.children[i];
		
		x = i * defaultWidth + (defaultWidth - w)/2 + hMargin;

		child.setLeftTop(x, y);
		child.setSize(w, h);
		child.setUserMovable(false);
		child.setUserResizable(false);
		child.relayoutChildren();
	}
	
	this.w = defaultWidth * n + 2 * hMargin;

	return;
}

UIButtonGroup.prototype.afterChildAppended = function(shape) {
	shape.yAttr = UIElement.Y_MIDDLE_IN_PARENT;

	return true;
}

function UIButtonGroupCreator(border, buttonMaxWidth, bg) {
	var args = ["ui-button-group", "ui-button-group", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIButtonGroup();
		return g.initUIButtonGroup(this.type, border, buttonMaxWidth, bg);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIButtonGroupCreator(5, 200, null));

/*
 * File:   ui-color-bar.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Color Bar
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIColorBar
 * @extends UIElement
 * 颜色线条，一般用于装饰。
 *
 */
function UIColorBar() {
	return;
}

UIColorBar.prototype = new UIElement();
UIColorBar.prototype.isUIButton = false;
UIColorBar.prototype.isUIColorBar = true;

UIColorBar.prototype.saveProps = ["barPosition"];
UIColorBar.prototype.initUIColorBar = function(type, w, h) {
	this.initUIElement(type);	

	this.setBarPosition(0);
	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setCanRectSelectable(false, false);
	this.barDierction = 0;

	return this;
}

UIColorBar.prototype.setBarDirection = function(direction) {
	this.barDirection = direction;

	return this;
}

UIColorBar.prototype.getBarDirection = function() {
	return this.barDirection;
}

UIColorBar.prototype.setBarPosition = function(position) {
	this.barPosition = position;

	return this;
}

UIColorBar.prototype.getBarPosition = function() {
	return this.barPosition;
}

UIColorBar.prototype.shapeCanBeChild = function(shape) {

	return shape.isUIImage || shape.isUIColorTile || shape.isUILabel;
}

UIColorBar.prototype.paintSelfOnly =function(canvas) {
	var ox = 0;
	var oy = 0;
	var v = this.barDirection;
	var n = this.style.lineWidth;
	
	canvas.beginPath();
	switch(this.barPosition) {
		case -1:	{
			break;
		}
		case 1:	{
			if(v) {
				ox = this.w - n;
			}
			else {
				oy = this.h - n;
			}
			break;
		}
		default: {
			if(v) {
				ox = Math.floor((this.w - n)>>1);
			}
			else {
				oy = Math.floor((this.h - n)>>1);
			}
		}
	}

	if(v) {
		canvas.moveTo(ox, 0);
		canvas.lineTo(ox, this.h);
	}
	else {
		canvas.moveTo(0, oy);
		canvas.lineTo(this.w, oy);
	}
	
	canvas.lineWidth = this.style.lineWidth;
	canvas.strokeStyle = this.style.lineColor;
	canvas.stroke();

	return;
}

function UIColorBarCreator(w, h) {
	var args = ["ui-color-bar", "ui-color-bar", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIColorBar();

		return g.initUIColorBar(this.type, w, h);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIColorBarCreator(100, 10));

/*
 * File:   ui-image-animation.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Image Animation.
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIImageAnimation() {
	return;
}

UIImageAnimation.prototype = new UIImageView();
UIImageAnimation.prototype.isUIImageAnimation = true;

UIImageAnimation.prototype.saveProps = ["frameRate"];
UIImageAnimation.prototype.initUIImageAnimation = function(type, w, h) {
	this.initUIElement(type);	
	this.initUIImageView(w, h);
	
	this.addEventNames(["onChanged"]);
	this.setTextType(Shape.TEXT_NONE);
	imageAnimationInitCustomProp(this);

	return this;
}

UIImageAnimation.prototype.setCurrent = function(current) {
	if(this.userImages.length) {
		current = current%this.userImages.length;
	}

	if(this.currFrame != current) {
		this.callOnChangedHandler(current);
	}

	this.currFrame = current;

	return this;
}

UIImageAnimation.prototype.setValue = function(src) {
	for(var i = 0; i < this.cachedImages.length; i++) {
		var iter = this.cachedImages[i];
		if(iter.src.indexOf(src) >= 0 || src.indexOf(iter.src) >= 0) {
			return this.setCurrent(i);
		}
	}
	
	return this;
}

UIImageAnimation.prototype.getCurrentImage = function() {
	var image = this.cachedImages[this.currFrame];

	return image;
}

UIImageAnimation.prototype.onInit = function() {
	var imageAnim = this;

	this.currFrame = 0;

	function nextFrame() {
		if(imageAnim.isVisible()) {
			var duration = 1000/imageAnim.getFrameRate();
			
			imageAnim.postRedraw();
			setTimeout(nextFrame, duration);
			imageAnim.setCurrent(imageAnim.currFrame + 1);
		}
	}

	var duration = 1000/this.getFrameRate();
	setTimeout(nextFrame, duration);

	return;
}

UIImageAnimation.prototype.getFrameRate = function() {
	return this.frameRate ? this.frameRate : 5;
}

UIImageAnimation.prototype.setFrameRate = function(frameRate) {
	this.frameRate = Math.max(1, Math.min(frameRate, 30));

	return;
}

UIImageAnimation.prototype.drawImage = function(canvas) {
	if(!this.userImages || !this.userImages.length) {
		return;
	}
	
	this.ensureImages();

	var currFrame = (this.currFrame ? this.currFrame : 0)%this.userImages.length;
	var image = this.cachedImages[currFrame];

	if(image && image.width > 0) {
		this.drawImageAt(canvas, image, this.images.display, 0, 0, this.w, this.h);
	}

	return;
}


UIImageAnimation.prototype.shapeCanBeChild = function(shape) {
	return false;
}

function UIImageAnimationCreator() {
	var args = [ "ui-image-animation", "ui-image-animation", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIImageAnimation();
		return g.initUIImageAnimation(this.type, 200, 200);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIImageAnimationCreator());

/*
 * File: ui-call-events-handler.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: call events handler 
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016  Holaverse Inc.
 * 
 */

///////////////////////////////////////////////////////////////
UIElement.eventsStoped = {};
UIElement.prototype.callOnUpdateTransformHandler = function(canvas) {
	if(this.isInDesignMode() || !this.events) return true;

	if(!this.handleOnUpdateTransform) {
		var sourceCode = this.events["onUpdateTransform"];
		if(sourceCode) {
			sourceCode = "this.handleOnUpdateTransform = function(canvas) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnUpdateTransform eval", e)
			}
		}
	}

	if(this.hasEventListener("updatetransform")) {
		var event = this.createEvent("updatetransform");
		event.canvas = canvas;

		this.dispatchEvent(event);
	}

	if(this.handleOnUpdateTransform) {
		try {
			this.handleOnUpdateTransform(canvas);
		}catch(e) {
			UIElement.logError("this.handleOnUpdateTransform", e)
		}
	}

	return;
}

UIElement.prototype.callOnPointerDownHandler = function(point, beforeChild) {
	if(this.isUIWindow) {
		UIElement.eventsStoped.click = false;
		UIElement.eventsStoped.pointerDown = false;
	}

	if(!this.enable || !this.events || UIElement.eventsStoped.pointerDown) {
		return false;
	}
	
	if(this.hasEventListener("pointerdown")) {
		var event = this.createEvent("pointerdown");
		event.point = point;
		event.beforeChild = beforeChild;

		if(this.dispatchEvent(event)) {
			UIElement.eventsStoped.pointerDown = true;
			return true;
		}
	}

	if(!this.handlePointerDown) {
		var sourceCode = this.events["onPointerDown"];
		if(sourceCode) {
			sourceCode = "this.handlePointerDown = function(point, beforeChild) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handlePointerDown eval", e)
			}
		}
	}

	if(this.handlePointerDown) {
		try {
			if(this.handlePointerDown(point, beforeChild)) {
				UIElement.eventsStoped.pointerDown = true;
			}
		}catch(e) {
			UIElement.logError("this.handlePointerDown", e)
		}
	}

	return true;
}

UIElement.prototype.callOnPointerMoveHandler = function(point, beforeChild) {
	if(this.isUIWindow) {
		UIElement.eventsStoped.pointerMove = false;
	}

	if(!this.enable || !this.events || UIElement.eventsStoped.pointerMove) {
		return false;
	}

	if(this.hasEventListener("pointermove")) {
		var event = this.createEvent("pointermove");
		event.point = point;
		event.beforeChild = beforeChild;

		if(this.dispatchEvent(event)) {
			UIElement.eventsStoped.pointerMove = true;
			return true;
		}
	}

	if(!this.handlePointerMove) {
		var sourceCode = this.events["onPointerMove"];
		if(sourceCode) {
			sourceCode = "this.handlePointerMove = function(point, beforeChild) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handlePointerMove eval", e)
			}
		}
	}

	if(this.handlePointerMove) {
		try {
			if(this.handlePointerMove(point, beforeChild)) {
				UIElement.eventsStoped.pointerMove = true;
			}
		}catch(e) {
			UIElement.logError("this.handlePointerMove", e)
		}
	}

	return true;
}

UIElement.prototype.callOnPointerUpHandler = function(point, beforeChild) {
	if(this.isUIWindow) {
		UIElement.eventsStoped.pointerUp = false;
	}

	if(!this.enable || !this.events || UIElement.eventsStoped.pointerUp) {
		return false;
	}

	if(this.hasEventListener("pointerup")) {
		var event = this.createEvent("pointerup");
		event.point = point;
		event.beforeChild = beforeChild;

		if(this.dispatchEvent(event)) {
			UIElement.eventsStoped.pointerUp = true;
			return true;
		}
	}

	if(!this.handlePointerUp) {
		var sourceCode = this.events["onPointerUp"];
		if(sourceCode) {
			sourceCode = "this.handlePointerUp = function(point, beforeChild) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handlePointerUp eval", e)
			}
		}
	}

	if(this.handlePointerUp) {
		try{
			if(this.handlePointerUp(point, beforeChild)) {
				UIElement.eventsStoped.pointerUp = true;
			}
		}catch(e) {
			UIElement.logError("this.handlePointerUp", e)
		}
	}
	
	return true;
}

UIElement.prototype.callOnClickHandler = function(point) {
	if(!this.enable || !this.events || this.isInDesignMode()) {
		return false;
	}

	if(UIElement.eventsStoped.click) {
		return true;
	}

	if(this.hasEventListener("click")) {
		var event = this.createEvent("click");
		event.point = point;

		if(this.dispatchEvent(event)) {
			UIElement.eventsStoped.click = true;
			return true;
		}
	}

	if(!this.handleClick) {
		var sourceCode = this.events["onClick"];
		if(sourceCode) {
			sourceCode = "this.handleClick = function(point) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleClick eval", e)
			}
		}
	}

	if(this.handleClick) {
		try {
			if(this.handleClick(point)) {
				UIElement.eventsStoped.click = true;
			}
		}catch(e) {
			UIElement.logError("this.handleClick", e)
		}
	}

	return true;
}

UIElement.prototype.callOnDoubleClickHandler = function(point) {
	if(this.isUIWindow) {
		UIElement.eventsStoped.doubleClick = false;
	}

	if(!this.enable || !this.events || this.isInDesignMode()) {
		return false;
	}

	if(UIElement.eventsStoped.doubleClick) {
		return false;
	}
	
	if(this.hasEventListener("doubleclick")) {
		var event = this.createEvent("doubleclick");
		event.point = point;

		if(this.dispatchEvent(event)) {
			UIElement.eventsStoped.doubleClick = true;
			return true;
		}
	}

	if(!this.handleDoubleClick) {
		var sourceCode = this.events["onDoubleClick"];
		if(sourceCode) {
			sourceCode = "this.handleDoubleClick = function(point) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleDoubleClick eval", e)
			}
		}
	}

	if(this.handleDoubleClick) {
		try {
			if(this.handleDoubleClick(point)) {
				UIElement.eventsStoped.doubleClick = true;
			}
		}catch(e) {
			UIElement.logError("this.handleDoubleClick", e)
		}
	}

	this.hitTestResult = 0;

	return true;
}

UIElement.prototype.callOnLongPressHandler = function(point) {
	if(!this.enable || !this.events) {
		return false;
	}

	if(!this.handleLongPress) {
		var sourceCode = this.events["onLongPress"];
		if(sourceCode) {
			sourceCode = "this.handleLongPress = function(point) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleLongPress eval", e)
			}
		}
	}
	
	if(this.hasEventListener("longpress")) {
		var event = this.createEvent("longpress");
		event.point = point;

		this.dispatchEvent(event);
	}

	if(this.handleLongPress) {
		try {
			this.handleLongPress(point);
		}catch(e) {
			UIElement.logError("this.handleLongPress", e)
		}
	}

	return true;
}

UIElement.prototype.callOnPaintHandler = function(canvas2dCtx) {
	if(this.isInDesignMode()) {
		return true;
	}
	
	if(!this.enable || !this.events) {
		return false;
	}

	if(!this.handlePaint) {
		var sourceCode = this.events["onPaint"];
		if(sourceCode) {
			sourceCode = "this.handlePaint = function(canvas2dCtx) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handlePaint eval", e)
			}
		}
	}
	
	if(this.hasEventListener("paint")) {
		var event = this.createEvent("paint");
		event.canvas2dCtx = canvas2dCtx;

		this.dispatchEvent(event);
	}

	if(this.handlePaint) {
		try {
			this.handlePaint(canvas2dCtx);
		}catch(e) {
			UIElement.logError("this.handlePaint", e)
		}
	}

	return true;
}

UIElement.prototype.callOnScrollDoneHandler = function(xOffset, yOffset) {
	if(!this.enable || !this.events) {
		return false;
	}
	
	if(this.hasEventListener("scrolldone")) {
		var event = this.createEvent("scrolldone");
		event.xOffset = xOffset;
		event.yOffset = yOffset;

		if(this.dispatchEvent(event)) {
			return true;
		}
	}

	if(!this.handleOnScrollDone) {
		var sourceCode = this.events["onScrollDone"];
		if(sourceCode) {
			sourceCode = "this.handleOnScrollDone = function(xOffset, yOffset) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnScrollDone eval", e)
			}
		}
	}

	if(this.handleOnScrollDone) {
		try {
			this.handleOnScrollDone(xOffset, yOffset);
		}catch(e) {
			UIElement.logError("this.handleOnScrollDone", e)
		}
	}

	return true;
}

UIElement.prototype.callOnScrollingHandler = function(xOffset, yOffset) {
	if(!this.enable || !this.events || this.isInDesignMode()) {
		return false;
	}
	
	if(this.hasEventListener("scrolling")) {
		var event = this.createEvent("scrolling");
		event.xOffset = xOffset;
		event.yOffset = yOffset;

		if(this.dispatchEvent(event)) {
			return true;
		}
	}

	if(!this.handleOnScrolling) {
		var sourceCode = this.events["onScrolling"];
		if(sourceCode) {
			sourceCode = "this.handleOnScrolling = function(xOffset, yOffset) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnScrolling eval", e)
			}
		}
	}

	if(this.handleOnScrolling) {
		try {
			this.handleOnScrolling(xOffset, yOffset);
		}catch(e) {
			UIElement.logError("this.handleOnScrolling", e)
		}
	}

	return true;
}

UIElement.prototype.callOnRemovedHandler = function() {
	if(!this.enable || !this.events || this.isInDesignMode()) {
		return false;
	}

	if(!this.handleOnRemoved) {
		var sourceCode = this.events["onRemoved"];
		if(sourceCode) {
			sourceCode = "this.handleOnRemoved = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
				UIElement.logError("this.handleOnRemoved eval", e)
			}
		}
	}
	
	if(this.hasEventListener("removed")) {
		var event = this.createEvent("removed");

		this.dispatchEvent(event);
	}

	if(this.handleOnRemoved) {
		try {
			this.handleOnRemoved();
		}catch(e) {
			UIElement.logError("this.handleOnRemoved", e)
		}
	}

	return true;
}

UIElement.prototype.callOnChildDraggingHandler = function(sourceChildIndex, targetChildIndex) {
	if(!this.enable || !this.events) {
		return false;
	}

	if(!this.handleOnChildDragging) {
		var sourceCode = this.events["onChildDragging"];
		if(sourceCode) {
			sourceCode = "this.handleOnChildDragging = function(sourceChildIndex, targetChildIndex) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnChildDragging eval", e)
			}
		}
	}
	
	if(this.hasEventListener("childdragging")) {
		var event = this.createEvent("childdragging");
		event.sourceChildIndex = sourceChildIndex;
		event.targetChildIndex = targetChildIndex;
		this.dispatchEvent(event);
	}

	if(this.handleOnChildDragging) {
		try {
			this.handleOnChildDragging(sourceChildIndex, targetChildIndex);
		}catch(e) {
			UIElement.logError("this.handleOnChildDragging", e)
		}
	}

	return true;
}

UIElement.prototype.callOnChildDraggedHandler = function(sourceChildIndex, targetChildIndex) {
	if(!this.enable || !this.events) {
		return false;
	}

	if(!this.handleOnChildDragged) {
		var sourceCode = this.events["onChildDragged"];
		if(sourceCode) {
			sourceCode = "this.handleOnChildDragged = function(sourceChildIndex, targetChildIndex) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnChildDragged eval", e)
			}
		}
	}
	
	if(this.hasEventListener("childdragged")) {
		var event = this.createEvent("childdragged");
		event.sourceChildIndex = sourceChildIndex;
		event.targetChildIndex = targetChildIndex;
		this.dispatchEvent(event);
	}


	if(this.handleOnChildDragged) {
		try {
			this.handleOnChildDragged(sourceChildIndex, targetChildIndex);
		}catch(e) {
			UIElement.logError("this.handleOnChildDragged", e)
		}
	}

	return true;
}

UIElement.prototype.callOnChangingHandler = function(value) {
	if(!this.enable || this.isInDesignMode() || !this.events) {
		return false;
	}
	
	if(this.hasEventListener("changing")) {
		var event = this.createEvent("changing");
		event.value = value;
		this.dispatchEvent(event);
	}

	if(!this.handleOnChanging) {
		var sourceCode = this.events["onChanging"];
		if(sourceCode) {
			sourceCode = "this.handleOnChanging = function(value) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnChanging eval", e)
			}
		}
	}

	if(this.handleOnChanging) {
		try {
			this.handleOnChanging(value);
		}catch(e) {
			UIElement.logError("this.handleOnChanging", e)
		}
	}

	return true;
}

UIElement.prototype.callOnChangedHandler = function(value) {
	if(!this.enable || this.isInDesignMode() || !this.events) {
		return false;
	}
	
	if(this.hasEventListener("change")) {
		var event = this.createEvent("change");
		event.value = value;
		this.dispatchEvent(event);
	}

	if(this.hasEventListener("changed")) {
		var event = this.createEvent("changed");
		event.value = value;
		this.dispatchEvent(event);
	}

	if(!this.handleOnChanged) {
		var sourceCode = this.events["onChanged"];
		if(sourceCode) {
			sourceCode = "this.handleOnChanged = function(value) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnChanged eval", e)
			}
		}
	}

	if(this.handleOnChanged) {
		try {
			this.handleOnChanged(value);
		}catch(e) {
			UIElement.logError("this.handleOnChanged", e)
		}
	}

	return true;
}

UIElement.prototype.callOnInitHandler = function() {
	if(!this.events) return;

	if(!this.handleOnInit) {
		var sourceCode = this.events["onInit"];
		if(sourceCode) {
			sourceCode = "this.handleOnInit = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnInit eval", e)
			}
		}
	}
	
	if(this.hasEventListener("init")) {
		var event = this.createEvent("init");

		this.dispatchEvent(event);
	}

	if(this.handleOnInit) {
		try {
			this.handleOnInit();
		}catch(e) {
			UIElement.logError("this.handleOnInit", e)
		}
	}

	return true;
}

UIElement.prototype.callOnFocusInHandler = function() {
	if(this.onFocusIn) {
		try {
			this.onFocusIn();
		}
		catch(e) {
			console.log("onFocusIn:" + e.message);
		}
	}

	if(!this.events) return;
	if(!this.handleOnFocusIn) {
		var sourceCode = this.events["onFocusIn"];
		if(sourceCode) {
			sourceCode = "this.handleOnFocusIn = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnFocusIn eval", e)
			}
		}
	}

	if(this.hasEventListener("focusin")) {
		var event = this.createEvent("focusin");

		this.dispatchEvent(event);
	}

	if(this.handleOnFocusIn) {
		try {
			this.handleOnFocusIn();
		}catch(e) {
			UIElement.logError("this.handleOnFocusIn", e)
		}
	}

	return true;
}

UIElement.prototype.callOnFocusOutHandler = function() {
	if(this.onFocusOut) {
		try {
			this.onFocusOut();
		}
		catch(e) {
			UIElement.logError("this.onFocusOut ", e)
		}
	}

	if(!this.events) return;
	if(!this.handleOnFocusOut) {
		var sourceCode = this.events["onFocusOut"];
		if(sourceCode) {
			sourceCode = "this.handleOnFocusOut = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.onFocusOut eval", e)
			}
		}
	}
	
	if(this.hasEventListener("focusout")) {
		var event = this.createEvent("focusout");

		this.dispatchEvent(event);
	}

	if(this.handleOnFocusOut) {
		try {
			this.handleOnFocusOut();
		}catch(e) {
			UIElement.logError("this.onFocusOut", e)
		}
	}

	return true;
}

/////////////////////////////////////////////////////////

UIElement.prototype.callOnUpdateDataHandler = function() {
	if(!this.events) return;
	if(!this.handleOnUpdateData) {
		var sourceCode = this.events["onUpdateData"];
		if(sourceCode) {
			sourceCode = "this.handleOnUpdateData = function(value) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnUpdateData eval", e)
			}
		}
	}

	if(this.hasEventListener("updatedata")) {
		var event = this.createEvent("updatedata");

		this.dispatchEvent(event);
	}

	if(this.handleOnUpdateData) {
		try {
			this.handleOnUpdateData();
		}catch(e) {
			UIElement.logError("this.handleOnUpdateData", e)
		}
	}

	return true;
}

///////////////////////////////////////////////////////////////////

UIElement.prototype.callOnGestureHandler = function(gesture) {
	if(!this.enable || !this.events) {
		return false;
	}

	if(!this.handleOnGesture) {
		var sourceCode = this.events["onGesture"];
		if(sourceCode) {
			sourceCode = "this.handleOnGesture = function(gesture) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnGesture eval", e)
			}
		}
	}
	
	if(this.hasEventListener("gesture")) {
		var event = this.createEvent("gesture");
		event.gesture = gesture;

		this.dispatchEvent(event);
	}

	if(this.handleOnGesture) {
		try {
			this.handleOnGesture(gesture);
		}catch(e) {
			UIElement.logError("this.handleOnGesture", e)
		}
	}
	
	console.log("callOnGestureHandler: scale=" + gesture.scale + " rotation=" + gesture.rotation);

	return true;
}

UIElement.prototype.callOnBeforeOpenHandler = function(initData) {
	if(!this.events) return;
	if(!this.handleOnBeforeOpen) {
		var sourceCode = this.events["onBeforeOpen"];
		if(sourceCode) {
			sourceCode = "this.handleOnBeforeOpen = function(initData) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnBeforeOpen eval", e)
			}
		}
	}
	
	if(this.hasEventListener("beforeopen")) {
		var event = this.createEvent("beforeopen");
		event.initData = initData;

		this.dispatchEvent(event);
	}

	if(this.handleOnBeforeOpen) {
		try {
			this.handleOnBeforeOpen(initData);
		}catch(e) {
			UIElement.logError("this.handleOnBeforeOpen", e)
		}
	}

	return true;
}

UIElement.prototype.callOnOpenHandler = function(initData) {
	if(!this.events) return;
	if(!this.handleOnOpen) {
		var sourceCode = this.events["onOpen"];
		if(sourceCode) {
			sourceCode = "this.handleOnOpen = function(initData) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnOpen eval", e)
			}
		}
	}
	
	if(this.hasEventListener("open")) {
		var event = this.createEvent("open");
		event.initData = initData;

		this.dispatchEvent(event);
	}

	if(this.handleOnOpen) {
		try {
			this.handleOnOpen(initData);	
		}catch(e) {
			UIElement.logError("this.handleOnOpen", e)
		}
	}

	return true;
}

UIElement.prototype.callOnCloseHandler = function(retInfo) {
	if(!this.events) return;
	if(!this.handleOnClose) {
		var sourceCode = this.events["onClose"];
		if(sourceCode) {
			sourceCode = "this.handleOnClose = function(retInfo) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnClose eval", e)
			}
		}
	}

	if(this.hasEventListener("close")) {
		var event = this.createEvent("close");
		event.retInfo = retInfo;

		this.dispatchEvent(event);
	}

	if(this.handleOnClose) {
		try {
			this.handleOnClose(retInfo);
		}
		catch(e) {
			UIElement.logError("this.handleOnClose", e)
		}
	}

	return true;
}

UIElement.prototype.callOnSwitchToBackHandler =function() {
	if(!this.events) return;
	if(!this.handleOnSwitchToBack) {
		var sourceCode = this.events["onSwitchToBack"];
		if(sourceCode) {
			sourceCode = "this.handleOnSwitchToBack = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnSwitchToBack eval", e)
			}
		}
	}

	if(this.hasEventListener("switchtoback")) {
		var event = this.createEvent("switchtoback");
		this.dispatchEvent(event);
	}

	if(this.handleOnSwitchToBack) {
		try {
			this.handleOnSwitchToBack();
		}
		catch(e) {
			UIElement.logError("this.handleOnSwitchToBack", e)
		}
	}

	return true;
}

UIElement.prototype.callOnSwitchToFrontHandler = function() {
	if(!this.events) return;
	if(!this.handleOnSwitchToFront) {
		var sourceCode = this.events["onSwitchToFront"];
		if(sourceCode) {
			sourceCode = "this.handleOnSwitchToFront = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnSwitchToFront eval", e)
			}
		}
	}

	if(this.hasEventListener("switchtofront")) {
		var event = this.createEvent("switchtofront");
		this.dispatchEvent(event);
	}

	if(this.handleOnSwitchToFront) {
		try {
			this.handleOnSwitchToFront();
		}
		catch(e) {
			UIElement.logError("this.handleOnSwitchToFront", e)
		}
	}

	return true;
}

UIElement.prototype.callOnLoadHandler =function() {
	if(!this.events) return;
	if(!this.handleOnLoad) {
		var sourceCode = this.events["onLoad"];
		if(sourceCode) {
			sourceCode = "this.handleOnLoad = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnLoad eval", e)
			}
		}
	}
	
	if(this.hasEventListener("load")) {
		var event = this.createEvent("load");
		this.dispatchEvent(event);
	}

	if(this.handleOnLoad) {
		try {
			this.handleOnLoad();
		}
		catch(e) {
			UIElement.logError("this.handleOnLoad", e)
		}
	}

	return true;
}

UIElement.prototype.callOnUnloadHandler =function() {
	if(!this.events) return;
	if(!this.handleOnUnload) {
		var sourceCode = this.events["onUnload"];
		if(sourceCode) {
			sourceCode = "this.handleOnUnload = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnUnload eval", e)
			}
		}
	}

	if(this.hasEventListener("unload")) {
		var event = this.createEvent("unload");
		this.dispatchEvent(event);
	}

	if(this.handleOnUnload) {
		try {
			this.handleOnUnload();
		}
		catch(e) {
			UIElement.logError("this.handleOnUnload", e)
		}
	}

	return true;
}

/////////////////////////////////////////////////////////////

UIElement.prototype.callOnMovedHandler = function() {
 	if(this.cameraFollowMe) {
		this.getWindow().cameraFollow(this);
	} 
	
	if(this.hasEventListener("moved")) {
		var event = this.createEvent("moved");

		this.dispatchEvent(event);
	}

   	if(!this.events) return;
	if(!this.handleOnMoved) {
		var sourceCode = this.events["onMoved"];
		if(sourceCode) {
			sourceCode = "this.handleOnMoved = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnMoved eval", e)
			}
		}
	}
	
	if(this.handleOnMoved) {
		try {
			this.handleOnMoved();
		}catch(e) {
			UIElement.logError("this.handleOnMoved", e)
		}
	}

	return true;
}

UIElement.prototype.callOnPreSolveHandler = function(body, contact, oldManifold) {
	if(!this.events) return;

	if(!this.handleOnPreSolve) {
		var sourceCode = this.events["onPreSolve"];
		if(sourceCode) {
			sourceCode = "this.handleOnPreSolve = function(body, contact, oldManifold) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnPreSolve eval", e)
			}
		}
	}

	if(this.hasEventListener("presolve")) {
		var event = this.createEvent("presolve");
		event.body = body;
		event.contact = contact;
		event.oldManifold = oldManifold;

		this.dispatchEvent(event);
	}

	if(this.handleOnPreSolve) {
		try {
			this.handleOnPreSolve(body, contact, oldManifold);
		}catch(e) {
			UIElement.logError("this.handleOnPreSolve", e)
		}
	}

	return true;
}

UIElement.prototype.callOnPostSolveHandler = function(body, contact, impulse) {
	if(!this.events) return;

	if(!this.handleOnPostSolve) {
		var sourceCode = this.events["onPostSolve"];
		if(sourceCode) {
			sourceCode = "this.handleOnPostSolve = function(body, contact, impulse) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnPostSolve eval", e)
			}
		}
	}
	
	if(this.hasEventListener("postsolve")) {
		var event = this.createEvent("postsolve");
		event.body = body;
		event.contact = contact;
		event.impulse = impulse;

		this.dispatchEvent(event);
	}

	if(this.handleOnPostSolve) {
		try {
			this.handleOnPostSolve(body, contact, impulse);
		}catch(e) {
			UIElement.logError("this.handleOnPostSolve", e)
		}
	}

	return true;
}

UIElement.prototype.callOnBeginContactHandler = function(body, contact) {
	if(!this.events) return;

	if(this.hasEventListener("begincontact")) {
		var event = this.createEvent("begincontact");
		event.body = body;
		event.contact = contact;

		this.dispatchEvent(event);
	}

	if(!this.handleOnBeginContact) {
		var sourceCode = this.events["onBeginContact"];
		if(sourceCode) {
			sourceCode = "this.handleOnBeginContact = function(body, contact) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnBeginContact eval", e)
			}
		}
	}

	if(this.handleOnBeginContact) {
		try {
			this.handleOnBeginContact(body, contact);
		}catch(e) {
			UIElement.logError("this.handleOnBeginContact", e)
		}
	}

	return true;
}

UIElement.prototype.callOnEndContactHandler = function(body, contact) {
	if(!this.events) return;

	if(this.hasEventListener("endcontact")) {
		var event = this.createEvent("endcontact");
		event.body = body;
		event.contact = contact;

		this.dispatchEvent(event);
	}

	if(!this.handleOnEndContact) {
		var sourceCode = this.events["onEndContact"];
		if(sourceCode) {
			sourceCode = "this.handleOnEndContact = function(body, contact) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnEndContact eval", e)
			}
		}
	}

	if(this.handleOnEndContact) {
		try {
			this.handleOnEndContact(body, contact);
		}catch(e) {
			UIElement.logError("this.handleOnEndContact", e)
		}
	}

	return true;
}

UIElement.prototype.callOnAnimateDoneHandler = function(name) {
	if(!this.events) return;

	if(!this.handleOnAnimateDone) {
		var sourceCode = this.events["onAnimateDone"];
		if(sourceCode) {
			sourceCode = "this.handleOnAnimateDone = function(name) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnAnimateDone eval", e)
			}
		}
	}
	
	if(this.hasEventListener("animatedone")) {
		var event = this.createEvent("animatedone");
		event.name = name;

		this.dispatchEvent(event);
	}

	if(this.handleOnAnimateDone) {
		try {
			this.handleOnAnimateDone(name);
		}
		catch(e) {
			UIElement.logError("this.handleOnAnimateDone", e)
		}
	}

	return true;
}

UIElement.prototype.callOnSwipeLeftHandler = function(start, end) {
	if(!this.events) return;

	if(!this.handleOnSwipeLeft) {
		var sourceCode = this.events["onSwipeLeft"];
		if(sourceCode) {
			sourceCode = "this.handleOnSwipeLeft = function(start, end) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnSwipeLeft eval", e)
			}
		}
	}

	if(this.hasEventListener("swipeleft")) {
		var event = this.createEvent("swipeleft");
		event.start = start;
		event.end = end;

		this.dispatchEvent(event);
	}

	if(this.handleOnSwipeLeft) {
		try {
			this.handleOnSwipeLeft(start, end);
		}catch(e) {
			UIElement.logError("this.handleOnSwipeLeft", e)
		}
	}

	return true;
}

UIElement.prototype.callOnSwipeRightHandler = function(start, end) {
	if(!this.events) return;

	if(!this.handleOnSwipeRight) {
		var sourceCode = this.events["onSwipeRight"];
		if(sourceCode) {
			sourceCode = "this.handleOnSwipeRight = function(start, end) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnSwipeRight eval", e)
			}
		}
	}

	if(this.hasEventListener("swiperight")) {
		var event = this.createEvent("swiperight");
		event.start = start;
		event.end = end;

		this.dispatchEvent(event);
	}

	if(this.handleOnSwipeRight) {
		try {
			this.handleOnSwipeRight(start, end);
		}catch(e) {
			UIElement.logError("this.handleOnSwipeRight", e)
		}
	}

	return true;
}

UIElement.prototype.callOnSwipeUpHandler = function(start, end) {
	if(!this.events) return;

	if(!this.handleOnSwipeUp) {
		var sourceCode = this.events["onSwipeUp"];
		if(sourceCode) {
			sourceCode = "this.handleOnSwipeUp = function(start, end) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnSwipeUp eval", e)
			}
		}
	}

	if(this.hasEventListener("swipeup")) {
		var event = this.createEvent("swipeup");
		event.start = start;
		event.end = end;

		this.dispatchEvent(event);
	}

	if(this.handleOnSwipeUp) {
		try {
			this.handleOnSwipeUp(start, end);
		}catch(e) {
			UIElement.logError("this.handleOnSwipeUp", e)
		}
	}

	return true;
}

UIElement.prototype.callOnSwipeDownHandler = function(start, end) {
	if(!this.events) return;

	if(!this.handleOnSwipeDown) {
		var sourceCode = this.events["onSwipeDown"];
		if(sourceCode) {
			sourceCode = "this.handleOnSwipeDown = function(start, end) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnSwipeDown eval", e)
			}
		}
	}

	if(this.hasEventListener("swipedown")) {
		var event = this.createEvent("swipedown");
		event.start = start;
		event.end = end;

		this.dispatchEvent(event);
	}

	if(this.handleOnSwipeDown) {
		try {
			this.handleOnSwipeDown(start, end);
		}catch(e) {
			UIElement.logError("this.handleOnSwipeDown", e)
		}
	}

	return true;
}

UIElement.prototype.callOnBecomeZeroHandler = function() {
	if(!this.events) return;

	if(!this.handleOnBecomeZero) {
		var sourceCode = this.events["onBecomeZero"];
		if(sourceCode) {
			sourceCode = "this.handleOnBecomeZero = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnBecomeZero eval", e)
			}
		}
	}
	
	if(this.hasEventListener("becomezero")) {
		var event = this.createEvent("becomezero");
		this.dispatchEvent(event);
	}

	if(this.handleOnBecomeZero) {
		try {
			this.handleOnBecomeZero();
		}catch(e) {
			UIElement.logError("this.handleOnBecomeZero", e)
		}
	}

	return true;
}

UIElement.prototype.callOnBecomeFullHandler = function() {
	if(!this.events) return;

	if(!this.handleOnBecomeFull) {
		var sourceCode = this.events["onBecomeFull"];
		if(sourceCode) {
			sourceCode = "this.handleOnBecomeFull = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnBecomeFull eval", e)
			}
		}
	}

	if(this.hasEventListener("becomefull")) {
		var event = this.createEvent("becomefull");
		this.dispatchEvent(event);
	}

	if(this.handleOnBecomeFull) {
		try {
			this.handleOnBecomeFull();
		}catch(e) {
			UIElement.logError("this.handleOnBecomeFull", e)
		}
	}

	return true;
}

UIElement.prototype.callOnTimeoutHandler = function() {
	if(!this.events) return;
	if(!this.handleOnTimeout) {
		var sourceCode = this.events["onTimeout"];
		if(sourceCode) {
			sourceCode = "this.handleOnTimeout = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnTimeout eval", e)
			}
		}
	}
	
	if(this.hasEventListener("timer")) {
		var event = this.createEvent("timer");
		this.dispatchEvent(event);
	}
	
	if(this.hasEventListener("timeout")) {
		var event = this.createEvent("timeout");
		this.dispatchEvent(event);
	}


	if(this.handleOnTimeout) {
		try {
			this.handleOnTimeout();
		}catch(e) {
			UIElement.logError("this.handleOnTimeout", e)
		}
	}

	return true;
}

UIElement.prototype.callOnSystemInitHandler = function() {
	if(!this.events) return;
	if(!this.handleOnSystemInit) {
		var sourceCode = this.events["onSystemInit"];
		if(sourceCode) {
			sourceCode = "this.handleOnSystemInit = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnSystemInit eval", e)
			}
		}
	}

	if(this.hasEventListener("systeminit")) {
		var event = this.createEvent("systeminit");

		this.dispatchEvent(event);
	}

	if(this.handleOnSystemInit) {
		try {
			this.handleOnSystemInit();
		}catch(e) {
			UIElement.logError("this.handleOnSystemInit", e)
		}
	}

	return true;
}

UIElement.prototype.callOnScrollOutOfRangeHandler = function(offset) {
	if(!this.enable || !this.events) {
		return false;
	}

	if(this.onScrollOutOfRange) {
		this.onScrollOutOfRange(offset);

		return;
	}

	if(!this.handleOnScrollOutOfRange) {
		var sourceCode = this.events["onScrollOutOfRange"];
		if(sourceCode) {
			sourceCode = "this.handleOnScrollOutOfRange = function(offset) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnScrollOutOfRange eval", e)
			}
		}
	}

	if(this.hasEventListener("scrolloutofrange")) {
		var event = this.createEvent("scrolloutofrange");
		event.offset = offset;

		this.dispatchEvent(event);
	}

	if(this.handleOnScrollOutOfRange) {
		try {
			this.handleOnScrollOutOfRange(offset);
		}catch(e) {
			UIElement.logError("this.handleOnScrollOutOfRange", e)
		}
	}

	return true;
}

UIElement.prototype.callOnBirthedHandler = function() {
	if(this.onBirthed) {
		this.onBirthed();
	}

	if(!this.events) return;
	if(!this.handleOnBirthed) {
		var sourceCode = this.events["onBirthed"];
		if(sourceCode) {
			sourceCode = "this.handleOnBirthed = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnBirthed eval", e)
			}
		}
	}
	
	if(this.hasEventListener("birthed")) {
		var event = this.createEvent("birthed");

		this.dispatchEvent(event);
	}

	if(this.handleOnBirthed) {
		try {
			this.handleOnBirthed();
		}catch(e) {
			UIElement.logError("this.handleOnBirthed", e)
		}
	}

	return true;
}

UIElement.prototype.callOnDeviceOrientation = function(x, y, z, evt) {
	if(!this.events) return;
	if(!this.handleOnDeviceOrientation) {
		var sourceCode = this.events["onDeviceOrientation"];
		if(sourceCode) {
			sourceCode = "this.handleOnDeviceOrientation = function(x, y, z, event) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnDeviceOrientation eval", e)
			}
		}
	}

	if(this.hasEventListener("deviceorientation")) {
		var event = this.createEvent("deviceorientation");
		event.x = x;
		event.y = y;
		event.z = z;
		event.event = evt;

		this.dispatchEvent(event);
	}

	if(this.handleOnDeviceOrientation) {
		try {
			this.handleOnDeviceOrientation(x, y, z, evt);
		}catch(e) {
			UIElement.logError("this.handleOnDeviceOrientation", e)
		}
	}

	return true;
}

UIElement.prototype.dispatchCustomEvent = function(eventName, args) {
	if(!this.events) return;
	if(!this.customEventHandler) {
		this.customEventHandler = {};
	}

	var handleCustomEvent = this.customEventHandler[eventName];
	if(!handleCustomEvent) {
		var sourceCode = this.events[eventName];
		if(sourceCode) {
			sourceCode = "this.handleCustomEvent = function(args) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleCustomEvent eval", e)
			}
		}

		if(this.handleCustomEvent) {
			handleCustomEvent = this.handleCustomEvent;
			this.customEventHandler[eventName] = handleCustomEvent;
			this.handleCustomEvent = null;
		}
	}

	if(handleCustomEvent) {
		try {
			handleCustomEvent.call(this, args);
		}catch(e) {
			UIElement.logError("this.handleCustomEvent", e)
		}
	}

	return true;
}

UIWindow.prototype.callOnMultiTouchHandler = function(action, points, evt) {
	if(!this.enable || !this.events) {
		return false;
	}

	if(this.isInDesignMode()) {
		return false;
	}
	
	if(!this.handleMultiTouch) {
		var sourceCode = this.events["onMultiTouch"];
		if(sourceCode) {
			sourceCode = "this.handleMultiTouch = function(action, points, event) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleMultiTouch eval", e)
			}
		}
	}
	
	if(this.hasEventListener("multitouch")) {
		var event = this.createEvent("multitouch");
		event.action = action;
		event.points = points;
		event.event = evt;

		this.dispatchEvent(event);
	}

	if(this.handleMultiTouch) {
		try {
			this.handleMultiTouch(action, points, evt);
		}catch(e) {
			UIElement.logError("this.handleMultiTouch", e)
		}
	}

	return;
}

UIElement.prototype.callOnDragStartHandler = function() {
	if(!this.enable || !this.events) {
		return false;
	}

	if(!this.handleDragStart) {
		var sourceCode = this.events["onDragStart"];
		if(sourceCode) {
			sourceCode = "this.handleDragStart = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleDragStart eval", e)
			}
		}
	}
	
	if(this.hasEventListener("dragstart")) {
		var event = this.createEvent("dragstart");

		this.dispatchEvent(event);
	}

	if(this.handleDragStart) {
		try {
			this.handleDragStart();
		}catch(e) {
			UIElement.logError("this.handleDragStart", e)
		}
	}

	return;
}

UIElement.prototype.callOnDragEndHandler = function() {
	if(!this.enable || !this.events) {
		return false;
	}

	if(!this.handleDragEnd) {
		var sourceCode = this.events["onDragEnd"];
		if(sourceCode) {
			sourceCode = "this.handleDragEnd = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleDragEnd eval", e)
			}
		}
	}

	if(this.hasEventListener("dragend")) {
		var event = this.createEvent("dragend");

		this.dispatchEvent(event);
	}

	if(this.handleDragEnd) {
		try {
			this.handleDragEnd();
		}catch(e) {
			UIElement.logError("this.handleDragEnd", e)
		}
	}

	return;
}

UIElement.prototype.callOnDraggingHandler = function() {
	if(!this.enable || !this.events) {
		return false;
	}

	if(!this.handleDragging) {
		var sourceCode = this.events["onDragging"];
		if(sourceCode) {
			sourceCode = "this.handleDragging = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleDragging eval", e)
			}
		}
	}

	if(this.hasEventListener("dragging")) {
		var event = this.createEvent("dragging");

		this.dispatchEvent(event);
	}

	if(this.handleDragging) {
		try {
			this.handleDragging();
		}catch(e) {
			UIElement.logError("this.handleDragging", e)
		}
	}

	return;
}
/*
 * File:   ui-v-scroll-image.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Vertical Scrollable Image
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIVScrollImage() {
	return;
}

UIVScrollImage.prototype = new UIVScrollView();

UIVScrollImage.prototype.initUIVScrollImage = function(type) {
	this.initUIVScrollView(type, 0, null, null);	
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.widthAttr = UIElement.WIDTH_SCALE;
	this.heightAttr = UIElement.HEIGHT_SCALE;
	this.setSize(200, 200);
	
	this.setImage("option_image_0", null);
	this.setImage("option_image_1", null);
	this.setImage("option_image_2", null);
	this.setImage("option_image_3", null);
	this.setImage("option_image_4", null);
	this.setImage("option_image_5", null);
	this.setImage("option_image_6", null);
	this.setImage("option_image_7", null);
	this.setImage("option_image_8", null);
	this.setImage("option_image_9", null);
	this.setImage("option_image_10", null);
	this.setImage("option_image_11", null);
	this.setImage("option_image_12", null);
	this.setImage("option_image_13", null);
	this.setImage("option_image_14", null);

	return this;
}

UIVScrollImage.prototype.drawBgImage = function(canvas) {
	var image = this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);
	if(!image || !image.height) {
		canvas.fillStyle = this.style.fillColor;
		canvas.fillRect(0, 0, this.w, this.h);
		return;
	}
	var scale = this.w/image.width;
	var range = image.height * scale;

	var x = 0; 
	var y = this.offset/scale;
	var w = image.width;
	var h = Math.min(this.h/scale, image.height-y);
	var dx = 0; 
	var dy = 0;
	var dw = this.w; 
	var dh = h * scale;

	canvas.drawImage(image, x, y, w, h, dx, dy, dw, dh);

	return;
}

UIVScrollImage.prototype.getScrollRange = function() {
	var image = this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);
	if(image && image.height && image.width) {
		var scale = this.w/image.width;

		return scale * image.height + 60;
	}
	else {
		return this.h;
	}
}

UIVScrollImage.prototype.afterPaintChildren = function(canvas) {
	this.drawScrollBar(canvas);

	if(this.isInDesignMode()) {
		this.drawPageDownUp(canvas);
	}

	return;
}

function UIVScrollImageCreator() {
	var args = ["ui-v-scroll-image", "ui-v-scroll-image", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIVScrollImage();
		return g.initUIVScrollImage(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIVScrollImageCreator());
/*
 * File:   ui-page-manager.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  TabPage Manager
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIPageManager() {
}

UIPageManager.prototype = new UIFrames();
UIPageManager.prototype.isUIPageManager = true;

UIPageManager.prototype.initUIPageManager = function(type) {
	return this.initUIFrames(type);
}

UIPageManager.prototype.beforeAddShapeIntoChildren = function(shape) {
	return !shape.isUIPage;
}

UIPageManager.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIPage;
}

UIPageManager.prototype.relayoutChildren = function() {
	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		iter.left = 0;
		iter.top = 0;
		iter.w = this.w;
		iter.h = this.h;
		iter.relayoutChildren();
		iter.setUserMovable(false);
		iter.setUserResizable(false);
	}

	return;
}

UIPageManager.prototype.showHTML = function() {
	var child = this.getCurrentFrame();
	
	if(child) {
		child.showHTML();
	}

	return;
}

UIPageManager.prototype.hideHTML = function() {
	var child = this.getCurrentFrame();
	
	if(child) {
		child.hideHTML();
	}

	return;
}


UIPageManager.prototype.switchTo = function(index) {
	var pageManager = this;
	var curFrame = this.getCurrentFrame();
	var newFrame = this.getFrame(index);
	var current = this.current;

	if(curFrame) {
		curFrame.hideHTML();
	}

	if(current < 0 || current === index || !curFrame || !newFrame) {
		this.showFrame(index);

		if(newFrame) {
			newFrame.showHTML();
		}

		return;
	}

	function showNewFrame() {
		pageManager.showFrame(index);
		pageManager.postRedraw();

		return;
	}

	if(!this.isTopWindow()) {
		showNewFrame();	
		return;
	}

	var animation = null;
	var backendCanvas = null;
	var p = this.getPositionInScreen();

	if(index < current) {
		animation = AnimationFactory.create("anim-backward"); 
		backendCanvas = UIFrames.preparseBackendCanvas(newFrame, curFrame);
	}
	else {
		animation = AnimationFactory.create("anim-forward"); 
		backendCanvas = UIFrames.preparseBackendCanvas(curFrame, newFrame);
	}

//	window.open(backendCanvas.toDataURL(), "_blank");
	animation.setScale(this.getRealScale());
	animation.prepare(p.x, p.y, this.w, this.h, backendCanvas, showNewFrame);
	animation.run();

	return;
}

function UIPageManagerCreator() {
	var args = ["ui-page-manager", "ui-page-manager", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageManager();

		g.initUIPageManager(this.type);

		return g;
	}
	
	return;
}
	
ShapeFactoryGet().addShapeCreator(new UIPageManagerCreator());

/*
 * File:   ui-wait-bar.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Wait Bar
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIWaitBar
 * @extends UIElement
 * 等待动画。
 */

/**
 * @class UIWaitBox
 * @extends UIElement
 * 等待动画。
 */

function UIWaitBar() {
	return;
}

UIWaitBar.TILES = 8;
UIWaitBar.prototype = new UIElement();

UIWaitBar.prototype.initUIWaitBar = function(type, w, h) {
	this.initUIElement(type);	

	this.offset = 0;
	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, null);

	return this;
}

UIWaitBar.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIWaitBar.prototype.step = function() {
	if(this.isVisible() && this.getParent()) {
		this.offset++;
	
		if(this.isUIWaitBar) {
			this.offset = (this.offset)%UIWaitBar.TILES;
		}

		this.postRedraw();
	}

	return this;
}

UIWaitBar.prototype.drawBgImage = function(canvas) {
	var image = this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);
	
	if(!image) {
		return;
	}

	if(this.isUIWaitBar) {
		this.drawBgImageBar(canvas, image);
	}
	else {
		this.drawBgImageBox(canvas, image);
	}

	return;
}

UIWaitBar.prototype.drawBgImageBox =function(canvas, image) {
	var angle = 0.05*Math.PI*this.offset;
	this.setRotation(angle);

	UIElement.prototype.drawBgImage.call(this, canvas);

	return;
}

UIWaitBar.prototype.onInit = function() {
	UIElement.prototype.onInit.call(this);

	var me = this;
	function stepIt() {
		me.step();
		if(me.getParent()) {
			setTimeout(stepIt, 50);
		}
	}

	stepIt();

	return;
}

UIWaitBar.prototype.drawBgImageBar = function(canvas, image) {
	var imageWidth = image.width;
	var imageHeight = image.height;
	var tileHeight = Math.round(imageHeight/UIWaitBar.TILES);
	var yOffset = this.offset * tileHeight;

	var rect = {x:0, y:yOffset, w:imageWidth, h:tileHeight};

	UIElement.drawImageAt(canvas, image, this.images.display, 0, 0, this.w, this.h, rect);

	return;
}

function UIWaitBarCreator(type, w, h) {
	var args = [type, type, null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIWaitBar();
		g.isUIWaitBar = true;

		return g.initUIWaitBar(this.type, w, h);
	}
	
	return;
}

function UIWaitBoxCreator(type, w, h) {
	var args = [type, type, null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIWaitBar();
		g.isUIWaitBox = true;

		return g.initUIWaitBar(this.type, w, h);
	}
	
	return;
}
	
ShapeFactoryGet().addShapeCreator(new UIWaitBarCreator("ui-wait-bar", 200, 24));
ShapeFactoryGet().addShapeCreator(new UIWaitBoxCreator("ui-wait-box", 60, 60));

/*
 * File:   ui-static-map.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Static Map 
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIStaticMap() {
	return;
}

UIStaticMap.prototype = new UIImage();
UIStaticMap.prototype.isUIStaticMap = true;

UIStaticMap.prototype.initUIStaticMap = function(type) {
	this.initUIImage(type, 200, 200, null);

	return this;
}

UIStaticMap.prototype.setMapProvider = function(value) {
	this.mapProvider = value;

	return;
}

UIStaticMap.prototype.setMapType = function(value) {
	this.mapType = value;

	return;
}

UIStaticMap.prototype.setMapZoom = function(value) {
	this.mapZoom = value;

	return;
}

UIStaticMap.prototype.setMapCenter = function(value) {
	this.mapCenter = value;

	return;
}

UIStaticMap.prototype.setMapWidth = function(value) {
	this.mapWidth = value;

	return;
}

UIStaticMap.prototype.setMapHeight = function(value) {
	this.mapHeight = value;

	return;
}

UIStaticMap.prototype.setMapExtraParams = function(value) {
	this.mapEtraParams = value;

	return;
}

UIStaticMap.prototype.getMapType = function() {
	return this.mapType ? this.mapType : "";
}

UIStaticMap.prototype.getMapProvider = function() {
	return this.mapProvider ? this.mapProvider : "google";
}

UIStaticMap.prototype.getMapZoom = function() {
	return this.mapZoom ? this.mapZoom : 10;
}

UIStaticMap.prototype.getMapWidth = function() {
	return this.mapWidth ? this.mapWidth : 600;
}

UIStaticMap.prototype.getMapHeight = function() {
	return this.mapHeight ? this.mapHeight : 600;
}

UIStaticMap.prototype.getMapCenter = function() {
	if(!this.mapCenter && this.currentLocation) {
		return this.currentLocation;
	}
	else {
		return this.mapCenter ? this.mapCenter : "China";
	}
}

UIStaticMap.prototype.getMapExtraParams = function() {
	return this.mapEtraParams ? this.mapEtraParams : "";
}

//http://developer.baidu.com/map/staticimg.htm
//https://developers.google.com/maps/documentation/staticmaps/?hl=zh-CN&csw=1

UIStaticMap.prototype.getMapURL = function() {
	var url = "";
	if(this.mapProvider === "baidu") {
		url = "http://api.map.baidu.com/staticimage?center="+this.getMapCenter()
			+ "&width=" + this.getMapWidth()
			+ "&height="+ this.getMapHeight()
			+ "&zoom=" + this.getMapZoom()
			+ this.getMapExtraParams();
	}
	else if(this.mapProvider === "google"){
		url = "http://maps.googleapis.com/maps/api/staticmap?center="+this.getMapCenter()
			+ "&size=" + this.getMapWidth() + "x"+this.getMapHeight()
			+ "&zoom=" + this.getMapZoom()
			+ "&maptype=" + this.getMapType() + "&sensor=true"
			+ this.getMapExtraParams();
	}

	console.log("Map URL:" + url);

	return url;
}

UIStaticMap.prototype.updateMap = function() {
	var url = this.getMapURL();

	this.setImageSrc(url);

	return;
}

UIStaticMap.prototype.onInit = function() {
	var map = this;
	
	function onCurrentLocation(position) {
		map.currentLocation = position.coords.latitude+","+position.coords.longitude;
		map.updateMap();

		return;
	}

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(onCurrentLocation);
	}
	this.updateMap();

	return;
}

UIStaticMap.prototype.drawImage =function(canvas) {

	this.drawBgImage(canvas);

	return;
}

function UIStaticMapCreator() {
	var args = ["ui-static-map", "ui-static-map", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIStaticMap();
		return g.initUIStaticMap(this.type);
	}
	
	return;
}
	
ShapeFactoryGet().addShapeCreator(new UIStaticMapCreator());

/*
 * File:   ui-status-bar.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Status Bar 
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIStatusBar() {
	return;
}

UIStatusBar.prototype = new UIElement();
UIStatusBar.prototype.isUIStatusBar = true;

UIStatusBar.prototype.initUIStatusBar = function(type, w, h, bg) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, bg);
	this.images.display = UIElement.IMAGE_DISPLAY_SCALE;
	this.widthAttr = UIElement.WIDTH_FILL_PARENT;

	return this;
}

UIStatusBar.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUILabel || shape.isUIImage || shape.isUIButton) {
		return true;
	}

	return false;
}

UIStatusBar.prototype.afterChildAppended = function(shape) {
	shape.yAttr = UIElement.Y_MIDDLE_IN_PARENT;
	if(this.type === "ui-menu-bar") {
		shape.hideSelectMark = true;
		shape.textType = Shape.TEXT_NONE;
		this.hideSelectMark = true;
	}

	return true;
}

UIStatusBar.prototype.beforeRelayoutChild = function(shape) {
	shape.yAttr = UIElement.Y_MIDDLE_IN_PARENT;

	return true;
}

function UIStatusBarCreator(type, w, h, bg) {
	var args = [type, "ui-status-bar", null, true];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIStatusBar();
		return g.initUIStatusBar(this.type, w, h, bg);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIStatusBarCreator("ui-status-bar", 640, 40, null));
ShapeFactoryGet().addShapeCreator(new UIStatusBarCreator("ui-menu-bar", 640, 96, null));


/*
 * File:   ui-unkown.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  There are two conditions that shape factory can not find creator for a type: 
 *           1.The creator is not loaded yet.
 *           2.There is not such creator.
 *         For the first condition, we create a proxy first, try it create the real element later.
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIUnkown() {
	return;
}

UIUnkown.prototype = new UIElement();
UIUnkown.prototype.isUIUnkown = true;

UIUnkown.prototype.initUIUnkown = function(type) {
	this.initUIElement(type);	

	return this;
}

function UIUnkownCreator() {
	var args = ["ui-unkown", "ui-unkown", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIUnkown();
		return g.initUIUnkown(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIUnkownCreator());

/*
 * File:   ui-suggestion.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Suggestion Input
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function SuggestionProvider() {
	this.query = function(key, onDone) {
	}

	this.init = function(options) {
	}

	return;
}

function StaticSuggestionProvider() {
	this.init = function(options) {
		if(typeof options == "string") {
			options = options.split("\n");
		}

		this.options = options;
		if(this.options) {
			this.options.sort();
		}

		return;
	}

	this.query = function(key, onDone) {
		if(!key || !this.options) {
			onDone([]);
			return;
		}

		function compareStr(str1, str2) {
			if(str1.indexOf(str2) == 0) {
				return 0;
			}

			if(str1 < str2) {
				return -1;
			}
			else {
				return 1;
			}
		}

		var arr = [];
		var start = this.options.binarySearch(key, compareStr);
		
		if(start >= 0) {
			var n = this.options.length;
			
			for(;start >= 0; start--) {
				var iter = this.options[start];
				if(iter.indexOf(key) !== 0) {
					start = start+1;
					break;
				}
			}

			for(var i = start; i < n; i++) {
				var iter = this.options[i];
				if(iter.indexOf(key) === 0) {
					arr.push(iter);
				}
				else {
					break;
				}
			}
		}

		onDone(arr);

		return;
	}

	return;
}

function createSuggestionProvider(type, args) {
	var suggestionProvider = null;
	if(type === "static") {
		suggestionProvider = new StaticSuggestionProvider();
	}

	if(suggestionProvider) {
		suggestionProvider.init(args);
	}

	return suggestionProvider;
}

function UISuggestion() {
	return;
}

UISuggestion.prototype = new UIListView();
UISuggestion.prototype.isUISuggestion = true;

UISuggestion.prototype.initUISuggestion = function(type) {
	this.initUIListView(type, 5, 100, null);	
	this.maxSuggestionItems = 10;
	this.suggestionProviderParams = "";
	this.suggestionProviderName = "static";

	return this;
}

UISuggestion.prototype.onInit = function() {
	this.suggestionProvider = createSuggestionProvider(this.suggestionProviderName, this.suggestionProviderParams);

	return;
}

UISuggestion.prototype.setSuggestionProvider = function(suggestionProvider) {
	this.suggestionProvider = suggestionProvider;

	return;
}

UISuggestion.prototype.getSuggestionProvider = function() {
	return this.suggestionProvider;
}

//override this.
UISuggestion.prototype.onSuggestionSelected = function(str) {

}

UISuggestion.prototype.showSuggestion = function(suggestions) {
	var data = {children:[]};
	
	if(suggestions.length > this.maxSuggestionItems) {
		suggestions.length = this.maxSuggestionItems;
	}

	for(var i = 0; i < suggestions.length; i++) {
		var item = {children:[]};
		var value = suggestions[i];
		item.children.push({text: value});
		data.children.push(item);
	}
		
	this.bindData(data, null, true);

	return;

}

UISuggestion.prototype.onSuggestionShow = function() {
}

UISuggestion.prototype.query = function(key) {
	var me = this;
	this.suggestionProvider.query(key, function(arr) {
		me.showSuggestion(arr);
		me.onSuggestionShow();
	});
}

function UISuggestionCreator() {
	var args = ["ui-suggestion", "ui-suggestion", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISuggestion();
		return g.initUISuggestion(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UISuggestionCreator());

/*
 * File:   ui-button.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Button
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIButton
 * @extends UIElement
 * 按钮。被点击后触发一个回调函数。可以设置按钮在不同状态下的图片。
 *
 * * UIElement.IMAGE_NORMAL 正常时的图片。
 * * UIElement.IMAGE_ACTIVE 按下时的图片。
 * * UIElement.IMAGE_FOCUSED 得到焦点时的图片。
 * * UIElement.IMAGE_DISABLE 禁用时的图片。
 * * "option_image_0" 备用图片0
 * * "option_image_1" 备用图片1
 * * "option_image_2" 备用图片2
 * * "option_image_3" 备用图片3
 * ...
 * * "option_image_14" 备用图片14
 *
 * 注：备用图片在IDE的图片属性页的图片用途里显示为"图片_X"
 *
 */

function UIButton() {
	return;
}

UIButton.prototype = new UIElement();
UIButton.prototype.isUIButton = true;

UIButton.prototype.initUIButton = function(type, w, h) {
	this.initUIElement(type);	

	this.setMargin(5, 5);
	this.setDefSize(w, h);
	this.setSizeLimit(20, 20);
	this.setAutoScaleFontSize(true);
	this.setTextType(Shape.TEXT_INPUT);
	this.images.display = UIElement.IMAGE_DISPLAY_9PATCH;
	this.setImage(UIElement.IMAGE_ACTIVE, null);
	this.setImage(UIElement.IMAGE_NORMAL, null);
	this.setImage(UIElement.IMAGE_DISABLE, null);
	this.setImage("option_image_0", null);
	this.setImage("option_image_1", null);
	this.setImage("option_image_2", null);
	this.setImage("option_image_3", null);
	this.setImage("option_image_4", null);
	this.setImage("option_image_5", null);
	this.setImage("option_image_6", null);
	this.setImage("option_image_7", null);
	this.setImage("option_image_8", null);
	this.setImage("option_image_9", null);
	this.setImage("option_image_10", null);
	this.setImage("option_image_11", null);
	this.setImage("option_image_12", null);
	this.setImage("option_image_13", null);
	this.setImage("option_image_14", null);
	this.addEventNames(["onUpdateTransform"]); 

	return this;
}

UIButton.prototype.shapeCanBeChild = UIGroup.prototype.shapeCanBeChild;

UIButton.prototype.paintSelfOnly =function(canvas) {
	if(this.pointerDown) {
		var image = this.getHtmlImageByType(UIElement.IMAGE_ACTIVE);

		if(!image) {
			canvas.fillStyle = this.style.fillColor;
			canvas.fillRect(0, 0, this.w, this.h);
		}
	}

	return;
}

function UIButtonCreator(w, h) {
	var args = ["ui-button", "ui-button", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIButton();
		return g.initUIButton(this.type, w, h);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIButtonCreator(120, 60));

/*
 * File:   ui-mledit.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Multi Line Editor
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIMLEdit
 * @extends UIElement
 * 多行编辑器。
 */

/**
 * @event onChanged
 * 文本变化时触发本事件。
 * @param {String} value 当前的文本。
 */

/**
 * @event onFocusIn
 * 得到输入焦点事件。
 */

/**
 * @event onFocusOut
 * 失去输入焦点事件。
 */
function UIMLEdit() {
	return;
}

UIMLEdit.prototype = new UIElement();
UIMLEdit.prototype.isUIMLEdit = true;

UIMLEdit.prototype.saveProps = ["inputTips"];
UIMLEdit.prototype.initUIMLEdit = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setText("");
	this.setTextType(Shape.TEXT_TEXTAREA);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.setImage(UIElement.IMAGE_FOCUSED, null);
	this.setMargin(12, 12);
	this.addEventNames(["onChanged", "onFocusIn", "onFocusOut"]);
	this.setTextAlignV("top");
	this.setTextAlignH("left");

	return this;
}

UIMLEdit.prototype.drawText = function(canvas) {
	if(!this.text || this.editing) {
		return;
	}

	if(this.textNeedRelayout) {
		this.layoutText(canvas);	
	}

	return this.defaultDrawText(canvas);
}

UIMLEdit.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIMLEdit.prototype.textEditable = function(point) {
	return true;
}

UIMLEdit.prototype.onClick = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}
	if(!this.isInDesignMode()) {
		this.editText();
	}

    return this.callOnClickHandler(point);
}

UIMLEdit.prototype.isFocused = function() {
	return this.editing;
}

UIMLEdit.prototype.getEditorRect = function() {
	var p = this.getPositionInView();
	var cp = CantkRT.getMainCanvasPosition();
	var vp = this.view.getAbsPosition();
	var scale = this.view.getViewScale();

	var canvasScale = UIElement.getMainCanvasScale();
	var x = (vp.x + p.x * scale)/canvasScale.x + cp.x;
	var y = (vp.y + p.y * scale)/canvasScale.y + cp.y;
	var w = (this.getWidth() * scale)/canvasScale.x;
	var h = (this.getHeight() * scale)/canvasScale.y;
	
	var rect = {x:x, y:y, w:w, h:h};
	if(this.isInDesignMode()) {
		var radtio = window.devicePixelRatio || 1;
		rect.x *= radtio;
		rect.y *= radtio;
		rect.w *= radtio;
		rect.h *= radtio;
	}

	return rect;
}

UIMLEdit.prototype.editText = function(point) {
	if(this.textEditable(point)) {
		var shape = this;
		var rect = this.getEditorRect();
		var scale = this.getRealScale() / UIElement.getMainCanvasScale().y;
		var inputType = this.inputType ? this.inputType : "text";
		var fontSize = this.style.fontSize * scale; 
		var editor = cantkShowTextArea(this.getText(), fontSize, rect.x, rect.y, rect.w, rect.h);
		
		shape.editing = true;
		editor.setTextColor(this.style.textColor);
		editor.showBorder(this.isInDesignMode());
	    editor.show();	
        function onChanged(text) {
			if(text !== shape.text) {
				shape.setText(text, true);
				shape.postRedraw();
			}
			else {
				shape.text = text;
			}
			
			editor.setOnChangedHandler(null);
	        editor.setOnChangeHandler(null);
			editor.hide();
			delete shape.editing;
			shape.callOnFocusOutHandler();

			return;
		}

		function onChange(text) {
			shape.callOnChangingHandler(text);
		}

		editor.setOnChangedHandler(onChanged);
		editor.setOnChangeHandler(onChange);
		
		this.callOnFocusInHandler();
	}

	return;
}

UIMLEdit.prototype.getTextTipsPosition = function() {
	var pos = {};

	pos.x = this.hMargin;
	pos.y = this.vMargin;
	pos.textAlign = "left";
	pos.textBaseline = "top";

	return pos;
}

function UIMLEditCreator(w, h) {
	var args = ["ui-mledit", "ui-mledit", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIMLEdit();
		return g.initUIMLEdit(this.type, w, h);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIMLEditCreator(300, 300));

/*
 * File:   ui-toolbar.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Toolbar
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIToolBar
 * @extends UIElement
 * 通常是放在窗口的顶部或底部的一个容器，里面放窗口的标题和导航的按钮。
 *
 */
function UIToolBar() {
	return;
}

UIToolBar.prototype = new UIElement();
UIToolBar.prototype.isUIToolBar = true;

UIToolBar.prototype.initUIToolBar = function(type, atTop, h, bg) {
	this.initUIElement(type);	

	this.xAttr = UIElement.X_LEFT_IN_PARENT;
	this.widthAttr = UIElement.WIDTH_FILL_PARENT;
	this.yAttr = atTop ? UIElement.Y_TOP_IN_PARENT : UIElement.Y_BOTTOM_IN_PARENT;

	this.setDefSize(200, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, bg);
	this.setSizeLimit(100, 50, 2000, 200);

	return this;
}

UIToolBar.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUILabel || shape.isUIImage || shape.isUIButton || shape.isUIGroup 
	|| shape.isUIButtonGroup || shape.isUIEdit || shape.isUIImageButton
	|| shape.isUICheckBox || shape.isUIRadioBox || shape.isUIProgressBar || shape.isUISwitch 
	|| shape.isUILedDigits || shape.isUIGroup || shape.isUILayout || shape.isUIWaitBar || shape.isUIColorBar) {
		return true;
	}

	return false;
}

UIToolBar.prototype.paintSelfOnly =function(canvas) {
	var image = this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);

	if(!image) {
		canvas.beginPath();
		canvas.fillStyle = this.style.fillColor;
		canvas.fillRect(0, 0, this.w, this.h);
	}

	return;
}

function UIToolBarCreator(type, atTop, h, bg) {
	var args = [type, "ui-toolbar", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIToolBar();
		return g.initUIToolBar(type, atTop, h, bg);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIToolBarCreator("ui-toolbar", true, 85, null));

/*
 * File:   ui-placeholder.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Place Holder
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIPlaceholder() {
	return;
}

UIPlaceholder.prototype = new UIElement();
UIPlaceholder.prototype.isUIPlaceholder = true;
UIPlaceholder.prototype.initUIPlaceholder = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setCanRectSelectable(false, false);

	return this;
}

UIPlaceholder.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIPlaceholder.prototype.paintSelfOnly = function(canvas) {
	if(this.isInDesignMode()) {
		var x = this.vMargin;
		var y = this.hMargin;
		var w = this.getWidth(true);
		var h = this.getHeight(true);

		canvas.lineWidth = this.style.lineWidth;
		canvas.strokeStyle = this.style.lineColor;
		drawDashedRect(canvas, x, y, w, h);
		canvas.stroke();
	}

	return;
}

function UIVPlaceholderCreator(w, h) {
	var args = ["ui-v-placeholder", "ui-placeholder", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPlaceholder();

		g.initUIPlaceholder(this.type, w, h);
		g.widthAttr = UIElement.WIDTH_FILL_PARENT;
		g.MIN_SIZE = 4;
		g.setSizeLimit(20, 4);

		return g;
	}
	
	return;
}

function UIHPlaceholderCreator(w, h) {
	var args = ["ui-h-placeholder", "ui-placeholder", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPlaceholder();

		g.initUIPlaceholder(this.type, w, h);
		g.heightAttr = UIElement.HEIGHT_FILL_PARENT;
		g.MIN_SIZE = 4;
		g.setSizeLimit(4, 20);

		return g;
	}
	
	return;
}
	
ShapeFactoryGet().addShapeCreator(new UIVPlaceholderCreator(100, 20));
ShapeFactoryGet().addShapeCreator(new UIHPlaceholderCreator(20, 100));

/*
 * File:   ui-radio-box.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Radio Box
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIRadioBox
 * @extends UICheckBox
 * 单选按钮。可以用setValue来勾选/去勾选，用getValue来判断是否勾选。
 *
 */
function UIRadioBox() {
	return;
}

UIRadioBox.prototype = new UICheckBox();
UIRadioBox.prototype.isUIRadioBox = true;

UIRadioBox.prototype.initUIRadioBox = function(type) {
	return this.initUICheckBox(type)
}

UIRadioBox.prototype.setParent = function(parentShape) {
	UIElement.prototype.setParent.call(this, parentShape);

	if(this.value) {
		this.setChecked();
	}

	return this;
}

UIRadioBox.prototype.onFromJsonDone = function() {
	if(this.value) {
		this.setChecked();
	}

	return this;
}

UIRadioBox.prototype.setChecked = function() {
	var parentShape = this.getParent();

	if(parentShape) {
		for(var i = 0; i < parentShape.children.length; i++) {
			var shape = parentShape.children[i];
			if(shape.isUIRadioBox) {
				shape.setValue(false);
			}
		}
	}

	this.setValue(true);

	return this;
}

UIRadioBox.prototype.onClick = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}
	
	this.setChecked();
	
	return this.callOnClickHandler(point);
}

function UIRadioBoxCreator(w, h) {
	var args = ["ui-radiobox", "ui-radiobox", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIRadioBox();
		g.initUIRadioBox(this.type);

		return g;
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIRadioBoxCreator(50, 50, null, null, null, null, null, null));

/*
 * File:   ui-led-digits.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  LED Digits 
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
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
	this.setTextType(Shape.TEXT_NONE);

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

ShapeFactoryGet().addShapeCreator(new UILedDigitsCreator(100, 100));

/*
 * File:   ui-canvas.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Canvas
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UICanvas
 * @extends UIElement
 * 画布控件。
 *
 * 注意：UICanvas其实与其它控件共享一个画布，只是把画布的接口暴露出来，所以每次窗口重绘时，里面的内容都被清除，需要重新绘制。
 *
 */

/**
 * @event onPaint(canvas2dCtx) 
 * 绘图事件。
 * @param {Object} canvas2dCtx 画布的2d Context。
 * 参考：[https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
 *
 *     @example small frame
 *     var image = this.getImageByType(0);
 *     var img = image.getImage();
 *     var rect = image.getImageRect();
 *
 *     canvas2dCtx.drawImage(img, rect.x, rect.y, rect.w, rect.h, 0, 0, this.w, this.h);
 *
 *     canvas2dCtx.moveTo(0, 0);
 *     canvas2dCtx.lineTo(this.w, this.h);
 *     canvas2dCtx.lineWidth = 2;
 *     canvas2dCtx.strokeStyle = "red";
 *     canvas2dCtx.stroke();
 *
 */

function UICanvas() {
	return;
}

UICanvas.prototype = new UIElement();
UICanvas.prototype.isUICanvas = true;

UICanvas.prototype.initUICanvas = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.addEventNames(["onPaint", "onPointerDown", "onPointerMove", "onPointerUp", "onKeyDown", 
		"onKeyUp"]);

	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.setImage("option_image_0", null);
	this.setImage("option_image_1", null);
	this.setImage("option_image_2", null);
	this.setImage("option_image_3", null);
	this.setImage("option_image_4", null);
	this.setImage("option_image_5", null);
	this.setImage("option_image_6", null);
	this.setImage("option_image_7", null);
	this.setImage("option_image_8", null);
	this.setImage("option_image_9", null);
	this.setImage("option_image_10", null);
	this.setImage("option_image_11", null);
	this.setImage("option_image_12", null);
	this.setImage("option_image_13", null);
	this.setImage("option_image_14", null);
	
	return this;
}

UICanvas.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIImage || shape.isUIButton || shape.isUIGroup || shape.isUILabel;
}

UICanvas.prototype.paintSelfOnly = function(canvas) {
	var image = this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);
	
	if(!image && !this.isFillColorTransparent()) {
		canvas.beginPath();
		canvas.fillStyle = this.style.fillColor;
		canvas.fillRect(0, 0, this.w, this.h);
	}

	canvas.beginPath();
	this.callOnPaintHandler(canvas);

	return;
}

function UICanvasCreator(w, h) {
	var args = ["ui-canvas", "ui-canvas", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UICanvas();
		return g.initUICanvas(this.type, w, h);
	}
	
	return;
}
	
ShapeFactoryGet().addShapeCreator(new UICanvasCreator(200, 200));

/*
 * File:   ui-color-button.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Color Button
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIColorButton
 * @extends UIElement
 * 颜色按钮。不同状态下可以设置不同的颜色，可以是矩形，圆角矩形或圆形。
 *
 */

/**
 * @property {Number} roundRadius
 * 控件的圆角半径。0表示不圆角。
 */

function UIColorButton() {
	return;
}

UIColorButton.prototype = new UIElement();
UIColorButton.prototype.isUIButton = true;
UIColorButton.prototype.isUIColorButton = true;

UIColorButton.prototype.initUIColorTile = function(type, w, h) {
	this.initUIColorButton(type, w, h);
	this.isUIButton = false;
	this.isUIColorButton = false;
	this.isUIColorTile = true;
	this.setAutoScaleFontSize(true);
	this.addEventNames(["onUpdateTransform"]); 
	this.style.roundStyle = 'a';

	return this;
}

UIColorButton.prototype.initUIColorButton = function(type, w, h) {
	this.initUIElement(type);	

	this.roundRadius = 5;
	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_INPUT);
	this.setCanRectSelectable(false, false);
	this.setMargin(0, 0);
	this.addEventNames(["onUpdateTransform"]); 

	return this;
}

UIColorButton.prototype.shapeCanBeChild = UIGroup.prototype.shapeCanBeChild;

/**
 * @method setRoundStyle
 * 设置控件的圆角风格。
 * @param {String} roundStyle 圆角风格。'l'表示左边圆角, 'r'表示右边圆角, 't'表示顶部圆角, 'b'表示底部圆角, 'a'表示全部圆角。
 * @return {UIElement} 返回控件本身。
 *
 */
UIColorButton.prototype.setRoundStyle = function(roundStyle) {
	this.style.roundStyle = roundStyle;

	return this;
}

/**
 * @method getRoundStyle
 * 获取控件的圆角风格。
 * @return {UIElement} 返回圆角风格。
 *
 */
UIColorButton.prototype.getRoundStyle = function() {
	return this.style.roundStyle;
}

/**
 * @method setActiveFillColor
 * 设置控件按下时的填充颜色。
 * @param {String} color 颜色。
 * @return {UIElement} 返回控件本身。
 */
UIColorButton.prototype.setActiveFillColor = function(color) {
	this.style.activeFillColor = color;
	
	return this;
}

UIColorButton.prototype.getRoundStyleValue =function() {
	var roundStyle = this.style.roundStyle;

	if(roundStyle === 't') {
		return RoundRect.TL | RoundRect.TR;
	}
	else if(roundStyle === 'l') {
		return RoundRect.TL | RoundRect.BL;
	}
	else if(roundStyle === 'r') {
		return RoundRect.TR | RoundRect.BR;
	}
	else if(roundStyle === 'b') {
		return RoundRect.BL | RoundRect.BR;
	}
	else {
		return RoundRect.TL | RoundRect.TR | RoundRect.BL | RoundRect.BR; 
	}
}

UIColorButton.prototype.paintSelfOnly =function(canvas) {
	var roundStyle = this.getRoundStyleValue();
	var fillColor = this.style.fillColor;
	var lineColor = this.style.lineColor;

	if(this.pointerDown && this.style.activeFillColor) {
		fillColor = this.style.activeFillColor;
	}

	var fillIt = !Shape.isTransparentColor(fillColor);
	var strokeIt = !Shape.isTransparentColor(lineColor);
		
	if(!fillIt && !strokeIt) {
		return;
	}

	canvas.save();
	canvas.beginPath();

	canvas.translate(this.hMargin, this.vMargin);
	drawRoundRect(canvas, this.w-2*this.hMargin, this.h-2*this.vMargin, this.roundRadius, roundStyle);

	if(fillIt) {
		canvas.fillStyle = fillColor;
		canvas.fill();
	}

	if(strokeIt) {
		if(this.isUIColorButton && this.pointerDown) {
			canvas.lineWidth = this.style.lineWidth + 1;
		}
		else {
			canvas.lineWidth = this.style.lineWidth;
		}

		canvas.strokeStyle = lineColor;
		canvas.stroke();
	}

	canvas.restore();

	return;
}

function UIColorTileCreator(w, h) {
	var args = ["ui-color-tile", "ui-color-tile", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIColorButton();

		return g.initUIColorTile(this.type, w, h);
	}
	
	return;
}

function UIColorButtonCreator(w, h) {
	var args = ["ui-color-button", "ui-color-button", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIColorButton();

		return g.initUIColorButton(this.type, w, h);
	}
	
	return;
}

/**
 * @class UIColorTile
 * @extends UIColorButton
 * 颜色块，可以是矩形，圆角矩形或圆形。
 *
 */
ShapeFactoryGet().addShapeCreator(new UIColorTileCreator(80, 80));
ShapeFactoryGet().addShapeCreator(new UIColorButtonCreator(80, 80));

/*
 * File:   ui-view-pager.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  View Page (AKA Tab Control)
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIViewPager
 * @extends UIFrames
 * 标签控件。
 *
 */
function UIViewPager() {
	return;
}

UIViewPager.prototype = new UIPageManager();
UIViewPager.prototype.isUIViewPager = true;

UIViewPager.prototype.saveProps = ["slideToChange"];
UIViewPager.prototype.initUIViewPager = function(type) {
	this.initUIPageManager(type);	

	this.current = 0;
	this.setDefSize(200, 200);
	this.setTextType(UIElement.TEXT_NONE);
	this.velocityTracker = new VelocityTracker();
	this.interpolator =  new DecelerateInterpolator(2);
    this.animateQueue = [];

	return this;
}

UIViewPager.prototype.getPrevFrame = function() {
	var n = this.children.length;
	var index = (this.current - 1 + n)%n;

	return this.children[index];
}

UIViewPager.prototype.getNextFrame = function() {
	var n = this.children.length;
	var index = (this.current + 1)%n;

	return this.children[index];
}

UIViewPager.prototype.animScrollTo = function(range, newFrame) {

	var duration = 1000;
	var slideview = this;
	var startOffset = this.offset;
	var startTime = Date.now();
	var interpolator = this.interpolator;

	if(slideview.animating) {
		return;
	}

	slideview.animating = true;
	function animStep() {
		var now = Date.now();
		var timePercent = (now - startTime)/duration;
		var percent = interpolator.get(timePercent);
		
		if(timePercent < 1 && !slideview.halt) {
			slideview.offset = startOffset + range * percent;
			setTimeout(animStep, 16);
		}
		else {
			slideview.offset = 0;
			slideview.setCurrent(newFrame);
			slideview.setAnimatingFrames(null, null);

			delete startTime;
			delete interpolator;
			delete slideview.animating;
            delete slideview.halt;
            
            slideview.queueAnimation();
		}

		slideview.postRedraw();
	}

	animStep();

	return;
}

UIViewPager.prototype.onPointerDownRunning = function(point, beforeChild) {
	if(beforeChild || this.animating || !this.slideToChange) {
		return;
	}
	
	if(this.isEventHandledByChild()) {
		return;
	}
	this.setEventHandled();

	this.velocityTracker.clear();

	return true;
}

UIViewPager.prototype.isEventHandledByChild = function() {
	if(UIElement.hScrollHandledBy && UIElement.hScrollHandledBy !== this) {
		return true;
	}else{
		return false;
	}
}

UIViewPager.prototype.setEventHandled = function() {
	UIElement.hScrollHandledBy = this;

	return this;
}

UIViewPager.prototype.onPointerMoveRunning = function(point, beforeChild) {
	if(!this.slideToChange || beforeChild || !this.pointerDown) {
		return;
	}

	if(this.animating) {
		this.setEventHandled();
		return;
	}

	if(this.isEventHandledByChild()) {
		return;
	}

	var frames = this.getFrames();
	var currFrame = this.current;
	var dx = this.getMoveAbsDeltaX();
	if((currFrame > 0 && dx > 0) || ((currFrame+1) < frames && dx < 0)) {
		this.setEventHandled();
	}
	else {
		return;
	}

	var dx = Math.abs(this.getMoveAbsDeltaX());
	var dy = Math.abs(this.getMoveAbsDeltaY());
	
	if(dx > dy && dx > 10) {
		this.offset = this.getMoveAbsDeltaX();
		this.setAnimatingFrames(this.getPrevFrame(), this.getNextFrame());
	}
	else {
		this.offset = 0;
		this.setAnimatingFrames(null, null);
	}

	this.addMovementForVelocityTracker();

	return;
}
	
UIViewPager.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(!this.slideToChange || beforeChild || !this.pointerDown) {
		return;
	}

	if(this.animating) {
		this.setEventHandled();
		return;
	}
	if(this.isEventHandledByChild()) {
		return;
	}

	var frames = this.getFrames();
	var currFrame = this.current;
	var dx = this.getMoveAbsDeltaX();
	if((currFrame > 0 && dx > 0) || ((currFrame+1) < frames && dx < 0)) {
		this.setEventHandled();
	}
	else {
		return;
	}

	var range = 0;
	var offsetX = this.offset;
	var newFrame = this.current;
	var dy = Math.abs(this.getMoveAbsDeltaY());
	var velocity = this.velocityTracker.getVelocity().x;

	if(Math.abs(offsetX) < 5 || dy > 60) {
		this.offset = 0;

		return;
	}

	var n = this.children.length;
	var distance = offsetX + velocity;

	if(Math.abs(distance) > this.w/3) {
		if(offsetX > 0) {
			range = this.w - offsetX;	
			newFrame = (this.current - 1 + n)%n;
		}
		else {
			range = -this.w - offsetX;
			newFrame = (this.current + 1)%n;
		}
	}
	else {
		range = -offsetX;
	}

	this.animScrollTo(range, newFrame);

	return;
}

UIViewPager.prototype.setAnimatingFrames = function(leftFrame, rightFrame) {
	this.leftFrame = leftFrame;
	this.rightFrame = rightFrame;

	return this;
}

/**
 * @method switchTo 
 * 设置当前显示的子控件。
 * @param {Number} index 子控件的索引，与setCurrent不同是，switchTo有切换动画。
 * @return {UIElement} 返回控件本身。
 *
 */
UIViewPager.prototype.switchTo = function(index) {
	var arr = this.children;
	var n = arr.length;
	
	this.offset = 0;
    if(index < 0 || index > n - 1) {
        return;
    }
    
    if(this.animateQueue === undefined) {
        this.animateQueue = [];
    } 
    this.animateQueue.push(index);
    
    if(this.animating) {
        console.log("busy...");
        this.halt = true;
        return;
    }
   
    this.queueAnimation();

	return this;
}

UIViewPager.prototype.queueAnimation = function() {
    if(this.animateQueue.length < 1) {
        return;
    }
	var arr = this.children;
    var index = this.animateQueue.pop();
    this.animateQueue = [];
    var newFrame = arr[index];
    if(index < this.current) {
        this.animScrollTo(this.w, index);
        this.setAnimatingFrames(newFrame, null);
    }else{
        this.animScrollTo(-this.w, index);
        this.setAnimatingFrames(null, newFrame);
    }
}

UIViewPager.prototype.paintChildrenAnimating = function(canvas) {
	var currFrame = this.getCurrentFrame();
	var prevFrame = this.leftFrame;
	var nextFrame = this.rightFrame;

	canvas.save();
	canvas.clipRect(0, 0, this.w, this.h);

	if(this.offset > 0) {
		var offsetX = this.w-this.offset;
		prevFrame.x = -offsetX;
		prevFrame.paintSelf(canvas);
		offsetX = this.offset;
		currFrame.x = offsetX;
		currFrame.paintSelf(canvas);
	}
	else {
		currFrame.x = this.offset;
		currFrame.paintSelf(canvas);
		nextFrame.x = this.w + this.offset;
		nextFrame.paintSelf(canvas);
	}
	if(currFrame) {
		currFrame.x = 0;
	}
	if(nextFrame) {
		nextFrame.x = 0;
	}
	if(prevFrame) {
		prevFrame.x = 0;
	}

	canvas.restore();

	return;
}

UIViewPager.prototype.paintChildrenNormal = function(canvas) {
	var child = this.getCurrentFrame();
	
	if(child) {
		canvas.save();
		canvas.beginPath();
		child.paintSelf(canvas);
		canvas.restore();
	}
	
	return;
}

UIViewPager.prototype.paintChildren = function(canvas) {
	if(this.offset && this.children.length > 1 && (this.leftFrame || this.rightFrame)) {
		this.paintChildrenAnimating(canvas);
	}
	else {
		this.paintChildrenNormal(canvas);
	}

	return;
}

UIViewPager.prototype.setSlideToChange = function(value) {
	this.slideToChange = value;

	return;
}

function UIViewPagerCreator() {
	var args = ["ui-view-pager", "ui-view-pager", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIViewPager();

		return g.initUIViewPager(this.type);
	}
	
	return;
}
	
ShapeFactoryGet().addShapeCreator(new UIViewPagerCreator());

/*
 * File:   ui-progressbar.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Slider/ProgressBar
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UISlider
 * @extends UIProgressBar 
 * 新版本中UISlider已经被弃用，API参见UIProgressBar
 *
 */

/**
 * @class UIProgressBar
 * @extends UIElement
 * 进度条。可以用setValue/getValue来设置/获取进度。缺省进度取值范围0-100，也可以用setRange来设置它的取值范围。
 *
 * 在进度条上放一张图片，可以把进度条变成一个滑块控件。
 *
 * 进度条有3种表现形式：
 * 
 * 1.宽度大于高度时为水平进度条。

 * 2.宽度小于高度时为垂直进度条。
 * 
 * 3.宽度约等于高度时为环状进度条。
 *
 *     @example small frame
 *     this.win.find("progressbar").setValue(50, true, true);
 *
 */

/**
 * @event onChanged
 * 进度变化时触发本事件。
 * @param {Number} value 当前的进度。
 */

/**
 * @event onChanging
 * 进度正在变化时触发本事件。只有做为滑块控件时，拖动滑块才会触发本事件。
 * @param {Number} value 当前的进度。
 */
function UIProgressBar() {
	return;
}

UIProgressBar.prototype = new UIElement();
UIProgressBar.prototype.isUIProgressBar = true;
UIProgressBar.prototype.saveProps = ["stepSize", "minValue", "maxValue"];
UIProgressBar.prototype.initUIProgressBar = function(type, w, h, interactive) {
	this.initUIElement(type);	

	this.setRange(0, 100);
	this.setPercent(50);
	this.setDefSize(w, h);
	this.setStepSize(0);
	this.roundRadius = 0;
	this.setInteractive(interactive);
	this.setTextType(Shape.TEXT_INPUT);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.setImage(UIElement.IMAGE_NORMAL_FG, null);
	this.images.display = UIElement.IMAGE_DISPLAY_9PATCH;

	if(interactive) {
		this.addEventNames(["onChanged"]);
		this.addEventNames(["onChanging"]);
	}

	return this;
}

UIProgressBar.prototype.shapeCanBeChild = function(shape) {
	if(this.dragger) {
		return false;
	}

	return (shape.isUIImage || shape.isUILabel || shape.isUIColorTile);
}

UIProgressBar.prototype.updateDraggerParams =function() {
	var shape = this.dragger;
	if(!shape) return;

	if(this.w < this.h) {
		shape.yAttr = UIElement.Y_FIX_TOP;
		shape.xAttr = UIElement.X_CENTER_IN_PARENT;
		shape.widthAttr = UIElement.WIDTH_FILL_PARENT;
		shape.heightAttr = UIElement.HEIGHT_FIX;
	}
	else {
		shape.yAttr = UIElement.Y_MIDDLE_IN_PARENT;
		shape.xAttr = UIElement.X_FIX_LEFT;
		shape.widthAttr = UIElement.WIDTH_FIX;
		shape.heightAttr = UIElement.HEIGHT_FILL_PARENT;
	}
}

UIProgressBar.prototype.relayoutChildren = function() {
	if(!this.dragger) {
		return;
	}

	if(this.w > this.h) {
		var x = this.value * (this.w - this.dragger.w);	
		var maxX = this.w - this.dragger.w;
		this.dragger.setLeft(Math.max(0, Math.min(maxX, x)));
	}
	else {
		var y = (1-this.value) * (this.h - this.dragger.h);
		var maxY = this.h - this.dragger.h;
		this.dragger.setTop(Math.max(0, Math.min(maxY, y)))
	}

	UIElement.prototype.relayoutChildren.call(this);

	return;
}

UIProgressBar.prototype.resizeDragger =function() {
	if(this.dragger) {
		var w = this.dragger.w;
		var h = this.dragger.h;
		if(this.w > this.h) {
			h = this.h;
			w = Math.min(this.h, w);
		}
		else {
			w = this.w;
			h = Math.min(this.w, h);
		}
		this.dragger.setSize(w, h);
	}

	return this;
}

/**
 * @method setStepSize
 * 设置Slider的步长。
 * @param {Number} stepSize 取值范围0-50，0表示平滑移动。
 * @return {UIElement} 返回控件本身。
 *
 * 示例：
 *
 *     @example small frame
 *     var win = this.win;
 *     var slider = win.find("slider");
 *     slider.setStepSize(20);
 */
UIProgressBar.prototype.setStepSize = function(stepSize) {
	var range = this.maxValue - this.minValue;
	this.stepSize = Math.max(0, Math.min(stepSize, range));

	return this;
}

/**
 * @method setRange 
 * 设置进度条的取值范围。
 * @param {Number} minValue 最小值。
 * @param {Number} maxValue 最大值。
 * @return {UIElement} 返回控件本身。
 *
 * 示例：
 *
 *     @example small frame
 *     var win = this.win;
 *     var slider = win.find("slider");
 *     slider.setRange(0, 5);
 *     slider.setStepSize(1);
 */
UIProgressBar.prototype.setRange = function(minValue, maxValue) {
	this.minValue = Math.max(0, Math.min(minValue, maxValue));
	this.maxValue = Math.max(0, Math.max(minValue, maxValue));

	if(this.minValue === this.maxValue) {
		this.minValue = 0;
		this.maxValue = 100;
	}

	return this;
}

/**
 * @method getStepSize
 * 获取Slider的步长。
 * @return {Number} Slider的步长。
 */
UIProgressBar.prototype.getStepSize = function() {
	return this.stepSize || 0;
}

/**
 * @method getMinValue
 * 获取范围的最小值。可以用setRange来设置取值范围。
 * @return {Number} 范围的最小值。
 */
UIProgressBar.prototype.getMinValue = function() {
	return this.minValue;
}

/**
 * @method getMaxValue
 * 获取范围的最大值。可以用setRange来设置取值范围。
 * @return {Number} 范围的最大值。
 */
UIProgressBar.prototype.getMaxValue = function() {
	return this.maxValue;
}

UIProgressBar.prototype.afterChildRemoved = function(shape) {
    if(shape === this.dragger) {
        this.dragger = null;
    }
}

UIProgressBar.prototype.afterChildAppended =function(shape) {
	var bar = this;
	
	this.dragger = shape;
	this.updateDraggerParams();
	this.setTextType(Shape.TEXT_NONE);

	bar.onPointerDownRunning = bar.onPointerMoveRunning = function(point, beforeChild) {
		if(beforeChild) {
			return;
		}

		var hw = this.dragger.w >> 1;
		var hh = this.dragger.h >> 1;
		if(this.pointerDown && this.dragger) {
			var x = point.x - hw;
			var y = point.y - hh;
			x = Math.min(Math.max(-2, x), this.w - hw + 2);
			y = Math.min(Math.max(-2, y), this.h - hh + 2);

			this.dragger.move(x, y);
		}
		
		return;
	}

	bar.onPointerUpRunning = function(point, beforeChild) {
		if(beforeChild) {
			return;
		}

		if(this.changed) {
			this.changed = false;
			this.callOnChangedHandler(this.getValue());
		}

		return;
	}

	bar.onSized = function() {
		var size = Math.min(this.w, this.h);
		this.updateLayoutParams();
		this.setPercent(this.getPercent());
		this.resizeDragger();
		this.updateDraggerParams();

		return;
	}

	shape.onSized = function() {
		bar.resizeDragger();
	}

	shape.onMoved = function() {
		var percent = 0;
		if(bar.w > bar.h) {
			var value = this.left/(bar.w - this.w);
			percent = value * 100;
			if(this.left <= 0) {
				percent = 0;
			}
			if((this.left + this.w) >= bar.w) {
				percent = 100;
			}
		}
		else {
			var value = (bar.h - this.h - this.top)/(bar.h - this.h);
			percent = value * 100;
			if(this.top <= 0) {
				percent = 100;
			}
			if((this.top + this.h) >= bar.h) {
				percent = 0;
			}
		}

		bar.changed = true;
		bar.setPercentOnly(percent);
		bar.callOnChangingHandler(bar.getValue());

		return;
	}
	
	return;
}

UIProgressBar.prototype.setInteractive = function(value) {
	this.interactive = value;

	return this;
}

UIProgressBar.prototype.fixPercent = function(percent, stepSize) {
	var fixedPercent = percent;

	if(stepSize && percent < 100) {
		var range = this.maxValue - this.minValue;
		var value = Math.round(((percent/100) * range)/stepSize) * stepSize;
		fixedPercent = (value/range) * 100;
	}

	return Math.min(fixedPercent, 100)/100;
}

UIProgressBar.prototype.setPercentOnly = function(percent, notify, animation) {
	var stepSize = this.stepSize;
	var newValue = this.fixPercent(percent, this.stepSize);
	
	if(!animation) {
		this.value = newValue;
		this.relayoutChildren();
	}

	if(this.isInDesignMode() || !this.isVisible()) {
		return this;
	}

	if(!animation) {
		if(notify) {
			this.callOnChangedHandler(this.getValue());
		}
	}
	else {
		if(this.value == newValue) return this;
		this.setupAnimation({
			notify: notify,
			valueStart: this.value,
			valueEnd: newValue
		});
	}

	return this;
}

UIProgressBar.prototype.setupAnimation = function(config) {
	var me = this;
	var def = {
		duration: 300,
		actionWhenBusy: 'replace',
		onStep: function(ui, timePercent, config) {
			me.value = config.value;
			me.relayoutChildren();
			return true;
		},
		onDone: function(ui, aniName) {
			me.value = config.valueEnd;
			if(config.notify) {
				me.callOnChangedHandler(me.getValue());	
			}
		}
	};

	if(!config) {
		config = def;
	}
	else {
		var keys = Object.keys(def);
		for(var i = 0, len = keys.length; i < len; i++) {
			var k = keys[i];
			if(!config[k]) {
				config[k] = def[k];
			}
		}
	}

	this.animate(config);

	return this;
}

UIProgressBar.prototype.setPercent = function(value, notify, animation) {
	value = Math.max(0, Math.min(value, 100));

	this.setPercentOnly(value, notify, animation);
	this.relayoutChildren();

	return this;
}

UIProgressBar.prototype.getPercent = function() {
	return this.value * 100;
}

UIProgressBar.prototype.getValue = function() {
	var range = this.maxValue - this.minValue;
	var value = this.minValue + this.value * range;
	var stepSize = this.stepSize;

	if(stepSize) {
		var fv = Math.floor((value/stepSize)) * stepSize;
        value = Math.max(value, fv);
	}

	return Math.min(this.maxValue, Math.round(value));
}

UIProgressBar.prototype.setValue = function(value, notify, animation) {
	var range = this.maxValue - this.minValue;
	var percent = 100 * ((value-this.minValue)/range);

	this.setPercent(percent, notify, animation);

	return this;
}

UIProgressBar.prototype.drawText = function(canvas) {
	var text = Math.round(this.getPercent()) + "%";

	if(!this.isTextColorTransparent()) {
		canvas.font = this.style.getFont();
		canvas.fillStyle = this.getTextColor();
		canvas.textBaseline = "middle";
		canvas.textAlign = "center";

		canvas.fillText(text, this.w >> 1, this.h >> 1);
	}

	return;
}

UIProgressBar.prototype.paintSelfOnly = function(canvas) {
}

UIProgressBar.prototype.drawBgImageV = function(canvas) {
	var image = null;
	var w = this.w >> 1;
	var x = (this.w - w)>> 1;
	var fgColor = this.style.lineColor;
	var bgColor = this.style.fillColor;
	var r = this.roundRadius ? this.roundRadius : 0;
	var wImage = this.getImageByType(UIElement.IMAGE_DEFAULT);
	if(wImage && wImage.getImage()) {
		var rect = wImage.getImageRect();
		
		image = wImage.getImage();
		if(this.images.display === UIElement.IMAGE_DISPLAY_SCALE) {
			WImage.draw(canvas, image, UIElement.IMAGE_DISPLAY_SCALE, 0, 0, this.w, this.h, rect);
		}
		else {
			WImage.draw(canvas, image, UIElement.IMAGE_DISPLAY_9PATCH, x, 0, w, this.h, rect);
		}
	}
	else if(!Shape.isTransparentColor(bgColor)) {
		canvas.beginPath();
		canvas.translate(x, 0);
		drawRoundRect(canvas, w, this.h, r);
		canvas.translate(-x, 0);
		canvas.fillStyle = this.style.fillColor;
		canvas.fill();
	}

	wImage = this.getImageByType(UIElement.IMAGE_NORMAL_FG);

	var h = Math.round(this.h * this.value);
	var y = this.h - h;

	if(wImage && wImage.getImage()) {
		var rect = wImage.getImageRect();
		image = wImage.getImage();

		if(this.images.display === UIElement.IMAGE_DISPLAY_SCALE) {
			var tmph = rect.h;
			var tmpy = rect.y;
			var tmprh = rect.rh;
			var ih = Math.round(tmph*this.value);
			rect.h = ih;
			rect.y = rect.y + tmph - ih;
			rect.h = ih;
			rect.rh = Math.round(tmprh*this.value);  
			WImage.draw(canvas, image, UIElement.IMAGE_DISPLAY_SCALE, 0, y, this.w, h, rect);
			rect.y = tmpy;
			rect.h = tmph;
			rect.rh = tmprh;
		}
		else {
			WImage.draw(canvas, image, UIElement.IMAGE_DISPLAY_9PATCH, x, y, w, h, rect);
		}
	}
	else if(!Shape.isTransparentColor(fgColor)) {
		if(h > 2 * r) {
			canvas.beginPath();
			canvas.translate(x, y);
			drawRoundRect(canvas, w, h, r);
			canvas.fillStyle = this.style.lineColor;
			canvas.fill();
		}
	}

	return;
}

UIProgressBar.prototype.drawBgImageH = function(canvas) {
	var image = null;
	var h = this.h >> 1;
	var y = (this.h - h)>> 1;
	var fgColor = this.style.lineColor;
	var bgColor = this.style.fillColor;
	var r = this.roundRadius ? this.roundRadius : 0;

	var wImage = this.getImageByType(UIElement.IMAGE_DEFAULT);
	if(wImage && wImage.getImage()) {
		var rect = wImage.getImageRect();
		
		image = wImage.getImage();
		if(this.images.display === UIElement.IMAGE_DISPLAY_SCALE) {
			WImage.draw(canvas, image, UIElement.IMAGE_DISPLAY_SCALE, 0, 0, this.w, this.h, rect);
		}
		else {
			WImage.draw(canvas, image, UIElement.IMAGE_DISPLAY_9PATCH, 0, y, this.w, h, rect);
		}
	}
	else if(!Shape.isTransparentColor(bgColor)) {
		canvas.beginPath();
		canvas.translate(0, y);
		drawRoundRect(canvas, this.w, h, r);
		canvas.translate(0, -y);
		canvas.fillStyle = this.style.fillColor;
		canvas.fill();
	}

	var w = Math.round(this.w * this.value);
	var wImage = this.getImageByType(UIElement.IMAGE_NORMAL_FG);
	if(wImage && wImage.getImage()) {
		var rect = wImage.getImageRect();

		image = wImage.getImage();
		if(this.images.display === UIElement.IMAGE_DISPLAY_SCALE) {
			var tmpw = rect.w;
			var tmprw = rect.rw;
			rect.w = Math.round(rect.w*this.value);
			rect.rw = Math.round(rect.rw*this.value);
			WImage.draw(canvas, image, UIElement.IMAGE_DISPLAY_SCALE, 0, 0, w, this.h, rect);
			rect.w = tmpw; 
			rect.rw= tmprw;
		}
		else {
			WImage.draw(canvas, image, UIElement.IMAGE_DISPLAY_9PATCH, 0, y, w, h, rect);
		}
	}
	else if(!Shape.isTransparentColor(fgColor)) {
		if(w > 2 * r) {
			canvas.beginPath();
			canvas.translate(0, y);
			drawRoundRect(canvas, w, h, r);
			canvas.fillStyle = this.style.lineColor;
			canvas.fill();
		}
	}

	return;
}

UIProgressBar.prototype.drawCircle = function(canvas) {
	var cx = this.w >> 1;
	var cy = this.h >> 1;
	var r = Math.min(cx, cy);
	var angle = Math.PI * 2 * this.value - 0.5 * Math.PI;
	var lineWidth = Math.min(r, Math.max(this.style.lineWidth, 5));
	
	var fgImage = this.getImageByType(UIElement.IMAGE_NORMAL_FG);
	var bgImage = this.getImageByType(UIElement.IMAGE_DEFAULT);

	if(bgImage && bgImage.getImage()) {
		var image = bgImage.getImage();
		var rect = bgImage.getImageRect();
		WImage.draw(canvas, image, UIElement.IMAGE_DISPLAY_SCALE, 0, 0, this.w, this.h, rect);
	}
	else if(!this.isFillColorTransparent()) {
		canvas.beginPath();
		canvas.arc(cx, cy, r, 0, Math.PI * 2);
		
		canvas.fillStyle = this.style.fillColor;
		canvas.fill();
	}

	if(fgImage && fgImage.getImage()) {
		canvas.beginPath();
		canvas.moveTo(r, r);
		canvas.lineTo(r, 0)
		canvas.arc(cx, cy, r, -Math.PI * 0.5, angle);
		canvas.lineTo(r, r)
		canvas.clip();

		var image = fgImage.getImage();
		var rect = fgImage.getImageRect();
		WImage.draw(canvas, image, UIElement.IMAGE_DISPLAY_SCALE, 0, 0, this.w, this.h, rect);
	}
	else if(!this.isStrokeColorTransparent()) {
		r = r - (lineWidth >> 1);
		
		canvas.beginPath();
		canvas.lineCap = 'round';
		canvas.lineWidth = lineWidth;
		canvas.arc(cx, cy, r, -Math.PI * 0.5, angle);
		
		canvas.strokeStyle = this.style.lineColor;
		canvas.stroke();
	}

	return;
}

UIProgressBar.prototype.drawBgImage = function(canvas) {
	canvas.save();
	if(Math.abs(this.w - this.h) < 10) {
		this.drawCircle(canvas);
	}
	else if(this.w > this.h) {
		this.drawBgImageH(canvas);
	}
	else {
		this.drawBgImageV(canvas);
	}
	canvas.restore();
}

UIProgressBar.prototype.onFromJsonDone = function() {
	this.setPercent(this.getPercent());

	return;
}

function UIProgressBarCreator(w, h, interactive) {
	var type = interactive ? "ui-slider" : "ui-progressbar";
	var args = [type, "ui-progressbar", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIProgressBar();
		return g.initUIProgressBar(this.type, w, h, interactive);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIProgressBarCreator(200, 45, false));
ShapeFactoryGet().addShapeCreator(new UIProgressBarCreator(200, 45, true));

/*
 * File:   ui-window-manager.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Window Manager
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIWindowManager
 * @extends UIFrames
 * 管理着所有窗口，并提供管理窗口的函数，如打开和关闭窗口。但通常您并不需要直接调用窗口管理器的函数，因为这些函数已经封装到UIElement了，在事件处理程序中，通过this直接去访问这些函数就行了。
 *
 */

function UIWindowManager() {
}

UIWindowManager.prototype = new UIFrames();
UIWindowManager.prototype.isUIWindowManager = true;

UIWindowManager.prototype.saveProps = ["current", "sceneIdIndex"];
UIWindowManager.prototype.initUIWindowManager = function(type) {
	this.settings = {};
	this.initUIFrames(type);
	this.history = new Array();

	this.showLoadingProgress = true;
	this.setImage("force-landscape-tips", null);
	this.setImage("force-portrait-tips", null);

	this.soundMusicAutoPlay = true;
	this.setSoundEffectsEnable(true);

	this.loadedAssets = {};
	UIWindowManager.instance = this;

	return this;
}

UIWindowManager.getInstance = function() {
	return UIWindowManager.instance;
}

UIWindowManager.prototype.fromJson = function(json) {
	this.jsonData = json;

	return RShape.prototype.fromJson.call(this, json);
}

UIWindowManager.prototype.onImageLoadDone = function(img, src) {
    if(!img) {
        return;
    }
//	console.log("onImageLoadDone:" + img.src.substr(0, 256));
}

UIWindowManager.prototype.onImageLoadErr = function(src) {
	console.log("onImageLoadErr:" + src);
}

UIWindowManager.prototype.onJsonLoadDone = function(obj, src) {
//	console.log("onJsonLoadDone:" + src);
}

UIWindowManager.prototype.onJsonLoadErr = function(src) {
	console.log("onJsonLoadErr:" + src);
}

UIWindowManager.prototype.loadElementAssets = function(el) {
	if(el.images) {
		for(var key in el.images) {
			var url = el.images[key];
			if(typeof url === "string") {
				WImage.create(url, this.onImageLoadDone.bind(this));
			}
		}
	}

	var jsonAssets = UIElement.jsonAssets;
	for(var i = 0; i < jsonAssets.length; i++) {
		var key = jsonAssets[i];
		var url = el[key];
		if(url) {
			if(url.endWith(".json")) {
				ResLoader.loadJson(url, this.onJsonLoadDone.bind(this), this.onJsonLoadErr.bind(this));
			}
			else {
				ResLoader.loadData(url, this.onJsonLoadDone.bind(this), this.onJsonLoadErr.bind(this));
			}
		}
	}
	
	var imagesAssets = UIElement.imagesAssets;
	for(var i = 0; i < imagesAssets.length; i++) {
		var key = imagesAssets[i];
		var url = el[key];
		if(url) {
			WImage.create(url, this.onImageLoadDone.bind(this));
		}
	}

	var children = el.children;
	for(var i = 0; i < children.length; i++) {
		var iter = children[i];
		this.loadElementAssets(iter);	
	}

	return this;
}

UIWindowManager.prototype.clearAssetsCache = function(check) {
	WImage.clearCache(check);
	ResLoader.clearCache(check);

	return this;
}

UIWindowManager.prototype.loadAssets = function(winList, onLoadProgress, onDownloadProgress) {
	var me = this;
	winList = winList || this.getWindowNames();

	if(AssetsDownloader.isAvailable()) {
		AssetsDownloader.downloadMulti(winList, onDownloadProgress, function() {
			me.doLoadAssets(winList, onLoadProgress);
		});
	}
	else {
		me.doLoadAssets(winList, onLoadProgress);
	}

	return this;
}

UIWindowManager.prototype.shouldShowAssetsLoadingProgress = function(name) {
	return !this.isAssetsLoaded(name) && this.assetsLoadingWin;
}

UIWindowManager.prototype.isAssetsLoaded = function(name) {
	return this.loadedAssets[name];
}

UIWindowManager.prototype.doLoadAssets = function(winList, onProgress) {
	var queue = [];
	var wm = this;

	function onAssetsLoadProgress(event) {
		if(onProgress) {
			onProgress(event.percent, event.finished, event.total);
		}

		if(event.finished >= event.total) {
			ResLoader.off(ResLoader.EVENT_ASSETS_LOAD_PROGRESS, onAssetsLoadProgress);
	
			for(var k = 0; k < queue.length; k++) {
				var iter = queue[k];
				wm.loadedAssets[iter] = true;
			}
			queue = null;
		}
	}

	var children = this.jsonData.children;
	for(var i = 0; i < children.length; i++) {
		var win = children[i];
		if(!winList || winList.indexOf(win.name) >= 0) {
			queue.push(win.name);
			this.loadElementAssets(win);	
		}
	}

	if(ResLoader.isLoadCompleted()) {
		setTimeout(function() {
			onAssetsLoadProgress({percent:100, finished:100, total:100});
		}, 10);
	}
	else {
		ResLoader.on(ResLoader.EVENT_ASSETS_LOAD_PROGRESS, onAssetsLoadProgress);
	}

	return this;
}

UIWindowManager.prototype.onFromJsonDone = function() {
	this.designWidth = this.w;
	this.designHeight = this.h;
	this.forcePortrait = false;
	this.forceLandscape = false;

	return;
}

UIWindowManager.prototype.beforeAddShapeIntoChildren = function(shape) {
	return !shape.isUIWindow;
}

UIWindowManager.prototype.getMainWindow = function() {
	var windows = this.children;
	var n = windows.length;

	for(var i = 0; i < n; i++) {
		var win = windows[i];
		if(win.isUILoadingWindow) continue;

		if(win.isUINormalWindow && win.windowType === "main") {
			return win;
		}
	}
	
	for(var i = 0; i < n; i++) {
		var win = windows[i];
		
		if(win.isUILoadingWindow) continue;

		if(win.isUINormalWindow) {
			return win;
		}
	}

	return null;
}

UIWindowManager.prototype.getWindowNames = function(excludeWin) {
	var names = [];
	var children = this.children;
	var n = children.length;

	for(var i = 0; i < n; i++) {
		var win = children[i];
		if(win !== excludeWin) {
			names.push(win.name);
		}
	}

	return names;
}

UIWindowManager.prototype.setInitWindow = function(initWindowIndex) {
	if(initWindowIndex === null || initWindowIndex === undefined) {
		this.initWindowIndex = null;
	}
	else {
		this.initWindowIndex = Math.max(0, Math.min(initWindowIndex, this.children.length-1));
	}

	return this;
}

UIWindowManager.prototype.getInitWindow = function() {
	var initWin = null;

    if(this.initWindowIndex || this.initWindowIndex === 0) {
        initWin = this.children[this.initWindowIndex];	
    }

    if(!initWin) {
        var initWinName = cantkGetQueryParam("initwin");
        if(initWinName) {	
            initWin = this.find(initWinName);
        }
    }

    if(!initWin) {
        var initWinName = this.preferInitWindow;
        if(initWinName) {	
            initWin = this.find(initWinName);
        }
    }

    if(!initWin) {
        initWin = this.getMainWindow();
    }

    if(!initWin || initWin.isUILoadingWindow) {
        return null;
    }

	return initWin;
}

UIWindowManager.prototype.waitDeviceRotate = function() {
	var wm = this;
	if(this.isDeviceDirectionOK()) {
		this.doShowInitWindow();
	}
	else {
		setTimeout(function() {
			wm.waitDeviceRotate();
		}, 100);
	}
}

UIWindowManager.prototype.showInitWindow = function(preferInitWindow) {
	this.preferInitWindow = preferInitWindow;

	this.waitDeviceRotate();
}

UIWindowManager.prototype.doShowInitWindow = function() {
	this.history.clear();
	var initWin = this.getInitWindow();

	if(initWin) {
		this.targetShape = initWin;
		initWin.prepareForOpen();
		index = this.getFrameIndex(initWin);
		this.showFrame(index);
		initWin.callOnBeforeOpen();
		initWin.callOnOpen();
		this.history.push(index);
		this.postRedraw();
		
		console.log("showInitWindow: set targetShape:" + this.targetShape.name);
	}
	else {
		console.log("Not Found Init Window.");
	}

	return true;
}

UIWindowManager.prototype.callOnLoad = function() {
	this.resLoadDone = true;

	for(var i = 0; i < this.children.length; i++) {
		var win = this.children[i];

		try {
			win.callOnLoadHandler();
		}catch(e) {
			console.log("Call onLoad fail:" + e.message);
		}
	}

	return true;
}

UIWindowManager.prototype.callOnUnload = function() {
	for(var i = 0; i < this.children.length; i++) {
		var win = this.children[i];

		win.callOnUnloadHandler();
	}

	return true;
}

UIWindowManager.prototype.onResLoadDone = function() {
	this.callOnLoad();
	this.showInitWindow();

	return;
}

UIWindowManager.prototype.getStartLoadingWindow = function() {
	var windows = this.children;
	var n = windows.length;

	for(var i = 0; i < n; i++) {
		var win = windows[i];
		if(win.isUINormalWindow && (win.isUILoadingWindow || win.name === "win-loading")) {
			win.isUILoadingWindow = true;
			return win;
		}
	}

	return null;
}

UIWindowManager.prototype.loadAudios = function() {
	this.loadSoundEffects();
	this.loadSoundMusic();

	return this;
}

UIWindowManager.prototype.loadFonts = function() {
	var meta = this.view.getMeta();
	if(meta && meta.extfonts) {
		ResLoader.loadFonts(meta.extfonts);
	}

	return this;
}

UIWindowManager.prototype.setAssetsLoadingWindow = function(name) {
	this.assetsLoadingWin = this.find(name);

	return this;
}

UIWindowManager.prototype.getAssetsLoadingWindow = function() {
	return this.assetsLoadingWin;
}

UIWindowManager.prototype.showStartLoadingWindow = function() {
	this.resLoadDone = false;
	var resWin = this.getStartLoadingWindow();

	if(resWin) {
		if(!resWin.isUILoadingWindowV2) {
			this.loadAssets(null, null);
            this.loadAudios();
    		this.loadFonts();
			console.log("old version, load all assets.");
		}

		this.openWindow(resWin.name);	
	}
	else {
		this.loadAssets(null, null);
		this.showInitWindow();
		console.log("no loading window, load all assets.");
	}

	return;
}

UIWindowManager.prototype.systemInit = function() {
	UIWindowManager.soundEffects = {};
	UIWindowManager.soundMusic = {};
	
	UIElement.animTimerID = null;
	this.callOnSystemInitHandler();

	for(var i = 0; i < this.children.length; i++) {
		var win = this.children[i];
		win.callOnSystemInitHandler();
	}

	var me = this;
	this.showStartLoadingWindow();
	ResLoader.setOnLoadFinishListener(function() {
		me.callOnLoad();
	});

	return;
}

UIWindowManager.prototype.systemExit = function() {
	console.log("systemExit: ");
	var n = this.history.length;
	
	for(var i = 0; i < n; i++) {
		this.closeCurrentWindow(0, true);
	}

	this.history.length = 0;

	this.stopSoundMusic();
	this.callOnUnload();

	return;
}

UIWindowManager.prototype.hasOpenPendingWindow = function() {
   	var children = this.children;
	var n = children.length;

	for(var i = 0; i < n; i++) {
		var win = children[i];
		if(win.openPending) {
            return true;
        }
	}

    return false;
}

UIWindowManager.prototype.openWindow = function(name, onClose, closeCurrent, initData, options) {
	var newWin = null;
	if(name) {
		newWin = this.find(name);
	}
	else {
		newWin = this.getMainWindow();
	}

	if(!newWin || !newWin.isUIWindow) {
		alert("Can not find window: " + name);
		return;
	}
	
    if(newWin.openPending) {
		console.log("This window is already open:" + name);
		return;
	}

	if(closeCurrent) {
		this.closeCurrentWindow(0, true);
	}

	if(newWin.pendingLoadChildren) {
		newWin.loadChildren();
	}

	if(newWin.isOpen()) {
		options = options || {closeOldIfOpened:true};
		if(options.closeOldIfOpened) {
			newWin.callOnClose({});
			this.history.remove(newWin.getIndex());
		}
		else if(options.openNewIfOpened) {
			var newWin = this.dupChild(newWin.name);
			newWin.destroyWhenClose = true;
		}
		else {
			console.log(newWin.name + " is open already.");
			return false;
		}
	}

    /*
	if(newWin.openPending) {
		newWin.openPending = false;
		console.log("This window is already open:" + name);
		return false;
	}
    */
	
	if(!newWin.isUILoadingWindow && !newWin.isUILoadingWindowV2 && this.shouldShowAssetsLoadingProgress(newWin.name)) {
		this.downloadAssetsAndOpenWindow(newWin, initData, onClose);
	}else{
		this.doOpenWindow(newWin, initData, onClose);
	}
}

UIWindowManager.prototype.doOpenWindow = function(newWin, initData, onClose) {
	newWin.prepareForOpen();
	newWin.openPending = true;
	newWin.initData = initData;
	newWin.onClose = onClose;
	newWin.callOnBeforeOpen(initData);

	this.targetShape = newWin;
	this.setPointerEventTarget(newWin);
	if(newWin.isUINormalWindow) {
		return this.openNormalWindow(newWin);
	}
	else {
		return this.openPopupWindow(newWin);
	}
}


UIWindowManager.prototype.downloadAssetsAndOpenWindow = function(newWin, initData, onClose) {
	var loadingWin = this.getAssetsLoadingWindow(); 
	if(loadingWin === newWin) {
		console.log("UIWindowManager.prototype.downloadAssetsAndOpenWindow failed.");
		return;
	}

	this.doOpenWindow(loadingWin);

	var wm = this;
	var bar = loadingWin.findChildByType("ui-progressbar");
	var label = loadingWin.findChildByType("ui-label");
	
	if(bar) {
		bar.setPercent(0);
	}

	if(label) {
		label.setText("Downloading...");
	}

	function onLoadProgress(percent, loadedNr, totalNr) {
		if(label) {
			label.setText("Loading...");
		}

		if(bar) {
			bar.setPercent(percent, true);
		}
		
		if(loadedNr >= totalNr) {
			wm.closeCurrentWindow(0, true);
			wm.doOpenWindow(newWin, initData, onClose);
		}
	}
	
	function onDownloadProgress(percent, loadedNr, totalNr) {
		if(label) {
			if(percent >= 100) {
				label.setText("Loading...");
			}else{
				label.setText("Downloading...");
			}
		}

		if(bar) {
			if(percent >= 100) {
				bar.setPercent(0, true);
			}else {
				bar.setPercent(percent, true);
			}
		}
	}
	
	this.loadAssets([newWin.name], onLoadProgress, onDownloadProgress);
}

UIWindowManager.prototype.openPopupWindow = function(newWin ) {
	var wm = this;
	var curWin = this.getCurrentFrame();

	function openPopupWindow() {
		if(!newWin.app)  {
			console.log("may be exited preview mode");
			return;
		}
        var index = wm.getFrameIndex(curWin);
        if(wm.history.indexOf(index) < 0) {
            return;
        }
		newWin.show();
		curWin.setPopupWindow(newWin);
		wm.postRedraw();
		newWin.callOnOpen(newWin.initData);
	}

	if(curWin) {
		curWin.callOnSwitchToBack(true);
		if(newWin.isAnimationEnabled()) {
			var p = this.getPositionInScreen();
			var animation = AnimationFactory.create(newWin.getAnimationName(true), newWin.getAnimationDuration(true)); 
            animation.setWins(curWin, newWin);
			animation.setScale(this.getRealScale());
			animation.prepare(p.x, p.y, this.w, this.h, openPopupWindow);
			animation.setRectOfFront(newWin.x, newWin.y, newWin.w, newWin.h);
			animation.run();
		}
		else {
			openPopupWindow();
		}
	}

	return true;
}

UIWindowManager.prototype.openNormalWindow = function(newWin) {
	var wm = this;
	var index = 0;

	var curWin = this.getCurrentFrame();
	function closeAndOpenWindow() {
		if(!newWin.app)  {
			console.log("may be exited preview mode");
			return;
		}

		index = wm.getFrameIndex(newWin);
		wm.showFrame(index);
		wm.history.push(index);
		curWin = wm.getCurrentFrame();
		wm.postRedraw();
		newWin.callOnOpen(newWin.initData);

		return;
	}

	if(curWin) {
		curWin.callOnSwitchToBack();
		if(newWin.isAnimationEnabled()) {
			var p = this.getPositionInScreen();
			var animation = AnimationFactory.create(newWin.getAnimationName(true), newWin.getAnimationDuration(true)); 
            animation.setWins(curWin, newWin);
			animation.setScale(this.getRealScale());
			animation.prepare(p.x, p.y, this.w, this.h, closeAndOpenWindow);
			animation.run();
		}
		else {
			closeAndOpenWindow();
		}
	}
	else {
		closeAndOpenWindow();
	}
	
	return true;
}

UIWindowManager.prototype.getCurrentWindow = function() {
	var curWin = this.getCurrentFrame();
	if(!curWin) {
		return null;
	}

	var childWin = curWin.getPopupWindow();

	return childWin ? childWin : curWin; 
}

UIWindowManager.prototype.backToHomeWin = function() {
	var history = this.history;
	var n = history.length - 1;
	var curWin = this.getCurrentWindow();

	if(!n) {
		if(curWin.isUIPopupWindow) {
			this.closeCurrentWindow(0);
		}

		return;
	}

	if(n === 1) {
		if(curWin.isUIPopupWindow) {
			this.closeCurrentWindow(0, true);
			this.closeCurrentWindow(0);
		}
		else {
			this.closeCurrentWindow(0);
		}

		return;
	}
	
	var mainWinIndex = history[0];
	var lastWin = this.getFrame(mainWinIndex);
	
	if(curWin.isAnimationEnabled()) {
		var p = this.getPositionInScreen();
		var animation = AnimationFactory.create(curWin.getAnimationName(false), curWin.getAnimationDuration(false)); 
        animation.setWins(curWin, lastWin);
		animation.setScale(this.getRealScale());
		animation.prepare(p.x, p.y, this.w, this.h, function() {});
		animation.run();
	}

	for(var i = 0; i < n; i++) {
		this.closeCurrentWindow(0, true);
	}

	return;
}

UIWindowManager.prototype.closeCurrentWindow = function(retInfo, syncClose) {
	var curWin = this.getCurrentWindow();

	if(!curWin || curWin.isInDesignMode()) {
		return  false;
	}

	return this.closeWindow(curWin, retInfo, syncClose);
}

UIWindowManager.prototype.closeWindow = function(win, retInfo, syncClose) {
    win.closePending = true;
	if(win.isUINormalWindow) {
		return this.closeNormalWindow(win, retInfo, syncClose);
	} 
	else {
		return this.closePopupWindow(win, retInfo, syncClose);
	}
}

UIWindowManager.prototype.closePopupWindow = function(popupWin, retInfo, syncClose) {
	var wm = this;
	var curWin = this.getCurrentFrame();

	if(curWin) {
		function closePopupWindow() {
			if(!popupWin.app)  {
				console.log("may be exited preview mode");
				return;
			}
			curWin.removePopupWindow(popupWin);
			curWin.callOnSwitchToFront(true);
			wm.postRedraw();

			popupWin.callOnClose(retInfo);
		}

        if(!popupWin.isTopWindow()) {
            console.log("close background dialog");
            if(popupWin.parentWindow) {
                popupWin.parentWindow.removePopupWindow(popupWin);
            }
            popupWin.callOnClose(retInfo); 
            
            return;
        }

		if(curWin === popupWin) {
			syncClose = true;
		}

		if(popupWin.isAnimationEnabled() && !syncClose && !wm.hasOpenPendingWindow()) {
			var p = this.getPositionInScreen();
			var animation = AnimationFactory.create(popupWin.getAnimationName(false), popupWin.getAnimationDuration(false)); 

			curWin.removePopupWindow(popupWin);
            animation.setWins(popupWin, curWin);
			curWin.setPopupWindow(popupWin);
		
			animation.setScale(this.getRealScale());
			animation.prepare(p.x, p.y, this.w, this.h, closePopupWindow);
			animation.setRectOfFront(popupWin.x, popupWin.y, popupWin.w, popupWin.h);
			animation.run();
		}
		else {
			closePopupWindow();
		}
	}

	return true;
}

UIWindowManager.prototype.closeAll = function() {
	var wins = [];

	for(var i = 0; i < this.history.length; i++) {
		var index = this.history[i];
		var win = this.getFrame(index);
		for(var iter = win; iter; iter = iter.popupWindow) {
			wins.push(iter);
		}
	}

	for(var i = wins.length-1; i >= 0; i--) {
		var win = wins[i];
		win.callOnClose({});
		win.targetShape = null;
	}

	this.history = [];

	return;
}

UIWindowManager.prototype.closeNormalWindow = function(curWin, retInfo, syncClose) {
	var wm = this;
	var lastWin = null;

	if(this.history.length < 2) {
		if(syncClose || this.history.length) {
			wm.history.remove(wm.current);
			curWin.callOnClose(retInfo);
		}

		return false;
	}

    if(!curWin.isTopWindow()) {
        var curIndex = wm.getFrameIndex(curWin);
        console.log("closing background window " + curWin.name);
        wm.history.remove(curIndex);
        curWin.callOnClose();

        if(curIndex === wm.current && wm.history.length > 0) {
            wm.showFrame(wm.history[wm.history.length - 1]);
        }
        return;
    }

	lastWinIndex = this.history[this.history.length-2];
	lastWin = this.getFrame(lastWinIndex);

	function showLastWindow() {
		if(!lastWin.app)  {
			console.log("may be exited preview mode");
			return;
		}
        if(lastWinIndex != wm.history[wm.history.length - 1] || wm.hasOpenPendingWindow()) {
            //new win was appended and shown?
            return;
        }
		wm.showFrame(lastWinIndex);
		lastWin.callOnSwitchToFront();
		
		wm.postRedraw();
		curWin.callOnClose(retInfo);

		return;
	}
	
	wm.history.remove(wm.current);
	if(syncClose) {
		showLastWindow();
	}
	else if(curWin.isAnimationEnabled() && !wm.hasOpenPendingWindow()) {
		var p = this.getPositionInScreen();
		var animation = AnimationFactory.create(curWin.getAnimationName(false), curWin.getAnimationDuration(false)); 
        animation.setWins(curWin, lastWin);
		animation.setScale(this.getRealScale());
		animation.prepare(p.x, p.y, this.w, this.h, showLastWindow);
		animation.run();
	}
	else {
		setTimeout(showLastWindow, 10);
	}

	return;
}

UIWindowManager.prototype.isWindowOpen = function(win) {
	return win && win.isOpen();
}


UIWindowManager.prototype.onChildrenChanged = function() {
}

UIWindowManager.prototype.afterChildAppended = function(shape) {
	if(this.mode !== Shape.MODE_RUNNING && !this.isUnpacking) {
		var index = this.getFrameIndex(shape);
		this.showFrame(index);
	}

	this.onChildrenChanged();

	return;
}

UIWindowManager.prototype.onChildRemoved = function(shape) {
	this.onChildrenChanged();

	return;
}

UIWindowManager.prototype.scaleForDensity = function(sizeScale, lcdDensity, recuresive) {
	if(!sizeScale || sizeScale === 1) {
		return;
	}

	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];

		if(!iter.lcddensity || iter.lcddensity === "all") {
			if(iter.pendingLoadChildren) {
				iter.scaleInfo = {};
				iter.scaleInfo.sizeScale = sizeScale;
				iter.scaleInfo.lcdDensity = lcdDensity;
			}
			else {
				iter.scaleForDensity(sizeScale, lcdDensity, recuresive);
			}
		}
	}

	return;
}

UIWindowManager.prototype.resize = function(w, h) {
	var x = 0;
	var y = 0;
	var fixWidth = this.screenScaleMode === "fix-width";
	var fixHeight = this.screenScaleMode === "fix-height";
	var fixResolution = this.screenScaleMode === "fix-resolution";
	var isInDevice = this.parentShape != null;

	if(this.mode === Shape.MODE_RUNNING && (fixWidth || fixHeight || fixResolution) && !isInDevice) {
		var canvas = this.view.getCanvas();

		var screenWidth = canvas.width;
		var screenHeight = canvas.height;
		var designWidth = this.designWidth;
		var designHeight = this.designHeight;
		var canvasStyleSizeSupported = true;//!(isWeiBo() || isPhoneGap());
		var sizeIsRight = (screenWidth > screenHeight && designWidth > designHeight) 
			|| (screenWidth < screenHeight && designWidth < designHeight);

		canvas.style.width = screenWidth + "px";
		canvas.style.height = screenHeight + "px";
		if(canvasStyleSizeSupported && sizeIsRight) {

			if(fixWidth) {
				var scale = designWidth/screenWidth;
				canvas.width = designWidth;
				canvas.height = screenHeight * scale;
				w = canvas.width;
				h = canvas.height;
			}
			else if(fixHeight) {
				var scale = designHeight/screenHeight;
				canvas.height = designHeight;
				canvas.width = screenWidth * scale;
				w = canvas.width;
				h = canvas.height;
			}
			else {
				var scaleW = designWidth/screenWidth;
				var scaleH = designHeight/screenHeight;
				var scale = Math.max(scaleW, scaleH);
				if(Math.abs(scaleW - scaleH) < 0.10) {
					canvas.width = designWidth;
					canvas.height = designHeight;
					
					x = 0;
					y = 0;
					w = canvas.width;
					h = canvas.height;
				}
				else {
					canvas.width = screenWidth * scale;
					canvas.height = screenHeight * scale;
					
					x = (canvas.width - designWidth)>>1; 
					y = (canvas.height - designHeight)>>1;
					w = designWidth;
					h = designHeight;
				}
			}
			var xInputScale = canvas.width/screenWidth;
			var yInputScale = canvas.height/screenHeight;
			WWindowManager.setInputScale(xInputScale, yInputScale);
		}
		else {
			canvas.width = screenWidth;
			canvas.height = screenHeight;
			WWindowManager.setInputScale(1, 1);
			w = canvas.width;
			h = canvas.height;
		}

		var vp = cantkGetViewPort();	
		this.app.onCanvasSized(canvas.width, canvas.height);

		console.log("Canvas Size: w =" + canvas.width + " h=" + canvas.height);
		console.log("ViewPort Size: w =" + vp.width + " h=" + vp.height);
		console.log("Canvas Style Size: w =" + canvas.style.width + " h=" + canvas.style.height);
	}

	this.lastWin = null;
	this.setLeftTop(x, y);
	this.setSizeLimit(w, h, w, h);
	UIElement.prototype.resize.call(this, w, h);

	return;
}

UIWindowManager.prototype.setDeviceConfig = function(deviceConfig) {
	var screenScaleMode = this.screenScaleMode;
	if(screenScaleMode === "fix-resolution" || screenScaleMode === "fix-width" || screenScaleMode === "fix-height") {
		this.oldConfig = this.deviceConfig;

		return;
	}

	var oldConfig = this.deviceConfig;
	
	this.oldConfig = this.deviceConfig;
	this.deviceConfig = deviceConfig;

	if(oldConfig && deviceConfig) {
		if(oldConfig.lcdDensity != deviceConfig.lcdDensity) {
			var sizeScale = this.getSizeScale(oldConfig.lcdDensity, deviceConfig.lcdDensity);
			this.scaleForDensity(sizeScale, deviceConfig.lcdDensity, true);
		}
		this.notifyDeviceConfigChanged(oldConfig, deviceConfig);
	}

	return;
}

UIWindowManager.prototype.getDeviceConfig = function() {
	if(this.deviceConfig) {
		return this.deviceConfig;
	}
	else {
		var device = this.getDevice();
		if(device) {
			return device.config;
		}
	}

	return null;
}

UIWindowManager.prototype.paintChildren = function(canvas) {
	if(!this.isInDesignMode()) {
		if(this.forcePortrait && this.w > this.h) {
			var image = this.getHtmlImageByType("force-portrait-tips");	

			canvas.fillStyle = this.style.fillColor;
			canvas.fillRect(0, 0, this.w, this.h);	
			this.drawImageAt(canvas, image, UIElement.IMAGE_DISPLAY_CENTER, 0, 0, this.w, this.h);

			return;
		}
		else if(this.forceLandscape && this.w < this.h) {
			var image = this.getHtmlImageByType("force-landscape-tips");	
			
			canvas.fillStyle = this.style.fillColor;
			canvas.fillRect(0, 0, this.w, this.h);	
			this.drawImageAt(canvas, image, UIElement.IMAGE_DISPLAY_CENTER, 0, 0, this.w, this.h);

			return;
		}
	}

	var child = this.getCurrentFrame();
	if(child.closePending) {
        return;
    }
    if(!this.isInDesignMode() && this.history.length === 0) { 
        UIElement.logWarning("All Windows Are Closed!");
    } else {
		if(child.isUIDialog) {
			canvas.fillStyle = "white";
			canvas.fillRect(0, 0, this.w, this.h);
		}

		canvas.save();
		canvas.beginPath();
		child.paintSelf(canvas);
		canvas.restore();
	}

	return;
}

UIWindowManager.prototype.paintSelf = function(canvas) {
	var x = this.x;
	var y = this.y;
	var translate = x || y;

	if(translate) {
		canvas.save();
		canvas.translate(x, y);
	}

	this.paintChildren(canvas);

	if(translate) {
		canvas.restore();
	}
}

UIWindowManager.prototype.isDeviceDirectionOK = function() {
	if(this.isInDesignMode()) {
		return true;
	}

	if((this.forcePortrait && this.w > this.h)
		|| (this.forceLandscape && this.w < this.h)) {
		console.log("Device Direction Incorrect.");
		return false;
	}

	return true;
}

UIWindowManager.prototype.relayout = function() {
	if(this.isDeviceDirectionOK()) {
		UIElement.prototype.relayout.call(this);
	}
	else {
		console.log("isDeviceDirectionNotOK ignore relayout");
	}

	return this;
}

UIWindowManager.prototype.relayoutChildren = function() {
	if(!this.isDeviceDirectionOK()) {
		console.log("isDeviceDirectionNotOK ignore relayout");

		return;
	}

	var curWin = this.getCurrentFrame();

	if(this.isInDesignMode()) {
		for(var i = 0; i < this.children.length; i++) {
			var iter = this.children[i];
			iter.relayout();
		}
	}
	else {
		if(curWin) {
			curWin.relayout();
			
			var childWin = curWin.getPopupWindow();
			if(childWin) {
				childWin.relayout();
			}
		}
	}

	return;
}

UIWindowManager.prototype.onKeyDown= function(code) {
	var win = this.getCurrentWindow();

	return win && win.onKeyDown(code);
}

UIWindowManager.prototype.onKeyUp= function(code) {
	var win = this.getCurrentWindow();

	return win && win.onKeyUp(code);
}

UIWindowManager.prototype.setSoundEffectURLs = function(soundEffectURLs) {
	this.soundEffectURLs = soundEffectURLs;

	return this;
}

UIWindowManager.prototype.getSoundEffectURLs = function() {
	return this.soundEffectURLs;
}

UIWindowManager.prototype.getSoundEffectNames = function() {
	if(!this.soundEffectURLs) {
		return [];
	}

	var names = this.soundEffectURLs.split("\n");
	for(var i = 0; i < names.length; i++) {
		names[i] = decodeURI(basename(names[i]));
	}

	return names;
}

UIWindowManager.prototype.getSoundEnable = function() {
	return this.soundMusicsEnalbe || this.soundEffectsEnalbe;
}

UIWindowManager.prototype.setSoundEnable = function(enable) {
	this.setSoundEffectsEnable(enable);
	this.setSoundMusicsEnable(enable);

	return this;
}

UIWindowManager.prototype.setSoundEffectsEnable = function(enable) {
	this.soundEffectsEnalbe = enable;

	return this;
}

UIWindowManager.prototype.setSoundMusicsEnable = function(enable) {
	if(this.soundMusicsEnalbe !== enable) {
		this.soundMusicsEnalbe = enable;
		if(enable) {
			this.playSoundMusic();
		}
		else {
			this.stopSoundMusic();
		}
	}

	return this;
}

UIWindowManager.prototype.loadSoundEffects = function() {
	if(!this.soundEffectURLs) {
		return;
	}

	if(CantkRT.isCantkRTCordova()) {
		console.log("Native Audio supported: load native Audio")
		this.loadSoundEffectsNative();
	}
	else if(isWebAudioSupported()) {
		console.log("WebAudio supported: load Web Audio")
		this.loadSoundEffectsWebAudio();
	}
	else {
		console.log("WebAudio not supported: load HTML5 Audio")
		this.loadSoundEffectsHtml5Audio();
	}

	return this;
}

UIWindowManager.prototype.loadSoundEffectsHtml5Audio = function() {
	var urlArr = this.soundEffectURLs.split("\n");
	for(var i = 0; i < urlArr.length; i++) {
		var iter = urlArr[i];

		ResLoader.loadAudio(iter, function(audio) {
			var info = {audio:audio};
            UIWindowManager.setVolumeOfAudio(info.audio, UIWindowManager.soundEffectVolume);
			var name = decodeURI(basename(audio.src));
			UIWindowManager.soundEffects[name] = info;
        });
	}

	return this;
}

UIWindowManager.prototype.loadSoundEffectsNative = function() {
	var urlArr = this.soundEffectURLs.split("\n");
	for(var i = 0; i < urlArr.length; i++) {
		var iter = urlArr[i];

		CantkRT.createSoundEffect(iter, function(audio) {
			var info = {audio:audio};
            UIWindowManager.setVolumeOfAudio(info.audio, UIWindowManager.soundEffectVolume);
			var name = decodeURI(basename(audio.src));
			UIWindowManager.soundEffects[name] = info;
			console.log("loadSoundEffectsNative success.");
		}, function() {
			console.log("loadSoundEffectsNative fail.");
		});
	}

	return this;
}

UIWindowManager.prototype.loadSoundEffectsWebAudio = function() {
	var urlArr = this.soundEffectURLs.split("\n");
	for(var i = 0; i < urlArr.length; i++) {
		var iter = urlArr[i];
		var config = {src: [iter], autoplay: false, loop: false, volume: 0.8};
		var name = decodeURI(basename(iter));
		var info = {audio:new Howl(config), playing: false};

        UIWindowManager.setVolumeOfAudio(info.audio, UIWindowManager.soundEffectVolume);
		UIWindowManager.soundEffects[name] = info;
	}

	return this;
}

UIWindowManager.prototype.stopSoundEffect = function(name) {
	for(var key in UIWindowManager.soundEffects) {
		if(name === key || !name) {
			var info = UIWindowManager.soundEffects[key];
			if(info && info.audio) {
				if(info.audio.stop) {
					info.audio.stop();
				}
				else {
					info.audio.pause();
				}
				info.playing = false;
			}
		}
	}

	return this;
}

UIWindowManager.prototype.stopAllSound = function() {
	try {
		this.stopSoundMusic().stopSoundEffect();
	}catch(e) {
		console.log(e.message);
	}

	return this;
}

UIWindowManager.soundMusicVolume = 0.8
UIWindowManager.soundEffectVolume = 0.8;

UIWindowManager.prototype.setSoundEffectVolume = function(volume) {
	UIWindowManager.soundEffectVolume = volume;

	return this;
}

UIWindowManager.prototype.setSoundMusicVolume = function(volume) {
	UIWindowManager.soundMusicVolume = volume;
	
	var info = this.lastAudioInfo;
	if(info && info.audio) {
		UIWindowManager.setVolumeOfAudio(info.audio, UIWindowManager.soundMusicVolume);
	}


	return this;
}

UIWindowManager.setVolumeOfAudio = function(audio, volume) {
	if(typeof(audio.volume) === "function") {
		audio.volume(volume);
	}
	else {
		audio.volume = volume;
	}
}

UIWindowManager.prototype.playSoundEffect = function(name, onDone) {
	if(!this.soundEffectsEnalbe) {
		console.log("this.soundEffectsEnalbe is disable ");
		return this;
	}

	var info = UIWindowManager.soundEffects[name];
	if(!info || !info.audio) {
		console.log("not found: " + name);
		return this;
	}

	if(onDone) {
		if(info.audio.once) {
			info.audio.once("end", onDone);
		}
		else {
			info.audio.addEventListener('ended', function (e) {
				onDone();
			});
		}
	}

	UIWindowManager.setVolumeOfAudio(info.audio, UIWindowManager.soundEffectVolume);
	info.audio.play();
	console.log("playSoundEffect:" + name);

	return this;
}

//////////////////////////////////////////////////////////////////////

UIWindowManager.prototype.onMultiTouch = function(action, points, event) {
	var win = this.getCurrentWindow();
	if(win) {
		var ox = this.left + win.left;
		var oy = this.top + win.top;

		for(var i = 0; i < points.length; i++) {
			var p = points[i];
			p.x -= ox;
			p.y -= oy;
		}

		win.onMultiTouch(action, points, event);
	}
}

UIWindowManager.prototype.onPointerDownRunning = function(point, beforeChild) {
	if(this.autoPlayPending) {
		this.playSoundMusic();
		this.autoPlayPending = false;
	}

	if(!beforeChild || this.popupWindow || !this.pointerDown) {
		return;
	}

	return this.callOnPointerDownHandler(point);
}

UIWindowManager.prototype.setSoundMusicURLs = function(soundMusicURLs) {
	this.soundMusicURLs = soundMusicURLs;

	return this;
}

UIWindowManager.prototype.getSoundMusicURLs = function() {
	return this.soundMusicURLs;
}

UIWindowManager.prototype.loadSoundMusicHTML5 = function() {
	var me = this;
	var loop = this.soundMusicLoop;
	var autoPlay = this.soundMusicAutoPlay;
	var urlArr = this.soundMusicURLs.split("\n");

	for(var i = 0; i < urlArr.length; i++) {
		var iter = urlArr[i];
		ResLoader.loadAudio(iter, function(audio) {
			var info = {audio:audio};
			var name = decodeURI(basename(audio.src));
            UIWindowManager.setVolumeOfAudio(info.audio, UIWindowManager.soundMusicVolume);
			
			if(loop) {	
				audio.loop = "loop";
			}
			if(autoPlay) {
				audio.play();
				autoPlay = false;
			}
			me.autoPlayPending = true;
			UIWindowManager.soundMusic[name] = info;
        });
	}

	return;
}

UIWindowManager.prototype.loadSoundMusicWebAudio = function() {
	var me = this;
	var loop = this.soundMusicLoop;
	var autoPlay = this.soundMusicAutoPlay;
	var urlArr = this.soundMusicURLs.split("\n");
	
	for(var i = 0; i < urlArr.length; i++) {
		var iter = urlArr[i];
		var config = {src: [iter], autoplay: autoPlay, loop:loop, volume: 0.8};
		var name = decodeURI(basename(iter));
		var info = {audio:new Howl(config), playing: autoPlay};

        UIWindowManager.setVolumeOfAudio(info.audio, UIWindowManager.soundMusicVolume);
		if(autoPlay) {
			this.lastAudioInfo = info;
		}
		autoPlay = false;
		UIWindowManager.soundMusic[name] = info;
	}

	return;
}

UIWindowManager.prototype.loadSoundMusicNative = function() {
	var me = this;
	var loop = this.soundMusicLoop;
	var autoPlay = this.soundMusicAutoPlay;
	var urlArr = this.soundMusicURLs.split("\n");
	
	for(var i = 0; i < urlArr.length; i++) {
		var iter = urlArr[i];
		CantkRT.createSoundMusic(iter, function(audio) {
			var info = {audio:audio};
			var name = decodeURI(basename(audio.src));
            UIWindowManager.setVolumeOfAudio(info.audio, UIWindowManager.soundMusicVolume);
			if(loop) {	
				audio.loop = "loop";
			}
			if(autoPlay) {
				audio.play();
				this.lastAudioInfo = info;
				autoPlay = false;
			}
			UIWindowManager.soundMusic[name] = info;
        });
	}

	return;
}

UIWindowManager.prototype.loadSoundMusic = function() {
    if(!this.soundMusicURLs) {
		return;
	}

    this.soundMusicsEnalbe = true;
	if(CantkRT.isCantkRTCordova()) {
		console.log("Native Audio supported: load native Audio")
		this.loadSoundMusicNative();
	}
	else if(isWebAudioSupported()) {
		console.log("WebAudio supported: load Web Audio")
		this.loadSoundMusicWebAudio();
	}
	else {
		this.loadSoundMusicHTML5();
	}
	this.soundMusicsPlaying = this.soundMusicAutoPlay;

	return this;
}

UIWindowManager.prototype.isSoundMusicPlaying = function(name) {
	var playing = false;
	for(var key in UIWindowManager.soundMusic) {
		if(name === key || !name) {
			var info = UIWindowManager.soundMusic[key];
			if(info && info.audio) {
				if(info.playing) {
					playing = true;
					break;
				}
			}
		}
	}

	return playing;
}

/*
UIWindowManager.prototype.getSceneIds = function() {
    var ids = [];
    this.children.forEach(function(scene) {
        ids.push(scene.Id);
    });
    
    return ids;
}

UIWindowManager.prototype.getSceneJsonById = function(id) {
    var scenes = this.children;
    for(var i = 0; i < scenes.length; i++) {
        var scene = scenes[i];
        if(id === scene.id) {
            return scene.toJson();
        }  
    }
    return null;
}
*/

UIWindowManager.prototype.stopSoundMusic = function(name) {
	for(var key in UIWindowManager.soundMusic) {
		if(name === key || !name) {
			var info = UIWindowManager.soundMusic[key];
			if(info && info.audio) {
				info.audio.pause();
				info.playing = false;
				this.soundMusicsPlaying = false;
			}
		}
	}

	return this;
}

UIWindowManager.prototype.playSoundMusic = function(name, onDone) {
	if(this.soundMusicsPlaying) {
		this.stopSoundMusic();
	}

	if(!this.soundMusicsEnalbe) {
        if(name) {
            this.lastAudioInfo = UIWindowManager.soundMusic[name];
        }
		console.log("this.soundMusicsEnalbe is disable ");
		return this;
	}

	if(!name && this.lastAudioInfo && this.lastAudioInfo.audio) {
		var info = this.lastAudioInfo;

		UIWindowManager.setVolumeOfAudio(info.audio, UIWindowManager.soundMusicVolume);
		info.audio.play();
		info.playing = true;
		this.soundMusicsPlaying = true;

		return this;
	}

	for(var key in UIWindowManager.soundMusic) {
		if(name === key || !name) {
			var info = UIWindowManager.soundMusic[key];
			if(info && info.audio) {
				if(onDone) {
				    if(info.audio.once) {
                    	info.audio.once("end", onDone);
                    } else {
                        info.audio.addEventListener("ended", function(e) {
                            onDone();
                        });
                    }
				}
				UIWindowManager.setVolumeOfAudio(info.audio, UIWindowManager.soundMusicVolume);
				info.audio.play();
				info.playing = true;
				this.lastAudioInfo = info;
				this.soundMusicsPlaying = true;

				console.log("UIWindowManager.prototype.playSoundMusic");
				break;
			}
		}
	}

	console.log("playSoundMusic:" + name);

	return this;
}

UIWindowManager.prototype.getSoundMusicNames = function() {
	if(!this.soundMusicURLs) {
		return [];
	}

	var names = this.soundMusicURLs.split("\n");
	for(var i = 0; i < names.length; i++) {
		names[i] = basename(names[i]);
	}

	return names;
}

UIWindowManager.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIWindow;
}

function UIWindowManagerCreator() {
	var args = ["ui-window-manager", "ui-window-manager", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIWindowManager();

		return g.initUIWindowManager(this.type);
	}
	
	return;
}
	
ShapeFactoryGet().addShapeCreator(new UIWindowManagerCreator());

/*
 * File:   ui-image-button.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Image Button
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIImageButton() {
	return;
}

UIImageButton.prototype = new UIElement();
UIImageButton.prototype.isUIImageButton = true;

UIImageButton.prototype.initUIImageButton = function(type, w, h) {
	this.initUIElement(type, w, h);
	this.setImage(UIElement.IMAGE_NORMAL, null);
	this.setImage(UIElement.IMAGE_ACTIVE, null);
	this.setImage(UIElement.IMAGE_DISABLE, null);
	this.addEventNames(["onUpdateTransform"]); 

	return this;
}

UIImageButton.prototype.shapeCanBeChild = function(shape) {
	return false;
}

function UIImageButtonCreator(w, h) {
	var args = ["ui-image-button", "ui-image-button", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIImageButton();
		return g.initUIImageButton(this.type, w, h);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIImageButtonCreator(120, 90));

/*
 * File:   ui-image-normal-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Normal Image View 
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIImageNormalView() {
	return;
}

UIImageNormalView.prototype = new UIImageView();
UIImageNormalView.prototype.isUIImageNormalView = true;

UIImageNormalView.prototype.initUIImageNormalView = function(type, w, h) {
	this.userImages = [];
	this.cachedImages = [];

	this.initUIElement(type);
	this.initUIImageView(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.current = 0;
	this.offsetX = 0;
	this.offsetY = 0;
	this.imageScale = 1;

	this.velocityTracker = new VelocityTracker();
	this.interpolator =  new DecelerateInterpolator();
	this.errorImage = UIImageView.createImage("drawapp8/images/common/failed.png", null);
	this.loadingImage = UIImageView.createImage("drawapp8/images/common/loading.png", null);
	
	return this;
}

UIImageNormalView.prototype.onPointerDownRunning = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}

	this.velocityTracker.clear();

	return;
}

UIImageNormalView.prototype.onPointerMoveRunning = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}

	this.offsetX = this.offsetX + this.getMoveDeltaX();
	this.offsetY = this.offsetY + this.getMoveDeltaY();

	this.addMovementForVelocityTracker();

	return ;
}

UIImageNormalView.prototype.getVelocity = function() {
	return this.velocityTracker.getVelocity().x;
}

UIImageNormalView.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}

	var velocity = this.velocityTracker.getVelocity();
	var xa = this.w;
	var ya = this.h;
	var xt = velocity.x/xa;
	var yt = velocity.y/ya;
	var t = Math.max(xt, yt);

	var xd = 0.5 * xa * xt * xt;
	var yd = 0.5 * ya * yt * yt;

	xd = velocity.x > 0 ? xd : -xd;
	yd = velocity.y > 0 ? yd : -yd;
	this.scrollTo(xd, yd, t * 1000);

	return true;
}

UIImageNormalView.prototype.scrollTo = function(xd, yd, t) {
	var imageview = this;
	var duration = Math.max(500, Math.min(t, 1000));
	
	var startTime = (new Date()).getTime();
	var offsetXStart = this.offsetX;
	var offsetYStart = this.offsetY;
	var currentImage = this.cachedImages[this.current];

	var dx = Math.min(currentImage.width/2, xd);
	var dy = Math.min(currentImage.height/2, yd);

	function animStep() {
		var now = new Date();
		var percent = (now.getTime() - startTime)/duration;
		
		if(percent < 1) {
			imageview.offsetX = offsetXStart + percent * dx;
			imageview.offsetY = offsetYStart + percent * dy;

			setTimeout(animStep, 10);
		}
		else {
			delete startTime;
			imageview.offsetX = offsetXStart + dx;
			imageview.offsetY = offsetYStart + dy;
		}

		delete now;
		imageview.postRedraw();
	}

	animStep();

	return;
}

UIImageNormalView.prototype.switchTo = function(offset) {
	var current = this.current;
	var n = this.userImages.length;
	if(offset > 0) {
		if((this.current+offset) < n) {
			current = this.current + offset;	
		}
	}
	else {
		if((this.current+offset) > 0) {
			current = this.current + offset;
		}
	}
}

UIImageNormalView.prototype.calcImageDefaultOffset = function() {
	var index = this.current;
	if(index < 0 || index >= this.cachedImages.length) {
		return;
	}

	var image = this.cachedImages[index];
	if(!image || !image.width) {
		return;
	}

	this.imageScale = Math.min(this.w/image.width, this.h/image.height);
	
	var w = this.imageScale * image.width;
	var h = this.imageScale * image.height;

	this.offsetX = (this.w-w)/2;
	this.offsetY = (this.h-h)/2;

	return;
}

UIImageNormalView.prototype.setCurrentImage = function(index) {
	if(index < 0 || index >= this.userImages.length) {
		return;
	}

	this.current = index;
	this.calcImageDefaultOffset();

	return;
}

UIImageNormalView.prototype.onDoubleClick = function(point, beforeChild) {
	this.calcImageDefaultOffset();
	return this.callOnDoubleClickHandler(point);
}

UIImageNormalView.prototype.paintSelfOnly = function(canvas) {
	if(!this.userImages || !this.userImages.length) {
		return;
	}
	
	this.ensureImages();

	var currentImage = this.cachedImages[this.current];
	if(!currentImage || !currentImage.width) {
		return;
	}

	this.imageScale = 1;
	canvas.save();
	canvas.rect(0, 0, this.w, this.h);
	canvas.clip();

	canvas.translate(this.offsetX, this.offsetY);
	canvas.scale(this.imageScale, this.imageScale);
	canvas.drawImage(currentImage, 0, 0);
	canvas.restore();

	return;
}

function UIUIImageNormalViewCreator() {
	var args = ["ui-image-normal-view", "ui-image-normal-view", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIImageNormalView();

		return g.initUIImageNormalView(this.type, 300, 300);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIUIImageNormalViewCreator());

/*
 * File:   ui-image-slide-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Image Slide View.
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */
function UIImageSlideView() {
	return;
}

UIImageSlideView.prototype = new UIImageView();
UIImageSlideView.prototype.isUIImageSlideView = true;

UIImageSlideView.prototype.saveProps = ["showIndicator", "frameDuration"];
UIImageSlideView.prototype.initUIImageSlideView = function(type, w, h) {
	this.initUIElement(type);	
	this.initUIImageView(w, h);
	
	this.offset = 0;
	this.addEventNames(["onChanged"]);
	this.setTextType(Shape.TEXT_NONE);
	imageSlideViewInitCustomProp(this);

	return this;
}

UIImageSlideView.prototype.onInit = function() {
	var slideview = this;

	this.currFrame = 0;

	function nextFrame() {
		if(!slideview.isInDesignMode() && slideview.isVisible()) {
			var duration = slideview.getFrameDuration();
			
			slideview.postRedraw();
			setTimeout(nextFrame, duration);

			var newFrame = slideview.currFrame + 1;
			slideview.animScrollTo(-slideview.w, newFrame);
		}
	}

	var duration = this.getFrameDuration();
	setTimeout(nextFrame, duration);

	return;
}

UIImageSlideView.prototype.getFrameDuration = function() {
	return this.frameDuration ? this.frameDuration : 5000;
}

UIImageSlideView.prototype.setFrameDuration = function(frameDuration) {
	this.frameDuration = Math.max(1000, Math.min(frameDuration, 300000));

	return;
}

UIImageSlideView.prototype.setShowIndicator = function(value) {
	this.showIndicator = value;

	return;
}

UIImageSlideView.prototype.getFrameIndicatorParams = function() {
	var n = this.userImages.length;
	var itemSize = Math.min((0.5 * this.w)/n, 40);
	var indicatorWidth = itemSize * n;

	var dx = (this.w - indicatorWidth)/2;
	var dy = 0.8 * this.h;

	return {offsetX:dx, offsetY:dy, itemSize:itemSize, n:n};
}

UIImageSlideView.prototype.getCurrent = function() {
	return this.currFrame;
}

UIImageSlideView.prototype.getCurrentImage = function() {
	var image = this.cachedImages[this.currFrame];

	return image;
}

UIImageSlideView.prototype.setValue = function(src) {
	for(var i = 0; i < this.cachedImages.length; i++) {
		var iter = this.cachedImages[i];
		if(iter.src.indexOf(src) >= 0 || src.indexOf(iter.src) >= 0) {
			return this.setCurrent(i);	
		}
	}

	return this;
}

UIImageSlideView.prototype.setCurrent = function(currFrame) {
	this.setCurrentFrame(currFrame);

	return this;
}

UIImageSlideView.prototype.setCurrentFrame = function(currFrame) {
	this.offset = 0;
	this.currFrame = (currFrame + this.userImages.length)%this.userImages.length;
	this.postRedraw();

	this.callOnChangedHandler(this.currFrame);

	return this;
}

UIImageSlideView.prototype.animScrollTo = function(range, newFrame) {
	var duration = 1000;
	var slideview = this;
	var startOffset = this.offset;
	var startTime = (new Date()).getTime();
	var interpolator = new DecelerateInterpolator(2);

	if(slideview.animating) {
		return;
	}

	slideview.animating = true;
	function animStep() {
		var now = new Date();
		var timePercent = (now.getTime() - startTime)/duration;
		var percent = interpolator.get(timePercent);
		
		if(timePercent < 1) {
			slideview.offset = startOffset + range * percent;
			setTimeout(animStep, 10);
		}
		else {
			slideview.offset = 0;
			slideview.setCurrentFrame(newFrame);
			delete startTime;
			delete interpolator;
			delete slideview.animating;
		}

		delete now;
		slideview.postRedraw();
	}

	animStep();

	return;
}

UIImageSlideView.prototype.onPointerDownRunning = function(point, beforeChild) {
	if(this.isEventHandledByChild()) {
		return;
	}
	this.setEventHandled();

	if(!this.velocityTracker) {
		this.velocityTracker = new VelocityTracker();
	}
	this.velocityTracker.clear();

	return true;
}

UIImageSlideView.prototype.isEventHandledByChild = function() {
	var status = UIElement.lastEvent.status;
	return status & UIElement.EVENT_HSCROLL_HANDLED;
}

UIImageSlideView.prototype.setEventHandled = function() {
	this.setLastEventStatus(UIElement.EVENT_HSCROLL_HANDLED);
	
	return this;
}

UIImageSlideView.prototype.onPointerMoveRunning = function(point, beforeChild) {
	if(this.animating) {
		this.setEventHandled();
		return;
	}
	if(beforeChild) {
		return;
	}
	if(this.isEventHandledByChild()) {
		return;
	}

	var frames = this.getFrames();
	var currFrame = this.currFrame;
	var dx = this.getMoveAbsDeltaX();
	if((currFrame > 0 && dx > 0) || ((currFrame+1) < frames && dx < 0)) {
		this.setEventHandled();
	}
	else {
		return;
	}

	this.offset = dx;
	this.addMovementForVelocityTracker();

	return;
}

UIImageSlideView.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(this.animating) {
		this.setEventHandled();
		return;
	}
	if(beforeChild) {
		return;
	}
	if(this.isEventHandledByChild()) {
		return;
	}
	
	var frames = this.getFrames();
	var currFrame = this.currFrame;
	var dx = this.getMoveAbsDeltaX();
	if((currFrame > 0 && dx > 0) || ((currFrame+1) < frames && dx < 0)) {
		this.setEventHandled();
	}
	else {
		return;
	}

	var range = 0;
	var offsetX = this.offset;
	var newFrame = this.currFrame;
	var velocity = this.velocityTracker.getVelocity().x;
	var distance = offsetX + velocity;

	//console.log("offsetX: " + offsetX + "velocity:" + velocity + " distance:" + distance );
	if(Math.abs(offsetX) < 10) {
		this.offset = 0;

		return;
	}

	if(Math.abs(distance) > this.w/3) {
		if(offsetX > 0) {
			range = this.w - offsetX;	
			newFrame = this.currFrame - 1;
		}
		else {
			range = -this.w - offsetX;
			newFrame = this.currFrame + 1;
		}
	}
	else {
		range = -offsetX;
	}

	this.animScrollTo(range, newFrame);

	return;
}

UIImageSlideView.prototype.onClick = function(point, beforeChild) {
	if(beforeChild || this.animating) {
		return;
	}

	var params = this.getFrameIndicatorParams();

	var dx = params.offsetX;
	var dy = params.offsetY;
	var itemSize = params.itemSize;
	var n = params.n;
	var x = point.x;
	var y = point.y;

	if(y < dy || y > (dy + itemSize) || x < dx || x > (dx + n * itemSize)) {
		return;
	}

	for(var i = 0; i < n; i++) {
		if(x > dx && x < (dx + itemSize)) {
			this.setCurrentFrame(i);	
			break;
		}

		dx += itemSize;
	}

	return;
}

UIImageSlideView.prototype.drawFrameIndicator = function(canvas, currFrame) {
	var params = this.getFrameIndicatorParams();

	var dx = params.offsetX;
	var dy = params.offsetY;
	var itemSize = params.itemSize;
	var n = params.n;

	dx += itemSize/2;
	dy += itemSize/2;

	canvas.fillStyle = this.style.fillColor;
	canvas.strokeStyle = this.style.lineColor;

	for(var i = 0; i < n; i++) {
		canvas.beginPath();
		canvas.arc(dx, dy, 10, 0, Math.PI * 2);
		dx += itemSize;
	

		if(i === currFrame) {
			canvas.save();
			canvas.shadowColor = this.style.lineColor;
			canvas.shadowBlur = 5;
			canvas.shadowOffsetX = 0;
			canvas.shadowOffsetY = 0;

			canvas.fill();
			canvas.stroke();
			canvas.restore();
		}
		else {
			canvas.fill();
		}
	}

	return;
}

UIImageSlideView.prototype.getPrevFrame = function() {
	var index = (this.currFrame - 1 + this.userImages.length)%this.userImages.length;

	return this.cachedImages[index];
}

UIImageSlideView.prototype.getFrames = function() {
	return this.userImages.length;
}

UIImageSlideView.prototype.getNextFrame = function() {
	var index = (this.currFrame + 1) % this.userImages.length;

	return this.cachedImages[index];
}

UIImageSlideView.prototype.drawOneImage = function(canvas, image) {
	var fillColor = this.style.fillColor;

	if(this.images.display === UIElement.IMAGE_DISPLAY_SCALE) {
		canvas.drawImage(image, 0, 0, image.width, image.height, 0, 0, this.w, this.h);
	}
	else if(this.images.display === UIElement.IMAGE_DISPLAY_SCALE_KEEP_RATIO) {
		var rect = {x:0, y:0};
		rect.w = image.width;
		rect.h = image.height;

		this.drawImageAt(canvas, image, UIElement.IMAGE_DISPLAY_SCALE_KEEP_RATIO, 0, 0, this.w, this.h, rect);
	}
	else {
		UIImageView.drawImageAtCenter(canvas, image, 0, 0, this.w, this.h, true, fillColor);
	}

	return;
}

UIImageSlideView.prototype.drawImage = function(canvas) {
	if(!this.userImages || !this.userImages.length) {
		return;
	}
	
	this.ensureImages();

	var currFrame = (this.currFrame ? this.currFrame : 0)%this.userImages.length;
	var image = this.cachedImages[currFrame];

	if(image && image.width > 0) {
		canvas.save();
		canvas.rect(0, 0, this.w, this.h);
		canvas.clip();
		canvas.beginPath();

		canvas.translate(this.offset, 0);

		this.drawOneImage(canvas, image);

		var offset = Math.abs(this.offset);
		if(this.offset < 0) {
			image = this.getNextFrame();
			if(image && image.width > 0) {
				canvas.translate(this.w, 0);
				this.drawOneImage(canvas, image);
			}
		}
		else if(offset > 0) {
			image = this.getPrevFrame();
			if(image && image.width > 0) {
				canvas.translate(-this.w, 0);
				this.drawOneImage(canvas, image);
			}
		}
		canvas.restore();

		if(this.showIndicator) {
			this.drawFrameIndicator(canvas, currFrame);
		}
	}

	return;
}


UIImageSlideView.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIButton || shape.isUIGroup || shape.isUILabel || shape.isUIImage;
}

function UIImageSlideViewCreator() {
	var args = [ "ui-image-slide-view", "ui-image-slide-view", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIImageSlideView();
		return g.initUIImageSlideView(this.type, 200, 200);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIImageSlideViewCreator());

/*
 * File:   ui-page-indicator.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Page Indicator
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIPageIndicator
 * @extends UIElement
 * 标签控件（UIViewPager）的页面指示器。
 *
 */

/**
 * @class UIPageIndicatorSimple
 * @extends UIElement
 * 标签控件（UIViewPager）的页面指示器。
 *
 */

/**
 * @class UIPageIndicatorNormal
 * @extends UIElement
 * 标签控件（UIViewPager）的页面指示器。
 *
 */

/**
 * @class UIPageIndicatorNormalX
 * @extends UIPageIndicatorNormal
 * 标签控件（UIViewPager）的页面指示器，UIPageIndicatorNormalX可以放UIPageIndicatorButton。
 *
 */

/**
 * @class UIPageIndicatorButton
 * @extends UIRadioBox
 * 页面指示器里的按钮，只能放在UIPageIndicatorNormalX中。
 * UIPageIndicatorNormalX会根据页面的个数自动创建UIPageIndicatorButton，你可以设置它图片和字体，它支持的图片有下面4个：
 *
 * * UIElement.IMAGE_CURRENT_PAGE_BG 当前项的背景图片。
 * * UIElement.IMAGE_CURRENT_PAGE_FG 当前项的前景图片。
 * * UIElement.IMAGE_NOT_CURRENT_PAGE_BG 非当前项的背景图片。
 * * UIElement.IMAGE_NOT_CURRENT_PAGE_FG 非当前项的前景图片。
 *
 */
function UIPageIndicator() {
	return;
}

UIPageIndicator.prototype = new UIHScrollView();
UIPageIndicator.prototype.isUIPageIndicator = true;
UIPageIndicator.prototype.onPointerUpRunning = UIScrollView.prototype.onPointerUpRunning;

UIPageIndicator.prototype.isScrollable = function() {
	return this.getPages() > this.getVisibleTabs();
}

UIPageIndicator.prototype.setVisibleTabs = function(visibleTabs) {
	this.visibleTabs = visibleTabs;
	
	return;
}

UIPageIndicator.prototype.getVisibleTabs = function() {
	return this.visibleTabs ? this.visibleTabs : 6;
}

UIPageIndicator.prototype.getTabWidth = function() {
	var n = this.getPages();
	var visibleTabs = this.getVisibleTabs();

	if(n < visibleTabs) {
		return this.w/n;
	}
	else {
		return this.w/visibleTabs;
	}
}

UIPageIndicator.prototype.getScrollRange = function() {
	var visibleTabs = this.getVisibleTabs();

	if(visibleTabs < 6) {
		return this.w;
	}
	else {
		var n = this.getPages();
		return this.getTabWidth() * n;
	}
}

UIPageIndicator.prototype.initUIPageIndicator = function(type, w, h) {
	this.initUIHScrollView(type, 10, null);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.setCanRectSelectable(false, false);
	this.images.display = UIElement.IMAGE_DISPLAY_9PATCH;

	return this;
}

UIPageIndicator.prototype.getViewPager = function() {
	if(!this.getParent()) {
		return;
	}

	if(this.viewPager && !this.viewPager.parentShape) {
		this.viewPager = null
	}

	if(!this.viewPager) {
		this.viewPager = this.getParent().findChildByType("ui-view-pager", true);
		if(!this.viewPager && this.isUIPageIndicatorSimple) { 
			this.viewPager = this.getWindow().findChildByType("ui-view-pager", true);
		}
	}

	return this.viewPager;
}

UIPageIndicator.prototype.getViewPagerOffset = function() {
	var viewPager = this.getViewPager();

	return viewPager ? viewPager.offset/viewPager.w : 0;
}

UIPageIndicator.prototype.getPages = function() {
	var viewPager = this.getViewPager();

	if(viewPager) {
		viewPager.pageIndicator = this;
	}

	return viewPager ? viewPager.getFrames() : 3;
}

UIPageIndicator.prototype.getCurrent = function() {
	var viewPager = this.getViewPager();
	
	return viewPager ? viewPager.getCurrent() : 0;
}

UIPageIndicator.prototype.paintOneIndicator = function(canvas, isCurrent, index, x, y, w, h) {
	canvas.beginPath();
	canvas.arc(x+w/2, y+h/2, 10, 0, 2 * Math.PI);
	canvas.fill();
	if(isCurrent) {
		canvas.stroke();
	}

	return;
}

UIPageIndicator.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIPageIndicator.prototype.paintOneIndicatorCircle = function(canvas, isCurrent, index, x, y, w, h) {
	var r = Math.floor(Math.max(5, h/4));

	canvas.lineWidth = this.style.lineWidth;
	canvas.fillStyle = isCurrent ? this.style.fillColorOfCurrent : this.style.fillColor;
	canvas.strokeStyle = isCurrent ? this.style.lineColorOfCurrent : this.style.lineColor;

	canvas.beginPath();
	canvas.arc(x+w/2, y+h/2, r, 0, 2 * Math.PI);
	canvas.fill();
	canvas.stroke();

	return;
}

UIPageIndicator.prototype.paintOneIndicatorNumber = function(canvas, isCurrent, index, x, y, w, h) {
	var r = Math.floor(Math.max(5, h/4));
	var ox = Math.floor(x+w/2);
	var oy = Math.floor(y+h/2);

	canvas.lineWidth = this.style.lineWidth;
	canvas.fillStyle = isCurrent ? this.style.fillColorOfCurrent : this.style.fillColor;
	canvas.strokeStyle = isCurrent ? this.style.lineColorOfCurrent : this.style.lineColor;

	canvas.beginPath();
	canvas.arc(ox, oy, r, 0, 2 * Math.PI);
	canvas.fill();
	canvas.stroke();

	canvas.font = r < 20 ? "16px sans" : "22px sans";
	canvas.textAlign = "center";
	canvas.textBaseline = "middle";
	canvas.fillStyle = this.style.textColor;
	canvas.fillText(index+1, ox, oy);
	
	return;
}

UIPageIndicator.prototype.paintOneIndicatorRect = function(canvas, isCurrent, index, x, y, w, h) {
	var size = 10;
	if(w > h) {
		size = Math.max(20, h/4);
	}
	else {
		size = Math.max(20, w/4);
	}
	size = Math.floor(size);

	canvas.lineWidth = this.style.lineWidth;
	canvas.fillStyle = isCurrent ? this.style.fillColorOfCurrent : this.style.fillColor;
	canvas.strokeStyle = isCurrent ? this.style.lineColorOfCurrent : this.style.lineColor;
	
	var dx = (w - size)/2;
	var dy = (h - size)/2;

	canvas.beginPath();
	canvas.rect(x+dx, y+dy, size, size);
	canvas.fill();
	canvas.stroke();

	return;
}

UIPageIndicator.prototype.paintOneIndicatorLine = function(canvas, isCurrent, index, x, y, w, h) {
	var size = 4;
	if(w > h) {
		size = Math.max(4, h/4);
	}
	else {
		size = Math.max(4, w/4);
	}
	size = Math.floor(size);

	canvas.lineWidth = this.style.lineWidth;
	canvas.fillStyle = isCurrent ? this.style.fillColorOfCurrent : this.style.fillColor;
	canvas.strokeStyle = isCurrent ? this.style.lineColorOfCurrent : this.style.lineColor;
	
	var dx = (w - size)/2;
	var dy = (h - size)/2;

	canvas.beginPath();
	if(w > h) {
		canvas.rect(x, y+dy, w, size);
	}
	else {
		canvas.rect(x+dx, y, size, h);
	}
	
	canvas.fill();
	canvas.stroke();

	return;
}


UIPageIndicator.prototype.onClickItem = function(index) {
	var viewPager = this.getViewPager();
	if(viewPager) {
		viewPager.setCurrent(index);
	}

	return;
}

UIPageIndicator.prototype.findItemByPoint = function(point) {
	var n = this.getPages();

	if(this.w > this.h) {
		var itemW = this.getTabWidth();

		for(var i = 0; i < n; i++) {
			if(point.x > i * itemW && point.x < (i+1) * itemW) {
				return i;
			}
		}
	}
	else {
		var itemH = this.h/n;
		for(var i = 0; i < n; i++) {
			if(point.y > i * itemH && point.y < (i+1) * itemH) {
				return i;
			}
		}
	}

	return -1;
}

UIPageIndicator.prototype.onClick = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}

	var index = this.findItemByPoint(point);
	
	if(index >= 0) {
		this.onClickItem(index);
	}

	this.callOnClickHandler(point);

	return;
}

UIPageIndicator.prototype.paintBackground = function(canvas) {
	var n = this.getPages();
	if(!n) {
		canvas.lineWidth = 1;
		canvas.strokeStyle = "Red";
		canvas.rect(0, 0, this.w, this.h)
		canvas.stroke();
	}
}

UIPageIndicator.prototype.paintSelfOnly = function(canvas) {
	var n = this.getPages();
	var current = this.getCurrent();
	var point = {};
	point.x = this.lastPosition.x - this.left;
	point.y = this.lastPosition.y - this.top;

	this.pointerOnItem = this.findItemByPoint(point);

	this.paintBackground(canvas);

	canvas.translate(-this.offset, 0);
	if(this.w > this.h) {
		var itemH = this.h;
		var itemW = this.getTabWidth();
		var offset = Math.floor(this.getViewPagerOffset() * itemW);

		for(var i = 0; i < n; i++) {
			var dx = i*itemW;
			this.paintOneIndicator(canvas, i === current, i, dx, 0, itemW, itemH);
		}
	}
	else {
		var itemW = this.w;
		var itemH = this.h / n;

		for(var i = 0; i < n; i++) {
			var dy = i*itemH; 
			this.paintOneIndicator(canvas, i === current, i, 0, dy, itemW, itemH);
		}
	}
	canvas.translate(this.offset, 0);
	delete this.pointerOnItem;

	return;
}

function UIPageIndicatorCreator() {
	var args = ["ui-page-indicator", "ui-page-indicator", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageIndicator();

		return g.initUIPageIndicator(this.type, 200, 60);
	}
	
	return;
}

////////////////////////////////////////////////////////////////////}-{
function UIPageIndicatorSimple() {
	
	return;
}

UIPageIndicatorSimple.prototype.isScrollable = function() {
	return this.getPages() > this.getVisibleTabs();
}

UIPageIndicatorSimple.prototype = new UIPageIndicator();
UIPageIndicatorSimple.prototype.isUIPageIndicatorSimple = true;

UIPageIndicatorSimple.prototype.saveProps = ["indicatorStyle"];
UIPageIndicatorSimple.prototype.initUIPageIndicatorSimple = function(type, w, h, indicatorStyle) {
	this.initUIPageIndicator(type, w, h);	
	this.style.fillColorOfCurrent = "Gray";
	this.style.lineColorOfCurrent = "Black";
	this.setAlwaysOnTop(true);
	this.setVisibleTabs(12);
	this.setIndicatorStyle(indicatorStyle);

	return this;
}

UIPageIndicatorSimple.prototype.setLineColorOfCurrent = function(value) {
	this.style.lineColorOfCurrent = value;

	return;
}

UIPageIndicatorSimple.prototype.setFillStyleOfCurrent = function(value) {
	this.style.fillColorOfCurrent = value;

	return;
}

UIPageIndicatorSimple.prototype.setIndicatorStyle = function(indicatorStyle) {
	this.indicatorStyle = indicatorStyle;

	return this;
}

UIPageIndicatorSimple.prototype.paintOneIndicator = function(canvas, isCurrent, index, x, y, w, h) {
	switch(this.indicatorStyle) {
		case "circle": {
			this.paintOneIndicatorCircle(canvas, isCurrent, index, x, y, w, h);
			break;
		}
		case "rect": {
			this.paintOneIndicatorRect(canvas, isCurrent, index, x, y, w, h);
			break;
		}
		case "line": {
			this.paintOneIndicatorLine(canvas, isCurrent, index, x, y, w, h);
			break;
		}
		default: {
			this.paintOneIndicatorNumber(canvas, isCurrent, index, x, y, w, h);
			break;
		}
	}
}

function UIPageIndicatorCircleCreator() {
	var args = ["ui-page-indicator-circle", "ui-page-indicator-circle", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageIndicatorSimple();
		return g.initUIPageIndicatorSimple(this.type, 200, 60, "circle");
	}
	
	return;
}

function UIPageIndicatorNumberCreator() {
	var args = ["ui-page-indicator-number", "ui-page-indicator-number", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageIndicatorSimple();
		return g.initUIPageIndicatorSimple(this.type, 200, 60, "number");
	}
	
	return;
}

function UIPageIndicatorRectCreator() {
	var args = ["ui-page-indicator-rect", "ui-page-indicator-rect", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageIndicatorSimple();

		return g.initUIPageIndicatorSimple(this.type, 200, 60, "rect");
	}
	
	return;
}

function UIPageIndicatorLineCreator() {
	var args = ["ui-page-indicator-line", "ui-page-indicator-line", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageIndicatorSimple();

		return g.initUIPageIndicatorSimple(this.type, 200, 60, "line");
	}
	
	return;
}

function UIPageIndicatorSimpleCreator() {
	var args = ["ui-page-indicator-simple", "ui-page-indicator-simple", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageIndicatorSimple();

		return g.initUIPageIndicatorSimple(this.type, 200, 60, "line");
	}
	
	return;
}

////////////////////////////////////////////////////////////////////}-{
function UIPageIndicatorNormal() {
	return;
}

UIPageIndicatorNormal.prototype = new UIPageIndicator();
UIPageIndicatorNormal.prototype.isUIPageIndicatorNormal = true;

UIPageIndicatorNormal.prototype.saveProps = ["enableAnimatePage", "strItemImages", "strItemTexts", "strItemImagesOfCurrent"];
UIPageIndicatorNormal.prototype.initUIPageIndicatorNormal = function(type, w, h) {
	this.initUIPageIndicator(type, w, h);	

	this.itemTexts = [];
	this.itemImages = [];
	this.imagePosition = "left";
	this.itemImagesOfCurrent = [];

	this.setMargin(5, 5);
	this.setAlwaysOnTop(false);
	this.setImage(UIElement.ITEM_BG_NOTMAL, null);
	this.setImage(UIElement.ITEM_BG_ACTIVE, null);
	this.setImage(UIElement.ITEM_BG_CURRENT_NOTMAL, null);
	this.setImage(UIElement.ITEM_BG_CURRENT_ACTIVE, null);

	return this;
}

UIPageIndicatorNormal.prototype.onInit = function() {
	this.syncImages();
}

UIPageIndicatorNormal.prototype.syncImages = function() {
	this.itemImages = [];
	this.itemImagesOfCurrent = [];

	for(var key in this.images) {
		if(key === "display") continue;
		var image = this.images[key];
		if(key.indexOf("current-item-images-") === 0) {
			this.itemImagesOfCurrent.push(image);	
		}
		else if(key.indexOf("item-images-") === 0) {
			this.itemImages.push(image);	
		}
	}

	return;
}

UIPageIndicatorNormal.prototype.setEnableAnimatePage = function(value) {
	this.enableAnimatePage = value;

	return;
}

UIPageIndicatorNormal.prototype.setItemImagesByStr = function(str) {
	var arr = str.split("\n");
	var name = "item-images-";

	var n = this.itemImages.length;
	for(var i = 0; i < n; i++) {
		this.setImage(name + i, null);
	}

	for(var i = 0; i < arr.length; i++) {
		var iter = arr[i];
		if(iter) {
			this.setImage(name + i, iter);
		}
	}

	this.syncImages();
	this.strItemImages = str;

	return;
}

UIPageIndicatorNormal.prototype.setItemImagesOfCurrentByStr = function(str) {
	var arr = str.split("\n");
	var name = "current-item-images-";

	var n = this.itemImagesOfCurrent.length;
	for(var i = 0; i < n; i++) {
		this.setImage(name + i, null);
	}

	for(var i = 0; i < arr.length; i++) {
		var iter = arr[i];
		if(iter) {
			this.setImage(name + i, iter);
		}
	}

	this.syncImages();
	this.strItemImagesOfCurrent = str;

	return;
}

UIPageIndicatorNormal.prototype.setItemTextsByStr = function(str) {
	this.strItemTexts = str;
	this.itemTexts = str.split("\n");

	return;
}

UIPageIndicatorNormal.prototype.setImagePosition = function(value) {
	this.imagePosition = value;

	return;
}

UIPageIndicatorNormal.prototype.getItemImagesStr = function() {
	return this.strItemImages ? this.strItemImages : "";
}

UIPageIndicatorNormal.prototype.getItemImagesStrOfCurrent = function() {
	return this.strItemImagesOfCurrent ? this.strItemImagesOfCurrent : "";
}

UIPageIndicatorNormal.prototype.getItemImages = function() {
	if(!this.itemImages.length) {
		this.syncImages();
	}

	return this.itemImages;
}

UIPageIndicatorNormal.prototype.getItemImagesOfCurrent = function() {
	if(!this.itemImagesOfCurrent.length) {
		this.syncImages();
	}

	return this.itemImagesOfCurrent;
}

UIPageIndicatorNormal.prototype.getItemTextsStr = function() {
	return this.strItemTexts ? this.strItemTexts : "";
}

UIPageIndicatorNormal.prototype.getItemTexts = function() {
	if(!this.itemTexts.length && this.strItemTexts) {
		this.setItemTextsByStr(this.strItemTexts);
	}

	return this.itemTexts;
}

UIPageIndicatorNormal.prototype.getItemImage = function(index, isCurrent) {
	var images = isCurrent ? this.getItemImagesOfCurrent() : this.getItemImages();
	if(images && index < images.length) {
		return images[index];
	}

	return null;
}

UIPageIndicatorNormal.prototype.getBackgroundImage = function(index, isCurrent) {
	var type = "";
	var active = this.pointerDown && this.pointerOnItem === index;
	if(isCurrent) {
		type = active ? UIElement.ITEM_BG_CURRENT_ACTIVE : UIElement.ITEM_BG_CURRENT_NOTMAL;
	}
	else {
		type = active ? UIElement.ITEM_BG_ACTIVE : UIElement.ITEM_BG_NOTMAL;
	}

	return this.getImageByType(type);
}

UIPageIndicatorNormal.prototype.paintOneIndicatorBackground = function(canvas, isCurrent, index, x, y, w, h) {
	var wImage = this.getBackgroundImage(index, isCurrent);
	if(!wImage || !wImage.getImage()) {
		return;
	}

	var image = wImage.getImage();
	var srcRect = wImage.getImageRect();

	this.drawImageAt(canvas, image, this.images.display, x, y, w, h, srcRect);

	return;
}

UIPageIndicatorNormal.prototype.setItemTextColorOfCurrent = function(value) {
	this.style.textColorOfCurrent = value;

	return;
}

UIPageIndicatorNormal.prototype.getItemTextColorOfCurrent = function() {
	return this.style.textColorOfCurrent ? this.style.textColorOfCurrent : "green";
}

UIPageIndicatorNormal.prototype.paintBackground = function(canvas) {
	return;
}

UIPageIndicatorNormal.prototype.getItemLocaleText= function(index) {
	var str = null;
	var texts = this.getItemTexts();
	
	if(texts && index < texts.length) {
		str = webappGetText(texts[index]);
		if(!str) {
			str = texts[index];
		}
	}

	return str;
}

UIPageIndicatorNormal.prototype.paintOneIndicator = function(canvas, isCurrent, index, x, y, w, h) {
	var wImage = this.getItemImage(index, isCurrent);
	this.paintOneIndicatorBackground(canvas, isCurrent, index, x, y, w, h);

	var gap = 8;
	var fontSize = this.style.fontSize;
	var str = this.getItemLocaleText(index);

	canvas.font = this.style.getFont();
	canvas.fillStyle = isCurrent ? this.getItemTextColorOfCurrent() : this.style.textColor; 
	
	if(wImage && wImage.getImage()) {
		var image = wImage.getImage();
		var srcRect = wImage.getImageRect();

		var hMargin = this.hMargin;
		var vMargin = this.vMargin;

		if(str) {
			var fontSize = this.style.fontSize;
			var dx = x + hMargin;
			var dy = y + vMargin;
			var dw = w - 2 * hMargin;
			var dh = h - fontSize - 2 * vMargin - gap;

			this.drawImageAt(canvas, image,UIElement.IMAGE_DISPLAY_AUTO, dx, dy, dw, dh, srcRect);

			dx = x + (w >> 1);
			dy = y + h - vMargin; 
			canvas.textAlign = "center";
			canvas.textBaseline = "bottom";
			canvas.fillText(str, dx, dy);
		}
		else {
			var dx = x + hMargin;
			var dy = y + vMargin;
			var dw = w - 2 * hMargin;
			var dh = h - 2 * vMargin;

			this.drawImageAt(canvas, image,UIElement.IMAGE_DISPLAY_AUTO, dx, dy, dw, dh, srcRect);
		}
	}
	else {
		if(str) {
			canvas.textAlign = "center";
			canvas.textBaseline = "middle";
			canvas.fillText(str, Math.floor(x+w/2), Math.floor(y+h/2));
		}
	}

	return;
}

UIPageIndicator.prototype.onClickItem = function(index) {
	var viewPager = this.getViewPager();
	if(viewPager) {
		if(this.enableAnimatePage) {
			viewPager.switchTo(index);
		}
		else {
			viewPager.setCurrent(index);
		}
	}

	return;
}

function UIPageIndicatorNormalCreator() {
	var args = ["ui-page-indicator-normal", "ui-page-indicator-normal", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageIndicatorNormal();

		return g.initUIPageIndicatorNormal(this.type, 200, 60);
	}
	
	return;
}

////////////////////////////////////////////////////////////////////}-{
function UIPageIndicatorNormalX() {
	return;
}

UIPageIndicatorNormalX.prototype = new UIPageIndicator();
UIPageIndicatorNormalX.prototype.isUIPageIndicatorNormalX = true;
UIPageIndicatorNormalX.prototype.initUIPageIndicatorNormalX = function(type, w, h) {
	this.initUIPageIndicator(type, w, h);	

	return this;
}

UIPageIndicatorNormalX.prototype.relayoutChildren = function() {
	var arr  = this.children;
	var pagesNr = this.getPages() || 3;

	for(var i = arr.length; i < pagesNr; i++) {
		var button = this.addChild(this.createElement("ui-page-indicator-button"));
		button.setText(i);
	}
	arr.length = pagesNr;
	
	var n = pagesNr;
	var ih = this.h;
	var iw = this.w/n;

	for(var i = 0; i < n; i++) {
		var iter = arr[i];
		iter.h = ih;
		iter.w = iw;
		iter.y = 0;
		iter.x = i * iw;
		iter.xAttr = UIElement.X_FIX_LEFT;
		iter.yAttr = UIElement.Y_FIX_TOP;
		iter.widthAttr = UIElement.WIDTH_FIX;
		iter.heightAttr = UIElement.HEIGHT_FIX;
	}

	return this;
}

UIPageIndicatorNormalX.prototype.paintOneIndicator = function(canvas, isCurrent, index, x, y, w, h) {}

UIPageIndicatorNormalX.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIPageIndicatorButton;
}

function UIPageIndicatorNormalXCreator() {
	var args = ["ui-page-indicator-normal-x", "ui-page-indicator-normal-x", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageIndicatorNormalX();

		return g.initUIPageIndicatorNormalX(this.type, 200, 60);
	}
	
	return;
}

/////////////////////////////////////////////////////////////////////////////////////

function UIPageIndicatorButton() {
	return;
}

UIPageIndicatorButton.prototype = new UIRadioBox();
UIPageIndicatorButton.prototype.isUIPageIndicatorButton = true;
UIPageIndicatorButton.prototype.initUIPageIndicatorButton = function(type) {
	this.initUIRadioBox(type);	
	this.userMovable = false;
	this.userResizable = false;
	this.images = {display:UIElement.IMAGE_DISPLAY_9PATCH};
    this.setImage(UIElement.IMAGE_CURRENT_PAGE_BG, null);
    this.setImage(UIElement.IMAGE_CURRENT_PAGE_FG, null);
    this.setImage(UIElement.IMAGE_NOT_CURRENT_PAGE_BG, null);
    this.setImage(UIElement.IMAGE_NOT_CURRENT_PAGE_FG, null);

	return this;
}

UIPageIndicatorButton.prototype.getValue = function() {
	var parentShape = this.parentShape;

	if(parentShape) {
		return parentShape.getCurrent() === parentShape.children.indexOf(this);
	}
	else {
		return this.value;
	}
}

UIPageIndicatorButton.prototype.drawText = function(canvas) {}
UIPageIndicatorButton.prototype.drawImage = function(canvas) {
	var rect = null;
	var image = null;
	var value = this.getValue();
	var bgImage = this.getImageByType(value ? UIElement.IMAGE_CURRENT_PAGE_BG : UIElement.IMAGE_NOT_CURRENT_PAGE_BG);
	var fgImage = this.getImageByType(value ? UIElement.IMAGE_CURRENT_PAGE_FG : UIElement.IMAGE_NOT_CURRENT_PAGE_FG);

	image = bgImage.getImage();
	rect = bgImage.getImageRect();
	if(image) {
		this.drawImageAt(canvas, image, this.images.display, 0, 0, this.w, this.h, rect);	
	}

	image = fgImage.getImage();
	rect = fgImage.getImageRect();
	var text = this.text;
	if(text) {
		canvas.textAlign = "center";
		canvas.font = this.style.getFont();
		canvas.fillStyle = value ? this.style.textColorHighlight : this.style.textColor;
	}

	if(image) {
		if(text) {
			var fontHeight = this.style.fontSize + 10;
			this.drawImageAt(canvas, image, UIElement.IMAGE_DISPLAY_AUTO_SIZE_DOWN, 0, 0, this.w, this.h-fontHeight, rect);
			canvas.textBaseline = "bottom";
			canvas.fillText(text, this.w >> 1, this.h - 3); 
		}
		else {
			this.drawImageAt(canvas, image, UIElement.IMAGE_DISPLAY_AUTO_SIZE_DOWN, 0, 0, this.w, this.h, rect);
		}
	}
	else if(text) {
		canvas.textBaseline = "middle";
		canvas.fillText(text, this.w >> 1, this.h >> 1); 
	}

	return;
}

UIPageIndicatorButton.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIImage || shape.isUILabel;
}

function UIPageIndicatorButtonCreator() {
	var args = ["ui-page-indicator-button", "ui-page-indicator-button", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageIndicatorButton();

		return g.initUIPageIndicatorButton(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIPageIndicatorButtonCreator());
ShapeFactoryGet().addShapeCreator(new UIPageIndicatorNormalXCreator());
ShapeFactoryGet().addShapeCreator(new UIPageIndicatorNormalCreator());
ShapeFactoryGet().addShapeCreator(new UIPageIndicatorCircleCreator());
ShapeFactoryGet().addShapeCreator(new UIPageIndicatorNumberCreator());
ShapeFactoryGet().addShapeCreator(new UIPageIndicatorRectCreator());
ShapeFactoryGet().addShapeCreator(new UIPageIndicatorLineCreator());
ShapeFactoryGet().addShapeCreator(new UIPageIndicatorSimpleCreator());

/*
 * File:   ui-path.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Basic path for game. 
 * 
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIPath
 * @extends UIElement
 * UIPath 控制物体按照指定的路径运动。目前路径支持直线，抛物线，二次和三次贝塞尔曲线，sin/cos函数和圆弧曲线。可以指定运动的速度(由duration控制)和加速度(由interpolator决定)。
 *
 * 使用时先放一个UIPath对象到场景中，然后在onInit事件里增加路径，在任何时间都可以向UIPath增加对象或删除对象。
 *
 * 注意：
 *
 * 1.文档中时长的单位为毫秒，速度单位为像素/秒，加速单位为像素/秒^2，角度单位为弧度。
 *
 * 2.插值算法实现加速/加速/匀速等效果，请参考插值算法。
 *
 */
function UIPath() {
	return;
}

UIPath.prototype = new UIElement();
UIPath.prototype.isUIPath = true;
UIPath.prototype.saveProps = ["showPath"];
UIPath.prototype.initUIPath = function(type, w, h) {
	this.initUIElement(type);	
	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.addEventNames(["onInit"]);

	return this;
}

UIPath.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIPath.prototype.onInit = function() {
	this.shapesInfo = [];
	this.elapsedTime = 0;
	this.pathAnimation = new PathAnimation();
	this.animationState = UIElement.STATE_RUNNING;

	this.callOnInitHandler();

	return;
}

/**
 * @method restart
 * 重新开始。
 * @return {UIElement} 返回控件本身。
 *
 */
UIPath.prototype.restart = function() {
	this.elapsedTime = 0;
	this.animationState = UIElement.STATE_RUNNING;
	
	var a = this.shapesInfo;
	var n = this.shapesInfo.length;

	for(var i = 0; i < n; i++) {
		var iter = a[i];
		iter.done = false;
		iter.startTime = iter.delayTime;
	}

	return this;
}

/**
 * @method pause
 * 恢复。
 * @return {UIElement} 返回控件本身。
 *
 */
UIPath.prototype.pause = function() {
	this.animationState = UIElement.STATE_PAUSED;

	return this;
}

/**
 * @method resume 
 * 恢复。
 * @return {UIElement} 返回控件本身。
 *
 */
UIPath.prototype.resume = function() {
	this.animationState = UIElement.STATE_RUNNING;

	return this;
}

UIPath.prototype.hasObj = function(shape) {
	var a = this.shapesInfo;
	var n = this.shapesInfo.length;

	for(var i = 0; i < n; i++) {
		var iter = a[i];
		if(iter.shape === shape) {
			return true;
		}
	}

	return false;
}

/**
 * @method addObj
 * 增加一个对象，让它沿路径运动。
 * @param {UIElement} shape 对象。
 * @param {Function} onStep 每一步的回调函数（可选）。
 * @param {Function} onDone 完成时的回调函数（可选）。
 * @param {Number} delayTime 延迟启动时间（可选）。
 * @param {Number} noRotation 是否禁止旋转（可选）。
 * @return {UIElement} 返回控件本身。
 */
UIPath.prototype.addObj = function(shape, onStep, onDone, delayTime, noRotation) {
	if(this.hasObj(shape)) {
		console.log("obj exist in path.");
		return this;
	}

	var info = {
		shape : shape, 
		onStep : onStep,
		onDone : onDone,
		noRotation:noRotation,
		delayTime : delayTime ? delayTime : 0, 
		startTime: Date.now()
	};

	info.startTime = info.delayTime + this.elapsedTime;
	this.shapesInfo.push(info);

	return this;
}

/**
 * @method removeObj
 * 从路径中移除一个对象。
 * @param {UIElement} shape 对象。
 * @return {UIElement} 返回控件本身。
 */
UIPath.prototype.removeObj = function(shape) {
	var a = this.shapesInfo;
	var n = this.shapesInfo.length;

	for(var i = 0; i < n; i++) {
		var iter = a[i];
		if(iter.shape === shape) {
			a.splice(i, 1);
			break;
		}
	}

	return this;
}

/**
 * @method resetObjs
 * 清除全部对象。
 * @return {UIElement} 返回控件本身。
 */
UIPath.prototype.resetObjs = function() {
	this.shapesInfo = [];

	return this;
}

/**
 * @method resetPath
 * 重置路径。
 * @return {UIElement} 返回控件本身。
 */
UIPath.prototype.resetPath = function() {
	this.pathAnimation.reset();

	return this;
}

UIPath.prototype.getStartPoint = function() {
	return this.pathAnimation.startPoint;
}

UIPath.prototype.getEndPoint = function() {
	return this.endPoint;
}

UIPath.prototype.addPath = function(path) {
	this.pathAnimation.addPath(path);

	return this;
}

/**
 * @method addLine
 * 增加一条直线到路径中。
 * @param {Number} duration 经过此路径需要的时间。
 * @param {Object} interpolator 插值算法。
 * @param {Point} p1 起点。
 * @param {Point} p2 终点。
 * @return {UIElement} 返回控件本身。
 */
UIPath.prototype.addLine = function(duration, interpolator, p1, p2) {
	return this.addPath(LinePath.create(duration, interpolator, p1.x, p1.y, p2.x, p2.y));
}

/**
 * @method addArc
 * 增加一条弧线到路径中。
 * @param {Number} duration 经过此路径需要的时间。
 * @param {Object} interpolator 插值算法。
 * @param {Point} origin 原点
 * @param {Number} r 半径。
 * @param {Number} sAngle 初始角度。
 * @param {Number} eAngle 结束角度。
 * @return {UIElement} 返回控件本身。
 */
UIPath.prototype.addArc = function(duration, interpolator, origin, r, sAngle, eAngle) {
	return this.addPath(ArcPath.create(duration, interpolator, origin.x, origin.y, r, sAngle, eAngle));
}

/**
 * @method addPara
 * 增加一条抛物线到路径中。
 * @param {Number} duration 经过此路径需要的时间。
 * @param {Object} interpolator 插值算法。
 * @param {Point} p 初始位置。 
 * @param {Point} a 加速度。
 * @param {Point} v 初速度。
 * @return {UIElement} 返回控件本身。
 */
UIPath.prototype.addPara = function(duration, interpolator, p, a, v) {
	return this.addPath(ParaPath.create(duration, interpolator, p.x, p.y, a.x, a.y, v.x, v.y));
}

/**
 * @method addSin
 * 增加一条sin/cos曲线到路径中。
 * @param {Number} duration 经过此路径需要的时间。
 * @param {Object} interpolator 插值算法。
 * @param {Number} p 初始位置。
 * @param {Number} waveLenth 波长。
 * @param {Number} v 波速(X方向上的速度)。
 * @param {Number} amplitude 振幅。
 * @param {Number} phaseOffset 角度偏移。
 * @return {UIElement} 返回控件本身。
 */
UIPath.prototype.addSin = function(duration, interpolator, p, waveLenth, v, amplitude, phaseOffset) {
	return this.addPath(SinPath.create(duration, interpolator, p.x, p.y, waveLenth, v, amplitude, phaseOffset));
}

/**
 * @method addBezier
 * 增加一条三次贝塞尔曲线到路径中。
 * @param {Number} duration 经过此路径需要的时间。
 * @param {Object} interpolator 插值算法。
 * @param {Point} p1 起点。
 * @param {Point} p2 控制点1。
 * @param {Point} p3 控制点2。
 * @param {Point} p4 终点。
 * @return {UIElement} 返回控件本身。
 */
UIPath.prototype.addBezier = function(duration, interpolator, p1, p2, p3, p4) {
	return this.addPath(Bezier3Path.create(duration, interpolator, p1.x,p1.y, p2.x,p2.y, p3.x,p3.y, p4.x,p4.y));
}

/**
 * @method addQuad
 * 增加一条二次贝塞尔曲线到路径中。
 * @param {Number} duration 经过此路径需要的时间。
 * @param {Object} interpolator 插值算法。
 * @param {Point} p1 起点。
 * @param {Point} p2 控制点。
 * @param {Point} p3 终点。
 * @return {UIElement} 返回控件本身。
 */
UIPath.prototype.addQuad = function(duration, interpolator, p1, p2, p3) {
	return this.addPath(Bezier2Path.create(duration, interpolator, p1.x,p1.y, p2.x,p2.y, p3.x,p3.y));
}

UIPath.prototype.getDuration = function() {
	return this.pathAnimation.duration;
}

UIPath.prototype.getPosition = function(elapsedTime) {
	return this.pathAnimation.getPosition(elapsedTime);
}

UIPath.prototype.getDirection = function(elapsedTime) {
	return this.pathAnimation.getDirection(elapsedTime);
}

UIPath.prototype.updateObjs = function(canvas) {
	this.elapsedTime += canvas.timeStep;
	var elapsedTime = this.elapsedTime;
	
	var a = this.shapesInfo.slice();
	var n = this.shapesInfo.length;
	var pathAnimation = this.pathAnimation;
	var duration = pathAnimation.getDuration();

	for(var i = 0; i < n; i++) {
		var iter = a[i];
		var shape = iter.shape;
		if(!shape || !shape.parentShape) continue;

		var t = elapsedTime - iter.startTime;
		if(t > 0 && !iter.done) {
			var angle = pathAnimation.getDirection(t);
			var position = pathAnimation.getPosition(t);

			if(!shape.visible) {
				shape.setVisible(true);
			}

			if(shape.anchor) {
				shape.setPosition(position.x, position.y);
			}
			else {
				shape.setPosition(position.x-(shape.w>>1), position.y-(shape.h>>1));
			}
			if(!iter.noRotation) {
				shape.setRotation(angle);
			}

			if(iter.onStep) {
				var onStep = iter.onStep;
				onStep(shape, t, position, angle);
			}
			
			if(t > duration) {
				iter.done = true;
				if(iter.onDone) {
					var onDone = iter.onDone;
					onDone(shape);
				}
			}
		}
	}
}

UIPath.prototype.paintSelf = function(canvas) {
	if(this.isIcon || this.isInDesignMode()) {
		UIElement.prototype.paintSelf.call(this, canvas);
		return;
	}

	if(this.showPath && !this.isStrokeColorTransparent()) {
		canvas.strokeStyle = this.style.lineColor;
		canvas.lineWidth = this.style.lineWidth;
		this.pathAnimation.draw(canvas);
	}

	if(this.animationState === UIElement.STATE_RUNNING) {
		this.updateObjs(canvas);
		canvas.needRedraw++;
	}
	
	return;
}

function UIPathCreator() {
	var args = ["ui-path", "ui-path", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPath();
		return g.initUIPath(this.type, 200, 200, null);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIPathCreator());
/*
* Matrix2D
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2010 gskinner.com, inc.
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * @module EaselJS
 */

// namespace:
// this.createjs = this.createjs||{};

this.Matrix2D = (function() {
	"use strict";


// constructor:
	/**
	 * Represents an affine transformation matrix, and provides tools for constructing and concatenating matrices.
	 *
	 * This matrix can be visualized as:
	 *
	 * 	[ a  c  tx
	 * 	  b  d  ty
	 * 	  0  0  1  ]
	 *
	 * Note the locations of b and c.
	 *
	 * @class Matrix2D
	 * @param {Number} [a=1] Specifies the a property for the new matrix.
	 * @param {Number} [b=0] Specifies the b property for the new matrix.
	 * @param {Number} [c=0] Specifies the c property for the new matrix.
	 * @param {Number} [d=1] Specifies the d property for the new matrix.
	 * @param {Number} [tx=0] Specifies the tx property for the new matrix.
	 * @param {Number} [ty=0] Specifies the ty property for the new matrix.
	 * @constructor
	 **/
	function Matrix2D(a, b, c, d, tx, ty) {
		this.setValues(a,b,c,d,tx,ty);
		
	// public properties:
		// assigned in the setValues method.
		/**
		 * Position (0, 0) in a 3x3 affine transformation matrix.
		 * @property a
		 * @type Number
		 **/
	
		/**
		 * Position (0, 1) in a 3x3 affine transformation matrix.
		 * @property b
		 * @type Number
		 **/
	
		/**
		 * Position (1, 0) in a 3x3 affine transformation matrix.
		 * @property c
		 * @type Number
		 **/
	
		/**
		 * Position (1, 1) in a 3x3 affine transformation matrix.
		 * @property d
		 * @type Number
		 **/
	
		/**
		 * Position (2, 0) in a 3x3 affine transformation matrix.
		 * @property tx
		 * @type Number
		 **/
	
		/**
		 * Position (2, 1) in a 3x3 affine transformation matrix.
		 * @property ty
		 * @type Number
		 **/
	}
	var p = Matrix2D.prototype;

	/**
	 * <strong>REMOVED</strong>. Removed in favor of using `MySuperClass_constructor`.
	 * See {{#crossLink "Utility Methods/extend"}}{{/crossLink}} and {{#crossLink "Utility Methods/promote"}}{{/crossLink}}
	 * for details.
	 *
	 * There is an inheritance tutorial distributed with EaselJS in /tutorials/Inheritance.
	 *
	 * @method initialize
	 * @protected
	 * @deprecated
	 */
	// p.initialize = function() {}; // searchable for devs wondering where it is.


// constants:
	/**
	 * Multiplier for converting degrees to radians. Used internally by Matrix2D.
	 * @property DEG_TO_RAD
	 * @static
	 * @final
	 * @type Number
	 * @readonly
	 **/
	Matrix2D.DEG_TO_RAD = Math.PI/180;


// static public properties:
	/**
	 * An identity matrix, representing a null transformation.
	 * @property identity
	 * @static
	 * @type Matrix2D
	 * @readonly
	 **/
	Matrix2D.identity = null; // set at bottom of class definition.
	

// public methods:
	/**
	 * Sets the specified values on this instance. 
	 * @method setValues
	 * @param {Number} [a=1] Specifies the a property for the new matrix.
	 * @param {Number} [b=0] Specifies the b property for the new matrix.
	 * @param {Number} [c=0] Specifies the c property for the new matrix.
	 * @param {Number} [d=1] Specifies the d property for the new matrix.
	 * @param {Number} [tx=0] Specifies the tx property for the new matrix.
	 * @param {Number} [ty=0] Specifies the ty property for the new matrix.
	 * @return {Matrix2D} This instance. Useful for chaining method calls.
	*/
	p.setValues = function(a, b, c, d, tx, ty) {
		// don't forget to update docs in the constructor if these change:
		this.a = (a == null) ? 1 : a;
		this.b = b || 0;
		this.c = c || 0;
		this.d = (d == null) ? 1 : d;
		this.tx = tx || 0;
		this.ty = ty || 0;
		return this;
	};

	/**
	 * Appends the specified matrix properties to this matrix. All parameters are required.
	 * This is the equivalent of multiplying `(this matrix) * (specified matrix)`.
	 * @method append
	 * @param {Number} a
	 * @param {Number} b
	 * @param {Number} c
	 * @param {Number} d
	 * @param {Number} tx
	 * @param {Number} ty
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	p.append = function(a, b, c, d, tx, ty) {
		var a1 = this.a;
		var b1 = this.b;
		var c1 = this.c;
		var d1 = this.d;
		if (a != 1 || b != 0 || c != 0 || d != 1) {
			this.a  = a1*a+c1*b;
			this.b  = b1*a+d1*b;
			this.c  = a1*c+c1*d;
			this.d  = b1*c+d1*d;
		}
		this.tx = a1*tx+c1*ty+this.tx;
		this.ty = b1*tx+d1*ty+this.ty;
		return this;
	};

	/**
	 * Prepends the specified matrix properties to this matrix.
	 * This is the equivalent of multiplying `(specified matrix) * (this matrix)`.
	 * All parameters are required.
	 * @method prepend
	 * @param {Number} a
	 * @param {Number} b
	 * @param {Number} c
	 * @param {Number} d
	 * @param {Number} tx
	 * @param {Number} ty
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	p.prepend = function(a, b, c, d, tx, ty) {
		var a1 = this.a;
		var c1 = this.c;
		var tx1 = this.tx;

		this.a  = a*a1+c*this.b;
		this.b  = b*a1+d*this.b;
		this.c  = a*c1+c*this.d;
		this.d  = b*c1+d*this.d;
		this.tx = a*tx1+c*this.ty+tx;
		this.ty = b*tx1+d*this.ty+ty;
		return this;
	};

	/**
	 * Appends the specified matrix to this matrix.
	 * This is the equivalent of multiplying `(this matrix) * (specified matrix)`.
	 * @method appendMatrix
	 * @param {Matrix2D} matrix
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	p.appendMatrix = function(matrix) {
		return this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
	};

	/**
	 * Prepends the specified matrix to this matrix.
	 * This is the equivalent of multiplying `(specified matrix) * (this matrix)`.
	 * For example, you could calculate the combined transformation for a child object using:
	 * 
	 * 	var o = myDisplayObject;
	 * 	var mtx = o.getMatrix();
	 * 	while (o = o.parent) {
	 * 		// prepend each parent's transformation in turn:
	 * 		o.prependMatrix(o.getMatrix());
	 * 	}
	 * @method prependMatrix
	 * @param {Matrix2D} matrix
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	p.prependMatrix = function(matrix) {
		return this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
	};

	/**
	 * Generates matrix properties from the specified display object transform properties, and appends them to this matrix.
	 * For example, you can use this to generate a matrix representing the transformations of a display object:
	 * 
	 * 	var mtx = new createjs.Matrix2D();
	 * 	mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
	 * @method appendTransform
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} scaleX
	 * @param {Number} scaleY
	 * @param {Number} rotation
	 * @param {Number} skewX
	 * @param {Number} skewY
	 * @param {Number} regX Optional.
	 * @param {Number} regY Optional.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	p.appendTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
		if (rotation%360) {
			var r = rotation*Matrix2D.DEG_TO_RAD;
			var cos = Math.cos(r);
			var sin = Math.sin(r);
		} else {
			cos = 1;
			sin = 0;
		}

		if (skewX || skewY) {
			// TODO: can this be combined into a single append operation?
			skewX *= Matrix2D.DEG_TO_RAD;
			skewY *= Matrix2D.DEG_TO_RAD;
			this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
			this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
		} else {
			this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
		}
		
		if (regX || regY) {
			// append the registration offset:
			this.tx -= regX*this.a+regY*this.c; 
			this.ty -= regX*this.b+regY*this.d;
		}
		return this;
	};

	/**
	 * Generates matrix properties from the specified display object transform properties, and prepends them to this matrix.
	 * For example, you could calculate the combined transformation for a child object using:
	 * 
	 * 	var o = myDisplayObject;
	 * 	var mtx = new createjs.Matrix2D();
	 * 	do  {
	 * 		// prepend each parent's transformation in turn:
	 * 		mtx.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
	 * 	} while (o = o.parent);
	 * 	
	 * 	Note that the above example would not account for {{#crossLink "DisplayObject/transformMatrix:property"}}{{/crossLink}}
	 * 	values. See {{#crossLink "Matrix2D/prependMatrix"}}{{/crossLink}} for an example that does.
	 * @method prependTransform
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} scaleX
	 * @param {Number} scaleY
	 * @param {Number} rotation
	 * @param {Number} skewX
	 * @param {Number} skewY
	 * @param {Number} regX Optional.
	 * @param {Number} regY Optional.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	p.prependTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
		if (rotation%360) {
			var r = rotation*Matrix2D.DEG_TO_RAD;
			var cos = Math.cos(r);
			var sin = Math.sin(r);
		} else {
			cos = 1;
			sin = 0;
		}

		if (regX || regY) {
			// prepend the registration offset:
			this.tx -= regX; this.ty -= regY;
		}
		if (skewX || skewY) {
			// TODO: can this be combined into a single prepend operation?
			skewX *= Matrix2D.DEG_TO_RAD;
			skewY *= Matrix2D.DEG_TO_RAD;
			this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
			this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
		} else {
			this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
		}
		return this;
	};

	/**
	 * Applies a clockwise rotation transformation to the matrix.
	 * @method rotate
	 * @param {Number} angle The angle to rotate by, in degrees. To use a value in radians, multiply it by `180/Math.PI`.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	p.rotate = function(angle) {
//		angle = angle*Matrix2D.DEG_TO_RAD;
		var cos = Math.cos(angle);
		var sin = Math.sin(angle);

		var a1 = this.a;
		var b1 = this.b;

		this.a = a1*cos+this.c*sin;
		this.b = b1*cos+this.d*sin;
		this.c = -a1*sin+this.c*cos;
		this.d = -b1*sin+this.d*cos;
		return this;
	};

	/**
	 * Applies a skew transformation to the matrix.
	 * @method skew
	 * @param {Number} skewX The amount to skew horizontally in degrees. To use a value in radians, multiply it by `180/Math.PI`.
	 * @param {Number} skewY The amount to skew vertically in degrees.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	*/
	p.skew = function(skewX, skewY) {
		skewX = skewX*Matrix2D.DEG_TO_RAD;
		skewY = skewY*Matrix2D.DEG_TO_RAD;
		this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
		return this;
	};

	/**
	 * Applies a scale transformation to the matrix.
	 * @method scale
	 * @param {Number} x The amount to scale horizontally. E.G. a value of 2 will double the size in the X direction, and 0.5 will halve it.
	 * @param {Number} y The amount to scale vertically.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	p.scale = function(x, y) {
		this.a *= x;
		this.b *= x;
		this.c *= y;
		this.d *= y;
		//this.tx *= x;
		//this.ty *= y;
		return this;
	};

	/**
	 * Translates the matrix on the x and y axes.
	 * @method translate
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	p.translate = function(x, y) {
		this.tx += this.a*x + this.c*y;
		this.ty += this.b*x + this.d*y;
		return this;
	};

	/**
	 * Sets the properties of the matrix to those of an identity matrix (one that applies a null transformation).
	 * @method identity
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	p.identity = function() {
		this.a = this.d = 1;
		this.b = this.c = this.tx = this.ty = 0;
		return this;
	};

	/**
	 * Inverts the matrix, causing it to perform the opposite transformation.
	 * @method invert
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	p.invert = function() {
		var a1 = this.a;
		var b1 = this.b;
		var c1 = this.c;
		var d1 = this.d;
		var tx1 = this.tx;
		var n = a1*d1-b1*c1;

		this.a = d1/n;
		this.b = -b1/n;
		this.c = -c1/n;
		this.d = a1/n;
		this.tx = (c1*this.ty-d1*tx1)/n;
		this.ty = -(a1*this.ty-b1*tx1)/n;
		return this;
	};

	/**
	 * Returns true if the matrix is an identity matrix.
	 * @method isIdentity
	 * @return {Boolean}
	 **/
	p.isIdentity = function() {
		return this.tx === 0 && this.ty === 0 && this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1;
	};
	
	/**
	 * Returns true if this matrix is equal to the specified matrix (all property values are equal).
	 * @method equals
	 * @param {Matrix2D} matrix The matrix to compare.
	 * @return {Boolean}
	 **/
	p.equals = function(matrix) {
		return this.tx === matrix.tx && this.ty === matrix.ty && this.a === matrix.a && this.b === matrix.b && this.c === matrix.c && this.d === matrix.d;
	};

	/**
	 * Transforms a point according to this matrix.
	 * @method transformPoint
	 * @param {Number} x The x component of the point to transform.
	 * @param {Number} y The y component of the point to transform.
	 * @param {Point | Object} [pt] An object to copy the result into. If omitted a generic object with x/y properties will be returned.
	 * @return {Point} This matrix. Useful for chaining method calls.
	 **/
	p.transformPoint = function(x, y, pt) {
		pt = pt||{};
		pt.x = x*this.a+y*this.c+this.tx;
		pt.y = x*this.b+y*this.d+this.ty;
		return pt;
	};

	/**
	 * Decomposes the matrix into transform properties (x, y, scaleX, scaleY, and rotation). Note that these values
	 * may not match the transform properties you used to generate the matrix, though they will produce the same visual
	 * results.
	 * @method decompose
	 * @param {Object} target The object to apply the transform properties to. If null, then a new object will be returned.
	 * @return {Object} The target, or a new generic object with the transform properties applied.
	*/
	p.decompose = function(target) {
		// TODO: it would be nice to be able to solve for whether the matrix can be decomposed into only scale/rotation even when scale is negative
		if (target == null) { target = {}; }
		target.x = this.tx;
		target.y = this.ty;
		target.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
		target.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);

		var skewX = Math.atan2(-this.c, this.d);
		var skewY = Math.atan2(this.b, this.a);

		var delta = Math.abs(1-skewX/skewY);
		if (delta < 0.00001) { // effectively identical, can use rotation:
			target.rotation = skewY/Matrix2D.DEG_TO_RAD;
			if (this.a < 0 && this.d >= 0) {
				target.rotation += (target.rotation <= 0) ? 180 : -180;
			}
			target.skewX = target.skewY = 0;
		} else {
			target.skewX = skewX/Matrix2D.DEG_TO_RAD;
			target.skewY = skewY/Matrix2D.DEG_TO_RAD;
		}
		return target;
	};
	
	/**
	 * Copies all properties from the specified matrix to this matrix.
	 * @method copy
	 * @param {Matrix2D} matrix The matrix to copy properties from.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	*/
	p.copy = function(matrix) {
		return this.setValues(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
	};

	/**
	 * Returns a clone of the Matrix2D instance.
	 * @method clone
	 * @return {Matrix2D} a clone of the Matrix2D instance.
	 **/
	p.clone = function() {
		return new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty);
	};

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[Matrix2D (a="+this.a+" b="+this.b+" c="+this.c+" d="+this.d+" tx="+this.tx+" ty="+this.ty+")]";
	};

	// this has to be populated after the class is defined:
	Matrix2D.identity = new Matrix2D();


	// createjs.Matrix2D = Matrix2D;
	return Matrix2D;
}());
/*
 * File: utils.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: some functions to help load dragbones.
 * Web: https://github.com/drawapp8 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */


function loadDragonBoneArmature(textureJsonURL, skeletonJsonURL, textureURL, onDone) {
	var texture = new Image();

	texture.onload = function()	{
		httpGetJSON(textureJsonURL, function(data) {
			var textureData = data;
			if(!data) {
				console.log("Get Json Failed:" + textureJsonURL);
				return;
			}

			httpGetJSON(skeletonJsonURL, function(data) {
				if(!data) {
					console.log("Get Json Failed:" + skeletonJsonURL);
					return;
				}

				var skeletonData = data;
				var factory = new dragonBones.factorys.GeneralFactory();

				factory.addSkeletonData(dragonBones.objects.DataParser.parseSkeletonData(skeletonData));
				factory.addTextureAtlas(new dragonBones.textures.GeneralTextureAtlas(texture, textureData));
			
				for(var i = 0; i < skeletonData.armature.length; i++) {
					var name = skeletonData.armature[i].name;
					var armature = factory.buildArmature(name);

					if(i === 0) {
						onDone(armature);
					}
				}
			});
		});
	}

	texture.src = textureURL;

	return;
}

function onArmatureCreated(armature) {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	armature.setPosition(300, 300);

	function update() {
		ctx.clearRect(0,0,canvas.width, canvas.height);

		dragonBones.animation.WorldClock.clock.advanceTime(1/60);

		armature.draw(ctx);

		setTimeout(update, 16);
	}
	
	function changeAnimation() 	{
		do	{
			var index = Math.floor(Math.random() * armature.animation.animationNameList.length);
			var animationName = armature.animation.animationNameList[index];
		}while (animationName == armature.animation.getLastAnimationName());

		armature.animation.gotoAndPlay(animationName);
	}
	
	canvas.onclick = changeAnimation;
	dragonBones.animation.WorldClock.clock.add(armature);

	changeAnimation();
	update();

	return;
}

/*
 * File:   ui-scene.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  The game scene
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIScene
 * @extends UINormalWindow
 * 游戏场景。在UINormalWindow上增加了物理引擎和虚拟屏幕的支持。
 *
 */

/**
 * @property {Number} xOffset 
 * 当场景的虚拟大小大于实际大小时，当前可视区域的X偏移量。
 */

/**
 * @property {Number} yOffset 
 * 当场景的虚拟大小大于实际大小时，当前可视区域的Y偏移量。
 */

/**
 * @property {Number} virtualWidth 
 * 当场景的虚拟宽度。
 */

/**
 * @property {Number} virtualHeight 
 * 当场景的虚拟高度。
 */
function UIScene() {
	return;
}

UIScene.prototype = new UINormalWindow();
UIScene.prototype.isUIScene = true;

UIScene.prototype.saveProps = ["enablePhysics", "showFPS", "maxFPSMode", "fps", "gravityX", "gravityY",
	"pixelsPerMeter", "virtualWidth", "virtualHeight", "xOffset", "yOffset", "openAnimationDuration",
	"closeAnimationDuration", "animHint", "windowType", "refLinesV", "refLinesH", "sceneId"];

UIScene.prototype.canRectSelectable = function() {
	return this.virtualHeight <= this.h && this.virtualWidth <= this.w;
}

UIScene.prototype.initUIScene = function(type, w, h, bg) {
	this.initUIWindow(type, 0, 0, w, h, bg);	
	this.widthAttr  = UIElement.WIDTH_FILL_PARENT;
	this.heightAttr = UIElement.HEIGHT_FILL_PARENT;
	this.images.display = UIElement.IMAGE_DISPLAY_SCALE;

	this.xOffset = 0;
	this.yOffset = 0;
	this.virtualWidth = 0;
	this.virtualHeight = 0;
	this.autoClearForce = true;
	this.setAnimHint("none");
	this.setCanRectSelectable(false, true);
	this.addEventNames(["onPointerDown", "onPointerMove", "onPointerUp", "onDoubleClick", "onMultiTouch"]);
	this.addEventNames(["onSwipeLeft", "onSwipeRight", "onSwipeUp", "onSwipeDown"]);
	this.setImage(UIElement.IMAGE_TIPS1, null);
	this.setImage(UIElement.IMAGE_TIPS2, null);
	this.setImage(UIElement.IMAGE_TIPS3, null);
	this.setImage(UIElement.IMAGE_TIPS4, null);
	this.setImage(UIElement.IMAGE_TIPS5, null);
	this.setCameraFollowParams(0.5, 0.5, 0.5, 0.5);
	this.velocityTracker = new VelocityTracker();

	return this;
}

UIScene.prototype.resetGame = function() {
	UIElement.logWarning("This API is removed, don't call it anymore! call win.replay() instead. (don't call it in open/beforeopen event.)");

	return;
}

UIScene.prototype.addStickyChild = function(child) {
	if(child.parentShape !== this || child.left >= this.w || child.top >= this.h) {
		console.log("%cWarning: invalid params to addStickyChild.", "color: red; font-weight: bold");

		return this;
	}

	child.orgX = child.left;
	child.orgY = child.top;

	this.stickyChildren.push(child);

	return this;
}

UIScene.prototype.removeStickyChild = function(child) {
	this.stickyChildren.remove(child);

	return this;
}

UIScene.prototype.updateStickyChildren = function() {
	this.stickyChildren = [];
	var a = this.children;
	for(var i = 0; i < a.length; i++) {
		var iter = a[i];
		if(iter.sticky) {
			if(iter.orgX === undefined) {
				iter.orgX = iter.left;
			}
			if(iter.orgY === undefined) {
				iter.orgY = iter.top;
			}
			this.stickyChildren.push(iter);
		}
	}

	return this;
}

UIScene.prototype.setEnablePhysics = function(enablePhysics) {
	this.enablePhysics = enablePhysics;

	return this;
}

UIScene.prototype.startPhysics = function() {
	if(this.enablePhysics) {
		Physics.createWorld(this);

		if(this.world) {
			if(this.map) {
				this.map.createBodies(this.world);
			}
		}else{
			console.log("create world failed.");
		}
	}

	return this;
}

UIScene.prototype.doInit = function() {
	this.xOffset = 0;
	this.yOffset = 0;
	this.setTimeScale(1);
	this.startPhysics();

	if(this.gameName) {
		document.title = this.gameName;
	}

	return;
}

UIScene.prototype.onOpen = function(initData) {
	this.doInit();
	this.play();

	return;
}

UIScene.prototype.onInit = function() {
	var me = this;
	this.initStageOne();
	this.updateStickyChildren();

	return;
}

UIScene.prototype.onDeinit = function() {
	if(this.world) {
		var world = this.world;
		Physics.destroyWorld(world);
		this.world = null;
	}

	this.stop();

	return;
}

UIScene.prototype.getVirtualWidth = function() {
	if(this.virtualWidth < this.w) {
		return this.w;
	}

	return this.virtualWidth;
}

UIScene.prototype.getVirtualHeight = function() {
	if(this.virtualHeight < this.h) {
		return this.h;
	}

	return this.virtualHeight;
}

UIScene.prototype.onScrolled = function() {
	var a = this.stickyChildren;
	if(a && a.length) {
		var ox = this.xOffset;
		var oy = this.yOffset;
		for(var i = 0; i < a.length; i++) {
			var iter = a[i];
			var x = iter.orgX + ox;
			var y = iter.orgY + oy;
			iter.setLeftTop(x, y);
			if(iter.isUIBody) {
				iter.onPositionChanged();
			}
		}
	}

	return;
}

UIScene.prototype.setOffsetDelta = function(x, y) {
	return this.setOffset(this.xOffset+x, this.yOffset+y);
}

/**
 * @method setOffset
 * 设置场景可视区左上角的坐标。
 * @param {Number} xOffset 
 * @param {Number} yOffset
 * @return {UIElement} 返回控件本身。
 *
 */
UIScene.prototype.setOffset = function(xOffset, yOffset) {
	if(xOffset || xOffset === 0) {
		var maxOffset = this.getVirtualWidth() - this.w;
		
		var xOffsetNew = Math.max(0, xOffset);
		if(xOffsetNew > maxOffset) {
			xOffsetNew = maxOffset;
		}
		this.xOffset = xOffsetNew >> 0;
	}

	if(yOffset || yOffset === 0) {
		var maxOffset = this.getVirtualHeight() - this.h;

		var yOffsetNew = Math.max(0, yOffset);
		if(yOffsetNew > maxOffset) {
			yOffsetNew = maxOffset;
		}
		this.yOffset = yOffsetNew >> 0;
	}

	this.onScrolled();

	return this;
}

/**
 * @method setOffsetPercent 
 * 按百分比设置场景可视区左上角的坐标。
 * @param {Number} xOffsetPercent X方向偏移量百分比(0,100)。
 * @param {Number} yOffsetPercent Y方向偏移量百分比(0,100)。
 * @return {UIElement} 返回控件本身。
 */
UIScene.prototype.setOffsetPercent = function(xOffsetPercent, yOffsetPercent) {
	var xOffset = (this.virtualWidth - this.w) * (xOffsetPercent/100);
	var yOffset = (this.virtualHeight - this.h) * (yOffsetPercent/100);

	return this.setOffset(xOffset, yOffset);
}

UIScene.prototype.getRelayoutWidth = function() {
	return this.getWidth();
}

UIScene.prototype.getRelayoutHeight = function() {
	return this.getHeight();
}

UIScene.prototype.defaultPaintChildren = function(canvas) {
	var children = this.children;
	var n = this.children.length;

	for(var i = 0; i < n; i++) {
		var shape = children[i];
		shape.paintSelf(canvas);
	}

	return;
}

UIScene.prototype.setMap = function(map) {
	this.map = map;
	if(map) {
		var mapWidth = map.getMapWidth();
		var mapHeight = map.getMapHeight();
		
		if(mapWidth > this.w) {
			this.virtualWidth = mapWidth;
		}

		if(mapHeight > this.h) {
			this.virtualHeight = mapHeight;
		}

		this.setOffset(0, 0);
	}

	return this;
}

UIScene.prototype.getMap = function() {
	return this.map;
}

UIScene.prototype.drawBgImageTile = function(canvas, image, srcRect) {
    var imageWidth = srcRect.w;
    var imageHeight = srcRect.h;

    var dx = 0;
    var dy = 0;
    var dw = this.w;
    var dh = this.h;
    var maxDx = dw;
    var maxDy = dh;
    var adjustX = srcRect.x + this.xOffset % srcRect.w;
    var adjustY = srcRect.y + this.yOffset % srcRect.h;
    var sx = adjustX;
    var sy = adjustY;
    var sw = srcRect.x + srcRect.w - adjustX;
    var sh = srcRect.y + srcRect.h - adjustY;

    while(dy < maxDy) {
        sx = adjustX;
        sw = srcRect.w - adjustX;
        sh = Math.min(sh, Math.min(maxDy-dy, imageHeight));
        while(dx < maxDx) {
            sw = Math.min(sw, Math.min(maxDx-dx, imageWidth));
            canvas.drawImage(image, sx, sy, sw, sh, dx, dy, sw, sh);
            dx += sw;
            sx = srcRect.x;
            sw = srcRect.w;
        }

        dx = 0;
        dy += sh;
        sh = srcRect.h;
        sy = srcRect.y;
    }
}

UIScene.prototype.drawBgImage = function(canvas) {
	if(this.map) {
		var ox = this.xOffset;
		var oy = this.yOffset;

		var rect = {x:ox, y:oy, w:this.w, h:this.h};
		
		canvas.translate(-ox, -oy);
		this.map.draw(canvas, rect);
		canvas.translate(ox, oy);

		return;
	}

	var wImage = this.getBgImage();
	if(wImage && wImage.getImage()) {
		var image = wImage.getImage();
		var srcRect = wImage.getImageRect();
		var display = this.images.display;

		if(display === UIElement.IMAGE_DISPLAY_TILE_V) {
			this.drawBgImageVTile(canvas, image, srcRect);
		}
		else if(display === UIElement.IMAGE_DISPLAY_TILE_H) {
			this.drawBgImageHTile(canvas, image, srcRect);
		}
        else if(display === UIElement.IMAGE_DISPLAY_TILE) {
            this.drawBgImageTile(canvas, image, srcRect);
        }
		else {
			this.drawImageAt(canvas, image, display, 0, 0, this.w, this.h, srcRect);
		}

		return;
	}
}

UIScene.prototype.drawBgImageVTile = function(canvas, image, srcRect) {
	var w = this.w;
	var h = this.h;
	var iw = srcRect.w;
	var ih = srcRect.h;
	var scale = w/iw;

	var dy = 0;
	var sx =  srcRect.x;
	var sy = srcRect.y + this.yOffset%ih;
	var sh = Math.min(srcRect.y + ih-sy, h/scale);
	for(var dy = 0; dy < h; ) {
		var dh = sh * scale;
		canvas.drawImage(image, sx, sy, iw, sh, 0, dy, w, dh);

		dy += dh;
		sh = Math.min(ih, (h - dy)/scale);
		sy = srcRect.y;
	}
}

UIScene.prototype.drawBgImageHTile = function(canvas, image, srcRect) {
	var w = this.w;
	var h = this.h;
	var iw = srcRect.w;
	var ih = srcRect.h;
	var scale = h/ih;

	var dx = 0;
	var sy = srcRect.y;
	var sx = srcRect.x + this.xOffset%iw;
	var sw = Math.min(iw-sx, w/scale);

	for(var dx = 0; dx < w; ) {
		var dw = sw * scale;
		canvas.drawImage(image, sx, sy, sw, ih, dx, 0, dw, h);

		dx += dw;
		sw = Math.min(iw, (w - dx)/scale);
		sx = srcRect.x;
	}

	return;
}

UIScene.prototype.afterPaintChildren = function(canvas) {
	if(!this.isInDesignMode()) {
		this.drawTipsImage(canvas);
	}

	if(!this.selected || !this.isInDesignMode()) {
		return;
	}
	
	var y = 10;
	var w = this.w;
	var h = this.h;
	var text = "";
	var x = w >> 1;
	var vw = this.getVirtualWidth();
	var vh = this.getVirtualHeight();

	if(this.xOffset) {
		text = "XOffset:" + this.xOffset;
	}

	if(this.yOffset) {
		text += " YOffset:" + this.yOffset;
	}

	if(text) {
		canvas.font = "16pt Sans";
		canvas.textBaseline = "top";
		canvas.textAlign = "center";
		canvas.fillStyle = "#202020";
		canvas.fillText(text, x, y);
	}

	if(!this.pointerDown) {
		return;
	}

	if(vw === w && vh === h) {
		return;
	}

	var size = 20;
	var alpha = canvas.globalAlpha;
	canvas.fillStyle = this.style.lineColor;

	if(vw > w) {
		var y = h - size;
		var bw = w * (w/vw);
		var x = w *(this.xOffset/vw);

		canvas.globalAlpha = 0.2;
		canvas.fillRect(0, y, w, size);
		canvas.globalAlpha = 0.5;
		canvas.fillRect(x, y, bw, size);
	}

	if(vh > h) {
		var x = w - size;
		var bh = h * (h/vh);
		var y = h *(this.yOffset/vh);

		canvas.globalAlpha = 0.2;
		canvas.fillRect(x, 0, size, h);
		canvas.globalAlpha = 0.5;
		canvas.fillRect(x, y, size, bh);
	}
	canvas.globalAlpha = alpha;

	return;
}

UIScene.prototype.paintFPS = function(canvas) {
	var seconds = Math.floor(Date.now()/1000);
	if(!this.lastSeconds) {
		this.fps = 0;
		this.drawCount = 0;
		this.lastSeconds = seconds;
	}
	
	this.drawCount++;
	if(seconds > this.lastSeconds) {
		this.fps = this.drawCount;

		this.drawCount = 0;
		this.lastSeconds = seconds;
	}
	
	var h = 30;
	var w = 60;
	var str = this.fps; 

	canvas.save();
	canvas.beginPath();
	canvas.rect(0, 0, w, h);
	canvas.fillStyle = "Black";
	canvas.fill();

	canvas.textAlign = "center";
	canvas.textBaseline = "middle";
	canvas.font = "20px Sans";
	canvas.fillStyle = "White";
	canvas.fillText(str, w >> 1, h >> 1);
	canvas.restore();
}

UIScene.prototype.paintSelf = function(canvas) {
	this.stepAnimation(canvas);
	UIWindow.prototype.paintSelf.call(this, canvas);

    if(this.world && this.debugBox2d) {
        this.world.DrawDebugData(); 
    }

	if(canvas.setShowFPS) {
		canvas.setShowFPS(this.showFPS);
	}else if(this.showFPS && !this.isInDesignMode()) {
		this.paintFPS(canvas);
	}

	return;
}

UIScene.prototype.paintChildren = function(canvas) {
	var ox = this.xOffset;
	var oy = this.yOffset;
	if(!ox && !oy) {
		this.defaultPaintChildren(canvas);
	}
	else {
		canvas.save();	
		canvas.translate(-ox, -oy);
		this.defaultPaintChildren(canvas);
		canvas.restore();
	}

	return;
}

/**
 * @method setTipsImage
 * 设置提示图片的编号。提示图片通常用于显示游戏玩法之类信息。
 * @param {Number} index index 提示图片的编号，通常是1到5，0表示不显示。
 * @param {Number} display 图片显示方式。
 * @return {UIElement} 返回控件本身。
 *
 */
UIScene.prototype.setTipsImage = function(index, display) {
	this.tipsImageIndex = index;
	this.tipsImageDisplay = display;

	return this;
}

UIScene.prototype.drawTipsImage = function(canvas) {
	if(!this.tipsImageIndex) {
		return;
	}

	var name = "tips_img_" + this.tipsImageIndex;
	var wImage = this.images[name];
	if(wImage) {
		var image = wImage.getImage();

		if(image) {
			var srcRect = wImage.getImageRect();
			var display = this.tipsImageDisplay;

			if(!display && display !== 0) {
				display = this.w < this.h ? UIElement.IMAGE_DISPLAY_FIT_WIDTH : UIElement.IMAGE_DISPLAY_FIT_HEIGHT;
			}
		
			this.drawImageAt(canvas, image, display, 0, 0, this.w, this.h, srcRect);
		}
	}

	return;
}

UIScene.prototype.stepAnimation = function(canvas) {
	var c = this.animatingInfo;
	if(!c) {
		return;	
	}

	var x = this.xOffset;
	var y = this.yOffset;
	var timePercent = Math.min((canvas.now - c.startTime)/c.duration, 1);
	var percent = c.interpolator.get(timePercent);

	console.log("stepAnimation:" + timePercent + " " + percent);
	if(c.xRange) {
		x = c.xStart + percent * c.xRange;
	}

	if(c.yRange) {
		y = c.yStart + percent * c.yRange;
	}

	if(timePercent >= 1) {
		this.animatingInfo = null;
	}

	this.setOffset(x, y);
	canvas.needRedraw++;
}

UIScene.prototype.onPointerMoveEditing = function(point, beforeChild) {
	if(!this.pointerDown || beforeChild || this.targetShape) {
		return;
	}

	return this.onPointerMoveCommon(point);
}

UIScene.prototype.onPointerMoveCommon = function(point) {
	var vw = this.getVirtualWidth();
	var vh = this.getVirtualHeight();

	if(vw === this.w && vh === this.h) {
		return;
	}

	var dx = this.getMoveDeltaX();
	var dy = this.getMoveDeltaY();

	if(vw === this.w) {
		dx = 0;
	}

	if(vh === this.h) {
		dy = 0;
	}

	this.setOffsetDelta(-dx, -dy);

	return;
}

UIScene.prototype.fixChildSize = function(shape) {
	return;
}

UIScene.prototype.fixChildPosition = function(shape) {
	return;
}

UIScene.prototype.afterRelayoutChild = function(child) {
	var vw = this.getVirtualWidth();
	var vh = this.getVirtualHeight();

	if(child.widthAttr === UIElement.WIDTH_FILL_PARENT) {
		child.left = 0;
		child.w = vw;
	}
	else if(child.widthAttr === UIElement.WIDTH_FILL_AVAILABLE) {
		child.w = vw - child.left;
	}

	if(child.heightAttr === UIElement.HEIGHT_FILL_PARENT) {
		child.top = 0;
		child.h = vh;
	}
	else if(child.heightAttr === UIElement.HEIGHT_FILL_AVAILABLE) {
		child.h = vh - child.top;
	}

	return;
}

/**
 * @method getWorld
 * 获取Box2d的World对象。
 * @return {Object} 获取Box2d的World对象。
 *
 * 参考：http://www.box2dflash.org/docs/2.1a/reference/
 */
UIScene.prototype.getWorld = function() {
	return this.world;
}

UIScene.prototype.createBodyForElement = function(shape) {
	Physics.createBodyForElement(this.world, this, shape);
}

UIScene.prototype.afterChildAppended = function(shape) {
	if(this.isInDesignMode() || !this.world) {
		return;
	}

	if(this.world.IsLocked()) {
		console.log("world IsLocked, so create body async");
		setTimeout(this.createBodyForElement.bind(this, shape), 0);
	}
	else {
		this.createBodyForElement(shape);
	}
}

UIScene.prototype.afterChildRemoved = function(shape) {
	if(this.map === shape) {
		this.map = null;
	}

	if(this.isInDesignMode() || !this.world) {
		return;
	}

	Physics.destroyBodyForElement(this.world, shape);

	this.postRedraw();

	return;
}

UIScene.prototype.translatePoint = function(point) {
	var p = {x : (point.x - this.left + this.xOffset), y : (point.y - this.top + this.yOffset)};
	return p;
}

/**
 * @method isPlaying
 * 是否处于暂停状态。
 * @return {Boolean} 是否处于暂停状态。
 *
 */
UIScene.prototype.isPlaying = function() {
	return this.playing && !this.isInDesignMode();
}

/**
 * @method replay
 * 重置游戏。
 * @return {UIScene} 返回场景本身。
 *
 */
UIScene.prototype.replay = function() {
	this.openScene(this.name, this.initData);
	this.play();

	return this;
}

/**
 * @method pause
 * 暂停游戏。
 * @return {UIScene} 返回场景本身。
 *
 */
UIScene.prototype.pause = function() {
	this.playing = false;
	this.setTimeScale(0);

	return this;
}

/**
 * @method resume
 * 恢复游戏。
 * @return {UIScene} 返回场景本身。
 *
 */
UIScene.prototype.resume = function() {
	this.playing = true;
	this.setTimeScale(1);

	return this;
}

UIScene.prototype.play = function() {
	this.playing = true;

	return;
}

UIScene.prototype.stop = function() {
	this.playing = false;

	return;
}

/**
 * @method toMeter
 * 把像素转化成米。
 * @param {Number} pixel
 * @return {Number} 米。
 *
 */
UIScene.prototype.toMeter = function(pixel) {
	var pixelsPerMeter = this.pixelsPerMeter ? this.pixelsPerMeter : 10;

	return pixel/pixelsPerMeter;
}

/**
 * @method toPixel
 * 把米转化成像素。
 * @param {Number} meter
 * @return {Number} 像素。
 *
 */
UIScene.prototype.toPixel = function(meter) {
	var pixelsPerMeter = this.pixelsPerMeter ? this.pixelsPerMeter : 10;

	return meter * pixelsPerMeter;
}

UIScene.prototype.getFPS = function() {
	return this.fps ? this.fps : 30;
}

UIScene.prototype.setFPS = function(fps) {
	this.fps = Math.max(5, Math.min(50, fps));

	return this;
}

UIScene.prototype.setVelocityIterations = function(velocityIterations) {
	this.velocityIterations = velocityIterations;

	return this;
}

UIScene.prototype.setPositionIterations = function(positionIterations) {
	this.positionIterations = positionIterations;

	return this;
}

/**
 * @method setAutoClearForce
 * 设置是否自动清除作用力。
 * @param {Boolean} autoClearForce 为真则每个时间片断自动清除作用力，否则力会持续作用。
 * @return {UIScene} 返回场景本身。
 *
 */
UIScene.prototype.setAutoClearForce = function(autoClearForce) {
	this.autoClearForce = autoClearForce;

	return this;
}

/**
 * @method setCameraFollowParams 
 * 设置镜头自动跟随的参数。
 * @param {Number} xMin [0-1] 角色的x < this.w * xMin时向左移动。
 * @param {Number} xMax [0-1] 角色的x > this.w * xMax时向右移动。
 * @param {Number} yMin [0-1] 角色的y < this.h * yMin时向上移动。
 * @param {Number} yMax [0-1] 角色的y > this.h * yMax时向下移动。
 * @return {UIScene} 返回场景本身。
 *
 */
UIScene.prototype.setCameraFollowParams = function(xMin, xMax, yMin, yMax) {
	this.cameraFollowParams = {};
	this.cameraFollowParams.xMin = xMin;
	this.cameraFollowParams.xMax = xMax;
	this.cameraFollowParams.yMin = yMin;
	this.cameraFollowParams.yMax = yMax;

	return this;
}

UIScene.prototype.cameraFollow = function(element) {
	var w = this.w;
	var h = this.h;
	var x = element.left;
	var y = element.top;
	var dx = x - this.xOffset;
	var dy = y - this.yOffset;
	var params = this.cameraFollowParams;

	var xOffset = this.xOffset;
	if(dx > params.xMax * w) {
		xOffset = Math.round(x - params.xMax * w) + (element.w >> 1);
	}
	else if(dx < params.xMin * w){
		xOffset = Math.round(x - params.xMin * w) + (element.w >> 1);
	}

	var yOffset = this.yOffset;
	if(dy > params.yMax * h) {
		yOffset = Math.round(y - params.yMax * h) + (element.h >> 1);
	}
	else if(dy < params.yMin * h) {
		yOffset = Math.round(y - params.yMin * h) + (element.h >> 1);
	}

	this.setOffset(xOffset, yOffset);

	return;
}

UIScene.prototype.prepareForOpen = function() {
	if(this.world) {
		var world = this.world;
		Physics.destroyWorld(world);
		this.world = null;
	}

	UIWindow.prototype.prepareForOpen.call(this);
}

UIScene.prototype.isCurrent = function() {
	var wm = this.getParent();
	return wm && wm.getCurrentFrame() === this;
}

UIScene.prototype.onCreateRUBEBody = function(body) {
    if(body) {
        return Physics.createUIRubeBody(body, this.world, this);
    }
    return null;
}

UIScene.prototype.onRUBEJointCreated = function(joint) {
    if(joint) {
        return Physics.createElementForJoint(joint, this.world, this);
    }
    return null;
}

function UISceneCreator() {
	var args = ["ui-scene", "ui-scene", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIScene();
		return g.initUIScene(this.type, 200, 200, null);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UISceneCreator());

/*
 * File:   ui-sound.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Basic sound for game. 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UISoundMusic
 * @extends UICheckBox
 * 背景音乐开关。
 *
 * 可以在项目设置中添加背景音乐文件，添加的背景音乐文件是全局的，删除背景音乐控件并不会删除背景音乐文件。
 *
 * 可以通过任何一个控件调用playSoundMusic播放背景音乐。
 *
 */
function UISoundMusic() {
	return;
}

UISoundMusic.prototype = new UICheckBox();
UISoundMusic.prototype.isUISoundMusic = true;

UISoundMusic.prototype.initUISoundMusic = function(type) {
	this.initUICheckBox(type);	

	this.setTextType(Shape.TEXT_NONE);
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;

	return this;
}

UISoundMusic.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUISoundEffects || shape.isUISoundMusic) {
		return false;
	}

	return UIGroup.prototype.shapeCanBeChild.call(this, shape);
}


UISoundMusic.prototype.setValue = function(value) {
	if(this.isInDesignMode()) {
		return this;
	}

	this.setSoundMusicEnable(value);
	
	return this;
}

UISoundMusic.prototype.getValue = function(value) {
	if(this.isInDesignMode()) {
		return true;
	}

	return this.getSoundMusicEnable();
}

UISoundMusic.prototype.isPlaying = UISoundMusic.prototype.getValue;

function UISoundMusicCreator() {
	var args = ["ui-sound-music", "ui-sound-music", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISoundMusic();
		return g.initUISoundMusic(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UISoundMusicCreator());

/*
 * File:   ui-sound.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Basic sound for game. 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UISoundEffects
 * @extends UICheckBox
 * 音效开关。
 *
 * 可以在项目设置中添加背景音效文件，添加的音效文件是全局的，删除音效控件并不会删除音效文件。
 *
 * 可以通过任何一个控件调用playSoundEffect播放音效。
 *
 */
function UISoundEffects() {
	return;
}

UISoundEffects.prototype = new UICheckBox();
UISoundEffects.prototype.isUISoundEffects = true;

UISoundEffects.prototype.initUISoundEffects = function(type) {
	this.initUICheckBox(type);	

	this.setTextType(Shape.TEXT_NONE);
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;

	return this;
}

UISoundEffects.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUISoundEffects || shape.isUISoundMusic) {
		return false;
	}

	return UIGroup.prototype.shapeCanBeChild.call(this, shape);
}

UISoundEffects.prototype.setValue = function(value) {
	if(this.isInDesignMode()) {
		return this;
	}

	this.setSoundEffectEnable(value);

	return this;
}

UISoundEffects.prototype.getValue = function(value) {
	if(this.isInDesignMode()) {
		return true;
	}

	return this.getSoundEffectEnable(value);
}

UISoundEffects.prototype.isPlaying = UISoundEffects.prototype.getValue;

function UISoundEffectsCreator() {
	var args = ["ui-sound-effects", "ui-sound-effects", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISoundEffects();
		return g.initUISoundEffects(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UISoundEffectsCreator());

/*
 * File:   ui-status.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Use color to present a value.
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIStatus
 * @extends UIElement
 * 用来表示的事物状态，比如怪物的血量，角色的生命值。可以用setValue来改变当前的状态，value取值0-100。
 * 值为0触发onBecomeZero事件。
 * 值为100触发onBecomeFull事件。
 * 值有变化触发onChanged事件。
 *
 */

/**
 * @event onBecomeZero
 * value变为0时触发本事件。
 */

/**
 * @event onBecomeFull
 * value变为100时触发本事件。
 */

/**
 * @event onChanged
 * value变化时触发本事件。
 * @param {Number} value 当前的值。
 */

function UIStatus() {
	return;
}

UIStatus.prototype = new UIElement();
UIStatus.prototype.isUIStatus = true;

UIStatus.prototype.saveProps = ["horizonal", "realValue"];
UIStatus.prototype.initUIStatus = function(type, w, h) {
	this.initUIElement(type);	

	this.realValue = 0.5;
	this.roundRadius = 5;
	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.addEventNames(["onBecomeZero", "onBecomeFull", "onChanged", "onUpdateTransform"]);

	return this;
}

UIStatus.prototype.shapeCanBeChild = function(shape) {
	return this.children.length===0 && shape.isUILabel;
}

UIStatus.prototype.setValue = function(value) {
	this.realValue = Math.max(0, Math.min(100, value))/100;

	if(this.realValue === 0) {
		this.callOnBecomeZeroHandler();
	}
	else if(this.realValue === 1) {
		this.callOnBecomeFullHandler();
	}

	this.callOnChangedHandler(this.getValue());

	return this.getValue();
}

UIStatus.prototype.getValue = function() {
	return Math.round(this.realValue * 100);
}

UIStatus.prototype.paintSelfOnly = function(canvas) {
	var value = this.realValue;
	var r = this.roundRadius;
	var bh = Math.round(value * this.h);
	var th = Math.round((1-value) * this.h);
	var lw = Math.round(value * this.w);
	var rw = Math.round((1-value) * this.w);

	canvas.save();
	canvas.beginPath();
	drawRoundRect(canvas, this.w, this.h, r);
	canvas.clip();

	if(!this.isFillColorTransparent()) {
		canvas.fillStyle = this.style.fillColor;
		canvas.beginPath();
		if(this.horizonal) {
			canvas.translate(lw, 0);
			canvas.rect(0, 0, rw, this.h);
			canvas.translate(-lw, 0);
		}
		else {
			canvas.rect(0, 0, this.w, th);
		}
		canvas.fill();
	}

	if(!this.isTextColorTransparent()) {
		canvas.fillStyle = this.style.textColor;
		canvas.beginPath();
		if(this.horizonal) {
			canvas.rect(0, 0, lw, this.h);
		}
		else {
			canvas.translate(0, th);
			canvas.rect(0, 0, this.w, bh);
			canvas.translate(0, -th);
		}
		canvas.fill();
	}
	canvas.restore();

	if(!this.isStrokeColorTransparent() && this.style.lineWidth) {
		canvas.beginPath();
		canvas.lineWidth = this.style.lineWidth;
		canvas.strokeStyle = this.style.lineColor;
		drawRoundRect(canvas, this.w, this.h, r, RoundRect.BL | RoundRect.BR | RoundRect.TL | RoundRect.TR);
		canvas.stroke();
	}
	canvas.beginPath();

	return;
}

function UIStatusCreator() {
	var args = ["ui-status", "ui-status", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIStatus();
		return g.initUIStatus(this.type, 200, 200, null);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIStatusCreator());

/*
 * File:   ui-timer.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Basic timer for game. 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2015  Holaverse Inc.
 * 
 */

/**
 * @class UITimer
 * @extends UIElement
 * 定时器。用于实现定时操作，可以通过setEnable启用或关闭定时器。定时器用来代替javascript原生的setInterval和setTimeout方法，它会在窗口退到后台自动暂停，取消预览时自动停止。可以使用setEnable来启用或禁用定时器。
 */

/**
 * @property {Number} times
 * 触发的次数，默认为100000000。
 */

/**
 * @property {String} durationType 
 * "random"使用随机时长，否则使用固定时长。
 */

/**
 * @property {Number} duration 
 * 使用固定时长的时长，默认为500，单位为毫秒。
 */

/**
 * @property {Number} durationMin
 * 使用随机时长的最小时长。
 */

/**
 * @property {Number} durationMax
 * 使用随机时长的最大时长。
 */
function UITimer() {
	return;
}

UITimer.prototype = new UIElement();
UITimer.prototype.isUITimer = true;
UITimer.prototype.saveProps = ["times", "delayStart", "durationType", "duration", "durationMin", "durationMax"];

UITimer.prototype.initUITimer = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.images.display = UIElement.IMAGE_DISPLAY_AUTO;
	this.addEventNames(["onTimeout"]);

	return this;
}

UITimer.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UITimer.prototype.onInit = function() {
	var me = this;
	var win = this.win;

	function startTimer() {
		me.start();
		win.off("open", startTimer);
	}

	if(this.enable) {
		win.on("open", startTimer);

		console.log("start timer.");
	}
	else {
		console.log("not start disable timer.");
	}

	return;
}

UITimer.prototype.setEnable = function(enable) {
	var parent = this.getParent();
	if(!parent || this.enable == enable) {
		return this;
	}
	
	this.enable = enable;
	if(enable) {
		this.start();
	}
	else {
		this.stop();
	}

	return;
}

UITimer.prototype.getDuration = function() {
	if(this.durationType === "random") {
		var duration = this.durationMin + Math.random() * (this.durationMax - this.durationMin);
		
		return duration;
	}
	else {
		return this.duration;
	}
}

UITimer.prototype.start = function() {
	if(!this.enable) {
		console.log("can not start disabled timer, please call setEnable first.");
	}

	if(this.timerID) {
		console.log("Timer is alread started:" + this.timerID);
		return;
	}

	var me = this;
	this.paused = false;
	this.startTime = Date.now();
	
	function onTimer() {
		if(!me.enable || !me.timerID || !me.parentShape || !me.win) {
			me.timerID = null;
			return;
		}

		if(me.paused) {
			me.timerID = setTimeout(onTimer, me.getDuration());
			return;
		}

		if(me.timeScaleIsZero()) {
			me.timerID = setTimeout(onTimer, me.getDuration());
			return;	
		}

		if(me.win.isVisible()) {
			me.callOnTimeoutHandler();
			me.times--;
		}

		if(me.times <= 0) {
			me.timerID = null;
			console.log("timer stop " + me.name);
		}
		else {
			me.timerID = setTimeout(onTimer, me.getDuration());
		}
	}

	if(this.delayStart) {
		this.timerID = setTimeout(function() {
			me.timerID = setTimeout(onTimer, me.getDuration());
		}, this.delayStart);
	}
	else {
		this.timerID = setTimeout(onTimer, me.getDuration());
	}

	return this;
}

UITimer.prototype.stop = function() {
	if(this.timerID) {
		clearTimeout(this.timerID);
		this.timerID = null;
	}

	return this;
}

/**
 * @method pause
 * 暂停。
 * @return {UIElement} 返回控件本身。
 *
 */
UITimer.prototype.pause = function() {
	this.paused = true;

	return this;
}

/**
 * @method resume 
 * 恢复。
 * @return {UIElement} 返回控件本身。
 *
 */
UITimer.prototype.resume = function() {
	this.paused = false;

	return this;
}

UITimer.prototype.getElapsedTime = function() {
	return Date.now() - this.startTime;
}

function UITimerCreator() {
	var args = ["ui-timer", "ui-timer", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UITimer();
		return g.initUITimer(this.type, 200, 200, null);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UITimerCreator());

/*
 * File:   ui-dragger.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  mouse joint, react with pointer event.
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016  Holaverse Inc.
 * 
 */

/**
 * @class UIDragger
 * @extends UIElement
 * Dragger。把它放到某个控件上，该控件便可被玩家拖动了。
 *
 */

/**
 * @event onDragStart
 * 拖动开始事件。
 */

/**
 * @event onDragEnd
 * 拖动结束事件。
 */

/**
 * @event onDragging
 * 拖动事件。
 */
function UIDragger() {
	return;
}

UIDragger.prototype = new UIElement();
UIDragger.prototype.isUIDragger = true;

UIDragger.prototype.saveProps = ["enableVer", "enableHor"];
UIDragger.prototype.initUIDragger = function(type, w, h) {
	this.initUIElement(type, w, h);	
	this.enableVer = true;
	this.enableHor = true;
	this.addEventNames(["onDragStart", "onDragging", "onDragEnd"]);

	return this;
}

UIDragger.prototype.onInit = function() {
	var parentShape = this.getParent();

	var enableHor = this.enableHor;
	var enableVer = this.enableVer;

	var dragger = this;
	if(parentShape.isUIPhysicsShape || parentShape.isUIImage || parentShape.isUISkeletonAnimation 
		|| parentShape.isUIFrameAnimation || parentShape.isUIScene) {
		parentShape.handlePointerDown = function(point, beforeChild) {
			if(!beforeChild) return;

			dragger.callOnDragStartHandler();
			return UIDragger.handleSpritePointerDown(parentShape, point);	
		}

		parentShape.handlePointerMove = function(point, beforeChild) {
			if(!beforeChild) return;

			if(parentShape.pointerDown) {
				dragger.callOnDraggingHandler();
			}
			return UIDragger.handleSpritePointerMove(parentShape, point, enableVer, enableHor);	
		}

		parentShape.handlePointerUp = function(point, beforeChild) {
			if(!beforeChild) return;

			dragger.callOnDragEndHandler();
			return UIDragger.handleSpritePointerUp(parentShape, point);	
		}
	}
}

UIDragger.handleSpritePointerDown = function(parentShape, point) {
	if(parentShape.isUIScene) {
		parentShape.saveXOffset = parentShape.xOffset;
		parentShape.saveYOffset = parentShape.yOffset;
	}
	else {
		parentShape.saveX  = parentShape.left;
		parentShape.saveY  = parentShape.top;
	}

	return;
}

UIDragger.handleSpritePointerUp = function(parentShape, point) {
}

UIDragger.handleSpritePointerMove = function(parentShape, point, enableVer, enableHor) {
	if(parentShape.pointerDown) {
		var dx = parentShape.getMoveAbsDeltaX();
		var dy = parentShape.getMoveAbsDeltaY();

		if(parentShape.isUIScene) {
			var x = enableHor ? parentShape.saveXOffset - dx : parentShape.saveXOffset;
			var y = enableVer ? parentShape.saveYOffset - dy : parentShape.saveYOffset;
			parentShape.setOffset(x, y);
		}
		else {
			var x = enableHor ? parentShape.saveX + dx : parentShape.saveX;
			var y = enableVer ? parentShape.saveY + dy : parentShape.saveY;
			parentShape.setLeftTop(x, y);
			parentShape.onPositionChanged();
		}
	}

	return;
}

function UIDraggerCreator() {
	var args = ["ui-dragger", "ui-dragger", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIDragger();
		return g.initUIDragger(this.type, 20, 20, null);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIDraggerCreator());

/*
 * File:   ui-sprite.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Basic sprite for game. 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UISprite() {
	return;
}

UISprite.prototype = new UIImage();
UISprite.prototype.isUISprite = true;

UISprite.prototype.initUISprite = function(type, w, h, bg) {
	this.initUIImage(type, w ,h, bg);	

	return this;
}

function UISpriteCreator() {
	var args = ["ui-sprite", "ui-sprite", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISprite();
		return g.initUISprite(this.type, 200, 200, null);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UISpriteCreator());

/*
 * File:   ui-transform-animation.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Animation By Change Transform.
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016  Holaverse Inc.
 * 
 */

/**
 * @class UITransformAnimation
 * @extends UIImage
 * 通过几何变换实现动画效果。它本身只是一张图片，可以放入其它动画在里面，实现更复杂的效果。
 *
 */
function UITransformAnimation() {
	return;
}

UITransformAnimation.prototype = new UIImage();
UITransformAnimation.prototype.isUITransformAnimation = true;

UITransformAnimation.prototype.initUITransformAnimation = function(type, w, h, bg) {
	this.initUIImage(type, w, h, bg);	

	this.animationConfig = {};
	this.animationConfig.opacityFrom = 1;
	this.animationConfig.opacityTo = 1;
	this.animationConfig.scaleXFrom = 1;
	this.animationConfig.scaleXTo = 1;
	this.animationConfig.scaleYFrom = 1;
	this.animationConfig.scaleYTo = 1;
	this.animationConfig.rotationFrom = 0;
	this.animationConfig.rotationTo = 0;
	this.animationConfig.offsetXFrom = 0;
	this.animationConfig.offsetXTo = 0;
	this.animationConfig.offsetYFrom = 0;
	this.animationConfig.offsetYTo = 0;
	this.animationConfig.frequency = 2;
	this.animationConfig.random = 1000 * Math.random();

	return this;
}

/**
 * @method pause
 * 暂停动画。
 * @return {UIElement} 返回控件本身。
 *
 */
UITransformAnimation.prototype.pause = function() {
	if(this.highlightConfig) {
		this.highlightConfig.paused = true;
	}

	return this;
}

/**
 * @method resume 
 * 恢复动画。
 * @return {UIElement} 返回控件本身。
 *
 */
UITransformAnimation.prototype.resume = function() {
	if(this.highlightConfig) {
		this.highlightConfig.paused = false;
	}

	return this;
}

/**
 * @method play
 * 播放动画。
 * @return {UIElement} 返回控件本身。
 *
 */
UITransformAnimation.prototype.play = function() {
	this.setHighlightConfig(this.animationConfig);

	return this;
}

/**
 * @method stop
 * 停止动画。
 * @return {UIElement} 返回控件本身。
 *
 */
UITransformAnimation.prototype.stop = function() {
	this.setHighlightConfig(null);

	return this;
}

UITransformAnimation.prototype.getScaleXFrom = function() {
	return this.animationConfig.scaleXFrom;
}

UITransformAnimation.prototype.setScaleXFrom = function(scaleXFrom) {
	this.animationConfig.scaleXFrom = scaleXFrom;
	this.play();

	return this;
}

UITransformAnimation.prototype.getScaleXTo = function() {
	return this.animationConfig.scaleXTo;
}

UITransformAnimation.prototype.setScaleXTo = function(scaleXTo) {
	this.animationConfig.scaleXTo = scaleXTo;
	this.play();

	return this;
}

UITransformAnimation.prototype.getScaleYFrom = function() {
	return this.animationConfig.scaleYFrom;
}

UITransformAnimation.prototype.setScaleYFrom = function(scaleYFrom) {
	this.animationConfig.scaleYFrom = scaleYFrom;
	this.play();

	return this;
}

UITransformAnimation.prototype.getScaleYTo = function() {
	return this.animationConfig.scaleYTo;
}

UITransformAnimation.prototype.setScaleYTo = function(scaleYTo) {
	this.animationConfig.scaleYTo = scaleYTo;
	this.play();

	return this;
}

UITransformAnimation.RADIAN_TO_ANGLE = 180/Math.PI;

UITransformAnimation.prototype.getRotationFrom = function() {
	return this.animationConfig.rotationFrom * UITransformAnimation.RADIAN_TO_ANGLE;
}

UITransformAnimation.prototype.setRotationFrom = function(rotationFrom) {
	this.animationConfig.rotationFrom = rotationFrom/UITransformAnimation.RADIAN_TO_ANGLE;
	this.play();

	return this;
}

UITransformAnimation.prototype.getRotationTo = function() {
	return this.animationConfig.rotationTo * UITransformAnimation.RADIAN_TO_ANGLE;
}

UITransformAnimation.prototype.setRotationTo = function(rotationTo) {
	this.animationConfig.rotationTo = rotationTo/UITransformAnimation.RADIAN_TO_ANGLE;
	this.play();

	return this;
}

UITransformAnimation.prototype.getOpacityFrom = function() {
	return this.animationConfig.opacityFrom;
}

UITransformAnimation.prototype.setOpacityFrom = function(opacityFrom) {
	this.animationConfig.opacityFrom = opacityFrom;
	this.play();

	return this;
}

UITransformAnimation.prototype.getOpacityTo = function() {
	return this.animationConfig.opacityTo;
}

UITransformAnimation.prototype.setOpacityTo = function(opacityTo) {
	this.animationConfig.opacityTo = opacityTo;
	this.play();

	return this;
}

UITransformAnimation.prototype.getXFrom = function() {
	return this.animationConfig.offsetXFrom;
}

UITransformAnimation.prototype.setXFrom = function(offsetXFrom) {
	this.animationConfig.offsetXFrom = offsetXFrom;
	this.play();

	return this;
}

UITransformAnimation.prototype.getXTo = function() {
	return this.animationConfig.offsetXTo;
}

UITransformAnimation.prototype.setXTo = function(offsetXTo) {
	this.animationConfig.offsetXTo = offsetXTo;
	this.play();

	return this;
}

UITransformAnimation.prototype.getYFrom = function() {
	return this.animationConfig.offsetYFrom;
}

UITransformAnimation.prototype.setYFrom = function(offsetYFrom) {
	this.animationConfig.offsetYFrom = offsetYFrom;
	this.play();

	return this;
}

UITransformAnimation.prototype.getYTo = function() {
	return this.animationConfig.offsetYTo;
}

UITransformAnimation.prototype.setYTo = function(offsetYTo) {
	this.animationConfig.offsetYTo = offsetYTo;
	this.play();

	return this;
}

UITransformAnimation.prototype.getFrequency = function() {
	return this.animationConfig.frequency;
}

UITransformAnimation.prototype.setFrequency = function(frequency) {
	this.animationConfig.frequency = frequency;
	this.play();

	return this;
}

UITransformAnimation.prototype.getRandom = function() {
	return this.animationConfig.random;
}

UITransformAnimation.prototype.setRandom = function(random) {
	this.animationConfig.random = random%1000;
	this.play();

	return this;
}

UITransformAnimation.prototype.doFromJson = function(js) {
	UISprite.prototype.doFromJson.call(this, js);

	if(js.animationConfig) {
		this.animationConfig = JSON.parse(JSON.stringify(js.animationConfig));
		this.play();
	}

	return;
}

UITransformAnimation.prototype.doToJson = function(o) {
	UISprite.prototype.doToJson.call(this, o);

	o.animationConfig = JSON.parse(JSON.stringify(this.animationConfig));

	return o;
}

UITransformAnimation.prototype.beforePaintChildren = function(canvas) {
//	this.applyTransform(canvas);

	return this;
}

UITransformAnimation.prototype.onInit = function() {
	this.play();

	return;
}

function UITransformAnimationCreator() {
	var args = ["ui-transform-animation", "ui-transform-animation", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UITransformAnimation();
		return g.initUITransformAnimation(this.type, 200, 200, null);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UITransformAnimationCreator());

/*
 * File:   ui-skeleton-animation.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  SkelentonAnimation
 *
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2015  Holaverse Inc.
 *
 */

/**
 * @class UISkeletonAnimation
 * @extends UIElement
 * 骨骼动画。目前支持[DragonBones](https://github.com/DragonBones)和[Spine](https://github.com/EsotericSoftware/spine-runtimes)两种格式。
 */
function UISkeletonAnimation() {
	return;
}

UISkeletonAnimation.prototype = new UIElement();
UISkeletonAnimation.prototype.isUISkeletonAnimation = true;

UISkeletonAnimation.prototype.saveProps = ["enableCache", "animationName", "skinName", "animationScaleX", "animationScaleY",
"textureJsonURL", "skeletonJsonURL", "textureURL"];

UISkeletonAnimation.prototype.urlProps = ["textureJsonURL", "skeletonJsonURL", "textureURL"];

UISkeletonAnimation.prototype.initUISkeletonAnimation = function(type, w, h) {
	this.initUIElement(type);

	this.setDefSize(w, h);
	this.setSizeLimit(50, 50);
	this.setTextType(Shape.TEXT_NONE);
	this.setCanRectSelectable(false, true);
	this.addEventNames(["onDoubleClick", "onUpdateTransform", "onLoadDone"]);

	this.animTimeScale = 1;
	this.animationScaleX = 1;
	this.animationScaleY = 1;
	this.animationNames = [];

	return this;
}

/**
 * @method play
 * 播放动画。
 * @param {String} name 动作名称。
 * @param {Number} repeatTimes 播放次数。
 * @param {Function} onDone (可选) 播放指定次数后的回调函数。
 * @param {Function} onOneCycle (可选) 每播放一次的回调函数。
 * @param {Number} useFadeIn (可选) 启用渐变。
 * @return {Object} 返回Promise
 *
 */
UISkeletonAnimation.prototype.play = function(animationName, repeatTimes, onDone, onOneCycle, useFadeIn, duration) {
	var me = this;

    if(me.loadDataDone !== true) {
        this.initPlayArgs = [].slice.call(arguments);
        return;
    }

	var deferred = Deferred();
	this.resume();
	this.doPlay(animationName, repeatTimes, function() {
		if(typeof onDone === 'function') {
			onDone.call(me);
		}
		deferred.resolve();
	}, function() {
		if(typeof onOneCycle === 'function') {
			onOneCycle.call(me);
		}
	}, useFadeIn, duration);

	return deferred.promise;
};


/**
 * @method setSkeletonJsonURL
 * 设置骨骼动画的JSON URL。需要调用reload才能生效。
 * @param {String} skeletonJsonURL 骨骼动画的JSON URL。
 * @return {UIElement} 返回控件本身。
 */
UISkeletonAnimation.prototype.setSkeletonJsonURL = function(skeletonJsonURL) {
	this.skeletonJsonURL = skeletonJsonURL;

	return this;
}

/**
 * @method getSkeletonJsonURL
 * 获取骨骼动画的JSON URL。
 * @return {String} 返回骨骼动画的JSON URL。
 */
UISkeletonAnimation.prototype.getSkeletonJsonURL = function() {
	return this.skeletonJsonURL ? this.skeletonJsonURL : "";
}

/**
 * @method setTextureJsonURL
 * 设置骨骼动画的纹理集的JSON/ATLAS URL。需要调用reload才能生效。
 * @param {String} textureJsonURL 骨骼动画的纹理集的JSON/ATLAS URL。
 * @return {UIElement} 返回控件本身。
 */
UISkeletonAnimation.prototype.setTextureJsonURL = function(textureJsonURL) {
	this.textureJsonURL = textureJsonURL;

	return this;
}

/**
 * @method getTextureJsonURL
 * 获取骨骼动画的纹理集的JSON/ATLAS URL。
 * @return {String} 返回骨骼动画的纹理集的JSON/ATLAS URL。
 */
UISkeletonAnimation.prototype.getTextureJsonURL = function() {
	return this.textureJsonURL ? this.textureJsonURL : "";
}

/**
 * @method setTextureURL
 * 设置骨骼动画的纹理图片的URL。需要调用reload才能生效。
 * @param {String} textureURL 骨骼动画的纹理图片的URL。
 * @return {UIElement} 返回控件本身。
 */
UISkeletonAnimation.prototype.setTextureURL = function(textureURL) {
	this.textureURL = textureURL;

	return this;
}

/**
 * @method getTextureURL
 * 获取骨骼动画的纹理图片的URL。
 * @return {String} 返回骨骼动画的纹理图片的URL。
 */
UISkeletonAnimation.prototype.getTextureURL = function() {
	return this.textureURL ? this.textureURL : "";
}

UISkeletonAnimation.prototype.loadSheletonData = function(textureJsonURL, skeletonJsonURL, textureURL, onDone) {
	var me = this;
	ResLoader.loadImage(textureURL, function(texture) {
		var loadFunc = ResLoader.loadJson;
		if(textureJsonURL.indexOf(".atlas") > 0) {
			loadFunc = ResLoader.loadData;
		}

		loadFunc(textureJsonURL, function(data) {
			var textureData = data;
			if(!data) {
				console.log("Get Json Failed:" + textureJsonURL);
				return;
			}

			ResLoader.loadJson(skeletonJsonURL, function(data) {
				if(!data) {
					console.log("Get Json Failed:" + skeletonJsonURL);
					return;
				}

				var skeletonData = data;
				onDone(texture, textureData, skeletonData);
			});
		});
	});

	return;
}

UISkeletonAnimation.prototype.createSkelentonAnimation = function(onDone) {
	var me = this;
	this.destroyArmature();

	function onDataLoad(texture, textureData, skeletonData) {
		me.createArmature(texture, textureData, skeletonData);
		var animationName = me.getAnimationName();
		if(me.skinName) {
			me.setSkin(me.skinName);
		}
        me.loadDataDone = true;
        if(me.initPlayArgs) {
            me.play.apply(me, me.initPlayArgs);
            me.initPlayArgs = null;
        }
        else {
		    me.play(animationName);
        }
		me.callOnLoadDoneHandler();
		if(onDone) {
			onDone();
		}
	}

    me.loadDataDone = false;
	this.loadSheletonData(this.textureJsonURL, this.skeletonJsonURL, this.textureURL, onDataLoad);

	return;
}

UISkeletonAnimation.prototype.onFromJsonDone = function(js) {
	if(this.textureURL && this.textureJsonURL && this.skeletonJsonURL) {

		function onDataLoad(texture, textureData, skeletonData) {
			console.log("skeleton preload data done.");
		}

		this.loadSheletonData(this.textureJsonURL, this.skeletonJsonURL, this.textureURL, onDataLoad);
	}

	if(js && js.animationScale) {
		if(!js.animationScaleX) {
			this.animationScaleX = js.animationScale;
		}

		if(!js.animationScaleY) {
			this.animationScaleY = js.animationScale;
		}
		delete this.animationScale;
	}

	return;
}

UISkeletonAnimation.prototype.onInit = function() {
	this.reload();

	return;
}

/**
 * @method reload
 * 修改骨骼动画的URL后，需要调用本函数重新载入新的数据。
 * @return {UIElement} 返回控件本身。
 *
 *     @example small frame
 *     var dragonbones = this.win.dragonbones;
 *     var assets = this.win.assets;
 *
 *     dragonbones.setSkeletonJsonURL(assets.getAssetURL("Robot.json"));
 *     dragonbones.setTextureJsonURL(assets.getAssetURL("texture.json"));
 *     dragonbones.setTextureURL(assets.getAssetURL("texture.png"));
 *     dragonbones.reload();
 */
UISkeletonAnimation.prototype.reload = function(onDone) {
	if(this.textureURL && this.textureJsonURL && this.skeletonJsonURL) {
		this.createSkelentonAnimation(onDone);
	}

	return this;
}

UISkeletonAnimation.prototype.destroy = function() {
	this.destroyArmature();
	Shape.prototype.destroy.call(this);

	return;
}

UISkeletonAnimation.prototype.callOnLoadDoneHandler = function() {
	if(this.isInDesignMode()) {
		return;
	}

	if(!this.handleOnLoadDone) {
		var sourceCode = this.events["onLoadDone"];
		if(sourceCode) {
			sourceCode = "this.handleOnLoadDone = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnLoadDone) {
		try {
			this.handleOnLoadDone();
		}catch(e) {
			console.log("this.handleOnLoadDone:" + e.message);
		}
	}

	return true;
}

UISkeletonAnimation.prototype.destroyArmature = function() {
}

/**
 * @method pause
 * 暂停动画。
 * @return {UIElement} 返回控件本身。
 *
 */
UISkeletonAnimation.prototype.pause = function() {
	return this;
}

/**
 * @method resume
 * 恢复动画。
 * @return {UIElement} 返回控件本身。
 *
 */
UISkeletonAnimation.prototype.resume = function() {
	return this;
}

/**
 * @method getAnimationDuration
 * 获取指定动作的时长。
 * @param {String} animaName 动作名称。
 * @return {UIElement} 返回指定动画的时长。
 *
 */
UISkeletonAnimation.prototype.getAnimationDuration = function(animaName) {
}

UISkeletonAnimation.prototype.getAnimationNames = function() {
	return this.animationNames;
}

UISkeletonAnimation.prototype.setAnimationName = function(animationName) {
	this.animationName = animationName;

	return this;
}

/**
 * @method getAnimationName
 * 获取当前播放动画得名称。
 * @return {String} 返回当前播放的动画名称
 *
 */
UISkeletonAnimation.prototype.getAnimationName = function() {
	if(this.animationName) return this.animationName;

	var animationNames = this.getAnimationNames();
	return animationNames ? animationNames[0] : "";
}

UISkeletonAnimation.prototype.setScale = function(animationScale) {
	this.animationScaleX = animationScale;
	this.animationScaleY = animationScale;
	return this;
}

UISkeletonAnimation.prototype.getScale = function() {
	return this.animationScaleX;
}

UISkeletonAnimation.prototype.setScaleX = function(animationScale) {
	this.animationScaleX = animationScale;
	return this;
}

UISkeletonAnimation.prototype.setScaleY = function(animationScale) {
	this.animationScaleY = animationScale;
	return this;
}

UISkeletonAnimation.prototype.getScaleX = function(animationScale) {
	return this.animationScaleX;
}

UISkeletonAnimation.prototype.getScaleY = function(animationScale) {
	return this.animationScaleY;
}

UISkeletonAnimation.prototype.applyScale = function(canvas) {
}

/**
 * @method setTimeScale
 * 设置时间缩放比例, 小于1变慢，大于1变快。
 * @param {Number} animTimeScale 时间缩放比例。
 * @return {UIElement} 返回控件本身。
 *
 */
UISkeletonAnimation.prototype.setTimeScale = function(animTimeScale) {
	this.animTimeScale = animTimeScale;

	return this;
}

UISkeletonAnimation.prototype.setDuration = function(duration) {
//TODO
}

UISkeletonAnimation.prototype.preprocessTextureAtlas = function(skeletonData) {
	return skeletonData;
}

/**
 * @method setSkin
 * 设置当前皮肤的名称。
 * @param {String} skinName 皮肤的名称。
 * @return {UIElement} 返回控件本身。
 *
 */
UISkeletonAnimation.prototype.setSkin = function(skinName) {
	this.skinName = skinName;

	return this;
}

/**
 * @method getSkin
 * 获取当前皮肤的名称。
 * @return {String} 返回当前皮肤的名称。
 *
 */
UISkeletonAnimation.prototype.getSkin = function() {
	return this.skinName;
}

UISkeletonAnimation.prototype.getSkins = function() {
	return ["default"];
}

UISkeletonAnimation.prototype.isPaused = function() {
	return this.timeScaleIsZero();
}

UISkeletonAnimation.prototype.shapeCanBeChild = UISprite.prototype.shapeCanBeChild;


/*
 * File:   ui-bitmap-font-text.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  BitmapFontText
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

/**
 * @class UIBitmapFontText
 * @extends UIElement
 * 数字标签。把文字做成等大小的图片，然后合并到一张大图里，显示时根据文字内容取出子图组装起来。图片一般用透明背景的PNG格式。
 *
 * 注意：要求图片的高度和宽度能被行数和列数整除，否者在部分浏览器上显示不正常。
 *
 */
function UIBitmapFontText() {
	return;
}

UIBitmapFontText.prototype = new UIElement();
UIBitmapFontText.prototype.isUIBitmapFontText = true;

UIBitmapFontText.prototype.saveProps = ["allText", "textAlignment", "imageRows", "imageColumns"];
UIBitmapFontText.prototype.initUIBitmapFontText = function(type, w, h) {
	this.initUIElement(type);	

	this.text = "";
	this.textAlignment = "center";

	this.setMargin(5, 5);
	this.setDefSize(w, h);
	this.setSizeLimit(10, 10);
	this.setTextType(Shape.TEXT_NONE);
	this.addEventNames(["onUpdateTransform"]); 
	this.setImage(UIElement.IMAGE_NORMAL_FG, null);
	this.setImage("option_image_0", null);
	this.setImage("option_image_1", null);
	this.setImage("option_image_2", null);
	this.setImage("option_image_3", null);
	this.setImage("option_image_4", null);
	this.setImage("option_image_5", null);

	return this;
}

UIBitmapFontText.prototype.getDefaultImageType = function() {
	return UIElement.IMAGE_NORMAL_FG;
}

UIBitmapFontText.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIBitmapFontText.prototype.setImageWithRowCols = function(url, rows, columns) {
	this.imageRows = rows;
	this.imageColumns = columns;
	this.setImage(UIElement.IMAGE_NORMAL_FG, url);

	return;
}

UIBitmapFontText.prototype.getRectOfChar = function(image, imageRect, c) {
	if(this.allText) {
		var n = this.allText.length;
		var i = this.allText.indexOf(c);

		if(i >= 0) {
			var w = imageRect.trimmed ? imageRect.rw : imageRect.w;
			var h = imageRect.trimmed ? imageRect.rh : imageRect.h;
			var rows = this.imageRows ? this.imageRows : (h > w ? n : 1);
			var columns = this.imageColumns ? this.imageColumns : (w > h ? n : 1);
			var iw = Math.round(w/columns);
			var ih = Math.round(h/rows);
			var r = Math.floor(i/columns);
			var c = i%columns;

			var rect = {};
			rect.w = iw;
			rect.h = ih;
			rect.x = iw * c + imageRect.x;
			rect.y = ih * r + imageRect.y;

			if(i === 0) {
				rect.w = rect.w - (imageRect.ox || 0);
				rect.h = rect.h - (imageRect.oy || 0);
			}
			else {
				rect.x = rect.x - (imageRect.ox || 0);
				rect.y = rect.y - (imageRect.oy || 0);
			}

			return rect;
		}
	}

	return null;
}

UIBitmapFontText.prototype.setAllText = function(allText) {
	this.allText = allText;

	return this;
}

UIBitmapFontText.prototype.getAllText = function() {
	return this.allText;
}

UIBitmapFontText.prototype.getBgImage =function() {
	var image = null;
	
	if(this.pointerDown && !this.isClicked()) {
		image = this.images.active_bg;
	}
	else {
		image = this.images.normal_bg;
	}
	
	if(!image || !image.getImage()) {
		image = this.images.default_bg;
	}

	if(!image || !image.getImage()) {
		return;
	}

	return image;
}

UIBitmapFontText.prototype.drawFgImage = function(canvas) {
	var text = this.text;
	var wImage = this.getImageByType(UIElement.IMAGE_NORMAL_FG)

	if(!text || !wImage) {
		return;
	}

	var image = wImage.getImage();
	var imageRect = wImage.getImageRect();
	if(!image) {
		return;
	}

	var size = 0;
	var h = this.h;
	var maxItemHeight = 15;
	for(var i = 0; i < text.length; i++) {
		var c = text[i];
		var rect = this.getRectOfChar(image, imageRect, c);
		if(rect) {
			size += rect.w;
			if(rect.h > maxItemHeight) {
				maxItemHeight = rect.h;
			}
		}
	}

	var oy = 0;
	var ox = 0;
	var tx = 0;
	var hh = this.h >> 1;
	var scale = Math.min(this.h/maxItemHeight, this.w/size);

	switch(this.textAlignment) {
		case "right": {
			ox = this.w - this.hMargin - size;
			tx = ox + size;
			break;
		}
		case "center": {
			ox = (this.w - size) >> 1;
			tx = this.w >> 1;
			break;
		}
		default: {
			ox = this.hMargin;
			tx = ox;
			break;
		}
	}	
	
	if(scale != 1) {
		canvas.translate(tx, hh);
		canvas.scale(scale, scale);
		canvas.translate(-tx, -hh);
	}

	for(var i = 0; i < text.length; i++) {
		var c = text[i];
		var rect = this.getRectOfChar(image, imageRect, c);

		if(rect) {
			oy = (h - rect.h) >> 1;
			canvas.drawImage(image, rect.x, rect.y, rect.w, rect.h, ox, oy, rect.w, rect.h);
			ox += rect.w;
		}
	}

	return;
}

function UIBitmapFontTextCreator() {
	var args = ["ui-bitmap-font-text", "ui-bitmap-font-text", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIBitmapFontText();
		return g.initUIBitmapFontText(this.type, 400, 100);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIBitmapFontTextCreator());

/*
 * File:   ui-bitmap-font-text-x.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  BitmapFontTextX
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015  Holaverse Inc.
 * 
 */

/**
 * @class UIBitmapFontTextX
 * @extends UIElement
 * 图片文字。支持[bmfont](http://www.angelcode.com/products/bmfont/doc/file_format.html)和TexturePacker打包的Json Hash格式的图片集(不支持rotation和trim)。
 *
 * 参考：http://www.angelcode.com/products/bmfont/doc/file_format.html
 */
function UIBitmapFontTextX() {
	return;
}

UIBitmapFontTextX.prototype = new UIElement();
UIBitmapFontTextX.prototype.isUIBitmapFontTextX = true;

UIBitmapFontTextX.prototype.saveProps = ["spacer"];
UIBitmapFontTextX.prototype.initUIBitmapFontTextX = function(type) {
	this.spacer = 0;
	this.initUIElement(type);	
	this.textAlignment = "center";
	this.addEventNames(["onUpdateTransform"]); 

	return this;
}

UIBitmapFontTextX.prototype.getCharDesc = function(c) {
	if(this.bitmapFont) {
		return this.bitmapFont.getCharDesc(c);
	}
	else {
		if(!this.charsDesc) {
			this.charsDesc = {};
		}
		var charDesc = this.charsDesc[c];
		var image = this.getImageByType(c);

		if(!charDesc && image) {
			var r = image.getImageRect();
			if(r && r.w) {
				this.charsDesc[c] = {};
				charDesc = this.charsDesc[c];

				charDesc.x = r.x;
				charDesc.y = r.y;
				charDesc.w = r.w;
				charDesc.h = r.h;
				charDesc.image = image;
			}
		}

		return charDesc;
	}
}

UIBitmapFontTextX.prototype.parseFont = function(data, dataURL) {
	var path = dataURL.dirname();
	this.bitmapFont = new BitmapFont();
	this.bitmapFont.parse(data);
	
	var pages = this.bitmapFont.getPagesDesc();
	for(var key in pages) {
		var page = pages[key];
		var imageURL = path + "/" + page.file;
		this.setImage("page" + page.id, imageURL);
	}

	var chars = this.bitmapFont.getCharsDesc();
	for(var c in chars) {
		var charDesc = chars[c];
		charDesc.image = this.getImageByType("page"+charDesc.page);
	}

	return;
}

UIBitmapFontTextX.prototype.parseJson = function(data, dataURL) {
	var frames = data.frames;
	var imageURL = dataURL.dirname() + "/" + data.meta.image;

	for(var c in frames) {
		var name = c.replace(".png", "");
		if(name.length === 1) {
			this.setImage(name, dataURL + "#" + c);
		}
	}

	return;
}

UIBitmapFontTextX.prototype.setDataURL = function(dataURL) {
	this.images = {};
	this.images.display = 0;
	this.dataURL = dataURL;

	if(dataURL) {
		if(dataURL.endWith(".fnt")) {
			ResLoader.loadData(dataURL, function(data) {	
				this.parseFont(data, dataURL);
			}.bind(this));
		}
		else if(dataURL.endWith(".json")) {
			ResLoader.loadJson(dataURL, function(data) {	
				this.parseJson(data, dataURL);
			}.bind(this));
		}
		else {
			console.log("not supported:" + dataURL);
		}
	}

	return this;
}

UIBitmapFontTextX.prototype.setSpacer = function(spacer) {
	this.spacer = spacer;

	return this;
}

UIBitmapFontTextX.prototype.getDataURL = function() {
	return this.dataURL;
}

UIBitmapFontTextX.prototype.measureText = function() {
	var w = 0;
	var h = 10;
	var text = this.text;
	var spacer = this.spacer;

	for(var i = 0; i <text.length; i++) {
		var charDesc = this.getCharDesc(text[i]);
		if(charDesc) {
			var rw = charDesc.rw || charDesc.w;
			var rh = charDesc.rh || (charDesc.h + (charDesc.oy || 0));

			w += rw;
			if(h < rh) {
				h = rh;
			}

			if(i) {
				w += spacer;
			}
		}
	}

	return {w:w, h:h};
}

UIBitmapFontTextX.prototype.onFromJsonDone = function() {
	this.setDataURL(this.dataURL);
}

UIBitmapFontTextX.prototype.drawText = function(canvas) {
	var text = this.text;

	if(!text) { 
		return;
	}

	var oy = 0;
	var ox = 0;
	var tx = 0;
	var h = this.h;
	var w = this.w;
	var hh = h >> 1;
	var spacer = this.spacer;
	var hMargin = this.hMargin;
	var size = this.measureText();
	
	if(size.w < 1 || size.h < 1) {
		return;
	}

	var scale = Math.min(h/size.h, w/size.w);

	switch(this.textAlignment) {
		case "right": {
			ox = w - hMargin - size.w;
			tx = ox + size.w;
			break;
		}
		case "center": {
			ox = (w - size.w) >> 1;
			tx = w >> 1;
			break;
		}
		default: {
			ox = hMargin;
			tx = ox;
			break;
		}
	}	

	canvas.save();
	if(scale !== 1) {
		canvas.translate(tx, hh);
		canvas.scale(scale, scale);
		canvas.translate(-tx, -hh);
	}

	var x = 0;
	var y = 0;
	var baseY = (h - size.h) >> 1;
	for(var i = 0; i < text.length; i++) {
		var c = text[i];
		var charDesc = this.getCharDesc(c);
		if(charDesc && charDesc.image) {
			var rect = charDesc;
			var img = charDesc.image.getImage();

			if(img) {
				x = ox + (rect.ox || 0);
				y = baseY + (rect.oy || 0);

				canvas.drawImage(img, rect.x, rect.y, rect.w, rect.h, x, y, rect.w, rect.h);
				ox += (rect.rw || rect.w);
				ox += spacer;
			}
		}
	}
	canvas.restore();

	return;
}

function UIBitmapFontTextXCreator() {
	var args = ["ui-bitmap-font-text-x", "ui-bitmap-font-text-x", null, true];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIBitmapFontTextX();
		return g.initUIBitmapFontTextX(this.type, 400, 100);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIBitmapFontTextXCreator());

/*
 * File:   ui-frame-animation.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Frame Animation.
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016  Holaverse Inc.
 * 
 */

/**
 * @class UIFrameAnimation
 * @extends UIImage
 * 帧动画。通过连续播放多张图片形成动画效果。可以对图片进行分组，播放时指定分组的名称。
 *
 */
function UIFrameAnimation() {
	return;
}

UIFrameAnimation.prototype = new UIElement();
UIFrameAnimation.prototype.isUIFrameAnimation = true;

UIFrameAnimation.prototype.saveProps = ["autoPlay", "frameRate", "autoPlayDelay", "defaultGroupName"];
UIFrameAnimation.prototype.initUIFrameAnimation = function(type, w, h) {
	this.initUIElement(type);	
	
	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.current = 0;
	this.frameRate = 10;
	this.playing = false;
	this.autoPlay = true;
	this.repeatTimes = 0xFFFFFFFF;
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;

	this.frames = [];
	this.addEventNames(["onDoubleClick", "onUpdateTransform"]);

	return this;
}

UIFrameAnimation.prototype.syncImageFrames = function() {
	this.frames = [];
	for(var key in this.images) {
		var iter = this.images[key];
		if(key.indexOf("option_image_") >= 0 && iter) {
			this.frames.push(iter);
		}
	}

	return;
}

UIFrameAnimation.prototype.doToJson = function(o) {
	UIElement.prototype.doToJson.call(this, o);

	if(this.groups) {
		o.groups = JSON.parse(JSON.stringify(this.groups));
	}

	return o;
}

UIFrameAnimation.prototype.doFromJson = function(js) {
	UIElement.prototype.doFromJson.call(this, js);
	
	this.playing = false;
	this.syncImageFrames();

	if(js.groups) {
		this.groups = js.groups;
	}
	else if(js.groupsData) {
		this.groups = this.parseGroupsData(js.groupsData);
		this.groupsData = null;
	}

	return js;
}

UIFrameAnimation.prototype.afterChildAppended = function(shape) {
	shape.xAttr = UIElement.X_CENTER_IN_PARENT;
	shape.yAttr = UIElement.Y_MIDDLE_IN_PARENT;

	return;
}

UIFrameAnimation.prototype.setAutoPlay = function(autoPlay) {
	this.autoPlay = autoPlay;

	return this;
}

/**
 * @method resume 
 * 恢复动画。
 * @return {UIElement} 返回控件本身。
 *
 */
UIFrameAnimation.prototype.resume = function() {
	this.playing = true;

	return this;
}

/**
 * @method pause
 * 暂停动画。
 * @return {UIElement} 返回控件本身。
 *
 */
UIFrameAnimation.prototype.pause = function() {
	this.playing = false;

	return this;
}

/**
 * @method stop 
 * 停止动画。
 * @return {UIElement} 返回控件本身。
 *
 */
UIFrameAnimation.prototype.stop = function() {
	this.playing = false;

	return this;
}

UIFrameAnimation.prototype.playSequence = function(sequence, repeatTimes, onDone, onOneCycle) {
	this.deferred = Deferred();

	var n = this.frames.length;
	if(!n || !sequence || !sequence.length) {
		return;
	}

	this.current = 0;
	this.playing = true;
	this.onDone = onDone;
	this.onOneCycle = onOneCycle;
	this.runningSequence = sequence;
	this.nextUpdateTime = Date.now() + this.getDuration();
	this.repeatTimes = repeatTimes ? repeatTimes : 0xFFFFFFFF;

	return this.deferred.promise;
}

UIFrameAnimation.prototype.playRange = function(startFrame, endFrame, repeatTimes, onDone, onOneCycle) {
	var n = this.frames.length;
	if(startFrame > endFrame) {
		var t = startFrame;
		startFrame = endFrame;
		endFrame = t;
	}

	var sequence = [];
	for(var i = startFrame; i <= endFrame; i++) {
		sequence.push(i);
	}

	return this.playSequence(sequence, repeatTimes, onDone, onOneCycle);
}

/**
 * @method play
 * 播放动画。
 * @param {String} name 分组名称。
 * @param {Number} repeatTimes 播放次数。 
 * @param {Function} onDone (可选) 播放指定次数后的回调函数。
 * @param {Function} onOneCycle (可选) 每播放一次的回调函数。
 *
 */
UIFrameAnimation.prototype.gotoAndPlayByName = function(name, repeatTimes, onDone, onOneCycle) {
	var range = this.getGroupRange(name);

	if(range.start !== undefined && range.end !== undefined) { 
		return this.gotoAndPlay(range.start, range.end, repeatTimes, onDone, onOneCycle);
	}
	else if(range && range.length){
		return this.playSequence(range, repeatTimes, onDone, onOneCycle);
	}
	else if(this.animations && name) {
		return this.animate(name);
	}
}

UIFrameAnimation.prototype.play = UIFrameAnimation.prototype.gotoAndPlayByName;
UIFrameAnimation.prototype.gotoAndPlay = UIFrameAnimation.prototype.playRange;

UIFrameAnimation.prototype.nextFrame = function() {
	if(!this.frames || !this.frames.length || !this.runningSequence || !this.runningSequence.length) {
		return;
	}

	var current = this.current + 1;
	var n = this.runningSequence.length;

	if(current === n) {
		if(this.onOneCycle) {
			try {
				this.onOneCycle(this);
			} catch(e) {
				console.log("onOneCycle: " + e.message);
			}
		}

		this.repeatTimes--;
		if(this.repeatTimes <= 0) {
			this.playing = false;
			if(this.onDone) {
				try{
					this.onDone(this);
				}catch(e) {
					console.log("onDone: " + e.message);
				}
			}

			if(this.deferred) {
				this.deferred.resolve();
			}

			return;
		}
	}

	this.current = current % n;

	return;
}

UIFrameAnimation.prototype.getCurrentImage = function() {
	if(!this.frames || !this.frames.length) {
		return null;
	}

	if(!this.runningSequence || !this.runningSequence.length) {
		return this.frames[0];
	}

	if(this.current >= this.runningSequence.length) {
		this.current = 0;
	}

	var index =  this.runningSequence[this.current];

	return this.frames[index];
}

UIFrameAnimation.prototype.getGroupRange = function(name) {
	var range = null;

	if(this.groups && name) {
		range = this.groups[name];
	}
	
	if(!range) {
		range = {start:0, end:this.frames.length-1};
	}

	return range;
}

UIFrameAnimation.prototype.getImages = function() {
	var str = "";
	for(var key in this.images) {
		var iter = this.images[key];
		if(key.indexOf("option_image_") >= 0 && iter && iter.src) {
			str += iter.src.toRelativeURL() + "\n";
		}
	}

	return str;
}

UIFrameAnimation.prototype.setImages = function(value) {
	var display = this.images.display;
	this.images = {};
	this.images.display = display;

	if(value) {
		var i = 0;
		var k = 0;
		var arr = value.split("\n");

		for(var i = 0; i < arr.length; i++) {
			var iter = arr[i];
			if(!iter) continue;

			if(iter.indexOf("/") === 0) {
				iter = iter.substr(1);
			}

			var name = "option_image_" + (k++);
			this.setImage(name, iter);
		}
	}
	this.syncImageFrames();
	
	return this;
}

UIFrameAnimation.prototype.getValue = function() {
	return this.current;
}

UIFrameAnimation.prototype.setValue = function(value) {
	this.current = Math.min(value, this.frames.length);

	return this;
}

UIFrameAnimation.prototype.startAutoPlay = function() {
	if(this.defaultGroupName) {
		this.play(this.defaultGroupName, 0xFFFFFFF); 
	}
	else {
		this.gotoAndPlay(0, this.frames.length-1, 0xFFFFFFF);	
	}

	return;
}

UIFrameAnimation.prototype.onInit = function() {
	this.syncImageFrames();

	if(this.autoPlay && this.frames && this.frames.length) {
		this.startAutoPlay();
		if(this.autoPlayDelay) {
			this.nextUpdateTime += this.autoPlayDelay;
		}
	}

	return;
}

UIFrameAnimation.prototype.paintSelf = function(canvas) {
	
	if(this.playing && this.isVisible()) {
		var duration = this.getDuration();
		var nextUpdateTime = canvas.now + duration;

		if(canvas.now > this.nextUpdateTime) {
			this.nextFrame();
			this.nextUpdateTime = nextUpdateTime;
		}
		else {
			this.nextUpdateTime = Math.min(this.nextUpdateTime, nextUpdateTime);
		}

		canvas.needRedraw++;
	}
	
	return UIElement.prototype.paintSelf.call(this, canvas);
}

/**
 * @method getFrameRate 
 * 获取帧率。
 * @return {Number} 返回帧率。
 *
 */
UIFrameAnimation.prototype.getFrameRate = function() {
	return this.frameRate ? this.frameRate : 5;
}

/**
 * @method setFrameRate 
 * 设置帧率。
 * @param {Number} frameRate 帧率。
 * @return {UIElement} 返回控件本身。
 *
 */
UIFrameAnimation.prototype.setFrameRate = function(frameRate) {
	this.frameRate = Math.max(1, Math.min(frameRate, 30));

	return this;
}

UIFrameAnimation.prototype.getDuration = function() {
	if(this.isInDesignMode() && this.disablePreview) {
		return 0xffffff;
	}

	if(this.timeScaleIsZero()) {
		return 0xffffff;
	}
	else {
		return (1000/this.frameRate)/this.getTimeScale();
	}
}

UIFrameAnimation.prototype.shapeCanBeChild = UISprite.prototype.shapeCanBeChild;

UIFrameAnimation.prototype.drawImage = function(canvas) {
	var image = this.getCurrentImage();

	if(image) {
		var srcRect = image.getImageRect();
		var htmlImage = image.getImage();
		if(htmlImage) {
			this.drawImageAt(canvas, htmlImage, this.images.display, 0, 0, this.w, this.h, srcRect);
		}	
	}

	return;
}

function UIFrameAnimationCreator() {
	var args = [ "ui-frame-animation", "ui-frame-animation", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIFrameAnimation();
		return g.initUIFrameAnimation(this.type, 200, 200);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIFrameAnimationCreator());

/*
 * File:   ui-shaker.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  shaker 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 Holaverse Inc.
 * 
 */

/**
 * @class UIShaker
 * @extends UIElement
 * 振动器。在启用时(setEnable(true))让所在的父控件(通常是场景)按指定参数振动，振动完成后自动进入禁用状态。
 *
 */
function UIShaker() {
	return;
}

UIShaker.prototype = new UIImage();
UIShaker.prototype.isUIShaker = true;

UIShaker.prototype.saveProps = ["amplitudeX", "amplitudeY", "times", "duration", "amplitudeModifier"];
UIShaker.prototype.initUIShaker = function(type, w, h) {
	this.initUIImage(type, w ,h);	

	return this;
}

/**
 * @method setAmplitudeX
 * 设置水平方向上的振幅。
 * @param {Number} value value为正向先向右动，为负向先向左动。
 * @return {UIElement} 返回控件本身。
 */
UIShaker.prototype.setAmplitudeX = function(value) {
	this.amplitudeX = value;

	return this;
}

/**
 * @method setAmplitudeY
 * 设置垂直方向上的振幅。
 * @param {Number} value 为正向先向下动，为负向先向上动。
 * @return {UIElement} 返回控件本身。
 */
UIShaker.prototype.setAmplitudeY = function(value) {
	this.amplitudeY = value;

	return this;
}

/**
 * @method setDuration
 * 设置振动持续的时间。
 * @param {Number} value 振动持续的时间。
 * @return {UIElement} 返回控件本身。
 */
UIShaker.prototype.setDuration = function(value) {
	this.duration = value;

	return this;
}

/**
 * @method setTimes
 * 设置振动的次数。
 * @param {Number} value 次数。
 * @return {UIElement} 返回控件本身。
 */
UIShaker.prototype.setTimes = function(value) {
	this.times = value;

	return this;
}

UIShaker.prototype.setAmplitudeModifier = function(value) {
	this.amplitudeModifier = value;

	return this;
}

UIShaker.prototype.getAmplitudeX = function() {
	return this.amplitudeX;
}

UIShaker.prototype.getAmplitudeY = function() {
	return this.amplitudeY;
}

UIShaker.prototype.getDuration = function() {
	return this.duration;
}

UIShaker.prototype.getTimes = function() {
	return this.times;
}

UIShaker.prototype.getAmplitudeModifier = function() {
	return this.amplitudeModifier;
}

UIShaker.prototype.setEnable = function(enable) {
	var parent = this.getParent();

	if(!parent || this.enable == enable) {
		return this;
	}

	if(!enable) {
		this.enable = enable;
		return this;
	}
	
	var me = this;
	var aX = this.amplitudeX ? this.amplitudeX : 0;
	var aY = this.amplitudeY ? this.amplitudeY : 0;
	var n = this.times ? this.times : 1;
	var duration = this.duration ? this.duration : 200;
	
	var startTime = Date.now();
	var oldPaintSelf = parent.paintSelf;
	var range = n * 2 * Math.PI;
	var am = this.amplitudeModifier;

	parent.paintSelf = function(canvas) {
		var dt = (Date.now() - startTime);

		if(dt < duration) {
			var factor = 1;
			var percent = dt/duration;
			var angle = range *  percent;
			var xo = aX * Math.cos(angle);
			var yo = aY * Math.sin(angle);

			if(am === "i") {
				factor = percent;
			}
			else if(am === "d") {
				factor = (1-percent);
			}
			else if(am === "i->d") {
				factor = 2 * (percent < 0.5 ? percent : (1-percent));
			}

			xo *= factor;
			yo *= factor;

			canvas.translate(xo, yo);
		}
		else {
			 parent.paintSelf = oldPaintSelf;
			 me.enable = false;
		}

		oldPaintSelf.call(parent, canvas);
	}
	
	return this;
}

function UIShakerCreator() {
	var args = ["ui-shaker", "ui-shaker", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIShaker();
		return g.initUIShaker(this.type, 80, 80);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIShakerCreator());

/*
 * File:   ui-settings.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  settings shape
 * 
 * Copyright (c) 2015 - 2015  Holaverse Inc.
 * 
 */

/**
 * @class UISettings
 * @extends UIElement
 * 将游戏的设置独立出来，在IDE中提供一个可视化的界面，让游戏策划不需要程序配合，就可以修改这些数值来调节游戏的效果（使用时先用管理设置对话框中增加设置)。
 *
 *     @example small frame
 *     var settings = this.win.find("settings");
 *
 *     var speed = settings.getSetting("speed");
 *     console.log(speed);
 *
 */
function UISettings() {
	return;
}

UISettings.prototype = new UIElement();
UISettings.prototype.isUISettings = true;

UISettings.prototype.initUISettings = function(type, w, h) {
	this.initUIElement(type);	
	this.setSize(w, h);
	this.settingsDef = {};

	return this;
}

UISettings.prototype.getSettingObj = function(name) {
	var def = this.settingsDef[name];

	if(def && def.isGlobal) {
		return this.getWindowManager();
	}
	else {
		return this.getWindow();
	}
}

/**
 * @method getSetting
 * 获取name设置对应的值。
 * @param {String} name 
 * @return {Number} 返回对应的值。
 *
 */
UISettings.prototype.getSetting = function(name) {
	var obj = this.getSettingObj(name);

	var value = obj.settings[name];
	if(value === undefined) {
		var def = this.settingsDef[name];
		if(def) {
			value = def.defVal;
		}
	}

	return value;
}

/**
 * @method setSetting
 * 设置name设置对应的值。
 * @param {String} name 
 * @param {Number} value
 * @return {UIElement} 返回控件本身。
 *
 */
UISettings.prototype.setSetting = function(name, value) {
	var obj = this.getSettingObj(name);

	obj.settings[name] = value;

	return this;
}

UISettings.prototype.doFromJson = function(js) {
	UIElement.prototype.doFromJson.call(this, js);

	this.settingsDef = js.settingsDef;

	return this;
}

UISettings.prototype.doToJson = function(o) {
	UIElement.prototype.doToJson.call(this, o);

	o.settingsDef = this.settingsDef;

	return o;
}

function UISettingsCreator() {
	var args = ["ui-settings", "ui-settings", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISettings();
		return g.initUISettings(this.type, 200, 200);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UISettingsCreator());

/*
 * File:   ui-assets.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  assets manager
 * 
 * Copyright (c) 2015 - 2016  Holaverse Inc.
 * 
 */

/**
 * @class UIAssets
 * @extends UIElement
 * 资源管理控件，可以添加一组资源(如图片、JSON和其它数据)，导出时自动导出这些资源，运行时可以用loadImage/loadData/loadJSON来获取相应的资源。
 *
 * 资源管理控件主要用于管理普通控件没有引用到的资源，比如游戏需要的关卡数据，动态创建的控件需要的图片和JSON等等。
 *
 * 使用方法：
 *
 * 1.放入UIAssets控件。
 *
 * 2.双击UIAssets打开资源管理对话框。
 *
 * 3.点击“添加"按钮添加资源。
 *
 * 4.点击“确定"按钮保存配置。
 *
 * 5.在程序中使用请参考后面的示例。
 *
 */
function UIAssets() {
	return;
}

UIAssets.prototype = new UIElement();
UIAssets.prototype.isUIAssets = true;

UIAssets.prototype.initUIAssets = function(type, w, h) {
	this.initUIElement(type);	
	this.setSize(w, h);
	this.assets = {};

	return this;
}

UIAssets.prototype.doFromJson = function(js) {
	UIElement.prototype.doFromJson.call(this, js);
	
	this.assets = js.assets;

	return this;
}

UIAssets.prototype.doToJson = function(o) {
	UIElement.prototype.doToJson.call(this, o);

	o.assets = JSON.parse(JSON.stringify(this.assets || {}));

	return o;
}

/**
 * @method getAssetInfo
 * 获取指定名称的资源的相关信息。
 * @param {String} name 资源的名称。
 * @return {Object} 返回资源的信息。.name表示资源的名称, .url资源的URL,  .type资源的类型。
 *
 */
UIAssets.prototype.getAssetInfo = function(name) {
	var info = this.assets[name];

	if(!info) {
		console.log("not found asset:" + name);
	}

	return info;
}

/**
 * @method getAssetURL
 * 获取指定名称的资源的URL。
 * @param {String} name 资源的名称。
 * @return {Object} 返回资源的URL。
 *
 *     @example small frame
 *
 *     var win = this.win;
 *     var url = win.find("assets").getAssetURL("t.jpg");
 *     win.find("image").setValue(url);
 */
UIAssets.prototype.getAssetURL = function(name) {
	var info = this.getAssetInfo(name);

	return info ? info.url : null;
}

/**
 * @method loadJSON 
 * 加载指定名称的JSON数据。
 * @param {String} name 资源的名称。
 * @param {Function} onDone onDone(json) 加载完成时的回调函数。
 * @return {Boolean} false表示没有找到指定名称的资源，不会调用onDone函数。true表示开始加载，无论加载是否成功都会调用onDone函数。
 *
 *     @example small frame
 *
 *     function onJsonLoad(json) {
 *          console.log("onJsonLoad:" + JSON.stringify(json, null, "\t"));
 *     }
 *     this.win.find("assets").loadJSON("test.json", onJsonLoad.bind(this));
 */
UIAssets.prototype.loadJSON = function(name, onDone) {
	var info = this.getAssetInfo(name);
	if(!info) {
		return false;
	}

	if(info.type !== "json") {
		console.log("asset is not json:" + name);
		return false;
	}

	return ResLoader.loadJson(info.url, onDone, onDone);
}

/**
 * @method loadImage
 * 加载指定名称的图片。
 * @param {String} name 资源的名称。
 * @param {Function} onDone onDone(img) 加载完成时的回调函数。
 * @return {Boolean} false表示没有找到指定名称的资源，不会调用onDone函数。true表示开始加载，无论加载是否成功都会调用onDone函数。
 *
 *     @example small frame
 *
 *     function onImageLoad(img) {
 *          this.win.find("image").setValue(img);
 *     }
 *     this.win.find("assets").loadImage("t.jpg", onImageLoad.bind(this));
 */
UIAssets.prototype.loadImage = function(name, onDone) {
	var info = this.getAssetInfo(name);
	if(!info) {
		return false;
	}

	if(info.type !== "image") {
		console.log("asset is not image:" + name);
		return false;
	}

	return ResLoader.loadImage(info.url, onDone, onDone);
}

/**
 * @method loadData
 * 加载指定名称的文本数据。
 * @param {String} name 资源的名称。
 * @param {Function} onDone onDone(str) 加载完成时的回调函数。
 * @return {Boolean} false表示没有找到指定名称的资源，不会调用onDone函数。true表示开始加载，无论加载是否成功都会调用onDone函数。
 *
 *     @example small frame
 *     
 *     function onDataLoad(data) {
 *          console.log("onDataLoad:" + data);
 *     }
 *     this.win.find("assets").loadData("test.txt", onDataLoad.bind(this));
 */
UIAssets.prototype.loadData = function(name, onDone) {
	var info = this.getAssetInfo(name);
	if(!info) {
		return false;
	}

	if(info.type !== "data") {
		console.log("asset is not data:" + name);
		return false;
	}

	return ResLoader.loadData(info.url, onDone, onDone);
}

/**
 * @method loadAll
 * 加载全部资源。
 * @param {Function} onProgress(percent, finished, total) 加载进度的回调函数。
 * @return {UIElement} 返回控件本身。
 *
 *     @example small frame
 *
 *     this.win.assets.loadAll(function(percent, finished, total) {
 *         console.log("finished " + percent + "(" + finished + "/" + total + ")");
 *     })
 */
UIAssets.prototype.loadAll = function(onProgress) {
	var total = 0;
	var finished = 0;

	function onDone() {
		finished++;
		if(onProgress) {
			onProgress(100*(finished/total), finished, total);
		}
	}

	var assets = this.assets;
	for(var key in assets) {
		total++;
	}

	for(var key in assets) {
		var info = assets[key];
		if(info.type === "json") {
			ResLoader.loadJson(info.url, onDone);
		}else if(info.type === "data") {
			ResLoader.loadData(info.url, onDone);
		}else if(info.type === "image") {
			ResLoader.loadImage(info.url, onDone);
		}
	}

	return this;
}

function UIAssetsCreator() {
	var args = ["ui-assets", "ui-assets", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIAssets();
		return g.initUIAssets(this.type, 200, 200);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIAssetsCreator());

/*
 * File:   ui-tile.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  tile shape
 *
 * Copyright (c) 2015 - 2015  Holaverse Inc.
 *
 */


/**
 * @class UITile
 * @extends UIElement
 * 是瓦片游戏地图控件，只需要放一个UITile到场景中，地图自动与场景关联。UITile支持由Map Editor Tiled制作的地图。场景中有多个地图时，可以通过UITile的setEnable函数，或用场景的setMap来设置场景当前的地图。
 *
 * 注意：
 *
 * 1.在新建地图时请选择CSV格式作为tile layer format，保存时使用JSON格式保存，图片与数据放在同一目录下。
 *
 * 2.JSON数据中的图片名不能带路径。
 *
 * 3.启用物理引擎的方法：在tiled中新建立一个图层，给图层加几个自定义的属性。physics为true表示启用物理引擎，friction表示刚体的摩擦力系数，restitution表示刚体的弹力系数。
 *
 * 参考：http://www.mapeditor.org
 *
 */
function UITile() {
	return;
}

UITile.prototype = new UIElement();
UITile.prototype.isUITile = true;

UITile.prototype.saveProps = ["dataURL"];
UITile.prototype.initUITile = function(type, w, h) {
	this.initUIElement(type);
	this.setSize(w, h);

	return this;
}

UITile.Layer = function() {
}

UITile.Layer.prototype.init = function(tile, info) {
	this.tile = tile;
	this.info = info;

	return this;
}

UITile.Layer.prototype.drawOrthogonal = function(canvas, rect) {
	var info = this.info;
	var ox = info.x || 0;
	var oy = info.y || 0;
	var data = info.data;
	var rows = info.height;
	var cols = info.width;
	var tile = this.tile;
	var tileW = tile.tileWidth;
	var tileH = tile.tileHeight;

	var w = tileW * cols;
	var top = Math.max(Math.floor(rect.y/tileH), 0);
	var left = Math.max(Math.floor(rect.x/tileW), 0);
	var right = Math.min(Math.ceil((rect.x + rect.w)/tileW), cols);
	var bottom = Math.min(Math.ceil((rect.y + rect.h)/tileH), rows);

	var x = left * tileW + ox;
	var y = top * tileH + oy;
	var rect = {x:x, y:y, w:tileW, h:tileH};

	ox = x;
	canvas.globalAlpha = info.opacity;
	for(var r = top; r <= bottom; r++) {
		for(var c = left; c <= right; c++) {
			var i = r * cols + c;
			var imgIndex = data[i]

			if(imgIndex) {
				rect.x = x;
				rect.y = y;
				tile.drawTile(canvas, rect, imgIndex);
			}

			x += tileW;
		}
		x = ox;
		y += tileH;
	}

	return;
}

UITile.Layer.prototype.drawIsometric = function(canvas, rect) {
	var top = rect.y;
	var left = rect.x;
	var right = left + rect.w;
	var bottom = top + rect.h;

	var i = 0;
	var info = this.info;
	var x = info.x || 0;
	var y = info.y || 0;
	var data = info.data;
	var rows = info.height;
	var cols = info.width;
	var tile = this.tile;
	var tileW = tile.tileWidth;
	var tileH = tile.tileHeight;

	canvas.globalAlpha = info.opacity;

	var originY = y;
	var originX = x + (this.info.width*tileW)/2 - tileW/2;
	var rect = {x:x, y:y, w:tileW, h:tileH};

	for(var r = 0; r < rows; r++) {
		for(var c = 0; c < cols; c++, i++) {
			var imgIndex = data[i]
			x = (c - r)*tileH + originX;
			y = (c + r)*tileW/4 + originY;
			if(!imgIndex || x > right || y > bottom || (x + tileW) < left || (y + tileH) < top) {
				continue;
			}
			rect.x = x;
			rect.y = y;
			tile.drawTile(canvas, rect, imgIndex);
		}
	}

	return;
}

UITile.Layer.prototype.drawHexagonal = function(canvas, rect) {
    var top = rect.y;
	var left = rect.x;
	var right = left + rect.w;
	var bottom = top + rect.h;

	var i = 0;
	var info = this.info;
	var x = info.x || 0;
	var y = info.y || 0;
	var data = info.data;
	var rows = info.height;
	var cols = info.width;
	var tile = this.tile;
	var tileW = tile.tileWidth;
	var tileH = tile.tileHeight;

	canvas.globalAlpha = info.opacity;

	var originY = y;
	var originX = x;
	var rect = {x:x, y:y, w:tileW, h:tileH};

	for(var r = 0; r < rows; r++) {
	    y = r*tileH/2 + originY;
		for(var c = 0; c < cols; c++, i++) {
			var imgIndex = data[i]
            if(!imgIndex) {
                continue;
            }
			x = c*tileW + originX;
            if(r%2 > 0) x += tileW/2;
			if(x > right || y > bottom || (x + tileW) < left || (y + tileH) < top) {
				continue;
			}
			rect.x = x;
			rect.y = y;
			tile.drawTile(canvas, rect, imgIndex);
		}
	}

	return;
}

UITile.Layer.prototype.draw = function(canvas, rect) {
	var info = this.info;

	if(!info.visible) return;

	switch(this.tile.orientation) {
		case 'orthogonal': {
			this.drawOrthogonal(canvas, rect);
			break;
		}
		case 'isometric': {
			this.drawIsometric(canvas, rect);
			break;
		}
        case 'staggered':
        case 'hexagonal': {
            this.drawHexagonal(canvas, rect);
            break;
        }
		default: {
			throw new Error('unknow orientation: ', this.tile.orientation);
		}
	}

	return;
}

UITile.Layer.prototype.getTileByPoint = function(x, y) {
	var tile = this.tile;
	var tileW = tile.tileWidth;
	var tileH = tile.tileHeight;
	var row = Math.floor(y/tileH);
	var col = Math.floor(x/tileW);
	var index = row * this.info.width + col;
	var imageIndex = this.info.data[index];

	return {row:row, col:col, index:index, imageIndex:imageIndex};
}

UITile.TileSet = function() {
}

UITile.TileSet.prototype.init = function(tile, rootURL, info) {
	this.tile = tile;
	this.info = info;
	this.imageURL = rootURL + "/" + info.image.basename();
	this.image = WImage.create(this.imageURL);
	this.tileWidth = info.tilewidth+info.spacing;
	this.tileHeight = info.tileheight+info.spacing;
	this.cols = Math.floor((info.imagewidth-2*info.margin)/this.tileWidth);
	this.rows = Math.floor((info.imageheight-2*info.margin)/this.tileHeight);
	this.tileNr = this.cols * this.rows;
	this.startIndex = info.firstgid;

	return this;
}

UITile.TileSet.prototype.testImageIndex = function(imageIndex) {
	return imageIndex >= this.startIndex && imageIndex < (this.startIndex + this.tileNr);
}

UITile.TileSet.prototype.drawTile = function(canvas, x, y, imageIndex) {
	var image = this.image.getImage();
	var index = imageIndex - this.startIndex;

	if(index < 0 || index >= this.tileNr || !image || !image.width) {
		return;
	}

	var info = this.info;
	var c = index%this.cols;
	var r = Math.floor(index/this.cols);
	var sx = c * this.tileWidth + info.margin;
	var sy = r * this.tileHeight + info.margin;
	var w = info.tilewidth;
	var h = info.tileheight;

	if(this.tileHeight !== this.tile.tileHeight) {
		y = y - (this.tileHeight - this.tile.tileHeight);
	}

	canvas.drawImage(image,sx, sy, w, h, x, y, w, h);

	return;
}

UITile.prototype.loadTileSets = function(url, tilesets) {
	this.tilesets = [];
	var n = tilesets.length;
	var rootURL = url.dirname();

	this.images = {};
	for(var i = 0; i < n; i++) {
		var tileSet = new UITile.TileSet();
		tileSet.init(this, rootURL, tilesets[i]);

		this.setImage("option_image_"+i, tileSet.imageURL);
		this.tilesets.push(tileSet);
	}

	return this;
}

UITile.prototype.loadLayers = function(layers) {
	this.layers = [];
	var n = layers.length;

	for(var i = 0; i < n; i++) {
		this.layers.push((new UITile.Layer()).init(this, layers[i]));
	}

	return this;
}

/**
 * @method getMapWidth
 * 获取地图的宽度。
 * @return {Number} 返回地图的宽度。
 *
 */
UITile.prototype.getMapWidth = function() {
	return this.mapWidth;
}

/**
 * @method getMapHeight
 * 获取地图的高度。
 * @return {Number} 返回地图的高度。
 *
 */
UITile.prototype.getMapHeight = function() {
	return this.mapHeight;
}

/**
 * @method getLayerNr
 * 获取地图的层数。
 * @return {Number} 返回地图的层数。
 *
 */
UITile.prototype.getLayerNr = function() {
	return this.layers ? this.layers.length : 0;
}

/**
 * @method getLayerByIndex
 * 获取地图某层的数据。
 * @param {Number} index 层数索引。
 * @return {Object} 返回地图某层的数据。layer.info里是tiled生成的原始数据。
 *
 */
UITile.prototype.getLayerByIndex = function(index) {
	if(this.layers && index < this.layers.length) {
		return this.layers[index];
	}

	return null;
}

UITile.prototype.loadJSON = function(url, json) {
	if(this.isIcon) return;

	if(!json || !json.width || !json.height) {
		console.log("invalid tiled json");
		return;
	}

	this.tileRows = json.height;
	this.tileCols = json.width;
	this.tileWidth = json.tilewidth;
	this.tileHeight = json.tileheight;
	this.orientation = json.orientation;
	this.renderorder = json.renderorder;
	this.properties = json.properties;
	this.mapWidth = this.tileWidth * this.tileCols;
	this.mapHeight = this.tileHeight * this.tileRows;

	this.loadTileSets(url, json.tilesets);
	this.loadLayers(json.layers);

	if(this.enable) {
		var win = this.getWindow();
		if(win && win.isUIScene) {
			win.setMap(this);
		}
	}

	return;
}

UITile.prototype.loadURL = function(url) {
	var me = this;

    ResLoader.loadJson(url, function(json) {
	    me.loadJSON(url, json);
    });

	return;
}

UITile.prototype.load = function() {
	var dataURL = this.dataURL || this.tiledJsonURL;
	if(dataURL) {
		this.dataURL = dataURL;
		this.loadURL(dataURL);
	}

	return;
}

/**
 * @method setClipRegion
 * 只显示指定区域的地图。有的游戏中只显示玩家视力范围类的地图，这时可以用本函数实现。
 * @param {Array} rects
 * @return {UIElement} 返回控件本身。
 *
 *     @example small frame
 *     var tile = this.win.find("tile");
 *     tile.setClipRegion([{x:40, y:50, w:100, h:200},{x:200, y:200, w:100, h:200}]);
 */
UITile.prototype.setClipRegion = function(rects) {
	this.clipRegion = rects;

	return this;
}

UITile.prototype.isInClipRegion = function(r) {
	if(!this.clipRegion) return true;

	var rects = this.clipRegion;
	var n = rects.length;

	for(var i = 0; i < n; i++) {
		var rect = rects[i];
		if(Rect.hasIntersection(rect, r)) {
			return true;
		}
	}

	return false;
}

UITile.prototype.drawTile = function(canvas, rect, imageIndex) {
	if(!this.isInClipRegion(rect)) {
		return;
	}

	var n = this.tilesets.length;
	for(var i = 0; i < n; i++) {
		var iter = this.tilesets[i];
		if(iter.testImageIndex(imageIndex)) {
			iter.drawTile(canvas, rect.x, rect.y, imageIndex);
			break;
		}
	}

	return;
}

UITile.prototype.draw = function(canvas, rect) {
	if(!this.layers) {
		return;
	}

	var layers = this.layers;
	var n = layers.length;

	for(var i = 0; i < n; i++) {
		layers[i].draw(canvas, rect);
	}

	return;
}

UITile.prototype.onAppendedInParent = function() {
	this.load();
}

UITile.prototype.createBody = function(world, name, x, y, w, h, prop) {
	var hw = w >> 1;
	var hh = h >> 1;
	var cx = x + hw;
	var cy = y + hh;
	var fixtureDef = new b2FixtureDef();
	fixtureDef.density = prop.density;
	fixtureDef.friction = prop.friction;
	fixtureDef.restitution = prop.restitution;

	if(prop.groupIndex) {
		fixtureDef.filter.groupIndex = prop.groupIndex;
	}

	if(prop.isSensor) {
		fixtureDef.isSensor = true;
	}

	fixtureDef.shape = new b2PolygonShape();
	fixtureDef.shape.SetAsBox(Physics.toMeter(hw), Physics.toMeter(hh));

	var bodyDef = new b2BodyDef();
	bodyDef.type = prop.density ? b2Body.b2_dynamicBody : b2Body.b2_staticBody;
	bodyDef.position.Set(Physics.toMeter(cx), Physics.toMeter(cy));
	bodyDef.allowSleep = true;
	body = world.CreateBody(bodyDef);
	body.CreateFixture(fixtureDef);
	body.name = name;

	return;
}

UITile.prototype.createLayerBodies = function(world, layerIndex, info) {
	var data = info.data;
	var n = data.length;
	var prop = info.properties || {};
	var rows = info.height;
	var cols = info.width;
	var tileW = this.tileWidth;
	var tileH = this.tileHeight;
	var ox = info.x ? info.x : 0;
	var oy = info.y ? info.y : 0;

	prop.density = 0;
	prop.restitution = prop.restitution ? parseFloat(prop.restitution) : 0.5;
	prop.friction    = prop.friction ? parseFloat(prop.friction) : 0.5;

	for(var i = 0; i < n; i++) {
		var imageIndex = data[i];
		if(!imageIndex) continue;
		var r = Math.floor(i/cols);
		var c = i%cols;
		var x = ox + c * tileW;
		var y = oy + r * tileH;
		this.createBody(world, layerIndex+"-"+i, x, y, tileW, tileH, prop);
	}

	return;
}

UITile.prototype.createBodies = function(world) {
	var layers = this.layers;
	var n = layers.length;

	for(var i = 0; i < n; i++) {
		var layer = layers[i];
		var prop = layer.info.properties;
		if(prop && prop.physics) {
			this.createLayerBodies(world, i, layer.info);
		}
	}

	return;
}

UITile.prototype.onFromJsonDone = function(js) {
	this.load();
}

UITile.prototype.setTiledJsonURL = function(url) {
	this.dataURL = url;
	this.load();
}

UITile.prototype.getTiledJsonURL = function() {
	return this.dataURL || this.tiledJsonURL;
}

UITile.prototype.setEnable = function(enable) {
	var parent = this.getParent();

	if(!parent || this.enable == enable) {
		return this;
	}

	var win = this.getWindow();
	if(win && win.isUIScene) {
		if(enable) {
			win.setMap(this);
		}
		else {
			if(win.getMap() === this) {
				win.setMap(null);
			}
		}
	}
	this.enable = enable;

	return;
}

function UITileCreator() {
	var args = ["ui-tile", "ui-tile", null, 1];

	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UITile();
		return g.initUITile(this.type, 200, 200);
	}

	return;
}

ShapeFactoryGet().addShapeCreator(new UITileCreator());

/*
 * File:   ui-gsensor.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  gsensor event 
 * 
 * Copyright (c) 2015 - 2016  Holaverse Inc.
 * 
 */

/**
 * @class UIGSensor
 * @extends UIElement
 * 用于监听设备方向变化。
 *
 * 调用setEnable启用/关闭onDeviceOrientation事件。
 *
 */

/**
 * @event onDeviceOrientation
 * 重力感应事件。
 * @param {Number} x X方向重力。
 * @param {Number} y Y方向重力。
 * @param {Number} z Z方向重力。
 * @param {Object} event 原始事件。 
 */
function UIGSensor() {
	return;
}

UIGSensor.prototype = new UIElement();
UIGSensor.prototype.isUIGSensor = true;

UIGSensor.prototype.initUIGSensor = function(type, w, h) {
	this.initUIElement(type);	
	this.setSize(w, h);
	this.addEventNames(["onDeviceOrientation"]);

	return this;
}

UIGSensor.prototype.onInit = function() {
	if(this.enable) {
		this.setEnable(true);
	}
}

UIGSensor.prototype.setEnable = function(enable) {
	var me = this;
	if(this.isInDesignMode()) return this;

	function onDeviceOrientation(e) {
		var current = e.accelerationIncludingGravity;
		if(!current) {
			console.log("accelerationIncludingGravity not available.");
			return;
		}
		
		var x = current.x || 0;
		var y = current.y || 0;
		var z = current.z || -9.8;

		if(isAndroid()) {
			x = -x;
		}
		else if(isIPhone()) {
			y = -y;
		}

		me.callOnDeviceOrientation(x, y, z, e);

		return;
	}

	this.enable = enable;
	if(enable) {
		window.removeEventListener('devicemotion', onDeviceOrientation, false);		   
		window.addEventListener('devicemotion', onDeviceOrientation, false);	
	}
	else {
		window.removeEventListener('devicemotion', onDeviceOrientation, false);		   
	}

	return this;
}

function UIGSensorCreator() {
	var args = ["ui-gsensor", "ui-gsensor", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIGSensor();
		return g.initUIGSensor(this.type, 200, 200);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIGSensorCreator());

function UIMarquee() {
	return;
}

UIMarquee.prototype = new UILabel();
UIMarquee.isUIMarquee = true;

UIMarquee.prototype.saveProps = ["direction", "behavior", "scrollamount", "scrolldelay", "loop", "autoPlay"];
//direction
UIMarquee.DIR_UP   = 'up';
UIMarquee.DIR_DOWN = 'down';
UIMarquee.DIR_LEFT = 'left';
UIMarquee.DIR_RIGHT= 'right';

//behavior
UIMarquee.BEHAVIOR_SCROLL = 'scroll';
UIMarquee.BEHAVIOR_SLIDE  = 'slide';
UIMarquee.BEHAVIOR_ALTERNATE = 'alternate';

//loop
UIMarquee.LOOP_INFINITE = 'infinite';

//scrollamount
UIMarquee.DEFAULT_SCROLL_AMOUNT = 1;//px

//scrolldelay
UIMarquee.DEFAULT_SCROLL_DELAY  = 20;//ms

UIMarquee.prototype.initUIMarquee = function(type, initText, bg) {
	this.initUIElement(type);	

	this.setText(initText);
	this.setDefSize(200, 200);
	this.setMargin(5, 5);
	this.running = false;
	this.scrollCounter = 0;
	this.timeScale = 1;
	this.autoPlay = false;
	this.setTextType(Shape.TEXT_TEXTAREA);
	this.setImage(UIElement.IMAGE_DEFAULT, bg);
	this.addEventNames(["onChanged", "onUpdateTransform", "onPlayStepDone", "onPlayDone"]);

	return this;
}

var configLeftResolve = {
	onScroll: function(canvas, scrollDis, textLen, textHeight, w, h) {
		if(this.done) {
			canvas.rect(0, 0, 0, 0);
			canvas.clip();
			return;
		}
		scrollDis = scrollDis%(w+textLen);
		if(scrollDis <= textLen) {
			canvas.rect(w - textLen, 0, textLen, h);	
			canvas.clip();
			if(this.needStep) {
				this.callOnStep();
			}
			if(this.done) {
				this.backText = this.text;
				this.text = "";
			}
		}
		else if(scrollDis >= w) {
			canvas.rect(0, 0, textLen, h);
			canvas.clip();
			this.needStep = true;
		}
		canvas.translate(w - scrollDis, 0);
	},
	onSlide: function(canvas, scrollDis, textLen, textHeight, w, h) {	
		if(this.done) return;
		scrollDis%=w;
		if(scrollDis <= textLen) {
			canvas.rect(w-textLen, 0, textLen, h);
			canvas.clip();
			if(this.needStep) {
				this.callOnStep();
			}
		}
		else {
			this.needStep = true;
		}
		canvas.translate(w - scrollDis, 0);
	},
	onAlternate: function(canvas, scrollDis, textLen, textHeight, w, h) {
		if(this.done) {
			canvas.translate(w-textLen, 0);
			return;
		}
		var odd = parseInt(scrollDis/(w-textLen), 10)%2 > 0;
		var dis = parseInt(scrollDis%(w-textLen), 10);
			dis = odd ? w-textLen-dis : dis;
		if(odd) {
			this.needStep = true;
		}
		else if(!odd && this.needStep){
			this.callOnStep();
		}

		canvas.translate(w - textLen - dis, 0);
	}
};

var configUpResolve = {
	onScroll: function(canvas, scrollDis, textLen, textHeight, w, h) {
		if(this.done) {
			canvas.rect(0, 0, 0, 0);
			canvas.clip();
			return;
		}
		scrollDis = scrollDis%(h+textHeight);
		if(scrollDis <= textHeight) {
			canvas.rect(0, h - textHeight, w, textHeight);	
			canvas.clip();
			if(this.needStep) {
				this.callOnStep();
			}
			if(this.done) {
				this.backText = this.text;
				this.text = "";
			}
		}
		else if(scrollDis >= h) {
			canvas.rect(0, 0, w, h);
			canvas.clip();
			this.needStep = true;
		}
		canvas.translate(0, h - scrollDis);
	},
	onSlide: function(canvas, scrollDis, textLen, textHeight, w, h) {
		if(this.done) {
			return;
		}
		scrollDis%=h;
		if(scrollDis <= textHeight) {
			canvas.rect(0, h-textHeight, w, textHeight);
			canvas.clip();
			if(this.needStep) {
				this.callOnStep();
			}
		}
		else {
			this.needStep = true;
		}
		canvas.translate(0, h - scrollDis);
	},
	onAlternate: function(canvas, scrollDis, textLen, textHeight, w, h) {
		if(this.done) {
			canvas.translate(0, h - textHeight);
			return;
		}
		var odd = parseInt(scrollDis/(h-textHeight), 10)%2 > 0;
		var dis = parseInt(scrollDis%(h-textHeight), 10);
			dis = odd ? h-textHeight-dis : dis;
		if(odd) {
			this.needStep = true;
		}
		else if(!odd && this.needStep) {
			this.callOnStep();
		}

		canvas.translate(0, h - textHeight - dis);
	}
};

var configRightResolve = {
	onScroll: function(canvas, scrollDis, textLen, textHeight, w, h) {
		if(this.done) {
			canvas.rect(0, 0, 0, 0);
			canvas.clip();
			return;
		}
		scrollDis%=(w+textLen);
		if(scrollDis >= w) {
			this.needStep = true;
			canvas.rect(w-textLen, 0, textLen, h);
			canvas.clip();
		}
		else if(scrollDis <= textLen) {
			canvas.rect(0, 0, textLen, h);
			canvas.clip();
			if(this.needStep) {
				this.callOnStep();
			}
			if(this.done) {
				this.backText = this.text;
				this.text = "";
			}
		}
		canvas.translate(scrollDis - textLen, 0);
	},
	onSlide: function(canvas, scrollDis, textLen, textHeight, w, h) {
		if(this.done) {
			canvas.translate(w - textLen, 0);	
			return;
		}
		scrollDis%=w;
		if(scrollDis <= textLen) {
			canvas.rect(0, 0, textLen, h);
			canvas.clip();
			if(this.needStep) {
				this.callOnStep();
			}
		}
		else {
			this.needStep = true;
		}
		canvas.translate(scrollDis - textLen, 0);
	},
	onAlternate: function(canvas, scrollDis, textLen, textHeight, w, h) {
		if(this.done) {
			return;
		}
		var odd = parseInt(scrollDis/(w-textLen), 10)%2 > 0;
		var dis = parseInt(scrollDis%(w-textLen), 10);
			dis = odd ? w-textLen-dis : dis;

		if(odd) {
			this.needStep = true;
		}
		if(!odd && this.needStep) {
			this.callOnStep();
		}

		canvas.translate(dis, 0);
	}
};

var configDownResolve = {
	onScroll: function(canvas, scrollDis, textLen, textHeight, w, h) {
		if(this.done) {
			canvas.rect(0, 0, 0, 0);	
			canvas.clip();
			return;
		}
		scrollDis%=(h+textHeight);
		if(scrollDis <= textHeight) {
			canvas.rect(0, 0, w, textHeight + scrollDis);
			canvas.clip();
			if(this.needStep) {
				this.callOnStep();
			}
			if(this.done) {
				this.backText = this.text;
				this.text = "";
			}
		}
		else if(scrollDis >= h) {
			canvas.rect(0, h - textHeight, w, textHeight);	
			canvas.clip();
			this.needStep = true;
		}
		canvas.translate(0, scrollDis - textHeight);
	},
	onSlide: function(canvas, scrollDis, textLen, textHeight, w, h) {
		if(this.done) {
			canvas.translate(0, h - textHeight);	
			return;
		}
		scrollDis%=h;
		if(scrollDis <= textHeight) {
			canvas.rect(0, 0, w, textHeight);
			canvas.clip();
			if(this.needStep) {
				this.callOnStep();
			}
		}
		else {
			this.needStep = true;
		}
		canvas.translate(0, scrollDis - textHeight);
	},
	onAlternate: function(canvas, scrollDis, textLen, textHeight, w, h) {
		if(this.done) {
			return;
		}
		var odd = parseInt(scrollDis/(h-textHeight), 10)%2 > 0;
		var dis = parseInt(scrollDis%(h-textHeight), 10);
			dis = odd ? h-textHeight-dis : dis;
		if(odd) {
			this.needStep = true;
		}
		else if(this.needStep && !odd) {
			this.callOnStep();
		}
		canvas.translate(0, dis);
	}
};


UIMarquee.makeResolve = function(hAlign, vAlign, handlers) {
	return function(canvas) {
		var w = this.getWidth(true),
			h = this.getHeight(true),
			timeStep = canvas.timeStep;

		var scrollDis = parseInt(this.scrollCounter*this.scrollamount/this.scrolldelay, 10);

		canvas.font = this.style.getFont();
		var text = this.getLocaleText(this.text);
		var textLen = canvas.measureText(text).width;
		var textHeight = parseInt(canvas.font);

		this.hTextAlign = hAlign;
		this.vTextAlign = vAlign;

		var args = [canvas, scrollDis, textLen, textHeight, w, h];
		switch(this.behavior) {
			case UIMarquee.BEHAVIOR_SCROLL: {
				handlers.onScroll.apply(this, args);
				break;
			}
			case UIMarquee.BEHAVIOR_SLIDE: {
				handlers.onSlide.apply(this, args);
				break;
			}
			case UIMarquee.BEHAVIOR_ALTERNATE: {
				handlers.onAlternate.apply(this, args);
				break;
			}
			default: {
				throw new Error('unknow behavior');
			}
		}
	};
}

UIMarquee.prototype.leftResolve = UIMarquee.makeResolve('left', 'middle', configLeftResolve); 
UIMarquee.prototype.rightResolve = UIMarquee.makeResolve('left', 'middle', configRightResolve); 
UIMarquee.prototype.upResolve = UIMarquee.makeResolve('center', 'up', configUpResolve); 
UIMarquee.prototype.downResolve = UIMarquee.makeResolve('center', 'up', configDownResolve); 

UIMarquee.prototype.update = function(canvas) {
	var timeStep = canvas.timeStep;

	if(timeStep < this.scrolldelay) timeStep = this.scrolldelay;

	this.scrollCounter += (this.timeScale*timeStep);

	switch(this.direction) {
		case UIMarquee.DIR_RIGHT: {
			this.rightResolve(canvas);
			break;
		}
		case UIMarquee.DIR_LEFT: {
			this.leftResolve(canvas);
			break;
		}
		case UIMarquee.DIR_UP: {
			this.upResolve(canvas);
			break;
		}
		case UIMarquee.DIR_DOWN: {
			this.downResolve(canvas);
			break;
		}
		default: {
			throw new Error("unknow UIMarquee.direction:" + this.direction);
		}
	}
}

UIMarquee.prototype.onInit = function() {
	if(this.autoPlay) {
		this.play();
	}

	return;
}

UIMarquee.prototype.drawText = function(canvas) {
	this.layoutText(canvas);
	if((this.running || this.done) && !this.isInDesignMode()) {
		this.update(canvas);
		this.defaultDrawText(canvas);
	}

	if(this.isInDesignMode()) {
		this.defaultDrawText(canvas);
	}

	return;
}

UIMarquee.prototype.initOpts = function(config, onDone, onStep) {
	if(typeof config === 'function') {
		onStep = onDone;
		onDone = config;
		config = {};
	}

	this.onStep = onStep || config.onStep;
	this.onDone = onDone || config.onDone;
	this.direction = config.direction || this.direction || UIMarquee.DIR_RIGHT;
	this.behavior = config.behavior || this.behavior || UIMarquee.BEHAVIOR_SCROLL;
	this.loop = config.loop > 0 ? config.loop : (this.loop ? this.loop : UIMarquee.LOOP_INFINITE);
	this.backloop = this.loop;
	this.scrolldelay = config.scrolldelay || this.scrolldelay || UIMarquee.DEFAULT_SCROLL_DELAY;
	this.scrollamount = config.scrollamount || this.scrollamount || UIMarquee.DEFAULT_SCROLL_AMOUNT;

	return this;
}

UIMarquee.prototype.play = function(config, onStep, onDone) {
	config = config || {};
	this.initOpts(config, onStep, onDone);
	this.reset();
	this.started = true;
	this.running = true;
	this.done = false;
	this.text = this.backText ? this.backText : this.text;

	return this;
}

UIMarquee.prototype.reset = function() {
	this.timeScale = 1;
	this.scrollCounter = 0;
	this.needStep = false;
	this.loop = this.backloop;
}

UIMarquee.prototype.restart = function() {
	if(!this.started) return;
	this.running = true;
	this.done = false;
	this.text = this.backText ? this.backText : this.text;
	this.reset();
	return this;
}

UIMarquee.prototype.stop = function() {
	this.reset();
	this.running = false;
	return this;
}

UIMarquee.prototype.pause = function() {
	if(!this.running) return;

	this.timeScale = 0;
	return this;
}

UIMarquee.prototype.resume = function() {
	if(!this.running) return;

	this.timeScale = 1;
	return this;
}

UIMarquee.prototype.callOnStep = function() {
	this.needStep = false;
	if(this.loop !== UIMarquee.LOOP_INFINITE) {
		--this.loop;
		if(this.loop === 0) {
			this.callOnDone();
			return;
		}
	}

	if(typeof this.onStep === 'function') {
		if(!this.onStep()) {
			this.callOnDone();
			return;
		}
	}

	return this;
}

UIMarquee.prototype.callOnDone = function() {
	if(typeof this.onDone === 'function') {
		this.onDone();
	}

	this.done = true;
	this.stop();

	return this;
}

function UIMarqueeCreator() {
	var args = ["ui-marquee", "ui-marquee", null, 1];	

	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIMarquee();
		return g.initUIMarquee(this.type, dappGetText("Text"), null);
	}
}

ShapeFactoryGet().addShapeCreator(new UIMarqueeCreator());
UIElement.prototype.getScence= function() {
	return this.getWindow();
}

UIElement.prototype.getFootprints = function(name) {
	var x = 0;
	var y = 0;
	var footPrints = [];
	var arr = this.isUIWindow ? this : this.getParent().children;

	for(var i = 0; i < arr.length; i++) {
		var iter = arr[i];
		if(!iter.isUIFootprint) {
			continue;
		}

		if(name && name != iter.name) {
			continue;
		}

		x = iter.left + (iter.w >> 1);
		y = iter.top + (iter.h >> 1);

		footPrints.push({x:x, y:y});
	}

	return footPrints;
}

UIElement.prototype.moveAlongPath = function(name, duration, enableRotation, onDone) {
	var footPrints = this.getFootprints(name);

	return this.moveAlongPoints(footPrints, duration, enableRotation, onDone);
}

UIElement.prototype.moveAlongPoints = function(points, duration, enableRotation, onDone) {
	var d = 0;
	var dx = 0;
	var dy = 0;
	var moveInfo = {};
	var distances = [];
	var totalDistance = 0;

	if(!points.length) {
		console.log("no footprint found.");
	}

	for(var i = 0; i < points.length; i++) {
		var iter = points[i];
		if(i) {
			dx = points[i].x - points[i-1].x;
			dy = points[i].y - points[i-1].y;

			d = Math.sqrt(dx*dx+dy*dy);
			distances.push(d);
			totalDistance += d;
		}
	}

	moveInfo.onDone = onDone;
	moveInfo.duration = duration;
	moveInfo.distances = distances;
	moveInfo.points = points;
	moveInfo.totalDistance = totalDistance;
	moveInfo.enableRotation = enableRotation;

	this.startMove(moveInfo);

	return;
}

UIElement.prototype.startMove = function(moveInfo) {
	var x = 0;
	var y = 0;
	var index = 0;
	var me = this;
	var hw = this.w >> 1;
	var hh = this.h >> 1;

	var duration = moveInfo.duration;
	var distances = moveInfo.distances;
	var points = moveInfo.points;
	var totalDistance = moveInfo.totalDistance;
	var enableRotation = moveInfo.enableRotation;

	function moveToNext() {
		if((index+1) >= points.length) {
			if(moveInfo.onDone) {
				moveInfo.onDone();
			}

			return;
		}

		var start = Date.now();
		var endPoint = points[index+1];
		var startPoint = points[index];
		var dt = duration * (distances[index]/totalDistance);
		var dx = endPoint.x - startPoint.x;
		var dy = endPoint.y - startPoint.y;

		var angle = Math.asin(Math.abs(dy)/Math.sqrt(dx * dx + dy * dy));

		if(dy <= 0 && dx < 0 ) {
			angle = Math.PI - angle;
		}
		
		if(dy > 0 && dx < 0 ) {
			angle = Math.PI + angle;
		}
		
		if(dy > 0 && dx >= 0 ) {
			angle = 2 * Math.PI - angle;
		}

		angle = -angle;
		function step() {
			var percent = (Date.now() - start)/dt;
			if(percent < 1) {
				x = startPoint.x + dx * percent - hw;
				y = startPoint.y + dy * percent - hh;

				me.setPosition(x, y);
				if(enableRotation) {
					me.setRotation(angle);
				}
				me.postRedraw();
				
				return true;
			}
			else {
				index++;
				x = endPoint.x - hw;
				y = endPoint.y - hh;

				me.setPosition(x, y);
				me.postRedraw();
				moveToNext();

				return false;
			}
		}

		UIElement.setAnimTimer(step);
	}

	moveToNext();

	return;
}

UIElement.prototype.setPositionWithSticky = function(x, y) {
	this.setPosition(x, y);

	if(this.sticky) {
		this.orgX = this.x;		
		this.orgY = this.y;	
	}

	return this;
}

UIElement.prototype.setAngle = UIElement.prototype.setRotation;

UIElement.prototype.setPositionByBody = function(left, top) {
    if(this.anchor) {
        this._x = left + this.w * this.anchor.x;
        this._y = top + this.h * this.anchor.y;
        this.setLeftTop(left, top);
    }
    else {
        this._x = left;
        this._y = top;
        this.setLeftTop(this._x, this._y);
    }

	this.callOnMovedHandler();

	return this;
}

UIElement.prototype.setSoundMusicVolume = function(volume) {
	this.getWindowManager().setSoundMusicVolume(volume);

	return this;
}

UIElement.prototype.setSoundEffectVolume = function(volume) {
	this.getWindowManager().setSoundEffectVolume(volume);

	return this;
}

UIElement.prototype.playSoundEffect = function(name, onDone) {
	this.getWindowManager().playSoundEffect(name, onDone);

	return this;
}

UIElement.prototype.playSoundMusic = function(name, onDone) {
	this.getWindowManager().playSoundMusic(name, onDone);

	return this;
}

UIElement.prototype.stopSoundMusic = function(name) {
	this.getWindowManager().stopSoundMusic(name);

	return this;
}

UIElement.prototype.stopSoundEffect = function(name) {
	this.getWindowManager().stopSoundEffect(name);

	return this;
}

UIElement.prototype.setSoundEnable = function(enable) {
	var wm = this.getWindowManager();

	wm.setSoundEnable(enable);

	return this;
}

UIElement.prototype.isSoundEnable = UIElement.prototype.getSoundEnable = function() {
	var wm = this.getWindowManager();

	return wm.getSoundEnable();
}

UIElement.prototype.setSoundEffectEnable = function(enable) {
	var wm = this.getWindowManager();

	wm.setSoundEffectsEnable(enable);

	return this;
}

UIElement.prototype.isSoundEffectEnable = UIElement.prototype.getSoundEffectEnable = function() {
	var wm = this.getWindowManager();

	return wm.soundEffectsEnalbe;
}

UIElement.prototype.setSoundMusicEnable = function(enable) {
	var wm = this.getWindowManager();

	wm.setSoundMusicsEnable(enable);

	return this;
}

UIElement.prototype.isSoundMusicEnable = UIElement.prototype.getSoundMusicEnable = function() {
	var wm = this.getWindowManager();

	return wm.soundMusicsEnalbe;
}

UIElement.prototype.setVOf = function(name, x, y) {
	var el = this.getWindow().findChildByName(name, true);
	if(el) {
		el.setV(x, y);
	}
	else {
		console.log("not found " + name);
	}

	return this;
}

UIElement.prototype.setV = function(x, y) {
	var body = this.body;
	if(body) {
		this.setVisible(true);

		if(!body.IsActive()) {
			body.SetActive(true);
		}

		if(!body.IsAwake()) {
			body.SetAwake(true);
		}

		var v = body.GetLinearVelocity();
		if(x !== null && x !== undefined) {
			v.x = x;
		}

		if(y !== null && y !== undefined) {
			v.y = y;
		}

		body.SetLinearVelocity(v);
	}

	return this;
}

UIElement.prototype.onRemoved = function(parent) {
	if(!parent) {
		return;
	}

	var win = parent.getWindow();
	if(!win) {
		return;
	}

	var world = win.world;

	if(this.body) {
		Physics.destroyBodyForElement(world, this);
		this.body = null;
	}

	if(this.joint) {
		Physics.destroyJointForElement(world, this);
		this.joint = null;
	}

	return this;
}

/*
 * File:   ui-weixin.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  WeiXin Settings/Events
 * 
 * Copyright (c) 2015 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIWeixin 
 * @extends UIElement 
 * 微信设置控件。配置成功后可以调用微信JSAPI。导出游戏到自己的服务器上运行，需要提供自己的配置文件URL。
 * 
 * 使用自己的配置文件URL请参考：https://github.com/drawapp8/GameWiki/wiki/Wechat-JSSDK-wiki
 *
 * 微信JSAPI: http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
 *
 */
function UIWeixin() {
	return;
}

UIWeixin.prototype = new UIElement();
UIWeixin.prototype.isUIWeixin = true;
UIWeixin.prototype.saveProps = ["configURL", "shareTitle", "shareDesc", "shareLink", "shareImage", 
		"apiList", "debug"];

UIWeixin.prototype.initUIWeixin = function(type, w, h, bg) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;
	this.setImage(UIElement.IMAGE_DEFAULT, bg);
	this.setCanRectSelectable(false, true);

	return this;
}

UIWeixin.jsApiList = [
        'checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'translateVoice',
        'startRecord',
        'stopRecord',
        'onRecordEnd',
        'playVoice',
        'pauseVoice',
        'stopVoice',
        'uploadVoice',
        'downloadVoice',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage',
        'getNetworkType',
        'openLocation',
        'getLocation',
        'hideOptionMenu',
        'showOptionMenu',
        'closeWindow',
        'scanQRCode',
        'chooseWXPay',
        'openProductSpecificView',
        'addCard',
        'chooseCard',
        'openCard'
      ];

UIWeixin.prototype.getConfig = function(configURL, jsApiList, debug) {
	if(UIWeixin.config) {
		return;
	}
	else {
		UIWeixin.config = {};
	}

	httpGetJSON(configURL, function onDone(data) {
		UIWeixin.config = data;

		if(UIWeixin.config) {
			UIWeixin.config.jsApiList = jsApiList;
			UIWeixin.config.debug = debug;
			console.log("Fetch UIWeixin.config success:");
		}
		else {
			console.log("Fetch weixin config failed.");
			return;
		}

		function callWeiXinConfig() {
			try {
				wx.config(UIWeixin.config);
				UIWeixin.configDone = true;
				console.log(JSON.stringify(UIWeixin.config, null, "\t"));
				console.log("Call wx.config done:");
			}
			catch(e) {
				console.log("wx script is not load yet, try to config lator:");
				setTimeout(callWeiXinConfig, 100);
			}
		}

		if(isWeiXin()) {
			console.log("Is WeiXin, try to config it.");
			callWeiXinConfig();
		}
		else {
			console.log("It is not weixin browser");
		}
	});
}

UIWeixin.prototype.onFromJsonDone = function() {
	var url = window.btoa(location.href);
	var configURL = null;

	if(location.href.indexOf('i5r.com.cn') >= 0) {
		configURL = this.configURL ? this.configURL : "/weixin/php/json_config.php";
	}
	else {
		configURL = this.configURL ? this.configURL : "/wechat/config";
	}

	if(configURL.indexOf("?") > 0) {
		configURL = configURL + "&url=" + url;
	}
	else {
		configURL = configURL + "?url=" + url;
	}

	var jsApiList = UIWeixin.jsApiList;
	if(this.apiList) {
		jsApiList = this.apiList.split("\n");
	}

	this.getConfig(configURL, jsApiList, this.debug);

	return;
}

UIWeixin.prototype.onInit = function() {
	var me = this;
	if(!window.wx) {
		console.log("UIWeixin.prototype.onInit wx not defined.");
		return;
	}

	wx.ready(function () {
		UIWeixin.ready = true;
		me.updateShareInfo();
		console.log("wx.ready");
	});

	wx.error(function (res) {
	});

	console.log("UIWeixin.prototype.onInit end");

	return;
}

UIWeixin.prototype.onDeinit = function() {

	return;
}

UIWeixin.prototype.shapeCanBeChild = function(shape) {
	return false;
}

/**
 * @method setShareTitle
 * 设置分享标题。
 * @param {String} shareTitle 分享标题。
 * @return {UIElement} 返回控件本身。
 *
 */
UIWeixin.prototype.setShareTitle = function(shareTitle) {
	this.shareTitle = shareTitle;
	this.updateShareInfo();

	return this;
}

/**
 * @method setShareDesc
 * 设置分享描述。
 * @param {String} shareDesc 分享描述。
 * @return {UIElement} 返回控件本身。
 *
 */
UIWeixin.prototype.setShareDesc = function(shareDesc) {
	this.shareDesc = shareDesc;
	this.updateShareInfo();

	return this;
}

/**
 * @method setShareLink
 * 设置分享链接。
 * @param {String} shareLink 分享链接。
 * @return {UIElement} 返回控件本身。
 *
 */
UIWeixin.prototype.setShareLink = function(shareLink) {
	this.shareLink = shareLink;
	this.updateShareInfo();

	return this;
}

/**
 * @method setShareImage
 * 设置分享图片。
 * @param {String} shareImage 分享图片。
 * @return {UIElement} 返回控件本身。
 *
 */
UIWeixin.prototype.setShareImage = function(shareImage) {
	this.shareImage = shareImage;
	this.updateShareInfo();

	return this;
}

UIWeixin.prototype.updateShareInfo = function() { 
	if(!window.wx) {
		return;
	}

	var view = this.view;
	var title = this.shareTitle ? this.shareTitle : view.getAppName();
	var desc = this.shareDesc ? this.shareDesc : view.getAppDesc();
	var link = this.shareLink ? this.shareLink : location.href;
	var imgUrl = ResLoader.toAbsURL(this.shareImage ? this.shareImage : view.getAppIcon());

	var info = {
		title: title,
		desc: desc,
		link: link,
		imgUrl: imgUrl,
		trigger: function (res) {
			console.log("weixin operation trigger:" + JSON.stringify(res));
		},
		success: function (res) {
			console.log("weixin operation success:" + JSON.stringify(res));
		},
		cancel: function (res) {
			console.log("weixin operation cancel:" + JSON.stringify(res));
		},
		fail: function (res) {
			console.log("weixin operation fail:" + JSON.stringify(res));
		}
	};

    wx.onMenuShareAppMessage(info);
    wx.onMenuShareTimeline(info);
    wx.onMenuShareQQ(info);
    wx.onMenuShareWeibo(info);

	return;
}

function UIWeixinCreator() {
	var args = ["ui-weixin", "ui-weixin", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIWeixin();
		return g.initUIWeixin(this.type, 200, 200, null);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIWeixinCreator());


/**
 * @class HolaSDK
 * HolaSDK。广告，分享和统计等API。
 *
 * 所有函数通过HolaSDK直接调用。示例：
 * 
 *     @example small frame
 *     HolaSDK.exit()
 *
 */
function HolaSDK() {
}

HolaSDK.exec = function(action, options) {
	if(window.HolaF) {
		window.HolaF(action, options);
		console.log("HolaSDK.exec:" + action + ":" + (options ? JSON.stringify(options) : "{}"));
	}
	else {
		console.log("HolaSDK.exec(e):" + action + ":" + (options ? JSON.stringify(options) : "{}"));
	}
}

HolaSDK.init = function(appID, debug) {
	if(HolaSDK.initialized) {
		return;
	}

	var options = {};
	options.app_id = appID;
	options.debug = debug;

	HolaSDK.appID = appID;
	HolaSDK.initialized = true;
	HolaSDK.startTime = Date.now();
	HolaSDK.exec('GameJsAdSdk.init', options);
	console.log("HolaSDK.init done");
}

/**
 * @method showAd
 * 显示广告(一般不需要直接调用)。
 * @param {String} placementID 位置ID。
 * @param {Number} placementType 类型。 
 * @param {Number} impressionTime 显示时间。
 * @param {Boolean} closable 是否可关闭。
 *
 */
HolaSDK.showAd = function(placementID, placementType, impressionTime, closable) {
	var options = {};
	options.placement_id = HolaSDK.appID + '_' + placementID;
	options.placement_type = placementType;
	options.impression_time = impressionTime;
	options.closable = closable;

	HolaSDK.exec('GameJsAdSdk.showAd', options);
}

/**
 * @method closeAd
 * 关闭广告(一般不需要直接调用)。
 */
HolaSDK.closeAd = function() {
    if(!HolaSDK.initialized) return;
	HolaSDK.exec('GameJsAdSdk.closeAd');
}

/**
 * @method share
 * 分享(在分享按钮的Click事件中填写相应参数即可)。
 * @param {String} title 标题。
 * @param {String} description 描述。
 * @param {String} link 链接。
 * @param {String} icon 图标。
 *
 */
HolaSDK.share = function(title, description, link, icon) {
	var options = {};
	options.title = title;
	options.description = description;

	HolaSDK.exec('share', options);
}

HolaSDK.fixTime = function(duration) {
	if(duration > 1000) {
		duration = duration/1000;
	}

	return duration;
}

/**
 * @method sendBarrage
 * 发送弹幕。
 * @param {Number} score 当前分数。 
 * @param {Number} level 当前关数。
 * @param {Number} duration 游戏时间(毫秒)。
 *
 */
HolaSDK.sendBarrage = function(score, level, duration) {
	var options = {};
	options.score = score;
	options.level = level;
	options.duration = HolaSDK.fixTime(duration);
	HolaSDK.exec('Barrage.send', options);
}

/**
 * @method ping
 * 更新游戏状态。
 * @param {Number} score 当前分数。 
 * @param {Number} level 当前关数。
 * @param {Number} duration 游戏时间(毫秒)。
 *
 */
HolaSDK.ping = function(score, level, duration) {
	var options = {};
	options.score = score;
	options.level = level;
	options.duration = HolaSDK.fixTime(duration);
	HolaSDK.exec('Barrage.ping', options);
}

HolaSDK.onPaused = function() {
	if(HolaSDK.onPausedCallback) {
		HolaSDK.onPausedCallback();
	}
}

/**
 * @method whenPaused
 * 注册暂停事件的回调函数。
 * @param {Function} callback 
 *
 */
HolaSDK.whenPaused = function(callback) {
	HolaSDK.onPausedCallback = callback;

	HolaSDK.exec('Game.Event.onPause', HolaSDK.onPaused);
}

HolaSDK.onResumed = function() {
	if(HolaSDK.onResumedCallback) {
		HolaSDK.onResumedCallback();
	}
}

/**
 * @method whenResumed
 * 注册恢复事件的回调函数。
 * @param {Function} callback 
 *
 */
HolaSDK.whenResumed = function(callback) {
	HolaSDK.onResumedCallback = callback;

	HolaSDK.exec('Game.Event.onResume', HolaSDK.onResumed);
}

HolaSDK.onRestarted = function() {
	if(HolaSDK.onRestartedCallback) {
		HolaSDK.onRestartedCallback();
	}
}

/**
 * @method whenRestarted
 * 注册重玩事件的回调函数。游戏盒子上的Replay按钮被按下时触发本事件。
 * @param {Function} callback 
 *
 */
HolaSDK.whenRestarted = function(callback) {
	HolaSDK.onRestartedCallback = callback;

	HolaSDK.exec('Game.Event.onRestart', HolaSDK.onRestarted);
}

/**
 * @method gameStarted
 * 游戏开始时调用(用于更新统计信息)。
 * @param {Number} level 当前关数。
 *
 */
HolaSDK.gameStarted = function(level) {
	var options = {};
	options.level = level;

	HolaSDK.exec('Game.Status.start', options);
}

/**
 * @method gamePaused
 * 游戏暂停时调用(用于更新统计信息)。
 *
 */
HolaSDK.gamePaused = function() {
	HolaSDK.exec('Game.Status.pause');
}

/**
 * @method gameResumed
 * 游戏恢复时调用(用于更新统计信息)。
 *
 */
HolaSDK.gameResumed = function() {
	HolaSDK.exec('Game.Status.resume');
}

/**
 * @method gameOver
 * 游戏结束时调用(用于更新统计信息)。
 * @param {Number} score 当前分数。 
 * @param {Number} level 当前关数。
 * @param {Number} duration 游戏时间(毫秒)。
 *
 */
HolaSDK.gameOver = function(score, level, duration) {
	var options = {};
	options.score = score;
	options.level = level;
	options.duration = HolaSDK.fixTime(duration);
	HolaSDK.exec('Game.Status.over', options);
}

HolaSDK.gameRestarted = function() {
	console.log("HolaSDK.gameRestarted is not supported now!!!");
}

HolaSDK.gameExited = function() {
	HolaSDK.exec('Game.Status.exit');
}

/**
 * @method exit
 * 退出游戏，返回游戏大厅。
 *
 */
HolaSDK.exit = function() {
	HolaSDK.exec('Game.exit');
}


HolaSDK.getSDKURL = function() {
    return "http://game-ad-sdk.haloapps.com/static/abyhola/sdk/js_ad_sdk_loader.js?v=034";
}

window.HolaSDK = HolaSDK;

if(!window.CanTK) {
	window.CanTK = {};
}

CanTK.isOldIE = isOldIE;
CanTK.isTizen = isTizen;
CanTK.isMobile = isMobile;
CanTK.isAndroid = isAndroid;
CanTK.isFirefoxOS = isFirefoxOS;
CanTK.initViewPort = cantkInitViewPort;
CanTK.restoreViewPort = cantkRestoreViewPort;
CanTK.httpGetURL = httpGetURL;
CanTK.httpGetJSON = httpGetJSON;
CanTK.httpDoRequest = httpDoRequest;

CanTK.LinearInterpolator = LinearInterpolator;
CanTK.BounceInterpolator = BounceInterpolator;
CanTK.AccelerateInterpolator = AccelerateInterpolator;
CanTK.AccDecelerateInterpolator = AccDecelerateInterpolator;
CanTK.DecelerateInterpolator = DecelerateInterpolator;
CanTK.detectDeviceConfig = cantkDetectDeviceConfig;
CanTK.regShapeCreator = cantkRegShapeCreator;
CanTK.ShapeCreator = ShapeCreator;

window.isOldIE = isOldIE;
window.isTizen = isTizen;
window.isMobile = isMobile;
window.isAndroid = isAndroid;
window.isFirefoxOS = isFirefoxOS;
window.httpGetURL = httpGetURL;
window.httpGetJSON = httpGetJSON;
window.httpDoRequest = httpDoRequest;
window.cantkInitViewPort = cantkInitViewPort;
window.cantkRestoreViewPort = cantkRestoreViewPort;
window.cantkGetViewPort = cantkGetViewPort;

window.Shape = Shape;
window.UIElement = UIElement;
window.UIWindowManager = UIWindowManager;
window.ShapeFactory = ShapeFactory;

CanTK.UIImage = UIImage;

CanTK.Shape = Shape;
CanTK.UIElement = UIElement;

CanTK.init = function () {
}

CanTK.createElement = function(type) {
	return ShapeFactoryGet().createShape(type, C_CREATE_FOR_PROGRAM);
}

CanTK.createElementWithJson = function(data) {
	var type = data.type;
	var el = ShapeFactoryGet().createShape(type, C_CREATE_FOR_PROGRAM);

	if(el) {
		el.fromJson(data);
		el.setMode(Shape.MODE_RUNNING, true);
	}

	return el;
}

CanTK.UIElement.RUNNING = Shape.MODE_RUNNING;
CanTK.UIElement.DEFAULT_IMAGE = UIElement.IMAGE_DEFAULT;

CanTK.setResRoot = function(resRoot) {
	return ResLoader.setResRoot(resRoot);
}

