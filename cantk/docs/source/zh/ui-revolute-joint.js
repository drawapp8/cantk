/**
 * @class UIRevoluteJoint
 * @extends UIElement
 * 转动关节。它将两个刚体钉在一起，或者把一个刚体钉在场景上。
 * 可以设置马达参数、 角度限制和其他参数，来决定两个刚体之间的相对运动。
 *
 */

/**
 *  @method setEnable
 *  设置启用马达。
 *  @return {UIElement} 返回控件本身
 *  
 */

/**
 * @method isEnable
 * 获取是否启用马达
 * @return {Boolean} 返回是否启用马达
 *
 */

/**
 * @method setMaxMotorTorque
 * 设置最大马达力矩
 * @return {UIElement} 返回控件本身
 *
 */

/**
 * @method getMotorTorque
 * 获取马达力矩。
 * @return {Number} 返回马达力矩。
 *
 */

/**
 * @method setLimitEnable
 * 设置马达角度限制。
 * @param {Boolean} enable 是否启用马达角度限制。
 * @return {UIElement} 返回控件本身。
 * 
 */

/**
 * @method getLimitEnable
 * 获取马达角度限制。
 * @return {Boolean} 是否开启了角度限制。
 * 
 */

/**
 * @method setLimits
 * 设置马达限制的角度范围，只有开启了马达限制才会生效。
 * @param {Number} lower 角度下限(弧度)。
 * @param {Number} upper 角度上限(弧度)。
 * @return {UIElement} 返回控件本身。
 * 
 */

/**
 * @method getJointAngle
 * 获取关节角度。
 * @return {Number} 返回关节的旋转角度。
 *
 */

/**
 * @method getJointSpeed
 * 获取关节转动速度。
 * @return {Number} 返回关节转动速度。
 *
 */

/**
 * @method setMotorSpeed
 * 设置马达的转速（只有在启用马达时有效）。
 * @param {Number} motorSpeed 转速。单位为弧度，正数顺时针转，负数逆时针转。 
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method getJoint
 * 获取Box2d的Joint对象。
 * @return {Object} 返回Joint对象。
 *
 * 参考：http://bacon2d.com/docs/qml-bacon2d-revolutejoint.html
 *
 */

/**
 * @method getMotorSpeed
 * 获取马达的转速。
 * @return {Number} 返回马达的转速。
 *
 */

