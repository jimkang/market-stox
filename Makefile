HOMEDIR = $(shell pwd)
GITDIR = /var/repos/market-stox.git

test:
	node tests/basictests.js
	node tests/generate-stock-symbol-for-name-tests.js

sync-worktree-to-git:
	git --work-tree=$(HOMEDIR) --git-dir=$(GITDIR) checkout -f

npm-install:
	cd $(HOMEDIR)
	npm install
	npm prune

post-receive: sync-worktree-to-git npm-install

pushall:
	git push origin master && git push server master

template-offsets:
	node tools/get-file-line-offsets.js data/nasdaqtraded.txt > data/nasdaqtraded-offsets.json

run:
	node post-stox-number.js

followback:
	node followback.js
