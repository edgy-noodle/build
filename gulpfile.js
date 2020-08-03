`use strict`;
process.on(`unhandledRejection`, e => { throw new Error(e) });

import gulp from "gulp";
import eslint from "gulp-eslint";
import sass from "gulp-sass";
import karma from "karma";
import fs from "fs";
import browserify from "browserify";
import source from "vinyl-source-stream";
import http from "http";
import git from "gulp-git";

const { series, src, dest } = gulp;
const SRC_CONTENT_FILES = `src/content/**/*`;
const SRC_JS_FILES = `src/javascript/**/*.js`;
const SPEC_FILES = `spec/**/*.js`;
const DIST_DIR = `dist/`;

// Default task
const defaultTask = series( checkNode, lintJS, testJS );

const KARMA_WATCH = process.argv.includes(`--watch`);
const KARMA_CONFIG = {
	frameworks: [ `jasmine`, `commonjs` ],
	files: [ SPEC_FILES, SRC_JS_FILES ],
	exclude: [],
	preprocessors: {
		"spec/**/*.js": [ `commonjs` ],
		"src/javascript/**/*.js": [ `commonjs`, `coverage` ],
	},
	reporters: [ `kjhtml`, `progress`, `coverage` ],
	jasmineHtmlReporter: { suppressAll: true },
	port: 9876,
	colors: true,
	autoWatch: KARMA_WATCH ? true : false,
	browsers: [ `Chrome`, `Firefox` ],
	singleRun: !KARMA_WATCH ? true : false,
	concurrency: Infinity
};

function checkNode() {
	return new Promise((resolve, reject) => {
		readFile(`package.json`, (e, file) => {
			if(e) throw new Error(e);
			let pkg = JSON.parse(file);
			let expected = `v${pkg.engines.node}`;
			let actual = process.version;
			if( actual !== expected )
				reject( new Error(`Expected Node version ${expected}, but was ${actual}.`) );
			resolve(console.log(`Node version correct.`));
		});
	});
}
function lintJS() {
	return src([ `gulpfile.js`, SRC_JS_FILES, SPEC_FILES ])
		.pipe(eslint())
		.pipe(eslint.formatEach(`stylish`, process.stderr))
		.pipe(eslint.failAfterError())
		.on(`finish`, () => console.log(`ESLint: JavaScript code correct.`));
}
function testJS() {
	return new Promise((resolve, reject) => {
		let server = new karma.Server(KARMA_CONFIG, e => { if(e) reject(e) });
		server.start();
		if( !KARMA_WATCH )
			server.on(`run_complete`, () => resolve(server.stop(), console.log(`Tests completed successfully.`)));
	});
}

// Run task
function cleanDist() {
	return new Promise(resolve => {
		resolve(rmDir(DIST_DIR), console.log(`Distribution directory removed successfully.`));
	});
}
function buildDist() {
	return new Promise((resolve, reject) => {
		mkDir(DIST_DIR, e => { if(e) reject(e) });
		src([ SRC_CONTENT_FILES, `!${SRC_CONTENT_FILES}.scss` ])
			.pipe(dest(DIST_DIR))
			.on(`finish`, () => resolve(console.log(`Distribution directory built successfully.`)));
	});
}
function buildCSS() {
	return new Promise((resolve, reject) => {
		src(`${SRC_CONTENT_FILES}.scss`)
			.pipe(sass().on(`error`, () => reject(sass.logError)))
      .pipe(dest(DIST_DIR))
      .on(`finish`, () => resolve(console.log(`CSS built successfully.`)));
	});
}
function buildApp() {
	return new Promise(resolve => {
		browserify({ entries: [ `src/javascript/app.js` ] }).bundle()
			.pipe(source(`bundle.js`))
			.pipe(dest(DIST_DIR))
			.on(`finish`, () => resolve(console.log(`Application built successfully.`)));
	});
}

function hostServer() {
	console.log(`Starting a localhost server on port 3000:`);
	let server = http.createServer(async (req, res) => {
		let file = req.url.slice(1);
		if( req.url === `/`)
			Promise.resolve(await serverResponse(res, `index.html`));
		else
			Promise.resolve(await serverResponse(res, file));
	});
	server.listen(3000, `127.0.0.1`);
}
function serverResponse(res, file) {
	return new Promise((resolve, reject) => {
		let type = file.slice( file.indexOf(`.`) + 1 );
		res.writeHead(200, { "Content-Type": type === `js` ?
			`application/javascript` : `text/${type}`});
		readFile(`${DIST_DIR}${file}`, (e, data) => {
			if(e) reject(e);
			resolve(res.end(data));
		});
	}).catch((e) => { if( !e.message.includes(`favicon.ico`) ) console.log(e) });
}

// Git tasks
const GIT_MASTER_BRANCH = `master`;
const GIT_INTEGRATION_BRANCH = `integrate`;
const GIT_MESSAGE =
	process.argv.includes(`-m`) ? process.argv[ process.argv.indexOf(`-m`) + 1 ] : null;
const GIT_DESTINATION_BRANCH =
	GIT_MESSAGE ? GIT_MASTER_BRANCH : GIT_INTEGRATION_BRANCH;

async function commitChanges() {
	if( !(GIT_MESSAGE.includes(`initial`) || GIT_MESSAGE.includes(`Initial`)) )
		await checkCommitRights();
	addFiles(`./`)
		.pipe(git.commit(GIT_MESSAGE)
			.on(`end`, async () => Promise.resolve(await publishChanges(),
				console.log(`Files commited successfully.`)))
		);
}
async function amendChanges() {
	await checkCommitRights();
	addFiles(`./`)
		.pipe(git.commit(null, { args: `--amend`, disableMessageRequirement: true, maxBuffer: Infinity })
			.on(`end`, async () => Promise.resolve(await publishChanges(),
				console.log(`Commit amended successfully.`)))
		);
}
async function integrateBranch() {
	if( await checkBranch() !== GIT_DESTINATION_BRANCH ) {
		if( await switchBranch(GIT_DESTINATION_BRANCH) )
			Promise.all([ buildBranch(GIT_DESTINATION_BRANCH), switchBranch(GIT_DESTINATION_BRANCH) ]);
	}
	await mergeBranch(GIT_MASTER_BRANCH, async e => {
		if(e) Promise.reject(e);
		Promise.all([ publishChanges(), switchBranch(GIT_MASTER_BRANCH) ])
			.then(() => console.log(`Master integrated successfully.`));
	});
}

function checkBranch() {
	return new Promise((resolve, reject) => {
		console.log(`Checking the current branch:`);
		readBranch((e, currentBranch) => {
			if(e) reject(e);
			resolve(currentBranch);
		});
	});
}
function switchBranch(branch) {
	return new Promise(resolve => checkoutBranch(branch, e => resolve(e)));
}
function buildBranch(branch) {
	return new Promise((resolve, reject) => {
		console.log(`Creating the ${branch} branch:`);
		resolve(mkBranch(branch, e => { if(e) reject(e) }));
	});
}
async function checkCommitRights() {
	let currentBranch = await checkBranch();
	if( currentBranch !== GIT_MASTER_BRANCH )
		Promise.reject( new Error(`Expected current branch to be ${GIT_MASTER_BRANCH}, but was ${currentBranch}.`) );
	Promise.resolve();
}
async function publishChanges() {
	let branch = await checkBranch();
	pushBranch(branch, e => {
		if(e) Promise.reject(e);
		Promise.resolve(console.log(`Changes published successfully.`));
	});
}

// FS functions
function rmDir(dir) {
	fs.rmdirSync(dir, { recursive: true });
}
function mkDir(dir, cb) {
	fs.mkdir(dir, (e) => cb(e));
}
function readFile(file, cb) {
	fs.readFile(file, (e, file) => e !== null ? cb(e) : cb(null, file));
}

// Git functions
function addFiles(path) {
	return src(path)
		.pipe(git.add({ quiet: true, maxBuffer: Infinity }));
}
function readBranch(cb) {
	git.revParse({ args: `--abbrev-ref HEAD` }, (e, branch) => e !== null ? cb(e) : cb(null, branch));
}
function checkoutBranch(branch, cb) {
	git.checkout(branch, e => cb(e));
}
function mkBranch(branch, cb) {
	git.branch(branch, e => cb(e));
}
function mergeBranch(branch, cb) {
	git.merge(branch, { args: `--no-ff --log`, maxBuffer: Infinity }, e => cb(e));
}
function pushBranch(branch, cb) {
	git.push(`origin`, branch, { maxBuffer: Infinity }, e => cb(e));
}

export { defaultTask as default };
export { commitChanges as commit };
export { amendChanges as amend };
export const integrate = series( defaultTask, integrateBranch );
export const run = series( cleanDist, buildDist, buildApp, buildCSS, hostServer );