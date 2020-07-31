@echo off

if not exist node_modules\.bin\gulp (
	echo Building NPM modules:
	call npm rebuild
	)

call node_modules\.bin\gulp %*