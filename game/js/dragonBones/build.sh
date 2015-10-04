#!/bin/sh

cat extends.js > debug-bones.js
cat Matrix.js >> debug-bones.js
cat Rectangle.js >> debug-bones.js
cat DisplayObjectProperties.js >> debug-bones.js
cat DisplayObjectPrivateProperties.js >> debug-bones.js
cat DisplayObject.js >> debug-bones.js
cat DisplayObjectContainer.js >> debug-bones.js
cat MainContext.js >> debug-bones.js
cat CanvasRenderer.js >> debug-bones.js
cat Bitmap.js >> debug-bones.js
cat SpriteSheet.js >> debug-bones.js

cat dragonbones.js >> debug-bones.js

mv debug-bones.js ../
