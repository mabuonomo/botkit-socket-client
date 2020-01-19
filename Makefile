command := docker-compose run -u 1000 --rm node

build-prod:
	make format
	${command} npm run build

watch-dev:
	${command} npm run watch

install:
	${command} npm install

format:
	${command} npm run format
	${command} npm run tslint:fix

test:
	${command} npm run test

#### CI
checker_format:
	${command} npm run format_checker

checker_syntax:
	${command} npm run tslint
#### end CI

### Fixers, deprecated use 'make format'
fix_syntax:
	${command} npm run tslint:fix
