#!/bin/sh

cat ./util/extends.js > debug-bones.js
cat ./util/Matrix.js >> debug-bones.js
cat ./util/NumberUtils.js >> debug-bones.js
cat ./util/Rectangle.js >> debug-bones.js
cat ./render/display_object.js >> debug-bones.js
cat ./render/display_container.js >> debug-bones.js
cat ./render/MainContext.js >> debug-bones.js
cat ./render/bitmap.js >> debug-bones.js

cat dragonbones.js >> debug-bones.js

cat ./adapter/hola_factory.js >> debug-bones.js
cat ./adapter/hola_slot.js >> debug-bones.js
cat ./adapter/hola_fast_slot.js >> debug-bones.js
cat ./adapter/texture_atlas.js >> debug-bones.js

mv debug-bones.js ../
