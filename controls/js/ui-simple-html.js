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

	if(color) {
		this.colors.push(color);
	}
	
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

	if(el.style && el.style.color) {
		this.colors.pop();
	}

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

