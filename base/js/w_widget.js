/*
 * File: widget.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: widget is base class of all ui element.
 * 
 * Copyright (c) 2011 - 2015	Li XianJing <xianjimli@hotmail.com>
 * 
 */
 
function WWidget() {
}

WWidget.STATE_NORMAL	  = "state-normal";
WWidget.STATE_ACTIVE	  = "state-active";
WWidget.STATE_OVER		  = "state-over";
WWidget.STATE_DISABLE = "state-disable";
WWidget.STATE_SELECTED    = "state-selected";
WWidget.STATE_NORMAL_CURRENT  = "state-normal-current";

WWidget.TYPE_NONE = 0;
WWidget.TYPE_USER = 13;
WWidget.TYPE_FRAME = "frame";
WWidget.TYPE_FRAMES = "frames";
WWidget.TYPE_TOOLBAR = "toolbar";
WWidget.TYPE_TITLEBAR= "titlebar";
WWidget.TYPE_MINIMIZE_BUTTON = "button.minimize";
WWidget.TYPE_FLOAT_MENU_BAR = "float-menubar";

WWidget.TYPE_POPUP = "popup";
WWidget.TYPE_DIALOG = "dialog";
WWidget.TYPE_WINDOW = "window";
WWidget.TYPE_VBOX = "vbox";
WWidget.TYPE_HBOX = "hbox";
WWidget.TYPE_MENU = "menu";
WWidget.TYPE_MENU_BAR = "menu-bar";
WWidget.TYPE_MENU_BUTTON = "menubar.button";
WWidget.TYPE_GRID_ITEM = "grid-item";
WWidget.TYPE_MENU_ITEM = "menu.item";
WWidget.TYPE_MENU_BAR_ITEM = "menubar.item";
WWidget.TYPE_CONTEXT_MENU_ITEM = "contextmenu.item";
WWidget.TYPE_CONTEXT_MENU_BAR = "contextmenu-bar";
WWidget.TYPE_VSCROLL_BAR = "vscroll-bar";
WWidget.TYPE_HSCROLL_BAR = "hscroll-bar";
WWidget.TYPE_SCROLL_VIEW = "scroll-view";
WWidget.TYPE_GRID_VIEW = "grid-view";
WWidget.TYPE_LIST_VIEW = "list-view";
WWidget.TYPE_LIST_ITEM = "list-item";
WWidget.TYPE_IMAGE_VIEW = "image-view";
WWidget.TYPE_TREE_VIEW = "tree-view";
WWidget.TYPE_TREE_ITEM = "tree-item";
WWidget.TYPE_ACCORDION = "accordion";
WWidget.TYPE_ACCORDION_ITEM = "accordion-item";
WWidget.TYPE_PROPERTY_TITLE = "property-title";
WWidget.TYPE_PROPERTY_SHEET = "property-sheet";
WWidget.TYPE_PROPERTY_SHEETS = "property-sheets";
WWidget.TYPE_VIEW_BASE = "view-base";
WWidget.TYPE_COMPONENT_MENU_ITEM = "menuitem.component";
WWidget.TYPE_WINDOW_MENU_ITEM = "menuitem.window";
WWidget.TYPE_MESSAGE_BOX = "messagebox";
WWidget.TYPE_ICON_TEXT = "icon-text";
WWidget.TYPE_BUTTON = "button";
WWidget.TYPE_LABEL = "label";
WWidget.TYPE_LINK = "link";
WWidget.TYPE_EDIT = "edit";
WWidget.TYPE_TEXT_AREA = "text-area";
WWidget.TYPE_COMBOBOX = "combobox";
WWidget.TYPE_SLIDER = "slider";
WWidget.TYPE_PROGRESSBAR = "progressbar";
WWidget.TYPE_RADIO_BUTTON = "radio-button";
WWidget.TYPE_CHECK_BUTTON = "check-button";
WWidget.TYPE_COLOR_BUTTON = "color-button";
WWidget.TYPE_COLOR_TILE = "color-tile";
WWidget.TYPE_TAB_BUTTON = "tab-button";
WWidget.TYPE_TAB_CONTROL = "tab-control";
WWidget.TYPE_TAB_BUTTON_GROUP = "tab-button-group";
WWidget.TYPE_TIPS = "tips";
WWidget.TYPE_HLAYOUT = "h-layout";
WWidget.TYPE_VLAYOUT = "v-layout";
WWidget.TYPE_BUTTON_GROUP = "button-group";
WWidget.TYPE_COMBOBOX_POUP = "combobox-popup";
WWidget.TYPE_COMBOBOX_POUP_ITEM = "combobox-popup-item";
WWidget.TYPE_COLOR_EDIT = "color-edit";
WWidget.TYPE_RANGE_EDIT = "range-edit";
WWidget.TYPE_FILENAME_EDIT = "filename-edit";
WWidget.TYPE_FILENAMES_EDIT = "filenames-edit";

WWidget.prototype = {};
WWidget.prototype.init = function(parent, x, y, w, h) {
	this.text = "";
	this.tips = null;
	this.enable = true;
	this.visible = true; 
	this.parent = parent;
	this.checkEnable = null;

	this.children = [];
	this.point = {x:0, y:0};
	this.rect  = {x:x, y:y, w:w, h:h};
	this.setState(WWidget.STATE_NORMAL);

	if(this.parent !== null) {
		if(x > 0 && x < 1) {
			this.rect.x = parent.rect.w * x;
		}
		if(w > 0 && w < 1) {
			this.rect.w = parent.rect.w * w;
		}
		if(y > 0 && y < 1) {
			this.rect.y = parent.rect.h * y;
		}
		if(h > 0 && h < 1) {
			this.rect.h = parent.rect.h * h;
		}
		
		parent.appendChild(this);
	}

	return this;
}

WWidget.prototype.useTheme = function(type) {
	this.themeType = type;

	return this;
}

WWidget.prototype.setSelectable = function(selectable) {
	this.selectable = selectable;

	return true;
}

WWidget.prototype.setNeedRelayout = function(value) {
	this.needRelayout = value;

	return;
}

WWidget.prototype.onAppendChild = function(child) {
}

WWidget.prototype.appendChild = function(child) {
	child.parent = this;
	this.children.push(child);
	this.onAppendChild(child);
	this.needRelayout = true;

	return;
}

WWidget.prototype.getWindowManager = function() {
	return WWindowManager.getInstance();
}

WWidget.prototype.getFrameRate = function() {
	return WWindowManager.getInstance().getFrameRate();
}

WWidget.prototype.showFPS = function(maxFpsMode) {
	return WWindowManager.getInstance().showFPS(maxFpsMode);
}

WWidget.prototype.isPointerDown = function() {
	return WWindowManager.getInstance().isPointerDown();
}

WWidget.prototype.isClicked = function() {
	return WWindowManager.getInstance().isClicked();
}

WWidget.prototype.isAltDown = function() {
	return WWindowManager.getInstance().isAltDown();
}

WWidget.prototype.isCtrlDown = function() {
	return WWindowManager.getInstance().isCtrlDown();
}

WWidget.prototype.getApp = function() {
	return WWindowManager.getInstance().getApp();
}

WWidget.prototype.getCanvas2D = function() {
	return WWindowManager.getInstance().getCanvas2D();
}

WWidget.prototype.getCanvas = function() {
	return WWindowManager.getInstance().getCanvas();
}

WWidget.prototype.getLastPointerPoint = function() {
	return WWindowManager.getInstance().getLastPointerPoint();
}

WWidget.prototype.getTopWindow = function() {
	 return this.getWindow();
}

WWidget.prototype.getWindow = function() {
	 if(this.parent) {
		  return this.parent.getWindow();
	 }
	 
	 return this;
}

WWidget.prototype.getParent = function() {
	return this.parent;
}

WWidget.prototype.getX = function() {
	return this.rect.x;
}

WWidget.prototype.getY = function() {
	return this.rect.y;
}

WWidget.prototype.getWidth = function() {
	return this.rect.w;
}

WWidget.prototype.getHeight = function() {
	return this.rect.h;
}

WWidget.prototype.getPositionInView = function() {
	var x = this.getX();
	var y = this.getY();
	var point = {x:0, y:0};
	var iter = this.getParent();

	while(iter != null) {
		x += iter.getX();
		y += iter.getY();
		if(iter.isScrollView) {
			x = x - iter.xOffset;
			y = y - iter.yOffset;
		}
		iter = iter.getParent();
	}

	point.x = x;
	point.y = y;

	return point;
}

WWidget.prototype.getAbsPosition =  function() {
	var x = this.rect.x;
	var y = this.rect.y;

	for(var parent = this.parent; parent; parent = parent.parent) {
		x = x + parent.rect.x;
		y = y + parent.rect.y;
	}
	
	return {x: x, y: y};
}

WWidget.prototype.translatePoint = function(point) {
	var p = this.getAbsPosition();

	return {x:point.x - p.x, y: point.y - p.y};
}

WWidget.prototype.postRedrawAll = function() {
	WWindowManager.getInstance().postRedraw(null);

	return;
}

WWidget.prototype.postRedraw = function(rect) {
	WWindowManager.getInstance().postRedraw(null);
	
	return;
}

WWidget.prototype.redraw = function(rect) {
	var p = this.getAbsPosition();
	
	if(!rect) {
		rect = {x:0, y:0, w:this.rect.w, h:this.rect.h};
	}

	rect.x = p.x + rect.x;
	rect.y = p.y + rect.y;
	
	WWindowManager.getInstance().redraw(rect);
	
	return;
}

WWidget.prototype.isPointIn = function(point) {
	return isPointInRect(point, this.rect);
}

WWidget.prototype.findTargetWidgetEx = function(point, recursive) {
	 if(!this.visible || !this.isPointIn(point)) {
		return null;
	 }

	 if(recursive && this.children.length > 0) {
		  var n = this.children.length - 1;
		  var p = this.point;
		  p.x = point.x - this.rect.x;
		  p.y = point.y - this.rect.y;
		  
		  for(var i = n; i >= 0; i--) {
				var iter = this.children[i];
				var ret = iter.findTargetWidget(p);
				
				if(ret !== null) {
					 return ret;
				}
		  }
	 }
	 
	 return this;
}
	
WWidget.prototype.findTargetWidget = function(point) {
	 return this.findTargetWidgetEx(point, true);
}

WWidget.widgetsPool = {};

WWidget.getWidget = function(type) {
	var widgets = WWidget.widgetsPool[type];
	if(widgets && widgets.length) {
		return widgets.pop();
	}

	return null;
}

WWidget.putWidget = function(widget) {
	if(widget) {
		var type = widget.type;
		var widgets = WWidget.widgetsPool[type];
		if(!widgets) {
			WWidget.widgetsPool[type] = [];
			widgets = WWidget.widgetsPool[type];
		}
		widget.handleGesture = null;
		widget.handleClicked = null;
		widget.handleLongPressed = null;
		widget.handleDoubleClicked = null;
		widget.handleContextMenu = null;
		widget.handleKeyUp = null;
		widget.handleKeyDown = null;
		widget.handleWheel = null;
		widget.onChanged = null;
		widget.onChanging = null;
		widget.clickHandler = null;
		if(widget.onBeforePaint) {
			widget.onBeforePaint = null;
		}
		if(widget.onAfterPaint) {
			widget.onAfterPaint = null;
		}
		if(widget.onGetText) {
			widget.onGetText = null;
		}
		widgets.push(widget);
	}

	return;
}

WWidget.prototype.onRemoved = function() {
}

WWidget.prototype.removeChild = function(child) {
	child.remove();

	return this;
}

WWidget.prototype.remove = function() {
	var parent = this.parent;
	if(parent) {
		parent.children.remove(this);
		if(parent.target === this) {
			parent.target = null;
		}

		this.parent = null;
		this.onRemoved();
		parent.setNeedRelayout(true);
	}

	return this;
}

WWidget.prototype.destroy = function() {
	if(this.children.length) {
		this.destroyChildren();
	}

	if(this.userData) {
		this.userData = null;
	}

	this.remove();
	WWidget.putWidget(this);

	return;
}

WWidget.prototype.destroyChildren = function() {
	var n = this.children.length;
	for(var i = 0; i < n; i++) {
		var iter = this.children[0];
		iter.destroy();
	}
	this.target = null;
	this.children.length = [];
	this.setNeedRelayout(true);

	return;
}

WWidget.prototype.setTextOf = function(name, text, notify) {
	var child = this.lookup(name, true);

	if(child) {
		child.setText(text, notify);
	}
	else {
		console.log("not found " + name);
	}

	return child;
}

WWidget.prototype.setValueOf = function(name, value, notify) {
	var child = this.lookup(name, true);

	if(child) {
		child.setValue(value, notify);
	}
	else {
		console.log("not found " + name);
	}

	return child;
}

WWidget.prototype.setVisibleOf = function(name, value) {
	var child = this.lookup(name, true);

	if(child) {
		child.setVisible(value);
	}
	else {
		console.log("not found " + name);
	}

	return child;
}

WWidget.prototype.setValue = function(value) {
	return this.setText(value);
}

WWidget.prototype.getValue = function() {
	return this.getText();
}

WWidget.prototype.setText = function(text) {
	this.text = (text || text === 0) ? text.toString() : "";
	this.setNeedRelayout(true);

	return this;
}

WWidget.prototype.getText = function() {
	if(this.onGetText) {
		return this.onGetText();
	}

	return this.text;
}

WWidget.prototype.setTips = function(tips) {
	this.tips = tips;

	return this;
}

WWidget.prototype.getTips = function() {
	return this.tips;
}

WWidget.prototype.drawTips = function(canvas) {
	var tips = this.getTips();
	if(tips) {
		var style = this.getStyle();
		var x = this.rect.w >> 1;
		var y = this.rect.h >> 1;

		canvas.textAlign = "center";
		canvas.textBaseline = "middle";
		canvas.font = style.font ? style.font : "12pt bold sans-serif";
		canvas.fillStyle = style.textColor ? style.textColor : "Black";
		canvas.fillText(tips, x, y);
	}

	return;
}

WWidget.prototype.setID = function(id) {
	 this.id = id;
	 
	 return this;
}

WWidget.prototype.getID = function() {
	return this.id;
}

WWidget.prototype.setUserData = function(userData) {
	 this.userData = userData;
	 
	 return this;
}

WWidget.prototype.getUserData = function() {
	return this.userData;
}

WWidget.prototype.setEnable = function(value) {
	this.enable = value;
	
	if(!value) {
		this.setState(WWidget.STATE_DISABLE);
	}
	else {
		if(this.state === WWidget.STATE_DISABLE) {
			this.setState(WWidget.STATE_NORMAL);
		}
	}
	
	return this;
}

WWidget.prototype.onStateChanged = function(state) {
}

WWidget.prototype.setState = function(state) {
	if(this.enable) {
		this.state = state;
		this.onStateChanged(state);
	}
	
	return this;
}

WWidget.prototype.measure = function(canvas) {
	 return;
}

WWidget.prototype.onMoved = function() {
}

WWidget.prototype.move = function(x, y) {
	this.rect.x = x;
	this.rect.y = y;
	this.onMoved();

	return this;
}

WWidget.prototype.moveDelta = function(dx, dy) {
	this.rect.x = this.rect.x + dx;
	this.rect.y = this.rect.y + dy;
	this.onMoved();

	return this;
}

WWidget.prototype.onSized = function(w, h) {
}

WWidget.prototype.resize = function(w, h) {
	this.rect.w = w;
	this.rect.h = h;
	this.onSized();
	this.setNeedRelayout(true);

	return this;
}

WWidget.prototype.setClickedHandler = function(clickHandler) {
	 this.clickHandler = clickHandler;
	 
	 return this;
}

WWidget.prototype.onClicked = function(point) {
	if(this.handleClicked) {
		this.handleClicked(point);
	}

	if(this.clickHandler) {
		this.clickHandler(this, point);
	}

	return this.clickHandler != null;
}

WWidget.prototype.lookup = function(id, recursive) {
	var n = this.children.length;
	for(var i = 0; i < n; i++) {
		var iter = this.children[i];	
		if(iter.id === id) {
			return iter;
		}
	}

	if(recursive) {
		for(var i = 0; i < n; i++) {
			var iter = this.children[i];	
			var ret = iter.lookup(id, recursive);
			if(ret) {
				return ret;
			}
		}
	}

	return null;
}

WWidget.prototype.relayout = function(canvas, force) {
	 return this;
}

WWidget.prototype.setLineWidth = function(lineWidth) {
	this.lineWidth = lineWidth;

	return this;
}

WWidget.prototype.getLineWidth = function(style) {
	return this.lineWidth ? this.lineWidth : style.lineWidth;
}

WWidget.prototype.setRoundRadius = function(roundRadius) {
	this.roundRadius = roundRadius;

	return this;
}

WWidget.prototype.ensureTheme = function() {
	if(this.themeType) {
		this.theme = WThemeManager.get(this.themeType);
	}
	else {
		this.theme = WThemeManager.get(this.type);
	}

	return this;
}

WWidget.prototype.getStyle = function(state) {
	this.ensureTheme();

	state = state ? state : (this.enable ? this.state : WWidget.STATE_DISABLE);
	var style = this.theme[state];
	
	return style ? style : this.theme[WWidget.STATE_NORMAL];
}

WWidget.prototype.paintBackground = function(canvas) {
	var dst  = this.rect;
	var style =  this.getStyle();

	if(!style) return;

	if(style.bgImage) {
		var image = style.bgImage.getImage();
		var src = style.bgImage.getImageRect();
		if(image) {
			drawNinePatchEx(canvas, image, src.x, src.y, src.w, src.h, 0, 0, dst.w, dst.h);
		}
	}
	else {
		canvas.beginPath();
		if(this.roundRadius) {
			drawRoundRect(canvas, dst.w, dst.h, this.roundRadius);	
		}
		else {
			canvas.rect(0, 0, dst.w, dst.h);
		}
			
		if(style.fillColor) {
			canvas.fillStyle = style.fillColor;
			canvas.fill();
		}

		var lineWidth = this.getLineWidth(style);
		if(lineWidth) {
			canvas.lineWidth = lineWidth;
			canvas.strokeStyle = style.lineColor;
			canvas.stroke();
		}
		canvas.beginPath();
	}
	
	return;
}

WWidget.prototype.paintSelf = function(canvas) {
	 return this;
}

WWidget.prototype.beforePaint = function(canvas) {
	if(this.onBeforePaint) {
		this.onBeforePaint(canvas);
	}
	return this;
}

WWidget.prototype.afterPaint = function(canvas) {
	if(this.onAfterPaint) {
		this.onAfterPaint(canvas);
	}
	return this;
}

WWidget.prototype.setPaintFocusLater = function(paintFocusLater) {
	this.paintFocusLater = paintFocusLater;

	return this;
}

WWidget.prototype.paintChildren = function(canvas) {
	if(this.paintFocusLater) {
		this.paintChildrenFocusLater(canvas);
	}
	else {
		this.paintChildrenDefault(canvas);
	}

	return this;
}

WWidget.prototype.paintChildrenDefault = function(canvas) {
	var n = this.children.length;
	for(var i = 0; i < n; i++) {
		var iter = this.children[i];
		iter.draw(canvas);
	}

	return;
}

WWidget.prototype.paintChildrenFocusLater = function(canvas) {
	var focusChild = null;
	var n = this.children.length;
	for(var i = 0; i < n; i++) {
		var iter = this.children[i];

		if(iter.state === WWidget.STATE_OVER) {
			focusChild = iter;
		}
		else {
			iter.draw(canvas);
		}
	}

	if(focusChild) {
		focusChild.draw(canvas);
	}

	return;
}

WWidget.prototype.ensureImages = function() {
	return;
}

WWidget.prototype.draw = function(canvas) {
	 if(!this.visible) {
		  return;
	 }

	if(this.checkEnable) {
		this.setEnable(this.checkEnable());
	}

	this.ensureImages();

	canvas.save();
	this.relayout(canvas, false);

	canvas.translate(this.rect.x, this.rect.y);
	this.beforePaint(canvas);
	this.paintBackground(canvas);
	this.paintSelf(canvas);
	this.paintChildren(canvas);	
	this.drawTips(canvas);
	this.afterPaint(canvas);
	canvas.closePath();
	canvas.restore();

	return;
}

WWidget.prototype.setVisible = function(visible) {
	this.visible = visible;

	return this;
}

WWidget.prototype.isVisible = function() {
	return this.visible;
}

WWidget.prototype.onShow = function(visible) {
	return true;
}

WWidget.prototype.show = function(visible) {
	var visible = !!visible;
	if(visible != this.visible) {
		this.visible = visible;
		this.onShow(visible);
	}

	return;
}

WWidget.prototype.showAll = function(visible) {
	var n = this.children.length;
	
	this.show(visible);
	for(var i = 0; i < n; i++) {
		var iter = this.children[i];
		iter.showAll(visible);
	}
	
	if(!this.parent) {
		this.postRedraw();
	}
	
	return;
}

WWidget.prototype.selectAllChildren = function(selected) {
	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		if(iter.checkable) {
			iter.setChecked(selected);
		}
	}

	return this;
}

WWidget.prototype.closeWindow = function(retInfo) {
	this.getWindow().close(retInfo);

	return;
}
	
WWidget.prototype.findTarget = function(point) {
	var p = this.getAbsPosition();
	this.point.x = point.x - p.x;
	this.point.y = point.y - p.y;
	var n = this.children.length;	
	if(n > 0) {
		for(var i = n - 1; i >= 0; i--) {
			var iter = this.children[i];

			if(!iter.visible) {
				continue;
			}

			if(isPointInRect(this.point, iter.rect)) {
				return iter;
			}
		}
	}

	return null;
}

////////////////////////////////////////////
WWidget.prototype.onPointerDown = function(point) {
	if(!this.enable) return false;

	var target = this.findTarget(point);
	if(this.target) {
		this.target.setState(WWidget.STATE_NORMAL);
	}

	if(target) {
		target.setState(WWidget.STATE_ACTIVE);
		target.onPointerDown(point);
	}
	else {
		if(this.state !== WWidget.STATE_DISABLE) {
			this.setState(WWidget.STATE_ACTIVE);
		}
	}

	this.target = target;

	return true;
}

WWidget.prototype.onPointerMove = function(point) {
	if(!this.enable) return false;

	var target = this.findTarget(point);
	this.pointerOverr = isPointInRect(point, this.rect);

	if(this.target) {
		if(this.target.state === WWidget.STATE_OVER || this.target.state === WWidget.STATE_ACTIVE) {
			this.target.setState(WWidget.STATE_NORMAL);
		}
		this.target.onPointerMove(point);
	}

	if(target) {
		if(this.isPointerDown()) {
			target.setState(WWidget.STATE_ACTIVE);
		}
		else {
			target.setState(WWidget.STATE_OVER);
		}
	}
	
	if(this.target !== target) {
		this.postRedraw();
		this.target = target;
		if(this.target) {
			this.target.onPointerMove(point);
		}
	}

	return true;
}

WWidget.prototype.onPointerUp = function(point) {
	if(!this.enable) return false;

	var target = this.target;
	if(target) {
		if(target.state !== WWidget.STATE_DISABLE) {
			target.onPointerUp(point);
		}
	}
	
	if(this.state !== WWidget.STATE_DISABLE && this.isClicked()) {
		this.onClicked(point);
	}

	if(this.state !== WWidget.STATE_DISABLE) {
		if(this.selectable) {
			this.setState(WWidget.STATE_SELECTED);
		}
		else {
			this.setState(WWidget.STATE_NORMAL);
		}
	}

	return true;
}

WWidget.prototype.onKeyDown = function(code) {
	if(this.target) {
		this.target.onKeyDown(code);
	}

	if(this.handleKeyDown) {
		this.handleKeyDown(code);
	}

	console.log("onKeyUp WWidget:" + this.type + " code=" + code)
	return;
}

WWidget.prototype.onKeyUp = function(code) {
	if(this.target) {
		this.target.onKeyUp(code);
	}
	
	if(this.handleKeyUp) {
		this.handleKeyUp(code);
	}
	console.log("onKeyUp WWidget:" + this.type + " code=" + code)
	return;
}	

WWidget.prototype.onWheel = function(delta) {
	if(this.target) {
		return this.target.onWheel(delta);
	}

	if(this.handleWheel) {
		return this.handleWheel(delta);
	}

	return false;
}


WWidget.prototype.onDoubleClick = function(point) {
	var target = null;

	if(this.grabWidget) {
		target = this.grabWidget;
	}
	else {
		target = this.findTarget(point);
	}
	 
	if(target) {
		target.onDoubleClick(point);
		this.target = target;
	}

	if(this.state !== WWidget.STATE_DISABLE && this.handleDoubleClicked) {
		this.handleDoubleClicked(point);
	}
	
	return;
}

WWidget.prototype.onContextMenu = function(point) {
	var target = this.findTarget(point);

	if(target) {
		target.onContextMenu(point);
		this.target = target;
	}

	if(this.state !== WWidget.STATE_DISABLE && this.handleContextMenu) {
		this.handleContextMenu(point);
	}

	return;
}

WWidget.prototype.onLongPress = function(point) {
	var target = this.findTarget(point);
	 
	 if(target) {
		  target.onLongPress(point);
		  this.target = target;
	 }
	
	if(this.state !== WWidget.STATE_DISABLE && this.handleLongPressed) {
		this.handleLongPressed(point);
	}

	return;
}

WWidget.prototype.onGesture = function(gesture) {
	var target = this.findTarget(point);

	if(target) {
		 target.onGesture(gesture);
	}

	if(this.state !== WWidget.STATE_DISABLE && this.handleGesture) {
		this.handleGesture(gesture);
	}

	return;
}

