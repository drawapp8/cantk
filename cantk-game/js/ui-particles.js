/*
 * File:   ui-particles.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  particles 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIParticles() {
	return;
}

UIParticles.prototype = new UIElement();
UIParticles.prototype.isUIParticles = true;

UIParticles.prototype.initUIParticles = function(type) {
	this.initUIElement(type);	
	this.name = "ui-particles";
	this.autoEmit = true;
	this.setDefSize(200, 200);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;

	return this;
}

UIParticles.prototype.setEmitterPosition = function(x, y) {
	if(this.emitter) {
		this.emitter.p.x = x;
		this.emitter.p.y = y;
	}
	else {
		this.emitterX = 0;
		this.emitterY = 0;
	}

	return this;
}

UIParticles.prototype.onInit = function() {
	this.start();

	return;
}
	
UIParticles.prototype.initParticles = function() {
	var x = this.w >> 1;
	var y = this.h >> 1;
	var proton = new Proton();
	var emitter = new Proton.Emitter();
	var style = this.style;

	if(style.rateNumMax) {
		emitter.rate = new Proton.Rate(new Proton.Span(style.rateNumMin, style.rateNumMax), 
			new Proton.Span(style.rateTimeMin, style.rateTimeMax));
	}

	if(style.texture) {
		var image = ResLoader.loadImage(style.texture);
		emitter.addInitialize(new Proton.ImageTarget(image));
	}
	
	if(style.textures) {
		var images = [];	
		var arr = style.textures.split('\n');

		for(var i = 0; i < arr.length; i++) {
			var src = arr[i];
			if(!src) continue;
			var image = ResLoader.loadImage(src);
			images.push(image);
		}

		emitter.addInitialize(new Proton.ImageTarget(images));
	}

	if(style.massMax) {
		emitter.addInitialize(new Proton.Mass(style.massMin, style.massMax));
	}

	if(style.radiusMin || style.radiusMax) {
		emitter.addInitialize(new Proton.Radius(style.radiusMin, style.radiusMax));
	}

	if(style.lifeMax) {
		emitter.addInitialize(new Proton.Life(style.lifeMin, style.lifeMax));
	}

	if(style.velocityType) {
		emitter.addInitialize(new Proton.Velocity(new Proton.Span(style.velocityXMin, style.velocityXMax),
			new Proton.Span(style.velocityYMin, style.velocityYMax), style.velocityType));
	}

	if(style.driftX || style.driftY) {
		emitter.addBehaviour(new Proton.RandomDrift(style.driftX, style.driftY, style.driftDelay, style.driftLife));
	}

	if(style.startColor || style.endColor) {
		emitter.addBehaviour(new Proton.Color(style.startColor, style.endColor, style.colorLife, style.colorEasing));
	}
	
	if(style.position) {
		switch(style.position) {
			case "left": {
				emitter.addInitialize(new Proton.Position(new Proton.LineZone(-x, -y, -x, y)));
				break;
			}
			case "right": {
				emitter.addInitialize(new Proton.Position(new Proton.LineZone(x, -y, x, y)));
				break;
			}
			case "top": {
				emitter.addInitialize(new Proton.Position(new Proton.LineZone(-x, -y, x, -y)));
				break;
			}
			case "bottom": {
				emitter.addInitialize(new Proton.Position(new Proton.LineZone(-x, y, x, y)));
				break;
			}
			default:break;
		}
	}

	if(style.rotationMin || style.rotationMax) {
		emitter.addBehaviour(new Proton.Rotate(new Proton.Span(style.rotationMin, style.rotationMax), 
			new Proton.Span(style.rotationDeltaMin, style.rotationDeltaMax), 'add'));
	}

	if(style.scaleMax || style.scaleMin) {
		emitter.addBehaviour(new Proton.Scale(style.scaleMin, style.scaleMax));
	}

	if(style.alphaMax || style.alphaMin) {
		emitter.addBehaviour(new Proton.Alpha(style.alphaMin, style.alphaMax));
	}
	
	if(style.gravity) {
		emitter.addBehaviour(new Proton.Gravity(style.gravity));
	}

	var win = this.getWindow();
	emitter.addBehaviour(new Proton.CrossZone(new Proton.RectZone(0, 0, win.w, win.h), 'dead'));

	emitter.p.x = x;
	emitter.p.y = y;
	if(this.autoEmit) {
		emitter.emit();
	}
	proton.addEmitter(emitter);

	this.emitter = emitter;
	this.lastUpdateTime = Date.now();
}

UIParticles.prototype.emit = function(once) {
	this.emitter.stopEmit();
	if(once) {
		this.emitter.emit('once', 100000000);
	}
	else {
		this.emitter.emit();
	}

	return this;
}

UIParticles.prototype.start = function() {
	var me = this;
	if(this.timerID) {
		return this;
	}

	this.initParticles();
	function update() {
		if(!me.parentShape || !me.emitter) {
			clearInterval(me.timerID);
			me.timerID = 0;
			return;
		}

		if(me.isVisible() && !me.paused && WWindowManager.getInstance().getPaintEnable()) {
			var now = Date.now();
			var	elapsed = (now - me.lastUpdateTime)/1000;
			me.emitter.update(elapsed);
			me.lastUpdateTime = now;
		}
	}

	me.timerID = setInterval(update, 25);

	return this;
}

UIParticles.prototype.stop = function() {
	clearInterval(this.timerID);
	this.emitter.stopEmit();
	
	this.timerID = null;
	this.emitter = null;

	return this;
}

UIParticles.prototype.pause = function() {
	this.paused = true;

	return this;
}

UIParticles.prototype.resume = function() {
	this.paused = false;

	return this;
}

UIParticles.prototype.drawParticle = function(canvas, particle) {
	if (particle.target) {
		if (particle.target instanceof Image) {
			var w = particle.target.width * particle.scale | 0;
			var h = particle.target.height * particle.scale | 0;
			var x = particle.p.x - w / 2;
			var y = particle.p.y - h / 2;

			canvas.save();
			canvas.globalAlpha = particle.alpha;
			canvas.translate(particle.p.x, particle.p.y);
			canvas.rotate(Proton.MathUtils.degreeTransform(particle.rotation));
			canvas.translate(-particle.p.x, -particle.p.y);
			canvas.drawImage(particle.target, 0, 0, particle.target.width, particle.target.height, x, y, w, h);
			canvas.globalAlpha = 1;
			canvas.restore();
		}
	} else {
		if (particle.transform["rgb"])
			canvas.fillStyle = 'rgba(' + particle.transform.rgb.r + ',' + particle.transform.rgb.g + ',' 
				+ particle.transform.rgb.b + ',' + particle.alpha + ')';
		else
			canvas.fillStyle = particle.color;
		canvas.beginPath();
		canvas.arc(particle.p.x, particle.p.y, particle.radius, 0, Math.PI * 2, true);
		if (this.stroke) {
			canvas.strokeStyle = this.stroke.color;
			canvas.lineWidth = this.stroke.thinkness;
			canvas.stroke();
		}

		canvas.closePath();
		canvas.fill();
	}
}

UIParticles.prototype.paintSelfOnly = function(canvas) {
	if(this.isIcon || this.mode === Shape.MODE_EDITING) {
		if(!UIParticles.iconImage) {
			UIParticles.iconImage = WImage.create("/drawapp8/images/particles-generator.png");
		}
		else {
			var image = UIParticles.iconImage.getImage();
			var rect = UIParticles.iconImage.getImageRect();
			if(image && image.width) {
				UIElement.drawImageAt(canvas, image, UIElement.IMAGE_DISPLAY_AUTO, 0, 0, this.w, this.h, rect);	
			}
		}

		return;
	}

	if(!this.emitter) {
		return;
	}

	var particles = this.emitter.particles;
	var n = particles.length;
	for(var i = 0; i < n; i++) {
		var iter = particles[i];
		this.drawParticle(canvas, iter);
	}

	this.postRedraw();

	return;
}

UIParticles.prototype.shapeCanBeChild = function(shape) {
	return false;
}

function UIParticlesCreator() {
	var args = ["ui-particles", "ui-particles", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIParticles();
		return g.initUIParticles(this.type);
	}
	
	return;
}
	
ShapeFactoryGet().addShapeCreator(new UIParticlesCreator());

