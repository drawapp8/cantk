/*
 * File:   ui-mledit.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Multi Line Editor
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIMLEdit() {
	return;
}

UIMLEdit.prototype = new UIElement();
UIMLEdit.prototype.isUIMLEdit = true;

UIMLEdit.prototype.initUIMLEdit = function(type, w, h, margin, initText, bg, focusedBg) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setText(initText);
	this.setTextType(C_SHAPE_TEXT_TEXTAREA);
	this.setImage(CANTK_IMAGE_DEFAULT, bg);
	this.setImage(CANTK_IMAGE_FOCUSED, focusedBg);
	this.setMargin(margin, margin);
	this.addEventNames(["onChanged", "onFocusIn", "onFocusOut"]);
	this.setTextAlignV("top");
	this.setTextAlignH("left");

	return this;
}

UIMLEdit.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIMLEdit.prototype.textEditable = function(point) {
	return true;
}

UIMLEdit.prototype.onClick = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}
	if(this.mode !== C_MODE_EDITING) {
		this.editText();
	}

	return;
}

UIMLEdit.prototype.getEditorRect = function() {
	var p = this.getPositionInView();
	var vp = this.view.getAbsPosition();
	var scale = this.view.getViewScale();
	var ox = vp.x;
	var oy = vp.y;

	var x = (p.x + this.hMargin) * scale + ox;
	var y = (p.y + this.vMargin) * scale + oy;
	var w = this.getWidth(true) * scale;
	var h = this.getHeight(true) * scale;
	
	var rect = {};

	scale = UIElement.getMainCanvasScale();
	rect.x = x / scale.x;
	rect.y = y / scale.y;
	rect.w = Math.max(60, w) / scale.x;
	rect.h = h / scale.y;

	return rect;
}

UIMLEdit.prototype.editText = function(point) {
	if(this.textType && this.textEditable(point)) {
		var shape = this;
		var editor = null;
		var rect = this.getEditorRect();
		var scale = this.getRealScale() / UIElement.getMainCanvasScale().y;
		var inputType = this.inputType ? this.inputType : "text";

		var text = this.getText();
		
		editor = cantkShowTextArea(rect.x, rect.y, rect.w, rect.h);
		editor.setShape(shape);
		editor.setInputType(inputType);
		editor.removeBorder();
		editor.setFontSize(this.style.fontSize * scale);
		editor.setText(text);
		
		editor.element.onchange= function() {
			if(text !== this.value) {
				shape.setText(this.value);
				shape.callOnChanged(shape.text);
				shape.postRedraw();
			}
			else {
				shape.setText(text);
			}

			editor.element.onchange = null;
			editor.hide();
			
			shape.callOnFocusOut();

			return;
		}
		
		this.callOnFocusIn();
	}

	return;
}

UIMLEdit.prototype.getTextTipsPosition = function() {
	var pos = {};

	pos.x = this.hMargin;
	pos.y = this.vMargin;
	pos.textAlign = "left";
	pos.textBaseline = "top";

	return pos;
}

function UIMLEditCreator(w, h, margin, bg, focusedBg) {
	var args = ["ui-mledit", "ui-mledit", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIMLEdit();
		return g.initUIMLEdit(this.type, w, h, margin, dappGetText("Edit"), bg, focusedBg);
	}
	
	return;
}

