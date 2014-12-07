/*
 * File: utils.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: some functions to help load dragbones.
 * Web: https://github.com/drawapp8 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */


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

