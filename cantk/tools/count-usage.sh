SRC=$1
FILENAMES=$(find $SRC -name \*.jso -exec echo "\""{}"\"" \;)

node count-usage.js $FILENAMES
rm -f temp*.jso
