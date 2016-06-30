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

/**
 * @method start
 * 启动粒子产生器，除非调用了stop，一般不需手工调用它。
 * 如果对已经启动的粒子编辑器调用该接口，系统会清空当前粒子编辑器状态，并重新生成。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method stop
 * 调用该接口，粒子发射器将不再发射新的粒子，已经发射的粒子会随着生命周期的结束而消失。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method pause
 * 暂停。调用该接口，相当于一个时间停滞的效果，粒子发射器将暂停发射新的粒子，已经发射的粒子停留在该时刻的状态。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method resume 
 * 恢复。恢复粒子发射、更新粒子状态。
 * @return {UIElement} 返回控件本身。
 *
 */

