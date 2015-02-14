/*
 * File: edit.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: wrap input/textarea
 * 
 * Copyright (c) 2011 - 2015	Li XianJing <xianjimli@hotmail.com>
 * 
 */

function EditorElement() {
	this.element = null;
}

EditorElement.prototype.setElement = function(element) {
	this.element = element;

	return;
}

EditorElement.prototype.setWrap = function(wrap) {
	this.element.wrap = wrap;
	
	return;
}

EditorElement.prototype.removeBorder = function() {
	if(!isMobile()) {
		this.element.style.background = 'transparent';
		this.element.style.border ='0px solid';
		this.element.style.outline = 'none';
	}

	return;
}

EditorElement.prototype.setOnChangedHandler = function(onChanged) {
	var me = this;
	this.element.onchange = function() {
		if(onChanged) {
			onChanged(me, this.value);
		}
	}

	return this;
}

EditorElement.prototype.setOnChangeHandler = function(onChange) {
	var me = this;
	this.element.onkeyup = function() {
		if(onChange) {
			onChange(me, this.value);
		}
	}

	return this;
}

EditorElement.prototype.setFontSize = function(fontSize) {
	this.element.style['font-size'] = fontSize + "pt";

	return;
}

EditorElement.prototype.setScrollType = function(scrollType) {
	this.element.style['overflow-y'] = scrollType;
	this.element.style['overflow-x'] = scrollType;

	return;
}

EditorElement.prototype.show = function() {
	this.isVisibile = true;
	this.element.style.visibility = 'visible';
	this.element.style.zIndex = 8;

	this.element.focus();
	EditorElement.imeOpen = true;

	return;
}

EditorElement.prototype.setInputType = function(type) {
	this.element.type = type;

	return;
}

EditorElement.prototype.hide = function() {
	this.isVisibile = false;
	this.element.style.zIndex = 0;
	this.element.style.visibility = 'hidden';  
	this.element.blur();
	this.element.onchange = null;
	EditorElement.imeOpen = false;
	setElementPosition(UIElement.getMainCanvas(), 0, 0);

	if(this.onHide) {
		this.onHide();
	}

	if(this.shape) {
		this.shape.editing = false;
	}

	return;
}

EditorElement.prototype.move = function(x, y) {
	this.element.style.position = "absolute";
	this.element.style.left = x + "px";
	this.element.style.top = y + "px";

	return;
}

EditorElement.prototype.setFontSize = function(fontSize) {
	this.element.style.fontSize = fontSize + "px";

	return;
}

EditorElement.prototype.resize = function(w, h) {
	this.element.style.width = w + "px";
	this.element.style.height = (h-6) + "px";

	return;
}

EditorElement.prototype.getText = function() {
	return this.element.value;
}

EditorElement.prototype.setText = function(text) {
	this.element.value = text;

	return;
}

EditorElement.prototype.setShape = function(shape) {
	if(this.shape) {
		this.hide();
	}

	this.shape = shape;
	
	if(this.shape) {
		this.shape.editing = true;
		this.show();
	}

	return;
}

EditorElement.create = function(element, id, x, y, w, h) {
	var edit = new EditorElement();

	element.id = id;
	edit.setElement(element);
	edit.move(x, y);
	edit.resize(w, h);
	edit.setFontSize(14);
	edit.show();

	return edit;
}

var gCanTkInput = null;
function cantkShowInput(x, y, w, h) {
	var id = "cantk_input";

	x = Math.round(x);
	y = Math.round(y);
	w = Math.round(w);
	h = Math.round(h);

	if(!gCanTkInput) {
		gCanTkInput = createSingleLineEdit(id, x, y, w, h);
	}
	else {
		gCanTkInput.move(x, y);
		gCanTkInput.resize(w, h);
		gCanTkInput.show();
	}

	return gCanTkInput;
}

var gCanTkTextArea = null;
function cantkShowTextArea(x, y, w, h) {
	var id = "cantk_textarea";
	
	x = Math.round(x);
	y = Math.round(y);
	w = Math.round(w);
	h = Math.round(h);

	if(!gCanTkTextArea) {
		gCanTkTextArea = createMultiLineEdit(id, x, y, w, h);
	}
	else {
		gCanTkTextArea.move(x, y);
		gCanTkTextArea.resize(w, h);
		gCanTkTextArea.show();
	}

	return gCanTkTextArea;
}

function cantkMoveEditorWhenResize() {
	if(gCanTkInput && gCanTkInput.isVisibile && gCanTkInput.shape && gCanTkInput.shape.isUIElement) {
		var shape = gCanTkInput.shape;
		var rect = shape.getEditorRect();
		var x = rect.x;
		var y = rect.y;
		var w = rect.w;
		var h = rect.h;

		gCanTkInput.move(x, y);
		gCanTkInput.resize(w, h);

		console.log("Move Input To: (" + x + ", " + y + ")");
	}
	
	if(gCanTkTextArea && gCanTkTextArea.isVisibile && gCanTkTextArea.shape && gCanTkTextArea.shape.isUIElement) {
		var shape = gCanTkTextArea.shape;
		var rect = shape.getEditorRect();
		var x = rect.x;
		var y = rect.y;
		var w = rect.w;
		var h = rect.h;

		gCanTkTextArea.move(x, y);
		gCanTkTextArea.resize(w, h);
		
		console.log("Move TextArea To: (" + x + ", " + y + ")");
	}

	return;
}

function cantkIsEditorActive() {
	if(gCanTkInput && gCanTkInput.isVisibile) {
		return true;
	}

	if(gCanTkTextArea && gCanTkTextArea.isVisibile) {
		return true;
	}

	return false;
}

function cantkHideAllInput() {
	if(gCanTkInput && gCanTkInput.isVisibile) {
		if(gCanTkInput.element.onchange) {
			gCanTkInput.element.onchange();
		}
		gCanTkInput.hide();
	}

	if(gCanTkTextArea && gCanTkTextArea.isVisibile) {
		if(gCanTkTextArea.element.onchange) {
			gCanTkTextArea.element.onchange();
		}
		gCanTkTextArea.hide();
	}

	return;
}

function createSingleLineEdit(id, x, y, w, h) {
	var element = document.getElementById(id);

	if(!element) {
		element = document.createElement("input");
		document.body.appendChild(element);
	}

	return EditorElement.create(element, id, x, y, w, h);
}

function createMultiLineEdit(id, x, y, w, h) {
	var element = document.getElementById(id);

	if(!element) {
		element = document.createElement("textarea");
		document.body.appendChild(element);
	}

	return EditorElement.create(element, id, x, y, w, h);
}

