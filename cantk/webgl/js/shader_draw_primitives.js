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

