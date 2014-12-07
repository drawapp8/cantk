/*
 * File:   ui-edit.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Single Line Editor
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIEdit() {
	return;
}

UIEdit.prototype = new UIElement();
UIEdit.prototype.isUIEdit = true;

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

	if(!text || this.editing) {
		return;
	}
	
	canvas.save();
	canvas.font = this.style.getFont();
	canvas.fillStyle = this.style.textColor;	

	canvas.beginPath();
	canvas.rect(0, 0, this.w - this.rightMargin, this.h);
	canvas.clip();

	canvas.textAlign = "left";
	canvas.textBaseline = "middle";
	canvas.fillText(text, x, y);

	canvas.restore();

	return;
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
	if(this.mode !== Shape.MODE_EDITING) {
		this.editText();
	}

	return;
}

UIEdit.prototype.getWidth = function(withoutBorder) {
	var w = this.w;
	if(withoutBorder) {
		w = w - this.leftMargin - this.rightMargin;
	}

	return w;
}

UIEdit.prototype.setText = function(text, notTriggerChanged) {
	if(this.text != text) {
		this.text = this.toText(text);
		if(!notTriggerChanged) {
			this.callOnChangedHandler(text);
		}

		this.textNeedRelayout = true;
	}

	return;
}

UIEdit.prototype.getEditorRect = function() {
	var p = this.getPositionInView();
	var vp = this.view.getAbsPosition();
	var scale = this.view.getViewScale();
	var ox = vp.x;
	var oy = vp.y;

	var y = p.y * scale + oy;
	if(isMobile()) {
		var x = (p.x) * scale + ox;
		var w = this.getWidth() * scale;
	}
	else {
		var x = (p.x + this.leftMargin) * scale + ox;
		var w = this.getWidth(true) * scale;
	}
	var h = this.getHeight() * scale;

	var rect = {};
	
	scale = UIElement.getMainCanvasScale();
	rect.x = x / scale.x;
	rect.y = y / scale.y;
	rect.w = Math.max(60, w) / scale.x;
	rect.h = h / scale.y;

	return rect;
}

UIEdit.prototype.editText = function(point) {
	var me = this;
	if(this.textType && this.textEditable(point)) {
		var shape = this;
		var editor = null;
		var text = this.getText();
		var rect = this.getEditorRect();
		var scale = this.getRealScale() / UIElement.getMainCanvasScale().y;
		var inputType = this.inputType ? this.inputType : "text";

		editor = cantkShowInput(rect.x, rect.y, rect.w, rect.h);
		editor.setShape(shape);
		editor.setInputType(inputType);
		editor.removeBorder();
		editor.setFontSize(this.style.fontSize * scale);
		editor.setText(text);

		editor.element.onchange= function() {
			if(text !== this.value) {
				shape.setText(this.value);

				shape.callOnChangedHandler(shape.text);
				shape.postRedraw();
			}
			else {
				shape.text = text;
			}
			
			editor.element.onchange = null;
			editor.hide();

			shape.callOnFocusOutHandler();
			return;
		}

		editor.element.onkeyup = function(e) {
			shape.callOnChangingHandler(this.value);
		}

		this.callOnFocusInHandler();
	}

	return;
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

