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
