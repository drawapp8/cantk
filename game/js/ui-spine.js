/*
 * File:   ui-spine.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Spine Skeleton Animation. 
 * 
 * Copyright (c) 2015 - 2015  Holaverse Inc.
 * 
 */

function UISpine() {
}

UISpine.prototype = new UISkeletonAnimation();
UISpine.prototype.initUISpine = UISkeletonAnimation.prototype.initUISkeletonAnimation;

UISpine.prototype.play = UISpine.prototype.gotoAndPlay = function(animationName, repeatTimes, onDone, onOneCycle, useFadeIn) {
	var me = this;
	this.animationName = animationName;

	if(this.spineState) {
		var track = this.spineState.setAnimationByName(0, animationName, true, 0);

		track.repeatTimes = repeatTimes ? repeatTimes : 0xffffffff;
		track.onComplete = function(i, count) {
			this.repeatTimes--;
			if(this.repeatTimes <= 0) {
				this.loop = false;
				if(onOneCycle) {
					onOneCycle.call(me);
				}
				if(onDone) {
					onDone.call(me);
				}
			}
			else {
				if(onOneCycle) {
					onOneCycle.call(me);
				}
			}
		}
	}

	return this;
}

UISpine.prototype.pause = function() {
	if(this.spineState) {
		this.spineState.timeScale = 0; 
	}

	return this;
}

UISpine.prototype.resume = function() {
	if(this.spineState) {
		this.spineState.timeScale = 1; 
	}
	return this;
}

UISpine.prototype.createSkeletonJsonFronAtlas = function(texture, textureData) {
	var rootPath = this.textureJsonURL +'#';
	var textureLoader = {};
	
	textureLoader.load = function(page, line, atlas) {
		page.rendererObject = texture;
	}
	
	textureLoader.unload = function(rendererObject) {
	}

	var atlas = new spine.Atlas(textureData, textureLoader);
	var attachmentLoader = new spine.AtlasAttachmentLoader(atlas);
	var json = new spine.SkeletonJson(attachmentLoader);

	return json;
}

UISpine.prototype.createSkeletonJsonFronJson = function(texture, textureData) {
	var rootPath = this.textureJsonURL +'#';

	var json = new spine.SkeletonJson({
		newRegionAttachment: function (skin, name, path) {
			var src = rootPath + path + ".png";
			var attachment = new spine.RegionAttachment(name);

			attachment.rendererObject = WImage.create(src);

			return attachment;
		},
		newMeshAttachment: function (skin, name, path) {
			var src = rootPath + path + ".png";
			var attachment = new spine.MeshAttachment(name);
			attachment.rendererObject = WImage.create(src);

			return attachment;
		},
		newSkinnedMeshAttachment: function (skin, name, path) {
			var src = rootPath + path + ".png";
			var attachment = new spine.SkinnedMeshAttachment(name);
			attachment.rendererObject = WImage.create(src);

			return attachment;
		},
		newBoundingBoxAttachment: function (skin, name) {
			return new spine.BoundingBoxAttachment(name);
		}
	});

	return json;
}

UISpine.prototype.createSkeletonJson = function(texture, textureData) {
	if(this.textureJsonURL.indexOf(".atlas") > 0) {
		return this.createSkeletonJsonFronAtlas(texture, textureData);
	}
	else {
		return this.createSkeletonJsonFronJson(texture, textureData);
	}
}

UISpine.prototype.createArmature = function(texture, textureData, skeletonJSON, onDone) {
	var json = this.createSkeletonJson(texture, textureData);

	json.scale = 1;
	this.skeletonData = json.readSkeletonData(skeletonJSON);
	spine.Bone.yDown = true;
	
	this.skeleton = new spine.Skeleton(this.skeletonData);
	var stateData = new spine.AnimationStateData(this.skeletonData);
	var spineState = new spine.AnimationState(stateData);

	this.animationNames = [];
	var animations = this.skeletonData.animations;
	for(var i = 0; i < animations.length; i++) {
		this.animationNames.push(animations[i].name);
	}

	if(!this.animationName || this.animationNames.indexOf(this.animationName) < 0) {
		this.animationName = this.animationNames[0];
	}

	spineState.setAnimationByName(0, this.animationName, true, 0);

	this.spineState = spineState;

	this.callOnLoadDoneHandler();

	return;
}
	
UISpine.prototype.update = function(canvas) {
	var now = canvas.now ? canvas.now : Date.now();
	var delta = (now - this.lastTime) / 1000;
	this.lastTime = now;

	this.spineState.update(delta * UIElement.timeScale);
	this.spineState.apply(this.skeleton);
	this.skeleton.updateWorldTransform();
}

UISpine.prototype.paintSelfOnly = function(canvas) {
	if(!this.skeleton) {
		return;
	}

	var ay = this.h;
	var ax = this.w >> 1;
	var scale = this.animationScale;
	var skeleton = this.skeleton, drawOrder = skeleton.drawOrder;

	this.update(canvas);

	canvas.translate(ax, ay);
	canvas.scale(scale, scale);
	
	for (var i = 0, n = drawOrder.length; i < n; i++) {
		var slot = drawOrder[i];
		var attachment = slot.attachment;
		if (!(attachment instanceof spine.RegionAttachment)) continue;

		var rendererObject = attachment.rendererObject;
		if(rendererObject.page) {
			var srcRect = {x:rendererObject.x, y:rendererObject.y, w:rendererObject.width, 
				h:rendererObject.height, rotate:rendererObject.rotate};
			var image = rendererObject.page.rendererObject;
		}
		else {
			var wImage = rendererObject;
			if(!WImage.isValid(wImage)) {
				continue;
			}

			var srcRect = wImage.getImageRect();
			var image = wImage.getImage();
		}

		var bone = slot.bone;
		var x = bone.worldX + attachment.x * bone.m00 + attachment.y * bone.m01;
		var y = bone.worldY + attachment.x * bone.m10 + attachment.y * bone.m11;
		var rotation = -(bone.worldRotation + attachment.rotation) * Math.PI / 180;
		var w = attachment.width * bone.worldScaleX, h = attachment.height * bone.worldScaleY;
		
		var hw = w >> 1;
		var hh = h >> 1;
		if(srcRect.rotate) {
			rotation += Math.PI * 0.5;
		}
		canvas.translate(x, y);
		canvas.rotate(rotation);
		if(srcRect.rotate) {
			canvas.drawImage(image, srcRect.x, srcRect.y, srcRect.h, srcRect.w, -hh, -hw, h, w);
		}
		else {
			canvas.drawImage(image, srcRect.x, srcRect.y, srcRect.w, srcRect.h, -hw, -hh, w, h);
		}
		canvas.rotate(-rotation);
		canvas.translate(-x, -y);
	}
	canvas.needRedraw++;

	return;
}

function UISpineCreator() {
	var args = ["ui-spine", "ui-spine", null, true];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISpine();
		return g.initUISpine(this.type, 200, 200);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UISpineCreator());

