/*
 * File:   ui-menu.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Menu
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIMenu
 * @extends UIElement
 * 菜单。菜单缺省时是隐藏的，只在特定情况才显示出来。菜单是一个容器，里面可以放按钮，列表项，文字和图片等控件。
 *
 * 菜单在显示或隐藏时，可以开启或关闭动画，动画可以是缺省的，也可以是自定义的。
 *
 * 对于自定义动画：显示动画名称必须是"show",隐藏动画名称必须是"hide"。
 *
 *     @example small frame
 *     this.win.find("menu").setVisible(true);
 */
function UIMenu() {
	return;
}

UIMenu.FREE_LAYOUT = 0;
UIMenu.ARC_LAYOUT = 1;
UIMenu.VLINEAR_LAYOUT = 2;
UIMenu.HLINEAR_LAYOUT = 3;

UIMenu.prototype = new UIElement();
UIMenu.prototype.isUIMenu = true;

UIMenu.prototype.saveProps = ["autoHideWhenClicked", "childrenAnimation", "enableShowAnimation", "enableHideAnimation", "spacer", "menuItemNr", "animDuration", "layoutType", "originPoint"];
UIMenu.prototype.initUIMenu = function(type) {
	this.initUIElement(type, null);

	this.spacer = 2;
	this.menuItemNr = 2;
	this.animDuration = 600;
	this.setTextType(Shape.TEXT_NONE);
	this.layoutType = UIMenu.FREE_LAYOUT;
	this.originPoint = UIElement.ORIGIN_RIGHT;
	this.setCanRectSelectable(false, false);
	this.enableHideAnimation = true;
	this.enableShowAnimation = true;

	return this;
}

UIMenu.prototype.relayoutChildrenHLL = function() {
	var n = this.children.length;
	var hMargin = this.getHMargin();
	var vMargin = this.getVMargin();

	var x = hMargin;
	var y = vMargin;
	var spacer = this.spacer;
	var w = this.getWidth(true);
	var h = this.getHeight(true);
	var originPoint = this.originPoint;
	
	var nr = Math.max(n, this.menuItemNr);
	var itemW = Math.round((w - spacer * (nr - 1))/nr);
	for(var i = 0; i < n; i++) {
		var iter = this.children[i];
		iter.h = h;
		iter.w = itemW;
		iter.left = x;
		iter.top = y;
		x += itemW + spacer;
		iter.relayoutChildren();
	}

	return this;
}

UIMenu.prototype.relayoutChildrenVLL = function() {
	var n = this.children.length;
	var hMargin = this.getHMargin();
	var vMargin = this.getVMargin();

	var x = hMargin;
	var y = vMargin;
	var spacer = this.spacer;
	var w = this.getWidth(true);
	var h = this.getHeight(true);
	var originPoint = this.originPoint;

	var nr = Math.max(n, this.menuItemNr);
	var itemH = Math.round((h - spacer * (nr - 1))/nr);
	for(var i = 0; i < n; i++) {
		var iter = this.children[i];
		iter.w = w;
		iter.h = itemH;
		iter.left = x;
		iter.top = y;
		y += itemH + spacer;
		iter.relayoutChildren();
	}

	return this;
}

UIMenu.prototype.getChildPositionOfArc = function(originInfo, r, index, n) {
	var p = {};
	var nr = originInfo.angleRange > (Math.PI * 1.9) ? n : n - 1;
	var angle = originInfo.angleStart + (originInfo.angleRange*index)/nr;

	p.x = originInfo.x + r * Math.cos(angle);
	p.y = originInfo.y + r * Math.sin(angle);

	return p;
}

UIMenu.prototype.relayoutChildrenARC = function() {
	var n = this.children.length;
	var originInfo = this.getOrigin();
	var r = originInfo.r;
	var w = this.w;
	var h = this.h;

	for(var i = 0; i < n; i++) {
		var iter = this.children[i];
		var p = this.getChildPositionOfArc(originInfo, r, i, n);
		iter.left = p.x - (iter.w >> 1);
		iter.top = p.y - (iter.h >> 1);
		iter.relayoutChildren();
	}

	return;
}

UIMenu.prototype.relayoutChildren = function() {
	var n = this.children.length;
	if(this.disableRelayout || !n) {
		return;
	}

	switch(this.layoutType) {
		case UIMenu.HLINEAR_LAYOUT: {
			this.relayoutChildrenHLL();
			break;
		}
		case UIMenu.VLINEAR_LAYOUT: {
			this.relayoutChildrenVLL();
			break;
		}
		case UIMenu.ARC_LAYOUT: {
			this.relayoutChildrenARC();
			break;
		}
		default: {
			for(var i = 0; i < n; i++) {
				this.children[i].relayout();
			}
			break;
		}
	}

	return;
}

UIMenu.prototype.prepareShowChildAnimation = function(child, origin) {
	var config = {};

	config.duration = this.animDuration;
	config.interpolator = "d";
	config.xStart = origin.x - (child.w >> 1);
	config.xEnd = child.left;
	config.yStart = origin.y - (child.h >> 1);
	config.yEnd = child.top;
	config.scaleXStart = 0;
	config.scaleXEnd = 1;
	config.scaleYStart = 0;
	config.scaleYEnd = 1;
	config.opacityStart = 0;
	config.opacityEnd = 1;
	config.rotationStart = 0;
	config.rotationEnd = 2 * Math.PI;

	return config;
}

UIMenu.prototype.prepareHideChildAnimation = function(child, origin) {
	var config = {};

	config.duration = this.animDuration;
	config.interpolator = "d";

	config.xStart = child.left;
	config.xEnd = origin.x - (child.w >> 1);
	config.yStart = child.top;
	config.yEnd = origin.y - (child.h >> 1);

	config.opacityStart = 1;
	config.opacityEnd = 0;
	config.scaleXStart = 1;
	config.scaleXEnd = 0;
	config.scaleYStart = 1;
	config.scaleYEnd = 0;
	config.rotationStart = Math.PI * 2;
	config.rotationEnd = 0;

	return config;
}

UIMenu.prototype.animateShowChildren = function() {
	var me = this;
	var n = this.children.length;
	var origin = this.getOrigin();

	this.busy = n;
	this.visible = true;
	for(var i = 0; i < n; i++) {
		var config = null;
		var iter = this.children[i];
		if(iter.animations) {
			config = iter.animations['show'];
		}
		if(!config) {
			config = this.prepareShowChildAnimation(iter, origin);
		}
		else {
			console.log("Use child show animation.");
		}

//		this.busy++;
		iter.animate(config, function() {
			me.busy--;
		});
	}

	return this;
}

UIMenu.prototype.animateHideChild = function(child, config) {
	var me = this;
	var x = child.left;
	var y = child.top;
	var w = child.w;
	var h = child.h;

//	this.busy++;
	child.animate(config, function() {
		child.left = x;
		child.top = y;
		child.w = w;
		child.h = h;
		
		child.opacity = 1;
		child.visible = false;

		me.busy--;
		if(!me.busy) {
			me.visible = false;
		}
	});

	return;
}

UIMenu.prototype.animateHideChildren = function() {
	var me = this;
	var n = this.children.length;
	var origin = this.getOrigin();

	this.busy = n;
	this.visible = true;
	for(var i = 0; i < n; i++) {
		var config = null;
		var iter = this.children[i];
		if(iter.animations) {
			config = iter.animations['hide'];
		}

		if(!config) {
			config = this.prepareHideChildAnimation(iter, origin);
		}
		else {
			console.log("Use child hide animation.");
		}

		this.animateHideChild(iter, config);
	}

	return this;
}

UIMenu.prototype.prepareShowAnimation = function() {
	var config = {};

	config.duration = this.animDuration;
	config.interpolator = "d";

	config.scaleXStart = 0.5;
	config.scaleXEnd = 1;
	config.scaleYStart = 0.5;
	config.scaleYEnd = 1;
	config.opacityStart = 0;
	config.opacityEnd = 1;

	return config;
}

UIMenu.prototype.prepareHideAnimation = function() {
	var config = {};

	config.duration = this.animDuration;
	config.interpolator = "a";
	config.scaleXStart = 1;
	config.scaleXEnd = 0.5;
	config.scaleYStart = 1;
	config.scaleYEnd = 0.5;
	config.opacityStart = 1;
	config.opacityEnd = 0;

	return config;
}

UIMenu.prototype.animateShowSelf = function() {
	var me = this;
	me.busy = true;
	var config = null;
	if(this.animations) {
		config = this.animations["show"];
	}

	if(!config) {
		config = this.prepareShowAnimation();
	}

	this.animate(config, function() {
		me.visible = true;
		me.busy = false;
	});
}

UIMenu.prototype.animateHideSelf = function() {
	var me = this;
	me.busy = true;
	this.visible = true;
	var config = null;
	if(this.animations) {
		config = this.animations["hide"];
	}

	if(!config) {
		config = this.prepareHideAnimation();
	}

	this.animate(config, function() {
		me.visible = false;
		me.busy = false;
	});

	return this;
}

UIMenu.prototype.show = function() {
	if(this.busy) return;
	if(this.autoHideWhenClicked) {
		this.getWindow().grab(this);
	}

	if(!this.enableShowAnimation) {
		this.visible = true;
		return;
	}

	if(this.childrenAnimation) {
		this.animateShowChildren();
	}
	else {
		this.animateShowSelf();
	}
}

UIMenu.prototype.hide = function() {
	if(this.busy) return;
	if(this.autoHideWhenClicked) {
		this.getWindow().ungrab(this);
	}
	
	if(!this.enableHideAnimation) {
		this.visible = false;
		return;
	}

	if(this.childrenAnimation) {
		return this.animateHideChildren();
	}
	else {
		return this.animateHideSelf();
	}
}

UIMenu.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}

	if(this.autoHideWhenClicked) {
		this.hide();
	}

	return;
}

UIMenu.prototype.setVisible = function(visible) {
	if(this.visible === visible || this.busy) {
		return this;
	}

	return visible ? this.show() : this.hide();
}

UIMenu.prototype.getOrigin = function() {
	var w = this.getWidth(true);
	var h = this.getHeight(true);
	var hMargin = this.hMargin;
	var vMargin = this.vMargin;

	var p = {x:hMargin, y:vMargin};

	switch(this.originPoint) {
		case UIElement.ORIGIN_UP: {
			p.x = this.w >> 1;
			p.angleRange = Math.PI;		
			p.angleStart = 0;
			p.r = w >> 1;
			break;
		}
		case UIElement.ORIGIN_DOWN: {
			p.x = this.w >> 1;
			p.y = this.h - vMargin;
			p.angleRange = Math.PI;		
			p.angleStart = Math.PI;
			p.r = w >> 1;
			break;
		}
		case UIElement.ORIGIN_LEFT: {
			p.x = hMargin;
			p.y = this.h >> 1;
			p.angleRange = Math.PI;		
			p.angleStart = - Math.PI * 0.5;
			p.r = h >> 1;
			break;
		}
		case UIElement.ORIGIN_RIGHT: {
			p.x = this.w - hMargin;
			p.y = this.h >> 1;
			p.angleRange = Math.PI;		
			p.angleStart = Math.PI * 0.5;
			p.r = h >> 1;
			break;
		}
		case UIElement.ORIGIN_UP_LEFT: {
			p.angleRange = Math.PI * 0.5;
			p.angleStart = 0;
			p.r = Math.min(w,h);

			break;
		}
		case UIElement.ORIGIN_UP_RIGHT: {
			p.x = this.w - hMargin;
			p.angleStart = 0.5 * Math.PI;
			p.angleRange = Math.PI * 0.5;
			p.r = Math.min(w,h);
			break;
		}
		case UIElement.ORIGIN_DOWN_LEFT: {
			p.x = hMargin;
			p.y = this.h - vMargin;
			p.angleStart = - 0.5 * Math.PI;
			p.angleRange = Math.PI * 0.5;
			p.r = Math.min(w,h);
			break;
		}
		case UIElement.ORIGIN_DOWN_RIGHT: {
			p.x = this.w - hMargin;
			p.y = this.h - vMargin;
			p.angleStart = Math.PI;
			p.angleRange = Math.PI * 0.5;
			p.r = Math.min(w,h);
			break;
		}
		case UIElement.ORIGIN_MIDDLE_CENTER: {
			p.x = this.w >> 1;
			p.y = this.h >> 1;
			p.angleStart = -0.5 * Math.PI;
			p.angleRange = Math.PI * 2;
			p.r = Math.min(w,h) >> 1;
			break;
		}
		default:break;
	}

	return p;
}

UIMenu.prototype.applyTransform = function(canvas) {
	if(this.isInDesignMode()) return;

	var origin = this.getOrigin();

	if(canvas.globalAlpha != this.opacity) {
		canvas.globalAlpha =  this.opacity;
	}

	if(this.offsetX) {
		canvas.translate(this.offsetX, 0);
	}

	if(this.offsetY) {
		canvas.translate(0, this.offsetY);
	}

	var scaleX = this.getScaleX();
	var scaleY = this.getScaleY();
	if(this.rotation || (scaleX && scaleX !== 1) || (scaleY && scaleY !== 1)) {
		var hw = origin.x;
		var hh = origin.y;

		canvas.translate(hw, hh);
		if(scaleX && scaleY) {
			canvas.scale(scaleX, scaleY);
		}
		
		if(this.rotation) {
			canvas.rotate(this.rotation);
		}
		canvas.translate(-hw, -hh);
	}

	return;
}


UIMenu.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIListItem || shape.isUIButton || shape.isUIImage;
}

function UIMenuCreator() {
	var args = ["ui-menu", "ui-menu", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIMenu();
		return g.initUIMenu(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIMenuCreator());

