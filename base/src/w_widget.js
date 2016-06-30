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
WWidget.STATE_DISABLE     = "state-disable";
WWidget.STATE_DISABLE_SELECTED = "state-disable-selected";
WWidget.STATE_SELECTED         = "state-selected";
WWidget.STATE_NORMAL_CURRENT   = "state-normal-current";

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
WWidget.TYPE_DRAGGABLE_DIALOG = "draggable-dialog";
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
WWidget.TYPE_LIST_ITEM_RADIO = "list-item-radio";
WWidget.TYPE_IMAGE_VIEW = "image-view";
WWidget.TYPE_TREE_VIEW = "tree-view";
WWidget.TYPE_TREE_ITEM = "tree-item";
WWidget.TYPE_ACCORDION = "accordion";
WWidget.TYPE_ACCORDION_ITEM = "accordion-item";
WWidget.TYPE_ACCORDION_TITLE = "accordion-title";
WWidget.TYPE_PROPERTY_TITLE = "property-title";
WWidget.TYPE_PROPERTY_SHEET = "property-sheet";
WWidget.TYPE_PROPERTY_SHEETS = "property-sheets";
WWidget.TYPE_VIEW_BASE = "view-base";
WWidget.TYPE_COMPONENT_MENU_ITEM = "menuitem.component";
WWidget.TYPE_WINDOW_MENU_ITEM = "menuitem.window";
WWidget.TYPE_MESSAGE_BOX = "messagebox";
WWidget.TYPE_IMAGE_TEXT = "icon-text";
WWidget.TYPE_BUTTON = "button";
WWidget.TYPE_KEY_VALUE = "key-value";
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
WWidget.TYPE_COMBOBOX_POPUP = "combobox-popup";
WWidget.TYPE_COMBOBOX_POPUP_ITEM = "combobox-popup-item";
WWidget.TYPE_COLOR_EDIT = "color-edit";
WWidget.TYPE_RANGE_EDIT = "range-edit";
WWidget.TYPE_FILENAME_EDIT = "filename-edit";
WWidget.TYPE_FILENAMES_EDIT = "filenames-edit";
WWidget.TYPE_CANVAS_IMAGE = "canvas-image";
WWidget.TYPE_ICON_BUTTON = "icon-button";

WWidget.BORDER_STYLE_NONE   = 0;
WWidget.BORDER_STYLE_LEFT   = 1;
WWidget.BORDER_STYLE_RIGHT  = 2;
WWidget.BORDER_STYLE_TOP    = 4;
WWidget.BORDER_STYLE_BOTTOM = 8;
WWidget.BORDER_STYLE_ALL    = 0xffff;

WWidget.prototype = {};
WWidget.prototype.init = function(parent, x, y, w, h) {
	this.text = "";
	this.tag = null;
	this.tips = null;
	this.enable = true;
	this.visible = true; 
	this.parent = parent;
	this.checkEnable = null;

	this.children = [];
	this.point = {x:0, y:0};
	this.rect  = {x:x, y:y, w:w, h:h};
	this.setState(WWidget.STATE_NORMAL);
	this.imageDisplay = WImage.DISPLAY_9PATCH;
	this.borderStyle = WWidget.BORDER_STYLE_ALL;
	this.cursor = "default";

	if(this.parent) {
		var border = parent.border ? parent.border : 0;
		var pw = parent.rect.w - 2 * border;
		var ph = parent.rect.h - 2 * border;

		if(x > 0 && x < 1) {
			this.rect.x = pw * x + border;
		}
		if(w > 0 && w <= 1) {
			this.rect.w = pw * w;
		}
		if(y > 0 && y < 1) {
			this.rect.y = ph * y + border;
		}
		if(h > 0 && h <= 1) {
			this.rect.h = ph * h;
		}
		
		parent.appendChild(this);
	}

	return this;
}

WWidget.prototype.useTheme = function(type) {
	this.themeType = type;

	return this;
}

WWidget.prototype.isSelected = function() {
	return this.selected;
}

WWidget.prototype.setSelected = function(value) {
	this.selected = value;

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
	var win = this.getWindow();
	if(win) {
		return win.isClicked();
	}
	else {
		return WWindowManager.getInstance().isClicked();
	}
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
	return this.getWindow().getCanvas2D();
}

WWidget.prototype.getCanvas = function() {
	return this.getWindow().getCanvas();
}

WWidget.prototype.getLastPointerPoint = function() {
	return WWindowManager.getInstance().getLastPointerPoint();
}

WWidget.prototype.getTopWindow = function() {
	 return this.getWindow();
}

WWidget.prototype.getWindow = function() {
	if(!this.parent) {
		return this;
	}

	var p = this.parent;
	while(p.parent) {
		p = p.parent;
	}

	return p;
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

WWidget.prototype.getPositionInWindow =  function() {
	var x = 0;
	var y = 0;

	if(this.parent) {
		for(var iter = this; iter !== null; iter = iter.parent) {
			if(!iter.parent) {
				break;
			}

			x = x + iter.rect.x;
			y = y + iter.rect.y;
		}
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
		delete widget.selectable;

		widget.themeType = null;
		widget.userData = null;
		widget.handleGesture = null;
		widget.handleClicked = null;
		widget.handleLongPressed = null;
		widget.handleDoubleClicked = null;
		widget.handleContextMenu = null;
		widget.handleKeyUp = null;
		widget.handleKeyDown = null;
		widget.handleWheel = null;
		widget.onChanged = null;
		widget.onChange = null;
		widget.onMoved = null;
		widget.onSized = null;
		widget.clickedHandler = null;
		widget.removedHandler = null;
		widget.stateChangedHandler = null;

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

WWidget.prototype.setRemovedHandler = function(removedHandler) {
	this.removedHandler = removedHandler;
	
	return this;
}


WWidget.prototype.onRemoved = function() {
	if(this.removedHandler) {
		this.removedHandler();
	}

	return;
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

WWidget.prototype.cleanUp = function() {
}

WWidget.prototype.destroy = function() {
	if(this.children.length) {
		this.destroyChildren();
	}

	this.remove();
	this.cleanUp();

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

WWidget.prototype.forEachChild = function(onVisit) {
	var n = this.children.length;
	for(var i = 0; i < n; i++) {
		var iter = this.children[i];
		onVisit(iter);
	}

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

WWidget.prototype.setInputTips = function(tips) {
	this.inputTips = tips;

	return this;
}

WWidget.prototype.getInputTips = function() {
	return this.inputTips;
}

WWidget.prototype.drawInputTips = function(canvas) {
	var h = this.rect.h;
	var w = this.rect.w;
	var y = this.rect.h >> 1;
	var x = this.leftMargin || 2;
	var text = this.getText();
	var inputTips = this.getInputTips();
	
	if(text || !inputTips || this.type !== WWidget.TYPE_EDIT || this.editing) {
		return;	
	}

	var style = this.getStyle();
	canvas.save();
	canvas.font = style.font;
	canvas.fillStyle = "#E0E0E0";

	canvas.beginPath();
	canvas.rect(0, 0, w - x, h);
	canvas.clip();

	canvas.textAlign = 'left';
	canvas.textBaseline = 'middle';
	canvas.fillText(inputTips, x, y);

	canvas.restore();

	return;
}

WWidget.prototype.drawTips = function(canvas) {
	var tips = this.getTips();
	if(tips) {
		var style = this.getStyle();
		var x = this.rect.w >> 1;
		var y = this.rect.h >> 1;
		var font = style.tipsFont || style.font;
		var textColor = style.tipsTextColor || style.textColor;

		if(font && textColor) {
			canvas.textAlign = "center";
			canvas.textBaseline = "middle";
			canvas.font = font;
			canvas.fillStyle = textColor;
			canvas.fillText(tips, x, y);
		}
	}

	return this;
}

WWidget.prototype.setID = function(id) {
	 this.id = id;
	 
	 return this;
}

WWidget.prototype.getID = function() {
	return this.id;
}

WWidget.prototype.setName = function(name) {
	 this.name = name;
	 
	 return this;
}

WWidget.prototype.getName = function() {
	return this.name;
}

WWidget.prototype.setTag = function(tag) {
	 this.tag = tag;
	 
	 return this;
}

WWidget.prototype.getTag = function() {
	return this.tag;
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

	return this;
}

WWidget.prototype.changeCursor = function() {
	var canvas = this.getCanvas();
	if(canvas.style.cursor !== this.cursor) {
		canvas.style.cursor = this.cursor;
	}

	return this;
}

WWidget.prototype.onStateChanged = function(state) {
	if(this.stateChangedHandler) {
		this.stateChangedHandler(state);
	}

	if(state === WWidget.STATE_OVER || state === WWidget.STATE_ACTIVE) {
		this.changeCursor();
	}

	return this;
}

WWidget.prototype.setState = function(state, recursive) {
	if(this.state !== state) {
		this.state = state;
		this.onStateChanged(state);
		if(state === WWidget.STATE_OVER) {
			WWindowManager.getInstance().setTipsWidget(this);
		}
	}

	if(recursive && this.target) {
		this.target.setState(state, recursive);
	}

	return this;
}

WWidget.prototype.measure = function(canvas) {
	 return;
}

WWidget.prototype.move = function(x, y) {
	this.rect.x = x;
	this.rect.y = y;
	if(this.onMoved) {
		this.onMoved();
	}

	return this;
}

WWidget.prototype.moveToCenter = function(moveX, moveY) {
	var pw = this.parent.rect.w;
	var ph = this.parent.rect.h;

	if(moveX) {
		this.rect.x = (pw - this.rect.w) >> 1;
	}

	if(moveY) {
		this.rect.y = (ph - this.rect.h) >> 1;
	}

	return this;
}

WWidget.prototype.moveToBottom = function(border) {
	var ph = this.parent.rect.h;

	this.rect.y = ph - this.rect.h - border;

	return this;
}

WWidget.prototype.moveDelta = function(dx, dy) {
	this.rect.x = this.rect.x + dx;
	this.rect.y = this.rect.y + dy;
	if(this.onMoved) {
		this.onMoved();
	}

	return this;
}

WWidget.prototype.resize = function(w, h) {
	this.rect.w = w;
	this.rect.h = h;
	if(this.onSized) {
		this.onSized();
	}
	this.setNeedRelayout(true);

	return this;
}

WWidget.prototype.setStateChangedHandler = function(stateChangedHandler) {
	 this.stateChangedHandler = stateChangedHandler;
	 
	 return this;
}

WWidget.prototype.setContextMenuHandler = function(contextMenuHandler) {
	this.handleContextMenu = contextMenuHandler;

	return this;
}

WWidget.prototype.setClickedHandler = function(clickedHandler) {
	 this.clickedHandler = clickedHandler;
	 
	 return this;
}

WWidget.prototype.setKeyDoneHandler = function(handleKeyDown) {
	this.handleKeyDown = handleKeyDown;

	return this;
}

WWidget.prototype.setKeyUpHandler = function(handleKeyUp) {
	this.handleKeyUp = handleKeyUp;

	return this;
}

WWidget.prototype.onClicked = function(point) {
	if(this.handleClicked) {
		this.handleClicked(point);
	}

	if(this.clickedHandler) {
		this.clickedHandler(this, point);
	}

	this.postRedraw();

	return this.clickedHandler != null;
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

WWidget.prototype.onRelayout = function(canvas, force) {
}

WWidget.prototype.relayout = function(canvas, force) {
	if((!this.needRelayout && !force) || !this.children.length) {
		return this;
	}
	
	this.onRelayout(canvas, force);
	this.needRelayout = false;

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

WWidget.prototype.getStyle = function(_state) {
	var style = null;
	this.ensureTheme();
	var state = _state ? _state : this.state;

	if(!this.enable) {
		if(this.selectable && this.isSelected()) {
			style = this.theme[WWidget.STATE_DISABLE_SELECTED];
		}
		else {
			style = this.theme[WWidget.STATE_DISABLE];
		}
	}
	else {
		if(this.selectable && this.selected) {
			style = this.theme[WWidget.STATE_SELECTED];
		}
		else if(state === WWidget.STATE_OVER) {
			style = this.theme[WWidget.STATE_OVER];
		}
		else if(state === WWidget.STATE_ACTIVE) {
			style = this.theme[WWidget.STATE_ACTIVE];
		}
		else {
			style = this.theme[WWidget.STATE_NORMAL];
		}
	}
	
	if(!style) {
		style = this.theme[WWidget.STATE_NORMAL];
	}

	return style;
}

WWidget.prototype.setImageDisplay = function(imageDisplay) { 
	this.imageDisplay = imageDisplay;

	return this;
}

WWidget.prototype.setBorderStyle = function(borderStyle) {
	this.borderStyle = borderStyle;

	return this;;
}

WWidget.prototype.paintBackground = function(canvas) {
	var style =  this.getStyle();
	if(style) {
		if(style.bgImage) {
			this.paintBackgroundImage(canvas, style);
		}
		else {
			this.paintBackgroundColor(canvas, style);
		}
	}
}

WWidget.prototype.paintBackgroundImage = function(canvas, style) {
	var dst  = this.rect;
	var image = style.bgImage.getImage();
	var src = style.bgImage.getImageRect();
	var imageDisplay = style.imageDisplay ? style.imageDisplay : this.imageDisplay;

	if(image) {
		var topOut = style.topOut ? style.topOut : 0;
		var leftOut = style.leftOut ? style.leftOut : 0;
		var rightOut = style.rightOut ? style.rightOut : 0;
		var bottomOut = style.bottomOut ? style.bottomOut : 0;

		var x = -leftOut;
		var y = -topOut;
		var w = dst.w + rightOut + leftOut;
		var h = dst.h + bottomOut + topOut;

		style.bgImage.draw(canvas, imageDisplay, x, y, w, h, src);
	}
}

WWidget.prototype.paintLeftBorder = function(canvas, w, h) {
	canvas.beginPath();
	canvas.moveTo(0, 0);
	canvas.lineTo(0, h);
	canvas.stroke();
}

WWidget.prototype.paintRightBorder = function(canvas, w, h) {
	canvas.beginPath();
	canvas.moveTo(w, 0);
	canvas.lineTo(w, h);
	canvas.stroke();
}

WWidget.prototype.paintTopBorder = function(canvas, w, h) {
	canvas.beginPath();
	canvas.moveTo(0, 0);
	canvas.lineTo(w, 0);
	canvas.stroke();
}

WWidget.prototype.paintBottomBorder = function(canvas, w, h) {
	canvas.beginPath();
	canvas.moveTo(0, h);
	canvas.lineTo(w, h);
	canvas.stroke();
}

WWidget.prototype.paintBackgroundColor = function(canvas, style) {
	var dst  = this.rect;

	canvas.beginPath();
	if(this.roundRadius || style.roundRadius) {
		var roundRadius = Math.min((dst.h >> 1) - 1, style.roundRadius || this.roundRadius);
		drawRoundRect(canvas, dst.w, dst.h, roundRadius);	
	}
	else {
		canvas.rect(0, 0, dst.w, dst.h);
	}
	
	if(style.fillColor) {
		canvas.fillStyle = style.fillColor;
		canvas.fill();
	}

	var lineWidth = this.getLineWidth(style);
	if(!lineWidth || !style.lineColor || this.borderStyle === WWidget.BORDER_STYLE_NONE) {
		return;
	}

	var w = this.getWidth();
	var h = this.getHeight();
	canvas.lineWidth = lineWidth;
	canvas.strokeStyle = style.lineColor;
	if(this.borderStyle === WWidget.BORDER_STYLE_ALL) {
		canvas.stroke();
		canvas.beginPath();
		return;
	}
	
	if(this.borderStyle & WWidget.BORDER_STYLE_LEFT) {
		this.paintLeftBorder(canvas, w, h);
	}

	if(this.borderStyle & WWidget.BORDER_STYLE_RIGHT) {
		this.paintRightBorder(canvas, w, h);
	}
	
	if(this.borderStyle & WWidget.BORDER_STYLE_TOP) {
		this.paintTopBorder(canvas, w, h);
	}
	
	if(this.borderStyle & WWidget.BORDER_STYLE_BOTTOM) {
		this.paintBottomBorder(canvas, w, h);
	}
	canvas.beginPath();
	
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
		var iterFocused = (iter.state === WWidget.STATE_OVER || iter.state === WWidget.STATE_ACTIVE);

		if(iterFocused) {
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
	this.drawInputTips(canvas);
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

	return this;
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
	
	return this;
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

	return this;
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
	if(this.target !== target) {
		if(this.target) {
			this.target.setState(WWidget.STATE_NORMAL);
		}
	}

	if(target) {
		target.setState(WWidget.STATE_ACTIVE);
		target.onPointerDown(point);
	}
	else {
		this.changeCursor();
	}

	this.target = target;
	this.postRedraw();

	return true;
}

WWidget.prototype.onPointerMove = function(point) {
	if(!this.enable) return false;

	this.pointerOverr = isPointInRect(point, this.rect);
	var target = this.isPointerDown() ? this.target : this.findTarget(point);

	if(this.target !== target) {
		if(this.target) {
			this.target.setState(WWidget.STATE_NORMAL, true);
		}
	}

	if(target) {
		if(this.isPointerDown()) {
			target.setState(WWidget.STATE_ACTIVE);
		}
		else {
			target.setState(WWidget.STATE_OVER);
		}
		target.onPointerMove(point);
	}
	else {
		this.changeCursor();
	}
	
	this.target = target;
	this.postRedraw();

	return true;
}

WWidget.prototype.onPointerUp = function(point) {
	if(!this.enable) return false;
	
	var target = this.findTarget(point);
	if(this.target !== target) {
		if(this.target) {
			this.target.setState(WWidget.STATE_NORMAL);
			this.target.onPointerUp(point);
		}
	}
	
	if(target) {
		target.setState(WWidget.STATE_OVER);
		target.onPointerUp(point);
	}
	else {
		this.changeCursor();
	}
		
	if(this.isClicked()) {
		try {
			this.onClicked(point);
		}catch(e) {
			console.debug('stack:', e.stack);
			console.debug("this.onClicked:" + e.message);
		}
	}

	this.target = target;
	this.postRedraw();

	return true;
}

WWidget.prototype.onKeyDown = function(code) {
	if(this.target) {
		this.target.onKeyDown(code);
	}

	if(this.handleKeyDown) {
		this.handleKeyDown(code);
	}

	console.log("onKeyDown WWidget:" + this.type + " code=" + code)
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

WWidget.prototype.setCursor = function(cursor) {
	this.cursor = cursor;

	return this;
}

WWidget.canvasPool = [];
WWidget.resizeCanvas = function(canvas, w, h) {
    canvas.width = w;
    canvas.height = h;
}

WWidget.getCanvas = function(x, y, w, h, zIndex) {
	var canvas = null;
	if(WWidget.canvasPool.length) {
		canvas = WWidget.canvasPool.pop();
	}
	else {
		canvas = document.createElement('canvas');
	}
    
    WWidget.resizeCanvas(canvas, w, h);
	canvas.style.position = "absolute";
	canvas.style.opacity = 1;
	canvas.style.left = x + "px";
	canvas.style.top = y + "px";
	canvas.style.width = w + "px";
	canvas.style.height = h + "px";
	canvas.style.zIndex = zIndex;

	return canvas;
}

WWidget.putCanvas = function(canvas) {
	canvas.style.zIndex = -1;
	canvas.style.opacity = 0;
	WWidget.canvasPool.push(canvas);
}

WWidget.tipsCanvas = null;
WWidget.getTipsCanvas = function(x, y, w, h, zIndex) {
	if(!WWidget.tipsCanvas) {
		WWidget.tipsCanvas = WWidget.getCanvas(x, y, w, h, zIndex);
		document.body.appendChild(WWidget.tipsCanvas);
	}

	var canvas = WWidget.tipsCanvas;

	canvas.width = w;
	canvas.height = h;
	canvas.style.position = "absolute";
	canvas.style.opacity = 1;
	canvas.style.left = x + "px";
	canvas.style.top = y + "px";
	canvas.style.width = w + "px";
	canvas.style.height = h + "px";
	canvas.style.zIndex = zIndex;

	return canvas;
}

WWidget.hideTipsCanvas = function() {
	var canvas = WWidget.tipsCanvas;
	if(canvas) {
		canvas.style.zIndex = -1;
	}
}
