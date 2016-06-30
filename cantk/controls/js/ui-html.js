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
