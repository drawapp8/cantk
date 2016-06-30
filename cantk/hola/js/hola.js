
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
function HolaSDK() {
}

HolaSDK.exec = function(action, options) {
	if(window.HolaF) {
		window.HolaF(action, options);
		console.log("HolaSDK.exec:" + action + ":" + (options ? JSON.stringify(options) : "{}"));
	}
	else {
		console.log("HolaSDK.exec(e):" + action + ":" + (options ? JSON.stringify(options) : "{}"));
	}
}

HolaSDK.init = function(appID, debug) {
	if(HolaSDK.initialized) {
		return;
	}

	var options = {};
	options.app_id = appID;
	options.debug = debug;

	HolaSDK.appID = appID;
	HolaSDK.initialized = true;
	HolaSDK.startTime = Date.now();
	HolaSDK.exec('GameJsAdSdk.init', options);
	console.log("HolaSDK.init done");
}

/**
 * @method showAd
 * 显示广告(一般不需要直接调用)。
 * @param {String} placementID 位置ID。
 * @param {Number} placementType 类型。 
 * @param {Number} impressionTime 显示时间。
 * @param {Boolean} closable 是否可关闭。
 *
 */
HolaSDK.showAd = function(placementID, placementType, impressionTime, closable) {
	var options = {};
	options.placement_id = HolaSDK.appID + '_' + placementID;
	options.placement_type = placementType;
	options.impression_time = impressionTime;
	options.closable = closable;

	HolaSDK.exec('GameJsAdSdk.showAd', options);
}

/**
 * @method closeAd
 * 关闭广告(一般不需要直接调用)。
 */
HolaSDK.closeAd = function() {
    if(!HolaSDK.initialized) return;
	HolaSDK.exec('GameJsAdSdk.closeAd');
}

/**
 * @method share
 * 分享(在分享按钮的Click事件中填写相应参数即可)。
 * @param {String} title 标题。
 * @param {String} description 描述。
 * @param {String} link 链接。
 * @param {String} icon 图标。
 *
 */
HolaSDK.share = function(title, description, link, icon) {
	var options = {};
	options.title = title;
	options.description = description;

	HolaSDK.exec('share', options);
}

HolaSDK.fixTime = function(duration) {
	if(duration > 1000) {
		duration = duration/1000;
	}

	return duration;
}

/**
 * @method sendBarrage
 * 发送弹幕。
 * @param {Number} score 当前分数。 
 * @param {Number} level 当前关数。
 * @param {Number} duration 游戏时间(毫秒)。
 *
 */
HolaSDK.sendBarrage = function(score, level, duration) {
	var options = {};
	options.score = score;
	options.level = level;
	options.duration = HolaSDK.fixTime(duration);
	HolaSDK.exec('Barrage.send', options);
}

/**
 * @method ping
 * 更新游戏状态。
 * @param {Number} score 当前分数。 
 * @param {Number} level 当前关数。
 * @param {Number} duration 游戏时间(毫秒)。
 *
 */
HolaSDK.ping = function(score, level, duration) {
	var options = {};
	options.score = score;
	options.level = level;
	options.duration = HolaSDK.fixTime(duration);
	HolaSDK.exec('Barrage.ping', options);
}

HolaSDK.onPaused = function() {
	if(HolaSDK.onPausedCallback) {
		HolaSDK.onPausedCallback();
	}
}

/**
 * @method whenPaused
 * 注册暂停事件的回调函数。
 * @param {Function} callback 
 *
 */
HolaSDK.whenPaused = function(callback) {
	HolaSDK.onPausedCallback = callback;

	HolaSDK.exec('Game.Event.onPause', HolaSDK.onPaused);
}

HolaSDK.onResumed = function() {
	if(HolaSDK.onResumedCallback) {
		HolaSDK.onResumedCallback();
	}
}

/**
 * @method whenResumed
 * 注册恢复事件的回调函数。
 * @param {Function} callback 
 *
 */
HolaSDK.whenResumed = function(callback) {
	HolaSDK.onResumedCallback = callback;

	HolaSDK.exec('Game.Event.onResume', HolaSDK.onResumed);
}

HolaSDK.onRestarted = function() {
	if(HolaSDK.onRestartedCallback) {
		HolaSDK.onRestartedCallback();
	}
}

/**
 * @method whenRestarted
 * 注册重玩事件的回调函数。游戏盒子上的Replay按钮被按下时触发本事件。
 * @param {Function} callback 
 *
 */
HolaSDK.whenRestarted = function(callback) {
	HolaSDK.onRestartedCallback = callback;

	HolaSDK.exec('Game.Event.onRestart', HolaSDK.onRestarted);
}

/**
 * @method gameStarted
 * 游戏开始时调用(用于更新统计信息)。
 * @param {Number} level 当前关数。
 *
 */
HolaSDK.gameStarted = function(level) {
	var options = {};
	options.level = level;

	HolaSDK.exec('Game.Status.start', options);
}

/**
 * @method gamePaused
 * 游戏暂停时调用(用于更新统计信息)。
 *
 */
HolaSDK.gamePaused = function() {
	HolaSDK.exec('Game.Status.pause');
}

/**
 * @method gameResumed
 * 游戏恢复时调用(用于更新统计信息)。
 *
 */
HolaSDK.gameResumed = function() {
	HolaSDK.exec('Game.Status.resume');
}

/**
 * @method gameOver
 * 游戏结束时调用(用于更新统计信息)。
 * @param {Number} score 当前分数。 
 * @param {Number} level 当前关数。
 * @param {Number} duration 游戏时间(毫秒)。
 *
 */
HolaSDK.gameOver = function(score, level, duration) {
	var options = {};
	options.score = score;
	options.level = level;
	options.duration = HolaSDK.fixTime(duration);
	HolaSDK.exec('Game.Status.over', options);
}

HolaSDK.gameRestarted = function() {
	console.log("HolaSDK.gameRestarted is not supported now!!!");
}

HolaSDK.gameExited = function() {
	HolaSDK.exec('Game.Status.exit');
}

/**
 * @method exit
 * 退出游戏，返回游戏大厅。
 *
 */
HolaSDK.exit = function() {
	HolaSDK.exec('Game.exit');
}


HolaSDK.getSDKURL = function() {
    return "http://game-ad-sdk.haloapps.com/static/abyhola/sdk/js_ad_sdk_loader.js?v=034";
}

window.HolaSDK = HolaSDK;

