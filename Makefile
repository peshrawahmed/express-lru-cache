.PHONY: test test-ci-coverage release

_MOCHA=node_modules/.bin/_mocha
ISTANBUL=node_modules/.bin/istanbul
COVERALLS=node_modules/.bin/coveralls

test:
	npm run test-ci

release:
ifeq ($(strip $(version)),)
	@echo "\033[31mERROR:\033[0;39m No version provided."
	@echo "\033[1;30mmake release version=1.0.0\033[0;39m"
else
	rm -rf node_modules
	npm install
	make test
	sed -i.bak 's/"version": "[^"]*"/"version": "$(version)"/' package.json
	rm *.bak
	git add .
	git commit -a -m "Released $(version)."
	git tag v$(version)
	git push origin master
	git push origin --tags
	npm publish
	@echo "\033[32mv${version} released\033[0;39m"
endif
