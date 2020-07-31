`use strict`;

beforeAll(function() {
	const VERSION = window.navigator.userAgent;
	const FIREFOX = VERSION.includes(`Firefox/78.0`);
	const EDGE = VERSION.includes(`Edg/85.0.564.8`);
	const CHROME = VERSION.includes(`Chrome/84.0.4147.105`);
	const CHROME_M = VERSION.includes('Chrome/83.0.4103.106 Mobile');

	let message = 
		FIREFOX ? `Correct Firefox version.` :
		EDGE ? `Correct Edge version.` :
		CHROME ? `Correct Chrome version.` :
		CHROME_M ? `Correct Chrome Mobile version.` : null;

	if( message === null )
		throw new Error(`Browser ${VERSION} not on the list.`);
	console.log(message);
});

beforeEach(function() {
	
});

afterEach(function() {
	
});