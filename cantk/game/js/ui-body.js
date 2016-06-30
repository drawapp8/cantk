/*
 * File:   ui-circle.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Basic circle for game. 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIBody
 * @extends UIElement
 * 物理引擎中的刚体。它是方块刚体，圆形刚体和多边形刚体的父类，它本身是一个抽象类，不能直接创建对象。
 * 
 * 可以设置它的物理引擎参数，如摩擦力，弹力和密度等。密度为0表示是静态刚体，大于0表示是动态刚体。
 * 静态刚体不会有速度等动态行为，通常用来表示大地等不动的物体，但可以通过程序来移动它的位置。
 *
 * 可以向刚体中添加图片和动画来装饰刚体。
 *
 * 注意：刚体只能放到场景中，如果设计时把刚体放在其它控件中，它不会继承父控件的位置属性，移动父控件刚体不会跟随移动。
 */

/**
 * @event onBeginContact
 * 两个刚体碰撞到一起时，会触发onBeginContact事件。一般事件调用顺序是：onBeginContact ->  onPreSolve -> onPostSolve ->onPreSolve -> onPostSolve -> ………… -> onPreSolve -> onPostSolve -> onEndContact。
 *
 *
 * @param {Object} body 是碰撞当前刚体的刚体。通过body.element可以获取body对应的控件。
 * @param {Object} contact [碰撞信息](http://www.box2dflash.org/docs/2.1a/reference/Box2D/Dynamics/Contacts/b2Contact.html)
 *
 * 参考：[http://www.box2dflash.org/docs/2.1a/reference/](//www.box2dflash.org/docs/2.1a/reference/)
 *
 *     @example small frame
 *     if(body.element.name === "ui-coin") {
 *          body.element.remove(true);
 *     }
 */

/**
 * @event onEndContact
 * 碰撞结束事件。两个刚体碰撞在一起，然后分离开的事件。
 * @param {Object} body 是碰撞当前刚体的刚体。通过body.element可以获取body对应的控件。
 * @param {Object} contact [碰撞信息](http://www.box2dflash.org/docs/2.1a/reference/Box2D/Dynamics/Contacts/b2Contact.html)
 *
 */

/**
 * @event onPreSolve
 * PreSolve
 * @param {Object} body 是碰撞当前刚体的刚体。通过body.element可以获取body对应的控件。
 * @param {Object} contact [碰撞信息](http://www.box2dflash.org/docs/2.1a/reference/Box2D/Dynamics/Contacts/b2Contact.html)
 * @param {Object} oldManifold [b2Manifold](http://www.box2dflash.org/docs/2.1a/reference/Box2D/Collision/b2Manifold.html)
 *
 * 参考：[http://www.box2dflash.org/docs/2.1a/reference/Box2D/Dynamics/b2ContactListener.html](//www.box2dflash.org/docs/2.1a/reference/Box2D/Dynamics/b2ContactListener.html)
 */

/**
 * @event onPostSolve
 * Post Solve 
 * @param {Object} body 是碰撞当前刚体的刚体。通过body.element可以获取body对应的控件。
 * @param {Object} contact [碰撞信息](http://www.box2dflash.org/docs/2.1a/reference/Box2D/Dynamics/Contacts/b2Contact.html)
 * @param {Object} impulse [b2ContactImpulse](http://www.box2dflash.org/docs/2.1a/reference/Box2D/Dynamics/b2ContactImpulse.html)
 *
 * 参考：[http://www.box2dflash.org/docs/2.1a/reference/Box2D/Dynamics/b2ContactListener.html](//www.box2dflash.org/docs/2.1a/reference/Box2D/Dynamics/b2ContactListener.html)
 */

/**
 * @event onMoved
 * 当刚体移动时触发本事件。
 *
 */

/**
 * @property {Boolean} cameraFollowMe
 * 是否启用镜头跟随。
 * 注意：需要设置当前场景的虚拟宽度大于场景宽度，或虚拟高度大于场景高度，否则镜头跟随不生效。
 */

function UIBody() {
	return;
}

UIBody.prototype = new UIElement();
UIBody.prototype.isUIBody = true;
UIBody.prototype.isUIPhysicsShape = true;

UIBody.prototype.saveProps = ["density", "friction", "restitution", "isSensor", "allowSleep", "isBullet", "autoDestroyWhenOutside",
	"fixedRotation", "groupIndex", "noStroke", "cameraFollowMe", "xInitVelocity", "yInitVelocity",
	"linearDamping", "angularDamping"];

UIBody.prototype.initUIBody = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;
	this.setCanRectSelectable(false, false);

	this.density = 0;
	this.friction = 0;
	this.restitution = 0;
	this.allowSleep = true;

	this.addEventNames(["onBeginContact", "onEndContact", "onMoved", "onPreSolve", "onPostSolve"]);

	return this;
}

UIBody.prototype.shapeCanBeChild = function(shape) {
	if(!UIGroup.prototype.shapeCanBeChild.call(this, shape) || (shape.isUIJoint && !shape.isUIMouseJoint)) {
		return false;
	}

	return !shape.isUIPhysicsShape;
}

//////////////////////////////////////////////////////////////

/**
 * @method setGravityScale
 * 设置刚体的重力系数，动态修改单个刚体的重力。
 * @param {Point} gravityScale 重力系数。
 * @return {UIElement} 返回控件本身。
 *
 *
 * 去掉重力影响：
 *
 *     @example small frame
 *     this.setGravityScale({x:0, y:0});
 *
 * Y方向的重力取反：
 *
 *     @example small frame
 *     this.setGravityScale({x:0, y:-1});
 
 * Y方向的重力减半：
 *
 *     @example small frame
 *     this.setGravityScale({x:0, y:0.5});
 *
 */
UIBody.prototype.setGravityScale = function(gravityScale) {
	this.gravity = {};
	this.gravityScale = gravityScale;

	if(this.body) {
		this.body.modifyGravity  = this.modifyGravity.bind(this);
	}

	return this;
}

UIBody.prototype.modifyGravity = function(gravity) {
	var g = this.gravity;
	var gs = this.gravityScale;

	g.x = gravity.x * gs.x;
	g.y = gravity.y * gs.y;

	return g;
}

UIBody.prototype.onBodyCreated = function() {
	if(this.gravity && this.gravityScale) {
		this.body.modifyGravity  = this.modifyGravity.bind(this);
	}
}

/**
 * @method setSensor
 * 设置刚体为感应器。感应器可以产生碰撞的事件，但不会有碰撞的效果(直接穿越过对方)。
 * @param {Boolean} isSensor 是否为感应器。
 * @return {UIElement} 返回控件本身。
 *
 */
UIBody.prototype.setSensor = function(isSensor) {
	this.isSensor = isSensor;

	if(this.body) {
		for (var f = this.body.GetFixtureList(); f; f = f.m_next) {
			f.SetSensor(isSensor);
		}
	}

	return this;
}

/**
 * @method getDensity
 * 获取刚体的密度。
 * @return {Number} 返回刚体的密度。
 *
 */
UIBody.prototype.getDensity = function() {
	if(this.body) {
		return this.body.GetFixtureList().GetDensity();
	}
	else {
		return this.density;
	}
}

/**
 * @method setRestitution
 * 设置刚体的弹力系数。
 * @param {Number} restitution 刚体的弹力系数。
 * @return {UIElement} 返回控件本身。
 *
 */
UIBody.prototype.setRestitution = function(restitution) {
	this.restitution = restitution;

    if(this.body) {
		for (var f = this.body.GetFixtureList(); f; f = f.m_next) {
			f.SetRestitution(restitution);
		}
    }

    return this;
}

/**
 * @method getRestitution
 * 获取刚体的弹力系数。
 * @return {Number} 返回刚体的弹力系数。
 *
 */
UIBody.prototype.getRestitution = function() {
    if(this.body) {
        return this.body.GetFixtureList().GetRestitution();
    } else {
        return this.restitution;
    }
}

/**
 * @method setFriction
 * 设置刚体的摩擦系数。
 * @param {Number} friction 刚体的摩擦系数。
 * @return {UIElement} 返回控件本身。
 *
 */
UIBody.prototype.setFriction = function(friction) {
	this.friction = friction;

    if(this.body) {
		for (var f = this.body.GetFixtureList(); f; f = f.m_next) {
			f.SetFriction(friction);
		}
    }

    return this;
}

/**
 * @method getFriction
 * 获取刚体的摩擦系数。
 * @return {Number} 返回刚体的摩擦系数。
 *
 */
UIBody.prototype.getFriction = function() {
    if(this.body) {
        return this.body.GetFixtureList().GetFriction();
    } else {
        return this.friction;
    }
}

/**
 * @method setDensity
 * 设置刚体的密度。
 * @param {Number} density 刚体的密度。 
 * @return {UIElement} 返回控件本身。
 *
 */
UIBody.prototype.setDensity = function(density) {
	this.density = density;

	if(this.body) {
		for (var f = this.body.GetFixtureList(); f; f = f.m_next) {
			f.SetDensity(density);
		}

		if(density > 0) {
			this.body.SetType(b2Body.b2_dynamicBody);
		}
		else if(density === 0) {
			this.body.SetType(b2Body.b2_staticBody);
		}
		else {
			this.body.SetType(b2Body.b2_kinematicBody);
		}
		this.body.ResetMassData();
	}

	return this;
}


/**
 * @method setV
 * 设置刚体的线性速度，x，y的取值为null/undefined时，保留原来的值。
 * @param {Number} x 水平方向上的速度，向右为正，向左为负。
 * @param {Number} y 垂直方向上的速度，向下为正，向上为负。
 * @return {UIElement} 返回控件本身。
 *
 */
UIBody.prototype.setV = function(x, y) {
	var body = this.body;
	if(body) {
		this.setVisible(true);

		if(!body.IsActive()) {
			body.SetActive(true);
		}

		if(!body.IsAwake()) {
			body.SetAwake(true);
		}

		var v = body.GetLinearVelocity();
		if(x !== null && x !== undefined) {
			v.x = x;
		}

		if(y !== null && y !== undefined) {
			v.y = y;
		}

		body.SetLinearVelocity(v);
	}
	else {
		this.xInitVelocity = x;
		this.yInitVelocity = y;
	}

	return this;
}

/**
 * @method getV
 * 获取刚体的线性速度。
 * @return {Point} 返回刚体的线性速度。
 *
 */
UIBody.prototype.getV = function() {
	return this.body ? this.body.GetLinearVelocity() : {x:0, y:0};
}

/**
 * @method addV
 * 增加刚体的线性速度。
 * @param {Number} dx 水平方向上的速度增量。
 * @param {Number} dy 垂直方向上的速度增量。
 * @return {UIElement} 返回控件本身。
 *
 */
UIBody.prototype.addV = function(dx, dy) {
	var v = this.getV();

	if(dx !== null && dx !== undefined) {
		v.x += dx;
	}
	
	if(dy !== null && dy !== undefined) {
		v.y += dy;
	}

	return this.setV(v.x, v.y);
}

/**
 * @method getMass
 * 获取刚体的质量。
 * @return {Number} 返回刚体的质量。
 *
 */
UIBody.prototype.getMass = function() {
	return this.body ? this.body.GetMass() : 0;
}

/**
 * @method applyTorque
 * 作用一个力矩到刚体上。
 * @param {Number} torque
 * @return {UIElement} 返回控件本身。
 *
 */
UIBody.prototype.applyTorque = function(torque) {
	if(this.body) {
		this.body.ApplyTorque(torque);
	}

	return this;
}

/**
 * @method applyForce
 * 作用一个力到刚体上。
 * @param {Number} forceX X方向上的力。
 * @param {Number} forceY Y方向上的力。
 * @param {Number} x 作用点X。
 * @param {Number} y 作用点Y。
 * @return {UIElement} 返回控件本身。
 *
 */
UIBody.prototype.applyForce = function(forceX, forceY, x, y) {
	if(this.body) {
		var force = {};
		var position = {};
		x = (x === undefined || x === null) ? (this.left + (this.w >> 1)) : x;
		y = (y === undefined || y === null) ? (this.top + (this.h >> 1)) : y;

		force.x = forceX;
		force.y = forceY;
		position.x = Physics.toMeter(x);
		position.y = Physics.toMeter(y);

		this.body.ApplyForce(force, position);
	}

	return this;
}

UIBody.prototype.setEnable = function(enable) {
	this.enable = enable;
	if(this.body) {
		this.body.SetActive(enable);
	}

	return this;
}

/**
 * @method setGroupIndex
 * 设置刚体的分组。
 * @param {Number} groupIndex 相同负数分组的刚体之间不会碰撞。
 * @return {UIElement} 返回控件本身。
 *
 */
UIBody.prototype.setGroupIndex = function(groupIndex) {
	this.groupIndex = groupIndex;
	if(this.body) {
		for (var f = this.body.GetFixtureList(); f; f = f.m_next) {
			f.m_filter.groupIndex = groupIndex;
		}
	}

	return this;
}

/**
 * @method getGroupIndex
 * 获取刚体的分组。
 * @return {Number} 返回控件的分组。
 *
 */
UIBody.prototype.getGroupIndex = function() {
	return this.groupIndex;
}

/**
 * @method getBody
 * 获取box2d的刚体对象。在特殊情况下，需要直接操作box2d，请使用本函数。
 * @return {Object} 返回box2d的刚体对象。
 *
 * 参考：[http://www.box2dflash.org/docs/2.1a/reference/](http://www.box2dflash.org/docs/2.1a/reference/)
 */
UIBody.prototype.getBody = function() {
	return this.body;
}

UIBody.prototype.setRotation = function(rotation) {
	this.rotation = rotation;

	if(this.body) {
		this.body.SetAngle(rotation);
	}

	return this;
}

/**
 * @method boom
 * 通过这个方法向刚体周围放射作用力，达到爆炸效果。
 * @param {Number} range 爆炸的作用半径范围。
 * @param {Number} force 爆炸产成的作用力大小。
 * @param {Boolean} removeSelf 是否删除空间本身。
 */
UIBody.prototype.boom = function(range, force, removeSelf) {
    var position = this.getPosition();
    position = new b2Vec2(Physics.toMeter(position.x), Physics.toMeter(position.y));
    var win = this.getWindow();
    var world = win.world;
    range = Physics.toMeter(range);

    for (var i = 0; i <= 100; i++) {
        var angle = 360 / 100 * i;

        var input = new b2RayCastInput();
        input.p1 = position;
        input.p2.Set(position.x + range * Math.cos(angle), position.y + range * Math.sin(angle));
        input.maxFraction = 1;
        var output = new b2RayCastOutput();

        for (var currentBody = world.GetBodyList(); currentBody; currentBody = currentBody.GetNext()) {
            if (currentBody.element == this) {
                continue;
            }
            var fix = currentBody.GetFixtureList();
            if (!fix) {
                continue;
            }

            var isHit = fix.RayCast(output, input);
            if (isHit) {
                var p1 = input.p1.Copy();
                var p2 = input.p2.Copy();
                p2.Subtract(p1);
                p2.Multiply(output.fraction);
                p1.Add(p2);
  
                var hitPoint = p1.Copy();
                hitPoint.Subtract(position);
                currentBody.ApplyForce(new b2Vec2(hitPoint.x * (1 - output.fraction) * force, hitPoint.y * (1 - output.fraction) * force), hitPoint);
            }
        }
    }

    removeSelf && this.remove();
}



UIBody.prototype.needStroke = function() {
	return (!this.noStroke && !this.isStrokeColorTransparent()) || this.isInDesignMode();
}

UIBody.prototype.setSize = function(w, h) {
	RShape.prototype.setSize.call(this, w, h);

	var win = this.getWindow();
	this.updateLayoutParams();

	if(this.body && win && win.isUIScene) {
		this.resizeBody();
	}

	return this;
}

UIBody.prototype.onPositionChanged = function() {
	var x = this.left;
	var y = this.top;
	var body = this.body;
	var win = this.getWindow();
	if(body && win && win.isUIScene) {
		var p = {};
		var pos = this.getParent().getPositionInWindow();

		x += pos.x;
		y += pos.y;

		p.x = win.toMeter(x + (this.w >> 1)); 
		p.y = win.toMeter(y + (this.h >> 1)); 
		if(body.m_world.IsLocked()) {
			setTimeout(function() {
				body.SetPosition(p);
			}, 0);
		}
		else {
			body.SetPosition(p);
		}
	}
	
	return this;
}

UIBody.prototype.checkIfOutside = function() {
	if(!this.autoDestroyWhenOutside) {
		return;
	}

	var w = this.w;
	var h = this.h;
	var win = this.win;
	var p = this.getAbsLeftTop();
	var rWin = {x:win.x-w, y:win.y-h, w:win.w+w, h:win.h+h};

	p.w = w;
	p.h = h;
	p.x -= win.xOffset;
	p.y -= win.yOffset;

	var ret = Rect.hasIntersection(p, rWin);
	if(!ret) {
		this.remove(true, false);
		console.log("checkIfOutside remove outside body:" + this.name);
	}
}

UIBody.prototype.onInit = function() {
	if(this.autoDestroyWhenOutside) {
		this.on("moved", this.checkIfOutside.bind(this));
	}
}

UIBody.prototype.paintSelfOnly = function(canvas) {
	var needStroke = this.needStroke();
	var needFill = !this.isFillColorTransparent();

	if(!needFill && !needStroke) {
		return;
	}

	canvas.beginPath();
	this.drawShape(canvas);

	if(needFill) {
		canvas.fillStyle = this.style.fillColor;
		canvas.fill();
	}

	if(needStroke) {
		if(this.noStroke) {
			canvas.setLineDash([5, 5]);	
		}

		canvas.lineWidth = this.style.lineWidth;
		canvas.strokeStyle = this.style.lineColor;
		canvas.stroke();
	}

	return;
}
