/**
 * @class HolaSDK
 * HolaSDK。广告，分享和统计等API。
 *
 * 所有函数通过HolaSDK直接调用。示例：
 * 
 *     @example small frame
 *     HolaSDK.exit()
 *
 */

/**
 * @method showAd
 * 显示广告(一般不需要直接调用)。
 * @param {String} placementID 位置ID。
 * @param {Number} placementType 类型。 
 * @param {Number} impressionTime 显示时间。
 * @param {Boolean} closable 是否可关闭。
 *
 */

/**
 * @method closeAd
 * 关闭广告(一般不需要直接调用)。
 */

/**
 * @method share
 * 分享(在分享按钮的Click事件中填写相应参数即可)。
 * @param {String} title 标题。
 * @param {String} description 描述。
 * @param {String} link 链接。
 * @param {String} icon 图标。
 *
 */

/**
 * @method sendBarrage
 * 发送弹幕。
 * @param {Number} score 当前分数。 
 * @param {Number} level 当前关数。
 * @param {Number} duration 游戏时间(毫秒)。
 *
 */

/**
 * @method ping
 * 更新游戏状态。
 * @param {Number} score 当前分数。 
 * @param {Number} level 当前关数。
 * @param {Number} duration 游戏时间(毫秒)。
 *
 */

/**
 * @method whenPaused
 * 注册暂停事件的回调函数。
 * @param {Function} callback 
 *
 */

/**
 * @method whenResumed
 * 注册恢复事件的回调函数。
 * @param {Function} callback 
 *
 */

/**
 * @method whenRestarted
 * 注册重玩事件的回调函数。游戏盒子上的Replay按钮被按下时触发本事件。
 * @param {Function} callback 
 *
 */

/**
 * @method gameStarted
 * 游戏开始时调用(用于更新统计信息)。
 * @param {Number} level 当前关数。
 *
 */

/**
 * @method gamePaused
 * 游戏暂停时调用(用于更新统计信息)。
 *
 */

/**
 * @method gameResumed
 * 游戏恢复时调用(用于更新统计信息)。
 *
 */

/**
 * @method gameOver
 * 游戏结束时调用(用于更新统计信息)。
 * @param {Number} score 当前分数。 
 * @param {Number} level 当前关数。
 * @param {Number} duration 游戏时间(毫秒)。
 *
 */

/**
 * @method exit
 * 退出游戏，返回游戏大厅。
 *
 */

