ZH_SOURCE=docs/source/zh
EN_SOURCE=docs/source/en

if [ -e $ZH_SOURCE ]
then
	rm -rf $ZH_SOURCE
	rm -rf docs/zh
fi

mkdir -p $ZH_SOURCE

EN_TITLE="Hola Studio API Documentation" 
EN_FOOTER="<a href=http://studio.holaverse.com>http://studio.holaverse.com</a>"

ZH_TITLE="Hola Studio API 文档" 
ZH_FOOTER="<a href=http://studio.holaverse.cn>http://studio.holaverse.cn</a>"
INPUT="controls/js/ui-*.js game/js/ui-*.js weixin/js/ui-*.js hola/js/hola.js controls/js/animation.js"

function updateSource() {
	for f in $INPUT;
	do
		echo $f
		node tools/extract-docs.js $f $ZH_SOURCE
	done
}

function updateDocsZH() {
	jsduck --pretty-json --title="$ZH_TITLE" --footer="$ZH_FOOTER" --no-source \
	--welcome=docs/wellcome_zh.html --output docs/zh $ZH_SOURCE/*.js
	cat docs/zh/index.html|sed -e "s/Others...//g">docs/zh/index.temp
	mv docs/zh/index.temp docs/zh/index.html
}

function updateDocsEN() {
	jsduck --pretty-json --title="$EN_TITLE" --footer="$EN_FOOTER" --no-source \
	--welcome=docs/wellcome_en.html --output docs/en $EN_SOURCE/*.js
	cat docs/en/index.html|sed -e "s/Others...//g">docs/en/index.temp
	mv docs/en/index.temp docs/en/index.html
}

updateSource

echo "call updateDocsZH..."
updateDocsZH

echo "call updateDocsEN..."
updateDocsEN


