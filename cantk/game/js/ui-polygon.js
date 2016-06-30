/*
 * File:   ui-polygon.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Basic polygon for game. 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIPolygon
 * @extends UIBody
 * 多边形刚体。是物理引擎中的多边形刚体。多边形可以是三角形，四边形，五边形和组合多边形，多边形必须是按顺时针形成的凸多边形。组合多边形每5个点组成一个多边形。
 */
function UIPolygon() {
	return;
}

UIPolygon.prototype = new UIBody();
UIPolygon.prototype.isUIPolygon = true;

UIPolygon.prototype.initUIPolygon = function(type, w, h) {
	this.initUIBody(type, w, h);	

	return this;
}

UIPolygon.prototype.shapeCanBeChild = function(shape) {
	if(!UIGroup.prototype.shapeCanBeChild.call(this, shape) || (shape.isUIJoint && !shape.isUIMouseJoint)) {
		return false;
	}

	if(shape.isUIPoint) {
		return true;
	}

	return !shape.isUIPhysicsShape;
}

UIPolygon.prototype.getVerticesArray = function() {
	var x0 = 0;
	var y0 = 0;
    var last2i = -1;
    var cx = this.w >> 1;
    var cy = this.h >> 1;
    var points = this.children.filter(function(child) {return child.isUIPoint});
    
    var vertices = points.map(function(p) {return new b2Vec2(p.x + (p.w >> 1), p.y + (p.h >> 1))});
   
    var complex = false;
    if(ClockWise(vertices) === CLOCKWISE) {
        vertices.reverse();
    }
    if(Convex(vertices) === CONCAVE) {
        complex = true;
    }
    
    var array = complex ? process(vertices) : vertices;
    return {complex: complex, vertices: array};
}

UIPolygon.prototype.drawShape = function(canvas) {
    if(!this.verticesInfo || this.isInDesignMode()) {
        this.verticesInfo = this.getVerticesArray();
    }
    var result = this.verticesInfo;
    var vertices = result.vertices;
    if(result.complex){
        var lines = [];
        if(vertices!= null) {
            for(i = 0; i < vertices.length; i = i + 3) {
                canvas.beginPath();
                lines.push([vertices[i], vertices[i+1]]);
                lines.push([vertices[i], vertices[i+2]]);
                lines.push([vertices[i+1], vertices[i+2]]);
                canvas.moveTo(vertices[i].x, vertices[i].y);
                canvas.lineTo(vertices[i+1].x, vertices[i+1].y);
                canvas.lineTo(vertices[i+2].x, vertices[i+2].y);
                canvas.closePath();
                canvas.globalAlpha = 0.4;
                //canvas.fillStyle = this.getDensity() > 0 ? "#ff00ff" : "#00ffff";
                //canvas.fill();
            } 
        }
        canvas.globalAlpha = 1;
        canvas.strokeStyle = "#ffffff";
        for(var i = 0; i < lines.length; i++) {
            var line = lines[i];
            canvas.moveTo(line[0].x, line[0].y);
            canvas.lineTo(line[1].x, line[1].y);
        }
    } else {
        canvas.beginPath();
        canvas.moveTo(vertices[0].x, vertices[0].y);
        for(var i = 1; i < vertices.length; i++) {
            canvas.lineTo(vertices[i].x, vertices[i].y);
        }
        canvas.closePath();
        canvas.globalAlpha = 0.4;
        //canvas.fillStyle = this.getDensity() > 0 ? "#ff00ff" : "#00ffff";
        //canvas.fill();
        canvas.globalAlpha = 1;
        canvas.strokeStyle = "#ffffff";
        canvas.stroke();
    }
}

UIPolygon.prototype.afterChildRemoved = function(shape) {
	if(shape.isUIPoint) {
        delete this.verticesInfo;
    }
    return true;
}

UIPolygon.prototype.afterChildAppended = function(shape) {
	if(shape.isUIPoint) {
		shape.z = shape.getIndex();
		shape.setShowIndex(true).setSize(20, 20);
        delete this.verticesInfo;
	}

	return;
}

UIPolygon.prototype.resizeBody = function(xScale, yScale) {
	var arr = [];
	var cx = this.w >> 1;
	var cy = this.h >> 1
	var n = this.children.length;
	var body = this.body;

	for(var i = 0; i < n; i++) {
		var iter = this.children[i];

		if(!iter.isUIPoint) {
			continue;
		}

		var hw = iter.w >> 1;
		var hh = iter.h >> 1;
		var icx = (iter.left + (hw >> 1)) * xScale;
		var icy = (iter.top + (hh >> 1)) * yScale;
		var left = icx - hw;
		var top = icy - hh;
		iter.setLeftTop(left, top);

		arr.push({x:Physics.toMeter(icx-cx), y:Physics.toMeter(icy-cy)});
	}

	var x = Physics.toMeter(this.left + (this.w >> 1));
	var y = Physics.toMeter(this.top + (this.h>>1));
	
	var shape = body.GetFixtureList().GetShape();
	shape.SetAsArray(arr, arr.length);

	var rotation = this.rotation;
	if(body.m_world.IsLocked()) {
		setTimeout(function() {
			body.SetAwake(true);
			body.SynchronizeFixtures();
			body.SetPositionAndAngle({x:x, y:y}, rotation);
		}, 0);
	}
	else {
		body.SetPosition(p);
	}

	return;
}

UIPolygon.prototype.setSize = function(w, h) {
	if(w === this.w && h === this.h) {
		console.log("UIPolygon.prototype.setSize: Size not changed.");
		return;
	}

	var xScale = w/this.w;
	var yScale = h/this.h;
	RShape.prototype.setSize.call(this, w, h);

	var win = this.getWindow();
	this.updateLayoutParams();

	if(this.body && win && win.isUIScene) {
		this.resizeBody(xScale, yScale);
	}

	return this;
}

UIPolygon.prototype.onFromJsonDone = function(js) {
	var n = this.children.length;
	for(var i = 0; i < n; i++) {
		var iter = this.children[i];
		if(iter.isUIPoint) {
			iter.z = iter.getIndex();
			iter.setShowIndex(true).setSize(20, 20);
		}
	}

	return;
}

function UIPolygonCreator() {
	var args = ["ui-polygon", "ui-polygon", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPolygon();
		return g.initUIPolygon(this.type, 200, 200, null);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIPolygonCreator());
