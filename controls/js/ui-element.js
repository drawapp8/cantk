/*
 * File: core.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: UIElement
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIElement() {
	return;
}

UIElement.prototype = new RShape();

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

	return obj;
}

UIElement.prototype.getRelativePathOfURL = function(url) {
	if(UIElement.disableGetRelativePathOfURL) {
		return url;
	}

	if(!url) {
		return null;
	}

	var str = window.location.protocol + "//" + window.location.host + "/";
	if(url.indexOf("/web/backend/") >= 0 && url.indexOf(str) >= 0) {
		return url;
	}


	url = url.replace(str, "");

	return url;
}

UIElement.prototype.setFreePosition = function(value) {
	this.freePosition = value;

	return;
}

UIElement.prototype.fixChildPosition = function(child) {
	var x = child.x;
	var y = child.y;
	var h = child.h;
	var minX = this.getHMargin();
	var minY = this.getVMargin();

	if(child.freePosition) {
		return;
	}

	if(child.widthAttr === C_WIDTH_FILL_PARENT || x < minX) {
		x = minX;
	}

	if(child.heightAttr === C_HEIGHT_FILL_PARENT || y < minY) {
		y = minY;
	}
	
	child.x = x;
	child.y = y;

	return;
}

UIElement.prototype.setFreeSize = function(value) {
	this.freeSize = value;
	
	return;
}

UIElement.prototype.fixChildSize = function(child) {
	if(child.freeSize) {
		return;
	}

	if(this.autoAdjustHeight) {
		if((child.y + child.h) > this.h) {
			this.h = child.y + child.h + this.vMargin;
		}
	}

	var x = child.x;
	var w = child.w;
	var y = child.y;
	var h = child.h;
	var wParent = this.getWidth(true);
	var hParent = this.getHeight(true);
	var right = wParent + this.hMargin;
	var bottom = hParent + this.vMargin;

	if((x + w) > right && child.widthAttr != C_WIDTH_FILL_PARENT 
		&& child.xAttr != C_X_AFTER_PREV && child.widthAttr != C_WIDTH_FILL_AVAILABLE 
		&& this.mode === C_MODE_EDITING) {
		x = right - w;
		if(x < 0) {
			x = 0;
		}

		w = right - x;
	}

	if((y + h) > bottom && child.heightAttr != C_HEIGHT_FILL_PARENT 
		&& child.yAttr != C_Y_AFTER_PREV && child.heightAttr != C_HEIGHT_FILL_AVAILABLE 
		&& this.mode === C_MODE_EDITING) {
		y = bottom - h;
		if(y < 0) {
			y = 0;
		}

		h = bottom - y;
	}

	if(x < 0) {
		x = 0;
	}
	if(y < 0) {
		y = 0;
	}
	
	child.x = x;
	child.y = y;
	child.w  = w <= wParent ? w : wParent;
	child.h  = h <= hParent ? h : hParent;

	return;
}

UIElement.prototype.onInit = function() {
	if(this.offset) {
		this.offset = 0;
	}

	if(this.mode !== C_MODE_EDITING) {
		if(this.dataSourceUrl && this.dataSourceUrl.length > 5) {
			this.bindDataUrl(this.dataSourceUrl);
		}
	
		this.callOnInit();
	}

	return;
}

UIElement.prototype.onDeinit = function() {
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
	this.onInit();
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
	return this.mode === C_MODE_EDITING;
}

UIElement.prototype.postRedraw = function() {
	if(this.view) {
		if(this.mode === C_MODE_RUNNING) {
			var rect = {};
			var p = this.getPositionInView();
			rect.x = p.x;
			rect.y = p.y;
			rect.w = this.w;
			rect.h = this.h;

			this.view.postRedraw(rect);
		}
		else {
			this.view.postRedrawAll();
		}
	}

	return;
}

UIElement.prototype.setMode = function(mode, recursive) {
	this.mode = mode;

	if(this.type !== "ui-menu-bar") {
		if(mode === C_MODE_EDITING) {
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

	return;
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

UIElement.prototype.setSelected = function(selected) {
	if(!selected) {
		for(var i = 0; i < this.children.length; i++) {
			var child = this.children[i];
			child.setSelected(false);
		}
	}
	
	if(this.selected === selected) {
		return;
	}

	this.targetShape = null;
	this.selected = selected;

	if(this.view && this.view.onShapeSelected) {
		this.view.onShapeSelected(this);
	}
	
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
	onVisit(this);

	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		iter.forEach(onVisit);
	}

	return;
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
		if(child != shape) {
			child.setSelected(false);
		}
	}

	this.targetShape = shape;
	this.selected = !shape;

	return;
}

UIElement.prototype.initContainerShape = function(type) {
	this.children = new Array();
	this.toJsoners = new Array();
	this.fromJsoners = new Array();

	RShapeInit(this, type);
	
	this.mode = C_MODE_EDITING;
	this.rectSelectable = true;

	return this;
}

UIElement.prototype.defaultDispatchPointerDownToChildren = function(p) {
	var targetShape = this.targetShape;
	if(targetShape && targetShape.selected && targetShape.mode === C_MODE_EDITING) {
		var hitTestResult = this.hitTest(p);

		if(hitTestResult != C_HIT_TEST_MM && hitTestResult != C_HIT_TEST_NONE) {
			if(this.targetShape.onPointerDown(p)) {
				return true;
			}
		}
	}

	for(var i = this.children.length; i > 0; i--) {
		var child = this.children[i-1];

		if(child.visible && child.onPointerDown(p)) {
			this.setTarget(child);

			return true;
		}
	}

	return false;
}

UIElement.prototype.dispatchPointerDownToChildren = function(p) {
	return this.defaultDispatchPointerDownToChildren(p);
}

UIElement.prototype.callPointerDownHandler = function(point) {
	if(!this.enable) {
		return false;
	}

	if(!this.handlePointerDown || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onPointerDown"];
		if(sourceCode) {
			sourceCode = "this.handlePointerDown = function(point) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handlePointerDown) {
		try {
			this.handlePointerDown(point);
		}catch(e) {
			console.log("this.handlePointerDown:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.onPointerDownEditing = function(point, beforeChild) {
	return;
}

UIElement.prototype.onPointerDownRunning = function(point, beforeChild) {
	if(!beforeChild) {
		return;
	}

	return this.callPointerDownHandler(point);
}

UIElement.prototype.callPointerMoveHandler = function(point) {
	if(!this.enable) {
		return false;
	}

	if(!this.handlePointerMove || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onPointerMove"];
		if(sourceCode) {
			sourceCode = "this.handlePointerMove = function(point) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handlePointerMove) {
		try {
			this.handlePointerMove(point);
		}catch(e) {
			console.log("this.handlePointerMove:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.onPointerMoveEditing = function(point, beforeChild) {
	return;
}

UIElement.prototype.onPointerMoveRunning = function(point, beforeChild) {
	if(!beforeChild) {
		return;
	}

	return this.callPointerMoveHandler(point);
}

UIElement.prototype.callPointerUpHandler = function(point) {
	if(!this.enable) {
		return false;
	}

	if(!this.handlePointerUp || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onPointerUp"];
		if(sourceCode) {
			sourceCode = "this.handlePointerUp = function(point) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handlePointerUp) {
		try{
			this.handlePointerUp(point);
		}catch(e) {
			console.log("this.handlePointerUp:" + e.message);
		}
	}
	
	return true;
}

UIElement.prototype.onPointerUpEditing = function(point, beforeChild) {
	return;
}

UIElement.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(!beforeChild) {
		return;
	}
	return this.callPointerUpHandler(point);
}

UIElement.prototype.callLongPressHandler = function(point) {
	if(!this.enable) {
		return false;
	}

	if(!this.handleLongPress || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onLongPress"];
		if(sourceCode) {
			sourceCode = "this.handleLongPress = function(point) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleLongPress) {
		try {
			this.handleLongPress(point);
		}catch(e) {
			console.log("this.handleLongPress:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callDoubleClickHandler = function(point) {
	if(this.mode === C_MODE_EDITING) {
		if(this.textType != C_SHAPE_TEXT_NONE) {
			this.editText(point);
		}
		else {
			this.showProperty();
		}

		return true;
	}
	
	if(!this.enable) {
		return false;
	}

	if(!this.handleDoubleClick || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onDoubleClick"];
		if(sourceCode) {
			sourceCode = "this.handleDoubleClick = function(point) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleDoubleClick) {
		try {
			this.handleDoubleClick(point);
		}catch(e) {
			console.log("this.handleDoubleClick:" + e.message);
		}
	}

	this.hitTestResult = 0;

	return true;
}

UIElement.prototype.callTimerHandler = function() {
	var win = this.getWindow();
	if(win && !win.visible) {
		return true;
	}

	if(this.mode === C_MODE_EDITING) {
		return true;
	}
	
	if(!this.enable) {
		return false;
	}

	if(!this.handleTimer || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onTimer"];
		if(sourceCode) {
			sourceCode = "this.handleTimer = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleTimer) {
		try {
			this.handleTimer();
		}catch(e) {
			console.log("this.handleTimer:" + e.message);
		}
	}

	return true;
}


UIElement.prototype.callPaintHandler = function(canvas2dCtx) {
	if(this.mode === C_MODE_EDITING) {
		return true;
	}
	
	if(!this.enable) {
		return false;
	}

	if(!this.handlePaint || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onPaint"];
		if(sourceCode) {
			sourceCode = "this.handlePaint = function(canvas2dCtx) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handlePaint) {
		try {
			this.handlePaint(canvas2dCtx);
		}catch(e) {
			console.log("this.handlePaint:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.onDoubleClick = function(point) {
	if(this.targetShape) {
		var p = this.translatePoint(point);
		return this.targetShape.onDoubleClick(p);
	}
	else {
		return this.callDoubleClickHandler(point);
	}
}

UIElement.prototype.onGesture = function(gesture) {
	if(this.targetShape) {
		return this.targetShape.onGesture(gesture);
	}

	return;
}

UIElement.prototype.onLongPress = function(point) {
	this.longPressed = true;

	this.callLongPressHandler(point);
	if(this.targetShape) {
		var p = this.translatePoint(point);
		return this.targetShape.onLongPress(p);
	}

	return;
}

UIElement.prototype.callClickHandler = function(point, onChild) {
	if(!this.enable) {
		return false;
	}

	if(this.mode === C_MODE_EDITING) {
		return false;
	}

	if(!this.handleClick || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onClick"];
		if(sourceCode) {
			sourceCode = "this.handleClick = function(point) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(!this.children.length) {
		console.log("clicked: " + this.type + "(" + this.name + ")");
	}
	if(this.handleClick) {
		try {
			this.handleClick(point);
		}catch(e) {
			console.log("this.handleClick:" + e.message);
		}
	}

	return;
}

UIElement.prototype.onClick = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}

	return this.callClickHandler(point, beforeChild);
}

UIElement.prototype.translatePoint = function(point) {
	var p = {x : (point.x - this.x), y : (point.y - this.y)};

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
	return this.rectSelectable && this.parentShape;
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

UIElement.prototype.callOnDragStartHandler = function() {
	if(!this.enable) {
		return false;
	}

	if(this.mode === C_MODE_EDITING) {
		return false;
	}

	if(!this.handleDragStart || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onDragStart"];
		if(sourceCode) {
			sourceCode = "this.handleDragStart = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleDragStart) {
		try {
			this.handleDragStart();
		}catch(e) {
			console.log("this.handleDragStart:" + e.message);
		}
	}

	return;
}

UIElement.prototype.callOnDragEndHandler = function() {
	if(!this.enable) {
		return false;
	}

	if(this.mode === C_MODE_EDITING) {
		return false;
	}

	if(!this.handleDragEnd || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onDragEnd"];
		if(sourceCode) {
			sourceCode = "this.handleDragEnd = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleDragEnd) {
		try {
			this.handleDragEnd();
		}catch(e) {
			console.log("this.handleDragEnd:" + e.message);
		}
	}

	return;
}

UIElement.prototype.callOnDragingHandler = function() {
	if(!this.enable) {
		return false;
	}

	if(this.mode === C_MODE_EDITING) {
		return false;
	}

	if(!this.handleDraging || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onDragging"];
		if(sourceCode) {
			sourceCode = "this.handleDraging = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleDraging) {
		try {
			this.handleDraging();
		}catch(e) {
			console.log("this.handleDraging:" + e.message);
		}
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
	this.x = this.x + dx;
	this.y = this.y + dy;
	
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

UIElement.prototype.animMove = function(x, y, hint) {
	if((this.x === x && this.y === y) || this.dragging) {
		return;
	}

	var el = this;
	var duration = 1000;
	var xStart = this.x;
	var yStart = this.y;
	var xRange = x - this.x;
	var yRange = y - this.y;
	var startTime = Date.now();
	var interpolator =  new DecelerateInterpolator();

	function animStep() {
		var timePercent = (Date.now() - startTime)/duration;
		var percent = interpolator.get(timePercent);

		if(el.dragging) {
			return;
		}

		if(timePercent < 1 && !el.pointerDown) {
			el.x = Math.floor(xStart + percent * xRange);
			el.y = Math.floor(yStart + percent * yRange);
			UIElement.setAnimTimer(animStep);
		}
		else {
			el.move(x, y);
			delete startTime;
			delete interpolator;
		}

		delete now;
		el.postRedraw();
	}
	UIElement.setAnimTimer(animStep);

	return;
}

UIElement.prototype.animate = function(config) {
	if(this.animating || this.dragging || !config) {
		return;
	}

	var el = this;
	var duration = isNaN(config.duration) ? 1000 : config.duration;
	var xStart = isNaN(config.xStart) ? this.x : config.xStart;
	var yStart = isNaN(config.yStart) ? this.y : config.yStart;
	var wStart = isNaN(config.wStart) ? this.w : config.wStart;
	var hStart = isNaN(config.hStart) ? this.h : config.hStart;
	var xEnd = isNaN(config.xEnd) ? this.x : config.xEnd;
	var yEnd = isNaN(config.yEnd) ? this.y : config.yEnd;
	var wEnd = isNaN(config.wEnd) ? this.w : config.wEnd;
	var hEnd = isNaN(config.hEnd) ? this.h : config.hEnd;
	var opacityStart = isNaN(config.opacityStart) ? this.opacity : config.opacityStart;
	var opacityEnd = isNaN(config.opacityEnd) ? this.opacity : config.opacityEnd;
	var rotationStart = isNaN(config.rotationStart) ? 0 : config.rotationStart;
	var rotationEnd = isNaN(config.rotationEnd) ? 0 : config.rotationEnd;
	var scaleStart = isNaN(config.scaleStart) ? this.scale : config.scaleStart;
	var scaleEnd = isNaN(config.scaleEnd) ? this.scale : config.scaleEnd;

	var onDone = config.onDone;
	var xRange = xEnd - xStart;
	var yRange = yEnd - yStart;
	var wRange = wEnd - wStart;
	var hRange = hEnd - hStart;
	var scaleRange = scaleEnd - scaleStart;
	var opacityRange = opacityEnd - opacityStart;
	var rotationRange = rotationEnd - rotationStart;

	var startTime = Date.now();
	var interpolator =  config.interpolator ? config.interpolator : new DecelerateInterpolator();

	function animStep() {
		var timePercent = (Date.now() - startTime)/duration;
		var percent = interpolator.get(timePercent);

		if(el.dragging) {
			return;
		}

		if(timePercent < 1 && !el.pointerDown) {
			if(xRange) {
				el.x = Math.floor(xStart + percent * xRange);
			}

			if(yRange) {
				el.y = Math.floor(yStart + percent * yRange);
			}
			
			if(wRange) {
				el.w = Math.floor(wStart + percent * wRange);
			}
			
			if(hRange) {
				el.h = Math.floor(hStart + percent * hRange);
			}

			if(opacityRange) {
				el.opacity = opacityStart + percent * opacityRange;	
			}

			if(rotationRange) {
				el.rotation = rotationStart + percent * rotationRange;
			}
	
			if(scaleRange) {
				el.scale = scaleStart + percent * scaleRange;
			}

			UIElement.setAnimTimer(animStep);
		}
		else {
			if(xRange || yRange) {
				el.move(xEnd, yEnd);
			}
			
			if(wRange || hRange) {
				el.w = wEnd;
				el.h = hEnd;
			}

			if(opacityRange) {
				el.opacity = opacityEnd;
			}

			if(rotationRange) {
				el.rotation = rotationEnd;
			}
			
			if(onDone) {
				onDone(el);
			}

			delete startTime;
			delete interpolator;
		}

		el.postRedraw();
	}

	var delay = config.delay;
	if(el.pointerDown) {
		delay = delay ? delay : 10;
	}

	if(delay) {
		setTimeout(function() {
			animStep();
		}, delay);
	}
	else {
		animStep();
	}

	return;
}

UIElement.prototype.onPointerDownNormal = function(point) {
	if(!this.getParent()) {
		this.setLastEventStatus(UIElement.EVENT_STATUS_NONE);
	}

	var p = this.translatePoint(point);
	
	this.hitTestResult = this.hitTest(point);
	if(!this.hitTestResult) {
		return false;
	}

	this.pointerDown = true;
	this.pointerDownTime = Date.now();
	this.childrenRange = this.calcChildrenRange();

	if(this.mode === C_MODE_EDITING) {
		this.onPointerDownEditing(point, true);
	}
	else if(this.enable) {
		this.onPointerDownRunning(p, true);
	}

	this.setPointerEventTarget(null);
	if(this.hitTestResult === C_HIT_TEST_MM || !this.selected) {
		if(this.dispatchPointerDownToChildren(p)) {
			if(this.mode === C_MODE_EDITING) {
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

	if(this.hitTestResult === C_HIT_TEST_MM && this.children.length > 1 && this.canRectSelectable()) {
		this.hitTestResult = C_HIT_TEST_WORKAREA;
	}

	this.setTarget(null);
	this.setSelected(true);
	this.lastPosition.x = point.x;
	this.lastPosition.y = point.y;
	if(this.mode === C_MODE_EDITING) {
		this.handlePointerEvent(point, 1);
	}
	
	if(this.mode === C_MODE_EDITING) {
		this.onPointerDownEditing(point, false);
	}
	else if(this.enable) {
		this.onPointerDownRunning(p, false);
	}

	this.postRedraw();

	return true;
}

UIElement.prototype.onPointerMoveNormal = function(point) {
	var p = this.translatePoint(point);

	if(!this.getParent()) {
		this.setLastEventStatus(UIElement.EVENT_STATUS_NONE);
	}

	if(this.draggable && this.pointerDown) {
		if(this.mode !== C_MODE_EDITING) {
			this.handleDragMove(point);
			return;
		}
		else {
			delete this.dragging;
		}
	}

	if(this.hitTestResult) {
		if(this.mode === C_MODE_EDITING) {
			this.onPointerMoveEditing(point, true);
		}
		else if(this.enable) {
			this.onPointerMoveRunning(p, true);
		}

		var target = this.getPointerEventTarget();
		if(target) {
			target.onPointerMove(p);
			if(this.mode === C_MODE_EDITING) {
				this.onPointerMoveEditing(point, false);
			}
			else if(this.enable) {
				this.onPointerMoveRunning(p, false);
			}
		}
		else {
			if(this.mode === C_MODE_EDITING) {
				this.onPointerMoveEditing(point, false);
				if(this.hitTestResult === C_HIT_TEST_WORKAREA) {
					var p = {x:0, y:0};
					var range = this.childrenRange;
					var w = point.x - this.pointerDownPosition.x;
					var h = point.y - this.pointerDownPosition.y;
					var x = this.pointerDownPosition.x - this.x;
					var y = this.pointerDownPosition.y - this.y;
					var r = {x:x, y:y, w:w, h:h};

					if(((x > range.r) && w > 0) 
						|| ((y > range.b) && h > 0)
						|| ((x < range.l) && w < 0) 
						|| ((y < range.t) && h < 0)
						|| ((x > (this.w - 30)) && w > 0) 
						|| ((y > (this.h - 30)) && h > 0)
						|| ((x < 30) && w < 0) 
						|| ((y < 30) && h < 0)
						)
					{
						this.hitTestResult = C_HIT_TEST_MM;
						this.handlePointerEvent(point, 0);
					}
					else if(Math.abs(w) > 5 && Math.abs(h) > 5) {
						r = fixRect(r);
						this.setSelected(false);
						for(var i = this.children.length - 1; i >= 0; i--) {
							var iter = this.children[i];
							p.x = iter.x + iter.w/2;
							p.y = iter.y + iter.h/2;
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
		//PC Mouse Over
		var pointerOverShape = null;

		if(this.isPointIn(null, point)) {
			if(this.isUIFrames) {
				var iter = this.getCurrentFrame();
				if(iter.isPointIn(null, p)) {
					pointerOverShape = iter;
					iter.onPointerMoveNormal(p);
				}
			}
			else {
				for(var i = this.children.length; i > 0; i--) {
					var iter = this.children[i-1];

					if(iter.isPointIn(null, p)) {
						pointerOverShape = iter;
						iter.onPointerMoveNormal(p);
						break;
					}
				}
			}
		}
	
		this.setPointerOverShape(pointerOverShape);
	}
		
	this.lastPosition.x = point.x;
	this.lastPosition.y = point.y;

	return false;
}

UIElement.prototype.needDrawTextTips = function(point) {
	return this.mode === C_MODE_EDITING && !this.children.length;	
}

UIElement.prototype.textEditable = function(point) {
	return this.mode === C_MODE_EDITING;	
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

UIElement.prototype.onPointerUpNormal = function(point) {
	if(!this.getParent()) {
		this.setLastEventStatus(UIElement.EVENT_STATUS_NONE);
	}

	if(this.hitTestResult) {
		var p = this.translatePoint(point);
		var isClick = this.isClicked();
		
		if(this.mode === C_MODE_EDITING) {
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
			if(this.mode === C_MODE_EDITING) {
				this.handlePointerEvent(point, -1);
			}
		}

		if(this.mode === C_MODE_EDITING) {
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
		
		this.hitTestResult = C_HIT_TEST_NONE;

		if(this.longPressed) {
			delete this.longPressed;
		}

		return true;
	}
	else {
		this.targetShape = null;

		if(this.mode !== C_MODE_EDITING && this.enable) {
			this.onPointerUpRunning(p, false);
			if(isClick) {
				this.onClick(p, false);
			}
		}

		if(this.longPressed) {
			delete this.longPressed;
		}
	}

	return false;
}

UIElement.prototype.onKeyDownRunning = function(code) {
	if(!this.handleKeyDown || this.mode === C_MODE_PREVIEW) {
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

	if(this.mode === C_MODE_EDITING) {
		this.onKeyDownEditing(code);
	}
	else {
		this.onKeyDownRunning(code);
	}

	return;
}

UIElement.prototype.onKeyUpRunning = function(code) {
	if(!this.handleKeyUp || this.mode === C_MODE_PREVIEW) {
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

			if(this.mode === C_MODE_RUNNING) {
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

	if(this.mode === C_MODE_EDITING) {
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
}

UIElement.prototype.afterChildAppended = function(shape) {
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
			r.x = iter.getX();
			r.y = iter.getY();
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
		this.addShape(shape, false, null, index);
	}

	return shape;
}

UIElement.prototype.setAlwaysOnTop = function(value) {
	this.alwaysOnTop = value;

	return;
}

UIElement.prototype.addShape = function(shape, offsetIt, point, index) {
	if(!shape.isUIElement) {
		return false;
	}

	if(offsetIt) {
		shape.moveDelta(-this.x, -this.y);
	}

	if(this.beforeAddShapeIntoChildren(shape) && point) {
		var p = this.translatePoint(point);
		if(this.addShapeIntoChildren(shape, p)) {
			return true;
		}
		shape.move(p.x, p.y);	
	}

	if(!this.shapeCanBeChild(shape)) {
		return false;
	}

	if(offsetIt) {
		var oldConfig = {};
	
		if(shape.deviceConfig) {
			oldConfig = JSON.parse(shape.deviceConfig);
			shape.deviceConfig = null;
		}
		else {
			oldConfig.version = "5";
			oldConfig.platform = "iphone";
			oldConfig.lcdDensity = "xhdpi";
		}

		var sizeScale = 1;
		var win = this.getWindow();
		var config = dupDeviceConfig(this.getDeviceConfig());
		var lcdDensity = (win && win.lcddensity) ? win.lcddensity : config.lcdDensity;

		if(lcdDensity !== oldConfig.lcdDensity || oldConfig.platform !== config.platform) {
			if(lcdDensity != "all") {
				config.lcdDensity = lcdDensity;
			}

			sizeScale = this.getSizeScale(oldConfig.lcdDensity, config.lcdDensity);
			shape.notifyDeviceConfigChanged(oldConfig, config);

			if(lcdDensity !== oldConfig.lcdDensity) {
				var x = shape.x;
				var y = shape.y;
				shape.scaleForDensity(sizeScale, config.lcdDensity, true);
				shape.x = x;
				shape.y = y;
			}
		}
	}

	shape.setParent(this);
	shape.setView(this.view);
	shape.setApp(this.app);

	if(isNaN(index) || index < 0) {
		this.children.push(shape);
	}
	else {
		this.children.insert(index, shape);
	}

	if(shape.isUIElement) {
		shape.setMode(this.mode, true);
	}

	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];

		if(iter.alwaysOnTop) {
			this.children.remove(iter);
			this.children.push(iter);
			break;
		}
	}

	this.afterChildAppended(shape);
	shape.onAppendedInParent();
	
	if(shape.isCreatingElement()) {
		this.relayout();
	}

	return true;
}

UIElement.prototype.addShapeDirectly = function(shape) {
	if(!this.shapeCanBeChild(shape)) {
		return false;
	}

	this.disableRelayout = true;
	shape.disableRelayout = true;

	shape.setParent(this);
	shape.setView(this.view);
	shape.setApp(this.app);
	this.children.push(shape);
	if(shape.isUIElement) {
		shape.mode = this.mode;
	}
	this.afterChildAppended(shape);

	delete shape.disableRelayout;
	delete this.disableRelayout;

	return true;
}

UIElement.prototype.addChild = function(child, position) {
	return this.addShape(child, false, null, position);
}
	
UIElement.prototype.shapeCanBeRemove = function(shape) {
	return true;
}

UIElement.prototype.afterChildRemoved = function(shape) {
	return true;
}

UIElement.prototype.removeAll = function() {
	var n = this.children.length;
	for(var i = 0; i < n; i++) {
		var iter = this.children[0];
		this.removeShape(iter);
	}

	return;
}

UIElement.prototype.removeChild = function(child) {
	return this.removeShape(child);
}

UIElement.prototype.removeShape = function(shape) {
	if(!this.shapeCanBeRemove(shape)) {
		return false;
	}
	
	if(this.targetShape === shape) {
		this.targetShape = null;
	}

	this.children.remove(shape);
	
	shape.callOnRemoved();
	this.afterChildRemoved(shape);

	if(shape.getParent() === this) {
		shape.setParent(null);
		shape.setView(null);
		shape.setApp(null);
	}

	if(this.mode === C_MODE_EDITING) {
		this.relayout();
	}

	shape.onRemoved();

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

UIElement.prototype.setValueOf = function(name, value) {
	var child = this.findChildByName(name, true);
	
	return child ? child.setValue(value) : null;
}

UIElement.prototype.getValueOf = function(name) {
	var child = this.findChildByName(name, true);
	
	return child ? child.getValue() : null;
}

UIElement.prototype.getSelectMark = function(type, point) {
	if(this.mode != C_MODE_EDITING) {
		return false;
	}

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

UIElement.prototype.paintSelectingBox = function(canvas) {
	if(this.hitTestResult === C_HIT_TEST_WORKAREA) {
		var w = this.lastPosition.x - this.pointerDownPosition.x;
		var h = this.lastPosition.y - this.pointerDownPosition.y;
		
		if(Math.abs(w) > 10 && Math.abs(h) > 10) {
			var x = this.pointerDownPosition.x - this.x;
			var y = this.pointerDownPosition.y - this.y;
			canvas.rect(x, y, w, h);
			canvas.strokeStyle = "Gray";
			canvas.stroke();
		}
	}

	return true;
}

UIElement.prototype.beforePaintChild = function(child, canvas) {
	return;
}

UIElement.prototype.afterPaintChild = function(child, canvas) {
	return;
}

UIElement.prototype.paintTargetShape = function(canvas) {
	var targetShape = this.targetShape;
	if(targetShape && targetShape.selected && (targetShape.mode === C_MODE_EDITING || targetShape.dragging)) {
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
		if(shape.visible) {
			this.beforePaintChild(shape, canvas);
			shape.paintSelf(canvas);
			this.afterPaintChild(shape, canvas);
		}
	}
	
	this.paintTargetShape(canvas);

	canvas.restore();
	
	return;
}

UIElement.prototype.beforePaintChildren = function(canvas) {
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
	this.drawBgImage(canvas);
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
				if(this.isPointerOverShape() && this.getHtmlImageByType(CANTK_IMAGE_POINTER_OVER)) {
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
		return;
	}

//	image = image.getImage();

	return image;
}

UIElement.prototype.drawImageAt = function(canvas, image, display, x, y, dw, dh, srcRect) {
	if(!image) {
		return;
	}

	var imageWidth = srcRect ?  srcRect.w : image.width;
	var imageHeight = srcRect ? srcRect.h : image.height;

	if(imageWidth <= 0 || imageHeight <= 0) {
		return;
	}

	var sx = srcRect ? srcRect.x : 0;
	var sy = srcRect ? srcRect.y : 0;
	var dx = 0;
	var dy = 0;
	var w = imageWidth;
	var h = imageHeight;

//	if((display === CANTK_IMAGE_DISPLAY_CENTER) && (imageWidth > dw || imageHeight > dh)) {
//		display = CANTK_IMAGE_DISPLAY_AUTO;
//	}

	switch(display) {
		case CANTK_IMAGE_DISPLAY_CENTER: {
			dx = Math.floor(x + (dw - imageWidth)/2);
			dy = Math.floor(y + (dh - imageHeight)/2);

			canvas.drawImage(image, sx, sy, w, h, dx, dy, w, h);
			break;
		}
		case CANTK_IMAGE_DISPLAY_SCALE: {
			dx = x;
			dy = y;
			canvas.drawImage(image, sx, sy, imageWidth, imageHeight, dx, dy, dw, dh);
			break;
		}
		case CANTK_IMAGE_DISPLAY_TILE: {
			dx = x;
			dy = y;

			while(dy < this.h) {
				dx = x;
				h = Math.min(this.h-dy, imageHeight);
				while(dx < this.w) {
					w = Math.min(this.w-dx, imageWidth);
					canvas.drawImage(image, sx, sy, w, h, dx, dy, w, h);
					dx = dx + w;
					if(w === imageWidth) {
						dx = dx - 2;
					}
				}
				dy = dy + h;
				if(h === imageHeight) {
					dy = dy - 2;
				}
			}
			break;
		}
		case CANTK_IMAGE_DISPLAY_9PATCH: {
			dx = x;
			dy = y;
			if(imageWidth >= dw && imageHeight >= dh) {
				canvas.drawImage(image, sx, sy, imageWidth, imageHeight, dx, dy, dw, dh);
			}
			else {
				drawNinePatchEx(canvas, image, sx, sy, imageWidth, imageHeight, dx, dy, dw, dh);
			}
			break;
		}
		case CANTK_IMAGE_DISPLAY_AUTO: {
			var scale = Math.min(dw/imageWidth, dh/imageHeight);
			w = imageWidth * scale;
			h = imageHeight * scale;
			dx = Math.floor(x + (dw - w) * 0.5);
			dy = Math.floor(y + (dh - h) * 0.5);
			
			canvas.drawImage(image, sx, sy, imageWidth, imageHeight, dx, dy, w, h);
			break;
		}
		case CANTK_IMAGE_DISPLAY_SCALE_KEEP_RATIO: {
			var sw = imageWidth/dw;
			var sh = imageHeight/dh;

			if(sw < sh) {
				var s = dh/dw;
				w = imageWidth;
				h = w * s;
			}
			else {
				var s = dw/dh;
				h = imageHeight;
				w = h * s;
			}

			dx = x;
			dy = y;
			
			canvas.drawImage(image, sx, sy, w, h, dx, dy, dw, dh);
			break;
		}
		default: {
			dx = x;
			dy = y;
			w = Math.min(imageWidth, this.w);
			h = Math.min(imageHeight, this.h);
			canvas.drawImage(image, sx, sy, w, h, dx, dy, w, h);
			break;
		}
	}

	return;
}

UIElement.prototype.drawBgImage =function(canvas) {
	var image = this.getBgImage();
		
	if(image) {
		var srcRect = image.getImageRect();

		image = image.getImage();
		this.drawImageAt(canvas, image, this.images.display, 0, 0, this.w, this.h, srcRect);
	}

	return;
}

UIElement.prototype.beforeDrawIcon = function(canvas) {
	return false;
}

UIElement.prototype.afterDrawIcon = function(canvas) {
	return false;
}

UIElement.prototype.getLockImage = function() {
	if(!this.aLockImage) {
		this.aLockImage = new CanTkImage();
		this.aLockImage.setImageSrc("/drawapp8/images/lock.png");
	}

	if(this.aLockImage) {
		return this.aLockImage.getImage();
	}

	return null;
}

UIElement.prototype.prepareStyle = function(canvas) {
	var style = this.style;
	
	canvas.lineWidth = style.lineWidth;			
	canvas.strokeStyle = style.lineColor;
	if(style.enableGradient) {
		canvas.fillStyle = style.getGradFillStyle(canvas, 0, 0, this.w, this.h);
	}
	else {
		if(!this.isFillColorTransparent()) {
			canvas.fillStyle = style.fillColor;
		}
	}
	canvas.shadowOffsetX = 0;
	canvas.shadowOffsetY = 0;
	canvas.shadowBlur    = 0;

	return;
}

UIElement.prototype.resetStyle = function(canvas) {
	canvas.shadowOffsetX = 0;
	canvas.shadowOffsetY = 0;
	canvas.shadowBlur    = 0;
	canvas.fillStyle = "White";
	canvas.beginPath();

	return;
}

UIElement.prototype.callOnUpdateTransformHandler = function() {
	if(!this.handleOnUpdateTransform || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onOnUpdateTransform"];
		if(sourceCode) {
			sourceCode = "this.handleOnUpdateTransform = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnUpdateTransform) {
		try {
			this.handleOnUpdateTransform();
		}catch(e) {
			console.log("this.handleOnUpdateTransform:" + e.message);
		}
	}

	return;
}

UIElement.prototype.updateTransform = function() {
	this.callOnUpdateTransformHandler();

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
	this.savedTransform.rotation = this.rotation;
	this.savedTransform.offsetX = this.offsetX;
	this.savedTransform.offsetY = this.offsetY;

	return;
}

UIElement.prototype.restoreTransform = function() {
	if(this.savedTransform) {
		this.opacity = this.savedTransform.opacity;
		this.scale = this.savedTransform.scale;
		this.rotation = this.savedTransform.rotation;
		this.offsetX = this.savedTransform.offsetX;
		this.offsetY = this.savedTransform.offsetY;
	}

	return;
}

UIElement.prototype.setHighlightConfig = function(highlightConfig) {
	if(highlightConfig) {
		//this.restoreTransform();
		this.saveTransform();
		this.removeHighlightConfig = false;
		this.highlightConfig = highlightConfig;
	}
	else {
		this.removeHighlightConfig = true;
	}

	return;
}

UIElement.prototype.updateHighlightTransform = function() {
	if(this.highlightConfig) {
		var me = this;
		var c = this.highlightConfig;
		var random = c.random ? c.random : 0;	
		var t = (Date.now() + random)/1000;
		var frequency = c.frequency ? c.frequency : 4;
		var factor = Math.cos(frequency*t);

		if(this.removeHighlightConfig && Math.abs(factor) < 0.1) {
			this.removeHighlightConfig = false;
			this.highlightConfig = null;
			this.restoreTransform();

			return;
		}

		if(!isNaN(c.rotationFrom) && !isNaN(c.rotationTo)) {
			var delta = c.rotationTo - c.rotationFrom;
			var half = (c.rotationTo + c.rotationFrom)/2;

			this.rotation = half + 0.5 * delta * factor;
		}

		if(!isNaN(c.opacityFrom) && !isNaN(c.opacityTo)) {
			var delta = c.opacityTo - c.opacityFrom;
			var half = (c.opacityTo + c.opacityFrom)/2;

			this.opacity = half + 0.5 * delta * factor;
		}
		
		if(!isNaN(c.scaleFrom) && !isNaN(c.scaleTo)) {
			var delta = c.scaleTo - c.scaleFrom;
			var half = (c.scaleTo + c.scaleFrom)/2;

			this.scale = half + 0.5 * delta * factor;
		}
		
		if(!isNaN(c.offsetXFrom) && !isNaN(c.offsetXTo)) {
			var delta = c.offsetXTo - c.offsetXFrom;
			var half = (c.offsetXTo + c.offsetXFrom)/2;

			this.offsetX = half + 0.5 * delta * factor;
		}

		if(!isNaN(c.offsetYFrom) && !isNaN(c.offsetYTo)) {
			var delta = c.offsetYTo - c.offsetYFrom;
			var half = (c.offsetYTo + c.offsetYFrom)/2;

			this.offsetY = half + 0.5 * delta * factor;
		}

		UIElement.setAnimTimer(function() {me.postRedraw();});
	}

	return;
}

UIElement.prototype.paintSelf = function(canvas) {
	canvas.save();
	this.translate(canvas);
	if(this.isIcon) {
		this.beforeDrawIcon(canvas);
	}

	canvas.save();
	this.prepareStyle(canvas);
	this.updateTransform();
	this.updateHighlightTransform();
	this.applyTransform(canvas);

	this.paintSelfOnly(canvas);
	this.drawImage(canvas);

	if(this.drawText && this.textType !== C_SHAPE_TEXT_NONE) {
		this.drawText(canvas);
		this.drawTextTips(canvas);
	}

	if((this.hitTestResult !== C_HIT_TEST_NONE 
		&& this.hitTestResult !== C_HIT_TEST_WORKAREA
		&& this.hitTestResult !== C_HIT_TEST_MM) 
		|| this.state !== C_STAT_NORMAL) {
		this.drawSizeTips(canvas);
	}
		
	this.resetStyle(canvas);
	canvas.restore();

	canvas.save();
	this.beforePaintChildren(canvas);
	this.paintChildren(canvas);
	this.afterPaintChildren(canvas);
	canvas.restore();

	if(this.mode === C_MODE_EDITING) {
		this.paintSelectingBox(canvas);
		this.drawSelectMarks(canvas);
	}
	
	if(this.isIcon) {
		this.afterDrawIcon(canvas);
	}

	if(this.selected && this.mode === C_MODE_EDITING) {
		this.applyTransform(canvas);
		if(this.isPositionLocked) {
			var image = this.getLockImage();
			if(image) {
				canvas.drawImage(image, 0, 0);
			}
		}

		canvas.font = "16pt Sans";
		canvas.textBaseline = "bottom";
		canvas.textAlign = "left";
		canvas.fillStyle = "#202020";
		var y = 10;
		if((this.parentShape && this.parentShape.isUIWindow && this.y < 10) || this.h > 400) {
			y = 24;
		}

		var str = dappGetText(this.type);
		if(this.isUIScrollView) {
			str = str + "(offset=" +Math.floor(this.offset)+ ")";
		}
		canvas.fillText(str, 0, y);
	}
	canvas.restore();
	
	return;
}

UIElement.prototype.regSerializer = function(to, from) {
	this.toJsoners.push(to);
	this.fromJsoners.push(from);

	return;
}

UIElement.prototype.toJsonMore = function(o) {
	if(this.isUIDevice) {
		this.exitPreview();
	}

	for(var i = 0; i < this.toJsoners.length; i++) {
		var to = this.toJsoners[i];
		if(to) {
			to.call(this, o);
		}
	}

	var n = this.children.length;
	var children = this.children;
	if(n) {
		o.children = new Array();

		for(var i = 0; i < n; i++) {
			var shape = children[i];
			o.children.push(shape.toJson());
		}
	}

	return o;
}

UIElement.prototype.childrenFromJson = function(js) {
	if(js.children) {
		var n = js.children.length;

		this.children.clear();
		for(var i = 0; i < n; i++) {
			var jsShape = js.children[i];
			var type = jsShape.type ? jsShape.type : jsShape.id;
			var shape = ShapeFactoryGet().createShape(type, C_CREATE_FOR_USER);
			if(shape) {
				this.addShapeDirectly(shape);
				shape.fromJson(jsShape);
			}
		}
	}

	return;
}

UIElement.prototype.fromJsonMore = function(js) {
	for(var i = 0; i < this.fromJsoners.length; i++) {
		var from = this.fromJsoners[i];
		if(from) {
			from.call(this, js);
		}
	}

	this.childrenFromJson(js);

	this.targetShape = null;
	this.selected = false;

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

UIElement.prototype.findShapeByPoint = function(point, recursive) {
	var p = this.translatePoint(point);
	
	for(var i = this.children.length; i > 0; i--) {
		var child = this.children[i-1];
		if(child.visible && child.hitTest(p)) {
			return child.findShapeByPoint(p, recursive);
		}
	}

	return this;
}

UIElement.prototype.getChildren = function() {
	return this.children;
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
		var image = this.getImageByType(CANTK_IMAGE_DEFAULT);
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
		this.setImage(CANTK_IMAGE_DEFAULT, image);
	}
	if(value !== undefined) {
		this.setValue(value);
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

	if(this.offset) {
		this.offset = 0;
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

UIElement.prototype.bindData = function(data, animHint, clearOldData) {
	var shape = this;
	
	shape.disableRelayout = true;
	shape.doBindData(data, clearOldData);	
	delete shape.disableRelayout;
	shape.relayoutChildren(animHint);
	console.log("bindData: done");

	setTimeout(function() {
		shape.postRedraw();
	}, 500);

	return;
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

UIElement.prototype.bindDataUrl = function(dataUrl, preprocess, onBindDone) {
	var rInfo = {};
	var shape = this;

	rInfo.method = "GET";
	rInfo.url = dataUrl;
	rInfo.noCache = true;

	rInfo.onDone = function(result, xhr, respContent) {
		var success = (xhr.status === 200);
		if(xhr.status === 200) {
			var data = respContent;
			if(preprocess) {
				data = preprocess(respContent);
			}
			
			try {
				var js = JSON.parse(data);

				shape.bindData(js, "default", true);	

				console.log("bindDataUrl: done");
			}
			catch(e) {
				success = false;
				console.log("bindDataUrl: failed" + e.message);
			}
		}
		
		if(onBindDone) {
			onBindDone(success);
		}

		return;
	}

	httpDoRequest(rInfo);

	return;
}

///////////////////////////////////////////////////////////////////////////////////////

var CANTK_IMAGE_DISPLAY_CENTER = 0;
var CANTK_IMAGE_DISPLAY_TILE   = 1;
var CANTK_IMAGE_DISPLAY_9PATCH = 2;
var CANTK_IMAGE_DISPLAY_SCALE  = 3;
var CANTK_IMAGE_DISPLAY_AUTO = 4;
var CANTK_IMAGE_DISPLAY_DEFAULT = 5;
var CANTK_IMAGE_DISPLAY_SCALE_KEEP_RATIO  = 6;
var CANTK_IMAGE_DISPLAY_TILE_V = 7;
var CANTK_IMAGE_DISPLAY_TILE_H = 8;

var CANTK_IMAGE_DISPLAY_NAMES = ["incenter", "tile", "9patch", "scale", "auto", "default", "scale(keep ratio)", "vtile", "htile"];

var C_X_FIX_LEFT = 0;
var C_X_FIX_RIGHT = 1;
var C_X_SCALE = 2;
var C_X_CENTER_IN_PARENT = 3;
var C_X_LEFT_IN_PARENT	 = 4;
var C_X_RIGHT_IN_PARENT  = 5;
var C_X_AFTER_PREV       = 6;
var C_X_LAYOUT_NAMES = ["fix_left", "fix_right", "scale", "center_in_parent", "left_in_parent", "right_in_parent", "after_prev"];

var C_Y_FIX_TOP = 0;
var C_Y_FIX_BOTTOM = 1;
var C_Y_SCALE = 2;
var C_Y_MIDDLE_IN_PARENT = 3;
var C_Y_TOP_IN_PARENT	 = 4;
var C_Y_BOTTOM_IN_PARENT = 5;
var C_Y_AFTER_PREV       = 6;
var C_Y_LAYOUT_NAMES = ["fix_top", "fix_bottom", "scale", "middle_in_parent", "top_in_parent", "bottom_in_parent", "after_prev"];

var C_WIDTH_FIX = 0;
var C_WIDTH_SCALE = 1;
var C_WIDTH_FILL_PARENT = 2;
var C_WIDTH_FILL_AVAILABLE = 3;

var C_HEIGHT_FIX = 0;
var C_HEIGHT_SCALE = 1;
var C_HEIGHT_FILL_PARENT = 2;
var C_HEIGHT_FILL_AVAILABLE = 3;
var C_HEIGHT_KEEP_RATIO_WITH_WIDTH = 4;

var C_WIDTH_LAYOUT_NAMES = ["fix", "scale", "fill_parent", "fill_avaible"];
var C_HEIGHT_LAYOUT_NAMES = ["fix", "scale", "fill_parent", "fill_avaible", "keep_ratio_with_width"];

var CANTK_IMAGE_DEFAULT		   = "default_bg";
var CANTK_IMAGE_MASK		   = "mask_fg";
var CANTK_IMAGE_NORMAL	   = "normal_bg";
var CANTK_IMAGE_FOCUSED	   = "focused_bg";
var CANTK_IMAGE_ACTIVE	   = "active_bg";
var CANTK_IMAGE_POINTER_OVER = "pointer_over_bg";
var CANTK_IMAGE_DISABLE	   = "disable_bg";
var CANTK_IMAGE_DISABLE_FG    = "disable_fg";
var CANTK_IMAGE_NORMAL_FG    = "normal_fg";
var CANTK_IMAGE_ACTIVE_FG    = "active_fg";
var CANTK_IMAGE_ON_FG		   = "on_fg";
var CANTK_IMAGE_OFF_FG	   = "off_fg";
var CANTK_IMAGE_CHECKED_FG		= "checked_fg";
var CANTK_IMAGE_UNCHECK_FG	   = "uncheck_fg";
var CANTK_IMAGE_ON_FOCUSED	   = "focused_on_bg";
var CANTK_IMAGE_ON_ACTIVE		   = "active_on_bg";
var CANTK_IMAGE_OFF_FOCUSED	   = "focused_off_bg";
var CANTK_IMAGE_OFF_ACTIVE	   = "active_off_bg";
var CANTK_IMAGE_IMAGE		   = "image";
var CANTK_IMAGE_NORMAL_DRAG  = "normal_drag";
var CANTK_IMAGE_DELETE_ITEM  = "delete_item";

var CANTK_ITEM_BG_NORMAL  = "item_bg_normal";
var CANTK_ITEM_BG_ACTIVE  = "item_bg_active";
var CANTK_ITEM_BG_CURRENT_NORMAL = "item_bg_current_normal";
var CANTK_ITEM_BG_CURRENT_ACTIVE = "item_bg_current_active";

var C_TEXT_ALIGN_CENTER = 0;
var C_TEXT_ALIGN_LEFT	= 0;
var C_TEXT_ALIGN_RIGHT = 0;
var C_TEXT_ALIGN_NAMES = ["center", "left", "right"];

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
	return this.mode === C_MODE_EDITING;
}

UIElement.prototype.getValue = function() {
	return this.getText();
}

UIElement.prototype.setValue = function(value) {
	this.setText(value);

	return;
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
	return this.setImage(CANTK_IMAGE_DEFAULT, src);
}

UIElement.prototype.setImage = function(type, src) {
	type = type ? type : CANTK_IMAGE_DEFAULT;

	var me = this;
	var image = this.images[type];
	if(image) {
		image.setImageSrc(src);
	}
	else {
		image = new CanTkImage();

		image.setImageSrc(src, function(img) {
			if(src && src.indexOf("#") >= 0) {
				if(img) {
					me.setImage("real-image", img.src);
				}
				else {
					console.log("load failed src:" + src);
				}
			}

			me.postRedraw();
		});
	}

	this.images[type] = image;

	return;
}

UIElement.prototype.getHtmlImageByType = function(type) {
	var image = this.images[type];
	
	return image ? image.getImage() : null;
}

UIElement.prototype.getImageByType = function(type) {
	
	return this.images[type];
}

UIElement.prototype.getImageSrcByType = function(type) {
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
			this.events[eName] = null;
		}
	}

	return;
}

UIElement.prototype.removeEventNames = function(eventNames) {
	if(eventNames) {
		for(var i = 0; i < eventNames.length; i++) {
			var eName = eventNames[i];
			delete this.events[eName];
		}
	}

	return;
}

UIElement.prototype.getEventNames = function() {
	var eventNames = [];

	for(var key in this.events) {
		eventNames.push(key);
	}

	return eventNames;
}

UIElement.prototype.initUIElement= function(type) {
	this.initContainerShape(type);

	this.enable = true;
	this.visible = true;
	this.opacity = 1;
	this.vMargin = 0;
	this.hMargin = 0;
	this.xAttr		= C_X_FIX_LEFT;
	this.yAttr		= C_Y_FIX_TOP;
	this.widthAttr	= C_WIDTH_FIX;
	this.heightAttr = C_HEIGHT_FIX;
	this.name = type;
	this.events = {};

	this.images  = {};
	this.images.display = CANTK_IMAGE_DISPLAY_9PATCH;

	this.addEventNames(["onClick"]);
	this.regSerializer(this.elementToJson, this.elementFromJson);

	return this;
}

UIElement.prototype.updateLayoutParams = function() {
	this.xParam = 1;
	this.yParam = 1;
	this.widthParam = 1;
	this.heightParam = 1;

	var p = this.parentShape;
	if(!p) {
		return;
	}

	var wParent = p.getWidth(true);
	var hParent = p.getHeight(true);
	
	if(this.xAttr === C_X_SCALE) {
		this.xParam = this.x/wParent;
	}
	else if(this.xAttr === C_X_FIX_RIGHT) {
		this.xParam = wParent - (this.x + this.w);
	}
	
	if(this.yAttr === C_Y_SCALE) {
		this.yParam = this.y/hParent;
	}
	else if(this.yAttr === C_Y_FIX_BOTTOM) {
		this.yParam = hParent - (this.y + this.h);
	}

	if(this.widthAttr === C_WIDTH_SCALE) {
		this.widthParam = this.w/wParent;
	}

	if(this.heightAttr === C_HEIGHT_SCALE) {
		this.heightParam = this.h/hParent;
	}

	if(this.heightAttr === C_HEIGHT_KEEP_RATIO_WITH_WIDTH) {
		this.heightParam = this.h/this.w;
	}

	return;
}

UIElement.prototype.elementToJson = function(o) {
	this.updateLayoutParams();

	o.events = this.events;
	o.images = {};

	if(this.value != undefined) {
		o.value = this.value;
	}

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
			}
		}
	}

	return o;
}

UIElement.prototype.elementFromJson = function(js) {
	if(js.events) {
		for(var key in js.events) {
			var value = js.events[key];
			this.events[key] = value;
		}
	}

	for(var key in this.images) {
		var value = this.images[key];
		if(key !== "display") {
			this.setImage(key, null);
		}
	}

	if(js.images) {
		for(var key in js.images) {
			var value = js.images[key];
			if(key === "display") {
				this.images[key] = value;
			}
			else {
				this.setImage(key, value);
			}
		}
	}

	if(js.enable != undefined) {
		this.setEnable(js.enable);
	}

	if(js.opacity != undefined) {
		this.setOpacity(js.opacity);
	}

	return this;
}

UIElement.prototype.setEnable = function(enable) {
	this.enable = enable;

	return;
}

UIElement.prototype.setOpacity = function(opacity) {
	this.opacity = Math.max(0, opacity);
	this.opacity = Math.min(1, this.opacity);

	return;
}

UIElement.prototype.setVisible = function(visible) {
	this.visible = visible;

	return;
}

UIElement.prototype.isFocused = function() {
	return this.parentShape && this.parentShape.targetShape == this;
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

UIElement.prototype.hide = function() {
	this.visible = false;

	return;
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
	this.setVisible(true);

	return;
}

UIElement.prototype.hide = function() {
	this.setVisible(false);

	return;
}

UIElement.prototype.showEventDialog = function() {
	showUIPropertyDialog(this, this.textType, null, 3);

	return;
}

UIElement.prototype.showProperty = function() {
	showUIPropertyDialog(this, this.textType);

	return;
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

	return;
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
	return this.getWidth(true);
}

UIElement.prototype.getRelayoutHeight = function() {
	return this.getHeight(true);
}

UIElement.prototype.relayout = function() {
	if(this.disableRelayout) {
		return;
	}

	var p = getParentShapeOfShape(this);
	if(!p || !p.isUIElement) {
		if(this.mode === C_MODE_EDITING) {
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
	var wParent = p.getRelayoutWidth();
	var hParent = p.getRelayoutHeight();
	var hMargin = p.getHMargin();
	var vMargin = p.getVMargin();

	var bottom = this.y + this.h;
	var right = this.x + this.w

	this.beforeRelayout();

	switch(this.widthAttr) {
		case C_WIDTH_SCALE: {
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
		case C_WIDTH_FILL_PARENT: {
			w = wParent;
			break;
		}
		case C_WIDTH_FILL_AVAILABLE: {
			break;
		}
		default: {
			w = this.w;
			break;
		}
	}

	switch(this.heightAttr) {
		case C_HEIGHT_SCALE: {
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
		case C_HEIGHT_FILL_PARENT: {
			h = hParent;
			break;
		}
		case C_HEIGHT_FILL_AVAILABLE: {
			break;
		}
		default: {
			h = this.h;
			break;
		}
	}

	switch(this.xAttr) {
		case C_X_SCALE: {
			x = wParent * this.xParam;
			break;
		}
		case C_X_FIX_RIGHT: {
			x = wParent - this.xParam - this.w;
			break;
		}
		case C_X_CENTER_IN_PARENT: {
			x = (wParent - w)/2 + hMargin;
			break;
		}
		case C_X_LEFT_IN_PARENT: {
			x = hMargin;
			break;
		}
		case C_X_RIGHT_IN_PARENT: {
			x = wParent - w + hMargin;
			break;
		}
		case C_X_AFTER_PREV: {
			var prev = this.getPrevSibling();
			x = prev ? (prev.x + prev.w) : 0;
			break;
		}
		default: {
			x = this.x;
			break;
		}
	}
		
	switch(this.yAttr) {
		case C_Y_SCALE: {
			y = hParent * this.yParam;
			break;
		}
		case C_Y_FIX_BOTTOM: {
			y = hParent - this.yParam - this.h;
			break;
		}
		case C_Y_MIDDLE_IN_PARENT: {
			y = (hParent - h)/2 + vMargin;
			break;
		}
		case C_Y_TOP_IN_PARENT: {
			y = vMargin;
			break;
		}
		case C_Y_BOTTOM_IN_PARENT: {
			y = hParent - h + vMargin;
			break;
		}
		case C_Y_AFTER_PREV: {
			var prev = this.getPrevSibling();
			y = prev ? (prev.y + prev.h) : 0;
			break;
		}
		default: {
			y = this.y;
			break;
		}
	}
	
	if(this.widthAttr === C_WIDTH_FILL_AVAILABLE || this.heightAttr === C_HEIGHT_FILL_AVAILABLE) {
		var vNext = null;
		var hNext = null;

		this.x = x;
		this.y = y;

		for(var i = 0; i < p.children.length; i++) {
			var iter = p.children[i];
			if(iter.isUIMenu) {
				continue;
			}
			
			if(iter.y > (this.y + 30) && this.x < (iter.x + iter.w) && iter.x < right) {
				if(!vNext || iter.y < vNext.y) {
					vNext = iter;
				}
			}

			if(iter.x > (this.x + 30) && this.y < (iter.y + iter.h) && iter.y < bottom) {
				if(!hNext || iter.x < hNext.x) {
					hNext = iter;
				}
			}
		}

		if(this.widthAttr === C_WIDTH_FILL_AVAILABLE) {
			if(hNext) {
				w = hNext.x - x;
			}
			else {
				w = wParent - x + p.hMargin;
			}

			if(w <= 0) {
				w = this.w;
			}
		}

			
		if(this.heightAttr === C_HEIGHT_FILL_AVAILABLE) {
			if(vNext) {
				h = vNext.y - y;
			}
			else {
				h = hParent - y + p.vMargin;
			}
			if(h <= 0) {
				h = this.h;
			}
		}
	}
	
	if(this.heightAttr === C_HEIGHT_KEEP_RATIO_WITH_WIDTH) {
		h = w * this.heightParam;	
	}

	var oldW = this.w;

	this.x = Math.round(x);
	this.y = Math.round(y);
	this.w	= Math.round(w);
	this.h	= Math.round(h);

	if(p.isUIElement) {
		p.fixChildSize(this);
		p.fixChildPosition(this);
	}
	this.autoScaleFontSize(w/oldW);
	this.relayoutChildren();
	this.afterRelayout();
	this.setTextNeedRelayout(true);

	return;
}

UIElement.prototype.getCustomProp = function() {
	return "";
}

UIElement.prototype.loadCustomProp = function(form) {

	return;
}

UIElement.prototype.onMoved = function() {
	if(!this.parentShape || this.mode != C_MODE_EDITING) {
		return;
	}

	if(this.fixedX != null && !isNaN(this.fixedX)) {
		this.x = this.fixedX;
	}
	
	if(this.fixedY != null && !isNaN(this.fixedY)) {
		this.y = this.fixedY;
	}
	
	this.updateLayoutParams();

	return;
}

UIElement.prototype.setFixPosition = function(x, y) {
	this.fixedX = x;
	this.fixedY = y;

	return;
}

UIElement.prototype.beforeRelayoutChild = function(shape) {
	return true;
}

UIElement.prototype.afterRelayoutChild = function(shape) {
	return true;
}


UIElement.prototype.relayoutChildren = function() {
	if(this.disableRelayout) {
		return;
	}

	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		if(child.widthAttr === C_WIDTH_FILL_AVAILABLE || child.heightAttr === C_HEIGHT_FILL_AVAILABLE) {
			continue;
		}

		if(this.beforeRelayoutChild(child)) {
			child.relayout();
		}
		this.afterRelayoutChild(child);
	}
	
	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		if(!(child.widthAttr === C_WIDTH_FILL_AVAILABLE || child.heightAttr === C_HEIGHT_FILL_AVAILABLE)) {
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
	var iter = this;

	while(iter != null && !iter.isUIWindowManager) {
		iter = iter.parentShape;
	}

	return iter;
}

UIElement.EVENT_STATUS_NONE = 0;
UIElement.EVENT_STATUS_HANDLED = 1;
UIElement.lastEventStatus = UIElement.EVENT_STATUS_NONE;

UIElement.prototype.setLastEventStatus = function(status) {
	UIElement.lastEventStatus = status;

	return;
}

UIElement.prototype.getLastEventStatus = function() {
	return UIElement.lastEventStatus;
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

UIElement.prototype.isTopWindow = function() {
	var win = this.getWindow();
	var windowManager = this.getWindowManager();
	var curWin = windowManager.getCurrentFrame();

	if(win === curWin || win === curWin.popupWindow) {
		return true;
	}

	return false;
}

UIElement.prototype.getWindow = function() {
	var iter = this;

	while(iter != null && !iter.isUIWindow) {
		iter = iter.parentShape;
	}

	return iter;
}

UIElement.prototype.getPositionInWindow = function() {
	var iter = this;
	var x = iter.x;
	var y = iter.y;

	while(iter != null && !iter.isUIWindow) {
		iter = iter.parentShape;
		if(iter.isUIWindow) {
			break;
		}

		x = x + iter.x;
		y = y + iter.y;
	}

	return {x:x, y:y};
}

UIElement.prototype.getWindowNames = function() {
	var manager = this.getWindowManager();
	if(manager) {
		return manager.getWindowNames();
	}

	return [];
}

UIElement.prototype.openWindow = function(name, onClose, closeCurrent, initData) {
	var manager = this.getWindowManager();
	if(manager) {
		return manager.openWindow(name, onClose, closeCurrent, initData);
	}

	return false;
}

UIElement.prototype.backToHomeWin = function() {
	var manager = this.getWindowManager();
	if(manager) {
		manager.backToHomeWin();
	}

	return;
}

UIElement.prototype.closeWindow = function(retInfo) {
	var win = this.getWindow();
	var manager = this.getWindowManager();

	if(manager && win) {
		if(manager.isWindowOpen(win)) {
			return manager.closeCurrentWindow(retInfo);
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

UIElement.prototype.makeItComponent = function() {
	showMakeItComponentDialog(this);

	return;
}

UIElement.prototype.showBindingDataDialog = function() {
	showBindingDataDialog(this);

	return;
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

	if(this.widthAttr === C_WIDTH_FIX || this.widthAttr === C_WIDTH_SCALE) {
		this.w = Math.floor(this.w * sizeScale);
	}

	if(this.heightAttr === C_HEIGHT_FIX || this.heightAttr === C_HEIGHT_SCALE) {
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
	if(this.yAttr === C_Y_SCALE || this.yAttr === C_Y_FIX_TOP) {
		if(!isCreating) {
			this.y = Math.floor(this.y * sizeScale);
		}
	}

	if(this.xAttr === C_X_SCALE || this.xAttr === C_X_FIX_LEFT) {
		if(!isCreating) {
			this.x = Math.floor(this.x * sizeScale);
		}
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
	
	this.x = Math.floor(this.x);
	this.y = Math.floor(this.y);
	this.w = Math.floor(this.w);
	this.h = Math.floor(this.h);

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
			src = src.replaceAll("/" + oldVersion + "/", "/" + newVersion + "/");
			src = src.replaceAll("/" + oldPlatform + "/", "/" + newPlatform + "/");
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

UIElement.prototype.callOnScrollDone = function() {
	if(!this.enable) {
		return false;
	}

	if(!this.handleOnScrollDone || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onScrollDone"];
		if(sourceCode) {
			sourceCode = "this.handleOnScrollDone = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnScrollDone) {
		try {
			this.handleOnScrollDone();
		}catch(e) {
			console.log("this.handleOnScrollDone:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnRemoved = function() {
	if(!this.enable) {
		return false;
	}

	if(!this.handleOnRemoved || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onRemoved"];
		if(sourceCode) {
			sourceCode = "this.handleOnRemoved = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnRemoved) {
		try {
			this.handleOnRemoved();
		}catch(e) {
			console.log("this.handleOnRemoved:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnChildDragging = function(sourceChildIndex, targetChildIndex) {
	if(!this.enable) {
		return false;
	}

	if(!this.handleOnChildDragging || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onChildDragging"];
		if(sourceCode) {
			sourceCode = "this.handleOnChildDragging = function(sourceChildIndex, targetChildIndex) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnChildDragging) {
		try {
			this.handleOnChildDragging(sourceChildIndex, targetChildIndex);
		}catch(e) {
			console.log("this.handleOnChildDragging:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnChildDragged = function(sourceChildIndex, targetChildIndex) {
	if(!this.enable) {
		return false;
	}

	if(!this.handleOnChildDragged || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onChildDragged"];
		if(sourceCode) {
			sourceCode = "this.handleOnChildDragged = function(sourceChildIndex, targetChildIndex) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnChildDragged) {
		try {
			this.handleOnChildDragged(sourceChildIndex, targetChildIndex);
		}catch(e) {
			console.log("this.handleOnChildDragged:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnChanging = function(value) {
	if(!this.enable) {
		return false;
	}

	if(!this.handleOnChanging || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onChanging"];
		if(sourceCode) {
			sourceCode = "this.handleOnChanging = function(value) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnChanging) {
		try {
			this.handleOnChanging(value);
		}catch(e) {
			console.log("this.handleOnChanging:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnChanged = function(value) {
	if(!this.enable) {
		return false;
	}

	if(this.onChanged) {
		this.onChanged(value);

		return;
	}

	if(!this.handleOnChanged || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onChanged"];
		if(sourceCode) {
			sourceCode = "this.handleOnChanged = function(value) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnChanged) {
		try {
			this.handleOnChanged(value);
		}catch(e) {
			console.log("this.handleOnChanged:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnInit = function() {
	if(!this.handleOnInit || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onInit"];
		if(sourceCode) {
			sourceCode = "this.handleOnInit = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnInit) {
		try {
			this.handleOnInit();
		}catch(e) {
			console.log("this.handleOnInit:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnChanging = function(value) {
	if(!this.enable) {
		return false;
	}

	if(!this.handleOnChanging || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onChanging"];
		if(sourceCode) {
			sourceCode = "this.handleOnChanging = function(value) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnChanging) {
		try {
			this.handleOnChanging(value);
		}catch(e) {
			console.log("this.handleOnChanging:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnFocusIn = function() {
	if(this.onFocusIn) {
		try {
			this.onFocusIn();
		}
		catch(e) {
			console.log("onFocusIn:" + e.message);
		}
	}

	if(!this.handleOnFocusIn || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onFocusIn"];
		if(sourceCode) {
			sourceCode = "this.handleOnFocusIn = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnFocusIn) {
		try {
			this.handleOnFocusIn();
		}catch(e) {
			console.log("this.handleOnFocusIn:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnFocusOut = function() {
	if(this.onFocusOut) {
		try {
			this.onFocusOut();
		}
		catch(e) {
			console.log("onFocusOut: " + e.message);
		}
	}

	if(!this.handleOnFocusOut || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onFocusOut"];
		if(sourceCode) {
			sourceCode = "this.handleOnFocusOut = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnFocusOut) {
		try {
			this.handleOnFocusOut();
		}catch(e) {
			console.log("this.handleOnFocusOut:" + e.message);
		}
	}

	return true;
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

UIElement.prototype.animShow = function(animHint, onAnimDone) {
	if(!this.visible) {
		animateUIElement(this, animHint, onAnimDone);
	}

	return;
}

UIElement.prototype.animHide = function(animHint, onAnimDone) {
	if(this.isVisible()) {
		animateUIElement(this, animHint, onAnimDone);
	}
	else {
		this.setVisible(false);
	}

	return;
}

UIElement.prototype.atLeft = function() {
	this.exec(new PositionSizeAttrCommand(this, C_X_LEFT_IN_PARENT, null, null, null));

	return;
}

UIElement.prototype.atRight = function() {
	this.exec(new PositionSizeAttrCommand(this, C_X_RIGHT_IN_PARENT, null, null, null));

	return;
}

UIElement.prototype.atTop = function() {
	this.exec(new PositionSizeAttrCommand(this, null, C_Y_TOP_IN_PARENT, null, null));
	
	return;
}

UIElement.prototype.atBottom = function() {
	this.exec(new PositionSizeAttrCommand(this, null, C_Y_BOTTOM_IN_PARENT, null, null));
	
	return;
}

UIElement.prototype.atCenter = function() {
	this.exec(new PositionSizeAttrCommand(this, C_X_CENTER_IN_PARENT, null, null, null));
	
	return;
}

UIElement.prototype.atMiddle = function() {
	this.exec(new PositionSizeAttrCommand(this, null, C_Y_MIDDLE_IN_PARENT, null, null));
	
	return;
}


UIElement.prototype.saveState = function() {
	this.savedState = {};
	this.savedState.json = this.toJson();
	
	return;
}

UIElement.prototype.restoreState = function() {
	if(this.savedState && this.savedState.json) {
		this.fromJson(this.savedState.json);
		delete this.savedState.json;
	}

	return;
}

UIElement.prototype.isUserMovable = function() {
	if(this.widthAttr == C_WIDTH_FILL_PARENT 
			&& (this.yAttr === C_Y_TOP_IN_PARENT || this.yAttr === C_Y_MIDDLE_IN_PARENT || this.yAttr === C_Y_BOTTOM_IN_PARENT)) {
		return false;
	}
	
	if(this.heightAttr === C_HEIGHT_FILL_PARENT 
			&& (this.xAttr === C_X_LEFT_IN_PARENT || this.x === C_X_CENTER_IN_PARENT || this.xAttr === C_X_RIGHT_IN_PARENT)) {
		return false;
	}
	
	if(this.widthAttr === C_WIDTH_FILL_PARENT && this.heightAttr === C_HEIGHT_FILL_PARENT) {
		return false;
	}

	return this.userMovable;
}

UIElement.prototype.isUserResizable = function() {
	if(this.widthAttr === C_WIDTH_FILL_PARENT && this.heightAttr === C_HEIGHT_FILL_PARENT) {
		return false;
	}

	return this.userResizable;
}

UIElement.prototype.getEditorRect = function() {
	var rect = {};
	rect.x = this.x;
	rect.y = this.y;
	rect.w = this.w;
	rect.h = this.h;

	return rect;
}

UIElement.prototype.loadSoundEffect = function(name, url) {
	getEffectsPlayer().load(name, url);

	return;
}

UIElement.prototype.playSoundEffect = function(name) {
	getEffectsPlayer().play(name);

	return;
}

//////////////////////////////////////////////////////////////////////
function UIGroup() {
	return;
}

UIGroup.prototype = new UIElement();
UIGroup.prototype.isUIGroup = true;

UIGroup.prototype.initUIGroup = function(type, w, h, img) {
	this.initUIElement(type);	

	this.roundRadius = 5;
	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.setImage(CANTK_IMAGE_DEFAULT, img);
	this.images.display = CANTK_IMAGE_DISPLAY_9PATCH;
	this.setCanRectSelectable(false, false);
	this.addEventNames(["onInit"]);

	return this;
}

UIGroup.prototype.getCustomProp = function() {
	var content = ' \
		<label class="description" for="border">' + dappGetText("Border") + ':</label>\
		<input id="border"  class="element text small" type="number" maxlength="2" value="0"/> \
		<label class="description" for="linewidth1">' + dappGetText("Line Width") + ':</label>\
		<input id="linewidth1"  class="element text small" type="number" maxlength="2" value="0"/> \
		<label class="description" for="roundradius">' + dappGetText("Round Radius") + ':</label>\
		<input id="roundradius"  class="element text small" type="number" maxlength="2" value="0"/>'

	return content;
}

UIGroup.prototype.loadCustomProp = function(form) {
	var group = this;

	form.roundradius.value = this.roundRadius;
	form.roundradius.onchange = function(e) {
		group.setRoundRadius(parseInt(this.value));

		return;
	}
	
	form.border.value = this.getHMargin();
	form.border.onchange = function(e) {
		var border = parseInt(this.value);
		group.setMargin(border, border);

		return;
	}
	
	form.linewidth1.value = this.style.lineWidth;
	form.linewidth1.onchange = function(e) {
		var linewidth = parseInt(this.value);
		group.style.setLineWidth(linewidth);

		return;
	}
	
	return;
}

UIGroup.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUIDevice || shape.isUIScreen || shape.isUIStatusBar 
		|| shape.isUIWindow || shape.isUIPageManager || shape.isUIPage) {
		return false;
	}

	return true;
}

UIGroup.prototype.onPointerUpEditing = function(point, beforeChild) {
	if(!beforeChild) {
		this.relayoutChildren();
	}

	return;
}

UIGroup.prototype.paintSelfOnly =function(canvas) {
	var image = this.getHtmlImageByType(CANTK_IMAGE_DEFAULT);

	if(!image) {
		canvas.beginPath();
		canvas.lineWidth = this.style.lineWidth;

		canvas.fillStyle = this.style.fillColor;
		canvas.strokeStyle = this.style.lineColor;
		drawRoundRect(canvas, this.w, this.h, this.roundRadius);
		
		if(!this.isFillColorTransparent()) {
			canvas.fillStyle = this.style.fillColor;
			canvas.fill();
		}

		if(!this.isStrokeColorTransparent()) {
			canvas.stroke();	
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

function createUIGroupShape() {
	var g = new UIGroup();
	
	g.initUIGroup("ui-group", 200, 200, null);
	g.state = C_STAT_NORMAL;

	return g;
}

UIElement.funcs = [];
UIElement.setAnimTimer = function(func) {
	if(typeof func != "function") {
		return;
	}

	UIElement.funcs.push(func);
	if(!UIElement.animTimerID) {

		UIElement.animTimerID = setTimeout(function() {
			var funcs = UIElement.funcs;

			UIElement.funcs = [];
			UIElement.animTimerID = 0;

			for(var i = 0; i < funcs.length; i++) {
				var iter = funcs[i];
				iter();
			}

		}, 16);
	}

	return;
}

UIElement.getMainCanvasScale = function() {
	if(!UIElement.canvasScale) {
		var xScale = 1;
		var yScale = 1;
		UIElement.canvasScale = {};
		var mainCanvas = document.getElementById("main_canvas");
		
		if(mainCanvas.style.width && mainCanvas.style.height) {
			xScale = mainCanvas.width/parseFloat(mainCanvas.style.width);
			yScale = mainCanvas.height/parseFloat(mainCanvas.style.height);
		}

		UIElement.canvasScale.x = xScale;
		UIElement.canvasScale.y = yScale;
	}

	return UIElement.canvasScale;
}
