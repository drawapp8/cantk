/*
 * File:   ui-list-item-group.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  List Item Group
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIListItemGroup() {
	return;
}

UIListItemGroup.prototype = new UIList();

UIListItemGroup.prototype.isUIListItem = true;
UIListItemGroup.prototype.isUIListItemGroup = true;
UIListItemGroup.prototype.isHeightVariable = UIListItem.prototype.isHeightVariable;
UIListItemGroup.prototype.setHeightVariable = UIListItem.prototype.setHeightVariable;

UIListItemGroup.prototype.initUIListItemGroup = function(type) {
	this.initUIList(type, 0, 30, null);
	this.setHeightVariable(true);
	this.setSizeLimit(100, 30);

	return this;
}

UIListItemGroup.prototype.relayoutChildren = function(animHint) {
	if(this.disableRelayout) {
		return;
	}

	if(this.mode === Shape.MODE_EDITING) {
		this.collapsed = false;
	}
		
	UIList.prototype.relayoutChildren.call(this, animHint);
	this.h = this.getNewHeight();

	return;
}

UIListItemGroup.prototype.collapseOrExpand = function(animHint) {
	if(this.collapsed) {
		this.expand(animHint);
	}
	else {
		this.collapse(animHint);
	}

	return;
}

UIListItemGroup.prototype.collapseSelf = function() {
	var n = this.children.length;
	if(n < 1) {
		return;
	}

	var h = this.h;
	this.collapsed = true;
	this.relayoutChildren();
	this.h = h;

	return;
}

UIListItemGroup.prototype.collapse = function(animHint) {
	this.collapseSelf();
	if(this.parentShape) {
		this.parentShape.relayoutChildren(animHint);
	}

	return;
}

UIListItemGroup.prototype.expandSelf = function() {
	var n = this.children.length;
	if(n < 1) {
		return;
	}

	var h = this.h;
	this.collapsed = false;
	this.relayoutChildren();
	this.h = h;

	return;
}

UIListItemGroup.prototype.expand = function(animHint) {
	this.expandSelf();
	if(this.parentShape) {
		this.parentShape.relayoutChildren(animHint);
	}

	return;
}

UIListItemGroup.prototype.getNewHeight = function() {
	var n = this.children.length;
	if(n > 0) {
		if(this.collapsed) {
			this.newHeight = this.children[0].h;
		}
		else {
			var newHeight = 0;
			for(var i = 0; i < n; i++) {
				var iter = this.children[i];
				newHeight = newHeight + iter.h;
			}
			this.newHeight = newHeight;
		}
	}
	else {
		this.newHeight = this.h;
	}

	return this.newHeight;
}

UIListItemGroup.prototype.afterChildAppended = function(shape) {
	UIList.prototype.afterChildAppended.call(this, shape);

	if(this.disableRelayout) {
		return;
	}

	if(this.parentShape) {
		this.parentShape.relayoutChildren("default");
	}

	return true;
}

UIListItemGroup.prototype.afterChildRemoved = function(shape) {
	if(this.disableRelayout) {
		return;
	}

	if(this.parentShape) {
		this.parentShape.relayoutChildren("default");
	}

	return true;
}

UIListItemGroup.prototype.shapeCanBeChild = function(shape) {
	if(!shape.isUIListItem || shape.isUIListItemGroup) {
		return false;
	}

	return true;
}

UIListItemGroup.prototype.measureHeight = function(height) {
	if(this.mode === Shape.MODE_EDITING) {
		this.collapsed = false;
	}

	return this.getNewHeight();
}

UIListItemGroup.prototype.fixListItemImage = function(item, position) {
}

UIListItemGroup.prototype.onModeChanged = function() {
	if(this.collapsedDefault && this.mode != Shape.MODE_EDITING) {
		this.collapsed = true;
		this.h = this.getNewHeight();
	}

	return;
}

function UIListItemGroupCreator() {
	var args = ["ui-list-item-group", "ui-list-item-group", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIListItemGroup();
		return g.initUIListItemGroup(this.type);
	}
	
	return;
}

