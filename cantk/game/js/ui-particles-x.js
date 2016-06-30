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
