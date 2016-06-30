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

/**
 * @method setSensor
 * 设置刚体为感应器。感应器可以产生碰撞的事件，但不会有碰撞的效果(直接穿越过对方)。
 * @param {Boolean} isSensor 是否为感应器。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method getDensity
 * 获取刚体的密度。
 * @return {Number} 返回刚体的密度。
 *
 */

/**
 * @method setRestitution
 * 设置刚体的弹力系数。
 * @param {Number} restitution 刚体的弹力系数。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method getRestitution
 * 获取刚体的弹力系数。
 * @return {Number} 返回刚体的弹力系数。
 *
 */

/**
 * @method setFriction
 * 设置刚体的摩擦系数。
 * @param {Number} friction 刚体的摩擦系数。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method getFriction
 * 获取刚体的摩擦系数。
 * @return {Number} 返回刚体的摩擦系数。
 *
 */

/**
 * @method setDensity
 * 设置刚体的密度。
 * @param {Number} density 刚体的密度。 
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method setV
 * 设置刚体的线性速度，x，y的取值为null/undefined时，保留原来的值。
 * @param {Number} x 水平方向上的速度，向右为正，向左为负。
 * @param {Number} y 垂直方向上的速度，向下为正，向上为负。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method getV
 * 获取刚体的线性速度。
 * @return {Point} 返回刚体的线性速度。
 *
 */

/**
 * @method addV
 * 增加刚体的线性速度。
 * @param {Number} dx 水平方向上的速度增量。
 * @param {Number} dy 垂直方向上的速度增量。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method getMass
 * 获取刚体的质量。
 * @return {Number} 返回刚体的质量。
 *
 */

/**
 * @method applyTorque
 * 作用一个力矩到刚体上。
 * @param {Number} torque
 * @return {UIElement} 返回控件本身。
 *
 */

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

/**
 * @method setGroupIndex
 * 设置刚体的分组。
 * @param {Number} groupIndex 相同负数分组的刚体之间不会碰撞。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method getGroupIndex
 * 获取刚体的分组。
 * @return {Number} 返回控件的分组。
 *
 */

/**
 * @method getBody
 * 获取box2d的刚体对象。在特殊情况下，需要直接操作box2d，请使用本函数。
 * @return {Object} 返回box2d的刚体对象。
 *
 * 参考：[http://www.box2dflash.org/docs/2.1a/reference/](http://www.box2dflash.org/docs/2.1a/reference/)
 */

/**
 * @method boom
 * 通过这个方法向刚体周围放射作用力，达到爆炸效果。
 * @param {Number} range 爆炸的作用半径范围。
 * @param {Number} force 爆炸产成的作用力大小。
 * @param {Boolean} removeSelf 是否删除空间本身。
 */

