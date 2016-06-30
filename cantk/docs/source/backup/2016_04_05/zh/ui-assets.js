/**
 * @class UIAssets
 * @extends UIElement
 * 资源管理控件，可以添加一组资源(如图片、JSON和其它数据)，导出时自动导出这些资源，运行时可以用loadImage/loadData/loadJSON来获取相应的资源。
 *
 * 资源管理控件主要用于管理普通控件没有引用到的资源，比如游戏需要的关卡数据，动态创建的控件需要的图片和JSON等等。
 *
 * 使用方法：
 *
 * 1.放入UIAssets控件。
 *
 * 2.双击UIAssets打开资源管理对话框。
 *
 * 3.点击“添加"按钮添加资源。
 *
 * 4.点击“确定"按钮保存配置。
 *
 * 5.在程序中使用请参考后面的示例。
 *
 */

/**
 * @method getAssetInfo
 * 获取指定名称的资源的相关信息。
 * @param {String} name 资源的名称。
 * @return {Object} 返回资源的信息。.name表示资源的名称, .url资源的URL,  .type资源的类型。
 *
 */

/**
 * @method getAssetURL
 * 获取指定名称的资源的URL。
 * @param {String} name 资源的名称。
 * @return {Object} 返回资源的URL。
 *
 *     @example small frame
 *
 *     var win = this.win;
 *     var url = win.find("assets").getAssetURL("t.jpg");
 *     win.find("image").setValue(url);
 */

/**
 * @method loadJSON 
 * 加载指定名称的JSON数据。
 * @param {String} name 资源的名称。
 * @param {Function} onDone onDone(json) 加载完成时的回调函数。
 * @return {Boolean} false表示没有找到指定名称的资源，不会调用onDone函数。true表示开始加载，无论加载是否成功都会调用onDone函数。
 *
 *     @example small frame
 *
 *     function onJsonLoad(json) {
 *          console.log("onJsonLoad:" + JSON.stringify(json, null, "\t"));
 *     }
 *     this.win.find("assets").loadJSON("test.json", onJsonLoad.bind(this));
 */

/**
 * @method loadImage
 * 加载指定名称的图片。
 * @param {String} name 资源的名称。
 * @param {Function} onDone onDone(img) 加载完成时的回调函数。
 * @return {Boolean} false表示没有找到指定名称的资源，不会调用onDone函数。true表示开始加载，无论加载是否成功都会调用onDone函数。
 *
 *     @example small frame
 *
 *     function onImageLoad(img) {
 *          this.win.find("image").setValue(img);
 *     }
 *     this.win.find("assets").loadImage("t.jpg", onImageLoad.bind(this));
 */

/**
 * @method loadData
 * 加载指定名称的文本数据。
 * @param {String} name 资源的名称。
 * @param {Function} onDone onDone(str) 加载完成时的回调函数。
 * @return {Boolean} false表示没有找到指定名称的资源，不会调用onDone函数。true表示开始加载，无论加载是否成功都会调用onDone函数。
 *
 *     @example small frame
 *     
 *     function onDataLoad(data) {
 *          console.log("onDataLoad:" + data);
 *     }
 *     this.win.find("assets").loadData("test.txt", onDataLoad.bind(this));
 */

