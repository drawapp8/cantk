/*
 * File: drawing_view.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: the base class of the drawing view.
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

var gGridImage = null;


var gBeforeLoadCallBacks = [];
var gAfterLoadCallBacks = [];

function registerViewBeforeLoadListener(func) {
	if(func) {
		gBeforeLoadCallBacks.push(func);
	}

	return;
}

function registerViewAfterLoadListener(func) {
	if(func) {
		gAfterLoadCallBacks.push(func);
	}

	return;
}

function notifyViewBeforeLoad(view, js) {
	for(var i = 0; i < gBeforeLoadCallBacks.length; i++) {
		gBeforeLoadCallBacks[i](view, js);
	}

	return;
}

function notifyViewAfterLoad(view, js) {
	for(var i = 0; i < gAfterLoadCallBacks.length; i++) {
		gAfterLoadCallBacks[i](this, js);
	}

	return;
}

function ViewBase(parent, x, y, w, h) {
	this.type = C_WIDGET_TYPE_USER;
	Widget.apply(this, arguments);
	
	this.grid = 10;
	this.showGrid = true;
	this.snapGrid = false;
	this.fillColor = "white";
	this.autoResize = false;	
	this.allShapes = new Array();
	this.theme = new Array();
	this.xscale	= 1.0;
	this.yscale = 1.0;
	
	this.pointerDownPosition = new Point(0, 0);
	this.lastPointerPosition = new Point(0, 0);

	this.theme.push(new Gc("18px sans-serif", "#FFFFFF", "#000000", null));
	this.theme.push(new Gc("18px sans-serif", "#FFFFFF", "#000000", null));
	this.theme.push(new Gc("18px sans-serif", "#FFFFFF", "#000000", null));
	this.theme.push(new Gc("18px sans-serif", "#FFFFFF", "#D0D0D0", null));
       
    this.getScale = function() {
    	return this.xscale;
    }
    
    this.getViewScale = function() {
    	return this.getScale();
    }

	this.onShapeSelected = function(shape) {
		this.getApp().onShapeSelected(shape);

		return;
	}

	this.setFillColor = function(bg) {
		this.fillColor = bg;
		for(var i = 0; i < this.theme.length; i++) {
			this.theme[i].bg = bg;
		}
		
		return;
	}
	
	this.setGrid = function(showGrid, snapGrid) {
		this.showGrid = showGrid;
		this.snapGrid = snapGrid;
		
		return;
	}
	
	this.setShowGrid = function(showGrid) {
		this.showGrid = showGrid;
		
		return;
	}
	
	this.setSnapGrid = function(snapGrid) {
		this.snapGrid = snapGrid;
		
		return;
	}


	this.snapToGrid = function(x, y) {
		var xx = x;
		var yy = y;

		if(this.snapGrid) {
			xx = Math.floor((x + this.grid/2) / this.grid) * this.grid;
			yy = Math.floor((y + this.grid/2) / this.grid) * this.grid;
		}

		return {x: xx, y: yy};
	}

	this.setAutoResize = function() {
		this.autoResize = true;

		return;
	}

	this.initPage = function(index, shapes) {
		var page = new Object();

		page.index = index ? index : 0;
		page.shapes = shapes ? shapes : (new Array());

		return page;
	}

	this.getPages = function() {
		return this.pages;
	}

	this.newPage = function() {
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
	
	this.removeCurrentPage = function() {
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

	this.removePage = function(index) {
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

	this.saveCurrentPage = function() {
		var shapes = new Array();

		for(var i = 0; i < this.allShapes.length; i++) {
			var shape = this.allShapes[i];
			shapes.push(shape.toJson());
		}

		this.pages[this.currentPage] = this.initPage(this.currentPage, shapes);

		return;
	}

	this.setMetaInfo = function(meta) {
		this.meta = meta;

		return;
	}

	this.getMetaInfo = function() {
		return this.meta;
	}

	this.getDocID = function() {
		return this.docid ? this.docid : (Math.round(Math.random() * 100) + "" + Date.now());
	}

	this.saveAsJson = function() {
		var o = new Object();
		var page = null;
		var types = ShapeFactoryGet().getDiagramTypes();

		this.saveCurrentPage();

		o.w = this.rect.w;
		o.h = this.rect.h;
		o.fillColor = this.fillColor;
		o.version = 1.0;
		o.magic = "5idraw";
		o.scale = this.xscale;
		o.type = this.type ? this.type : types[0].name;
		o.docid = this.getDocID();
		o.meta = this.meta;
		o.pages = this.pages;

		var js = JSON.stringify(o, null, "\t");
	
		return js;
	}
	
	this.parseJson = function(json_str) {
		var js = null;
		var shape = null;
		
		try {
			if(json_str) {
				js = JSON.parse(json_str);
				this.reset();
			}
		}
		catch(e) {
			ret = false;
			console.log("JSON.parse failed:" + e.message);
			console.log("JSON.parse failed:" + json_str);
		}

		if(!js) return null;

		if(!js.magic || js.magic !== "5idraw") {
			console.log("Not supported type");

			return null;
		}

		return js;
	}
	
	this.beforeLoad = function(js) {
		notifyViewBeforeLoad(this, js);

		return;
	}

	this.afterLoad = function(js) {
		notifyViewAfterLoad(this, js);

		var view = this;
		setRefreshAfterImageLoaded(function() {
			view.postRedraw();
		});
		return;
	}

	this.loadJson = function(js) {
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
		this.fillColor = js.fillColor;
		this.loading = true;
		this.showCurrentPage();
		
		if(js.scale) {
			this.xscale = js.scale;
			this.yscale = js.scale;
		}

		this.afterLoad(js);
		this.loading = false;

		return;
	}

	this.loadFromJson = function(json_str) {
		var js = this.parseJson(json_str);

		var view = this;
		if(js && js.type === "EDA") {
			setTimeout(function() {
				view.loadJson(js);
			}, 1500);
		}
		else {
			this.loadJson(js);
			setTimeout(function() {
				view.postRedraw();
			}, 500);
		}

		return;
	}

	this.onPageShow = function() {
	}

	this.showCurrentPage = function() {
		var shape = null;
		var shapes = this.pages[this.currentPage].shapes;
		
		if(!shapes) {
			shapes = this.pages[this.currentPage].glyphs;
		}
		this.allShapes.clear();

		if(shapes) {
			var maxhOfShape = 0;
			for(var i = 0; i < shapes.length; i++) {
				var jsShape = shapes[i];
				var type = jsShape.type ? jsShape.type : jsShape.id;
				shape = ShapeFactoryGet().createShape(type, C_CREATE_FOR_PROGRAM);
				if(shape) {
					shape.fromJson(jsShape);
					this.addShape(shape);
					if(shape.h > maxhOfShape) {
						maxhOfShape = shape.h;
					}
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

	this.autoScale = function() {
		var maxShape = null;

		for(var i = 0; i < this.allShapes.length; i++) {
			var shape = this.allShapes[i];
			if(!maxShape) {
				maxShape = shape;
			}
			else if((shape.h + shape.w) > (maxShape.h + maxShape.w)) {
				maxShape = shape;
			}
		}

		if(maxShape) {
			var xscale = maxShape.w / this.rect.w;
			var yscale = maxShape.h / this.rect.h;
			if(xscale > 0.8 || yscale > 1.4) {
				if(xscale > 1.2 || yscale > 2) {
					this.zoomTo(0.5);
				}
				else {
					this.zoomTo(0.7);
				}
			}
			else {
				this.zoomTo(1.0);
			}
		}

		return;
	}

	this.getPageNr = function() {
		
		return this.pages ? this.pages.length : 0;
	}
	
	this.gotoPrevPage = function() {
		var total = this.pages.length;
		var n = this.currentPage - 1;

		if(n < 0) {
			n = n + total;
		}

		this.gotoPage(n);

		return;
	}
	
	this.getPagesNr = function() {
		return this.pages.length;
	}

	this.gotoNextPage = function() {
		var total = this.pages.length;
		var n = this.currentPage + 1;

		if(n >= total) {
			n = n - total;
		}

		this.gotoPage(n);

		return;
	}

	this.gotoPage = function(n) {
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
	
	this.reset = function() {
		this.allShapes.clear();
		this.postRedraw();
		this.pages = new Array();
		this.pages.push(this.initPage(0, null));
		this.meta = null;
		this.currentPage = 0;
		this.docid = null;

		return;
	}

	this.translatePoint = function(p) {
		var point = {x:(p.x-this.rect.x), y:(p.y-this.rect.y)};

		point.x = Math.round(point.x/this.xscale);
		point.y = Math.round(point.y/this.yscale);

		return point; 
	}

	this.canZoomIn = function() {
		return this.xscale < 2 && this.yscale < 2;
	}

	this.canZoomOut = function() {
		return this.xscale > 0.5 && this.yscale > 0.5;
	}

	this.onZoomed = function() {
		return;
	}

	this.zoomTo = function(scale) {
		var maxShape = null;
		
		for(var i = 0; i < this.allShapes.length; i++) {
			var shape = this.allShapes[i];
			if(!maxShape) {
				maxShape = shape;
			}
			else if((shape.h + shape.w) > (maxShape.h + maxShape.w)) {
				maxShape = shape;
			}
		}
	
		if(!this.loading && maxShape && maxShape.isUIDevice) {
			var delta = this.xscale - scale;
			maxShape.x = Math.floor(maxShape.x + maxShape.x * delta);
			maxShape.y = Math.floor(maxShape.y + maxShape.y * delta);
		}

		this.xscale = scale;
		this.yscale = scale;
		this.onZoomed();
		this.postRedraw();

		return;
	}

	this.zoomIn = function() {
		if(this.canZoomIn()) {
			this.zoomTo(this.xscale * 1.25);
		}

		return;
	}
	
	this.zoomOut = function() {
		if(this.canZoomOut()) {
			this.zoomTo(this.xscale * 0.75);
		}
		
		return;
	}
	
	this.getCreatingShape = function() {
		return this.creatingShape;
	}

	this.addShape = function(shape) {
		this.allShapes.push(shape);
		shape.setView(this);
		shape.setApp(this.getApp());

		if(this.creatingShape) {
			this.removeShape(this.creatingShape);
			this.creatingShape = null;
		}

		if(shape.state !== C_STAT_NORMAL) {
			this.creatingShape = shape;
		}

		if(shape.mode != C_MODE_RUNNING && shape.isUIDevice) {
			this.autoScale();
		}

		return;
	}
	
	this.removeShape = function(shape) {
		this.allShapes.remove(shape);
		shape.setView(null);
		shape.onRemoved();

		return;
	}

	this.getSelectedShapes = function(recursive) {
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

	this.countShape = function(selected_only) {	
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
	
	this.getSelectedShape = function() {	
		var selectedShapes = this.getSelectedShapes(true);

		if(selectedShapes.length) {
			return selectedShapes[0];
		}

		return null;
	}

	this.selectAll = function(selected) {
		for(var i = 0; i < this.allShapes.length; i++) {
			var shape = this.allShapes[i];
			
			shape.setSelected(selected);
		}	
		
		this.postRedraw();
		
		return;
	}
	
	this.beforePaint = function(canvas) {
		return;
	}
	
	this.afterPaint = function(canvas) {
		return;
	}

	this.drawSelf = function(rect) {
		this.postRedraw();

		return;
	}

	this.paintBackground = function(canvas) {
		this.canvas = canvas;

		if(!this.showGrid) {
			canvas.fillStyle = "White";
			canvas.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
			canvas.beginPath();
		}

		return;
	}

	this.drawGrid = function(canvas) {
		if(this.showGrid && this.grid) {
			var i = 0;
			var j = 0;
			var x = 0;
			var y = 0;
			var t = 0;
			var n = 0;
			var w = this.rect.w;
			var h = this.rect.h;
			var ox = this.rect.x;
			var oy = this.rect.y;
			var grid = this.grid;
			var s = grid - 1;
			var r = h / grid;
			var c = w / grid;
			var gridPerBigGrid = 5;
			var gridImage = gGridImage.getImage();

			if(gridImage) {
				var iw = gridImage.width;
				var ih = gridImage.height;
				var sw = 0;
				var sh = 0;
				preDrawGrids = iw / this.grid;

				var cn = c / preDrawGrids;
				var rn = r / preDrawGrids;
				for(i = 0; i < cn; i++) {
					x = i * preDrawGrids * grid;
					sw = Math.min(iw, ox + w - x);
					for(j = 0; j < rn; j++) {
						y = j * preDrawGrids * grid;

						sh = Math.min(ih, oy + h - y);
						canvas.drawImage(gridImage, x, y);
					}
				}
			}
		}
		return;
	}

	this.getLogoImage = function() {
		if(!this.logoImage) {
			this.logoImage = new Image();
			this.logoImage.src = dappGetLogoURL();
		}
			
		return this.logoImage;
	}

	this.shouldShowLogo = function() {
		return false;
	}

	this.drawLogo = function(canvas) {
		if(this.shouldShowLogo()) {
			var vp = getViewPort();
			var w = Math.min(this.rect.w, vp.width);
			var h = Math.min(this.rect.h, vp.height);

			var image = this.getLogoImage();
			if(image && image.width) {
				var iw = image.width;
				var ih = image.height;
				var x = w - iw - 60;
				var y = h - ih - 60 + getScrollTop();
				canvas.drawImage(image, x, y);
			}
		}

		return;
	}

	this.showPageIndicator = function(canvas) {
		var x = 0;
		var y = 0;
		var w = this.rect.w;
		var h = this.rect.h;
		var page = dappGetText("Page") + " " + (this.currentPage  + 1) + "/" + this.getPageNr();
		canvas.beginPath()
		canvas.textAlign = "right";
		canvas.textBaseline = "top";
		canvas.font = "18pt sans";
		canvas.fillStyle = "Gray";	
		x = this.parent.rect.w - 10;
		y = 30;
		canvas.fillText(page, x, y);

		return;
	}

	this.paintSelf = function(canvas) {
		var w = this.rect.w;
		var h = this.rect.h;
		var selectedShape = null;
		var p = this.getAbsPosition();

		canvas.save();		
		canvas.beginPath();
		canvas.rect(p.x, p.y, w, h);
		canvas.clip();

		canvas.beginPath();		
		
		canvas.save();
		this.beforePaint(canvas);
		canvas.translate(this.rect.x, this.rect.y);
		
		canvas.shadowBlur = 0;
		this.drawGrid(canvas);
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

		if(this.getPageNr() > 1) {
			this.showPageIndicator(canvas);
		}

		return;
	}

	this.selectShapeByPoint = function(point, recursive) {
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

	this.getMoveDeltaX = function() {
		return this.moveDeltaX;
	}

	this.getMoveDeltaY = function() {
		return this.moveDeltaY;
	}
	
	this.getMoveAbsDeltaX = function() {
		return this.moveAbsDeltaX;
	}

	this.getMoveAbsDeltaY = function() {
		return this.moveAbsDeltaY;
	}

	this.updateLastPointerPoint = function(point) {
		
		this.moveDeltaX = point.x - this.lastPointerPosition.x;
		this.moveDeltaY = point.y - this.lastPointerPosition.y;
		this.moveAbsDeltaX = point.x - this.pointerDownPosition.x;
		this.moveAbsDeltaY = point.y - this.pointerDownPosition.y;
		this.lastPointerPosition.x = point.x;
		this.lastPointerPosition.y = point.y;
		
		return;
	}
	
	this.onDoubleClick = function(p) {
		var point = this.translatePoint(p);
		var shape = this.targetShape;

		if(shape) {
			shape.onDoubleClick(point);
		}

		return;
	}
	
	this.onLongPress = function(p) {
		var point = this.translatePoint(p);
		var shape = this.targetShape;

		if(shape) {
			shape.onLongPress(point);
		}

		return;
	}
	
	this.onGesture = function(gesture) {
		var shape = this.targetShape;

		if(shape) {
			shape.onGesture(gesture);
		}

		return;
	}


	return;
}

