#!/bin/sh

[ ! -f node_modules/.bin/gulp ] && echo "Building NPM modules:" && npm rebuild

node_modules/.bin/gulp $*