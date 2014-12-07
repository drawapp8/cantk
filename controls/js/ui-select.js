/*
 * File:   ui-select.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Scrollable Select
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UISelect() {
	return;
}

UISelect.prototype = new UIElement();
UISelect.prototype.isUISelect = true;

UISelect.prototype.initUISelect = function(type, w, h) {
	this.initUIElement(type);
	
	this.offset = 0;
	this.options = [];
	this.visibleItems = 5;	
	this.setDefSize(w, h);
	this.addEventNames(["onInit", "onChanged"]);
	this.setTextType(Shape.TEXT_NONE);
	this.setCanRectSelectable(false, true);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.images.display = UIElement.IMAGE_DISPLAY_9PATCH;

	return this;
}

UISelect.prototype.getItemHeight = function() {
	return Math.round(this.h/this.visibleItems);
}

UISelect.prototype.getVisibleItems = function() {
	return this.visibleItems;
}

UISelect.prototype.setVisibleItems = function(visibleItems) {
	if(visibleItems <= 3) {
		this.visibleItems = 3;
	}
	else {
		this.visibleItems = 5;
	}
}

UISelect.prototype.setHighlightTextColor = function(color) {
	this.highlightTextColor = color;

	return;
}

UISelect.prototype.getHighlightTextColor = function() {
	return this.highlightTextColor ? this.highlightTextColor : this.style.textColor;
}


UISelect.prototype.scrollTo = function(offsetEnd) {
	var itemHeight = this.getItemHeight();

	offsetEnd = Math.round(offsetEnd/itemHeight) * itemHeight;

	var me = this;
	var duration = 500;
	var offsetStart = this.offset;
	var range = offsetEnd - offsetStart;
	var startTime = (new Date()).getTime();
	var interpolator =  new DecelerateInterpolator();

	this.animating = true;
	function animStep() {
		var now = new Date();
		var timePercent = (now.getTime() - startTime)/duration;
		var percent = interpolator.get(timePercent);

		if(timePercent < 1) {
			me.setOffset(Math.floor(offsetStart + percent * range));
			setTimeout(animStep, 10);
		}
		else {
			me.setOffset(offsetStart + range, true);
			delete startTime;
			delete interpolator;
			delete me.animating;
		}

		delete now;
	}

	setTimeout(function() {
		animStep();
	}, 10);

	return;
}

UISelect.prototype.setOffset = function(offset, triggerOnChanged) {
	this.offset = offset;
	this.postRedraw();

	if(triggerOnChanged) {
		var value = this.getValue();
		this.callOnChangedHandler(value);
	}

	return;
}

UISelect.prototype.onPointerDownRunning = function(point, beforeChild) {
	if(beforeChild || this.animating) {
		return;
	}

	if(!this.velocityTracker) {
		this.velocityTracker = new VelocityTracker();
	}
	this.velocityTracker.clear();
	this.saveOffset = this.offset;

	return true;
}

UISelect.prototype.onPointerMoveRunning = function(point, beforeChild) {
	if(beforeChild || this.animating) {
		return;
	}
	
	this.addMovementForVelocityTracker();

	var dy = this.getMoveAbsDeltaY();
	this.setOffset(this.saveOffset + dy);

	return;
}

UISelect.prototype.getMaxOffset = function() {
	var n = Math.floor(0.5 * this.visibleItems);

	return n * this.getItemHeight();
}

UISelect.prototype.getMinOffset = function() {
	var itemHeight = this.getItemHeight();

	var n = Math.round(0.5 * this.visibleItems);

	if(this.options.length <= n) {
		return 0;
	}
	else {
		return -(this.options.length-n)  * itemHeight;
	}
}
	
UISelect.prototype.handleClicked = function(point) {
	var itemHeight = this.getItemHeight();

	var m = Math.floor((this.h/2 - this.offset)/itemHeight);
	var i = Math.floor((point.y - this.offset)/itemHeight);

	var d = (i - m) * itemHeight;
	var offset = this.offset-d;
	var minOffset = this.getMinOffset();
	var maxOffset = this.getMaxOffset();

	if(offset < minOffset) {
		offset = minOffset;
	}

	if(offset > maxOffset) {
		offset = maxOffset;
	}
	
	this.scrollTo(offset);

	return;
}

UISelect.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(beforeChild || this.animating) {
		return;
	}

	var dy = this.getMoveAbsDeltaY();
	var velocity = this.velocityTracker.getVelocity().y;

	var distance = dy + velocity/2;

	if(Math.abs(distance) < 10) {
		this.setOffset(this.saveOffset);
		this.handleClicked(point);

		return;
	}

	var minOffset = this.getMinOffset();
	var maxOffset = this.getMaxOffset();
	var offset = this.saveOffset + dy + velocity;

	if(offset < minOffset) {
		offset = minOffset;
	}

	if(offset > maxOffset) {
		offset = maxOffset;
	}

	this.scrollTo(offset);

	return;
}

UISelect.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UISelect.prototype.setText =function(text) {
	text = this.toText(text);
	if(text) {
		this.options = text.split("\n");
		this.options.remove("");
	}
	else {
		this.options = [];
	}

	this.text = text;

	return this;
}

UISelect.prototype.drawImage = function(canvas) {
	var y = 0;
	var b = 0;
	var w = this.w;
	var h = this.h;
	var x = w >> 1;
	var offset = 0;
	var yOffset = this.offset;
	var itemHeight = this.getItemHeight();

	canvas.beginPath();
	canvas.rect(0, 0, w, h);
	canvas.clip();

	var n = this.options.length;

	var hasImage = this.getBgImage() != null;
	this.drawBgImage(canvas);
	if(!hasImage) {
		canvas.lineWidth = 3;
		canvas.strokeStyle = this.style.lineColor;
		canvas.beginPath();

		y = (this.visibleItems >> 1) * itemHeight;
		canvas.moveTo(5, y);
		canvas.lineTo(w-10, y);
		canvas.moveTo(5, y+itemHeight);
		canvas.lineTo(w-10, y+itemHeight);
		canvas.stroke();
	}

	this.style.setTextB(false);
	this.style.setFontSize(Math.floor(itemHeight * 0.5));
	var normalFont = this.style.getFont();
	var normalTxtColor = this.style.textColor;
	
	this.style.setTextB(true);
	this.style.setFontSize(Math.floor(itemHeight * 0.6));
	var highlightFont = this.style.getFont();
	var highlightTextColor = this.getHighlightTextColor();

	canvas.textAlign = "center";
	canvas.textBaseline = "middle";
	canvas.font = this.style.getFont();
	canvas.fillStyle = this.style.textColor;

	canvas.translate(0, yOffset);

	var m = Math.floor((0.5 * h - yOffset)/itemHeight);

	for(var i = 0; i < n; i++) {
		var text = this.options[i];

		y = i * itemHeight;
		b = y + itemHeight;

		offset = -yOffset;
		if(b < offset && y < offset) {
			continue;
		}

		offset = -(yOffset - h);
		if(b > offset && y > offset) {
			continue;
		}

		if(m == i) {
			canvas.font = highlightFont;
			canvas.fillStyle = highlightTextColor;
		}
		else {
			canvas.font = normalFont;
			canvas.fillStyle = normalTxtColor;
		}

		y = y + (itemHeight >> 1);
		canvas.fillText(text, x, y, w);
	}

	return;
}

UISelect.prototype.getValue = function() {
	var h = this.h;
	var yOffset = this.offset;
	var itemHeight = this.getItemHeight();
	var i = Math.floor((0.5 * h - yOffset)/itemHeight);

	var value = (i < this.options.length) ? this.options[i] : "";

	return value;
}

UISelect.prototype.setValueByIndex = function(index, animate) {
	var i = index;
	var itemHeight = this.getItemHeight();

	if(i >= 0) {
		var offset = -(i - (this.getVisibleItems()>> 1)) * itemHeight;

		if(animate) {
			this.scrollTo(offset);
		}
		else {
			this.setOffset(offset, true);
		}
	}

	return this;
}

UISelect.prototype.setValue = function(value, animate) {
	var i = this.options.indexOf(value.toString());

	this.setValueByIndex(i, animate);

	return this;
}

function UISelectCreator(w, h) {
	var args = ["ui-select", "ui-select", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISelect();
		return g.initUISelect(this.type, w, h);
	}
	
	return;
}

