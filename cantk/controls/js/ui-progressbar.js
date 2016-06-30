/*
 * File:   ui-progressbar.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Slider/ProgressBar
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UISlider
 * @extends UIProgressBar 
 * 新版本中UISlider已经被弃用，API参见UIProgressBar
 *
 */

/**
 * @class UIProgressBar
 * @extends UIElement
 * 进度条。可以用setValue/getValue来设置/获取进度。缺省进度取值范围0-100，也可以用setRange来设置它的取值范围。
 *
 * 在进度条上放一张图片，可以把进度条变成一个滑块控件。
 *
 * 进度条有3种表现形式：
 * 
 * 1.宽度大于高度时为水平进度条。

 * 2.宽度小于高度时为垂直进度条。
 * 
 * 3.宽度约等于高度时为环状进度条。
 *
 *     @example small frame
 *     this.win.find("progressbar").setValue(50, true, true);
 *
 */

/**
 * @event onChanged
 * 进度变化时触发本事件。
 * @param {Number} value 当前的进度。
 */

/**
 * @event onChanging
 * 进度正在变化时触发本事件。只有做为滑块控件时，拖动滑块才会触发本事件。
 * @param {Number} value 当前的进度。
 */
function UIProgressBar() {
	return;
}

UIProgressBar.prototype = new UIElement();
UIProgressBar.prototype.isUIProgressBar = true;
UIProgressBar.prototype.saveProps = ["stepSize", "minValue", "maxValue"];
UIProgressBar.prototype.initUIProgressBar = function(type, w, h, interactive) {
	this.initUIElement(type);	

	this.setRange(0, 100);
	this.setPercent(50);
	this.setDefSize(w, h);
	this.setStepSize(0);
	this.roundRadius = 0;
	this.setInteractive(interactive);
	this.setTextType(Shape.TEXT_INPUT);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.setImage(UIElement.IMAGE_NORMAL_FG, null);
	this.images.display = UIElement.IMAGE_DISPLAY_9PATCH;

	if(interactive) {
		this.addEventNames(["onChanged"]);
		this.addEventNames(["onChanging"]);
	}

	return this;
}

UIProgressBar.prototype.shapeCanBeChild = function(shape) {
	if(this.dragger) {
		return false;
	}

	return (shape.isUIImage || shape.isUILabel || shape.isUIColorTile);
}

UIProgressBar.prototype.updateDraggerParams =function() {
	var shape = this.dragger;
	if(!shape) return;

	if(this.w < this.h) {
		shape.yAttr = UIElement.Y_FIX_TOP;
		shape.xAttr = UIElement.X_CENTER_IN_PARENT;
		shape.widthAttr = UIElement.WIDTH_FILL_PARENT;
		shape.heightAttr = UIElement.HEIGHT_FIX;
	}
	else {
		shape.yAttr = UIElement.Y_MIDDLE_IN_PARENT;
		shape.xAttr = UIElement.X_FIX_LEFT;
		shape.widthAttr = UIElement.WIDTH_FIX;
		shape.heightAttr = UIElement.HEIGHT_FILL_PARENT;
	}
}

UIProgressBar.prototype.relayoutChildren = function() {
	if(!this.dragger) {
		return;
	}

	if(this.w > this.h) {
		var x = this.value * (this.w - this.dragger.w);	
		var maxX = this.w - this.dragger.w;
		this.dragger.setLeft(Math.max(0, Math.min(maxX, x)));
	}
	else {
		var y = (1-this.value) * (this.h - this.dragger.h);
		var maxY = this.h - this.dragger.h;
		this.dragger.setTop(Math.max(0, Math.min(maxY, y)))
	}

	UIElement.prototype.relayoutChildren.call(this);

	return;
}

UIProgressBar.prototype.resizeDragger =function() {
	if(this.dragger) {
		var w = this.dragger.w;
		var h = this.dragger.h;
		if(this.w > this.h) {
			h = this.h;
			w = Math.min(this.h, w);
		}
		else {
			w = this.w;
			h = Math.min(this.w, h);
		}
		this.dragger.setSize(w, h);
	}

	return this;
}

/**
 * @method setStepSize
 * 设置Slider的步长。
 * @param {Number} stepSize 取值范围0-50，0表示平滑移动。
 * @return {UIElement} 返回控件本身。
 *
 * 示例：
 *
 *     @example small frame
 *     var win = this.win;
 *     var slider = win.find("slider");
 *     slider.setStepSize(20);
 */
UIProgressBar.prototype.setStepSize = function(stepSize) {
	var range = this.maxValue - this.minValue;
	this.stepSize = Math.max(0, Math.min(stepSize, range));

	return this;
}

/**
 * @method setRange 
 * 设置进度条的取值范围。
 * @param {Number} minValue 最小值。
 * @param {Number} maxValue 最大值。
 * @return {UIElement} 返回控件本身。
 *
 * 示例：
 *
 *     @example small frame
 *     var win = this.win;
 *     var slider = win.find("slider");
 *     slider.setRange(0, 5);
 *     slider.setStepSize(1);
 */
UIProgressBar.prototype.setRange = function(minValue, maxValue) {
	this.minValue = Math.max(0, Math.min(minValue, maxValue));
	this.maxValue = Math.max(0, Math.max(minValue, maxValue));

	if(this.minValue === this.maxValue) {
		this.minValue = 0;
		this.maxValue = 100;
	}

	return this;
}

/**
 * @method getStepSize
 * 获取Slider的步长。
 * @return {Number} Slider的步长。
 */
UIProgressBar.prototype.getStepSize = function() {
	return this.stepSize || 0;
}

/**
 * @method getMinValue
 * 获取范围的最小值。可以用setRange来设置取值范围。
 * @return {Number} 范围的最小值。
 */
UIProgressBar.prototype.getMinValue = function() {
	return this.minValue;
}

/**
 * @method getMaxValue
 * 获取范围的最大值。可以用setRange来设置取值范围。
 * @return {Number} 范围的最大值。
 */
UIProgressBar.prototype.getMaxValue = function() {
	return this.maxValue;
}

UIProgressBar.prototype.afterChildRemoved = function(shape) {
    if(shape === this.dragger) {
        this.dragger = null;
    }
}

UIProgressBar.prototype.afterChildAppended =function(shape) {
	var bar = this;
	
	this.dragger = shape;
	this.updateDraggerParams();
	this.setTextType(Shape.TEXT_NONE);

	bar.onPointerDownRunning = bar.onPointerMoveRunning = function(point, beforeChild) {
		if(beforeChild) {
			return;
		}

		var hw = this.dragger.w >> 1;
		var hh = this.dragger.h >> 1;
		if(this.pointerDown && this.dragger) {
			var x = point.x - hw;
			var y = point.y - hh;
			x = Math.min(Math.max(-2, x), this.w - hw + 2);
			y = Math.min(Math.max(-2, y), this.h - hh + 2);

			this.dragger.move(x, y);
		}
		
		return;
	}

	bar.onPointerUpRunning = function(point, beforeChild) {
		if(beforeChild) {
			return;
		}

		if(this.changed) {
			this.changed = false;
			this.callOnChangedHandler(this.getValue());
		}

		return;
	}

	bar.onSized = function() {
		var size = Math.min(this.w, this.h);
		this.updateLayoutParams();
		this.setPercent(this.getPercent());
		this.resizeDragger();
		this.updateDraggerParams();

		return;
	}

	shape.onSized = function() {
		bar.resizeDragger();
	}

	shape.onMoved = function() {
		var percent = 0;
		if(bar.w > bar.h) {
			var value = this.left/(bar.w - this.w);
			percent = value * 100;
			if(this.left <= 0) {
				percent = 0;
			}
			if((this.left + this.w) >= bar.w) {
				percent = 100;
			}
		}
		else {
			var value = (bar.h - this.h - this.top)/(bar.h - this.h);
			percent = value * 100;
			if(this.top <= 0) {
				percent = 100;
			}
			if((this.top + this.h) >= bar.h) {
				percent = 0;
			}
		}

		bar.changed = true;
		bar.setPercentOnly(percent);
		bar.callOnChangingHandler(bar.getValue());

		return;
	}
	
	return;
}

UIProgressBar.prototype.setInteractive = function(value) {
	this.interactive = value;

	return this;
}

UIProgressBar.prototype.fixPercent = function(percent, stepSize) {
	var fixedPercent = percent;

	if(stepSize && percent < 100) {
		var range = this.maxValue - this.minValue;
		var value = Math.round(((percent/100) * range)/stepSize) * stepSize;
		fixedPercent = (value/range) * 100;
	}

	return Math.min(fixedPercent, 100)/100;
}

UIProgressBar.prototype.setPercentOnly = function(percent, notify, animation) {
	var stepSize = this.stepSize;
	var newValue = this.fixPercent(percent, this.stepSize);
	
	if(!animation) {
		this.value = newValue;
		this.relayoutChildren();
	}

	if(this.isInDesignMode() || !this.isVisible()) {
		return this;
	}

	if(!animation) {
		if(notify) {
			this.callOnChangedHandler(this.getValue());
		}
	}
	else {
		if(this.value == newValue) return this;
		this.setupAnimation({
			notify: notify,
			valueStart: this.value,
			valueEnd: newValue
		});
	}

	return this;
}

UIProgressBar.prototype.setupAnimation = function(config) {
	var me = this;
	var def = {
		duration: 300,
		actionWhenBusy: 'replace',
		onStep: function(ui, timePercent, config) {
			me.value = config.value;
			me.relayoutChildren();
			return true;
		},
		onDone: function(ui, aniName) {
			me.value = config.valueEnd;
			if(config.notify) {
				me.callOnChangedHandler(me.getValue());	
			}
		}
	};

	if(!config) {
		config = def;
	}
	else {
		var keys = Object.keys(def);
		for(var i = 0, len = keys.length; i < len; i++) {
			var k = keys[i];
			if(!config[k]) {
				config[k] = def[k];
			}
		}
	}

	this.animate(config);

	return this;
}

UIProgressBar.prototype.setPercent = function(value, notify, animation) {
	value = Math.max(0, Math.min(value, 100));

	this.setPercentOnly(value, notify, animation);
	this.relayoutChildren();

	return this;
}

UIProgressBar.prototype.getPercent = function() {
	return this.value * 100;
}

UIProgressBar.prototype.getValue = function() {
	var range = this.maxValue - this.minValue;
	var value = this.minValue + this.value * range;
	var stepSize = this.stepSize;

	if(stepSize) {
		var fv = Math.floor((value/stepSize)) * stepSize;
        value = Math.max(value, fv);
	}

	return Math.min(this.maxValue, Math.round(value));
}

UIProgressBar.prototype.setValue = function(value, notify, animation) {
	var range = this.maxValue - this.minValue;
	var percent = 100 * ((value-this.minValue)/range);

	this.setPercent(percent, notify, animation);

	return this;
}

UIProgressBar.prototype.drawText = function(canvas) {
	var text = Math.round(this.getPercent()) + "%";

	if(!this.isTextColorTransparent()) {
		canvas.font = this.style.getFont();
		canvas.fillStyle = this.getTextColor();
		canvas.textBaseline = "middle";
		canvas.textAlign = "center";

		canvas.fillText(text, this.w >> 1, this.h >> 1);
	}

	return;
}

UIProgressBar.prototype.paintSelfOnly = function(canvas) {
}

UIProgressBar.prototype.drawBgImageV = function(canvas) {
	var image = null;
	var w = this.w >> 1;
	var x = (this.w - w)>> 1;
	var fgColor = this.style.lineColor;
	var bgColor = this.style.fillColor;
	var r = this.roundRadius ? this.roundRadius : 0;
	var wImage = this.getImageByType(UIElement.IMAGE_DEFAULT);
	if(wImage && wImage.getImage()) {
		var rect = wImage.getImageRect();
		
		image = wImage.getImage();
		if(this.images.display === UIElement.IMAGE_DISPLAY_SCALE) {
			WImage.draw(canvas, image, UIElement.IMAGE_DISPLAY_SCALE, 0, 0, this.w, this.h, rect);
		}
		else {
			WImage.draw(canvas, image, UIElement.IMAGE_DISPLAY_9PATCH, x, 0, w, this.h, rect);
		}
	}
	else if(!Shape.isTransparentColor(bgColor)) {
		canvas.beginPath();
		canvas.translate(x, 0);
		drawRoundRect(canvas, w, this.h, r);
		canvas.translate(-x, 0);
		canvas.fillStyle = this.style.fillColor;
		canvas.fill();
	}

	wImage = this.getImageByType(UIElement.IMAGE_NORMAL_FG);

	var h = Math.round(this.h * this.value);
	var y = this.h - h;

	if(wImage && wImage.getImage()) {
		var rect = wImage.getImageRect();
		image = wImage.getImage();

		if(this.images.display === UIElement.IMAGE_DISPLAY_SCALE) {
			var tmph = rect.h;
			var tmpy = rect.y;
			var tmprh = rect.rh;
			var ih = Math.round(tmph*this.value);
			rect.h = ih;
			rect.y = rect.y + tmph - ih;
			rect.h = ih;
			rect.rh = Math.round(tmprh*this.value);  
			WImage.draw(canvas, image, UIElement.IMAGE_DISPLAY_SCALE, 0, y, this.w, h, rect);
			rect.y = tmpy;
			rect.h = tmph;
			rect.rh = tmprh;
		}
		else {
			WImage.draw(canvas, image, UIElement.IMAGE_DISPLAY_9PATCH, x, y, w, h, rect);
		}
	}
	else if(!Shape.isTransparentColor(fgColor)) {
		if(h > 2 * r) {
			canvas.beginPath();
			canvas.translate(x, y);
			drawRoundRect(canvas, w, h, r);
			canvas.fillStyle = this.style.lineColor;
			canvas.fill();
		}
	}

	return;
}

UIProgressBar.prototype.drawBgImageH = function(canvas) {
	var image = null;
	var h = this.h >> 1;
	var y = (this.h - h)>> 1;
	var fgColor = this.style.lineColor;
	var bgColor = this.style.fillColor;
	var r = this.roundRadius ? this.roundRadius : 0;

	var wImage = this.getImageByType(UIElement.IMAGE_DEFAULT);
	if(wImage && wImage.getImage()) {
		var rect = wImage.getImageRect();
		
		image = wImage.getImage();
		if(this.images.display === UIElement.IMAGE_DISPLAY_SCALE) {
			WImage.draw(canvas, image, UIElement.IMAGE_DISPLAY_SCALE, 0, 0, this.w, this.h, rect);
		}
		else {
			WImage.draw(canvas, image, UIElement.IMAGE_DISPLAY_9PATCH, 0, y, this.w, h, rect);
		}
	}
	else if(!Shape.isTransparentColor(bgColor)) {
		canvas.beginPath();
		canvas.translate(0, y);
		drawRoundRect(canvas, this.w, h, r);
		canvas.translate(0, -y);
		canvas.fillStyle = this.style.fillColor;
		canvas.fill();
	}

	var w = Math.round(this.w * this.value);
	var wImage = this.getImageByType(UIElement.IMAGE_NORMAL_FG);
	if(wImage && wImage.getImage()) {
		var rect = wImage.getImageRect();

		image = wImage.getImage();
		if(this.images.display === UIElement.IMAGE_DISPLAY_SCALE) {
			var tmpw = rect.w;
			var tmprw = rect.rw;
			rect.w = Math.round(rect.w*this.value);
			rect.rw = Math.round(rect.rw*this.value);
			WImage.draw(canvas, image, UIElement.IMAGE_DISPLAY_SCALE, 0, 0, w, this.h, rect);
			rect.w = tmpw; 
			rect.rw= tmprw;
		}
		else {
			WImage.draw(canvas, image, UIElement.IMAGE_DISPLAY_9PATCH, 0, y, w, h, rect);
		}
	}
	else if(!Shape.isTransparentColor(fgColor)) {
		if(w > 2 * r) {
			canvas.beginPath();
			canvas.translate(0, y);
			drawRoundRect(canvas, w, h, r);
			canvas.fillStyle = this.style.lineColor;
			canvas.fill();
		}
	}

	return;
}

UIProgressBar.prototype.drawCircle = function(canvas) {
	var cx = this.w >> 1;
	var cy = this.h >> 1;
	var r = Math.min(cx, cy);
	var angle = Math.PI * 2 * this.value - 0.5 * Math.PI;
	var lineWidth = Math.min(r, Math.max(this.style.lineWidth, 5));
	
	var fgImage = this.getImageByType(UIElement.IMAGE_NORMAL_FG);
	var bgImage = this.getImageByType(UIElement.IMAGE_DEFAULT);

	if(bgImage && bgImage.getImage()) {
		var image = bgImage.getImage();
		var rect = bgImage.getImageRect();
		WImage.draw(canvas, image, UIElement.IMAGE_DISPLAY_SCALE, 0, 0, this.w, this.h, rect);
	}
	else if(!this.isFillColorTransparent()) {
		canvas.beginPath();
		canvas.arc(cx, cy, r, 0, Math.PI * 2);
		
		canvas.fillStyle = this.style.fillColor;
		canvas.fill();
	}

	if(fgImage && fgImage.getImage()) {
		canvas.beginPath();
		canvas.moveTo(r, r);
		canvas.lineTo(r, 0)
		canvas.arc(cx, cy, r, -Math.PI * 0.5, angle);
		canvas.lineTo(r, r)
		canvas.clip();

		var image = fgImage.getImage();
		var rect = fgImage.getImageRect();
		WImage.draw(canvas, image, UIElement.IMAGE_DISPLAY_SCALE, 0, 0, this.w, this.h, rect);
	}
	else if(!this.isStrokeColorTransparent()) {
		r = r - (lineWidth >> 1);
		
		canvas.beginPath();
		canvas.lineCap = 'round';
		canvas.lineWidth = lineWidth;
		canvas.arc(cx, cy, r, -Math.PI * 0.5, angle);
		
		canvas.strokeStyle = this.style.lineColor;
		canvas.stroke();
	}

	return;
}

UIProgressBar.prototype.drawBgImage = function(canvas) {
	canvas.save();
	if(Math.abs(this.w - this.h) < 10) {
		this.drawCircle(canvas);
	}
	else if(this.w > this.h) {
		this.drawBgImageH(canvas);
	}
	else {
		this.drawBgImageV(canvas);
	}
	canvas.restore();
}

UIProgressBar.prototype.onFromJsonDone = function() {
	this.setPercent(this.getPercent());

	return;
}

function UIProgressBarCreator(w, h, interactive) {
	var type = interactive ? "ui-slider" : "ui-progressbar";
	var args = [type, "ui-progressbar", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIProgressBar();
		return g.initUIProgressBar(this.type, w, h, interactive);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIProgressBarCreator(200, 45, false));
ShapeFactoryGet().addShapeCreator(new UIProgressBarCreator(200, 45, true));

