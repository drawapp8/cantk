var ParticlesCocos2d = (function() {
	var cc = {};
	cc.Node = {};

	cc.ZERO = 0;
	cc.ONE  = 1;
	cc.BLEND_DST = 0x0303;
	cc.SRC_ALPHA = 0x0302;
	cc.ONE_MINUS_SRC_ALPHA = 0x0303;
	cc.ONE_MINUS_SRC_COLOR = 0x301;

	function ParticleSystem() {
    	this._parent = null;
		this._scaleX = 1.0;
		this._scaleY = 1.0;
		this._position = null;
    	this._visible = true;
	}

	ParticleSystem.SHAPE_MODE = 0;
	ParticleSystem.TEXTURE_MODE = 1;
	ParticleSystem.STAR_SHAPE = 0;
	ParticleSystem.BALL_SHAPE = 1;
	ParticleSystem.DURATION_INFINITY = -1;
	ParticleSystem.START_SIZE_EQUAL_TO_END_SIZE = -1;
	ParticleSystem.START_RADIUS_EQUAL_TO_END_RADIUS = -1;
	ParticleSystem.MODE_GRAVITY = 0;
	ParticleSystem.MODE_RADIUS = 1;
	ParticleSystem.TYPE_FREE = 0;
	ParticleSystem.TYPE_RELATIVE = 1;
	ParticleSystem.TYPE_GROUPED = 2;

	ParticleSystem.ModeA = function (gravity, speed, speedVar, tangentialAccel, tangentialAccelVar, radialAccel, radialAccelVar, rotationIsDir) {
		/** Gravity value. Only available in 'Gravity' mode. */
		this.gravity = gravity ? gravity : cc.p(0,0);
		/** speed of each particle. Only available in 'Gravity' mode.  */
		this.speed = speed || 0;
		/** speed variance of each particle. Only available in 'Gravity' mode. */
		this.speedVar = speedVar || 0;
		/** tangential acceleration of each particle. Only available in 'Gravity' mode. */
		this.tangentialAccel = tangentialAccel || 0;
		/** tangential acceleration variance of each particle. Only available in 'Gravity' mode. */
		this.tangentialAccelVar = tangentialAccelVar || 0;
		/** radial acceleration of each particle. Only available in 'Gravity' mode. */
		this.radialAccel = radialAccel || 0;
		/** radial acceleration variance of each particle. Only available in 'Gravity' mode. */
		this.radialAccelVar = radialAccelVar || 0;
		/** set the rotation of each particle to its direction Only available in 'Gravity' mode. */
		this.rotationIsDir = rotationIsDir || false;
	};

	ParticleSystem.ModeB = function (startRadius, startRadiusVar, endRadius, endRadiusVar, rotatePerSecond, rotatePerSecondVar) {
		/** The starting radius of the particles. Only available in 'Radius' mode. */
		this.startRadius = startRadius || 0;
		/** The starting radius variance of the particles. Only available in 'Radius' mode. */
		this.startRadiusVar = startRadiusVar || 0;
		/** The ending radius of the particles. Only available in 'Radius' mode. */
		this.endRadius = endRadius || 0;
		/** The ending radius variance of the particles. Only available in 'Radius' mode. */
		this.endRadiusVar = endRadiusVar || 0;
		/** Number of degress to rotate a particle around the source pos per second. Only available in 'Radius' mode. */
		this.rotatePerSecond = rotatePerSecond || 0;
		/** Variance in degrees for rotatePerSecond. Only available in 'Radius' mode. */
		this.rotatePerSecondVar = rotatePerSecondVar || 0;
	};

	ParticleSystem.prototype.initWithOptions = function(options, texture) {
		this.emitterMode = ParticleSystem.MODE_GRAVITY;
		this.modeA = new ParticleSystem.ModeA();
		this.modeB = new ParticleSystem.ModeB();
		this._blendFunc = {src: cc.BLEND_SRC, dst: cc.BLEND_DST};

		this._particles = [];
		this._position = cc.p(0, 0);
		this._sourcePosition = cc.p(0, 0);

		this._posVar = cc.p(0, 0);

		this._startColor = cc.color(255, 255, 255, 255);
		this._startColorVar = cc.color(255, 255, 255, 255);
		this._endColor = cc.color(255, 255, 255, 255);
		this._endColorVar = cc.color(255, 255, 255, 255);

		this._plistFile = "";
		this._elapsed = 0;
		this._dontTint = false;
		this._pointZeroForParticle = cc.p(0, 0);
		this._emitCounter = 0;
		this._particleIdx = 0;
		this._batchNode = null;
		this.atlasIndex = 0;

		this._transformSystemDirty = false;
		this._allocatedParticles = 0;
		this._isActive = false;
		this.particleCount = 0;
		this.duration = 0;
		this.life = 0;
		this.lifeVar = 0;
		this.angle = 0;
		this.angleVar = 0;
		this.startSize = 0;
		this.startSizeVar = 0;
		this.endSize = 0;
		this.endSizeVar = 0;

		this.startSpin = 0;
		this.startSpinVar = 0;
		this.endSpin = 0;
		this.endSpinVar = 0;
		this.emissionRate = 0;
		this._totalParticles = 0;
		this._texture = null;//texture;
		this._opacityModifyRGB = false;
		this.positionType = ParticleSystem.TYPE_FREE;
		this.autoRemoveOnFinish = false;

		this._textureLoaded = true;
		this._renderCmd = this.createRanderCmd();

		this.initWithDictionary(options, "", texture);
	};

	ParticleSystem.prototype.createRanderCmd = function() {
		return new cc.ParticleSystem.CanvasRenderCmd(this);	
	};

	ParticleSystem.prototype._valueForKey = function(key, dict) {
		if (dict) {
            var pString = dict[key];
            return pString != null ? pString : "";
        }

        return "";
	};

    ParticleSystem.prototype.initWithTotalParticles = function (numberOfParticles) {
        this._totalParticles = numberOfParticles;

        var i, locParticles = this._particles;
        locParticles.length = 0;
        for(i = 0; i< numberOfParticles; i++){
            locParticles[i] = new cc.Particle();
        }

        if (!locParticles) {
            cc.log("Particle system: not enough memory");
            return false;
        }
        this._allocatedParticles = numberOfParticles;

        if (this._batchNode)
            for (i = 0; i < this._totalParticles; i++)
                locParticles[i].atlasIndex = i;

        // default, active
        this._isActive = true;

        // default blend function
        this._blendFunc.src = cc.BLEND_SRC;
        this._blendFunc.dst = cc.BLEND_DST;

        // default movement type;
        this.positionType = cc.ParticleSystem.TYPE_FREE;

        // by default be in mode A:
        this.emitterMode = cc.ParticleSystem.MODE_GRAVITY;

        // default: modulate
        // XXX: not used
        //  colorModulate = YES;
        this.autoRemoveOnFinish = false;

        //for batchNode
        this._transformSystemDirty = false;

        // udpate after action in run!
        // FIXME just for webGL
        //this.scheduleUpdateWithPriority(1);
        this._renderCmd._initWithTotalParticles(numberOfParticles);
        return true;
    };

    ParticleSystem.prototype.setPosition = function (newPosOrxValue, yValue) {
        var locPosition = this._position;
        if (yValue === undefined) {
            if(locPosition.x === newPosOrxValue.x && locPosition.y === newPosOrxValue.y)
                return;
            locPosition.x = newPosOrxValue.x;
            locPosition.y = newPosOrxValue.y;
        } else {
            if(locPosition.x === newPosOrxValue && locPosition.y === yValue)
                return;
            locPosition.x = newPosOrxValue;
            locPosition.y = yValue;
        }
        this._usingNormalizedPosition = false;
        this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
    };

    ParticleSystem.prototype.getBatchNode = function () {
        return this._batchNode;
    };

    ParticleSystem.prototype.setBatchNode = function (batchNode) {
        this._renderCmd.setBatchNode(batchNode);
    };

	ParticleSystem.prototype.initTexCoordsWithRect = function (pointRect) {
        this._renderCmd.initTexCoordsWithRect(pointRect);
	};

	ParticleSystem.prototype._updateBlendFunc = function () {
        if(this._batchNode){
            cc.log("Can't change blending functions when the particle is being batched");
            return;
        }

        var locTexture = this._texture;
        //if (locTexture && locTexture instanceof cc.Texture2D) {
        if (true) {
            this._opacityModifyRGB = false;
            var locBlendFunc = this._blendFunc;
            if (locBlendFunc.src === cc.BLEND_SRC && locBlendFunc.dst === cc.BLEND_DST) {
            	//FIXME
                //if (locTexture.hasPremultipliedAlpha()) {
                if (false) {
                    this._opacityModifyRGB = true;
                } else {
                    locBlendFunc.src = cc.SRC_ALPHA;
                    locBlendFunc.dst = cc.ONE_MINUS_SRC_ALPHA;
                }
            }
        }
	};

	ParticleSystem.prototype.setTextureWithRect = function (texture, rect) {
        var locTexture = this._texture;
        if (locTexture !== texture) {
            this._texture = texture;
            this._updateBlendFunc();
        }
        this.initTexCoordsWithRect(rect);
    };

    
    ParticleSystem.prototype.setTexture = function(texture) {
		this.setTextureWithRect(texture, cc.rect(0, 0, texture.width, texture.height));
    };

	ParticleSystem.prototype.initWithDictionary = function(dictionary, dirname, texture) {
		var ret = false;
        var buffer = null;
        var image = null;
        var locValueForKey = this._valueForKey;

        var maxParticles = parseInt(locValueForKey("maxParticles", dictionary));
        // self, not super
        if (this.initWithTotalParticles(maxParticles)) {
            // angle
            this.angle = parseFloat(locValueForKey("angle", dictionary));
            this.angleVar = parseFloat(locValueForKey("angleVariance", dictionary));

            // duration
            this.duration = parseFloat(locValueForKey("duration", dictionary));

            // blend function
            this._blendFunc.src = parseInt(locValueForKey("blendFuncSource", dictionary));
            this._blendFunc.dst = parseInt(locValueForKey("blendFuncDestination", dictionary));

            // color
            var locStartColor = this._startColor;
            locStartColor.r = parseFloat(locValueForKey("startColorRed", dictionary)) * 255;
            locStartColor.g = parseFloat(locValueForKey("startColorGreen", dictionary)) * 255;
            locStartColor.b = parseFloat(locValueForKey("startColorBlue", dictionary)) * 255;
            locStartColor.a = parseFloat(locValueForKey("startColorAlpha", dictionary)) * 255;

            var locStartColorVar = this._startColorVar;
            locStartColorVar.r = parseFloat(locValueForKey("startColorVarianceRed", dictionary)) * 255;
            locStartColorVar.g = parseFloat(locValueForKey("startColorVarianceGreen", dictionary)) * 255;
            locStartColorVar.b = parseFloat(locValueForKey("startColorVarianceBlue", dictionary)) * 255;
            locStartColorVar.a = parseFloat(locValueForKey("startColorVarianceAlpha", dictionary)) * 255;

            var locEndColor = this._endColor;
            locEndColor.r = parseFloat(locValueForKey("finishColorRed", dictionary)) * 255;
            locEndColor.g = parseFloat(locValueForKey("finishColorGreen", dictionary)) * 255;
            locEndColor.b = parseFloat(locValueForKey("finishColorBlue", dictionary)) * 255;
            locEndColor.a = parseFloat(locValueForKey("finishColorAlpha", dictionary)) * 255;

            var locEndColorVar = this._endColorVar;
            locEndColorVar.r = parseFloat(locValueForKey("finishColorVarianceRed", dictionary)) * 255;
            locEndColorVar.g = parseFloat(locValueForKey("finishColorVarianceGreen", dictionary)) * 255;
            locEndColorVar.b = parseFloat(locValueForKey("finishColorVarianceBlue", dictionary)) * 255;
            locEndColorVar.a = parseFloat(locValueForKey("finishColorVarianceAlpha", dictionary)) * 255;

            // particle size
            this.startSize = parseFloat(locValueForKey("startParticleSize", dictionary));
            this.startSizeVar = parseFloat(locValueForKey("startParticleSizeVariance", dictionary));
            this.endSize = parseFloat(locValueForKey("finishParticleSize", dictionary));
            this.endSizeVar = parseFloat(locValueForKey("finishParticleSizeVariance", dictionary));

            // position
            this.setPosition(parseFloat(locValueForKey("sourcePositionx", dictionary)),
                              parseFloat(locValueForKey("sourcePositiony", dictionary)));
            this._posVar.x = parseFloat(locValueForKey("sourcePositionVariancex", dictionary));
            this._posVar.y = parseFloat(locValueForKey("sourcePositionVariancey", dictionary));

            // Spinning
            this.startSpin = parseFloat(locValueForKey("rotationStart", dictionary));
            this.startSpinVar = parseFloat(locValueForKey("rotationStartVariance", dictionary));
            this.endSpin = parseFloat(locValueForKey("rotationEnd", dictionary));
            this.endSpinVar = parseFloat(locValueForKey("rotationEndVariance", dictionary));

            this.emitterMode = parseInt(locValueForKey("emitterType", dictionary));

            // Mode A: Gravity + tangential accel + radial accel
            if (this.emitterMode === cc.ParticleSystem.MODE_GRAVITY) {
                var locModeA = this.modeA;
                // gravity
                locModeA.gravity.x = parseFloat(locValueForKey("gravityx", dictionary));
                locModeA.gravity.y = parseFloat(locValueForKey("gravityy", dictionary));

                // speed
                locModeA.speed = parseFloat(locValueForKey("speed", dictionary));
                locModeA.speedVar = parseFloat(locValueForKey("speedVariance", dictionary));

                // radial acceleration
                var pszTmp = locValueForKey("radialAcceleration", dictionary);
                locModeA.radialAccel = (pszTmp) ? parseFloat(pszTmp) : 0;

                pszTmp = locValueForKey("radialAccelVariance", dictionary);
                locModeA.radialAccelVar = (pszTmp) ? parseFloat(pszTmp) : 0;

                // tangential acceleration
                pszTmp = locValueForKey("tangentialAcceleration", dictionary);
                locModeA.tangentialAccel = (pszTmp) ? parseFloat(pszTmp) : 0;

                pszTmp = locValueForKey("tangentialAccelVariance", dictionary);
                locModeA.tangentialAccelVar = (pszTmp) ? parseFloat(pszTmp) : 0;

                // rotation is dir
                var locRotationIsDir = locValueForKey("rotationIsDir", dictionary).toLowerCase();
                locModeA.rotationIsDir = (locRotationIsDir != null && (locRotationIsDir === "true" || locRotationIsDir === "1"));
            } else if (this.emitterMode === cc.ParticleSystem.MODE_RADIUS) {
                // or Mode B: radius movement
                var locModeB = this.modeB;
                locModeB.startRadius = parseFloat(locValueForKey("maxRadius", dictionary));
                locModeB.startRadiusVar = parseFloat(locValueForKey("maxRadiusVariance", dictionary));
                locModeB.endRadius = parseFloat(locValueForKey("minRadius", dictionary));
                locModeB.endRadiusVar = 0;
                locModeB.rotatePerSecond = parseFloat(locValueForKey("rotatePerSecond", dictionary));
                locModeB.rotatePerSecondVar = parseFloat(locValueForKey("rotatePerSecondVariance", dictionary));
            } else {
                cc.log("cc.ParticleSystem.initWithDictionary(): Invalid emitterType in config file");
                return false;
            }

            // life span
            this.life = parseFloat(locValueForKey("particleLifespan", dictionary));
            this.lifeVar = parseFloat(locValueForKey("particleLifespanVariance", dictionary));

            // emission Rate
            this.emissionRate = this._totalParticles / this.life;

            //don't get the internal texture if a batchNode is used
            if (!this._batchNode) {
                // Set a compatible default for the alpha transfer
                this._opacityModifyRGB = false;
				this.setTexture(texture);
            }
            ret = true;
        }
        return ret;
		
	};

    ParticleSystem.prototype.isFull = function () {
        return (this.particleCount >= this._totalParticles);
    };

	ParticleSystem.prototype.addParticle = function() {
	    if (this.isFull())
            return false;

        var particle = this._renderCmd.addParticle();
        this.initParticle(particle);
        ++this.particleCount;
        return true;
	};

	ParticleSystem.prototype.stopSystem = function () {
		if(typeof this._backDuration !== 'undefined') {
			this.duration = this._backDuration;
		}
        this._isActive = false;
        this._elapsed = this.duration;
        this._emitCounter = 0;
    };

	ParticleSystem.prototype.resetSystem = function () {
        this._isActive = true;
        this._elapsed = 0;
        var locParticles = this._particles;
    	if(typeof this._backDuration !== 'undefined') {
    		this.duration = this._backDuration;
    	}
        for (this._particleIdx = 0; this._particleIdx < this.particleCount; ++this._particleIdx)
            locParticles[this._particleIdx].timeToLive = 0 ;
    };

	ParticleSystem.prototype.getNodeToParentTransform = function(ancestor){
        var t = this._renderCmd.getNodeToParentTransform();
        if(ancestor){
            var T = {a: t.a, b: t.b, c: t.c, d: t.d, tx: t.tx, ty: t.ty};
            for(var p = this._parent;  p != null && p != ancestor ; p = p.getParent()){
                cc.affineTransformConcatIn(T, p.getNodeToParentTransform());
            }
            return T;
        }else{
            return t;
        }
    };

	ParticleSystem.prototype.getNodeToWorldTransform = function () {
        //TODO renderCmd has a WorldTransform
        var t = this.getNodeToParentTransform();
        for (var p = this._parent; p !== null; p = p.parent)
            t = cc.affineTransformConcat(t, p.getNodeToParentTransform());
        return t;
    };

	ParticleSystem.prototype.convertToWorldSpace = function (nodePoint) {
        nodePoint = nodePoint || cc.p(0,0);
        return cc.pointApplyAffineTransform(nodePoint, this.getNodeToWorldTransform());
    };

    ParticleSystem.prototype.emit = function(once) {
    	this.resetSystem();
    	if(once) {
    		if(typeof this._backDuration !== 'undefined') {
    			this.duration = this._backDuration;
    		}
    		if(this.duration === -1) {
    			this.duration = 1;
    		}
    	}
    	else {
			if(typeof this._backDuration === 'undefined') {
				this._backDuration = this.duration;
			}
			this.duration = -1;
    	}
    };

	ParticleSystem.prototype.update = function(dt) {
        if (this._isActive && this.emissionRate) {
            var rate = 1.0 / this.emissionRate;
            //issue #1201, prevent bursts of particles, due to too high emitCounter
            if (this.particleCount < this._totalParticles)
                this._emitCounter += dt;

            while ((this.particleCount < this._totalParticles) && (this._emitCounter > rate)) {
                this.addParticle();
                this._emitCounter -= rate;
            }

            this._elapsed += dt;
            if (this.duration !== -1 && this.duration < this._elapsed)
                this.stopSystem();
        }
        this._particleIdx = 0;

        var currentPosition = cc.Particle.TemporaryPoints[0];
        if (this.positionType === cc.ParticleSystem.TYPE_FREE) {
            cc.pIn(currentPosition, this.convertToWorldSpace(this._pointZeroForParticle));
        } else if (this.positionType === cc.ParticleSystem.TYPE_RELATIVE) {
            currentPosition.x = this._position.x;
            currentPosition.y = this._position.y;
        }

        if (this._visible) {
            // Used to reduce memory allocation / creation within the loop
            var tpa = cc.Particle.TemporaryPoints[1],
                tpb = cc.Particle.TemporaryPoints[2],
                tpc = cc.Particle.TemporaryPoints[3];

            var locParticles = this._particles;
            while (this._particleIdx < this.particleCount) {

                // Reset the working particles
                cc.pZeroIn(tpa);
                cc.pZeroIn(tpb);
                cc.pZeroIn(tpc);

                var selParticle = locParticles[this._particleIdx];

                // life
                selParticle.timeToLive -= dt;

                if (selParticle.timeToLive > 0) {
                    // Mode A: gravity, direction, tangential accel & radial accel
                    if (this.emitterMode === cc.ParticleSystem.MODE_GRAVITY) {

                        var tmp = tpc, radial = tpa, tangential = tpb;

                        // radial acceleration
                        if (selParticle.pos.x || selParticle.pos.y) {
                            cc.pIn(radial, selParticle.pos);
                            cc.pNormalizeIn(radial);
                        } else {
                            cc.pZeroIn(radial);
                        }

                        cc.pIn(tangential, radial);
                        cc.pMultIn(radial, selParticle.modeA.radialAccel);

                        // tangential acceleration
                        var newy = tangential.x;
                        tangential.x = -tangential.y;
                        tangential.y = newy;

                        cc.pMultIn(tangential, selParticle.modeA.tangentialAccel);

                        cc.pIn(tmp, radial);
                        cc.pAddIn(tmp, tangential);
                        cc.pAddIn(tmp, this.modeA.gravity);
                        cc.pMultIn(tmp, dt);
                        cc.pAddIn(selParticle.modeA.dir, tmp);


                        cc.pIn(tmp, selParticle.modeA.dir);
                        cc.pMultIn(tmp, dt);
                        cc.pAddIn(selParticle.pos, tmp);
                    } else {
                        // Mode B: radius movement
                        var selModeB = selParticle.modeB;
                        // Update the angle and radius of the particle.
                        selModeB.angle += selModeB.degreesPerSecond * dt;
                        selModeB.radius += selModeB.deltaRadius * dt;

                        selParticle.pos.x = -Math.cos(selModeB.angle) * selModeB.radius;
                        selParticle.pos.y = -Math.sin(selModeB.angle) * selModeB.radius;
                    }

                    // color
                    this._renderCmd._updateDeltaColor(selParticle, dt);

                    // size
                    selParticle.size += (selParticle.deltaSize * dt);
                    selParticle.size = Math.max(0, selParticle.size);

                    // angle
                    selParticle.rotation += (selParticle.deltaRotation * dt);

                    //
                    // update values in quad
                    //
                    var newPos = tpa;
                    if (this.positionType === cc.ParticleSystem.TYPE_FREE || this.positionType === cc.ParticleSystem.TYPE_RELATIVE) {
                        var diff = tpb;
                        cc.pIn(diff, currentPosition);
                        cc.pSubIn(diff, selParticle.startPos);

                        cc.pIn(newPos, selParticle.pos);
                        cc.pSubIn(newPos, diff);
                    } else {
                        cc.pIn(newPos, selParticle.pos);
                    }

                    // translate newPos to correct position, since matrix transform isn't performed in batchnode
                    // don't update the particle with the new position information, it will interfere with the radius and tangential calculations
                    if (this._batchNode) {
                        newPos.x += this._position.x;
                        newPos.y += this._position.y;
                    }
                    this._renderCmd.updateParticlePosition(selParticle, newPos);

                    // update particle counter
                    ++this._particleIdx;
                } else {
                    // life < 0
                    var currentIndex = selParticle.atlasIndex;
                    if(this._particleIdx !== this.particleCount -1){
                         var deadParticle = locParticles[this._particleIdx];
                        locParticles[this._particleIdx] = locParticles[this.particleCount -1];
                        locParticles[this.particleCount -1] = deadParticle;
                    }
                    if (this._batchNode) {
                        //disable the switched particle
                        this._batchNode.disableParticle(this.atlasIndex + currentIndex);
                        //switch indexes
                        locParticles[this.particleCount - 1].atlasIndex = currentIndex;
                    }

                    --this.particleCount;
                    if (this.particleCount === 0 && this.autoRemoveOnFinish) {
                        this.unscheduleUpdate();
                        this._parent.removeChild(this, true);
                        return;
                    }
                }
            }
            this._transformSystemDirty = false;
        }

        if (!this._batchNode)
            this.postStep();
	};

    ParticleSystem.prototype.initParticle = function (particle) {
        var locRandomMinus11 = cc.randomMinus1To1;
        // timeToLive
        // no negative life. prevent division by 0
        particle.timeToLive = this.life + this.lifeVar * locRandomMinus11();
        particle.timeToLive = Math.max(0, particle.timeToLive);

        // position
        particle.pos.x = this._sourcePosition.x + this._posVar.x * locRandomMinus11();
        particle.pos.y = this._sourcePosition.y + this._posVar.y * locRandomMinus11();

        // Color
        var start, end;
        var locStartColor = this._startColor, locStartColorVar = this._startColorVar;
        var locEndColor = this._endColor, locEndColorVar = this._endColorVar;
        start = {
            r: cc.clampf(locStartColor.r + locStartColorVar.r * locRandomMinus11(), 0, 255),
            g: cc.clampf(locStartColor.g + locStartColorVar.g * locRandomMinus11(), 0, 255),
            b: cc.clampf(locStartColor.b + locStartColorVar.b * locRandomMinus11(), 0, 255),
            a: cc.clampf(locStartColor.a + locStartColorVar.a * locRandomMinus11(), 0, 255)
        };
        end = {
            r: cc.clampf(locEndColor.r + locEndColorVar.r * locRandomMinus11(), 0, 255),
            g: cc.clampf(locEndColor.g + locEndColorVar.g * locRandomMinus11(), 0, 255),
            b: cc.clampf(locEndColor.b + locEndColorVar.b * locRandomMinus11(), 0, 255),
            a: cc.clampf(locEndColor.a + locEndColorVar.a * locRandomMinus11(), 0, 255)
        };

        particle.color = start;
        var locParticleDeltaColor = particle.deltaColor, locParticleTimeToLive = particle.timeToLive;
        locParticleDeltaColor.r = (end.r - start.r) / locParticleTimeToLive;
        locParticleDeltaColor.g = (end.g - start.g) / locParticleTimeToLive;
        locParticleDeltaColor.b = (end.b - start.b) / locParticleTimeToLive;
        locParticleDeltaColor.a = (end.a - start.a) / locParticleTimeToLive;

        // size
        var startS = this.startSize + this.startSizeVar * locRandomMinus11();
        startS = Math.max(0, startS); // No negative value

        particle.size = startS;
        if (this.endSize === cc.ParticleSystem.START_SIZE_EQUAL_TO_END_SIZE) {
            particle.deltaSize = 0;
        } else {
            var endS = this.endSize + this.endSizeVar * locRandomMinus11();
            endS = Math.max(0, endS); // No negative values
            particle.deltaSize = (endS - startS) / locParticleTimeToLive;
        }

        // rotation
        var startA = this.startSpin + this.startSpinVar * locRandomMinus11();
        var endA = this.endSpin + this.endSpinVar * locRandomMinus11();
        particle.rotation = startA;
        particle.deltaRotation = (endA - startA) / locParticleTimeToLive;

        // position
        if (this.positionType === cc.ParticleSystem.TYPE_FREE)
            particle.startPos = this.convertToWorldSpace(this._pointZeroForParticle);
        else if (this.positionType === cc.ParticleSystem.TYPE_RELATIVE){
            particle.startPos.x = this._position.x;
            particle.startPos.y = this._position.y;
        }

        // direction
        var a = cc.degreesToRadians(this.angle + this.angleVar * locRandomMinus11());

        // Mode Gravity: A
        if (this.emitterMode === cc.ParticleSystem.MODE_GRAVITY) {
            var locModeA = this.modeA, locParticleModeA = particle.modeA;
            var s = locModeA.speed + locModeA.speedVar * locRandomMinus11();

            // direction
            locParticleModeA.dir.x = Math.cos(a);
            locParticleModeA.dir.y = Math.sin(a);
            cc.pMultIn(locParticleModeA.dir, s);

            // radial accel
            locParticleModeA.radialAccel = locModeA.radialAccel + locModeA.radialAccelVar * locRandomMinus11();

            // tangential accel
            locParticleModeA.tangentialAccel = locModeA.tangentialAccel + locModeA.tangentialAccelVar * locRandomMinus11();

            // rotation is dir
            if(locModeA.rotationIsDir)
                particle.rotation = -cc.radiansToDegrees(cc.pToAngle(locParticleModeA.dir));
        } else {
            // Mode Radius: B
            var locModeB = this.modeB, locParitlceModeB = particle.modeB;

            // Set the default diameter of the particle from the source position
            var startRadius = locModeB.startRadius + locModeB.startRadiusVar * locRandomMinus11();
            var endRadius = locModeB.endRadius + locModeB.endRadiusVar * locRandomMinus11();

            locParitlceModeB.radius = startRadius;
            locParitlceModeB.deltaRadius = (locModeB.endRadius === cc.ParticleSystem.START_RADIUS_EQUAL_TO_END_RADIUS) ? 0 : (endRadius - startRadius) / locParticleTimeToLive;

            locParitlceModeB.angle = a;
            locParitlceModeB.degreesPerSecond = cc.degreesToRadians(locModeB.rotatePerSecond + locModeB.rotatePerSecondVar * locRandomMinus11());
        }
    };

	ParticleSystem.prototype.isBlendAdditive = function () {
        return (( this._blendFunc.src === cc.SRC_ALPHA && this._blendFunc.dst === cc.ONE) || (this._blendFunc.src === cc.ONE && this._blendFunc.dst === cc.ONE));
	};

	ParticleSystem.prototype.postStep = function() {
        this._renderCmd.postStep();
	};

	ParticleSystem.prototype.getParticles = function() {

	};
    
	ParticleSystem.prototype.draw = function(canvas, scaleX, scaleY) {
		this._renderCmd.rendering(cc.CanvasContextWrapper.getInstance(canvas), scaleX, scaleY);
	};

	ParticleSystem.prototype.getDrawMode = function () {
        return this._renderCmd.getDrawMode();
	};

    ParticleSystem.prototype.setDrawMode = function (drawMode) {
		this._renderCmd.setDrawMode(drawMode);
    };

	cc.defineGetterSetter = function (proto, prop, getter, setter, getterName, setterName) {
		if (proto.__defineGetter__) {
			getter && proto.__defineGetter__(prop, getter);
			setter && proto.__defineSetter__(prop, setter);
		} else if (Object.defineProperty) {
			var desc = { enumerable: false, configurable: true };
			getter && (desc.get = getter);
			setter && (desc.set = setter);
			Object.defineProperty(proto, prop, desc);
		} else {
			throw new Error("browser does not support getters");
		}

		if(!getterName && !setterName) {
			// Lookup getter/setter function
			var hasGetter = (getter != null), hasSetter = (setter != undefined), props = Object.getOwnPropertyNames(proto);
			for (var i = 0; i < props.length; i++) {
				var name = props[i];

				if( (proto.__lookupGetter__ ? proto.__lookupGetter__(name)
											: Object.getOwnPropertyDescriptor(proto, name))
					|| typeof proto[name] !== "function" )
					continue;

				var func = proto[name];
				if (hasGetter && func === getter) {
					getterName = name;
					if(!hasSetter || setterName) break;
				}
				if (hasSetter && func === setter) {
					setterName = name;
					if(!hasGetter || getterName) break;
				}
			}
		}

		// Found getter/setter
		var ctor = proto.constructor;
		if (getterName) {
			if (!ctor.__getters__) {
				ctor.__getters__ = {};
			}
			ctor.__getters__[getterName] = prop;
		}
		if (setterName) {
			if (!ctor.__setters__) {
				ctor.__setters__ = {};
			}
			ctor.__setters__[setterName] = prop;
		}
	};

	var _p = ParticleSystem.prototype;

	// Extended properties
	/** @expose */
	_p.opacityModifyRGB;
	cc.defineGetterSetter(_p, "opacityModifyRGB", _p.isOpacityModifyRGB, _p.setOpacityModifyRGB);
	/** @expose */
	_p.batchNode;
	cc.defineGetterSetter(_p, "batchNode", _p.getBatchNode, _p.setBatchNode);
	/** @expose */
	_p.drawMode;
	cc.defineGetterSetter(_p, "drawMode", _p.getDrawMode, _p.setDrawMode);
	/** @expose */
	_p.shapeType;
	cc.defineGetterSetter(_p, "shapeType", _p.getShapeType, _p.setShapeType);
	/** @expose */
	_p.active;
	cc.defineGetterSetter(_p, "active", _p.isActive);
	/** @expose */
	_p.sourcePos;
	cc.defineGetterSetter(_p, "sourcePos", _p.getSourcePosition, _p.setSourcePosition);
	/** @expose */
	_p.posVar;
	cc.defineGetterSetter(_p, "posVar", _p.getPosVar, _p.setPosVar);
	/** @expose */
	_p.gravity;
	cc.defineGetterSetter(_p, "gravity", _p.getGravity, _p.setGravity);
	/** @expose */
	_p.speed;
	cc.defineGetterSetter(_p, "speed", _p.getSpeed, _p.setSpeed);
	/** @expose */
	_p.speedVar;
	cc.defineGetterSetter(_p, "speedVar", _p.getSpeedVar, _p.setSpeedVar);
	/** @expose */
	_p.tangentialAccel;
	cc.defineGetterSetter(_p, "tangentialAccel", _p.getTangentialAccel, _p.setTangentialAccel);
	/** @expose */
	_p.tangentialAccelVar;
	cc.defineGetterSetter(_p, "tangentialAccelVar", _p.getTangentialAccelVar, _p.setTangentialAccelVar);
	/** @expose */
	_p.radialAccel;
	cc.defineGetterSetter(_p, "radialAccel", _p.getRadialAccel, _p.setRadialAccel);
	/** @expose */
	_p.radialAccelVar;
	cc.defineGetterSetter(_p, "radialAccelVar", _p.getRadialAccelVar, _p.setRadialAccelVar);
	/** @expose */
	_p.rotationIsDir;
	cc.defineGetterSetter(_p, "rotationIsDir", _p.getRotationIsDir, _p.setRotationIsDir);
	/** @expose */
	_p.startRadius;
	cc.defineGetterSetter(_p, "startRadius", _p.getStartRadius, _p.setStartRadius);
	/** @expose */
	_p.startRadiusVar;
	cc.defineGetterSetter(_p, "startRadiusVar", _p.getStartRadiusVar, _p.setStartRadiusVar);
	/** @expose */
	_p.endRadius;
	cc.defineGetterSetter(_p, "endRadius", _p.getEndRadius, _p.setEndRadius);
	/** @expose */
	_p.endRadiusVar;
	cc.defineGetterSetter(_p, "endRadiusVar", _p.getEndRadiusVar, _p.setEndRadiusVar);
	/** @expose */
	_p.rotatePerS;
	cc.defineGetterSetter(_p, "rotatePerS", _p.getRotatePerSecond, _p.setRotatePerSecond);
	/** @expose */
	_p.rotatePerSVar;
	cc.defineGetterSetter(_p, "rotatePerSVar", _p.getRotatePerSecondVar, _p.setRotatePerSecondVar);
	/** @expose */
	_p.startColor;
	cc.defineGetterSetter(_p, "startColor", _p.getStartColor, _p.setStartColor);
	/** @expose */
	_p.startColorVar;
	cc.defineGetterSetter(_p, "startColorVar", _p.getStartColorVar, _p.setStartColorVar);
	/** @expose */
	_p.endColor;
	cc.defineGetterSetter(_p, "endColor", _p.getEndColor, _p.setEndColor);
	/** @expose */
	_p.endColorVar;
	cc.defineGetterSetter(_p, "endColorVar", _p.getEndColorVar, _p.setEndColorVar);
	/** @expose */
	_p.totalParticles;
	cc.defineGetterSetter(_p, "totalParticles", _p.getTotalParticles, _p.setTotalParticles);
	/** @expose */
	_p.texture;
	cc.defineGetterSetter(_p, "texture", _p.getTexture, _p.setTexture);


////////////////////////////////////////////////////////////////////////////
//CanvasRenderCmd
	cc.Node._dirtyFlags = {transformDirty: 1 << 0, visibleDirty: 1 << 1, colorDirty: 1 << 2, opacityDirty: 1 << 3, cacheDirty: 1 << 4,
    orderDirty: 1 << 5, textDirty: 1 << 6, gradientDirty:1 << 7, all: (1 << 8) - 1};

	var RenderCmd = cc.Node.RenderCmd = function(renderable) {
		this._dirtyFlag = 1;                           //need update the transform at first.

		this._node = renderable;
		this._needDraw = false;
		this._anchorPointInPoints = new cc.Point(0,0);

		this._transform = {a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0};
		this._worldTransform = {a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0};
		this._inverse = {a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0};

		this._displayedOpacity = 255;
		this._displayedColor = cc.color(255, 255, 255, 255);
		this._cascadeColorEnabledDirty = false;
		this._cascadeOpacityEnabledDirty = false;

		this._curLevel = -1;
	};

	RenderCmd.prototype = {
		constructor: cc.Node.RenderCmd,

		getAnchorPointInPoints: function(){
			return cc.p(this._anchorPointInPoints);
		},

		getDisplayedColor: function(){
			var tmpColor = this._displayedColor;
			return cc.color(tmpColor.r, tmpColor.g, tmpColor.b, tmpColor.a);
		},

		getDisplayedOpacity: function(){
			return this._displayedOpacity;
		},

		setCascadeColorEnabledDirty: function(){
			this._cascadeColorEnabledDirty = true;
			this.setDirtyFlag(cc.Node._dirtyFlags.colorDirty);
		},

		setCascadeOpacityEnabledDirty:function(){
			this._cascadeOpacityEnabledDirty = true;
			this.setDirtyFlag(cc.Node._dirtyFlags.opacityDirty);
		},

		getParentToNodeTransform: function(){
			if(this._dirtyFlag & cc.Node._dirtyFlags.transformDirty)
				this._inverse = cc.affineTransformInvert(this.getNodeToParentTransform());
			return this._inverse;
		},

		detachFromParent: function(){},

		_updateAnchorPointInPoint: function() {
			var locAPP = this._anchorPointInPoints, locSize = this._node._contentSize, locAnchorPoint = this._node._anchorPoint;
			locAPP.x = locSize.width * locAnchorPoint.x;
			locAPP.y = locSize.height * locAnchorPoint.y;
			this.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
		},

		setDirtyFlag: function(dirtyFlag){
			if (this._dirtyFlag === 0 && dirtyFlag !== 0)
				cc.renderer.pushDirtyNode(this);
			this._dirtyFlag |= dirtyFlag;
		},

		getParentRenderCmd: function(){
			if(this._node && this._node._parent && this._node._parent._renderCmd)
				return this._node._parent._renderCmd;
			return null;
		},

		_updateDisplayColor: function (parentColor) {
		   var node = this._node;
		   var locDispColor = this._displayedColor, locRealColor = node._realColor;
		   var i, len, selChildren, item;
		   if (this._cascadeColorEnabledDirty && !node._cascadeColorEnabled) {
			   locDispColor.r = locRealColor.r;
			   locDispColor.g = locRealColor.g;
			   locDispColor.b = locRealColor.b;
			   var whiteColor = new cc.Color(255, 255, 255, 255);
			   selChildren = node._children;
			   for (i = 0, len = selChildren.length; i < len; i++) {
				   item = selChildren[i];
				   if (item && item._renderCmd)
					   item._renderCmd._updateDisplayColor(whiteColor);
			   }
			   this._cascadeColorEnabledDirty = false;
		   } else {
			   if (parentColor === undefined) {
				   var locParent = node._parent;
				   if (locParent && locParent._cascadeColorEnabled)
					   parentColor = locParent.getDisplayedColor();
				   else
					   parentColor = cc.color.WHITE;
			   }
			   locDispColor.r = 0 | (locRealColor.r * parentColor.r / 255.0);
			   locDispColor.g = 0 | (locRealColor.g * parentColor.g / 255.0);
			   locDispColor.b = 0 | (locRealColor.b * parentColor.b / 255.0);
			   if (node._cascadeColorEnabled) {
				   selChildren = node._children;
				   for (i = 0, len = selChildren.length; i < len; i++) {
					   item = selChildren[i];
					   if (item && item._renderCmd){
						   item._renderCmd._updateDisplayColor(locDispColor);
						   item._renderCmd._updateColor();
					   }
				   }
			   }
		   }
		   this._dirtyFlag = this._dirtyFlag & cc.Node._dirtyFlags.colorDirty ^ this._dirtyFlag;
	   },

		_updateDisplayOpacity: function (parentOpacity) {
			var node = this._node;
			var i, len, selChildren, item;
			if (this._cascadeOpacityEnabledDirty && !node._cascadeOpacityEnabled) {
				this._displayedOpacity = node._realOpacity;
				selChildren = node._children;
				for (i = 0, len = selChildren.length; i < len; i++) {
					item = selChildren[i];
					if (item && item._renderCmd)
						item._renderCmd._updateDisplayOpacity(255);
				}
				this._cascadeOpacityEnabledDirty = false;
			} else {
				if (parentOpacity === undefined) {
					var locParent = node._parent;
					parentOpacity = 255;
					if (locParent && locParent._cascadeOpacityEnabled)
						parentOpacity = locParent.getDisplayedOpacity();
				}
				this._displayedOpacity = node._realOpacity * parentOpacity / 255.0;
				if (node._cascadeOpacityEnabled) {
					selChildren = node._children;
					for (i = 0, len = selChildren.length; i < len; i++) {
						item = selChildren[i];
						if (item && item._renderCmd){
							item._renderCmd._updateDisplayOpacity(this._displayedOpacity);
							item._renderCmd._updateColor();
						}
					}
				}
			}
			this._dirtyFlag = this._dirtyFlag & cc.Node._dirtyFlags.opacityDirty ^ this._dirtyFlag;
		},

		_syncDisplayColor : function (parentColor) {
			var node = this._node, locDispColor = this._displayedColor, locRealColor = node._realColor;
			if (parentColor === undefined) {
				var locParent = node._parent;
				if (locParent && locParent._cascadeColorEnabled)
					parentColor = locParent.getDisplayedColor();
				else
					parentColor = cc.color.WHITE;
			}
			locDispColor.r = 0 | (locRealColor.r * parentColor.r / 255.0);
			locDispColor.g = 0 | (locRealColor.g * parentColor.g / 255.0);
			locDispColor.b = 0 | (locRealColor.b * parentColor.b / 255.0);
		},

		_syncDisplayOpacity : function (parentOpacity) {
			var node = this._node;
			if (parentOpacity === undefined) {
				var locParent = node._parent;
				parentOpacity = 255;
				if (locParent && locParent._cascadeOpacityEnabled)
					parentOpacity = locParent.getDisplayedOpacity();
			}
			this._displayedOpacity = node._realOpacity * parentOpacity / 255.0;
		},

		_updateColor: function(){},

		updateStatus: function () {
			var flags = cc.Node._dirtyFlags, locFlag = this._dirtyFlag;
			var colorDirty = locFlag & flags.colorDirty,
				opacityDirty = locFlag & flags.opacityDirty;
			if(colorDirty)
				this._updateDisplayColor();

			if(opacityDirty)
				this._updateDisplayOpacity();

			if(colorDirty || opacityDirty)
				this._updateColor();

			if(locFlag & flags.transformDirty){
				//update the transform
				this.transform(this.getParentRenderCmd(), true);
				this._dirtyFlag = this._dirtyFlag & cc.Node._dirtyFlags.transformDirty ^ this._dirtyFlag;
			}
		},

		getNodeToParentTransform: function () {
			var node = this._node;
			if (node._usingNormalizedPosition && node._parent) {        //TODO need refactor
				var conSize = node._parent._contentSize;
				node._position.x = node._normalizedPosition.x * conSize.width;
				node._position.y = node._normalizedPosition.y * conSize.height;
				node._normalizedPositionDirty = false;
				this._dirtyFlag = this._dirtyFlag | cc.Node._dirtyFlags.transformDirty;
			}
			if (this._dirtyFlag & cc.Node._dirtyFlags.transformDirty) {
				var t = this._transform;// quick reference

				// base position
				t.tx = node._position.x;
				t.ty = node._position.y;

				// rotation Cos and Sin
				var a = 1, b = 0,
					c = 0, d = 1;
				if (node._rotationX) {
					var rotationRadiansX = node._rotationX * 0.017453292519943295;  //0.017453292519943295 = (Math.PI / 180);   for performance
					c = Math.sin(rotationRadiansX);
					d = Math.cos(rotationRadiansX);
				}

				if (node._rotationY) {
					var rotationRadiansY = node._rotationY * 0.017453292519943295;  //0.017453292519943295 = (Math.PI / 180);   for performance
					a = Math.cos(rotationRadiansY);
					b = -Math.sin(rotationRadiansY);
				}
				t.a = a;
				t.b = b;
				t.c = c;
				t.d = d;

				var lScaleX = node._scaleX, lScaleY = node._scaleY;
				var appX = this._anchorPointInPoints.x, appY = this._anchorPointInPoints.y;

				// Firefox on Vista and XP crashes
				// GPU thread in case of scale(0.0, 0.0)
				var sx = (lScaleX < 0.000001 && lScaleX > -0.000001) ? 0.000001 : lScaleX,
					sy = (lScaleY < 0.000001 && lScaleY > -0.000001) ? 0.000001 : lScaleY;

				// scale
				if (lScaleX !== 1 || lScaleY !== 1) {
					a = t.a *= sx;
					b = t.b *= sx;
					c = t.c *= sy;
					d = t.d *= sy;
				}

				// skew
				if (node._skewX || node._skewY) {
					// offset the anchorpoint
					var skx = Math.tan(-node._skewX * Math.PI / 180);
					var sky = Math.tan(-node._skewY * Math.PI / 180);
					if (skx === Infinity)
						skx = 99999999;
					if (sky === Infinity)
						sky = 99999999;
					var xx = appY * skx;
					var yy = appX * sky;
					t.a = a - c * sky;
					t.b = b - d * sky;
					t.c = c - a * skx;
					t.d = d - b * skx;
					t.tx += a * xx + c * yy;
					t.ty += b * xx + d * yy;
				}

				// adjust anchorPoint
				t.tx -= a * appX + c * appY;
				t.ty -= b * appX + d * appY;

				// if ignore anchorPoint
				if (node._ignoreAnchorPointForPosition) {
					t.tx += appX;
					t.ty += appY;
				}

				if (node._additionalTransformDirty)
					this._transform = cc.affineTransformConcat(t, node._additionalTransform);
			}
			return this._transform;
		},

		_syncStatus: function (parentCmd) {
			//  In the visit logic does not restore the _dirtyFlag
			//  Because child elements need parent's _dirtyFlag to change himself
			var flags = cc.Node._dirtyFlags, locFlag = this._dirtyFlag;
			var parentNode = parentCmd ? parentCmd._node : null;

			//  There is a possibility:
			//    The parent element changed color, child element not change
			//    This will cause the parent element changed color
			//    But while the child element does not enter the circulation
			//    Here will be reset state in last
			//    In order the child elements get the parent state
			if(parentNode && parentNode._cascadeColorEnabled && (parentCmd._dirtyFlag & flags.colorDirty))
				locFlag |= flags.colorDirty;

			if(parentNode && parentNode._cascadeOpacityEnabled && (parentCmd._dirtyFlag & flags.opacityDirty))
				locFlag |= flags.opacityDirty;

			if(parentCmd && (parentCmd._dirtyFlag & flags.transformDirty))
				locFlag |= flags.transformDirty;

			var colorDirty = locFlag & flags.colorDirty,
				opacityDirty = locFlag & flags.opacityDirty,
				transformDirty = locFlag & flags.transformDirty;

			this._dirtyFlag = locFlag;

			if (colorDirty)
				//update the color
				this._syncDisplayColor();

			if (opacityDirty)
				//update the opacity
				this._syncDisplayOpacity();

			if(colorDirty)
				this._updateColor();

			if (transformDirty)
				//update the transform
				this.transform(parentCmd);
		},

		visitChildren: function(){
			var node = this._node;
			var i, children = node._children, child;
			var len = children.length;
			if (len > 0) {
				node.sortAllChildren();
				// draw children zOrder < 0
				for (i = 0; i < len; i++) {
					child = children[i];
					if (child._localZOrder < 0)
						child._renderCmd.visit(this);
					else
						break;
				}
				cc.renderer.pushRenderCommand(this);
				for (; i < len; i++)
					children[i]._renderCmd.visit(this);
			} else {
				cc.renderer.pushRenderCommand(this);
			}
			this._dirtyFlag = 0;
		}
	};

	var CanvasRenderCmd = function (renderable) {
        cc.Node.RenderCmd.call(this, renderable);
        this._cachedParent = null;
        this._cacheDirty = false;
    };

    var proto = CanvasRenderCmd.prototype = Object.create(RenderCmd.prototype);
    proto.constructor = CanvasRenderCmd;

    proto.transform = function (parentCmd, recursive) {
        // transform for canvas
        var t = this.getNodeToParentTransform(),
            worldT = this._worldTransform;         //get the world transform
        this._cacheDirty = true;
        if (parentCmd) {
            var pt = parentCmd._worldTransform;
            // cc.AffineTransformConcat is incorrect at get world transform
            worldT.a = t.a * pt.a + t.b * pt.c;                               //a
            worldT.b = t.a * pt.b + t.b * pt.d;                               //b
            worldT.c = t.c * pt.a + t.d * pt.c;                               //c
            worldT.d = t.c * pt.b + t.d * pt.d;                               //d

            worldT.tx = pt.a * t.tx + pt.c * t.ty + pt.tx;
            worldT.ty = pt.d * t.ty + pt.ty + pt.b * t.tx;
        } else {
            worldT.a = t.a;
            worldT.b = t.b;
            worldT.c = t.c;
            worldT.d = t.d;
            worldT.tx = t.tx;
            worldT.ty = t.ty;
        }
        if (recursive) {
            var locChildren = this._node._children;
            if (!locChildren || locChildren.length === 0)
                return;
            var i, len;
            for (i = 0, len = locChildren.length; i < len; i++) {
                locChildren[i]._renderCmd.transform(this, recursive);
            }
        }
    };

    proto.visit = function (parentCmd) {
        var node = this._node;
        // quick return if not visible
        if (!node._visible)
            return;

        parentCmd = parentCmd || this.getParentRenderCmd();
        if (parentCmd)
            this._curLevel = parentCmd._curLevel + 1;
        this._syncStatus(parentCmd);
        this.visitChildren();
    };

    proto.setDirtyFlag = function (dirtyFlag, child) {
        cc.Node.RenderCmd.prototype.setDirtyFlag.call(this, dirtyFlag, child);
        this._setCacheDirty(child);                  //TODO it should remove from here.
        if(this._cachedParent)
            this._cachedParent.setDirtyFlag(dirtyFlag, true);
    };

    proto._setCacheDirty = function () {
        if (this._cacheDirty === false) {
            this._cacheDirty = true;
            var cachedP = this._cachedParent;
            cachedP && cachedP !== this && cachedP._setNodeDirtyForCache && cachedP._setNodeDirtyForCache();
        }
    };

    proto._setCachedParent = function (cachedParent) {
        if (this._cachedParent === cachedParent)
            return;

        this._cachedParent = cachedParent;
        var children = this._node._children;
        for (var i = 0, len = children.length; i < len; i++)
            children[i]._renderCmd._setCachedParent(cachedParent);
    };

    proto.detachFromParent = function () {
        this._cachedParent = null;
        var selChildren = this._node._children, item;
        for (var i = 0, len = selChildren.length; i < len; i++) {
            item = selChildren[i];
            if (item && item._renderCmd)
                item._renderCmd.detachFromParent();
        }
    };

    proto.setShaderProgram = function (shaderProgram) {
        //do nothing.
    };

    proto.getShaderProgram = function () {
        return null;
    };

    //util functions
    CanvasRenderCmd._getCompositeOperationByBlendFunc = function (blendFunc) {
        if (!blendFunc)
            return "source-over";
        else {
            if (( blendFunc.src === cc.SRC_ALPHA && blendFunc.dst === cc.ONE) || (blendFunc.src === cc.ONE && blendFunc.dst === cc.ONE))
                return "lighter";
            else if (blendFunc.src === cc.ZERO && blendFunc.dst === cc.SRC_ALPHA)
                return "destination-in";
            else if (blendFunc.src === cc.ZERO && blendFunc.dst === cc.ONE_MINUS_SRC_ALPHA)
                return "destination-out";
            else
                return "source-over";
        }
    };

//////////////////////////////////////////////////////////////////
//ParticleSystem.CanvasRenderCmd
	ParticleSystem.CanvasRenderCmd = function(renderable) {
        cc.Node.CanvasRenderCmd.call(this, renderable);
        this._needDraw = true;

        this._drawMode = cc.ParticleSystem.TEXTURE_MODE;
        this._shapeType = cc.ParticleSystem.BALL_SHAPE;

        this._pointRect = cc.rect(0, 0, 0, 0);
        this._tintCache = document.createElement("canvas");
    };
    var proto = ParticleSystem.CanvasRenderCmd.prototype = Object.create(CanvasRenderCmd.prototype);
    proto.constructor = ParticleSystem.CanvasRenderCmd;

    proto.getDrawMode = function(){
        return this._drawMode;
    };

    proto.setDrawMode = function(drawMode){
        this._drawMode = drawMode;
    };

    proto.getShapeType = function(){
        return this._shapeType;
    };

    proto.setShapeType = function(shapeType){
        this._shapeType = shapeType;
    };

    proto.setBatchNode = function(batchNode){
        if (this._batchNode !== batchNode) {
            this._node._batchNode = batchNode;
        }
    };

    proto.updateQuadWithParticle = function (particle, newPosition) {
        //do nothing
    };

    proto.updateParticlePosition = function(particle, position){
        cc.pIn(particle.drawPos, position);
    };

    proto.rendering = function (ctx, scaleX, scaleY) {
        //TODO: need refactor rendering for performance
        var wrapper = ctx || cc._renderContext, context = wrapper.getContext(),
            node = this._node, pointRect = this._pointRect;

        wrapper.setTransform(this._worldTransform, scaleX, scaleY);
        wrapper.save();
        if (node.isBlendAdditive())
            context.globalCompositeOperation = 'lighter';
        else
            context.globalCompositeOperation = 'source-over';

        var i, particle, lpx, alpha;
        var particleCount = this._node.particleCount, particles = this._node._particles;
        if (node.drawMode !== cc.ParticleSystem.SHAPE_MODE && node._texture) {
            //var element = node._texture.getHtmlElementObj();
            var element = node._texture;
            if (!element.width || !element.height) {
                wrapper.restore();
                return;
            }

            var drawElement = element;
            for (i = 0; i < particleCount; i++) {
                particle = particles[i];
                lpx = (0 | (particle.size * 0.5));

                alpha = particle.color.a / 255;
                if (alpha === 0) continue;
                context.globalAlpha = alpha;

                context.save();
                context.translate((0 | particle.drawPos.x), -(0 | particle.drawPos.y));

                var size = Math.floor(particle.size / 4) * 4;
                var w = pointRect.width;
                var h = pointRect.height;

                context.scale(Math.max((1 / w) * size, 0.000001), Math.max((1 / h) * size, 0.000001));
                if (particle.rotation)
                    context.rotate(cc.degreesToRadians(particle.rotation));

				drawElement = particle.isChangeColor ? this._changeTextureColor(node._texture, particle.color, this._pointRect) : element;
				context.drawImage(drawElement, -(0 | (w / 2)), -(0 | (h / 2)));
                context.restore();
            }
        }
        wrapper.restore();
    };

	var renderToCache = function(image, cache){
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
		for (var rgbI = 0; rgbI < 4; rgbI++) {
			ctx = cache[rgbI].getContext("2d");

			var to = ctx.getImageData(0, 0, w, h);
			var data = to.data;
			for (var i = 0; i < pixels.length; i += 4) {
				data[i  ] = (rgbI === 0) ? pixels[i  ] : 0;
				data[i + 1] = (rgbI === 1) ? pixels[i + 1] : 0;
				data[i + 2] = (rgbI === 2) ? pixels[i + 2] : 0;
				data[i + 3] = pixels[i + 3];
			}
			ctx.putImageData(to, 0, 0);
		}
		image.onload = null;
	};

	proto._generateTextureCacheForColor = function(texture) {
		if (this.channelCache)
			return this.channelCache;

		var textureCache = [
			document.createElement("canvas"),
			document.createElement("canvas"),
			document.createElement("canvas"),
			document.createElement("canvas")
		];
		//todo texture onload
		//renderToCache(this._htmlElementObj, textureCache);
		renderToCache(texture, textureCache);
		return this.channelCache = textureCache;
 	};

	proto.getTextureColors = function (texture) {
		var key = texture.src;
		this._textureColorsCache = this._textureColorsCache || {};
        if (!this._textureColorsCache[key])
            this._textureColorsCache[key] = this._generateTextureCacheForColor(texture);
            //this._textureColorsCache[key] = texture._generateTextureCacheForColor();
        return this._textureColorsCache[key];
    };

    proto._generateColorTexture = function(r, g, b, rect, canvas, texture){
            var onlyCanvas = false;
            if(canvas)
                onlyCanvas = true;
            else
                canvas = document.createElement("canvas");
            var textureImage = texture;//this._htmlElementObj;
            if(!rect)
                rect = cc.rect(0, 0, textureImage.width, textureImage.height);

            canvas.width = rect.width;
            canvas.height = rect.height;

            var context = canvas.getContext("2d");
            context.globalCompositeOperation = "source-over";
            context.fillStyle = "rgb(" + (r|0) + "," + (g|0) + "," + (b|0) + ")";
            context.fillRect(0, 0, rect.width, rect.height);
            context.globalCompositeOperation = "multiply";
            context.drawImage(
                textureImage,
                rect.x, rect.y, rect.width, rect.height,
                0, 0, rect.width, rect.height
            );
            context.globalCompositeOperation = "destination-atop";
            context.drawImage(
                textureImage,
                rect.x, rect.y, rect.width, rect.height,
                0, 0, rect.width, rect.height
            );
            if(onlyCanvas)
                return canvas;
    };

    proto._changeTextureColor = function(texture, color, rect){
        var tintCache = this._tintCache;
        var textureContentSize = cc.size(texture.width, texture.height);
        tintCache.width = textureContentSize.width;
        tintCache.height = textureContentSize.height;
        return this._generateColorTexture(color.r, color.g, color.b, rect, tintCache, texture);
    };

    proto.initTexCoordsWithRect = function(pointRect){
        this._pointRect = pointRect;
    };

    proto.setTotalParticles = function(tp){
        //cc.assert(tp <= this._allocatedParticles, "Particle: resizing particle array only supported for quads");
        this._node._totalParticles = (tp < 200) ? tp : 200;
    };

    proto.addParticle = function(){
        var node = this._node,
            particles = node._particles,
            particle;
        if (node.particleCount < particles.length) {
            particle = particles[node.particleCount];
        } else {
            particle = new cc.Particle();
            particles.push(particle);
        }
        return particle;
    };

    proto._setupVBO = function(){};
    proto._allocMemory = function(){
        return true;
    };

    proto.postStep = function(){};

    proto._setBlendAdditive = function(){
        var locBlendFunc = this._node._blendFunc;
        locBlendFunc.src = cc.BLEND_SRC;
        locBlendFunc.dst = cc.BLEND_DST;
    };

    proto._initWithTotalParticles = function(totalParticles){};
    proto._updateDeltaColor = function(selParticle, dt){
        if (!this._node._dontTint) {
            selParticle.color.r += selParticle.deltaColor.r * dt;
            selParticle.color.g += selParticle.deltaColor.g * dt;
            selParticle.color.b += selParticle.deltaColor.b * dt;
            selParticle.color.a += selParticle.deltaColor.a * dt;
            selParticle.isChangeColor = true;
        }
    };
////////////////////////////////////////////////////////////////////////////////////
//cc
	cc.ParticleSystem = ParticleSystem;
	cc.Node.CanvasRenderCmd = CanvasRenderCmd;

	cc.Particle = function (pos, startPos, color, deltaColor, size, deltaSize, rotation, deltaRotation, timeToLive, atlasIndex, modeA, modeB) {
		this.pos = pos ? pos : cc.p(0,0);
		this.startPos = startPos ? startPos : cc.p(0,0);
		this.color = color ? color : {r:0, g: 0, b:0, a:255};
		this.deltaColor = deltaColor ? deltaColor : {r:0, g: 0, b:0, a:255} ;
		this.size = size || 0;
		this.deltaSize = deltaSize || 0;
		this.rotation = rotation || 0;
		this.deltaRotation = deltaRotation || 0;
		this.timeToLive = timeToLive || 0;
		this.atlasIndex = atlasIndex || 0;
		this.modeA = modeA ? modeA : new cc.Particle.ModeA();
		this.modeB = modeB ? modeB : new cc.Particle.ModeB();
		this.isChangeColor = false;
		this.drawPos = cc.p(0, 0);
	};

	cc.Particle.MODE_GRAVITY= 0;
	cc.Particle.MODE_RADIUS = 1;

	cc.Particle.BLEND_SRC = 'bd_src';
	cc.Particle.BLEND_DST = 'bd_dst';

	cc.Particle.TYPE_FREE 	  = 0;
	cc.Particle.TYPE_RELATIVE = 1;
	cc.Particle.TYPE_GROUPED  = 2;
	
	cc.log = function() {
		return console.log.apply(console, arguments);
	};

	cc.Particle.ModeA = function (dir, radialAccel, tangentialAccel) {
		this.dir = dir ? dir : cc.p(0,0);
		this.radialAccel = radialAccel || 0;
		this.tangentialAccel = tangentialAccel || 0;
	};

	cc.Particle.ModeB = function (angle, degreesPerSecond, radius, deltaRadius) {
		this.angle = angle || 0;
		this.degreesPerSecond = degreesPerSecond || 0;
		this.radius = radius || 0;
		this.deltaRadius = deltaRadius || 0;
	};	

	cc.p = function(x, y) {
		if (x === undefined)
			return {x: 0, y: 0};
		if (y === undefined)
			return {x: x.x, y: x.y};
		return {x: x, y: y};
	};

	cc.Particle.TemporaryPoints = [
		cc.p(),
		cc.p(),
		cc.p(),
		cc.p()
	];

	cc.color = function (r, g, b, a) {
		if (r === undefined)
			return {r: 0, g: 0, b: 0, a: 255};
		if (cc.isString(r))
			return cc.hexToColor(r);
		if (cc.isObject(r))
			return {r: r.r, g: r.g, b: r.b, a: (r.a == null) ? 255 : r.a};
		return  {r: r, g: g, b: b, a: (a == null ? 255 : a)};
	};

	cc.isObject = function(obj) {
    	return typeof obj === "object" && Object.prototype.toString.call(obj) === '[object Object]';
	};

	cc.isString = function(obj) {
    	return typeof obj === 'string' || Object.prototype.toString.call(obj) === '[object String]';
	};

	cc.hexToColor = function (hex) {
		hex = hex.replace(/^#?/, "0x");
		var c = parseInt(hex);
		var r = c >> 16;
		var g = (c >> 8) % 256;
		var b = c % 256;
		return cc.color(r, g, b);
	};

	cc.pIn = function(v1, v2) {
		v1.x = v2.x;
		v1.y = v2.y;
	};

	cc.pZeroIn = function(v) {
		v.x = 0;
		v.y = 0;
	};

	cc.pMultIn = function(point, floatVar) {
    	point.x *= floatVar;
	    point.y *= floatVar;
	};

	cc.pAddIn = function(v1, v2) {
		v1.x += v2.x;
		v1.y += v2.y;
	};

	cc.pSubIn = function(v1, v2) {
		v1.x -= v2.x;
		v1.y -= v2.y;
	};

	cc.pNormalizeIn = function(v) {
    	cc.pMultIn(v, 1.0 / Math.sqrt(v.x * v.x + v.y * v.y));
	};

	cc.Point = function (x, y) {
		this.x = x || 0;
		this.y = y || 0;
	};

	cc.rect = function (x, y, w, h) {
		if (x === undefined)
			return {x: 0, y: 0, width: 0, height: 0};
		if (y === undefined)
			return {x: x.x, y: x.y, width: x.width, height: x.height};
		return {x: x, y: y, width: w, height: h };
	};

	cc.pointApplyAffineTransform = function (point, transOrY, t) {
		var x, y;
		if (t === undefined) {
			t = transOrY;
			x = point.x;
			y = point.y;
		} else {
			x = point;
			y = transOrY;
		}
		return {x: t.a * x + t.c * y + t.tx, y: t.b * x + t.d * y + t.ty};
	};
	
	cc.affineTransformConcat = function (t1, t2) {
		return {a: t1.a * t2.a + t1.b * t2.c,                          //a
			b: t1.a * t2.b + t1.b * t2.d,                               //b
			c: t1.c * t2.a + t1.d * t2.c,                               //c
			d: t1.c * t2.b + t1.d * t2.d,                               //d
			tx: t1.tx * t2.a + t1.ty * t2.c + t2.tx,                    //tx
			ty: t1.tx * t2.b + t1.ty * t2.d + t2.ty};				    //ty
	};

	cc.affineTransformConcatIn = function (t1, t2) {
		var a = t1.a, b = t1.b, c = t1.c, d = t1.d, tx = t1.tx, ty = t1.ty;
		t1.a = a * t2.a + b * t2.c;
		t1.b = a * t2.b + b * t2.d;
		t1.c = c * t2.a + d * t2.c;
		t1.d = c * t2.b + d * t2.d;
		t1.tx = tx * t2.a + ty * t2.c + t2.tx;
		t1.ty = tx * t2.b + ty * t2.d + t2.ty;
		return t1;
	};

	cc.randomMinus1To1 = function () {
    	return (Math.random() - 0.5) * 2;
	};

	cc.clampf = function (value, min_inclusive, max_inclusive) {
		if (min_inclusive > max_inclusive) {
			var temp = min_inclusive;
			min_inclusive = max_inclusive;
			max_inclusive = temp;
		}
		return value < min_inclusive ? min_inclusive : value < max_inclusive ? value : max_inclusive;
	};

	cc.PI = Math.PI;
	cc.RAD = cc.PI / 180;
	cc.DEG = 180 / cc.PI;
	cc.degreesToRadians = function (angle) {
    	return angle * cc.RAD;
	};

	cc.radiansToDegrees = function (angle) {
    	return angle * cc.DEG;
	};

	cc.defineGetterSetter(cc, "BLEND_SRC", function (){
		//if (cc._renderType === cc.game.RENDER_TYPE_WEBGL
		//	 && cc.OPTIMIZE_BLEND_FUNC_FOR_PREMULTIPLIED_ALPHA) {
		//	return cc.ONE;
		//}
		//else {
			return cc.SRC_ALPHA;
		//}
	});

	cc.size = function (w, h) {
		// This can actually make use of "hidden classes" in JITs and thus decrease
		// memory usage and overall performance drastically
		//return cc.size(w, h);
		// but this one will instead flood the heap with newly allocated hash maps
		// giving little room for optimization by the JIT
		// note: we have tested this item on Chrome and firefox, it is faster than cc.size(w, h)
		if (w === undefined)
			return {width: 0, height: 0};
		if (h === undefined)
			return {width: w.width, height: w.height};
		return {width: w, height: h};
	};

	(function () {
		cc.CanvasContextWrapper = function (context) {
			this.init(context);
		};

		cc.CanvasContextWrapper.getInstance = function(context) {
			if(!cc.CanvasContextWrapper.instance) {
				cc.CanvasContextWrapper.instance = new cc.CanvasContextWrapper(context);
			}
			else {
				cc.CanvasContextWrapper.instance.init(context);
			}

			return cc.CanvasContextWrapper.instance;
		};

		var proto = cc.CanvasContextWrapper.prototype;

		proto.init = function(context) {
			this._context = context;

			this._saveCount = 0;
			this._currentAlpha = context.globalAlpha;
			this._currentCompositeOperation = context.globalCompositeOperation;
			this._currentFillStyle = context.fillStyle;
			this._currentStrokeStyle = context.strokeStyle;

			this._offsetX = 0;
			this._offsetY = 0;
			this._realOffsetY = this.height;
			this._armatureMode = 0;
		};

		proto.getContext = function(){
			return this._context;
		};

		proto.save = function () {
			this._context.save();
			this._saveCount++;
		};

		proto.restore = function () {
			this._context.restore();
			this._saveCount--;
		};

		proto.setTransform = function(t, scaleX, scaleY){
			if (this._armatureMode > 0) {
				//ugly for armature
				this.restore();
				this.save();
				this._context.transform(t.a, -t.b, -t.c, t.d, t.tx * scaleX, -(t.ty * scaleY));
			} else {
				this._context.setTransform(t.a, -t.b, -t.c, t.d, this._offsetX + t.tx * scaleX, this._realOffsetY - (t.ty * scaleY));
			}
		};
	})();

	return ParticleSystem;
}());
