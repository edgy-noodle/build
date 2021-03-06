# AUTOMATED BUILD W/ GULP
-------------------------

## To run the code on your computer:

1. Install [Node.js v14.6.0](https://nodejs.org/en/).
2. Install [Git](https://git-scm.com/).
3. Open CMD/PowerShell (PC) / Terminal (Mac/Unix).
4. Change the directory to the one you want to put the project in: in your command prompt, type `cd <directory>`.
5. Clone the source repository to your computer: `git clone <url> <name>`, where `<url>` is the **GitHub** URL and `<name>` is the name of your choice.
6. Go to the project directory: `cd <name>`.
-------------------------

### Use `gulp` (PC CMD), `.\gulp` (PC PowerShell) or `./gulp.sh` to run the tests. To:
* run the tests and keep them running, add: `--watch`.
* open the build in a browser, add: `run`.
* commit the changes using Git, add: `commit -m "<message>"`, where `<message>` is the message of your choice.
* amend your previous commit, add: `amend`.
* integrate on the CI branch, add: `integrate`.
-------------------------

## To create this automated build:

1. Install [Node.js v14.4.0](https://nodejs.org/en/).
2. Install [Git](https://git-scm.com/).
3. Open CMD (PC) / Terminal (Mac/Unix).
4. Change the directory to the one containing the project. In your command prompt, type: `cd <directory>`, where <directory> is a path to the project.
5. Create the _readme.md_ and _.gitignore_ files, as well as a _src_ directory containing _content_ and _javascript_ directories. Add `.DS_Store` and `/node_modules/**/.bin/` to _.gitignore_, as well as files generated by your IDE / code editor. Create the _index.html_, _main.scss_ and _app.js_ in the _src_ directory.
6. Intialize **Git**: `git --init`, add the files: `git add .` and create the initial commit: `git commit -am "Initial commit"`.
7. Initialize **NPM**: `npm init` and configure the _package.json_, then commit changes:

```json
{
  "name": "name",
  "version": "version",
  "description": "description",
  "author": "author",
  "private": true,
  "engines": {
    "node": "node version"
  }
}
```

8. Install **Gulp** using NPM: `npm install` with `--ignore-scripts --save-dev` flags to ignore binaries and save as a development dependency.
9. Commit changes and perform an `npm rebuild`, check for binaries with `git status`. If binaries present, add to the _.gitignore_, then commit changes.
10. Create the _gulpfile.js_ and import **Gulp** functions, then commit changes:

```javascript
(() => {
  `use strict`;
  process.on(`unhandledRejection`, e => { throw new Error(e) });

  const { series, src, dest } = require(`gulp`);
})();
```

11. Create the _gulp.cmd_ and _gulp.sh_ shell scripts to quickly run gulp with `gulp` (PC) / `./gulp.sh` (Mac/Unix), then commit changes:

```cmd
@echo off

if not exist node_modules\.bin\gulp (
	echo Building NPM modules:
	call npm rebuild
	)

call node_modules\.bin\gulp %*
```

```sh
#!/bin/sh

[ ! -f node_modules/.bin/gulp ] && echo "Building NPM modules:" && npm rebuild

node_modules/.bin/gulp $*
```


12. Create a `checkNode` task to check the running **Node** version, comparing it with the _package.json_, then commit changes.
13. Install **ESLint** and **gulp-eslint** using NPM: `npm install` with `--ignore-scripts --save-dev` flags to ignore binaries and save as a development dependency.
14. Commit changes and perform an `npm rebuild`, check for binaries with `git status`. If binaries present, add to the _.gitignore_, then commit changes.
15. Initialize **ESLint**: `node_modules\.bin\eslint --init` and configure the _.eslint.json_, then commit changes.

```json
{
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "afterAll": false,
        "afterEach": false,
        "beforeAll": false,
        "beforeEach": false,
        "describe": false,
        "expect": false,
        "it": false,
        "xit": false
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        "arrow-spacing": 1,
        "eqeqeq": 2,
        "guard-for-in": 1,
        "no-await-in-loop": 1,
        "no-else-return": 1,
        "no-eval": 2,
        "no-extra-parens": 1,
        "no-implicit-globals": [ "error", { "lexicalBindings": true } ],
        "no-loop-func": 1,
        "no-multi-spaces": 2,
        "no-new": 2,
        "no-new-func": 2,
        "no-new-wrappers": 2,
        "no-param-reassign": 2,
        "no-return-assign": 2,
        "no-script-url": 2,
        "no-self-compare": 2,
        "no-sequences": 2,
        "no-undef-init": 2,
        "no-useless-concat": 2,
        "no-useless-return": 2,
        "no-use-before-define": [ "error", "nofunc" ],
        "no-var": 2,
        "yoda": 1
    }
}
```

16. Import **gulp-eslint** module in the _gulpfile.js_. Create a `SRC_CONTENT_FILES` and `SRC_JS_FILES` constants. Commit the changes.
17. Create a `lintJS` task to lint the _gulpfile.js_, `SRC_CONTENT_FILES` and `SRC_JS_FILES`, then commit changes.
18. Install **Jasmine** using NPM: `npm install` with `--ignore-scripts --save-dev` flags to ignore binaries and save as a development dependency.
19. Commit changes and perform an `npm rebuild`, check for binaries with `git status`. If binaries present, add to the _.gitignore_, then commit changes.
20. Initialize **Jasmine**: `node_modules\.bin\jasmine init` and configure the _.jasmine.json_, then commit changes:

```json
{
  "spec_dir": "spec/",
  "spec_files": [
    "*.spec.js"
  ],
  "helpers": [
    "spec/helpers/**/*.js"
  ],
  "stopSpecOnExpectationFailure": false,
  "random": false
}
```

21. Create the _spec_ directory for the spec files, a _helper_ directory inside for helpers and a `SPEC_FILES` constant in the _gulpfile.js_. Add `SPEC_FILES` to the `lint` task. Create a browser version testing helper file. Commit the changes.
22. Install **Karma**, as well as the plugins - **karma-commonjs**, **karma-jasmine**, **karma-chrome-launcher**, **karma-firefox-launcher** using NPM: `npm install` with `--ignore-scripts --save-dev` flags to ignore binaries and save as a development dependency.
23. Commit changes and perform an `npm rebuild`, check for binaries with `git status`. If binaries present, add to the _.gitignore_, then commit changes.
24. Import **Karma** module in the _gulpfile.js_ and create `KARMA_WATCH` and `KARMA_CONFIG` constants to specify **Karma** configuration. For `autoWatch` and `singleRun` values use `KARMA_WATCH`. For `files` array use `SPEC_FILES` and `SRC_JS_FILES` constants. For preprocessors use `commonjs`. Commit the changes.
25. Create a `testJS` task and commit changes.
26. Create a `defaultTask` constant and the `default` task, then commit changes:

```javascript
const defaultTask = series( version, lint, test )
exports.default = defaultTask;
```

27. Import **File System** module in the _gulpfile.js_ and create a `DIST_DIR` constant linking to the distribution directory, add `dist/` to the _.gitignore_, then commit changes.
28. Create a `cleanDist` task to clean the _dist_ directory and its contents, commit changes.
29. Create a `buildDist` task to create the _dist_ directory and copy the _index.html_ to the _dist_ directory, commit changes.
30. Install **gulp-sass** using NPM: `npm install` with `--ignore-scripts --save-dev` flags to ignore binaries and save as a development dependency.
31. Commit changes and perform an `npm rebuild`, check for binaries with `git status`. If binaries present, add to the _.gitignore_, then commit changes.
32. Import **gulp-sass** module in the _gulpfile.js_ and commit changes.
33. Create a `buildCSS` task to compile the _main.css_ in the _dist_ directory from the _main.scss_ file, then commit changes.
34. Install **Browserify** and **vinyl-source-stream** using NPM: `npm install` with `--ignore-scripts --save-dev` flags to ignore binaries and save as a development dependency.
35. Commit changes and perform an `npm rebuild`, check for binaries with `git status`. If binaries present, add to the _.gitignore_, then commit changes.
36.	Import **Browserify** and **vinyl-source-stream** modules in the _gulpfile.js_, then commit changes.
37. Create a `buildApp` task to build the _bundle.js_ in the _dist_ directory, then commit changes.
38. Import **HTML** module in the _gulpfile.js_ and commit changes.
38. Create a `hostServer` task to start a localhost server in the _dist_ directory and a supporting `serverResponse` function for serving the files, then commit changes.
39. Create a `run` task, then commit changes:

```javascript
exports.run = series( cleanDist, buildDist, buildCSS, buildApp, hostServer );
```

40. Install **gulp-git** using NPM: `npm install` with `--ignore-scripts --save-dev` flags to ignore binaries and save as a development dependency.
41. Commit changes and perform an `npm rebuild`, check for binaries with `git status`. If binaries present, add to the _.gitignore_, then commit changes.
42. Import **gulp-git** module in the _gulpfile.js_ and commit changes.
43. Create `GIT_MASTER_BRANCH` and `GIT_INTEGRATION_BRANCH`, as well as `GIT_MESSAGE` and `GIT_AMEND` constants. Create a `GIT_DESTINATION_BRANCH` variable based on the `GIT_MESSAGE`, then commit changes.
44. Create `commitChanges` and `integrateBranch` tasks, add `checkBranch`, `switchBranch` and `buildBranch` supporting functions, then commit changes.
45. Create a `commit` task, then commit changes:

```javascript
exports.commit = commitChanges;
```

46. Create a `integrate` task, then commit changes:

```javascript
exports.integrate = series( defaultTask, integrateBranch );
```

47. Refactor the code and then commit changes.
48. Enjoy your automated build!