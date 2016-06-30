/*
 * File: ui-rubebody.js
 * Author: Johnny <johnny.yin@holaverse.cn>
 * Brief: body for create by rube
 *
 * Copyright (c) 2016 - 2017 Holaverse Inc.
 *
 */

function UIRubeBody() {
    return;
}

UIRubeBody.prototype = new UIBody();
UIRubeBody.prototype.isUIRubeBody = true;

UIRubeBody.prototype.initUIRubeBody = function(type, w, h) {
    this.initUIBody(type, w, h);
    
    return this;
}

UIRubeBody.prototype.shapeCanBeChild = function(shape) {
    return false;
}

UIRubeBody.prototype.setBody = function(body) {
    this.body = body;
}

UIRubeBody.prototype.drawCircle = function(canvas, fixture) {
    var shape = fixture.m_shape;
    var vertices = shape.m_vertices;
    var body = fixture.m_body;
    var bp = body.GetPosition();
    var mp = shape.m_p;
    var cx = this.w >> 1;
    var cy = this.h >> 1;
    var c = new b2Vec2(cx + Physics.toPixel(mp.x), cy + Physics.toPixel(mp.y));
    
    var r = Physics.toPixel(shape.m_radius);
    canvas.beginPath();
    canvas.arc(c.x, c.y, r, 0, Math.PI * 2);
    canvas.closePath();
    
    canvas.lineWidth = 2;
    canvas.strokeStyle = "#ffffff";
    canvas.stroke();
}

UIRubeBody.prototype.getConvexHull = function(vertices, vertexCount) {
    // Find the right most point on the hull
    var i0 = 0;
    var x0 = vertices[0].x;
    for(var i = 1; i < vertexCount; i++) {
        var x = vertices[i].x;
        if(x > x0 || (x == x0 && vertices[i].y < vertices[i0].y)){
            i0 = i;
            x0 = x;
        }
    }
    var hull = [];
    var m = 0; 
    var ih = i0;
    while(true){
        hull[m] = ih;

        var ie = 0;
        for(var j = 1; j < vertexCount; j++) {
            if(ie == ih) {
                ie = j;
                continue;
            }
            var r = b2Math.SubtractVV(vertices[ie], vertices[hull[m]]);
            var v = b2Math.SubtractVV(vertices[j], vertices[hull[m]]);
            var c = b2Math.CrossVV(r, v);
            if(c < 0) {
                ie = j;
            }

            // Collinearity check
            if(c == 0 && v.LengthSquared() > r.LengthSquared()) {
                ie = j;
            }
        }
        ++m;
        ih = ie;

        if(ie == i0) {
            break;
        }
    }

    if(m < 3) {
        return [];
    }

    if(m < vertexCount) {
        console.warn("some vertices have to be abandomed");
    }
   
    vertexCount = m; 
    var result = [];
    // Copy vertices
    var i = 0;
    for (i = 0;
            i < vertexCount; i++) {
        result[i] = new b2Vec2();
        result[i].SetV(vertices[hull[i]]);
    }

    return result;
}

UIRubeBody.prototype.drawPolygon = function(canvas, fixture) {
    var shape = fixture.m_shape;
    var vertices = shape.m_vertices;
    var body = fixture.m_body;
    var cx = this.w >> 1;
    var cy = this.h >> 1;
    var centroid = shape.m_centroid;
    var points = vertices.map(function(vert){
        return new b2Vec2(cx + Physics.toPixel(vert.x), cy + Physics.toPixel(vert.y))
    });
 
    points = this.getConvexHull(points, points.length);
    var length = points.length; 
    canvas.save();
    canvas.beginPath();
    canvas.moveTo(points[0].x, points[0].y); 
    for(var i = 1; i < length; i++){
        canvas.lineTo(points[i].x, points[i].y);
    } 
    canvas.closePath();
    canvas.strokeStyle = "#ffffff";
    canvas.lineWidth = 2;
    canvas.stroke();
    canvas.restore();
}

UIRubeBody.prototype.paintSelfOnly = function(canvas){
    if(!this.body){
        return;
    }
    var body = this.body;

    var fixtureList = body.GetFixtureList();
    if(!fixtureList) {
        //TODO check why fixtureList is null
        console.warn("empty fixtureList");
        return;
    }

    canvas.save();
    
    var fixture = fixtureList;
    while(fixture){
        var shape = fixture.m_shape;
        if(shape instanceof b2CircleShape) {
            this.drawCircle(canvas, fixture);
        } else if(shape instanceof b2PolygonShape) {
            this.drawPolygon(canvas, fixture);
        } else {
            console.warn("RUBE: unkown shape body type");
        }
        fixture = fixture.m_next;
    }
    canvas.restore();
}

function UIRubeBodyCreator() {
    var args = ["ui-rube-body", "ui-rube-body", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIRubeBody();
		return g.initUIRubeBody(this.type, 200, 200, null);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIRubeBodyCreator());
