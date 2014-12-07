/*
 * File:   ui-layout.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Layout
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UILayout() {
	return;
}

UILayout.prototype = new UIElement();
UILayout.prototype.isUILayout = true;

UILayout.prototype.initUILayout = function(type, w, h, img) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, img);
	this.images.display = UIElement.IMAGE_DISPLAY_9PATCH;
	this.setCanRectSelectable(false, false);
	this.vLayout = (this.type === "ui-v-layout");
	this.addEventNames(["onInit"]);

	return this;
}

UILayout.prototype.shapeCanBeChild = UIGroup.prototype.shapeCanBeChild;

UILayout.prototype.paintSelfOnly = function(canvas) {
	var image = this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);

	if(!image && this.mode === Shape.MODE_EDITING) {
		var x = this.vMargin;
		var y = this.hMargin;
		var w = this.getWidth(true);
		var h = this.getHeight(true);
		var vLayout = this.vLayout;

		drawDashedRect(canvas, x, y, w, h);
		if(this.children.length === 0) {
			if(vLayout) {
				drawDashedLine(canvas, {x:x, y:0.2*h+y}, {x:w+x, y:0.2*h+y}, 8, 4);
				drawDashedLine(canvas, {x:x, y:0.5*h+y}, {x:w+x, y:0.5*h+y}, 8, 4);
			}
			else {
				drawDashedLine(canvas, {x:0.2*w+x, y:y}, {x:0.2*w+x, y:h+y}, 8, 4);
				drawDashedLine(canvas, {x:0.5*w+x, y:y}, {x:0.5*w+x, y:h+y}, 8, 4);
			}
		}
		else {
			for(var i = 0; i < this.children.length; i++) {
				var iter = this.children[i];
				if(vLayout) {
					var y = iter.y + iter.h;
					drawDashedLine(canvas, {x:x, y:y}, {x:w+x, y:y}, 8, 4);
				}
				else {
					var x = iter.x + iter.w;
					drawDashedLine(canvas, {x:x, y:y}, {x:x, y:h+y}, 8, 4);
				}
			}
		}

		canvas.stroke();
	}

	return;
}

UILayout.prototype.sortChildren = function() {
	var vLayout = this.vLayout;
	if(vLayout) {
		this.children.sort(function(a, b) {
			var aa = a.y;
			var bb = b.y;

			return aa - bb;
		});
	}
	else {
		this.children.sort(function(a, b) {
			var aa = a.x;
			var bb = b.x;

			return aa - bb;
		});
	}

	return;
}

UILayout.prototype.relayoutChildren = function() {
	if(this.disableRelayout) {
		return;
	}

	var x = this.hMargin;
	var y = this.vMargin;
	var spacer = this.spacer ? this.spacer : 0;
	var vLayout = this.vLayout;

	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];

		if(!iter.isVisible()) {
			continue;
		}

		if(vLayout) {
			if(iter.heightAttr !== UIElement.HEIGHT_FIX && iter.heightAttr !== UIElement.HEIGHT_SCALE) {
				iter.heightAttr = UIElement.HEIGHT_SCALE;
				iter.updateLayoutParams();
			}
			
			iter.y = y;
			iter.relayout();
			iter.y = y;

			y = y + iter.h + spacer;
		}
		else {
			if(iter.widthAttr !== UIElement.WIDTH_FIX && iter.widthAttr !== UIElement.WIDTH_SCALE) {
				iter.widthAttr = UIElement.WIDTH_SCALE;
				iter.updateLayoutParams();
			}

			iter.x = x;
			iter.relayout();
			iter.x = x;
			
			x = x + iter.w + spacer;
		}
	}
	
	return;
}

UILayout.prototype.afterChildAppended = function(shape) {
	var vLayout = this.vLayout;
	if(vLayout) {
		shape.yAttr = UIElement.Y_FIX_TOP;
		if(shape.heightAttr === UIElement.HEIGHT_FILL_PARENT) {
			shape.heightAttr = UIElement.HEIGHT_SCALE; 
		}
	}
	else {
		shape.xAttr = UIElement.X_FIX_LEFT;
		if(shape.widthAttr === UIElement.WIDTH_FILL_PARENT) {
			shape.widthAttr = UIElement.WIDTH_SCALE;
		}
	}

	if(this.mode === Shape.MODE_EDITING && shape.isCreatingElement()) {
		this.sortChildren();
	}

	shape.setUserMovable(true);
	shape.setUserResizable(true);
	shape.setCanRectSelectable(false, true);

	return true;
}

function UIVLayoutCreator(w, h, img) {
	var args = ["ui-v-layout", "ui-layout", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UILayout();

		return g.initUILayout(this.type, w, h, img);
	}
	
	return;
}

function UIHLayoutCreator(w, h, img) {
	var args = ["ui-h-layout", "ui-layout", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UILayout();

		return g.initUILayout(this.type, w, h, img);
	}
	
	return;
}
