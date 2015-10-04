/*
 * File:   ui-html.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  HTML 
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIHtml() {
	return;
}

UIHtml.prototype = new UIElement();
UIHtml.prototype.isUIHtml = true;

UIHtml.prototype.initUIHtml = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);

	return this;
}

UIHtml.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIHtml.prototype.drawBgImage =function(canvas) {
	if(this.mode === Shape.MODE_EDITING || this.isIcon) {
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

UIHtml.prototype.setVisible = function(visible) {
	if(this.visible != visible) {
		if(visible) {
			this.onShowHTML();
		}
		else {
			this.onHideHTML();
		}
		this.visible = visible;
	}

	return this;
}

UIHtml.prototype.showHTMLElement = function() {
	var el = this.element;
	if(el) {
		var scale = this.getRealScale();
		var p = this.getPositionInView();
		var x = p.x * scale + this.view.getX();
		var y = p.y * scale + this.view.getY();
		var w = this.w * scale;
		var h = this.h * scale;
		
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
	this.createHTMLElement("div");
	this.element.innerHTML = this.getHtmlContent();
	this.element.style.overflow = this.scrollable ? "scroll" : "hidden";
	this.element.style.zIndex = 5;
	this.element.style["-ms-touch-action"] = "auto";

	this.onSetElementStyle();

	if(this.mode != Shape.MODE_EDITING) {
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

	return;
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
