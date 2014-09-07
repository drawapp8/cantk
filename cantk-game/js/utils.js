/*
 * File: utils.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: some functions to help load dragbones.
 * Web: https://github.com/drawapp8 
 * Copyright (c) 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function createXMLHttpRequest() {
	var XMLHttpRequest = (function () {
		if (typeof window === 'undefined') {
			throw new Error('no window object present');
		}
		else if (window.XMLHttpRequest) {
			return window.XMLHttpRequest;
		}
		else if (window.ActiveXObject) {
			var axs = [
				'Msxml2.XMLHTTP.6.0',
				'Msxml2.XMLHTTP.3.0',
				'Microsoft.XMLHTTP'
			];
			for (var i = 0; i < axs.length; i++) {
				try {
					var ax = new(window.ActiveXObject)(axs[i]);
					return function () {
						if (ax) {
							var ax_ = ax;
							ax = null;
							return ax_;
						}
						else {
							return new(window.ActiveXObject)(axs[i]);
						}
					};
				}
				catch (e) {}
			}
			throw new Error('ajax not supported in this browser')
		}
		else {
			throw new Error('ajax not supported in this browser');
		}
	})();

	return new XMLHttpRequest();
}

function httpDoRequest(info) {
	var	xhr = createXMLHttpRequest();

	if(!info || !info.url) {
		return false;
	}

	var url = info.url;
	var data = info.data;
	var method = info.method ? info.method : "GET";

	//cross domain via proxy.
	if(!info.noProxy && url.indexOf("http") === 0 && url.indexOf(window.location.hostname) < 0) {
		url = '/proxy.php?url=' + window.btoa(url) + '&mode=native&full_headers=1&send_cookies=1&send_session=0';

		if(info.headers && info.headers["User-Agent"]) {
			var ua = info.headers["User-Agent"];
			url = url + "&ua="+ encodeURI(ua);
			delete info.headers["User-Agent"];
		}
	}
	
	xhr.open(method, url, true);

	if(info.noCache) {
		xhr.setRequestHeader('If-Modified-Since', '0');
	}

	if(info.headers) {
		for(var key in info.headers) {
			var value = info.headers[key];
			xhr.setRequestHeader(key, value);
		}
	}

	if(xhr) {
		xhr.send(info.data ? info.data : null);
		
		if(!xhr.onprogress) {
			xhr.onreadystatechange = function() {
				if(info.onProgress) {
					info.onProgress(xhr);
				}
				if(xhr.readyState === 4) {
					if(info.onDone) {
						info.onDone(true, xhr, xhr.responseText);
					}
				}
				//console.log("onreadystatechange:" + xhr.readyState);
				return;
			}
		}
		else {
			xhr.onprogress = function(e)  {
				var total = e.total;
				if(info.onProgress) {
					info.onProgress(xhr);
				}
				console.log("get:" + total);
			 }
			
			xhr.onload = function(e)  {
				if(info.onDone) {
					info.onDone(true, xhr, e.target.responseText);
				}
			}
			
			xhr.onerror = function(e)  {
				if(info.onDone) {
					info.onDone(false, xhr, xhr.responseText);
				}
			}
		}
	}

	return true;
}

function httpGetURL(url, onDone) {
	var rInfo = {};
	rInfo.url = url;
	rInfo.onDone = onDone;

	httpDoRequest(rInfo);

	return;
}

function httpGetJSON(url, onDone) {
	httpGetURL(url, function(result, xhr, data) {
		var json = null;
		if(result) {
			json = JSON.parse(data);
		}
		onDone(json);
	})

	return;
}

///////////////////////////////////////////////////////////////////////////////////////////

function loadDragonBoneArmature(textureJsonURL, skeletonJsonURL, textureURL, onDone) {
	var texture = new Image();

	texture.onload = function()	{
		httpGetJSON(textureJsonURL, function(data) {
			var textureData = data;

			httpGetJSON(skeletonJsonURL, function(data) {
				var skeletonData = data;
				var factory = new dragonBones.factorys.GeneralFactory();

				factory.addSkeletonData(dragonBones.objects.DataParser.parseSkeletonData(skeletonData));
				factory.addTextureAtlas(new dragonBones.textures.GeneralTextureAtlas(texture, textureData));
			
				for(var i = 0; i < skeletonData.armature.length; i++) {
					var name = skeletonData.armature[i].name;
					var armature = factory.buildArmature(name);

					if(i === 0) {
						onDone(armature);
					}
				}
			});
		});
	}

	texture.src = textureURL;

	return;
}

function onArmatureCreated(armature) {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	armature.setPosition(300, 300);

	function update() {
		ctx.clearRect(0,0,canvas.width, canvas.height);

		dragonBones.animation.WorldClock.clock.advanceTime(1/60);

		armature.draw(ctx);

		setTimeout(update, 16);
	}
	
	function changeAnimation() 	{
		do	{
			var index = Math.floor(Math.random() * armature.animation.animationNameList.length);
			var animationName = armature.animation.animationNameList[index];
		}while (animationName == armature.animation.getLastAnimationName());

		armature.animation.gotoAndPlay(animationName);
	}
	
	canvas.onclick = changeAnimation;
	dragonBones.animation.WorldClock.clock.add(armature);

	changeAnimation();
	update();

	return;
}

