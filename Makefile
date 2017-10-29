HOMEDIR = $(shell pwd)
USER = bot
SERVER = smidgeo
SSHCMD = ssh $(USER)@$(SERVER)
PROJECTNAME = market-stox
APPDIR = /opt/$(PROJECTNAME)

test:
	node tests/basictests.js
	node tests/generate-stock-symbol-for-name-tests.js

npm-install:
	cd $(HOMEDIR)
	npm install

pushall: sync
	git push origin master

sync:
	rsync -a $(HOMEDIR) $(USER)@$(SERVER):/opt/ --exclude node_modules/ --exclude data/
	$(SSHCMD) "cd  $(APPDIR) && npm install"

template-offsets:
	node tools/get-file-line-offsets.js data/nasdaqtraded.txt > data/nasdaqtraded-offsets.json

run:
	node post-stox-number.js

followback:
	node followback.js
