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

