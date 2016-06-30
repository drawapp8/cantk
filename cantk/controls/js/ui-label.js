/*
 * File:   ui-label.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Label
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UILabel
 * @extends UIElement
 * 用来显示文字内容。
 *
 */

/**
 * @event onChanged
 * 文本变化时触发本事件。
 * @param {String} value 当前的文本。
 */
function UILabel() {
	return;
}

UILabel.prototype = new UIElement();
UILabel.prototype.isUILabel = true;

UILabel.prototype.saveProps = ["hTextAlign", "vTextAlign", "singleLineMode"];

UILabel.prototype.initUILabel = function(type) {
	this.initUIElement(type);	

	this.setText("");
	this.setDefSize(200, 200);
	this.setMargin(5, 5);
	this.setTextType(Shape.TEXT_TEXTAREA);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.addEventNames(["onChanged", "onUpdateTransform"]);


	return this;
}

/**
 * @method setTextAlign
 * 设置控件上文本水平对齐方式。
 * @param {String} textAlign 水平对齐方式。可选值有"left","center","right"。
 * @return {UIElement} 返回控件本身。
 */
UILabel.prototype.setTextAlign = function(textAlign) {
	this.hTextAlign = textAlign;

	return this;
}

/**
 * @method setTextBaseline
 * 设置控件上文本垂直对齐方式。
 * @param {String} textBaseline 垂直对齐方式。可选值有"top","middle","bottom"。
 * @return {UIElement} 返回控件本身。
 */
UILabel.prototype.setTextBaseline = function(textBaseline) {
	this.vTextAlign = textBaseline;

	return this;
}

/**
 * @method getTextAlign
 * 获取控件上文本水平对齐方式。
 * @return {String} 返回水平对齐方式。
 */
UILabel.prototype.getTextAlign = function() {
	return this.hTextAlign;
}

/**
 * @method getTextBaseline
 * 获取控件上文本垂直对齐方式。
 * @return {String} 返回垂直对齐方式。
 */
UILabel.prototype.getTextBaseline = function() {
	return this.vTextAlign;
}

UILabel.prototype.shapeCanBeChild = function(shape) {
	return shape.isUILabel || shape.isUIImage;
}

UILabel.prototype.setText = function(text) {
	this.text = this.toText(text);
	this.textNeedRelayout = true;
	this.callOnChangedHandler(text);
	this.postRedraw();

	return this;
}

UILabel.prototype.drawText = function(canvas) {
	this.layoutText(canvas);
	
	this.defaultDrawText(canvas);

	return;
}

UILabel.prototype.layoutText = function(canvas) {
	RShape.prototype.layoutText.call(this, canvas);
	
	if(this.singleLineMode && this.lines.length > 1) {
		this.lines.length = 1;
	}

	return this;
}

/**
 * @method setSingleLineMode
 * 设置文本为单行模式。
 * @param {Boolean} value true表示单行模式，false表示多行模式。
 * @return {UIElement} 返回控件本身。
 */
UILabel.prototype.setSingleLineMode = function(value) {
	this.singleLineMode = value;
	this.setTextNeedRelayout(true);

	return this;
}

/**
 * @method getSingleLineMode
 * 设置文本是否为单行模式。
 * @return {Boolean} true表示单行模式，false表示多行模式。
 */
UILabel.prototype.getSingleLineMode = function() {
	return this.singleLineMode;
}

/**
 * @method fitToTextContent
 * 让控件自动适应文本的高度。
 * @return {UIElement} 返回控件本身。
 */
UILabel.prototype.fitToTextContent = function() {
	if(!this.text) {
		this.w = 30;
		this.h = 30;

		return;
	}

	var canvas = this.getCanvasContext2D();
	this.layoutText(canvas);

	var n = this.lines.length;
	var w = this.w;
	var h = this.getTextHeight() + this.vMargin * 2;

	if(n === 1) {
		var str = this.lines[0];
		w = canvas.measureText(str).width + 2 * this.hMargin;
	}

	this.w = w;
	this.h = h;

	return this;
}

function UILabelCreator() {
	var args = ["ui-label", "ui-label", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UILabel();
		return g.initUILabel(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UILabelCreator());

