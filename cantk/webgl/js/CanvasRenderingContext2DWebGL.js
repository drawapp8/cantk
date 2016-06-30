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
