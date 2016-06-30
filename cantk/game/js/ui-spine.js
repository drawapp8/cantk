/*
 * File:   ui-spine.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Spine Skeleton Animation.
 *
 * Copyright (c) 2015 - 2016  Holaverse Inc.
 *
 */

/**
 * @class UISpine
 * @extends UISkeletonAnimation
 * Spine骨骼动画。参考：[Spine](https://github.com/EsotericSoftware/spine-runtimes)
 */
function UISpine() {
}

UISpine.prototype = new UISkeletonAnimation();
UISpine.prototype.initUISpine = UISkeletonAnimation.prototype.initUISkeletonAnimation;

UISpine.prototype.onComplete = function(index, count) {
    if(count >= this.repeatTimes) {
        if(this.onDone) {
            this.onDone();
        }
    }
    else if(this.onOneCycle) {
        this.onOneCycle();
    }

    if(this.repeatTimes > 1 && count >= this.repeatTimes) {
        var track = this.spineInstance.state.tracks[index];
        track.animation.apply(this.spineInstance.skeleton, track.lastTime, track.endTime, false, track.events);
        this.spineInstance.state.clearTrack(index);
    }
};

UISpine.prototype.doPlay = UISpine.prototype.gotoAndPlay = function(animationName, repeatTimes, onDone, onOneCycle, useFadeIn, duration) {
	var me = this;
	this.animationName = animationName;

	if(this.spineInstance) {
        this.onDone = onDone;
        this.onOneCycle = onOneCycle;
	    this.repeatTimes = repeatTimes ? repeatTimes : Math.MAX_VALUE;
	    this.spineInstance.state.setAnimationByName(0, animationName, this.repeatTimes != 1);
        this.spineInstance.state.onComplete = this.onComplete.bind(this);
	}

	return this;
}

UISpine.prototype.pause = function() {
	if(this.spineInstance) {
	    this.spineInstance.state.timeScale = 0;
	}

	return this;
}

UISpine.prototype.resume = function() {
    if(this.spineInstance) {
        this.spineInstance.state.timeScale = 1;
    }
	return this;
}

UISpine.prototype.createArmature = function(texture, textureData, skeletonJSON, onDone) {
    if(this.spineInstance) {
        this.spineInstance = null;
    }

    var spineAtlas = new spine.SpineRuntime.Atlas(textureData, function(line, callback) {
        callback(spine.BaseTexture.fromImageObj(texture));
    });

    var attachmentParser = new spine.SpineRuntime.AtlasAttachmentParser(spineAtlas);
    var spineJsonParser = new spine.SpineRuntime.SkeletonJsonParser(attachmentParser);
    var skeletonData = spineJsonParser.readSkeletonData(skeletonJSON);
    this.spineInstance = new spine.Spine(skeletonData);
    this.animationNames = [];
    this.spineInstance.spineData.animations.forEach(function(it) {
        this.animationNames.push(it.name);
    }, this);
    this.skinNames = [];
    this.spineInstance.spineData.skins.forEach(function(it) {
        this.skinNames.push(it.name);
    }, this);
    this.animationName = this.animationName && this.animationNames.indexOf(this.animationName) > -1 ?
	    this.animationName : this.animationNames[0];

    this.skinName = this.skinName && this.skinNames.indexOf(this.skinName) >= 0 ?
        this.skinName : this.skinNames[0];

    if(!spine.renderer) {
        spine.renderer = new spine.CanvasRenderer();
    }

    return;
}

UISpine.prototype.update = function(canvas) {
	var dt = (canvas.timeStep * this.animTimeScale);
	this.spineInstance.update(dt/1000);
}

UISpine.prototype.destroyArmature = function() {
	if(this.spineInstance) {
		this.spineInstance = null;
        this.animationNames = null;
		this.animationName = void 0;
		this.skinName = void 0;
	}
}

UISpine.prototype.paintSelfOnly = function(canvas) {
	if(!this.spineInstance) {
		return;
	}

	var ay = this.h;
	var ax = this.w >> 1;

	canvas.translate(ax, ay);
	canvas.scale(this.animationScaleX, this.animationScaleY);

	if(!this.isPaused()) {
		this.update(canvas);
	}
    spine.renderer.setContext(canvas);
	spine.renderer.render(this.spineInstance);

	if(isNaN(canvas.needRedraw)) {
		canvas.needRedraw = 1;
	}
	canvas.needRedraw++;

	return;
}

UISpine.prototype.setSkin = function(skinName) {
	if(this.spineInstance) {
	    this.skinName = skinName;
        this.spineInstance.skeleton.setSkin(null);
	    this.spineInstance.skeleton.setSkinByName(skinName);
	}

	return this;
}

UISpine.prototype.getBound = function() {
    if(!this.spineInstance) {
        return {x: this.left, y: this.top, width: this.w, height: this.h};
    }

    var boundBox = this.spineInstance.skeleton.findSlot('BoundingBox');
    if(boundBox) {
        var vertices = boundBox.attachment.vertices;
        return {x: vertices[0], y: vertices[1],
            width: vertices[4] - vertices[0], height: vertices[5] - vertices[1]};
    }
    else {
        var bound = this.spineInstance.getBounds();
        return {x: this.x + this.w/2 + bound.x,
                y: this.y + this.h + bound.y,
                width: bound.width,
                height: bound.height
        };
    }
};

UISpine.prototype.getCurrentSkinKey = function() {
	if(this.spineInstance) {
        return this.skinName;
	}
};

UISpine.prototype.getCurrentAnimKey = function() {
	if(this.spineInstance) {
        return this.animationName;
	}
};

UISpine.prototype.getSkins = function() {
	if(this.spineInstance) {
        return this.skinNames;
	}

	return ["default"];
}

UISpine.prototype.getDuration = UISpine.prototype.getAnimationDuration = function(animaName) {
	if(!this.spineInstance) return 0;
	return this.spineInstance.state.tracks[0].animation.endTime;
}

UISpine.prototype.replaceSlotImage = function(name, image, imageRect) {
    if(!this.spineInstance || !image) {
        return;
    }

    var num = this.spineInstance.skeleton.findSlotIndex(name);
    if(num < 0) {
        return;
    }
    var slot = this.spineInstance.skeleton.slots[num];
    var baseTexture = spine.BaseTexture.fromImageObj(image);
    if(slot.currentSprite) {
        slot.currentSprite.texture.baseTexture = baseTexture;
    }

    return this;
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
