echo "var gCantkBuildDate = \"$(date)\";console.log(\"cantk build date: \" + gCantkBuildDate);" >version.js

mkdir -p build
cat $(cat files) >build/cantkraw-debug.js

cat base/js/base-debug.js module_start.js build/cantkraw-debug.js module_end.js > build/cantk-debug.js
cat base/js/base-debug.js build/cantkraw-debug.js > build/cantk-ide.js

uglifyjs build/cantkraw-debug.js -m > build/cantkraw.js
uglifyjs build/cantk-debug.js -m > build/cantk.js
cp -f build/cantk-debug.js js
cp -f build/cantk.js js
gzip -f --keep js/cantk.js

