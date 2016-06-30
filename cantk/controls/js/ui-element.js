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


