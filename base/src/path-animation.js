/*
 * File:    path-animation.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief:   path animation
 * 
 * Copyright (c) 2015 - 2016  Holaverse Inc.
 * 
 */
function BasePath() {
	return;
}

BasePath.prototype.getPosition = function(t) {
	return {x:0, y:0};
}

BasePath.prototype.getDirection = function(t) {
	var p1 = this.getPosition(t);
	var p2 = this.getPosition(t+0.1);

	return BasePath.angleOf(p1, p2);
}

BasePath.prototype.getStartPoint = function() {
	return this.startPoint ? this.startPoint : this.getPosition(0);
}

BasePath.prototype.getEndPoint = function() {
	return this.endPoint ? this.endPoint : this.getPosition(this.duration);
}

BasePath.prototype.getSamples = function() {
	return this.samples;
}

BasePath.prototype.draw = function(ctx) {
	var n = this.getSamples();
	var p = this.getStartPoint();	

	ctx.moveTo(p.x, p.y);
	for(var i = 0; i <= n; i++) {
		var t = this.duration*i/n;
		var p = this.getPosition(t);
		ctx.lineTo(p.x, p.y);
	}

	return this;
}

BasePath.angleOf = function(from, to) {
	var dx = to.x - from.x;
	var dy = to.y - from.y;
	var d = Math.sqrt(dx * dx + dy * dy);

	if(dx == 0 && dy == 0) {
		return 0;
	}
	
	if(dx == 0) {
		if(dy < 0) {
			return 1.5 * Math.PI;
		}
		else {
			return 0.5 * Math.PI;
		}
	}

	if(dy == 0) {
		if(dx < 0) {
			return Math.PI;
		}
		else {
			return 0;
		}
	}

	var angle = Math.asin(Math.abs(dy)/d);
	if(dx > 0) {
		if(dy > 0) {
			return angle;
		}
		else {
			return 2 * Math.PI - angle;
		}
	}
	else {
		if(dy > 0) {
			return Math.PI - angle;
		}
		else {
			return Math.PI + angle;
		}
	}
}

/////////////////////////////////////////////////////

function LinePath(duration, interpolator, x1, y1, x2, y2) {
	this.dx = x2 - x1;
	this.dy = y2 - y1;
	this.x1 = x1;
	this.x2 = x2;
	this.y1 = y1;
	this.y2 = y2;
	this.duration = duration;
	this.interpolator = interpolator;
	this.angle = BasePath.angleOf({x:x1,y:y1}, {x:x2, y:y2});
	this.startPoint = {x:this.x1, y:this.y1};
	this.endPoint = {x:this.x2, y:this.y2};
	
	return;
}

LinePath.prototype = new BasePath();
LinePath.prototype.getPosition = function(time) {
	var t = time;
	var timePercent = Math.min(t/this.duration, 1);
	var percent = this.interpolator ? this.interpolator.get(timePercent) : timePercent;

	var x = this.x1 + this.dx * percent;
	var y = this.y1 + this.dy * percent;

	return {x:x, y:y};
}

LinePath.prototype.getDirection = function(t) {
	return this.angle;
}

LinePath.prototype.draw = function(ctx) {
	ctx.moveTo(this.x1, this.y1);
	ctx.lineTo(this.x2, this.y2);

	return this;
}

LinePath.create = function(duration, interpolator, x1, y1, x2, y2) {
	return new LinePath(duration, interpolator, x1, y1, x2, y2);
}

/////////////////////////////////////////////////////

function ArcPath(duration, interpolator, xo, yo, r, sAngle, eAngle) {
	this.xo = xo;
	this.yo = yo;
	this.r = r;
	this.sAngle = sAngle;
	this.eAngle = eAngle;
	this.duration = duration;
	this.interpolator = interpolator;
	this.angleRange = eAngle - sAngle;
	
	this.startPoint = this.getPosition(0);	
	this.endPoint = this.getPosition(duration);	

	return;
}

ArcPath.prototype = new BasePath();
ArcPath.prototype.getPosition = function(time) {
	var t = time;
	var timePercent = Math.min(t/this.duration, 1);
	var percent = this.interpolator ? this.interpolator.get(timePercent) : timePercent;
	var angle = this.sAngle + percent * this.angleRange;
	
	var x = this.xo + this.r * Math.cos(angle);
	var y = this.yo + this.r * Math.sin(angle);

	return {x:x, y:y};
}

ArcPath.prototype.getDirection = function(t) {
	var timePercent = Math.min(t/this.duration, 1);
	var percent = this.interpolator ? this.interpolator.get(timePercent) : timePercent;
	var angle = this.sAngle + percent * this.angleRange + Math.PI * 0.5;

	return angle;
}

ArcPath.prototype.draw = function(ctx) {
	ctx.arc(this.xo, this.yo, this.r, this.sAngle, this.eAngle, this.sAngle > this.eAngle);

	return this;
}

ArcPath.create = function(duration, interpolator, xo, yo, r, sAngle, eAngle) {
	return new ArcPath(duration, interpolator, xo, yo, r, sAngle, eAngle);
}

/////////////////////////////////////////////////////

function ParaPath(duration, interpolator, x1, y1, ax, ay, vx, vy) {
	this.x1 = x1;
	this.y1 = y1;
	this.ax = ax;
	this.ay = ay;
	this.vx = vx;
	this.vy = vy;
	this.duration = duration;
	this.interpolator = interpolator;

	this.startPoint = this.getPosition(0);	
	this.endPoint = this.getPosition(duration);	
	var dx = Math.abs(this.endPoint.x-this.startPoint.x);
	var dy = Math.abs(this.endPoint.y-this.startPoint.y);
	this.samples = Math.max(dx, dy);

	return;
}

ParaPath.prototype = new BasePath();
ParaPath.prototype.getPosition = function(time) {
	var t = time;
	var timePercent = Math.min(t/this.duration, 1);
	var percent = this.interpolator ? this.interpolator.get(timePercent) : timePercent;
	
	t = (percent * this.duration)/1000;
	var x = 0.5 * this.ax * t * t + this.vx * t + this.x1;
	var y = 0.5 * this.ay * t * t + this.vy * t + this.y1;

	return {x:x, y:y};
}

ParaPath.create = function(duration, interpolator, x1, y1, ax, ay, vx, vy) {
	return new ParaPath(duration, interpolator, x1, y1, ax, ay, vx, vy);
}

/////////////////////////////////////////////////////

function SinPath(duration, interpolator, x1, y1, waveLenth, v, amplitude, phaseOffset) {
	this.x1 = x1;
	this.y1 = y1;
	this.v = v;
	this.amplitude = amplitude;
	this.waveLenth = waveLenth;
	this.duration = duration;
	this.phaseOffset = phaseOffset ? phaseOffset : 0;
	this.interpolator = interpolator;
	this.range = 2 * Math.PI * (v * duration * 0.001)/waveLenth;

	this.startPoint = this.getPosition(0);	
	this.endPoint = this.getPosition(duration);	
	var dx = Math.abs(this.endPoint.x-this.startPoint.x);
	var dy = Math.abs(this.endPoint.y-this.startPoint.y);
	this.samples = Math.max(dx, dy);

	return;
}

SinPath.prototype = new BasePath();
SinPath.prototype.getPosition = function(time) {
	var t = time;
	var timePercent = Math.min(t/this.duration, 1);
	var percent = this.interpolator ? this.interpolator.get(timePercent) : timePercent;
	t = percent * this.duration;

	var x = (t * this.v)/1000 + this.x1;
	var y = this.amplitude * Math.sin(percent * this.range + this.phaseOffset) + this.y1;

	return {x:x, y:y};
}

SinPath.create = function(duration, interpolator, x1, y1, waveLenth, v, amplitude, phaseOffset) {
	return new SinPath(duration, interpolator, x1, y1, waveLenth, v, amplitude, phaseOffset);
}

/////////////////////////////////////////////////////

function Bezier3Path(duration, interpolator, x1, y1, x2, y2, x3, y3, x4, y4) {
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.x3 = x3;
	this.y3 = y3;
	this.x4 = x4;
	this.y4 = y4;
	
	this.duration = duration;
	this.interpolator = interpolator;
	this.startPoint = this.getPosition(0);	
	this.endPoint = this.getPosition(duration);	

	return;
}

Bezier3Path.prototype = new BasePath();
Bezier3Path.prototype.getPosition = function(time) {
	var t = time;
	var timePercent = Math.min(t/this.duration, 1);
	var percent = this.interpolator ? this.interpolator.get(timePercent) : timePercent;
	
	t = percent;
	var t2 = t * t;
	var t3 = t2 * t;

	var t1 = 1 - percent;
	var t12 = t1 * t1;
	var t13 = t12 * t1;

	//http://wenku.baidu.com/link?url=HeH8EMcwvOjp-G8Hc-JIY-RXAvjRMPl_l4ImunXSlje-027d01NP8SkNmXGlbPVBioZdc_aCJ19TU6t3wWXW5jqK95eiTu-rd7LHhTwvATa
	//P = P0*(1-t)^3 + 3*P1*(1-t)^2*t + 3*P2*(1-t)*t^2 + P3*t^3;

	var x = (this.x1*t13) + (3*t*this.x2*t12) + (3*this.x3*t1*t2) + this.x4*t3;
	var y = (this.y1*t13) + (3*t*this.y2*t12) + (3*this.y3*t1*t2) + this.y4*t3;

	return {x:x, y:y};
}

Bezier3Path.prototype.draw = function(ctx) {
	ctx.moveTo(this.x1, this.y1);
	ctx.bezierCurveTo(this.x2, this.y2, this.x3, this.y3, this.x4, this.y4);
}

Bezier3Path.create = function(duration, interpolator, x1, y1, x2, y2, x3, y3, x4, y4) {
	return new Bezier3Path(duration, interpolator, x1, y1, x2, y2, x3, y3, x4, y4);
}

/////////////////////////////////////////////////////

function Bezier2Path(duration, interpolator, x1, y1, x2, y2, x3, y3) {
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.x3 = x3;
	this.y3 = y3;
	
	this.duration = duration;
	this.interpolator = interpolator;
	this.startPoint = this.getPosition(0);	
	this.endPoint = this.getPosition(duration);	

	return;
}

Bezier2Path.prototype = new BasePath();
Bezier2Path.prototype.getPosition = function(time) {
	var t = time;
	var timePercent = Math.min(t/this.duration, 1);
	var percent = this.interpolator ? this.interpolator.get(timePercent) : timePercent;
	
	t = percent;
	var t2 = t * t;

	var t1 = 1 - percent;
	var t12 = t1 * t1;

	//P = (1-t)^2 * P0 + 2 * t * (1-t) * P1 + t^2*P2;
	var x = (this.x1*t12) + 2 * this.x2 * t * t1 + this.x3 * t2;
	var y = (this.y1*t12) + 2 * this.y2 * t * t1 + this.y3 * t2;

	return {x:x, y:y};
}

Bezier2Path.prototype.draw = function(ctx) {
	ctx.moveTo(this.x1, this.y1);
	ctx.quadraticCurveTo(this.x2, this.y2, this.x3, this.y3);
}

Bezier2Path.create = function(duration, interpolator, x1, y1, x2, y2, x3, y3) {
	return new Bezier2Path(duration, interpolator, x1, y1, x2, y2, x3, y3);
}

function PathAnimation(x, y) {
	this.startPoint = {x:x, y:y};
	this.reset();

	return;
}

PathAnimation.prototype.getStartPoint = function() {
	return this.startPoint;
}

PathAnimation.prototype.getEndPoint = function() {
	return this.endPoint;
}

PathAnimation.prototype.reset = function() {
	this.endPoint = {x:this.startPoint.x, y:this.startPoint.y};
	this.duration = 0;
	this.paths = [];

	return this;
}

PathAnimation.prototype.addPath = function(path) {
	this.paths.push({path:path, startTime:this.duration});
	this.endPoint = path.getEndPoint();
	this.duration += path.duration;

	return this;
}

PathAnimation.prototype.addLine = function(duration, interpolator, p1, p2) {
	return this.addPath(LinePath.create(duration, interpolator, p1.x, p1.y, p2.x, p2.y));
}

PathAnimation.prototype.addArc = function(duration, interpolator, origin, r, sAngle, eAngle) {
	return this.addPath(ArcPath.create(duration, interpolator, origin.x, origin.y, r, sAngle, eAngle));
}

PathAnimation.prototype.addPara = function(duration, interpolator, p, a, v) {
	return this.addPath(ParaPath.create(duration, interpolator, p.x, p.y, a.x, a.y, v.x, v.y));
}

PathAnimation.prototype.addSin = function(duration, interpolator, p, waveLenth, v, amplitude, phaseOffset) {
	return this.addPath(SinPath.create(duration, interpolator, p.x, p.y, waveLenth, v, amplitude, phaseOffset));
}

PathAnimation.prototype.addBezier = function(duration, interpolator, p1, p2, p3, p4) {
	return this.addPath(Bezier3Path.create(duration, interpolator, p1.x,p1.y, p2.x,p2.y, p3.x,p3.y, p4.x,p4.y));
}

PathAnimation.prototype.addQuad = function(duration, interpolator, p1, p2, p3) {
	return this.addPath(Bezier2Path.create(duration, interpolator, p1.x,p1.y, p2.x,p2.y, p3.x,p3.y));
}

PathAnimation.prototype.getDuration = function() {
	return this.duration;
}

PathAnimation.prototype.getPathInfoByTime = function(elapsedTime) {
	var t = 0;	
	var paths = this.paths;
	var n = paths.length;

	for(var i = 0; i < n; i++) {
		var iter = paths[i];
		var path = iter.path;
		var startTime = iter.startTime;
		if(elapsedTime >= startTime && elapsedTime < (startTime + path.duration)) {
			return iter;
		}
	}

	return null;
}

PathAnimation.prototype.getPosition = function(elapsedTime) {
	var info = this.getPathInfoByTime(elapsedTime);

	return info ? info.path.getPosition(elapsedTime - info.startTime) : this.endPoint;
}

PathAnimation.prototype.getDirection = function(elapsedTime) {
	var info = this.getPathInfoByTime(elapsedTime);

	return info ? info.path.getDirection(elapsedTime - info.startTime) : 0;
}

PathAnimation.prototype.draw = function(ctx) {
	var paths = this.paths;
	var n = paths.length;
	
	for(var i = 0; i < n; i++) {
		var iter = paths[i];
		ctx.beginPath();
		iter.path.draw(ctx);
		ctx.stroke();
	}

	return this;
}

PathAnimation.prototype.forEach = function(visit) {
	var paths = this.paths;
	var n = paths.length;
	
	for(var i = 0; i < n; i++) {
		visit(paths[i]);
	}

	return this;
};

