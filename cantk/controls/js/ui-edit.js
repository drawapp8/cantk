/*
 * File:   ui-edit.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Single Line Editor
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIEdit
 * @extends UIElement
 * 单行编辑器。
 */

/**
 * @event onChanged
 * 文本变化时触发本事件。
 * @param {String} value 当前的文本。
 */

/**
 * @event onChanging
 * 文本正在变化时触发本事件。
 * @param {String} value 当前的文本。
 */

/**
 * @event onFocusIn
 * 得到输入焦点事件。
 */

/**
 * @event onFocusOut
 * 失去输入焦点事件。
 */
function UIEdit() {
	return;
}

UIEdit.prototype = new UIElement();
UIEdit.prototype.isUIEdit = true;

UIEdit.prototype.saveProps = ["leftMargin", "rightMargin", "inputType", "inputTips", "maxLength"];
UIEdit.prototype.initUIEdit = function(type, w, h, leftMargin, rightMargin, initText, bg, focusedBg) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setText(initText);
	this.leftMargin = leftMargin;
	this.rightMargin = rightMargin;
	this.setSizeLimit(60, 30, 1000, 80);
	this.setTextType(Shape.TEXT_INPUT);
	this.setImage(UIElement.IMAGE_DEFAULT, bg);
	this.setImage(UIElement.IMAGE_FOCUSED, focusedBg);
	this.setMargin(5, 5);
	this.setInputType("text");
	this.addEventNames(["onChanged", "onChanging", "onFocusIn", "onFocusOut"]);
	this.setTextAlignV("middle");
	this.setTextAlignH("left");
	this.maxLength = 1024;

	return this;
}

UIEdit.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUIButton) {
		return true;
	}

	return false;
}

UIEdit.prototype.textEditable = function(point) {
	return true;
}

UIEdit.prototype.getLocaleText = function(text) {
	if(text === " ") {
		return text;
	}

	if(this.inputType === "password" && text && text === this.text) {
		var str = "";
		var n = text.length;
		for(var i = 0; i < n; i++) {
			str = str + "*";
		}

		return str;
	}
	else {
		return text;
	}
}

UIEdit.prototype.drawText = function(canvas) {
	var y = this.h >> 1;
	var x = this.leftMargin;
	var text = this.getLocaleText(this.text);
	var width = this.w - x - this.rightMargin;
	var inputTips = this.inputTips;

	if((!text && !inputTips) || this.editing) {
		return;
	}
	
	canvas.save();
	canvas.font = this.style.getFont();
	if(text) {
		canvas.fillStyle = this.style.textColor;	
	}
	else {
		text = inputTips;
		canvas.fillStyle = "#E0E0E0";
	}

	canvas.beginPath();
	canvas.rect(0, 0, this.w - this.rightMargin, this.h);
	canvas.clip();

	canvas.textAlign = "left";
	canvas.textBaseline = "middle";
	canvas.fillText(text, x, y);

	canvas.restore();

	return;
}

UIEdit.prototype.isFocused = function() {
	return this.editing;
}

UIEdit.prototype.paintSelfOnly = function(canvas) {
	var image = this.getBgImage();

	if(image) {
		return;
	}

	canvas.beginPath();
	drawRoundRect(canvas, this.w, this.h, 8);
	canvas.fillStyle = this.style.fillColor;
	canvas.fill();
	canvas.strokeStyle = this.style.lineColor;
	canvas.lineWidth = this.isFocused() ? 4 : 2;
	canvas.stroke();

	return;
}

UIEdit.prototype.onClick = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}
	if(!this.isInDesignMode()) {
		this.editText();
	}

    return this.callOnClickHandler(point);
}

UIEdit.prototype.getWidth = function(withoutBorder) {
	var w = this.w;
	if(withoutBorder) {
		w = w - this.leftMargin - this.rightMargin;
	}

	return w;
}

UIEdit.prototype.getEditorRect = function() {
	var leftMargin = this.leftMargin || 0;
	var p = this.getPositionInView();
	var cp = CantkRT.getMainCanvasPosition();
	var vp = this.view.getAbsPosition();
	var scale = this.view.getViewScale();

	var canvasScale = UIElement.getMainCanvasScale();
	var x = (vp.x + (p.x + leftMargin) * scale)/canvasScale.x + cp.x;
	var y = (vp.y + p.y * scale)/canvasScale.y + cp.y;
	var w = (this.getWidth(true) * scale)/canvasScale.x;
	var h = (this.getHeight() * scale)/canvasScale.y;
	
	var rect = {x:x, y:y, w:w, h:h};
	if(this.isInDesignMode()) {
		var radtio = window.devicePixelRatio || 1;
		rect.x *= radtio;
		rect.y *= radtio;
		rect.w *= radtio;
		rect.h *= radtio;
	}

	return rect;
}

UIEdit.prototype.editText = function(point) {
	var me = this;
	if(this.textEditable(point)) {
		var shape = this;
		var text = this.getText();
		var rect = this.getEditorRect();
		var scale = this.getRealScale() / UIElement.getMainCanvasScale().y;
		var inputType = this.inputType ? this.inputType : "text";
		var fontSize = this.style.fontSize * scale;
		var editor = cantkShowInput(inputType, fontSize, text, rect.x, rect.y, rect.w, rect.h);

		shape.editing = true;
		editor.setTextColor(this.style.textColor);
		editor.showBorder(this.isInDesignMode());
        editor.show();

		function onChanged(text) {
			if(text !== shape.text) {
				shape.setText(text, true);
				shape.postRedraw();
			}
			else {
				shape.text = text;
			}
			
			editor.setOnChangedHandler(null);
	        editor.setOnChangeHandler(null);
			editor.hide();
			delete shape.editing;
			shape.callOnFocusOutHandler();

			return;
		}

		function onChange(text) {
			shape.callOnChangingHandler(text);
		}

		editor.setMaxLength(me.maxLength || 1024);
		editor.setOnChangedHandler(onChanged);
		editor.setOnChangeHandler(onChange);

		this.callOnFocusInHandler();
	}

	return;
}

UIEdit.prototype.drawTextTips = function(canvas) {
}

function UIEditCreator(w, h, leftMargin, rightMargin, bg, focusedBg) {
	var args = ["ui-edit", "ui-edit", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIEdit();
		return g.initUIEdit(this.type, w, h, leftMargin, rightMargin, dappGetText("Edit"), bg, focusedBg);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIEditCreator(120, 50, 12, 12, null, null));

