/*
 * File: drawing_view.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: the base class of the drawing view.
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function WViewBase() {
}

WViewBase.prototype = new WWidget();
WViewBase.prototype.init = function(parent, x, y, w, h) {
	WWidget.prototype.init.call(this, parent, x, y, w, h);
	
	this.xscale	= 1.0;
	this.yscale = 1.0;
	this.allShapes = [];
	this.autoResize = false;	
	this.pointerDownPosition = {x:0, y:0};
	this.lastPointerPosition = {x:0, y:0};
	this.style = WThemeManager.newStyle("13pt bold sans-serif", "White",  "Black", "Black", null);

	return this;  
}

WViewBase.prototype.getStyle = function() {
	return this.style;
}

WViewBase.prototype.getScale = function() {
	return this.xscale;
}

WViewBase.prototype.getViewScale = function() {
	return this.getScale();
}

WViewBase.prototype.onShapeSelected = function(shape) {
	this.getApp().onShapeSelected(shape);

	return;
}

WViewBase.prototype.setAutoResize = function() {
	this.autoResize = true;

	return;
}

WViewBase.prototype.initPage = function(index, shapes) {
	var page = {};

	page.index = index ? index : 0;
	page.shapes = shapes ? shapes : [];

	return page;
}

WViewBase.prototype.getPages = function() {
	return this.pages;
}

WViewBase.prototype.newPage = function() {
	var n = this.getPageNr();
	var newIndex = this.currentPage + 1;
	var page = this.initPage(newIndex, null);
	
	this.pages.push(page);

	this.saveCurrentPage();
	if(n > 1) {
		for(var i = n; i > newIndex; i--) {
			this.pages[i] = this.pages[i-1];
		}
		this.pages[newIndex] = page;
	}

	this.currentPage = newIndex;
	this.showCurrentPage();

	this.getApp().updateContextMenu();

	return;
}

WViewBase.prototype.removeCurrentPage = function() {
	var n = this.getPageNr();

	if(n > 1) {
		this.removePage(this.currentPage);
	}
	else {
		this.allShapes.clear();
	}

	this.getApp().updateContextMenu();
	return;
}

WViewBase.prototype.removePage = function(index) {
	var n = this.getPageNr();
	
	if(index < 0 || index >= n) {
		index = this.currentPage;
	}

	var page = this.pages[index];
	if(this.pages.length > 1) {
		this.pages.remove(page);
	}

	if(index <= this.currentPage && this.currentPage >= 0) {
		this.currentPage--;
	}

	this.showCurrentPage();
	this.getApp().updateContextMenu();

	return;
}

WViewBase.prototype.saveCurrentPage = function() {
	var shapes = new Array();

	for(var i = 0; i < this.allShapes.length; i++) {
		var shape = this.allShapes[i];
		shapes.push(shape.toJson());
	}

	this.pages[this.currentPage] = this.initPage(this.currentPage, shapes);

	return;
}

WViewBase.prototype.setMetaInfo = function(meta) {
	this.meta = meta;

	return;
}

WViewBase.prototype.getMetaInfo = function() {
	return this.meta;
}

WViewBase.prototype.getAppIcon = function() {
	return this.meta.general.appIcon;
}

WViewBase.prototype.getAppName = function() {
	return this.meta.general.appname;
}

WViewBase.prototype.getAppDesc = function() {
	return this.meta.general.appdesc;
}

WViewBase.prototype.getAppID = function() {
	return this.meta.general.appID;
}

WViewBase.prototype.getDocID = function() {
	return this.docid ? this.docid : (Math.round(Math.random() * 100) + "" + Date.now());
}

WViewBase.prototype.saveAsJson = function() {
	var o = {};
	var page = null;
	var types = ShapeFactory.getInstance().getDiagramTypes();

	this.saveCurrentPage();

	o.w = this.rect.w;
	o.h = this.rect.h;
	o.version = 1.0;
	o.magic = "drawapps";
	o.scale = this.xscale;
	o.type = this.type ? this.type : types[0].name;
	o.docid = this.getDocID();
	o.meta = this.meta;
	o.pages = this.pages;

	var js = JSON.stringify(o, null, "\t");

	return js;
}

WViewBase.prototype.parseJson = function(jsonStr) {
	if(!jsonStr) {
		return null;
	}

	var js = null;
	try {
		js = JSON.parse(jsonStr);
		if(!js.magic) {
			console.log("Not supported type");
			return null;
		}
	}
	catch(e) {
		console.log("JSON.parse failed:" + e.message);
		console.log("JSON.parse failed:" + jsonStr);
	}

	return js;
}

WViewBase.prototype.beforeLoad = function(js) {
	WViewBase.notifyBeforeLoad(this, js);

	return;
}

WViewBase.prototype.afterLoad = function(js) {
	var view = this;
	WViewBase.notifyAfterLoad(this, js);

	cantkSetOnImageLoad(function() {
		view.postRedraw();
	});

	return;
}

WViewBase.prototype.loadJson = function(js) {
	var shape = null;

	if(!js || !js.pages) {
		this.pages = new Array();
		this.pages.push(this.initPage(0, null));
		this.currentPage = 0;
		this.showCurrentPage();

		return;
	}

	this.beforeLoad(js);
	if(this.autoResize) {
		this.xscale	= this.rect.w / js.w;
		this.yscale = this.rect.h / js.h;
		this.xscale	= this.xscale < this.yscale ? this.xscale: this.yscale;
		this.yscale	= this.xscale;
	}
	else {
		this.xscale	= 1;
		this.yscale = 1;
	}

	this.docid = js.docid ? js.docid : this.getDocID();
	this.meta = js.meta;
	this.pages = js.pages;
	this.currentPage = 0;
	this.loading = true;
	this.showCurrentPage();
	this.afterLoad(js);
	this.loading = false;

	return;
}

WViewBase.prototype.loadFromJson = function(jsonStr) {
	var js = this.parseJson(jsonStr);

	this.reset();
	this.loadJson(js);
	this.postRedraw();

	return;
}

WViewBase.prototype.onPageShow = function() {
}

WViewBase.prototype.showCurrentPage = function() {
	var shape = null;
	var shapes = this.pages[this.currentPage].shapes;
	
	if(!shapes) {
		shapes = this.pages[this.currentPage].glyphs;
	}
	this.allShapes.clear();

	if(shapes) {
		var factory = ShapeFactory.getInstance();
		for(var i = 0; i < shapes.length; i++) {
			var jsShape = shapes[i];
			var type = jsShape.type ? jsShape.type : jsShape.id;
			shape = factory.createShape(type, C_CREATE_FOR_PROGRAM);
			if(shape) {
				shape.fromJson(jsShape);
				this.addShape(shape);
			}
			else {
				console.log("createShape " + jsShape.type + " fail.");
			}
		}
	}

	this.onPageShow();
	this.postRedraw();

	return;
}

WViewBase.prototype.autoScale = function() {
	return;
}

WViewBase.prototype.getPageNr = function() {
	return this.pages ? this.pages.length : 0;
}

WViewBase.prototype.gotoPrevPage = function() {
	var total = this.pages.length;
	var n = this.currentPage - 1;

	if(n < 0) {
		n = n + total;
	}

	this.gotoPage(n);

	return;
}

WViewBase.prototype.gotoNextPage = function() {
	var total = this.pages.length;
	var n = this.currentPage + 1;

	if(n >= total) {
		n = n - total;
	}

	this.gotoPage(n);

	return;
}

WViewBase.prototype.gotoPage = function(n) {
	if(n < 0 || n >= this.getPageNr()) {
		return;
	}
	
	if(n === this.currentPage) {
		return;
	}

	this.saveCurrentPage();
	this.currentPage = n;
	this.showCurrentPage();

	return;
}

WViewBase.prototype.reset = function() {
	this.allShapes.clear();
	this.postRedraw();
	this.pages = [];
	this.pages.push(this.initPage(0, null));
	this.meta = null;
	this.currentPage = 0;
	this.docid = null;

	return;
}

WViewBase.prototype.translatePoint = function(p) {
	var point = {x:(p.x-this.rect.x), y:(p.y-this.rect.y)};

	point.x = Math.round(point.x/this.xscale);
	point.y = Math.round(point.y/this.yscale);

	return point; 
}

WViewBase.prototype.addShape = function(shape) {
	this.allShapes.push(shape);
	shape.setView(this);
	shape.setApp(this.getApp());

	if(this.creatingShape) {
		this.removeShape(this.creatingShape);
		this.creatingShape = null;
	}

	if(shape.state !== Shape.STAT_NORMAL) {
		this.creatingShape = shape;
	}

	if(shape.mode != Shape.MODE_RUNNING && shape.isUIDevice) {
		this.autoScale();
	}

	return;
}

WViewBase.prototype.removeShape = function(shape) {
	this.allShapes.remove(shape);
	shape.setView(null);
	shape.onRemoved();

	return;
}

WViewBase.prototype.getSelectedShapes = function(recursive) {
	var selectedShapes = [];

	for(var i = 0; i < this.allShapes.length; i++) {
		var shape = this.allShapes[i];
		
		if(shape.selected) {
			selectedShapes.push(shape);
			continue;
		}

		if(recursive && shape.isContainer) {
			shape.findSelectedShapes(selectedShapes);
		}
	}

	return selectedShapes;
}

WViewBase.prototype.countShape = function(selected_only) {	
	if(!this.allShapes) {
		return 0;
	}

	var count = this.allShapes.length;

	if(selected_only) {
		var selectedShapes = this.getSelectedShapes(true);
		count = selectedShapes.length;
	}
	
	return count;
}

WViewBase.prototype.getSelectedShape = function() {	
	var selectedShapes = this.getSelectedShapes(true);

	if(selectedShapes.length) {
		return selectedShapes[0];
	}

	return null;
}

WViewBase.prototype.selectAll = function(selected) {
	for(var i = 0; i < this.allShapes.length; i++) {
		var shape = this.allShapes[i];
		
		shape.setSelected(selected);
	}	
	
	this.postRedraw();
	
	return;
}

WViewBase.prototype.beforePaint = function(canvas) {
	return;
}

WViewBase.prototype.afterPaint = function(canvas) {
	return;
}

WViewBase.prototype.drawSelf = function(rect) {
	this.postRedraw();

	return;
}

WViewBase.prototype.shouldShowLogo = function() {
	return false;
}

WViewBase.prototype.drawLogo = function() {
}

WViewBase.prototype.showPageIndicator = function() {
}

WViewBase.prototype.paintSelf = function(canvas) {
	var w = this.rect.w;
	var h = this.rect.h;
	var selectedShape = null;

	canvas.save();		
	canvas.beginPath();
	canvas.rect(0, 0, w, h);
	canvas.clip();

	canvas.beginPath();		
	
	canvas.save();
	this.beforePaint(canvas);
	
	canvas.shadowBlur = null;
	this.drawLogo(canvas);

	canvas.scale(this.xscale, this.yscale);
	for(var i = 0; i < this.allShapes.length; i++) {
		var shape = this.allShapes[i];
		if(shape.selected && !selectedShape && shape.isLine) {
			selectedShape = shape;
		}
		else {
			shape.paint(canvas);
		}
	}
	if(selectedShape) {
		selectedShape.paint(canvas);
	}
	this.afterPaint(canvas);
	canvas.restore();

	canvas.restore();
	
	var fontSize = h/30;
	if(fontSize > 10) {
		fontSize = 10;
	}

	this.showPageIndicator(canvas);

	return;
}

WViewBase.prototype.selectShapeByPoint = function(point, recursive) {
	for(var i = this.allShapes.length - 1; i >= 0; i--) {
		var shape = this.allShapes[i];
		if(shape.hitTest(point)) {

			if(shape.isContainer) {
				shape = shape.findShapeByPoint(point, recursive);
			}
			
			this.postRedraw();
			this.targetShape = null;

			if(shape.parentShape) {
				shape.parentShape.selected = false;
			}
			if(!shape.selected) {
				shape.setSelected(false);
			}
			shape.setSelected(!shape.selected);
			
			return shape;
		}
	}

	return null;
}

WViewBase.prototype.getMoveDeltaX = function() {
	return this.moveDeltaX;
}

WViewBase.prototype.getMoveDeltaY = function() {
	return this.moveDeltaY;
}

WViewBase.prototype.getMoveAbsDeltaX = function() {
	return this.moveAbsDeltaX;
}

WViewBase.prototype.getMoveAbsDeltaY = function() {
	return this.moveAbsDeltaY;
}

WViewBase.prototype.updateLastPointerPoint = function(point) {
	
	this.moveDeltaX = point.x - this.lastPointerPosition.x;
	this.moveDeltaY = point.y - this.lastPointerPosition.y;
	this.moveAbsDeltaX = point.x - this.pointerDownPosition.x;
	this.moveAbsDeltaY = point.y - this.pointerDownPosition.y;
	this.lastPointerPosition.x = point.x;
	this.lastPointerPosition.y = point.y;
	
	return;
}

WViewBase.prototype.onDoubleClick = function(p) {
	var point = this.translatePoint(p);
	var shape = this.targetShape;

	if(shape) {
		shape.onDoubleClick(point);
	}

	return;
}

WViewBase.prototype.onContextMenu = WViewBase.prototype.onLongPress = function(p) {
	var point = this.translatePoint(p);
	var shape = this.targetShape;

	if(shape) {
		shape.onLongPress(point);
	}

	return;
}

WViewBase.prototype.onGesture = function(gesture) {
	var shape = this.targetShape;

	if(shape) {
		shape.onGesture(gesture);
	}

	return;
}

WViewBase.beforeLoadCallBacks = [];
WViewBase.afterLoadCallBacks = [];

function registerViewBeforeLoadListener(func) {
	if(func) {
		WViewBase.beforeLoadCallBacks.push(func);
	}

	return;
}

function registerViewAfterLoadListener(func) {
	if(func) {
		WViewBase.afterLoadCallBacks.push(func);
	}

	return;
}

WViewBase.notifyBeforeLoad = function(view, js) {
	for(var i = 0; i < WViewBase.beforeLoadCallBacks.length; i++) {
		WViewBase.beforeLoadCallBacks[i](view, js);
	}

	return;
}

WViewBase.notifyAfterLoad = function(view, js) {
	for(var i = 0; i < WViewBase.afterLoadCallBacks.length; i++) {
		WViewBase.afterLoadCallBacks[i](this, js);
	}

	return;
}

WViewBase.prototype.getCreatingShape = function() {
	return null;
}

