/*
 * File: basics.js
 * Brief: Basic diagram shapes.
 * Web Site: http://www.drawapp8.com
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2011 - 2013  Li XianJing <xianjimli@hotmail.com>
 * 
 */

/////////////////////////////}Shape Extension{/////////////////////////////////////////

Shape.prototype.setDefaultStyle = function() {
	this.style = new ShapeStyle();
	this.setStyle(DefaultShapeStyleGet());

	if(this.isLine) {
		this.style.setShadow(true, {x: 0, y: 0, blur: 8, color:"#D0D0D0"});
	}

	return;
}

RShape.prototype.onSized = function() {
	var shape = this;
	setTimeout(function() {
		shape.notifyChanged();
	}, 10);

	return;
}

Shape.prototype.onMoving = function() {
	var shape = this;
	setTimeout(function() {
		shape.notifyChanged();
	}, 10);

	return;
}

Shape.prototype.notifyChanged = function() {
	if(!this.changedListeners) {
		return;
	}

	for(var i = 0; i < this.changedListeners.length; i++) {
		var lisener = this.changedListeners[i];
		if(lisener) {
			if(!lisener.update(this)) {
				this.changedListeners[i] = null;
			}
		}
	}

	this.postRedraw();

	return;
}

Shape.prototype.removeChangedListener = function(listener) {
	if(this.changedListeners) {
		this.changedListeners.remove(listener);
	}

	return;
}

Shape.prototype.registerChangedListener = function(listener) {
	if(!listener) {
		return;
	}

	if(!this.changedListeners) {
		this.changedListeners = [];
	}

	this.changedListeners.remove(null);
	this.changedListeners.remove(listener);
	this.changedListeners.push(listener);

	return;
}

/////////////////////////////}RectShape{/////////////////////////////////////////

function RectShape() {
	return;
}

RectShape.prototype = new RShape();

RectShape.prototype.initRectShape = function(type, w, h) {
	RShapeInit(this, type);
	
	this.setDefSize(w, h);
	this.setMargin(10, 10);

	return this;
}

function RectShapeCreator() {
	var args = ["rect", "", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new RectShape();
		
		g.initRectShape(this.type, 200, 60);
		g.setTextType(Shape.TEXT_TEXTAREA);

		return g;
	}
	
	return;
}

/////////////////////////////}CircleShape{/////////////////////////////////////////

function CircleShapeCreator(type, w, h) {
	type = type ? type : "circle";
	var args = [type, "Circle", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new CircleShape();

		return g.initRectShape(this.type, w ? w : 100, h ? h : 100);
	}
	
	return;
}

function CircleShape() {
	return;
}
	
CircleShape.prototype = new RectShape();

CircleShape.prototype.getNearPoint = function(i) {
	var x = this.getX();
	var y = this.getY();
	var w = this.getWidth();
	var h = this.getHeight();
	var p = {x:0, y:0};

	switch(i) {
		case 0: {
			p.x = x + w/2;
			p.y = y;
			break;
		}
		case 1: {
			p.x = x + w;
			p.y = y + h/2;
			break;
		}
		case 2: {
			p.x = x + w/2;
			p.y = y + h;
			break;
		}
		case 3: {
			p.x = x;
			p.y = y + h/2;
			break;
		}
		case 4: {
			p.x = x + w/2;
			p.y = y + h/2;
			break;
		}
		default: {
			return null;
		}
	}

	return p;
}

CircleShape.prototype.paintShape= function(canvas) {
	var x = this.w/2;
	var y = this.h/2;
	var scale = this.h/this.w;
	
	canvas.translate(x, y);
	canvas.scale(1, scale);
	canvas.arc(0, 0, this.w/2, 0, 2*Math.PI);		
	
	return;
}

/////////////////////////////}ImageRectShape{/////////////////////////////////////////

function ImageRectShapeCreator() {
	var args = ["image", "Image", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new ImageRectShape();

		return g.initRectShape(this.type, 200, 200);
	}
	
	return;
}

function ImageRectShape() {
	return;
}

ImageRectShape.prototype = new RectShape();

ImageRectShape.prototype.showProperty = function() {
	showGeneralPropertyDialog(this, this.textType, true, true);

	return;
}

ImageRectShape.prototype.drawImage = function(canvas) {
	if(!this.image) {
		this.setImage(dappGetImageURL("earth.jpg"));
		return;
	}

	var image = this.image.getImage();
	
	if(!image) {
		return;
	}
	
	var imageW = image.width;
	var imageH = image.height;

	if(imageW <= 0 || imageH <= 0) {
		return;
	}
	

	var dx = (this.w - imageW)/2;
	var dy = (this.h - imageH)/2;
	canvas.drawImage(image, 0, 0, imageW, imageH, dx, dy, imageW, imageH);

	return;
}

ImageRectShape.prototype.paintShape = function(canvas) {
	canvas.rect(0, 0, this.w, this.h);		

	return;
}	

ImageRectShape.prototype.asIcon = function(canvas) {
	this.isIcon = true;
	this.resize(36, 36);
	this.setStyle(getIconShapeStyle());

	this.setImage("ide/images/image.png");

	return;
}

/////////////////////////////}CubeShapeCreator{/////////////////////////////////////////

function CubeShapeCreator() {
	var args = ["cube", "Cube", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new CubeShape();
		return g.initRectShape(this.type, 200, 200);
	}
	
	return;
}

function CubeShape() {
	return;
}

CubeShape.prototype = new RectShape();

CubeShape.prototype.paintShape = function(canvas) {
	var r = this.R;

	var vv = 0.25 * this.h;
	var hv = 0.25 * this.w;

	canvas.beginPath();
	canvas.rect(0, vv, this.w - hv, this.h - vv);
	canvas.stroke();
	canvas.fill();

	canvas.beginPath();
	canvas.moveTo(0, vv);
	canvas.lineTo(hv, 0);
	canvas.lineTo(this.w, 0);
	canvas.lineTo(this.w - hv, vv);
	canvas.lineTo(0, vv);
	canvas.stroke();
	canvas.fill();

	canvas.beginPath();
	canvas.moveTo(this.w - hv, vv);
	canvas.lineTo(this.w - hv, this.h);
	canvas.lineTo(this.w, this.h - vv);
	canvas.lineTo(this.w, 0);

	return;
}	

/////////////////////////////}CylinderShape{/////////////////////////////////////////

function CylinderShapeCreator() {
	var args = ["cylinder", "Cylinder", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new CylinderShape();

		return g.initRectShape(this.type, 200, 200);
	}
	
	return;
}

function CylinderShape() {
	return;
}

CylinderShape.prototype = new RectShape();
CylinderShape.prototype.getNearPoint = CircleShape.prototype.getNearPoint;

CylinderShape.prototype.paintShape = function(canvas) {
	var r = this.R;

	var h = 0.5 * this.h;
	
	var x = this.w/2;
	var y = h/2;
	var scale = h/this.w;
	
	canvas.save();
	canvas.translate(x, y);
	canvas.scale(1, scale);
	canvas.arc(0, 0, this.w/2, 0, 2 * Math.PI);		
	canvas.restore();
	canvas.stroke();
	canvas.fill();
	canvas.beginPath();

	canvas.save();
	canvas.translate(x, y);
	canvas.scale(1, scale);
	canvas.arc(0, 0, this.w/2, 0, Math.PI);		
	canvas.restore();

	canvas.moveTo(0, h/2);
	canvas.lineTo(0, this.h - h/2);
	canvas.save();
	y = this.h - h/2;
	canvas.translate(x, y);
	canvas.scale(1, scale);
	canvas.arc(0, 0, this.w/2, 0, Math.PI);		
	canvas.restore();
	canvas.moveTo(this.w, h/2);
	canvas.lineTo(this.w, this.h - h/2);
	canvas.stroke();
	canvas.fill();
	canvas.beginPath();

	return;
}	

/////////////////////////////}FourArrowShape{/////////////////////////////////////////

function FourArrowShapeCreator(type, feature) {
	var icon_x = 100;
	var icon_y = 80;

	switch(feature) {
		case C_SHAPE_THREE_LEFT_ARROW: {
			icon_x = 0;
			icon_y = 120;
			break;
		}
		case C_SHAPE_THREE_RIGHT_ARROW: {
			icon_x = 80;
			icon_y = 80;
			break;
		}
		case C_SHAPE_THREE_DOWN_ARROW: {
			icon_x = 20;
			icon_y = 120;
			break;
		}
		case C_SHAPE_THREE_UP_ARROW: {
			icon_x = 40;
			icon_y = 120;
			break;
		}
		default:break;
	}

	this.feature= feature;
	var args = [type, "Four arrow", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var has_up = 1;
		var has_right = 1;
		var has_down = 1;
		var has_left = 1;
	
		switch(this.feature) {
			case C_SHAPE_THREE_LEFT_ARROW: {
				has_right = 0;
				break;
			}
			case C_SHAPE_THREE_RIGHT_ARROW: {
				has_left = 0;
				break;
			}
			case C_SHAPE_THREE_DOWN_ARROW: {
				has_up = 0;
				break;
			}
			case C_SHAPE_THREE_UP_ARROW: {
				has_down = 0;
				break;
			}
			default:break;
		}

		var g = new FourArrowShape();
		
		g.initRectShape(this.type, 200, 200);
		g.setAttr(has_up, has_right, has_down, has_left);

		return g;
	}
	
	return;
}

var C_SHAPE_FOUR_ARROW = 50;
var C_SHAPE_THREE_LEFT_ARROW = 60;
var C_SHAPE_THREE_RIGHT_ARROW = 70;
var C_SHAPE_THREE_DOWN_ARROW = 80;
var C_SHAPE_THREE_UP_ARROW = 90;

function FourArrowShape() {
	return;
}

FourArrowShape.prototype = new RectShape();

FourArrowShape.prototype.setAttr= function(has_up, has_right, has_down, has_left) {
	this.has_left = has_left;
	this.has_right = has_right;
	this.has_up = has_up;
	this.has_down = has_down;

	return;
}

FourArrowShape.prototype.paintShape = function(canvas) {
	var s = Math.min(this.w/4, this.h/4);
	
	if(s > 30) s = 30;

	if(this.has_up) {
		canvas.moveTo(this.w/2 - 0.5 * s, (this.h/2) - 0.5 * s);
		canvas.lineTo(this.w/2 - 0.5 * s, s);
		canvas.lineTo(this.w/2 - 1.5 * s, s);
		canvas.lineTo(this.w/2, 0);
		canvas.lineTo(this.w/2 + 1.5 * s, s);
		canvas.lineTo(this.w/2 + 0.5 * s, s);
	}

	if(this.has_right) {
		canvas.lineTo(this.w/2 + 0.5 * s, (this.h - s)/2);
		canvas.lineTo(this.w - s, (this.h - s)/2);
		canvas.lineTo(this.w - s, (this.h - s)/2 - s);
		canvas.lineTo(this.w, (this.h/2));
		canvas.lineTo(this.w - s, (this.h/2) + 1.5 * s);
		canvas.lineTo(this.w - s, (this.h/2) + 0.5 * s);
		canvas.lineTo(this.w/2 + 0.5 * s, (this.h/2) + 0.5 * s);
	}

	if(this.has_down) {
		canvas.lineTo(this.w/2 + 0.5 * s, this.h - s);
		canvas.lineTo(this.w/2 + 1.5 * s, this.h - s);
		canvas.lineTo(this.w/2, this.h);
		canvas.lineTo(this.w/2 - 1.5 * s, this.h - s);
		canvas.lineTo(this.w/2 - 0.5 * s, this.h - s);
		canvas.lineTo(this.w/2 - 0.5 * s, (this.h/2) + 0.5 * s);
	}

	if(this.has_left) {
		canvas.lineTo(s, (this.h/2) + 0.5 * s);
		canvas.lineTo(s, (this.h/2) + 1.5 * s);
		canvas.lineTo(0, (this.h/2));
		canvas.lineTo(s, (this.h/2) - 1.5 * s);
		canvas.lineTo(s, (this.h/2) - 0.5 * s);
	}

	return;
}	

FourArrowShape.prototype.asIcon = function(canvas) {
	this.isIcon = true;
	this.resize(36, 36);
	this.setStyle(getIconShapeStyle());
	
	if(!this.has_up || !this.has_down) {
		this.resize(20, 36);
	}

	if(!this.has_left || !this.has_right) {
		this.resize(20, 36);
	}

	return;
}	

/////////////////////////////}LeftArrowShape{/////////////////////////////////////////

function LeftArrowShapeCreator() {
	var args = ["left-arrow", "Left Arrow", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new RectShape();
		g.initRectShape(this.type, 200, 60);
		g.paintShape= function(canvas) {
			var sw = this.w / 4;
			var sh = this.h / 2;

			canvas.beginPath();
			canvas.moveTo(sw, 0.5*sh);
			canvas.lineTo(sw, 0);
			canvas.lineTo(0, sh);
			canvas.lineTo(sw, 2 * sh);
			canvas.lineTo(sw, 1.5 * sh);
			canvas.lineTo(this.w, 1.5 * sh);
			canvas.lineTo(this.w, 0.5 * sh);
			canvas.lineTo(sw, 0.5 * sh);
			
			this.strokeFill(canvas);
			canvas.beginPath();
		}
		
		return g;
	}
	
	return;
}

/////////////////////////////}RightArrowShape{/////////////////////////////////////////

function RightArrowShapeCreator() {
	var args = ["right-arrow", "Right Arrow", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new RectShape()
		g.initRectShape(this.type, 200, 60);
		g.paintShape= function(canvas) {
			var sw = this.w / 4;
			var sh = this.h / 2;
			
			canvas.beginPath();
			canvas.moveTo(0, 0.5*sh);
			canvas.lineTo(this.w-sw, 0.5*sh);
			canvas.lineTo(this.w-sw, 0);
			canvas.lineTo(this.w, this.h/2);
			canvas.lineTo(this.w-sw, this.h);
			canvas.lineTo(this.w-sw, this.h - 0.5 *sh);
			canvas.lineTo(0, 1.5 * sh);
			canvas.lineTo(0, 0.5*sh);
			canvas.lineTo(this.w-sw, 0.5*sh);
			
			this.strokeFill(canvas);
			canvas.beginPath();
		}
		
		return g;
	}
	
	return;
}

/////////////////////////////}UpArrowShape{/////////////////////////////////////////

function UpArrowShapeCreator() {
	var args = ["up-arrow", "Up Arrow", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new RectShape();
		g.initRectShape(this.type, 60, 200);
		g.oldDrawText = g.drawText;
		g.drawText = function(canvas) {
			canvas.save();
			canvas.translate(this.w/2, this.h/2);
			canvas.rotate(Math.PI * 1.5);
			canvas.translate(-this.w/2, -this.h/2);

			this.oldDrawText(canvas);
			canvas.restore();

			return;
		}
		g.paintShape= function(canvas) {
			var sh = this.h / 4;
			var sw = this.w / 2;
			
			canvas.beginPath();
			canvas.moveTo(0.5 * sw, sh);
			canvas.lineTo(0, sh);
			canvas.lineTo(sw, 0);
			canvas.lineTo(this.w, sh);
			canvas.lineTo(this.w-0.5 * sw, sh);
			canvas.lineTo(this.w-0.5 * sw, this.h);
			canvas.lineTo(0.5 * sw, this.h);
			canvas.lineTo(0.5 * sw, sh);
			
			this.strokeFill(canvas);
			canvas.beginPath();
		}
		
		return g;
	}
	
	return;
}

/////////////////////////////}DownArrowShape{/////////////////////////////////////////

function DownArrowShapeCreator() {
	var args = ["down-arrow", "Down Arrow", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new RectShape();
		g.initRectShape(this.type, 60, 200);
		g.oldDrawText = g.drawText;
		g.drawText = function(canvas) {
			canvas.save();
			canvas.translate(this.w/2, this.h/2);
			canvas.rotate(Math.PI * 0.5);
			canvas.translate(-this.w/2, -this.h/2);

			this.oldDrawText(canvas);
			canvas.restore();

			return;
		}
		g.paintShape= function(canvas) {
			var sh = this.h / 4;
			var sw = this.w / 2;
			
			canvas.beginPath();
			canvas.moveTo(this.w - 0.5 * sw, this.h - sh);
			canvas.lineTo(this.w, this.h - sh);
			canvas.lineTo(sw, this.h);
			canvas.lineTo(0, this.h - sh);
			canvas.lineTo(0.5 * sw, this.h - sh);
			canvas.lineTo(0.5 * sw, 0);
			canvas.lineTo(this.w - 0.5 * sw, 0);
			canvas.lineTo(this.w - 0.5 * sw, this.h - sh);
			
			this.strokeFill(canvas);
			canvas.beginPath();
		}
		
		return g;
	}
	
	return;
}

/////////////////////////////}HorArrowShape{/////////////////////////////////////////

function HorArrowShapeCreator() {
	var args = ["hor-arrow", "Hor Arrow", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new RectShape();
		
		g.initRectShape(this.type, 200, 60);
		g.paintShape= function(canvas) {
			var sw = this.w / 4;
			var sh = this.h / 2;

			canvas.beginPath();
			canvas.moveTo(sw, 0.5*sh);
			canvas.lineTo(sw, 0);
			canvas.lineTo(0, sh);
			canvas.lineTo(sw, 2 * sh);
			canvas.lineTo(sw, 1.5 * sh);

			canvas.lineTo(this.w-sw, 1.5 * sh);
			canvas.lineTo(this.w-sw, 2 * sh);
			canvas.lineTo(this.w, sh);
			canvas.lineTo(this.w-sw, 0);
			canvas.lineTo(this.w-sw, 0.5 * sh);
			canvas.lineTo(sw, 0.5 * sh);
			
			this.strokeFill(canvas);
			canvas.beginPath();
		}
		
		return g;
	}
	
	return;
}

/////////////////////////////}VerArrowShape{/////////////////////////////////////////

function VerArrowShapeCreator() {
	var args = ["ver-arrow", "Ver Arrow", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new RectShape();
		g.initRectShape(this.type, 60, 200);

		g.oldDrawText = g.drawText;
		g.drawText = function(canvas) {
			canvas.save();
			canvas.translate(this.w/2, this.h/2);
			canvas.rotate(Math.PI * 1.5);
			canvas.translate(-this.w/2, -this.h/2);

			this.oldDrawText(canvas);
			canvas.restore();

			return;
		}

		g.paintShape= function(canvas) {
			var sh = this.h / 4;
			var sw = this.w / 2;
			
			canvas.beginPath();
			canvas.moveTo(0.5 * sw, sh);
			canvas.lineTo(0, sh);
			canvas.lineTo(sw, 0);
			canvas.lineTo(this.w, sh);
			canvas.lineTo(this.w-0.5 * sw, sh);
			canvas.lineTo(this.w-0.5 * sw, this.h-sh);

			canvas.lineTo(this.w, this.h-sh);
			canvas.lineTo(sw, this.h);
			canvas.lineTo(0, this.h-sh);
			canvas.lineTo(0.5 * sw, this.h-sh);
			canvas.lineTo(0.5 * sw, sh);
			this.strokeFill(canvas);
			canvas.beginPath();
		}
		
		return g;
	}
	
	return;
}

/////////////////////////////}TriRectShape{/////////////////////////////////////////

function TriRectShapeCreator() {
	var args = ["tri-rect", "Tri Rect", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new TriRectShape();

		return g.initRectShape(this.type, 200, 60);
	}
	
	return;
}

function TriRectShape() {
	return;
}

	
TriRectShape.prototype = new RectShape();

TriRectShape.prototype.getNearPoint = CircleShape.prototype.getNearPoint;
TriRectShape.prototype.paintShape = function(canvas) {
	var hf = this.h/2;
	var wf = this.w/2;
	
	if(wf > hf) wf = hf;

	canvas.moveTo(0, hf);
	canvas.lineTo(wf, 0);
	canvas.lineTo(this.w - wf, 0);
	canvas.lineTo(this.w, hf);
	canvas.lineTo(this.w - wf, this.h);
	canvas.lineTo(wf, this.h);
	canvas.lineTo(0, hf);
	
	return;
}	

TriRectShape.prototype.asIcon = function() {
	this.isIcon = true;
	this.resize(44, 30);
	this.setStyle(getIconShapeStyle());
	
	return;
}

/////////////////////////////}RoundRectShape{/////////////////////////////////////////

function RoundRectShapeCreator(type) {
	type = type ? type : "rounded-rect";
	var args = [type, "Rounded Rect", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new RoundRectShape();

		g.initRectShape(this.type, 200, 60);
		g.setTextType(Shape.TEXT_TEXTAREA);

		return g;
	}
	
	return;
}

function RoundRectShape() {
	this.R = 10;

	return;
}

RoundRectShape.prototype = new RectShape();
RoundRectShape.prototype.getNearPoint = CircleShape.prototype.getNearPoint;

RoundRectShape.prototype.paintShape= function(canvas) {
	var r = this.R;
	
	if(r > this.w/2) r = Math.round(this.w/2);
	if(r > this.h/2) r = Math.round(this.h/2);
	
	if(this.isIcon) {
		r = 5;
	}

	canvas.arc(r, r, r, Math.PI, 1.5*Math.PI, false);
	canvas.lineTo(this.w - r, 0);
	
	canvas.arc(this.w-r, r, r, 1.5*Math.PI, 2*Math.PI,  false);
	canvas.lineTo(this.w, this.h-r);
	
	canvas.arc(this.w-r, this.h-r, r, 0, 0.5*Math.PI, false);
	canvas.lineTo(r, this.h);
	
	canvas.arc(r, this.h-r, r, 0.5 * Math.PI, Math.PI, false);
	canvas.lineTo(0, r);
	
	return;
}	

RoundRectShape.prototype.asIcon = function() {
	this.isIcon = true;
	this.resize(36, 30);
	this.setStyle(getIconShapeStyle());
	
	return;
}

/////////////////////////////}ParallRectShape{/////////////////////////////////////////

function ParallRectShapeCreator(type, w, h) {
	type = type ? type : "parall-rect";
	var args = [type, "Parall Rect", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new ParallRectShape();
		return g.initRectShape(this.type, w ? w : 200, h ? h : 60);
	}
	
	return;
}

function ParallRectShape() {
	return;
}

ParallRectShape.prototype = new RectShape();

ParallRectShape.prototype.getSelectMark = function(type, point) {
	var ret = true;
	switch(type) {
		case Shape.HIT_TEST_TL: {
			point.x = this.h;
			point.y = 0;
			break;
		}
		case Shape.HIT_TEST_TM: {
			point.x = (this.w)/2;
			point.y = 0;
			break;
		}
		case Shape.HIT_TEST_TR: {
			point.x = this.w;
			point.y = 0;
			break;
		}
		case Shape.HIT_TEST_ML: {
			point.x = this.h/2;
			point.y = this.h/2;
			break;
		}
		case Shape.HIT_TEST_MR: {
			point.x = this.w-this.h/2;
			point.y = this.h/2;
			break;
		}
		case Shape.HIT_TEST_BL: {
			point.x = 0;
			point.y = this.h;
			break;
		}
		case Shape.HIT_TEST_BM: {
			point.x = (this.w)/2;
			point.y = this.h;
			break;
		}
		case Shape.HIT_TEST_BR: {
			point.x = this.w-this.h;
			point.y = this.h;
			break;
		}
		default: ret = false;
	}

	point.x = Math.round(point.x);
	point.y = Math.round(point.y);

	return ret;
}

ParallRectShape.prototype.paintShape = function(canvas) {
	if(this.isIcon)
	{
		var d = 10;
		canvas.moveTo(0, this.h);		
		canvas.lineTo(d, 0);
		canvas.lineTo(this.w, 0);
		canvas.lineTo(this.w-d, this.h);
		canvas.lineTo(0, this.h);
	}
	else
	{
		canvas.moveTo(0, this.h);		
		canvas.lineTo(this.h, 0);
		canvas.lineTo(this.w, 0);
		canvas.lineTo(this.w-this.h, this.h);
		canvas.lineTo(0, this.h);
	}

	return;
}	

ParallRectShape.prototype.asIcon = function() {
	this.resize(40, 32);
	if(!this.isIcon) {
		this.setStyle(getIconShapeStyle());
	}
	this.isIcon = true;

	return;
}

/////////////////////////////}DiamondShape{/////////////////////////////////////////

function DiamondShapeCreator(type, w, h) {
	type = type ? type : "diamond";	
	var args = [type, "Diamond", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new DiamondShape();

		return g.initRectShape(this.type, w ? w : 200, h ? h : 60);
	}
	
	return;
}

function DiamondShape() {
	return;
}

DiamondShape.prototype = new RectShape();
DiamondShape.prototype.getNearPoint = CircleShape.prototype.getNearPoint;

DiamondShape.prototype.paintShape = function(canvas) {
	var halfH = Math.round(this.h/2);
	var halfW = Math.round(this.w/2);

	canvas.moveTo(0, halfH);		
	canvas.lineTo(halfW, 0);
	canvas.lineTo(this.w, halfH);
	canvas.lineTo(halfW, this.h);
	canvas.lineTo(0, halfH);	

	return;
}	
	
function ArcRectShapeCreator(type) {
	type = type ? type : "arc-rect";
	var args = [type, "Arc Rect", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new ArcRectShape();
		g.initRectShape(this.type, 200, 60);
		g.setTextType(Shape.TEXT_TEXTAREA);

		return g;
	}
	
	return;
}

function ArcRectShape() {
	return;
}

ArcRectShape.prototype = new RectShape();
ArcRectShape.prototype.getNearPoint = CircleShape.prototype.getNearPoint;

ArcRectShape.prototype.paintShape = function(canvas) {
	var r = Math.floor(this.h/2);
	
	if(r > this.w/2) r = Math.floor(this.w/2);
	if(r > this.h/2) r = Math.floor(this.h/2);
			
	canvas.arc(r, r, r, Math.PI, 1.5*Math.PI, false);
	canvas.lineTo(this.w - r, 0);
	
	canvas.arc(this.w-r, r, r, 1.5*Math.PI, 2*Math.PI,  false);
	canvas.lineTo(this.w, this.h-r);
	
	canvas.arc(this.w-r, this.h-r, r, 0, 0.5*Math.PI, false);
	canvas.lineTo(r, this.h);
	
	canvas.arc(r, this.h-r, r, 0.5 * Math.PI, Math.PI, false);
	canvas.lineTo(0, r);

	return;
}	

ArcRectShape.prototype.asIcon = function() {
	this.isIcon = true;
	this.resize(40, 30);
	this.setStyle(getIconShapeStyle());
	
	return;
}

/////////////////////////////}LineShape{/////////////////////////////////////////

function LineShapeCreator() {
	var args = ["line", "Line", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new LineShape();
		g.initLShape(null, this.type);

		return g;
	}
	
	return;
}

function LineShape() {
	return;
}

LineShape.prototype = new LShape();

LineShape.prototype.initDefault = function() {
	this.type = "line";
	this.points_nr = 0;
	this.points.push(new Point(0, 0));
	this.points.push(new Point(50, 50));
	this.state = Shape.STAT_CREATING_0;

	return;
}

LineShape.prototype.updatePoint = function(index, point) {
	if(index < this.points.length) {
		this.points[index].copy(point);
		
		var other = index===1 ? 0:1;
		var dx = Math.abs(point.x - this.points[other].x);
		var dy = Math.abs(point.y - this.points[other].y);
		if(this.isCtrlDown()) {
			if(dx < dy)	{
				this.points[index].x = this.points[other].x;
			}
			else {
				this.points[index].y = this.points[other].y;
			}
		}
		else if(dx <= 5 && dy > 20) {
			this.points[index].x = this.points[other].x;
		}
		else if(dy <= 5 && dx > 20) {
			this.points[index].y = this.points[other].y;
		}
	}

	return true;
}

LineShape.prototype.getNearPoint = function(i) {
	var p = null;

	switch(i) {
		case 0: {
			p = this.points[0];
			break;
		}
		case 1: {
			p = this.points[1];
			break;
		}
		case 2: {
			p = {x:0, y:0};
			p.x = (this.points[0].x + this.points[1].x)/2;
			p.y = (this.points[0].y + this.points[1].y)/2;
			break;
		}
	}

	return p;
}

LineShape.prototype.isPointIn = function(canvas, point) {
	return this.isPointInSegment(canvas, this.points[0], this.points[1], point);	
}

LineShape.prototype.handlePointerEvent = function(point, evt) {
	if(this.state === Shape.STAT_NORMAL) {
		return true;
	}

	if(evt === C_EVT_POINTER_DOWN) {
		this.points[0].copy(point);
		this.attachToNearPoint(this.near, 0);

		this.points[1].x = point.x + 10;
		this.points[1].y = point.y + 10;
	}
	else if(evt === C_EVT_POINTER_MOVE) {
		var dx = point.x - this.lastPosition.x;
		var dy = point.y - this.lastPosition.y;

		if(this.pointerDown) {
			this.updatePoint(1, point);
		}
		else {
			this.moveDelta(dx, dy);
		}
	
		this.postRedraw();
	}
	else if(evt === C_EVT_POINTER_UP) {
		this.setSelected(true);
		this.state = Shape.STAT_NORMAL;
		if(this.isClicked()) {
			var p = new Point(this.points[0].x + 100, this.points[0].y + 100);
			this.updatePoint(1, p);
		}
		else {
			this.attachToNearPoint(this.near, 1);
		}
	}

	return true;
}

LineShape.prototype.drawArrows = function(canvas) {
	var arrowSize = this.style.arrowSize;
	var arrowType = this.style.firstArrowType;
	if(arrowType) {
		drawArrow(canvas, arrowType, this.points[1], this.points[0], arrowSize);
	}

	var arrowType = this.style.secondArrowType;
	if(arrowType) {
		drawArrow(canvas, arrowType, this.points[0], this.points[1], arrowSize);
	}
	canvas.beginPath();

	return;
}

LineShape.prototype.drawLine = function(canvas) {
	var f = (this.style.lineStyle >> 8) & 0xFF;
	var e = (this.style.lineStyle) & 0xFF;
	drawDashedLine(canvas, this.points[0], this.points[1], f, e);
	
	canvas.stroke();

	return;
}

LineShape.prototype.paintSelf = function(canvas) {
	canvas.save();
	this.translate(canvas);
	canvas.beginPath();
	
	this.prepareStyle(canvas);
	this.drawLine(canvas);
	this.drawArrows(canvas);
	this.resetStyle(canvas);

	this.drawText(canvas);
	this.drawSelectMarks(canvas);
	this.drawTips(canvas);

	canvas.restore();
	
	return;
}

LineShape.prototype.asIcon = function() {
	this.points[0].x = 0;
	this.points[0].y = 0;
	this.points[1].x = 20;
	this.points[1].y = 20;
	this.isIcon = true;
	this.setStyle(getIconShapeStyle());
	
	return;
}

/////////////////////////////}VLineShape{/////////////////////////////////////////

function VLineShapeCreator(type) {
	var args = [type, type, null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new VLineShape();

		g.initLShape(null, this.type);

		return g;
	}
	
	return;
}

function VLineShape() {
}

VLineShape.prototype = new LineShape();

VLineShape.prototype.updatePoint = function(index, point) {
	if(index === 0) {
		this.points[0].x = this.points[1].x;
		this.points[0].y = point.y;
	}
	else {
		this.points[1].x = this.points[0].x;
		this.points[1].y = point.y;
	}

	return true;
}

VLineShape.prototype.asIcon = function() {
	this.points[0].x = 0;
	this.points[0].y = 0;
	this.points[1].x = 0;
	this.points[1].y = 30;

	this.isIcon = true;
	this.setStyle(getIconShapeStyle());
	
	return;
}

VLineShape.prototype.initDefault = function() {
	this.type = "line";
	this.points_nr = 0;
	this.points.push(new Point(0, 0));
	this.points.push(new Point(0, 50));
	this.state = Shape.STAT_CREATING_0;

	return;
}

/////////////////////////////}HLineShape{/////////////////////////////////////////

function HLineShapeCreator(type) {
	var args = [type, type, null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new HLineShape();

		g.initLShape(null, this.type);

		return g;
	}
	
	return;
}

function HLineShape() {
}

HLineShape.prototype = new LineShape();

HLineShape.prototype.updatePoint = function(index, point) {
	if(index === 0) {
		this.points[0].y = this.points[1].y;
		this.points[0].x = point.x;
	}
	else {
		this.points[1].y = this.points[0].y;
		this.points[1].x = point.x;
	}

	return true;
}

HLineShape.prototype.asIcon = function() {
	this.points[0].x = 0;
	this.points[0].y = 0;
	this.points[1].x = 30;
	this.points[1].y = 0;

	this.isIcon = true;
	this.setStyle(getIconShapeStyle());
	
	return;
}

HLineShape.prototype.initDefault = function() {
	this.type = "line";
	this.points_nr = 0;
	this.points.push(new Point(0, 0));
	this.points.push(new Point(50, 0));
	this.state = Shape.STAT_CREATING_0;

	return;
}

/////////////////////////////}ArrowShapeCreator{/////////////////////////////////////////

function ArrowShapeCreator(type, arrowType, lineStyle) {
	var args = [type, "Arrow", null, 1];
	
	this.arrowType = arrowType;
	this.lineStyle = lineStyle;

	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		
		var g = new LineShape();
			
		g.initLShape(null, this.type);

		g.style.setFirstArrowType(C_ARROW_NONE);
		g.style.setSecondArrowType(this.arrowType);
		g.style.setLineStyle(this.lineStyle);
		g.setOptions(true, true, true, (this.arrowType == C_ARROW_NONE));

		return g;
	}
	
	return;
}

/////////////////////////////}SegmentsShape{/////////////////////////////////////////

function SegmentsShapeCreator(type) {
	type = type ? type : "segments";
	var args = [type, "Segments", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new SegmentsShape();
		g.initLShape(null, this.type);
		g.style.setSecondArrowType(C_ARROW_NORMAL);

		return g;
	}
	
	return;
}

function SegmentsShape() {
	return;
}

SegmentsShape.prototype = new LShape();

SegmentsShape.prototype.initDefault = function() {
	this.type = "segments";
	this.points_nr = 0;
	this.points.push(new Point(0, 0));
	this.points.push(new Point(60, 0));
	this.points.push(new Point(60, 60));
	this.points.push(new Point(0, 60));
	this.state = Shape.STAT_CREATING_0;

	return;
}

SegmentsShape.prototype.updatePoint = function(index, point) {
	var dx = 0;
	var dy = 0;
	if(index < this.points.length) {
		this.points[index].copy(point);
	}

	if(this.state === Shape.STAT_NORMAL) {
		var prev = (index === 0) ? 1 : (index - 1);

		dx = Math.abs(this.points[index].x - this.points[prev].x);
		dy = Math.abs(this.points[index].y - this.points[prev].y);

		if(dx < 5 && dy > 10) {
			this.points[index].x = this.points[prev].x;
		}
		
		if(dy < 5 && dx > 10) {
			this.points[index].y = this.points[prev].y;
		}
		
		if(index == 1 || index == 2) {
			dx = Math.abs(this.points[3].x - this.points[0].x);
			dy = Math.abs(this.points[3].y - this.points[0].y);
			if(dx < dy) {
				if(index == 1) {
					this.points[2].x = this.points[1].x;
				}
				else {
					this.points[1].x = this.points[2].x;
				}
			}
			else {
				if(index == 1) {
					this.points[2].y = this.points[1].y;
				}
				else {
					this.points[1].y = this.points[2].y;
				}
			}
		}
	}
	else {
		if(index === 3) {
			this.points[1].x = this.points[0].x + 100;
			this.points[1].y = this.points[0].y;
			
			this.points[2].x = this.points[1].x;
			this.points[2].y = this.points[3].y;
		}
	}

	return true;
}

SegmentsShape.prototype.isPointIn = function(canvas, point) {
	
	if(this.isPointInSegment(canvas, this.points[0], this.points[1], point)) {
		return true;
	}
	
	if(this.isPointInSegment(canvas, this.points[1], this.points[2], point)) {
		return true;
	}
	
	if(this.isPointInSegment(canvas, this.points[2], this.points[3], point)) {
		return true;
	}


	return false;
}

SegmentsShape.prototype.handlePointerEvent = function(point, evt) {
	if(this.state === Shape.STAT_NORMAL) {
		return true;
	}

	if(evt === C_EVT_POINTER_DOWN) {
		if(!this.near) {
			this.points[0].copy(point);
		}
		this.attachToNearPoint(this.near, 0);
		
		this.points[1].x = point.x + 60;
		this.points[1].y = point.y;
		
		this.points[2].x = point.x + 60;
		this.points[2].y = point.y + 60;
		
		this.points[3].x = point.x ;
		this.points[3].y = point.y + 60;
	}
	else if(evt === C_EVT_POINTER_MOVE) {
		var dx = point.x - this.lastPosition.x;
		var dy = point.y - this.lastPosition.y;

		if(this.pointerDown) {
			this.updatePoint(3, point);
		}
		else {
			this.moveDelta(dx, dy);
		}
	
		this.postRedraw();
	}
	else if(evt === C_EVT_POINTER_UP) {
		this.setSelected(true);
		this.state = Shape.STAT_NORMAL;
		this.attachToNearPoint(this.near, 3);
	}

	return true;
}

SegmentsShape.prototype.drawArrows = function(canvas) {
	var arrowSize = this.style.arrowSize;
	var arrowType = this.style.firstArrowType;
	if(arrowType) {
		drawArrow(canvas, arrowType, this.points[1], this.points[0], arrowSize);
	}

	var arrowType = this.style.secondArrowType;
	if(arrowType) {
		drawArrow(canvas, arrowType, this.points[2], this.points[3], arrowSize);
	}
	canvas.beginPath();

	return;
}

SegmentsShape.prototype.drawSegments = function(canvas) {
	var f = (this.style.lineStyle >> 8) & 0xFF;
	var e = (this.style.lineStyle) & 0xFF;
	
	drawDashedLine(canvas, this.points[0], this.points[1], f, e);
	drawDashedLine(canvas, this.points[1], this.points[2], f, e);
	drawDashedLine(canvas, this.points[2], this.points[3], f, e);
	
	canvas.stroke();

	return;
}

SegmentsShape.prototype.paintSelf = function(canvas) {
	canvas.save();
	this.translate(canvas);
	canvas.beginPath();
	
	this.prepareStyle(canvas);
	this.drawSegments(canvas);
	this.drawArrows(canvas);
	this.resetStyle(canvas);

	this.drawText(canvas);
	this.drawSelectMarks(canvas);
	this.drawTips(canvas);

	canvas.restore();
	
	return;
}

SegmentsShape.prototype.asIcon = function() {
	this.points[0].x = 0;
	this.points[0].y = 0;
	this.points[1].x = 20;
	this.points[1].y = 0;
	
	this.points[2].x = 20;
	this.points[2].y = 20;
	this.points[3].x = 0;
	this.points[3].y = 20;
	this.isIcon = true;
	this.setStyle(getIconShapeStyle());
	this.style.setSecondArrowType(C_ARROW_NORMAL);

	return;
}

/////////////////////////////}CurveShape{/////////////////////////////////////////

function CurveShapeCreator() {
	var args = ["curve", "Curve", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new CurveShape();
		g.initLShape(null, this.type);
		g.style.setSecondArrowType(C_ARROW_NORMAL);

		return g;
	}
	
	return;
}

function CurveShape() {
	return;
}

CurveShape.prototype = new LShape();

CurveShape.prototype.isCurve = true;

CurveShape.prototype.initDefault = function() {
	this.type = "curve";
	this.points_nr = 0;
	this.points.push(new Point(0, 0));
	this.points.push(new Point(0, 60));
	this.points.push(new Point(60, 30));
	this.state = Shape.STAT_CREATING_0;

	return;
}

CurveShape.prototype.isPointsEnough = function() {
	return this.points_nr >= 3;
}

CurveShape.prototype.updatePoint = function(index, point) {
	if(index < this.points.length) {
		this.points[index].copy(point);
	}

	return true;
}

CurveShape.prototype.isPointIn = function(canvas, point) {
	var points = this.points;

	canvas.beginPath();
	canvas.moveTo(points[0].x, points[0].y);
	for(var i = 0; i < points.length; i++) {
		canvas.lineTo(points[i].x, points[i].y);
	}
	canvas.lineTo(points[0].x, points[0].y);

	return canvas.isPointInPath(point.x, point.y);
}

CurveShape.prototype.handlePointerEvent = function(point, evt) {
	if(this.state === Shape.STAT_NORMAL) {
		return true;
	}

	if(evt === C_EVT_POINTER_DOWN) {
		if(!this.near) {
			this.points[0].copy(point);
		}
		this.attachToNearPoint(this.near, 0);

		this.points[1].x = point.x;
		this.points[1].y = point.y + 30;
		this.points[2].x = point.x + 30;
		this.points[2].y = point.y + 15;
	}
	else if(evt === C_EVT_POINTER_MOVE) {
		if(this.pointerDown) {
			this.points[1].copy(point);

			var dx = this.points[0].x - this.points[1].x;
			var dy = this.points[0].y - this.points[1].y;
			
			var angle = Math.atan(dy/dx);
			var length = Math.sqrt(dx * dx + dy * dy);
			var center_x = (this.points[0].x + this.points[1].x)/2;
			var center_y = (this.points[0].y + this.points[1].y)/2;

			if(angle > Math.PI) {
				angle = angle - Math.PI;
			}

			this.points[2].x = center_x + Math.sin(Math.PI - angle) * length/2;
			this.points[2].y = center_y + Math.cos(Math.PI - angle) * length/2;
		}
		else {
			var dx = point.x - this.lastPosition.x;
			var dy = point.y - this.lastPosition.y;

			this.moveDelta(dx, dy);
		}
	
		this.postRedraw();
	}
	else if(evt === C_EVT_POINTER_UP) {
		this.setSelected(true);
		this.state = Shape.STAT_NORMAL;
		
		this.attachToNearPoint(this.near, 1);
	}

	return true;
}

CurveShape.prototype.drawArrows = function(canvas) {
	var arrowSize = this.style.arrowSize;
	var arrowType = this.style.firstArrowType;
	if(arrowType) {
		drawArrow(canvas, arrowType, this.points[2], this.points[0], arrowSize);
	}

	var arrowType = this.style.secondArrowType;
	if(arrowType) {
		drawArrow(canvas, arrowType, this.points[2], this.points[1], arrowSize);
	}

	return;
}

CurveShape.prototype.drawCurve = function(canvas) {
	canvas.lineWidth = this.style.lineWidth;			
	canvas.fillStyle = this.style.fillColor;
	canvas.strokeStyle = this.style.lineColor;

	var points = this.points;
	canvas.moveTo(points[0].x, points[0].y);
	canvas.quadraticCurveTo(points[2].x, points[2].y, points[1].x, points[1].y);	
	canvas.stroke();

	return;
}

CurveShape.prototype.paintSelf = function(canvas) {
	canvas.save();
	this.translate(canvas);

	this.prepareStyle(canvas);
	this.drawCurve(canvas);
	this.drawArrows(canvas);
	this.resetStyle(canvas);

	this.drawText(canvas);
	this.drawSelectMarks(canvas);
	this.drawTips(canvas);
	canvas.restore();
	
	return;
}

