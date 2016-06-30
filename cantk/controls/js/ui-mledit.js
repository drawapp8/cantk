/*
 * File:   ui-mledit.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Multi Line Editor
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIMLEdit
 * @extends UIElement
 * 多行编辑器。
 */

/**
 * @event onChanged
 * 文本变化时触发本事件。
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
function UIMLEdit() {
	return;
}

UIMLEdit.prototype = new UIElement();
UIMLEdit.prototype.isUIMLEdit = true;

UIMLEdit.prototype.saveProps = ["inputTips"];
UIMLEdit.prototype.initUIMLEdit = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setText("");
	this.setTextType(Shape.TEXT_TEXTAREA);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.setImage(UIElement.IMAGE_FOCUSED, null);
	this.setMargin(12, 12);
	this.addEventNames(["onChanged", "onFocusIn", "onFocusOut"]);
	this.setTextAlignV("top");
	this.setTextAlignH("left");

	return this;
}

UIMLEdit.prototype.drawText = function(canvas) {
	if(!this.text || this.editing) {
		return;
	}

	if(this.textNeedRelayout) {
		this.layoutText(canvas);	
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
	if(!this.isInDesignMode()) {
		this.editText();
	}

    return this.callOnClickHandler(point);
}

UIMLEdit.prototype.isFocused = function() {
	return this.editing;
}

UIMLEdit.prototype.getEditorRect = function() {
	var p = this.getPositionInView();
	var cp = CantkRT.getMainCanvasPosition();
	var vp = this.view.getAbsPosition();
	var scale = this.view.getViewScale();

	var canvasScale = UIElement.getMainCanvasScale();
	var x = (vp.x + p.x * scale)/canvasScale.x + cp.x;
	var y = (vp.y + p.y * scale)/canvasScale.y + cp.y;
	var w = (this.getWidth() * scale)/canvasScale.x;
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

UIMLEdit.prototype.editText = function(point) {
	if(this.textEditable(point)) {
		var shape = this;
		var rect = this.getEditorRect();
		var scale = this.getRealScale() / UIElement.getMainCanvasScale().y;
		var inputType = this.inputType ? this.inputType : "text";
		var fontSize = this.style.fontSize * scale; 
		var editor = cantkShowTextArea(this.getText(), fontSize, rect.x, rect.y, rect.w, rect.h);
		
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

function UIMLEditCreator(w, h) {
	var args = ["ui-mledit", "ui-mledit", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIMLEdit();
		return g.initUIMLEdit(this.type, w, h);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIMLEditCreator(300, 300));

