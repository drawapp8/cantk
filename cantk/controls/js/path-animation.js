//////////////////////////////////////////////////
//window.performance polyfill
(function ( root ) {
	if ( 'performance' in root === false ) {
		root.performance = {};
	}

	// IE 8
	Date.now = ( Date.now || function () {
		return new Date().getTime();
	} );

	if ( 'now' in root.performance === false ) {
		var offset = root.performance.timing && root.performance.timing.navigationStart ? performance.timing.navigationStart
		                                                                                : Date.now();

		root.performance.now = function () {
			return Date.now() - offset;
		};
	}

})(this);

function PathAnimation(opts) {
	this.__paths = [];
	this.__init(opts);
}

PathAnimation.TYPE_SIN	  = 'sinTo';
PathAnimation.TYPE_LINE   = 'lineTo';
PathAnimation.TYPE_ARCTO  = 'arcTo';
PathAnimation.TYPE_BEZIER = 'bezierCurveTo';
PathAnimation.TYPE_QUAD   = 'quadraticCurveTo';

PathAnimation.ARCTO_TYPE_ERR 	= 'err';
PathAnimation.ARCTO_TYPE_LINE	= 'line';
PathAnimation.ARCTO_TYPE_NORMAL = 'normal';

PathAnimation.prototype.__init = function(opts) {
	this.__isruning = false;
	this.__iscomplete = false;

	if(!isNaN(opts.x) && !isNaN(opts.y)) {
		this.origin = {
			x: opts.x,
			y: opts.y
		};
	}
}

PathAnimation.prototype.start = function(cb) {
	this.__calc();
	this.__isruning = true;
	cb();

	return this;
}

PathAnimation.prototype.stop = function() {
	this.__isruning = false;

	return this;
}

PathAnimation.prototype.__calc = function() {
	this.__initTime = window.performance.now();

	var count = this.__initTime;
	for(var i = 0, len = this.__paths.length; i < len; i++) {
		var path = this.__paths[i];
		path.__startTime = count;
		count += path.duration;
	}

	return this;
}

PathAnimation.prototype.drawTrack = function(ctx) {
	var ox = 0, oy = 0;

	ctx.save();
	ctx.beginPath();
	ctx.moveTo(this.origin.x, this.origin.y);
	ctx.strokeStyle = 'blue';
	ctx.lineWidth = 1.0;
	for(var i = 0, len = this.__paths.length; i < len; i++) {
		var path = this.__paths[i];

		switch(path.type) {
			case PathAnimation.TYPE_LINE: {
				ctx.lineTo(path.ex, path.ey);
				break;
			}
			case PathAnimation.TYPE_ARCTO: {
				ctx.arcTo(path.sx, path.sy, path.dx, path.dy, path.r);
				break;
			}
			case PathAnimation.TYPE_BEZIER: {
				ctx.bezierCurveTo(path.cx1, path.cy1, path.cx2, path.cy2, path.ex, path.ey);
				break;
			}
			case PathAnimation.TYPE_QUAD: {
				ctx.quadraticCurveTo(path.cx, path.cy, path.ex, path.ey);
				break;
			}
			case PathAnimation.TYPE_SIN: {
				//TODO
				break;
			}
		}
	}

	ctx.stroke();
	ctx.restore();

	return this;
}

PathAnimation.prototype.draw = function(ctx, onUpdate) {
	if(!this.__isruning) {
		return;
	}

	ctx.beginPath();
	this.drawTrack(ctx)
	onUpdate.call(this, ctx);
	ctx.stroke();
	ctx.closePath();

	return;
}

PathAnimation.prototype.lineTo = function(x, y, duration, interpolator) {
	var path = {
		ex: x,
		ey: y,
		duration: duration,
		interpolator: interpolator,
		type: PathAnimation.TYPE_LINE
	};

	this.__paths.push(path);

	return this;
}

PathAnimation.prototype.arcTo = function(x1, y1, x2, y2, radius, duration, interpolator) {
	var path = {
		sx: x1,
		sy: y1,
		dx: x2,
		dy: y2,
		r: radius,
		duration: duration,
		interpolator: interpolator,
		type: PathAnimation.TYPE_ARCTO
	};

	this.__paths.push(path);

	return this;
}

PathAnimation.prototype.quadraticCurveTo = function(cx, cy, ex, ey, duration, interpolator) {
	var path = {
		cx: cx,
		cy: cy,
		ex: ex,
		ey: ey,
		duration: duration,
		interpolator: interpolator,
		type: PathAnimation.TYPE_QUAD
	};

	this.__paths.push(path);

	return this;
}

PathAnimation.prototype.bezierCurveTo = function(cx1, cy1, cx2, cy2, x, y, duration, interpolator) {
	var path = {
		cx1: cx1,
		cy1: cy1,
		cx2: cx2,
		cy2: cy2,
		ex: x,
		ey: y,
		duration: duration,
		interpolator: interpolator,
		type: PathAnimation.TYPE_BEZIER
	};

	this.__paths.push(path);

	return this;
}

PathAnimation.prototype.sinTo = function(amplitude, cycle, waveLength, duration, interpolator) {
	var path = {
		cycle: cycle,
		duration: duration,
		amplitude: amplitude,
		waveLength: waveLength,
		interpolator: interpolator,
		type: PathAnimation.TYPE_SIN
	};

	this.__paths.push(path);

	return this;
}

PathAnimation.prototype.__initSin = function(path, prevPos) {
	if(path.ex) return path;
	
	path.omg = 2*Math.PI/path.cycle;
	path.sx = prevPos.x;
	path.sy = prevPos.y;

	path.ex = path.waveLength + prevPos.x;
	path.ey = path.amplitude * Math.sin(path.omg*path.waveLength) + prevPos.y;

	return path;
}

PathAnimation.prototype.__sinPosition = function(path, prevPos, percent) {
	var x = path.waveLength*percent;
	var y = path.amplitude * Math.sin(path.omg*x);

	return {
		x: x + path.sx,
		y: y + path.sy
	};
}

PathAnimation.prototype.__linePosition = function(path, prevPos, percent) {
	return {
		x: prevPos.x + (path.ex - prevPos.x) * percent,
		y: prevPos.y + (path.ey - prevPos.y) * percent
	};
}

PathAnimation.prototype.__initArcTo = function(path, prevPos) {
	if(path.arcType) return path;

	var x = prevPos.x;
	var y = prevPos.y;
	var radius = path.r;
	var p0 = {x: x, y: y};
	var p1 = {x: path.sx, y: path.sy};
	var p2 = {x: path.dx, y: path.dy};

	if ((p1.x == p0.x && p1.y == p0.y)
    || (p1.x == p2.x && p1.y == p2.y)
    || radius - 0.1 < 0) {
    	path.arcType = PathAnimation.ARCTO_TYPE_ERR;
    	return path;
	}

	var p1p0 = {x: (p0.x - p1.x), y: (p0.y - p1.y)};
	var p1p2 = {x: (p2.x - p1.x), y: (p2.y - p1.y)};
	var p1p0_length = Math.sqrt(p1p0.x * p1p0.x + p1p0.y * p1p0.y);
	var p1p2_length = Math.sqrt(p1p2.x * p1p2.x + p1p2.y * p1p2.y);

	var cos_phi = (p1p0.x * p1p2.x + p1p0.y * p1p2.y) / (p1p0_length * p1p2_length);
	// all points on a line logic
	if (1  + cos_phi < 0.001) {
		path.arcType = PathAnimation.ARCTO_TYPE_LINE;
		path.endPoint = {ex: p1.x, ey: p1.y};
		return path;
	}

	if (1 - cos_phi < 0.001) {
		// add infinite far away point
		var max_length = 65535;
		var factor_max = max_length / p1p0_length;
		var ep = {x: (p0.x + factor_max * p1p0.x), y: (p0.y + factor_max * p1p0.y)};
		path.arcType  = PathAnimation.ARCTO_TYPE_LINE;
		path.endPoint = {ex: ep.x, ey: ep.y};
		return;
	}

	var tangent = radius / Math.tan(Math.acos(cos_phi) / 2);
	var factor_p1p0 = tangent / p1p0_length;
	var t_p1p0 = {x: (p1.x + factor_p1p0 * p1p0.x), y: (p1.y + factor_p1p0 * p1p0.y)};

	var orth_p1p0 = {x: p1p0.y, y: -p1p0.x};
	var orth_p1p0_length = Math.sqrt(orth_p1p0.x * orth_p1p0.x + orth_p1p0.y * orth_p1p0.y);
	var factor_ra = radius / orth_p1p0_length;

	var cos_alpha = (orth_p1p0.x * p1p2.x + orth_p1p0.y * p1p2.y) / (orth_p1p0_length * p1p2_length);
	if (cos_alpha - 0.1 < 0)
	  orth_p1p0 = {x: -orth_p1p0.x, y: -orth_p1p0.y};

	var p = {x: (t_p1p0.x + factor_ra * orth_p1p0.x), y: (t_p1p0.y + factor_ra * orth_p1p0.y)};

	orth_p1p0 = {x: -orth_p1p0.x, y: -orth_p1p0.y};

	var sa = Math.acos(orth_p1p0.x / orth_p1p0_length);
	if (orth_p1p0.y - 0.1 < 0)
	  sa = 2 * Math.PI - sa;

	var anticlockwise = false;

	var factor_p1p2 = tangent / p1p2_length;
	var t_p1p2 = {x: (p1.x + factor_p1p2 * p1p2.x), y: (p1.y + factor_p1p2 * p1p2.y)};
	var orth_p1p2 = {x: (t_p1p2.x - p.x), y: (t_p1p2.y - p.y)};
	var orth_p1p2_length = Math.sqrt(orth_p1p2.x * orth_p1p2.x + orth_p1p2.y * orth_p1p2.y);
	var ea = Math.acos(orth_p1p2.x / orth_p1p2_length);

	if (orth_p1p2.y < 0) ea = 2 * Math.PI - ea;
	if ((sa > ea) && ((sa - ea) < Math.PI)) anticlockwise = true;
	if ((sa < ea) && ((ea - sa) > Math.PI)) anticlockwise = true;

	var dist = Math.abs(sa - ea);
	if(!anticlockwise && sa > ea) {
		dist = 2*Math.PI - dist;
	}
	else if(anticlockwise && ea > sa) {
		dist = 2*Math.PI - dist;
	}

	path.arcType  = PathAnimation.ARCTO_TYPE_NORMAL;
	path.subPoint = {ex: t_p1p0.x, ey: t_p1p0.y};
	path.subPoint2 = {ex: t_p1p2.x, ey: t_p1p2.y};
	path.ex = t_p1p2.x;
	path.ey = t_p1p2.y;
	path.lineLength = PathAnimation.Math.len2D(t_p1p0.x, t_p1p0.y, p0.x, p0.y);
	path.center = {x: p.x, y: p.y};
	path.sAngle = sa;
	path.eAngle = ea;
	path.clockwise = anticlockwise;

	path.arcLength = PathAnimation.Math.ONEANG * dist * Math.PI * radius / 180;
	path.linePercent = path.lineLength / (path.lineLength + path.arcLength);
	path.arcPercent  = 1 - path.linePercent;
	path.length = path.arcLength + path.lineLength;

	return path;
}

PathAnimation.prototype.__arcPosition = function(path, prevPos, percent) {
	var dist = Math.abs(path.sAngle - path.eAngle);

	if(!path.clockwise && path.sAngle > path.eAngle) {
		dist = 2*Math.PI - dist;
	}
	else if(path.clockwise && path.eAngle > path.sAngle) {
		dist = 2*Math.PI - dist;	
	}

	percent *= path.clockwise ? -1 : 1;

	var rad = path.sAngle + percent*dist;

	var point = {
		x: path.x + Math.cos(rad) * path.r,
		y: path.y + Math.sin(rad) * path.r
	};

	return point;
}

PathAnimation.prototype.__arcToPosition = function(path, prevPos, percent) {
	path = this.__initArcTo(path, prevPos);	

	switch(path.arcType) {
		case PathAnimation.ARCTO_TYPE_ERR: {
			return {x: -1, y: -1};
		}
		case PathAnimation.ARCTO_TYPE_LINE: {
			return this.__linePosition(path.endPoint, prevPos, percent);	
		}
		case PathAnimation.ARCTO_TYPE_NORMAL: 
		default: {
			var real = percent*path.length;
			if(percent < path.linePercent) {
				return this.__linePosition(path.subPoint, prevPos, real/path.lineLength);	
			}
			else {
				var tmp = {
					sAngle: path.sAngle, 
					eAngle: path.eAngle,
					x: path.center.x,
					y: path.center.y,
					r: path.r,
					clockwise: path.clockwise};
				return this.__arcPosition(tmp, prevPos, (real - path.lineLength)/path.arcLength);
			}
		}
	}
}

PathAnimation.prototype.__bezierPosition = function(path, prevPos, percent) {
	var arrX = [];
	arrX.push(prevPos.x);
	arrX.push(path.cx1);
	arrX.push(path.cx2);
	arrX.push(path.ex);

	var arrY = [];
	arrY.push(prevPos.y);
	arrY.push(path.cy1);
	arrY.push(path.cy2);
	arrY.push(path.ey);

	var x = Math.pow(percent, 3) * (-arrX[0] + 3*arrX[1] -3*arrX[2] + arrX[3])
		+ Math.pow(percent, 2) * (3*arrX[0] -6*arrX[1] + 3*arrX[2])
		+ percent * (-3*arrX[0] + 3*arrX[1]) + arrX[0];

	var y = Math.pow(percent, 3) * (-arrY[0] + 3*arrY[1] -3*arrY[2] + arrY[3])
		+ Math.pow(percent, 2) * (3*arrY[0] -6*arrY[1] + 3*arrY[2])
		+ percent * (-3*arrY[0] + 3*arrY[1]) + arrY[0];

	return {x: x, y: y};
}

PathAnimation.prototype.__quadraticPosition = function(path, prevPos, percent) {
	var arrX = [];
	arrX.push(prevPos.x);
	arrX.push(path.cx);
	arrX.push(path.ex);

	var arrY = [];
	arrY.push(prevPos.y);
	arrY.push(path.cy);
	arrY.push(path.ey);

	var x = Math.pow(percent, 2)*(arrX[0] - 2*arrX[1] + arrX[2]) + percent*(2*arrX[1] - 2*arrX[0]) + arrX[0];
	var y = Math.pow(percent, 2)*(arrY[0] - 2*arrY[1] + arrY[2]) + percent*(2*arrY[1] - 2*arrY[0]) + arrY[0];

	return {x: x, y: y};
}

PathAnimation.prototype.isOver = function() {
	var index= this.calcPath();
	return (!this.__paths || !this.__paths || index < 0); 
}

PathAnimation.prototype.isPlaying = function() {
	return !!this.__isruning && !this.isOver();
}

PathAnimation.prototype.calcPath = function(t) {
	if(!t) t = window.performance.now();

	if(isNaN(t) || !this.__isruning || t < this.__initTime) {
		return null;
	}

	for(var i = this.__paths.length - 1; i >= 0; i--) {
		var path = this.__paths[i];
		if(path.__startTime < t && t < (path.__startTime + path.duration)) {
			break;
		}
	}

	return i;
}

PathAnimation.prototype.__getPosition = function(path, prevPos, percent) {
	switch(path.type) {
		case PathAnimation.TYPE_LINE: {
			return this.__linePosition.apply(this, arguments);
		}
		case PathAnimation.TYPE_ARCTO: {
			return this.__arcToPosition.apply(this, arguments);
		}
		case PathAnimation.TYPE_BEZIER: {
			return this.__bezierPosition.apply(this, arguments);
		}
		case PathAnimation.TYPE_QUAD: {
			return this.__quadraticPosition.apply(this, arguments);
		}
		case PathAnimation.TYPE_SIN: {
			return this.__sinPosition.apply(this, arguments);
		}
	}

	return;
}

PathAnimation.prototype.getPosition = function(t) {
	var path = null;
	var easePercent = 0;
	var timePercent = 0;

	if(!t) {
		t = window.performance.now();
	}

	var i = this.calcPath(t);
	if(i < 0) {
		return false;
	}
	path = this.__paths[i];

	timePercent = (t - path.__startTime)/path.duration;
	easePercent = path.interpolator.get(timePercent);

	var prevPos = {};
	if(i > 0) {
		prevPos.x = this.__paths[i - 1].ex;
		prevPos.y = this.__paths[i - 1].ey;
	}
	else {
		prevPos.x = this.origin.x;
		prevPos.y = this.origin.y;
	}

	return this.__getPosition(path, prevPos, easePercent); 
}

PathAnimation.prototype.__sinDirection = function(path, prevPos, percent) {
	path = this.__initSin(path, prevPos);

	var x = percent * path.waveLength;
	var slope = path.amplitude * path.omg * Math.cos(path.omg*x);

	return PathAnimation.Math.toAngle(Math.atan(slope)); 
}

PathAnimation.prototype.__lineDirection = function(path, prevPos, easePercent) {
	return PathAnimation.Math.calcPointsAngle(prevPos.x, prevPos.y, path.ex, path.ey);	
}

PathAnimation.prototype.__arcDirection = function(path, prevPos, easePercent) {
	var point = this.__arcPosition(path, prevPos, easePercent);
	var slope = (path.y - point.y) / (path.x - point.x) * -1;
	
	if(path.y == point.y) {
		return 90;
	}
	else {
		var angle = PathAnimation.Math.toAngle(Math.atan(slope)); 
		return angle > 0 ? angle : 180 + angle;
	}
}

PathAnimation.prototype.__arcToDirection = function(path, prevPos, percent) {
	var path = this.__initArcTo(path, prevPos);

	switch(path.arcType) {
		case PathAnimation.ARCTO_TYPE_ERR: {
			return -1;
		}
		case PathAnimation.ARCTO_TYPE_LINE: {
			return this.__lineDirection(path.endPoint, prevPos, real/path.lineLength);	
		}
		case PathAnimation.ARCTO_TYPE_NORMAL: {
			var real = percent*path.length;
			if(percent < path.linePercent) {
				return this.__lineDirection(path.subPoint, prevPos, real/path.lineLength);	
			}
			else {
				percent = (real - path.lineLength)/path.arcLength
				var point = this.__arcToPosition(path, prevPos, percent);
				if(path.center.x == point.x) {
					return 0;
				}
				if(path.center.y == point.y) {
					return 90;
				}
				var slope = (path.center.y - point.y) / (path.center.x - point.x);
					slope /= -1;	
				var angle = PathAnimation.Math.toAngle(Math.atan(slope)); 
				return angle > 0 ? angle : 180 + angle;
			}
		}
	}
}

PathAnimation.prototype.__bezierDirection = function(path, prevPos, easePercent) {
	var arrX = [];
	arrX.push(prevPos.x);
	arrX.push(path.cx1);
	arrX.push(path.cx2);
	arrX.push(path.ex);

	var arrY = [];
	arrY.push(prevPos.y);
	arrY.push(path.cy1);
	arrY.push(path.cy2);
	arrY.push(path.ey);

	var disx = Math.pow(easePercent, 2) * (-3*arrX[0] + 9*arrX[1] - 9*arrX[2] + 3*arrX[3]) 
				+ easePercent * (6*arrX[0] - 12*arrX[1] + 6*arrX[2]) 
				+ 3*arrX[1] - 3*arrX[0];
		
	var disy = Math.pow(easePercent, 2) * (-3*arrY[0] + 9*arrY[1] - 9*arrY[2] + 3*arrY[3]) 
				+ easePercent * (6*arrY[0] - 12*arrY[1] + 6*arrY[2]) 
				+ 3*arrY[1] - 3*arrY[0];
	if(disx == 0) {
		return 90;
	}
	else {
		return PathAnimation.Math.toAngle(Math.atan(disy/disx));  
	}
}

PathAnimation.prototype.__quadraticDirection = function(path, prevPos, easePercent) {
	var arrX = [];
	arrX.push(prevPos.x);
	arrX.push(path.cx);
	arrX.push(path.ex);

	var arrY = [];
	arrY.push(prevPos.y);
	arrY.push(path.cy);
	arrY.push(path.ey);

	var disx = 2*(arrX[0] - 2*arrX[1] + arrX[2])*easePercent + (-2*arrX[0] + 2*arrX[1]);
	var disy = 2*(arrY[0] - 2*arrY[1] + arrY[2])*easePercent + (-2*arrY[0] + 2*arrY[1]);
	
	if(disx == 0) {
		return 90;
	}
	else {
		return PathAnimation.Math.toAngle(Math.atan(disy/disx));  
	}
}

PathAnimation.prototype.__getDirection = function(path, prevPos, easePercent) {
	switch(path.type) {
		case PathAnimation.TYPE_LINE: {
			return this.__lineDirection.apply(this, arguments);
		}
		case PathAnimation.TYPE_ARCTO: {
			return this.__arcToDirection.apply(this, arguments);
		}
		case PathAnimation.TYPE_BEZIER: {
			return this.__bezierDirection.apply(this, arguments);
		}
		case PathAnimation.TYPE_QUAD: {
			return this.__quadraticDirection.apply(this, arguments);
		}
		case PathAnimation.TYPE_SIN: {
			return this.__sinDirection.apply(this, arguments);
		}
	}

	return;
}

PathAnimation.prototype.getDirection = function(t) {
	var path = null;
	var easePercent = 0;
	var timePercent = 0;

	if(!t) {
		t = window.performance.now();
	}

	var i = this.calcPath(t);
	if(i < 0) {
		return false;
	}
	path = this.__paths[i];

	timePercent = (t - path.__startTime)/path.duration;
	easePercent = path.interpolator.get(timePercent);

	var prevPos = {};
	if(i > 0) {
		prevPos.x = this.__paths[i - 1].ex;
		prevPos.y = this.__paths[i - 1].ey;
	}
	else {
		prevPos.x = this.origin.x;
		prevPos.y = this.origin.y;
	}

	return this.__getDirection(path, prevPos, easePercent);
}

PathAnimation.Math = {
	/**
	 * π，9位精度
	 * @constant
	 */
	PI : 3.141592654,
	/**
	 * 2π，9位精度
	 * @constant
	 */
	PIM2 : 6.283185307,
	/**
	 * π/2，9位精度
	 * @constant
	 */
	PID2 : 1.570796327,
	/**
	 * π/4，9位精度
	 * @constant
	 */
	PID4 : 0.785398163,
	/**
	 * 1角度对应弧度，9位精度
	 * @constant
	 */
	ONERAD : 0.017453292,
	/**
	 * 1弧度对应角度，9位精度
	 * @constant
	 */
	ONEANG : 57.295779513,
	/**
	 * 转为弧度
	 * @param {Number} ang 角度
	 */
	toRadian : function(ang){return ang*this.ONERAD},
	/**
	 * 转为角度
	 * @param {Number} rad 弧度
	 */
	toAngle : function(rad){return rad*this.ONEANG},
	/**
	 * 计算平面两点距离
	 * @param {Number} p1x 
	 * @param {Number} p1y 
	 * @param {Number} p2x 
	 * @param {Number} p2y 
	 * @returns 两点距离值
	 */
	len2D: function(p1x,p1y,p2x,p2y) {
		return Math.sqrt((p2y-p1y)*(p2y-p1y) + (p2x-p1x)*(p2x-p1x));
	},
	/**
	 * 计算两点连线的倾斜角
	 */
	calcPointsAngle: function(x1, y1, x2, y2) {
		return this.toAngle(Math.atan2(y2 - y1, x2 - x1));	
	},
	/**
	 *判断点是否在圆上
	 */
	calcInCircle: function(cx, cy, r, px, py) {
		return Math.abs(r - this.len2D(cx, cy, px, py)) < 0.001;
	}
}
