/*
 * File:   ui-collapsable.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Collapsable
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UICollapsable() {
	return;
}

UICollapsable.prototype = new UILayout();
UICollapsable.prototype.isUICollapsable = true;

UICollapsable.prototype.initUICollapsable = function(type, w, h, img) {
	this.initUILayout(type, w, h, img);	
	this.vLayout = (this.type === "ui-v-collapsable");

	return this;
}

UICollapsable.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUIDevice || shape.isUIScreen || shape.isUIStatusBar 
		|| shape.isUIWindow || shape.isUIPageManager || shape.isUIPage) {
		return false;
	}

	if(this.children.length >= 2) {
		return false;
	}

	return true;
}

UICollapsable.prototype.paintSelfOnly = function(canvas) {
	canvas.fillRect(0, 0, this.w, this.h);

	return;
}

UICollapsable.prototype.expandChild = function(child) {
	var animhint = "";
	if(this.children.length != 2 || !child || child.visible) {
		return;
	}

	var sibling = null;
	if(child === this.children[0]) {
		if(this.vLayout) {
			this.top = this.top - child.h;
			this.h = this.h + child.h;
			animhint = "anim-expand-up";
		}
		else {
			this.left = this.left - child.w;
			this.w = this.w + child.w;
			animhint = "anim-expand-left";
		}
	}
	else if(child === this.children[1]) {
		if(this.vLayout) {
			this.h = this.h + child.h;
			animhint = "anim-expand-down";
		}
		else {
			this.w = this.w + child.w;
			animhint = "anim-expand-right";
		}
	}
	else {
		return;
	}

	child.setVisible(true);
	this.relayoutChildren();
	this.parentShape.relayoutChildren("default");

	child.setVisible(false);
	animateUIElement(child, animhint);

	return;
}

UICollapsable.prototype.collapseChild = function(child) {
	child.setVisible(true);
	if(this.children.length != 2 || !child || !child.visible) {
		return;
	}

	var sibling = null;
	if(child === this.children[0]) {
		if(this.vLayout) {
			animhint = "anim-collapse-down";
			animateUIElement(child, animhint);

			this.top = this.top + child.h;
			this.h = this.h - child.h;
		}
		else {
			animhint = "anim-collapse-right";
			animateUIElement(child, animhint);

			this.left = this.left + child.w;
			this.w = this.w - child.w;
		}
	}
	else if(child === this.children[1]) {
		if(this.vLayout) {
			animhint = "anim-collapse-up";
			animateUIElement(child, animhint);
			
			this.h = this.h - child.h;
		}
		else {
			animhint = "anim-collapse-left";
			animateUIElement(child, animhint);
			
			this.w = this.w - child.w;
		}
	}
	else {
		return;
	}

	child.setVisible(false);
	this.relayoutChildren();
	this.parentShape.relayoutChildren("default");

	return;
}

UICollapsable.prototype.getChild = function(name) {
	var child = this.findChildByName(name);
	if(!child) {
		if(name === "first" || name === 0) {
			child = this.children[0];
		}
		if(name === "second" || name === 1) {
			child = this.children[1];
		}
	}

	return child;
}

UICollapsable.prototype.collapse = function(name) {

	this.collapseChild(this.getChild(name));

	return;
}

UICollapsable.prototype.expand = function(name) {
	this.collapseChild(this.getChild(name));

	return;
}

UICollapsable.prototype.collapseOrExpand = function(name) {
	var child = this.getChild(name);
	if(!child) {
		return;
	}

	if(child.visible) {
		this.collapseChild(child);
	}
	else {
		this.expandChild(child);
	}

	return;
}

UICollapsable.prototype.relayoutChildren = function() {
	if(this.disableRelayout) {
		return;
	}

	var x = this.hMargin;
	var y = this.vMargin;
	var vLayout = this.vLayout;

	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		
		if(!iter.visible) {
			continue;
		}

		if(vLayout) {
			iter.heightAttr = UIElement.HEIGHT_FIX;
			iter.widthAttr =  UIElement.WIDTH_FILL_PARENT;
			iter.relayout();
			iter.y = y;

			y = y + iter.h;
			if(y > this.h) {
				this.h = y + this.vMargin;
			}
		}
		else {
			iter.widthAttr = UIElement.WIDTH_FIX;
			iter.heightAttr = UIElement.HEIGHT_FILL_PARENT;
			iter.relayout();
			iter.x = x;
			
			x = x + iter.w;
			if(x > this.w) {
				this.w = x + this.hMargin;
			}
		}
	}

	return;
}

function UIVCollapsableCreator(w, h, img) {
	var args = ["ui-v-collapsable", "ui-collapsable", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UICollapsable();
		g.isUIVCollapsable = true;
		return g.initUICollapsable(this.type, w, h, img);
	}
	
	return;
}

function UIHCollapsableCreator(w, h, img) {
	var args = ["ui-h-collapsable", "ui-collapsable", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UICollapsable();

		g.isUIHCollapsable = true;
		return g.initUICollapsable(this.type, w, h, img);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIVCollapsableCreator(100, 100, null));
ShapeFactoryGet().addShapeCreator(new UIHCollapsableCreator(100, 100, null));

