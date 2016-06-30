/*
 * File:   ui-select.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Scrollable Select
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UISelect
 * @extends UIElement
 * 提供多个选项给用户，让用户选择其中一个。可以用getValue来获取用户选择的值。
 *
 */

/**
 * @event onChanged
 * 用户选择选项时触发本事件。
 * @param {String} value 当前的选项。
 */

function UISelect() {
	return;
}

UISelect.prototype = new UIElement();
UISelect.prototype.isUISelect = true;

UISelect.prototype.saveProps = ["visibleItems", "isVertical"];
UISelect.prototype.initUISelect = function(type, w, h) {
	this.initUIElement(type);
	
	this.offset = 0;
	this.options = [];
	this.visibleItems = 5;	
	this.setDefSize(w, h);
	this.isVertical = true;
	this.addEventNames(["onChanged"]);
	this.setTextType(UIElement.TEXT_TEXTAREA);
	this.setCanRectSelectable(false, true);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.images.display = UIElement.IMAGE_DISPLAY_9PATCH;

	return this;
}

UISelect.prototype.getItemSize = function() {
	var s = this.isVertical ? this.h : this.w;

	return Math.round(s/this.visibleItems);
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

UISelect.prototype.scrollTo = function(offsetEnd) {
	var itemSize = this.getItemSize();

	offsetEnd = Math.round(offsetEnd/itemSize) * itemSize;

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

	var delta = this.isVertical ? this.getMoveAbsDeltaY() : this.getMoveAbsDeltaX();
	this.setOffset(this.saveOffset + delta);

	return;
}

UISelect.prototype.getMaxOffset = function() {
	var n = Math.floor(0.5 * this.visibleItems);

	return n * this.getItemSize();
}

UISelect.prototype.getMinOffset = function() {
	var itemSize = this.getItemSize();

	var n = Math.round(0.5 * this.visibleItems);

	if(this.options.length <= n) {
		return 0;
	}
	else {
		return -(this.options.length-n)  * itemSize;
	}
}
	
UISelect.prototype.handleClicked = function(point) {
	var itemSize = this.getItemSize();
	var s = this.isVertical ? this.h : this.w;
	var m = Math.floor((s/2 - this.offset)/itemSize);
	var i = Math.floor(((this.isVertical ? point.y : point.x) - this.offset)/itemSize);

	var d = (i - m) * itemSize;
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

	var v = this.velocityTracker.getVelocity();
	var velocity = this.isVertical ? v.y : v.x;
	var delta = this.isVertical ? this.getMoveAbsDeltaY() : this.getMoveAbsDeltaX();
	if((Date.now() - this.pointerDownTime) > 400) {
		velocity = 0;
	}

	var distance = delta + velocity/2;

	if(Math.abs(distance) < 10) {
		this.setOffset(this.saveOffset);
		this.handleClicked(point);

		return;
	}

	var minOffset = this.getMinOffset();
	var maxOffset = this.getMaxOffset();
	var offset = this.saveOffset + delta + velocity;

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
UISelect.prototype.createOptionsFromText = function(text) {
	if(text) {
		this.options = text.split("\n");
		this.options.remove("");
	}
	else {
		this.options = [];
	}
}


UISelect.prototype.setText =function(text) {
	text = this.toText(text);
    this.createOptionsFromText(text);
	this._text = text;

	return this;
}

/**
 * @method setOptions
 * 设置控件的可选项。
 * @param {Array} options 可选项(字符串数组)。
 * @return {UIElement} 返回控件本身。
 *
 *     @example small frame
 *     var selector = this.win.find("select");
 *     selector.setOptions(["one", "two", "three"]);
 *
 */
UISelect.prototype.setOptions =function(options) {
	this.options = options || [];
	this.text = this.options.join("\n");

	return this;
}

/**
 * @method getOptions
 * 获取可选项。
 * @return {Array} 返回可选项(字符串数组)。
 */
UISelect.prototype.getOptions = function() {
	return this.options;
}


UISelect.prototype.drawText = function(canvas) {
	return;
}

UISelect.prototype.drawImage = function(canvas) {
	var w = this.w;
	var h = this.h;
	var itemSize = this.getItemSize();

	canvas.clipRect(0, 0, w, h);
	this.drawBgImage(canvas);

	var n = this.options.length;
	this.style.setTextB(false);
	var normalFont = this.style.getFont();
	var normalTxtColor = this.style.textColor;
	
	this.style.setTextB(true);
	var highlightFont = this.style.getFont();
	var highlightTextColor = this.style.textColorHighlight;

	canvas.textAlign = "center";
	canvas.textBaseline = "middle";

	var m = 0;
	var o = 0;
	var offset = this.offset;
	var isVertical = this.isVertical;
	var y = isVertical ? 0 : h >> 1;
	var x = isVertical ? w >> 1 : 0;
	var yOffset = isVertical ? offset : 0;
	var xOffset = isVertical ? 0 : offset;

	canvas.translate(xOffset, yOffset);
	if(isVertical) {
		m = Math.floor((0.5 * h - yOffset)/itemSize);
	}
	else {
		m = Math.floor((0.5 * w - xOffset)/itemSize);
	}

	var b = 0;
	var r = 0;
	for(var i = 0; i < n; i++) {
		var text = this.options[i];

		if(isVertical) {
			y = i * itemSize;
			b = y + itemSize;

			o = -offset;
			if(b < o && y < o) {
				continue;
			}

			o = -(offset - h);
			if(b > o && y > o) {
				continue;
			}
			y = y + (itemSize >> 1);
		}
		else {
			x = i * itemSize;
			r = x + itemSize;
			o = -offset;
			if(r < o && x < o) {
				continue;
			}

			o = -(offset - w);
			if(r > o && x > o) {
				continue;
			}
			x = x + (itemSize >> 1);
		}

		if(m == i) {
			canvas.font = highlightFont;
			canvas.fillStyle = highlightTextColor;
		}
		else {
			canvas.font = normalFont;
			canvas.fillStyle = normalTxtColor;
		}

		canvas.fillText(text, x, y, w);
	}

	return;
}

UISelect.prototype.getValue = function() {
	var offset = this.offset;
	var itemSize = this.getItemSize();
	var s = this.isVertical ? this.h : this.w;
	var i = Math.floor((0.5 * s - offset)/itemSize);

	var value = (i < this.options.length) ? this.options[i] : "";

	return value;
}

UISelect.prototype.setValueByIndex = function(index, animate) {
	var i = index;
	var itemSize = this.getItemSize();

	if(i >= 0) {
		var offset = -(i - (this.getVisibleItems()>> 1)) * itemSize;

		if(animate) {
			this.scrollTo(offset);
		}
		else {
			this.setOffset(offset, true);
		}
	}

	return this;
}

UISelect.prototype.setValue = function(value, notify, animate) {
	var i = this.options.indexOf(value.toString());

	this.setValueByIndex(i, animate);
	if(notify) {
		this.callOnChangedHandler(this.getValue());
	}

	return this;
}

Object.defineProperty(UISelect.prototype, "text", {
    set: function(txt) {
        txt = this.toText(txt);
        this.createOptionsFromText(txt);
        this._text = txt;
    },
    get: function() {
        return this._text;
    }
});

function UISelectCreator(w, h) {
	var args = ["ui-select", "ui-select", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISelect();
		return g.initUISelect(this.type, w, h);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UISelectCreator("ui-select", 300, 50));

