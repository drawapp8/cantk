/**
 * @class Point
 * 点。
 */

/**
 * @property {Number} x 
 * x 坐标
 */

/**
 * @property {Number} y
 * y 坐标
 */

/**
 * @class Rect 
 * 矩形。
 */

/**
 * @property {Number} x 
 * x 坐标
 */

/**
 * @property {Number} y
 * y 坐标
 */

/**
 * @property {Number} w
 * 宽度
 */

/**
 * @property {Number} h
 * 高度
 */

/**
 * @class WImage
 * 图片对象，它包含一个HTMLImage对象和一个区域。
 */

/**
 * @method getImage
 * 获取HTMLImage对象
 */

/**
 * @method getImageRect
 * 获取图片区域。
 * @return {Rect} 图片区域。
 */

/**
 * @class AnimationConfig
 * 动画配置信息。
 */

/**
 * @property {Number} delay
 * 延迟播放时间，单位为毫秒。
 */

/**
 * @property {Number} duration
 * 动画持续时间，单位为毫秒。
 */

/**
 * @property {Number} xStart
 * 控件的X坐标起始位置。
 */

/**
 * @property {Number} yStart
 * 控件的Y坐标起始位置。
 */

/**
 * @property {Number} x
 * 控件的X坐标结束位置。
 */

/**
 * @property {Number} xEnd
 * 控件的X坐标结束位置。
 */

/**
 * @property {Number} y
 * 控件的Y坐标结束位置。
 */

/**
 * @property {Number} yEnd
 * 控件的Y坐标结束位置。
 */

/**
 * @property {Number} opacityStart
 * 控件的透明度起始值(取值0-1)。
 */

/**
 * @property {Number} opacity
 * 控件的透明度结束值(取值0-1)。
 */

/**
 * @property {Number} opacityEnd
 * 控件的透明度结束值(取值0-1)。
 */

/**
 * @property {Number} rotationStart
 * 控件的角度起始值(单位为幅度)。
 */

/**
 * @property {Number} rotation
 * 控件的角度结束值(单位为幅度)。
 */

/**
 * @property {Number} rotationEnd
 * 控件的角度结束值(单位为幅度)。
 */

/**
 * @property {Number} scaleXStart
 * 控件的X轴缩放比起始值。
 */

/**
 * @property {Number} scaleX
 * 控件的X轴缩放比结束值。
 */

/**
 * @property {Number} scaleXEnd
 * 控件的X轴缩放比结束值。
 */

/**
 * @property {Number} scaleYStart
 * 控件的Y轴缩放比起始值。
 */

/**
 * @property {Number} scaleY
 * 控件的Y轴缩放比结束值。
 */

/**
 * @property {Number} scaleYEnd
 * 控件的Y轴缩放比结束值。
 */

/**
 * @property {Number} scaleStart
 * 控件的缩放比起始值。
 */

/**
 * @property {Number} scale
 * 控件的缩放比结束值。
 */

/**
 * @property {Number} scaleEnd
 * 控件的缩放比结束值。
 */

/**
 * @property {String} interpolator
 * 控件动画插值器，目前支持三种：'linear'(匀速)、'bounce'(反弹)、'accelerate'（加速）、'accelerate-decelerate'（先加速后减速），可以分别简写为：'l'、'b'、'a'、'ad'。
 */

/**
 * @property {Function} onDone(name)
 * 动画完成时的回调函数，如果参数onDone不为空，优先使用参数的onDone。
 */

/**
 * @property {String} actionWhenBusy
 * 动画正在进行时，处理本次请求的方法：“replace”:表示替换当前动画，"append":追加到当前动画后面播放。
 */

/**
 * @class Global 
 *
 * Global并不是一个类，只是一些全局函数的集合，可以通过window对象或直接使用。
 *
 */

/**
 * @method webappGetText
 * 获取文本对应与当前语言的翻译的文本。
 *
 * 在Hola Studio中，工具菜单里有国际化设置，把翻译数据放在里面即可，通常引擎会根据这些设置自动翻译控件上的文字。
 *
 * 但有的文本是需要动态修改的，比如提示玩家的分数，此时可以webappGetText通过获取文本，替换调成实际的分数，再显示出来。
 *
 * @param {String} text 
 * @return {String} 翻译后的文本。
 *
 * 示例：
 *
 *     @example small frame
 *     var str = webappGetText("Your Scores Is {score}");
 *     str = str.replace(/{score}/, 100);
 *     this.win.find("score", true).setText(str)；
 */

/**
 * @method httpGetURL
 * 通过AJAX去请求一个URL。
 * @param {String} url URL
 * @param {Function} onDone 完成时的回调函数。
 * @param {Boolean} autoProxy (可选) 在Studio中预览时是否启用代理。
 * @param {Boolean} withCredentials (可选) 跨域访问时是否发送凭据(cookie、HTTP认证及客户端SSL证明等)。
 *
 * 跨域访问请参考: [https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS](//developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)
 *
 * 示例：
 *
 *     @example small frame
 *     httpGetURL("http://bcs.duapp.com/demogames/games/warrior/weapon2-pro.json", function(result, xhr, content) {
 *         console.log(content);
 *     },true);
 */

/**
 * @method httpPostURL
 * 通过AJAX去请求一个URL。
 * @param {String} url URL
 * @param {String} data POST的数据。
 * @param {Function} onDone 完成时的回调函数。
 * @param {Boolean} autoProxy (可选) 在Studio中预览时是否启用代理。
 * @param {Boolean} withCredentials (可选) 跨域访问时是否发送凭据(cookie、HTTP认证及客户端SSL证明等)。
 *
 * 跨域访问请参考: [https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS](//developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)
 *
 * 示例：
 *
 *     @example small frame
 *     var win = this.getWindow();
 *     var name = win.getValueOf("name");
 *     var tel = win.getValueOf("tel");
 *     var address = win.getValueOf("address");
 *     
 *     var formData = new FormData();
 *     formData.append("name", name);
 *     formData.append("tel", tel);
 *     formData.append("address", address);
 *     
 *     httpPostURL("http://xxxxx", formData, function(result, xhr, content) {
 *         console.log("httpPostURL:" + content);
 *     })
 */

/**
 * @method httpGetJSON
 * 通过AJAX去请求一个URL，并把返回数据解析为JSON对象。
 * @param {String} url URL
 * @param {Function} onDone 完成时的回调函数。
 * @param {Boolean} autoProxy (可选) 在Studio中预览时是否启用代理。
 * @param {Boolean} withCredentials (可选) 跨域访问时是否发送凭据(cookie、HTTP认证及客户端SSL证明等)。
 *
 * 跨域访问请参考: [https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS](//developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)
 *
 * 示例：
 *
 *     @example small frame
 *     httpGetJSON("http://bcs.duapp.com/demogames/games/warrior/weapon2-pro.json", function(jsObject) {
 *        console.log(jsObject);
 *     },true);
 */

/**
 * @method httpGetJSONP
 * 通过JSONP去请求一个URL。
 * @param {String} url URL
 * @param {Function} onDone 完成时的回调函数。
 * @param {Object} options (可选) options.jsonp可以指定回调函数的关键字(缺省为"callback")。
 *
 * 示例：
 *
 *     @example small frame
 *     function onDone(data) {
 *        console.log("data:" + JSON.stringify(data));
 *     }
 *   
 *     httpGetJSONP("http://192.168.8.100:8000", onDone);
 *   
 *     function onDone(data) {
 *         console.log("data:" + JSON.stringify(data));
 *     }
 *   
 *     httpGetJSONP("http://192.168.8.100:8000", onDone, {jsonp:"fn"});
 */

/**
 * @method isAndroid
 * 判断当前是否是android系统。
 * @return {Boolean} true表示当前是android系统, false表示不是。
 *
 */

/**
 * @method isIPhone 
 * 判断当前是否是iphone系统。
 * @return {Boolean} true表示当前是iphone系统, false表示不是。
 *
 */

/**
 * @method isIPad 
 * 判断当前是否是ipad系统。
 * @return {Boolean} true表示当前是ipad系统, false表示不是。
 *
 */

/**
 * @method isFirefoxOS 
 * 判断当前是否是firefox os系统。
 * @return {Boolean} true表示当前是firefox os系统, false表示不是。
 *
 */

/**
 * @method isWinPhone 
 * 判断当前是否是windows phone系统。
 * @return {Boolean} true表示当前是windows phone系统, false表示不是。
 *
 */

/**
 * @method isBlackBerry 
 * 判断当前是否是black berry 系统。
 * @return {Boolean} true表示当前是black berry系统, false表示不是。
 *
 */

/**
 * @method isMacOSX
 * 判断当前是否是mac os系统。
 * @return {Boolean} true表示当前是mac os系统, false表示不是。
 *
 */

/**
 * @method isHolaPlay
 * 判断当前是否是hola play系统。
 * @return {Boolean} true表示当前是hola play系统, false表示不是。
 *
 */

/**
 * @method isWebAudioSupported
 * 判断当前是否支持WebAudio。isHolaPlay()或isWebAudioSupported()为true时，声音有完整的支持。
 * @return {Boolean} true表示当前支持WebAudio, false不支持WebAudio
 *
 */

