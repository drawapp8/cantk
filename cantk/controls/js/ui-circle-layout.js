/*
 * File:   ui-circle-layout.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Circle Layout
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UICircleLayout() {
	return;
}

UICircleLayout.prototype = new UIElement();
UICircleLayout.prototype.isUILayout = true;
UICircleLayout.prototype.isUICircleLayout = true;
UICircleLayout.O_CENTER = "c";
UICircleLayout.O_TOP_LEFT = "tl";
UICircleLayout.O_TOP_MIDDLE = "tm";
UICircleLayout.O_TOP_RIGHT = "tr";
UICircleLayout.O_LEFT_MIDDLE = "lm";
UICircleLayout.O_RIGHT_MIDDLE = "rm";
UICircleLayout.O_BOTTOM_LEFT = "bl";
UICircleLayout.O_BOTTOM_MIDDLE = "bm";
UICircleLayout.O_BOTTOM_RIGHT = "br";

UICircleLayout.prototype.initUICircleLayout = function(type, w, h, img) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, img);
	this.images.display = UIElement.IMAGE_DISPLAY_SCALE;
	this.setCanRectSelectable(false, false);
	this.addEventNames(["onInit"]);
	this.origin =  UICircleLayout.O_CENTER;
	this.setSizeLimit(120, 120, 1000, 1000, 1);

	return this;
}

UICircleLayout.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUIImage || shape.isUIButton) {
		return true;
	}

	return false;
}

UICircleLayout.prototype.paintSelfOnly = function(canvas) {
	if(this.isInDesignMode()) {
		canvas.lineWidth = this.style.lineWidth;

		switch(this.origin) {
			case UICircleLayout.O_CENTER: {
				var ox = this.w >> 1;
				var oy = this.h >> 1;
				var r = (this.w >> 1) - 30;
				var n = this.children.length ? this.children.length : 6;
				var angle = n > 1 ? (2 * Math.PI/(n-1)) : 0;

				canvas.beginPath();
				canvas.fillStyle = this.style.fillColor;
				canvas.strokeStyle = this.style.lineColor;
				canvas.arc(ox, oy, r, 0, Math.PI * 2);
				canvas.stroke();

				var deltaA = -0.5 * Math.PI;
				for(var i = 0; i < n; i++) {
					canvas.beginPath();

					if(i == 0) {
						canvas.arc(ox, oy, 10, 0, Math.PI * 2);
						canvas.stroke();
					}
					else {
						var a = angle * (i - 1) + deltaA;
						var x = ox + r * Math.cos(a);
						var y = oy + r * Math.sin(a);
						canvas.arc(x, y, 10, 0, Math.PI * 2);
						canvas.stroke();
					}
				}
				
				canvas.stroke();
				break;
			}
			default:break;
		}
	}

	return;
}


UICircleLayout.prototype.moveShapeToCenter = function(shape, x, y) {
	x = x - (shape.w >> 1);
	y = y - (shape.h >> 1);

	shape.move(x, y);

	return;
}

UICircleLayout.prototype.relayoutChildren = function() {
	if(this.disableRelayout) {
		return;
	}

	switch(this.origin) {
		case UICircleLayout.O_CENTER: {
			var ox = this.w >> 1;
			var oy = this.h >> 1;
			var r = (this.w >> 1) - 30;
			var n = this.children.length - 1;
			var angle = n > 0 ? (2 * Math.PI/n) : 0;

			var deltaA = -0.5 * Math.PI;
			for(var i = 0; i < this.children.length; i++) {
				var iter = this.children[i];
				if(i == 0) {
					this.moveShapeToCenter(iter, ox, oy);
				}
				else {
					var a = angle * (i - 1) + deltaA;
					var x = ox + r * Math.cos(a);
					var y = oy + r * Math.sin(a);
					this.moveShapeToCenter(iter, x, y);
				}
			}
			break;
		}
		default:break;
	}

	return;
}

UICircleLayout.prototype.afterChildAppended = function(shape) {
	shape.yAttr = UIElement.Y_FIX_TOP;
	shape.xAttr = UIElement.X_FIX_LEFT;
	shape.widthAttr = UIElement.WIDTH_SCALE;
	shape.heightAttr = UIElement.HEIGHT_SCALE;
	shape.setUserMovable(true);
	shape.setUserResizable(true);
	shape.setCanRectSelectable(false, true);
	this.relayoutChildren();

	return true;
}

function UICircleLayoutCreator(w, h, img) {
	var args = ["ui-circle-layout", "ui-circle-layout", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UICircleLayout();

		return g.initUICircleLayout(this.type, w, h, img);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UICircleLayoutCreator(400, 400));

