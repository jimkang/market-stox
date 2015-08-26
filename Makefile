HOMEDIR = $(shell pwd)
GITDIR = /var/repos/market-numbers.git
PM2 = $(HOMEDIR)/node_modules/pm2/bin/pm2

test:
	node tests/basictests.js

start: start-market-numbers
	psy start -n market-numbers -- node market-numbers.js

stop:
	psy stop market-numbers || echo "Non-zero return code is OK."

sync-worktree-to-git:
	git --work-tree=$(HOMEDIR) --git-dir=$(GITDIR) checkout -f

npm-install:
	cd $(HOMEDIR)
	npm install
	npm prune

post-receive: sync-worktree-to-git npm-install stop start

pushall:
	git push origin master && git push server master
