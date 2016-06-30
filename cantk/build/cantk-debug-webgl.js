
function isArrayish(obj) {
	if (!obj) {
		return false;
	}

	return obj instanceof Array || Array.isArray(obj) ||
		(obj.length >= 0 && (obj.splice instanceof Function ||
			(Object.getOwnPropertyDescriptor(obj, (obj.length - 1)) && obj.constructor.name !== 'String')));
};

var concat = Array.prototype.concat;
var slice = Array.prototype.slice;

function swizzle(args) {
	var results = [];

	for (var i = 0, len = args.length; i < len; i++) {
		var arg = args[i];

		if (isArrayish(arg)) {
			// http://jsperf.com/javascript-array-concat-vs-push/98
			results = concat.call(results, slice.call(arg));
		} else {
			results.push(arg);
		}
	}

	return results;
};

swizzle.wrap = function (fn) {
	return function () {
		return fn(swizzle(arguments));
	};
};

var colorNames = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};

var reverseNames = {};
// create a list of reverse color names
for (var name in colorNames) {
	if (colorNames.hasOwnProperty(name)) {
		reverseNames[colorNames[name]] = name;
	}
}

var cs = {
	to: {}
};

cs.get = function (string) {
	var prefix = string.substring(0, 3).toLowerCase();
	var val;
	var model;
	switch (prefix) {
		case 'hsl':
			val = cs.get.hsl(string);
			model = 'hsl';
			break;
		case 'hwb':
			val = cs.get.hwb(string);
			model = 'hwb';
			break;
		default:
			val = cs.get.rgb(string);
			model = 'rgb';
			break;
	}

	if (!val) {
		return null;
	}

	return {model: model, value: val};
};

cs.abbrreg = /^#([a-fA-F0-9]{3})$/;
cs.hexreg = /^#([a-fA-F0-9]{6})$/;
cs.rgbareg = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
cs.perreg = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
cs.keywordreg = /(\D+)/;

cs.cache = {};
cs.get.rgb = function (string) {
	var color = cs.cache[string];

	if(!color) {
		color = cs.get.rgbSlow(string);
		cs.cache[string] = color;
	}

	return color;
}

cs.get.rgbSlow = function (string) {
	var i;
	var match;

	var rgb = [0, 0, 0, 1];
	if (!string) {
		return rgb;
	}

	if (match = string.match(cs.abbrreg)) {
		match = match[1];

		for (i = 0; i < 3; i++) {
			rgb[i] = parseInt(match[i] + match[i], 16);
		}
	} else if (match = string.match(cs.hexreg)) {
		match = match[1];

		for (i = 0; i < 3; i++) {
			// https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19
			var i2 = i * 2;
			rgb[i] = parseInt(match.slice(i2, i2 + 2), 16);
		}
	} else if (match = string.match(cs.rgbareg)) {
		for (i = 0; i < 3; i++) {
			rgb[i] = parseInt(match[i + 1], 0);
		}

		if (match[4]) {
			rgb[3] = parseFloat(match[4]);
		}
	} else if (match = string.match(cs.perreg)) {
		for (i = 0; i < 3; i++) {
			rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
		}

		if (match[4]) {
			rgb[3] = parseFloat(match[4]);
		}
	} else if (match = string.match(cs.keywordreg)) {
		if (match[1] === 'transparent') {
			return [0, 0, 0, 0];
		}

		rgb = colorNames[match[1]];

		if (!rgb) {
			return null;
		}

		rgb[3] = 1;

		return rgb;
	}

	for (i = 0; i < rgb.length; i++) {
		rgb[i] = clamp(rgb[i], 0, 255);
	}
	rgb[3] = clamp(rgb[3], 0, 1);

	return rgb;
};

cs.get.hsl = function (string) {
	if (!string) {
		return null;
	}

	var hsl = /^hsla?\(\s*([+-]?\d*[\.]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/;
	var match = string.match(hsl);

	if (match) {
		var alpha = parseFloat(match[4]);
		var h = ((parseFloat(match[1]) % 360) + 360) % 360;
		var s = clamp(parseFloat(match[2]), 0, 100);
		var l = clamp(parseFloat(match[3]), 0, 100);
		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);

		return [h, s, l, a];
	}
};

cs.get.hwb = function (string) {
	if (!string) {
		return null;
	}

	var hwb = /^hwb\(\s*([+-]?\d*[\.]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/;
	var match = string.match(hwb);

	if (match) {
		var alpha = parseFloat(match[4]);
		var h = ((parseFloat(match[1]) % 360) + 360) % 360;
		var w = clamp(parseFloat(match[2]), 0, 100);
		var b = clamp(parseFloat(match[3]), 0, 100);
		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
		return [h, w, b, a];
	}
};

cs.to.hex = function (rgb) {
	return '#' + hexDouble(rgb[0]) + hexDouble(rgb[1]) + hexDouble(rgb[2]);
};

cs.to.rgb = function () {
	var rgba = swizzle(arguments);

	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + rgba[0] + ', ' + rgba[1] + ', ' + rgba[2] + ')'
		: 'rgba(' + rgba[0] + ', ' + rgba[1] + ', ' + rgba[2] + ', ' + rgba[3] + ')';
};

cs.to.rgb.percent = function () {
	var rgba = swizzle(arguments);

	var r = Math.round(rgba[0] / 255 * 100);
	var g = Math.round(rgba[1] / 255 * 100);
	var b = Math.round(rgba[2] / 255 * 100);

	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + r + '%, ' + g + '%, ' + b + '%)'
		: 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + rgba[3] + ')';
};

cs.to.hsl = function () {
	var hsla = swizzle(arguments);
	return hsla.length < 4 || hsla[3] === 1
		? 'hsl(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%)'
		: 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + hsla[3] + ')';
};

// hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
// (hwb have alpha optional & 1 is default value)
cs.to.hwb = function () {
	var hwba = swizzle(arguments);

	var a = '';
	if (hwba.length >= 4 && hwba[3] !== 1) {
		a = ', ' + hwba[3];
	}

	return 'hwb(' + hwba[0] + ', ' + hwba[1] + '%, ' + hwba[2] + '%' + a + ')';
};

cs.to.keyword = function (rgb) {
	return reverseNames[rgb.slice(0, 3)];
};

// helpers
function clamp(num, min, max) {
	return Math.min(Math.max(min, num), max);
}

function hexDouble(num) {
	var str = num.toString(16).toUpperCase();
	return (str.length < 2) ? '0' + str : str;
}

function Int16DataBuffer(initSize) {
	this.size = 0;
	this.capacity = initSize;

	this.buffer = new ArrayBuffer(initSize * 2);
	this.init16Buffer = new Int16Array(this.buffer);
}

Int16DataBuffer.prototype.extendTo = function(size) {
	var buffer = new ArrayBuffer(size * 2);
	var init16Buffer = new Int16Array(buffer);

	init16Buffer.set(this.init16Buffer, 0);

	this.capacity = size; 
	this.buffer = buffer;
	this.init16Buffer = init16Buffer;
}

Int16DataBuffer.prototype.extendIfFull = function(n) {
	if((this.size + n) > this.capacity) {
		this.extendTo(Math.round(this.capacity * 1.2) + n);
	}
}

Int16DataBuffer.prototype.pushX = function() {
	var arr = arguments;
	var n = arr.length;
	var offset = this.size;
	this.extendIfFull(n);

	this.size += n;
	var buffer = this.init16Buffer;
	for(var i = 0; i < n; i++, offset++) {
		buffer[offset] = arr[i];
	}

	return this;
}

Int16DataBuffer.prototype.push1 = function(a) {
	this.extendIfFull(1);
	this.init16Buffer[this.size++] = a;

	return this;
}

Int16DataBuffer.prototype.push2 = function(a, b) {
	this.extendIfFull(2);
	this.init16Buffer[this.size++] = a;
	this.init16Buffer[this.size++] = b;

	return this;
}

Int16DataBuffer.prototype.push3 = function(a, b, c) {
	this.extendIfFull(3);
	this.init16Buffer[this.size++] = a;
	this.init16Buffer[this.size++] = b;
	this.init16Buffer[this.size++] = c;

	return this;
}

Int16DataBuffer.prototype.push4 = function(a, b, c, d) {
	this.extendIfFull(4);
	this.init16Buffer[this.size++] = a;
	this.init16Buffer[this.size++] = b;
	this.init16Buffer[this.size++] = c;
	this.init16Buffer[this.size++] = d;

	return this;
}

Int16DataBuffer.prototype.push5 = function(a, b, c, d, e) {
	this.extendIfFull(5);
	this.init16Buffer[this.size++] = a;
	this.init16Buffer[this.size++] = b;
	this.init16Buffer[this.size++] = c;
	this.init16Buffer[this.size++] = d;
	this.init16Buffer[this.size++] = e;

	return this;
}

Int16DataBuffer.prototype.push6 = function(a, b, c, d, e, f) {
	this.extendIfFull(6);
	this.init16Buffer[this.size++] = a;
	this.init16Buffer[this.size++] = b;
	this.init16Buffer[this.size++] = c;
	this.init16Buffer[this.size++] = d;
	this.init16Buffer[this.size++] = e;
	this.init16Buffer[this.size++] = f;

	return this;
}

Int16DataBuffer.prototype.reset = function() {
	this.size = 0;
}

Int16DataBuffer.prototype.getReadBuffer = function() {
	var buffer = new Int16Array(this.buffer, 0, this.size);
	buffer.size = this.size;

	return buffer;
}

Int16DataBuffer.prototype.getWriteBuffer = function(n) {
	this.extendIfFull(n);
	var buffer = this.init16Buffer;

	return buffer;
}

Int16DataBuffer.prototype.getBufferType = function() {
	return "init16";
}

Int16DataBuffer.prototype.getElementBytes = function() {
	return 2;
}

Int16DataBuffer.prototype.dup = function() {
	var db = Int16DataBuffer.create(this.size);

	var n = this.size;
	db.size = this.size;
	var src = this.init16Buffer;
	var dst = db.init16Buffer;

	for(var i = 0; i < n; i++) {
		dst[i] = src[i];
	}

	return db;
}

Int16DataBuffer.create = function(initSize) {
	var db = new Int16DataBuffer(initSize);

	return db;
}

Int16DataBuffer.prototype.dump = function() {
	var n = this.size;
	var buffer = this.init16Buffer;

	console.log(this.size + " " + this.capacity + " " + this.getBufferType() + " " + this.getElementBytes());

	console.log(Array.prototype.join.call(buffer, ","));
}

Int16DataBuffer.test = function() {
	var db = Int16DataBuffer.create(4);
	db.pushX(1, 2, 3, 3, 5, 6, 7, 8, 9, 10, 11);
	db.dump();

	var buffer = db.getReadBuffer();
	console.log("buffer(" + buffer.length + ")["+ Array.prototype.join.call(buffer, ",") + "]");
}

Int16DataBuffer.test();
;
(function(m) {
'use strict';

// Sutherland-Hodgeman polygon clipping algorithm

function polygonclip(points, bbox) {

    var result, edge, prev, prevInside, i, p, inside;

    // clip against each side of the clip rectangle
    for (edge = 1; edge <= 8; edge *= 2) {
        result = [];
        prev = points[points.length - 1];
        prevInside = !(bitCode(prev, bbox) & edge);

        for (i = 0; i < points.length; i++) {
            p = points[i];
            inside = !(bitCode(p, bbox) & edge);

            // if segment goes through the clip window, add an intersection
            if (inside !== prevInside) result.push(intersect(prev, p, edge, bbox));

            if (inside) result.push(p); // add a point if it's inside

            prev = p;
            prevInside = inside;
        }

        points = result;

        if (!points.length) break;
    }

    return result;
}

// intersect a segment against one of the 4 lines that make up the bbox

function intersect(a, b, edge, bbox) {
    return edge & 8 ? [a[0] + (b[0] - a[0]) * (bbox[3] - a[1]) / (b[1] - a[1]), bbox[3]] : // top
           edge & 4 ? [a[0] + (b[0] - a[0]) * (bbox[1] - a[1]) / (b[1] - a[1]), bbox[1]] : // bottom
           edge & 2 ? [bbox[2], a[1] + (b[1] - a[1]) * (bbox[2] - a[0]) / (b[0] - a[0])] : // right
           edge & 1 ? [bbox[0], a[1] + (b[1] - a[1]) * (bbox[0] - a[0]) / (b[0] - a[0])] : // left
           null;
}

// bit code reflects the point position relative to the bbox:

//         left  mid  right
//    top  1001  1000  1010
//    mid  0001  0000  0010
// bottom  0101  0100  0110

function bitCode(p, bbox) {
    var code = 0;

    if (p[0] < bbox[0]) code |= 1; // left
    else if (p[0] > bbox[2]) code |= 2; // right

    if (p[1] < bbox[1]) code |= 4; // bottom
    else if (p[1] > bbox[3]) code |= 8; // top

    return code;
}

Math.polygonclip = polygonclip;
console.log(this);
}(this));

var result = Math.polygonclip(
	[[10, -10], [10, 30], [20, 30], [20, -10]],
	[0, 0, 20, 20]);

console.log(result);	
(function () {
var sinTable = [];
for(var i = 0; i < 360; i++) {
	var rad = i/57.2957;
	sinTable.push(Math.sin(rad) + 0.000001);
}

Math.sinFast = function(rad) {
	var index = ((rad * 57.2957)>>0)%360;
	if(index < 0) {
		index += 360;
	}

	return sinTable[index];
}

Math.cosFast = function(rad) {
	return Math.sinFast(rad + Math.PI*0.5);
}

}());

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

"use strict";

/**
 * @class Common utilities
 * @name glMatrix
 */
var glMatrix = {};

// Configuration Constants
glMatrix.EPSILON = 0.000001;
glMatrix.ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
glMatrix.RANDOM = Math.random;
glMatrix.ENABLE_SIMD = false;

// Capability detection
glMatrix.SIMD_AVAILABLE = (glMatrix.ARRAY_TYPE === this.Float32Array) && ('SIMD' in this);
glMatrix.USE_SIMD = glMatrix.ENABLE_SIMD && glMatrix.SIMD_AVAILABLE;

/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Type} type Array type, such as Float32Array or Array
 */
glMatrix.setMatrixArrayType = function(type) {
    glMatrix.ARRAY_TYPE = type;
}

var degree = Math.PI / 180;

/**
* Convert Degree To Radian
*
* @param {Number} a Angle in Degrees
*/
glMatrix.toRadian = function(a){
     return a * degree;
}

/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less 
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 * 
 * @param {Number} a The first number to test.
 * @param {Number} b The second number to test.
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */
glMatrix.equals = function(a, b) {
	return Math.abs(a - b) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a), Math.abs(b));
}

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

/**
 * @class 2x3 Matrix
 * @name mat2d
 * 
 * @description 
 * A mat2d contains six elements defined as:
 * <pre>
 * [a, c, tx,
 *  b, d, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, c, tx,
 *  b, d, ty,
 *  0, 0, 1]
 * </pre>
 * The last row is ignored so the array is shorter and operations are faster.
 */
var mat2d = {};

/**
 * Creates a new identity mat2d
 *
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.create = function() {
    var out = new glMatrix.ARRAY_TYPE(6);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Creates a new mat2d initialized with values from an existing matrix
 *
 * @param {mat2d} a matrix to clone
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(6);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Copy the values from one mat2d to another
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Set a mat2d to the identity matrix
 *
 * @param {mat2d} out the receiving matrix
 * @returns {mat2d} out
 */
mat2d.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Set the components of a mat2d to the given values
 *
 * @param {mat2d} out the receiving matrix
 * @param {Number} a Component A (index 0)
 * @param {Number} b Component B (index 1)
 * @param {Number} c Component C (index 2)
 * @param {Number} d Component D (index 3)
 * @param {Number} tx Component TX (index 4)
 * @param {Number} ty Component TY (index 5)
 * @returns {mat2d} out
 */
mat2d.set = function(out, a, b, c, d, tx, ty) {
    out[0] = a;
    out[1] = b;
    out[2] = c;
    out[3] = d;
    out[4] = tx;
    out[5] = ty;
    return out;
};

/**
 * Multiplies two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
mat2d.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    out[4] = a0 * b4 + a2 * b5 + a4;
    out[5] = a1 * b4 + a3 * b5 + a5;
    return out;
};

/**
 * Alias for {@link mat2d.multiply}
 * @function
 */
mat2d.mult = function (out, a, b0, b1, b2, b3, b4, b5) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];

    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    out[4] = a0 * b4 + a2 * b5 + a4;
    out[5] = a1 * b4 + a3 * b5 + a5;

    return out;
};


/**
 * Rotates a mat2d by the given angle
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */
//mat2d.rotate = function (out, a, rad) {
//    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
//        s = mat2d.sin(rad),
//        c = mat2d.cos(rad);
//    out[0] = a0 *  c + a2 * s;
//    out[1] = a1 *  c + a3 * s;
//    out[2] = a0 * -s + a2 * c;
//    out[3] = a1 * -s + a3 * c;
//    out[4] = a4;
//    out[5] = a5;
//    return out;
//};

mat2d.rotate = function (a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        s = mat2d.sin(rad),
        c = mat2d.cos(rad);
    a[0] = a0 *  c + a2 * s;
    a[1] = a1 *  c + a3 * s;
    a[2] = a0 * -s + a2 * c;
    a[3] = a1 * -s + a3 * c;
};
/**
 * Scales the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2d} out
 **/
//mat2d.scale = function(out, a, v0, v1) {
//    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
//    out[0] = a0 * v0;
//    out[1] = a1 * v0;
//    out[2] = a2 * v1;
//    out[3] = a3 * v1;
//    out[4] = a4;
//    out[5] = a5;
//    return out;
//};

mat2d.scale = function(a, v0, v1) {
    a[0] *= v0;
    a[1] *= v0;
    a[2] *= v1;
    a[3] *= v1;
};

/**
 * Translates the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to translate the matrix by
 * @returns {mat2d} out
 **/
//mat2d.translate = function(out, a, v0, v1) {
//    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
//
//    out[0] = a0;
//    out[1] = a1;
//    out[2] = a2;
//    out[3] = a3;
//    out[4] = a0 * v0 + a2 * v1 + a4;
//    out[5] = a1 * v0 + a3 * v1 + a5;
//    return out;
//};

mat2d.translate = function(a, v0, v1) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
    a[4] = a0 * v0 + a2 * v1 + a4;
    a[5] = a1 * v0 + a3 * v1 + a5;
};

mat2d.points = [{x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}];

mat2d.transformPoint = function(m, x, y, index) {
	var p = mat2d.points[index||0];

    p.x = m[0] * x + m[2] * y + m[4];
    p.y = m[1] * x + m[3] * y + m[5];
    
    return p;
};

mat2d.transformPointInt = function(m, x, y, index) {
	var p = mat2d.points[index||0];

    p.x = ((m[0] * x + m[2] * y + m[4]) * 10) >> 0;
    p.y = ((m[1] * x + m[3] * y + m[5]) * 10) >> 0;
    
    return p;
};

mat2d.transformPoints = function(m, arr) {
	for(var i = 0; i < arr.length; i+=2) {
		var x = arr[i];
		var y = arr[i+1];
		arr[i] = m[0] * x + m[2] * y + m[4];
		arr[i+1] = m[1] * x + m[3] * y + m[5];
	}

	return arr;
}

mat2d.sin = Math.sinFast;
mat2d.cos = Math.cosFast;

/*
 * File: shader.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: webgl shader program
 * 
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

function WebGLProgram() {
}

WebGLProgram.activeProgram = null;
WebGLProgram.prototype.create = function(gl, buffer, fsSource, vsSource) {
	this.gl = gl;
	this.buffer = buffer;

	var program = gl.createProgram();
	var fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fsSource);
	var vertexShader = this.createShader(gl.VERTEX_SHADER, vsSource);

	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	var lineStatus = gl.getProgramParameter(program, gl.LINK_STATUS);
	if(!lineStatus) {
		alert("Could not initialise shaders:" + gl.getProgramInfoLog(program));
	}

	this.program = program;
	this.init();

	return this;
}

WebGLProgram.prototype.init = function() {
}

WebGLProgram.prototype.createShader = function(type, source) {
	var gl = this.gl;
	var shader = gl.createShader(type);

	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

WebGLProgram.prototype.use = function() {
	if(WebGLProgram.activeProgram !== this.program) {
		this.gl.useProgram(this.program);
		WebGLProgram.activeProgram = this.program;
	}
}

WebGLProgram.prototype.destroy = function() {
	this.gl.deleteProgram(this.program);
	this.gl.program = null;
}

WebGLProgram.prototype.createDataBuffer = function(data) {
	return Int16DataBuffer.create(data);
}

WebGLProgram.prototype.getDataBufferElementSize = function() {
	return 2;
}

WebGLProgram.prototype.getDataBufferElementType = function() {
	return this.gl.SHORT;
}

/*
 * File: draw_image.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: shader to draw image.
 * 
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

function WebGLProgramDrawImage(name, gl, buffer, custom) {
	var fs = this.fs.replace(/custom-shader/, custom);

	this.name = name;
	this.create(gl, buffer, fs, this.vs);

	WebGLProgramDrawImage.programs[name] = this;
}

WebGLProgramDrawImage.prototype = new WebGLProgram();
WebGLProgramDrawImage.prototype.fs = [
	"precision mediump float;",
	"varying vec4 color;",
	"varying vec2 vTextureCoord;",
	"uniform vec4 size;",
	"uniform sampler2D texture;",
	"void main(void) {",
	"custom-shader",
	"}"].join("\n");

WebGLProgramDrawImage.prototype.vs = [
	"precision mediump float;",
	"attribute vec4 aTextureCoord;",
	"attribute vec2 aVertexPosition;",
	"uniform vec4 size;",
	"varying vec4 color;",
	"varying vec2 vTextureCoord;",
	"void main(void) {",
	"    vec2 viewSize = size.xy;",
	"    vec2 textureSize = size.zw;",
	"    vec2 pos = (vec2(aVertexPosition.x/10.0, viewSize.y-aVertexPosition.y/10.0)/ viewSize) * 2.0 - 1.0;",
	"    gl_Position = vec4(pos, 0, 1.0);",
	"    vec2 v = vec2(aTextureCoord.x, aTextureCoord.y)/textureSize;",
	"    vTextureCoord = vec2(v.s, 1.0-v.t);",
	"    float alpha = aTextureCoord.z/256.0;",
	"    float tint = aTextureCoord.w/256.0;",
	"    color = vec4(tint, tint, tint, alpha);",
	"}"].join("\n");

WebGLProgramDrawImage.prototype.init = function() {
	var gl = this.gl;
	var program = this.program;

	program.aTextureCoord = gl.getAttribLocation(program, "aTextureCoord");
	program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");

	program.size = gl.getUniformLocation(program, "size");
	program.samplerUniform = gl.getUniformLocation(program, "texture");

	return;
}
	
WebGLProgramDrawImage.prototype.addTriangle = function(dataBuffer, alpha, tint, u0, v0, x0, y0, u1, v1, x1, y1, u2, v2, x2, y2) {
	var isClockWise = (x1-x0)*(y2-y1)-(y1-y0)*(x2-x1) >= 0;
	if(isClockWise) {
		return dataBuffer.pushX(
				u0, v0, alpha, tint, x0, y0, 
				u1, v1, alpha, tint, x1, y1, 
				u2, v2, alpha, tint, x2, y2
			);
	}else{
		return dataBuffer.pushX(
				u0, v0, alpha, tint, x0, y0, 
				u2, v2, alpha, tint, x2, y2,
				u1, v1, alpha, tint, x1, y1 
			);
	}
}

WebGLProgramDrawImage.prototype.draw = function(image, _bufferData) {
	this.use();

	var gl = this.gl;
	var program = this.program;
	var elementType = this.getDataBufferElementType();
	var elementSize = this.getDataBufferElementSize();
	var stride = elementSize * 6;

	var texture = image.texture;
	if(texture.dirty) {
		texture.update();
	}

	var bufferData = _bufferData;
	var vetexCount = bufferData.size/6;
	gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
	gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.DYNAMIC_DRAW);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);

	gl.vertexAttribPointer(program.aTextureCoord, 4, elementType, false, stride, 0);
	gl.enableVertexAttribArray(program.aTextureCoord);

	gl.vertexAttribPointer(program.aVertexPosition, 2, elementType, false, stride, elementSize * 4);
	gl.enableVertexAttribArray(program.aVertexPosition);
	
	gl.uniform4f(program.size, gl.w, gl.h, texture.w, texture.h);
	
	gl.drawArrays(gl.TRIANGLES, 0, vetexCount);
}

WebGLProgramDrawImage.defaultCustomFs = [
	"  vec4 c = texture2D(texture, vTextureCoord) * color;",
	"  if(c.a > 0.01) {",
	"     gl_FragColor = c;",
	"  }else{",
	"     discard;",
	"  }",
	""].join("\n");

WebGLProgramDrawImage.create = function(gl, buffer) {
	var program = new WebGLProgramDrawImage("normal", gl, buffer, WebGLProgramDrawImage.defaultCustomFs);

	return program;
}

WebGLProgramDrawImage.grayCustomFs = [
	"    vec4 c = texture2D(texture, vTextureCoord);",
	"    float gray = c.r*0.3 + c.g*0.59 + c.b*0.11;",
	"    gl_FragColor = vec4(gray, gray, gray, c.a) * color;"].join("\n");

WebGLProgramDrawImage.createGray = function(gl, buffer) {
	var program = new WebGLProgramDrawImage("gray", gl, buffer, WebGLProgramDrawImage.grayCustomFs);

	return program;
}

WebGLProgramDrawImage.programs = {};
WebGLProgramDrawImage.init = function(gl, buffer) {
	WebGLProgramDrawImage.create(gl, buffer);
	WebGLProgramDrawImage.createGray(gl, buffer);
}

WebGLProgramDrawImage.get = function(name) {
	return WebGLProgramDrawImage.programs[name] || WebGLProgramDrawImage.programs.normal;
}
/*
 * File: draw_primitives.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: shader to stroke/fill lines and curve.
 * 
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

function WebGLProgramDrawPrimitives(gl, buffer) {
	this.create(gl, buffer, this.fs, this.vs);
}

WebGLProgramDrawPrimitives.prototype = new WebGLProgram();
WebGLProgramDrawPrimitives.prototype.fs = [
	"precision mediump float;",
	'varying vec4 vColor;',
	"void main(void) {",
	"    gl_FragColor = vColor;",
	"}"].join("\n");

WebGLProgramDrawPrimitives.prototype.vs = [
	"precision mediump float;",
	'attribute vec2 aVertexPosition;',
	"uniform vec4 aSizeAlphaTint;",
	"uniform vec4 aColor;",
	'varying vec4 vColor;',
	"void main(void) {",
	"   vec2 size = vec2(aSizeAlphaTint.x, aSizeAlphaTint.y);",
	"   float tint = aSizeAlphaTint.z/256.0;",
	"	float alpha = aSizeAlphaTint.w/256.0;",
	"   vec3 pos = vec3(aVertexPosition.x/10.0, aVertexPosition.y/10.0, 1.0);",
	"   vec2 pos2 = (vec2(pos.x, size.y-pos.y)/size) * 2.0 - 1.0;",
	"   gl_Position = vec4(pos2, 0, 1.0);",
	"	vColor = aColor * vec4(tint, tint, tint, alpha);",
	"}"].join("\n");

WebGLProgramDrawPrimitives.prototype.init = function() {
	var gl = this.gl;
	var program = this.program;

	program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");

	program.aColor = gl.getUniformLocation(program, "aColor");
	program.aSizeAlphaTint = gl.getUniformLocation(program, "aSizeAlphaTint");

	return;
}

WebGLProgramDrawPrimitives.prototype.clip = function(start, end) {
	this.draw(this.gl.TRIANGLE_FAN, start, end);
}

WebGLProgramDrawPrimitives.prototype.stroke = function(start, end) {
	this.draw(this.gl.LINE_STRIP, start, end);
}

WebGLProgramDrawPrimitives.prototype.fill = function(start, end) {
	this.draw(this.gl.TRIANGLE_FAN, start, end);
}

WebGLProgramDrawPrimitives.prototype.prepareDraw = function(bufferData, color, alpha, tint) {
	this.use();

	var gl = this.gl;
	var program = this.program;
	var elementType = this.getDataBufferElementType();
	var elementSize = this.getDataBufferElementSize();

	gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
	gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.DYNAMIC_DRAW);

	gl.vertexAttribPointer(program.aVertexPosition, 2, elementType, false, 0, 0);
	gl.enableVertexAttribArray(program.aVertexPosition);
	
	gl.uniform4f(program.aColor, color.r, color.g, color.b, color.a);
	gl.uniform4f(program.aSizeAlphaTint, gl.w, gl.h, tint, alpha);
}

WebGLProgramDrawPrimitives.prototype.draw = function(type, start, end) {
	var gl = this.gl;
	var begin = start >> 1;
	var n = (end - start) >> 1;

	gl.drawArrays(type, begin, n);
}


WebGLProgramDrawPrimitives.prototype.createDataBuffer = function(data) {
	return Int16DataBuffer.create(data);
}

WebGLProgramDrawPrimitives.prototype.getDataBufferElementSize = function() {
	return 2;
}

WebGLProgramDrawPrimitives.prototype.getDataBufferElementType = function() {
	return this.gl.SHORT;
}

/*
 * File: typed_array_ext.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: some functions to extend typed array.
 * 
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

Int16Array.prototype.push = function() {
	var arr = arguments;
	var size = this.size;
	var length = this.length;

	var n = arr.length;
	for(var i = 0; i < n && size < length; i++) {
		this[size++] = arr[i];
	}
	this.size = size;

	return this;
}

Int16Array.prototype.extend = function() {
	var size = this.size;
	var newSize = this.length + 1024;
	var newDataBuffer = Int16Array.create(newSize);

	newDataBuffer.size = size;
	for(var i = 0; i < size; i++) {
		newDataBuffer[i] = this[i];
	}

	return newDataBuffer;
}

Float32Array.prototype.extend = function() {
	var size = this.size;
	var newSize = this.length + 1024;
	var newDataBuffer = Float32Array.create(newSize);

	newDataBuffer.size = size;
	for(var i = 0; i < size; i++) {
		newDataBuffer[i] = this[i];
	}

	return newDataBuffer;
}

Int16Array.prototype.pushX = function() {
	var me = this;
	var arr = arguments;
	var n = arr.length;

	if((this.size + 1024 + n) > this.length) {
		me = this.extend();
	}

	var start = this.size;
	for(var i = 0; i < n; i++, start++) {
		me[start] = arr[i];
	}
	me.size += n;

	return me;
}

Int16Array.prototype.push1 = function(a) {
	var me = this;
	if((this.size + 10) >= this.length) {
		me = this.extend();
	}
	
	me[this.size++] = a;

	return me;
}

Float32Array.prototype.push1 = function(a) {
	var me = this;
	if((this.size + 10) >= this.length) {
		me = this.extend();
	}
	
	me[this.size++] = a;

	return me;
}

Int16Array.prototype.push2 = function(a, b) {
	var me = this;
	if((this.size + 10) >= this.length) {
		me = this.extend();
	}
	
	me[this.size++] = a;
	me[this.size++] = b;

	return me;
}

Float32Array.prototype.push2 = function(a, b) {
	var me = this;
	if((this.size + 10) >= this.length) {
		me = this.extend();
	}
	
	me[this.size++] = a;
	me[this.size++] = b;

	return me;
}

Float32Array.prototype.pushX = function() {
	var me = this;
	var arr = arguments;
	var n = arr.length;

	if((this.size + 1024 + n) > this.length) {
		me = this.extend();
	}

	var start = this.size;
	for(var i = 0; i < n; i++, start++) {
		me[start] = arr[i];
	}
	me.size += n;

	return me;
}

Float32Array.prototype.pushArr = Int16Array.prototype.pushArr = function(arr) {
	var me = this;
	var n = arr.length;

	if((this.size + 1024 + n) > this.length) {
		me = this.extend();
	}

	var start = this.size;
	for(var i = 0; i < n; i++, start++) {
		me[start] = arr[i];
	}
	me.size += n;

	return me;
}

Float32Array.prototype.reset = Int16Array.prototype.reset = function() {
	this.size = 0;

	return this;
}

Int16Array.create = function(data) {
	var arr = new Int16Array(data);	
	arr.size = 0;

	return arr;
}

Float32Array.create = function(data) {
	var arr = new Float32Array(data);	
	arr.size = 0;

	return arr;
}

Int16Array.prototype.dup = function() {
	var size = this.size;
	var newDataBuffer = Int16Array.create(size);

	for(var i = 0; i < size; i++) {
		newDataBuffer[i] = this[i];
	}
	newDataBuffer.size = size;

	return newDataBuffer;
}

Float32Array.prototype.dup = function() {
	var size = this.size;
	var newDataBuffer = Float32Array.create(size);

	for(var i = 0; i < size; i++) {
		newDataBuffer[i] = this[i];
	}
	newDataBuffer.size = size;

	return newDataBuffer;
}

Float32Array.prototype.slice = Int16Array.prototype.slice = Array.prototype.slice;

/**
 * Based on the Public Domain MaxRectanglesBinPack.cpp source by Jukka Jylänki
 * https://github.com/juj/RectangleBinPack/
 *
 * Based on C# port by Sven Magnus
 * http://unifycommunity.com/wiki/index.php?title=MaxRectanglesBinPack
 *
 * Based on ActionScript3 by DUZENGQIANG
 * http://www.duzengqiang.com/blog/post/971.html
 *
 * Ported to javascript by 06wj
 * https://github.com/06wj/MaxRectsBinPack
 */
(function(){
    /**
     * Rect
     * @param {Number} x      矩形坐标x
     * @param {Number} y      矩形坐标y
     * @param {Number} width  矩形宽
     * @param {Number} height 矩形高
     */
    function Rect(x, y, width, height){
        this.x = x||0;
        this.y = y||0;
        this.width = width||0;
        this.height = height||0;
    }

    Rect.prototype = {
        constructor:Rect,
        /**
         * clone 复制
         * @return {Rect}
         */
        clone:function(){
            return new Rect(this.x, this.y, this.width, this.height);
        }
    };

    Rect.isContainedIn = function(a, b){
        return a.x >= b.x && a.y >= b.y
            && a.x+a.width <= b.x+b.width
            && a.y+a.height <= b.y+b.height;
    };

    var BestShortSideFit = 0; ///< -BSSF: Positions the Rectangle against the short side of a free Rectangle into which it fits the best.
    var BestLongSideFit = 1; ///< -BLSF: Positions the Rectangle against the long side of a free Rectangle into which it fits the best.
    var BestAreaFit = 2; ///< -BAF: Positions the Rectangle into the smallest free Rectangle into which it fits.
    var BottomLeftRule = 3; ///< -BL: Does the Tetris placement.
    var ContactPointRule = 4; ///< -CP: Choosest the placement where the Rectangle touches other Rectangles as much as possible.

    /**
     * MaxRectanglesBinPack
     * @param {Number} width 容器宽度
     * @param {Number} height 容器高度
     * @param {Boolean} allowRotate 是否允许旋转
     */
    function MaxRectsBinPack(width, height, allowRotate){
        this.binWidth = 0;
        this.binHeight = 0;
        this.allowRotate = false;

        this.usedRectangles = [];
        this.freeRectangles = [];

        this.init(width, height, allowRotate);
    }

    MaxRectsBinPack.prototype = {
        constructor:MaxRectsBinPack,
        /**
         * 初始化
         * @param {Number} width 容器宽度
         * @param {Number} height 容器高度
         * @param {Boolean} allowRotate 是否允许旋转
         */
        init:function(width, height, allowRotate){
            this.binWidth = width;
            this.binHeight = height;
            this.allowRotate = allowRotate||false;

            this.usedRectangles.length = 0;
            this.freeRectangles.length = 0;
            this.freeRectangles.push(new Rect(0, 0, width, height));
        },
        /**
         * insert a new rect
         * @param  {Number} width  矩形宽
         * @param  {Number} height 矩形高
         * @param  {Number} method 分配方法 0~4
         * @return {Rect}
         */
        insert:function(width, height,  method){
            var newNode = new Rect();
            var score1 = {
                value:0
            };

            var score2 = {
                value:0
            };
            method = method||0;
            switch(method) {
                case BestShortSideFit:
                    newNode = this._findPositionForNewNodeBestShortSideFit(width, height, score1, score2);
                    break;
                case BottomLeftRule:
                    newNode = this._findPositionForNewNodeBottomLeft(width, height, score1, score2);
                    break;
                case ContactPointRule:
                    newNode = this._findPositionForNewNodeContactPoint(width, height, score1);
                    break;
                case BestLongSideFit:
                    newNode = this._findPositionForNewNodeBestLongSideFit(width, height, score2, score1);
                    break;
                case BestAreaFit:
                    newNode = this._findPositionForNewNodeBestAreaFit(width, height, score1, score2);
                    break;
            }

            if (newNode.height === 0){
                return newNode;
            }

            this._placeRectangle(newNode);
            return newNode;
        },
        /**
         * 插入一组矩形
         * @param  {Array} rectangles 矩形数组
         * @param  {Number} method 分配方法 0~4
         * @return {Array} 成功插入的数组
         */
        insert2:function(rectangles, method){
            var res = [];
            while(rectangles.length > 0) {
                var bestScore1 = Infinity;
                var bestScore2 = Infinity;
                var bestRectangleIndex = -1;
                var bestNode = new Rect();

                for(var i= 0; i < rectangles.length; i++) {
                    var score1 = {
                        value:0
                    };
                    var score2 = {
                        value:0
                    };
                    var newNode = this._scoreRectangle(rectangles[i].width, rectangles[i].height, method, score1, score2);

                    if (score1.value < bestScore1 || (score1.value == bestScore1 && score2.value < bestScore2)) {
                        bestScore1 = score1.value;
                        bestScore2 = score2.value;
                        bestNode = newNode;
                        bestRectangleIndex = i;
                    }
                }

                if (bestRectangleIndex == -1){
                    return res;
                }

                this._placeRectangle(bestNode);
                var rect = rectangles.splice(bestRectangleIndex, 1)[0];
                rect.x = bestNode.x;
                rect.y = bestNode.y;

                res.push(rect);
            }
            return res;
        },
        _placeRectangle:function(node){
            var numRectanglesToProcess = this.freeRectangles.length;
            for(var i= 0; i < numRectanglesToProcess; i++) {
                if (this._splitFreeNode(this.freeRectangles[i], node)) {
                    this.freeRectangles.splice(i,1);
                    i--;
                    numRectanglesToProcess--;
                }
            }

            this._pruneFreeList();
            this.usedRectangles.push(node);
        },
        _scoreRectangle:function(width, height, method, score1, score2){
            var newNode = new Rect();
            score1.value = Infinity;
            score2.value = Infinity;
            switch(method) {
                case BestShortSideFit:
                    newNode = this._findPositionForNewNodeBestShortSideFit(width, height, score1, score2);
                    break;
                case BottomLeftRule:
                    newNode = this._findPositionForNewNodeBottomLeft(width, height, score1, score2);
                    break;
                case ContactPointRule:
                    newNode = this._findPositionForNewNodeContactPoint(width, height, score1);
                    // todo: reverse
                    score1 = -score1; // Reverse since we are minimizing, but for contact point score bigger is better.
                    break;
                case BestLongSideFit:
                    newNode = this._findPositionForNewNodeBestLongSideFit(width, height, score2, score1);
                    break;
                case BestAreaFit:
                    newNode = this._findPositionForNewNodeBestAreaFit(width, height, score1, score2);
                    break;
            }

            // Cannot fit the current Rectangle.
            if (newNode.height === 0) {
                score1.value = Infinity;
                score2.value = Infinity;
            }

            return newNode;
        },
        _occupancy:function(){
            var usedRectangles = this.usedRectangles;
            var usedSurfaceArea = 0;
            for(var i= 0; i < usedRectangles.length; i++){
                usedSurfaceArea += usedRectangles[i].width * usedRectangles[i].height;
            }

            return usedSurfaceArea/(this.binWidth * this.binHeight);
        },
        _findPositionForNewNodeBottomLeft:function(width, height, bestY, bestX){
            var freeRectangles = this.freeRectangles;
            var bestNode = new Rect();
            //memset(bestNode, 0, sizeof(Rectangle));

            bestY.value = Infinity;
            var rect;
            var topSideY;
            for(var i= 0; i < freeRectangles.length; i++) {
                rect = freeRectangles[i];
                // Try to place the Rectangle in upright (non-flipped) orientation.
                if (rect.width >= width && rect.height >= height) {
                    topSideY = rect.y + height;
                    if (topSideY < bestY.value || (topSideY == bestY.value && rect.x < bestX.value)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = width;
                        bestNode.height = height;
                        bestY.value = topSideY;
                        bestX.value = rect.x;
                    }
                }
                if (this.allowRotate && rect.width >= height && rect.height >= width) {
                    topSideY = rect.y + width;
                    if (topSideY < bestY.value || (topSideY == bestY.value && rect.x < bestX.value)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = height;
                        bestNode.height = width;
                        bestY.value = topSideY;
                        bestX.value = rect.x;
                    }
                }
            }
            return bestNode;
        },
        _findPositionForNewNodeBestShortSideFit:function(width, height, bestShortSideFit, bestLongSideFit){
            var freeRectangles = this.freeRectangles;
            var bestNode = new Rect();
            //memset(&bestNode, 0, sizeof(Rectangle));

            bestShortSideFit.value = Infinity;

            var rect;
            var leftoverHoriz;
            var leftoverVert;
            var shortSideFit;
            var longSideFit;

            for(var i= 0; i < freeRectangles.length; i++) {
                rect = freeRectangles[i];
                // Try to place the Rectangle in upright (non-flipped) orientation.
                if (rect.width >= width && rect.height >= height) {
                    leftoverHoriz = Math.abs(rect.width - width);
                    leftoverVert = Math.abs(rect.height - height);
                    shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                    longSideFit = Math.max(leftoverHoriz, leftoverVert);

                    if (shortSideFit < bestShortSideFit.value || (shortSideFit == bestShortSideFit.value && longSideFit < bestLongSideFit.value)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = width;
                        bestNode.height = height;
                        bestShortSideFit.value = shortSideFit;
                        bestLongSideFit.value = longSideFit;
                    }
                }
                var flippedLeftoverHoriz;
                var flippedLeftoverVert;
                var flippedShortSideFit;
                var flippedLongSideFit;
                if (this.allowRotate && rect.width >= height && rect.height >= width) {
                    flippedLeftoverHoriz = Math.abs(rect.width - height);
                    flippedLeftoverVert = Math.abs(rect.height - width);
                    flippedShortSideFit = Math.min(flippedLeftoverHoriz, flippedLeftoverVert);
                    flippedLongSideFit = Math.max(flippedLeftoverHoriz, flippedLeftoverVert);

                    if (flippedShortSideFit < bestShortSideFit.value || (flippedShortSideFit == bestShortSideFit.value && flippedLongSideFit < bestLongSideFit.value)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = height;
                        bestNode.height = width;
                        bestShortSideFit.value = flippedShortSideFit;
                        bestLongSideFit.value = flippedLongSideFit;
                    }
                }
            }

            return bestNode;
        },
        _findPositionForNewNodeBestLongSideFit:function(width, height, bestShortSideFit, bestLongSideFit){
            var freeRectangles = this.freeRectangles;
            var bestNode = new Rect();
            //memset(&bestNode, 0, sizeof(Rectangle));
            bestLongSideFit.value = Infinity;
            var rect;

            var leftoverHoriz;
            var leftoverVert;
            var shortSideFit;
            var longSideFit;
            for(var i= 0; i < freeRectangles.length; i++) {
                rect = freeRectangles[i];
                // Try to place the Rectangle in upright (non-flipped) orientation.
                if (rect.width >= width && rect.height >= height) {
                    leftoverHoriz = Math.abs(rect.width - width);
                    leftoverVert = Math.abs(rect.height - height);
                    shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                    longSideFit = Math.max(leftoverHoriz, leftoverVert);

                    if (longSideFit < bestLongSideFit.value || (longSideFit == bestLongSideFit.value && shortSideFit < bestShortSideFit.value)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = width;
                        bestNode.height = height;
                        bestShortSideFit.value = shortSideFit;
                        bestLongSideFit.value = longSideFit;
                    }
                }

                if (this.allowRotate && rect.width >= height && rect.height >= width) {
                    leftoverHoriz = Math.abs(rect.width - height);
                    leftoverVert = Math.abs(rect.height - width);
                    shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                    longSideFit = Math.max(leftoverHoriz, leftoverVert);

                    if (longSideFit < bestLongSideFit.value || (longSideFit == bestLongSideFit.value && shortSideFit < bestShortSideFit.value)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = height;
                        bestNode.height = width;
                        bestShortSideFit.value = shortSideFit;
                        bestLongSideFit.value = longSideFit;
                    }
                }
            }
            return bestNode;
        },
        _findPositionForNewNodeBestAreaFit:function(width, height, bestAreaFit, bestShortSideFit){
            var freeRectangles = this.freeRectangles;
            var bestNode = new Rect();
            //memset(&bestNode, 0, sizeof(Rectangle));

            bestAreaFit.value = Infinity;

            var rect;

            var leftoverHoriz;
            var leftoverVert;
            var shortSideFit;
            var areaFit;

            for(var i= 0; i < freeRectangles.length; i++) {
                rect = freeRectangles[i];
                areaFit = rect.width * rect.height - width * height;

                // Try to place the Rectangle in upright (non-flipped) orientation.
                if (rect.width >= width && rect.height >= height) {
                    leftoverHoriz = Math.abs(rect.width - width);
                    leftoverVert = Math.abs(rect.height - height);
                    shortSideFit = Math.min(leftoverHoriz, leftoverVert);

                    if (areaFit < bestAreaFit.value || (areaFit == bestAreaFit.value && shortSideFit < bestShortSideFit.value)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = width;
                        bestNode.height = height;
                        bestShortSideFit.value = shortSideFit;
                        bestAreaFit = areaFit;
                    }
                }

                if (this.allowRotate && rect.width >= height && rect.height >= width) {
                    leftoverHoriz = Math.abs(rect.width - height);
                    leftoverVert = Math.abs(rect.height - width);
                    shortSideFit = Math.min(leftoverHoriz, leftoverVert);

                    if (areaFit < bestAreaFit.value || (areaFit == bestAreaFit.value && shortSideFit < bestShortSideFit.value)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = height;
                        bestNode.height = width;
                        bestShortSideFit.value = shortSideFit;
                        bestAreaFit.value = areaFit;
                    }
                }
            }
            return bestNode;
        },
        /// Returns 0 if the two intervals i1 and i2 are disjoint, or the length of their overlap otherwise.
        _commonIntervalLength:function(i1start, i1end, i2start, i2end){
            if (i1end < i2start || i2end < i1start){
                return 0;
            }
            return Math.min(i1end, i2end) - Math.max(i1start, i2start);
        },
        _contactPointScoreNode:function(x, y, width, height){
            var usedRectangles = this.usedRectangles;
            var score = 0;

            if (x == 0 || x + width === this.binWidth)
                score += height;
            if (y == 0 || y + height === this.binHeight)
                score += width;
            var rect;
            for(var i= 0; i < usedRectangles.length; i++) {
                rect = usedRectangles[i];
                if (rect.x == x + width || rect.x + rect.width == x)
                    score += this._commonIntervalLength(rect.y, rect.y + rect.height, y, y + height);
                if (rect.y == y + height || rect.y + rect.height == y)
                    score += this._commonIntervalLength(rect.x, rect.x + rect.width, x, x + width);
            }
            return score;
        },
        _findPositionForNewNodeContactPoint:function(width, height, bestContactScore){
            var freeRectangles = this.freeRectangles;
            var bestNode = new Rect();
            //memset(&bestNode, 0, sizeof(Rectangle));

            bestContactScore.value = -1;

            var rect;
            var score;
            for(var i= 0; i < freeRectangles.length; i++) {
                rect = freeRectangles[i];
                // Try to place the Rectangle in upright (non-flipped) orientation.
                if (rect.width >= width && rect.height >= height) {
                    score = this._contactPointScoreNode(rect.x, rect.y, width, height);
                    if (score > bestContactScore.value) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = width;
                        bestNode.height = height;
                        bestContactScore = score;
                    }
                }
                if (this.allowRotate && rect.width >= height && rect.height >= width) {
                    score = this._contactPointScoreNode(rect.x, rect.y, height, width);
                    if (score > bestContactScore.value) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = height;
                        bestNode.height = width;
                        bestContactScore.value = score;
                    }
                }
            }
            return bestNode;
        },
        _splitFreeNode:function(freeNode, usedNode){
            var freeRectangles = this.freeRectangles;
            // Test with SAT if the Rectangles even intersect.
            if (usedNode.x >= freeNode.x + freeNode.width || usedNode.x + usedNode.width <= freeNode.x ||
                usedNode.y >= freeNode.y + freeNode.height || usedNode.y + usedNode.height <= freeNode.y)
                return false;
            var newNode;
            if (usedNode.x < freeNode.x + freeNode.width && usedNode.x + usedNode.width > freeNode.x) {
                // New node at the top side of the used node.
                if (usedNode.y > freeNode.y && usedNode.y < freeNode.y + freeNode.height) {
                    newNode = freeNode.clone();
                    newNode.height = usedNode.y - newNode.y;
                    freeRectangles.push(newNode);
                }

                // New node at the bottom side of the used node.
                if (usedNode.y + usedNode.height < freeNode.y + freeNode.height) {
                    newNode = freeNode.clone();
                    newNode.y = usedNode.y + usedNode.height;
                    newNode.height = freeNode.y + freeNode.height - (usedNode.y + usedNode.height);
                    freeRectangles.push(newNode);
                }
            }

            if (usedNode.y < freeNode.y + freeNode.height && usedNode.y + usedNode.height > freeNode.y) {
                // New node at the left side of the used node.
                if (usedNode.x > freeNode.x && usedNode.x < freeNode.x + freeNode.width) {
                    newNode = freeNode.clone();
                    newNode.width = usedNode.x - newNode.x;
                    freeRectangles.push(newNode);
                }

                // New node at the right side of the used node.
                if (usedNode.x + usedNode.width < freeNode.x + freeNode.width) {
                    newNode = freeNode.clone();
                    newNode.x = usedNode.x + usedNode.width;
                    newNode.width = freeNode.x + freeNode.width - (usedNode.x + usedNode.width);
                    freeRectangles.push(newNode);
                }
            }

            return true;
        },
        _pruneFreeList:function(){
            var freeRectangles = this.freeRectangles;
            for(var i = 0;i < freeRectangles.length; i++)
                for(var j= i+1; j < freeRectangles.length; j++) {
                    if (Rect.isContainedIn(freeRectangles[i], freeRectangles[j])) {
                        freeRectangles.splice(i,1);
                        break;
                    }
                    if (Rect.isContainedIn(freeRectangles[j], freeRectangles[i])) {
                        freeRectangles.splice(j,1);
                    }
                }
        }
    };

    window.MaxRectsBinPack = MaxRectsBinPack;
})();
Math.normalize = function(x, y, r)
{
    var d = Math.sqrt(x*x+y*y);
    if (d > 0.000001) {
        var id = 1.0 / d;
        r.x = x * id;
        r.y = y * id;
    }
	r.d = d;

    return r;
}

Math.cross = function(dx0, dy0, dx1, dy1) 
{ 
	return dx1*dy0 - dx0*dy1; 
}

Math.ptEquals = function(x1, y1, x2, y2, tol)
{
	var dx = x2 - x1;
	var dy = y2 - y1;
	return dx*dx + dy*dy < tol*tol;
}

Math.distPtSeg = function(x, y, px, py, qx, qy)
{
	var pqx, pqy, dx, dy, d, t;
	pqx = qx-px;
	pqy = qy-py;
	dx = x-px;
	dy = y-py;
	d = pqx*pqx + pqy*pqy;
	t = pqx*dx + pqy*dy;
	if (d > 0) t /= d;
	if (t < 0) t = 0;
	else if (t > 1) t = 1;
	dx = px + t*pqx - x;
	dy = py + t*pqy - y;
	return dx*dx + dy*dy;
}

function parseFontSize(font) {
	var fontSize = 12;
	var arr = font.match(/\d+pt|\d+px/g);
	if(arr) {
		var size = arr[0];
		fontSize = parseInt(size);
		if(size.indexOf("pt") > 0) {
			fontSize = Math.round(fontSize * 1.2);
		}
	}

	return fontSize;
}

/*
 * File: auto_packer.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: auto packer glyphs and small images into a big canvas.
 * 
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

function AutoPacker() {
}

AutoPacker.prototype.init = function(gl) {
	this.gl = gl;
	this.w = 512;
	this.h = 1024;
	this.imageMaxWidth  = 256;
	this.imageMaxHeight = 256;
	this.canvas = document.createElement("canvas");
	this.canvas.cannotPack = true;
	this.glyphCache = {};
	this.imagesCache = [];
	this.createTexture();
	this.setOverflow(false);

	return this.reset();
}

AutoPacker.prototype.resetImagesCache = function() {
	var imagesCache = this.imagesCache;
	var n = imagesCache.length;
	for(var i = 0; i < n; i++) {
		var image = imagesCache[i];
		image.ox = 0;
		image.oy = 0;
		image.packed = false;
		image.texture = null;
	}

	imagesCache.length = 0;
}

AutoPacker.prototype.extendCanvas = function() {
	if(this.isOverflow()) {
		if(this.w < 2048 || this.h < 2048) {
			if(this.w < this.h) {
				this.w = this.w << 1;
			}else{
				this.h = this.h << 1;
			}
		}else{
			if(this.imageMaxWidth > this.imageMaxHeight) {
				this.imageMaxWidth = this.imageMaxWidth << 1;
			}
			else {
				this.imageMaxHeight = this.imageMaxHeight << 1;
			}
		}

		this.setOverflow(false);
		console.log("extend canvas to " + this.w + "x" + this.h);
	}
	
	this.canvas.width = this.w;
	this.canvas.height = this.h;
	this.ctx = this.canvas.getContext("2d");
}

AutoPacker.prototype.reset = function() {
	this.resetImagesCache();
	this.glyphCache = {};
	this.extendCanvas();

	var ctx = this.ctx;
	ctx.textAlign = "left";
	ctx.textBaseline = "middle";
	ctx.clearRect(0, 0, this.w, this.h);

	this.binPacker = new MaxRectsBinPack(this.w, this.h, false);

	return this;
}

AutoPacker.prototype.getAvailableRect = function(w, h) {
	var r = this.binPacker.insert(w, h, 0);

	if(r) {
		r.w = w;
		r.h = h;
	}

	return r;
}

AutoPacker.prototype.addGlyph = function(font, fontSize, color, c) {
	var ctx = this.ctx;
	if(ctx.font !== font) {
		ctx.font = font;
	}

	if(ctx.fillStyle !== color) {
		ctx.fillStyle = color;
	}

	var charWidth = Math.ceil(ctx.measureText(c).width);
	var charHeight = Math.ceil(fontSize * 1.3);
	var hMargin = charWidth >> 2;
	var vMargin = fontSize >> 2;

	var rect = this.getAvailableRect(charWidth + hMargin*2, charHeight + vMargin*2);

	if(rect) {
		rect.x += hMargin;
		rect.y += vMargin;
		rect.w = charWidth;
		rect.h = charHeight;
		if(font.indexOf("italic") >= 0) {
			rect.charW = rect.w + hMargin;
		}else{
			rect.charW = rect.w;
		}

		var key = AutoPacker.toGlyphKey(font, c, color);

		ctx.fillText(c, rect.x, rect.y + (rect.h >> 1));
		this.glyphCache[key] = rect;
		this.setDirty(true);
	}

	return rect;
}

AutoPacker.prototype.measureText = function(font, str, color, outRect) {
	var width = 0;
	var n = str.length;
	var fontSize = parseFontSize(font);

	for(var i = 0; i < n; i++) {
		var c = str[i];
		var r = this.getGlyph(font, c, color);

		if(!r) {
			r = this.addGlyph(font, fontSize, color, c);
		}

		if(r) {
			width += r.w;
		}
	}

	outRect.w = width;
	outRect.h = fontSize;

	return outRect;
}

AutoPacker.toGlyphKey = function(font, c, color) {
	return font+c+color;
}

AutoPacker.prototype.hasGlyph = function(font, c, color) {
	return !!this.glyphCache[AutoPacker.toGlyphKey(font, c, color)];
}

AutoPacker.prototype.setOverflow = function(overflow) {
	this.overflow = overflow;
}

AutoPacker.prototype.isOverflow = function(overflow) {
	return this.overflow;
}

AutoPacker.prototype.getGlyph = function(font, c, color) {
	return this.glyphCache[AutoPacker.toGlyphKey(font, c, color)];	
}

AutoPacker.prototype.packImage = function(image) {
	if(!image.src || image.src.indexOf("data:") === 0 || image.width > this.imageMaxWidth || image.height > this.imageMaxHeight) {
		image.ox = 0;
		image.oy = 0;
		image.cannotPack = true;
		return;
	}

	var rect = this.getAvailableRect(image.width + 4, image.height + 4);
	if(rect.height < image.height) {
		image.ox = 0;
		image.oy = 0;
		this.setOverflow(true);

		return;
	}

	var x = rect.x + 2;
	var y = rect.y + 2;
	var texture = this.canvas.texture;

	this.setDirty(true);
	this.ctx.drawImage(image, x, y);
	
	image.ox = x;
	image.oy = y;
	image.packed = true;

	if(image.texture && image.texture !== texture)  {
		this.gl.deleteTexture(image.texture);
	}

	image.texture = this.canvas.texture;
	this.imagesCache.push(image);

	return;
}

AutoPacker.prototype.setDirty = function(dirty) {
	this.canvas.texture.setDirty(dirty);
}

AutoPacker.prototype.createTexture = function() {
	var gl = this.gl;
	var texture = gl.createTexture();
	
	texture.src = null;
	texture.image = this.canvas;
	this.canvas.texture = texture;

	texture.dirty = true;
	texture.setDirty = function(dirty) {
		this.dirty = dirty;
	}

	texture.update = function() {
		if(!this.dirty) return;
		
		var image = this.image;
		this.dirty = false;
		this.w = image.width;
		this.h = image.height;
		gl.bindTexture(gl.TEXTURE_2D, this);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
}

AutoPacker.prototype.getImage = function() {
	return this.canvas;
}


function CanvasRenderingContext2DWebGL(options){
	this.distTol = 0.01;
	this.tessTol = 0.0025;
	this.currentID = 1000;

	this.fps = 0;
	this.lastX = 0;
	this.lastY = 0;
	this.firstX = 0;
	this.firstY = 0;
	this.showFPS = false;
	this.renderTimes = 0;
	this.startTime = Date.now();
	this.lastSeconds = (this.startTime/1000) >> 0;
	this.drawCalls = 0;
	this.drawImageCalls = 0;
	this.drawImageCount = 0;
	this.fillCount = 0;
	this.strokeCount = 0;
	this.clipLevel = 0;
	this.canvasWidth = 0;
	this.canvasHeight = 0;
	this.canvasWidth10 = 0;
	this.canvasHeight10 = 0;
	this.zeroPoint = {x:0, y:0};
	this.tempRect = {x:0, y:0, w:0, h:0};
	this.webglOptions = options || CanvasRenderingContext2DWebGL.webglOptions;
}

CanvasRenderingContext2DWebGL.webglOptions = {
	antialias: false, 
	stencil: true, 
	preserveDrawingBuffer:true, 
	premultipliedAlpha:false
};

CanvasRenderingContext2DWebGL.prototype.save = function() {
	this.stack.push(this.state.clone());
}

CanvasRenderingContext2DWebGL.prototype.restore = function() {
	var oldState = this.state;	
	var state = this.stack.pop();

	if(state) {
		if(state.clipRect || oldState.clipRect) {
			if(!state.clipRect || !oldState.clipRect || state.clipRect !== oldState.clipRect) {
				this.doClipRect(state.clipRect);
			}
		}

		if(state.clipPaths || oldState.clipPaths) {
			if(!state.clipPaths || !oldState.clipPaths || state.clipPaths.id !== oldState.clipPaths.id) {
				this.clearClip(oldState.clipPaths);
			}
		}

		this.state = state;
		if(oldState.globalCompositeOperation !== state.globalCompositeOperation) {
			this.globalCompositeOperationApply(state.globalCompositeOperation);
		}
	}else{
		console.log("restore times > save times.");
	}

	CanvasRenderingContext2DWebGL.destroyState(oldState);
}

CanvasRenderingContext2DWebGL.prototype.scale = function(x, y) {
	mat2d.scale(this.state.m, x, y);
};

CanvasRenderingContext2DWebGL.prototype.rotate = function(angle) {
	mat2d.rotate(this.state.m, angle);
};

CanvasRenderingContext2DWebGL.prototype.translate = function(x, y) {
	mat2d.translate(this.state.m, x, y);
};

CanvasRenderingContext2DWebGL.prototype.transform = function(a, b, c, d, e, f) {
	var m = this.state.m;
	mat2d.mult(m, m, a, b, c, d, e, f);
};

CanvasRenderingContext2DWebGL.prototype.setTransform = function(a, b, c, d, e, f) {
	mat2d.set(this.state.m, a, b, c, d, e, f);
};

CanvasRenderingContext2DWebGL.prototype.scaleArr = function(arr, x, y) {
	mat2d.scale(this.state.m, arr[x], arr[y]);
}

CanvasRenderingContext2DWebGL.prototype.rotateArr = function(arr, index) {
	mat2d.rotate(this.state.m, arr[index]);
}

CanvasRenderingContext2DWebGL.prototype.translateArr = function(arr, x, y) {
	mat2d.translate(this.state.m, arr[x], arr[y]);
}

CanvasRenderingContext2DWebGL.prototype.transformMatrix = function(matrix) {
	var m = this.state.m;
	mat2d.multiply(m, m, matrix);
}

CanvasRenderingContext2DWebGL.prototype.setTransformMatrix = function(matrix) {
	mat2d.copy(this.state.m, matrix);
};


Object.defineProperty(CanvasRenderingContext2DWebGL.prototype, "globalTint", {
	get: function () {
		return this.state.globalTint;
	},
	set: function(value) {
		this.state.globalTint = value;
	},
	enumerable: false,
	configurable: true
});

Object.defineProperty(CanvasRenderingContext2DWebGL.prototype, "globalImageFilter", {
	get: function () {
		return this.state.globalImageFilter;
	},
	set: function(value) {
		this.state.globalImageFilter = value;
	},
	enumerable: false,
	configurable: true
});

Object.defineProperty(CanvasRenderingContext2DWebGL.prototype, "globalAlpha", {
	get: function () {
		return this.state.globalAlpha;
	},
	set: function(value) {
		this.state.globalAlpha = value;
	},
	enumerable: false,
	configurable: true
});

CanvasRenderingContext2DWebGL.prototype.globalCompositeOperationApply = function(compositeOperation) {
	var gl = this.gl;
	this.commitDrawImage();

	//FIXME: not test yet
	if ("darker" == compositeOperation) {
		gl.blendEquation(gl.FUNC_SUBTRACT);
	} else {
		gl.blendEquation(gl.FUNC_ADD);
	}

	switch(compositeOperation) {
		case "source-over":
			//
			//gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
			//
			gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
			break;
		case "destination-over":
			gl.blendFunc(gl.ONE_MINUS_DST_ALPHA, gl.ONE);
			break;
		case "clear":
			gl.blendFunc(gl.ZERO, gl.ZERO);
			break;
		case "copy":
		case "source":
			gl.blendFunc(gl.ONE, gl.ZERO);
			break;
		case "destination":
			gl.blendFunc(gl.ZERO, gl.ONE);
			break;
		case "source-atop":
			gl.blendFunc(gl.DST_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
			break;
		case "destination-atop":
			gl.blendFunc(gl.ONE_MINUS_DST_ALPHA, gl.SRC_ALPHA);
			break;
		case "source-in":
			gl.blendFunc(gl.DST_ALPHA, gl.ZERO);
			break;
		case "destination-in":
			gl.blendFunc(gl.ZERO, gl.SRC_ALPHA);
			break;
		case "source-out":
			gl.blendFunc(gl.ONE_MINUS_DST_ALPHA, gl.ZERO);
			break;
		case "destination-out":
			gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_ALPHA);
			break;
		case "lighter":
		case "darker":
			gl.blendFunc(gl.ONE, gl.ONE);
			break;
		case "xor":
			gl.blendFunc(gl.ONE_MINUS_DST_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
			break;
		case "normal":
		default:
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
			break;
	}
}

Object.defineProperty(CanvasRenderingContext2DWebGL.prototype, "globalCompositeOperation", {
	get: function () {
		return this.state.globalCompositeOperation;
	},
	set: function(value) {
		if(value !== this.state.globalCompositeOperation) {
			this.state.globalCompositeOperation = value;
			this.globalCompositeOperationApply(value);
		}
	},
	enumerable: false,
	configurable: true
});

Object.defineProperty(CanvasRenderingContext2DWebGL.prototype, "strokeStyle", {
	get: function () {
		return this.state.strokeStyle.str;
	},
	set: function(value) {
		var color = this.state.strokeStyle.str;
		if(value && color !== value) {
			this.state.strokeStyle =  CanvasRenderingContext2DWebGL.parseColor(value);
		}
	},
	enumerable: false,
	configurable: true
});

Object.defineProperty(CanvasRenderingContext2DWebGL.prototype, "fillStyle", {
	get: function () {
		return this.state.fillStyle.str;
	},
	set: function(value) {
		var color = this.state.fillStyle.str;
		if(value && color !== value) {
			this.state.fillStyle = CanvasRenderingContext2DWebGL.parseColor(value);
		}
	},
	enumerable: false,
	configurable: true
});

CanvasRenderingContext2DWebGL.prototype.clearRect = function(x, y, w, h) {
	this.beginPath();
	this.rect(x, y, w, h);
	this.fill();
	this.beginPath();
};

CanvasRenderingContext2DWebGL.prototype.fillRect = function(x, y, w, h) {
	this.beginPath();
	this.rect(x, y, w, h);
	this.fill();
	this.beginPath();
};

CanvasRenderingContext2DWebGL.prototype.strokeRect = function(x, y, w, h) {
	this.beginPath();
	this.rect(x, y, w, h);
	this.stroke();
	this.beginPath();
};

CanvasRenderingContext2DWebGL.prototype.stroke = function() {
	if(this.lineWidth && this.strokeStyle) {
		this.gl.lineWidth(this.lineWidth);
		this.commitDrawImage();
		
		this.strokeCount++;
		var program = this.drawPrimitivesProgram;
		this.drawPrimitives(program, this.drawPrimitiveQueue, program.stroke, this.state.strokeStyle);
	}
}

CanvasRenderingContext2DWebGL.prototype.fill = function() {
	if(this.fillStyle) {
		this.commitDrawImage();

		this.fillCount++;
		var program = this.drawPrimitivesProgram;
		this.drawPrimitives(program, this.drawPrimitiveQueue, program.fill, this.state.fillStyle);
	}
}

CanvasRenderingContext2DWebGL.prototype.drawStencil = function(drawPrimitiveQueue, level, clear) {
	var gl = this.gl;
	var program = this.drawPrimitivesProgram;
	var passOp = clear ? gl.DECR : gl.INCR;
	
	gl.stencilMask(0xff);
	gl.stencilFunc(gl.ALWAYS, 1, 0xff);
	gl.stencilOp(gl.KEEP, gl.KEEP, passOp);
	gl.colorMask(false, false, false, false);

	this.drawPrimitives(program, drawPrimitiveQueue, program.clip, this.stencilColor);

	gl.stencilMask(0);
	gl.stencilFunc(gl.EQUAL, level, 0xff);
	gl.colorMask(true, true, true, true);
//  for test	
//	this.drawPrimitives(program, drawPrimitiveQueue, program.stroke, this.strokeStyle);
}

CanvasRenderingContext2DWebGL.prototype.clearClip = function(drawPrimitiveQueue) {
	var gl = this.gl;
	if(!drawPrimitiveQueue) {
		gl.disable(gl.STENCIL_TEST);	

		return;
	}

	this.commitDrawImage();
	this.drawStencil(drawPrimitiveQueue, --this.clipLevel, true);
}

CanvasRenderingContext2DWebGL.prototype.clip = function() {
	this.savePrimitiveQueueForClip();

	var gl = this.gl;
	if(this.clipLevel === 0) {
		gl.enable(gl.STENCIL_TEST);	
	}

	this.commitDrawImage();
	var drawPrimitiveQueue = this.state.clipPaths;
	if(drawPrimitiveQueue) {
		this.drawStencil(drawPrimitiveQueue, ++this.clipLevel, false);
	}
}


CanvasRenderingContext2DWebGL.prototype.drawPrimitives = function(program, drawPrimitiveQueue, drawFunc, color) {
	var dataBuffer = drawPrimitiveQueue.dataBuffer.getReadBuffer();
	var paths = drawPrimitiveQueue.paths;
	var state = this.state;

	var end = 0;
	var start = 0;
	var arr = null;
	var n = paths.size;
	var tint = state.globalTint * 256 >> 0;
	var alpha = state.globalAlpha * 256 >> 0;

	program.prepareDraw(dataBuffer, color, alpha, tint);
	for(var i = 0; i < n; i++) {
		var start = paths[i];
		if(i < (n-1)) {
			end = paths[i+1]
		}else{
			end = dataBuffer.size;
		}

		if(end > start) {
			this.drawCalls++;
			drawFunc.call(program, start, end);
		}
	}
};

CanvasRenderingContext2DWebGL.prototype.doClipRect = function(rect) {
	var gl = this.gl;
	var canvas = this.canvas;
	var canvasWidth = canvas.width;
	var canvasHeight = canvas.height;

	this.commitDrawImage();
	gl.enable(gl.SCISSOR_TEST);

	if(!rect || !rect.w || !rect.h) {
		gl.scissor(0, 0, canvasWidth, canvasHeight);
	}else{

		var virtualWidth = gl.w;
		var virtualHeight = gl.h;
		var scaleX = canvasWidth/virtualWidth;
		var scaleY = canvasHeight/virtualHeight;

		var yy = (rect.y-1) * scaleY;
		var x = rect.x * scaleX;
		var w = rect.w * scaleX;
		var h = rect.h * scaleY;
		var y = canvasHeight-(yy+h);
		gl.scissor(x, y, w, h);
	}
}

CanvasRenderingContext2DWebGL.prototype.clipRect = function(x, y, w, h) {
	var state = this.state;
	var m = state.m;
	var p = mat2d.transformPoint(m, x, y);
	var oldClipRect = state.clipRect;
	
	state.clipRect = {x:p.x, y:p.y, w:w, h:h};

	if(oldClipRect) {
		state.clipRect = Rect.intersection(state.clipRect, oldClipRect);
	}

	if(state.clipRect) {
		this.doClipRect(state.clipRect);
	}
};

CanvasRenderingContext2DWebGL.prototype.drawGlyph = function(image, program, sx, sy, sw, sh, dx, dy, dw, dh) {
	this.prepareDrawImage(image, program);
	this.drawImageEx(image, sx, sy, sw, sh, dx*10, dy*10, (dx+dw)*10, dy*10, (dx+dw)*10, (dy+dh)*10, dx*10, (dy+dh)*10); 
}

CanvasRenderingContext2DWebGL.prototype.doFillText = function(text, x, y, maxWidth) {
	var ox = x;
	var oy = y;
	var gl = this.gl;
	var r = this.tempRect;
	var font = this.font || "16px sans";
	var gc = this.autoPacker;
	var fillStyle = this.state.fillStyle;
	var color = fillStyle.str;

	if(!this.autoPacker.measureText(font, text, color, r)) {
		console.log("invalid font size");	
		return;
	}

	var image = this.autoPacker.getImage();

	switch(this.textAlign) {
		case "right": {
			ox = x - r.w;
			break;
		}
		case "center": {
			ox = x - (r.w >> 1);
			break;
		}
		default: break;
	}

	switch(this.textBaseline) {
		case "bottom": {
			oy = y - r.h;
			break;
		}
		case "middle": {
			oy = y - (r.h >> 1);
			break;
		}
		default:break;
	}
	var n = text.length;
	var program = WebGLProgramDrawImage.get("normal");
	for(var i = 0; i < n; i++) {
		var c = text[i];
		var rc = gc.getGlyph(font, c, color);
		if(rc) {
			this.drawGlyph(image, program, rc.x, rc.y, rc.charW, rc.h, ox, oy, rc.charW, rc.h);
			ox += rc.w;
		}
	}
	return;
}

CanvasRenderingContext2DWebGL.prototype.fillText = function(text, x, y, maxWidth) {
	var m = this.state.m;
	var p = mat2d.transformPointInt(m, x, y);
	this.doFillText(text, p.x/10, p.y/10, maxWidth);
};

CanvasRenderingContext2DWebGL.prototype.strokeText = function() {
	console.log("strokeText NOT IMPL");
};


CanvasRenderingContext2DWebGL.prototype.drawImageTriArr = function(image, arr) {
	var offset = 0;
	var n = (arr.length/12) >> 0;

	for(var i = 0; i < n; i++) {
		this.drawImageTri(image, arr[offset++], arr[offset++], arr[offset++], arr[offset++],
			arr[offset++], arr[offset++], arr[offset++], arr[offset++],
			arr[offset++], arr[offset++], arr[offset++], arr[offset++]);
	}
}

CanvasRenderingContext2DWebGL.prototype.drawImageTri = function(image, u0, v0, x0, y0, u1, v1, x1, y1, u2, v2, x2, y2) {
	var m = this.state.m;
	var p0 = mat2d.transformPointInt(m, x0, y0, 0);
	var p1 = mat2d.transformPointInt(m, x1, y1, 1);
	var p2 = mat2d.transformPointInt(m, x2, y2, 2);
	
	var isClockWise = (p1.x-p0.x)*(p2.y-p1.y)-(p1.y-p0.y)*(p2.x-p1.x) >= 0;
	if(isClockWise) {
		this.doDrawImageTri(image, u0, v0, p0.x, p0.y, u1, v1, p1.x, p1.y, u2, v2, p2.x, p2.y);
	}else{
		this.doDrawImageTri(image, u0, v0, p0.x, p0.y, u2, v2, p2.x, p2.y, u1, v1, p1.x, p1.y);
	}
}

CanvasRenderingContext2DWebGL.prototype.doDrawImageTri = function(image, u0, v0, x0, y0, u1, v1, x1, y1, u2, v2, x2, y2) {
	this.drawImageCount++;

	if(image.complete) {
		var ox = image.ox;
		var oy = image.oy;
		var state = this.state;
		var drawImageQueue = this.drawImageQueue;
		var program = WebGLProgramDrawImage.get(state.globalImageFilter);

		this.prepareDrawImage(image, program);
		drawImageQueue.dataBuffer = program.addTriangle(drawImageQueue.dataBuffer, 
			state.globalAlpha * 256 >>0, state.globalTint * 256 >> 0,  
			u0+ox, v0+oy, x0, y0, u1+ox, v1+oy, x1, y1, u2+ox, v2+oy, x2, y2);
	}
};

CanvasRenderingContext2DWebGL.prototype.drawImage = function(image, _sx, _sy, _sw, _sh, _dx, _dy, _dw, _dh) {
	var sx, sy, sw, sh, dx, dy, dw, dh;

	if(!image.width) {
		return;
	}

	if(_dh) {
		sx = _sx;
		sy = _sy;
		sw = _sw;
		sh = _sh;
		dx = _dx;
		dy = _dy;
		dw = _dw;
		dh = _dh;
	}else if(_sw) {
		sx = 0;
		sy = 0;
		sw = image.width;
		sh = image.height;
		dx = _sx;
		dy = _sy;
		dw = _sw;
		dh = _sh;
	}else {
		sx = 0;
		sy = 0;
		sw = image.width;
		sh = image.height;
		dx = _sx;
		dy = _sy;
		dw = sw;
		dh = sh;
	}
	
	var state = this.state;
	var program = WebGLProgramDrawImage.get(state.globalImageFilter);
	this.prepareDrawImage(image, program);

	var m = state.m;
   	var a = m[0];
   	var b = m[1];
   	var c = m[2];
   	var d = m[3];
   	var e = m[4];
   	var f = m[5];
	var top = dy;
	var left = dx;
	var right = dx+dw;
	var bottom = dy+dh;

    var x1 = ((a * left + c * top + e) * 10) >> 0;
	var y1 = ((b * left + d * top + f) * 10) >> 0;

    var x2 = ((a * right + c * top + e) * 10) >> 0;
	var y2 = ((b * right + d * top + f) * 10) >> 0;
    
    var x3 = ((a * right + c * bottom + e) * 10) >> 0;
	var y3 = ((b * right + d * bottom + f) * 10) >> 0;
    
    var x4 = ((a * left + c * bottom + e) * 10) >> 0;
	var y4 = ((b * left + d * bottom + f) * 10) >> 0;

	var cw10 = this.canvasWidth10;
	var ch10 = this.canvasHeight10;
	if((x1 < 0 && x2 < 0 && x3 < 0 && x4 < 0) 
		|| (y1 < 0 && y2 < 0 && y3 < 0 && y4 < 0)
		|| (x1 > cw10 && x2 > cw10 && x3 > cw10 && x4 > cw10) 
		|| (y1 > ch10 && y2 > ch10 && y3 > ch10 && y4 > ch10)) {
		this.drawImageCount++;
		return;
	}

	this.drawImageEx(image, sx+image.ox, sy+image.oy, sw, sh, x1, y1, x2, y2, x3, y3, x4, y4);
}

CanvasRenderingContext2DWebGL.prototype.prepareDrawImage = function(image, program) {
	var drawImageQueue = this.drawImageQueue;
	if(drawImageQueue.image) {
		if(drawImageQueue.image.texture !== image.texture || drawImageQueue.program !== program
				|| drawImageQueue.globalCompositeOperation !== this.state.globalCompositeOperation) {

			this.commitDrawImage();
			drawImageQueue.image = image; 
			drawImageQueue.program = program;
			if(!image.cannotPack && !image.packed) {
				this.autoPacker.packImage(image);
				this.loadTextureWithImage(image);
			}
		}
	}else{
		if(!image.cannotPack && !image.packed) {
			this.autoPacker.packImage(image);
			this.loadTextureWithImage(image);
		}

		drawImageQueue.image = image; 
		drawImageQueue.program = program;
	}
}

CanvasRenderingContext2DWebGL.prototype.drawImageEx = function(image, sx, sy, sw, sh, x1, y1, x2, y2, x3, y3, x4, y4) {
	this.drawImageCount++;
	var dataBuffer = this.drawImageQueue.dataBuffer;
	var out = dataBuffer.getWriteBuffer(100);
	
	var offset = dataBuffer.size;
	var tint = this.state.globalTint * 256 >> 0;
	var alpha = this.state.globalAlpha * 256 >> 0;

	out[offset++] = sx;
	out[offset++] = sy;
	out[offset++] = alpha;
	out[offset++] = tint;
	out[offset++] = x1;
	out[offset++] = y1;

	out[offset++] = sx+sw;
	out[offset++] = sy;
	out[offset++] = alpha;
	out[offset++] = tint;
	out[offset++] = x2;
	out[offset++] = y2;
	
	out[offset++] = sx+sw;
	out[offset++] = sy+sh;
	out[offset++] = alpha;
	out[offset++] = tint;
	out[offset++] = x3;
	out[offset++] = y3;
	
	out[offset++] = sx+sw;
	out[offset++] = sy+sh;
	out[offset++] = alpha;
	out[offset++] = tint;
	out[offset++] = x3;
	out[offset++] = y3;
	
	out[offset++] = sx;
	out[offset++] = sy+sh;
	out[offset++] = alpha;
	out[offset++] = tint;
	out[offset++] = x4;
	out[offset++] = y4;
	
	out[offset++] = sx;
	out[offset++] = sy;
	out[offset++] = alpha;
	out[offset++] = tint;
	out[offset++] = x1;
	out[offset++] = y1;
	dataBuffer.size = offset;

	return;
}

CanvasRenderingContext2DWebGL.prototype.commitDrawImage = function() {
	var drawImageQueue = this.drawImageQueue;
	var dataBuffer = drawImageQueue.dataBuffer.getReadBuffer();
	
	if(dataBuffer.size < 1 || !drawImageQueue.image) {
		return;
	}
	
	this.drawImageBatch(drawImageQueue.image, drawImageQueue.program, dataBuffer);

	drawImageQueue.dataBuffer.reset();
	drawImageQueue.image = null;
	drawImageQueue.program = null;
	drawImageQueue.globalCompositeOperation = this.globalCompositeOperation;

	return;
}


Object.defineProperty(CanvasRenderingContext2DWebGL.prototype, "lineWidth", {
	get: function () {
		return this.state.lineWidth;
	},
	set: function(value) {
		this.state.lineWidth = value;
	},
	enumerable: false,
	configurable: true
});

Object.defineProperty(CanvasRenderingContext2DWebGL.prototype, "lineCap", {
	get: function () {
		return this.state.lineCap;
	},
	set: function(value) {
		this.state.lineCap = value;
	},
	enumerable: false,
	configurable: true
});

Object.defineProperty(CanvasRenderingContext2DWebGL.prototype, "lineJoin", {
	get: function () {
		return this.state.lineJoin;
	},
	set: function(value) {
		this.state.lineJoin = value;
	},
	enumerable: false,
	configurable: true
});

Object.defineProperty(CanvasRenderingContext2DWebGL.prototype, "miterLimit", {
	get: function () {
		return this.state.miterLimit;
	},
	set: function(value) {
		this.state.miterLimit = value;
	},
	enumerable: false,
	configurable: true
});

Object.defineProperty(CanvasRenderingContext2DWebGL.prototype, "font", {
	get: function () {
		return this.state.font;
	},
	set: function(value) {
		this.state.font = value;
	},
	enumerable: false,
	configurable: true
});

Object.defineProperty(CanvasRenderingContext2DWebGL.prototype, "textAlign", {
	get: function () {
		return this.state.textAlign;
	},
	set: function(value) {
		this.state.textAlign = value;
	},
	enumerable: false,
	configurable: true
});

Object.defineProperty(CanvasRenderingContext2DWebGL.prototype, "textBaseline", {
	get: function () {
		return this.state.textBaseline;
	},
	set: function(value) {
		this.state.textBaseline = value;
	},
	enumerable: false,
	configurable: true
});

CanvasRenderingContext2DWebGL.prototype.beginPath = function() {
	this.drawPrimitiveQueue.dataBuffer.reset();
	this.drawPrimitiveQueue.paths.reset();
}

CanvasRenderingContext2DWebGL.prototype.closePath = function() {
	this.addPoint(this.firstX, this.firstY, false);
};

CanvasRenderingContext2DWebGL.prototype.savePrimitiveQueueForClip = function() {
	var drawPrimitiveQueue = this.drawPrimitiveQueue;
	if(drawPrimitiveQueue.dataBuffer.size < 6) {
		return;
	}
	
	this.state.clipPaths = {
		id : this.currentID++,
		paths : drawPrimitiveQueue.paths.dup(),
		dataBuffer : drawPrimitiveQueue.dataBuffer.dup()
	}
}

CanvasRenderingContext2DWebGL.prototype.hasPoint = function() {
	return this.drawPrimitiveQueue.dataBuffer.size > 0;
}

CanvasRenderingContext2DWebGL.prototype.addPoint = function(x, y, newPath) {
	var drawPrimitiveQueue = this.drawPrimitiveQueue;
	var dataBuffer = drawPrimitiveQueue.dataBuffer;
	
	if(newPath) {
		this.firstX = x;
		this.firstY = y;
		drawPrimitiveQueue.paths.push1(dataBuffer.size);
	}
	
	this.lastX = x;
	this.lastY = y;
	drawPrimitiveQueue.dataBuffer = dataBuffer.pushX(x, y);

	return;
}

CanvasRenderingContext2DWebGL.prototype.moveTo = function(x, y) {
	var m = this.state.m;
	var p = mat2d.transformPointInt(m, x, y);

	this.addPoint(p.x, p.y, true);
};

CanvasRenderingContext2DWebGL.prototype.lineTo = function(x, y) {
	var m = this.state.m;
	var p = mat2d.transformPointInt(m, x, y);

	this.addPoint(p.x, p.y, false);
};

CanvasRenderingContext2DWebGL.prototype.getWidth = function() {
	return this.canvas.w || this.canvas.width;
}

CanvasRenderingContext2DWebGL.prototype.getHeight = function() {
	return this.canvas.h || this.canvas.height;
}

CanvasRenderingContext2DWebGL.prototype.bigRect = function(p1, p2, p3, p4) {
	var cw10 = this.canvasWidth10;
	var ch10 = this.canvasHeight10;
	var ret = Math.polygonclip([[p1.x, p1.y], [p2.x, p2.y], [p3.x, p3.y], [p4.x, p4.y]], [-10, -10, cw10+20, ch10+20]);

	if(ret) {
		var n = ret.length;
		for(var i = 0; i < n; i++) {
			var p = ret[i];
			if(!i) {
				this.addPoint(p[0], p[1], true);
			}else {
				this.addPoint(p[0], p[1], false);
			}
		}
	}
}

CanvasRenderingContext2DWebGL.prototype.rect = function(x, y, w, h) {
	var m = this.state.m;
	var p1 = mat2d.transformPointInt(m, x, y, 0);
	var p2 = mat2d.transformPointInt(m, x+w, y, 1);
	var p3 = mat2d.transformPointInt(m, x+w, y+h, 2);
	var p4 = mat2d.transformPointInt(m, x, y+h, 3);
	var cw = this.canvasWidth;
	var ch = this.canvasHeight;
	var cw10 = this.canvasWidth10;
	var ch10 = this.canvasHeight10;

	if((p1.x < 0 && p2.x < 0 && p3.x < 0 && p4.x < 0) 
		|| (p1.y < 0 && p2.y < 0 && p3.y < 0 && p4.y < 0)
		|| (p1.x > cw10 && p2.x > cw10 && p3.x > cw10 && p4.x > cw10) 
		|| (p1.y > ch10 && p2.y > ch10 && p3.y > ch10 && p4.y > ch10)) {
		return;
	}

	if(w > (cw+1) || h > (ch+1)) {
		//clip big rect
		this.bigRect(p1, p2, p3, p4);
	}else{
		this.addPoint(p1.x, p1.y, true);
		this.addPoint(p2.x, p2.y, false);
		this.addPoint(p3.x, p3.y, false);
		this.addPoint(p4.x, p4.y, false);
		this.addPoint(p1.x, p1.y, false);
	}
};


//
// code adapted from nanovg begin {
// https://github.com/memononen/nanovg
//
CanvasRenderingContext2DWebGL.prototype.tesselateBezier = function(x1, y1, x2, y2, x3, y3, x4, y4, level, type) {
	var x12,y12,x23,y23,x34,y34,x123,y123,x234,y234,x1234,y1234;
	var dx,dy,d2,d3;

	if (level > 10) return;

	x12 = (x1+x2)*0.5;
	y12 = (y1+y2)*0.5;
	x23 = (x2+x3)*0.5;
	y23 = (y2+y3)*0.5;
	x34 = (x3+x4)*0.5;
	y34 = (y3+y4)*0.5;
	x123 = (x12+x23)*0.5;
	y123 = (y12+y23)*0.5;

	dx = x4 - x1;
	dy = y4 - y1;
	d2 = Math.abs(((x2 - x4) * dy - (y2 - y4) * dx));
	d3 = Math.abs(((x3 - x4) * dy - (y3 - y4) * dx));

	if ((d2 + d3)*(d2 + d3) < this.tessTol * (dx*dx + dy*dy)) {
		this.addPoint(x4, y4, type);
		return;
	}

	x234 = (x23+x34)*0.5;
	y234 = (y23+y34)*0.5;
	x1234 = (x123+x234)*0.5;
	y1234 = (y123+y234)*0.5;

	this.tesselateBezier(x1,y1, x12,y12, x123,y123, x1234,y1234, level+1, 0); 
	this.tesselateBezier(x1234,y1234, x234,y234, x34,y34, x4,y4, level+1, type); 
}

CanvasRenderingContext2DWebGL.prototype.doArcTo = function(x1, y1, x2, y2, radius) {
	var rn = {x:0, y:0};
	var x0 = this.lastX;
	var y0 = this.lastY;
	var dx0,dy0, dx1,dy1, a, d, cx,cy, a0,a1;
	var ccw = false;

	if (!this.hasPoint()) {
		return;
	}

	if (Math.ptEquals(x0,y0, x1,y1, this.distTol) ||
			Math.ptEquals(x1,y1, x2,y2, this.distTol) ||
			Math.distPtSeg(x1,y1, x0,y0, x2,y2) < this.distTol*this.distTol ||
			radius < this.distTol) {
		this.addPoint(x1, y1, false);
		return;
	}

	dx0 = x0-x1;
	dy0 = y0-y1;
	dx1 = x2-x1;
	dy1 = y2-y1;
	Math.normalize(dx0, dy0, rn);
	dx0 = rn.x;
	dy0 = rn.y;

	Math.normalize(dx1, dy1, rn);
	dx1 = rn.x;
	dy1 = rn.y;

	a = Math.acos(dx0*dx1 + dy0*dy1);
	d = radius / Math.tan(a/2.0);

	if (d > 10000.0) {
		this.addPoint(x1, y1, false);
		return;
	}

	if (Math.cross(dx0,dy0, dx1,dy1) > 0.0) {
		cx = x1 + dx0*d + dy0*radius;
		cy = y1 + dy0*d + -dx0*radius;
		a0 = Math.atan2(dx0, -dy0);
		a1 = Math.atan2(-dx1, dy1);
		ccw = false;
	} else {
		cx = x1 + dx0*d + -dy0*radius;
		cy = y1 + dy0*d + dx0*radius;
		a0 = Math.atan2(-dx0, dy0);
		a1 = Math.atan2(dx1, -dy1);
		ccw = true;
	}

	this.doArc(cx, cy, radius, a0, a1, ccw);
}

CanvasRenderingContext2DWebGL.prototype.doArc = function(cx, cy, r, a0, a1, ccw)
{
	var a = 0, da = 0, hda = 0, kappa = 0;
	var dx = 0, dy = 0, x = 0, y = 0, tanx = 0, tany = 0;
	var px = 0, py = 0, ptanx = 0, ptany = 0;
	var vals = new Array(3 + 5*7 + 100);
	var i, ndivs, nvals;
	var newPath = !this.hasPoint();

	da = a1 - a0;
	if (!ccw) {
		if (Math.abs(da) >= Math.PI*2) {
			da = Math.PI*2;
		} else {
			while (da < 0.0) da += Math.PI*2;
		}
	} else {
		if (Math.abs(da) >= Math.PI*2) {
			da = -Math.PI*2;
		} else {
			while (da > 0.0) da -= Math.PI*2;
		}
	}

	// Split arc into max 90 degree segments.
	ndivs = Math.floor(Math.max(1, Math.min((Math.abs(da) / (Math.PI*0.5) + 0.5), 5)));
	hda = (da / ndivs) / 2.0;
	kappa = Math.abs(4.0 / 3.0 * (1.0 - Math.cos(hda)) / Math.sin(hda));

	if (ccw) {
		kappa = -kappa;
	}

	nvals = 0;
	for (i = 0; i <= ndivs; i++) {
		a = a0 + da * (i/ndivs);
		dx = Math.cos(a);
		dy = Math.sin(a);
		x = cx + dx*r;
		y = cy + dy*r;
		tanx = -dy*r*kappa;
		tany = dx*r*kappa;

		if (i == 0) {
			this.addPoint(x, y, newPath);
		} else {
			this.bezierTo(px+ptanx, py+ptany, x-tanx, y-tany, x, y);
		}
		px = x;
		py = y;
		ptanx = tanx;
		ptany = tany;
	}

	return;
}

CanvasRenderingContext2DWebGL.prototype.quadTo = function(cx, cy, x, y) {
	var x0 = this.lastX;
	var y0 = this.lastY;
	var c1x = x0 + 2.0/3.0*(cx - x0);
	var c1y = y0 + 2.0/3.0*(cy - y0);
	var c2x = x + 2.0/3.0*(cx - x);
	var c2y = y + 2.0/3.0*(cy - y);

	this.bezierTo(c1x, c1y, c2x, c2y, x, y);
}

CanvasRenderingContext2DWebGL.prototype.bezierTo = function(c1x, c1y, c2x, c2y, x, y) {
	this.tesselateBezier(this.lastX, this.lastY, c1x, c1y, c2x, c2y, x, y, 0, 0);
}

//
// } code adapted from nanovg end
//

CanvasRenderingContext2DWebGL.prototype.quadraticCurveTo = function(cpx, cpy, x, y) {
	var m = this.state.m;
	var cp = mat2d.transformPointInt(m, cpx, cpy, 0);
	var p = mat2d.transformPointInt(m, x, y, 1);

	this.quadTo(cp.x, cp.y, p.x, p.y);
};

CanvasRenderingContext2DWebGL.prototype.bezierCurveTo = function(cp1x, cp1y, cp2x, cp2y, x, y) {
	var m = this.state.m;
	var cp1 = mat2d.transformPointInt(m, cp1x, cp1y, 0);
	var cp2 = mat2d.transformPointInt(m, cp2x, cp2y, 1);
	var p = mat2d.transformPointInt(m, x, y, 2);

	this.bezierTo(cp1.x, cp1.y, cp2.x, cp2.y, p.x, p.y);
};

CanvasRenderingContext2DWebGL.prototype.arcTo = function(x1, y1, x2, y2, radius) {
	var m = this.state.m;
	var r = radius*10 >> 0;
	var p1 = mat2d.transformPointInt(m, x1, y1, 0);
	var p2 = mat2d.transformPointInt(m, x2, y2, 1);

	this.doArcTo(p1.x, p1.y, p2.x, p2.y, r);
};

CanvasRenderingContext2DWebGL.prototype.arc = function(x, y, radius, startAngle, endAngle, ccw) {
	var r = radius*10 >> 0;
	var m = this.state.m;
	var p = mat2d.transformPointInt(m, x, y);
	var cw10 = this.canvasWidth10;
	var ch10 = this.canvasHeight10;

	if((p.x - r) > cw10 || (p.x + r) < 0 || (p.y - r) > ch10 || (p.y + r) < 0) {
		return;
	}

	this.doArc(p.x, p.y, r, startAngle, endAngle, ccw);
};

CanvasRenderingContext2DWebGL.getWebGLContext = function(canvas, webglOptions) {
	var gl = null;
	var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
	var options = webglOptions || CanvasRenderingContext2DWebGL.webglOptions;
	for (var i = 0; i < names.length; i++) {
		try {
      		gl = canvas.getContext(names[i], options);
		} catch(e) {}
    
		if (gl) {
			break;
		}
	}

	return gl;
}

CanvasRenderingContext2DWebGL.prototype.initGL = function(canvas) {
	var gl = CanvasRenderingContext2DWebGL.getWebGLContext(canvas, this.webglOptions);

	gl.w = canvas.width;
	gl.h = canvas.height;

//	gl.cullFace(gl.BACK);
//	gl.frontFace(gl.CW);
//	gl.enable(gl.CULL_FACE);
	gl.enable(gl.BLEND);
	gl.enable(gl.STENCIL_TEST);
	gl.disable(gl.DEPTH_TEST);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	this.gl = gl;
	this.canvas = canvas;
	this.buffer = gl.createBuffer();
	
	WebGLProgramDrawImage.init(gl, this.buffer);
	this.drawPrimitivesProgram = new WebGLProgramDrawPrimitives(gl, this.buffer);

	return gl;
}

CanvasRenderingContext2DWebGL.prototype.isPOT = function(n) {
	return n > 0 && (n & (n - 1)) === 0;
}

CanvasRenderingContext2DWebGL.prototype.loadTextureWithImage = function(image) {
	if(image.texture || !image.width) {
		return image;
	}

	var gl = this.gl;
	var texture = gl.createTexture();
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	
	image.texture = texture;
	image.ox = 0;
	image.oy = 0;
	texture.w = image.width;
	texture.h = image.height;
	texture.src = image.src;

	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

	//NPOT
	if(this.isPOT(image.width) && this.isPOT(image.height)) {
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	}
	else {
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	}

	gl.bindTexture(gl.TEXTURE_2D, null);

	return image;
}

CanvasRenderingContext2DWebGL.prototype.drawImageBatch = function(image, program, bufferData) {
	this.drawCalls++;
	this.drawImageCalls++;

	program.draw(image, bufferData);
}

CanvasRenderingContext2DWebGL.prototype.beginFrame = function() {
	var gl = this.gl;
	var w = this.getWidth();
	var h = this.getHeight();
	var canvas = this.canvas;

	this.drawCalls = 0;
	this.drawImageCalls = 0;
	this.drawImageCount = 0;
	this.fillCount = 0;
	this.strokeCount = 0;
	this.clipLevel = 0;
	this.canvasWidth = w;
	this.canvasHeight = h;
	this.canvasWidth10 = w * 10;
	this.canvasHeight10 = h * 10;

	if(gl.w !== w || gl.h !== h) {
		gl.w = w;
		gl.h = h;
		gl.clearColor(1.0, 1.0, 1.0, 1.0);
		gl.viewport(0, 0, canvas.width, canvas.height);
	}

	if(this.showFPS) {
		this.renderTimes++;
		this.startTime = Date.now();
		this.thisSeconds = (this.startTime/1000) >> 0;	

		if(this.thisSeconds !== this.lastSeconds) {
			this.fps = this.renderTimes;
			this.lastSeconds = this.thisSeconds;
			this.renderTimes = 0;
		}
	}

	if(this.webglOptions.preserveDrawingBuffer) {
		gl.clear(gl.STENCIL_BUFFER_BIT);
	}else {
		gl.clear(gl.STENCIL_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
	}

	this.lastX = 0;
	this.lastY = 0;
	this.firstX = 0;
	this.firstY = 0;

	this.lineWidth = 1;
	this.globalAlpha = 1;
	this.globalTint = 1;
	this.textAlign = "left";
	mat2d.identity(this.state.m);
	this.textBaseline = "middle";
	this.globalImageFilter = "normal";
	this.state.fillStyle = CanvasRenderingContext2DWebGL.fillStyle;
	this.state.strokeStyle = CanvasRenderingContext2DWebGL.strokeStyle;
	this.stencilColor = CanvasRenderingContext2DWebGL.stencilColor;
	this.globalCompositeOperation = "source-over";
	this.beginPath();

	if(this.autoPacker.isOverflow()) {
		this.autoPacker.reset();
	}
}

CanvasRenderingContext2DWebGL.prototype.drawStat = function(stat) {
	this.save();
    this.fillStyle = this.statusBgColor;
	this.fillRect(0, 0, 280, 35);

	var str = stat + " images(" + this.drawImageCount + "/" + this.drawImageCalls + ") calls:" + this.drawCalls;

	this.font = this.statusFont;
	this.fillStyle = this.statusFontColor;
	this.textBaseline = "top";
	this.textAlign = "left";
	this.fillText(str, 5, 5);
	this.restore();

	return;
}

CanvasRenderingContext2DWebGL.prototype.onEndFrame = function() {
	if(this.showFPS) {
		var stat = this.fps;
		this.drawStat(stat);
	}
}

CanvasRenderingContext2DWebGL.prototype.endFrame = function() {
	var n = this.stack.length;

	if(n > 0) {
		for(var i = 0; i < n; i++) {
			this.restore();
		}
		console.log("restore times < save times.");
	}

	mat2d.identity(this.state.m);
	this.globalAlpha = 1;
	this.globalTint = 1;
	this.globalCompositeOperationApply("source-over");

	this.onEndFrame();
	this.commitDrawImage();
}

CanvasRenderingContext2DWebGL.colors = {};
CanvasRenderingContext2DWebGL.parseColor = function(str) {
	var cacheColor = CanvasRenderingContext2DWebGL.colors[str];
	if(cacheColor) {
		return cacheColor;
	}

	var s = str || "white";
	var c = cs.get(s.toLowerCase());

	if(!c) {
		c = cs.get("white");
	}

	var value = c.value;
	var color = {
		r : value[0]/255,
		g : value[1]/255,
		b : value[2]/255,
		a : value[3],
		str:str
	};

	CanvasRenderingContext2DWebGL.colors[str] = color;

	return color;
}

CanvasRenderingContext2DWebGL.State = function() {
	this.font = "16px sans";
	this.lineWidth = 1;
	this.globalAlpha = 1;
	this.globalTint = 1;
	this.m = mat2d.create();
	this.clipRect = null;
	this.clipPaths = null;
	this.textAlign = "left";
	this.textBaseline = "middle";
	this.globalImageFilter = "normal";
	this.globalCompositeOperation = "source-over";
	this.fillStyle = CanvasRenderingContext2DWebGL.fillStyle;
	this.strokeStyle = CanvasRenderingContext2DWebGL.strokeStyle;
}

CanvasRenderingContext2DWebGL.createState = function() {
	if(CanvasRenderingContext2DWebGL.stateCache.length) {
		return CanvasRenderingContext2DWebGL.stateCache.pop();
	}else{
		return new CanvasRenderingContext2DWebGL.State();
	}
}

CanvasRenderingContext2DWebGL.stateCache = [];
CanvasRenderingContext2DWebGL.destroyState = function(s) {
	if(s.clipRect) {
		s.clipRect = null;
	}
	if(s.clipPaths) {
		s.clipPaths = null;
	}
	CanvasRenderingContext2DWebGL.stateCache.push(s);
}

CanvasRenderingContext2DWebGL.State.prototype.clone = function() {
	var s = CanvasRenderingContext2DWebGL.createState();

	if(this.clipRect) {
		s.clipRect = this.clipRect;
	}

	if(this.clipPaths) {
		s.clipPaths = this.clipPaths;
	}

	mat2d.copy(s.m, this.m);

	s.font = this.font;
	s.lineWidth = this.lineWidth;
	s.textAlign = this.textAlign;
	s.fillStyle = this.fillStyle;
	s.strokeStyle = this.strokeStyle;
	s.textBaseline = this.textBaseline;
	s.globalTint = this.globalTint;
	s.globalAlpha = this.globalAlpha;
	s.globalImageFilter = this.globalImageFilter;
	s.globalCompositeOperation = this.globalCompositeOperation;

	return s;
}

CanvasRenderingContext2DWebGL.prototype.init = function(canvas) {
	this.stack = [];
	this.state = CanvasRenderingContext2DWebGL.createState();
	
	this.initGL(canvas);
	this.lastUpdateTime = Date.now();

	var drawImageProgram = WebGLProgramDrawImage.get();
	this.drawImageQueue = {};
	this.drawImageQueue.globalAlpha = 256;
	this.drawImageQueue.globalCompositeOperation = 0;
	this.drawImageQueue.dataBuffer = drawImageProgram.createDataBuffer(20*1024);
	
	this.drawPrimitiveQueue = {};
	this.drawPrimitiveQueue.paths = Int16Array.create(1024);
	this.drawPrimitiveQueue.dataBuffer = this.drawPrimitivesProgram.createDataBuffer(20*1024);
	this.autoPacker = new AutoPacker();
	this.autoPacker.init(this.gl);
	this.statusFont = "20px sans";
	this.statusFontColor = "Green";
	this.statusBgColor = "rgba(0,0,0,1)";

	return this;
}

CanvasRenderingContext2DWebGL.prototype.ensureCtx2d = function() {
	if(this.ctx2d) {
		return;
	}
	this.canvas2d = document.createElement("canvas");
	this.ctx2d = this.canvas2d.getContext("2d");
}

CanvasRenderingContext2DWebGL.prototype.measureText = function(text) {
	this.ensureCtx2d();
	this.ctx2d.font = this.font;
	return this.ctx2d.measureText(text);
}

CanvasRenderingContext2DWebGL.prototype.setShowFPS = function(showFPS) {
	this.showFPS = showFPS;
}

CanvasRenderingContext2DWebGL.create = function(canvas, options) {
	var ctx = new CanvasRenderingContext2DWebGL(options);

	CanvasRenderingContext2DWebGL.fillStyle = CanvasRenderingContext2DWebGL.parseColor("white");
	CanvasRenderingContext2DWebGL.strokeStyle = CanvasRenderingContext2DWebGL.parseColor("black");
	CanvasRenderingContext2DWebGL.stencilColor = CanvasRenderingContext2DWebGL.parseColor("white");

	return ctx.init(canvas);
}

HTMLCanvasElement.prototype.getContextOrg = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function(type, options) {
	if(this.webglCtx) {
		return this.webglCtx;
	}

	if(type === "2d-webgl") {
		if(!this.webglCtx) {
			this.webglCtx = CanvasRenderingContext2DWebGL.create(this, options);
		}
		return this.webglCtx;
	}else{
		return HTMLCanvasElement.prototype.getContextOrg.call(this, type, options);
	}
}
