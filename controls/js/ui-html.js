/*
 * File:   ui-html.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  HTML 
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
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
	this.setTextType(C_SHAPE_TEXT_NONE);

	return this;
}

UIHtml.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIHtml.prototype.paintSelfOnly =function(canvas) {
	if(!this.htmlVisible) {
		canvas.beginPath();
		canvas.fillRect(0, 0, this.w, this.h);
	}

	return;
}

UIHtml.prototype.drawImage =function(canvas) {
	if(this.mode === C_MODE_EDITING || this.isIcon) {
		this.drawBgImage(canvas);
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

	return;
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
	this.element.style.marginLeft = "6px";
	this.element.style.marginTop = "6px";
	this.element.style.marginBottom = "6px";
	this.element.style.marginRight = "6px";

	return;
}

UIHtml.prototype.onShowHTML = function() {
	this.createHTMLElement("div");
	this.element.innerHTML = this.getHtmlContent();
	this.element.style.overflow = this.scrollable ? "scroll" : "hidden";
	this.element.style.zIndex = 5;
	this.element.style["-ms-touch-action"] = "auto";

	this.onSetElementStyle();

	if(this.mode != C_MODE_EDITING) {
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

function UIHtmlCreator(w, h) {
	var args = ["ui-html", "ui-html", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIHtml();
		return g.initUIHtml(this.type, w, h);
	}
	
	return;
}
