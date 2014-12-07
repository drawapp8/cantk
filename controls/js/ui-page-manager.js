/*
 * File:   ui-page-manager.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  TabPage Manager
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIPageManager() {
}

UIPageManager.prototype = new UIFrames();
UIPageManager.prototype.isUIPageManager = true;

UIPageManager.prototype.initUIPageManager = function(type) {
	return this.initUIFrames(type);
}

UIPageManager.prototype.beforeAddShapeIntoChildren = function(shape) {
	return !shape.isUIPage;
}

UIPageManager.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIPage;
}

UIPageManager.prototype.relayoutChildren = function() {
	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		iter.x = 0;
		iter.y = 0;
		iter.w = this.w;
		iter.h = this.h;
		iter.relayoutChildren();
		iter.setUserMovable(false);
		iter.setUserResizable(false);
	}

	return;
}

UIPageManager.prototype.showHTML = function() {
	var child = this.getCurrentFrame();
	
	if(child) {
		child.showHTML();
	}

	return;
}

UIPageManager.prototype.hideHTML = function() {
	var child = this.getCurrentFrame();
	
	if(child) {
		child.hideHTML();
	}

	return;
}


UIPageManager.prototype.switchTo = function(index) {
	var pageManager = this;
	var curFrame = this.getCurrentFrame();
	var newFrame = this.getFrame(index);
	var current = this.current;

	if(curFrame) {
		curFrame.hideHTML();
	}

	if(current < 0 || current === index || !curFrame || !newFrame) {
		this.showFrame(index);

		if(newFrame) {
			newFrame.showHTML();
		}

		return;
	}

	function showNewFrame() {
		pageManager.showFrame(index);
		pageManager.postRedraw();

		return;
	}

	if(!this.isTopWindow()) {
		showNewFrame();	
		return;
	}

	var animation = null;
	var backendCanvas = null;
	var p = this.getPositionInScreen();

	if(index < current) {
		animation = AnimationFactory.create("anim-backward"); 
		backendCanvas = UIFrames.preparseBackendCanvas(newFrame, curFrame);
	}
	else {
		animation = AnimationFactory.create("anim-forward"); 
		backendCanvas = UIFrames.preparseBackendCanvas(curFrame, newFrame);
	}

//	window.open(backendCanvas.toDataURL(), "_blank");
	animation.setScale(this.getRealScale());
	animation.prepare(p.x, p.y, this.w, this.h, backendCanvas, showNewFrame);
	animation.run();

	return;
}

function UIPageManagerCreator() {
	var args = ["ui-page-manager", "ui-page-manager", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageManager();

		g.initUIPageManager(this.type);

		return g;
	}
	
	return;
}
