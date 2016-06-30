/*
 * File: struct.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: common used structs
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */
function Rect(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	
	return this;
}

Rect.prototype.clone = Rect.prototype.dup = function() {
	return new Rect(this.x, this.y, this.w, this.h);
}

function Point(x, y) {
    this.x = x;
    this.y = y;
    
    return this;
}

Point.prototype.dup = function() {
	return new Point(this.x, this.y);
}

Point.prototype.copy = function(point) {
	this.x = point.x;
	this.y = point.y;

	return;
}

function pointEqual(p1, p2) {
	return p1.x === p2.x && p1.y === p2.y;
}

//intersection and difference is from https://github.com/google/closure-library/blob/master/closure/goog/math/rect.js
Rect.intersection = function(a, b) {
  var x0 = Math.max(a.x, b.x);
  var x1 = Math.min(a.x + a.w, b.x + b.w);

  if (x0 <= x1) {
    var y0 = Math.max(a.y, b.y);
    var y1 = Math.min(a.y + a.h, b.y + b.h);

    if (y0 <= y1) {
      return new Rect(x0, y0, x1 - x0, y1 - y0);
    }
  }
  return null;
};

Rect.hasIntersection = function(a, b) {
  var x0 = Math.max(a.x, b.x);
  var x1 = Math.min(a.x + a.w, b.x + b.w);

  if (x0 <= x1) {
    var y0 = Math.max(a.y, b.y);
    var y1 = Math.min(a.y + a.h, b.y + b.h);

    if (y0 <= y1) {
      return true;
    }
  }
  return false;
};

Rect.difference = function(a, b) {
  var intersection = Rect.intersection(a, b);
  if (!intersection || !intersection.h || !intersection.w) {
    return [a.clone()];
  }

  var result = [];

  var top = a.y;
  var height = a.h;

  var ar = a.x + a.w;
  var ab = a.y + a.h;

  var br = b.x + b.w;
  var bb = b.y + b.h;

  // Subtract off any area on top where A extends past B
  if (b.y > a.y) {
    result.push(new Rect(a.x, a.y, a.w, b.y - a.y));
    top = b.y;
    // If we're moving the top down, we also need to difference the height diff.
    height -= b.y - a.y;
  }
  // Subtract off any area on bottom where A extends past B
  if (bb < ab) {
    result.push(new Rect(a.x, bb, a.w, ab - bb));
    height = bb - top;
  }
  // Subtract any area on left where A extends past B
  if (b.x > a.x) {
    result.push(new Rect(a.x, top, b.x - a.x, height));
  }
  // Subtract any area on right where A extends past B
  if (br < ar) {
    result.push(new Rect(br, top, ar - br, height));
  }

  return result;
};

Rect.subtract2 = function(r1, r2, r3) {
	var all = [];
	var rects = Rect.difference(r1, r2);

	for(var i = 0; i < rects.length; i++) {
		var rs = Rect.difference(rects[i], r3);
		all = all.concat(rs);
	}

	return all;
};
