/*
 * File:   ui-particles.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  particles
 *
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 *
 */

/**
 * @class UIParticlesX
 * @extends UIElement
 * 粒子产生器。
 *
 *注意：
 *
 * 1.系统在载入粒子配置的文件的时候，默认读取配置文件内指定的图片名称，该图片必须和配置文件在同一目录下。
 *
 * 2.用我们官方指定的粒子编辑器生成的是一个json文件，该文件默认已经包含了图片资源。用其他工具生成的粒子有配置文件和图片文件。
 *
 * 3.特殊属性，选择资源的时候只需要指定plist或者json文件即可，不必指定图片文件，引擎会去读取。
 */
function UIParticlesX() {
	return;
}

UIParticlesX.prototype = new UIElement();
UIParticlesX.prototype.isUIParticlesX = true;
UIParticlesX.prototype.saveProps = ["dataURL", "textureURL"];

UIParticlesX.prototype.initUIParticlesX = function(type) {
	this.initUIElement(type);
	this.name = "ui-particles";
	this.autoEmit = true;
	this.paused = false;
	this.setDefSize(200, 200);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;

	return this;
}

UIParticlesX.prototype.setEmitterPosition = function(x, y) {
	return this;
}

UIParticlesX.prototype.onFromJsonDone = function() {

	return this;
}

/**
 * @method emit
 * 发射粒子。
 * @param {Boolean} once 是否子发射一次。
 * @return {UIElement} 返回控件本身。
 *
 *     @example small frame
 *     this.win.find("ui-particles-general").emit(true);
 *
 */
UIParticlesX.prototype.emit = function(once) {
	this.particles.emit(once);
	return this;
}

/**
 * @method start
 * 启动粒子产生器，除非调用了stop，一般不需手工调用它。
 * 如果对已经启动的粒子编辑器调用该接口，系统会清空当前粒子编辑器状态，并重新生成。
 * @return {UIElement} 返回控件本身。
 *
 */
UIParticlesX.prototype.start = function() {
	this.particles.reset();
	return this;
}

/**
 * @method stop
 * 调用该接口，粒子发射器将不再发射新的粒子，已经发射的粒子会随着生命周期的结束而消失。
 * @return {UIElement} 返回控件本身。
 *
 */
UIParticlesX.prototype.stop = function() {
	this.particles.stop();
	return this;
}

/**
 * @method pause
 * 暂停。调用该接口，相当于一个时间停滞的效果，粒子发射器将暂停发射新的粒子，已经发射的粒子停留在该时刻的状态。
 * @return {UIElement} 返回控件本身。
 *
 */
UIParticlesX.prototype.pause = function() {
	this.paused = true;
	return this;
}

/**
 * @method resume
 * 恢复。恢复粒子发射、更新粒子状态。
 * @return {UIElement} 返回控件本身。
 *
 */
UIParticlesX.prototype.resume = function() {
	this.paused = false;

	return this;
}

UIParticlesX.prototype.loadPList = function(options, texture) {
	this.particles = new ParticleEmitter();
	this.particles.init(options);
	this.particles.setTexture(texture);

	return;
}

UIParticlesX.prototype.onInit = function() {
	var me = this;
	var options = null;

	if(this.dataURL) {
		ResLoader.loadData(this.dataURL, function(data) {
			try {
                options = JSON.parse(data);
			}
			catch(err) {
				var plist = new PList();
				options = plist.parse(data);
                if(options.textureFileName) {
                    me.textureURL = me.dataURL.substring(0, me.dataURL.lastIndexOf('/')+1) + options.textureFileName;
                }
			}

			delete me.particles;

			var url =  options.imageData || me.textureURL;
            if(url) {
                ResLoader.loadImage(url, function(img) {
                    if(img.width === 0 || img.height === 0) {
                        console.debug("particlesx invalid img");
                        return;
                    }
                    me.loadPList(options, img);
                });
			}
		});
	}

	return;
}

UIParticlesX.prototype.drawBgImage = function() {
	return;
}

UIParticlesX.prototype.setDataURL = function(url) {
	if(url === this.dataURL || !url) return;
	this.dataURL = url;
    if(/\.json$/.test(url)) {
        this.saveProps = ['dataURL'];
    }
    else {
	    this.textureURL = url.substring(0, url.lastIndexOf('.')+1) + 'png';
    }
	this.onInit();
}

UIParticlesX.prototype.getDataURL = function() {
	return this.dataURL;
}

UIParticlesX.prototype.drawParticle = function(canvas) {
	var paused = this.timeScaleIsZero() || this.paused || (this.isInDesignMode() && this.disablePreview);
	if(!paused) {
		this.particles.update(canvas.timeStep/1000);
	}

	this.particles.setScaleX(this.scaleX);
	this.particles.setScaleY(this.scaleY);

	this.particles.draw(canvas);
}

UIParticlesX.prototype.paintSelfOnly = function(canvas) {
	if(this.particles) {
		canvas.needRedraw++;
		canvas.save();
		canvas.translate(this.w/2, this.h/2);
		this.drawParticle(canvas);
		canvas.restore();
	}

	return;
}

UIParticlesX.prototype.shapeCanBeChild = function(shape) {
	return false;
}

function UIParticlesXCreator() {
	var args = ["ui-particles-x", "ui-particles-x", null, 1];

	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIParticlesX();
		return g.initUIParticlesX(this.type);
	}

	return;
}

ShapeFactoryGet().addShapeCreator(new UIParticlesXCreator());
void function() {

function pMultIn(point, factor) {
	point.x *= factor;
	point.y *= factor;
}

function pIn(p1, p2) {
	p1.x = p2.x;
	p1.y = p2.y;
}

function pAddIn(p1, p2) {
	p1.x += p2.x;
	p1.y += p2.y;
}

function pSubIn(p1, p2) {
	p1.x -= p2.x;
	p1.y -= p2.y;
}

function pNormalizeIn(p) {
	pMultIn(p, 1.0 / Math.sqrt(p.x * p.x + p.y * p.y));
}

function pZeroIn(p) {
	p.x = 0;
	p.y = 0;
}

function Point(x, y) {
	if(!(this instanceof Point)) {
		return new Point(x, y);	
	}
	this.x = x;
	this.y = y;
}

function Color(r, g, b, a) {
	if(!(this instanceof Color)) {
		return new Color(r, g, b, a);	
	}
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = a;
}

function Rect(x, y, w, h) {
	if(!(this instanceof Rect)) {
		return new Rect(x, y, w, h);
	}

	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
}

function pointInMatrix(point, transform) {
	var x = point.x,
		y = point.y,
		a = transform.a,
		b = transform.b,
		c = transform.c,
		d = transform.d,
		tx = transform.tx,
		ty = transform.ty;

	return {x: a*x + c*y + tx, y: b*x + d*y + ty};
}

var ONE_RAD = Math.PI/180;
function angleToRadians(angle) {
	return ONE_RAD*angle;	
}

function randomMinus1To1() {
	return (Math.random() - 0.5) * 2;
}

function Clampf(val, min, max) {
	if(min > max) {
		var tmp = min;
		min = max;
		max = min;
	}

	return val < min ? min : val > max ? max : val;
}

var ONE 	  = 1;
var SRC_ALPHA = 0x0302;
var BLEND_DST = 0x0303;

function Particle() {
	//粒子坐标浮动值
	this.pos = Point(0, 0);
	//粒子起始坐标
	this.startPos = Point(0, 0);
	//粒子最终绘制的坐标
	this.drawPos = Point(0, 0);
	this.color = Color(0, 0, 0, 255);
	this.deltaColor = Color(0, 0, 0, 255);
	//重力模式
	this.modeA = new Particle.ParamsGravity();
	//半径模式
	this.modeB = new Particle.ParamsRadius();
	this.size = 0;
	this.deltaSize = 0;
	this.rotation = 0;
	this.deltaRotation = 0;
	this.timeToLive = 0;
	this.isChangeColor = false;
}

Particle.TemporaryPoints = [
	Point(0, 0),
	Point(0, 0),
	Point(0, 0),
	Point(0, 0)
];

////////////////////////////////////////////////////////////////////////////////
Particle.ModeGravity = function(speed, speedVar, gravityX, gravityY, radialAccel, 
	radialAccelVar, tangentialAccel, tangentialAccelVar, rotationIsDir) {
	//粒子初速度
	this.speed = speed;
	//粒子初速度浮值
	this.speedVar = speedVar;
	this.gravity = {x: gravityX, y: gravityY};
	this.radialAccel = radialAccel;
	this.radialAccelVar = radialAccelVar;
	this.tangentialAccel = tangentialAccel;
	this.tangentialAccelVar = tangentialAccelVar;
	this.rotationIsDir = rotationIsDir;
}

Particle.ModeGravity.prototype.randomFeatures = function(randians, particle) {
	var params = particle.modeA;
	//速度
	var speed = this.speed + this.speedVar * randomMinus1To1();
	//方向
	params.dir.x = Math.cos(randians);
	params.dir.y = Math.sin(randians);
	pMultIn(params.dir, speed);
	//径向加速度
	params.radialAccel = this.radialAccel + this.radialAccelVar * randomMinus1To1();
	//切向加速度
	params.tangentialAccel = this.tangentialAccel + this.tangentialAccelVar * randomMinus1To1();
}

Particle.ParamsGravity = function(p, radialAccel, tangentialAccel) {
	this.dir = p || Point(0, 0);
	this.radialAccel = radialAccel;
	this.tangentialAccel = tangentialAccel;
}

///////////////////////////////////////////////////////////////////////////////
Particle.ModeRadius = function(startRadius, startRadiusVar, endRadius,
	endRadiusVar, rotatePerSecond, rotatePerSecondVar) {
	this.startRadius = startRadius;
	this.startRadiusVar = startRadiusVar;
	this.endRadius = endRadius;
	this.endRadiusVar = endRadiusVar;

	this.rotatePerSecond = rotatePerSecond;
	this.rotatePerSecondVar = rotatePerSecondVar;
}

Particle.ModeRadius.prototype.randomFeatures = function(randians, particle) {
	var params = particle.modeB;
	var startRadius = this.startRadius + this.startRadiusVar * randomMinus1To1();
	var endRadius = this.endRadius + this.endRadiusVar * randomMinus1To1();

	params.angle = randians;
	params.radius = startRadius;
	params.deltaRadius = (endRadius - startRadius) / particle.timeToLive;
	params.anglePerSecond = angleToRadians(this.rotatePerSecond + this.rotatePerSecondVar * randomMinus1To1());
}

Particle.ParamsRadius = function(angle, anglePerSecond, radius, deltaRadius) {
	//粒子旋转角度
	this.angle = angle;
	//粒子运动半径
	this.radius = radius || 0; 
	//粒子运动半径增量
	this.deltaRadius = deltaRadius || 0;
	//粒子旋转角速度
	this.anglePerSecond = anglePerSecond || 0;
}

////////////////////////////////////////////////////////////////////////////////
function ParticleEmitter(opts) {
	this.emitMode = 0;
	this.duration = 0;
	this.emitRate = 0;
	this.timeCounter = 0;
	//发射器原始坐标
	this.srcPos = Point(0, 0);
	//发射器坐标浮动值
	this.srcPosVar = Point(0, 0);
	this.angle = 0;
	this.angleVar = 0;
	this.maxParticles = 0;
	this.isRemoveOnFinish = false;
	this.particles = [];
	this.particleCounter = 0;

	this.positionType = ParticleEmitter.POS_TYPE_FREE;

	this.srcBlendFunc = 0;
	this.dstBlendFunc = 0;

	this.life = 0;
	this.lifeVar = 0;

	this.startSize = 0;
	this.startSizeVar = 0;
	this.endSize = 0;
	this.endSizeVar = 0;

	this.startColor = Color(0, 0, 0, 0);
	this.startColorVar = Color(0, 0, 0, 0);
	this.endColor = Color(0, 0, 0, 0);
	this.endColorVar = Color(0, 0, 0, 0);

	this.startSpin = 0;
	this.startSpinVar = 0;

	this.endSpin = 0;
	this.endSpinVar = 0;

	this.tmpZeroPoint = Point(0, 0);

	this.elapsed = 0;
	this.timeScale = 1;
	this.active = true;
	this.texture = null;

	this.scaleX = 1;
	this.scaleY = 1;

	this.transform = {a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0};
	this.worldTransform = {a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0};

	this.anchorPointInPoints = Point(0, 0);
}

ParticleEmitter.POS_TYPE_FREE 	 = 0;
ParticleEmitter.POS_TYPE_RELATIVE = 1;
ParticleEmitter.POS_TYPE_GROUPED  = 2;

ParticleEmitter.MODE_GRAVITY = 0;
ParticleEmitter.MODE_RADIUS  = 1;
ParticleEmitter.MODE_WIND	= 2;

function fetchProperty(opts, key, def) {
	return opts[key] != void 0 ? opts[key] : def;	
}

function renderToCache(image, cache) {
	var w = image.width;
    var h = image.height;

    cache[0].width = w;
    cache[0].height = h;
    cache[1].width = w;
    cache[1].height = h;
    cache[2].width = w;
    cache[2].height = h;
    cache[3].width = w;
    cache[3].height = h;

    var cacheCtx = cache[3].getContext("2d");
    cacheCtx.drawImage(image, 0, 0);
    var pixels = cacheCtx.getImageData(0, 0, w, h).data;

    var ctx;
    for(var rgbI = 0; rgbI < 4; rgbI++) {
        ctx = cache[rgbI].getContext("2d");

        var to = ctx.getImageData(0, 0, w, h);
        var data = to.data;
        for(var i = 0; i < pixels.length; i += 4) {
			data[i    ] = (rgbI === 0) ? pixels[i    ] : 0;
            data[i + 1] = (rgbI === 1) ? pixels[i + 1] : 0;
            data[i + 2] = (rgbI === 2) ? pixels[i + 2] : 0;
            data[i + 3] = pixels[i + 3];
		}
        ctx.putImageData(to, 0, 0);
	}
    image.onload = null;
}

ParticleEmitter.prototype.parseModeGravity = function(opts) {
	return new Particle.ModeGravity(
		parseFloat(fetchProperty(opts, "speed")),
		parseFloat(fetchProperty(opts, "speedVariance")),
		parseFloat(fetchProperty(opts, "gravityx")),
		parseFloat(fetchProperty(opts, "gravityy")),
		parseFloat(fetchProperty(opts, "radialAcceleration")),
		parseFloat(fetchProperty(opts, "radialAccelVariance")),
		parseFloat(fetchProperty(opts, "tangentialAcceleration")),
		parseFloat(fetchProperty(opts, "tangentialAccelVariance")),
		(fetchProperty(opts, "rotationIsDir", false))
	);
}

ParticleEmitter.prototype.parseModeRadius = function(opts) {
	return new Particle.ModeRadius(
		parseFloat(fetchProperty(opts, "maxRadius")),
		parseFloat(fetchProperty(opts, "maxRadiusVariance")),
		parseFloat(fetchProperty(opts, "minRadius")),
		0,
		parseFloat(fetchProperty(opts, "rotatePerSecond")),
		parseFloat(fetchProperty(opts, "rotatePerSecondVariance"))
	);
}

ParticleEmitter.prototype.init = function(opts) {
	this.maxParticles = parseInt(fetchProperty(opts, 'maxParticles', 0));

	for(var i = 0; i < this.maxParticles; i++) {
		this.particles.push(new Particle());
	}

	//emitter angle
	this.angle = parseInt(fetchProperty(opts, 'angle', 0));
	this.angleVar = parseInt(fetchProperty(opts, 'angleVariance', 0));

	//emitter duration
	this.duration = parseInt(fetchProperty(opts, 'duration', 0));
	this.backDuration = this.duration;

	//blend function
	this.srcBlendFunc = parseInt(fetchProperty(opts, 'blendFuncSource', 0));
	this.dstBlendFunc = parseInt(fetchProperty(opts, 'blendFuncDestination', 0));

	//particle color
    this.startColor.r = parseFloat(fetchProperty(opts, "startColorRed")) * 255;
    this.startColor.g = parseFloat(fetchProperty(opts, "startColorGreen")) * 255;
    this.startColor.b = parseFloat(fetchProperty(opts, "startColorBlue")) * 255;
    this.startColor.a = parseFloat(fetchProperty(opts, "startColorAlpha")) * 255;

    this.startColorVar.r = parseFloat(fetchProperty(opts, "startColorVarianceRed")) * 255;
    this.startColorVar.g = parseFloat(fetchProperty(opts, "startColorVarianceGreen")) * 255;
    this.startColorVar.b = parseFloat(fetchProperty(opts, "startColorVarianceBlue")) * 255;
    this.startColorVar.a = parseFloat(fetchProperty(opts, "startColorVarianceAlpha")) * 255;

    this.endColor.r = parseFloat(fetchProperty(opts, "finishColorRed")) * 255;
    this.endColor.g = parseFloat(fetchProperty(opts, "finishColorGreen")) * 255;
    this.endColor.b = parseFloat(fetchProperty(opts, "finishColorBlue")) * 255;
    this.endColor.a = parseFloat(fetchProperty(opts, "finishColorAlpha")) * 255;

    this.endColorVar.r = parseFloat(fetchProperty(opts, "finishColorVarianceRed")) * 255;
    this.endColorVar.g = parseFloat(fetchProperty(opts, "finishColorVarianceGreen")) * 255;
    this.endColorVar.b = parseFloat(fetchProperty(opts, "finishColorVarianceBlue")) * 255;
    this.endColorVar.a = parseFloat(fetchProperty(opts, "finishColorVarianceAlpha")) * 255;

    // particle size
    this.startSize = parseFloat(fetchProperty(opts, "startParticleSize"));
    this.startSizeVar = parseFloat(fetchProperty(opts, "startParticleSizeVariance"));
    this.endSize = parseFloat(fetchProperty(opts, "finishParticleSize"));
    this.endSizeVar = parseFloat(fetchProperty(opts, "finishParticleSizeVariance"));

    //emitter position
    this.srcPos.x = parseFloat(fetchProperty(opts, "sourcePositionx"));
    this.srcPos.y = parseFloat(fetchProperty(opts, "sourcePositiony"));
	this.srcPosVar.x = parseFloat(fetchProperty(opts, "sourcePositionVariancex"));
    this.srcPosVar.y = parseFloat(fetchProperty(opts, "sourcePositionVariancey"));
	
	//particle spining
	this.startSpin = parseFloat(fetchProperty(opts, "rotationStart"));
	this.startSpinVar = parseFloat(fetchProperty(opts, "rotationStartVariance"));
	this.endSpin = parseFloat(fetchProperty(opts, "rotationEnd"));
	this.endSpinVar = parseFloat(fetchProperty(opts, "rotationEndVariance"));

	//particle life span
	this.life = parseFloat(fetchProperty(opts, "particleLifespan"));
	this.lifeVar = parseFloat(fetchProperty(opts, "particleLifespanVariance"));

	//emitter rate
	this.emitRate = this.maxParticles / this.life;

	this.isRemoveOnFinish = fetchProperty(opts, "isAutoRemoveOnFinish", false);

	//emitter mode
	this.emitMode = parseFloat(fetchProperty(opts, "emitterType"));

	this.imageData = fetchProperty(opts, "imageData", null) ||
		fetchProperty(opts, "textureImageData", null);

	if(this.imageData) {
		var image = new Image();
		image.src = this.imageData;
		this.setTexture(image);
	}

	if(this.emitMode === ParticleEmitter.MODE_GRAVITY) {
		this.mode = this.parseModeGravity(opts);
	}
	else {
		this.mode = this.parseModeRadius(opts);
	}
}

ParticleEmitter.prototype.setScaleX = function(scaleX) {
	this.scaleX = scaleX;
	return this;
}

ParticleEmitter.prototype.setScaleY = function(scaleY) {
	this.scaleY = scaleY;
	return this;
}

ParticleEmitter.prototype.emit = function(once) {
	this.reset();
	if(once) {
		if("backDuration" in this) {
			this.duration = this.backDuration;
		}
		if(this.duration === -1) {
			this.duration = 1;
		}
	}
	else {
		if("backDuration" in this) {
			this.backDuration = this.duration;
		}
		this.duration = -1;
	}
}

ParticleEmitter.prototype.reset = function() {
	this.active = true;
	this.elapsed = 0;

	if("backDuration" in this) {
		this.duration = this.backDuration;
	}
	var particles = this.particles;
	for(var i = 0; i < particles.length; i++) {
		particles[i].timeToLive = 0;
	}
}

ParticleEmitter.prototype.reload = function(opts) {
	this.stop();
	this.init(opts);
	this.start();
}

ParticleEmitter.prototype.pause = function() {
	this.timeScale = 0;
	return this;
}

ParticleEmitter.prototype.resume = function() {
	this.timeScale = 1;
	return this;
}

ParticleEmitter.prototype.start = function() {
	this.reset();
	return this;
}

ParticleEmitter.prototype.stop = function() {
	if("backDuration" in this) {
		this.duration = this.backDuration;
	}
	this.active = false;
	this.elapsed = this.duration; 
	this.timeCounter = 0;

	return this;
}

ParticleEmitter.prototype.setTexture = function(texture) {
	if(texture === this.texture) return;

	this.texture = texture;
	//renderToCache(this.texture, this.tintCaches);
	this.textureRect = Rect(0, 0, texture.width, texture.height);

	return this;
}

ParticleEmitter.prototype.getWorldTransform = function() {
	var t = this.transform;	
	var a = 1, b = 0, c = 0, d = 1;

	t.tx = this.srcPos.x;
	t.ty = this.srcPos.y;

	t.a = a;
	t.b = b;
	t.c = c;
	t.d = d;

	var scaleX = this.scaleX, scaleY = this.scaleY;
	var appX = this.anchorPointInPoints.x, appY = this.anchorPointInPoints.y;

	scaleX = (scaleX < 0.000001 && scaleX > -0.000001) ? 0.000001 : scaleX;
	scaleY = (scaleY < 0.000001 && scaleY > -0.000001) ? 0.000001 : scaleY;
	
	if(scaleX !== 1 || scaleY !== 1) {
		a = t.a *= scaleX;
		b = t.b *= scaleX;
		c = t.c *= scaleY;
		d = t.d *= scaleY;
	}

	t.tx -= a * appX + c * appY;
	t.ty -= b * appX + d * appY;

	return this.transform;
}

ParticleEmitter.prototype.convertToWorldSpace = function(point) {
	return pointInMatrix(point, this.getWorldTransform());		
}

ParticleEmitter.prototype.initParticle = function(particle) {
	//timeToLive
	particle.timeToLive = this.life + this.lifeVar*randomMinus1To1();	
	particle.timeToLive = Math.max(0, particle.timeToLive);

	//position
	particle.pos.x = this.srcPosVar.x*randomMinus1To1();	
	particle.pos.y = this.srcPosVar.y*randomMinus1To1();	

	//color
	var startColor = {
		r: Clampf(this.startColor.r + this.startColorVar.r*randomMinus1To1(), 0, 255),
		g: Clampf(this.startColor.g + this.startColorVar.g*randomMinus1To1(), 0, 255),
		b: Clampf(this.startColor.b + this.startColorVar.b*randomMinus1To1(), 0, 255),
		a: Clampf(this.startColor.a + this.startColorVar.a*randomMinus1To1(), 0, 255)
	};
	var endColor = {
		r: Clampf(this.endColor.r + this.endColorVar.r*randomMinus1To1(), 0, 255),
		g: Clampf(this.endColor.g + this.endColorVar.g*randomMinus1To1(), 0, 255),
		b: Clampf(this.endColor.b + this.endColorVar.b*randomMinus1To1(), 0, 255),
		a: Clampf(this.endColor.a + this.endColorVar.a*randomMinus1To1(), 0, 255)
	};
	particle.color = startColor;	
	particle.deltaColor = {
		r: (endColor.r - startColor.r)/particle.timeToLive,
		g: (endColor.g - startColor.g)/particle.timeToLive,
		b: (endColor.b - startColor.b)/particle.timeToLive,
		a: (endColor.a - startColor.a)/particle.timeToLive
	};

	//size
	var startSize = this.startSize + this.startSizeVar * randomMinus1To1();
	var endSize = this.endSize + this.endSizeVar * randomMinus1To1();
	particle.size = Math.max(0, startSize);
	particle.deltaSize = (endSize - startSize) / particle.timeToLive;

	//rotation
	var startA = this.startSpin + this.startSpinVar * randomMinus1To1();
	var end = this.endSpin + this.endSpinVar * randomMinus1To1();
	particle.rotation = startA;
	particle.deltaRotation = (end - startA) / particle.timeToLive;

	//position
	if(this.positionType === ParticleEmitter.POS_TYPE_FREE) {
		particle.startPos = this.convertToWorldSpace(this.tmpZeroPoint);	
	}
	else if(this.positionType === ParticleEmitter.POS_TYPE_RELATIVE) {
		particle.startPos.x = this.srcPos.x;
		particle.startPos.y = this.srcPos.y;
	}

	//direction
	var randians = angleToRadians(this.angle + this.angleVar*randomMinus1To1());

	this.mode.randomFeatures(randians, particle);
}

ParticleEmitter.prototype.isFull = function() {
	return this.particleCounter >= this.maxParticles;
}

ParticleEmitter.prototype.addParticle = function() {
	if(!this.isFull()) {
		var particle = null;

		if(this.particleCounter < this.particles.length) {
			particle = this.particles[this.particleCounter];
		}
		else {
			particle = new Particle();
			this.particles.push(particle);
		}
		this.initParticle(particle);
		++this.particleCounter;	
	}
}

ParticleEmitter.prototype.updateParticles = function(dt) {
	var currentPosition = Particle.TemporaryPoints[0];
	
	if(this.positionType === ParticleEmitter.POS_TYPE_FREE) {
		pIn(currentPosition, this.convertToWorldSpace(this.tmpZeroPoint));
	}
	else if(this.positionType === ParticleEmitter.TYPE_RELATIVE) {
		currentPosition.x = this.srcPos.x;
		currentPosition.y = this.srcPos.y;
	}

	var	particle = null,
		particleIndex = 0,
		particles = this.particles,
		tpa = Particle.TemporaryPoints[1],
		tpb = Particle.TemporaryPoints[2],
		tpc = Particle.TemporaryPoints[3];

	while(particleIndex < this.particleCounter) {
		pZeroIn(tpa);
		pZeroIn(tpb);
		pZeroIn(tpc);

		particle = particles[particleIndex];
		particle.timeToLive -= dt;

		if(particle.timeToLive > 0) {
			if(this.emitMode === ParticleEmitter.MODE_GRAVITY) {
				var tmp = tpc, radial = tpa, tangential = tpb;		

				//radial acceleration
				if(particle.pos.x || particle.pos.y) {
					pIn(radial, particle.pos);
					//计算加速度
					pNormalizeIn(radial);
				}
				else {
					pZeroIn(radial);
				}
				pIn(tangential, radial);
				pMultIn(radial, particle.modeA.radialAccel);

				//tangential acceleration
				var newy = tangential.x;
				tangential.x = -tangential.y;
				tangential.y = newy;

				pMultIn(tangential, particle.modeA.tangentialAccel);

				pIn(tmp, radial);
				pAddIn(tmp, tangential);
				pAddIn(tmp, this.mode.gravity);
				pMultIn(tmp, dt);
				pAddIn(particle.modeA.dir, tmp);

				pIn(tmp, particle.modeA.dir);
				pMultIn(tmp, dt);
				pAddIn(particle.pos, tmp);
			}
			else {
				var modeB = particle.modeB;
				modeB.angle += modeB.anglePerSecond * dt;
				modeB.radius += modeB.deltaRadius * dt;

				particle.pos.x = -Math.cos(modeB.angle) * modeB.radius;
				particle.pos.y = -Math.sin(modeB.angle) * modeB.radius;
			}
			//color
			particle.color.r += particle.deltaColor.r * dt;
			particle.color.g += particle.deltaColor.g * dt;
			particle.color.b += particle.deltaColor.b * dt;
			particle.color.a += particle.deltaColor.a * dt;
			particle.isChangeColor = false;
			//size
			particle.size += (particle.deltaSize * dt);
			particle.size = Math.max(0, particle.size);
			//rotation
			particle.rotation += (particle.deltaRotation * dt);
			//position
			var newPos = tpa;
			if(this.positionType === ParticleEmitter.POS_TYPE_FREE
				|| this.positionType === ParticleEmitter.POS_TYPE_RELATIVE) {
				var diff = tpb;

				pIn(diff, currentPosition);
				pSubIn(diff, particle.startPos);

				pIn(newPos, particle.pos);
				pSubIn(newPos, diff);
			}
			else {
				pIn(newPos, particle.pos);	
			}

			pIn(particle.drawPos, newPos);
			++particleIndex;
		}
		else {
			//life < 0
			if(particleIndex !== this.particleCounter - 1) {
				var deadParticle = 	
				particles[particleIndex] = particles[this.particleCounter - 1];
				particles[this.particleCounter - 1] = particle;
			}
			--this.particleCounter;
		}
	}

	return;
}

ParticleEmitter.prototype.update = function(dt) {
	var emitLimit = 1.0/this.emitRate;

	dt*=this.timeScale;

	if(this.active) {
		if(this.particleCounter < this.maxParticles) {
			this.timeCounter += dt;	
		}

		while(this.particleCounter < this.maxParticles 
			&& this.timeCounter > emitLimit) {
			this.addParticle();
			this.timeCounter -= emitLimit;
		}
		this.elapsed += dt;
		if(this.duration !== -1 && this.duration <= this.elapsed) {
			this.stop();
		}
	}

	this.updateParticles(dt);
}

ParticleEmitter.prototype.setTransform = function(context, t) {
	//why
	context.transform(t.a, -t.b, -t.c, t.d, t.tx * this.scaleX, -(t.ty * this.scaleY));
}

ParticleEmitter.prototype.isBlendAdditive = function() {
	//why
	return ((this.srcBlendFunc === SRC_ALPHA && this.dstBlendFunc === ONE)
		|| (this.srcBlendFunc === ONE && this.dstBlendFunc === ONE));
}

ParticleEmitter.prototype.changeTextureColor = function(texture, color, rect) {
    if(!this.tintCache) {
	    this.tintCache = document.createElement("canvas");
    }
	var canvas = this.tintCache;
	var context = canvas.getContext("2d");

	canvas.width = texture.width;
	canvas.height = texture.height;
	context.globalCompositeOperation = "source-over";
	context.fillStyle = "rgb(" + (color.r|0) + "," + (color.g|0) + "," + (color.b|0) + ")";
	context.fillRect(0, 0, rect.w, rect.h);
	context.globalCompositeOperation = "multiply";
	context.drawImage(texture, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h);
	context.globalCompositeOperation = "destination-atop";
	context.drawImage(texture, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h);

	return canvas;
}

ParticleEmitter.prototype.draw = function(context) {
	var texture = this.texture,
		particles = this.particles,
		textureRect = this.textureRect,
		particleCounter = this.particleCounter;

	context.save();	
	this.setTransform(context, this.worldTransform);
	if(this.isBlendAdditive()) {
		context.globalCompositeOperation = 'lighter';
	}
	else {
		context.globalCompositeOperation = 'source-over';
	}

	//assert texture mode
	var particle, lpx, alpha, size, 
		w = textureRect.w, h = textureRect.h;
	for (var i = 0; i < particleCounter; i++) {
		particle = particles[i];
		lpx = (0 | (particle.size * 0.5));
		alpha = particle.color.a / 255;
		if(alpha === 0) continue;

		context.globalAlpha = alpha;
		context.save();
		context.translate((0 | particle.drawPos.x), -(0 | particle.drawPos.y));

		size = Math.floor(particle.size / 4) * 4;
		context.scale(Math.max((1 / w) * size, 0.000001), Math.max((1 / h) * size, 0.000001));

		if(particle.rotation) {
			context.rotate(angleToRadians(particle.rotation));
		}

		var dstTexture = particle.isChangeColor ? 
			this.changeTextureColor(texture, particle.color, textureRect) : texture;

		context.drawImage(dstTexture, -(0 | (w / 2)), -(0 | (h / 2)));
		context.restore();
	}
	context.restore();
}

window.ParticleEmitter = ParticleEmitter;

}();
