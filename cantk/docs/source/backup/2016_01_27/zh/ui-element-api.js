/**
 * @class UIElement 
 * 所有组件的基类，它通常是一个矩形区域，有一定的外观形状，并能处理用户事件。
 */

/**
 * @property {String} type
 * 控件的类型名称。如按钮的类型为"ui-button"，请不要修改。
 */

/**
 * @property {String} name
 * 控件的名称。
 */

/**
 * @property {UIElement} win
 * 控件所在的窗口或场景。
 *
 *     @example small frame
 *     var ball = this.win.find("ball");
 *     ball.setPosition(100, 100);
 */

/**
 * @property {Number} x
 * 在父控件中的X坐标。
 */

/**
 * @property {Number} y
 * 在父控件中的Y坐标。
 */

/**
 * @property {Number} anchorX
 * 控件的X锚点。
 */

/**
 * @property {Number} anchorY
 * 控件的Y锚点。
 */

/**
 * @property {Number} width
 * 控件的宽度。
 */

/**
 * @property {Number} height 
 * 控件的高度。
 */

/**
 * @property {Number} scaleX 
 * 控件的X方向的缩放系数。
 */

/**
 * @property {Number} scaleY
 * 控件的Y方向的缩放系数。
 */

/**
 * @property {Number} rotation 
 * 控件的旋转角度(弧度)。
 */

/**
 * @property {Number} opacity
 * 控件的不透明度(0-1)。
 */

/**
 * @property {Boolean} flipX 
 * 控件是否X方向翻转。
 */

/**
 * @property {Boolean} flipY 
 * 控件是否Y方向翻转。
 */

/**
 * @property {Boolean} visible
 * 控件是否对用户可见。
 */

/**
 * @property {Boolean} enable 
 * 控件是否接受用户事件（对于刚体来说，同时会决定刚体是否参与物理世界的运行）。
 */

/**
 * @property {Boolean} pointerDown
 * 指针是否按下。
 */

/**
 * @method setPosition
 * 设置控件的位置。
 * @param {Number} x 在父控件上的X坐标。
 * @param {Number} y 在父控件上的Y坐标。
 * @return {UIElement} 返回控件本身。
 *
 * 示例：
 *
 *     @example small frame
 *     var ball = this.win.find("ball");
 *     ball.setPosition(100, 100);
 */

/**
 * @method setAnchor
 * 设置控件的锚点。
 * @param {Number} x 0到1表示从控件左边到右边的位置。比如0.5表示中间。
 * @param {Number} y 0到1表示从控件顶部到底部的位置。比如0.5表示中间。
 * @return {UIElement} 返回控件本身。
 *
 * 示例：把物体移动到场景的中间位置。
 *
 *     @example small frame
 *     var win = this.win;
 *     var ball = win.find("ball");
 *     ball.setAnchor(0.5, 0.5);
 *     ball.setPosition(win.width>>1, win.height>>1);
 */

/**
 * @method setPivot
 * 设置控件的旋转轴点(不适用于刚体)。
 * @param {Number} x 0到1表示从控件左边到右边的位置。比如0.5表示中间。
 * @param {Number} y 0到1表示从控件顶部到底部的位置。比如0.5表示中间。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method setName
 * 设置控件的名称。
 * @param {String} name 名称。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method setOpacity
 * 设置控件的不透明度。
 * @param {Number} opacity 透明度，取值范围(0~1)。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method forEach
 * 遍历所有子控件，callback返回true时停止遍历。
 * @param {Function} callback 函数原型 function(child) {}
 *
 */

/**
 * @method getTarget
 * 获取处理指针事件的子控件。通常用来判断玩家点击了哪个控件。
 * @return {UIElement} 处理指针事件的子控件。
 *
 */

/**
 * @method getOpacity
 * 获取控件的不透明度。
 * @return {Number} 返回对象的不透明度。
 *
 */

/**
 * @method setValue
 * 设置控件的值，不同控件的值有不同的意义，如进度条的值时进度，按钮的值就是上面的文本。
 * @param {Number} value 新的值。
 * @param {Boolean} notify 是否触发onChanged事件。
 * @param {Boolean} animation 是否启用动画(只能用于数值的值)。
 * @return {UIElement} 返回控件本身。
 *
 * 示例：设置进度条的进度。
 *
 *     @example small frame
 *     var win = this.win;
 *     var progressbar = win.find("progressbar");
 *     progressbar.setValue(80, false, true);
 */

/**
 * @method getValue
 * 获取控件的值。
 * @return {Number} 返回对象的值。
 *
 */

/**
 * @method addValue 
 * 在当前的数值上加上一个增量(只能用于数值的值)。
 * @param {Number} delta 增量，可以为负数。
 * @param {Boolean} notify 是否触发onChanged事件。
 * @param {Boolean} animation 是否启用动画。
 * @return {UIElement} 返回控件本身。
 *
 * 示例：设置进度条的进度。
 *
 *     @example small frame
 *     var win = this.win;
 *     var progressbar = win.find("progressbar");
 *     progressbar.addValue(20, false, true);
 */

/**
 * @method setValueOf
 * 设置子控件的值。
 * @param {String} name 子控件的名字。
 * @param {Number} value 值。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method getValueOf
 * 获取子控件的值。
 * @param {String} name 子控件的名字。
 * @return {Number} 返回对象的值。
 *
 */

/**
 * @method setScale
 * 设置控件的缩放比例。
 * @param {Number} x x方向的缩放比例。
 * @param {Number} y y方向的缩放比例。
 * @return {UIElement} 返回控件本身。
 *
 * 注意：缩放比例不改变控件额实际大小和刚体碰撞检测的区域。
 */

/**
 * @method setScaleX
 * 设置控件x方向的缩放比例。
 * @param {Number} scale x方向的缩放比例。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method setScaleY
 * 设置控件y方向的缩放比例。
 * @param {Number} scale y方向的缩放比例。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method getScaleX
 * 获取控件x方向的缩放比例。
 * @return {Number} x方向的缩放比例。
 *
 */

/**
 * @method getScaleY
 * 获取控件y方向的缩放比例。
 * @return {Number} y方向的缩放比例。
 *
 */

/**
 * @method setSize
 * 设置控件的位置。
 * @param {Number} w 控件的宽度。
 * @param {Number} h 控件的高度。
 * @return {UIElement} 返回控件本身。
 *
 * 示例：
 *
 *     @example small frame
 *     var ball = this.win.find("ball");
 *     ball.setSize(100, 100);
 */

/**
 * @method setText
 * 设置控件的文本内容，如控件上的文字。
 * @param {String} text 文本内容
 * @param {Boolean} notify 是否触发onChanged事件。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method getText
 * 获取控件的文本内容，如控件上的文字。
 * @return {String} 文本内容。
 */

/**
 * @method getParent
 * 获取控件的父控件。
 * @return {UIElement} 父控件。
 */

/**
 * @method find
 * 按名称查找子控件。
 * @param {String} name 子控件的名字。
 * @param {Boolean} recursive 是否递归查找。
 * @return {UIElement} 返回子控件。
 *
 *     @example small frame
 *     var ball = this.win.find("ball");
 *     ball.setPosition(100, 100);
 */

/**
 * @method findChildByPoint
 * 按点击位置查找子控件。
 * @param {Point} point
 * @param {Boolean} recursive 是否递归查找。
 * @param {Function} checkFunc 回调函数用于检查是否是需要的控件。
 * @return {UIElement} 返回子控件。
 *
 *     @example small frame
 *     var targetElement = this.findChildByPoint(point, true, function(child) {
 *         //Skip dragger self
 *         return child !== dragger;
 *     });
 */

/**
 * @method isAnimating
 * 判断animate是否完成。
 * @return {Boolean}
 */

/**
 * @method animate
 * 让控件动起来。
 * @param {AnimationConfig} config 动画配置信息或用动画编辑器创建的动画的名称。
 * @param {Function} onDone (可选) 完成时的回调函数。
 * @param {Function} onStep (可选) 每一步的回调函数。
 *
 * 让控件从x=100，移动到x=300：
 *
 *     @example small frame
 *     this.animate({xStart:100, xEnd:300});
 *
 * 让控件从当前位置移动到x=300：
 * 
 *     @example small frame
 *     this.animate({x:300});
 * 
 * 让控件在x=100和300之间往返运动：
 *     
 *     @example small frame
 *     var toLeft ={xStart:100, xEnd:300};
 *     var toRight = {xEnd:100, xStart:300}
 *     toLeft.next = toRight;
 *     toRight.next = toLeft;
 *     this.animate(toLeft);
 *
 * 完成时播放另外一个动画：
 *     
 *     @example small frame
 *     var me = this;
 *     var win = this.getWindow();
 *     var tree = win.find("tree");
 *     var config = {xStart:100, xEnd:300};
 *     config.onDone = function() {
 *         this.animate({xEnd:config.xStart, xStart:config.xEnd});
 *     }
 *     tree.animate(config);
 *
 * 如果需要从一个状态变化到另外一个状态，请用Start/End方式，如果从当前的状态变化到另外一个状态，直接指定它的值就行了。
 */

/**
 * @method stopAnimation
 * 停止animate开启的动画。
 * @param {Boolean} callOnDone 是否调用动画结束的回调函数。
 */

/**
 * @method postRedraw
 * 请求系统重画控件。
 * @param {Rect} rect 要求更新区域，一般为null。
 */

/**
 * @method addChildWithJson
 * 通过json数据创建一个控件，并作为子控件加入当前控件。(推荐使用dupChild来动态创建对象)。
 * @param {Object} json JSON数据
 * @param {Number} index zIndex
 * @return {UIElement} 返回子控件。
 * 
 *     @example small frame
 *     var win = this.getWindow();
 *     
 *     var json = {
 *         "type": "ui-button",
 *         "name": "ui-button2-general",
 *         "w": 200,
 *         "h": 69,
 *         "x": 209,
 *         "y": 155,
 *         "text": "ok",   
 *         "images": {
 *             "display": 2,
 *             "active_bg": "drawapp8/images/common/buttons/green_button_active.png",
 *             "normal_bg": "drawapp8/images/common/buttons/green_button.png",
 *             "disable_bg": "drawapp8/images/common/buttons/green_button.png"
 *         }
 *     }
 *     
 *     var button = win.addChildWithJson(json, 0);
 */

/**
 * @method addChild
 * 加入控件到当前控件中。配合clone函数使用。
 * @param {UIElement} child 要加入的控件。
 * @param {Number} index zIndex
 * @return {UIElement} 返回子控件。
 */

/**
 * @method clone
 * 克隆当前控件。clone的对象是游离的，需要调用addChild加入到某个控件中。
 * @return {UIElement} 返回新控件。
 */

/**
 * @method remove 
 * 移除从父控件中当前控件。
 * @param {Boolean} destroyIt 移除时是否销毁控件。如果后面还会把它加入其它控件就不要销毁，否则销毁。
 * @param {Boolean} syncExec 是否同步执行。如果在当前控件的事件中执行，请使用异步执行。
 */

/**
 * @method dupChild
 * 复制指定的子控件，并加入当前控件中。
 * @param {String} name 子控件的名称。
 * @param {Number} index 新控件的zIndex
 * @return {UIElement} 返回新控件。
 * 
 * 简单用法
 *
 *     @example small frame
 *     var newImage = this.dupChild("image");
 *     newImage.setPosition(10, 10);
 *
 *     复制子对象，然后移到其它控件中。
 *
 *     @example small frame
 *     var win = this.getWindow();
 *     
 *     var newImage = win.dupChild("image");
 *     newImage.remove(false, true);
 *     newImage.setPosition(0, 0);
 *     win.find("ball").addChild(newImage);
 */

/**
 * @method getWindow
 * 获取当前控件所在的窗口/场景。可以直接使用属性win代替。
 * 这是一个很常用的函数，你需要通过这个函数得到窗口对象，然后通过窗口的find函数去找窗口上的其它控件。
 * @return {UIElement} 当前控件所在的窗口/场景。
 */

/**
 * @method openWindow 
 * 打开新窗口。目前有三种窗口：普通窗口，游戏场景和对话框。
 * @param {String} name 新窗口的名称。
 * @param {Function} onWindowClose onWindowClose(retInfo) (可选) 新窗口关闭时的回调函数。
 * @param {Boolean} closeCurrent (可选) 打开新窗口时是否关闭当前窗口。
 * @param {Object} initData (可选) 传递给新窗口的数据, 作为参数传递给新窗口的onOpen/onBeforeOpen事件。
 * @param {Object} options (可选) 其它参数。options.closeOldIfOpened 如果目标窗口已经打开，关闭它并重新打开。options.openNewIfOpened 如果目标窗口已经打开，打开新一个新窗口打开。
 *
 *     @example small frame
 *     this.openWindow("win-bonus",  function (retInfo) {console.log("window closed.");});
 */

/**
 * @method openScene
 * 本函数是对openWindow的包装。打开当前场景相当于重置当前场景，可以实现重玩的功能。
 * @param {String} name 新场景的名称。打开当前场景相当于重置当前场景，可以实现重玩的功能。
 * @param {Object} initData 传递给新窗口的数据, 作为参数传递给新窗口的onOpen/onBeforeOpen事件。
 */

/**
 * @method closeWindow
 * 关闭当前窗口。
 * @param {Object} retInfo 如果openWindow时指定了onWindowClose回调函数，retInfo会作为onWindowClose回调函数的参数。
 *
 *     @example small frame
 *     var retCode = 0;
 *     this.closeWindow(retCode);
 *
 */

/**
 * @method setFillColor
 * 设置控件的填充颜色。
 * @param {String} color 颜色。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method setLineColor
 * 设置控件的线条颜色。
 * @param {String} color 颜色。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method setTextColor
 * 设置控件的文本颜色。
 * @param {String} color 颜色。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method getFillColor
 * 获取控件的填充颜色。
 * @param {String} color 颜色。
 * @return {String} 颜色。
 */

/**
 * @method getLineColor
 * 获取控件的线条颜色。
 * @param {String} color 颜色。
 * @return {String} 颜色。
 */

/**
 * @method getTextColor
 * 获取控件的文本颜色。
 * @param {String} color 颜色。
 * @return {String} 颜色。
 */

/**
 * @method setImage
 * 设置控件的图片。
 * @param {String} type (可选, 缺省为背景图片)。不同的控件支持的type不一样，请参控具体的控件文档。
 * @param {Object} src 可以是图片的URL，Image对象，WImage对象或备用图片的索引。
 * @return {UIElement} 返回控件本身。
 *
 * 把图片1设置为当前的图片(请在IDE中预先设置控件的图片1)。
 *
 *     @example small frame
 *     this.win.find("image").setImage(1);
 *
 * 设置按钮的正常和指针按下的图片：
 *
 *     @example small frame
 *     this.setImage(UIElement.IMAGE_NORMAL, 0);
 *     this.setImage(UIElement.IMAGE_ACTIVE, 1);
 *
 */

/**
 * @method getImageByType
 * 获取控件的图片
 * @param {String} type 不同的控件支持的type不一样，请参控具体的控件文档。
 * @return {WImage} 图片
 */

/**
 * @method getImageSrcByType
 * 获取控件的图片
 * @param {String} type 不同的控件支持的type不一样，请参控具体的控件文档。
 * @return {String} 图片SRC
 */

/**
 * @method setTimeScale
 * 设置时间缩放系数，让游戏时间变快或变慢。
 * @param {Number} timeScale 时间缩放系数，0暂停，(0-1)变慢，1正常，大于1表示变快。
 * @return {UIElement} 返回控件本身。
 *
 * 暂停游戏：
 *
 *     @example small frame
 *     this.setTimeScale(0);
 */

/**
 * @method playSoundEffect
 * 播放音效。请先放一个音效控件到场景中，在音效控件的特有属性中添加音频文件。
 * 建议使用代码产生器来产生播放音效的代码。
 * @param {String} name 音效文件名，不用包含路径。
 * @param {Function} onDone (可选) 播放音效完成后的回调函数。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method playSoundMusic
 * 播放背景音乐。请先放一个背景音乐控件到场景中，在背景音乐控件的特有属性中添加音频文件。
 * 建议使用代码产生器来产生播放背景音乐的代码。
 * @param {String} name 背景音乐文件名，不用包含路径。
 * @param {Function} onDone (可选) 播放背景音乐完成后的回调函数。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method stopSoundEffect
 * 停止播放音效。
 * @param {String} name (可选) 音效文件名，不用包含路径。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method stopSoundMusic
 * 停止播放背景音乐。
 * @param {String} name (可选) 音乐文件名，不用包含路径。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method setSoundEffectVolume
 * 设置音效的音量。
 * @param {Number} volume 音量，范围0到1。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method setSoundMusicVolume
 * 设置音乐的音量。
 * @param {Number} volume 音量，范围0到1。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method setSoundEnable
 * 开启/禁止播放音效和背景音乐。
 * @param {Boolean} value 开启/禁止播放音效和背景音乐。 
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method getSoundEnable
 * 获取播放音效和背景音乐是否开启的状态。
 * @return {Boolean} 播放音效和背景音乐是否开启。
 */

/**
 * @method getPointerPosition
 * 获取指针(Mouse/Touch)在窗口(场景)中的位置。
 * @return {Point} 指针(Mouse/Touch)的位置。 
 */

/**
 * @method setSoundEffectsEnable
 * 开启/禁止播放音效。
 * @param {Boolean} value 开启/禁止播放音效。 
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method setSoundMusicsEnable
 * 开启/禁止播放背景音乐。
 * @param {Boolean} value 开启/禁止播放背景音乐。 
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method getAppInfo
 * 获取游戏APP的信息
 * @return {Object} APP信息
 *
 * APP信息示例： 
 *
 *     @example small frame
 *     {
 *       "appid":"com.tangide.demo",
 *       "appversion":"1.0.0",
 *       "appname":"Demo",
 *       "appdesc":"Demo",
 *       "gapversion":"1.0",
 *       "screenscale":"fix-width",
 *       "orientation":"portrait",
 *       "developer":"Unkown <unkown@tangide.com>",
 *       "appIcon":"/drawapp8/images/appicons/96.png",
 *       "screenShot1":"",
 *       "screenShot2":"",
 *       "screenShot3":""
 *     }
 */

/**
 * @method getChild
 * 获取指定位置的子控件。
 * @param {Number} index 子控件的索引。
 * @return {UIElement} 返回子控件。
 */

/**
 * @method getChildrenNr
 * 获取子控件的个数。
 * @return {Number} 返回子控件的个数。
 */

/**
 * @method setClipCircle
 * 设置控件的圆形裁剪区域。
 * @param {Number} x
 * @param {Number} y
 * @param {Number} r
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method setClipRect
 * 设置控件的矩形裁剪区域。
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 * @return {UIElement} 返回控件本身。
 *
 * 任意形状裁剪请重载onClip：
 *
 *     @example small frame
 *     var el = this.getWindow().find("el");
 *     
 *     el.onClip = function(ctx2d) {
 *         ctx2d.beginPath();
 *         ctx2d.moveTo(0, 0);
 *         ctx2d.lineTo(100, 100);
 *         ctx2d.lineTo(100, 200);
 *         ctx2d.closePath();
 *         ctx2d.clip();
 *     }
 */

/**
 * @method setRotation
 * 设置控件的旋转角度。
 * @param {Number} rotation 旋转的角度，单位是弧度。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method setFlipX
 * 设置是否水平翻转。
 * @param {Boolean} flipX 是否水平翻转。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method setFlipY
 * 设置是否垂直翻转。
 * @param {Boolean} flipY 是否垂直翻转。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method getPositionInWindow
 * 返回控件在窗口里的位置。
 * @return {Point} 位置信息。
 *
 */

/**
 * @method getVisible
 * 控件是否可见。
 * @return {Boolean} 是否可见
 *
 */

/**
 * @method setVisible
 * 显示/隐藏控件。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method setAnchorX
 * 设置控件的横向锚点。
 * @param {Number} x （范围0-1）。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method setAnchorY
 * 设置控件的纵向锚点。
 * @param {Number} y （范围0-1）。
 * @return {UIElement} 返回控件本身
 *
 */

/**
 * @method relayout
 * 重新布局控件。
 *
 */

/**
 * @method removeChild
 * 删除指定的child，如果destroyIt为真，同时销毁它。
 * @param {UIElement} child 子控件对象。
 * @param {Boolean} destroyIt 是否同时销毁child对象。
 * @param {Boolean} sync 是否同步执行，缺省异步执行。
 * @return {UIElement} 返回控件本身。
 * 
 */

/**
 * @method setEnable
 * 启用/禁用控件，不同的控件的表现有不同的意义，如UITimer被禁用时不触发onTimer事件，UIGSensor被禁用时不上报重力感应信息。
 * @param {Boolean} enable 是否启用控件。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method setZIndex
 * 设置控件在父控件中的位置序数。
 * @param {Number} z 位置序数。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method getZIndex
 * 获取控件在父控件中的位置序数。
 * @return {Number} 返回位置序数。
 *
 */

/**
 * @method pickImage 
 * 从当前系统中选择一张图片，返回file对象和DataURL。
 * @param {Function} onDone(file, dataURL) 选图成功后的回调函数。
 * @return 是否支持从本地读取图片。
 *
 * 选取图片:
 *
 *     @example pick image
 *     var image = this.getWindow().find("image");
 *     this.pickImage(function(name, url) {
 *         image.setValue(url);
 *         image.postRedraw();
 *     });
 *
 */

/**
 * @event onClick
 * 点击事件。
 * @param {Point} point 点击的位置。
 */

/**
 * @event onUpdateTransform
 * 绘制前事件。
 * @param {Object} canvas HTMLCanvasContext2d
 *
 * 实现按下时放大的效果：
 *
 *     @example small frame
 *     this.setScale(this.pointerDown ? 1.1 : 1);
 */

/**
 * @event onInit
 * 初始化事件。
 * 
 * 需要在自定义组件时添加，才会出现在IDE的事件列表中。
 *
 */

/**
 * @event onPointerDown
 * Pointer Down事件。在子控件处理前会触发一次，在子控件处理后会触发一次。
 * 
 * 需要在自定义组件时添加，才会出现在IDE的事件列表中。
 *
 * @param {Point} point 位置。
 * @param {Boolean} beforeChild 表示本次触发是在子控件处理前/后。
 */

/**
 * @event onPointerMove
 * Pointer Move事件。在子控件处理前会触发一次，在子控件处理后会触发一次。
 * 
 * 需要在自定义组件时添加，才会出现在IDE的事件列表中。
 *
 * @param {Point} point 位置。
 * @param {Boolean} beforeChild 表示本次触发是在子控件处理前/后。
 */

/**
 * @event onPointerUp
 * Pointer Up事件。在子控件处理前会触发一次，在子控件处理后会触发一次。
 * 
 * 需要在自定义组件时添加，才会出现在IDE的事件列表中。
 *
 * @param {Point} point 位置。
 * @param {Boolean} beforeChild 表示本次触发是在子控件处理前/后。
 */

