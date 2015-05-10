/*
 * File:   ui-mledit.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Multi Line Editor
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
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
	this.setTextType(Shape.TEXT_TEXTAREA);
	this.setImage(UIElement.IMAGE_DEFAULT, bg);
	this.setImage(UIElement.IMAGE_FOCUSED, focusedBg);
	this.setMargin(margin, margin);
	this.addEventNames(["onChanged", "onFocusIn", "onFocusOut"]);
	this.setTextAlignV("top");
	this.setTextAlignH("left");

	return this;
}

UIMLEdit.prototype.drawText = function(canvas) {
	if(!this.text || this.editing) {
		return;
	}

	return this.defaultDrawText(canvas);
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
	if(this.mode !== Shape.MODE_EDITING) {
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

	var x = (p.x) * scale + ox;
	var y = (p.y) * scale + oy;
	var w = this.getWidth() * scale;
	var h = this.getHeight() * scale;
	
	var rect = {};

	scale = UIElement.getMainCanvasScale();
	rect.x = Math.round(x/scale.x);
	rect.y = Math.round(y/scale.y);
	rect.w = Math.round(w/scale.x);
	rect.h = Math.round(h/scale.y);

	return rect;
}

UIMLEdit.prototype.editText = function(point) {
	if(this.textType && this.textEditable(point)) {
		var shape = this;
		var rect = this.getEditorRect();
		var scale = this.getRealScale() / UIElement.getMainCanvasScale().y;
		var inputType = this.inputType ? this.inputType : "text";
		var fontSize = this.style.fontSize * scale; 
		var editor = cantkShowTextArea(this.getText(), fontSize, rect.x, rect.y, rect.w, rect.h);
		
		shape.editing = true;
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
			shape.callOnChangingHandler(this.value);
		}

		editor.setOnChangedHandler(onChanged);
		editor.setOnChangeHandler(onChange);
		
		this.callOnFocusInHandler();
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

ShapeFactoryGet().addShapeCreator(new UIMLEditCreator(300, 300, 12, null, null));

