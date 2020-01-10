all: _src/data/* _src/pages/de/*.md _src/pages/en/*.md _src/templates/* _src/pages/**/*.md _src/pages/*/*/*.md
	node _src/build.js "_src/pages/*.md"
	node _src/build.js "_src/pages/*/*.md"
	node _src/build.js "_src/pages/*/*/*.md"

preview:
	npm run watch & npm run serve

install:
	npm install
