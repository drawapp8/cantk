function genDebugJS() {
	echo "" > build/cantk-debug-all.js
	for f in files_webgl files_base files_box2d  files_dragonbones  files_particles  files_spine;
	do
		name="build/"${f/files_/cantk-debug-}".js"
		cat $(cat $f) > $name
		cat $name >> build/cantk-debug-all.js
	done
}

function mergeJS() {
	cat ../base/js/base-debug.js module_start.js build/cantk-debug-base.js module_end.js > build/cantk-debug-core.js
	cat ../base/js/base-debug.js module_start.js build/cantk-debug-all.js module_end.js > build/cantk-debug.js
	cat ../base/js/base-debug.js build/cantk-debug-all.js > build/cantk-ide.js
}

function genReleaseJS() {
	for f in build/cantk-debug*.js
	do
		name=${f/-debug/}
		echo $name"..."
		uglifyjs $f -m > $name
	done
}

function genReleaseJSFast() {
	for f in build/cantk-debug*.js
	do
		name=${f/-debug/}
		echo $name"..."
		cat $f > $name
	done
}

function zipJS() {
	gzip -f --keep build/cantk.js
	gzip -f --keep build/cantk-debug.js
}

function copyJS() {
	cp -fv build/*.js js/.
	cp -fv build/*.gz js/.
}

echo "var gCantkBuildDate = \"$(date)\";console.log(\"cantk build date: \" + gCantkBuildDate);" >version.js

mkdir -p build
genDebugJS
mergeJS
if [ "$1" == "fast" ]
then
	genReleaseJSFast
else 
	genReleaseJS
fi
zipJS
copyJS

